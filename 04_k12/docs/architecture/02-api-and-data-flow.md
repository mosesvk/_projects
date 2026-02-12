# API and Data Flow

This document describes how the K-12 app talks to Quickbase, how client and peer data are structured, and how data moves from the Run action to the UI.

## Quickbase Setup

- **Realm:** Configurable (e.g. `capincrouse.quickbase.com`); app token and table IDs are set in `index.html` and in code.
- **Tables:**
  - **Client data:** Table ID `btpb39epd` (`clientData` in code). One record per client per fiscal year; key field **138** = client record ID (`ClientRid` from URL `clientrid`).
  - **Peer data:** Table ID `btqf8k6ea` (`peerData` in code). Many records per year; used for benchmark stats (e.g. average, median, quartiles).
- **Auth:** `apptoken` is set in `index.html` and applied globally via `$.ajaxSetup({ data: { apptoken: apptoken } })` for jQuery requests.

**Important:** The URL parameter must be **`clientrid`** (lowercase). The app reads it with `getQueryVariable("clientrid")` and stores it as `ClientRid`.

---

## API Usage

All data is fetched with **Quickbase `API_DoQuery`** via HTTP GET (or POST where required), returning **XML**. The app uses **jQuery `$.get()`** to the table URL with query parameters:

- `act=API_DoQuery`
- `query=` Quickbase query expression (e.g. `{138.EX.${ClientRid}}` for client, `{136.EX.${year}}` for peer by year)
- `clist=` comma-separated field IDs to return

Responses are parsed with the browser’s **DOMParser** / jQuery to get `<record>` elements; then each record’s child elements (field tags) are read by name and pushed into in-memory structures.

- **No** `quickbase-js-api` or other SDK in the browser bundle; raw HTTP + XML.
- **qb-deploy** (Node) uses its own HTTP/API to upload code pages (see `docs/README_qb_deploy.md`).

---

## Client vs Peer

- **Client:** The school being benchmarked. Identified by `ClientRid` (from `clientrid`). Queries filter on field **138** = `ClientRid` and **136** = fiscal year. Result: one record per selected year for that client. Used for “client” series in charts and client column in the Report.
- **Peer:** All other schools (or a subset by enrollment/School–Church when filters are applied). Queries filter by year (**136**). Multiple records per year. Used to compute peer statistics (e.g. average, median, quartiles) per year for charts and report benchmarks. Optional filters (e.g. enrollment range, School/Church) can be added to the peer query when field IDs and values are confirmed; the current peer query is year-only for reliability.

---

## Data Flow Overview

1. **Page load**
   - `index.html` sets `ClientRid`, `clientData`, `peerData`, and calls the client API once with a query that returns all years for that client (e.g. `{138.EX.${ClientRid}}`).
   - **api.js** runs: parses records, extracts unique fiscal years, fills the year dropdown (`addUniqueYearsToOptionsSelectDropdown`), and sets `firmName` and initial client record. No peer fetch yet.

2. **User choices**
   - User selects one or more **years** in the Options modal (and optionally enrollment range, School/Church). Selections are stored in `localStorage` and/or globals (e.g. `getSelectedSchoolChurchOption()` in Header.js).

3. **Run**
   - User clicks **Run**.
   - **api.js** (Run handler):
     - Validates selected years; shows toast if none.
     - Optionally calls `getSelectedSchoolChurchOption()` so peer filter (when used) is up to date.
     - **Peer:** For each selected year, calls `getRecordsForPeer(year)` → `$.get(peerData, apiCallPeerData)` with query `{136.EX.${year}}`. Results are accumulated (e.g. concatenated XML or array of records).
     - **Client:** For each selected year, calls `getRecordsForClient(year)` → `$.get(clientData, apiCallClientData)` with query `{138.EX.${ClientRid}} AND {136.EX.${year}}`. Same accumulation.
     - Parses combined peer and client XML into record lists.
     - **processApiCalls(selectedYears, recordsPeer, recordsClient)** runs:
       - `processEnrollmentData(...)`
       - `processCashData(...)`
       - `processAssetData(...)`
       - `processDebtData(...)`
       - `processIncomeData(...)`
       - `processExpenseData(...)`
     - Each `process*Data` uses **insertDataIntoObject()** to map XML fields (by tag name) into structured objects keyed by metric and year (and for peers, optionally by name/category). Results are stored in global objects and then written to **localStorage** under keys: `enrollmentData`, `cashData`, `assetData`, `debtData`, `incomeData`, `expenseData`. Selected years are also saved (e.g. `selectedYears`).
   - **displayComponents()** is called: `displayEnrollmentComponent()`, `displayCashComponent()`, … `displayReportComponent()`. Each display function reads from `localStorage`, parses JSON, and either builds ApexCharts (via `createChartFromParsedData` / `createChart`) or fills the Report table (via `insertDataToReport`).
   - Success toast is shown; on error, a warning toast and console error.

4. **After Run**
   - Charts and Report tab read only from **localStorage** (and globals like `selectedYears`). No refetch until the user clicks Run again or changes options and Runs again.

---

## Processing Details

- **insertDataIntoObject(type, year, object, dataKey, record, child, dynamicValueClientPeer, name)**  
  - **type** `"client"` or `"peer"`.  
  - Reads the value from the record’s XML child element **child** (field tag name).  
  - For client: stores `object[dataKey][year].value` and optionally `object[dataKey][year].benchmark` from **dynamicValueClientPeer**.  
  - For peer: if a “yes/no” filter field (**dynamicValueClientPeer**) is "Yes", appends the value to `object[dataKey][year]` (and possibly `object[dataKey]["total"]` or `object[dataKey][name]`).  
  - Missing fields are skipped; repeated missing fields are warned once via `_missingFieldWarned` / `_knownOptionalPeerFields`.

- **processExpenseData / processIncomeData / etc.**  
  - Iterate over years and records, and for each metric call **insertDataIntoObject** with the correct XML tag names and data keys. The **clist** in the API call determines which tags exist in the response; field names in code must match the Quickbase field names (or the XML element names returned).

- **localStorage keys**  
  - `enrollmentData`, `cashData`, `assetData`, `debtData`, `incomeData`, `expenseData`: JSON-serialized objects (metric → year → value/array/benchmark).  
  - `selectedYears`: JSON array of selected fiscal years.  
  - `lastRenderedComponent`: last nav section (e.g. `"enrollment"`) for sidebar state.  
  - **beforeunload** clears `localStorage` so the next visit starts fresh.

---

## Excel / Print Reports

- ** _utilityPrint.js** builds an XML payload from:
  - Client info: `ClientRid`, firm name, unique clients, selected years (from globals / `localStorage`).
  - All metrics defined for the Report (same data keys as Report.js), with field IDs from `docs/quickbase/excelFields.txt`.
- Payload is sent to Quickbase table **bt3q4xqn5** (K-12 Excel report table). Then the user is redirected (or a link is generated) to a Trends or Benchmark report URL based on year count. Table and field IDs are K-12–specific; the flow structure matches the comp project.

---

## Error and Loading Behavior

- **Loading:** Run button shows a loading state (`toggleButtonLoadingState` / `toggleButtonNormalState`) during the Run.
- **Errors:** Failed API calls or missing years: catch block logs to console and shows a **toast warning** (e.g. “There was an error loading data: …” or “Please select year(s) for data to appear”). No data is written to `localStorage` on failure, so charts and Report stay empty or previous until a successful Run.
