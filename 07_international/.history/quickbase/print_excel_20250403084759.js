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
      CLIENT_RID: "171",
      FIRM_NAME: "170",
      UNIQUE_CLIENTS: "169",
      SLIDER_MIN: "163",
      SLIDER_MAX: "164",
      MISSION_MIN: "165",
      MISSION_MAX: "166",
      AREAS: "167",
      TYPES: "168",
      YEARS_START: "158",
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
      // Create a temporary XML for metrics data
      let metricsXml = "";

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

      // Get uniqueClients
      let uniqueClientsSize =
        document.getElementById("uniqueClients")?.textContent || 0;

      // IMPORTANT: Direct access to global variables for filters
      const sliderValue = document.getElementById("givingUnitsMin")?.value || 0;
      const sliderValue2 =
        document.getElementById("givingUnitsMax")?.value || 0;
      const missionValue =
        document.getElementById("missionUnitsMin")?.value || 0;
      const missionValue2 =
        document.getElementById("missionUnitsMax")?.value || 0;

      // Get types and areas from global arrays
      let types = "";
      if (window.selectedTypes_Array) {
        // Check if it's a Set
        if (window.selectedTypes_Array instanceof Set) {
          types = Array.from(window.selectedTypes_Array).join(";");
        }
        // Check if it's an Array
        else if (Array.isArray(window.selectedTypes_Array)) {
          types = window.selectedTypes_Array.join(";");
        }
      }

      let areas = "";
      if (window.selectedAreas_Array) {
        // Check if it's a Set
        if (window.selectedAreas_Array instanceof Set) {
          areas = Array.from(window.selectedAreas_Array).join(";");
        }
        // Check if it's an Array
        else if (Array.isArray(window.selectedAreas_Array)) {
          areas = window.selectedAreas_Array.join(";");
        }
      }

      // Debug log values
      console.log("Client data values:", {
        ClientRid,
        firmName,
        uniqueClientsSize,
        sliderValue,
        sliderValue2,
        missionValue,
        missionValue2,
        types,
        areas,
      });

      // Start the XML with the XML header
      this.xmlPayload = this.XML.HEADER;

      // Add client data with direct field additions
      this.xmlPayload += `<field fid='${
        this.FIELD_IDS.CLIENT_RID
      }'>${this.escapeXml(ClientRid)}</field>`;
      this.xmlPayload += `<field fid='${
        this.FIELD_IDS.FIRM_NAME
      }'>${this.escapeXml(firmName)}</field>`;
      this.xmlPayload += `<field fid='${
        this.FIELD_IDS.UNIQUE_CLIENTS
      }'>${this.escapeXml(uniqueClientsSize)}</field>`;
      this.xmlPayload += `<field fid='${
        this.FIELD_IDS.SLIDER_MIN
      }'>${this.escapeXml(sliderValue)}</field>`;
      this.xmlPayload += `<field fid='${
        this.FIELD_IDS.SLIDER_MAX
      }'>${this.escapeXml(sliderValue2)}</field>`;
      this.xmlPayload += `<field fid='${
        this.FIELD_IDS.MISSION_MIN
      }'>${this.escapeXml(missionValue)}</field>`;
      this.xmlPayload += `<field fid='${
        this.FIELD_IDS.MISSION_MAX
      }'>${this.escapeXml(missionValue2)}</field>`;
      this.xmlPayload += `<field fid='${this.FIELD_IDS.AREAS}'>${this.escapeXml(
        areas
      )}</field>`;
      this.xmlPayload += `<field fid='${this.FIELD_IDS.TYPES}'>${this.escapeXml(
        types
      )}</field>`;

      // Add years - MODIFIED TO ENSURE YEARS USE CORRECT FIELD IDS
      const selectedYears = getSelectedYearsFromLocalStorage() || [];
      for (let i = 0; i < selectedYears.length; i++) {
        const year = selectedYears[i];
        // Make sure we're using the correct field ID from YEARS_START
        // This is the key change to fix the issue
        const fieldId = Number(this.FIELD_IDS.YEARS_START) + i;

        // Ensure we're not using the same field IDs as slider or mission fields
        if (
          fieldId.toString() === this.FIELD_IDS.SLIDER_MIN ||
          fieldId.toString() === this.FIELD_IDS.SLIDER_MAX ||
          fieldId.toString() === this.FIELD_IDS.MISSION_MIN ||
          fieldId.toString() === this.FIELD_IDS.MISSION_MAX
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

      // Debug log client data XML
      console.log("XML with client data:", this.xmlPayload);

      // Process metrics data
      const metricsXml = this.generateMetricsXml();

      // Add metrics XML to the existing XML payload
      this.xmlPayload += metricsXml;

      // Close the XML
      this.xmlPayload += this.XML.COLUMN_LIST + this.XML.FOOTER;

      // Debug: Log final XML
      console.log(
        "Final XML payload (first 500 chars):",
        this.xmlPayload.substring(0, 500)
      );
      console.log(
        "Final XML payload (last 50 chars):",
        this.xmlPayload.substring(this.xmlPayload.length - 50)
      );

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

  /*
   * Generate XML for metrics data
   * @returns {string} XML string with metric data
   */
  generateMetricsXml() {
    let metricsXml = "";

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
      { once: true }  // This ensures the event only fires once per click
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
