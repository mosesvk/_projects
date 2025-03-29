/**
 * Simplified Excel Report Integration
 * Handles XML generation and QuickBase API integration
 */
class ExcelReportGenerator {
  constructor() {
    // API Constants
    this.API = {
      APP_TOKEN: "bpat4pgu9t69yby5gbemdbej52j",
      UPLOAD_URL:
        "https://capincrouse.quickbase.com/db/bt76haf6m?a=API_AddRecord",
    };

    // XML Template Strings
    this.XML = {
      HEADER: `<?xml version="1.0" ?><qdbapi><apptoken>${this.API.APP_TOKEN}</apptoken>`,
      FOOTER: "</qdbapi>",
      COLUMN_LIST: "<clist>171</clist>",
    };

    this.FIELD_IDS = {
      CLIENT_RID: '171',
      FIRM_NAME: '170',
      UNIQUE_CLIENTS: '169',
      SLIDER_MIN: '163',
      SLIDER_MAX: '164',
      MISSION_MIN: '165',
      MISSION_MAX: '166',
      REGIONS: '167',
      TYPES: '168',
      YEARS_START: '158',
    };

    // XML payload storage
    this.xmlPayload = "";

    // Field metric mappings
    this.fieldMappings = [
      // General data
      ["itExpenses", [6, 44, 82, 120], true, false, "general"],

      // Cash data
      ["daysCashOnHand", [7, 45, 83, 121], false, false, "cash"],
      ["daysExpensesInUnrestrictedNA", [8, 46, 84, 122], false, false, "cash"],
      [
        "daysExpensesInUnrestrictedNA_excludingPPE",
        [9, 47, 85, 123],
        false,
        false,
        "cash",
      ],
      ["daysExpensesInNAwithDR", [10, 48, 86, 124], false, false, "cash"],
      [
        "daysExpensesInNAwithDR_excludingPPE",
        [11, 49, 87, 125],
        false,
        false,
        "cash",
      ],
      ["liquidityFundsAvailable", [12, 50, 88, 126], false, false, "cash"],
      ["financialAssetsAvailableFY", [13, 51, 89, 127], false, false, "cash"],
      ["daysFinancialAssetsOnHand", [14, 52, 90, 128], false, false, "cash"],
      ["currentRatio", [15, 53, 91, 129], false, false, "cash"],
      ["totalCoverageRatio", [16, 54, 92, 130], false, false, "cash"],
      ["cashFlowsTrendFinancing", [17, 55, 93, 131], false, false, "cash"],
      ["cashFlowsTrendInvesting", [18, 56, 94, 132], false, false, "cash"],
      ["cashFlowsTrendOperating", [19, 57, 95, 133], false, false, "cash"],

      // Asset data
      ["percentWithDR", [20, 58, 96, 134], false, false, "asset"],
      [
        "percentWithoutDR_excludingPPE",
        [21, 59, 97, 135],
        false,
        false,
        "asset",
      ],
      ["percentWithoutDR", [22, 60, 98, 136], false, false, "asset"],

      // Income data
      ["netIncomeRatio", [23, 61, 99, 137], false, false, "income"],
      [
        "contributionsTrend_basedOnNumberOfDonors",
        [24, 62, 100, 138],
        false,
        false,
        "income",
      ],
      ["contributionsTrend", [25, 63, 101, 139], false, false, "income"],
      [
        "contributionsPercentWithoutDR",
        [26, 64, 102, 140],
        false,
        false,
        "income",
      ],
      [
        "contributionsPercentWithDR",
        [27, 65, 103, 141],
        false,
        false,
        "income",
      ],
      [
        "contributionsPerGivingUnit",
        [28, 66, 104, 142],
        false,
        false,
        "income",
      ],
      [
        "contributionsPerMissionaryUnit",
        [29, 67, 105, 143],
        false,
        false,
        "income",
      ],
      [
        "contributionsPerFullTimeEquivalent",
        [30, 68, 106, 144],
        false,
        false,
        "income",
      ],
      [
        "fundraisingAsPercentOfContributions",
        [31, 69, 107, 145],
        false,
        false,
        "income",
      ],
      [
        "annualizedInvestmentReturn",
        [32, 70, 108, 146],
        false,
        false,
        "income",
      ],

      // Expense data
      [
        "functionalExpensePercent_program",
        [33, 71, 109, 147],
        false,
        false,
        "expense",
      ],
      [
        "functionalExpensePercent_administrative",
        [34, 72, 110, 148],
        false,
        false,
        "expense",
      ],
      [
        "functionalExpensePercent_fundraising",
        [35, 73, 111, 149],
        false,
        false,
        "expense",
      ],
      ["costOfContributions", [37, 75, 113, 151], false, false, "expense"],
      ["expensesPerGivingUnit", [38, 76, 114, 152], false, false, "expense"],
      [
        "expensesPerMissionaryUnit",
        [39, 77, 115, 153],
        false,
        false,
        "expense",
      ],
      [
        "expensesPerFullTimeEquivalent",
        [40, 78, 116, 154],
        false,
        false,
        "expense",
      ],
      [
        "salariesAndBenefitsAsPercentOfTotalExpenses",
        [41, 79, 117, 155],
        false,
        false,
        "expense",
      ],
      [
        "salariesAndBenefitsPerFTE",
        [42, 80, 118, 156],
        false,
        false,
        "expense",
      ],

      // Misc data
      [
        "percentageAssessmentOnRestrictedGifts",
        [43, 81, 119, 157],
        false,
        false,
        "misc",
      ],
    ];

    this.init();
  }

  /**
   * Initialize the Excel report generator
   */
  init() {
    const generateReportsBtn = document.getElementById("generateReports");
    if (generateReportsBtn) {
      generateReportsBtn.addEventListener(
        "click",
        this.handleGenerateReport.bind(this)
      );
    }
  }

  /**
   * Handle generate report button click
   */
  handleGenerateReport() {
    const button = document.getElementById("generateReports");

    if (typeof toggleButtonLoadingState === "function") {
      toggleButtonLoadingState(button);
    } else {
      button.disabled = true;
      button.textContent = "Generating...";
    }

    // Validate data is available
    if (!localStorage.generalData) {
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
   * Prepare all field data for QuickBase export
   */
  prepareAllFieldData() {
    try {
      // Get all data from localStorage
      const generalData = JSON.parse(
        localStorage.getItem("generalData") || "{}"
      );
      const cashData = JSON.parse(localStorage.getItem("cashData") || "{}");
      const assetData = JSON.parse(localStorage.getItem("assetData") || "{}");
      const incomeData = JSON.parse(localStorage.getItem("incomeData") || "{}");
      const expenseData = JSON.parse(
        localStorage.getItem("expenseData") || "{}"
      );
      const miscData = JSON.parse(localStorage.getItem("miscData") || "{}");

      // Process each field mapping
      this.fieldMappings.forEach((mapping, index) => {
        const [metricName, fieldIds, begin, end, category] = mapping;
        const isLastMetric = index === this.fieldMappings.length - 1;

        // Find which data object contains this metric based on category
        let dataObject;
        switch (category) {
          case "general":
            dataObject = generalData;
            break;
          case "cash":
            dataObject = cashData;
            break;
          case "asset":
            dataObject = assetData;
            break;
          case "income":
            dataObject = incomeData;
            break;
          case "expense":
            dataObject = expenseData;
            break;
          case "misc":
            dataObject = miscData;
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

        // Add to XML - Force end=true if this is the last metric
        this.uploadToFile(
          stats.avg,
          stats.mid,
          stats.min,
          stats.max,
          fieldIds,
          begin,
          end || isLastMetric
        );
      });

      // As a safeguard, always make sure the XML is properly closed
      if (!this.xmlPayload.includes("</qdbapi>")) {
        this.xmlPayload += this.XML.COLUMN_LIST + this.XML.FOOTER;
      }
    } catch (error) {
      console.error("Error preparing field data:", error);
      // Always close XML even if there's an error
      if (!this.xmlPayload.includes("</qdbapi>")) {
        this.xmlPayload += this.XML.COLUMN_LIST + this.XML.FOOTER;
      }
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

      // Add client information and filters - IMPORTANT!
      const ClientRid = window.ClientRid || "";
      let firmName = window.firmName || "";
      firmName =
        typeof firmName === "object" && firmName instanceof HTMLElement
          ? firmName.textContent || ""
          : firmName;

      // Handle uniqueClients count
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
      const types =
        selectedTypes_Array instanceof Set
          ? Array.from(selectedTypes_Array).join(";")
          : Array.isArray(selectedTypes_Array)
          ? selectedTypes_Array.join(";")
          : "";

      const regions =
        selectedRegions_Array instanceof Set
          ? Array.from(selectedRegions_Array).join(";")
          : Array.isArray(selectedRegions_Array)
          ? selectedRegions_Array.join(";")
          : "";

      // Add client and filter data - MUST BE ADDED FIRST BEFORE ANY METRICS
      console.log("Adding client data to XML:", {
        ClientRid,
        firmName,
        uniqueClientsSize,
        sliderValue,
        sliderValue2,
        missionValue,
        missionValue2,
        types,
        regions,
      });

      // Make sure these fields are explicitly added
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
        const isLast =
          index === selectedYears.length - 1 && this.fieldMappings.length === 0;
        this.uploadSingleToFile(j, year, isLast);
        j++;
      });

      // Set to true if we're NOT processing any metrics (rare case)
      const skipMetrics = this.fieldMappings.length === 0;

      // If we're skipping metrics, make sure to close the XML
      if (skipMetrics) {
        if (!this.xmlPayload.includes("<clist>")) {
          this.xmlPayload += this.XML.COLUMN_LIST;
        }

        if (!this.xmlPayload.includes("</qdbapi>")) {
          this.xmlPayload += this.XML.FOOTER;
        }
      } else {
        // Process metrics
        this.prepareAllFieldData();

        // Safety check to ensure XML is properly closed
        if (!this.xmlPayload.includes("<clist>")) {
          this.xmlPayload += this.XML.COLUMN_LIST;
        }

        if (!this.xmlPayload.includes("</qdbapi>")) {
          this.xmlPayload += this.XML.FOOTER;
        }
      }

      console.log("Final XML payload:", this.xmlPayload);

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
      // Debug: Log the XML payload to console
      console.log("XML Payload being sent to QuickBase:");
      console.log(dataString);

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
    });
  }
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  // Create an instance
  const excelReportGenerator = new ExcelReportGenerator();

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
