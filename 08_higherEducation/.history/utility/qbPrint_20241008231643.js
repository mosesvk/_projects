const urlUploadFile =
  "https://capincrouse.quickbase.com/db/bub5a8w2g?a=API_AddRecord";
let uploadMainFile = "";
const printButton = document.getElementById("printCharts");

async function svgToPngBase64(element, id) {
  return new Promise((resolve, reject) => {
    let canvasElement = document.createElement("canvas");
    canvasElement.id = "canvas";
    document.body.appendChild(canvasElement);

    html2canvas(element).then(function (canvas) {
      let picture = document.getElementById("canvas").appendChild(canvas);
      let base64String = canvas.toDataURL("image/png");
      const exportString = base64String.slice("data:image/png;base64,".length);
      map_dataUri.set(id, exportString);
      picture.remove();
      //   console.log("exportString", exportString);
      resolve(exportString); // Resolve the promise with the exportString
    });
  });
}

const getPngString = async (id, fieldId) => {
  const element = document.getElementById(id);
  const idx = id.replace("_Chart", "");
  //   console.log({ element, idx });
  const string = await svgToPngBase64(element, idx);
  //   console.log("string", string);

  uploadSingleToFile(fieldId, string);
};

const mainPrint = async () => {
  showApiLoadingFunction("open", "print");

  uploadMainFile += "<qdbapi><apptoken>bpat4pgu9t69yby5gbemdbej52j</apptoken>";
  const totalTasks = 12; // Total number of calls to getPngString
  let completedTasks = 0;

  const updateProgress = () => {
    completedTasks++;
    const percentage = Math.round((completedTasks / totalTasks) * 100);
    // Assuming you have an element to show the percentage
    document.getElementById('loadingPercentage').textContent = `${percentage}%`;
    // You can also update a progress bar if you have one
    document.getElementById('progressBar').style.width = `${percentage}%`;
  };

  // Array of chart identifiers
  const charts = [
    "cfiRatio_chart",
    "cfi_primaryReserveRatio_chart",
    "cfi_netIncomeOperationsRatio_chart",
    "cfi_returnOnNetAssets_chart",
    "cfi_viabilityRatio_chart",
    "FinancialPosition_chart",
    "assetToLiabilities_chart",
    "sourceOfIncomeClient_chart",
    "sourceOfIncomePeer_chart",
    "ffa_chart",
    "cashFlowsTrend_chart",
    "currentRatio_chart",
    "salariesBenefitsToTotalExpense_chart",
  ];

  // Using Promise.all to manage all calls
  await Promise.all(charts.map((chart, index) =>
    getPngString(chart, index + 6).then(updateProgress)
  ));

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
      newRecordID = xmlUpload[0].all[4].innerHTML;

      if (xmlUpload.find("qdbapi").find("errcode").text() == "0") {
        newDownloadURL = xmlUpload
          .find("qdbapi")
          .find("record")
          .find("f")
          .text();
        createToastSuccess('Successfully uploaded to Quickbase');
      } else {
        console.log("Quickbase returned an error.");
        createToastWarning(`Quickbase returned an error: ${xmlUpload.find("qdbapi").find("errcode").text()}`);
      }
    },
    error: function (err) {
      showApiLoadingFunction("close", "print");
      console.log(err);
      createToastWarning(`Quickbase returned an error: ${err}`);
    },
  }); //end ajax call

  showApiLoadingFunction("close", "print");
};


function uploadSingleToFile(id, val) {
  uploadMainFile += `<field fid='${id}'>${val}</field>`;
}

printButton.addEventListener("click", mainPrint); //uploadToFile
