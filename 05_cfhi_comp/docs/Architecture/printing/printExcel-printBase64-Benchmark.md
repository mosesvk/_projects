# Excel Export, Base64 Chart Export, and Benchmark Data Processes

This document provides comprehensive technical documentation for three critical processes in the CFHI Comp dashboard:

1. **printExcel** - Excel report generation and QuickBase upload
2. **printBase64** - Chart export to base64 images for QuickBase
3. **Benchmark Data** - Dynamic benchmark content handling for modals and report tabs

---

## Table of Contents

- [1. printExcel Process](#1-printexcel-process)
- [2. printBase64 Process](#2-printbase64-process)
- [3. Benchmark Data Process](#3-benchmark-data-process)
- [Key Differences Summary](#key-differences-summary)
- [Common Patterns](#common-patterns)

---

## 1. printExcel Process

### Overview
The `printExcel` process generates statistical data (averages, medians, min/max) from peer group data, packages it into XML, and uploads it to QuickBase for Excel template generation.

### Files Involved

#### Primary File
- **`src/functions/printExcel.js`** (1,127 lines)
  - Main class: `ExcelReportGenerator`
  - Entry point: `handleGenerateReport()`
  - Core method: `createPrintExcel()`

#### Supporting Files
- **`src/functions/WeightedAverages.js`**
  - Contains weighted average calculation functions
  - Used by `calculateStatistics()` method

- **`src/components/Report.js`**
  - Contains field definitions with "wa" (weighted average) flags
  - Defines which fields use weighted vs simple averages

- **`src/Api.js`**
  - Processes raw XML data from QuickBase
  - Stores data in `localStorage` categories:
    - `demoData`
    - `cashData`
    - `debtData`
    - `incomeData`
    - `expenseData`
    - `additionalData`

### Classes and Functions

#### ExcelReportGenerator Class

**Constructor** (lines 6-127)
```javascript
constructor() {
  // API Constants
  this.API = {
    APP_TOKEN: "bpat4pgu9t69yby5gbemdbej52j",
    UPLOAD_URL: "https://capincrouse.quickbase.com/db/btcc8gq3r?a=API_AddRecord"
  };
  
  // XML Template Strings
  this.XML = {
    HEADER: `<?xml version="1.0" ?><qdbapi><apptoken>${this.API.APP_TOKEN}</apptoken>`,
    FOOTER: "</qdbapi>",
    COLUMN_LIST: "<clist>171</clist>"
  };
  
  // Field ID mappings
  this.FIELD_IDS = {
    CLIENT_RID: "227",
    TOTAL_RECORDS_PEER: "224",
    TYPE: "287",
    FIRM_NAME: "223",
    SLIDER_MIN: "296",
    SLIDER_MAX: "297",
    SITES: "329",
    REGIONS: "331",
    YEARS_START: "228"
  };
  
  // Field mappings for Trends (C-prefix) and Benchmark (S-prefix) reports
  this.fieldMappings = [...]; // 35 fields for Trends
  this.benchmarkFieldMappings = [...]; // 12 fields for Benchmark
}
```

**Key Methods**

1. **`handleGenerateReport()`** (lines 192-265)
   - Called when "Generate Reports" button is clicked
   - Validates data availability
   - Prevents duplicate submissions
   - Calls `createPrintExcel()`

2. **`createPrintExcel()`** (lines 416-611)
   - Main orchestration method
   - Gathers client metadata (RID, firm name, filters)
   - Gets peer group size from DOM (`uniqueClients` element)
   - Builds XML payload in stages:
     a. Client metadata (fields 223-231, 296-297, 329-331)
     b. Selected years (fields 228-231, 301+)
     c. Metrics data (via `generateMetricsXml()`)
   - Sends to QuickBase via `printToExcel()`

3. **`generateMetricsXml()`** (lines 704-854)
   - Processes both Trends and Benchmark field mappings
   - For each metric:
     a. Retrieves peer data from localStorage
     b. Calculates statistics (avg, mid, min, max)
     c. Determines weighted vs simple average
     d. Escapes XML values
     e. Appends to metrics XML
   - **CRITICAL**: Sends empty values (0) for fields 71-74 and 255-258
     - This satisfies Excel template requirements even when data doesn't exist
     - Prevents "Cannot find column 74" errors

4. **`calculateStatistics(data, metricName, useWeightedAvg)`** (lines 289-358)
   - Checks for pre-calculated `_Stats` data first
   - If not available, calculates from `_Peer` data:
     - **Average**: Uses `getWeightedAverageOfArray()` if `useWeightedAvg === true`
     - **Average**: Uses `getAverageOfArray()` if `useWeightedAvg === false`
     - **Percentiles**: Uses `get25thPercentileOfArray()`, `getMidpointOfArray()`, `get75thPercentileOfArray()`
   - Returns `{ avg, mid, min, max }`

5. **`printToExcel(dataString)`** (lines 861-1091)
   - Sends XML payload to QuickBase API
   - Parses response to get Record ID
   - Generates download URLs for Trends and Benchmark reports
   - URL format:
     ```
     https://www.quickbaseutilities1.com/CapinTechnology_1795/XL%20Docs/ExcelGen_UA.aspx?
       clientid=Q1795&
       appid=bps9da9i5&
       tpdbid=bsaavek7s&
       tpid={template_id}&
       fn={TrendsReport|BenchmarkReport}&
       dbid=btcc8gq3r&
       msid={record_id}&
       docfmt={xls|pdf}&
       stream=y&
       apptoken=---
     ```
   - Template IDs (tpid) vary by year count:
     - Trends: 5 (1yr), 4 (2yr), 6 (3yr), 7 (4yr), 8 (5yr)
     - Benchmark: 9 (1yr), 10 (2yr), 11 (3yr), 12 (4yr), 13 (5yr)

### Field Mapping Structure

**Format**: `[metricName, [AVG, MIN, MID, MAX], category, useWeightedAvg]`

**Example**:
```javascript
["daysExpendableNetAssets", [55, 57, 56, 58], "cash", true]
//                          ^AVG^MIN^MID^MAX
```

- **metricName**: Internal field name (matches localStorage key)
- **Field IDs**: QuickBase field IDs in order [AVG, MIN, MID, MAX]
- **category**: localStorage category (`demo`, `cash`, `debt`, `income`, `expense`, `additional`)
- **useWeightedAvg**: `true` if weighted average required, `false` for simple average

### Data Flow

```
User clicks "Generate Reports" button
  ↓
handleGenerateReport()
  ↓
createPrintExcel()
  ├─> Gather client metadata from DOM/globals
  ├─> Get peer group size (uniqueClients element)
  ├─> Build XML header with client data
  ├─> generateMetricsXml()
  │    ├─> For each fieldMapping:
  │    │    ├─> Get data from localStorage category
  │    │    ├─> calculateStatistics(data, metricName, useWeightedAvg)
  │    │    │    ├─> Check for _Stats data (pre-calculated)
  │    │    │    ├─> If not, calculate from _Peer data:
  │    │    │    │    ├─> avg: weighted/simple based on flag
  │    │    │    │    ├─> min: 25th percentile
  │    │    │    │    ├─> mid: median (50th percentile)
  │    │    │    │    └─> max: 75th percentile
  │    │    │    └─> Return { avg, mid, min, max }
  │    │    ├─> Escape XML values
  │    │    └─> Append to metrics XML
  │    └─> Add empty values for required template fields (71-74, 255-258)
  ├─> Append metrics XML to payload
  ├─> Close XML (add COLUMN_LIST + FOOTER)
  └─> printToExcel(xmlPayload)
       ├─> POST to QuickBase API_AddRecord
       ├─> Parse response for Record ID
       ├─> Generate download URLs for Trends/Benchmark (XLS/PDF)
       └─> Update modal download links
```

### Critical Implementation Details

1. **Peer Group Size Calculation**
   - **MUST** use `uniqueClients` element text content or `window.uniqueClientSize`
   - **NOT** `totalRecordsPeer` (which includes multiple years per client)
   - Sent to field 224 (`TOTAL_RECORDS_PEER`)

2. **Weighted vs Simple Average**
   - Matches the `"wa"` flag from `Report.js`
   - Weighted averages account for varying data sizes (e.g., larger organizations)
   - Simple averages treat all data points equally

3. **Empty Field Placeholders**
   - Fields 71-74 (netCashAvailability Trends) and 255-258 (netCashAvailability Benchmark) are **required** in XML even if empty
   - Send `0` values to prevent Excel template errors
   - Excel template schema expects these fields to exist

4. **Year Field Mapping**
   - Years 1-5: Fields 228-231, 301+
   - Year 6+: Field 301 + (index - 5)

5. **Error Handling**
   - Validates XML structure before sending
   - Handles QuickBase API errors gracefully
   - Shows user-friendly toast notifications

### Global Variables Used

```javascript
window.ClientRid          // Client record ID
window.firmName          // Firm name (string or HTMLElement)
window.uniqueClientSize  // Peer group size (fallback)
window.selectedSites_Array    // Selected sites filter (Set or Array)
window.selectedRegions_Array  // Selected regions filter (Set or Array)
document.getElementById("uniqueClients")  // Peer group size DOM element
document.getElementById("givingUnitsMin")  // Slider min value
document.getElementById("givingUnitsMax")  // Slider max value
```

### localStorage Keys Used

- `demoData`
- `cashData`
- `debtData`
- `incomeData`
- `expenseData`
- `additionalData`
- `selectedYears`

Each category contains objects with keys like:
- `{metricName}_Peer` - Peer data array
- `{metricName}_Stats` - Pre-calculated statistics (optional)
- `{metricName}_Client` - Client data

---

## 2. printBase64 Process

### Overview
The `printBase64` process exports ApexCharts as base64-encoded PNG images, packages them with metadata into XML, and uploads to QuickBase for presentation generation.

### Files Involved

#### Primary File
- **`src/functions/printBase64.js`** (948 lines)
  - Main function: `apexChartsExportPrint()`
  - Entry point: `initApexChartsPrintFunction()`

### Key Functions

1. **`apexChartsExportPrint()`** (lines 644-775)
   - Main orchestration function
   - Shows loading modal with progress
   - Unhides hidden chart sections temporarily
   - Processes all charts via `processChartsWithSpacing()`
   - Builds XML via `buildUploadXml()`
   - Sends to QuickBase via `sendToQuickbase()`

2. **`processChartsWithSpacing(chartMappings)`** (lines 25-67)
   - Iterates through chart mappings
   - Updates progress UI
   - For each chart:
     - Gets chart instance via `getChartInstance(chartId)`
     - Exports via `exportApexChart()` or `exportWithHtml2Canvas()` fallback
   - Returns array of `{ chartId, fieldId, base64String }`

3. **`exportApexChart(chart, chartId)`** (lines 364-503)
   - **Chart State Management**:
     - Saves complete chart state via `saveCompleteChartState()`
     - Moves chart to fixed-size container (offscreen)
     - Removes chart titles for export
     - Forces dimensions and styles
     - Exports via `chart.dataURI()` with explicit dimensions
     - Restores chart state via `restoreCompleteChartState()`
   
   - **Dimensions**:
     - Default: 1000x600px
     - Extra width: +200px for left-aligned y-axis labels
     - Extra height: +100px for legends
   
   - **Special Handling**:
     - Charts with left-aligned y-axis: `personnelToCashExpenditure_chart`, `benefitsToSalaries_chart`
     - Adds extra 200px width for proper label display

4. **`saveCompleteChartState(chart)`** (lines 72-180)
   - Saves entire chart configuration to object:
     - SVG attributes (width, height, viewBox, etc.)
     - Chart configuration (series, colors, axis configs, etc.)
     - Y-axis formatter functions (converted to strings)
     - Number type and formatting settings
   - Returns state object for restoration

5. **`restoreCompleteChartState(chart, originalState)`** (lines 185-327)
   - Restores chart to original state after export
   - Reconstructs y-axis formatters from saved strings
   - Applies original configuration via `chart.updateOptions()`
   - Restores SVG dimensions and attributes

6. **`buildUploadXml(results)`** (lines 780-832)
   - Builds XML payload with:
     - App token
     - Metadata (firm name, unique clients, filters, years)
     - Base64 chart images via `createImageFieldXml()`
   - Returns complete XML string

7. **`createImageFieldXml(id, val)`** (lines 866-890)
   - Validates base64 string:
     - Max length: 1,000,000 characters
     - Valid base64 format: `^[A-Za-z0-9+/]*={0,2}$`
   - Escapes XML special characters
   - Returns: `<field fid='{id}' filename='chart.png'>{base64}</field>`

8. **`sendToQuickbase(xml)`** (lines 897-918)
   - POSTs XML to QuickBase API
   - URL: `https://capincrouse.quickbase.com/db/bvcr2chqi?a=API_AddRecord`
   - Returns parsed XML response

### Chart Mapping Structure

```javascript
const chartMappings = [
  { chartId: "givingUnits_chart", fieldId: 11 },
  { chartId: "attendeesToStaff_chart", fieldId: 12 },
  // ... more charts
];
```

- **chartId**: DOM element ID for the chart container
- **fieldId**: QuickBase field ID where the base64 image will be stored

### Data Flow

```
User clicks "Export Charts" button
  ↓
apexChartsExportPrint()
  ├─> Show loading modal with progress UI
  ├─> Unhide hidden chart sections temporarily
  ├─> processChartsWithSpacing(chartMappings)
  │    ├─> For each chart:
  │    │    ├─> getChartInstance(chartId) → window.{chartId}
  │    │    ├─> saveCompleteChartState(chart)
  │    │    ├─> Move chart to fixed container (offscreen)
  │    │    ├─> Update chart options (remove title, set dimensions)
  │    │    ├─> chart.dataURI({ width, height, scale: 1 })
  │    │    ├─> Extract base64 string from imgURI
  │    │    ├─> Restore chart to original position
  │    │    ├─> restoreCompleteChartState(chart, originalState)
  │    │    └─> Clean up temporary container
  │    └─> Return results array
  ├─> Hide previously hidden sections
  ├─> buildUploadXml(results)
  │    ├─> Add metadata fields
  │    ├─> For each result: createImageFieldXml(fieldId, base64String)
  │    └─> Return XML payload
  ├─> sendToQuickbase(xml)
  │    ├─> POST to QuickBase API
  │    ├─> Parse response
  │    └─> Return record ID
  └─> Show success notification
```

### Chart State Management

**Why State Management is Critical**:
- Charts are interactive and responsive
- Export requires fixed dimensions
- Chart must return to original state after export
- Y-axis formatters must be preserved (complex rounding logic)

**State Saved**:
- SVG dimensions and attributes
- Chart configuration (series, colors, titles)
- Y-axis formatters (converted to strings for serialization)
- Number formatting settings (numType, fixedNum)
- X-axis categories and labels

**Restoration Process**:
1. Restore SVG attributes to paper node
2. Reconstruct y-axis formatters from saved strings
3. Apply configuration via `updateOptions(restoredConfig, true, true)`
   - `true, true` = redraw and animate

### Global Variables Used

```javascript
window.{chartId}_chart  // Chart instances (e.g., window.givingUnits_chart)
window.selectedSites_Array
window.selectedRegions_Array
window.peerRecordMapPerYear  // Map of year → peer count
window.sliderValue
window.sliderValue2
window.firmName
window.monthYearEnd
```

### localStorage Keys Used

- `selectedYears` (via `getSelectedYearsFromLocalStorage()`)

### Critical Implementation Details

1. **Chart Dimensions**
   - Standard: 1000x600px
   - Charts with left-aligned y-axis: +200px width
   - All charts: +100px height for legends

2. **Base64 Validation**
   - Max length: 1,000,000 characters (QuickBase limit)
   - Must match base64 regex: `^[A-Za-z0-9+/]*={0,2}$`
   - Images exceeding limit are skipped

3. **Progress UI**
   - Shows current/total charts processed
   - Updates progress bar percentage
   - Removed after completion

4. **Error Handling**
   - Falls back to `html2canvas` if ApexCharts export fails
   - Skips invalid charts gracefully
   - Shows user-friendly error messages

5. **QuickBase API**
   - Different table than Excel export: `bvcr2chqi` vs `btcc8gq3r`
   - Uses different app token: `bbkmdcurd2sd5cpqvf58dsabq2q`

---

## 3. Benchmark Data Process

### Overview
The benchmark data process dynamically loads benchmark paragraph content from localStorage and displays it in two different contexts:
1. **Tingle Modal** - Full content with title (clickable benchmark cells)
2. **Report Tab (_body-3)** - Content without title (embedded in report table)

### Files Involved

#### Primary Files
- **`src/functions/Utility.js`** (lines 1577-1668)
  - Main function: `createBenchmark(benchmarkFieldName, dataCategory, elementId)`
  - Helper functions: `generateBenchmarkTitle()`, `processHtmlContent()`

- **`src/content/DisplayCharts.js`**
  - Calls `createBenchmark()` for each chart/metric
  - Maps chart fields to benchmark paragraph fields

- **`src/components/Report.js`** (lines 601-690)
  - Function: `processBenchmarkParagraphs()`
  - Populates `_body-2` sections (different from `_body-3`)

- **`src/Api.js`**
  - Ingests `_bench_paragraph` fields from XML
  - Stores in localStorage with key: `{fieldName}_benchmarkParagraph`

### Key Functions

#### 1. `createBenchmark(benchmarkFieldName, dataCategory, elementId)` (lines 1577-1668)

**Purpose**: Creates a tingle modal and populates report tab content from dynamic data.

**Parameters**:
- `benchmarkFieldName`: Full field name with `_benchmarkParagraph` suffix (e.g., `"daysExpendableNetAssets_benchmarkParagraph"`)
- `dataCategory`: localStorage category (`"cashData"`, `"debtData"`, `"incomeData"`, `"expenseData"`, `"demoData"`)
- `elementId`: Row element ID (e.g., `"row_daysExpendableNetAssets"`)

**Process**:
```javascript
1. Get data from localStorage[dataCategory]
2. Extract benchmarkData[benchmarkFieldName]
3. Get selectedYears from localStorage
4. Use first year to get benchmarkContent[targetYear].value
5. Extract fieldName (remove _benchmarkParagraph suffix)
6. Generate title: generateBenchmarkTitle(fieldName)
7. Process HTML: processHtmlContent(benchmarkContent)
8. Apply fixUnicodeCharacters() to content and title
9. Create tingle modal with title + content
10. Populate _body-3 section with content only (no title)
11. Set up click handlers for year columns
12. Return modal instance
```

**Content Generation**:
```javascript
// For TINGLE MODAL (includes title)
const modalContent = `<div><p class="mb-2"><strong>${processedTitle}</strong></p>${processedContent}</div>`;
variable.setContent(modalContent);

// For REPORT TAB _body-3 (no title)
const reportContent = `<div>${processedContent}</div>`;
body3Element.innerHTML = reportContent;
```

#### 2. `generateBenchmarkTitle(fieldName)` (lines 1536-1543)

**Purpose**: Converts camelCase field name to Title Case with "Benchmark" suffix.

**Example**:
- Input: `"daysExpendableNetAssets"`
- Output: `"Days Expendable Net Assets Benchmark"`

**Process**:
```javascript
1. Replace capital letters with " {capital}" → "days Expendable Net Assets"
2. Capitalize first letter → "Days Expendable Net Assets"
3. Trim whitespace
4. Append " Benchmark"
```

#### 3. `processHtmlContent(htmlContent)` (lines 1550-1568)

**Purpose**: Processes HTML content and adds `mb-2` class to all `<p>` tags.

**Process**:
```javascript
1. Create temporary div element
2. Set innerHTML to htmlContent
3. Query all <p> tags
4. Add "mb-2" class to each (if not already present)
5. Return processed innerHTML
```

#### 4. `processBenchmarkParagraphs()` (Report.js, lines 601-690)

**Purpose**: Populates `_body-2` sections with benchmark paragraphs for modal info.

**Difference from `createBenchmark()`**:
- Populates `_body-2` (modal info in chart modals)
- Uses `addMb2ClassToPTags()` instead of `processHtmlContent()`
- Doesn't create tingle modal
- Doesn't include title

**Field Mapping**:
```javascript
const modalInfoFields = [
  ["attendeesToStaff", demoData, "#attendeesToStaff-body-2 div"],
  ["daysExpendableNetAssets", cashData, "#daysExpendableNetAssets-body-2 div"],
  // ... more fields
];
```

### Data Flow

#### For Tingle Modal (clickable benchmark cells):
```
User clicks benchmark cell in chart/report row
  ↓
editElementChildren() event handler
  ↓
variable.open() → Opens tingle modal
  ↓
Modal displays: <strong>Title</strong> + Content
```

#### For Report Tab (_body-3):
```
displayReportComponent() called
  ↓
displayCharts() → Calls createBenchmark() for each metric
  ↓
createBenchmark() → Populates #fieldName-body-3 div
  ↓
Report tab displays: Content only (no title)
```

### Field Name Mapping

**In DisplayCharts.js**:
```javascript
// Cash Component
createBenchmark("daysExpendableNetAssets_benchmarkParagraph", "cashData", "row_daysExpendableNetAssets");
createBenchmark("daysOperatingCash_benchmarkParagraph", "cashData", "row_daysOperatingCash");
// ...

// Debt Component
createBenchmark("debtToContributionsWithout_benchmarkParagraph", "debtData", "row_debtToContributionsWithout");
// ...

// Income Component
createBenchmark("netIncomeRatio_benchmarkParagraph", "incomeData", "row_netIncomeRatio");
// ...

// Expense Component
createBenchmark("personnelToCashExpenditure_benchmarkParagraph", "expenseData", "row_personnelToCashExpenditure");
// ...
```

**In Api.js** (data ingestion):
```javascript
// For each metric, insert benchmark paragraph data
this.dataStore.insertData(
  "cash",
  "client",
  year,
  "daysExpendableNetAssets_benchmarkParagraph",
  record,
  "cfhi_compre_01_bench_paragraph___days_of_expendable_net_asset_reserves"
);
```

### localStorage Structure

**Category**: `cashData`, `debtData`, `incomeData`, `expenseData`, `demoData`

**Key Format**: `{fieldName}_benchmarkParagraph`

**Value Structure**:
```javascript
{
  "2022": { value: "<p>Benchmark paragraph content...</p>" },
  "2023": { value: "<p>Benchmark paragraph content...</p>" },
  // ...
}
```

### HTML Structure

#### Tingle Modal:
```html
<div>
  <p class="mb-2"><strong>Days Expendable Net Assets Benchmark</strong></p>
  <p class="mb-2">We believe a reasonable benchmark...</p>
  <p class="mb-2">Additional content...</p>
</div>
```

#### Report Tab (_body-3):
```html
<div>
  <p class="mb-2">We believe a reasonable benchmark...</p>
  <p class="mb-2">Additional content...</p>
</div>
```

**Note**: Title is **excluded** from `_body-3` content.

### Click Handler Setup

```javascript
// Set up click handlers for year columns
if (selectedYears) {
  const children = await document.getElementById(elementId).children;
  
  for (let i = 1; i < selectedYears.length + 1; i++) {
    editElementChildren(children[i], variable, elementId);
  }
}
```

**Process**:
- Gets all children of the row element
- Skips index 0 (row header)
- For each year column (index 1+):
  - Adds click event listener
  - Opens tingle modal on click
  - Adds CSS classes: `cursor-pointer`, `hover:opacity-100`, `transition`, `ease-in-out`

### Unicode Handling

**`fixUnicodeCharacters()`** (Utility.js, lines 1-48):
- Replaces problematic Unicode characters that display as ``
- Common replacements:
  - `\u2019` → `'` (smart apostrophe)
  - `\u201C` → `"` (left double quote)
  - `\u201D` → `"` (right double quote)
  - `\uFFFD` → `'` (replacement character)
- Applied to both title and content before display

### Critical Implementation Details

1. **Title Handling**
   - **Tingle Modal**: Always includes title with `<strong>` tag
   - **Report Tab**: Never includes title (content only)

2. **Year Selection**
   - Uses first available year from `selectedYears` array
   - Benchmark content is year-specific

3. **Data Validation**
   - Checks for data category existence
   - Validates benchmark field exists
   - Checks selected years available
   - Validates benchmark content is not empty or "0"

4. **DOM Selectors**
   - Tingle modal: Uses modal instance `.setContent()`
   - Report tab: `#${rowFieldName}-body-3 div`
   - Modal info: `#${fieldName}-body-2 div`

5. **Error Handling**
   - Console warnings for missing data
   - Returns `null` if data not found
   - Graceful fallback if DOM elements don't exist

---

## Key Differences Summary

| Aspect | printExcel | printBase64 | Benchmark Data |
|--------|-----------|-------------|----------------|
| **Output** | Statistical data (avg, mid, min, max) | Base64 PNG images | HTML content (title + text) |
| **QuickBase Table** | `btcc8gq3r` | `bvcr2chqi` | N/A (client-side only) |
| **App Token** | `bpat4pgu9t69yby5gbemdbej52j` | `bbkmdcurd2sd5cpqvf58dsabq2q` | N/A |
| **Data Source** | `localStorage` categories | Chart instances (`window.{chartId}`) | `localStorage` categories |
| **Processing** | Calculates statistics | Exports visual charts | Displays text content |
| **Display** | Excel files (XLS/PDF) | Presentation images | Tingle modals + report tabs |
| **Field Mapping** | 4 fields per metric (AVG, MIN, MID, MAX) | 1 field per chart (image) | 1 field per metric (paragraph) |
| **Year Handling** | All years in single record | All years in metadata | Single year (first selected) |

---

## Common Patterns

### 1. XML Payload Construction

Both `printExcel` and `printBase64` build XML payloads with similar structure:

```javascript
// Header
let xml = `<?xml version="1.0" ?><qdbapi><apptoken>${TOKEN}</apptoken>`;

// Fields
xml += `<field fid='{id}'>{value}</field>`;
// ... more fields

// Footer
xml += `<clist>171</clist></qdbapi>`;
```

### 2. XML Escaping

Both processes escape XML special characters:

```javascript
function escapeXml(unsafe) {
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
```

### 3. localStorage Data Access

All processes access categorized data from localStorage:

```javascript
const categoryData = JSON.parse(localStorage.getItem("{category}Data") || "{}");
// Categories: demo, cash, debt, income, expense, additional
```

### 4. Selected Years Handling

Both Excel and Base64 processes use selected years:

```javascript
const selectedYears = getSelectedYearsFromLocalStorage() || [];
// Stored as JSON array: ["2022", "2023", "2024", ...]
```

### 5. Progress/Loading UI

Both processes show loading states:

```javascript
// printExcel: Button state changes
toggleButtonLoadingState(button);

// printBase64: Modal with progress bar
showApiLoadingFunction("open", "print");
updateProgressUI(current, total);
```

### 6. Error Handling Pattern

All processes follow similar error handling:

```javascript
try {
  // Process data
} catch (error) {
  console.error("Error:", error);
  if (typeof createToastWarning === "function") {
    createToastWarning(error.message);
  }
  // Reset UI state
}
```

---

## Quick Reference: Field ID Ranges

### Excel Export (printExcel)

**Trends Report (C-prefix)**:
- Fields 6-194 (various metrics)
- Field 224: Total Records Peer (unique clients)
- Field 227: Client RID
- Fields 228-231: Years 1-4
- Field 301+: Years 5+

**Benchmark Report (S-prefix)**:
- Fields 239-286 (subset of metrics)

**Required Empty Fields**:
- Fields 71-74: netCashAvailability (Trends)
- Fields 255-258: netCashAvailability (Benchmark)

### Base64 Export (printBase64)

**Chart Fields**:
- Fields 11-29 (one per chart)
- Field 30: Firm Name
- Field 31: Unique Clients
- Fields 37-44: Years 1-8
- Fields 45-52: Year Counts 1-8
- Fields 53-54: Slider values

---

## Troubleshooting Guide

### printExcel Issues

**Problem**: "Cannot find column 74" error
- **Solution**: Ensure fields 71-74 and 255-258 are sent (even as 0 values)

**Problem**: Wrong peer averages in Excel
- **Check**: Verify `useWeightedAvg` flag matches `Report.js` "wa" flag
- **Check**: Ensure `calculateStatistics()` is using correct average function

**Problem**: Wrong peer group size
- **Check**: Verify using `uniqueClients` element, not `totalRecordsPeer`
- **Check**: Ensure `clientCount` is parsed as integer

### printBase64 Issues

**Problem**: Charts export with wrong dimensions
- **Check**: Verify `getChartDimensions()` returns correct size
- **Check**: Ensure extra width/height added for legends/labels

**Problem**: Chart state not restored after export
- **Check**: Verify `saveCompleteChartState()` captures all config
- **Check**: Ensure `restoreCompleteChartState()` called after export

**Problem**: Base64 string too long
- **Check**: Verify image dimensions not excessive
- **Check**: Ensure base64 validation passes (1M char limit)

### Benchmark Data Issues

**Problem**: "No benchmark data found" warning
- **Check**: Verify `_benchmarkParagraph` field exists in `Api.js`
- **Check**: Ensure data category matches (cashData, debtData, etc.)
- **Check**: Verify XML field name matches QuickBase field

**Problem**: Title showing in report tab
- **Check**: Verify `reportContent` excludes title
- **Check**: Ensure `body3Element.innerHTML` uses `reportContent`, not `modalContent`

**Problem**: Unicode characters showing as ``
- **Check**: Verify `fixUnicodeCharacters()` is called
- **Check**: Ensure applied to both title and content

---

## Conclusion

These three processes form the core export and display functionality of the CFHI Comp dashboard:

1. **printExcel**: Generates statistical reports with peer comparisons
2. **printBase64**: Exports visual chart presentations
3. **Benchmark Data**: Displays contextual benchmark information in modals and reports

Understanding these processes is critical for:
- Adding new metrics/fields
- Fixing export issues
- Maintaining data consistency
- Extending functionality to new projects

For project-specific adaptations, focus on:
- Field ID mappings
- Data category structures
- Chart instance management
- Benchmark paragraph field names

