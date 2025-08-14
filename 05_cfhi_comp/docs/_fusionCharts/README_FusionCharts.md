# FusionCharts Implementation - Matching ApexCharts Structure

## Overview

This implementation provides a FusionCharts version that matches the structure and styling of the ApexCharts implementation in `CreateCharts.js`. The FusionCharts version includes:

- **Client Bar Data**: Primary data series displayed as columns
- **Peer Line Data**: Multiple line series for peer comparison (25th, Average, 50th, 75th percentiles)
- **Benchmark Lines**: Two horizontal benchmark lines with proper labeling
- **Theme Support**: Dark/light mode compatibility
- **Data Formatting**: Support for different number types (dollar, percent, number)

## Files

### `apexchart_example.js`
The main FusionCharts implementation file containing:

- **Sample Data Structure**: Matches the format used in `CreateCharts.js`
- **Color Management**: Dynamic color schemes for dark/light modes
- **Chart Configuration**: Complete FusionCharts setup with all styling options
- **Utility Functions**: Reusable functions for creating custom charts
- **Theme Integration**: Automatic theme detection and switching

### `fusionchart_demo.html`
A complete demo page showcasing the FusionCharts implementation with:

- **Interactive Controls**: Number type selection, chart title editing
- **Theme Toggle**: Dark/light mode switching
- **Real-time Updates**: Dynamic chart updates based on user input
- **Responsive Design**: Mobile-friendly layout using Tailwind CSS

## Key Features

### 1. Data Structure Compatibility
```javascript
const sampleData = {
  selectedYears: ['2019', '2020', '2021', '2022', '2023'],
  clientData: [45.2, 52.8, 48.9, 61.3, 58.7], // Client bar data
  peer25: [42.1, 45.3, 47.8, 49.2, 51.5],     // 25th percentile line
  peerAvg: [48.5, 51.2, 53.7, 55.8, 57.3],    // Average line
  peer50: [49.2, 52.1, 54.3, 56.1, 58.2],     // 50th percentile line
  peer75: [55.8, 58.4, 60.1, 62.7, 64.9],     // 75th percentile line
  benchmarks: [40, 55] // Two benchmark values
};
```

### 2. Chart Series Structure
- **Client Data**: Bar chart (primary visualization)
- **Peer Lines**: Line charts for comparison data
  - 25th Percentile (hidden by default)
  - Average (visible)
  - 50th Percentile (hidden by default)
  - 75th Percentile (hidden by default)

### 3. Benchmark Lines
- **Two Benchmark Lines**: Horizontal lines at specified values
- **Dynamic Labeling**: "Benchmark - Lower" and "Benchmark - Higher"
- **Color Coding**: Different colors for each benchmark line
- **Tooltips**: Interactive tooltips with formatted values

### 4. Theme Support
```javascript
function getChartColors() {
  const isDarkMode = document.documentElement.classList.contains("dark");
  
  return isDarkMode ? {
    // Dark mode colors
    backgroundColor: "#1F2937",
    canvasBgColor: "#374151",
    captionColor: "#F9FAFB",
    // ... more colors
  } : {
    // Light mode colors
    backgroundColor: "#FFFFFF",
    canvasBgColor: "#F9FAFB",
    captionColor: "#111827",
    // ... more colors
  };
}
```

### 5. Number Formatting
```javascript
function formatNumber(value, numType = 'num') {
  let formattedValue = value.toLocaleString();
  
  if (numType === "dollar") {
    return `$${formattedValue}`;
  } else if (numType === "percent") {
    return `${formattedValue}%`;
  }
  return formattedValue;
}
```

## Usage

### Basic Implementation
```javascript
// Create chart with custom data
const chart = createCustomFusionChart(
  data,
  'chart-container',
  'Chart Title',
  'num' // or 'dollar' or 'percent'
);
```

### Integration with Existing System
```javascript
// Use the same data structure as CreateCharts.js
const chartData = {
  selectedYears: getSelectedYearsFromLocalStorage(),
  clientData: clientArray,
  peer25: peer25Array,
  peerAvg: peerAvgArray,
  peer50: peer50Array,
  peer75: peer75Array,
  benchmarks: getBenchmarksForField(fieldName)
};

// Create FusionCharts instance
const fusionChart = createCustomFusionChart(
  chartData,
  chartId,
  title,
  numType
);
```

## Styling Comparison

### ApexCharts vs FusionCharts

| Feature | ApexCharts | FusionCharts |
|---------|------------|--------------|
| **Chart Type** | `line` with mixed series | `mscombi2d` (multi-series combination) |
| **Client Data** | `type: "column"` | `renderAs: "column"` |
| **Peer Lines** | `type: "line"` | `renderAs: "line"` |
| **Benchmarks** | `annotations.yaxis` | `trendlines` |
| **Theme Support** | Dynamic color objects | Dynamic color objects |
| **Data Labels** | `dataLabels` configuration | `showDataLabels: "1"` |
| **Tooltips** | `tooltip` configuration | Built-in tooltip system |

## Dependencies

### CDN Libraries
```html
<!-- FusionCharts Core -->
<script src="https://cdn.fusioncharts.com/fusioncharts/latest/fusioncharts.js"></script>
<script src="https://cdn.fusioncharts.com/fusioncharts/latest/fusioncharts.charts.js"></script>
<script src="https://cdn.fusioncharts.com/fusioncharts/latest/themes/fusioncharts.theme.fusion.js"></script>

<!-- UI Framework -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.15/dist/tailwind.min.css" />
<link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.1.1/flowbite.min.css" rel="stylesheet" />
```

## Configuration Options

### Chart Configuration
- **Type**: `mscombi2d` (multi-series combination 2D)
- **Height**: 350px (matching ApexCharts)
- **Width**: 100% (responsive)
- **Theme**: Dynamic based on dark/light mode

### Data Series Configuration
- **Client Data**: Column chart with custom colors
- **Peer Lines**: Line charts with consistent styling
- **Visibility**: Configurable visibility for each series
- **Colors**: Theme-aware color palette

### Benchmark Configuration
- **Lines**: Horizontal trendlines at specified values
- **Labels**: Dynamic labeling based on benchmark values
- **Colors**: Distinct colors for different benchmarks
- **Tooltips**: Formatted tooltips with value information

## Browser Compatibility

- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **Mobile Support**: Responsive design with touch interactions
- **Theme Detection**: Automatic dark/light mode detection
- **Fallbacks**: Graceful degradation for older browsers

## Performance Considerations

- **CDN Loading**: Fast loading from global CDN networks
- **Minified Libraries**: Production-ready minified versions
- **Efficient Rendering**: Optimized for large datasets
- **Memory Management**: Proper cleanup of chart instances

## Integration Notes

### With Existing Quickbase System
1. Use the same data processing functions from `CreateCharts.js`
2. Maintain the same data structure format
3. Leverage existing theme system
4. Use consistent color schemes and styling

### With DisplayCharts.js
1. Replace ApexCharts instances with FusionCharts
2. Update chart creation calls to use `createCustomFusionChart`
3. Maintain the same event handling and data flow
4. Preserve all existing functionality and user interactions

## Future Enhancements

- **Animation Support**: Smooth transitions between data updates
- **Export Functionality**: PDF and image export capabilities
- **Advanced Interactions**: Zoom, pan, and drill-down features
- **Real-time Updates**: Live data streaming capabilities
- **Accessibility**: Enhanced screen reader and keyboard navigation support
