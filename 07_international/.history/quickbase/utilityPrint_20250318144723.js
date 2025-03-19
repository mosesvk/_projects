/**
 * QuickBase API integration for report generation and chart exports
 * Handles the creation, formatting, and uploading of report data and chart visualizations
 */

// Configuration constants
const QUICKBASE_CONFIG = {
  REPORTS_API: {
    URL: "https://capincrouse.quickbase.com/db/bt76haf6m?a=API_AddRecord",
    APP_TOKEN: "bpat4pgu9t69yby5gbemdbej52j"
  },
  PRESENTATION_API: {
    URL: "https://capincrouse.quickbase.com/db/bumq5qw5e?a=API_AddRecord",
    APP_TOKEN: "c3qhvhmcgbwze7hwbiavcm3hnmc"
  }
};

// DOM elements
const DOM = {
  generateReportsBtn: document.getElementById("generateReports"),
  printButton: document.getElementById("printBase64"),
  printModalFooter: document.getElementById("print_modal_footer"),
  trendXLSLink: document.getElementById("trendXLSFinal"),
  trendPDFLink: document.getElementById("trendPDFFinal"),
  reportContainers: {
    cash: document.getElementById("cashContent"),
    netAssets: document.getElementById("netAssetsContent"),
    income: document.getElementById("incomeContent"),
    expense: document.getElementById("expenseContent")
  }
};

// State management
let uploadMainFile = "";
let uploadPresentationFile = "";

// Download handlers
$("#downloadPdf").on("click", function() {
  try {
    for (let i = 0; i < selectedImagesArray.length; i++) {
      const element = document.getElementById(selectedImagesArray[i].toString());
      const img = element.toDataURL("image/pdf");
      const doc = new jsPDF();
      doc.addImage(img, "png", 15, 40, 180, 160);
      doc.save();
    }
  } catch (error) {
    console.error("Error generating PDF:", error);
    createToastWarning("Failed to generate PDF. Please try again.");
  }
});

$("#printOptionsBtn").on("click", function() {
  try {
    const reportTables = [
      "data-tableDemo", "data-tableCash", "data-tableDebt",
      "data-tableIncome", "data-tableExpense"
    ];

    for (let i = 0; i < selectedImagesArray.length; i++) {
      const selectImg = selectedImagesArray[i];
      
      if (reportTables.includes(selectImg)) {
        $(`#${selectImg} .google-visualization-table`).printThis({
          importCSS: true
        });
      } else {
        downloadImage(selectImg);
      }
    }
  } catch (error) {
    console.error("Error printing options:", error);
    createToastWarning("Failed to print selected items. Please try again.");
  }
});

/**
 * Creates data objects from arrays with formatting options
 * @param {Array} avgArray - Average values array
 * @param {Array} midArray - Median values array
 * @param {Array} minArray - Minimum values array
 * @param {Array} MaxArray - Maximum values array
 * @param {boolean} weighted - Whether to use weighted calculations
 * @param {boolean} percent - Whether values are percentages
 * @param {boolean} fixed - Whether to use fixed decimal precision
 * @param {number} num - Number of decimal places
 * @returns {Object} Formatted data object
 */
const dataArrayObjects = (avgArray, midArray, minArray, MaxArray, weighted, percent, fixed, num) => {
  try {
    // Convert percentages if needed
    if (percent) {
      avgArray = avgArray.map(item => item / 100);
      midArray = midArray.map(item => item / 100);
      minArray = minArray.map(item => item / 100);
      MaxArray = MaxArray.map(item => item / 100);
    }

    let avgVal, midVal, minVal, maxVal;

    // Handle average value formatting
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

    // Format other values
    midVal = fixed ? median(midArray, "fixed", num) : median(midArray);
    minVal = fixed ? Math.min(...minArray).toFixed(num) : Math.min(...minArray);
    maxVal = fixed ? Math.max(...MaxArray).toFixed(num) : Math.max(...MaxArray);

    return { avg: avgVal, mid: midVal, min: minVal, max: maxVal };
  } catch (error) {
    console.error("Error in dataArrayObjects:", error);
    return { avg: 0, mid: 0, min: 0, max: 0 };
  }
};

/**
 * Appends data to upload XML string
 * @param {string|number} avg - Average value
 * @param {string|number} mid - Median value
 * @param {string|number} min - Minimum value
 * @param {string|number} max - Maximum value
 * @param {Array} fIdArray - Array of field IDs
 * @param {boolean} begin - Whether to include XML header
 */
function uploadToFile(avg, mid, min, max, fIdArray, begin) {
  try {
    const [avgId, minId, midId, maxId] = fIdArray;
    
    if (begin) {
      uploadMainFile = `<qdbapi><apptoken>${QUICKBASE_CONFIG.REPORTS_API.APP_TOKEN}</apptoken>`;
    }

    uploadMainFile += `<field fid='${avgId}'>${avg}</field>` +
                      `<field fid='${midId}'>${mid}</field>` +
                      `<field fid='${minId}'>${min}</field>` +
                      `<field fid='${maxId}'>${max}</field>`;
  } catch (error) {
    console.error("Error in uploadToFile:", error);
    throw new Error("Failed to format upload data");
  }
}

/**
 * Adds a single field to the upload XML
 * @param {string|number} id - Field ID
 * @param {string|number} val - Field value
 * @param {boolean} end - Whether to include XML footer
 */
const uploadSingleToFile = (id, val, end = false) => {
  try {
    uploadMainFile += `<field fid='${id}'>${val}</field>`;
    
    if (end) {
      uploadMainFile += `<clist>171</clist></qdbapi>`;
    }
  } catch (error) {
    console.error("Error in uploadSingleToFile:", error);
    throw new Error("Failed to add data to upload file");
  }
};

/**
 * Sends XML data to QuickBase API for report generation
 * @param {string} dataString - Formatted XML data string
 * @returns {Promise<string>} Record ID from QuickBase
 */
const printToExcel = (dataString) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "POST",
      contentType: "text/xml",
      async: true,
      url: QUICKBASE_CONFIG.REPORTS_API.URL,
      dataType: "xml",
      processData: false,
      data: dataString,
      success: function(response) {
        try {
          const xmlUpload = $(response);
          const errorCode = xmlUpload.find("qdbapi").find("errcode").text();
          
          if (errorCode === "0") {
            const recordId = xmlUpload.find("qdbapi").find("rid").text();
            console.log("Generated report with ID:", recordId);
            
            DOM.printModalFooter.classList.remove("hidden");
            DOM.trendXLSLink.href = getUrlBasedOnYearCount("xls", recordId);
            DOM.trendPDFLink.href = getUrlBasedOnYearCount("pdf", recordId);
            
            createToastSuccess("Generated Reports successfully to Quickbase.");
            resolve(recordId);
          } else {
            const errorMessage = `QuickBase error: ${xmlUpload.find("qdbapi").find("errtext").text() || "Unknown error"}`;
            console.error(errorMessage);
            createToastWarning(errorMessage);
            reject(new Error(errorMessage));
          }
        } catch (error) {
          console.error("Error processing response:", error);
          createToastWarning("Failed to process QuickBase response.");
          reject(error);
        }
      },
      error: function(err) {
        console.error("QuickBase API error:", err);
        createToastWarning(`Failed to upload to QuickBase: ${err.statusText}`);
        reject(err);
      }
    });
  });
};

/**
 * Wrapper for uploadToFile that handles data preparation
 * @param {string} name - Name identifier
 * @param {Array} fIdArray - Array of field IDs
 * @param {boolean} begin - Whether to include XML header
 * @param {boolean} end - Whether to include XML footer
 * @param {string|number} avg - Average value
 * @param {string|number} mid - Median value
 * @param {string|number} min - Minimum value
 * @param {string|number} max - Maximum value
 */
const createFileForPrint = (name, fIdArray, begin, end, avg, mid, min, max) => {
  try {
    uploadToFile(avg, mid, min, max, fIdArray, begin, end);
  } catch (error) {
    console.error(`Error creating print file for ${name}:`, error);
    createToastWarning(`Failed to prepare print data for ${name}.`);
  }
};

/**
 * Prepares and submits report data to QuickBase
 */
const createPrintExcel = async () => {
  try {
    const types = Array.from(selectedTypes_Array).join(";");
    const regions = Array.from(selectedRegions_Array).join(";");
    
    // Log details for debugging
    console.log({
      ClientRid,
      firmName,
      uniqueClients: uniqueClients.size,
      sliderValue,
      sliderValue2,
      selectedYears: selectedYears_Set,
      missionValue,
      missionValue2,
      types,
      regions
    });

    // Add fields to upload file
    uploadSingleToFile(171, ClientRid);
    uploadSingleToFile(170, firmName);
    uploadSingleToFile(169, uniqueClients.size);
    uploadSingleToFile(163, sliderValue);
    uploadSingleToFile(164, sliderValue2);
    uploadSingleToFile(165, missionValue);
    uploadSingleToFile(166, missionValue2);
    uploadSingleToFile(167, regions);
    uploadSingleToFile(168, types);

    // Add selected years
    sortSet(selectedYears_Set);
    const yearLength = selectedYears_Set.size;
    let j = 158;
    let index = 0;
    
    for (const year of selectedYears_Set) {
      const isLast = index === yearLength - 1;
      uploadSingleToFile(j, year, isLast);
      j++;
      index++;
    }

    // Submit to QuickBase after a short delay
    setTimeout(async () => {
      try {
        await printToExcel(uploadMainFile);
      } catch (error) {
        console.error("Failed to print to Excel:", error);
      } finally {
        toggleGenerateReportButtonNormalState(DOM.generateReportsBtn);
      }
    }, 1500);
  } catch (error) {
    console.error("Error in createPrintExcel:", error);
    createToastWarning("Failed to prepare report data. Please try again.");
    toggleGenerateReportButtonNormalState(DOM.generateReportsBtn);
  }
};

// Configure Generate Reports button
DOM.generateReportsBtn.addEventListener("click", () => {
  try {
    toggleButtonLoadingState(DOM.generateReportsBtn);
    
    if (!localStorage.generalData) {
      createToastWarning("No data retrieved. Make sure to select years and run the report");
      toggleGenerateReportButtonNormalState(DOM.generateReportsBtn);
      return;
    }
    
    createPrintExcel();
  } catch (error) {
    console.error("Error in generate reports handler:", error);
    createToastWarning("Failed to generate reports. Please try again.");
    toggleGenerateReportButtonNormalState(DOM.generateReportsBtn);
  }
});

/* PRESENTATION [BASE64] FUNCTIONALITY */

/**
 * Converts SVG element to PNG base64 string
 * @param {HTMLElement} element - Element to convert
 * @param {string} id - Identifier for caching
 * @returns {Promise<string>} Base64 encoded PNG
 */
async function svgToPngBase64(element, id) {
  try {
    const canvas = await html2canvas(element);
    const base64String = canvas.toDataURL("image/png").split(",")[1];
    map_dataUri.set(id, base64String);
    return base64String;
  } catch (error) {
    console.error("Error rendering SVG to PNG:", error);
    throw error;
  }
}

/**
 * Adds base64 image data to presentation XML
 * @param {string|number} id - Field ID
 * @param {string} val - Base64 encoded image data
 */
function uploadSinglePresentationToFile(id, val) {
  uploadPresentationFile += `<field fid='${id}' filename='image.png'>${val}</field>`;
}

/**
 * Gets PNG base64 string from element and adds to upload
 * @param {string} id - Element ID
 * @param {string|number} fieldId - QuickBase field ID
 * @returns {Promise<void>}
 */
const getPngString = async (id, fieldId) => {
  try {
    const element = document.getElementById(id);
    if (!element) {
      console.warn(`Element not found: ${id}`);
      return;
    }
    
    const idx = id.replace("_chart", "");
    const base64String = await svgToPngBase64(element, idx);
    uploadSinglePresentationToFile(fieldId, base64String);
  } catch (error) {
    console.error(`Error processing ${id}:`, error);
    throw new Error(`Failed to process chart ${id}`);
  }
};

/**
 * Main function to generate and upload presentation charts
 */
const mainPrint = async () => {
  try {
    // Show all content for rendering
    Object.values(DOM.reportContainers).forEach(container => {
      container.classList.remove("hidden");
    });

    // Initialize upload file
    uploadPresentationFile = `<qdbapi><apptoken>${QUICKBASE_CONFIG.PRESENTATION_API.APP_TOKEN}</apptoken>`;

    // Add metadata
    uploadSinglePresentationToFile(171, ClientRid);
    uploadSinglePresentationToFile(170, firmName);
    uploadSinglePresentationToFile(169, uniqueClients.size);
    uploadSinglePresentationToFile(163, sliderValue);
    uploadSinglePresentationToFile(164, sliderValue2);

    // Process all charts
    const chartMappings = [
      { id: "statementCashFlows_chart", fieldId: 8 },
      { id: "daysCashOnHand_chart", fieldId: 9 },
      { id: "daysExpensesInUnrestrictedNA_chart", fieldId: 10 },
      { id: "daysExpensesInUnrestrictedNA_excludingPPE_chart", fieldId: 11 },
      { id: "totalCoverageRatio_chart", fieldId: 12 },
      { id: "contributionsTrend_chart", fieldId: 13 },
      { id: "annualizedInvestmentReturn_chart", fieldId: 14 },
      { id: "functionalExpensePercent_program_chart", fieldId: 15 },
      { id: "functionalExpensePercent_administrative_chart", fieldId: 16 },
      { id: "functionalExpensePercent_fundraising_chart", fieldId: 17 },
      { id: "costOfContributions_chart", fieldId: 18 },
      { id: "netAssetBreakdown_chart", fieldId: 25 },
      { id: "changeInNetAssets_chart", fieldId: 25 },
      { id: "liquidityAssetsAvailableCover_chart", fieldId: 27 },
      { id: "assetsWithoutPpeToLiabilitiesWithoutDebt_chart", fieldId: 28 },
      { id: "totalContributions_chart", fieldId: 29 },
      { id: "contributionsWithoutDR_chart", fieldId: 30 },
      { id: "functionalAllocation_chart", fieldId: 31 },
      { id: "costOfContributionsDetailView_chart", fieldId: 32 }
    ];

    // Process all charts sequentially
    for (const chart of chartMappings) {
      await getPngString(chart.id, chart.fieldId);
    }

    // Finalize XML
    uploadPresentationFile += "</qdbapi>";

    // Submit to QuickBase
    await new Promise((resolve, reject) => {
      $.ajax({
        type: "POST",
        contentType: "text/xml",
        async: true,
        url: QUICKBASE_CONFIG.PRESENTATION_API.URL,
        dataType: "xml",
        processData: false,
        data: uploadPresentationFile,
        success: function(response) {
          try {
            const xmlUpload = $(response);
            const errorCode = xmlUpload.find("qdbapi").find("errcode").text();
            
            if (errorCode === "0") {
              createToastSuccess("Presentation charts successfully uploaded to QuickBase.");
              resolve();
            } else {
              const errorMessage = `QuickBase error: ${xmlUpload.find("qdbapi").find("errtext").text() || "Unknown error"}`;
              console.error(errorMessage);
              createToastWarning(errorMessage);
              reject(new Error(errorMessage));
            }
          } catch (error) {
            console.error("Error processing response:", error);
            createToastWarning("Failed to process QuickBase response.");
            reject(error);
          }
        },
        error: function(err) {
          console.error("QuickBase API error:", err);
          createToastWarning(`Failed to upload to QuickBase: ${err.statusText}`);
          reject(err);
        }
      });
    });
  } catch (error) {
    console.error("Error in mainPrint:", error);
    createToastWarning("Failed to generate presentation. Please try again.");
  } finally {
    // Hide content after processing
    Object.values(DOM.reportContainers).forEach(container => {
      container.classList.add("hidden");
    });
    togglePrintPresentationButtonNormalState(DOM.printButton);
  }
};

// Configure Print Presentation button
DOM.printButton.addEventListener("click", () => {
  try {
    toggleButtonLoadingState(DOM.printButton);
    mainPrint();
  } catch (error) {
    console.error("Error in print button handler:", error);
    createToastWarning("Failed to start presentation printing. Please try again.");
    togglePrintPresentationButtonNormalState(DOM.printButton);
  }
});