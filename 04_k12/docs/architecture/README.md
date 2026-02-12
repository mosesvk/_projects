# K-12 Project Architecture

This folder contains high-level documentation for the K-12 project codebase. The documentation describes the overall structure of the source code, how it fits within the broader CFHI suite, and how data and UI are organized.

## Documents

| Document | Description |
|----------|-------------|
| [00-overview.md](./00-overview.md) | Project synopsis, purpose of K-12, and how it differs from Comprehensive, Standard, Higher Ed, and International |
| [01-source-structure.md](./01-source-structure.md) | Layout of the `src/` folder and responsibilities of each file and module |
| [02-api-and-data-flow.md](./02-api-and-data-flow.md) | Quickbase API usage, client/peer data, and end-to-end data flow |
| [03-ui-overview.md](./03-ui-overview.md) | UI components, navigation, options, and report/print behavior |

## Quick Reference

- **Entry point:** `src/index.html` (loaded in Quickbase as `k12_main.html`, page ID 134).
- **Data source:** Quickbase tables `btpb39epd` (client) and `btqf8k6ea` (peer); client is identified by URL query `clientrid`.
- **Run flow:** User selects years (and options) → clicks **Run** → API fetches client + peer data per year → data is processed into enrollment/cash/asset/debt/income/expense → stored in `localStorage` → charts and Report tab are rendered.
