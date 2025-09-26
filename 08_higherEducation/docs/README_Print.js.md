# Print.js - Chart Export and Quickbase Integration

## Overview
The `Print.js` file handles the complete lifecycle of chart export, from user activation to Quickbase upload and chart restoration. This document explains the entire flow from beginning to end.

## Table of Contents
1. [Initialization](#initialization)
2. [User Activation](#user-activation)
3. [Chart Processing Flow](#chart-processing-flow)
4. [Export Process](#export-process)
5. [Quickbase Integration](#quickbase-integration)
6. [Chart Restoration](#chart-restoration)
7. [Error Handling](#error-handling)
8. [Key Functions Reference](#key-functions-reference)

## Initialization

### Setup Phase
When the document loads, the system initializes the print functionality:

```javascript
// Auto-initialization when document is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApexChartsPrintFunction);
} else {
  initApexChartsPrintFunction();
}
```

### Function: `initApexChartsPrintFunction()`
- **Purpose**: Sets up the print button event listener
- **Process**:
  1. Finds the print button (`#printCharts`)
  2. Clones and replaces the button to remove existing listeners
  3. Attaches the main export function (`apexChartsExportPrint`) to the click event

## User Activation

### Trigger Point
User clicks the "Print Charts" button, which activates `apexChartsExportPrint()`

### Initial Setup
1. **Loading UI**: Shows loading modal with progress tracking
2. **Button State**: Disables button and shows "Exporting Charts..." with spinner
3. **Section Visibility**: Temporarily unhides any hidden chart sections to ensure all charts are available

## Chart Processing Flow

### Function: `apexChartsExportPrint()`
This is the main orchestrator function that coordinates the entire process.

#### Step 1: Chart Discovery
```javascript
const chartMappings = [
  { chartId: "cfiRatio_chart", fieldId: 6 },
  { chartId: "cfi_primaryReserveRatio_chart", fieldId: 7 },
  // ... 22 total chart mappings
];
```

#### Step 2: Validation
- Filters out charts that don't exist in the DOM
- Ensures at least one valid chart is found
- Logs which charts exist vs. missing

#### Step 3: Processing
Calls `processChartsWithSpacing()` to handle the actual export

### Function: `processChartsWithSpacing(chartMappings)`
Processes each chart sequentially with progress tracking.

#### For Each Chart:
1. **Progress Update**: Updates UI progress bar
2. **Chart Instance Retrieval**: Gets ApexChart instance via `getChartInstance()`
3. **Export Method Selection**:
   - **Primary**: Uses ApexCharts `dataURI()` method if available
   - **Fallback**: Uses `html2canvas` if ApexCharts method fails
4. **Error Handling**: Catches and logs any export errors
5. **UI Prevention**: Small delay to prevent UI freezing

## Export Process

### Primary Export: ApexCharts Method

#### Function: `exportApexChart(chart, chartId)`

##### Step 1: Dimension Calculation
```javascript
const dimensions = getChartDimensions(chartId);
const { width: chartWidth, height: chartHeight } = dimensions;
```

**Chart Dimensions Logic**:
- **Standard charts**: 1100px × 530px
- **Charts with bottom legends**: 1100px × 650px (extra height for legend)
- **CFI Composite**: 500px × 800px (special dimensions)

##### Step 2: State Preservation
```javascript
const originalState = saveCompleteChartState(chart);
```

**Function: `saveCompleteChartState(chart)`**
- Saves complete chart configuration
- Stores SVG attributes and dimensions
- Preserves formatter functions and axis configurations
- Captures chart type and formatting parameters

##### Step 3: Chart Manipulation
1. **Fixed Container Creation**: Creates off-screen container with exact dimensions
2. **Chart Movement**: Moves chart to fixed container
3. **Dimension Setting**: Forces exact width/height on chart and SVG elements
4. **Configuration Update**: Applies export-specific options

##### Step 4: Export Configuration
Creates export-specific chart options:
- **Animations**: Disabled for export
- **Toolbar**: Hidden
- **Dimensions**: Fixed to export dimensions
- **Formatters**: Preserved with proper number formatting
- **Legends**: Special handling for bottom-positioned legends

##### Step 5: Export Execution
```javascript
const uri = await chart.dataURI({
  width: chartWidth,
  height: chartHeight,
  scale: 1,
});
```

##### Step 6: Cleanup and Restoration
1. **Chart Restoration**: Moves chart back to original position
2. **State Restoration**: Calls `restoreCompleteChartState()`
3. **Container Cleanup**: Removes temporary container
4. **Base64 Extraction**: Extracts base64 data from data URI

### Fallback Export: HTML2Canvas Method

#### Function: `exportWithHtml2Canvas(chartElement)`
Used when ApexCharts export fails:

1. **Element Cloning**: Creates clone of chart element
2. **Dimension Setting**: Applies fixed dimensions to clone
3. **SVG Adjustment**: Updates SVG attributes for proper rendering
4. **Canvas Generation**: Uses html2canvas with fixed dimensions
5. **Base64 Conversion**: Converts canvas to base64 string

## Quickbase Integration

### Function: `buildUploadXml(results)`

#### Step 1: Basic Field Population
Adds standard fields to XML:
- Firm name, client size, selected years
- Month/year end, slider values
- Selected filters (seminaries, regions, states, etc.)

#### Step 2: Chart Data Addition
For each successfully exported chart:
```javascript
const imageXml = createImageFieldXml(result.fieldId, result.base64String);
uploadXml += imageXml;
```

#### Step 3: XML Validation
- Validates base64 string format
- Checks for unescaped XML characters
- Ensures proper XML structure

### Function: `sendToQuickbase(xml)`
Sends the complete XML payload to Quickbase:
- **Endpoint**: `https://capincrouse.quickbase.com/db/buk93bd7x?a=API_AddRecord`
- **Method**: POST with XML content type
- **Timeout**: 60 seconds
- **Response**: XML with record ID or error details

## Chart Restoration

### Function: `restoreCompleteChartState(chart, originalState)`

#### Step 1: SVG Attribute Restoration
Restores original SVG attributes:
- Width, height, viewBox
- Style properties
- PreserveAspectRatio

#### Step 2: Configuration Restoration
Applies original chart configuration:
- Chart options, data labels, markers
- Axis configurations with proper formatters
- Legend settings and colors

#### Step 3: Formatter Restoration
Restores number formatting functions with proper:
- Dollar/percent symbol handling
- Negative value formatting
- Scale abbreviations (K, M)

## Error Handling

### Comprehensive Error Management
1. **Chart Not Found**: Logs warning and continues with next chart
2. **Export Failures**: Falls back to html2canvas method
3. **Quickbase Errors**: Displays error message with details
4. **Network Timeouts**: 60-second timeout with retry logic
5. **Invalid Data**: Validates base64 strings before upload

### Progress Tracking
- **Setup**: Shows progress bar with total chart count
- **Updates**: Real-time progress updates during processing
- **Completion**: Shows "Processing complete!" message

## Key Functions Reference

### Core Functions

| Function | Purpose | Key Features |
|----------|---------|--------------|
| `apexChartsExportPrint()` | Main orchestrator | Coordinates entire export process |
| `processChartsWithSpacing()` | Chart processor | Handles sequential chart export |
| `exportApexChart()` | Primary export method | Uses ApexCharts dataURI |
| `exportWithHtml2Canvas()` | Fallback export | Uses html2canvas library |
| `buildUploadXml()` | XML builder | Creates Quickbase upload payload |
| `sendToQuickbase()` | API integration | Sends data to Quickbase |

### State Management Functions

| Function | Purpose | Key Features |
|----------|---------|--------------|
| `saveCompleteChartState()` | State preservation | Saves all chart configurations |
| `restoreCompleteChartState()` | State restoration | Restores original chart state |
| `getChartDimensions()` | Dimension calculation | Returns appropriate chart size |
| `getChartInstance()` | Instance retrieval | Gets ApexChart instance by ID |

### Utility Functions

| Function | Purpose | Key Features |
|----------|---------|--------------|
| `createFieldXml()` | XML field creation | Creates standard field entries |
| `createImageFieldXml()` | Image XML creation | Creates image field entries |
| `setupProgressUI()` | Progress setup | Initializes progress tracking |
| `updateProgressUI()` | Progress update | Updates progress bar |
| `completeProgressUI()` | Progress completion | Finalizes progress display |

## Chart Types and Special Handling

### Standard Charts
- **Dimensions**: 1100px × 530px
- **Processing**: Standard ApexCharts export
- **Restoration**: Standard configuration restoration

### Charts with Bottom Legends
- **Dimensions**: 1100px × 650px (extra height)
- **Special Handling**: Enhanced legend positioning
- **Margin Adjustment**: Increased bottom margin for legend space

### CFI Composite Chart
- **Dimensions**: 500px × 800px (special size)
- **Processing**: Custom dimension handling
- **Configuration**: Special chart type recognition

### Cost of Contributions Charts
- **Multiple Axes**: Handles complex multi-axis configurations
- **Formatter Preservation**: Maintains custom number formatting
- **Axis Configuration**: Preserves ratio and dollar value axes

## Performance Considerations

### Optimization Strategies
1. **Sequential Processing**: Processes charts one at a time to prevent memory issues
2. **UI Delays**: Small delays between charts to prevent freezing
3. **Memory Management**: Proper cleanup of temporary containers
4. **Base64 Validation**: Checks data size before upload
5. **Error Recovery**: Continues processing even if individual charts fail

### Resource Management
- **Temporary Containers**: Created and destroyed for each chart
- **Chart Cloning**: Minimal DOM manipulation
- **State Preservation**: Efficient state saving/restoration
- **Memory Cleanup**: Proper disposal of temporary objects

## Troubleshooting

### Common Issues
1. **Chart Not Found**: Check chart ID mapping in `getChartInstance()`
2. **Export Failures**: Verify ApexCharts instance availability
3. **Quickbase Errors**: Check XML structure and field mappings
4. **Memory Issues**: Monitor chart processing sequence
5. **Formatting Issues**: Verify formatter function preservation

### Debug Information
The system provides extensive logging:
- Chart processing status
- Export method selection
- XML construction details
- Quickbase response analysis
- Error details and stack traces

This comprehensive system ensures reliable chart export, proper state management, and successful Quickbase integration while maintaining optimal performance and user experience. 