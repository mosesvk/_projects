# Main Data Flow Documentation

## Overview
This document tracks how data is extracted, moved, stored, and organized throughout the Standard project application.

## Data Flow Architecture

### 1. Data Extraction (API Layer)

#### Peer Data Extraction
- **Location**: `src/Api.js` - `ApiService.getRecordsForPeer()`
- **Method**: Recursive async function that fetches data year by year
- **Query Structure**: 
  - Filters by year: `{195.EX.${currentYear}}`
  - Filters by selected clients
  - Filters by survey type: `{193.EX.'Standard'}`
  - Filters by giving units range (slider values)
  - Filters by regions and sites
- **Data Source**: QuickBase Peer table
- **Returns**: NodeList of XML record elements

#### Client Data Extraction
- **Location**: `src/Api.js` - `ApiService.getRecordsForClient()`
- **Method**: Recursive async function that accumulates XML records across years
- **Query Structure**:
  ```
  {98.EX.${ClientRid}} AND {474.EX.${currentYear}}
  ```
  - **Important Note**: The `{105.EX.'Standard'}` filter was removed as it was not needed for client data queries. Client records are already filtered by the ClientRid.
- **Data Source**: QuickBase Client table
- **Returns**: NodeList of XML record elements
- **Key Fields Retrieved** (clist):
  - `452.98.474.22.59.60.211.212.213.215.216.217.227.218.219.220.221.222.223.228.224.415.462.229.460.463.232.230.233.294.700.698.702.703.421.420`

### 2. Data Processing (DataProcessor Class)

#### Entry Point
- **Location**: `src/Api.js` - `DataProcessor.processAllData()`
- **Method**: Orchestrates processing of all data categories
- **Flow**:
  1. `processDemoData(years, recordsPeer, recordsClient)`
  2. `processCashData(years, recordsPeer, recordsClient)`
  3. `processDebtData(years, recordsPeer, recordsClient)`
  4. `processIncomeData(years, recordsPeer, recordsClient)`
  5. `processExpenseData(years, recordsPeer, recordsClient)`
  6. `dataStore.saveAllToLocalStorage()`

#### Record Filtering
- **Location**: `src/Api.js` - `DataProcessor.filterRecordsByYear()`
- **Purpose**: Filters records by fiscal year using `s52_formatted_year` field
- **Handles**:
  - Null/undefined records
  - NodeList to Array conversion
  - DOM element querying
  - Error handling for malformed records

#### Data Insertion
- **Location**: `src/Api.js` - `DataStore.insertData()`
- **Method**: Routes data to either `insertClientData()` or `insertPeerData()`
- **Parameters**:
  - `category`: Data category (demo, cash, debt, income, expense)
  - `type`: "client" or "peer"
  - `year`: Fiscal year
  - `dataKey`: Storage key (e.g., "givingUnits_Client")
  - `record`: XML record element
  - `child`: XML field name to extract
  - `dynamicValueClientPeer`: Optional benchmark/yes-no field

#### Client Data Structure
- **Location**: `src/Api.js` - `DataStore.insertClientData()`
- **Structure**:
  ```javascript
  demoData[dataKey][year] = {
    value: extractedValue,
    benchmark: benchmarkField (optional)
  }
  ```
- **Example**:
  ```javascript
  demoData.givingUnits_Client = {
    "2021": { value: 435 },
    "2022": { value: 415 },
    ...
  }
  ```

#### Peer Data Structure
- **Location**: `src/Api.js` - `DataStore.insertPeerData()`
- **Structure**:
  ```javascript
  demoData[dataKey][year] = [array of peer values]
  demoData[dataKey].total = [all peer values across years]
  ```
- **Example**:
  ```javascript
  demoData.givingUnits_Peer = {
    "2021": [435, 415, 405, ...],
    "2022": [415, 405, 451, ...],
    "total": [435, 415, 405, 415, 405, 451, ...]
  }
  ```

### 3. Data Storage (DataStore Class)

#### In-Memory Storage
- **Location**: `src/Api.js` - `DataStore` class properties
- **Categories**:
  - `this.demoData = {}`
  - `this.cashData = {}`
  - `this.debtData = {}`
  - `this.incomeData = {}`
  - `this.expenseData = {}`
  - `this.additionalData = {}`

#### LocalStorage Persistence
- **Location**: `src/Api.js` - `DataStore.saveAllToLocalStorage()`
- **Method**: Serializes each data category to JSON and stores in localStorage
- **Keys**:
  - `demoData`
  - `cashData`
  - `debtData`
  - `incomeData`
  - `expenseData`
  - `additionalData`
- **Storage Quota Management**: Includes checks for localStorage quota limits

### 4. Data Retrieval and Display

#### Chart Display Flow
1. **Retrieval**: `src/content/DisplayCharts.js` - `displayDemoComponent()`
   - `getStoredData("demoData")` - Gets JSON string from localStorage
   - `parseStoredData(savedData)` - Parses JSON to object

2. **Chart Creation**: `src/functions/Utility.js` - `createChartFromParsedData()`
   - Extracts peer and client data: `parsedData[peer]`, `parsedData[client]`
   - Calls `createChart()` with extracted data

3. **Data Processing for Charts**: `src/functions/Utility.js` - `getPeerAndClientChartDataArrays()`
   - Processes peer data (avg, median, 25th, 75th percentiles)
   - Processes client data (single value per year)
   - Handles null/undefined data gracefully

#### Report Display Flow
1. **Retrieval**: `src/components/Report.js` - `displayReportComponent()`
   - Directly parses localStorage items: `JSON.parse(localStorage.getItem("demoData"))`
   - Processes data for table display

2. **Data Insertion**: `src/components/Report.js` - `insertDataToReport()`
   - Extracts client and peer data for each metric
   - Formats data for table cells

## Key Data Categories

### Demo Data
- **Metrics**:
  - `givingUnits_Client` / `givingUnits_Peer`
  - `contributionsWithoutDonorExcludingLargeGifts_Client` / `contributionsWithoutDonorExcludingLargeGifts_Peer`
  - `totalContributionsExclude_Client` / `totalContributionsExclude_Peer`
  - `givingUnits_percentChange_Client` (client only, no peer data)

### Cash Data
- **Metrics**:
  - `daysOperatingCash`
  - `netCashAvailability`
  - `netCashAvailability_standard`

### Debt Data
- **Metrics**:
  - `debtToContributionsWithout`
  - `debtPerGivingUnit`
  - `contributionsWithoutDonorPerGivingUnit_standard`

### Income Data
- **Metrics**:
  - `contributionsWithoutDonorPerGivingUnit`
  - `totalContributionsPerGivingUnit`
  - `contributionsWithoutDonorPerGivingUnit_percentChange`
  - `totalContributionsPerGivingUnit_percentChange`

### Expense Data
- **Metrics**:
  - `cashExpendituresPerGivingUnit`
  - `personnelIncludingToTotalCashExpenditures`

## Important Notes

### Client Data Query Fix
- **Issue**: Client data was not being retrieved
- **Root Cause**: Query included `{105.EX.'Standard'}` filter which was not needed
- **Fix**: Removed the Standard filter from client data query (line 1782 in `src/Api.js`)
- **Reason**: Client records are already filtered by `ClientRid`, and the Standard filter was preventing records from being returned
- **Query Before**: `{98.EX.${ClientRid}} AND {105.EX.'Standard'} AND {474.EX.${currentYear}}`
- **Query After**: `{98.EX.${ClientRid}} AND {474.EX.${currentYear}}`

### Data Structure Differences

#### Client Data
- Single value per year per metric
- Structure: `{ year: { value: number, benchmark?: string } }`
- Used for: Client-specific chart lines, report table client columns

#### Peer Data
- Array of values per year per metric
- Structure: `{ year: [values...], total: [all values...] }`
- Used for: Statistical calculations (avg, median, percentiles), report table peer columns

### Field Name Mapping
- **Year Field**: `s52_formatted_year` (used in both peer and client records)
- **Giving Units**: `s02___giving_units`
- **Contributions Without Donor**: `s39___contribution_without_donor_restriction`
- **Total Contributions**: `s40___total_contribution`

## Data Flow Diagram

```
QuickBase API
    ↓
getRecordsForPeer() / getRecordsForClient()
    ↓
validateAndNormalizeRecords()
    ↓
DataProcessor.processAllData()
    ↓
DataProcessor.processDemoData() / processCashData() / etc.
    ↓
DataStore.insertData()
    ↓
DataStore.insertClientData() / insertPeerData()
    ↓
DataStore.saveAllToLocalStorage()
    ↓
localStorage (JSON)
    ↓
getStoredData() / parseStoredData()
    ↓
createChartFromParsedData() / displayReportComponent()
    ↓
UI Display (Charts / Tables)
```

## Debugging Tips

### Check Data at Each Stage
1. **API Level**: Check console for "Fetching client data for year X" logs
2. **Processing Level**: Check "demoData before saving" logs for keys
3. **Storage Level**: Check "demoData after saving" logs
4. **Display Level**: Check "parseData keys" logs in display functions

### Common Issues
- **No client data**: Check if `ClientRid` is defined and correct
- **Missing keys**: Verify data is being inserted with correct `dataKey` names
- **Undefined values**: Check if XML field names match between query and extraction
- **Filter issues**: Verify query filters are correct (see Client Data Query Fix above)

