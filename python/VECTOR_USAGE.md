# Vector Indexing System for AI RAG

This system processes crawled markdown files and creates vector embeddings stored in SQLite for AI-powered retrieval.

## Quick Start

### 1. Process Crawled Content
```bash
# Process all markdown files in a folder
python vectorize.py ../crawl_result/default

# Process with custom database location
python vectorize.py ../crawl_result/swc --db my_vectors.db
```

### 2. Search Similar Content
```bash
# Search for specific topics
python vectorize.py ../crawl_result/default --search "smart contract vulnerability"

# Get more results
python vectorize.py ../crawl_result/default --search "reentrancy attack" --top-k 5
```

## Features

- **Vector Embeddings**: Uses `all-MiniLM-L6-v2` model for 384-dimensional embeddings
- **Chunk Processing**: Splits documents into overlapping chunks for better retrieval
- **SQLite Storage**: Persistent storage with full-text search capabilities
- **Metadata Extraction**: Automatically extracts titles, URLs, and other metadata
- **Change Detection**: Only re-processes changed files

## Database Schema

The system creates three main tables:

### Documents Table
- `id`: Primary key
- `file_path`: Path to source markdown file
- `title`: Document title (extracted from markdown)
- `url`: Source URL (if available)
- `content_hash`: SHA-256 hash for change detection
- `metadata`: JSON string with additional info

### Chunks Table
- `id`: Primary key
- `document_id`: Foreign key to documents
- `chunk_index`: Position in document
- `content`: Text content of chunk
- `token_count`: Number of tokens in chunk

### Embeddings Table
- `id`: Primary key
- `chunk_id`: Foreign key to chunks
- `embedding`: 384-dimensional vector as BLOB

## Usage Examples

### Basic Processing
```bash
# Process SWC registry content
python vectorize.py ../crawl_result/default

# Process OKX documentation
python vectorize.py ../crawl_result/okx
```

### Advanced Search
```bash
# Find content about specific vulnerabilities
python vectorize.py ../crawl_result/default --search "integer overflow"

# Find security best practices
python vectorize.py ../crawl_result/default --search "secure coding patterns"

# Find gas optimization tips
python vectorize.py ../crawl_result/default --search "gas optimization"
```

## Integration with AI Systems

The vector database can be used by AI systems for:
- **Retrieval-Augmented Generation (RAG)**: Provide context-aware responses
- **Semantic Search**: Find relevant content beyond keyword matching
- **Similarity Analysis**: Compare documents and find related content
- **Knowledge Base Building**: Create searchable repositories of technical content

## File Structure

```
crawl_result/
├── default/
│   ├── *.md                    # Crawled markdown files
│   └── crawl_vectors.db       # Vector database
├── swc/
│   ├── *.md                   # SWC registry content
│   └── crawl_vectors.db       # Separate vector database
└── okx/
    ├── *.md                   # OKX documentation
    └── crawl_vectors.db       # Separate vector database
```

## Troubleshooting

### NLTK Data Issues
If you see NLTK resource errors:
```bash
python -c "import nltk; nltk.download('punkt_tab'); nltk.download('stopwords')"
```

### Model Download Issues
The system will automatically download the sentence transformer model on first use. This requires internet connection.

### Database Location
By default, the database is created in the same folder as the crawled content. Use `--db` flag to specify custom location.

## Performance Notes

- **Processing Speed**: ~1-2 seconds per document
- **Database Size**: ~1-2KB per chunk (including embedding)
- **Memory Usage**: ~500MB for model loading
- **Search Speed**: ~100ms for similarity search across 1000+ chunks
