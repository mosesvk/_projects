# Cost of Contributions Detail View Chart - Technical Reference

## Overview

The `costOfContributionsDetailView_chart` is a mixed chart displaying:
- **Bar Series (2)**: Fundraising Expenses (blue), Total Contributions (green)
- **Line Series (2)**: Client Cost Ratio (red), Peer Average Ratio (grey)

It uses **dual y-axes**:
- **Left Y-Axis (axes 0 & 1)**: Dollar values for bar series
- **Right Y-Axis (axes 2 & 3)**: Ratio values for line series

---

## Issues Encountered & Solutions

### Issue 1: Missing Data Label on First Bar (2 Years Selected)

**Problem**: When exactly 2 years were selected, the first bar's data label (Fundraising Expenses, first year) would not display. Labels showed correctly for 1 year, 3+ years.

**Root Cause**: The chart was configured with `chart.type: "line"` as the primary type. ApexCharts has a rendering bug where mixed charts with `type: "line"` as primary don't properly render data labels for bar series at certain category counts.

**Solution**: Changed `chart.type` from `"line"` to `"bar"` in `chartConfigFactory.js`:

```javascript
chart: {
  height: 550,
  type: "bar",  // Changed from "line" to "bar"
  stacked: false,
  // ...
}
```

**File**: `src/charts/chartConfigFactory.js` → `createCostOfContributionsConfig()`

---

### Issue 2: Uneven Y-Axis Labels (1-2 Years vs 3+ Years)

**Problem**: When 1-2 years were selected, the y-axis displayed uneven values like `$3M, $2M, $750K, $0`. When 3+ years were selected, it showed clean values like `$4M, $3M, $2M, $1M, $0`.

**Root Cause**: The `_calculateNiceYAxisTicks()` function was calculating `tickAmount` that didn't align with the nice step size. For example:
- Max value ~$2.2M → niceMax = $3M, numIntervals = 3
- ApexCharts would then divide 3M by a different number, producing `$750K` increments

**Solution**: Modified `_calculateNiceYAxisTicks()` to ensure at least 4 intervals by extending `niceMax`:

```javascript
// Ensure at least 4 intervals by extending niceMax if needed
if (numIntervals < 4) {
  niceMax = niceMin + (niceStep * 4);
  numIntervals = 4;
}
```

This ensures both 1-2 years and 3+ years produce consistent y-axis labels like `$0, $1M, $2M, $3M, $4M`.

**File**: `src/charts/chartConfigFactory.js` → `_calculateNiceYAxisTicks()`

---

### Issue 3: Y-Axis Corrupted After Printing/Export

**Problem**: When the chart was exported to base64 for printing, the restoration process corrupted the y-axis. The printed image looked correct, but the application chart showed wrong y-axis values afterward.

**Root Cause**: 
1. ApexCharts `updateOptions()` recalculates y-axis internally even with `forceNiceScale: false`
2. Formatter functions couldn't be serialized/deserialized properly
3. The saved `min`, `max`, `tickAmount` values weren't being applied forcefully enough

**Solution**: Multi-layered fix in `print_base64.js`:

#### A. Save axis values in chart globals (during chart creation):
```javascript
// In chartConfigFactory.js - mounted event
events: {
  mounted: function(chart) {
    chart.w.globals.axisValues = axisValues;
    chart.w.globals.numType = numType;
  }
}
```

#### B. Save axis values during export:
```javascript
// In print_base64.js - saveCompleteChartState()
const axisValues = chart.w.globals.axisValues || null;
// ... save to originalConfig
```

#### C. Force axis values during restoration:
```javascript
// In print_base64.js - restoreCompleteChartState()
if (chartId === "costOfContributionsDetailView_chart" && originalState.axisValues) {
  const { dollarAxis, ratioAxis } = originalState.axisValues;
  
  // Directly modify internal config
  chart.w.config.yaxis[0].min = dollarAxis.min;
  chart.w.config.yaxis[0].max = dollarAxis.max;
  chart.w.config.yaxis[0].tickAmount = dollarAxis.tickAmount;
  chart.w.config.yaxis[0].forceNiceScale = false;
  // ... repeat for all 4 y-axes
  
  // Also set globals.yAxisScale
  chart.w.globals.yAxisScale = [
    { min: dollarAxis.min, max: dollarAxis.max, niceMin: dollarAxis.min, niceMax: dollarAxis.max },
    // ... for all 4 axes
  ];
}
```

**Files**: 
- `src/charts/chartConfigFactory.js` → `createCostOfContributionsConfig()`
- `src/utils/print_base64.js` → `saveCompleteChartState()`, `restoreCompleteChartState()`

---

## Key Configuration Details

### Chart Type
```javascript
chart: {
  type: "bar"  // MUST be "bar" not "line" for data labels to work on all bar series
}
```

### Data Labels
```javascript
dataLabels: {
  enabled: true,
  enabledOnSeries: [0, 1, 2, 3],  // Enable on ALL series
  offsetY: -25,  // Spacing above bars/points
  // ...
}
```

### Y-Axis Structure
The chart has 4 y-axes:
- **Axis 0**: Dollar axis (visible, left side) - for Fundraising Expenses
- **Axis 1**: Dollar axis (hidden) - for Total Contributions (shares scale with axis 0)
- **Axis 2**: Ratio axis (visible, right side) - for Client ratio
- **Axis 3**: Ratio axis (hidden) - for Peer Average ratio (shares scale with axis 2)

```javascript
yaxis: [
  { /* axis 0 - dollar, visible */ min, max, tickAmount, labels: { formatter } },
  { /* axis 1 - dollar, hidden */ show: false, min, max, tickAmount },
  { /* axis 2 - ratio, visible */ min, max, tickAmount, labels: { formatter } },
  { /* axis 3 - ratio, hidden */ show: false, min, max, tickAmount }
]
```

### Axis Values Storage
Axis values are stored in `chart.w.globals.axisValues` for persistence:
```javascript
const axisValues = {
  dollarAxis: { min, max, tickAmount },
  ratioAxis: { min, max, tickAmount }
};
```

---

## Important Gotchas & Lessons Learned

### 1. Chart Type Matters for Mixed Charts
When creating mixed bar/line charts, set `chart.type` to the **dominant** series type. Using `"line"` as the primary type caused data label rendering issues for bar series.

### 2. tickAmount Must Match Step Intervals
ApexCharts `tickAmount` represents the **number of intervals** (not number of labels). If you set `min: 0, max: 4000000, tickAmount: 4`, you get ticks at `0, 1M, 2M, 3M, 4M` (5 labels, 4 intervals).

**Formula**: `tickAmount = (max - min) / stepSize`

### 3. forceNiceScale Isn't Always Respected
Even with `forceNiceScale: false`, ApexCharts may recalculate the axis during `updateOptions()`. To truly force values:
- Modify `chart.w.config.yaxis[i]` directly
- Set `chart.w.globals.yAxisScale` to match

### 4. Formatters Can't Be Serialized
When saving chart state, formatter functions are lost. They must be recreated during restoration:
```javascript
// Create new formatter during restore
const dollarFormatter = function(value) {
  // ... formatting logic
};
```

### 5. Removed Updated Event
Originally there was an `updated` event that called `chart.updateOptions()`. This interfered with restoration and was removed:
```javascript
events: {
  mounted: function(chart) { /* ... */ },
  // REMOVED: updated event - caused interference with print restoration
}
```

---

## File Locations

| File | Purpose |
|------|---------|
| `src/charts/chartConfigFactory.js` | Chart configuration, y-axis calculation |
| `src/utils/print_base64.js` | Save/restore chart state for printing |
| `src/charts/chartIndex.js` | Chart initialization and management |

---

## Debugging Tips

### Check Axis Values
```javascript
// In browser console after chart renders
const chart = ApexCharts.getChartByID("costOfContributionsDetailView_chart");
console.log("Config yaxis:", chart.w.config.yaxis);
console.log("Globals axisValues:", chart.w.globals.axisValues);
console.log("Globals yAxisScale:", chart.w.globals.yAxisScale);
```

### Verify tickAmount Calculation
```javascript
// The _calculateNiceYAxisTicks logs its output
// Check console for: { minValue, maxValue, niceMin, niceMax, niceStep, numIntervals }
```

### Test All Year Selections
Always test with:
- 1 year selected
- 2 years selected
- 3 years selected
- 4+ years selected

The y-axis should look consistent across all selections.

---

## Version History

| Date | Change | Issue |
|------|--------|-------|
| 2024-12-31 | Changed `chart.type` from `"line"` to `"bar"` | Missing data label on first bar (2 years) |
| 2024-12-31 | Fixed `_calculateNiceYAxisTicks()` to ensure 4+ intervals | Uneven y-axis labels (1-2 years) |
| 2024-12-31 | Added aggressive y-axis restoration in `print_base64.js` | Y-axis corrupted after printing |
| 2024-12-31 | Removed `updated` event from chart config | Interference with print restoration |

