# ApexCharts Export System Documentation

## Overview

The `printBase64.js` system provides a comprehensive solution for exporting ApexCharts as base64-encoded images and uploading them to Quickbase. This system handles 19 different charts across 5 categories (Demo, Cash, Debt, Income, Expense) with consistent export quality and proper legend rendering.

## Chart Categories and Mappings

### Chart Types
All charts in this system are **line charts** with the following characteristics:
- **Chart Type**: `line` (ApexCharts)
- **Dimensions**: 1000px × 500px (standardized)
- **Legend Position**: Bottom center
- **Data Labels**: Enabled for primary series
- **Annotations**: Benchmark lines for performance comparison

### Chart Mappings by Category

#### Demo Charts (General Metrics)
- `givingUnits_chart` → Field 6
- `attendeesToStaff_chart` → Field 7

#### Cash Charts (Liquidity & Cash Flow)
- `daysExpendableNetAssets_chart` → Field 8
- `daysOperatingCash_chart` → Field 9
- `availableDaysOfCashFlow_chart` → Field 10
- `liquidityRatio_chart` → Field 11
- `netCashAvailability_chart` → Field 12

#### Debt Charts (Debt Management)
- `debtToContributionsWithout_chart` → Field 13
- `currentRatio_chart` → Field 14
- `mandatoryDebtServiceToContributionsWithout_chart` → Field 15
- `debtPerGivingUnit_chart` → Field 16
- `debtCoverage_chart` → Field 17

#### Income Charts (Revenue Analysis)
- `netIncomeRatio_chart` → Field 18
- `contributionsWithoutDonorPerGivingUnit_chart` → Field 19
- `totalContributionsPerGivingUnit_chart` → Field 20

#### Expense Charts (Cost Analysis)
- `benefitsToSalaries_chart` → Field 21
- `salariesBenefitsIncludingOutsourcedEmployees_chart` → Field 22
- `personnelToCashExpenditure_chart` → Field 23
- `cashExpendituresPerGivingUnit_chart` → Field 24

## Chart Creation to Export Flow

### 1. Chart Creation Process

#### A. Data Preparation (`src/content/DisplayCharts.js`)
```javascript
// Charts are created using createChartFromParsedData
createChartFromParsedData(
  "debtToContributionsWithout_chart",
  "debtToContributionsWithout_Peer",
  "debtToContributionsWithout_Client",
  "debtToContributionsWithout",
  getBenchmarksForField("debtToContributionsWithout")
);
```

#### B. Chart Configuration (`src/content/CreateCharts.js`)
- **Series Configuration**: Each chart has 5 series:
  - Primary series (client data) - visible bars
  - "25th" percentile line - `visible: false, showInLegend: true`
  - "Avg" average line - visible with gradient fill
  - "50th" percentile line - `visible: false, showInLegend: true`
  - "75th" percentile line - `visible: false, showInLegend: true`

- **Legend Configuration**:
  ```javascript
  legend: {
    horizontalAlign: "center",
    offsetX: 40,
    fontSize: "20px",
    show: true,
    showForNullSeries: true,
    showForZeroSeries: true,
  }
  ```

- **Annotations**: Benchmark lines from `getBenchmarksForField()`

#### C. Chart Rendering (`src/functions/Utility.js`)
```javascript
window.debtToContributionsWithout_chart = new ApexCharts(
  document.getElementById("debtToContributionsWithout_chart"),
  chartOptions
);
window.debtToContributionsWithout_chart.render();
```

### 2. Export Process

#### A. Export Trigger
- User clicks "Print Charts" button
- `apexChartsExportPrint()` function is called
- Progress UI is displayed

#### B. Chart Processing Loop
```javascript
for (let i = 0; i < chartMappings.length; i++) {
  const { chartId, fieldId } = chartMappings[i];
  
  // 1. Get chart element and instance
  const chartElement = document.getElementById(chartId);
  const chart = getChartInstance(chartId);
  
  // 2. Export using ApexCharts dataURI method
  if (chart && typeof chart.dataURI === "function") {
    const base64String = await exportApexChart(chart, chartId);
  }
  
  // 3. Fallback to html2canvas if needed
  else {
    const base64String = await exportWithHtml2Canvas(chartElement);
  }
}
```

#### C. Export Container Setup
```javascript
// Create export container with extra space for legends and labels
const fixedContainer = document.createElement("div");
fixedContainer.style.width = `${chartWidth + 100}px`; // Extra width for Y-axis labels
fixedContainer.style.height = `${chartHeight + 100}px`; // Extra height for legend
fixedContainer.style.overflow = "visible"; // Critical: allows all content to render
```

#### D. Chart State Management
1. **Save Original State**: Complete chart configuration is saved
2. **Move to Export Container**: Chart is temporarily moved to off-screen container
3. **Apply Export Settings**: Chart is updated with export-specific options
4. **Generate Base64**: `chart.dataURI()` method creates the image
5. **Restore Original State**: Chart is moved back and configuration restored

### 3. Export Configuration

#### A. Container Positioning
```javascript
chartElement.style.left = "50px"; // Add left padding for Y-axis labels
chartElement.style.top = "20px"; // Add top padding
```

#### B. Export Dimensions
```javascript
const uri = await chart.dataURI({
  width: chartWidth + 100, // Include extra width for labels
  height: chartHeight + 100, // Include extra height for legend
  scale: 1,
});
```

#### C. Chart Updates for Export
```javascript
// Remove titles for clean export
const updateConfig = {
  title: { text: "" },
  subtitle: { text: "" }
};

// Apply export dimensions
const updatedOptions = {
  chart: {
    width: chartWidth,
    height: chartHeight,
    animations: { enabled: false },
    background: '#ffffff'
  }
};
```

### 4. XML Generation and Upload

#### A. Base64 Collection
- All successful exports are collected in `results` array
- Each result contains `{ chartId, fieldId, base64String }`

#### B. XML Construction
```javascript
function buildUploadXml(results) {
  let uploadXml = "<qdbapi><apptoken>bbkmdcurd2sd5cpqvf58dsabq2q</apptoken>";
  
  // Add metadata fields
  uploadXml += createFieldXml(30, firmName);
  uploadXml += createFieldXml(31, uniqueClients);
  // ... additional metadata
  
  // Add chart images
  results.forEach((result) => {
    if (result.base64String) {
      uploadXml += createImageFieldXml(result.fieldId, result.base64String);
    }
  });
  
  uploadXml += "</qdbapi>";
  return uploadXml;
}
```

#### C. Quickbase Upload
```javascript
const response = await $.ajax({
  type: "POST",
  contentType: "text/xml",
  url: "https://capincrouse.quickbase.com/db/bvcr2chqi?a=API_AddRecord",
  dataType: "xml",
  processData: false,
  data: uploadXml,
  timeout: 60000,
});
```

## Key Technical Features

### 1. State Preservation
- Complete chart configuration is saved before export
- Original chart state is restored after export
- No permanent changes to chart display

### 2. Error Handling
- Graceful fallback from ApexCharts to html2canvas
- Individual chart failures don't stop the entire process
- Comprehensive error logging and user feedback

### 3. Progress Tracking
- Real-time progress bar during export
- Chart-by-chart status updates
- Success/failure reporting

### 4. Memory Management
- Proper cleanup of temporary containers
- Event listener management
- DOM element restoration

## Performance Optimizations

### 1. Batch Processing
- All charts processed in sequence
- 100ms delay between charts to prevent UI freezing
- Efficient memory usage

### 2. Container Reuse
- Single export container pattern
- Minimal DOM manipulation
- Optimized for ApexCharts rendering

### 3. Image Optimization
- Scale: 1 for optimal file size
- PNG format for quality
- Base64 encoding for Quickbase compatibility

## Troubleshooting

### Common Issues
1. **Chart Not Found**: Verify chart ID exists in DOM
2. **Export Fails**: Check chart instance availability
3. **Legend Missing**: Ensure `overflow: "visible"` on container
4. **Cut-off Content**: Verify padding and container dimensions

### Debug Functions
```javascript
// Test individual chart export
window.testChartExport("debtToContributionsWithout_chart");

// Compare chart configurations
window.compareChartConfigs();

// Test debt charts specifically
window.testDebtChartsCutoff();
```

## File Structure

```
src/
├── functions/
│   └── printBase64.js          # Main export system
├── content/
│   ├── CreateCharts.js         # Chart configuration
│   ├── DisplayCharts.js        # Chart creation orchestration
│   └── Utility.js              # Chart rendering utilities
└── Index.html                  # Chart containers and UI
```

This system provides a robust, scalable solution for exporting complex ApexCharts with proper legend rendering, consistent quality, and reliable Quickbase integration.
