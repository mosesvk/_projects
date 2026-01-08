# CFHI Comprehensive Dashboard

## Project Overview

The CFHI (Church Financial Health Indicator) Comprehensive Dashboard is a client-facing financial analysis application built for Capin Crouse, an accounting firm specializing in church and nonprofit financial services. The dashboard provides real-time financial health analysis by comparing client church financial data against peer benchmarks.

## Purpose

This dashboard enables accounting professionals and their church clients to:

- **Visualize Financial Metrics**: Display key financial ratios and indicators through interactive charts
- **Compare Against Peers**: Benchmark client performance against similar organizations
- **Track Historical Trends**: Analyze financial health across multiple fiscal years
- **Generate Reports**: Create comprehensive financial health reports for client presentations

## Target Users

- **Accountants**: Primary users who analyze and present financial data to clients
- **Church Leadership**: Secondary users who view dashboard data and reports for decision-making

## Architecture

### Frontend-Only Application

This is a **pure frontend solution** with no backend dependencies:

- All data processing happens client-side
- Data is fetched directly from Quickbase via XML API
- Processed data is cached in `localStorage` for performance
- All external libraries are loaded from CDN

### Technology Stack

| Category | Technology |
|----------|------------|
| Styling | Tailwind CSS, Flowbite |
| Charting | ApexCharts.js |
| UI Framework | Alpine.js |
| DOM Manipulation | jQuery |
| Tooltips | Tippy.js |
| Modals | Tingle |
| Data Source | Quickbase XML API |

## Core Modules

| Module | Path | Purpose |
|--------|------|---------|
| API Layer | `src/Api.js` | Quickbase integration, data fetching, and processing |
| Charts | `src/content/CreateCharts.js` | Chart configuration and benchmark mappings |
| Display | `src/content/DisplayCharts.js` | Chart rendering and component display |
| Report | `src/components/Report.js` | Report table generation and data presentation |
| UI Management | `src/content/uiManagement.js` | Sidebar, theme, and navigation handling |
| Utilities | `src/functions/Utility.js` | Shared helper functions |
| Weighted Averages | `src/functions/WeightedAverages.js` | Statistical calculations |
| Print Excel | `src/functions/PrintExcel.js` | Excel export functionality |
| Print Base64 | `src/functions/printBase64.js` | PDF/image export functionality |

## Data Categories

The dashboard organizes financial data into six main categories:

1. **Demographics** (`demoData`): Giving units, FTE counts, facility info
2. **Cash** (`cashData`): Liquidity ratios, operating cash, expendable assets
3. **Debt** (`debtData`): Debt ratios, coverage, service metrics
4. **Income** (`incomeData`): Net income ratios, contribution metrics
5. **Expense** (`expenseData`): Personnel costs, benefits, cash expenditures
6. **Additional** (`additionalData`): Supplementary financial metrics

## Getting Started

### Prerequisites

- Modern web browser with JavaScript enabled
- Quickbase account with appropriate permissions
- Valid Quickbase API credentials

### Development Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file with Quickbase credentials:
   ```env
   QUICKBASE_REALM=yourcompany.quickbase.com
   QUICKBASE_USER_TOKEN=your-user-token
   QUICKBASE_APP_TOKEN=your-app-token
   QUICKBASE_APP_ID=your-app-id
   ```

4. Start the auto-deploy script:
   ```bash
   npm start
   ```

## Documentation

Detailed documentation is available in the `docs/` folder:

- **[Data Flow](docs/Architecture/DataFlow.md)**: How data flows from Quickbase through the application
- **[ApexCharts](docs/Architecture/ApexCharts.md)**: Chart system implementation and configuration
- **[Report Tab](docs/Architecture/ReportTab.md)**: Report generation and display logic
- **[Troubleshooting](docs/Troubleshooting/troubleshooting.md)**: Common issues and solutions

## Deployment

The application uses a custom auto-deploy script (`qb-deploy.js`) that:

- Watches local files for changes
- Automatically uploads modified files to Quickbase
- Uses the `API_AddReplaceDBPage` endpoint
- Supports debounced uploads to prevent rapid deployments

## Key Features

### Dynamic Filtering

- Year range selection (multi-year analysis)
- Client selection with search
- Region and site filtering
- Giving units range slider

### Interactive Charts

- Bar charts with line overlays for peer comparisons
- Benchmark annotations (industry standards)
- Dark/light theme support
- Responsive design

### Report Generation

- Comprehensive tabular reports
- Color-coded benchmark indicators (Good/Warning/Action)
- Export to Excel and PDF formats
- Modal dialogs with detailed explanations

## License

Proprietary - Capin Crouse

## Reference Files

The `src/intl/` folder contains reference implementations from the International project variant. These files are for comparison purposes only and should not be modified or imported into the main project.
