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
 * Enhanced print functionality using ApexCharts direct export capabilities
 * with improved delays, error handling, and performance timing
 */

/**
 * Gets base64 data directly from ApexCharts instance with retry mechanism
 * @param {string} chartId - ID of the chart element
 * @param {number} retries - Number of retry attempts
 * @returns {Promise<string|null>} - Base64 encoded PNG
 */
async function getApexChartBase64(chartId, retries = 3) {
  const startTime = performance.now();

  // Add delay function for better reliability
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Try export with multiple attempts
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      // console.log(`Export attempt ${attempt} for chart ${chartId}`);

      // Wait longer for each retry
      await delay(attempt + 200);

      // Get the chart instance
      let chartInstance;

      // First check if it's in the charts registry
      if (window.chartManager && typeof chartManager.getChart === "function") {
        chartInstance = chartManager.getChart(chartId);
      }

      // If not found in registry, check if it's a global variable
      if (!chartInstance && window[chartId]) {
        chartInstance = window[chartId];
      }

      // If still not found, try to find it through other methods
      if (!chartInstance) {
        // Try to find the ApexCharts instance through the DOM
        const chartElement = document.getElementById(chartId);
        if (chartElement) {
          const apexChartsElement =
            chartElement.querySelector(".apexcharts-canvas");
          if (apexChartsElement && apexChartsElement.id) {
            // Get chart ID from canvas ID (format: apexcharts-{chartID})
            const apexChartId = apexChartsElement.id.replace("apexcharts-", "");
            if (window.ApexCharts && window.ApexCharts.getChartByID) {
              chartInstance = window.ApexCharts.getChartByID(apexChartId);
            }
          }
        }
      }

      if (!chartInstance) {
        console.warn(
          `ApexCharts instance for "${chartId}" not found in attempt ${attempt}`
        );
        continue; // Try again if we have more retries
      }

      // Try the primary export method
      await delay(200); // Wait for chart to be ready

      // First try to trigger a chart refresh to ensure it's fully rendered
      if (chartInstance.updateOptions) {
        try {
          chartInstance.updateOptions({}, false, false);
        } catch (refreshError) {
          console.warn(`Could not refresh chart ${chartId}:`, refreshError);
        }
      }

      // Try the dataURI method
      try {
        await delay(300); // Wait after refresh

        // Get dataURI from ApexCharts
        const result = await chartInstance.dataURI({
          scale: 2, // Higher resolution
          background: "#ffffff", // White background
        });

        // Extract the base64 part
        if (result && result.imgURI) {
          const base64Data = result.imgURI.split(",")[1];
          const endTime = performance.now();
          // console.log(
          //   `Chart ${chartId} export took ${(endTime - startTime).toFixed(2)}ms`
          // );
          return base64Data;
        }
      } catch (primaryError) {
        console.warn(
          `Primary export method failed for ${chartId} on attempt ${attempt}:`,
          primaryError
        );

        // Wait before trying fallback
        await delay(100);

        // Try fallback methods
        const fallbackResult = await fallbackChartExport(
          chartId,
          chartInstance
        );
        if (fallbackResult) {
          const endTime = performance.now();
          console.log(
            `Chart ${chartId} export (fallback) took ${(
              endTime - startTime
            ).toFixed(2)}ms`
          );
          return fallbackResult;
        }
      }
    } catch (error) {
      console.error(
        `Error in attempt ${attempt} for chart "${chartId}":`,
        error
      );

      // Wait before retrying
      await delay(100);
    }
  }

  const endTime = performance.now();
  console.error(
    `All export attempts failed for chart "${chartId}" after ${(
      endTime - startTime
    ).toFixed(2)}ms`
  );
  return null;
}

/**
 * Fallback function that attempts alternative export methods if the primary method fails
 * @param {string} chartId - ID of the chart element
 * @param {object} chartInstance - ApexCharts instance
 * @returns {Promise<string|null>} - Base64 encoded PNG
 */
async function fallbackChartExport(chartId, chartInstance) {
  const startTime = performance.now();
  console.log(`Attempting fallback export for chart ${chartId}`);

  // Add delay function
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  try {
    // Get the chart element
    const chartElement = document.getElementById(chartId);
    if (!chartElement) return null;

    // If no chart instance provided, try to get it
    if (!chartInstance) {
      if (window.chartManager && typeof chartManager.getChart === "function") {
        chartInstance = chartManager.getChart(chartId);
      } else if (window[chartId]) {
        chartInstance = window[chartId];
      }

      if (!chartInstance) return null;
    }

    // METHOD 1: Try to export as SVG first then convert to PNG
    try {
      // Wait for chart to be ready
      await delay(200);

      // Get SVG string from ApexCharts
      let svgString = null;

      // Try different methods to get SVG
      if (chartInstance.w && chartInstance.w.globals.dom.Paper) {
        svgString = chartInstance.w.globals.dom.Paper.svg();
      } else if (chartInstance.getSvgString) {
        svgString = chartInstance.getSvgString();
      }

      if (!svgString) {
        // Try to get SVG directly from DOM
        const svgElement = chartElement.querySelector("svg");
        if (svgElement) {
          svgString = new XMLSerializer().serializeToString(svgElement);
        }
      }

      if (!svgString) throw new Error("Failed to get SVG");

      // Clean the SVG to ensure proper rendering
      svgString = svgString
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/<br>/g, "<br/>");

      // Create a canvas element
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      // Set canvas dimensions to chart dimensions with extra padding
      const chartRect = chartElement.getBoundingClientRect();
      canvas.width = chartRect.width * 2; // Double for better quality
      canvas.height = chartRect.height * 2;
      context.scale(2, 2);

      // Fill with white background
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);

      // Create image from SVG
      const image = new Image();
      image.src =
        "data:image/svg+xml;base64," +
        btoa(unescape(encodeURIComponent(svgString)));

      // Convert to PNG when image loads
      return new Promise((resolve) => {
        image.onload = function () {
          try {
            context.drawImage(image, 0, 0);
            const pngBase64 = canvas.toDataURL("image/png").split(",")[1];
            const endTime = performance.now();
            console.log(
              `Fallback method 1 for chart ${chartId} took ${(
                endTime - startTime
              ).toFixed(2)}ms`
            );
            resolve(pngBase64);
          } catch (drawError) {
            console.error("Error drawing image to canvas:", drawError);
            resolve(null);
          }
        };
        image.onerror = function (err) {
          console.error("Failed to load SVG as image:", err);
          resolve(null);
        };
      });
    } catch (svgError) {
      console.error("SVG export failed:", svgError);

      // METHOD 2: Try to use ApexCharts' exportToSVG method if available
      if (chartInstance.exportToSVG) {
        try {
          await delay(100);
          const method2StartTime = performance.now();
          const result = await chartInstance.exportToSVG();
          if (result && result.imgURI) {
            const endTime = performance.now();
            console.log(
              `Fallback method 2 for chart ${chartId} took ${(
                endTime - method2StartTime
              ).toFixed(2)}ms`
            );
            return result.imgURI.split(",")[1];
          }
        } catch (exportError) {
          console.error("exportToSVG failed:", exportError);
        }
      }
    }
  } catch (error) {
    const endTime = performance.now();
    console.error(
      `All fallback methods failed for ${chartId} after ${(
        endTime - startTime
      ).toFixed(2)}ms:`,
      error
    );
    return null;
  }
}

/**
 * Process charts with careful spacing between operations
 * @param {Array} chartMappings - Array of chart ID to field ID mappings
 * @returns {Promise<Array>} - Array of processed results
 */
async function processChartsWithSpacing(chartMappings) {
  const startTime = performance.now();
  const results = [];
  let successCount = 0;
  let failCount = 0;

  // Helper delay function
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Create a status indicator if it doesn't exist
  let statusElement = document.getElementById("exportStatus");
  if (!statusElement) {
    statusElement = document.createElement("div");
    statusElement.id = "exportStatus";
    statusElement.className =
      "fixed bottom-4 right-4 bg-white p-4 rounded shadow-lg z-50 dark:bg-gray-800 dark:text-white";
    document.body.appendChild(statusElement);
  }

  for (let i = 0; i < chartMappings.length; i++) {
    try {
      const { chartId, fieldId } = chartMappings[i];

      // Update status
      statusElement.textContent = `Processing chart ${i + 1}/${
        chartMappings.length
      }: ${chartId}`;
      console.log(
        `Processing chart ${i + 1}/${chartMappings.length}: ${chartId}`
      );

      // Wait between each chart
      await delay(100);

      const chartStartTime = performance.now();

      // Get base64 data directly from ApexCharts
      const base64String = await getApexChartBase64(chartId);

      const chartEndTime = performance.now();
      console.log(
        `Chart ${chartId} total processing time: ${(
          chartEndTime - chartStartTime
        ).toFixed(2)}ms`
      );

      // If successful, add to results
      if (base64String) {
        results.push({ fieldId, base64String });
        successCount++;
        console.log(`Successfully exported chart ${chartId}`);
      } else {
        // If failed, add null result
        results.push({ fieldId, base64String: null });
        failCount++;
        console.error(`Failed to export chart ${chartId}`);
      }

      // Give more space between exports
      await delay(100);
    } catch (error) {
      console.error(
        `Error processing chart ${chartMappings[i].chartId}:`,
        error
      );
      results.push({ fieldId: chartMappings[i].fieldId, base64String: null });
      failCount++;
    }
  }

  const endTime = performance.now();
  console.log(
    `Total chart processing time: ${(endTime - startTime).toFixed(2)}ms for ${
      chartMappings.length
    } charts`
  );

  // Update final status
  statusElement.textContent = `Export complete: ${successCount} successful, ${failCount} failed in ${(
    endTime - startTime
  ).toFixed(0)}ms`;
  setTimeout(() => {
    statusElement.remove();
  }, 300);

  return results;
}

/**
 * Enhanced version of mainPrint using ApexCharts dataURI with better spacing
 */
async function apexChartsExportPrint() {
  const totalStartTime = performance.now();
  console.log("Starting chart export process...");

  showApiLoadingFunction("open", "print");

  const printButton = document.getElementById("printBase64");
  if (!printButton) {
    console.error("Print button not found");
    return;
  }

  // Store original button state to restore later
  const originalButtonContent = printButton.innerHTML;
  printButton.disabled = true;
  printButton.innerHTML = `
    <div class="flex items-center justify-center">
      <svg aria-hidden="true" role="status" class="inline w-6 h-6 me-3 text-xl colorGreen font-extrabold animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C  47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
      </svg>
      <span class="font-medium">Exporting Charts...</span>
    </div>`;

  try {
    // Show all sections for rendering, if needed
    const showSectionsStartTime = performance.now();
    const sections = [
      "cashContent",
      "netAssetsContent",
      "incomeContent",
      "expenseContent",
    ];
    const hiddenSections = [];

    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element && element.classList.contains("hidden")) {
        element.classList.remove("hidden");
        hiddenSections.push(element); // Track which ones we unhid
      }
    });

    // Wait for DOM to update
    await new Promise((resolve) => setTimeout(resolve, 200));

    const showSectionsEndTime = performance.now();
    console.log(
      `Showing sections took ${(
        showSectionsEndTime - showSectionsStartTime
      ).toFixed(2)}ms`
    );

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
    const filterStartTime = performance.now();
    const validChartMappings = chartMappings.filter(
      ({ chartId }) => document.getElementById(chartId) !== null
    );
    const filterEndTime = performance.now();
    console.log(
      `Filtering chart mappings took ${(
        filterEndTime - filterStartTime
      ).toFixed(2)}ms`
    );

    if (validChartMappings.length === 0) {
      throw new Error("No valid charts found to upload");
    }

    // console.log(`Found ${validChartMappings.length} valid charts to export`);

    // Process charts with improved spacing
    const processingStartTime = performance.now();
    const results = await processChartsWithSpacing(validChartMappings);
    const processingEndTime = performance.now();
    console.log(
      `Processing all charts took ${(
        processingEndTime - processingStartTime
      ).toFixed(2)}ms`
    );

    // Count successful exports
    const successfulExports = results.filter(
      (r) => r.base64String !== null
    ).length;
    console.log(
      `Successfully exported ${successfulExports} of ${validChartMappings.length} charts`
    );

    if (successfulExports === 0) {
      throw new Error("No charts were successfully exported");
    }

    // Hide sections that were previously hidden
    hiddenSections.forEach((element) => {
      element.classList.add("hidden");
    });

    // Build XML request with metadata and chart images
    const xmlBuildStartTime = performance.now();
    let uploadXml = "<qdbapi><apptoken>c3qhvhmcgbwze7hwbiavcm3hnmc</apptoken>";

    // Add metadata first
    uploadXml += createFieldXml(171, ClientRid);
    uploadXml += createFieldXml(7, firmName);
    uploadXml += createFieldXml(6, uniqueClients?.size);
    const selectedYears = getSelectedYearsFromLocalStorage()
    uploadXml += createFieldXml(23, selectedYears[0]);
    uploadXml += createFieldXml(24, selectedYears[selectedYears.length - 1]);

    // Add base64 images for charts
    results.forEach((result) => {
      if (result && result.base64String) {
        uploadXml += createImageFieldXml(result.fieldId, result.base64String);
      }
    });

    uploadXml += "</qdbapi>";
    const xmlBuildEndTime = performance.now();
    console.log(
      `Building XML payload took ${(
        xmlBuildEndTime - xmlBuildStartTime
      ).toFixed(2)}ms, size: ${uploadXml.length} bytes`
    );

    // Send to Quickbase
    console.log("Sending data to Quickbase...");
    const sendStartTime = performance.now();
    const response = await sendToQuickbase(uploadXml);
    const sendEndTime = performance.now();
    console.log(
      `Sending data to Quickbase took ${(sendEndTime - sendStartTime).toFixed(
        2
      )}ms`
    );

    // Process response
    const responseStartTime = performance.now();
    const xmlResponse = $(response);
    const errorCode = xmlResponse.find("qdbapi").find("errcode").text();
    const responseEndTime = performance.now();
    console.log(
      `Processing Quickbase response took ${(
        responseEndTime - responseStartTime
      ).toFixed(2)}ms`
    );

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
    console.error("Error in apexChartsExportPrint:", error);
    createToastWarning(
      `Error creating presentation: ${error.message || "Unknown error"}`
    );
  } finally {
    // Restore button state
    printButton.disabled = false;
    printButton.innerHTML = originalButtonContent;

    const totalEndTime = performance.now();
    const totalTime = totalEndTime - totalStartTime;
    const totalTimeFormatted = new Date(totalTime)
      .toISOString()
      .substring(14, 23); // Format as MM:SS.sss

    console.log(`===============================================`);
    console.log(
      `TOTAL EXPORT PROCESS TIME: ${totalTimeFormatted} (${totalTime.toFixed(
        2
      )}ms)`
    );
    console.log(`===============================================`);

    // // Add a visual indicator on the page
    // const timeIndicator = document.createElement("div");
    // timeIndicator.className =
    //   "fixed top-4 right-4 bg-green-700 text-white p-2 rounded shadow-lg z-50";
    // timeIndicator.style.fontSize = "14px";
    // timeIndicator.innerHTML = `Export completed in: ${totalTimeFormatted}`;
    // document.body.appendChild(timeIndicator);

    // Remove the indicator after 5 seconds
    setTimeout(() => {
      timeIndicator.remove();
    }, 5000);
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
  return `<field fid='${id}' filename='chart.png'>${val}</field>`;
}

/**
 * Send record to Quickbase
 * @param {string} xml - XML payload to send
 * @returns {Promise<object>} - Response data
 */
async function sendToQuickbase(xml) {
  const startTime = performance.now();
  try {
    const response = await $.ajax({
      type: "POST",
      contentType: "text/xml",
      url: "https://capincrouse.quickbase.com/db/bumq5qw5e?a=API_AddRecord",
      dataType: "xml",
      processData: false,
      data: xml,
      timeout: 60000, // 60-second timeout (increased from 30)
    });

    const endTime = performance.now();
    console.log(
      `Quickbase API call completed successfully in ${(
        endTime - startTime
      ).toFixed(2)}ms`
    );
    return response;
  } catch (error) {
    const endTime = performance.now();
    const errorMessage =
      error.responseText ||
      error.statusText ||
      error.message ||
      "Unknown error";
    console.error(
      `Quickbase API error after ${(endTime - startTime).toFixed(2)}ms:`,
      errorMessage
    );
    throw new Error(`Quickbase API error: ${errorMessage}`);
  }
}

/**
 * Initialize the ApexCharts export print functionality
 */
function initApexChartsPrintFunction() {
  const printButton = document.getElementById("printBase64");
  if (!printButton) {
    console.error(
      "Print button not found for ApexCharts export print functionality"
    );
    return;
  }

  // Remove existing event listeners
  const newPrintButton = printButton.cloneNode(true);
  printButton.parentNode.replaceChild(newPrintButton, printButton);

  // Add ApexCharts export print function
  newPrintButton.addEventListener("click", () => {
    apexChartsExportPrint();
  });

  console.log("ApexCharts export print functionality initialized");
}

// Initialize when document is loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApexChartsPrintFunction);
} else {
  initApexChartsPrintFunction();
}
