/**
 * Simplified Excel Report Integration (structure/outline matches 05_cfhi_comp printExcel.js)
 * Handles XML generation and QuickBase API integration.
 * K12-specific: table id bt3q4xqn5, clist 186, field IDs 186–189+, and read-only exclusions.
 */

// ----- Global state used by Report.js and api.js (do not remove) -----
const uploadFileBegin = `<qdbapi> <apptoken>bpat4pgu9t69yby5gbemdbej52j</apptoken>`;
const uploadFileEnd = `</qdbapi>`;
const uploadClist = `<clist>186</clist>`;
let uploadMainFile = "";

$("#downloadPdf").on("click", function () {
  let imagesArray = [];

  for (i = 0; i < selectedImagesArray.length; i++) {
    let element = document.getElementById(selectedImagesArray[i].toString());
    let img = element.toDataURL("image/pdf");
    let a = document.createElement("a");
    a.href = img;
    a.download = img.toString();
    let doc = new jsPDF();
    doc.addImage(img, "png", 15, 40, 180, 160);
    doc.save();
  }
});

const downloadImage = (elem) => {
  const element = document.getElementById(elem);
  let image = element.toDataURL("image/png");
  let a = document.createElement("a");
  a.name = element.id;
  a.href = image;
  a.download = element.id;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

$("#printOptionsBtn").on("click", function () {
  const reportTables = [
    "data-tableDemo",
    "data-tableCash",
    "data-tableDebt",
    "data-tableIncome",
    "data-tableExpense",
  ];

  for (i = 0; i < selectedImagesArray.length; i++) {
    let selectImg = selectedImagesArray[i];
    let table = selectedImagesArray[i];
    let element;

    if (reportTables.includes(selectImg)) {
      $(`#${table} .google-visualization-table`).printThis({
        importCSS: true,
      });
    } else {
      element = selectedImagesArray[i];
      downloadImage(element);
    }
  }
});

const dataArrayObjects = (
  avgArray,
  midArray,
  minArray,
  MaxArray,
  weighted,
  percent,
  fixed,
  num
) => {
  if (percent) {
    avgArray.map((item) => item / 100);
    midArray.map((item) => item / 100);
    minArray.map((item) => item / 100);
    MaxArray.map((item) => item / 100);
  }

  let avgVal, midVal, minVal, maxVal;

  if (fixed) {
    if (weighted) {
      let i = 0;
      let str = "";
      let arr = String(avgArray[0]);
      while (i <= num + 1) {
        str += arr[i];
        i++;
      }
      avgVal = str;
    } else {
      let i = 0;
      let str = "";
      let arr = String(average(avgArray));
      while (i <= num + 1) {
        str += arr[i];
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
    ? Math.max.apply(Math, MaxArray).toFixed(num)
    : Math.max.apply(Math, MaxArray);

  return {
    avg: avgVal,
    mid: midVal,
    min: minVal,
    max: maxVal,
  };
};

/**
 * Global: append metric fields to uploadMainFile (used by Report.js via createFileForPrint).
 * K12 field layout per excelFields.txt: num = AVG, num+1 = MAX, num+2 = MID, num+3 = MIN.
 */
function uploadToFile(avg, mid, min, max, num, begin, end) {
  if (begin) {
    uploadMainFile +=
      "<qdbapi><apptoken>bpat4pgu9t69yby5gbemdbej52j</apptoken>";
  }
  uploadMainFile += `<field fid='${num}'>${avg}</field><field fid='${
    num + 1
  }'>${max}</field><field fid='${num + 2}'>${mid}</field><field fid='${
    num + 3
  }'>${min}</field>`;
}

/**
 * Global: append a single field to uploadMainFile; optional clist/footer when end is true.
 * Used by legacy flow; class-based createPrintExcel builds client+years separately.
 */
function uploadSingleToFile(id, val, end) {
  uploadMainFile += `<field fid='${id}'>${val}</field>`;
  if (end) uploadMainFile += uploadClist;
  if (end) uploadMainFile += "</qdbapi>";
}

/**
 * Global: called by Report.js when building the report table. Appends metric row to uploadMainFile.
 */
createFileForPrint = (
  name,
  fId,
  begin,
  end,
  avg,
  mid,
  min,
  max,
  peer,
  data
) => {
  uploadToFile(avg, mid, min, max, fId, begin, end);
};

// ========== ExcelReportGenerator class (structure matches comp/standard) ==========

class ExcelReportGenerator {
  constructor() {
    // API Constants (K12: table id bt3q4xqn5)
    this.API = {
      APP_TOKEN: "bpat4pgu9t69yby5gbemdbej52j",
      UPLOAD_URL:
        "https://capincrouse.quickbase.com/db/bt3q4xqn5?a=API_AddRecord",
    };

    // XML Template Strings (K12: clist 186)
    this.XML = {
      HEADER: `<?xml version="1.0" ?><qdbapi><apptoken>${this.API.APP_TOKEN}</apptoken>`,
      FOOTER: "</qdbapi>",
      COLUMN_LIST: "<clist>186</clist>",
    };

    // K12-specific field IDs (see docs/quickbase/excelFields.txt)
    this.FIELD_IDS = {
      CLIENT_RID: "186",
      FIRM_NAME: "187",
      TOTAL_RECORDS_PEER: "188",
      YEARS_START: "189",
      QUERY_ENROLLMENT_MAX: "194",
      QUERY_ENROLLMENT_MIN: "195",
    };

    // XML payload storage
    this.xmlPayload = "";
    this.isGenerating = false;
    this.init();
  }

  /**
   * Initialize the Excel report generator
   */
  init() {
    const generateReportsBtn = document.getElementById("generateReports");
    if (generateReportsBtn) {
      const newBtn = generateReportsBtn.cloneNode(true);
      generateReportsBtn.parentNode.replaceChild(newBtn, generateReportsBtn);
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
    this.xmlPayload = "";
    this.isGenerating = false;

    if (this.storedData) {
      this.storedData = null;
    }
    if (this.tempData) {
      this.tempData = null;
    }
    if (this.cachedResults) {
      this.cachedResults = null;
    }

    const button = document.getElementById("generateReports");
    if (button) {
      button.disabled = false;
      button.textContent = "Generate Trends and Benchmark Reports";
      button.classList.remove("opacity-50", "cursor-not-allowed");
    }
  }

  /**
   * Handle generate report button click
   */
  handleGenerateReport() {
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

    if (!localStorage.enrollmentData) {
      if (typeof createToastWarning === "function") {
        createToastWarning(
          "No Data Retrieved. Make sure to select years and run the report."
        );
      }
      if (typeof toggleGenerateReportButtonNormalState === "function") {
        toggleGenerateReportButtonNormalState(button);
      } else {
        button.disabled = false;
        button.textContent = "Generate Trends and Benchmark Reports";
      }
      this.isGenerating = false;
      return;
    }

    setTimeout(() => {
      this.createPrintExcel()
        .then(() => {
          if (typeof toggleGenerateReportButtonNormalState === "function") {
            toggleGenerateReportButtonNormalState(button);
          } else {
            button.disabled = false;
            button.textContent = "Generate Trends and Benchmark Reports";
          }
          const footer = document.getElementById("print_modal_footer");
          if (footer) footer.classList.remove("hidden");
          this.isGenerating = false;
        })
        .catch((error) => {
          if (typeof createToastWarning === "function") {
            createToastWarning(
              `Report generation failed: ${error.message || "Unknown error"}`
            );
          }
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
    if (unsafe === undefined || unsafe === null) return "";
    return String(unsafe)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }

  /**
   * Generate Excel report with all data (metrics from Report.js + client/years; K12 flow).
   * @returns {Promise} Resolves when QuickBase request completes
   */
  async createPrintExcel() {
    this.xmlPayload = "";

    try {
      // Get client data (K12: ClientRid, firmName, uniqueClients, selectedYears)
      const ClientRid =
        window.ClientRid ||
        (typeof getQueryVariable !== "undefined"
          ? getQueryVariable("clientrid")
          : "") ||
        "";
      let firmNameVal = "";
      if (typeof firmName !== "undefined" && firmName != null) {
        firmNameVal =
          firmName instanceof HTMLElement
            ? firmName.textContent || ""
            : String(firmName);
      } else if (window.firmName) {
        firmNameVal =
          window.firmName instanceof HTMLElement
            ? window.firmName.textContent || ""
            : String(window.firmName);
      }
      const uniqueCount =
        (typeof uniqueClients !== "undefined" && uniqueClients && uniqueClients.size) ||
        (window.uniqueClients && window.uniqueClients.size) ||
        0;

      const selectedYears =
        typeof getSelectedYearsFromLocalStorage === "function"
          ? getSelectedYearsFromLocalStorage()
          : (typeof selectedYears_Set !== "undefined" && selectedYears_Set
              ? Array.from(selectedYears_Set).sort()
              : []);

      // Start with metrics XML from Report.js (uploadMainFile), then add client/years
      this.xmlPayload = uploadMainFile;

      // Add client data with direct field additions (K12 field IDs 186, 187, 188)
      this.xmlPayload += `<field fid='${this.FIELD_IDS.CLIENT_RID}'>${this.escapeXml(ClientRid)}</field>`;
      this.xmlPayload += `<field fid='${this.FIELD_IDS.FIRM_NAME}'>${this.escapeXml(firmNameVal)}</field>`;
      this.xmlPayload += `<field fid='${this.FIELD_IDS.TOTAL_RECORDS_PEER}'>${this.escapeXml(uniqueCount)}</field>`;

      // Add years (K12: field IDs 189–193)
      let yearFieldId = parseInt(this.FIELD_IDS.YEARS_START, 10);
      for (let i = 0; i < selectedYears.length; i++) {
        this.xmlPayload += `<field fid='${yearFieldId}'>${this.escapeXml(selectedYears[i])}</field>`;
        yearFieldId++;
      }

      // Query Enrollment Min/Max (fid 194 = max, 195 = min; from enrollment slider)
      const enrollmentMin =
        typeof window.sliderValue !== "undefined" ? window.sliderValue : "";
      const enrollmentMax =
        typeof window.sliderValue2 !== "undefined" ? window.sliderValue2 : "";
      this.xmlPayload += `<field fid='${this.FIELD_IDS.QUERY_ENROLLMENT_MAX}'>${this.escapeXml(enrollmentMax)}</field>`;
      this.xmlPayload += `<field fid='${this.FIELD_IDS.QUERY_ENROLLMENT_MIN}'>${this.escapeXml(enrollmentMin)}</field>`;

      // Ensure every field 6–195 from excelFields.txt is present (comp pattern: template expects all columns).
      // Missing fields are appended empty so ExcelGen_UA / QuickBase record has all columns.
      const readOnlyFieldIds = [
        "172", "173", "174", "175", "190",
      ];
      for (let fid = 6; fid <= 195; fid++) {
        const fidStr = String(fid);
        if (readOnlyFieldIds.includes(fidStr)) continue;
        if (!this.xmlPayload.includes(`fid='${fidStr}'`)) {
          this.xmlPayload += `<field fid='${fidStr}'></field>`;
        }
      }

      // Close the XML
      this.xmlPayload += this.XML.COLUMN_LIST + this.XML.FOOTER;

      // Remove read-only fields from payload (omit to avoid API_AddRecord error 34)
      readOnlyFieldIds.forEach((fid) => {
        this.xmlPayload = this.xmlPayload.replace(
          new RegExp(`<field fid='${fid}'>[\\s\\S]*?<\\/field>`, "g"),
          ""
        );
      });

      // Send to QuickBase with delay (matches comp)
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          this.printToExcel(this.xmlPayload)
            .then(resolve)
            .catch(reject);
        }, 1500);
      });
    } catch (error) {
      console.error("Error creating Excel report:", error);
      throw error;
    }
  }

  /**
   * Send XML data to QuickBase with added delay (structure matches comp)
   * @param {string} dataString - XML payload to send
   * @returns {Promise} Promise that resolves with the QuickBase response
   */
  printToExcel(dataString) {
    /**
     * Generate URL for Trends or Benchmark reports based on year count (K12).
     * Structure matches comp; tpid/dbid may need to be updated for K12 report templates.
     * If ExcelGen_UA returns "Cannot find column N": (1) ensure table bt3q4xqn5 has field ID N
     * (see docs/quickbase/excelFields.txt); (2) ensure the report template (tpid) is configured
     * for K12 and only references field IDs that exist in bt3q4xqn5.
     * @param {string} reportType - "trends" or "benchmark"
     * @param {string} format - "xls" or "pdf"
     * @param {string} RecordId - QuickBase record ID
     * @returns {string} URL for the report
     */
    const getUrlBasedOnYearCount = (reportType, format, RecordId) => {
      const selectedYears =
        typeof getSelectedYearsFromLocalStorage === "function"
          ? getSelectedYearsFromLocalStorage()
          : (typeof selectedYears_Set !== "undefined" && selectedYears_Set
              ? Array.from(selectedYears_Set)
              : []);
      const yearCount = selectedYears.length;

      let clientName = "";
      if (typeof firmName !== "undefined" && firmName != null) {
        clientName =
          firmName instanceof HTMLElement
            ? firmName.textContent || ""
            : String(firmName);
      } else if (window.firmName) {
        clientName =
          window.firmName instanceof HTMLElement
            ? window.firmName.textContent || ""
            : String(window.firmName);
      }

      let tpid = "";
      const reportSuffix =
        reportType === "trends" ? "Trends Report" : "Benchmark Report";
      const fnName = clientName
        ? `${encodeURIComponent(clientName)} ${reportSuffix}`
        : reportSuffix;

      if (reportType === "trends") {
        const map = { 1: "5", 2: "4", 3: "6", 4: "7", 5: "8" };
        tpid = map[yearCount] || "";
      } else if (reportType === "benchmark") {
        const map = { 1: "9", 2: "10", 3: "11", 4: "12", 5: "13" };
        tpid = map[yearCount] || "";
      }
      if (!tpid) return "";

      return `https://www.quickbaseutilities1.com/CapinTechnology_1795/XL%20Docs/ExcelGen_UA.aspx?clientid=Q1795&appid=bps9da9i5&tpdbid=bsaavek7s&tpid=${tpid}&fn=${fnName}&dbid=bt3q4xqn5&msid=${RecordId}&docfmt=${format}&stream=y&apptoken=---`;
    };

    return new Promise((resolve, reject) => {
      try {
        localStorage.setItem("lastXmlPayload", dataString);
      } catch (e) {
        console.warn("Could not save XML payload to localStorage:", e);
      }

      try {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(dataString, "text/xml");
        const parseError = xmlDoc.querySelector("parsererror");
        if (parseError) {
          console.error("XML validation failed:", parseError.textContent);
        }
      } catch (validationError) {
        console.error("Error validating XML:", validationError);
      }

      setTimeout(() => {
        $.ajax({
          type: "POST",
          contentType: "text/xml",
          async: true,
          url: this.API.UPLOAD_URL,
          dataType: "xml",
          processData: false,
          data: dataString,
          success: (response) => {
            try {
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

                const trendXLSFinal = document.getElementById("trendXLSFinal");
                if (trendXLSFinal) {
                  trendXLSFinal.href = getUrlBasedOnYearCount(
                    "trends",
                    "xls",
                    recordId
                  );
                }
                const trendPDFFinal = document.getElementById("trendPDFFinal");
                if (trendPDFFinal) {
                  trendPDFFinal.href = getUrlBasedOnYearCount(
                    "trends",
                    "pdf",
                    recordId
                  );
                }
                const benchXLSFinal = document.getElementById("benchXLSFinal");
                if (benchXLSFinal) {
                  benchXLSFinal.href = getUrlBasedOnYearCount(
                    "benchmark",
                    "xls",
                    recordId
                  );
                }
                const benchPDFFinal =
                  document.getElementById("benchPDFFinal");
                if (benchPDFFinal) {
                  benchPDFFinal.href = getUrlBasedOnYearCount(
                    "benchmark",
                    "pdf",
                    recordId
                  );
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
          error: (xhr, status, error) => {
            let errorMessage = "Unknown error";

            if (xhr && xhr.responseText) {
              try {
                const $errorXml = $(xhr.responseText);
                errorMessage =
                  $errorXml.find("errtext").text() || error || status;
              } catch (e) {
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
      }, 1000);
    });
  }
}

// ----- Initialize on DOM ready (matches comp/standard) -----
document.addEventListener("DOMContentLoaded", () => {
  const excelReportGenerator = new ExcelReportGenerator();

  const generateReportsBtn = document.getElementById("generateReports");
  if (generateReportsBtn) {
    const newBtn = generateReportsBtn.cloneNode(true);
    generateReportsBtn.parentNode.replaceChild(newBtn, generateReportsBtn);
    newBtn.addEventListener(
      "click",
      excelReportGenerator.handleGenerateReport.bind(excelReportGenerator)
    );
  }

  window.excelReportGenerator = excelReportGenerator;
  window.createPrintExcel =
    excelReportGenerator.createPrintExcel.bind(excelReportGenerator);
  window.uploadToFile = uploadToFile;
  window.uploadSingleToFile = uploadSingleToFile;
  window.printToExcel =
    excelReportGenerator.printToExcel.bind(excelReportGenerator);
});
