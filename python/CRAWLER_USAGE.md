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

### 3. Custom Output Subfolder and Limits
```bash
python crawler.py https://swcregistry.io/ https://swcregistry.io/docs/ \
  --output swc \
  --max-pages 50 \
  --max-depth 2 \
  --delay 0.5
```

This will create files in: `../crawl_result/swc/swcregistry_io/`

## Command Line Options

- `base_url`: The starting URL to crawl from
- `filter_pattern`: Only URLs starting with this pattern will be crawled
- `--output, -o`: Subfolder name within the base folder (default: default)
- `--max-pages`: Maximum number of pages to crawl (default: 100)
- `--max-depth`: Maximum crawling depth (default: 3)
- `--delay`: Delay between requests in seconds (default: 1)

**Note**: The final folder structure is `BASE_FOLDER/output/website_name/`. For example:
- Default: `../crawl_result/default/swcregistry_io/`
- Custom: `../crawl_result/swc/swcregistry_io/` (with `--output swc`)

## Configuration Constants

You can modify these constants in the script for global defaults:

```python
BASE_FOLDER = "../crawl_result"      # Base directory for all crawled content
OUTPUT_FOLDER = "default"            # Default subfolder name within base folder
MAX_DEPTH = 3                        # Maximum crawling depth
DELAY_BETWEEN_REQUESTS = 1           # Delay in seconds between requests
MAX_PAGES = 100                      # Maximum number of pages to crawl
TIMEOUT = 30                         # Request timeout in seconds
```

## Output Structure

The crawler creates a hierarchical directory structure:

```
project-root/
├── crawl_result/                    # BASE_FOLDER
│   ├── default/                     # Default OUTPUT_FOLDER
│   │   ├── swcregistry_io/         # Website-specific folder
│   │   │   ├── SWC-100.md
│   │   │   ├── SWC-101.md
│   │   │   ├── _website_info.json
│   │   │   └── _crawl_summary.json
│   │   └── web3_okx_com/           # Another website
│   │       ├── api-overview.md
│   │       └── ...
│   ├── swc/                        # Custom output folder (--output swc)
│   │   └── swcregistry_io/         # Same website, different category
│   │       ├── SWC-100.md
│   │       └── ...
│   └── dex-docs/                   # Another custom folder (--output dex-docs)
│       └── web3_okx_com/
│           ├── endpoints.md
│           └── ...
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
