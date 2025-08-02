# Web Crawler Usage Guide

## Basic Usage

The web crawler accepts command line arguments for flexible configuration:

```bash
python crawler.py <base_url> <filter_pattern> [options]
```

## Examples

### 1. Crawl SWC Registry Documentation
```bash
python crawler.py https://swcregistry.io/ https://swcregistry.io/docs/
```

### 2. Crawl OKX Web3 DEX API Documentation
```bash
python crawler.py https://web3.okx.com/ https://web3.okx.com/build/dev-docs/dex-api/
```

### 3. Custom Output Folder and Limits
```bash
python crawler.py https://swcregistry.io/ https://swcregistry.io/docs/ \
  --output my_docs \
  --max-pages 50 \
  --max-depth 2 \
  --delay 0.5
```

## Command Line Options

- `base_url`: The starting URL to crawl from
- `filter_pattern`: Only URLs starting with this pattern will be crawled
- `--output, -o`: Base output folder for markdown files (default: ../crawl_result)
- `--max-pages`: Maximum number of pages to crawl (default: 100)
- `--max-depth`: Maximum crawling depth (default: 3)
- `--delay`: Delay between requests in seconds (default: 1)

**Note**: Website-specific folders are automatically created inside the output directory. For example, crawling `https://swcregistry.io/` will create files in `crawl_result/swcregistry_io/`.

## Configuration Constants

You can modify these constants in the script for global defaults:

```python
OUTPUT_FOLDER = "../crawl_result"    # Default output directory (at project root)
MAX_DEPTH = 3                        # Maximum crawling depth
DELAY_BETWEEN_REQUESTS = 1           # Delay in seconds between requests
MAX_PAGES = 100                      # Maximum number of pages to crawl
TIMEOUT = 30                         # Request timeout in seconds
```

## Output Structure

The crawler creates a well-organized directory structure:

```
project-root/
├── crawl_result/
│   ├── swcregistry_io/
│   │   ├── SWC-100.md
│   │   ├── SWC-101.md
│   │   ├── _website_info.json
│   │   └── _crawl_summary.json
│   ├── web3_okx_com/
│   │   ├── api-overview.md
│   │   ├── endpoints.md
│   │   ├── _website_info.json
│   │   └── _crawl_summary.json
│   └── example_com/
│       ├── docs.md
│       ├── _website_info.json
│       └── _crawl_summary.json
└── python/
    └── crawler.py
```

Each website gets its own folder with:
- Individual markdown files for each crawled page
- `_website_info.json`: Metadata about the crawled site
- `_crawl_summary.json`: Crawling session statistics

## Features

- **URL Filtering**: Only crawls URLs matching the specified pattern
- **Duplicate Prevention**: Removes URL fragments to avoid duplicate content
- **Rate Limiting**: Configurable delay between requests
- **Error Handling**: Graceful handling of network errors and timeouts
- **Progress Tracking**: Real-time progress updates
- **Markdown Conversion**: Converts HTML to clean, readable markdown
- **Configurable Output**: Customizable output directory
