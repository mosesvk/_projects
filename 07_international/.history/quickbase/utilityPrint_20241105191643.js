const uploadFileBegin = `<qdbapi> <apptoken>bpat4pgu9t69yby5gbemdbej52j</apptoken>`;
const uploadFileEnd = `</qdbapi>`;
const uploadClist = `<clist>171</clist>`;
const generateReportsBtn = document.getElementById("generateReports");
let uploadMainFile = "";

$("#downloadPdf").on("click", function () {
  let imagesArray = [];

  for (i = 0; i < selectedImagesArray.length; i++) {
    let element = document.getElementById(selectedImagesArray[i].toString());
    //console.log(element)
    let img = element.toDataURL("image/pdf");
    //console.log(img)
    let a = document.createElement("a");
    a.href = img;
    a.download = img.toString();
    let doc = new jsPDF();
    doc.addImage(img, "png", 15, 40, 180, 160);
    doc.save();

    //document.body.appendChild(doc);
    //a.click()
    //document.body.removeChild(a)
  }
});

const downloadImage = (elem) => {
  // console.log(elem);
  // console.log("hit before");
  const element = document.getElementById(elem);
  let image = element.toDataURL("image/png");
  // console.log("hit after");

  let a = document.createElement("a");
  a.name = element.id;
  a.href = image;
  console.dir(element);
  //a.download = image.toString();
  a.download = element.id;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

$("#printOptionsBtn").on("click", function () {
  let imagesArray = [];
  const reportTables = [
    "data-tableDemo",
    "data-tableCash",
    "data-tableDebt",
    "data-tableIncome",
    "data-tableExpense",
  ];

  for (i = 0; i < selectedImagesArray.length; i++) {
    let selectImg = selectedImagesArray[i];
    let table = selectedImagesArray[i];
    let element;

    if (reportTables.includes(selectImg)) {
      $(`#${table} .google-visualization-table`).printThis({
        importCSS: true, // option
      });
    } else {
      element = selectedImagesArray[i];

      downloadImage(element);
    }
  }
});

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
    avgArray.map((item) => item / 100);
    midArray.map((item) => item / 100);
    minArray.map((item) => item / 100);
    MaxArray.map((item) => item / 100);
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
    } // if weighted
  } else {
    avgVal = weighted ? avgArray[0] : Math.round(average(avgArray));
  } // if fixed

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
}; //dataArrayObjects

function uploadToFile(avg, mid, min, max, fIdArray, begin, end) {
  // console.log({ avg, mid, min, max, num, begin, end });

  let avgId = fIdArray[0];
  var avgVal = avg;
  let midId = fIdArray[2];
  var midVal = mid;
  let minId = fIdArray[1];
  var minVal = min;
  let maxId = fIdArray[3];
  var maxVal = max;

  if (begin)
    uploadMainFile +=
      "<qdbapi><apptoken>bpat4pgu9t69yby5gbemdbej52j</apptoken>";

  uploadMainFile += `<field fid='${avgId}'>${avgVal}</field><field fid='${midId}'>${midVal}</field><field fid='${minId}'>${minVal}</field><field fid='${maxId}'>${maxVal}</field>`;
} //uploadToFile

function uploadSingleToFile(id, val, end) {
  uploadMainFile += `<field fid='${id}'>${val}</field>`;

  if (end) uploadMainFile += uploadClist;

  if (end) uploadMainFile += "</qdbapi>";
}

const printToExcel = (dataString) => {
  toggleButtonLoadingState(generateReportsBtn);

  dataParseExcelString = dataString;

  var urlUploadFile =
    "https://capincrouse.quickbase.com/db/bt76haf6m?a=API_AddRecord";

  // console.log(dataString);

  let newRecordID;

  $.ajax({
    type: "POST",
    contentType: "text/xml",
    async: true,
    url: urlUploadFile,
    dataType: "xml",
    processData: false,
    data: dataString,
    success: function (response) {
      var xmlUpload = $(response);
      // console.log(response);
      // console.log(xmlUpload);
      newRecordID = xmlUpload[0].all[4].innerHTML;
      console.log(newRecordID)

      if (xmlUpload.find("qdbapi").find("errcode").text() == "0") {
        newDownloadURL = xmlUpload
          .find("qdbapi")
          .find("record")
          .find("f")
          .text();
        newDownloadURLFormatted = newDownloadURL.replace(/amp;/g, "");
        newDownloadURLFormattedArray = newDownloadURLFormatted.split("---");
        console.log({ newDownloadURLFormattedArray });
        
          document.getElementById('print_modal_footer').classList.remove('hidden');
          document.getElementById("trendXLSFinal").href =
            newDownloadURLFormattedArray[1];
          document.getElementById("trendPDFFinal").href =
            newDownloadURLFormattedArray[0];
          document.getElementById("benchXLSFinal").href =
            newDownloadURLFormattedArray[3];
          document.getElementById("benchPDFFinal").href =
            newDownloadURLFormattedArray[2];
      } else {
        console.log("Quickbase returned an error.");
        createToastWarning(
          `Quickbase returned an error: if (xmlUpload.find("qdbapi").find("errcode").text() == "0")`
        );
      }
    },
    error: function (err) {
      // console.log("Quickbase returned an error: " + response);
      console.log(err);
      createToastWarning(`Quickbase returned an error: ${err}`);
    },
  }); //end ajax call
}; // printToExcel()

const createPrintExcel = () => {
  uploadSingleToFile(171, ClientRid);
  uploadSingleToFile(170, firmName);
  uploadSingleToFile(169, uniqueClients.size);
  uploadSingleToFile(163, sliderValue);
  uploadSingleToFile(164, sliderValue2);
  // uploadSingleToFile(164, sliderValue2);

  let yearLength = selectedYears_Set.size;
  let j = 158;

  let index = 0;
  for (let year of selectedYears_Set) {
    if (index === yearLength - 1) {
      uploadSingleToFile(j, year, "end");
    } else {
      uploadSingleToFile(j, year);
    }
    j++;
    index++;
  }

  toggleButtonLoadingState(generateReportsBtn);
  setTimeout(() => {
    printToExcel(uploadMainFile); // Main Function
    toggleGenerateReportButtonNormalState(generateReportsBtn);
    document.getElementById("print_modal_footer").classList.remove("hidden");
  }, 1500); //setTimeout
};

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
  // console.log({ name, fId, begin, end, avg, mid, min, max, peer, data });

  uploadToFile(avg, mid, min, max, fIdArray, begin, end);
};

document.getElementById("generateReports").addEventListener("click", () => {
  // extract data from the table

  if (!localStorage.generalData) {
    createToastWarning(
      "No Data Retrieved. Make sure to select years and run the report"
    );
    throw new Error("No Data Retrieved.");
  } else {
    createPrintExcel();
  }
});
