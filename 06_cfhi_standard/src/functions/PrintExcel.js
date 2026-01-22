/**
 * Simplified Excel Report Integration for Standard Project
 * Handles XML generation and QuickBase API integration
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

    // Field metric mappings for Standard Project (9 metrics)
    // Format per entry: [metricName, [AVG, MIN, MID, MAX], category, useWeightedAvg]
    // useWeightedAvg matches "wa" flag from Report.js
    // Field IDs: Standard uses 6-41 (different from Comprehensive's S-prefix 239-286)
    // Both use same upload table (btcc8gq3r) but different field ranges based on TYPE field
    this.fieldMappings = [
      // General (Standard uses "general" category, Comprehensive uses "demo")
      ["givingUnits", [6, 8, 7, 9], "general", false],
      ["contributionsWithoutDonorExcludingLargeGifts", [10, 12, 11, 13], "general", false],

      // Cash
      ["daysOperatingCash", [14, 16, 15, 17], "cash", true],
      ["netCashAvailability_standard", [18, 20, 19, 21], "cash", false],

      // Debt
      ["debtToContributionsWithout", [22, 24, 23, 25], "debt", true],
      ["debtPerGivingUnit", [26, 28, 27, 29], "debt", true],

      // Income
      ["contributionsWithoutDonorPerGivingUnit", [30, 32, 31, 33], "income", true],
      ["totalContributionsPerGivingUnit", [34, 36, 35, 37], "income", true],

      // Expense
      ["cashExpendituresPerGivingUnit", [38, 40, 39, 41], "expense", true],
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
    }
  }

  /**
   * Clean up Excel report generator data and reset state
   */
  cleanup() {
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
  }

  /**
   * Handle generate report button click
   */
  handleGenerateReport() {
    // Check if this function is already running to prevent duplicate calls
    if (this.isGenerating) {
      // console.warn("Generation already in progress, ignoring duplicate call");
      return;
    }

    this.isGenerating = true;
    const button = document.getElementById("generateReports");

    // Use toggleButtonLoadingState if available, otherwise use direct manipulation
    if (typeof toggleButtonLoadingState === "function") {
      toggleButtonLoadingState(button);
    } else {
      button.disabled = true;
      button.textContent = "Generating...";
    }

    // Validate data is available (use Standard Project data categories)
    if (!localStorage.getItem("generalData") &&
        !localStorage.getItem("cashData") &&
        !localStorage.getItem("debtData") &&
        !localStorage.getItem("incomeData") &&
        !localStorage.getItem("expenseData")) {
      if (typeof createToastWarning === "function") {
        createToastWarning(
          "No data available. Please select years and run the report first."
        );
      }

      // Use toggleGenerateReportButtonNormalState if available
      if (typeof toggleGenerateReportButtonNormalState === "function") {
        toggleGenerateReportButtonNormalState(button);
      } else {
        button.disabled = false;
        button.textContent = "Generate Trends and Benchmark Reports";
      }

      this.isGenerating = false;
      return;
    }

    // Generate report with slight delay to ensure UI updates
    setTimeout(() => {
      this.createPrintExcel()
        .then(() => {
          // Use toggleGenerateReportButtonNormalState if available
          if (typeof toggleGenerateReportButtonNormalState === "function") {
            toggleGenerateReportButtonNormalState(button);
          } else {
            button.disabled = false;
            button.textContent = "Generate Trends and Benchmark Reports";
          }

          this.isGenerating = false;
        })
        .catch((error) => {
          // console.error("Report generation failed:", error);

          if (typeof createToastWarning === "function") {
            createToastWarning(
              `Report generation failed: ${error.message || "Unknown error"}`
            );
          }

          // Use toggleGenerateReportButtonNormalState if available
          if (typeof toggleGenerateReportButtonNormalState === "function") {
            toggleGenerateReportButtonNormalState(button);
          } else {
            button.disabled = false;
            button.textContent = "Generate Trends and Benchmark Reports";
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
   * Process data arrays and calculate statistics.
   * @param {Object} data - Data object containing _Peer and optional _Stats
   * @param {string} metricName - Metric name
   * @param {boolean} useWeightedAvg - If true, use getWeightedAverageOfArray for avg (matches Report "wa" flag)
   */
  calculateStatistics(data, metricName, useWeightedAvg = false) {
    if (data[`${metricName}_Stats`]) {
      return {
        avg: data[`${metricName}_Stats`].avg || 0,
        mid: data[`${metricName}_Stats`].median || 0,
        min: data[`${metricName}_Stats`].q1 || 0,
        max: data[`${metricName}_Stats`].q3 || 0
      };
    }
    const peerData = data[`${metricName}_Peer`];
    if (!peerData || !peerData.total || !Array.isArray(peerData.total)) {
      return { avg: 0, mid: 0, min: 0, max: 0 };
    }

    const values = peerData.total.filter((v) => !isNaN(parseFloat(v)));
    let avg, mid, min, max;

    if (useWeightedAvg && typeof getWeightedAverageOfArray === "function") {
      try {
        avg = getWeightedAverageOfArray(data, metricName, null);
      } catch (e) {
        avg = values.length
          ? values.reduce((sum, val) => sum + Number(val), 0) / values.length
          : 0;
      }
    } else if (typeof getAverageOfArray === "function") {
      avg = getAverageOfArray(peerData.total, metricName);
    } else {
      avg = values.length
        ? values.reduce((sum, val) => sum + Number(val), 0) / values.length
        : 0;
    }
    if (avg === undefined || avg === null || isNaN(avg)) avg = 0;

    if (
      typeof get25thPercentileOfArray === "function" &&
      typeof getMidpointOfArray === "function" &&
      typeof get75thPercentileOfArray === "function"
    ) {
      min = get25thPercentileOfArray(peerData.total, metricName);
      mid = getMidpointOfArray(peerData.total, metricName);
      max = get75thPercentileOfArray(peerData.total, metricName);
    } else {
      const sorted = [...values].sort((a, b) => a - b);
      min = sorted[Math.floor(sorted.length * 0.25)] ?? 0;
      mid = sorted[Math.floor(sorted.length * 0.5)] ?? 0;
      max = sorted[Math.floor(sorted.length * 0.75)] ?? 0;
    }

    return { avg, mid, min, max };
  }

  /**
   * Add peer statistics to XML payload
   */
  uploadToFile(avg, mid, min, max, fIdArray, begin, end) {
    if (!fIdArray || !Array.isArray(fIdArray) || fIdArray.length < 4) {
      // console.warn("Invalid fIdArray provided to uploadToFile:", fIdArray);
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
      // console.warn("Invalid field ID provided to uploadSingleToFile");
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
      // NOT totalRecordsPeer which includes multiple years (matches Comprehensive)
      let uniqueClientsSize =
        document.getElementById("uniqueClients")?.textContent || 
        window.uniqueClientSize || 
        0;
      
      // Parse to integer - this will be used for TOTAL_RECORDS_PEER field
      // Fallback to totalRecordsPeer if uniqueClients not available
      const clientCount = parseInt(uniqueClientsSize) || window.totalRecordsPeer || 0;

      // Direct access to global variables for filters
      const sliderValue = window.sliderValue || 0;
      const sliderValue2 = window.sliderValue2 || 0;

      // Get sites and regions from global arrays
      let sites = "";
      if (window.selectedSites_Array) {
        if (window.selectedSites_Array instanceof Set) {
          sites = Array.from(window.selectedSites_Array).join(";");
        } else if (Array.isArray(window.selectedSites_Array)) {
          sites = window.selectedSites_Array.join(";");
        }
      }

      let regions = "";
      if (window.selectedRegions_Array) {
        if (window.selectedRegions_Array instanceof Set) {
          regions = Array.from(window.selectedRegions_Array).join(";");
        } else if (Array.isArray(window.selectedRegions_Array)) {
          regions = window.selectedRegions_Array.join(";");
        }
      }

      // Start the XML with the XML header
      this.xmlPayload = this.XML.HEADER;

      // Add client data with direct field additions
      this.xmlPayload += `<field fid='${
        this.FIELD_IDS.CLIENT_RID
      }'>${this.escapeXml(ClientRid)}</field>`;
      // IMPORTANT: Use clientCount (unique clients) NOT totalRecordsPeer (total records across years)
      // This ensures "Sample Size in Peer Averages" matches the dashboard's "Peer group size" (matches Comprehensive)
      this.xmlPayload += `<field fid='${
        this.FIELD_IDS.TOTAL_RECORDS_PEER
      }'>${this.escapeXml(clientCount)}</field>`;
      this.xmlPayload += `<field fid='${
        this.FIELD_IDS.TYPE
      }'>Standard</field>`;
      this.xmlPayload += `<field fid='${
        this.FIELD_IDS.FIRM_NAME
      }'>${this.escapeXml(firmName)}</field>`;
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

      // Add years
      const selectedYears = getSelectedYearsFromLocalStorage() || [];
      let fieldId;
      for (let i = 0; i < selectedYears.length; i++) {
        const year = selectedYears[i];
        
        if (i >= 5) {
          let num = i - 5;
          fieldId = 301 + num;
        } else {
          fieldId = Number(this.FIELD_IDS.YEARS_START) + i;
        }

        if (
          fieldId.toString() === this.FIELD_IDS.SLIDER_MIN ||
          fieldId.toString() === this.FIELD_IDS.SLIDER_MAX
        ) {
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
      // console.log("Adding delay before sending to QuickBase API...");

      return new Promise((resolve) => {
        setTimeout(async () => {
          try {
            const result = await this.printToExcel(this.xmlPayload);
            resolve(result);
          } catch (error) {
            // console.error("Error sending data to QuickBase:", error);
            throw error;
          }
        }, 1500); // Add a 1.5-second delay
      });
    } catch (error) {
      // console.error("Error creating Excel report:", error);
      throw error;
    }
  }

  /**
   * Generate XML for metrics data
   * @returns {string} XML string with metric data
   */
  generateMetricsXml() {
    let metricsXml = "";

    try {
      // Get all data from localStorage
      const generalData = JSON.parse(localStorage.getItem("generalData") || "{}");
      const cashData = JSON.parse(localStorage.getItem("cashData") || "{}");
      const debtData = JSON.parse(localStorage.getItem("debtData") || "{}");
      const incomeData = JSON.parse(localStorage.getItem("incomeData") || "{}");
      const expenseData = JSON.parse(
        localStorage.getItem("expenseData") || "{}"
      );

      // Process each field mapping
      this.fieldMappings.forEach((mapping) => {
        const [metricName, fieldIds, category, useWeightedAvg] = mapping;

        let dataObject;
        switch (category) {
          case "general":
            dataObject = generalData;
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
          default:
            return;
        }

        if (!dataObject || !dataObject[`${metricName}_Peer`]) {
          return;
        }

        const stats = this.calculateStatistics(dataObject, metricName, useWeightedAvg);

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
      // console.error("Error generating metrics XML:", error);
    }

    return metricsXml;
  }

  /**
   * Send XML data to QuickBase with added delay
   * @param {string} dataString - XML payload to send
   * @returns {Promise} Promise that resolves with the QuickBase response
   */
  printToExcel(dataString) {
    /**
     * Generate URL for Benchmark reports based on year count (matches Comprehensive)
     * @param {string} format - File format ("xls" or "pdf")
     * @param {string} RecordId - QuickBase record ID
     * @returns {string} Generated URL for the report
     */
    function getUrlBasedOnYearCount(format, RecordId) {
      const selectedYears = getSelectedYearsFromLocalStorage() || [];
      const yearCount = selectedYears.length;
      let tpid = "";
      
      // Get client name (firmName) from window
      let clientName = "";
      if (window.firmName) {
        clientName =
          window.firmName instanceof HTMLElement
            ? window.firmName.textContent || ""
            : window.firmName;
      }
      
      // Map year count to tpid for Benchmark reports (matches Comprehensive)
      const reportSuffix = "Benchmark Report";
      const fnName = clientName 
        ? `${encodeURIComponent(clientName)} ${reportSuffix}`
        : reportSuffix;
      
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
          break;
      }
      
      if (!tpid) {
        return "";
      }
      
      const url = `https://www.quickbaseutilities1.com/CapinTechnology_1795/XL%20Docs/ExcelGen_UA.aspx?clientid=Q1795&appid=bps9da9i5&tpdbid=bsaavek7s&tpid=${tpid}&fn=${fnName}&dbid=btcc8gq3r&msid=${RecordId}&docfmt=${format}&stream=y&apptoken=---`;
      
      return url;
    }
    
    return new Promise((resolve, reject) => {
      // Debug: Log the XML payload to console
      // console.log("XML Payload being prepared for QuickBase:");

      // Optional: Save to localStorage for inspection if needed
      try {
        localStorage.setItem("lastXmlPayload", dataString);
      } catch (e) {
        // console.warn("Could not save XML payload to localStorage:", e);
      }

      // Try to validate XML structure before sending
      try {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(dataString, "text/xml");
        const parseError = xmlDoc.querySelector("parsererror");
        if (parseError) {
          // console.error("XML validation failed:", parseError.textContent);
          // Continue anyway but log the error
        }
      } catch (validationError) {
        // console.error("Error validating XML:", validationError);
        // Continue anyway but log the error
      }

      // Add delay before sending the request to ensure data is ready
      // console.log("Adding delay before sending to QuickBase API...");
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
              // console.log("QuickBase response received:", response);

              const xmlUpload = $(response);
              const errorCode = xmlUpload.find("qdbapi").find("errcode").text();

              if (errorCode === "0") {
                const recordId = xmlUpload.find("qdbapi").find("rid").text();
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
                if (trendXLSFinal) {
                  trendXLSFinal.href = getUrlBasedOnYearCount("xls", recordId);
                }

                const trendPDFFinal = document.getElementById("trendPDFFinal");
                if (trendPDFFinal) {
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

                if (typeof createToastWarning === "function") {
                  createToastWarning(error.message);
                }

                reject(error);
              }
            } catch (parseError) {
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
            let errorMessage = "Unknown error";

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
document.addEventListener("DOMContentLoaded", () => {
  // Create a single instance
  const excelReportGenerator = new ExcelReportGenerator();

  // Make sure no duplicate event listeners are attached to generateReports button
  const generateReportsBtn = document.getElementById("generateReports");
  if (generateReportsBtn) {
    // Remove any existing listeners to prevent duplicates
    const newBtn = generateReportsBtn.cloneNode(true);
    generateReportsBtn.parentNode.replaceChild(newBtn, generateReportsBtn);

    // Add a single click event listener (removed { once: true } to allow multiple clicks)
    newBtn.addEventListener(
      "click",
      excelReportGenerator.handleGenerateReport.bind(excelReportGenerator)
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

