/**
 * Simplified Excel Report Integration
 * Handles XML generation and QuickBase API integration
 * bbkmdcurd2sd5cpqvf58dsabq2q
 */
class ExcelReportGenerator {
    constructor() {
      // API Constants
      this.API = {
        APP_TOKEN: "bpat4pgu9t69yby5gbemdbej52j",
        UPLOAD_URL:
          "https://capincrouse.quickbase.com/db/btcc8gq3r?a=API_AddRecord",
      };
  
      // XML Template Strings
        this.XML = {
        HEADER: `<?xml version="1.0" ?><qdbapi><apptoken>${this.API.APP_TOKEN}</apptoken>`,
        FOOTER: "</qdbapi>",
        COLUMN_LIST: "<clist>171</clist>",
        };

                this.FIELD_IDS = {
          CLIENT_RID: "227",
          TOTAL_RECORDS_PEER: "224",
          TYPE: "287",
          FIRM_NAME: "223",
          SLIDER_MIN: "296",
          SLIDER_MAX: "297",
          SITES: "329",
          REGIONS: "331",
          YEARS_START: "228",
        };
  
      // XML payload storage
      this.xmlPayload = "";
  
    // Field metric mappings (CFHI Comp) using printTableFields.md
    // Format per entry: [metricName, [AVG, MIN, MID, MAX], category, useWeightedAvg]
    // useWeightedAvg flag matches the "wa" flag from Report.js
    
    // C-prefix fields for TRENDS reports (Comprehensive metrics)
    this.fieldMappings = [
      // Demo data (demoData) - C01.x and C02.x fields
      ["givingUnits", [6, 8, 7, 9], "demo", false], // C01.1
      ["fullTimeEquivalent", [18, 20, 19, 21], "demo", false], // C01.4
      // TODO: givingUnitsToStaff - Field IDs need to be added to QuickBase table and printTableFields.md
      // This field exists in Report.js (line 16) with "wa" flag, but field IDs are not in printTableFields.md
      // This field needs peer data for Excel reports but field IDs must be verified first
      // ["givingUnitsToStaff", [FIELD_IDS_NEEDED], "demo", true], // TODO: Add field IDs after verification - wa in Report.js
      ["givingUnitsToStaff", [22, 24, 23, 25], "demo", true], // C01.5 - wa in Report.js
      ["contributionsWithoutDonorExcludingLargeGifts", [26, 28, 27, 29], "demo", false], // C01.6
      ["totalContributionsExclude", [30, 32, 31, 33], "demo", false], // C01.7
      ["totalContributionOnline", [35, 37, 36, 38], "demo", false], // C02.1
      ["percentContributionsOnline", [39, 41, 40, 42], "demo", true], // C02.2 - wa in Report.js
      ["totalOutsourcedEmployees", [43, 45, 44, 46], "demo", false], // C02.3
      ["facilitySquareFootage", [47, 49, 48, 50], "demo", false], // C02.4
      ["numberOfLocations", [51, 53, 52, 54], "demo", false], // C02.5

      // Cash data (cashData) - C03.x fields
      ["daysExpendableNetAssets", [55, 57, 56, 58], "cash", true], // wa in Report.js
      ["daysOperatingCash", [59, 61, 60, 62], "cash", true], // wa in Report.js
      ["cashFlowsFromOperatingActivities", [63, 65, 64, 66], "cash", false], // C03.3 - Fixed field name
      ["liquidityRatio", [67, 69, 68, 70], "cash", true], // wa in Report.js
      ["netCashAvailability", [71, 73, 72, 74], "cash", false], // C03.5 - Re-enabled
      ["netCashAvailability_including", [75, 77, 76, 78], "cash", false], // C03.6 - Re-enabled
      ["netCashAvailability_standard", [79, 81, 80, 82], "cash", false], // C03.7 - Re-enabled

      // Debt data (debtData) - C04.x fields
      ["debtToContributionsWithout", [83, 85, 84, 86], "debt", true], // wa in Report.js
      ["currentRatio", [87, 89, 88, 90], "debt", true], // wa in Report.js
      ["mandatoryDebtServiceToContributionsWithout", [91, 93, 92, 94], "debt", true], // wa in Report.js
      ["debtPerGivingUnit", [103, 105, 104, 106], "debt", true], // wa in Report.js
      ["debtPerGivingUnit_standard", [107, 109, 108, 110], "debt", true], // wa in Report.js
      ["debtCoverage", [111, 113, 112, 114], "debt", true], // wa in Report.js

      // Income data (incomeData) - C05.x fields
      ["netIncomeRatio", [115, 117, 116, 118], "income", true], // wa in Report.js
      ["contributionsWithoutDonorPerGivingUnit", [123, 125, 124, 126], "income", true], // wa in Report.js
      ["totalContributionsPerGivingUnit", [131, 133, 132, 134], "income", true], // wa in Report.js

      // Expense data (expenseData) - C06.x fields
      ["benefitsToSalaries", [135, 137, 136, 138], "expense", true], // wa in Report.js
      ["salaries", [139, 141, 140, 142], "expense", true], // wa in Report.js
      ["benefits", [143, 145, 144, 146], "expense", true], // wa in Report.js
      ["salariesBenefits", [147, 149, 148, 150], "expense", true], // wa in Report.js
      ["salariesBenefitsIncludingOutsourcedEmployees", [151, 153, 152, 154], "expense", true], // wa in Report.js
      ["personnelToCashExpenditure", [163, 165, 164, 166], "expense", true], // wa in Report.js - SWAPPED: was using 155-158
      ["mandatoryDebtServiceToCashExpenditure", [159, 161, 160, 162], "expense", true], // wa in Report.js
      ["personnelIncludingToTotalCashExpenditures", [155, 157, 156, 158], "expense", true], // wa in Report.js - SWAPPED: was using 163-166
      ["totalGlobalAndLocalOutreachExpenses", [175, 177, 176, 178], "expense", true], // wa in Report.js
      ["cashExpendituresPerGivingUnit", [183, 185, 184, 186], "expense", true], // wa in Report.js

      // Additional data (additionalData) - C07.x fields
      ["contributionsPerAccountingFTE", [187, 189, 188, 190], "additional", true], // wa in Report.js
      ["expensesPerAccountingFTE", [191, 193, 192, 194], "additional", true], // wa in Report.js
    ];

    // S-prefix fields for BENCHMARK reports (Simplified/Standard metrics)
    // These map to a subset of metrics used in Benchmark reports
    this.benchmarkFieldMappings = [
      // S01.x fields - Basic demographic data
      ["givingUnits", [239, 241, 240, 242], "demo", false], // S01.1
      ["contributionsWithoutDonorExcludingLargeGifts", [243, 245, 244, 246], "demo", false], // S01.2
      ["totalContributionsExclude", [247, 249, 248, 250], "demo", false], // S01.3

      // S02.x fields - Cash data
      ["daysOperatingCash", [251, 253, 252, 254], "cash", true], // S02.1
      ["netCashAvailability", [255, 257, 256, 258], "cash", false], // S02.2 - Re-enabled
      ["netCashAvailability_standard", [259, 261, 260, 262], "cash", false], // S02.3

      // S03.x fields - Debt data
      ["debtToContributionsWithout", [263, 265, 264, 266], "debt", true], // S03.1
      ["debtPerGivingUnit", [267, 269, 268, 270], "debt", true], // S03.2
      ["debtPerGivingUnit_standard", [271, 273, 272, 274], "debt", true], // S03.3

      // S04.x fields - Income data
      ["contributionsWithoutDonorPerGivingUnit", [275, 277, 276, 278], "income", true], // S04.1 - wa in Report.js
      ["totalContributionsPerGivingUnit", [279, 281, 280, 282], "income", true], // S04.2 - wa in Report.js

      // S05.x fields - Expense data
      ["cashExpendituresPerGivingUnit", [283, 285, 284, 286], "expense", true], // S05.1
    ];
  
        this.init();
    }

    /**
     * Initialize the Excel report generator
     */
    init() {
      const generateReportsBtn = document.getElementById("generateReports");
      if (generateReportsBtn) {
        // Remove any existing event listeners to prevent duplicates
        const newBtn = generateReportsBtn.cloneNode(true);
        generateReportsBtn.parentNode.replaceChild(newBtn, generateReportsBtn);
        
        // Add the event listener to the new button
        newBtn.addEventListener(
          "click",
          this.handleGenerateReport.bind(this)
        );
        
        // console.log("ExcelReportGenerator initialized with fresh event listener");
      }
    }

    /**
     * Clean up Excel report generator data and reset state
     */
    cleanup() {
      // console.log("ExcelReportGenerator cleanup called");
      
      // Reset XML payload
      this.xmlPayload = "";
      
      // Reset generating flag
      this.isGenerating = false;
      
      // Clear any stored data
      if (this.storedData) {
        this.storedData = null;
      }
      
      // Reset any temporary variables
      if (this.tempData) {
        this.tempData = null;
      }
      
      // Clear any cached results
      if (this.cachedResults) {
        this.cachedResults = null;
      }
      
      // Reset button state
      const button = document.getElementById("generateReports");
      if (button) {
        button.disabled = false;
        button.textContent = "Generate Trends and Benchmark Reports";
        
        // Remove any loading state classes
        button.classList.remove("opacity-50", "cursor-not-allowed");
      }
      
      // console.log("ExcelReportGenerator cleanup completed");
    }

    /**
     * Handle generate report button click
     */
    handleGenerateReport() {
      // Check if this function is already running to prevent duplicate calls
      if (this.isGenerating) {
        console.warn("Generation already in progress, ignoring duplicate call");
        return;
      }
  
      this.isGenerating = true;
      const button = document.getElementById("generateReports");
  
      if (typeof toggleButtonLoadingState === "function") {
        toggleButtonLoadingState(button);
      } else {
        button.disabled = true;
        button.textContent = "Generating...";
      }
  
      // Validate data is available (use CFHI data categories)
      if (!localStorage.getItem("demoData") &&
          !localStorage.getItem("cashData") &&
          !localStorage.getItem("debtData") &&
          !localStorage.getItem("incomeData") &&
          !localStorage.getItem("expenseData") &&
          !localStorage.getItem("additionalData")) {
        if (typeof createToastWarning === "function") {
          createToastWarning(
            "No data available. Please select years and run the report first."
          );
        }
  
        if (typeof toggleGenerateReportButtonNormalState === "function") {
          toggleGenerateReportButtonNormalState(button);
        } else {
          button.disabled = false;
          button.textContent = "Generate Reports";
        }
  
        this.isGenerating = false;
                return;
            }

      // Generate report with slight delay to ensure UI updates
      setTimeout(() => {
        this.createPrintExcel()
          .then(() => {
            if (typeof toggleGenerateReportButtonNormalState === "function") {
              toggleGenerateReportButtonNormalState(button);
            } else {
                button.disabled = false;
              button.textContent = "Generate Reports";
            }
  
            this.isGenerating = false;
          })
          .catch((error) => {
            console.error("Report generation failed:", error);
  
            if (typeof createToastWarning === "function") {
              createToastWarning(
                `Report generation failed: ${error.message || "Unknown error"}`
              );
            }
  
            if (typeof toggleGenerateReportButtonNormalState === "function") {
              toggleGenerateReportButtonNormalState(button);
            } else {
              button.disabled = false;
              button.textContent = "Generate Reports";
            }
  
            this.isGenerating = false;
          });
      }, 100);
    }
  
    /**
     * Escape XML special characters to prevent malformed XML
     */
    escapeXml(unsafe) {
      if (unsafe === undefined || unsafe === null) {
            return "";
        }
        
      return String(unsafe)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
    }

    /**
     * Process data arrays and calculate statistics
     * @param {Object} data - Data object containing _Peer and _Stats
     * @param {string} metricName - Name of the metric
     * @param {boolean} useWeightedAvg - Whether to use weighted average (matches "wa" flag from Report.js)
     */
    calculateStatistics(data, metricName, useWeightedAvg = false) {
      if (data[`${metricName}_Stats`]) {
        const stats = {
          avg: data[`${metricName}_Stats`].avg || 0,
          mid: data[`${metricName}_Stats`].median || 0,
          min: data[`${metricName}_Stats`].q1 || 0,
          max: data[`${metricName}_Stats`].q3 || 0
        };
        // console.log(`📊 Using _Stats for ${metricName}:`, stats);
        return stats;
      }
      // Get peer data
      const peerData = data[`${metricName}_Peer`];
      if (!peerData || !peerData.total || !Array.isArray(peerData.total)) {
        // console.warn(`⚠️ No valid peer data for ${metricName}`);
        return { avg: 0, mid: 0, min: 0, max: 0 };
      }
  
      const values = peerData.total.filter((v) => !isNaN(parseFloat(v)));
      // console.log(`📊 Calculating stats for ${metricName}, ${values.length} values, useWeightedAvg: ${useWeightedAvg}`);
  
      // Calculate statistics
      let avg, mid, min, max;
  
      // Average calculation - matches Report.js logic exactly
      if (useWeightedAvg && typeof getWeightedAverageOfArray === "function") {
        // Use weighted average for fields marked with "wa" flag
        try {
          avg = getWeightedAverageOfArray(data, metricName, null);
          // console.log(`  ✅ Weighted avg for ${metricName}: ${avg}`);
        } catch (error) {
          console.error(`  ⚠️ Weighted average failed for ${metricName}, using simple average fallback`);
          // Fallback to simple average
          avg = values.reduce((sum, val) => sum + Number(val), 0) / values.length;
        }
      } else if (typeof getAverageOfArray === "function") {
        // Use simple average for fields without "wa" flag
        avg = getAverageOfArray(values, metricName);
        // console.log(`  AVG (simple via function): ${avg}`);
      } else {
        // Fallback manual calculation
        avg = values.reduce((sum, val) => sum + Number(val), 0) / values.length;
        // console.log(`  AVG (fallback manual): ${avg}`);
      }
      
      // Check if avg is undefined, null, or NaN
      if (avg === undefined || avg === null || isNaN(avg) || values.length === 0) {
        console.warn(`  ⚠️ AVG calculation returned invalid value for ${metricName}: ${avg}`);
        avg = 0;
      }
  
      // Percentiles
      if (
        typeof get25thPercentileOfArray === "function" &&
        typeof getMidpointOfArray === "function" &&
        typeof get75thPercentileOfArray === "function"
      ) {
        min = get25thPercentileOfArray(values, metricName);
        mid = getMidpointOfArray(values, metricName);
        max = get75thPercentileOfArray(values, metricName);
      } else {
        // Fallback manual calculation
        const sorted = [...values].sort((a, b) => a - b);
        min = sorted[Math.floor(sorted.length * 0.25)] || 0;
        mid = sorted[Math.floor(sorted.length * 0.5)] || 0;
        max = sorted[Math.floor(sorted.length * 0.75)] || 0;
      }
  
      return { avg, mid, min, max };
    }
  
    /**
     * Add peer statistics to XML payload
     */
    uploadToFile(avg, mid, min, max, fIdArray, begin, end) {
      if (!fIdArray || !Array.isArray(fIdArray) || fIdArray.length < 4) {
        console.warn("Invalid fIdArray provided to uploadToFile:", fIdArray);
                return;
            }

      const avgId = fIdArray[0];
      const midId = fIdArray[2];
      const minId = fIdArray[1];
      const maxId = fIdArray[3];
  
      // Escape values for XML
      const safeAvg = this.escapeXml(avg);
      const safeMid = this.escapeXml(mid);
      const safeMin = this.escapeXml(min);
      const safeMax = this.escapeXml(max);
  
      if (begin) {
        this.xmlPayload = this.XML.HEADER;
      }
  
      this.xmlPayload +=
        `<field fid='${avgId}'>${safeAvg}</field>` +
        `<field fid='${midId}'>${safeMid}</field>` +
        `<field fid='${minId}'>${safeMin}</field>` +
        `<field fid='${maxId}'>${safeMax}</field>`;
  
      if (end) {
        this.xmlPayload += this.XML.COLUMN_LIST + this.XML.FOOTER;
        }
    }

    /**
     * Add a single field to XML payload
     */
    uploadSingleToFile(id, val, end = false) {
      if (id === undefined || id === null) {
        console.warn("Invalid field ID provided to uploadSingleToFile");
        return;
      }
  
      const safeVal = this.escapeXml(val);
      this.xmlPayload += `<field fid='${id}'>${safeVal}</field>`;
  
      if (end) {
        this.xmlPayload += this.XML.COLUMN_LIST;
        this.xmlPayload += this.XML.FOOTER;
        }
    }

    /**
     * Generate Excel report with all data
     */
    async createPrintExcel() {
      // Reset XML payload
      this.xmlPayload = "";
  
      try {
        // Get client data with direct access to global variables
        const ClientRid = window.ClientRid || "";
  
        // Handle firmName
        let firmName = "";
        if (window.firmName) {
          firmName =
            window.firmName instanceof HTMLElement
              ? window.firmName.textContent || ""
              : window.firmName;
        }
  
        // Get uniqueClients (peer group size) - this is the actual count of unique clients
        // NOT totalRecordsPeer which includes multiple years
        let uniqueClientsSize =
          document.getElementById("uniqueClients")?.textContent || 
          window.uniqueClientSize || 
          0;
        
        // Parse to integer - this will be used for TOTAL_RECORDS_PEER field
        const clientCount = parseInt(uniqueClientsSize);
        
        // Convert numeric value to choice value for field 298
        let uniqueClientsChoice = "";
        if (clientCount <= 50) {
          uniqueClientsChoice = "1-50";
        } else if (clientCount <= 100) {
          uniqueClientsChoice = "51-100";
        } else if (clientCount <= 250) {
          uniqueClientsChoice = "101-250";
        } else if (clientCount <= 500) {
          uniqueClientsChoice = "251-500";
        } else if (clientCount <= 1000) {
          uniqueClientsChoice = "501-1000";
        } else {
          uniqueClientsChoice = "1000+";
        }
  
        // IMPORTANT: Direct access to global variables for filters
        const sliderValue = document.getElementById("givingUnitsMin")?.value || 0;
        const sliderValue2 =
          document.getElementById("givingUnitsMax")?.value || 0;
  
        // Get sites and regions from global arrays
        let sites = "";
        if (window.selectedSites_Array) {
          // Check if it's a Set
          if (window.selectedSites_Array instanceof Set) {
            sites = Array.from(window.selectedSites_Array).join(";");
          }
          // Check if it's an Array
          else if (Array.isArray(window.selectedSites_Array)) {
            sites = window.selectedSites_Array.join(";");
          }
        }
  
        let regions = "";
        if (window.selectedRegions_Array) {
          // Check if it's a Set
          if (window.selectedRegions_Array instanceof Set) {
            regions = Array.from(window.selectedRegions_Array).join(";");
          }
          // Check if it's an Array
          else if (Array.isArray(window.selectedRegions_Array)) {
            regions = window.selectedRegions_Array.join(";");
          }
        }
  
        // Debug log values
        console.log("Client data values:", {
          ClientRid,
          firmName,
          uniqueClientsSize,
          clientCount,
          uniqueClientsChoice,
          sliderValue,
          sliderValue2,
          sites, 
          regions
        });
        
        console.log("🎯 PEER GROUP SIZE CHECK:");
        console.log("  - uniqueClientsSize (from DOM):", uniqueClientsSize);
        console.log("  - clientCount (parsed int):", clientCount);
        console.log("  - window.uniqueClientSize:", window.uniqueClientSize);
        console.log("  - This will be sent to QuickBase field 224 (TOTAL_RECORDS_PEER)");
  
        // Start the XML with the XML header
        this.xmlPayload = this.XML.HEADER;
  
        // Add client data with direct field additions
        this.xmlPayload += `<field fid='${
          this.FIELD_IDS.CLIENT_RID
        }'>${this.escapeXml(ClientRid)}</field>`;
        // IMPORTANT: Use clientCount (unique clients) NOT totalRecordsPeer (total records across years)
        // This ensures "Sample Size in Peer Averages" matches the dashboard's "Peer group size"
        console.log(`📤 Sending to QuickBase field ${this.FIELD_IDS.TOTAL_RECORDS_PEER} (TOTAL_RECORDS_PEER): ${clientCount}`);
        this.xmlPayload += `<field fid='${
          this.FIELD_IDS.TOTAL_RECORDS_PEER
        }'>${this.escapeXml(clientCount)}</field>`;
        this.xmlPayload += `<field fid='${
          this.FIELD_IDS.TYPE
        }'>${this.escapeXml("Comprehensive")}</field>`;
        this.xmlPayload += `<field fid='${
          this.FIELD_IDS.FIRM_NAME
        }'>${this.escapeXml(firmName)}</field>`;
        // NOTE: uniqueClientsChoice is not stored in this table - it's display-only
        // Removed field 298 which is actually "Query Years" multi-select field
        this.xmlPayload += `<field fid='${
          this.FIELD_IDS.SLIDER_MIN
        }'>${this.escapeXml(sliderValue)}</field>`;
        this.xmlPayload += `<field fid='${
          this.FIELD_IDS.SLIDER_MAX
        }'>${this.escapeXml(sliderValue2)}</field>`;
        this.xmlPayload += `<field fid='${this.FIELD_IDS.SITES}'>${this.escapeXml(
          sites
        )}</field>`;
        this.xmlPayload += `<field fid='${this.FIELD_IDS.REGIONS}'>${this.escapeXml(
          regions
        )}</field>`;
  
        // Add years - MODIFIED TO ENSURE YEARS USE CORRECT FIELD IDS
        const selectedYears = getSelectedYearsFromLocalStorage() || [];
        let fieldId
        for (let i = 0; i < selectedYears.length; i++) {
          const year = selectedYears[i];
          // Make sure we're using the correct field ID from YEARS_START
  
          
          if (i >= 5) {
            let num = i - 5
            fieldId = 301 + num
            console.log(i, fieldId);
                } else {
            fieldId = Number(this.FIELD_IDS.YEARS_START) + i;
          }
  
          // Ensure we're not using the same field IDs as slider fields
          if (
            fieldId.toString() === this.FIELD_IDS.SLIDER_MIN ||
            fieldId.toString() === this.FIELD_IDS.SLIDER_MAX
          ) {
            console.error(
              `Field ID conflict detected: Year field ID ${fieldId} conflicts with slider/mission field IDs`
            );
            // Skip this field or handle the conflict another way
            continue;
          }
  
          this.xmlPayload += `<field fid='${fieldId}'>${this.escapeXml(
            year
          )}</field>`;
        }
  
        // Process metrics data
        console.log("📝 XML with client data (first 500 chars):", this.xmlPayload.substring(0, 500));
        const metricsXml = this.generateMetricsXml();
        console.log("📊 Metrics XML length:", metricsXml.length, "characters");
        console.log("📊 Metrics XML (first 1000 chars):", metricsXml.substring(0, 1000));
  
        // Add metrics XML to the existing XML payload
        this.xmlPayload += metricsXml;
  
        // Close the XML
        this.xmlPayload += this.XML.COLUMN_LIST + this.XML.FOOTER;
        
        console.log("📦 COMPLETE XML PAYLOAD:");
        console.log("━".repeat(80));
        console.log(this.xmlPayload);
        console.log("━".repeat(80));
        console.log("📏 Total XML length:", this.xmlPayload.length, "characters");
  
        // Send to QuickBase with delay to ensure data is properly prepared
        console.log("Adding delay before sending to QuickBase API...");
  
        return new Promise((resolve) => {
          setTimeout(async () => {
            try {
              const result = await this.printToExcel(this.xmlPayload);
              resolve(result);
            } catch (error) {
              console.error("Error sending data to QuickBase:", error);
              throw error;
            }
          }, 1500); // Add a 1.5-second delay
        });
      } catch (error) {
        console.error("Error creating Excel report:", error);
        throw error;
      }
    }
  
    /**
     * Prepare all field data for QuickBase export
     */
    prepareAllFieldData() {
      try {
        // Create a temporary XML for metrics data
        let metricsXml = "";
  
        // Get all data from localStorage
        const demoData = JSON.parse(localStorage.getItem("demoData") || "{}");
        const cashData = JSON.parse(localStorage.getItem("cashData") || "{}");
        const debtData = JSON.parse(localStorage.getItem("debtData") || "{}");
        const incomeData = JSON.parse(localStorage.getItem("incomeData") || "{}");
        const expenseData = JSON.parse(localStorage.getItem("expenseData") || "{}");
        const additionalData = JSON.parse(localStorage.getItem("additionalData") || "{}");
  
        // Process each field mapping
        this.fieldMappings.forEach((mapping, index) => {
          const [metricName, fieldIds, category, useWeightedAvg] = mapping;
          const isLastMetric = index === this.fieldMappings.length - 1;

          // Find which data object contains this metric based on category
          let dataObject;
          switch (category) {
            case "demo":
              dataObject = demoData;
              break;
            case "cash":
              dataObject = cashData;
              break;
            case "debt":
              dataObject = debtData;
              break;
            case "income":
              dataObject = incomeData;
              break;
            case "expense":
              dataObject = expenseData;
              break;
            case "additional":
              dataObject = additionalData;
              break;
            default:
              return; // Skip if no valid category
          }

          // Check if data exists for this metric
          if (!dataObject || !dataObject[`${metricName}_Peer`]) {
            return; // Skip if no data found
          }

          // Get peer data
          const peerData = dataObject[`${metricName}_Peer`];

          // Calculate statistics - IMPORTANT: Pass useWeightedAvg flag
          const stats = this.calculateStatistics(dataObject, metricName, useWeightedAvg);
  
          // Add to metrics XML - specifically NOT using begin or end flags
          if (fieldIds && fieldIds.length >= 4) {
            const avgId = fieldIds[0];
            const midId = fieldIds[2];
            const minId = fieldIds[1];
            const maxId = fieldIds[3];
  
            // Format values
            const safeAvg = this.escapeXml(stats.avg);
            const safeMid = this.escapeXml(stats.mid);
            const safeMin = this.escapeXml(stats.min);
            const safeMax = this.escapeXml(stats.max);
  
            // Add fields to metrics XML
            metricsXml +=
              `<field fid='${avgId}'>${safeAvg}</field>` +
              `<field fid='${midId}'>${safeMid}</field>` +
              `<field fid='${minId}'>${safeMin}</field>` +
              `<field fid='${maxId}'>${safeMax}</field>`;
          }
        });
  
        // Append metrics XML to existing XML payload (which has client data)
        this.xmlPayload += metricsXml;
        } catch (error) {
            console.error("Error preparing field data:", error);
        }
    }

    /*
     * Generate XML for metrics data
     * Processes BOTH Trends (C-prefix) and Benchmark (S-prefix) fields
     * @returns {string} XML string with metric data
     */
    generateMetricsXml() {
      let metricsXml = "";
      console.log("=== STARTING METRICS XML GENERATION ===");
      
      const fieldsProcessed = [];
      const fieldsSkipped = [];
      // Track which field IDs were actually processed to avoid overwriting with empty values
      const processedFieldIds = new Set();

      try {
        // Get all data from localStorage
        const demoData = JSON.parse(localStorage.getItem("demoData") || "{}");
        const cashData = JSON.parse(localStorage.getItem("cashData") || "{}");
        const debtData = JSON.parse(localStorage.getItem("debtData") || "{}");
        const incomeData = JSON.parse(localStorage.getItem("incomeData") || "{}");
        const expenseData = JSON.parse(
          localStorage.getItem("expenseData") || "{}"
        );
        const additionalData = JSON.parse(localStorage.getItem("additionalData") || "{}");

        console.log("📊 Data Categories Available:", {
          demo: Object.keys(demoData).filter(k => k.includes('_Peer')).length + " peer fields",
          cash: Object.keys(cashData).filter(k => k.includes('_Peer')).length + " peer fields",
          debt: Object.keys(debtData).filter(k => k.includes('_Peer')).length + " peer fields",
          income: Object.keys(incomeData).filter(k => k.includes('_Peer')).length + " peer fields",
          expense: Object.keys(expenseData).filter(k => k.includes('_Peer')).length + " peer fields",
          additional: Object.keys(additionalData).filter(k => k.includes('_Peer')).length + " peer fields"
        });

        // Helper function to process a field mapping array
        const processFieldMappings = (mappings, reportType) => {
          console.log(`\n📋 Processing ${reportType} field mappings (${mappings.length} total)`);
          
          mappings.forEach((mapping, index) => {
            const [metricName, fieldIds, category, useWeightedAvg] = mapping;

            // Find which data object contains this metric based on category
            let dataObject;
            switch (category) {
              case "demo":
                dataObject = demoData;
                break;
              case "cash":
                dataObject = cashData;
                break;
              case "debt":
                dataObject = debtData;
                break;
              case "income":
                dataObject = incomeData;
                break;
              case "expense":
                dataObject = expenseData;
                break;
              case "additional":
                dataObject = additionalData;
                break;
              default:
                console.warn(`⚠️ Unknown category: ${category} for ${metricName}`);
                return; // Skip if no valid category
            }

            // Check if data exists for this metric
            if (!dataObject || !dataObject[`${metricName}_Peer`]) {
              fieldsSkipped.push({
                metric: metricName,
                category: category,
                fieldIds: fieldIds,
                reportType: reportType,
                reason: !dataObject ? "No data object" : "No _Peer data"
              });
              return; // Skip if no data found
            }

            // Get peer data
            const peerData = dataObject[`${metricName}_Peer`];

            // Calculate statistics (pass weighted average flag)
            const stats = this.calculateStatistics(dataObject, metricName, useWeightedAvg);
    
            // Add to metrics XML
            if (fieldIds && fieldIds.length >= 4) {
              const avgId = fieldIds[0];
              const midId = fieldIds[2];
              const minId = fieldIds[1];
              const maxId = fieldIds[3];
    
              // Track that these field IDs were processed
              processedFieldIds.add(avgId);
              processedFieldIds.add(midId);
              processedFieldIds.add(minId);
              processedFieldIds.add(maxId);
    
              // Format values
              const safeAvg = this.escapeXml(stats.avg);
              const safeMid = this.escapeXml(stats.mid);
              const safeMin = this.escapeXml(stats.min);
              const safeMax = this.escapeXml(stats.max);
    
              // Log field details
              fieldsProcessed.push({
                metric: metricName,
                category: category,
                reportType: reportType,
                fields: {
                  [`fid_${avgId}_AVG`]: safeAvg,
                  [`fid_${minId}_MIN`]: safeMin,
                  [`fid_${midId}_MID`]: safeMid,
                  [`fid_${maxId}_MAX`]: safeMax
                }
              });
    
              // Add fields to metrics XML
              metricsXml +=
                `<field fid='${avgId}'>${safeAvg}</field>` +
                `<field fid='${midId}'>${safeMid}</field>` +
                `<field fid='${minId}'>${safeMin}</field>` +
                `<field fid='${maxId}'>${safeMax}</field>`;
            }
          });
        };

        // Process TRENDS fields (C-prefix fields 6-194)
        processFieldMappings(this.fieldMappings, "TRENDS");
        
        // Process BENCHMARK fields (S-prefix fields 239-286)
        processFieldMappings(this.benchmarkFieldMappings, "BENCHMARK");
        
        // CRITICAL: Excel template requires fields 71-74 and 255-258 to exist (even if empty)
        // Only send empty values for fields that weren't processed (no peer data available)
        // This prevents overwriting real data with zeros
        const requiredTrendsFields = [71, 72, 73, 74]; // netCashAvailability (C03.5)
        requiredTrendsFields.forEach(fieldId => {
          if (!processedFieldIds.has(fieldId)) {
            metricsXml += `<field fid='${fieldId}'>0</field>`;
          }
        });
        
        // Also send empty values for benchmark fields 255-258 if not processed
        const requiredBenchmarkFields = [255, 256, 257, 258]; // netCashAvailability (S02.2)
        requiredBenchmarkFields.forEach(fieldId => {
          if (!processedFieldIds.has(fieldId)) {
            metricsXml += `<field fid='${fieldId}'>0</field>`;
          }
        });

        console.log(`\n✅ Total Fields PROCESSED: ${fieldsProcessed.length}`);
        console.log(`  - Trends fields: ${fieldsProcessed.filter(f => f.reportType === 'TRENDS').length}`);
        console.log(`  - Benchmark fields: ${fieldsProcessed.filter(f => f.reportType === 'BENCHMARK').length}`);
        console.log(`⏭️ Total Fields SKIPPED: ${fieldsSkipped.length}`);
        
        if (fieldsSkipped.length > 0) {
          console.log("Skipped fields details:", fieldsSkipped);
        }
        
      } catch (error) {
        console.error("❌ Error generating metrics XML:", error);
      }
  
      console.log("=== METRICS XML GENERATION COMPLETE ===");
      return metricsXml;
    }
  
    /**
     * Send XML data to QuickBase with added delay
     * @param {string} dataString - XML payload to send
     * @returns {Promise} Promise that resolves with the QuickBase response
     */
    printToExcel(dataString) {
      /**
       * Generate URL for Trends or Benchmark reports based on year count
       * @param {string} reportType - Either "trends" or "benchmark"
       * @param {string} format - File format ("xls" or "pdf")
       * @param {string} RecordId - QuickBase record ID
       * @returns {string} Generated URL for the report
       */
      function getUrlBasedOnYearCount(reportType, format, RecordId) {
        const yearCount = selectedYears_Set.size;
        let tpid = "";
        let fnName = "";

        // Map year count to tpid based on report type
        if (reportType === "trends") {
          fnName = "TrendsReport";
          switch (yearCount) {
            case 1:
              tpid = "5"; // Church Compre Trends 1 Year.xlsx
              break;
            case 2:
              tpid = "4"; // Church Compre Trends 2 Year.xlsx
              break;
            case 3:
              tpid = "6"; // Church Compre Trends 3 Year.xlsx
              break;
            case 4:
              tpid = "7"; // Church Compre Trends 4 Year.xlsx
              break;
            case 5:
              tpid = "8"; // Church Compre Trends 5 Year.xlsx
              break;
            default:
              console.error("Invalid year count for Trends report:", yearCount);
              return "";
          }
        } else if (reportType === "benchmark") {
          fnName = "BenchmarkReport";
          switch (yearCount) {
            case 1:
              tpid = "9"; // Church Compre Bench 1 Year.xlsx
              break;
            case 2:
              tpid = "10"; // Church Compre Bench 2 Year.xlsx
              break;
            case 3:
              tpid = "11"; // Church Compre Bench 3 Year.xlsx
              break;
            case 4:
              tpid = "12"; // Church Compre Bench 4 Year.xlsx
              break;
            case 5:
              tpid = "13"; // Church Compre Bench 5 Year.xlsx
              break;
            default:
              console.error("Invalid year count for Benchmark report:", yearCount);
              return "";
          }
        } else {
          console.error("Invalid report type:", reportType);
          return "";
        }

        const url = `https://www.quickbaseutilities1.com/CapinTechnology_1795/XL%20Docs/ExcelGen_UA.aspx?clientid=Q1795&appid=bps9da9i5&tpdbid=bsaavek7s&tpid=${tpid}&fn=${fnName}&dbid=btcc8gq3r&msid=${RecordId}&docfmt=${format}&stream=y&apptoken=---`;

        console.log(
          `Generated ${reportType} URL for ${yearCount} year(s), format ${format}, RecordId ${RecordId}: ${url}`
        );
        return url;
      }
      return new Promise((resolve, reject) => {
        // Debug: Log the XML payload to console
        console.log("XML Payload being prepared for QuickBase:");
        // console.log(dataString);
  
        // Optional: Save to localStorage for inspection if needed
        try {
          localStorage.setItem("lastXmlPayload", dataString);
        } catch (e) {
          console.warn("Could not save XML payload to localStorage:", e);
        }
  
        // Try to validate XML structure before sending
        try {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(dataString, "text/xml");
          const parseError = xmlDoc.querySelector("parsererror");
          if (parseError) {
            console.error("XML validation failed:", parseError.textContent);
            // Continue anyway but log the error
          }
        } catch (validationError) {
          console.error("Error validating XML:", validationError);
          // Continue anyway but log the error
        }
  
        // Add delay before sending the request to ensure data is ready
        console.log("Adding delay before sending to QuickBase API...");
        setTimeout(() => {
          $.ajax({
            type: "POST",
            contentType: "text/xml",
            async: true,
            url: this.API.UPLOAD_URL,
            dataType: "xml",
            processData: false,
            data: dataString,
            success: function (response) {
              try {
                console.log("QuickBase response received:", response);
  
                const xmlUpload = $(response);
                const errorCode = xmlUpload.find("qdbapi").find("errcode").text();
  
                if (errorCode === "0") {
                  const recordId = xmlUpload.find("qdbapi").find("rid").text();
                  console.log(
                    "Successfully uploaded to QuickBase, Record ID:",
                    recordId
                  );
  
                  if (typeof createToastSuccess === "function") {
                    createToastSuccess(
                      "Generated Reports successfully to Quickbase."
                    );
                  }
  
                  const printModalFooter =
                    document.getElementById("print_modal_footer");
                  if (printModalFooter) {
                    printModalFooter.classList.remove("hidden");
                  }

                  // Update Trends download links
                  const trendXLSFinal = document.getElementById("trendXLSFinal");
                  if (trendXLSFinal) {
                    trendXLSFinal.href = getUrlBasedOnYearCount("trends", "xls", recordId);
                  }

                  const trendPDFFinal = document.getElementById("trendPDFFinal");
                  if (trendPDFFinal) {
                    trendPDFFinal.href = getUrlBasedOnYearCount("trends", "pdf", recordId);
                  }

                  // Update Benchmark download links
                  const benchXLSFinal = document.getElementById("benchXLSFinal");
                  if (benchXLSFinal) {
                    benchXLSFinal.href = getUrlBasedOnYearCount("benchmark", "xls", recordId);
                  }

                  const benchPDFFinal = document.getElementById("benchPDFFinal");
                  if (benchPDFFinal) {
                    benchPDFFinal.href = getUrlBasedOnYearCount("benchmark", "pdf", recordId);
                  }
  
                  resolve({ recordId });
                } else {
                  const errorText =
                    xmlUpload.find("qdbapi").find("errtext").text() ||
                    "Unknown QuickBase error";
                  const error = new Error(
                    `QuickBase error (${errorCode}): ${errorText}`
                  );
                  console.error("QuickBase API error:", {
                    errorCode,
                    errorText,
                    xmlPayload: dataString,
                  });
  
                  if (typeof createToastWarning === "function") {
                    createToastWarning(error.message);
                  }
  
                  reject(error);
                }
              } catch (parseError) {
                console.error(
                  "Error parsing QuickBase response:",
                  parseError,
                  "Response:",
                  response
                );
  
                if (typeof createToastWarning === "function") {
                  createToastWarning(
                    `Failed to parse QuickBase response: ${parseError.message}`
                  );
                }
  
                reject(
                  new Error(
                    `Failed to parse QuickBase response: ${parseError.message}`
                  )
                );
              }
            },
            error: function (xhr, status, error) {
              // Extract meaningful error information
              let errorMessage = "Unknown error";
  
              console.error("QuickBase API request failed:", {
                status,
                error,
                response: xhr.responseText,
                xmlPayload: dataString,
              });
  
              if (xhr && xhr.responseText) {
                try {
                  // Try to parse XML response
                  const $errorXml = $(xhr.responseText);
                  errorMessage =
                    $errorXml.find("errtext").text() || error || status;
                } catch (e) {
                  // If we can't parse XML, use the raw responseText or status
                  errorMessage = xhr.responseText || error || status;
                }
            } else {
                errorMessage = error || status;
              }
  
              if (typeof createToastWarning === "function") {
                createToastWarning(`QuickBase API error: ${errorMessage}`);
              }
  
              reject(new Error(`QuickBase API error: ${errorMessage}`));
            },
          });
        }, 1000); // Add a 1-second delay before sending the request
      });
    }
  }
  
  // Initialize when DOM is ready
  // In the document.addEventListener("DOMContentLoaded", ...) part of print_excel.js
  
  document.addEventListener("DOMContentLoaded", () => {
    // Create a single instance
    const excelReportGenerator = new ExcelReportGenerator();
  
    // Make sure no duplicate event listeners are attached to generateReports button
    const generateReportsBtn = document.getElementById("generateReports");
    if (generateReportsBtn) {
      // Remove any existing listeners to prevent duplicates
      const newBtn = generateReportsBtn.cloneNode(true);
      generateReportsBtn.parentNode.replaceChild(newBtn, generateReportsBtn);
  
      // Add a single click event listener
      newBtn.addEventListener(
        "click",
        excelReportGenerator.handleGenerateReport.bind(excelReportGenerator),
        { once: true } // This ensures the event only fires once per click
      );
    }
  
    // Expose functions globally for backward compatibility
    window.excelReportGenerator = excelReportGenerator;
    window.createPrintExcel =
      excelReportGenerator.createPrintExcel.bind(excelReportGenerator);
    window.uploadToFile =
      excelReportGenerator.uploadToFile.bind(excelReportGenerator);
    window.uploadSingleToFile =
      excelReportGenerator.uploadSingleToFile.bind(excelReportGenerator);
    window.printToExcel =
      excelReportGenerator.printToExcel.bind(excelReportGenerator);
  });
