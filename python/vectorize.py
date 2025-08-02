#!/usr/bin/env python3
"""
Vector Indexer for AI RAG (Retrieval-Augmented Generation)
Processes crawled markdown files and creates vector embeddings stored in SQLite.
"""

import os
import sqlite3
import json
import argparse
import sys
from pathlib import Path
from datetime import datetime
import hashlib
import re

# For text processing and embeddings
import numpy as np
from sentence_transformers import SentenceTransformer
import nltk
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.corpus import stopwords

# Constants
VECTOR_DB_NAME = "crawl_vectors.db"
EMBEDDING_MODEL = "all-MiniLM-L6-v2"  # Lightweight but effective sentence transformer
CHUNK_SIZE = 512  # Maximum characters per chunk
CHUNK_OVERLAP = 50  # Character overlap between chunks
MIN_CHUNK_SIZE = 100  # Minimum characters to create a chunk

class VectorIndexer:
    def __init__(self, crawl_folder, vector_db_path=None):
        """
        Initialize the vector indexer.
        
        Args:
            crawl_folder (str): Path to the crawled content folder
            vector_db_path (str): Path to SQLite database file
        """
        self.crawl_folder = Path(crawl_folder)
        self.vector_db_path = vector_db_path or os.path.join(os.path.dirname(crawl_folder), VECTOR_DB_NAME)
        
        # Initialize embedding model
        print("Loading embedding model...")
        self.model = SentenceTransformer(EMBEDDING_MODEL)
        self.embedding_dim = self.model.get_sentence_embedding_dimension()
        print(f"✓ Model loaded. Embedding dimension: {self.embedding_dim}")
        
        # Download required NLTK data
        self._setup_nltk()
        
        # Initialize database
        self._init_database()
    
    def _setup_nltk(self):
        """Download required NLTK data."""
        try:
            nltk.data.find('tokenizers/punkt')
            nltk.data.find('corpora/stopwords')
        except LookupError:
            print("Downloading required NLTK data...")
            nltk.download('punkt', quiet=True)
            nltk.download('stopwords', quiet=True)
            print("✓ NLTK data downloaded")
    
    def _init_database(self):
        """Initialize SQLite database with vector storage."""
        print(f"Initializing vector database: {self.vector_db_path}")
        
        conn = sqlite3.connect(self.vector_db_path)
        cursor = conn.cursor()
        
        # Create main documents table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS documents (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                file_path TEXT UNIQUE NOT NULL,
                title TEXT,
                url TEXT,
                content_hash TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                metadata TEXT  -- JSON string for additional metadata
            )
        ''')
        
        # Create chunks table for text segments
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS chunks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                document_id INTEGER NOT NULL,
                chunk_index INTEGER NOT NULL,
                content TEXT NOT NULL,
                content_hash TEXT,
                token_count INTEGER,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (document_id) REFERENCES documents (id) ON DELETE CASCADE
            )
        ''')
        
        # Create embeddings table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS embeddings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                chunk_id INTEGER NOT NULL,
                embedding BLOB NOT NULL,  -- Serialized numpy array
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (chunk_id) REFERENCES chunks (id) ON DELETE CASCADE
            )
        ''')
        
        # Create indexes for faster queries
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_documents_hash ON documents (content_hash)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_chunks_document ON chunks (document_id)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_chunks_hash ON chunks (content_hash)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_embeddings_chunk ON embeddings (chunk_id)')
        
        conn.commit()
        conn.close()
        print("✓ Database initialized")
    
    def _extract_metadata_from_markdown(self, content):
        """Extract metadata from markdown content."""
        metadata = {}
        lines = content.split('\n')
        
        # Extract title (first heading)
        for line in lines:
            if line.strip().startswith('# '):
                metadata['title'] = line.strip()[2:].strip()
                break
        
        # Extract URL from markdown
        url_match = re.search(r'\*\*Source URL:\*\* (.+)', content)
        if url_match:
            metadata['url'] = url_match.group(1).strip()
        
        # Extract crawl date
        date_match = re.search(r'\*\*Crawled on:\*\* (.+)', content)
        if date_match:
            metadata['crawled_on'] = date_match.group(1).strip()
        
        return metadata
    
    def _clean_markdown_content(self, content):
        """Clean markdown content for better embedding quality."""
        # Remove markdown headers from content
        lines = content.split('\n')
        cleaned_lines = []
        skip_metadata = False
        
        for line in lines:
            # Skip metadata section
            if line.strip() == '---':
                skip_metadata = not skip_metadata
                continue
            if skip_metadata:
                continue
            
            # Remove markdown formatting but keep content
            line = re.sub(r'^#+\s*', '', line)  # Remove heading markers
            line = re.sub(r'\*\*(.+?)\*\*', r'\1', line)  # Remove bold
            line = re.sub(r'\*(.+?)\*', r'\1', line)  # Remove italic
            line = re.sub(r'`(.+?)`', r'\1', line)  # Remove inline code
            line = re.sub(r'^\s*[-*+]\s*', '', line)  # Remove list markers
            line = re.sub(r'^\s*\d+\.\s*', '', line)  # Remove numbered list markers
            
            if line.strip():
                cleaned_lines.append(line.strip())
        
        return '\n'.join(cleaned_lines)
    
    def _create_chunks(self, content):
        """Split content into overlapping chunks for better retrieval."""
        # Clean content
        cleaned_content = self._clean_markdown_content(content)
        
        # Split into sentences
        sentences = sent_tokenize(cleaned_content)
        
        chunks = []
        current_chunk = ""
        
        for sentence in sentences:
            # Check if adding this sentence would exceed chunk size
            potential_chunk = current_chunk + " " + sentence if current_chunk else sentence
            
            if len(potential_chunk) <= CHUNK_SIZE:
                current_chunk = potential_chunk
            else:
                # Save current chunk if it's long enough
                if len(current_chunk) >= MIN_CHUNK_SIZE:
                    chunks.append(current_chunk.strip())
                
                # Start new chunk with overlap
                if len(current_chunk) > CHUNK_OVERLAP:
                    # Take last part of current chunk as overlap
                    overlap_text = current_chunk[-CHUNK_OVERLAP:]
                    current_chunk = overlap_text + " " + sentence
                else:
                    current_chunk = sentence
        
        # Add final chunk
        if len(current_chunk) >= MIN_CHUNK_SIZE:
            chunks.append(current_chunk.strip())
        
        return chunks
    
    def _calculate_content_hash(self, content):
        """Calculate SHA-256 hash of content for change detection."""
        return hashlib.sha256(content.encode('utf-8')).hexdigest()
    
    def _serialize_embedding(self, embedding):
        """Serialize numpy array to bytes for storage."""
        return embedding.astype(np.float32).tobytes()
    
    def _deserialize_embedding(self, blob):
        """Deserialize bytes back to numpy array."""
        return np.frombuffer(blob, dtype=np.float32)
    
    def process_file(self, file_path):
        """Process a single markdown file and create embeddings."""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            if not content.strip():
                print(f"Skipping empty file: {file_path}")
                return False
            
            # Extract metadata
            metadata = self._extract_metadata_from_markdown(content)
            content_hash = self._calculate_content_hash(content)
            
            conn = sqlite3.connect(self.vector_db_path)
            cursor = conn.cursor()
            
            # Check if file already processed and unchanged
            cursor.execute(
                'SELECT id, content_hash FROM documents WHERE file_path = ?',
                (str(file_path),)
            )
            existing = cursor.fetchone()
            
            if existing and existing[1] == content_hash:
                print(f"File unchanged, skipping: {file_path.name}")
                conn.close()
                return False
            
            # Insert or update document
            if existing:
                doc_id = existing[0]
                cursor.execute('''
                    UPDATE documents 
                    SET title = ?, url = ?, content_hash = ?, updated_at = CURRENT_TIMESTAMP, metadata = ?
                    WHERE id = ?
                ''', (metadata.get('title'), metadata.get('url'), content_hash, 
                      json.dumps(metadata), doc_id))
                
                # Delete existing chunks and embeddings
                cursor.execute('DELETE FROM chunks WHERE document_id = ?', (doc_id,))
            else:
                cursor.execute('''
                    INSERT INTO documents (file_path, title, url, content_hash, metadata)
                    VALUES (?, ?, ?, ?, ?)
                ''', (str(file_path), metadata.get('title'), metadata.get('url'), 
                      content_hash, json.dumps(metadata)))
                doc_id = cursor.lastrowid
            
            # Create chunks
            chunks = self._create_chunks(content)
            print(f"Processing {file_path.name}: {len(chunks)} chunks")
            
            # Process each chunk
            for i, chunk_content in enumerate(chunks):
                chunk_hash = self._calculate_content_hash(chunk_content)
                token_count = len(word_tokenize(chunk_content))
                
                # Insert chunk
                cursor.execute('''
                    INSERT INTO chunks (document_id, chunk_index, content, content_hash, token_count)
                    VALUES (?, ?, ?, ?, ?)
                ''', (doc_id, i, chunk_content, chunk_hash, token_count))
                chunk_id = cursor.lastrowid
                
                # Generate embedding
                embedding = self.model.encode(chunk_content)
                embedding_blob = self._serialize_embedding(embedding)
                
                # Insert embedding
                cursor.execute('''
                    INSERT INTO embeddings (chunk_id, embedding)
                    VALUES (?, ?)
                ''', (chunk_id, embedding_blob))
            
            conn.commit()
            conn.close()
            print(f"✓ Processed: {file_path.name}")
            return True
            
        except Exception as e:
            print(f"✗ Error processing {file_path}: {e}")
            return False
    
    def process_folder(self):
        """Process all markdown files in the crawl folder."""
        if not self.crawl_folder.exists():
            print(f"Error: Crawl folder does not exist: {self.crawl_folder}")
            return
        
        # Find all markdown files
        md_files = list(self.crawl_folder.rglob("*.md"))
        
        if not md_files:
            print(f"No markdown files found in: {self.crawl_folder}")
            return
        
        print(f"Found {len(md_files)} markdown files")
        print("-" * 60)
        
        processed_count = 0
        for file_path in md_files:
            # Skip certain files
            if file_path.name.startswith('_'):
                continue
                
            if self.process_file(file_path):
                processed_count += 1
        
        print("-" * 60)
        print(f"Processing completed: {processed_count} files processed")
        self._print_database_stats()
    
    def _print_database_stats(self):
        """Print database statistics."""
        conn = sqlite3.connect(self.vector_db_path)
        cursor = conn.cursor()
        
        cursor.execute('SELECT COUNT(*) FROM documents')
        doc_count = cursor.fetchone()[0]
        
        cursor.execute('SELECT COUNT(*) FROM chunks')
        chunk_count = cursor.fetchone()[0]
        
        cursor.execute('SELECT COUNT(*) FROM embeddings')
        embedding_count = cursor.fetchone()[0]
        
        cursor.execute('SELECT AVG(token_count) FROM chunks')
        avg_tokens = cursor.fetchone()[0] or 0
        
        conn.close()
        
        print(f"\nDatabase Statistics:")
        print(f"Documents: {doc_count}")
        print(f"Chunks: {chunk_count}")
        print(f"Embeddings: {embedding_count}")
        print(f"Average tokens per chunk: {avg_tokens:.1f}")
        print(f"Database file: {self.vector_db_path}")
    
    def search_similar(self, query, top_k=5):
        """Search for similar content using vector similarity."""
        # Generate query embedding
        query_embedding = self.model.encode(query)
        
        conn = sqlite3.connect(self.vector_db_path)
        cursor = conn.cursor()
        
        # Get all embeddings with metadata
        cursor.execute('''
            SELECT e.embedding, c.content, d.title, d.url, d.file_path, c.id
            FROM embeddings e
            JOIN chunks c ON e.chunk_id = c.id
            JOIN documents d ON c.document_id = d.id
        ''')
        
        results = []
        for row in cursor.fetchall():
            embedding_blob, content, title, url, file_path, chunk_id = row
            chunk_embedding = self._deserialize_embedding(embedding_blob)
            
            # Calculate cosine similarity
            similarity = np.dot(query_embedding, chunk_embedding) / (
                np.linalg.norm(query_embedding) * np.linalg.norm(chunk_embedding)
            )
            
            results.append({
                'similarity': float(similarity),
                'content': content,
                'title': title,
                'url': url,
                'file_path': file_path,
                'chunk_id': chunk_id
            })
        
        conn.close()
        
        # Sort by similarity and return top_k
        results.sort(key=lambda x: x['similarity'], reverse=True)
        return results[:top_k]


def main():
    """Main function to run the vector indexer."""
    parser = argparse.ArgumentParser(
        description='Create vector embeddings for AI RAG from crawled markdown files.',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python vectorize.py ../crawl_result/swc
  python vectorize.py ../crawl_result/default --db custom_vectors.db
  python vectorize.py ../crawl_result/swc --search "smart contract vulnerability"
        """
    )
    
    parser.add_argument(
        'crawl_folder',
        help='Path to the crawled content folder'
    )
    
    parser.add_argument(
        '--db',
        default=None,
        help='Path to SQLite database file (default: auto-generated based on folder)'
    )
    
    parser.add_argument(
        '--search',
        help='Search query to test vector similarity (optional)'
    )
    
    parser.add_argument(
        '--top-k',
        type=int,
        default=5,
        help='Number of top results to return for search (default: 5)'
    )
    
    args = parser.parse_args()
    
    try:
        # Initialize vectorizer
        vectorizer = VectorIndexer(args.crawl_folder, args.db)
        
        if args.search:
            # Perform search
            print(f"Searching for: '{args.search}'")
            print("-" * 60)
            
            results = vectorizer.search_similar(args.search, args.top_k)
            
            if not results:
                print("No results found. Make sure to process files first.")
            else:
                for i, result in enumerate(results, 1):
                    print(f"\n{i}. Similarity: {result['similarity']:.4f}")
                    print(f"   Title: {result['title'] or 'No title'}")
                    print(f"   File: {Path(result['file_path']).name}")
                    print(f"   Content preview: {result['content'][:200]}...")
                    if result['url']:
                        print(f"   URL: {result['url']}")
                    print(f"   File Path: {result['file_path']}")
        else:
            # Process files
            vectorizer.process_folder()
        
    except KeyboardInterrupt:
        print("\n\nOperation interrupted by user.")
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
