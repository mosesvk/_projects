/**
 * Simplified Excel Report Integration
 * Handles XML generation and QuickBase API integration
 */
class ExcelReportGenerator {
  constructor() {
    // API Constants
    this.API = {
      APP_TOKEN: "bpat4pgu9t69yby5gbemdbej52j",
      UPLOAD_URL: "https://capincrouse.quickbase.com/db/bt76haf6m?a=API_AddRecord",
    };

    // XML Template Strings
    this.XML = {
      HEADER: `<?xml version="1.0" ?><qdbapi><apptoken>${this.API.APP_TOKEN}</apptoken>`,
      FOOTER: "</qdbapi>",
      COLUMN_LIST: "<clist>171</clist>",
    };

    // Field IDs for QuickBase
    this.FIELD_IDS = {
      CLIENT_RID: 171,
      FIRM_NAME: 170,
      UNIQUE_CLIENTS: 169,
      SLIDER_MIN: 163,
      SLIDER_MAX: 164,
      MISSION_MIN: 165,
      MISSION_MAX: 166,
      REGIONS: 167,
      TYPES: 168,
      YEARS_START: 158,
    };

    // XML payload storage
    this.xmlPayload = "";
    
    // Field metric mappings
    this.fieldMappings = [
      // General data
      ["itExpenses", [6, 44, 82, 120], true, false],
      
      // Cash data
      ["daysCashOnHand", [7, 45, 83, 121], false, false],
      ["daysExpensesInUnrestrictedNA", [8, 46, 84, 122], false, false],
      ["daysExpensesInUnrestrictedNA_excludingPPE", [9, 47, 85, 123], false, false],
      ["daysExpensesInNAwithDR", [10, 48, 86, 124], false, false],
      ["daysExpensesInNAwithDR_excludingPPE", [11, 49, 87, 125], false, false],
      ["liquidityFundsAvailable", [12, 50, 88, 126], false, false],
      ["financialAssetsAvailableFY", [13, 51, 89, 127], false, false],
      ["daysFinancialAssetsOnHand", [14, 52, 90, 128], false, false],
      ["currentRatio", [15, 53, 91, 129], false, false],
      ["totalCoverageRatio", [16, 54, 92, 130], false, false],
      ["cashFlowsTrendFinancing", [17, 55, 93, 131], false, false],
      ["cashFlowsTrendInvesting", [18, 56, 94, 132], false, false],
      ["cashFlowsTrendOperating", [19, 57, 95, 133], false, false],
      
      // Asset data
      ["percentWithDR", [20, 58, 96, 134], false, false],
      ["percentWithoutDR_excludingPPE", [21, 59, 97, 135], false, false],
      ["percentWithoutDR", [22, 60, 98, 136], false, false],
      
      // Income data
      ["netIncomeRatio", [23, 61, 99, 137], false, false],
      ["contributionsTrend_basedOnNumberOfDonors", [24, 62, 100, 138], false, false],
      ["contributionsTrend", [25, 63, 101, 139], false, false],
      ["contributionsPercentWithoutDR", [26, 64, 102, 140], false, false],
      ["contributionsPercentWithDR", [27, 65, 103, 141], false, false],
      ["contributionsPerGivingUnit", [28, 66, 104, 142], false, false],
      ["contributionsPerMissionaryUnit", [29, 67, 105, 143], false, false],
      ["contributionsPerFullTimeEquivalent", [30, 68, 106, 144], false, false],
      ["fundraisingAsPercentOfContributions", [31, 69, 107, 145], false, false],
      ["annualizedInvestmentReturn", [32, 70, 108, 146], false, false],
      
      // Expense data
      ["functionalExpensePercent_program", [33, 71, 109, 147], false, false],
      ["functionalExpensePercent_administrative", [34, 72, 110, 148], false, false],
      ["functionalExpensePercent_fundraising", [35, 73, 111, 149], false, false],
      ["costOfContributions", [37, 75, 113, 151], false, false],
      ["expensesPerGivingUnit", [38, 76, 114, 152], false, false],
      ["expensesPerMissionaryUnit", [39, 77, 115, 153], false, false],
      ["expensesPerFullTimeEquivalent", [40, 78, 116, 154], false, false],
      ["salariesAndBenefitsAsPercentOfTotalExpenses", [41, 79, 117, 155], false, false],
      ["salariesAndBenefitsPerFTE", [42, 80, 118, 156], false, false],
      
      // Misc data
      ["percentageAssessmentOnRestrictedGifts", [43, 81, 119, 157], false, true]
    ];
    
    this.init();
  }

  /**
   * Initialize the Excel report generator
   */
  init() {
    const generateReportsBtn = document.getElementById("generateReports");
    if (generateReportsBtn) {
      generateReportsBtn.addEventListener("click", this.handleGenerateReport.bind(this));
    }
  }

  /**
   * Handle generate report button click
   */
  handleGenerateReport() {
    const button = document.getElementById("generateReports");
    
    if (typeof toggleButtonLoadingState === 'function') {
      toggleButtonLoadingState(button);
    } else {
      button.disabled = true;
      button.textContent = 'Generating...';
    }

    // Validate data is available
    if (!localStorage.generalData) {
      if (typeof createToastWarning === 'function') {
        createToastWarning("No data available. Please select years and run the report first.");
      }
      
      if (typeof toggleGenerateReportButtonNormalState === 'function') {
        toggleGenerateReportButtonNormalState(button);
      } else {
        button.disabled = false;
        button.textContent = 'Generate Reports';
      }
      return;
    }

    // Generate report with slight delay to ensure UI updates
    setTimeout(() => {
      this.createPrintExcel()
        .then(() => {
          if (typeof toggleGenerateReportButtonNormalState === 'function') {
            toggleGenerateReportButtonNormalState(button);
          } else {
            button.disabled = false;
            button.textContent = 'Generate Reports';
          }
        })
        .catch((error) => {
          console.error("Report generation failed:", error);
          
          if (typeof createToastWarning === 'function') {
            createToastWarning(`Report generation failed: ${error.message || "Unknown error"}`);
          }
          
          if (typeof toggleGenerateReportButtonNormalState === 'function') {
            toggleGenerateReportButtonNormalState(button);
          } else {
            button.disabled = false;
            button.textContent = 'Generate Reports';
          }
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
    // Get peer data
    const peerData = data[`${metricName}_Peer`];
    if (!peerData || !peerData.total || !Array.isArray(peerData.total)) {
      return { avg: 0, mid: 0, min: 0, max: 0 };
    }
    
    const values = peerData.total.filter(v => !isNaN(parseFloat(v)));
    
    // Calculate statistics
    let avg, mid, min, max;
    
    // Average
    if (typeof getWeightedAverageOfArray === 'function') {
      avg = getWeightedAverageOfArray(data, metricName, null);
    } else {
      avg = values.reduce((sum, val) => sum + Number(val), 0) / values.length;
    }
    
    // Percentiles
    if (typeof get25thPercentileOfArray === 'function' && 
        typeof getMidpointOfArray === 'function' && 
        typeof get75thPercentileOfArray === 'function') {
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
   * Prepare all field data for QuickBase export
   */
  prepareAllFieldData() {
    try {
      // Get all data from localStorage
      const generalData = JSON.parse(localStorage.getItem("generalData") || "{}");
      const cashData = JSON.parse(localStorage.getItem("cashData") || "{}");
      const assetData = JSON.parse(localStorage.getItem("assetData") || "{}");
      const incomeData = JSON.parse(localStorage.getItem("incomeData") || "{}");
      const expenseData = JSON.parse(localStorage.getItem("expenseData") || "{}");
      const miscData = JSON.parse(localStorage.getItem("miscData") || "{}");
      
      // Process each field mapping
      this.fieldMappings.forEach(mapping => {
        const [metricName, fieldIds, begin, end] = mapping;
        
        // Find which data object contains this metric
        let dataObject = null;
        
        if (generalData[`${metricName}_Peer`]) {
          dataObject = generalData;
        } else if (cashData[`${metricName}_Peer`]) {
          dataObject = cashData;
        } else if (assetData[`${metricName}_Peer`]) {
          dataObject = assetData;
        } else if (incomeData[`${metricName}_Peer`]) {
          dataObject = incomeData;
        } else if (expenseData[`${metricName}_Peer`]) {
          dataObject = expenseData;
        } else if (miscData[`${metricName}_Peer`]) {
          dataObject = miscData;
        }
        
        if (!dataObject) {
          return; // Skip if no data found
        }
        
        // Calculate statistics
        const stats = this.calculateStatistics(dataObject, metricName);
        
        // Add to XML
        this.uploadToFile(
          stats.avg,
          stats.mid,
          stats.min,
          stats.max,
          fieldIds,
          begin,
          end
        );
      });
      
    } catch (error) {
      console.error("Error preparing field data:", error);
    }
  }

  /**
   * Generate Excel report with all data
   */
  async createPrintExcel() {
    // Reset XML payload
    this.xmlPayload = "";

    try {
      // Start a new XML document
      this.xmlPayload = this.XML.HEADER;

      // Add client information
      const ClientRid = window.ClientRid || "";
      let firmName = window.firmName || "";
      
      // Handle HTML element case
      firmName = typeof firmName === "object" && firmName instanceof HTMLElement
        ? firmName.textContent || ""
        : firmName;

      // Handle uniqueClients properly - it might be a Set or not defined
      let uniqueClientsSize = 0;
      const uniqueClients = window.uniqueClients || null;
      if (uniqueClients) {
        uniqueClientsSize =
          uniqueClients instanceof Set
            ? uniqueClients.size
            : Array.isArray(uniqueClients) && uniqueClients.length
            ? uniqueClients.length
            : document.getElementById("uniqueClients")?.textContent || 0;
      }

      // Get slider values with defaults
      const sliderValue = window.sliderValue || 0;
      const sliderValue2 = window.sliderValue2 || 0;
      const missionValue = window.missionValue || 0;
      const missionValue2 = window.missionValue2 || 0;

      // Get selected types and regions safely
      const selectedTypes_Array = window.selectedTypes_Array || new Set();
      const selectedRegions_Array = window.selectedRegions_Array || new Set();

      // Format arrays as strings
      const types = selectedTypes_Array instanceof Set
        ? Array.from(selectedTypes_Array).join(";")
        : Array.isArray(selectedTypes_Array)
        ? selectedTypes_Array.join(";")
        : "";

      const regions = selectedRegions_Array instanceof Set
        ? Array.from(selectedRegions_Array).join(";")
        : Array.isArray(selectedRegions_Array)
        ? selectedRegions_Array.join(";")
        : "";

      // Add client and filter data
      this.uploadSingleToFile(this.FIELD_IDS.CLIENT_RID, ClientRid);
      this.uploadSingleToFile(this.FIELD_IDS.FIRM_NAME, firmName);
      this.uploadSingleToFile(this.FIELD_IDS.UNIQUE_CLIENTS, uniqueClientsSize);
      this.uploadSingleToFile(this.FIELD_IDS.SLIDER_MIN, sliderValue);
      this.uploadSingleToFile(this.FIELD_IDS.SLIDER_MAX, sliderValue2);
      this.uploadSingleToFile(this.FIELD_IDS.MISSION_MIN, missionValue);
      this.uploadSingleToFile(this.FIELD_IDS.MISSION_MAX, missionValue2);
      this.uploadSingleToFile(this.FIELD_IDS.REGIONS, regions);
      this.uploadSingleToFile(this.FIELD_IDS.TYPES, types);

      // Add years
      const selectedYears = getSelectedYearsFromLocalStorage() || [];
      let j = this.FIELD_IDS.YEARS_START;

      // Add years to XML
      selectedYears.forEach((year, index) => {
        const isLast = index === selectedYears.length - 1;
        this.uploadSingleToFile(j, year, isLast);
        j++;
      });

      // If we have no years, close the XML properly
      if (selectedYears.length === 0) {
        this.xmlPayload += this.XML.COLUMN_LIST + this.XML.FOOTER;
      }

      // Prepare metric data
      this.prepareAllFieldData();

      // Send to QuickBase
      const result = await this.printToExcel(this.xmlPayload);
      return result;
    } catch (error) {
      console.error("Error creating Excel report:", error);
      throw error;
    }
  }

  /**
   * Send XML data to QuickBase
   */
  printToExcel(dataString) {
    return new Promise((resolve, reject) => {
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
            const xmlUpload = $(response);
            const errorCode = xmlUpload.find("qdbapi").find("errcode").text();

            if (errorCode === "0") {
              const recordId = xmlUpload.find("qdbapi").find("rid").text();

              if (typeof createToastSuccess === 'function') {
                createToastSuccess("Generated Reports successfully to Quickbase.");
              }

              const printModalFooter = document.getElementById("print_modal_footer");
              if (printModalFooter) {
                printModalFooter.classList.remove("hidden");
              }

              // Update download links if they exist
              const trendXLSFinal = document.getElementById("trendXLSFinal");
              if (trendXLSFinal && typeof getUrlBasedOnYearCount === 'function') {
                trendXLSFinal.href = getUrlBasedOnYearCount("xls", recordId);
              }

              const trendPDFFinal = document.getElementById("trendPDFFinal");
              if (trendPDFFinal && typeof getUrlBasedOnYearCount === 'function') {
                trendPDFFinal.href = getUrlBasedOnYearCount("pdf", recordId);
              }

              resolve({ recordId });
            } else {
              const errorText = xmlUpload.find("qdbapi").find("errtext").text() || "Unknown QuickBase error";
              const error = new Error(`QuickBase error (${errorCode}): ${errorText}`);
              console.error(error);
              
              if (typeof createToastWarning === 'function') {
                createToastWarning(error.message);
              }
              
              reject(error);
            }
          } catch (parseError) {
            console.error("Error parsing QuickBase response:", parseError);
            
            if (typeof createToastWarning === 'function') {
              createToastWarning(`Failed to parse QuickBase response: ${parseError.message}`);
            }
            
            reject(new Error(`Failed to parse QuickBase response: ${parseError.message}`));
          }
        },
        error: function (xhr, status, error) {
          // Extract meaningful error information
          let errorMessage = "Unknown error";

          if (xhr && xhr.responseText) {
            try {
              // Try to parse XML response
              const $errorXml = $(xhr.responseText);
              errorMessage = $errorXml.find("errtext").text() || error || status;
            } catch (e) {
              // If we can't parse XML, use the raw responseText or status
              errorMessage = xhr.responseText || error || status;
            }
          } else {
            errorMessage = error || status;
          }

          console.error("QuickBase API error:", {
            status,
            error,
            message: errorMessage,
          });

          if (typeof createToastWarning === 'function') {
            createToastWarning(`QuickBase API error: ${errorMessage}`);
          }
          
          reject(new Error(`QuickBase API error: ${errorMessage}`));
        },
      });
    });
  }
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  // Create an instance
  const excelReportGenerator = new ExcelReportGenerator();
  
  // Expose functions globally for backward compatibility
  window.excelReportGenerator = excelReportGenerator;
  window.createPrintExcel = excelReportGenerator.createPrintExcel.bind(excelReportGenerator);
  window.uploadToFile = excelReportGenerator.uploadToFile.bind(excelReportGenerator);
  window.uploadSingleToFile = excelReportGenerator.uploadSingleToFile.bind(excelReportGenerator);
  window.printToExcel = excelReportGenerator.printToExcel.bind(excelReportGenerator);
});