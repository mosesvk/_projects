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
 * Enhanced chart capture and print functionality
 * Addresses height cutoff issues with html2canvas
 */

/**
 * Captures a chart element as a PNG base64 string with improved height handling
 * @param {HTMLElement} element - The DOM element containing the chart
 * @param {string} id - Identifier for the chart
 * @returns {Promise<string|null>} - Base64 encoded PNG or null if conversion fails
 */
async function captureChartAsPng(element, id) {
  if (!element) {
    console.error(`Element for ${id} is null or undefined`);
    return null;
  }

  try {
    // Store original styles to restore later
    const originalPosition = element.style.position;
    const originalHeight = element.style.height;
    const originalWidth = element.style.width;
    const originalOverflow = element.style.overflow;
    
    // Ensure element is fully visible
    element.style.position = "relative";
    element.style.height = "auto";
    element.style.width = "100%";
    element.style.overflow = "visible";
    
    // Force a reflow to ensure styles are applied
    element.offsetHeight;
    
    // Give time for chart to adjust to new dimensions
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Determine actual dimensions - charts may have internal scrollable content
    const chartContent = element.querySelector('.apexcharts-inner') || element;
    const contentHeight = Math.max(
      element.scrollHeight,
      element.offsetHeight,
      chartContent.scrollHeight,
      chartContent.offsetHeight
    );
    
    // Ensure we have sufficient canvas space
    const canvasHeight = contentHeight + 50; // Add padding
    
    // Use html2canvas with improved settings
    const canvas = await html2canvas(element, {
      allowTaint: true,
      useCORS: true,
      logging: false,
      scale: 2, // Higher quality
      backgroundColor: '#ffffff', // White background for better results
      height: canvasHeight,
      windowHeight: canvasHeight + 100, // Ensure enough window space
      ignoreElements: (el) => el.classList.contains('no-export'),
      onclone: (documentClone, elementClone) => {
        // Make additional adjustments to the cloned element if needed
        elementClone.style.height = `${canvasHeight}px`;
        elementClone.style.maxHeight = 'none';
        
        // Ensure all chart components are visible in the clone
        const chartComponents = elementClone.querySelectorAll('.apexcharts-inner, .apexcharts-graphical');
        chartComponents.forEach(component => {
          component.style.height = 'auto';
          component.style.maxHeight = 'none';
          component.style.overflow = 'visible';
        });
      }
    });

    // Restore original styles
    element.style.position = originalPosition;
    element.style.height = originalHeight;
    element.style.width = originalWidth;
    element.style.overflow = originalOverflow;

    // Validate canvas was created
    if (!canvas) {
      throw new Error(`Canvas rendering failed for ${id}`);
    }

    // Get the base64 string from the canvas
    const dataUrl = canvas.toDataURL("image/png");
    const base64String = dataUrl.split(",")[1];

    if (!base64String) {
      throw new Error(`Failed to generate base64 string for ${id}`);
    }

    // Store the result in map_dataUri if it exists
    if (typeof map_dataUri !== 'undefined') {
      map_dataUri.set(id, base64String);
    }
    
    return base64String;
  } catch (error) {
    console.error(`Error rendering chart ${id} to PNG:`, error);
    return null;
  }
}

/**
 * Process charts in batches with improved height handling
 * @param {Array} chartMappings - Array of chart ID to field ID mappings
 * @param {number} batchSize - Number of charts to process in each batch
 * @returns {Promise<Array>} - Array of processed results
 */
async function processChartBatchesEnhanced(chartMappings, batchSize = 3) {
  const results = [];
  
  for (let i = 0; i < chartMappings.length; i += batchSize) {
    // Breathe between batches
    if (i > 0) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    const batch = chartMappings.slice(i, i + batchSize);
    const batchPromises = batch.map(async ({ chartId, fieldId }) => {
      try {
        const element = document.getElementById(chartId);
        if (!element) {
          console.warn(`Chart element '${chartId}' not found`);
          return { fieldId, base64String: null };
        }
        
        // Use enhanced capture function
        const idx = chartId.replace("_chart", "");
        const base64String = await captureChartAsPng(element, idx);
        return { fieldId, base64String };
      } catch (error) {
        console.error(`Error processing chart '${chartId}':`, error);
        return { fieldId, base64String: null };
      }
    });
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    
    // Update progress indicator if available
    const progressElement = document.getElementById('uploadProgress');
    if (progressElement) {
      const progress = Math.min(100, Math.round((i + batchSize) / chartMappings.length * 100));
      progressElement.style.width = `${progress}%`;
      progressElement.setAttribute('aria-valuenow', progress);
    }
  }
  
  return results;
}

/**
 * Enhanced version of mainPrint that fixes chart height issues
 */
async function enhancedMainPrint() {
  showApiLoadingFunction("open", "print");

  const printButton = document.getElementById('printBase64');
  if (!printButton) {
    console.error("Print button not found");
    return;
  }
  
  // Store original button innerHTML to restore later
  const originalButtonContent = printButton.innerHTML;
  
  // Show content sections
  const sections = ['cashContent', 'netAssetsContent', 'incomeContent', 'expenseContent'];
  const hiddenSections = [];
  
  try {
    // Show all content sections for rendering
    sections.forEach(id => {
      const element = document.getElementById(id);
      if (element && element.classList.contains('hidden')) {
        element.classList.remove('hidden');
        hiddenSections.push(element); // Track which ones we unhid
      }
    });

    // Wait for DOM to update
    await new Promise(resolve => setTimeout(resolve, 200));

    // Define all chart IDs and their corresponding field IDs
    const chartMappings = [
      { chartId: "statementCashFlows_chart", fieldId: 8 },
      { chartId: "daysCashOnHand_chart", fieldId: 9 },
      { chartId: "daysExpensesInUnrestrictedNA_chart", fieldId: 10 },
      { chartId: "daysExpensesInUnrestrictedNA_excludingPPE_chart", fieldId: 11 },
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
      { chartId: "assetsWithoutPpeToLiabilitiesWithoutDebt_chart", fieldId: 28 },
      { chartId: "totalContributions_chart", fieldId: 29 },
      { chartId: "contributionsWithoutDR_chart", fieldId: 30 },
      { chartId: "functionalAllocation_chart", fieldId: 31 },
      { chartId: "costOfContributionsDetailView_chart", fieldId: 32 }
    ];

    // Filter out any charts that don't exist in the DOM
    const validChartMappings = chartMappings.filter(({ chartId }) => 
      document.getElementById(chartId) !== null
    );
    
    if (validChartMappings.length === 0) {
      throw new Error("No valid charts found to upload");
    }
    
    // Process charts in batches with enhanced method
    const results = await processChartBatchesEnhanced(validChartMappings, 3);
    
    // Build XML request with metadata and chart images
    let uploadXml = "<qdbapi><apptoken>c3qhvhmcgbwze7hwbiavcm3hnmc</apptoken>";
    
    // Add metadata first
    uploadXml += createFieldXml(171, ClientRid || '');
    uploadXml += createFieldXml(170, firmName || '');
    uploadXml += createFieldXml(169, uniqueClients?.size || 0);
    uploadXml += createFieldXml(163, sliderValue || 0);
    uploadXml += createFieldXml(164, sliderValue2 || 25000);
    
    // Add base64 images for charts
    results.forEach(result => {
      if (result && result.base64String) {
        uploadXml += createImageFieldXml(result.fieldId, result.base64String);
      }
    });
    
    uploadXml += "</qdbapi>";
    
    // Send to Quickbase
    const response = await sendToQuickbase(uploadXml);
    
    // Process response
    const xmlResponse = $(response);
    const errorCode = xmlResponse.find("qdbapi").find("errcode").text();

    showApiLoadingFunction("close", "print");
    
    if (errorCode === "0") {
      const recordId = xmlResponse.find("qdbapi").find("rid").text();
      createToastSuccess(`Charts successfully uploaded to Quickbase. Record ID: ${recordId}`);
    } else {
      const errorText = xmlResponse.find("qdbapi").find("errtext").text() || 'Unknown error';
      throw new Error(`Quickbase returned error ${errorCode}: ${errorText}`);
    }
  } catch (error) {
    showApiLoadingFunction("close", "print");
    console.error("Error in enhancedMainPrint:", error);
    createToastWarning(`Error creating presentation: ${error.message || "Unknown error"}`);
  } finally {
    // Hide the sections we unhid
    hiddenSections.forEach(element => {
      element.classList.add('hidden');
    });
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
    return '';
  }
  
  if (typeof val === 'object') {
    console.warn(`Invalid value type for field ${id}:`, typeof val);
    return '';
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
    return '';
  }
  return `<field fid='${id}' filename='chart.png'>${val}</field>`;
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
      timeout: 30000 // 30-second timeout
    });
  } catch (error) {
    const errorMessage = error.responseText || error.statusText || error.message || "Unknown error";
    console.error("Quickbase API error:", errorMessage);
    throw new Error(`Quickbase API error: ${errorMessage}`);
  }
}

/**
 * Initialize the enhanced print functionality by replacing the original mainPrint function
 * This should be called after DOM is loaded
 */
function initEnhancedPrintFunction() {
  const printButton = document.getElementById('printBase64');
  if (!printButton) {
    console.error("Print button not found for enhanced print functionality");
    return;
  }
  
  // Remove existing event listeners
  const newPrintButton = printButton.cloneNode(true);
  printButton.parentNode.replaceChild(newPrintButton, printButton);
  
  // Add enhanced print function
  newPrintButton.addEventListener("click", () => {
    enhancedMainPrint();
  });
  
  console.log("Enhanced print functionality initialized");
}

// Initialize when document is loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initEnhancedPrintFunction);
} else {
  initEnhancedPrintFunction();
}