# Source Structure

All application code lives under **`src/`**. This document describes the layout and responsibilities of each part.

## Directory Layout

```
src/
├── index.html          # Single HTML entry; loads scripts and defines layout
├── api.js              # Quickbase API calls, data processing, Run flow
├── _utility/           # Shared utilities
│   ├── _utility.js              # Core helpers, chart helpers, year/options state
│   ├── _utilityPrint.js        # Excel report generation and Quickbase upload
│   ├── _utilityWeightedAverages.js  # Weighted-average calculations for peer data
│   └── _uiManagement.js        # Sidebar, nav, modals, toggles
└── components/
    ├── Header.js        # Options/Print modals, enrollment slider, School/Church
    ├── chartDisplay.js  # Per-domain display: enrollment, cash, asset, debt, income, expense
    ├── charts.js        # ApexCharts config and peer/client series
    └── Report.js        # Report tab: table build and insertDataToReport
```

## File Roles

### `index.html`

- **Role:** Single-page shell. Loads global config (e.g. `ClientRid`, `clientData`, `peerData` from URL and table IDs), third-party assets (jQuery, Tailwind, Flowbite, Alpine, ApexCharts, Tingle), and all project scripts in dependency order.
- **Quickbase:** Deployed as `k12_main.html` (page ID 134). Script tags point to other code pages (e.g. `k12_api.js`, `k12_utility.js`, etc.) by their Quickbase page IDs.
- **Note:** The URL must supply `clientrid` (lowercase); the app reads it via `getQueryVariable("clientrid")`.

### `api.js`

- **Role:** Central data layer and Run flow.
  - **On load:** Fetches client data for “unique years” so the year dropdown can be populated; sets `firmName` and initial client record.
  - **Run button:** `processSelectedYears()` → `getRecordsForPeer()` and `getRecordsForClient()` (per selected year) → `processApiCalls()` (enrollment, cash, asset, debt, income, expense) → results written to `localStorage` → `displayComponents()` and toast.
- **Data processing:** `insertDataIntoObject()` maps XML record fields into client/peer objects; `processExpenseData()`, `processIncomeData()`, etc. build the domain objects that charts and Report consume.
- **Important:** Peer query is year-based (field 136); client query is `ClientRid` (138) + year (136). Table IDs and field lists (`clist`) are fixed in this file and in `index.html`.

### `_utility/_utility.js`

- **Role:** Shared state and helpers used across the app.
  - **State:** `yearsData_Array`, selected years, `selectedSchoolChurch` (School = 0, Church = 1), regions, types, sites, enrollment slider values.
  - **Chart helpers:** `createChartFromParsedData()`, `createChart()`, `getPeerAndClientChartDataArrays()`, `updateModal()` for chart tooltips/modals.
  - **Report helpers:** `getStoredData()`, `parseStoredData()`, `insertDataToReport()`, `addYearColumnsToReportTable()`, etc.
  - **Options:** `addUniqueYearsToOptionsSelectDropdown()`, `getSelectedYearsFromLocalStorage()`, `saveSelectedYearsToLocalStorage()`, `getSelectedSchoolChurchOption()`.
- **K-12 specifics:** `schoolChurch_Array` (School/Church); enrollment range slider defaults aligned with comp (“match 05_cfhi_comp Giving Units”).

### `_utility/_utilityPrint.js`

- **Role:** Excel report pipeline for K-12.
  - **Quickbase:** Table ID `bt3q4xqn5`, clist and field IDs per `docs/quickbase/excelFields.txt`.
  - **Flow:** Build XML payload from Report metrics + client info + selected years, send to Quickbase, then open Trends or Benchmark report URL (by year count). Structure mirrors comp/standard; IDs are K-12–specific.
- **Class:** `ExcelReportGenerator` encapsulates API constants, template strings, and `generateReport()` / `sendToQuickbase()`.

### `_utility/_utilityWeightedAverages.js`

- **Role:** Weighted-average logic for peer data (e.g. for charts and report metrics that aggregate peer values by year). Used where peer values are combined with weights rather than simple averages.

### `_utility/_uiManagement.js`

- **Role:** Sidebar and navigation behavior: toggle sidebar, highlight active nav item, scroll-to-top on tab change (“same pattern as comp/stand”). Also `closeSidebarAfterSelectingOption()` and persistence of last rendered component in `localStorage`.

### `components/Header.js`

- **Role:** Options and Print modals (Flowbite), enrollment range dual slider (structure “match 05_cfhi_comp Giving Units”), School/Church selector, and related accessibility (e.g. focus return when modals close). Does not perform API calls; only UI and option state that the Run flow and API read.

### `components/chartDisplay.js`

- **Role:** One function per domain that reads processed data from `localStorage`, parses it, and calls chart helpers for that domain’s metrics.
  - **Functions:** `displayEnrollmentComponent()`, `displayCashComponent()`, `displayAssetComponent()`, `displayDebtComponent()`, `displayIncomeComponent()`, `displayExpenseComponent()`.
  - Each wires specific data keys (e.g. `studentAverageEnrollment_chart`, `expendableReserves_inDays_chart`) to `createChartFromParsedData()` and sets benchmark rows where used. Ends with `closeSidebarAfterSelectingOption(domain)`.

### `components/charts.js`

- **Role:** ApexCharts configuration. `getMainChartOptions()` builds series and options (client bars, peer avg/mid/quartiles, axes, tooltips, colors) from peer and client arrays. Handles number/percent/dollar formatting and dark mode. Used by `_utility.js`’s `createChart()`.

### `components/Report.js`

- **Role:** Report tab content. Reads all six domain objects and selected years from `localStorage`, then calls `insertDataToReport()` for each domain with a fixed list of metrics and display options (e.g. num/percent/dollar, weighted avg, benchmark row). Defines which metrics appear in which section and their order; actual table DOM and formatting are shared with `_utility.js` report helpers.

---

## Data Dependencies (Conceptual)

- **index.html** provides `ClientRid`, `clientData`, `peerData`, and app token; **api.js** uses these for all Quickbase calls.
- **api.js** writes `enrollmentData`, `cashData`, `assetData`, `debtData`, `incomeData`, `expenseData`, and `selectedYears` to `localStorage` after a successful Run.
- **chartDisplay.js** and **Report.js** read those keys and depend on ** _utility.js** (and **charts.js** for charts) to render.
- **Header.js** and **_uiManagement.js** control UI state (years, School/Church, sidebar) that **api.js** and **_utility.js** read when building queries and options.
- **_utilityPrint.js** uses Report data and client/years from the same `localStorage` and global `ClientRid`/`firmName` to build the Excel report payload.

---

## Quickbase Page Mapping

For deployment, each source file maps to a Quickbase code page (see `docs/README_qb_deploy.md` and `docs/pageFields.md`). Summary:

| Source file        | Quickbase page name   | Page ID |
|--------------------|------------------------|---------|
| index.html         | k12_main.html          | 134     |
| _utility/_utility.js | k12_utility.js        | 135     |
| api.js             | k12_api.js             | 136     |
| Header.js          | k12_Header.js          | 137     |
| chartDisplay.js    | k12_displayCharts.js   | 138     |
| Report.js         | k12_Report.js          | 139     |
| _uiManagement.js   | k12_uiManagement.js    | 140     |
| charts.js          | k12_charts.js          | 141     |
| _utilityWeightedAverages.js | k12_utilityWeightedAverages.js | 142 |
| _utilityPrint.js   | k12_utilityPrint.js    | 180     |

Script load order in `index.html` must match the dependency order above (e.g. utility before api, api before chartDisplay and Report).
