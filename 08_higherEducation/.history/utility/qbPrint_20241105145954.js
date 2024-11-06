const urlUploadFile =
  "https://capincrouse.quickbase.com/db/buk93bd7x?a=API_AddRecord";
let uploadMainFile = "";
const printButton = document.getElementById("printCharts");

async function svgToPngBase64(element, id) {
  try {
    // Use html2canvas to render the element to a canvas
    const canvas = await html2canvas(element);

    // Get the base64 string from the canvas
    const base64String = canvas.toDataURL("image/png").split(",")[1];

    console.log({ base64String });
    

    // Store the result in map_dataUri
    map_dataUri.set(id, base64String);

    return base64String; // Return the base64 string
  } catch (error) {
    console.error("Error rendering the SVG to PNG:", error);
    throw error; // In case of error, reject the promise
  }
}

function uploadSingleToFile(id, val) {
  uploadMainFile += `<field fid='${id}' filename='image.png'>${val}</field>`;
}

const getPngString = async (id, fieldId) => {
  try {
    const element = document.getElementById(id);
    const idx = id.replace("_Chart", "");

    // Await the base64 conversion
    const base64String = await svgToPngBase64(element, idx);

    // Upload the base64 string
    uploadSingleToFile(fieldId, base64String);
  } catch (error) {
    console.error("Error in getPngString:", error);
  }
};

const mainPrint = async () => {
  showApiLoadingFunction("open", "print");
  document.getElementById("FinancialPositionContent").classList.remove("hidden");
  document.getElementById("RevenueAndExpenseContent").classList.remove("hidden");
  document.getElementById("DebtAndEndowmentContent").classList.remove("hidden");

  uploadMainFile += "<qdbapi><apptoken>c3qhvhmcgbwze7hwbiavcm3hnmc</apptoken>";
  uploadSingleToFile(31, clientName);
  uploadSingleToFile(32, uniqueClients.size);

  await getPngString("cfiRatio_chart", 6);
  await getPngString("cfi_primaryReserveRatio_chart", 7);
  await getPngString("cfi_netIncomeOperationsRatio_chart", 8);
  await getPngString("cfi_returnOnNetAssets_chart", 10);
  await getPngString("cfi_viabilityRatio_chart", 11);
  await getPngString("FinancialPosition_chart", 12);
  await getPngString("assetToLiabilities_chart", 13);
  await getPngString("sourceOfIncomeClient_chart", 14);
  await getPngString("sourceOfIncomePeer_chart", 15);
  await getPngString("ffa_chart", 16);
  await getPngString("cashFlowsTrend_chart",17);
  await getPngString("currentRatio_chart", 18);
  await getPngString("salariesBenefitsToTotalExpense_chart", 19);
  await getPngString("salariesBenefitsPerNetTuition_chart", 20);
  // await getPngString("adminCostsPerStudent_chart", 21);
  await getPngString("netEducationalExpensePerStudent_chart", 22);
  await getPngString("annualTraditionalNetTuitionPerStudent_chart", 23);
  await getPngString("tuitionDependency_chart", 24);
  await getPngString("tuitionDiscountRate_chart", 25);
  await getPngString("ltDebtPerTotalOperatingRevenue_chart", 26);
  await getPngString("debtServiceCoverageRatio_chart", 27);
  await getPngString("debtBurdenRatio_chart", 28);
  await getPngString("endowmentOperatingBudget_chart", 29);
  await getPngString("endowmentAssetsPerStudent_chart", 30);

  uploadMainFile += "</qdbapi>";

  console.log({ uploadMainFile });

  $.ajax({
    type: "POST",
    contentType: "text/xml",
    async: true,
    url: urlUploadFile,
    dataType: "xml",
    processData: false,
    data: uploadMainFile,
    success: function (response) {
      var xmlUpload = $(response);
      //   console.log(response);
      //   console.log(xmlUpload);
      newRecordID = xmlUpload[0].all[4].innerHTML;
      //console.log(newRecordID)

      if (xmlUpload.find("qdbapi").find("errcode").text() == "0") {
        newDownloadURL = xmlUpload
          .find("qdbapi")
          .find("record")
          .find("f")
          .text();

        createToastSuccess(
          "Printed successfully uploaded to Quickbase."
        );
      } else {
        console.log("Quickbase returned an error.");
        createToastWarning(
          `Quickbase returned an error: if (xmlUpload.find("qdbapi").find("errcode").text() == "0")`
        );
      }
    },
    error: function (err) {
      // console.log("Quickbase returned an error: " + response);
      showApiLoadingFunction("close", "print");
      console.log(err);
      createToastWarning(`Quickbase returned an error: ${err}`);
    },
  }); //end ajax call
  document.getElementById("FinancialPositionContent").classList.add("hidden");
  document.getElementById("RevenueAndExpenseContent").classList.add("hidden");
  document.getElementById("DebtAndEndowmentContent").classList.add("hidden");
  showApiLoadingFunction("close", "print");
};

printButton.addEventListener("click", mainPrint); //uploadToFile
