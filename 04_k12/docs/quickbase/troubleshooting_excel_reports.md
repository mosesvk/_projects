# Troubleshooting Excel/PDF Report Generation (ExcelGen_UA)

## "Cannot find column N" (e.g. column 37, 148)

This error is returned by **ExcelGen_UA.aspx** when you open a Trends/Benchmark XLS or PDF link after successfully generating a report to QuickBase. It is **not** thrown by the K12 app code.

### What it means

The report template (identified by `tpid` in the URL) is trying to read a QuickBase field with ID **N** from the record in table **bt3q4xqn5**, but that field either does not exist in the table or the template is configured for a different table/schema.

**Which button triggers which error:**

| Error (field ID) | When it happens | K12 field name (excelFields.txt) |
|------------------|-----------------|----------------------------------|
| **Cannot find column 148** | Clicking **Trends PDF** | 27a2 - Admin Salaries and benefits per Total Expenses - MID |
| **Cannot find column 37**  | Clicking **Benchmark PDF** | 06 - Liquidity Ratio - MIN |

See `docs/quickbase/excelFields.txt` for the full field list (IDs 6–195).

### What to check

1. **QuickBase table bt3q4xqn5**
   - In QuickBase, open table **bt3q4xqn5** and confirm it has **both** fields:
     - **37** (06 - Liquidity Ratio - MIN) — required for Benchmark PDF
     - **148** (27a2 - Admin Salaries… - MID) — required for Trends PDF
   - Ideally the table has **all** fields 6–195 per `docs/quickbase/excelFields.txt`. If 37 or 148 (or others) are missing, add them so the schema matches the K12 Excel spec.

2. **Report templates (tpid)**
   - **Trends PDF** uses one template (tpid); **Benchmark PDF** uses another. Each must be configured for **K12** and table **bt3q4xqn5**.
   - Confirm with whoever manages **ExcelGen_UA** / QuickBase utilities that:
     - The **Trends** template only references field IDs that exist in **bt3q4xqn5** (including 148).
     - The **Benchmark** template only references field IDs that exist in **bt3q4xqn5** (including 37).
   - If templates were copied from another product (e.g. comp), they may reference a different table or field set; create or update **K12-specific** templates that use only K12 field IDs from `excelFields.txt`.

### K12 field reference

- Metric fields: **6–185** (AVG, MAX, MID, MIN per metric; see `excelFields.txt`).
- Client/metadata: **186** (Client ID), **187** (Client Name), **188** (Records Returned), **189–193** (Year 1–5), **194–195** (Query Enrollment Max/Min).

Our app sends all of these in the API_AddRecord payload; the "Cannot find column N" failure happens later when ExcelGen_UA generates the file from that record.
