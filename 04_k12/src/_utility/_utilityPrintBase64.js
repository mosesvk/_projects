/**
 * _utilityPrintBase64.js – K12 Print Presentation (chart export to base64, upload to Quickbase)
 * Mirrors 05_cfhi_comp printBase64.js; targets K12 Quickbase table bumq5tt67 (app bptwbcsjv).
 * Quickbase table: https://capincrouse.quickbase.com/nav/app/bptwbcsjv/table/bumq5tt67/action/listfields
 * Fields: 1–5 (Date Created, Date Modified, Record ID#, Record Owner, Last Modified By),
 *         6 UniqueClientCount, 7 Client Name, 8–22 base64 file attachment fields for charts.
 */

const DEFAULT_CHART_WIDTH = 1000;
const DEFAULT_CHART_HEIGHT = 600;

/** K12 Quickbase table for base64 presentation records (app bptwbcsjv "Public Documents") */
const K12_BASE64_TABLE_ID = "bumq5tt67";
/**
 * App token for app bptwbcsjv (Public Documents), which contains table bumq5tt67 (K12 Presentation).
 * Same app as Church Presentation (bvcr2chqi); church uses this token in printBase64.js.
 * Override via window.K12_BASE64_APP_TOKEN in index.html if needed.
 */
const K12_BASE64_APP_TOKEN =
  typeof window !== "undefined" && window.K12_BASE64_APP_TOKEN
    ? window.K12_BASE64_APP_TOKEN
    : "bbkmdcurd2sd5cpqvf58dsabq2q";
    
/**
 * Get dimensions for a chart (all K12 charts use same size).
 * @param {string} chartId - The ID of the chart
 * @returns {{ width: number, height: number }}
 */
function getChartDimensions(chartId) {
  return {
    width: DEFAULT_CHART_WIDTH,
    height: DEFAULT_CHART_HEIGHT,
  };
}

/**
 * Process charts: export each to base64 with progress UI.
 * @param {Array<{ chartId: string, fieldId: number }>} chartMappings - Chart ID to Quickbase field ID
 * @returns {Promise<Array<{ chartId: string, fieldId: number, base64String: string|null }>>}
 */
async function processChartsWithSpacing(chartMappings) {
  const results = [];
  setupProgressUI(chartMappings.length);

  for (let i = 0; i < chartMappings.length; i++) {
    const { chartId, fieldId } = chartMappings[i];
    updateProgressUI(i, chartMappings.length);

    try {
      const chartElement = document.getElementById(chartId);
      if (!chartElement) {
        console.warn(`Chart element not found: ${chartId}`);
        results.push({ chartId, fieldId, base64String: null });
        continue;
      }

      const chart = getChartInstance(chartId);

      if (chart && typeof chart.dataURI === "function") {
        const base64String = await exportApexChart(chart, chartId);
        if (base64String) {
          results.push({ chartId, fieldId, base64String });
          continue;
        }
      }

      const base64String = await exportWithHtml2Canvas(chartElement);
      results.push({ chartId, fieldId, base64String });

      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`Error processing chart ${chartId}:`, error);
      results.push({ chartId, fieldId, base64String: null });
    }
  }

  completeProgressUI(chartMappings.length);
  return results;
}

/**
 * Save full chart state for restoration after export.
 * @param {Object} chart - ApexCharts instance
 * @returns {Object|null} Saved state or null
 */
function saveCompleteChartState(chart) {
  try {
    const paperNode = chart.w.globals.dom.Paper.node;
    const chartConfig = chart.w.config;
    const chartId = chart.w.globals.chartID;
    const mainName = chartId.replace("_chart", "");

    const chartType = "line";
    const baseConfig = {
      chart: chartConfig.chart || {},
      dataLabels: chartConfig.dataLabels || {},
      markers: chartConfig.markers || {},
      title: chartConfig.title || {},
      subtitle: chartConfig.subtitle || {},
      xaxis: chartConfig.xaxis || {},
      yaxis: chartConfig.yaxis || {},
      tooltip: chartConfig.tooltip || {},
      legend: chartConfig.legend || {},
      grid: chartConfig.grid || {},
      stroke: chartConfig.stroke || {},
      plotOptions: chartConfig.plotOptions || {},
      annotations: chartConfig.annotations || {},
      colors: chartConfig.colors || [],
      series: chartConfig.series || [],
      labels: chartConfig.labels || [],
    };

    const clonedConfig = JSON.parse(JSON.stringify(baseConfig));

    const numType = chart.w.globals.numType || chartConfig.numType || "number";
    const fixedNum = chartConfig.dataLabels?.formatter
      ?.toString()
      .includes("fixedNum")
      ? parseInt(
          chartConfig.dataLabels.formatter
            .toString()
            .match(/fixedNum\s*=\s*(\d+)/)?.[1] || 0
        )
      : chartConfig.dataLabels?.fixedNum || 0;

    let yaxisConfig;
    if (Array.isArray(chartConfig.yaxis)) {
      yaxisConfig = chartConfig.yaxis.map((axis) => ({
        ...axis,
        labels: {
          ...axis.labels,
          formatter: axis.labels?.formatter?.toString(),
          style: axis.labels?.style || {},
          align: axis.labels?.align,
        },
        axisBorder: axis.axisBorder || {},
        axisTicks: axis.axisTicks || {},
      }));
    } else {
      yaxisConfig = [
        {
          ...chartConfig.yaxis,
          labels: {
            ...chartConfig.yaxis?.labels,
            formatter: chartConfig.yaxis?.labels?.formatter?.toString(),
            style: chartConfig.yaxis?.labels?.style || {},
            align: chartConfig.yaxis?.labels?.align,
          },
          axisBorder: chartConfig.yaxis?.axisBorder || {},
          axisTicks: chartConfig.yaxis?.axisTicks || {},
        },
      ];
    }

    const w = chart.w.globals.svgWidth;
    const h = chart.w.globals.svgHeight;
    const viewBoxVal = paperNode.getAttribute("viewBox");
    const preserveVal = paperNode.getAttribute("preserveAspectRatio");

    return {
      chartId,
      chartType,
      mainName,
      svgAttributes: {
        width: paperNode.getAttribute("width"),
        height: paperNode.getAttribute("height"),
        viewBox: viewBoxVal != null && viewBoxVal !== "" ? viewBoxVal : `0 0 ${w} ${h}`,
        styleWidth: paperNode.style.width,
        styleHeight: paperNode.style.height,
        preserveAspectRatio: preserveVal != null && preserveVal !== "" ? preserveVal : "xMidYMid meet",
      },
      chartConfig: clonedConfig,
      dimensions: {
        width: chart.w.globals.svgWidth,
        height: chart.w.globals.svgHeight,
      },
      xaxisConfig: {
        categories: chartConfig.xaxis?.categories || [],
        labels: chartConfig.xaxis?.labels || {},
        type: chartConfig.xaxis?.type || "category",
        tickPlacement: chartConfig.xaxis?.tickPlacement || "between",
        axisBorder: chartConfig.xaxis?.axisBorder || {},
        crosshairs: chartConfig.xaxis?.crosshairs || {},
      },
      numType: numType,
      fixedNum: fixedNum,
      isYAxisArray: Array.isArray(chartConfig.yaxis),
      yaxisConfig: yaxisConfig,
    };
  } catch (error) {
    return null;
  }
}

/**
 * Restore chart state after export.
 * @param {Object} chart - ApexCharts instance
 * @param {Object} originalState - State from saveCompleteChartState
 */
function restoreCompleteChartState(chart, originalState) {
  try {
    if (!chart || !originalState || !chart.w?.globals?.dom) return;

    const paperNode = chart.w.globals.dom.Paper.node;
    const { svgAttributes } = originalState;
    if (svgAttributes.width != null) paperNode.setAttribute("width", svgAttributes.width);
    if (svgAttributes.height != null) paperNode.setAttribute("height", svgAttributes.height);
    if (svgAttributes.styleWidth != null) paperNode.style.width = svgAttributes.styleWidth;
    if (svgAttributes.styleHeight != null) paperNode.style.height = svgAttributes.styleHeight;
    const viewBox = svgAttributes.viewBox != null && svgAttributes.viewBox !== "" ? svgAttributes.viewBox : "0 0 1000 600";
    paperNode.setAttribute("viewBox", viewBox);
    const preserve = svgAttributes.preserveAspectRatio != null && svgAttributes.preserveAspectRatio !== "" ? svgAttributes.preserveAspectRatio : "xMidYMid meet";
    paperNode.setAttribute("preserveAspectRatio", preserve);

    const originalConfig = chart.w.config;
    const chartId = originalState.chartId || chart.w.globals.chartID;
    const mainName = originalState.mainName || chartId.replace("_chart", "");
    const chartType = originalState.chartType || "line";
    const numType =
      originalState.numType ||
      chart.w.globals.numType ||
      originalConfig.numType ||
      "number";
    const fixedNum =
      originalState.fixedNum !== undefined ? originalState.fixedNum : 0;

    const restoredConfig = {
      ...originalState.chartConfig,
      xaxis: {
        ...originalState.xaxisConfig,
        categories: originalState.xaxisConfig.categories,
        labels: {
          ...originalState.xaxisConfig.labels,
          style: {
            ...originalState.xaxisConfig.labels.style,
            colors:
              originalState.chartConfig.xaxis?.labels?.style?.colors ||
              "#3a464f",
          },
        },
      },
      yaxis: originalState.yaxisConfig
        ? originalState.yaxisConfig.map((axis) => ({
            ...axis,
            labels: {
              ...axis.labels,
              formatter: function (value) {
                let formattedValue;
                if (numType === "percent") {
                  formattedValue = (value * 100).toFixed(fixedNum);
                  return `${formattedValue}%`;
                }
                if (numType === "dollar") {
                  formattedValue = value.toFixed(fixedNum);
                  return `$${formattedValue}`;
                }
                formattedValue =
                  value >= 1000
                    ? (value / 1000).toFixed(1) + "K"
                    : value.toFixed(fixedNum);
                return formattedValue;
              },
              align: axis.labels?.align,
            },
          }))
        : [],
      annotations: originalState.chartConfig.annotations || {},
    };

    if (chart.w.globals) chart.w.globals.numType = numType;
    if (chart.updateOptions) {
      chart.updateOptions(restoredConfig, true, true);
    }
  } catch (error) {
    // Silently handle restoration errors
  }
}

/**
 * Get ApexCharts instance for a chart ID (K12 charts stored on window by _utility.js createChart).
 * @param {string} chartId - Chart element ID
 * @returns {Object|null} Chart instance or null
 */
function getChartInstance(chartId) {
  const chartMap = {
    studentAverageEnrollment_chart: window.studentAverageEnrollment_chart,
    studentFacilityRatio_chart: window.studentFacilityRatio_chart,
    expendableReserves_inDays_chart: window.expendableReserves_inDays_chart,
    expendableReserves_Percent_chart: window.expendableReserves_Percent_chart,
    liquidityRatio_chart: window.liquidityRatio_chart,
    daysCashOnHand_chart: window.daysCashOnHand_chart,
    netTuitionARasPercentCurrentAssets_chart:
      window.netTuitionARasPercentCurrentAssets_chart,
    currentRatio_chart: window.currentRatio_chart,
    debtPerStudent_chart: window.debtPerStudent_chart,
    debtCoverage_chart: window.debtCoverage_chart,
    debtToNetAssets_chart: window.debtToNetAssets_chart,
    netIncomeRatio_chart: window.netIncomeRatio_chart,
    grossTuition_chart: window.grossTuition_chart,
    financialAssistanceAsPercentTuitionAndFees_chart:
      window.financialAssistanceAsPercentTuitionAndFees_chart,
    salariesBenefitsTeachersAsPercentNetTuition_SalariesAndBenefits_chart:
      window.salariesBenefitsTeachersAsPercentNetTuition_SalariesAndBenefits_chart,
  };
  return chartMap[chartId] || null;
}

/**
 * Export ApexChart to base64 PNG.
 * @param {Object} chart - ApexCharts instance
 * @param {string} chartId - Chart ID
 * @returns {Promise<string|null>} Base64 string or null
 */
async function exportApexChart(chart, chartId) {
  try {
    if (!chart || !chart.w || !chart.w.globals || !chart.w.globals.dom) {
      throw new Error("Invalid chart instance");
    }

    const dimensions = getChartDimensions(chartId);
    const { width: chartWidth, height: chartHeight } = dimensions;
    const extraWidth = 100;

    const fixedContainer = document.createElement("div");
    fixedContainer.style.position = "absolute";
    fixedContainer.style.left = "-9999px";
    fixedContainer.style.width = `${chartWidth + extraWidth}px`;
    fixedContainer.style.height = `${chartHeight + 100}px`;
    fixedContainer.style.backgroundColor = "#ffffff";
    fixedContainer.style.overflow = "visible";
    document.body.appendChild(fixedContainer);

    const chartElement = chart.w.globals.dom.Paper.node.parentNode;
    if (!chartElement) throw new Error("Chart element not found");

    const originalStyles = {
      width: chartElement.style.width,
      height: chartElement.style.height,
      position: chartElement.style.position,
      transform: chartElement.style.transform,
    };

    const originalState = saveCompleteChartState(chart);
    if (!originalState) throw new Error("Failed to save chart state");

    const originalParent = chartElement.parentElement;
    fixedContainer.innerHTML = "";
    fixedContainer.appendChild(chartElement);

    chartElement.style.width = `${chartWidth}px`;
    chartElement.style.height = `${chartHeight}px`;
    chartElement.style.position = "absolute";
    chartElement.style.left = "50px";
    chartElement.style.top = "20px";
    chartElement.style.transform = "none";

    const paperNode = chart.w.globals.dom.Paper.node;
    paperNode.setAttribute("width", chartWidth.toString());
    paperNode.setAttribute("height", chartHeight.toString());
    paperNode.style.width = `${chartWidth}px`;
    paperNode.style.height = `${chartHeight}px`;
    paperNode.setAttribute("viewBox", `0 0 ${chartWidth} ${chartHeight}`);
    paperNode.setAttribute("preserveAspectRatio", "xMidYMid meet");

    if (chart.updateOptions) {
      await chart.updateOptions(
        { title: { text: "" }, subtitle: { text: "" } },
        false,
        true
      );
    }

    const updatedOptions = {
      chart: {
        width: chartWidth,
        height: chartHeight,
        animations: { enabled: false },
        background: "#ffffff",
      },
    };
    if (chart.updateOptions) {
      await chart.updateOptions(updatedOptions, false, true);
    }

    await new Promise((resolve) => setTimeout(resolve, 200));

    const uri = await chart.dataURI({
      width: chartWidth + extraWidth,
      height: chartHeight + 100,
      scale: 1,
    });

    if (originalParent) originalParent.appendChild(chartElement);
    Object.assign(chartElement.style, originalStyles);
    restoreCompleteChartState(chart, originalState);

    if (fixedContainer.parentNode) document.body.removeChild(fixedContainer);

    const base64String = uri.imgURI.split(",")[1];
    return base64String;
  } catch (error) {
    console.error("Error in exportApexChart:", error);
    return null;
  }
}

/**
 * Fallback export using html2canvas.
 * @param {HTMLElement} chartElement - Chart container element
 * @returns {Promise<string|null>} Base64 string or null
 */
async function exportWithHtml2Canvas(chartElement) {
  const chartId = chartElement.id;
  const { width: chartWidth, height: chartHeight } =
    getChartDimensions(chartId);

  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.left = "-9999px";
  container.style.width = `${chartWidth}px`;
  container.style.height = `${chartHeight}px`;
  container.style.backgroundColor = "#ffffff";
  container.style.overflow = "hidden";

  const clone = chartElement.cloneNode(true);
  clone.style.width = `${chartWidth}px`;
  clone.style.height = `${chartHeight}px`;
  container.appendChild(clone);
  document.body.appendChild(container);

  const svgElements = clone.querySelectorAll("svg");
  svgElements.forEach((svg) => {
    svg.setAttribute("width", chartWidth.toString());
    svg.setAttribute("height", chartHeight.toString());
    svg.style.width = `${chartWidth}px`;
    svg.style.height = `${chartHeight}px`;
    svg.setAttribute("viewBox", `0 0 ${chartWidth} ${chartHeight}`);
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
  });

  try {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const canvas = await html2canvas(clone, {
      scale: 1,
      width: chartWidth,
      height: chartHeight,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
    });
    const dataURL = canvas.toDataURL("image/png");
    const base64String = dataURL.split(",")[1];
    document.body.removeChild(container);
    return base64String;
  } catch (error) {
    console.error("Error in html2canvas export:", error);
    if (container.parentNode) document.body.removeChild(container);
    return null;
  }
}

function setupProgressUI(totalCharts) {
  const loadingModal = document.getElementById("loadingApiDiv");
  if (!loadingModal) return;

  const progressContainer = document.createElement("div");
  progressContainer.id = "chart-progress-container";
  progressContainer.className = "mt-6 px-3 py-1 w-full";
  progressContainer.innerHTML = `
    <div class="w-full">
      <div class="flex justify-between mb-1 text-white">
        <span id="chart-progress-text" class="text-lg font-medium">Processing charts</span>
        <span id="chart-progress-count" class="text-lg font-medium">0/${totalCharts}</span>
      </div>
      <div class="w-full bg-gray-700 rounded-full h-2.5 mt-2">
        <div id="chart-progress-bar" class="backgroundGreen h-2.5 rounded-full" style="width: 0%"></div>
      </div>
    </div>
  `;

  const loadingContent =
    loadingModal.querySelector("#loadingApiInnerDiv") || loadingModal;
  loadingContent.appendChild(progressContainer);
}

function updateProgressUI(current, total) {
  const progressBar = document.getElementById("chart-progress-bar");
  const progressCount = document.getElementById("chart-progress-count");
  const progressText = document.getElementById("chart-progress-text");

  if (progressBar) {
    const progressPercent = Math.floor((current / total) * 100);
    progressBar.style.width = `${progressPercent}%`;
  }
  if (progressCount) progressCount.textContent = `${current}/${total}`;
  if (progressText) progressText.textContent = "Processing charts...";
}

function completeProgressUI(total) {
  const progressBar = document.getElementById("chart-progress-bar");
  const progressCount = document.getElementById("chart-progress-count");
  const progressText = document.getElementById("chart-progress-text");

  if (progressBar) progressBar.style.width = "100%";
  if (progressCount) progressCount.textContent = `${total}/${total}`;
  if (progressText) progressText.textContent = "Processing complete!";
}

/**
 * K12 chart ID to Quickbase field ID (table bumq5tt67).
 * Fields 8–22: base64_Students Average Enrollment … base64_Salaries & Benefits Teachers as percent of Net Tuition.
 */
const K12_CHART_MAPPINGS = [
  { chartId: "studentAverageEnrollment_chart", fieldId: 8 },
  { chartId: "studentFacilityRatio_chart", fieldId: 9 },
  { chartId: "expendableReserves_inDays_chart", fieldId: 10 },
  { chartId: "expendableReserves_Percent_chart", fieldId: 11 },
  { chartId: "liquidityRatio_chart", fieldId: 12 },
  { chartId: "daysCashOnHand_chart", fieldId: 13 },
  { chartId: "netTuitionARasPercentCurrentAssets_chart", fieldId: 14 },
  { chartId: "currentRatio_chart", fieldId: 15 },
  { chartId: "debtPerStudent_chart", fieldId: 16 },
  { chartId: "debtCoverage_chart", fieldId: 17 },
  { chartId: "debtToNetAssets_chart", fieldId: 18 },
  { chartId: "netIncomeRatio_chart", fieldId: 19 },
  { chartId: "grossTuition_chart", fieldId: 20 },
  { chartId: "financialAssistanceAsPercentTuitionAndFees_chart", fieldId: 21 },
  {
    chartId: "salariesBenefitsTeachersAsPercentNetTuition_SalariesAndBenefits_chart",
    fieldId: 22,
  },
];

/**
 * Main handler: export all K12 charts to base64 and send to Quickbase table bumq5tt67.
 */
async function apexChartsExportPrint() {
  if (typeof showApiLoadingFunction === "function") {
    showApiLoadingFunction("open", "print");
  }

  const printButton = document.getElementById("printBase64");
  if (!printButton) {
    console.error("Print button not found");
    if (typeof showApiLoadingFunction === "function") {
      showApiLoadingFunction("close", "print");
    }
    return;
  }

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
    const sectionIds = [
      "enrollmentContent",
      "cashContent",
      "netAssetsContent",
      "debtContent",
      "incomeContent",
      "expenseContent",
    ];
    const hiddenSections = [];
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el && el.classList.contains("hidden")) {
        el.classList.remove("hidden");
        hiddenSections.push(el);
      }
    });

    await new Promise((resolve) => setTimeout(resolve, 100));

    const validChartMappings = K12_CHART_MAPPINGS.filter(
      ({ chartId }) => document.getElementById(chartId) !== null
    );
    if (validChartMappings.length === 0) {
      throw new Error("No valid charts found to upload");
    }

    const results = await processChartsWithSpacing(K12_CHART_MAPPINGS);

    const successfulExports = results.filter((r) => r.base64String !== null)
      .length;
    if (successfulExports === 0) {
      throw new Error("No charts were successfully exported");
    }

    hiddenSections.forEach((el) => el.classList.add("hidden"));

    const uploadXml = buildUploadXml(results);

    const response = await sendToQuickbase(uploadXml);

    const xmlResponse = $(response);
    const errorCode = xmlResponse.find("qdbapi").find("errcode").text();

    if (typeof showApiLoadingFunction === "function") {
      showApiLoadingFunction("close", "print");
    }

    if (errorCode === "0") {
      if (typeof createToastSuccess === "function") {
        createToastSuccess(
          "The presentation will be sent to your email address in the next 5 minutes from clientportal@capincrouse.com. If you do not receive it, please email capindata@capincrouse.com for assistance.",
          true
        );
      }
    } else {
      const errorText =
        xmlResponse.find("qdbapi").find("errtext").text() || "Unknown error";
      throw new Error(`Quickbase returned error ${errorCode}: ${errorText}`);
    }
  } catch (error) {
    if (typeof showApiLoadingFunction === "function") {
      showApiLoadingFunction("close", "print");
    }
    console.error("Error in apexChartsExportPrint:", error);
    if (typeof createToastWarning === "function") {
      createToastWarning(
        `Error creating presentation: ${error.message || "Unknown error"}`
      );
    }
  } finally {
    printButton.disabled = false;
    printButton.innerHTML = originalButtonContent;

    const progressContainer = document.getElementById(
      "chart-progress-container"
    );
    if (progressContainer?.parentNode) {
      progressContainer.parentNode.removeChild(progressContainer);
    }
  }
}

/**
 * Build XML payload for API_AddRecord (table bumq5tt67).
 * Sends field 6 UniqueClientCount, 7 Client Name, 8–22 base64 chart images.
 * @param {Array<{ chartId: string, fieldId: number, base64String: string|null }>} results
 * @returns {string} XML string
 */
function buildUploadXml(results) {
  let uploadXml = `<qdbapi><apptoken>${K12_BASE64_APP_TOKEN}</apptoken>`;

  const uniqueClientCount =
    (typeof uniqueClients !== "undefined" && uniqueClients?.size) ||
    (document.getElementById("uniqueClients")?.textContent) ||
    0;
  let clientName = "";
  if (typeof firmName !== "undefined" && firmName != null) {
    clientName =
      firmName instanceof HTMLElement ? firmName.textContent : String(firmName);
  } else {
    const firmEl = document.getElementById("firmName");
    clientName = firmEl ? firmEl.textContent : "";
  }

  uploadXml += createFieldXml(6, uniqueClientCount);
  uploadXml += createFieldXml(7, clientName);

  results.forEach((result) => {
    if (result?.base64String) {
      uploadXml += createImageFieldXml(result.fieldId, result.base64String);
    }
  });

  uploadXml += "</qdbapi>";
  return uploadXml;
}

/**
 * @param {string|number} id - Field ID
 * @param {string|number} val - Value
 * @returns {string}
 */
function createFieldXml(id, val) {
  if (val === null || val === undefined || typeof val === "object") {
    return "";
  }
  const escapedVal = String(val)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
  return `<field fid='${id}'>${escapedVal}</field>`;
}

/**
 * @param {string|number} id - Field ID
 * @param {string} val - Base64 image data
 * @returns {string}
 */
function createImageFieldXml(id, val) {
  if (!val) return "";
  if (val.length > 1000000) return "";
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(val)) return "";
  const escapedVal = val
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
  return `<field fid='${id}' filename='chart.png'>${escapedVal}</field>`;
}

/**
 * Send record to Quickbase table bumq5tt67 (K12 base64 presentation table).
 * @param {string} xml - XML payload
 * @returns {Promise<object>} Response
 */
async function sendToQuickbase(xml) {
  try {
    const response = await $.ajax({
      type: "POST",
      contentType: "text/xml",
      url: `https://capincrouse.quickbase.com/db/${K12_BASE64_TABLE_ID}?a=API_AddRecord`,
      dataType: "xml",
      processData: false,
      data: xml,
      timeout: 60000,
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
 * Initialize Print Presentation button (id="printBase64").
 */
function initApexChartsPrintFunction() {
  const printButton = document.getElementById("printBase64");
  if (!printButton) return;

  const newPrintButton = printButton.cloneNode(true);
  printButton.parentNode.replaceChild(newPrintButton, printButton);
  newPrintButton.addEventListener("click", () => {
    apexChartsExportPrint();
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApexChartsPrintFunction);
} else {
  initApexChartsPrintFunction();
}
