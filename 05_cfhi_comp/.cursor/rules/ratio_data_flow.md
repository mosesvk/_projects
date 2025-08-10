# Ratio Data Flow & Structure Rules

## Overview
This document defines the rules and structure for financial ratios in the CFHI dashboard application. Ratios are calculated financial metrics that provide insights into church financial health and performance.

## Ratio Field Naming Convention

### XML Field Format
All ratio fields in Quickbase follow this pattern:
- **Format**: `cfhi_compre_[##]_ratio___[descriptive_name]`
- **Example**: `cfhi_compre_00a_ratio___attendees_to_staff`

### Quickbase Display Format
The same ratio appears in Quickbase with this format:
- **Format**: `CFHI COMPRE [##] RATIO - [Descriptive Name]`
- **Example**: `CFHI COMPRE 00A RATIO - Attendees to Staff`

## Ratio Categories & Structure

### 1. Demographic Ratios (Demo Data)
Located in `processDemoData()` method in `Api.js`

#### attendeesToStaff
- **XML Field**: `cfhi_compre_00a_ratio___attendees_to_staff`
- **Calculation**: `totalAttendees / fullTimeEquivalent`
- **Component Fields**:
  - `totalAttendees`: `s150___total_attendee_including_children`
  - `fullTimeEquivalent`: `s151___church_only_full_time_equivalent_excluding_childcare_worker`
- **Weighted Average**: Yes (division calculation)
- **Report Display**: `["attendeesToStaff", "num", 1, "wa", "cb"]`

#### contributionsWithoutDonorExcludingLargeGifts
- **XML Field**: `cfhi_compre_00b_ratio___contributions_w_o_donor_restrictions_exclude_lage`
- **Calculation**: Direct value (no division)
- **Weighted Average**: No
- **Report Display**: `["contributionsWithoutDonorExcludingLargeGifts", "dollar", 0]`

#### totalContributionsExclude
- **XML Field**: `cfhi_compre_00c_ratio___total_contributions_exclude_large_gifts`
- **Calculation**: Direct value (no division)
- **Weighted Average**: No
- **Report Display**: `["totalContributionsExclude", "dollar", 0]`

#### percentContributionsOnline
- **XML Field**: `cfhi_compre_00d_ratio___percent_of_total_given_online`
- **Calculation**: `(totalContributionOnline / totalContributions) * 100`
- **Component Fields**:
  - `totalContributionOnline`: `s163___total_contribution_given_online`
  - `totalContributions`: `s40___total_contribution`
- **Weighted Average**: Yes (division calculation)
- **Report Display**: `["percentContributionsOnline", "percent", 0, "wa"]`

### 2. Cash Flow Ratios (Cash Data)
Located in `processCashData()` method in `Api.js`

#### daysExpendableNetAssets
- **XML Field**: `cfhi_compre_01_ratio___days_of_expendable_net_asset_reserves`
- **Calculation**: Complex formula involving multiple fields
- **Weighted Average**: Yes (division calculation)
- **Report Display**: `["daysExpendableNetAssets", "num", 0, "wa", "cb"]`

#### daysOperatingCash
- **XML Field**: `cfhi_compre_02_ratio___days_operating_cash_and_investments_on_hand_to_fund_annual_cash_expenditures`
- **Calculation**: Complex formula involving multiple fields
- **Weighted Average**: Yes (division calculation)
- **Report Display**: `["daysOperatingCash", "num", 0, "wa", "cb"]`

#### availableDaysOfCashFlow
- **XML Field**: `cfhi_compre_03_ratio___available_days_of_cash_flow_coverage`
- **Calculation**: Complex formula involving multiple fields
- **Weighted Average**: Yes (division calculation)
- **Report Display**: `["availableDaysOfCashFlow", "num", 0, "wa", "cb"]`

#### liquidityRatio
- **XML Field**: `cfhi_compre_04_ratio___liquidity_ratio`
- **Calculation**: Complex formula involving multiple fields
- **Weighted Average**: Yes (division calculation)
- **Report Display**: `["liquidityRatio", "num", 1, "wa", "cb"]`

### 3. Debt Ratios (Debt Data)
Located in `processDebtData()` method in `Api.js`

#### debtToContributionsWithout
- **XML Field**: `cfhi_compre_06_ratio___debt_to_contributions_w_o_donor_restrictions`
- **Calculation**: Complex formula involving multiple fields
- **Weighted Average**: Yes (division calculation)
- **Report Display**: `["debtToContributionsWithout", "num", 1, "wa", "cb"]`

#### currentRatio
- **XML Field**: `cfhi_compre_07_ratio___current_ratio`
- **Calculation**: Complex formula involving multiple fields
- **Weighted Average**: Yes (division calculation)
- **Report Display**: `["currentRatio", "num", 1, "wa", "cb"]`

#### debtCoverage
- **XML Field**: `cfhi_compre_10_ratio___debt_coverage`
- **Calculation**: Complex formula involving multiple fields
- **Weighted Average**: Yes (division calculation)
- **Report Display**: `["debtCoverage", "num", 2, "wa", "cb"]`

### 4. Income Ratios (Income Data)
Located in `processIncomeData()` method in `Api.js`

#### netIncomeRatio
- **XML Field**: `cfhi_compre_11_ratio___net_income_ratio`
- **Calculation**: Complex formula involving multiple fields
- **Weighted Average**: Yes (division calculation)
- **Report Display**: `["netIncomeRatio", "percent", 0, "wa", "cb"]`

#### contributionsWithoutDonorPerAverageAdultAttendee
- **XML Field**: `cfhi_compre_12a_ratio___contributions_without_donor_restrictions_per_average_adult_attendee`
- **Calculation**: Complex formula involving multiple fields
- **Weighted Average**: Yes (division calculation)
- **Report Display**: `["contributionsWithoutDonorPerAverageAdultAttendee", "dollar", 0]`

### 5. Expense Ratios (Expense Data)
Located in `processExpenseData()` method in `Api.js`

#### benefitsToSalaries
- **XML Field**: `cfhi_compre_15_ratio___benefits_to_salaries`
- **Calculation**: Complex formula involving multiple fields
- **Weighted Average**: Yes (division calculation)
- **Report Display**: `["benefitsToSalaries", "num", 1, "wa", "cb"]`

#### personnelToCashExpenditure
- **XML Field**: `cfhi_compre_17_1_ratio___personnel_to_total_cash_expenditures`
- **Calculation**: Complex formula involving multiple fields
- **Weighted Average**: Yes (division calculation)
- **Report Display**: `["personnelToCashExpenditure", "num", 1, "wa", "cb"]`

### 6. Additional Ratios (Additional Data)
Located in `processAdditionalData()` method in `Api.js`

#### facilitiesExpenseToTotalCashExpenditures
- **XML Field**: `cfhi_compre_22_ratio___facilities_expenses_of_total_cash_expend`
- **Calculation**: Complex formula involving multiple fields
- **Weighted Average**: Yes (division calculation)
- **Report Display**: `["facilitiesExpenseToTotalCashExpenditures_lessThanTen", "num", 1, "wa", "cb"]`

#### facilityCostPerSquareFoot
- **XML Field**: `cfhi_compre_23ratio___facility_cost_per_square_foot__excluding_interest_expense_`
- **Calculation**: Complex formula involving multiple fields
- **Weighted Average**: Yes (division calculation)
- **Report Display**: `["facilityCostPerSquareFootExcluding_lessThanTen", "num", 1, "wa", "cb"]`

## Data Flow Architecture

### 1. Data Sources
- **Client Data**: Single record per year for selected client
- **Peer Data**: Multiple records per year for all clients matching filters

### 2. Data Retrieval Pattern

#### Client Data Retrieval
```javascript
// Located in Api.js lines 437-446
this.dataStore.insertData(
  "demo",           // category
  "client",         // type
  year,             // year
  "attendeesToStaff_Client",  // dataKey
  record,           // record
  "cfhi_compre_00a_ratio___attendees_to_staff",  // child (ratio field)
  "cfhi_compre_00a_bench_rating___attendees_to_staff"  // benchmark field
);
```

#### Peer Data Retrieval
```javascript
// Located in Api.js lines 270-299
// Ratio field
this.dataStore.insertData(
  "demo",           // category
  "peer",           // type
  year,             // year
  "attendeesToStaff_Peer",    // dataKey
  record,           // record
  "cfhi_compre_00e_ratio___attendees_to_staff",  // child (ratio field)
  "cfhi_compre_00e_yes_no___attendees_to_staff"  // yes/no field
);

// Component fields with dynamicValueClientPeer
this.dataStore.insertData(
  "demo",           // category
  "peer",           // type
  year,             // year
  "totalAttendees", // dataKey
  record,           // record
  "s150___total_attendee_including_children",  // child (component field)
  "cfhi_compre_00e_yes_no___attendees_to_staff",  // yes/no field
  "attendeesToStaff"  // dynamicValueClientPeer (links to ratio)
);
```

### 3. Data Storage Structure

#### Client Data Structure
```json
{
  "attendeesToStaff_Client": {
    "2021": "98",
    "2022": "117",
    "2023": "105",
    "2024": "112"
  }
}
```

#### Peer Data Structure
```json
{
  "attendeesToStaff_Peer": {
    "2021": ["98", "120", "95", "110"],
    "2022": ["117", "125", "88", "115"],
    "2023": ["105", "118", "92", "108"],
    "2024": ["112", "122", "90", "113"]
  },
  "totalAttendees": {
    "2021": ["306", "1709", "1921", "15477"],
    "2022": ["2107", "293", "5318", "1830"],
    "2023": ["5744", "4686", "1834", "1722"],
    "2024": ["883", "5952", "4706", "2077"]
  },
  "fullTimeEquivalent": {
    "2021": ["145", "150", "160", "155"],
    "2022": ["148", "152", "165", "158"],
    "2023": ["150", "155", "168", "160"],
    "2024": ["152", "158", "170", "162"]
  }
}
```

### 4. Data Processing Flow

#### Step 1: API Retrieval
1. **Client Data**: `getRecordsForClient()` fetches single record per year
2. **Peer Data**: `getRecordsForPeer()` fetches multiple records per year

#### Step 2: Data Processing
1. **DataProcessor.processDemoData()** processes demographic ratios
2. **DataProcessor.processCashData()** processes cash flow ratios
3. **DataProcessor.processDebtData()** processes debt ratios
4. **DataProcessor.processIncomeData()** processes income ratios
5. **DataProcessor.processExpenseData()** processes expense ratios
6. **DataProcessor.processAdditionalData()** processes additional ratios

#### Step 3: Data Storage
1. **DataStore.insertData()** stores processed data
2. **localStorage** caches all data for performance
3. **Data categories**: demo, cash, debt, income, expense, additional

#### Step 4: Data Consumption
1. **DisplayCharts.js**: Creates ApexCharts visualizations
2. **Report.js**: Generates tabular reports
3. **WeightedAverages.js**: Calculates weighted averages for division-based ratios

## Weighted Average Implementation

### When to Use Weighted Averages
- **Division-based ratios**: Use weighted averages (e.g., `attendeesToStaff`)
- **Direct value ratios**: No weighted averages (e.g., `totalContributionsExclude`)

### Weighted Average Calculation
```javascript
// Example: attendeesToStaff weighted average
const attendeesToStaff_weightedAverage = (data, name) => {
  const totalAttendees = data.totalAttendees;
  const fullTimeEquivalent = data.fullTimeEquivalent;
  
  // Calculate weighted average using component fields
  return calculateWeightedAverage(totalAttendees, fullTimeEquivalent);
};
```

### Report Integration
```javascript
// Report.js line 16
["attendeesToStaff", "num", 1, "wa", "cb"]
//                    ^     ^   ^   ^
//                    |     |   |   └── benchmark (cb)
//                    |     |   └────── weighted average (wa)
//                    |     └────────── decimal places
//                    └──────────────── data type
```

## Client Selection & Filtering

### Client Identification
```javascript
// Index.html lines 67-80
var ClientRid = getQueryVariable("clientrid");
const clientData = "br8rqi6bk";  // Client table ID
const peerData = "br8szmntp";    // Peer table ID
```

### Filtering System
- **Year Selection**: Multi-year data selection
- **Client Dropdowns**: Dynamic client filtering
- **Range Sliders**: Data range selection
- **Batching**: Large dataset handling with pagination

## Performance Considerations

### Data Caching
- **localStorage**: All processed data cached locally
- **Session Management**: User selections maintained
- **Incremental Updates**: Only fetch new/changed data

### Memory Management
- **Data Cleanup**: Automatic cleanup of old/unused data
- **Efficient Parsing**: Optimized XML parsing for large datasets
- **Lazy Loading**: Load data only when needed

## Error Handling & Validation

### Data Validation
- **Record Validation**: Ensure data integrity before processing
- **Year Validation**: Verify year ranges and data availability
- **Client Validation**: Confirm client data exists before rendering

### Error Recovery
- **API Fallbacks**: Graceful handling of API failures
- **Data Recovery**: Restore from localStorage when possible
- **User Feedback**: Clear error messages and loading states

## Integration Points

### Chart Components
- **ApexCharts**: Primary charting library for ratio visualizations
- **FusionCharts**: Secondary charting library for specialized charts
- **Real-time Updates**: Dynamic data refresh capabilities

### Report Components
- **Tabular Reports**: Structured data presentation
- **Benchmark Ratings**: Performance indicators (Good, Warning, Action Required)
- **Year-over-Year Analysis**: Historical trend analysis

### UI Components
- **Flowbite**: UI component library
- **Tailwind CSS**: Styling framework
- **Responsive Design**: Mobile-first approach
