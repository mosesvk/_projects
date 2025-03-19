
const uploadFileBegin = `<qdbapi><apptoken>bpat4pgu9t69yby5gbemdbej52j</apptoken>`;
const uploadFileEnd = `</qdbapi>`;
const uploadClist = `<clist>171</clist>`;
const generateReportsBtn = document.getElementById("generateReports");
const printButton = document.getElementById("printBase64");
let uploadMainFile = "";
let uploadPresentationFile = "";

// PDF download functionality
$("#downloadPdf").on("click", function() {
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
$("#printOptionsBtn").on("click", function() {
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
  const urlUploadFile = "https://capincrouse.quickbase.com/db/bt76haf6m?a=API_AddRecord";

  $.ajax({
    type: "POST",
    contentType: "text/xml",
    async: true,
    url: urlUploadFile,
    dataType: "xml",
    processData: false,
    data: dataString,
    success: function(response) {
      const xmlUpload = $(response);
      const newRecordID = xmlUpload[0].all[4].innerHTML;
      
      if (xmlUpload.find("qdbapi").find("errcode").text() == "0") {
        const recordId = xmlUpload.find("qdbapi").find("rid").text();
        
        createToastSuccess("Generated Reports successfully to Quickbase.");
        
        document.getElementById("print_modal_footer").classList.remove("hidden");
        document.getElementById("trendXLSFinal").href = getUrlBasedOnYearCount("xls", recordId);
        document.getElementById("trendPDFFinal").href = getUrlBasedOnYearCount("pdf", recordId);
      } else {
        console.log("Quickbase returned an error.");
        createToastWarning(`Quickbase returned an error: if (xmlUpload.find("qdbapi").find("errcode").text() == "0")`);
      }
    },
    error: function(err) {
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
    createToastWarning("No Data Retrieved. Make sure to select years and run the report");
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
      throw new Error("Element is null or undefined");
    }

    // Use html2canvas to render the element to a canvas
    const canvas = await html2canvas(element);

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
    console.error("Error rendering the SVG to PNG:", error);
    console.error("Element:", element);
    console.error("ID:", id);
    throw error;
  }
}

// Upload single presentation to file
function uploadSinglePresentationToFile(id, val) {
  uploadPresentationFile += `<field fid='${id}' filename='image.png'>${val}</field>`;
}

// Get PNG string
const getPngString = async (id, fieldId) => {
  try {
    const element = document.getElementById(id);
    
    if (!element) {
      console.error(`Element with ID ${id} not found`);
      return;
    }
    
    const idx = id.replace("_chart", "");

    // Await the base64 conversion
    const base64String = await svgToPngBase64(element, idx);

    // Upload the base64 string
    uploadSinglePresentationToFile(fieldId, base64String);
  } catch (error) {
    console.error(`Error in getPngString for ${id}:`, error);
  }
};

// Main print function
const mainPrint = async () => {
  try {
    showApiLoadingFunction("open", "print");
    
    // Show all content sections for printing
    document.getElementById("cashContent").classList.remove("hidden");
    document.getElementById("netAssetsContent").classList.remove("hidden");
    document.getElementById("incomeContent").classList.remove("hidden");
    document.getElementById("expenseContent").classList.remove("hidden");

    uploadPresentationFile = "<qdbapi><apptoken>c3qhvhmcgbwze7hwbiavcm3hnmc</apptoken>";

    // Upload metadata
    uploadSinglePresentationToFile(171, ClientRid);
    uploadSinglePresentationToFile(170, firmName);
    uploadSinglePresentationToFile(169, uniqueClients.size);
    uploadSinglePresentationToFile(163, sliderValue);
    uploadSinglePresentationToFile(164, sliderValue2);
    
    // Upload charts as PNG base64
    await getPngString("statementCashFlows_chart", 8);
    await getPngString("daysCashOnHand_chart", 9);
    await getPngString("daysExpensesInUnrestrictedNA_chart", 10);
    await getPngString("daysExpensesInUnrestrictedNA_excludingPPE_chart", 11);
    await getPngString("totalCoverageRatio_chart", 12);
    await getPngString("contributionsTrend_chart", 13);
    await getPngString("annualizedInvestmentReturn_chart", 14);
    await getPngString("functionalExpensePercent_program_chart", 15);
    await getPngString("functionalExpensePercent_administrative_chart", 16);
    await getPngString("functionalExpensePercent_fundraising_chart", 17);
    await getPngString("costOfContributions_chart", 18);
    await getPngString("netAssetBreakdown_chart", 25);
    await getPngString("changeInNetAssets_chart", 26);
    await getPngString("liquidityAssetsAvailableCover_chart", 27);
    await getPngString("assetsWithoutPpeToLiabilitiesWithoutDebt_chart", 28);
    await getPngString("totalContributions_chart", 29);
    await getPngString("contributionsWithoutDR_chart", 30);
    await getPngString("functionalAllocation_chart", 31);
    await getPngString("costOfContributionsDetailView_chart", 32);

    uploadPresentationFile += "</qdbapi>";

    // Send the data to the server
    $.ajax({
      type: "POST",
      contentType: "text/xml",
      async: true,
      url: "https://capincrouse.quickbase.com/db/bumq5qw5e?a=API_AddRecord",
      dataType: "xml",
      processData: false,
      data: uploadPresentationFile,
      success: function(response) {
        const xmlUpload = $(response);
        
        if (xmlUpload.find("qdbapi").find("errcode").text() == "0") {
          createToastSuccess("Presentation Charts successfully uploaded to Quickbase.");
        } else {
          console.log("Quickbase returned an error.");
          createToastWarning(`Quickbase returned an error: if (xmlUpload.find("qdbapi").find("errcode").text() == "0")`);
        }
      },
      error: function(err) {
        console.log(err);
        createToastWarning(`Quickbase returned an error: ${err}`);
      },
      complete: function() {
        // Hide content sections after printing
        document.getElementById("cashContent").classList.add("hidden");
        document.getElementById("netAssetsContent").classList.add("hidden");
        document.getElementById("incomeContent").classList.add("hidden");
        document.getElementById("expenseContent").classList.add("hidden");
        
        togglePrintPresentationButtonNormalState(printButton);
        showApiLoadingFunction("close", "print");
      }
    });
  } catch (error) {
    console.error("Error in mainPrint:", error);
    createToastWarning("Error creating presentation: " + error.message);
    
    // Ensure content is hidden and button is reset even if there's an error
    document.getElementById("cashContent").classList.add("hidden");
    document.getElementById("netAssetsContent").classList.add("hidden");
    document.getElementById("incomeContent").classList.add("hidden");
    document.getElementById("expenseContent").classList.add("hidden");
    
    togglePrintPresentationButtonNormalState(printButton);
    showApiLoadingFunction("close", "print");
  }
};

// Print button event listener
printButton.addEventListener("click", () => {
  toggleButtonLoadingState(printButton);
  mainPrint();
});