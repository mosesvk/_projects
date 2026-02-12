# UI Overview

This document summarizes the K-12 app’s user interface: layout, navigation, options, and how the Report and print/Excel flows fit in.

## Layout and Shell

- **Single page:** Everything runs inside **`index.html`** (Quickbase: `k12_main.html`). There is no route-based navigation; “navigation” is switching which section is visible in the main content area.
- **Header/nav bar:** Fixed at top. Contains:
  - Logo and “K-12” title.
  - **Firm name** (`#firmName`), filled from the first client record after load.
  - **Options** button (opens Options modal).
  - **Select Years** dropdown (populated from unique years for the client; multi-select).
  - **Run** button (triggers the full API + process + display flow).
- **Sidebar:** Left; lists the six data sections plus Report:
  - Enrollment  
  - Cash  
  - Asset  
  - Debt  
  - Income  
  - Expense  
  - Report  
  Clicking an item shows that section and hides others; active item is highlighted. Behavior and “scroll to top” are aligned with comp/standard (`_uiManagement.js`).
- **Main content:** One visible section at a time. Each section (Enrollment, Cash, …) contains one or more **charts** and optional benchmark text. The **Report** section is a single large table with section headers and metric rows.

---

## Options Modal

Opened by the **Options** button in the header. Implemented with **Flowbite** (modal + backdrop). Contains:

- **Year selection:** Multi-select dropdown of fiscal years available for the client. Populated on page load from the initial client API response (`addUniqueYearsToOptionsSelectDropdown`). Selected years are stored and used when the user clicks Run.
- **Enrollment range:** Dual-handle range slider (min–max enrollment). Structure and styling match the “05_cfhi_comp Giving Units” slider (see `Header.js` and CSS in `index.html`). Values can be used to filter peer data when the peer query supports it (currently peer query is year-only).
- **School / Church:** Toggle or selector (School = 0, Church = 1). Stored in `selectedSchoolChurch` and read by `getSelectedSchoolChurchOption()` for use in peer filtering when implemented.

Accessibility: focus is returned to the Options button when the modal closes (e.g. backdrop click or Escape) to avoid focus on hidden elements (`returnFocusFromOptionsModal`).

---

## Run and Feedback

- **Run:** Single primary action. On click:
  - Validates that at least one year is selected (else toast warning and no API call).
  - Shows loading state on the button.
  - Fetches peer and client data, processes into the six domains, writes to `localStorage`, then calls `displayComponents()` and shows a success toast (or an error toast on failure).
- **Toasts:** Small floating messages (e.g. “API data loaded successfully.” or “There was an error loading data: …”). Implemented in the same style as the comp project (create element, append, click-outside to dismiss).

---

## Data Sections (Enrollment → Expense)

Each section is implemented in **chartDisplay.js**:

1. **Enrollment** — e.g. student average enrollment, student–facility ratio; benchmark text for reserves and liquidity.
2. **Cash** — expendable reserves (days and %), liquidity ratio, days cash on hand; benchmarks as defined in code.
3. **Asset** — e.g. net tuition A/R as % of current assets.
4. **Debt** — debt-to-property, debt-to-net-assets, current ratio, etc.
5. **Income** — net income ratio, tuition metrics, financial assistance, contributions, etc.
6. **Expense** — salary/benefit ratios, personnel/mandatory/debt service, fund-raising expense, etc.

For each section, **display*Component()**:

- Reads the corresponding key from `localStorage` (e.g. `enrollmentData`, `cashData`).
- Parses JSON and calls **createChartFromParsedData()** for each chart in that section (with chart element id, peer/client data keys, number/percent/dollar type, and fixed decimal places).
- Adds any static benchmark copy (e.g. “We believe that a reasonable benchmark is between 30 - 60 range.”).
- Calls **closeSidebarAfterSelectingOption(section)** so the sidebar reflects the current section and optionally persists `lastRenderedComponent`.

Charts are built by **charts.js** (**getMainChartOptions**) and ** _utility.js** (**createChart**): client as bars, peer as average/median/quartiles (e.g. line or area), with axes and tooltips. Colors and formatting (number/percent/dollar) are consistent; dark mode is supported via a `dark-mode` event and chart option updates.

---

## Report Tab

- **Report.js** implements **displayReportComponent()**.
- Reads all six domain objects and **selectedYears** from `localStorage`.
- Builds one large table: section headers (e.g. Enrollment, Cash, …) and rows of metrics. Each row’s cells are filled with client values and peer benchmarks (e.g. average, median) per year. Column layout and section headers use classes that match Standard/Comprehensive styling (e.g. `report-section-header`, `report-main-item`, `report-sub-item`).
- The list of metrics and their options (num/percent/dollar, weighted avg, benchmark row) is defined in Report.js as arguments to **insertDataToReport()**; the actual DOM and formatting helpers live in **_utility.js** (e.g. `addYearColumnsToReportTable`, `insertDataToReport`).

So the Report tab is a **table view** of the same data that backs the charts, with a fixed set of metrics and sections.

---

## Print / Excel

- **Print modal:** Opened from the header (or a dedicated button). Implemented in **Header.js** (Flowbite). Content and actions in the modal trigger the Excel report flow in **_utilityPrint.js** (e.g. “Generate Excel” or similar).
- **Excel flow:** **_utilityPrint.js** builds an XML payload from Report metrics, client id/name, and selected years, sends it to Quickbase table **bt3q4xqn5**, then generates a link to a Trends or Benchmark report (by year count). The structure mirrors the comp/standard Excel report; table and field IDs are K-12–specific (see `docs/quickbase/excelFields.txt`).

---

## Tech Stack (UI)

- **Styling:** Tailwind CSS, Flowbite (modals, dropdowns), and project-specific classes in `index.html` (e.g. report table, enrollment slider, action/warning/good colors).
- **Charts:** ApexCharts (loaded from CDN in `index.html`).
- **Interactivity:** Vanilla JS and jQuery (DOM, events, `$.get`). Alpine.js is loaded for any declarative UI (e.g. dropdowns or toggles that use it).
- **Icons / assets:** Inline SVG in the HTML; logo as base64 in the nav.

Overall, the UI is a **single-page, sidebar-driven dashboard**: Options + Years + Run → then the user switches between Enrollment/Cash/Asset/Debt/Income/Expense and Report, all using the same run’s data from `localStorage`. Print/Excel is an extra step that sends the same data to Quickbase for report generation.
