
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
  
        // Store original chart options to restore later
        let originalOptions = null;
        if (chartInstance.w && chartInstance.w.config) {
          originalOptions = {
            chart: {
              height: chartInstance.w.config.chart.height
            }
          };
        }
  
        // Try the primary export method
        await delay(200); // Wait for chart to be ready
  
        // First try to trigger a chart refresh with increased height to ensure it's fully rendered
        if (chartInstance.updateOptions) {
          try {
            // Update the chart height to 600px
            chartInstance.updateOptions({
              chart: {
                height: 600
              }
            }, false, true);
            
            // Give the chart time to resize
            await delay(300);
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
          
          // Restore original chart height
          if (originalOptions && chartInstance.updateOptions) {
            try {
              await delay(100);
              chartInstance.updateOptions(originalOptions, false, true);
            } catch (restoreError) {
              console.warn(`Could not restore chart ${chartId} to original height:`, restoreError);
            }
          }
  
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
  
          // Restore original chart height even if export failed
          if (originalOptions && chartInstance.updateOptions) {
            try {
              await delay(100);
              chartInstance.updateOptions(originalOptions, false, true);
            } catch (restoreError) {
              console.warn(`Could not restore chart ${chartId} to original height:`, restoreError);
            }
          }
  
          // Wait before trying fallback
          await delay(100);
  
          // Try fallback methods
          const fallbackResult = await fallbackChartExport(
            chartId,
            chartInstance
          );
          if (fallbackResult) {
            const endTime = performance.now();
            // console.log(
            //   `Chart ${chartId} export (fallback) took ${(
            //     endTime - startTime
            //   ).toFixed(2)}ms`
            // );
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
        await delay(100);
  
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
              // console.log(
              //   `Fallback method 1 for chart ${chartId} took ${(
              //     endTime - startTime
              //   ).toFixed(2)}ms`
              // );
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
              // console.log(
              //   `Fallback method 2 for chart ${chartId} took ${(
              //     endTime - method2StartTime
              //   ).toFixed(2)}ms`
              // );
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
        // console.log(
        //   `Processing chart ${i + 1}/${chartMappings.length}: ${chartId}`
        // );
  
        // Wait between each chart
        await delay(100);
  
        // const chartStartTime = performance.now();
  
        // Get base64 data directly from ApexCharts
        const base64String = await getApexChartBase64(chartId);
  
        // const chartEndTime = performance.now();
        // console.log(
        //   `Chart ${chartId} total processing time: ${(
        //     chartEndTime - chartStartTime
        //   ).toFixed(2)}ms`
        // );
  
        // If successful, add to results
        if (base64String) {
          results.push({ fieldId, base64String });
          successCount++;
          // console.log(`Successfully exported chart ${chartId}`);
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
    }, 200);
  
    return results;
  }
  