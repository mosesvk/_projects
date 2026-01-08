# Data Flow Architecture

This document explains how data flows through the CFHI Comprehensive Dashboard, from the Quickbase API to the final rendered charts and reports.

## Overview

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Quickbase     │────▶│   ApiService    │────▶│   DataStore     │────▶│   localStorage  │
│   XML API       │     │   (Api.js)      │     │   (Api.js)      │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘     └─────────────────┘
                                                        │
                                                        ▼
                              ┌─────────────────────────────────────────────┐
                              │               UI Components                  │
                              │  (Charts, Reports, Tables)                   │
                              └─────────────────────────────────────────────┘
```

## Quickbase API Integration

### Data Sources

The application connects to two Quickbase tables:

| Table | Variable | Purpose |
|-------|----------|---------|
| Client Data | `clientData` (br8rqi6bk) | Individual church financial records |
| Peer Data | `peerData` (br8szmntp) | Comparative peer group data |

These table IDs are configured in `Index.html`:

```javascript
const clientData = "br8rqi6bk";
const peerData = "br8szmntp";
```

### Authentication

Authentication uses Quickbase's app token system:

```javascript
var apptoken = "bpat4pgu9t69yby5gbemdbej52j";
$.ajaxSetup({ data: { apptoken: apptoken } });
```

The app token is included with every AJAX request to authenticate API calls.

### Query Structure

Queries are built dynamically based on user selections:

```javascript
// Example query for peer data
const queryCondition = `{195.EX.${currentYear}} AND (${clientConditions})${additionalFilters}`;

const apiCallPeerData = {
  act: "API_DoQuery",
  query: queryCondition,
  clist: "195.123.122.135...", // Field IDs to retrieve
};
```

**Key Query Components:**

| Component | Description | Example |
|-----------|-------------|---------|
| `act` | API action | `API_DoQuery` |
| `query` | Filter conditions | `{195.EX.2023}` (Year = 2023) |
| `clist` | Column list (field IDs) | `195.123.122...` |

### Field ID Conventions

Quickbase uses numeric field IDs. Common patterns in this project:

| Field ID Pattern | Purpose |
|------------------|---------|
| `195` | Formatted year field |
| `301` | Merged client name |
| `267` | Region filter |
| `268` | Site filter |
| `193` | Report type (Comprehensive) |

### API Call Methods

#### `getRecordsForPeer(years)`

Fetches peer comparison data for selected years:

```javascript
async getRecordsForPeer(years, dataStr = "<qdbapi>") {
  for (const currentYear of years) {
    // Build query with year filter
    const queryCondition = `{195.EX.${currentYear}}${clientQuery}${additionalFilters}`;
    
    // Execute API call
    const response = await $.get(peerData, {
      act: "API_DoQuery",
      query: queryCondition,
      clist: clist,
    });
  }
}
```

#### `getRecordsForClient(years)`

Fetches data for the specific client being analyzed:

```javascript
async getRecordsForClient(years) {
  // Uses ClientRid from URL parameter
  const queryCondition = `{3.EX.${ClientRid}}`;
  
  // Filters by comprehensive report type
  const peerQueryCondition = `{193.EX.'Comprehensive'}`;
}
```

#### `getRecordsForPeerWithBatching(years, selectedClientsSet)`

Handles large client selections (>15 clients) by batching API calls:

```javascript
async getRecordsForPeerWithBatching(years, selectedClientsSet) {
  const BATCH_SIZE = 80;
  const CONCURRENCY_LIMIT = 5;
  
  // Split clients into batches
  for (let i = 0; i < escapedClients.length; i += BATCH_SIZE) {
    clientBatches.push(escapedClients.slice(i, i + BATCH_SIZE));
  }
  
  // Execute with controlled concurrency
  for (let i = 0; i < apiCalls.length; i += CONCURRENCY_LIMIT) {
    const batchResults = await Promise.allSettled(batch);
    // Small delay between batches
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
}
```

## Client vs Peer Data

### Client Data

Client data represents the **specific organization being analyzed**:

- Retrieved using `ClientRid` URL parameter
- Contains actual values for all financial metrics
- Includes benchmark ratings (Good/Warning/Action)
- Stored with `_Client` suffix (e.g., `givingUnits_Client`)

**Data Structure:**
```javascript
{
  "givingUnits_Client": {
    "2023": { "value": "1500", "benchmark": "Good" },
    "2022": { "value": "1400", "benchmark": "Good" }
  }
}
```

### Peer Data

Peer data represents the **comparison group**:

- Retrieved based on filter selections (region, site, giving unit range)
- Contains aggregated values from multiple organizations
- Used for calculating averages, medians, percentiles
- Stored with `_Peer` suffix (e.g., `givingUnits_Peer`)

**Data Structure:**
```javascript
{
  "givingUnits_Peer": {
    "2023": [1200, 1500, 1800, 2100, 2400], // Array of all peer values
    "total": [1200, 1500, 1800, ...]        // Combined across years
  }
}
```

### Yes/No Fields

The API uses "Yes/No" fields to determine which records should be included in peer calculations:

```javascript
// Only include if the corresponding yes/no field is "Yes"
this.dataStore.insertData(
  "cash",
  "peer",
  year,
  "daysExpendableNetAssets_Peer",
  record,
  "cfhi_compre_01_ratio___days_of_expendable_net_asset_reserves",  // Value field
  "cfhi_compre_01_yes_no___days_of_expendable_net_asset_reserves"  // Yes/No filter field
);
```

This ensures that only valid, complete records are included in peer calculations.

## Data Classes

### DataStore Class

Central repository for all processed data:

```javascript
class DataStore {
  constructor() {
    this.demoData = {};
    this.cashData = {};
    this.debtData = {};
    this.incomeData = {};
    this.expenseData = {};
    this.additionalData = {};
  }
}
```

**Key Methods:**

| Method | Purpose |
|--------|---------|
| `insertData()` | Add data to appropriate category |
| `insertClientData()` | Store client-specific values |
| `insertPeerData()` | Store peer values for aggregation |
| `saveAllToLocalStorage()` | Persist data for UI access |
| `loadFromLocalStorage()` | Retrieve cached data |
| `checkStorageQuota()` | Monitor localStorage usage |

### DataProcessor Class

Handles data transformation and category-specific processing:

```javascript
class DataProcessor {
  constructor(dataStore) {
    this.dataStore = dataStore;
  }
  
  processAllData(years, recordsPeer, recordsClient) {
    this.processDemoData(years, recordsPeer, recordsClient);
    this.processCashData(years, recordsPeer, recordsClient);
    this.processDebtData(years, recordsPeer, recordsClient);
    this.processIncomeData(years, recordsPeer, recordsClient);
    this.processExpenseData(years, recordsPeer, recordsClient);
    this.processAdditionalData(years, recordsPeer, recordsClient);
    
    this.dataStore.saveAllToLocalStorage();
  }
}
```

**Processing Pattern:**

```javascript
processDemoData(years, recordsPeer, recordsClient) {
  years.forEach((year) => {
    // Filter records by year
    const filteredPeerRecords = this.filterRecordsByYear(recordsPeer, year);
    const filteredClientRecords = this.filterRecordsByYear(recordsClient, year);
    
    // Process peer records
    filteredPeerRecords.forEach((record) => {
      this.dataStore.insertData(
        "demo",           // Category
        "peer",           // Type (peer/client)
        year,             // Fiscal year
        "givingUnits_Peer", // Data key
        record,           // XML record element
        "s02___giving_units", // Value field selector
        "cfhi_compre_00a_yes_no___giving_units" // Yes/No filter field
      );
    });
    
    // Process client records
    filteredClientRecords.forEach((record) => {
      this.dataStore.insertData(
        "demo",
        "client",
        year,
        "givingUnits_Client",
        record,
        "s02___giving_units"
      );
    });
  });
}
```

### ApiService Class

Manages filter state and API interactions:

```javascript
class ApiService {
  constructor() {
    this.recordClientHTMLArray = [];
    this.recordPeerHTMLArray = [];
  }
  
  // Initialize filter dropdowns
  async getRecordsForUniqueClientPeerNames() { ... }
  
  // Build filter queries
  getClientQuery(selectedClientsSet) { ... }
  
  // Execute API calls
  async getRecordsForPeer(years) { ... }
  async getRecordsForClient(years) { ... }
}
```

### AppController Class

Orchestrates the entire data flow:

```javascript
class AppController {
  constructor() {
    this.dataStore = new DataStore();
    this.dataProcessor = new DataProcessor(this.dataStore);
    this.apiService = new ApiService();
  }
  
  async handleRunButtonClick() {
    // 1. Get selected years
    const selectedYears = this.processSelectedYears();
    
    // 2. Fetch peer data
    const recordsPeer = await this.apiService.getRecordsForPeer(selectedYears);
    
    // 3. Fetch client data
    const recordsClient = await this.apiService.getRecordsForClient(selectedYears);
    
    // 4. Process data
    this.dataProcessor.processAllData(selectedYears, recordsPeer, recordsClient);
    
    // 5. Display charts
    await this.displayAllComponents();
  }
}
```

## localStorage Structure

Data is stored in localStorage by category:

```javascript
localStorage.setItem("demoData", JSON.stringify(this.demoData));
localStorage.setItem("cashData", JSON.stringify(this.cashData));
localStorage.setItem("debtData", JSON.stringify(this.debtData));
localStorage.setItem("incomeData", JSON.stringify(this.incomeData));
localStorage.setItem("expenseData", JSON.stringify(this.expenseData));
localStorage.setItem("additionalData", JSON.stringify(this.additionalData));
localStorage.setItem("selectedYears", JSON.stringify(selectedYears));
```

### Storage Management

The application handles localStorage quota limits:

```javascript
// Check if approaching quota
if (parseFloat(quotaInfo.percentage) > 80) {
  console.warn("Storage quota is high, clearing old data before saving");
  this.clearAllStorage();
}

// Chunked storage for large datasets
saveLargeCategoryInChunks(categoryKey, categoryData) {
  const chunks = [];
  const chunkSize = 2; // 2 years per chunk
  
  for (let i = 0; i < years.length; i += chunkSize) {
    chunks.push(yearChunk);
    localStorage.setItem(`${categoryKey}_chunk_${index}`, JSON.stringify(chunk));
  }
}
```

## Data Access by UI Components

UI components retrieve data from localStorage:

```javascript
// In DisplayCharts.js
const displayCashComponent = () => {
  const savedData = getStoredData("cashData");
  const parseData = parseStoredData(savedData);
  
  createChartFromParsedData(
    parseData,
    "daysExpendableNetAssets_chart",
    "daysExpendableNetAssets_Peer",
    "daysExpendableNetAssets_Client",
    "number",
    0,
    "daysExpendableNetAssets",
    getBenchmarksForField("daysExpendableNetAssets"),
    "Days Expendable Net Assets",
    "wa" // Use weighted average
  );
};
```

```javascript
// In Report.js
const displayReportComponent = () => {
  const demoData = JSON.parse(localStorage.getItem("demoData"));
  const cashData = JSON.parse(localStorage.getItem("cashData"));
  // ... retrieve other categories
  
  insertDataToReport(demoData, selectedYears, [
    ["givingUnits", "num", 0],
    ["fullTimeEquivalent", "num", 0],
    // ... other fields
  ]);
};
```

## Complete Data Flow Sequence

1. **User Action**: Click "Run" button with selected filters
2. **Year Processing**: Extract selected years from UI
3. **API Calls**: 
   - Fetch peer data (with batching if >15 clients)
   - Fetch client data
4. **XML Parsing**: Convert XML responses to DOM elements
5. **Record Filtering**: Filter by year
6. **Data Extraction**: Extract values from XML fields
7. **Data Storage**: Insert into DataStore categories
8. **localStorage Persistence**: Save for UI access
9. **Chart Display**: Retrieve from localStorage, render charts
10. **Report Display**: Retrieve from localStorage, populate tables

## Error Handling

The data flow includes comprehensive error handling:

```javascript
try {
  recordsPeer = await this.apiService.getRecordsForPeer(selectedYears);
  
  if (!recordsPeer || recordsPeer.length === 0) {
    createToastWarning("No peer records extracted. Please select more filters");
    return;
  }
} catch (error) {
  console.error("Error fetching peer data:", error);
  createToastWarning("Error fetching peer data. Please try again.");
}
```

## Performance Considerations

- **Batched API Calls**: Large client selections use batched requests
- **Concurrency Limiting**: Maximum 5 concurrent API requests
- **localStorage Chunking**: Large datasets split across multiple keys
- **Quota Monitoring**: Automatic cleanup when approaching storage limits
- **Debounced Uploads**: Deployment script waits 2 seconds before uploading

