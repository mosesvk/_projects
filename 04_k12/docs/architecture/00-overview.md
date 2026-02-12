# K-12 Project Overview

## What Is the K-12 Project?

The K-12 project is a **financial benchmarking and reporting application** for **K–12 schools**. It allows a user (typically a consultant or school administrator) to:

1. **Select a client school** via a Quickbase record ID passed in the URL (`clientrid`).
2. **Choose fiscal year(s)** and optional filters (e.g., enrollment range, School vs. Church).
3. **Run** a request that loads **client** data and **peer** data from Quickbase.
4. **View** the client’s metrics compared to peer benchmarks across six domains: **Enrollment**, **Cash**, **Asset**, **Debt**, **Income**, and **Expense**.
5. **Generate** a consolidated **Report** (table view) and **Excel-style reports** (via Quickbase) for trends or benchmarks.

The app is delivered as Quickbase code pages: a single HTML page (`index.html` → `k12_main.html`) loads and runs JavaScript modules (API, utilities, components) that talk to Quickbase via its HTTP API and render charts and tables in the browser.

---

## How K-12 Fits in the CFHI Suite

The `_cc` repository contains several related CFHI (Capin Crouse) projects:

| Project | Purpose |
|--------|---------|
| **04_k12** | K–12 school financial benchmarking (this project) |
| **05_cfhi_comp** | Comprehensive / “comp” benchmarking (different sector, richer feature set) |
| **06_cfhi_standard** | Standard benchmarking variant |
| **07_international** | International benchmarking |
| **08_higherEducation** | Higher education benchmarking |

K-12 is **sector-specific**: metrics, peer logic, and report content are tailored to **K–12 schools** (e.g., teacher salaries as % of net tuition, student enrollment, facility ratios). The **Comprehensive** project targets a different sector and often has more filters, more metrics, and different Quickbase tables; the code intentionally reuses **patterns** (e.g., slider behavior, toast feedback, report styling, Excel report flow) from the comp project where it makes sense, but the data model and domain logic are K-12–specific.

**Differences at a glance:**

- **K-12**  
  - Client/peer by **school**, fiscal years, optional **School vs. Church** and **enrollment range**.  
  - Metrics: enrollment, cash, assets, debt, income, expense (K–12 focused).  
  - Quickbase: client table `btpb39epd`, peer table `btqf8k6ea`; Excel report table `bt3q4xqn5`.

- **Comprehensive (comp)**  
  - Different sector (e.g., “Giving Units”), different tables and field sets.  
  - More filters and UI patterns that K-12 mirrors where noted (e.g., enrollment range slider “matches 05_cfhi_comp Giving Units”).

- **Standard / Higher Ed / International**  
  - Each has its own sector, tables, and metrics; K-12 does not share their backend or report IDs, only high-level architectural ideas (sidebar, modals, run flow, toast messages).

So: **same family of apps, same style of architecture (Quickbase + client/peer + Run → process → display), but K-12 is its own product with K–12-specific data and logic.**

---

## High-Level Architecture

- **Runtime:** Browser; no Node server in production (Quickbase hosts the pages).
- **Data:** Quickbase API (`API_DoQuery`), XML responses, parsed in JS.
- **State:** Selected years and processed metrics are stored in `localStorage` after a successful Run.
- **UI:** Single-page app with sidebar navigation (Enrollment, Cash, Asset, Debt, Income, Expense, Report), Options modal (years, enrollment range, School/Church), and Run button. Charts use ApexCharts; tables and report layout follow patterns aligned with Standard/Comprehensive styling.

For more detail, see:

- [01-source-structure.md](./01-source-structure.md) — What lives in `src/` and what each part does.
- [02-api-and-data-flow.md](./02-api-and-data-flow.md) — How data is fetched, processed, and stored.
- [03-ui-overview.md](./03-ui-overview.md) — UI structure, navigation, and options.
