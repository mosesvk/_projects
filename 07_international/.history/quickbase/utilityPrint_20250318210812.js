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
      console.log(err);
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

// PRESENTATION [BASE64] -----------------------------------------------------------------------------

// Convert SVG to PNG Base64
async function svgToPngBase64(element, id) {
  try {
    if (!element) {
      console.error(`Element for ${id} is null or undefined`);
      return null;
    }

    // Add a small timeout to let the UI thread breathe
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Use html2canvas with improved options
    const canvas = await html2canvas(element, {
      allowTaint: true,
      useCORS: true,
      logging: false,
      scale: 2, // Higher quality
    });

    if (!canvas) {
      throw new Error("Canvas rendering failed");
    }

    // Get the base64 string from the canvas
    const base64String = canvas.toDataURL("image/png").split(",")[1];

    if (!base64String) {
      throw new Error("Failed to generate base64 string from canvas");
    }

    // Store the result in map_dataUri
    map_dataUri.set(id, base64String);

    return base64String;
  } catch (error) {
    console.error(`Error rendering element with ID ${id} to PNG:`, error);
    return null;
  }
}

// Upload single presentation to file
function uploadSinglePresentationToFile(id, val) {
  if (val === null || val === undefined) {
    console.warn(`Skipping upload for field ${id} due to null/undefined value`);
    return "";
  }
  return `<field fid='${id}' filename='image.png'>${val}</field>`;
}

// Main print function
const mainPrint = async () => {
  let uploadPresentationFile = "";

  try {
    // Start the loading spinner
    toggleButtonLoadingState(printButton);

    // Show all content sections for printing at once (reduces reflows)
    const sections = [
      "cashContent",
      "netAssetsContent",
      "incomeContent",
      "expenseContent",
    ];
    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) element.classList.remove("hidden");
    });

    // Wait a moment for DOM to update
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Initialize the XML request
    uploadPresentationFile =
      "<qdbapi><apptoken>c3qhvhmcgbwze7hwbiavcm3hnmc</apptoken>";

    // Upload metadata first (simple operations)
    uploadPresentationFile += uploadSinglePresentationToFile(171, ClientRid);
    uploadPresentationFile += uploadSinglePresentationToFile(170, firmName);
    uploadPresentationFile += uploadSinglePresentationToFile(
      169,
      uniqueClients.size
    );
    uploadPresentationFile += uploadSinglePresentationToFile(163, sliderValue);
    uploadPresentationFile += uploadSinglePresentationToFile(164, sliderValue2);

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

    // Process charts in batches to prevent UI blocking
    const batchSize = 3; // Process 3 charts at a time
    for (let i = 0; i < chartMappings.length; i += batchSize) {
      // Give the UI thread a chance to breathe between batches
      if (i > 0) {
        await new Promise((resolve) => setTimeout(resolve, 20));
      }

      // Process a batch of charts in parallel
      const batch = chartMappings.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(async ({ chartId, fieldId }) => {
          try {
            const element = document.getElementById(chartId);
            if (!element) {
              console.warn(`Element with ID ${chartId} not found`);
              return { fieldId, base64String: null };
            }

            const idx = chartId.replace("_chart", "");
            const base64String = await svgToPngBase64(element, idx);
            return { fieldId, base64String };
          } catch (error) {
            console.error(`Error processing chart ${chartId}:`, error);
            return { fieldId, base64String: null };
          }
        })
      );

      // Add successful results to the upload file
      batchResults.forEach((result) => {
        if (result && result.base64String) {
          uploadPresentationFile += uploadSinglePresentationToFile(
            result.fieldId,
            result.base64String
          );
        }
      });
    }

    uploadPresentationFile += "</qdbapi>";

    // Final API request
    const response = await new Promise((resolve, reject) => {
      $.ajax({
        type: "POST",
        contentType: "text/xml",
        async: true,
        url: "https://capincrouse.quickbase.com/db/bumq5qw5e?a=API_AddRecord",
        dataType: "xml",
        processData: false,
        data: uploadPresentationFile,
        success: resolve,
        error: reject,
      });
    });

    // Process response
    const xmlUpload = $(response);
    if (xmlUpload.find("qdbapi").find("errcode").text() == "0") {
      createToastSuccess(
        "Presentation Charts successfully uploaded to Quickbase."
      );
    } else {
      createToastWarning(
        `Quickbase returned an error: ${
          xmlUpload.find("qdbapi").find("errtext").text() || "Unknown error"
        }`
      );
    }
  } catch (error) {
    console.error("Error in mainPrint:", error);
    createToastWarning(
      "Error creating presentation: " +
        (error.statusText || error.message || "Unknown error")
    );
  } finally {
    // Always hide sections and reset button state
    const sections = [
      "cashContent",
      "netAssetsContent",
      "incomeContent",
      "expenseContent",
    ];
    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) element.classList.add("hidden");
    });

    togglePrintPresentationButtonNormalState(printButton);
  }
};

// Print button event listener
printButton.addEventListener("click", () => {
  mainPrint();
});
