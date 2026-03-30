# C_CC — project context for Claude

## What this repo is

**C_CC** (Capin Crouse projects) is a workspace of **front-end data visualization dashboards** and related tooling. The goal is to turn financial and operational data into **interactive reports, charts, and benchmarks** that clients and internal teams can use in the browser—not a single monolithic app, but **several numbered product areas** (e.g. K-12, higher education, international, CFHI) that share patterns: data in **QuickBase**, presentation in **HTML/CSS/JavaScript**, and deployment aligned with QuickBase **code pages** and APIs.

## How we use it today

- **QuickBase** is the primary **system of record and query surface**: tables, fields, and often **code pages** host or feed the UI. Integrations and batch logic tend to live in or around QuickBase.
- **QuickBase CLI** and **deploy scripts** (e.g. Node-based watchers that push local files via QuickBase APIs) support **iterating locally** and **shipping assets** to the right app/environment.
- **JavaScript** is the current implementation language for **client logic, API calls, formatting, and chart/report behavior** (often without a heavy SPA framework—think substantial `index.html`, modular `src/` JS, utilities for weighted averages and benchmarks).

## Tech stack (current, high level)

- **Languages:** JavaScript (ES6+), HTML, CSS; **Tailwind-style** utility classes appear in several UIs.
- **Data access:** QuickBase REST/API patterns; HTTP clients such as **axios** where applicable; API helpers and field mapping concentrated in modules like `api.js` and utilities.
- **Build/deploy:** **Node.js** for tooling (deploy, file watching, env via **dotenv**); not necessarily a unified build step for every subproject.

## Roadmap / direction (not fully implemented here)

The team intends to evolve beyond “browser + QuickBase + JS only” toward:

- **Python** for **ETL, analytics, automation, or services** where it fits better than client-side JS.
- **AWS** for **hosting, integration, and data pipelines** (e.g. Lambdas, S3, secrets, event-driven flows).
- **Amazon Bedrock** (or similar) for **AI-assisted** features: summarization, Q&A over reports, or workflow assistance—wired through AWS with appropriate governance.

Treat these as **planned or partial** unless a subfolder explicitly documents AWS/Bedrock/Python usage.

## Working in this repo

- Prefer **matching existing patterns** in the subproject you touch (naming, `api.js` / utility layout, QuickBase field IDs).
- Assume **sensitive financial data** and **correctness of calculations** (benchmarks, weighted averages, peer columns) matter as much as visuals.
- When adding integrations, respect any project rules about **QuickBase** (e.g. designated client libraries) and **deployment** (don’t break code-page deploy flows without coordination).
