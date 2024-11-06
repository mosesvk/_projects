const uploadFileBegin = `bpat4pgu9t69yby5gbemdbej52j`;
const uploadFileEnd = ``;
const uploadClist = `171`;
const generateReportsBtn = document.getElementById("generateReports");
let uploadMainFile = "";

const downloadPdf = () => {
  selectedImagesArray.forEach((imageId) => {
    const element = document.getElementById(imageId.toString());
    const img = element.toDataURL("image/pdf");
    const doc = new jsPDF();
    doc.addImage(img, "png", 15, 40, 180, 160);
    doc.save();
  });
};

$("#downloadPdf").on("click", downloadPdf);

const downloadImage = (elem) => {
  const element = document.getElementById(elem);
  const image = element.toDataURL("image/png");
  const a = document.createElement("a");
  a.name = element.id;
  a.href = image;
  a.download = element.id;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

const printOptions = () => {
  const reportTables = [
    "data-tableDemo",
    "data-tableCash",
    "data-tableDebt",
    "data-tableIncome",
    "data-tableExpense",
  ];

  selectedImagesArray.forEach((selectImg) => {
    if (reportTables.includes(selectImg)) {
      $(`#${selectImg} .google-visualization-table`).printThis({
        importCSS: true,
      });
    } else {
      downloadImage(selectImg);
    }
  });
};

$("#printOptionsBtn").on("click", printOptions);

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

  const formatValue = (array, fixed, num) => {
    if (fixed) {
      let str = "";
      const arr = String(array);
      for (let i = 0; i <= num + 1; i++) {
        str += arr[i];
      }
      return str;
    }
    return weighted ? array : Math.round(average(array));
  };

  const avgVal = formatValue(avgArray, fixed, num);
  const midVal = fixed ? median(midArray, "fixed", num) : median(midArray);
  const minVal = fixed
    ? Math.min(...minArray).toFixed(num)
    : Math.min(...minArray);
  const maxVal = fixed
    ? Math.max(...MaxArray).toFixed(num)
    : Math.max(...MaxArray);

  return {
    avg: avgVal,
    mid: midVal,
    min: minVal,
    max: maxVal,
  };
};

const uploadToFile = (avg, mid, min, max, fIdArray, begin, end) => {
  if (begin) uploadMainFile += uploadFileBegin;
  uploadMainFile += `${avg}${mid}${min}${max}`;
};

const uploadSingleToFile = (id, val, end) => {
  uploadMainFile += `${val}`;
  if (end) uploadMainFile += uploadClist + uploadFileEnd;
};

const printToExcel = (dataString) => {
  toggleButtonLoadingState(generateReportsBtn);

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
    success: (response) => {
      const xmlUpload = $(response);
      const newRecordID = xmlUpload.all.innerHTML;

      if (xmlUpload.find("qdbapi").find("errcode").text() == "0") {
        const newDownloadURL = xmlUpload.find("qdbapi").find("record").find("f").text();
      } else {
        createToastWarning(`Quickbase returned an error.`);
      }
    },
    error: (err) => {
      createToastWarning(`Quickbase returned an error: ${err}`);
    },
  });
};

const createPrintExcel = () => {
  uploadSingleToFile(171, ClientRid);
  uploadSingleToFile(170, firmName);
  uploadSingleToFile(169, uniqueClients.size);
  uploadSingleToFile(163, sliderValue);
  uploadSingleToFile(164, sliderValue2);

  let yearLength = selectedYears_Set.size;
  let j = 158;

  selectedYears_Set.forEach((year, index) => {
    if (index === yearLength - 1) {
      uploadSingleToFile(j, year, "end");
    } else {
      uploadSingleToFile(j, year);
    }
    j++;
  });

  toggleButtonLoadingState(generateReportsBtn);
  setTimeout(() => {
    printToExcel(uploadMainFile);
    toggleGenerateReportButtonNormalState(generateReportsBtn);
    document.getElementById("print_modal_footer").classList.remove("hidden");
  }, 1500);
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
  uploadToFile(avg, mid, min, max, fIdArray, begin, end);
};

generateReportsBtn.addEventListener("click", () => {
  if (!localStorage.generalData) {
    createToastWarning("No Data Retrieved. Make sure to select years and run the report");
    throw new Error("No Data Retrieved.");
  } else {
    createPrintExcel();
  }
});