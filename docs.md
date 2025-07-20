 # Smart Contract Analyzer Documentation
 
 ## Overview
 
 The Smart Contract Analyzer is a comprehensive web-based security analysis tool that provides automated smart contract auditing and honeypot detection capabilities. Built with Next.js, it integrates multiple security analysis tools to help users identify potential vulnerabilities and malicious patterns in smart contracts across various blockchain networks.
 
 ## Key Features
 
 ### 1. Smart Contract Security Analysis
 - **Static Analysis**: Uses Slither to perform comprehensive static analysis of smart contracts
 - **Vulnerability Detection**: Identifies common security issues and coding best practices violations
 - **Impact Classification**: Categorizes findings by severity (High, Medium, Low, Informational)
 - **Detailed Reporting**: Provides in-depth analysis with affected code elements and remediation guidance
 
 ### 2. Honeypot Detection
 - **Multi-pair Analysis**: Analyzes trading pairs across decentralized exchanges
 - **Transaction Simulation**: Simulates buy/sell transactions to detect hidden fees or restrictions
 - **Holder Analysis**: Examines token holder behavior patterns
 - **Risk Scoring**: Provides risk assessments based on multiple factors
 
 ### 3. Multi-Chain Support
 - **Base Network**: Primary support for Base chain
 - **Extensible Architecture**: Designed to support additional EVM-compatible chains
 - **Chain Configuration**: JSON-based configuration for easy chain additions
 
 ## Technical Architecture
 
 ### Frontend Stack
 - **Next.js 15.3.5**: React framework with server-side rendering
 - **Tailwind CSS**: Utility-first CSS framework for styling
 - **Framer Motion**: Animation library for smooth UI transitions
 - **Lucide React**: Icon library for consistent visual elements
 
 ### Backend Components
 - **API Routes**: Next.js serverless functions for backend operations
 - **Python Integration**: Custom Python scripts for honeypot analysis
 - **Caching System**: File-based caching for improved performance
 - **External APIs**: Integration with honeypot.is API for honeypot detection
 
 ### Analysis Tools
 - **Slither**: Static analysis framework for Solidity smart contracts
 - **Honeypot.is API**: Third-party service for honeypot detection
 - **Etherscan Integration**: Contract source code retrieval via API
 
 ## Project Structure
 
 ```
 smart-contract-analyzer/
 ├── src/
 │   ├── app/
 │   │   ├── api/                 # API routes
 │   │   │   ├── audit/          # Smart contract analysis
 │   │   │   ├── honeypot/       # Honeypot detection
 │   │   │   └── token/          # Token information
 │   │   ├── audit/              # Main audit interface
 │   │   └── _components/        # Landing page components
 │   ├── components/             # Reusable UI components
 │   └── lib/                    # Utility functions and configurations
 ├── python/                     # Python scripts for honeypot analysis
 ├── results/                    # Analysis results storage
 ├── uploads/                    # Contract source code storage
 └── crytic-export/              # Slither analysis artifacts
 ```
 
 ## Core Components
 
 ### 1. Smart Contract Analysis (`/api/audit/route.js`)
 - **Purpose**: Orchestrates smart contract security analysis
 - **Process**:
   1. Downloads contract source code via Etherscan API
   2. Runs Slither static analysis
   3. Parses and formats results
   4. Caches results for future requests
 - **Output**: JSON-formatted security findings with detailed descriptions
 
 ### 2. Honeypot Detection System
 - **API Endpoint**: `/api/honeypot/is_hone_pot/route.js`
 - **Python Script**: `python/is_honey_pot.py`
 - **Features**:
   - Transaction simulation for buy/sell operations
   - Hidden fee detection
   - Gas usage analysis
   - Holder behavior monitoring
 
 ### 3. Trading Pair Analysis
 - **API Endpoint**: `/api/honeypot/getpairs/route.js`
 - **Python Script**: `python/get_pairs_api.py`
 - **Functionality**:
   - Retrieves trading pairs for tokens
   - Analyzes liquidity and reserves
   - Provides pair creation information
 
 ## Security Analysis Features
 
 ### Vulnerability Categories
 1. **High Impact**: Critical security vulnerabilities
 2. **Medium Impact**: Moderate security concerns
 3. **Low Impact**: Minor issues and improvements
 4. **Informational**: Best practice recommendations
 
 ### Analysis Capabilities
 - **Reentrancy Detection**: Identifies potential reentrancy vulnerabilities
 - **Access Control**: Checks for proper authorization mechanisms
 - **Arithmetic Issues**: Detects overflow/underflow vulnerabilities
 - **External Call Analysis**: Examines interactions with external contracts
 - **State Variable Analysis**: Reviews state variable usage patterns
 
 ## Honeypot Detection Features
 
 ### Risk Assessment
 - **Transaction Simulation**: Tests buy/sell operations
 - **Tax Analysis**: Detects hidden buy/sell taxes
 - **Gas Analysis**: Monitors unusual gas consumption patterns
 - **Holder Verification**: Checks if holders can successfully sell tokens
 
 ### Data Points Analyzed
 - **Buy/Sell Taxes**: Percentage fees on transactions
 - **Gas Usage**: Transaction gas requirements
 - **Holder Count**: Total number of token holders
 - **Liquidity Analysis**: Trading pair liquidity levels
 - **Contract Verification**: Smart contract verification status
 
 ## Usage Instructions
 
 ### Running the Application
 
 1. **Installation**:
    ```bash
    npm install
    # or
    yarn install
    ```
 
 2. **Development Server**:
    ```bash
    npm run dev
    # or
    yarn dev
    ```
 
 3. **Production Build**:
    ```bash
    npm run build
    npm start
    ```
 
 ### Environment Setup
 - **Python Dependencies**: Install Python 3.x and required packages
 - **API Keys**: Configure Etherscan API key for contract analysis
 - **Network Configuration**: Update `chains.json` for additional networks
 
 ### Using the Analyzer
 
 1. **Smart Contract Analysis**:
    - Navigate to the audit page
    - Enter contract address
    - Select blockchain network
    - View detailed security analysis
 
 2. **Honeypot Detection**:
    - Access honeypot analysis tab
    - Review trading pair information
    - Analyze risk factors
    - Check transaction simulation results
 
 ## API Endpoints
 
 ### Smart Contract Analysis
 - **GET /api/audit?tokenAddress={address}&chain={chain}**
   - Returns comprehensive security analysis
   - Parameters: contract address, blockchain name
   - Response: JSON with vulnerability findings
 
 ### Honeypot Detection
 - **GET /api/honeypot/is_honey_pot?tokenAddress={address}&pair={pair}&chain={chain}**
   - Analyzes specific trading pair for honeypot characteristics
   - Returns transaction simulation results
 
 - **GET /api/honeypot/getpairs?tokenAddress={address}&chain={chain}**
   - Retrieves all trading pairs for a token
   - Provides liquidity and trading information
 
 ### Token Information
 - **GET /api/token?tokenAddress={address}&chain={chain}**
   - Returns basic token information
   - Includes metadata and contract details
 
 ## Configuration
 
 ### Chain Configuration (`lib/chains.json`)
 ```json
 {
   "chains": [
     {
       "name": "base",
       "id": 8453,
       "rpc": "https://mainnet.base.org",
       "explorer": "https://basescan.org"
     }
   ]
 }
 ```
 
 ### Environment Variables
 - **PYTHON_COMMAND**: Path to Python executable (default: python3)
 - **ETHERSCAN_API_KEY**: API key for contract source retrieval
 - **CACHE_DURATION**: Cache expiration time in milliseconds
 
 ## Security Considerations
 
 ### Data Privacy
 - No sensitive user data is stored
 - Analysis results are cached locally
 - API keys are environment variables
 
 ### Rate Limiting
 - Cached responses to prevent API abuse
 - Rate limiting on external API calls
 - Configurable cache expiration
 
 ### Input Validation
 - Address format validation
 - Chain name verification
 - Parameter sanitization
 
 ## Performance Optimization
 
 ### Caching Strategy
 - **File-based caching**: Results stored in JSON files
 - **Cache invalidation**: Configurable expiration times
 - **Memory optimization**: Lazy loading of analysis results
 
 ### Scalability Features
 - **Serverless functions**: Next.js API routes
 - **Background processing**: Asynchronous analysis
 - **Result streaming**: Progressive result loading
 
 ## Troubleshooting
 
 ### Common Issues
 1. **Python Script Errors**: Ensure Python 3.x is installed with required packages
 2. **API Rate Limits**: Check API key configuration and rate limits
 3. **Network Issues**: Verify blockchain network connectivity
 4. **Cache Problems**: Clear cache directory if needed
 
 ### Debug Mode
 - Enable detailed logging in development
 - Check console for error messages
 - Review log files in results directory
 
 ## Future Enhancements
 
 ### Planned Features
 - **Multi-language support**: Additional blockchain networks
 - **Advanced analysis**: Machine learning-based vulnerability detection
 - **Real-time monitoring**: Continuous contract monitoring
 - **Integration APIs**: RESTful API for external integrations
 - **Mobile responsiveness**: Enhanced mobile experience
 
 ### Technical Improvements
 - **Database integration**: Persistent storage for analysis results
 - **Queue system**: Background job processing
 - **Real-time updates**: WebSocket integration
 - **Advanced caching**: Redis integration for better performance
 
 ## Contributing
 
 ### Development Guidelines
 - Follow Next.js best practices
 - Maintain consistent code style
 - Add comprehensive error handling
 - Include unit tests for new features
 - Update documentation for API changes
 
 ### Code Structure
 - Use functional components with hooks
 - Implement proper error boundaries
 - Follow React best practices
 - Maintain separation of concerns
 - Document complex algorithms
 
 This documentation provides a comprehensive overview of the Smart Contract Analyzer project, covering its architecture, features, usage, and technical details for developers and users.