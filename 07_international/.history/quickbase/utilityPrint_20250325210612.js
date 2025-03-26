// Clean implementation of the presentation functionality

const uploadFileBegin = `<qdbapi><apptoken>bpat4pgu9t69yby5gbemdbej52j</apptoken>`;
const uploadFileEnd = `</qdbapi>`;
const uploadClist = `<clist>171</clist>`;
const generateReportsBtn = document.getElementById("generateReports");
const printButton = document.getElementById("printBase64");
let uploadMainFile = "";
let uploadPresentationFile = "";

// PDF download functionality
$("#downloadPdf").on("click", function () {
  const imagesArray = [];

  for (let i = 0; i < selectedImagesArray.length; i++) {
    const element = document.getElementById(selectedImagesArray[i].toString());
    const img = element.toDataURL("image/pdf");
    const doc = new jsPDF();
    doc.addImage(img, "png", 15, 40, 180, 160);
    doc.save();
  }
});

// Print options functionality
$("#printOptionsBtn").on("click", function () {
  const reportTables = [
    "data-tableDemo",
    "data-tableCash",
    "data-tableDebt",
    "data-tableIncome",
    "data-tableExpense",
  ];

  for (let i = 0; i < selectedImagesArray.length; i++) {
    const selectImg = selectedImagesArray[i];

    if (reportTables.includes(selectImg)) {
      $(`#${selectImg} .google-visualization-table`).printThis({
        importCSS: true,
      });
    } else {
      downloadImage(selectedImagesArray[i]);
    }
  }
});

// Data processing utility function
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
    avgArray = avgArray.map((item) => item / 100);
    midArray = midArray.map((item) => item / 100);
    minArray = minArray.map((item) => item / 100);
    MaxArray = MaxArray.map((item) => item / 100);
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

// Upload data to file
function uploadToFile(avg, mid, min, max, fIdArray, begin, end) {
  const avgId = fIdArray[0];
  const midId = fIdArray[2];
  const minId = fIdArray[1];
  const maxId = fIdArray[3];

  if (begin) {
    uploadMainFile += uploadFileBegin;
  }

  uploadMainFile += `<field fid='${avgId}'>${avg}</field><field fid='${midId}'>${mid}</field><field fid='${minId}'>${min}</field><field fid='${maxId}'>${max}</field>`;
}

// Upload single field to file
const uploadSingleToFile = (id, val, end = false) => {
  uploadMainFile += `<field fid='${id}'>${val}</field>`;

  if (end) {
    uploadMainFile += uploadClist;
    uploadMainFile += uploadFileEnd;
  }
};

// Print to Excel functionality
const printToExcel = (dataString) => {
  const urlUploadFile =
    "https://capincrouse.quickbase.com/db/bt76haf6m?a=API_AddRecord";

  $.ajax({
    type: "POST",
    contentType: "text/xml",
    async: true,
    url: urlUploadFile,
    dataType: "xml",
    processData: false,
    data: dataString,
    success: function (response) {
      const xmlUpload = $(response);
      const newRecordID = xmlUpload[0].all[4].innerHTML;

      if (xmlUpload.find("qdbapi").find("errcode").text() == "0") {
        const recordId = xmlUpload.find("qdbapi").find("rid").text();

        createToastSuccess("Generated Reports successfully to Quickbase.");

        const printModalFooter = document.getElementById("print_modal_footer");
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
      } else {
        console.log("Quickbase returned an error.");
        createToastWarning(
          `Quickbase returned an error: if (xmlUpload.find("qdbapi").find("errcode").text() == "0")`
        );
      }
    },
    error: function (err) {
      console.error(err);
      createToastWarning(`Quickbase returned an error: ${err}`);
    },
  });
};

// Create file for print
const createFileForPrint = (
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
) => {
  uploadToFile(avg, mid, min, max, fIdArray, begin, end);
};

// Create Excel print
const createPrintExcel = async () => {
  const types = Array.from(selectedTypes_Array).join(";");
  const regions = Array.from(selectedRegions_Array).join(";");

  uploadSingleToFile(171, ClientRid);
  uploadSingleToFile(170, firmName);
  uploadSingleToFile(169, uniqueClients.size);
  uploadSingleToFile(163, sliderValue);
  uploadSingleToFile(164, sliderValue2);
  uploadSingleToFile(165, missionValue);
  uploadSingleToFile(166, missionValue2);
  uploadSingleToFile(167, regions);
  uploadSingleToFile(168, types);

  const yearLength = selectedYears_Set.size;
  let j = 158;

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

  setTimeout(() => {
    printToExcel(uploadMainFile);
    toggleGenerateReportButtonNormalState(generateReportsBtn);
  }, 1500);
};

// Generate reports event listener
generateReportsBtn.addEventListener("click", () => {
  toggleButtonLoadingState(generateReportsBtn);

  if (!localStorage.generalData) {
    createToastWarning(
      "No Data Retrieved. Make sure to select years and run the report"
    );
    throw new Error("No Data Retrieved.");
  } else {
    createPrintExcel();
  }
});

/**
 * Converts an SVG chart element to a PNG Base64 string
 * Includes fixes for height capture and ensures all content is included
 * @param {HTMLElement} element - The DOM element containing the chart
 * @param {string} id - Identifier for the chart
 * @param {number} retryCount - Number of retries attempted (for internal use)
 * @returns {Promise<string|null>} - Base64 encoded PNG or null if conversion fails
 */
async function svgToPngBase64(element, id) {
  if (!element) {
    console.error(`Element for ${id} is null or undefined`);
    return null;
  }

  try {
    // Save original dimensions
    const originalHeight = element.style.height;
    const originalWidth = element.style.width;
    
    // Set explicit height to ensure full chart is captured
    element.style.height = "500px"; // Adjust as needed
    element.style.width = "100%";
    
    // Let the UI update before capturing
    await new Promise(resolve => setTimeout(resolve, 20)); // Increased timeout
    
    // Use html2canvas with optimized settings
    const canvas = await html2canvas(element, {
      allowTaint: true,
      useCORS: true,
      logging: false,
      scale: 2, // Higher quality
      backgroundColor: null, // Transparent background
      height: element.scrollHeight, // Ensure full height is captured
      width: element.scrollWidth,
      ignoreElements: (el) => el.classList.contains('no-export')
    });
    
    // Restore original dimensions
    element.style.height = originalHeight;
    element.style.width = originalWidth;
    
    // Rest of the function...
    const dataUrl = canvas.toDataURL("image/png");
    const base64String = dataUrl.split(",")[1];
    map_dataUri.set(id, base64String);
    return base64String;
  } catch (error) {
    console.error(`Error rendering chart ${id} to PNG:`, error);
    return null;
  }
}

/**
 * Create XML field entry for a value
 * @param {string|number} id - Field ID
 * @param {string|number} val - Value to upload
 * @returns {string} - XML field entry
 */
function createFieldXml(id, val) {
  if (val === null || val === undefined) {
    console.warn(`Skipping upload for field ${id} due to null/undefined value`);
    return "";
  }

  if (typeof val === "object") {
    console.warn(`Invalid value type for field ${id}:`, typeof val);
    return "";
  }

  return `<field fid='${id}'>${val}</field>`;
}

/**
 * Create XML field entry for an image
 * @param {string|number} id - Field ID
 * @param {string} val - Base64 image data
 * @returns {string} - XML field entry for image
 */
function createImageFieldXml(id, val) {
  if (!val) {
    console.warn(`Skipping image upload for field ${id} - missing data`);
    return "";
  }
  // Add filename and mimetype for better Quickbase handling
  return `<field fid='${id}' filename='chart_${id}.png' mimetype='image/png'>${val}</field>`;
}

/**
 * Send record to Quickbase
 * @param {string} xml - XML payload to send
 * @returns {Promise<object>} - Response data
 */
async function sendToQuickbase(xml) {
  try {
    return await $.ajax({
      type: "POST",
      contentType: "text/xml",
      url: "https://capincrouse.quickbase.com/db/bumq5qw5e?a=API_AddRecord",
      dataType: "xml",
      processData: false,
      data: xml,
      timeout: 30000, // 30-second timeout
    });
  } catch (error) {
    const errorMessage =
      error.responseText ||
      error.statusText ||
      error.message ||
      "Unknown error";
    console.error("Quickbase API error:", errorMessage);
    throw new Error(`Quickbase API error: ${errorMessage}`);
  }
}

/**
 * Process charts in batches to prevent UI blocking
 * Handle problematic charts differently with extra care
 * @param {Array} chartMappings - Array of chart ID to field ID mappings
 * @returns {Promise<Array>} - Array of processed results
 */
async function processChartBatches(chartMappings) {
  const results = [];
  const progressElement = document.getElementById("uploadProgress");

  // Define known problematic chart IDs - these need special handling
  const problematicChartIds = [
    "daysCashOnHand_chart",
    "daysExpensesInUnrestrictedNA_chart",
  ];

  // Separate problematic charts from regular charts
  const problematicCharts = chartMappings.filter((mapping) =>
    problematicChartIds.includes(mapping.chartId)
  );

  const regularCharts = chartMappings.filter(
    (mapping) => !problematicChartIds.includes(mapping.chartId)
  );

  // Process problematic charts first, with special handling
  // console.log(
  //   `Processing ${problematicCharts.length} problematic charts with extra care`
  // );

  for (const chartMapping of problematicCharts) {
    try {
      // console.log(`Processing problematic chart: ${chartMapping.chartId}`);
      const element = document.getElementById(chartMapping.chartId);

      if (!element) {
        console.warn(`Chart element ${chartMapping.chartId} not found in DOM`);
        results.push({ fieldId: chartMapping.fieldId, base64String: null });
        continue;
      }

      // Force chart redraw if possible
      const chartInstance = window[chartMapping.chartId];
      if (chartInstance && typeof chartInstance.render === "function") {
        // console.log(`Forcing redraw of ${chartMapping.chartId}`);
        chartInstance.render();
      }

      // Wait longer for these charts
      await new Promise((resolve) => setTimeout(resolve, 200));

      const base64String = await svgToPngBase64(
        element,
        chartMapping.chartId.replace("_chart", "")
      );
      results.push({ fieldId: chartMapping.fieldId, base64String });

      // console.log(
      //   `Completed processing problematic chart: ${chartMapping.chartId}`
      // );
    } catch (error) {
      console.error(
        `Error with problematic chart ${chartMapping.chartId}:`,
        error
      );
      results.push({ fieldId: chartMapping.fieldId, base64String: null });
    }
  }

  // Process regular charts in small batches
  const batchSize = 2; // Process just 2 charts at a time

  for (let i = 0; i < regularCharts.length; i += batchSize) {
    // Breathe between batches
    if (i > 0) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    const batch = regularCharts.slice(i, i + batchSize);
    const batchPromises = batch.map(async ({ chartId, fieldId }) => {
      try {
        const element = document.getElementById(chartId);
        if (!element) {
          console.warn(`Chart element '${chartId}' not found`);
          return { fieldId, base64String: null };
        }

        const idx = chartId.replace("_chart", "");
        const base64String = await svgToPngBase64(element, idx);
        return { fieldId, base64String };
      } catch (error) {
        console.error(`Error processing chart '${chartId}':`, error);
        return { fieldId, base64String: null };
      }
    });

    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);

    // Update progress indicator if available
    if (progressElement) {
      const progress = Math.min(
        100,
        Math.round(((i + batchSize) / regularCharts.length) * 100)
      );
      progressElement.style.width = `${progress}%`;
      progressElement.setAttribute("aria-valuenow", progress);
    }
  }

  return results;
}

/**
 * Sets button to loading state with spinner
 * @param {HTMLElement} btn - Button element to modify
 */
function setButtonLoading(btn) {
  // Store original button content if not already stored
  if (!btn.dataset.originalContent) {
    btn.dataset.originalContent = btn.innerHTML;
  }

  // Set loading state with spinner
  btn.innerHTML = `
    <div class="flex items-center justify-center">
      <svg aria-hidden="true" role="status" class="inline w-6 h-6 me-3 text-xl colorGreen font-extrabold animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
      </svg>
      <span class="font-medium">Loading...</span>
    </div>`;
  btn.disabled = true;

  // Add a CSS class to prevent interactions
  btn.classList.add("pointer-events-none", "opacity-75");
}

/**
 * Restores button to normal state
 * @param {HTMLElement} btn - Button element to restore
 */
function restoreButton(btn) {
  // Only restore if we have the original content
  if (btn.dataset.originalContent) {
    btn.innerHTML = btn.dataset.originalContent;
    btn.disabled = false;
    btn.classList.remove("pointer-events-none", "opacity-75");
  }
}

/**
 * Main function to handle the print process
 * Captures charts as PNGs and uploads them to Quickbase
 */
async function mainPrint() {
  showApiLoadingFunction("open", "print");

  const printButton = document.getElementById("printBase64");
  if (!printButton) {
    console.error("Print button not found");
    return;
  }

  // Show content sections that might be hidden
  const sections = [
    "cashContent",
    "netAssetsContent",
    "incomeContent",
    "expenseContent",
  ];
  const hiddenSections = [];

  try {
    // Store original button state
    setButtonLoading(printButton);

    // console.log("Starting chart capture process");

    // Show all content sections for rendering
    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element && element.classList.contains("hidden")) {
        // console.log(`Temporarily making visible: ${id}`);
        element.classList.remove("hidden");
        hiddenSections.push(element); // Track which ones we unhid
      }
    });

    // Wait for DOM to update
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Define all chart IDs and their corresponding field IDs
    const chartMappings = [
      { chartId: "statementCashFlows_chart", fieldId: 8 },
      { chartId: "daysCashOnHand_chart", fieldId: 9 },
      { chartId: "daysExpensesInUnrestrictedNA_chart", fieldId: 10 },
      {
        chartId: "daysExpensesInUnrestrictedNA_excludingPPE_chart",
        fieldId: 11,
      },
      { chartId: "totalCoverageRatio_chart", fieldId: 12 },
      { chartId: "contributionsTrend_chart", fieldId: 13 },
      { chartId: "annualizedInvestmentReturn_chart", fieldId: 14 },
      { chartId: "functionalExpensePercent_program_chart", fieldId: 15 },
      { chartId: "functionalExpensePercent_administrative_chart", fieldId: 16 },
      { chartId: "functionalExpensePercent_fundraising_chart", fieldId: 17 },
      { chartId: "costOfContributions_chart", fieldId: 18 },
      { chartId: "netAssetBreakdown_chart", fieldId: 25 },
      { chartId: "changeInNetAssets_chart", fieldId: 26 },
      { chartId: "liquidityAssetsAvailableCover_chart", fieldId: 27 },
      {
        chartId: "assetsWithoutPpeToLiabilitiesWithoutDebt_chart",
        fieldId: 28,
      },
      { chartId: "totalContributions_chart", fieldId: 29 },
      { chartId: "contributionsWithoutDR_chart", fieldId: 30 },
      { chartId: "functionalAllocation_chart", fieldId: 31 },
      { chartId: "costOfContributionsDetailView_chart", fieldId: 32 },
    ];

    // Filter out any charts that don't exist in the DOM
    const validChartMappings = chartMappings.filter(({ chartId }) => {
      const element = document.getElementById(chartId);
      if (!element) {
        console.warn(`Chart element '${chartId}' not found in DOM`);
        return false;
      }
      return true;
    });

    if (validChartMappings.length === 0) {
      throw new Error("No valid charts found to upload");
    }

    // console.log(`Found ${validChartMappings.length} valid charts to process`);

    // Process charts in batches
    const results = await processChartBatches(validChartMappings);

    // Count successful conversions
    const successCount = results.filter((r) => r && r.base64String).length;
    // console.log(
    //   `Successfully converted ${successCount} out of ${results.length} charts`
    // );

    // Build XML request with metadata and chart images
    let uploadXml = "<qdbapi><apptoken>c3qhvhmcgbwze7hwbiavcm3hnmc</apptoken>";

    // Add metadata first
    uploadXml += createFieldXml(171, ClientRid || "");
    uploadXml += createFieldXml(170, firmName || "");
    uploadXml += createFieldXml(169, uniqueClients?.size || 0);
    uploadXml += createFieldXml(163, sliderValue || 0);
    uploadXml += createFieldXml(164, sliderValue2 || 25000);

    // Add base64 images for charts
    results.forEach((result) => {
      if (result && result.base64String) {
        uploadXml += createImageFieldXml(result.fieldId, result.base64String);
      }
    });

    uploadXml += "</qdbapi>";

    console.log("Sending data to Quickbase");

    // Send to Quickbase
    const response = await sendToQuickbase(uploadXml);

    // Process response
    const xmlResponse = $(response);
    const errorCode = xmlResponse.find("qdbapi").find("errcode").text();

    showApiLoadingFunction("close", "print");

    if (errorCode === "0") {
      const recordId = xmlResponse.find("qdbapi").find("rid").text();
      createToastSuccess(
        `Charts successfully uploaded to Quickbase. Record ID: ${recordId}`
      );
    } else {
      const errorText =
        xmlResponse.find("qdbapi").find("errtext").text() || "Unknown error";
      throw new Error(`Quickbase returned error ${errorCode}: ${errorText}`);
    }
  } catch (error) {
    showApiLoadingFunction("close", "print");
    console.error("Error in mainPrint:", error);
    createToastWarning(
      `Error creating presentation: ${error.message || "Unknown error"}`
    );
  } finally {
    // Hide the sections we unhid
    hiddenSections.forEach((element) => {
      element.classList.add("hidden");
    });

    // Restore button state
    restoreButton(printButton);
  }
}

// Print button event listener setup
function initPrintButton() {
  const printButton = document.getElementById("printBase64");
  if (!printButton) {
    console.error("Print button not found");
    return;
  }

  // Remove any existing event listeners (optional)
  printButton.replaceWith(printButton.cloneNode(true));

  // Get the fresh reference and add the listener
  const freshPrintButton = document.getElementById("printBase64");
  freshPrintButton.addEventListener("click", () => {
    mainPrint();
  });
}

// Initialize on document load
document.addEventListener("DOMContentLoaded", initPrintButton);
