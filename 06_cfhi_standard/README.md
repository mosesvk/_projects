# CFHI Standard - Quickbase Application

A Quickbase-powered web application for Christian Financial Health Initiative (CFHI) Standard reporting, featuring dynamic charts, data visualization, and automated benchmarking.

## 📋 Overview

This project provides a comprehensive financial reporting system built on Quickbase. It includes:
- Dynamic chart generation and display using ApexCharts
- Automated benchmark calculations and comparisons
- Excel and PDF export capabilities
- Responsive UI with modern styling (Tailwind CSS)
- Automated deployment to Quickbase code pages

## 🏗️ Project Structure

```
06_cfhi_standard/
├── src/                          # Source files for development
│   ├── _comp/                    # Reference implementation (DO NOT MODIFY)
│   │   └── comp*.js/html         # Working reference files from comp project
│   ├── Index.html                # Main application entry point
│   ├── Api.js                    # Quickbase API wrapper
│   ├── components/               # React-like components
│   │   ├── Header.js            # Application header
│   │   └── Report.js            # Report generation component
│   ├── content/                  # Content management
│   │   ├── CreateCharts.js      # Chart creation logic
│   │   ├── DisplayCharts.js     # Chart display logic
│   │   └── uiManagement.js      # UI state management
│   └── functions/                # Utility functions
│       ├── PrintBase64.js       # Base64 encoding for printing
│       ├── PrintExcel.js        # Excel export functionality
│       ├── Utility.js           # General utilities
│       └── WeightedAverages.js  # Statistical calculations
├── docs/                         # Documentation
│   ├── architecture/            # Architecture documentation
│   └── todos/                   # Task tracking
├── qb-deploy.js                 # Automated deployment script
├── package.json                 # Node.js dependencies
└── .env                         # Environment variables (not in repo)
```

### Important Notes about `_comp/` Folder

⚠️ **The `_comp/` folder contains reference files ONLY:**
- These files are from the fully working `05_cfhi_comp` project
- **DO NOT modify files in `_comp/`**
- Use them as reference when implementing features in `src/`
- When debugging, check `_comp/` for the working implementation

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Quickbase account with appropriate permissions
- Quickbase User Token
- Quickbase App Token

### Installation

1. **Clone the repository**
```bash
cd /Users/moseskaumatule/Documents/capinCrouse/_projects/06_cfhi_standard
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file in the root directory:

```env
# Quickbase Configuration
QUICKBASE_REALM=capincrouse.quickbase.com
QUICKBASE_USER_TOKEN=your_user_token_here
QUICKBASE_APP_TOKEN=your_app_token_here
QUICKBASE_APP_ID=your_app_id_here
```

**How to get these values:**
- **QUICKBASE_USER_TOKEN**: Go to Quickbase Account Settings > My Preferences > User Token
- **QUICKBASE_APP_TOKEN**: Found in your application's code pages or app settings
- **QUICKBASE_APP_ID**: Found in your Quickbase application URL (e.g., `https://capincrouse.quickbase.com/db/bqr3h8abc`)

## 🔧 Development

### File Watching & Auto-Deploy

The project includes an automated deployment system that watches for file changes and deploys them to Quickbase:

```bash
npm start
# or
npm run dev
```

This will:
1. Start the file watcher
2. Monitor files in `src/` directory
3. Automatically deploy changes to Quickbase when you save
4. Display deployment status in the console

**Page Mapping:**
- `Index.html` → Page 152 (cfhi_standard.html)
- `Utility.js` → Page 153 (cfhi_standard_utility.js)
- `Api.js` → Page 154 (cfhi_standard_api.js)
- `WeightedAverages.js` → Page 155 (cfhi_standard_weightedAverage.js)
- `Header.js` → Page 156 (cfhi_standard_header.js)
- `DisplayCharts.js` → Page 157 (cfhi_standard_chartDisplay.js)
- `CreateCharts.js` → Page 158 (cfhi_standard_chartCreate.js)
- `uiManagement.js` → Page 159 (cfhi_standard_uiManagement.js)
- `Report.js` → Page 160 (cfhi_standard_report.js)

### Manual Deployment

To manually deploy a single file:

```bash
node qb-deploy.js
```

Then modify any watched file to trigger the upload.

## 🧪 Testing

### Browser Testing

1. **Start the deployment watcher** (if not already running):
```bash
npm start
```

2. **Navigate to your Quickbase application**:
```
https://capincrouse.quickbase.com/db/[YOUR_APP_ID]
```

3. **Test key features**:
   - Chart rendering and data display
   - Benchmark calculations
   - Excel export functionality
   - PDF export functionality
   - UI interactions and state management

### Local Testing

For testing JavaScript logic locally without Quickbase:

1. Create test files in a `test/` directory (not included by default)
2. Use a testing framework like Jest:
```bash
npm install --save-dev jest
npm test
```

## 📦 Dependencies

- **apexcharts** (^5.3.2) - Chart visualization library
- **axios** (^1.6.0) - HTTP client for API calls
- **chokidar** (^3.5.3) - File watching for auto-deployment
- **dotenv** (^17.2.1) - Environment variable management
- **xml2js** (^0.6.2) - XML parsing for Quickbase API

## 🎨 Code Style & Standards

This project follows specific coding standards:

- Use ES6+ features (arrow functions, const/let, etc.)
- JSDoc comments for all functions
- Declarative code over imperative
- All Quickbase API calls use the `quickbase-js-api` library pattern
- Include loading states and error handlers for all API calls

### Example Function Structure

```javascript
/**
 * Fetches client data from Quickbase
 * @param {string} clientId - The client record ID
 * @returns {Promise<Object>} Client data object
 */
const fetchClientData = async (clientId) => {
  try {
    // Implementation
  } catch (error) {
    console.error('Error fetching client data:', error);
    throw error;
  }
};
```

## 📚 Documentation

- `/docs/architecture/` - System architecture documentation
- `/docs/architecture/quickbase/` - Quickbase field mappings and page IDs
- `/docs/todos/` - Task tracking and project management

## 🐛 Troubleshooting

### Common Issues

**1. Deployment fails with authentication error**
- Verify your `.env` file contains correct tokens
- Check that your User Token hasn't expired
- Ensure App Token is valid for the target application

**2. File changes not deploying**
- Check that the file watcher is running (`npm start`)
- Verify the file path matches the watched patterns in `qb-deploy.js`
- Check console output for error messages

**3. Charts not rendering**
- Check browser console for JavaScript errors
- Verify ApexCharts library is loaded
- Ensure data format matches chart expectations
- Reference `_comp/compCreatecharts.js` for working implementation

**4. Mixed content errors**
- The deployment script automatically converts HTTP to HTTPS
- If errors persist, check for hardcoded HTTP URLs in your code

## 🤝 Contributing

1. Check the `_comp/` folder for reference implementations before creating new features
2. Follow the established code style and standards
3. Include JSDoc comments for all new functions
4. Test thoroughly in Quickbase before committing
5. Update documentation when adding new features

## 📄 License

MIT License

## 👥 Support

For questions or issues, contact the CapinCrouse development team.

---

**Project Status:** In Development  
**Last Updated:** October 30, 2025

