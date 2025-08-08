# Smart Contract Analyzer

A Next.js and Python application for analyzing smart contracts with Slither and other security tools.

## Features

- Smart contract security analysis using Slither
- Contract crawling and vectorization
- Honey pot detection
- Token information retrieval
- Interactive contract IDE
- API integrations with Etherscan, OKX, and Chutes

## Prerequisites

- Node.js (v18+ recommended)
- Python 3.10+
- Yarn package manager
- Slither analyzer

## Installation

1. Clone the repository:
```bash
git clone git@github.com:santara-security/smart-contract-analyzer.git
cd smart-contract-analyzer
```

2. Install Python dependencies:
```bash
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
pip install -r python/requirements.txt
python3 -m pip install slither-analyzer
```

3. Install Node.js dependencies:
```bash
yarn install
```

4. Configure environment:
```bash
cp env.example .env
```
Edit the `.env` file with your API keys and configuration.

5. Set up database:
```bash
npx prisma migrate dev
```

## Usage

### Running the development server
```bash
yarn dev
```

### Analyzing a contract with Slither
```bash
slither base:0xB600CE2781e5018B922CA471C19562799cb96EAD --etherscan-apikey YOUR_API_KEY --json ./uploads/file.json
```

### Running Python crawlers
```bash
python python/crawler.py
```

## Project Structure

- `src/app/` - Next.js application
- `python/` - Python scripts and tools
- `prisma/` - Database schema and migrations
- `public/` - Static assets
- `santara_plugin/` - Custom Slither detectors

## API Endpoints

Key API routes include:
- `/api/audit` - Contract analysis
- `/api/chutes` - Chutes API integration
- `/api/honeypot` - Honey pot detection
- `/api/okx` - OKX exchange integration

## License

CC0 1.0 Universal - See [LICENSE](LICENSE) file for details.
