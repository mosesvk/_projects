// print_base64.js

/**
 * Improved chart processing for export that ensures the full chart is captured
 *
 * @param {Array} chartMappings - Array of chart ID and field ID mappings
 * @returns {Promise<Array>} - Results of chart processing
 */
async function processChartsWithSpacing(chartMappings) {
  // console.log(`Processing ${chartMappings.length} charts for export`);
  const results = [];

  const loadingModal = document.getElementById("loadingApiDiv");
  if (loadingModal) {
    // Create progress tracking elements
    const progressContainer = document.createElement("div");
    progressContainer.id = "chart-progress-container";
    progressContainer.className = "mt-6 px-3 py-1 w-full";

    progressContainer.innerHTML = `
      <div class="w-full">
        <div class="flex justify-between mb-1 text-white">
          <span id="chart-progress-text" class="text-lg font-medium">Processing charts</span>
          <span id="chart-progress-count" class="text-lg font-medium">0/${chartMappings.length}</span>
        </div>
        <div class="w-full bg-gray-700 rounded-full h-2.5 mt-2">
          <div id="chart-progress-bar" class="backgroundGreen h-2.5 rounded-full" style="width: 0%"></div>
        </div>
      </div>
    `;

    // Find the loading content div within the modal
    const loadingContent =
      loadingModal.querySelector("#loadingApiInnerDiv") || loadingModal;

    // Insert the progress container as the first child of the loading content
    loadingContent.appendChild(progressContainer);
  }

  for (let i = 0; i < chartMappings.length; i++) {
    const { chartId, fieldId } = chartMappings[i];

    // Update progress UI if elements exist
    const progressBar = document.getElementById("chart-progress-bar");
    const progressCount = document.getElementById("chart-progress-count");
    const progressText = document.getElementById("chart-progress-text");

    if (progressBar) {
      const progressPercent = Math.floor((i / chartMappings.length) * 100);
      progressBar.style.width = `${progressPercent}%`;
    }

    if (progressCount) {
      progressCount.textContent = `${i}/${chartMappings.length}`;
    }

    if (progressText) {
      progressText.textContent = `Processing charts...`;
    }

    try {
      console.log(`Processing chart: ${chartId}...`);

      // Update progress UI (keep as is)...

      // Get the chart element
      const chartElement = document.getElementById(chartId);
      if (!chartElement) {
        console.warn(`Chart element not found: ${chartId}`);
        results.push({ chartId, fieldId, base64String: null });
        continue;
      }

      // Get the ApexChart instance
      const chart = chartManager.getChart(chartId) || window[chartId];

      // If we have an ApexChart instance, use its export method
      if (chart && typeof chart.dataURI === "function") {
        // Clone chart container and place it off-screen for capture
        const tempContainer = document.createElement("div");
        tempContainer.id = `temp-${chartId}`;
        tempContainer.style.position = "absolute";
        tempContainer.style.left = "-9999px";
        tempContainer.style.height = "400px"; // Intentionally taller
        tempContainer.style.width = "900px";
        document.body.appendChild(tempContainer);

        // Create a temporary chart with the same config but larger dimensions
        const tempChart = new ApexCharts(tempContainer, {
          ...chart.w.config,
          chart: {
            ...chart.w.config.chart,
            height: 400, // Make it taller
            width: 900,
            animations: {
              enabled: false, // Disable animations for export
            },
            fontFamily:
              chart.w.config.chart.fontFamily || "Helvetica, Arial, sans-serif",
          },
          // Ensure legend and dataLabels are fully visible
          legend: {
            ...chart.w.config.legend,
            position: chart.w.config.legend?.position || "bottom",
          },
          // Add extra bottom margin
          grid: {
            ...chart.w.config.grid,
            padding: {
              ...chart.w.config.grid?.padding,
              bottom: 30, // Extra padding at bottom
            },
          },
        });

        // Render the temporary chart
        await tempChart.render();

        // Wait for rendering to complete
        await new Promise((resolve) => setTimeout(resolve, 200));

        try {
          // Use ApexCharts' dataURI method to get the image
          const uri = await tempChart.dataURI();
          const base64String = uri.imgURI.split(",")[1];
          results.push({ chartId, fieldId, base64String });
        } catch (exportError) {
          console.error(
            `Error exporting chart ${chartId} via dataURI:`,
            exportError
          );

          // Fallback to html2canvas if dataURI fails
          const canvas = await html2canvas(tempContainer, {
            scale: 2,
            width: 900, // Fixed width (9.37 inches)
            height: 400, // Fixed height (4.16 inches)
            useCORS: true,
            allowTaint: true,
            backgroundColor:
              getComputedStyle(document.documentElement).getPropertyValue(
                "--chart-bg-color"
              ) || "#ffffff",
            onclone: (doc, clonedElement) => {
              // Make sure we can see everything
              clonedElement.style.overflow = "visible";
              clonedElement.style.height = "600px";
            },
          });

          const base64String = canvas.toDataURL("image/png").split(",")[1];
          results.push({ chartId, fieldId, base64String });
        }

        // Clean up
        tempChart.destroy();
        document.body.removeChild(tempContainer);
      } else {
        // Fallback for non-ApexCharts or if chart instance not found
        console.log(`Using fallback html2canvas for ${chartId}`);

        // Create a clone of the chart element for manipulation
        const originalHeight = chartElement.style.height;
        const originalOverflow = chartElement.style.overflow;

        // Set temporary styles for better capture
        chartElement.style.height = "550px";
        chartElement.style.overflow = "visible";

        // Force any SVG elements to include all content
        const svgElements = chartElement.querySelectorAll("svg");
        svgElements.forEach((svg) => {
          if (svg.getAttribute("height")) {
            svg.setAttribute("height", "550");
          }
          svg.style.overflow = "visible";
        });

        // Wait for styles to apply
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Use html2canvas with enhanced options
        const canvas = await html2canvas(chartElement, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor:
            getComputedStyle(document.documentElement).getPropertyValue(
              "--chart-bg-color"
            ) || "#ffffff",
          height: chartElement.scrollHeight + 50,
          onclone: (doc, clonedElement) => {
            clonedElement.style.overflow = "visible";
            clonedElement.style.height = chartElement.scrollHeight + 50 + "px";

            // Also adjust any SVG elements in the clone
            const clonedSvgs = clonedElement.querySelectorAll("svg");
            clonedSvgs.forEach((svg) => {
              if (svg.getAttribute("height")) {
                svg.setAttribute("height", chartElement.scrollHeight + 50);
              }
              svg.style.overflow = "visible";
            });
          },
        });

        // Restore original styles
        chartElement.style.height = originalHeight;
        chartElement.style.overflow = originalOverflow;

        // Convert canvas to base64 PNG
        const base64String = canvas.toDataURL("image/png").split(",")[1];
        results.push({ chartId, fieldId, base64String });
      }

      // Small timeout to prevent UI freezing
      await new Promise((resolve) => setTimeout(resolve, 50));
    } catch (error) {
      console.error(`Error processing chart ${chartId}:`, error);
      results.push({ chartId, fieldId, base64String: null });
    }
  }

  // Final progress update
  const progressBar = document.getElementById("chart-progress-bar");
  const progressCount = document.getElementById("chart-progress-count");
  const progressText = document.getElementById("chart-progress-text");

  if (progressBar) {
    progressBar.style.width = "100%";
  }

  if (progressCount) {
    progressCount.textContent = `${chartMappings.length}/${chartMappings.length}`;
  }

  if (progressText) {
    progressText.textContent = "Processing complete!";
  }

  return results;
}

/**
 * Enhanced version of mainPrint using ApexCharts dataURI with better spacing
 */
async function apexChartsExportPrint() {
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
    const sections = [
      "GeneralContent",
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
    await new Promise((resolve) => setTimeout(resolve, 50));

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
    const validChartMappings = chartMappings.filter(
      ({ chartId }) => document.getElementById(chartId) !== null
    );

    if (validChartMappings.length === 0) {
      throw new Error("No valid charts found to upload");
    }

    // Process charts with improved spacing
    const results = await processChartsWithSpacing(validChartMappings);

    // Count successful exports
    const successfulExports = results.filter(
      (r) => r.base64String !== null
    ).length;
    // console.log(
    //   `Successfully exported ${successfulExports} of ${validChartMappings.length} charts`
    // );

    if (successfulExports === 0) {
      throw new Error("No charts were successfully exported");
    }

    // Hide sections that were previously hidden
    hiddenSections.forEach((element) => {
      element.classList.add("hidden");
    });

    let uploadXml = "<qdbapi><apptoken>c3qhvhmcgbwze7hwbiavcm3hnmc</apptoken>";

    // Add metadata first
    const selectedYears = getSelectedYearsFromLocalStorage();
    const uniqueClients = document.getElementById("uniqueClients").innerHTML;

    uploadXml += createFieldXml(171, ClientRid);
    uploadXml += createFieldXml(7, firmName);
    uploadXml += createFieldXml(6, uniqueClients);
    uploadXml += createFieldXml(23, selectedYears[selectedYears.length - 1]);
    uploadXml += createFieldXml(24, window.monthYearEnd);
    uploadXml += createFieldXml(36, sliderValue);
    uploadXml += createFieldXml(37, sliderValue2);
    uploadXml += createFieldXml(38, missionValue);
    uploadXml += createFieldXml(39, missionValue2);
    uploadXml += createFieldXml(
      40,
      Array.from(window.selectedAreas_Array).join(";")
    );
    uploadXml += createFieldXml(
      41,
      Array.from(window.selectedTypes_Array).join(";")
    );
    // uploadXml += createFieldXml(24, selectedYears[]);

    // Add base64 images for charts
    results.forEach((result) => {
      if (result && result.base64String) {
        uploadXml += createImageFieldXml(result.fieldId, result.base64String);
      }
    });

    uploadXml += "</qdbapi>";

    const response = await sendToQuickbase(uploadXml);

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
    console.error("Error in apexChartsExportPrint:", error);
    createToastWarning(
      `Error creating presentation: ${error.message || "Unknown error"}`
    );
  } finally {
    // Restore button state
    printButton.disabled = false;
    printButton.innerHTML = originalButtonContent;

    // Remove progress tracking container
    const progressContainer = document.getElementById(
      "chart-progress-container"
    );
    if (progressContainer && progressContainer.parentNode) {
      progressContainer.parentNode.removeChild(progressContainer);
    }
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

    return response;
  } catch (error) {
    const errorMessage =
      error.responseText ||
      error.statusText ||
      error.message ||
      "Unknown error";
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
