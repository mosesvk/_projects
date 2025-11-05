# Weighted Average Implementation Fix

## Problem
The `printExcel.js` was using simple averages for ALL fields, but many fields require weighted averages to match the display in `Report.js`. This caused discrepancies between what users see in the report and what gets sent to Quickbase.

## Solution
Updated `printExcel.js` to match the exact logic from `Report.js` for calculating averages:
- Fields with "wa" flag → Use `getWeightedAverageOfArray()`
- Fields without "wa" flag → Use `getAverageOfArray()` or simple average

## Changes Made

### 1. Updated Field Mappings Structure
**File**: `src/functions/printExcel.js`

Changed from:
```javascript
[metricName, [AVG, MIN, MID, MAX], begin, end, category]
```

To:
```javascript
[metricName, [AVG, MIN, MID, MAX], category, useWeightedAvg]
```

### 2. Marked Fields with Weighted Average Flag
Based on `Report.js`, the following fields now use weighted averages:

#### Demo Data (demoData)
- `givingUnitsToStaff` ✓ wa
- `percentContributionsOnline` ✓ wa

#### Cash Data (cashData)
- `daysExpendableNetAssets` ✓ wa
- `daysOperatingCash` ✓ wa
- `liquidityRatio` ✓ wa

#### Debt Data (debtData)
- `debtToContributionsWithout` ✓ wa
- `currentRatio` ✓ wa
- `mandatoryDebtServiceToContributionsWithout` ✓ wa
- `debtPerGivingUnit` ✓ wa
- `debtPerGivingUnit_standard` ✓ wa
- `debtCoverage` ✓ wa

#### Income Data (incomeData)
- `netIncomeRatio` ✓ wa

#### Expense Data (expenseData)
- `benefitsToSalaries` ✓ wa
- `salaries` ✓ wa
- `benefits` ✓ wa
- `salariesBenefits` ✓ wa
- `salariesBenefitsIncludingOutsourcedEmployees` ✓ wa
- `personnelToCashExpenditure` ✓ wa
- `mandatoryDebtServiceToCashExpenditure` ✓ wa
- `personnelIncludingToTotalCashExpenditures` ✓ wa
- `totalGlobalAndLocalOutreachExpenses` ✓ wa
- `cashExpendituresPerGivingUnit` ✓ wa

#### Additional Data (additionalData)
- `contributionsPerAccountingFTE` ✓ wa
- `expensesPerAccountingFTE` ✓ wa

### 3. Updated `calculateStatistics()` Method
**File**: `src/functions/printExcel.js` (lines 248-324)

Added logic to match `Report.js` exactly:

```javascript
calculateStatistics(data, metricName, useWeightedAvg = false) {
  // ... existing _Stats check ...
  
  // Average calculation - matches Report.js logic exactly
  if (useWeightedAvg && typeof getWeightedAverageOfArray === "function") {
    // Use weighted average for fields marked with "wa" flag
    avg = getWeightedAverageOfArray(data, metricName, null);
  } else if (typeof getAverageOfArray === "function") {
    // Use simple average for fields without "wa" flag
    avg = getAverageOfArray(values, metricName);
  } else {
    // Fallback manual calculation
    avg = values.reduce((sum, val) => sum + Number(val), 0) / values.length;
  }
  
  // ... percentile calculations remain the same ...
}
```

### 4. Updated `generateMetricsXml()` Method
**File**: `src/functions/printExcel.js` (line 665, 708)

Changed parameter destructuring to include weighted average flag:
```javascript
const [metricName, fieldIds, category, useWeightedAvg] = mapping;
const stats = this.calculateStatistics(dataObject, metricName, useWeightedAvg);
```

## Verification Steps

1. **Clear browser cache** and reload the application
2. **Generate a new report** for a client
3. **Check console logs** - you should see:
   ```
   📊 Calculating stats for givingUnitsToStaff, 245 values, useWeightedAvg: true
     AVG (weighted): 123.45
   
   📊 Calculating stats for givingUnits, 245 values, useWeightedAvg: false
     AVG (simple via function): 678.90
   ```
4. **Verify XML payload** - AVG fields should now have proper values
5. **Download Excel/PDF** - Reports should match the displayed data

## Reference Files
- **Source of Truth**: `src/components/Report.js` (lines 13-128)
- **International Reference**: `src/intl/intlReport.js` (lines 136-219)
- **Field IDs**: `src/printTableFields.md`

## Expected Behavior
- Fields marked with "wa" in `Report.js` now use weighted averages in Quickbase export
- Fields without "wa" use simple averages
- All AVG values should be populated (no empty strings)
- Excel/PDF reports should match the displayed report data

