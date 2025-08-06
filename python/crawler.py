#!/usr/bin/env python3
"""
Web Crawler with URL filtering and Markdown export functionality.
Crawls websites and saves content to markdown files with configurable URL filters.
"""

import requests
import os
import re
import time
import argparse
import sys
from urllib.parse import urljoin, urlparse, unquote
from bs4 import BeautifulSoup
from datetime import datetime
import json

# Constants - easily configurable
BASE_FOLDER = "../crawl_result"  # Base directory for all crawled content
OUTPUT_FOLDER = "default"  # Default subfolder name within base folder
MAX_DEPTH = 3  # Maximum crawling depth
DELAY_BETWEEN_REQUESTS = 1  # Delay in seconds between requests
MAX_PAGES = 100  # Maximum number of pages to crawl
TIMEOUT = 30  # Request timeout in seconds

class WebCrawler:
    def __init__(self, base_url, url_filter_pattern, output_folder=OUTPUT_FOLDER):
        """
        Initialize the web crawler.
        
        Args:
            base_url (str): The starting URL to crawl from
            url_filter_pattern (str): Pattern to filter URLs (only URLs starting with this will be crawled)
            output_folder (str): Subfolder name within BASE_FOLDER
        """
        self.base_url = base_url
        self.url_filter_pattern = url_filter_pattern
        
        # Create folder structure: BASE_FOLDER/output_folder (no website subfolder)
        self.output_folder = os.path.join(BASE_FOLDER, output_folder)
        
        self.visited_urls = set()
        self.to_visit = []
        self.session = requests.Session()
        
        # Set up session headers to mimic a real browser
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
        })
        
        # Create output directory
        self.create_output_directory()
        
        # Create website info file
        self.create_website_info()
        
    def create_output_directory(self):
        """Create the output directory if it doesn't exist."""
        if not os.path.exists(self.output_folder):
            os.makedirs(self.output_folder)
            parsed_url = urlparse(self.base_url)
            website_name = parsed_url.netloc.replace('www.', '')
            print(f"Created website-specific directory: {self.output_folder}")
            print(f"Organizing content for: {website_name}")
        else:
            print(f"Using existing directory: {self.output_folder}")
    
    def create_website_info(self):
        """Create a website info file with metadata about the crawled site."""
        parsed_url = urlparse(self.base_url)
        website_info = {
            "website_name": parsed_url.netloc.replace('www.', ''),
            "base_url": self.base_url,
            "filter_pattern": self.url_filter_pattern,
            "crawl_started": datetime.now().isoformat(),
            "output_folder": self.output_folder
        }
        
        info_file = os.path.join(self.output_folder, "_website_info.json")
        try:
            with open(info_file, 'w', encoding='utf-8') as f:
                json.dump(website_info, f, indent=2, ensure_ascii=False)
            print(f"- Website info saved: _website_info.json")
        except Exception as e:
            print(f"- Error saving website info: {e}")
    
    def is_valid_url(self, url):
        """
        Check if URL matches the filter pattern and is valid.
        
        Args:
            url (str): URL to validate
            
        Returns:
            bool: True if URL is valid and matches filter pattern
        """
        if not url or url in self.visited_urls:
            return False
        
        # Remove fragment (anchor) from URL to avoid duplicates
        parsed = urlparse(url)
        clean_url = f"{parsed.scheme}://{parsed.netloc}{parsed.path}"
        if parsed.query:
            clean_url += f"?{parsed.query}"
        
        # Check if the clean URL was already visited
        if clean_url in self.visited_urls and clean_url != url:
            return False
            
        # Check if URL starts with the filter pattern
        if not clean_url.startswith(self.url_filter_pattern):
            return False
            
        # Additional validation
        if not parsed.scheme or not parsed.netloc:
            return False
            
        # Skip certain file types
        skip_extensions = ['.pdf', '.jpg', '.jpeg', '.png', '.gif', '.css', '.js', '.ico', '.svg']
        if any(clean_url.lower().endswith(ext) for ext in skip_extensions):
            return False
            
        return True
    
    def extract_links(self, soup, current_url):
        """
        Extract all valid links from the current page.
        
        Args:
            soup (BeautifulSoup): Parsed HTML content
            current_url (str): Current page URL for resolving relative links
            
        Returns:
            list: List of valid URLs to crawl
        """
        links = []
        
        for link in soup.find_all('a', href=True):
            href = link['href']
            absolute_url = urljoin(current_url, href)
            
            # Remove fragment (anchor) from URL to avoid duplicates
            parsed = urlparse(absolute_url)
            clean_url = f"{parsed.scheme}://{parsed.netloc}{parsed.path}"
            if parsed.query:
                clean_url += f"?{parsed.query}"
            
            if self.is_valid_url(clean_url):
                links.append(clean_url)
                
        return list(set(links))  # Remove duplicates
    
    def html_to_markdown(self, soup, url):
        """
        Convert HTML content to Markdown format.
        
        Args:
            soup (BeautifulSoup): Parsed HTML content
            url (str): Source URL
            
        Returns:
            str: Markdown formatted content
        """
        # Extract title
        title = "Untitled"
        if soup.title:
            title = soup.title.get_text().strip()
        elif soup.find('h1'):
            title = soup.find('h1').get_text().strip()
        
        # Remove script and style elements
        for script in soup(["script", "style", "nav", "footer", "header"]):
            script.decompose()
        
        # Start building markdown content
        markdown_content = f"# {title}\n\n"
        markdown_content += f"**Source URL:** {url}\n"
        markdown_content += f"**Crawled on:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n"
        markdown_content += "---\n\n"
        
        # Extract main content
        main_content = soup.find('main') or soup.find('article') or soup.find('div', class_=re.compile('content|main')) or soup.body
        
        if main_content:
            # Process headings
            for i, heading in enumerate(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']):
                for tag in main_content.find_all(heading):
                    level = '#' * (i + 1)
                    tag.replace_with(f"\n{level} {tag.get_text().strip()}\n\n")
            
            # Process paragraphs
            for p in main_content.find_all('p'):
                text = p.get_text().strip()
                if text:
                    p.replace_with(f"{text}\n\n")
            
            # Process lists
            for ul in main_content.find_all(['ul', 'ol']):
                list_items = []
                for li in ul.find_all('li'):
                    item_text = li.get_text().strip()
                    if item_text:
                        prefix = "- " if ul.name == 'ul' else "1. "
                        list_items.append(f"{prefix}{item_text}")
                
                if list_items:
                    ul.replace_with("\n" + "\n".join(list_items) + "\n\n")
            
            # Process code blocks
            for code in main_content.find_all('code'):
                code_text = code.get_text()
                if code.parent.name == 'pre':
                    code.parent.replace_with(f"\n```\n{code_text}\n```\n\n")
                else:
                    code.replace_with(f"`{code_text}`")
            
            # Process blockquotes
            for blockquote in main_content.find_all('blockquote'):
                quote_text = blockquote.get_text().strip()
                if quote_text:
                    blockquote.replace_with(f"\n> {quote_text}\n\n")
            
            # Get the remaining text
            content_text = main_content.get_text()
            
            # Clean up the text
            content_text = re.sub(r'\n\s*\n\s*\n', '\n\n', content_text)  # Remove excessive newlines
            content_text = re.sub(r'[ \t]+', ' ', content_text)  # Normalize spaces
            
            markdown_content += content_text.strip()
        
        return markdown_content
    
    def save_to_markdown(self, content, url):
        """
        Save content to a markdown file.
        
        Args:
            content (str): Markdown content to save
            url (str): Source URL for generating filename
        """
        # Generate filename from URL
        parsed_url = urlparse(url)
        path_parts = parsed_url.path.strip('/').split('/')
        
        if path_parts and path_parts[-1]:
            filename = path_parts[-1]
        else:
            filename = parsed_url.netloc.replace('.', '_')
        
        # Clean filename
        filename = re.sub(r'[^\w\-_.]', '_', filename)
        if not filename.endswith('.md'):
            filename += '.md'
        
        # Use the filename directly (will replace if exists)
        filepath = os.path.join(self.output_folder, filename)
        
        # Save file (will overwrite if exists)
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f" Saved: {filename}")
            return filepath
        except Exception as e:
            print(f" Error saving {filename}: {e}")
            return None
    
    def crawl_page(self, url):
        """
        Crawl a single page and extract content and links.
        
        Args:
            url (str): URL to crawl
            
        Returns:
            list: List of new URLs found on this page
        """
        try:
            # Remove fragment from URL for crawling but keep original for display
            parsed = urlparse(url)
            clean_url = f"{parsed.scheme}://{parsed.netloc}{parsed.path}"
            if parsed.query:
                clean_url += f"?{parsed.query}"
            
            print(f"Crawling: {clean_url}")
            response = self.session.get(clean_url, timeout=TIMEOUT)
            response.raise_for_status()
            
            # Parse HTML
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Convert to markdown and save
            markdown_content = self.html_to_markdown(soup, clean_url)
            self.save_to_markdown(markdown_content, clean_url)
            
            # Extract links for further crawling
            new_links = self.extract_links(soup, clean_url)
            
            return new_links
            
        except requests.RequestException as e:
            print(f"✗ Error crawling {url}: {e}")
            return []
        except Exception as e:
            print(f"✗ Unexpected error crawling {url}: {e}")
            return []
    
    def crawl(self, max_pages=MAX_PAGES, max_depth=MAX_DEPTH):
        """
        Start the crawling process.
        
        Args:
            max_pages (int): Maximum number of pages to crawl
            max_depth (int): Maximum depth to crawl
        """
        print(f"Starting crawler...")
        print(f"Base URL: {self.base_url}")
        print(f"Filter pattern: {self.url_filter_pattern}")
        print(f"Output folder: {self.output_folder}")
        print(f"Max pages: {max_pages}")
        print(f"Max depth: {max_depth}")
        print("-" * 60)
        
        # Initialize with base URL
        self.to_visit = [(self.base_url, 0)]  # (url, depth)
        pages_crawled = 0
        
        while self.to_visit and pages_crawled < max_pages:
            current_url, depth = self.to_visit.pop(0)
            
            # Clean URL for comparison
            parsed = urlparse(current_url)
            clean_url = f"{parsed.scheme}://{parsed.netloc}{parsed.path}"
            if parsed.query:
                clean_url += f"?{parsed.query}"
            
            if clean_url in self.visited_urls or depth > max_depth:
                continue
            
            self.visited_urls.add(clean_url)
            
            # Crawl the page
            new_links = self.crawl_page(clean_url)
            pages_crawled += 1
            
            # Add new links to the queue (if within depth limit)
            if depth < max_depth:
                for link in new_links:
                    if link not in self.visited_urls and (link, depth + 1) not in self.to_visit:
                        self.to_visit.append((link, depth + 1))
            
            # Rate limiting
            time.sleep(DELAY_BETWEEN_REQUESTS)
            
            print(f"Progress: {pages_crawled}/{max_pages} pages, {len(self.to_visit)} in queue")
        
        # Save crawl summary
        self.save_crawl_summary(pages_crawled)
        
        print("-" * 60)
        print(f"Crawling completed!")
        print(f"Pages crawled: {pages_crawled}")
        print(f"Files saved to: {self.output_folder}")
    
    def save_crawl_summary(self, pages_crawled):
        """Save a summary of the crawling session."""
        summary = {
            "crawl_date": datetime.now().isoformat(),
            "base_url": self.base_url,
            "filter_pattern": self.url_filter_pattern,
            "pages_crawled": pages_crawled,
            "visited_urls": list(self.visited_urls),
            "output_folder": self.output_folder
        }
        
        summary_file = os.path.join(self.output_folder, "_crawl_summary.json")
        try:
            with open(summary_file, 'w', encoding='utf-8') as f:
                json.dump(summary, f, indent=2, ensure_ascii=False)
            print(f"- Crawl summary saved: _crawl_summary.json")
        except Exception as e:
            print(f"- Error saving crawl summary: {e}")


def parse_arguments():
    """Parse command line arguments."""
    parser = argparse.ArgumentParser(
        description='Web Crawler with URL filtering and Markdown export functionality.',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python crawler.py https://swcregistry.io/ https://swcregistry.io/docs/
  python crawler.py https://web3.okx.com/ https://web3.okx.com/build/dev-docs/dex-api/ --output custom_docs
  python crawler.py https://example.com/ https://example.com/docs/ --max-pages 50 --max-depth 2
        """
    )
    
    parser.add_argument(
        'base_url',
        help='The starting URL to crawl from'
    )
    
    parser.add_argument(
        'filter_pattern',
        help='URL pattern to filter (only URLs starting with this will be crawled)'
    )
    
    parser.add_argument(
        '--output', '-o',
        default=OUTPUT_FOLDER,
        help=f'Subfolder name within {BASE_FOLDER} (default: {OUTPUT_FOLDER}). Final structure: {BASE_FOLDER}/[output]/'
    )
    
    parser.add_argument(
        '--max-pages',
        type=int,
        default=MAX_PAGES,
        help=f'Maximum number of pages to crawl (default: {MAX_PAGES})'
    )
    
    parser.add_argument(
        '--max-depth',
        type=int,
        default=MAX_DEPTH,
        help=f'Maximum crawling depth (default: {MAX_DEPTH})'
    )
    
    parser.add_argument(
        '--delay',
        type=float,
        default=DELAY_BETWEEN_REQUESTS,
        help=f'Delay between requests in seconds (default: {DELAY_BETWEEN_REQUESTS})'
    )
    
    return parser.parse_args()


def main():
    """Main function to run the crawler."""
    args = parse_arguments()
    
    parsed_url = urlparse(args.base_url)
    website_name = parsed_url.netloc.replace('www.', '')
    final_output_folder = os.path.join(BASE_FOLDER, args.output)
    
    print("Web Crawler Starting...")
    print(f"Base URL: {args.base_url}")
    print(f"Filter pattern: {args.filter_pattern}")
    print(f"Website: {website_name}")
    print(f"Base folder: {BASE_FOLDER}")
    print(f"Output subfolder: {args.output}")
    print(f"Final output folder: {final_output_folder}")
    print(f"Max pages: {args.max_pages}")
    print(f"Max depth: {args.max_depth}")
    print(f"Delay between requests: {args.delay}s")
    print("=" * 60)
    
    # Validate URLs
    try:
        parsed_base = urlparse(args.base_url)
        parsed_filter = urlparse(args.filter_pattern)
        
        if not parsed_base.scheme or not parsed_base.netloc:
            print("Error: Invalid base URL format")
            sys.exit(1)
            
        if not parsed_filter.scheme or not parsed_filter.netloc:
            print("Error: Invalid filter pattern URL format")
            sys.exit(1)
            
        if not args.filter_pattern.startswith(args.base_url.rstrip('/')):
            print("Warning: Filter pattern should typically start with the base URL")
            
    except Exception as e:
        print(f"Error validating URLs: {e}")
        sys.exit(1)
    
    # Initialize and start crawler
    crawler = WebCrawler(args.base_url, args.filter_pattern, args.output)
    
    # Update delay if specified
    global DELAY_BETWEEN_REQUESTS
    DELAY_BETWEEN_REQUESTS = args.delay
    
    # Start crawling
    try:
        crawler.crawl(max_pages=args.max_pages, max_depth=args.max_depth)
    except KeyboardInterrupt:
        print("\n\nCrawling interrupted by user.")
        print(f"Partial results saved to: {crawler.output_folder}")
    except Exception as e:
        print(f"\nError during crawling: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
