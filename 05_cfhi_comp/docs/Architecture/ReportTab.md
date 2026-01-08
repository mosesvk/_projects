# Report Tab Architecture

This document explains how the Report Tab works in the CFHI Comprehensive Dashboard, including data retrieval, transformation, table generation, and benchmark visualization.

## Overview

The Report Tab displays a comprehensive tabular view of all financial metrics, allowing users to see exact values and peer comparisons in a structured format.

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  localStorage   │────▶│   Report.js     │────▶│   HTML Tables   │
│  (all data)     │     │  (processing)   │     │  (display)      │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## Key File

**`src/components/Report.js`** - Contains all report generation logic

## Report Component Entry Point

```javascript
const displayReportComponent = () => {
  // 1. Retrieve all data categories from localStorage
  const demoData = JSON.parse(localStorage.getItem("demoData"));
  const cashData = JSON.parse(localStorage.getItem("cashData"));
  const debtData = JSON.parse(localStorage.getItem("debtData"));
  const incomeData = JSON.parse(localStorage.getItem("incomeData"));
  const expenseData = JSON.parse(localStorage.getItem("expenseData"));
  const additionalData = JSON.parse(localStorage.getItem("additionalData"));

  // 2. Get selected years
  const selectedYears = getSelectedYearsFromLocalStorage();

  if (selectedYears) {
    // 3. Add year columns to table headers
    addYearColumnsToReportTable(selectedYears);
    
    // 4. Insert data into each category's table section
    insertDataToReport(demoData, selectedYears, [...]);
    insertDataToReport(cashData, selectedYears, [...]);
    insertDataToReport(debtData, selectedYears, [...]);
    insertDataToReport(incomeData, selectedYears, [...]);
    insertDataToReport(expenseData, selectedYears, [...]);
    insertDataToReport(additionalData, selectedYears, [...]);
    
    // 5. Process formatting and benchmarks
    processTHElements();
    processBenchmarkParagraphs();
  }
};
```

## Data Configuration Format

Each metric is configured with an array of parameters:

```javascript
insertDataToReport(cashData, selectedYears, [
  ["daysExpendableNetAssets", "num", 0, "wa", "cb"],
  ["daysOperatingCash", "num", 0, "wa", "cb"],
  ["cashFlowsFromOperatingActivities", "dollar", 0, null, "cb"],
  ["liquidityRatio", "num", 1, "wa", "cb"],
  ["netCashAvailability", "dollar", 0, null, "cb"],
]);
```

### Parameter Structure

| Index | Parameter | Description | Values |
|-------|-----------|-------------|--------|
| 0 | Field Name | Key for data lookup | String (e.g., "daysExpendableNetAssets") |
| 1 | Type | Number formatting | "num", "dollar", "percent" |
| 2 | Fixed Decimals | Decimal places | Integer (0, 1, 2) |
| 3 | Weighted Average | Use weighted avg for peer | "wa" or null |
| 4 | Color Benchmark | Apply benchmark coloring | "cb" or undefined |

### Complete Data Categories

#### Demographics (`demoData`)

```javascript
insertDataToReport(demoData, selectedYears, [
  ["givingUnits", "num", 0],
  ["fullTimeEquivalent", "num", 0],
  ["givingUnitsToStaff", "num", 0, "wa", "cb"],
  ["contributionsWithoutDonorExcludingLargeGifts", "dollar", 0],
  ["totalContributionsExclude", "dollar", 0],
  ["percentContributionsOnline", "percent", 0, "wa"],
  ["totalOutsourcedEmployees", "num", 0],
  ["facilitySquareFootage", "num", 0],
  ["numberOfLocations", "num", 0],
]);
```

#### Cash (`cashData`)

```javascript
insertDataToReport(cashData, selectedYears, [
  ["daysExpendableNetAssets", "num", 0, "wa", "cb"],
  ["daysOperatingCash", "num", 0, "wa", "cb"],
  ["cashFlowsFromOperatingActivities", "dollar", 0, null, "cb"],
  ["liquidityRatio", "num", 1, "wa", "cb"],
  ["netCashAvailability", "dollar", 0, null, "cb"],
]);
```

#### Debt (`debtData`)

```javascript
insertDataToReport(debtData, selectedYears, [
  ["debtToContributionsWithout", "num", 1, "wa", "cb"],
  ["currentRatio", "num", 1, "wa", "cb"],
  ["mandatoryDebtServiceToContributionsWithout", "percent", 0, "wa", "cb"],
  ["debtPerGivingUnit", "dollar", 0, "wa", "cb"],
  ["debtCoverage", "num", 2, "wa", "cb"],
]);
```

#### Income (`incomeData`)

```javascript
insertDataToReport(incomeData, selectedYears, [
  ["netIncomeRatio", "percent", 0, "wa", "cb"],
  ["netIncomeRatio_twoYrAvg", "percent", 0, null, "cb"],
  ["contributionsWithoutDonorPerGivingUnit", "dollar", 0, "wa"],
  ["contributionsWithoutDonorPerGivingUnit_percentChange", "percent", 0, null, "cb"],
  ["totalContributionsPerGivingUnit", "dollar", 0, "wa", "cb"],
  ["totalContributionsPerGivingUnit_percentChange", "percent", 0, null, "cb"],
]);
```

#### Expense (`expenseData`)

```javascript
insertDataToReport(expenseData, selectedYears, [
  ["benefitsToSalaries", "percent", 0, "wa"],
  ["salaries", "dollar", 0, "wa"],
  ["benefits", "dollar", 0, "wa"],
  ["salariesBenefits", "dollar", 0, "wa"],
  ["salariesBenefitsIncludingOutsourcedEmployees", "dollar", 0, "wa"],
  ["personnelToCashExpenditure", "percent", 0, "wa", "cb"],
  ["mandatoryDebtServiceToCashExpenditure", "percent", 0, "wa", "cb"],
  ["cashExpendituresPerGivingUnit", "dollar", 0, "wa"],
]);
```

## Table Structure

### HTML Row IDs

Each data row has a specific ID pattern: `row_{fieldName}`

```html
<tr id="row_daysExpendableNetAssets">
  <th>Days of Expendable Net Assets</th>
  <!-- Year columns inserted dynamically -->
  <!-- Peer columns: Avg, 25th, 50th, 75th -->
</tr>
```

### Table Header Pattern

Each table has a header row with ID: `{category}_tableHeader`

```html
<tr id="cashData_tableHeader">
  <th>Metric</th>
  <!-- Year columns added dynamically -->
  <th>Avg</th>
  <th>25th</th>
  <th>50th</th>
  <th>75th</th>
</tr>
```

## Data Insertion Flow

### Main Insert Function

```javascript
const insertDataToReport = (data, selectedYears, arrayOfNames) => {
  if (data && selectedYears) {
    addTotalDataToEveryRow(data, selectedYears, arrayOfNames);
  }
};
```

### Row Population

```javascript
const addTotalDataToEveryRow = (data, selectedYears, arrayOfNames) => {
  for (let name of arrayOfNames) {
    addToSingleRow(
      selectedYears,
      name[0],    // Field name
      data,       // Full data object
      data[`${name[0]}_Client`],  // Client data
      data[`${name[0]}_Peer`],    // Peer data
      name[1],    // Type (num/dollar/percent)
      name[2],    // Fixed decimals
      name[3],    // Weighted average flag
      name[4]     // Color benchmark flag
    );
  }
};
```

### Single Row Processing

```javascript
const addToSingleRow = (
  selectedYears,
  name,
  data,
  client,
  peer,
  type,
  fixedNum,
  wa,
  cb
) => {
  const tableReportRow = document.getElementById(`row_${name}`);
  
  // Clear existing data columns
  while (tableReportRow.children.length > 1) {
    tableReportRow.removeChild(tableReportRow.children[1]);
  }
  
  // Add client data for each year
  addClientDataToReportRow(
    tableReportRow,
    selectedYears,
    client,
    type,
    fixedNum,
    cb
  );
  
  // Add peer statistics
  addPeerDataToRow(
    tableReportRow,
    peer,
    type,
    fixedNum,
    "total",
    wa,
    name,
    data
  );
};
```

## Client Data Display

```javascript
const addClientDataToReportRow = (
  tableRow,
  selectedYears,
  client,
  type,
  fixedNum,
  cb
) => {
  const propClass = "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white opacity-80 justify-between border-r-2 dark:border-gray-600";
  
  selectedYears.forEach((year) => {
    const dataPoint = document.createElement("th");
    const text = client ? styleNumber(client[year].value, type, fixedNum) : "";
    
    // Create styled span
    const spanElement = document.createElement("span");
    spanElement.textContent = text;
    spanElement.classList.add("mr-2");
    
    // Wrap in flex div
    const divElement = document.createElement("div");
    divElement.classList.add("flex", "justify-between");
    divElement.appendChild(spanElement);
    
    dataPoint.appendChild(divElement);
    dataPoint.className = propClass;
    tableRow.appendChild(dataPoint);
  });
  
  // Apply benchmark colors if enabled
  if (cb) {
    let clientBenchmarkArray = getBenchmarks(client);
    getBackgroundColor(clientBenchmarkArray, tableRow);
  }
};
```

## Peer Data Calculations

```javascript
const addPeerDataToRow = (
  tableRow,
  peer,
  type,
  fixedNum,
  dataArray,
  wa,
  name,
  data
) => {
  // Skip peer calculations for certain fields
  const shouldSkipPeerData = name.endsWith('_percentChange') || name === 'netIncomeRatio_twoYrAvg';
  
  if (shouldSkipPeerData) {
    avg = ''; mid = ''; min = ''; max = '';
  } else {
    // Calculate statistics
    if (peer && wa) {
      avg = getWeightedAverageOfArray(data, name);
    } else if (peer) {
      avg = getAverageOfArray(peer[dataArray], name);
    }
    
    mid = peer ? getMidpointOfArray(peer[dataArray]) : '';
    min = peer ? get25thPercentileOfArray(peer[dataArray]) : '';
    max = peer ? get75thPercentileOfArray(peer[dataArray]) : '';
  }
  
  // Create cells for Avg, 25th, 50th, 75th
  const dataPointAvg = document.createElement("th");
  dataPointAvg.textContent = styleNumber(avg, type, fixedNum);
  tableRow.appendChild(dataPointAvg);
  
  // ... similar for 25th, 50th, 75th
};
```

## Year Column Management

### Adding Year Columns

```javascript
const addYearColumnsToReportTable = (years) => {
  const tables = document.querySelectorAll("table");
  
  tables.forEach((table) => {
    const trElements = table.querySelectorAll("tr");
    const trIds = Array.from(trElements)
      .map((tr) => tr.getAttribute("id"))
      .filter((id) => id && id.endsWith("_tableHeader"));
    
    trIds.forEach((idName) => {
      clearTableColumns(idName);
      addSingleNewColumnToReportTable(idName, years);
    });
  });
};
```

### Column Creation

```javascript
const addSingleNewColumnToReportTable = (tableHeader, yearsArray) => {
  const tableHeaderRow = document.getElementById(tableHeader);
  const avgTh = tableHeaderRow.children[1];  // Reference point
  
  yearsArray.forEach((year) => {
    const newTh = document.createElement("th");
    newTh.setAttribute("scope", "col");
    newTh.setAttribute("class", "px-6 py-3 text-lg");
    newTh.innerText = year;
    
    tableHeaderRow.insertBefore(newTh, avgTh);
  });
};
```

## Number Formatting

### styleNumber Function

```javascript
const styleNumber = (value, type, fixedNum) => {
  if (value === null || value === undefined || value === '') {
    return '';
  }
  
  const numValue = parseFloat(value);
  const formatted = numValue.toFixed(fixedNum).toLocaleString();
  
  if (type === "dollar") {
    return `$${formatted}`;
  } else if (type === "percent") {
    return `${formatted}%`;
  } else {
    return formatted;
  }
};
```

## Negative Number Handling

The `processTHElements` function converts negative numbers to accounting format:

```javascript
function processTHElements() {
  const rows = document.querySelectorAll('tr[id]');
  
  rows.forEach(row => {
    const thElements = row.querySelectorAll('th');
    
    thElements.forEach(th => {
      let textContent = th.textContent.trim();
      
      if (/\d/.test(textContent)) {
        if (textContent.includes("-")) {
          // Convert "-500" to "(500)"
          textContent = `(${textContent.replace("-", "")})`;
          th.textContent = textContent;
          
          // Apply red color styling
          th.classList.remove("text-gray-900", "dark:text-white");
          th.classList.add("text-red-500", "dark:text-red-400");
        }
      }
    });
  });
}
```

## Benchmark Color Coding

### Background Color Classes

| Rating | CSS Class | Color |
|--------|-----------|-------|
| Good | `.good` | Green (#74b574) |
| Warning | `.warning` | Yellow (#e8d166d1) |
| Action Required | `.actionRequired` | Red (#e68f96) |

### Color Application

```javascript
const getBackgroundColor = (benchmarkArray, tableRow) => {
  benchmarkArray.forEach((benchmark, index) => {
    const cell = tableRow.children[index + 1];  // Skip label column
    
    if (benchmark === 'Good') {
      cell.classList.add('good');
    } else if (benchmark === 'Warning') {
      cell.classList.add('warning');
    } else if (benchmark === 'Action') {
      cell.classList.add('actionRequired');
    }
  });
};
```

## Benchmark Paragraphs

The `processBenchmarkParagraphs` function populates modal explanations:

```javascript
function processBenchmarkParagraphs() {
  const modalInfoFields = [
    ["daysExpendableNetAssets", cashData, "#daysExpendableNetAssets-body-2 div"],
    ["daysOperatingCash", cashData, "#daysOperatingCash-body-2 div"],
    ["liquidityRatio", cashData, "#liquidityRatio-body-2 div"],
    // ... more fields
  ];
  
  const targetYear = selectedYears[0];
  
  modalInfoFields.forEach(([fieldName, dataSource, selector]) => {
    const targetElement = document.querySelector(selector);
    const benchmarkKey = `${fieldName}_benchmarkParagraph`;
    const benchmarkData = dataSource[benchmarkKey];
    
    if (benchmarkData && benchmarkData[targetYear]) {
      let benchmarkContent = benchmarkData[targetYear].value;
      benchmarkContent = addMb2ClassToPTags(benchmarkContent);
      targetElement.innerHTML = benchmarkContent;
    }
  });
}
```

### HTML Processing

```javascript
function addMb2ClassToPTags(htmlContent) {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;
  
  // Handle <br/> tags
  processContentNodes(tempDiv);
  
  // Style paragraphs
  const pTags = tempDiv.querySelectorAll('p');
  pTags.forEach(p => {
    applyParagraphStyling(p);
  });
  
  return tempDiv.innerHTML;
}

function applyParagraphStyling(pElement) {
  const standardClasses = 'mb-2 text-gray-500 dark:text-gray-400';
  
  if (!pElement.className) {
    pElement.className = standardClasses;
  } else {
    // Add missing classes
    if (!pElement.classList.contains('mb-2')) {
      pElement.classList.add('mb-2', 'text-gray-500', 'dark:text-gray-400');
    }
  }
}
```

## County Data Handling

Special processing for local county income data:

```javascript
checkForCountyDataIncomeTable(
  "localCounty",
  "localCountyName_Client",
  "localCountyMedianHouseholdIncome_Client",
  "localCountyPerGivingUnit_Client",
  selectedYears,
  "cb"
);

// Supports up to 6 counties
checkForCountyDataIncomeTable("localCounty_two", ...);
checkForCountyDataIncomeTable("localCounty_three", ...);
// ... up to localCounty_six
```

## Modal Integration

Each row can have an associated modal with year-specific data:

```javascript
selectedYears.forEach((year) => {
  const tableModalRow = document.getElementById(`${name}_modal_${year}`);
  
  if (tableModalRow) {
    addClientDataToModalRow(tableModalRow, year, client, type, fixedNum);
    addPeerDataToModalRow(tableModalRow, peer, type, fixedNum, year, wa, name, data);
  }
});
```

## Report Flow Summary

1. **Initialization**
   - Retrieve all data from localStorage
   - Get selected years

2. **Table Structure**
   - Clear existing year columns
   - Add new year columns to all table headers

3. **Data Population**
   - For each data category:
     - For each metric:
       - Clear existing data cells
       - Add client values for each year
       - Calculate and add peer statistics

4. **Formatting**
   - Convert negative numbers to accounting format
   - Apply red styling to negative values

5. **Benchmark Colors**
   - Apply Good/Warning/Action background colors
   - Based on client benchmark ratings

6. **Modal Content**
   - Populate benchmark explanation modals
   - Process HTML formatting

## Styling Classes

### Cell Styling

```javascript
const propClass = "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white opacity-80 justify-between border-r-2 dark:border-gray-600";
```

### Header Styling

```javascript
newTh.setAttribute("class", "px-6 py-3 text-lg");
```

### Negative Value Styling

```javascript
th.classList.add("text-red-500", "dark:text-red-400");
```

## Performance Considerations

1. **Batch DOM Updates**: Clear and rebuild entire rows rather than updating individual cells
2. **Early Exit**: Skip processing if no data or years selected
3. **Selective Modal Updates**: Only update modal rows that exist in DOM
4. **Skip Peer Calculations**: For derived fields like `_percentChange` and `_twoYrAvg`

## Error Handling

```javascript
try {
  const targetElement = document.querySelector(selector);
  
  if (!targetElement) {
    return;  // Element not found, skip
  }
  
  if (!dataSource) {
    console.warn(`Data source not available for field: ${fieldName}`);
    return;
  }
  
  // Process data...
} catch (error) {
  console.error(`Error processing benchmark paragraph for ${fieldName}:`, error);
}
```

