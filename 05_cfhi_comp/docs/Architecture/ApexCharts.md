# ApexCharts System Architecture

This document explains how the CFHI Comprehensive Dashboard uses ApexCharts to visualize financial data, including how data flows from storage to rendered charts.

## Overview

ApexCharts is the primary charting library used for data visualization. It's loaded from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
```

## Chart Flow Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  localStorage   │────▶│  DisplayCharts  │────▶│  CreateCharts   │────▶│   ApexCharts    │
│  (data)         │     │  (component fn) │     │  (config gen)   │     │   (render)      │
└─────────────────┘     └─────────────────┘     └─────────────────┘     └─────────────────┘
```

## Key Files

| File | Purpose |
|------|---------|
| `src/content/DisplayCharts.js` | Component display functions, benchmark text content |
| `src/content/CreateCharts.js` | Chart configuration generation, benchmark mappings |
| `src/functions/Utility.js` | Helper functions for chart creation |

## Chart Creation Process

### Step 1: Data Retrieval

Each display component retrieves its data category from localStorage:

```javascript
// DisplayCharts.js
const displayCashComponent = () => {
  const savedData = getStoredData("cashData");
  const parseData = parseStoredData(savedData);
  
  // Create charts with parsed data
  createChartFromParsedData(parseData, ...);
};
```

### Step 2: Chart Creation Function

The `createChartFromParsedData` function bridges data to chart configuration:

```javascript
// Utility.js
const createChartFromParsedData = (
  parsedData,
  chart,          // Chart DOM element ID
  peer,           // Peer data key suffix
  client,         // Client data key suffix
  type,           // "number", "dollar", "percent"
  fixedNum,       // Decimal places
  mainName,       // Field identifier
  benchmark,      // Benchmark values array
  title,          // Chart title
  wa = null       // Weighted average flag
) => {
  if (parsedData) {
    createChart(
      chart,
      parsedData[peer],
      parsedData[client],
      type,
      fixedNum,
      mainName,
      benchmark,
      title,
      wa,
      parsedData
    );
  }
};
```

### Step 3: Configuration Generation

The `getMainChartOptions` function in `CreateCharts.js` generates the ApexCharts configuration:

```javascript
const getMainChartOptions = (
  dataPeer,
  dataClient,
  numType,        // "number", "dollar", "percent"
  fixedNum,       // Decimal places
  mainName,       // Field name for benchmark lookup
  benchmark,      // Benchmark values
  title,          // Chart title
  chartId,        // DOM element ID
  wa,             // Weighted average flag
  allData         // Full dataset for calculations
) => {
  // ... generates configuration object
};
```

### Step 4: Chart Rendering

The chart is rendered using ApexCharts:

```javascript
// Utility.js
const createChart = (chartId, dataPeer, dataClient, type, fixedNum, mainName, benchmark, title, wa, allData) => {
  document.getElementById(chartId).innerHTML = "";
  
  const chartOptions = getMainChartOptions(
    dataPeer,
    dataClient,
    type,
    fixedNum,
    mainName,
    benchmark,
    title,
    chartId,
    wa,
    allData
  );
  
  if (!chartOptions) {
    console.warn(`Cannot create chart ${chartId} - invalid chart options`);
    return;
  }
  
  // Create and render chart
  const chart = new ApexCharts(document.getElementById(chartId), chartOptions);
  chart.render();
  
  // Store chart instance globally for later updates
  window[chartId] = chart;
};
```

## Chart Types

### Mixed Column + Line Chart

The primary chart type combines:
- **Column (Bar)**: Client data values
- **Lines**: Peer comparison data (Average, 25th, 50th, 75th percentiles)

```javascript
const series = [
  {
    name: firmName,        // Client organization name
    type: "column",
    data: clientArray,
  },
  {
    name: "Avg",
    type: "line",
    data: peerAvg,
  },
  {
    name: "25th",
    type: "line",
    data: peer25,
  },
  {
    name: "50th",
    type: "line",
    data: peerMid,
  },
  {
    name: "75th",
    type: "line",
    data: peer75,
  },
];
```

## Benchmark System

### Centralized Benchmark Mapping

Benchmarks are centralized in `CreateCharts.js` using the `getBenchmarksForField` function:

```javascript
window.getBenchmarksForField = function getBenchmarksForField(fieldName) {
  const map = {
    // Cash benchmarks
    daysExpendableNetAssets: [30, 60],      // Range: 30-60 days
    daysOperatingCash: [40, 80],            // Range: 40-80 days
    liquidityRatio: [5],                    // Single threshold
    netCashAvailability: null,              // No benchmark
    
    // Debt benchmarks
    debtToContributionsWithout: [2],
    currentRatio: [2],
    cashFlowsFromOperatingActivities: [0],
    debtCoverage: [1.15],
    
    // Expense benchmarks
    personnelToCashExpenditure: [40, 55],   // Range: 40-55%
    mandatoryDebtServiceToCashExpenditure: [15],
  };
  
  return Object.prototype.hasOwnProperty.call(map, fieldName)
    ? map[fieldName]
    : null;
};
```

### Benchmark Types

| Type | Array Format | Display |
|------|--------------|---------|
| Range | `[low, high]` | Two horizontal lines + shaded region |
| Threshold | `[value]` | Single horizontal line |
| None | `null` | No annotation |

### Benchmark Annotations

Benchmarks are rendered as y-axis annotations:

```javascript
if (Array.isArray(benchmark)) {
  const benchmarkAnnotations = benchmark.map((value, index) => ({
    id: `annotation_${index}`,
    y: value,
    borderColor: chartColors.labelColor,
    strokeDashArray: 0,
    width: "100%",
    label: {
      text: getBenchmarkLabel(mainName, benchmark, index),
      position: "left",
      offsetX: -50,
      style: {
        background: "transparent",
        color: chartColors.labelColor,
        fontSize: "16px",
        fontWeight: 600,
      },
    },
  }));
  
  // Add shaded region between two benchmarks
  if (benchmark.length === 2) {
    benchmarkAnnotations.push({
      y: Math.min(...benchmark),
      y2: Math.max(...benchmark),
      fillColor: isDarkMode ? '#374151' : window.chartColors.green,
      opacity: 0.15,
    });
  }
}
```

### Benchmark Labels

Labels are dynamically generated based on whether higher or lower values are better:

```javascript
window.getBenchmarkLabel = function getBenchmarkLabel(fieldName, benchmarkArray, index) {
  if (benchmarkArray.length === 1) {
    return "Benchmark";
  }
  
  const isHigherBetter = isFieldHigherBetter(fieldName);
  const lowerValue = Math.min(...benchmarkArray);
  const higherValue = Math.max(...benchmarkArray);
  const currentValue = benchmarkArray[index];
  
  if (isHigherBetter) {
    return currentValue === higherValue 
      ? "Benchmark - higher end" 
      : "Benchmark - lower end";
  } else {
    return currentValue === lowerValue 
      ? "Benchmark - higher end" 
      : "Benchmark - lower end";
  }
};
```

## Theme Support

Charts support dark/light theme switching:

```javascript
const isDarkMode = document.documentElement.classList.contains("dark");

const chartColors = isDarkMode
  ? {
      borderColor: "#6B7280",
      labelColor: "#F9FAFB",
      lineColor: "#E5E7EB",
      opacityFrom: 0,
      opacityTo: 0.15,
    }
  : {
      borderColor: "#F3F4F6",
      labelColor: "#6B7280",
      lineColor: "#3a464f",
      opacityFrom: 0.45,
      opacityTo: 0,
    };
```

### Global Color Palette

Colors are defined globally in `Index.html`:

```javascript
window.chartColors = {
  green: "#83b240",
  chartGreen: "#88C428",
  blue: "#326eaa",
  darkBlue: "#00588D",
  grey: "#43505a",
  red: "#ff6384",
  orange: "#CD5A2C",
  yellow: "#EDAB20",
  purple: "#723682",
  // ... more colors
};
```

## Y-Axis Scaling

The system includes sophisticated y-axis scaling logic:

```javascript
// Smart y-axis calculation based on data range
const allDataValues = [...clientArray, ...peerAvg, ...peerMid, ...peer25, ...peer75, ...(benchmark || [])];
const dataMin = Math.min(...allDataValues);
const dataMax = Math.max(...allDataValues);
const dataRange = dataMax - dataMin;

// Handle negative values
if (dataMin < 0) {
  const absMax = Math.max(Math.abs(dataMin), Math.abs(dataMax));
  yaxisMin = -roundedMagnitude;
  yaxisMax = roundedMagnitude;
} else {
  yaxisMin = 0;
  // Calculate appropriate max based on range...
}
```

### Scale Categories

| Value Range | Rounding Strategy | Example |
|-------------|-------------------|---------|
| ≤ 10 | 0.5 increments | 2.0, 2.5, 3.0 |
| 10-100 | Nearest 10 | 20, 30, 40 |
| 100-1K | Nearest 100 | 200, 300, 400 |
| 1K-10K | Nearest 1K | 2K, 3K, 4K |
| 10K-100K | Nearest 10K | 20K, 30K |
| 100K-1M | Nearest 100K | 200K, 300K |
| 1M+ | Nearest 1M or 2M | 2M, 4M, 6M |

## Data Labels

Data labels show client values on bar columns:

```javascript
dataLabels: {
  enabled: true,
  enabledOnSeries: [0],  // Only on client bars
  offsetY: -20,
  formatter: tooltipFormatter,
  style: {
    fontSize: "20px",
    fontFamily: "Helvetica, Arial, sans-serif",
    fontWeight: "bold",
    colors: ["#ffffff"],
  },
  background: {
    enabled: true,
    foreColor: isDarkMode ? "#1F2937" : window.chartColors.green,
    padding: 4,
    borderRadius: 2,
  },
},
```

## Number Formatting

### Tooltip Formatter

```javascript
const tooltipFormatter = (value) => {
  if (!value) return;
  const formattedValue = value.toLocaleString();
  if (numType === "dollar") {
    return `$${formattedValue}`;
  } else if (numType === "percent") {
    return `${formattedValue}%`;
  } else {
    return formattedValue;
  }
};
```

### Y-Axis Formatter

The y-axis formatter handles various scales and prefixes:

```javascript
const yaxisLabelFormatter = (value) => {
  if (absValue >= 1000000) {
    return `${Math.round(absValue / 1000000)}M`;
  } else if (absValue >= 1000) {
    return `${Math.round(absValue / 1000)}K`;
  }
  // ... more cases
  
  if (numType === "dollar") {
    return `$${formattedValue}`;
  } else if (numType === "percent") {
    return `${formattedValue}%`;
  }
  return formattedValue;
};
```

## Peer Data Calculations

### Data Array Generation

The `getPeerAndClientChartDataArrays` function calculates peer statistics:

```javascript
const getPeerAndClientChartDataArrays = (
  selectedYearsArray,
  dataPeer,
  dataClient,
  fixedNum,
  mainName,
  benchmark,
  numType,
  wa,
  allData
) => {
  // Returns:
  return {
    clientArray,  // Client values per year
    peerAvg,      // Peer average per year
    peerMid,      // Peer median (50th percentile)
    peer25,       // 25th percentile
    peer75,       // 75th percentile
  };
};
```

### Weighted Averages

For certain metrics, weighted averages are calculated:

```javascript
if (wa) {
  avg = getWeightedAverageOfArray(data, name);
} else {
  avg = getAverageOfArray(peer[dataArray], name);
}
```

## Display Components

Each data category has a display function:

```javascript
// Demographics
const displayDemoComponent = () => {
  const savedData = getStoredData("demoData");
  const parseData = parseStoredData(savedData);
  
  createChartFromParsedData(
    parseData,
    "givingUnits_chart",
    "givingUnits_Peer",
    "givingUnits_Client",
    "number",
    0,
    "givingUnits",
    getBenchmarksForField("givingUnits"),
    "Giving Units",
    null
  );
};

// Cash
const displayCashComponent = () => { ... };

// Debt  
const displayDebtComponent = () => { ... };

// Income
const displayIncomeComponent = () => { ... };

// Expense
const displayExpenseComponent = () => { ... };
```

## "What Does This Mean" Content

Each chart section includes explanatory text defined in `DisplayCharts.js`:

```javascript
const daysExpendable_whatDoesThisMean = [
  `This ratio tells how many days of operating expenses are available...`,
  `The term expendable net assets represents...`,
  `To improve this ratio over the long term...`,
];

createWhatDoesThisMean(daysExpendable_whatDoesThisMean, "row_daysExpendableNetAssets");
```

## Chart Instance Management

Chart instances are stored globally for updates:

```javascript
// Store chart instances
window.daysExpendableNetAssets_chart = null;
window.liquidityRatio_chart = null;
// ... etc

// Update existing chart or create new
if (window.daysExpendableNetAssets_chart) {
  window.daysExpendableNetAssets_chart.updateOptions(chartOptions);
} else {
  const chart = new ApexCharts(element, chartOptions);
  chart.render();
  window.daysExpendableNetAssets_chart = chart;
}
```

## Annotation Positioning

Custom logic ensures annotations align with chart grid:

```javascript
const chartEvents = {
  beforeMount: function(chartContext, config) {
    setTimeout(() => {
      const chartElement = document.getElementById(chartId);
      const gridLine = chartElement.querySelector('.apexcharts-gridlines-horizontal line');
      const annotationLine = chartElement.querySelector('.apexcharts-yaxis-annotations line');
      
      // Align annotation to grid
      const x1 = gridLine.getAttribute("x1");
      const x2 = gridLine.getAttribute("x2");
      annotationLine.setAttribute("x1", x1);
      annotationLine.setAttribute("x2", x2);
    }, 200);
  },
};
```

## Chart IDs

All chart IDs follow a consistent pattern:

```javascript
const chartIds = [
  "givingUnits_chart",
  "givingUnitsToStaff_chart",
  "daysExpendableNetAssets_chart",
  "daysOperatingCash_chart",
  "cashFlowsFromOperatingActivities_chart",
  "liquidityRatio_chart",
  "netCashAvailability_chart",
  "debtToContributionsWithout_chart",
  "currentRatio_chart",
  "mandatoryDebtServiceToContributionsWithout_chart",
  "debtPerGivingUnit_chart",
  "debtCoverage_chart",
  "netIncomeRatio_chart",
  "contributionsWithoutDonorPerGivingUnit_chart",
  "totalContributionsPerGivingUnit_chart",
  "benefitsToSalaries_chart",
  "salariesBenefitsIncludingOutsourcedEmployees_chart",
  "personnelToCashExpenditure_chart",
  "cashExpendituresPerGivingUnit_chart",
];
```

## Best Practices

1. **Always check for null data** before creating charts
2. **Use `getBenchmarksForField`** for consistent benchmark handling
3. **Store chart instances** for later updates
4. **Handle theme changes** by updating chart options
5. **Use appropriate number formatting** based on data type

