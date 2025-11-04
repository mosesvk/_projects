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
  
      // Field metric mappings (CFHI) using printFieldsForExcel.md
      // Format per entry: [metricName, [AVG, MIN, MID, MAX], begin, end, category]
      this.fieldMappings = [
        // Demo (general -> demoData)
        ["givingUnits", [6, 8, 7, 9], false, false, "demo"],
        ["fullTimeEquivalent", [18, 20, 19, 21], false, false, "demo"],
        ["attendeesToStaff", [22, 24, 23, 25], false, false, "demo"],
        ["contributionsWithoutDonorExcludingLargeGifts", [26, 28, 27, 29], false, false, "demo"],
        ["totalContributionsExclude", [30, 32, 31, 33], false, false, "demo"],
        ["percentContributionsOnline", [39, 41, 40, 42], false, false, "demo"],
        ["totalOutsourcedEmployees", [43, 45, 44, 46], false, false, "demo"],
        ["facilitySquareFootage", [47, 49, 48, 50], false, false, "demo"],
        ["numberOfLocations", [51, 53, 52, 54], false, false, "demo"],

        // Cash (cash -> cashData)
        ["daysExpendableNetAssets", [55, 57, 56, 58], false, false, "cash"],
        ["daysOperatingCash", [59, 61, 60, 62], false, false, "cash"],
        ["availableDaysOfCashFlow", [63, 65, 64, 66], false, false, "cash"],
        ["liquidityRatio", [67, 69, 68, 70], false, false, "cash"],
        ["netCashAvailability", [71, 73, 72, 74], false, false, "cash"],
        ["netCashAvailability_including", [75, 77, 76, 78], false, false, "cash"],
        ["netCashAvailability_standard", [79, 81, 80, 82], false, false, "cash"],

        // Debt (asset -> debtData)
        ["debtToContributionsWithout", [83, 85, 84, 86], false, false, "debt"],
        ["currentRatio", [87, 89, 88, 90], false, false, "debt"],
        ["mandatoryDebtServiceToContributionsWithout", [91, 93, 92, 94], false, false, "debt"],
        ["debtPerGivingUnit", [103, 105, 104, 106], false, false, "debt"],
        ["debtPerGivingUnit_standard", [107, 109, 108, 110], false, false, "debt"],
        ["debtCoverage", [111, 113, 112, 114], false, false, "debt"],

        // Income (income -> incomeData)
        ["netIncomeRatio", [115, 117, 116, 118], false, false, "income"],
        ["contributionsWithoutDonorPerGivingUnit", [123, 125, 124, 126], false, false, "income"],
        ["totalContributionsPerGivingUnit", [131, 133, 132, 134], false, false, "income"],

        // Expense (expense -> expenseData)
        ["benefitsToSalaries", [135, 137, 136, 138], false, false, "expense"],
        ["salaries", [139, 141, 140, 142], false, false, "expense"],
        ["benefits", [143, 145, 144, 146], false, false, "expense"],
        ["salariesBenefits", [147, 149, 148, 150], false, false, "expense"],
        ["salariesBenefitsIncludingOutsourcedEmployees", [151, 153, 152, 154], false, false, "expense"],
        ["personnelToCashExpenditure", [155, 157, 156, 158], false, false, "expense"],
        ["mandatoryDebtServiceToCashExpenditure", [159, 161, 160, 162], false, false, "expense"],
        ["personnelIncludingToTotalCashExpenditures", [163, 165, 164, 166], false, false, "expense"],
        ["totalGlobalAndLocalOutreachExpenses", [175, 177, 176, 178], false, false, "expense"],
        ["cashExpendituresPerGivingUnit", [183, 185, 184, 186], false, false, "expense"],

        // Additional (misc -> additionalData)
        ["contributionsPerAccountingFTE", [187, 189, 188, 190], false, false, "additional"],
        ["expensesPerAccountingFTE", [191, 193, 192, 194], false, false, "additional"],
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
     */
    calculateStatistics(data, metricName) {
      if (data[`${metricName}_Stats`]) {
        return {
          avg: data[`${metricName}_Stats`].avg || 0,
          mid: data[`${metricName}_Stats`].median || 0,
          min: data[`${metricName}_Stats`].q1 || 0,
          max: data[`${metricName}_Stats`].q3 || 0
        };
      }
      // Get peer data
      const peerData = data[`${metricName}_Peer`];
      if (!peerData || !peerData.total || !Array.isArray(peerData.total)) {
        return { avg: 0, mid: 0, min: 0, max: 0 };
      }
  
      const values = peerData.total.filter((v) => !isNaN(parseFloat(v)));
  
      // Calculate statistics
      let avg, mid, min, max;
  
      // Average
      if (typeof getWeightedAverageOfArray === "function") {
        avg = getWeightedAverageOfArray(data, metricName, null);
      } else {
        avg = values.reduce((sum, val) => sum + Number(val), 0) / values.length;
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
  
        // Get uniqueClients - convert to a valid choice value
        let uniqueClientsSize =
          document.getElementById("uniqueClients")?.textContent || 0;
        
        // Convert numeric value to choice value for field 298
        let uniqueClientsChoice = "";
        const clientCount = parseInt(uniqueClientsSize);
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
          uniqueClientsChoice,
          sliderValue,
          sliderValue2,
          sites, 
          regions
        });
  
        // Start the XML with the XML header
        this.xmlPayload = this.XML.HEADER;
  
        // Add client data with direct field additions
        this.xmlPayload += `<field fid='${
          this.FIELD_IDS.CLIENT_RID
        }'>${this.escapeXml(ClientRid)}</field>`;
        this.xmlPayload += `<field fid='${
          this.FIELD_IDS.TOTAL_RECORDS_PEER
        }'>${this.escapeXml(totalRecordsPeer)}</field>`;
        this.xmlPayload += `<field fid='${
          this.FIELD_IDS.TYPE
        }'>${this.escapeXml("Comprehensive")}</field>`;
        this.xmlPayload += `<field fid='${
          this.FIELD_IDS.FIRM_NAME
        }'>${this.escapeXml(firmName)}</field>`;
        this.xmlPayload += `<field fid='${
          this.FIELD_IDS.UNIQUE_CLIENTS
        }'>${this.escapeXml(uniqueClientsChoice)}</field>`;
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
        const metricsXml = this.generateMetricsXml();
  
        // Add metrics XML to the existing XML payload
        this.xmlPayload += metricsXml;
  
        // Close the XML
        this.xmlPayload += this.XML.COLUMN_LIST + this.XML.FOOTER;
  
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
          const [metricName, fieldIds, begin, end, category] = mapping;
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
  
          // Calculate statistics
          const stats = this.calculateStatistics(dataObject, metricName);
  
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
     * @returns {string} XML string with metric data
     */
    generateMetricsXml() {
      let metricsXml = "";
  
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
  
        // Process each field mapping
        this.fieldMappings.forEach((mapping, index) => {
          const [metricName, fieldIds, begin, end, category] = mapping;
  
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
  
          // Calculate statistics
          const stats = this.calculateStatistics(dataObject, metricName);
  
          // Add to metrics XML
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
      } catch (error) {
        console.error("Error generating metrics XML:", error);
      }
  
      return metricsXml;
    }
  
    /**
     * Send XML data to QuickBase with added delay
     * @param {string} dataString - XML payload to send
     * @returns {Promise} Promise that resolves with the QuickBase response
     */
    printToExcel(dataString) {
      function getUrlBasedOnYearCount(format, RecordId) {
        const yearCount = selectedYears_Set.size;
        let url = "";
  
        switch (yearCount) {
          case 1:
            url = `https://www.quickbaseutilities1.com/CapinTechnology_1795/XL%20Docs/ExcelGen_UA.aspx?clientid=Q1795&appid=bps9da9i5&tpdbid=bsaavek7s&tpid=9&fn=BenchmarkReport&dbid=btcc8gq3r&msid=${RecordId}&docfmt=${format}&stream=y&apptoken=---`;
                  https://www.quickbaseutilities1.com/CapinTechnology_1795/XL%20Docs/ExcelGen_UA.aspx?clientid=Q1795&appid=bps9da9i5&tpdbid=bsaavek7s&tpid=13&fn=BenchmarkReport&dbid=btcc8gq3r&msid=970&docfmt=xls&stream=y&apptoken=---
            break;
          case 2:
            url = `https://www.quickbaseutilities1.com/CapinTechnology_1795/XL%20Docs/ExcelGen_UA.aspx?clientid=Q1795&appid=bps9da9i5&tpdbid=bsaavek7s&tpid=10&fn=BenchmarkReport&dbid=btcc8gq3r&msid=${RecordId}&docfmt=${format}&stream=y&apptoken=---`;
            break;
          case 3:
            url = `https://www.quickbaseutilities1.com/CapinTechnology_1795/XL%20Docs/ExcelGen_UA.aspx?clientid=Q1795&appid=bps9da9i5&tpdbid=bsaavek7s&tpid=11&fn=BenchmarkReport&dbid=btcc8gq3r&msid=${RecordId}&docfmt=${format}&stream=y&apptoken=---`;
            break;
          case 4:
            url = `https://www.quickbaseutilities1.com/CapinTechnology_1795/XL%20Docs/ExcelGen_UA.aspx?clientid=Q1795&appid=bps9da9i5&tpdbid=bsaavek7s&tpid=12&fn=BenchmarkReport&dbid=btcc8gq3r&msid=${RecordId}&docfmt=${format}&stream=y&apptoken=---`;
            break;
          case 5:
            url = `https://www.quickbaseutilities1.com/CapinTechnology_1795/XL%20Docs/ExcelGen_UA.aspx?clientid=Q1795&appid=bps9da9i5&tpdbid=bsaavek7s&tpid=13&fn=BenchmarkReport&dbid=btcc8gq3r&msid=${RecordId}&docfmt=${format}&stream=y&apptoken=---`;
            break;
          default:
            console.error("Invalid year count");
        }
  
        console.log(
          `Generated URL for format ${format} and RecordId ${RecordId}: ${url}`
        ); // Add this line to log the generated URL
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
  
                  // Update download links if they exist
                  const trendXLSFinal = document.getElementById("trendXLSFinal");
                  if (
                    trendXLSFinal &&
                    typeof getUrlBasedOnYearCount === "function"
                  ) {
                    trendXLSFinal.href = getUrlBasedOnYearCount("xls", recordId);
                  }
  
                  const trendPDFFinal = document.getElementById("trendPDFFinal");
                  if (
                    trendPDFFinal &&
                    typeof getUrlBasedOnYearCount === "function"
                  ) {
                    trendPDFFinal.href = getUrlBasedOnYearCount("pdf", recordId);
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
