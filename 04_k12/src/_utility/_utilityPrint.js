/**
 * K12 Excel Report Integration (structure matches 05_cfhi_comp / 06_cfhi_standard printExcel.js)
 * Handles XML generation and QuickBase API integration for enrollment/report data.
 * K12-specific: URLs, clist, and field IDs (186, 187, 188, 189+) are preserved.
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
 * K12 field layout: num = AVG fid, num+1 = MID, num+2 = MIN, num+3 = MAX.
 */
function uploadToFile(avg, mid, min, max, num, begin, end) {
  if (begin) {
    uploadMainFile +=
      "<qdbapi><apptoken>bpat4pgu9t69yby5gbemdbej52j</apptoken>";
  }
  uploadMainFile += `<field fid='${num}'>${avg}</field><field fid='${
    num + 1
  }'>${mid}</field><field fid='${num + 2}'>${min}</field><field fid='${
    num + 3
  }'>${max}</field>`;
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
    // API constants (K12-specific URLs)
    this.API = {
      APP_TOKEN: "bpat4pgu9t69yby5gbemdbej52j",
      UPLOAD_URL:
        "https://capincrouse.quickbase.com/db/bt76haf6m?a=API_AddRecord",
    };

    this.XML = {
      HEADER: `<?xml version="1.0" ?><qdbapi><apptoken>${this.API.APP_TOKEN}</apptoken>`,
      FOOTER: "</qdbapi>",
      COLUMN_LIST: "<clist>186</clist>",
    };

    // K12-specific field IDs
    this.FIELD_IDS = {
      CLIENT_RID: "186",
      FIRM_NAME: "187",
      TOTAL_RECORDS_PEER: "188",
      YEARS_START: "189",
    };

    this.xmlPayload = "";
    this.isGenerating = false;
    this.init();
  }

  /**
   * Initialize: attach single click handler to generateReports (no duplicates).
   * Matches comp/standard init().
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
   * Clean up Excel report generator data and reset state (matches comp/standard).
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
   * Handle generate report button click (matches comp/standard flow).
   */
  handleGenerateReport() {
    if (this.isGenerating) {
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
   * Escape XML special characters (matches comp/standard).
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
   * Build full XML from uploadMainFile (metrics from Report.js) + client/years + clist/footer.
   * Returns a Promise that resolves when QuickBase request completes.
   */
  async createPrintExcel() {
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

    this.xmlPayload = uploadMainFile;

    this.xmlPayload += `<field fid='${this.FIELD_IDS.CLIENT_RID}'>${this.escapeXml(ClientRid)}</field>`;
    this.xmlPayload += `<field fid='${this.FIELD_IDS.FIRM_NAME}'>${this.escapeXml(firmNameVal)}</field>`;
    this.xmlPayload += `<field fid='${this.FIELD_IDS.TOTAL_RECORDS_PEER}'>${this.escapeXml(uniqueCount)}</field>`;

    let yearFieldId = parseInt(this.FIELD_IDS.YEARS_START, 10);
    for (let i = 0; i < selectedYears.length; i++) {
      this.xmlPayload += `<field fid='${yearFieldId}'>${this.escapeXml(selectedYears[i])}</field>`;
      yearFieldId++;
    }

    this.xmlPayload += this.XML.COLUMN_LIST + this.XML.FOOTER;

    // Field 172 ("00 Print URL Trends XLS") is read-only in QuickBase; omit it from payload to avoid API_AddRecord error 34
    this.xmlPayload = this.xmlPayload.replace(
      /<field fid='172'>[\s\S]*?<\/field>/g,
      ""
    );

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.printToExcel(this.xmlPayload)
          .then(resolve)
          .catch(reject);
      }, 1500);
    });
  }

  /**
   * Send XML to QuickBase (K12 URL). Returns a Promise.
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
        success: (response) => {
          const xmlUpload = $(response);
          const errcode = xmlUpload.find("qdbapi").find("errcode").text();

          if (errcode === "0") {
            if (typeof createToastSuccess === "function") {
              createToastSuccess("Generated Reports successfully to Quickbase.");
            }
            const footer = document.getElementById("print_modal_footer");
            if (footer) footer.classList.remove("hidden");
            resolve();
          } else {
            const errtext =
              xmlUpload.find("qdbapi").find("errtext").text() ||
              "Unknown QuickBase error";
            if (typeof createToastWarning === "function") {
              createToastWarning(`Quickbase returned an error: ${errtext}`);
            }
            reject(new Error(errtext));
          }
        },
        error: (xhr, status, err) => {
          const msg =
            (xhr && xhr.responseText) || err || status || "Unknown error";
          if (typeof createToastWarning === "function") {
            createToastWarning(`Quickbase returned an error: ${msg}`);
          }
          reject(new Error(msg));
        },
      });
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
