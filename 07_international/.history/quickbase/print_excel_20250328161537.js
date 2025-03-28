/**
 * Excel Report Generator
 * A module for generating and uploading financial reports to QuickBase
 */
const ExcelReportGenerator = (() => {
  // API Constants
  const API = {
    APP_TOKEN: "bpat4pgu9t69yby5gbemdbej52j",
    UPLOAD_URL:
      "https://capincrouse.quickbase.com/db/bt76haf6m?a=API_AddRecord",
  };

  // XML Template Strings
  const XML = {
    HEADER: `<qdbapi><apptoken>${API.APP_TOKEN}</apptoken>`,
    FOOTER: "</qdbapi>",
    COLUMN_LIST: "<clist>171</clist>",
  };

  // Field IDs for QuickBase
  const FIELD_IDS = {
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

  // Internal state
  let xmlPayload = "";

  /**
   * Initialize the Excel report generator
   */
  function init() {
    const generateReportsBtn = document.getElementById("generateReports");

    if (generateReportsBtn) {
      generateReportsBtn.addEventListener("click", handleGenerateReport);
    }
  }

  /**
   * Handle generate report button click
   */
  function handleGenerateReport() {
    const button = document.getElementById("generateReports");
    toggleButtonLoadingState(button);

    // Validate data is available
    if (!localStorage.generalData) {
      createToastWarning(
        "No data available. Please select years and run the report first."
      );
      toggleGenerateReportButtonNormalState(button);
      return;
    }

    // Generate report with slight delay to ensure UI updates
    setTimeout(() => {
      createPrintExcel()
        .then(() => {
          toggleGenerateReportButtonNormalState(button);
        })
        .catch((error) => {
          console.error("Report generation failed:", error);
          createToastWarning(`Report generation failed: ${error.message}`);
          toggleGenerateReportButtonNormalState(button);
        });
    }, 100);
  }

  /**
   * Process data arrays and calculate statistics
   * @param {Array} avgArray - Array of average values
   * @param {Array} midArray - Array of median values
   * @param {Array} minArray - Array of minimum values
   * @param {Array} maxArray - Array of maximum values
   * @param {boolean} weighted - Use weighted calculation
   * @param {boolean} percent - Values are percentages
   * @param {boolean} fixed - Use fixed precision
   * @param {number} num - Number of decimal places
   * @returns {Object} Statistics object
   */
  function dataArrayObjects(
    avgArray,
    midArray,
    minArray,
    maxArray,
    weighted,
    percent,
    fixed,
    num
  ) {
    if (percent) {
      avgArray = avgArray.map((item) => item / 100);
      midArray = midArray.map((item) => item / 100);
      minArray = minArray.map((item) => item / 100);
      maxArray = maxArray.map((item) => item / 100);
    }

    let avgVal, midVal, minVal, maxVal;

    if (fixed) {
      if (weighted) {
        let i = 0;
        let str = "";
        let arr = String(avgArray[0]);
        while (i <= num + 1) {
          str += arr[i] || "";
          i++;
        }
        avgVal = str;
      } else {
        let i = 0;
        let str = "";
        let arr = String(average(avgArray));
        while (i <= num + 1) {
          str += arr[i] || "";
          i++;
        }
        avgVal = str;
      }
    } else {
      avgVal = weighted ? avgArray[0] : Math.round(average(avgArray));
    }

    midVal = fixed ? median(midArray, "fixed", num) : median(midArray);
    minVal = fixed
      ? Math.min.apply(Math, minArray).toFixed(num)
      : Math.min.apply(Math, minArray);
    maxVal = fixed
      ? Math.max.apply(Math, maxArray).toFixed(num)
      : Math.max.apply(Math, maxArray);

    return {
      avg: avgVal,
      mid: midVal,
      min: minVal,
      max: maxVal,
    };
  }

  /**
   * Add peer statistics to XML payload
   * @param {*} avg - Average value
   * @param {*} mid - Median value
   * @param {*} min - Minimum value
   * @param {*} max - Maximum value
   * @param {Array} fIdArray - Field ID array
   * @param {boolean} begin - Start new XML document
   * @param {boolean} end - End XML document
   */
  function uploadToFile(avg, mid, min, max, fIdArray, begin, end) {
    const avgId = fIdArray[0];
    const midId = fIdArray[2];
    const minId = fIdArray[1];
    const maxId = fIdArray[3];

    if (begin) {
      xmlPayload = XML.HEADER;
    }

    xmlPayload += `<field fid='${avgId}'>${avg}</field><field fid='${midId}'>${mid}</field><field fid='${minId}'>${min}</field><field fid='${maxId}'>${max}</field>`;

    if (end) {
      xmlPayload += XML.COLUMN_LIST + XML.FOOTER;
    }
  }

  /**
   * Add a single field to XML payload
   * @param {number} id - Field ID
   * @param {*} val - Field value
   * @param {boolean} end - End XML document
   */
  function uploadSingleToFile(id, val, end = false) {
    xmlPayload += `<field fid='${id}'>${val}</field>`;

    if (end) {
      xmlPayload += XML.COLUMN_LIST;
      xmlPayload += XML.FOOTER;
    }
  }

  /**
   * Create file for print with peer statistics
   * @param {string} name - Metric name
   * @param {Array} fIdArray - Field ID array
   * @param {boolean} begin - Start new XML
   * @param {boolean} end - End XML
   * @param {*} avg - Average value
   * @param {*} mid - Median value
   * @param {*} min - Minimum value
   * @param {*} max - Maximum value
   * @param {*} peer - Peer data
   * @param {*} data - Chart data
   */
  function createFileForPrint(
    name,
    fIdArray,
    begin,
    end,
    avg,
    mid,
    min,
    max,
    peer,
    data
  ) {
    uploadToFile(avg, mid, min, max, fIdArray, begin, end);
  }

  /**
   * Generate Excel report with all data
   * @returns {Promise} Promise that resolves when report is sent
   */
  async function createPrintExcel() {
    // Reset XML payload
    xmlPayload = "";

    try {
      // Metadata
      const types = Array.from(selectedTypes_Array).join(";");
      const regions = Array.from(selectedRegions_Array).join(";");

      // Add client and filter data
      uploadSingleToFile(FIELD_IDS.CLIENT_RID, ClientRid);
      uploadSingleToFile(FIELD_IDS.FIRM_NAME, firmName);
      uploadSingleToFile(FIELD_IDS.UNIQUE_CLIENTS, uniqueClients.size);
      uploadSingleToFile(FIELD_IDS.SLIDER_MIN, sliderValue);
      uploadSingleToFile(FIELD_IDS.SLIDER_MAX, sliderValue2);
      uploadSingleToFile(FIELD_IDS.MISSION_MIN, missionValue);
      uploadSingleToFile(FIELD_IDS.MISSION_MAX, missionValue2);
      uploadSingleToFile(FIELD_IDS.REGIONS, regions);
      uploadSingleToFile(FIELD_IDS.TYPES, types);

      // Add years
      const yearLength = selectedYears_Set.size;
      let j = FIELD_IDS.YEARS_START;

      sortSet(selectedYears_Set);

      let index = 0;
      for (const year of selectedYears_Set) {
        if (index === yearLength - 1) {
          uploadSingleToFile(j, year, true);
        } else {
          uploadSingleToFile(j, year);
        }
        j++;
        index++;
      }

      // Send to QuickBase
      await printToExcel(xmlPayload);

      return { success: true };
    } catch (error) {
      console.error("Error creating Excel report:", error);
      throw error;
    }
  }

  /**
   * Send XML data to QuickBase
   * @param {string} dataString - XML payload
   * @returns {Promise} Promise that resolves when data is sent
   */
  function printToExcel(dataString) {
    return new Promise((resolve, reject) => {
      $.ajax({
        type: "POST",
        contentType: "text/xml",
        async: true,
        url: API.UPLOAD_URL,
        dataType: "xml",
        processData: false,
        data: dataString,
        success: function (response) {
          const xmlUpload = $(response);

          if (xmlUpload.find("qdbapi").find("errcode").text() == "0") {
            const recordId = xmlUpload.find("qdbapi").find("rid").text();

            createToastSuccess("Generated Reports successfully to Quickbase.");

            const printModalFooter =
              document.getElementById("print_modal_footer");
            if (printModalFooter) {
              printModalFooter.classList.remove("hidden");
            }

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
            const error = new Error("Quickbase returned an error.");
            console.error(error);
            createToastWarning(
              `Quickbase returned an error: ${xmlUpload
                .find("qdbapi")
                .find("errtext")
                .text()}`
            );
            reject(error);
          }
        },
        error: function (err) {
          console.error(err);
          createToastWarning(`Quickbase returned an error: ${err}`);
          reject(err);
        },
      });
    });
  }

  // Public API
  return {
    init,
    createPrintExcel,
    uploadToFile,
    uploadSingleToFile,
    createFileForPrint,
    dataArrayObjects,
  };
})();

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", ExcelReportGenerator.init);
