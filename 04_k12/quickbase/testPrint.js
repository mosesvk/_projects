// ----------------------------------- UPDATE CHART FUNCTION ----------------------------------------------->

// -------------- Variables ---------->
let tableAttendToStaff = document.getElementById("table-body-attendToStaff");
let tableGivingUnits = document.getElementById("table-body-givingUnits");

let tableDebtToContributionsWithout = document.getElementById(
  "table-body-debtToContributionsWithout"
);
let tableCurrentRatio = document.getElementById("table-body-currentRatio");
let tableMandatoryDebtService = document.getElementById(
  "table-body-mandatoryDebtService"
);
let tableDebtPerGivingUnit = document.getElementById(
  "table-body-debtPerGivingUnit"
);
let tableDebtCoverage = document.getElementById("table-body-debtCoverage");
let tableNetIncome = document.getElementById("table-body-netIncome");
let tableContrWithoutPerAvgAttAndGU = document.getElementById(
  "table-body-contrWithoutPerAvgAttAndGU"
);
let tableContrPerAvgAttAndGU = document.getElementById(
  "table-body-contrPerAvgAttAndGU"
);
let tableMedianIncome = document.getElementById("table-body-medianIncome");
let tableBenefitsToSalaries = document.getElementById(
  "table-body-benefitsToSalaries"
);
let tableAvgSBperFTE = document.getElementById("table-body-avgSBperFTE");
let tableBenefitsSalariesTotal = document.getElementById(
  "table-body-benefitsSalariesTotal"
);
let tablePersonnelMandatoryDebtService = document.getElementById(
  "table-body-personnelMandatoryDebtService"
);
let tablePersonnelInclude = document.getElementById(
  "table-body-personnelInclude"
);
let tableMissionCategories = document.getElementById(
  "table-body-missionCategories"
);
let tableTotalCashExpendExcludePerGU = document.getElementById(
  "table-body-totalCashExpendExcludePerGU"
);

const emptyTableCharts = () => {
  $("#table-body-attendToStaff").empty();
  $("#table-body-givingUnits").empty();
  $("#table-body-daysExpendable").empty();
  $("#table-body-daysOperatingCash").empty();
  $("#table-body-availableDaysCash").empty();
  $("#table-body-liquidityRatio").empty();

  $("#table-body-debtToContributionsWithout").empty();
  $("#table-body-currentRatio").empty();
  $("#table-body-mandatoryDebtService").empty();
  $("#table-body-debtPerAvgAdultAttendGivingUnit").empty();
  $("#table-body-debtCoverage").empty();
  $("#table-body-netIncome").empty();
  $("#table-body-contrWithoutPerAvgAttAndGU").empty();
  $("#table-body-contrPerAvgAttAndGU").empty();
  $("#table-body-medianIncome").empty();
  $("#table-body-benefitsToSalaries").empty();
  $("#table-body-avgSBperFTE").empty();
  $("#table-body-benefitsSalariesTotal").empty();
  $("#table-body-personnelMandatoryDebtService").empty();
  $("#table-body-personnelInclude").empty();
  $("#table-body-missionCategories").empty();
  $("#table-body-totalCashExpendExcludePerGU").empty();
};

// MAIN CHARTUPDATE FUNCTION

const updateYearChart = () => {
  emptyTableCharts(); // Function above

  let array = yearDropdown.children;

  // ------------ CONNECTIONS TO OTHER JS FILES ------------------------>
  drawChart(); // ---> Function-Draw-Main (72) --- implementing google data visualization chart

  display_Accordion(); // displays all of the accordions in one function
  accordionDemo(); // ---> accordion_Demo.js
  accordionCash();
  accordionDebt();
  accordionIncome();
  accordionExpense();

  //let trHeaderDemo = document.getElementById('tr-header-demo')
  //let trHeaderDemoArray = null

  // <------ updating MyChart --->
  myChart.data.labels = selectedYearArray;
  myChart.data.datasets[0].data = tableGivingUnitsClientArray;
  myChart.data.datasets[1].data = tableGivingUnitsAvgYearArray;
  myChart.data.datasets[2].data = tableGivingUnitsMidYearArray;
  myChart.data.datasets[3].data = tableGivingUnitsMinArray;
  myChart.data.datasets[4].data = tableGivingUnitsMaxArray;

  // <------ updating MyChart2 --->
  myChart2.data.labels = selectedYearArray;
  myChart2.data.datasets[0].data = tableAttendToStaffClientArray;
  myChart2.data.datasets[1].data = tableAttendToStaffAvgYearArray;
  myChart2.data.datasets[2].data = tableAttendToStaffMidYearArray;
  myChart2.data.datasets[3].data = tableAttendToStaffMinArray;
  myChart2.data.datasets[4].data = tableAttendToStaffMaxArray;

  // ----------- CASH CHART UPDATE

  // ----- chartDaysExpendable ---->
  chartDaysExpendable.data.labels = selectedYearArray;
  chartDaysExpendable.data.datasets[0].data = tableDaysExpendableClientArray;
  chartDaysExpendable.data.datasets[1].data = tableDaysExpendableAvgYearArray;
  chartDaysExpendable.data.datasets[2].data = tableDaysExpendableMidYearArray;
  chartDaysExpendable.data.datasets[3].data = tableDaysExpendableMinArray;
  chartDaysExpendable.data.datasets[4].data = tableDaysExpendableMaxArray;

  // ----- chartDaysOperatingCash ---->
  chartDaysOperatingCash.data.labels = selectedYearArray;
  chartDaysOperatingCash.data.datasets[0].data =
    tableChartDaysOperatingCashClientArray;
  chartDaysOperatingCash.data.datasets[1].data =
    tableDaysOperatingCashAvgYearArray;
  chartDaysOperatingCash.data.datasets[2].data =
    tableDaysOperatingCashMidYearArray;
  chartDaysOperatingCash.data.datasets[3].data = tableDaysOperatingCashMinArray;
  chartDaysOperatingCash.data.datasets[4].data = tableDaysOperatingCashMaxArray;

  // ----- chartAvailableDaysCash ---->
  chartAvailableDaysCash.data.labels = selectedYearArray;
  chartAvailableDaysCash.data.datasets[0].data =
    tableChartAvailableDaysCashClientArray;
  chartAvailableDaysCash.data.datasets[1].data =
    tableAvailableDaysCashAvgYearArray;
  chartAvailableDaysCash.data.datasets[2].data =
    tableAvailableDaysCashMidYearArray;
  chartAvailableDaysCash.data.datasets[3].data = tableAvailableDaysCashMinArray;
  chartAvailableDaysCash.data.datasets[4].data = tableAvailableDaysCashMaxArray;

  // ----- chartLiquidityRatio ---->
  chartLiquidityRatio.data.labels = selectedYearArray;
  chartLiquidityRatio.data.datasets[0].data = tableLiquidityRatioClientArray;
  chartLiquidityRatio.data.datasets[1].data = tableLiquidityRatioAvgYearArray;
  chartLiquidityRatio.data.datasets[2].data = tableLiquidityRatioMidYearArray;
  chartLiquidityRatio.data.datasets[3].data = tableLiquidityRatioMinArray;
  chartLiquidityRatio.data.datasets[4].data = tableLiquidityRatioMaxArray;

  // ----- chartNetCashAvailable ---->
  chartNetCashAvailable.data.labels = selectedYearArray;
  chartNetCashAvailable.data.datasets[0].data =
    tableNetCashAvailableClientArray;
  chartNetCashAvailable.data.datasets[1].data =
    tableNetCashAvailableAvgYearArray;
  chartNetCashAvailable.data.datasets[2].data =
    tableNetCashAvailableMidYearArray;
  chartNetCashAvailable.data.datasets[3].data = tableNetCashAvailableMinArray;
  chartNetCashAvailable.data.datasets[4].data = tableNetCashAvailableMaxArray;

  // ----------- DEBT CHART UPDATE

  // ----- chartDebtToContributionsWithout ---->
  chartDebtToContributionsWithout.data.labels = selectedYearArray;
  chartDebtToContributionsWithout.data.datasets[0].data =
    tableChartDebtToContrArray;
  chartDebtToContributionsWithout.data.datasets[1].data =
    tableDebtToContrAvgYearArray;
  chartDebtToContributionsWithout.data.datasets[2].data =
    tableDebtToContrMidYearArray;
  chartDebtToContributionsWithout.data.datasets[3].data =
    tableDebtToContrMinArray;
  chartDebtToContributionsWithout.data.datasets[4].data =
    tableDebtToContrMaxArray;

  // ----- chartCurrentRatio ---->
  chartCurrentRatio.data.labels = selectedYearArray;
  chartCurrentRatio.data.datasets[0].data = tableCurrentRatioClientArray;
  chartCurrentRatio.data.datasets[1].data = tableCurrentRatioAvgYearArray;
  chartCurrentRatio.data.datasets[2].data = tableCurrentRatioMidYearArray;
  chartCurrentRatio.data.datasets[3].data = tableCurrentRatioMinArray;
  chartCurrentRatio.data.datasets[4].data = tableCurrentRatioMaxArray;

  // ----- chartMandatoryDebtService ---->
  chartMandatoryDebtService.data.labels = selectedYearArray;
  chartMandatoryDebtService.data.datasets[0].data =
    tableChartMandatoryDebtArray;
  chartMandatoryDebtService.data.datasets[1].data =
    tableMandatoryDebtAvgYearArray;
  chartMandatoryDebtService.data.datasets[2].data =
    tableMandatoryDebtMidYearArray;
  chartMandatoryDebtService.data.datasets[3].data = tableMandatoryDebtMinArray;
  chartMandatoryDebtService.data.datasets[4].data = tableMandatoryDebtMaxArray;

  // ----- chartDebtPerGivingUnit ---->
  chartDebtPerGivingUnit.data.labels = selectedYearArray;
  chartDebtPerGivingUnit.data.datasets[0].data =
    tableChartDebtPerGivingUnitArray;
  chartDebtPerGivingUnit.data.datasets[1].data =
    tableDebtPerGivingUnitAvgYearArray;
  chartDebtPerGivingUnit.data.datasets[2].data =
    tableDebtPerGivingUnitMidYearArray;
  chartDebtPerGivingUnit.data.datasets[3].data = tableDebtPerGivingUnitMinArray;
  chartDebtPerGivingUnit.data.datasets[4].data = tableDebtPerGivingUnitMaxArray;

  // ----- chartDebtCoverage ---->
  chartDebtCoverage.data.labels = selectedYearArray;
  chartDebtCoverage.data.datasets[0].data = tableDebtCoverageClientArray;
  chartDebtCoverage.data.datasets[1].data = tableDebtCoverageAvgYearArray;
  chartDebtCoverage.data.datasets[2].data = tableDebtCoverageMidYearArray;
  chartDebtCoverage.data.datasets[3].data = tableDebtCoverageMinArray;
  chartDebtCoverage.data.datasets[4].data = tableDebtCoverageMaxArray;

  // ----------- INCOME CHART UPDATE

  // ----- chartNetIncome ---->
  chartNetIncome.data.labels = selectedYearArray;
  chartNetIncome.data.datasets[0].data = tableChartNetIncomeArray;
  chartNetIncome.data.datasets[1].data = tableNetIncomeAvgYearArray;
  chartNetIncome.data.datasets[2].data = tableNetIncomeMidYearArray;
  chartNetIncome.data.datasets[3].data = tableNetIncomeMinArray;
  chartNetIncome.data.datasets[4].data = tableNetIncomeMaxArray;

  // ----- chartContrWithoutPerGU ---->
  chartContrWithoutPerAvgAttAndGU.data.labels = selectedYearArray;
  chartContrWithoutPerAvgAttAndGU.data.datasets[0].data =
    tableChartContrWithoutPerGUArray;
  chartContrWithoutPerAvgAttAndGU.data.datasets[1].data =
    tableTotalContrPerGUAvgYearArray;
  chartContrWithoutPerAvgAttAndGU.data.datasets[2].data =
    tableTotalContrPerGUMidYearArray;
  chartContrWithoutPerAvgAttAndGU.data.datasets[3].data =
    tableTotalContrPerGUMinArray;
  chartContrWithoutPerAvgAttAndGU.data.datasets[4].data =
    tableTotalContrPerGUMaxArray;

  // ----- chartTotalContrPerGU ---->
  chartTotalContrPerAvgAttAndGU.data.labels = selectedYearArray;
  chartTotalContrPerAvgAttAndGU.data.datasets[0].data =
    tableChartTotalContrPerGUArray;
  chartTotalContrPerAvgAttAndGU.data.datasets[1].data =
    tableTotalContrPerGUAvgYearArray;
  chartTotalContrPerAvgAttAndGU.data.datasets[2].data =
    tableTotalContrPerGUMidYearArray;
  chartTotalContrPerAvgAttAndGU.data.datasets[3].data =
    tableTotalContrPerGUMinArray;
  chartTotalContrPerAvgAttAndGU.data.datasets[4].data =
    tableTotalContrPerGUMaxArray;

  // ----------- EXPENSE CHART UPDATE

  // ----- chartBenefitsToSalaries ---->
  chartBenefitsToSalaries.data.labels = selectedYearArray;
  chartBenefitsToSalaries.data.datasets[0].data =
    tableChartBenefitsToSalariesArray;
  chartBenefitsToSalaries.data.datasets[1].data =
    tableBenefitsToSalariesAvgYearArray;
  chartBenefitsToSalaries.data.datasets[2].data =
    tableBenefitsToSalariesMidYearArray;
  chartBenefitsToSalaries.data.datasets[3].data =
    tableBenefitsToSalariesMinArray;
  chartBenefitsToSalaries.data.datasets[4].data =
    tableBenefitsToSalariesMaxArray;

  // ----- chartBenefitsSalariesTotal ---->
  chartBenefitsSalariesTotal.data.labels = selectedYearArray;
  chartBenefitsSalariesTotal.data.datasets[0].data =
    tableChartBenefitsSalariesTotalArray;
  chartBenefitsSalariesTotal.data.datasets[1].data =
    tableBenefitsSalariesTotalAvgYearArray;
  chartBenefitsSalariesTotal.data.datasets[2].data =
    tableBenefitsSalariesTotalMidYearArray;
  chartBenefitsSalariesTotal.data.datasets[3].data =
    tableBenefitsSalariesTotalMinArray;
  chartBenefitsSalariesTotal.data.datasets[4].data =
    tableBenefitsSalariesTotalMaxArray;

  // ----- chartPersonnelToCash ---->
  chartPersonnelInclude.data.labels = selectedYearArray;
  chartPersonnelInclude.data.datasets[0].data = tableChartPersonnelToCashArray;
  chartPersonnelInclude.data.datasets[1].data =
    tablePersonnelToCashAvgYearArray;
  chartPersonnelInclude.data.datasets[2].data =
    tablePersonnelToCashMidYearArray;
  chartPersonnelInclude.data.datasets[3].data = tablePersonnelToCashMinArray;
  chartPersonnelInclude.data.datasets[4].data = tablePersonnelToCashMaxArray;

  // ----- chartTotalCashExpendExcludePerGU ---->
  chartTotalCashExpendExcludePerGU.data.labels = selectedYearArray;
  chartTotalCashExpendExcludePerGU.data.datasets[0].data =
    tableChartCashExpendPerGUArray;
  chartTotalCashExpendExcludePerGU.data.datasets[1].data =
    tableCashExpendPerGUAvgYearArray;
  chartTotalCashExpendExcludePerGU.data.datasets[2].data =
    tableCashExpendPerGUMidYearArray;
  chartTotalCashExpendExcludePerGU.data.datasets[3].data =
    tableCashExpendPerGUMinArray;
  chartTotalCashExpendExcludePerGU.data.datasets[4].data =
    tableCashExpendPerGUMaxArray;

  myChart.update();
  myChart2.update();

  chartDaysExpendable.update();
  chartDaysOperatingCash.update();
  chartAvailableDaysCash.update();
  chartLiquidityRatio.update();

  chartNetCashAvailable.update();
  chartDebtToContributionsWithout.update();
  chartCurrentRatio.update();
  chartMandatoryDebtService.update();
  chartDebtPerGivingUnit.update();
  chartDebtCoverage.update();

  chartNetIncome.update();
  chartContrWithoutPerAvgAttAndGU.update();
  chartTotalContrPerAvgAttAndGU.update();

  chartBenefitsToSalaries.update();
  chartBenefitsSalariesTotal.update();
  chartPersonnelInclude.update();
  chartTotalCashExpendExcludePerGU.update();
}; // UpdateYear Function --------------------------------------------------------------------------------->

//-----------------------------

// ----- Variables ----->
const yearDropdown = document.getElementById("year-dropdown");
const loading = document.getElementById("loading");
const uploading = document.getElementById("spinnerWrapper");
const container = document.getElementById("container");

// PRINT PDF Charts ------------------------------>

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

// DOWNLOAD PNG Images ------------------------------>

const downloadImage = (elem) => {
  console.log(elem);
  console.log("hit before");
  const element = document.getElementById(elem);
  let image = element.toDataURL("image/png");
  console.log("hit after");

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

// EXCEL IMPORT

const uploadFileBegin = `<qdbapi> <apptoken>bpat4pgu9t69yby5gbemdbej52j</apptoken>`;
const uploadFileEnd = `</qdbapi>`;
const uploadClist = `<clist>288.292.293.294</clist>`;
let uploadMainFile = "";

// console.log(uploadMainFile)

function uploadToFile(avg, mid, min, max, num, begin, end) {
  var avgVal = avg;
  var midVal = mid;
  var minVal = min;
  var maxVal = max;

  if (begin)
    uploadMainFile +=
      "<qdbapi><apptoken>bpat4pgu9t69yby5gbemdbej52j</apptoken>";

  uploadMainFile += `<field fid='${num}'>${avgVal}</field><field fid='${
    num + 1
  }'>${midVal}</field><field fid='${num + 2}'>${minVal}</field><field fid='${
    num + 3
  }'>${maxVal}</field>`;
} //uploadToFile

function uploadSingleToFile(id, val, end) {
  uploadMainFile += `<field fid='${id}'>${val}</field>`;

  if (end) uploadMainFile += uploadClist;

  if (end) uploadMainFile += "</qdbapi>";
}

const printToExcel = (dataString) => {
  dataParseExcelString = dataString;

  var urlUploadFile =
    "https://capincrouse.quickbase.com/db/btcc8gq3r?a=API_AddRecord";

  console.log(dataString);

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
      //console.log(response);
      console.log(xmlUpload);
      newRecordID = xmlUpload[0].all[4].innerHTML;
      //console.log(newRecordID)

      if (xmlUpload.find("qdbapi").find("errcode").text() == "0") {
        newDownloadURL = xmlUpload
          .find("qdbapi")
          .find("record")
          .find("f")
          .text();
        newDownloadURLFormatted = newDownloadURL.replace(/amp;/g, "");
        newDownloadURLFormattedArray = newDownloadURLFormatted.split("---");

        document.getElementById("trendXLSFinal").hidden = false;
        document.getElementById("trendPDFFinal").hidden = false;
        document.getElementById("benchXLSFinal").hidden = false;
        document.getElementById("benchPDFFinal").hidden = false;
        document.getElementById("downloadInstructions").hidden = false;

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
      }
    },
    error: function (response) {
      console.log("Quickbase returned an error.");
    },
  }); //end ajax call
}; // printToExcel()

//const createPrintExcel = (chart, type) => {
const createPrintExcel = () => {
  // DEMO data
  const givingUnitsData = dataArrayObjects(
    givingUnitsArray,
    givingUnitsArray,
    tableGivingUnitsMinArray,
    tableGivingUnitsMaxArray
  );
  const avgAdultAttendeesData = dataArrayObjects(
    averageAdultAttendArray,
    averageAdultAttendArray,
    tableAverageAdultAttendMinArray,
    tableAverageAdultAttendMaxArray
  );
  const totalAttendData = dataArrayObjects(
    totalAttendArray,
    totalAttendArray,
    tableTotalAttendMinArray,
    tableTotalAttendMaxArray
  );
  const fullTimeEqData = dataArrayObjects(
    fullTimeEqArray,
    fullTimeEqArray,
    tableFullTimeEqMinArray,
    tableFullTimeEqMaxArray
  );
  const attendToStaff = dataArrayObjects(
    tableAttendToStaffAvgArray,
    attendToStaffArray,
    tableAttendToStaffMinArray,
    tableAttendToStaffMaxArray
  );
  const contributionsWithoutData = dataArrayObjects(
    contributionsWithoutArray,
    contributionsWithoutArray,
    tableContributionsWithoutMinArray,
    tableContributionsWithoutMaxArray
  );
  const contributionsExcludeData = dataArrayObjects(
    totalContributionsExcludeArray,
    totalContributionsExcludeArray,
    tableTotalContributionsExcludeMinArray,
    tableTotalContributionsExcludeMaxArray
  );
  const totalContributionsOnlineData = dataArrayObjects(
    totalContrOnlineArray,
    totalContrOnlineArray,
    tableTotalContrOnlineMinArray,
    tableTotalContrOnlineMaxArray
  );
  const percentOfTotalContributionsData = dataArrayObjects(
    percentOfTotalContrArray,
    percentOfTotalContrArray,
    tablePercentOfTotalContrMinArray,
    tablePercentOfTotalContrMaxArray
  );
  const totalOutsourcedContributionsData = dataArrayObjects(
    totalOutsourcedArray,
    totalOutsourcedArray,
    tableTotalOutsourcedMinArray,
    tableTotalOutsourcedMaxArray
  );
  const facilitySquareFootageData = dataArrayObjects(
    facilitySquareFootageArray,
    facilitySquareFootageArray,
    tableFacilitySquareFootageMinArray,
    tableFacilitySquareFootageMaxArray
  );
  const numberOfLocationsData = dataArrayObjects(
    numberOfLocationsArray,
    numberOfLocationsArray,
    tableNumberOfLocationsMinArray,
    tableNumberOfLocationsMaxArray
  );

  uploadToFile(
    givingUnitsData.avg,
    givingUnitsData.mid,
    givingUnitsData.min,
    givingUnitsData.max,
    6,
    "begin",
    null
  );
  uploadToFile(
    avgAdultAttendeesData.avg,
    avgAdultAttendeesData.mid,
    avgAdultAttendeesData.min,
    avgAdultAttendeesData.max,
    10,
    null,
    null
  );
  uploadToFile(
    totalAttendData.avg,
    totalAttendData.mid,
    totalAttendData.min,
    totalAttendData.max,
    14,
    null,
    null
  );
  uploadToFile(
    fullTimeEqData.avg,
    fullTimeEqData.mid,
    fullTimeEqData.min,
    fullTimeEqData.max,
    18,
    null,
    null
  );
  uploadToFile(
    attendToStaff.avg,
    attendToStaff.mid,
    attendToStaff.min,
    attendToStaff.max,
    22,
    null,
    null
  );
  uploadToFile(
    contributionsWithoutData.avg,
    contributionsWithoutData.mid,
    contributionsWithoutData.min,
    contributionsWithoutData.max,
    26,
    null,
    null
  );
  uploadToFile(
    contributionsExcludeData.avg,
    contributionsExcludeData.mid,
    contributionsExcludeData.min,
    contributionsExcludeData.max,
    30,
    null,
    null
  );
  uploadToFile(
    totalContributionsOnlineData.avg,
    totalContributionsOnlineData.mid,
    totalContributionsOnlineData.min,
    totalContributionsOnlineData.max,
    35,
    null,
    null
  );
  uploadToFile(
    percentOfTotalContributionsData.avg,
    percentOfTotalContributionsData.mid,
    percentOfTotalContributionsData.min,
    percentOfTotalContributionsData.max,
    39,
    null,
    null
  );
  uploadToFile(
    totalOutsourcedContributionsData.avg,
    totalOutsourcedContributionsData.mid,
    totalOutsourcedContributionsData.min,
    totalOutsourcedContributionsData.max,
    43,
    null,
    null
  );
  uploadToFile(
    facilitySquareFootageData.avg,
    facilitySquareFootageData.mid,
    facilitySquareFootageData.min,
    facilitySquareFootageData.max,
    47,
    null,
    null
  );
  uploadToFile(
    numberOfLocationsData.avg,
    numberOfLocationsData.mid,
    numberOfLocationsData.min,
    numberOfLocationsData.max,
    51,
    null,
    null
  );

  // CASH data
  const daysExpendableData = dataArrayObjects(
    tableDaysExpendableAvgArray,
    daysExpendableArray,
    tableDaysExpendableMinArray,
    tableDaysExpendableMaxArray
  );
  const daysOperatingCashData = dataArrayObjects(
    tableDaysOperatingCashAvgArray,
    daysOperatingCashArray,
    tableDaysOperatingCashMinArray,
    tableDaysOperatingCashMaxArray
  );
  const availableDaysCashData = dataArrayObjects(
    tableAvailableDaysCashAvgArray,
    availableDaysCashArray,
    tableAvailableDaysCashMinArray,
    tableAvailableDaysCashMaxArray
  );
  const liquidityRatioData = dataArrayObjects(
    tableLiquidityRatioAvgArray,
    liquidityRatioArray,
    tableLiquidityRatioMinArray,
    tableLiquidityRatioMaxArray,
    "weight",
    null,
    "fixed",
    1
  );
  const netCashAvailableData = dataArrayObjects(
    netCashAvailableArray,
    netCashAvailableArray,
    tableNetCashAvailableMinArray,
    tableNetCashAvailableMaxArray
  );
  const netCashAvailableIncludeData = dataArrayObjects(
    netCashAvailableIncludeArray,
    netCashAvailableIncludeArray,
    tableNetCashAvailableIncludeMinArray,
    tableNetCashAvailableIncludeMaxArray
  );
  const netCashStdData = dataArrayObjects(
    netCashStdArray,
    netCashStdArray,
    tableNetCashStdMinArray,
    tableNetCashStdMaxArray
  );

  uploadToFile(
    daysExpendableData.avg,
    daysExpendableData.mid,
    daysExpendableData.min,
    daysExpendableData.max,
    55,
    null,
    null
  );
  uploadToFile(
    daysOperatingCashData.avg,
    daysOperatingCashData.mid,
    daysOperatingCashData.min,
    daysOperatingCashData.max,
    59,
    null,
    null
  );
  uploadToFile(
    availableDaysCashData.avg,
    availableDaysCashData.mid,
    availableDaysCashData.min,
    availableDaysCashData.max,
    63,
    null,
    null
  );
  uploadToFile(
    liquidityRatioData.avg,
    liquidityRatioData.mid,
    liquidityRatioData.min,
    liquidityRatioData.max,
    67,
    null,
    null
  );
  uploadToFile(
    netCashAvailableData.avg,
    netCashAvailableData.mid,
    netCashAvailableData.min,
    netCashAvailableData.max,
    71,
    null,
    null
  );
  uploadToFile(
    netCashAvailableIncludeData.avg,
    netCashAvailableIncludeData.mid,
    netCashAvailableIncludeData.min,
    netCashAvailableIncludeData.max,
    75,
    null,
    null
  );
  uploadToFile(
    netCashStdData.avg,
    netCashStdData.mid,
    netCashStdData.min,
    netCashStdData.max,
    79,
    null,
    null
  );

  // (avgArray, midArray, minArray, MaxArray, weighted, percent, fixed, num)

  // DEBT data
  const debtToContrData = dataArrayObjects(
    tableDebtToContrAvgArray,
    debtToContrArray,
    tableDebtToContrMinArray,
    tableDebtToContrMaxArray,
    "weight",
    null,
    "fix",
    1
  );
  const currentRatioData = dataArrayObjects(
    tableCurrentRatioAvgArray,
    currentRatioArray,
    tableCurrentRatioMinArray,
    tableCurrentRatioMaxArray,
    "weight",
    null,
    "fix",
    1
  );
  const mandatoryDebtData = dataArrayObjects(
    mandatoryDebtArray,
    mandatoryDebtArray,
    tableMandatoryDebtMinArray,
    tableMandatoryDebtMaxArray
  );
  const DpaaData = dataArrayObjects(
    tableDebtPerAvgAttendAvgArray,
    debtPerAvgAttendArray,
    tableDebtPerAvgAttendMinArray,
    tableDebtPerAvgAttendMaxArray
  );
  const DpaaStdData = dataArrayObjects(
    tableDPAAStdAvgArray,
    dpaaStdArray,
    tableDPAAStdMinArray,
    tableDPAAStdMaxArray
  );
  const DpguData = dataArrayObjects(
    tableDebtPerGivingUnitAvgArray,
    debtPerGivingUnitArray,
    tableDebtPerGivingUnitMinArray,
    tableDebtPerGivingUnitMaxArray
  );
  const DpguStdData = dataArrayObjects(
    tableDpguStdAvgArray,
    dpguStdArray,
    tableDpguStdMinArray,
    tableDpguStdMaxArray
  );
  const DebtCoverageData = dataArrayObjects(
    tableDebtCoverageAvgArray,
    debtCoverageArray,
    tableDebtCoverageMinArray,
    tableDebtCoverageMaxArray,
    "weight",
    null,
    "fix",
    2
  );

  uploadToFile(
    debtToContrData.avg,
    debtToContrData.mid,
    debtToContrData.min,
    debtToContrData.max,
    83,
    null,
    null
  );
  uploadToFile(
    currentRatioData.avg,
    currentRatioData.mid,
    currentRatioData.min,
    currentRatioData.max,
    87,
    null,
    null
  );
  uploadToFile(
    mandatoryDebtData.avg,
    mandatoryDebtData.mid,
    mandatoryDebtData.min,
    mandatoryDebtData.max,
    91,
    null,
    null
  );
  uploadToFile(
    DpaaData.avg,
    DpaaData.mid,
    DpaaData.min,
    DpaaData.max,
    95,
    null,
    null
  );
  uploadToFile(
    DpaaStdData.avg,
    DpaaStdData.mid,
    DpaaStdData.min,
    DpaaStdData.max,
    99,
    null,
    null
  );
  uploadToFile(
    DpguData.avg,
    DpguData.mid,
    DpguData.min,
    DpguData.max,
    103,
    null,
    null
  );
  uploadToFile(
    DpguStdData.avg,
    DpguStdData.mid,
    DpguStdData.min,
    DpguStdData.max,
    107,
    null,
    null
  );
  uploadToFile(
    DebtCoverageData.avg,
    DebtCoverageData.mid,
    DebtCoverageData.min,
    DebtCoverageData.max,
    111,
    null,
    null
  );

  // INCOME data
  const netIncomeData = dataArrayObjects(
    tableNetIncomeAvgArray,
    netIncomeArray,
    tableNetIncomeMinArray,
    tableNetIncomeMaxArray,
    null,
    "percent"
  );
  const contrWithoutPaaaData = dataArrayObjects(
    tableContrWithoutPerAvgAttAvgArray,
    contrWithoutPerAvgAttArray,
    tableContrWithoutPerAvgAttMinArray,
    tableContrWithoutPerAvgAttMaxArray
  );
  const contrWithoutPguData = dataArrayObjects(
    tableContrWithoutPerGUAvgArray,
    contrWithoutPerGUArray,
    tableContrWithoutPerGUMinArray,
    tableContrWithoutPerGUMaxArray
  );
  const totalContrPaaaData = dataArrayObjects(
    tableTotalContrPerAvgAttAvgArray,
    contrPerAvgAttArray,
    tableTotalContrPerAvgAttMinArray,
    tableTotalContrPerAvgAttMaxArray
  );
  const totalContrPguData = dataArrayObjects(
    tableTotalContrPerGUAvgArray,
    contrPerGUArray,
    tableTotalContrPerGUMinArray,
    tableTotalContrPerGUMaxArray
  );

  uploadToFile(
    netIncomeData.avg,
    netIncomeData.mid,
    netIncomeData.min,
    netIncomeData.max,
    115,
    null,
    null
  );
  uploadToFile(
    contrWithoutPaaaData.avg,
    contrWithoutPaaaData.mid,
    contrWithoutPaaaData.min,
    contrWithoutPaaaData.max,
    119,
    null,
    null
  );
  uploadToFile(
    contrWithoutPguData.avg,
    contrWithoutPguData.mid,
    contrWithoutPguData.min,
    contrWithoutPguData.max,
    123,
    null,
    null
  );
  uploadToFile(
    totalContrPaaaData.avg,
    totalContrPaaaData.mid,
    totalContrPaaaData.min,
    totalContrPaaaData.max,
    127,
    null,
    null
  );
  uploadToFile(
    totalContrPguData.avg,
    totalContrPguData.mid,
    totalContrPguData.min,
    totalContrPguData.max,
    131,
    null,
    null
  );

  //  (avgArray, midArray, minArray, MaxArray, weighted, percent, fixed, num)

  // EXPENSES data
  const benefitsToSalariesData = dataArrayObjects(
    tableBenefitsToSalariesAvgArray,
    benefitsToSalariesArray,
    tableBenefitsToSalariesMinArray,
    tableBenefitsToSalariesMaxArray,
    null,
    "percent"
  );
  const salariesTotalData = dataArrayObjects(
    tableSalariesTotalAvgArray,
    salariesTotalArray,
    tableSalariesTotalMinArray,
    tableSalariesTotalMaxArray
  );
  const benefitsTotalData = dataArrayObjects(
    tableBenefitsTotalAvgArray,
    benefitsTotalArray,
    tableBenefitsTotalMinArray,
    tableBenefitsTotalMaxArray
  );
  const benefitsSalariesTotalData = dataArrayObjects(
    tableBenefitsSalariesTotalAvgArray,
    benefitsSalariesTotalArray,
    tableBenefitsSalariesTotalMinArray,
    tableBenefitsSalariesTotalMaxArray
  );
  const benefitsSalariesTotalIncludeData = dataArrayObjects(
    tableBenefitsSalariesTotalIncludeOutsourceAvgArray,
    benefitsSalariesTotalIncludeOutsourceArray,
    tableBenefitsSalariesTotalIncludeOutsourceMinArray,
    tableBenefitsSalariesTotalIncludeOutsourceMaxArray
  );
  const personnelToCashData = dataArrayObjects(
    personnelToCashArray,
    personnelToCashArray,
    tablePersonnelToCashMinArray,
    tablePersonnelToCashMaxArray,
    null,
    "percent"
  );
  const mandDebtServiceData = dataArrayObjects(
    mandDebtServiceArray,
    mandDebtServiceArray,
    tableMandDebtServiceMinArray,
    tableMandDebtServiceMaxArray,
    null,
    "percent"
  );
  const personnelIncludeData = dataArrayObjects(
    personnelIncludeArray,
    personnelIncludeArray,
    tablePersonnelIncludeMinArray,
    tablePersonnelIncludeMaxArray,
    null,
    "percent"
  );
  const localOutreachData = dataArrayObjects(
    tableTotalCashLocalAvgArray,
    totalCashLocalArray,
    tableTotalCashLocalMinArray,
    tableTotalCashLocalMaxArray,
    null,
    "percent"
  );
  const globalOutreachData = dataArrayObjects(
    tableTotalCashGlobalAvgArray,
    totalCashGlobalArray,
    tableTotalCashGlobalMinArray,
    tableTotalCashGlobalMaxArray,
    null,
    "percent"
  );
  const totalOutreachData = dataArrayObjects(
    tableTotalCashGlobalAndLocalAvgArray,
    totalCashGlobalAndLocalArray,
    tableTotalCashGlobalAndLocalMinArray,
    tableTotalCashGlobalAndLocalMaxArray,
    null,
    "percent"
  );
  const cashExpendPaaaData = dataArrayObjects(
    tableCashExpendPerAvgAttAvgArray,
    cashExpendPerAvgAttArray,
    tableCashExpendPerAvgAttMinArray,
    tableCashExpendPerAvgAttMaxArray
  );
  const cashExpendPguData = dataArrayObjects(
    tableCashExpendPerGUAvgArray,
    cashExpendPerGUArray,
    tableCashExpendPerGUMinArray,
    tableCashExpendPerGUMaxArray
  );

  uploadToFile(
    benefitsToSalariesData.avg,
    benefitsToSalariesData.mid,
    benefitsToSalariesData.min,
    benefitsToSalariesData.max,
    135,
    null,
    null
  );
  uploadToFile(
    salariesTotalData.avg,
    salariesTotalData.mid,
    salariesTotalData.min,
    salariesTotalData.max,
    139,
    null,
    null
  );
  uploadToFile(
    benefitsTotalData.avg,
    benefitsTotalData.mid,
    benefitsTotalData.min,
    benefitsTotalData.max,
    143,
    null,
    null
  );
  uploadToFile(
    benefitsSalariesTotalData.avg,
    benefitsSalariesTotalData.mid,
    benefitsSalariesTotalData.min,
    benefitsSalariesTotalData.max,
    147,
    null,
    null
  );
  uploadToFile(
    benefitsSalariesTotalIncludeData.avg,
    benefitsSalariesTotalIncludeData.mid,
    benefitsSalariesTotalIncludeData.min,
    benefitsSalariesTotalIncludeData.max,
    151,
    null,
    null
  );
  uploadToFile(
    personnelToCashData.avg,
    personnelToCashData.mid,
    personnelToCashData.min,
    personnelToCashData.max,
    155,
    null,
    null
  );
  uploadToFile(
    mandDebtServiceData.avg,
    mandDebtServiceData.mid,
    mandDebtServiceData.min,
    mandDebtServiceData.max,
    159,
    null,
    null
  );
  uploadToFile(
    personnelIncludeData.avg,
    personnelIncludeData.mid,
    personnelIncludeData.min,
    personnelIncludeData.max,
    163,
    null,
    null
  );
  uploadToFile(
    localOutreachData.avg,
    localOutreachData.mid,
    localOutreachData.min,
    localOutreachData.max,
    167,
    null,
    null
  );
  uploadToFile(
    globalOutreachData.avg,
    globalOutreachData.mid,
    globalOutreachData.min,
    globalOutreachData.max,
    171,
    null,
    null
  );
  uploadToFile(
    totalOutreachData.avg,
    totalOutreachData.mid,
    totalOutreachData.min,
    totalOutreachData.max,
    175,
    null,
    null
  );
  uploadToFile(
    cashExpendPaaaData.avg,
    cashExpendPaaaData.mid,
    cashExpendPaaaData.min,
    cashExpendPaaaData.max,
    179,
    null,
    null
  );
  uploadToFile(
    cashExpendPguData.avg,
    cashExpendPguData.mid,
    cashExpendPguData.min,
    cashExpendPguData.max,
    183,
    null,
    null
  );

  //  (avgArray, midArray, minArray, MaxArray, weighted, percent, fixed, num)

  // ADDITIONAL data
  const contrPerAccFTEData = dataArrayObjects(
    tableContrPerAccountingFTEAvgArray,
    contrPerAccountingFTEArray,
    tableContrPerAccountingFTEMinArray,
    tableContrPerAccountingFTEMaxArray
  );
  const expensePerAccFTEData = dataArrayObjects(
    tableExpensePerAccountingFTEAvgArray,
    contrPerAccountingFTEArray,
    tableExpensePerAccountingFTEMinArray,
    tableExpensePerAccountingFTEMaxArray
  );
  const facExpenseToTotalLessTenData = dataArrayObjects(
    tableFacExpenseToTotalCashLessTenAvgArray,
    facExpenseToTotalCashLessTenArray,
    tableFacExpenseToTotalCashLessTenMinArray,
    tableFacExpenseToTotalCashLessTenMaxArray,
    null,
    "percent"
  );
  const facExpenseToTotalMoreTenData = dataArrayObjects(
    tableFacExpenseToTotalCashMoreTenAvgArray,
    facExpenseToTotalCashMoreTenArray,
    tableFacExpenseToTotalCashMoreTenMinArray,
    tableFacExpenseToTotalCashMoreTenMaxArray,
    null,
    "percent"
  );
  const facCostPerSquareFootExcludeLessTenData = dataArrayObjects(
    tableFacCostPerSquareFootExcludeLessTenAvgArray,
    facCostPerSquareFootExcludeLessTenArray,
    tableFacCostPerSquareFootExcludeLessTenMinArray,
    tableFacCostPerSquareFootExcludeLessTenMaxArray,
    "weight",
    null,
    "fixed",
    2
  );
  const facCostPerSquareFootExcludeMoreTenData = dataArrayObjects(
    tableFacCostPerSquareFootExcludeMoreTenAvgArray,
    facCostPerSquareFootExcludeMoreTenArray,
    tableFacCostPerSquareFootExcludeMoreTenMinArray,
    tableFacCostPerSquareFootExcludeMoreTenMaxArray,
    "weight",
    null,
    "fixed",
    2
  );
  const facCostPerSquareFootIncludeLessTenData = dataArrayObjects(
    tableFacCostPerSquareFootIncludeLessTenAvgArray,
    facCostPerSquareFootIncludeLessTenArray,
    tableFacCostPerSquareFootIncludeLessTenMinArray,
    tableFacCostPerSquareFootIncludeLessTenMaxArray,
    "weight",
    null,
    "fixed",
    2
  );
  const facCostPerSquareFootIncludeMoreTenData = dataArrayObjects(
    tableFacCostPerSquareFootIncludeMoreTenAvgArray,
    facCostPerSquareFootIncludeMoreTenArray,
    tableFacCostPerSquareFootIncludeMoreTenMinArray,
    tableFacCostPerSquareFootIncludeMoreTenMaxArray,
    "weight",
    null,
    "fixed",
    2
  );
  const informTechCostPerFTEData = dataArrayObjects(
    tableInformTechCostPerFTEAvgArray,
    informTechCostPerFTEArray,
    tableInformTechCostPerFTEMinArray,
    tableInformTechCostPerFTEMaxArray
  );

  uploadToFile(
    contrPerAccFTEData.avg,
    contrPerAccFTEData.mid,
    contrPerAccFTEData.min,
    contrPerAccFTEData.max,
    187,
    null,
    null
  );
  uploadToFile(
    expensePerAccFTEData.avg,
    expensePerAccFTEData.mid,
    expensePerAccFTEData.min,
    expensePerAccFTEData.max,
    191,
    null,
    null
  );
  uploadToFile(
    facExpenseToTotalLessTenData.avg,
    facExpenseToTotalLessTenData.mid,
    facExpenseToTotalLessTenData.min,
    facExpenseToTotalLessTenData.max,
    195,
    null,
    null
  );
  uploadToFile(
    facExpenseToTotalMoreTenData.avg,
    facExpenseToTotalMoreTenData.mid,
    facExpenseToTotalMoreTenData.min,
    facExpenseToTotalMoreTenData.max,
    199,
    null,
    null
  );
  uploadToFile(
    facCostPerSquareFootExcludeLessTenData.avg,
    facCostPerSquareFootExcludeLessTenData.mid,
    facCostPerSquareFootExcludeLessTenData.min,
    facCostPerSquareFootExcludeLessTenData.max,
    203,
    null,
    null
  );
  uploadToFile(
    facCostPerSquareFootExcludeMoreTenData.avg,
    facCostPerSquareFootExcludeMoreTenData.mid,
    facCostPerSquareFootExcludeMoreTenData.min,
    facCostPerSquareFootExcludeMoreTenData.max,
    207,
    null,
    null
  );
  uploadToFile(
    facCostPerSquareFootIncludeLessTenData.avg,
    facCostPerSquareFootIncludeLessTenData.mid,
    facCostPerSquareFootIncludeLessTenData.min,
    facCostPerSquareFootIncludeLessTenData.max,
    211,
    null,
    null
  );
  uploadToFile(
    facCostPerSquareFootIncludeMoreTenData.avg,
    facCostPerSquareFootIncludeMoreTenData.mid,
    facCostPerSquareFootIncludeMoreTenData.min,
    facCostPerSquareFootIncludeMoreTenData.max,
    215,
    null,
    null
  );
  uploadToFile(
    informTechCostPerFTEData.avg,
    informTechCostPerFTEData.mid,
    informTechCostPerFTEData.min,
    informTechCostPerFTEData.max,
    219,
    null,
    null
  );

  uploadSingleToFile(227, ClientRid);
  uploadSingleToFile(223, clientName);
  uploadSingleToFile(224, uniqueClients);
  uploadSingleToFile(287, "Comprehensive");

  let yearLength = selectedYearArray.length;
  let j = 228;

  for (let i = 0; i < selectedYearArray.length; i++) {
    if (i === yearLength - 1) {
      uploadSingleToFile(j, selectedYearArray[i], "end");
    } else {
      uploadSingleToFile(j, selectedYearArray[i]);
    }
    j++;
  }

  container.style.opacity = ".25";
  uploading.style.display = "block";

  setTimeout(() => {
    printToExcel(uploadMainFile); // Main Function

    setTimeout(() => {
      container.style.opacity = "1";
      uploading.style.display = "none";
    }, 1500); //setTimeout
  }, 1500); //setTimeout
}; // createPrintExcel

$(".disabled").prop("disabled", true);

// <-------------------- Years To Select ----------------------------------------------------->
yearOptionsArray.map(function (element, index) {
  return $("#year-dropdown").append(
    '<li><input class="form-check-input" name="yearCheckbox" onchange="selectedYears()"   type="checkbox" value="' +
      element +
      '" id="defaultYear' +
      index +
      '" /><span> </span><label class="form-years" for="defaultYear' +
      index +
      '">' +
      element +
      "</label></li>"
  );
}); //yearMap FUNCTION

// <-------------------- toggleBenchmarkColors ----------------------------------------------------->

function toggleBackgroundColors(chart, min, max, type) {
  if (chart.config) {
    chart.config.plugins[0].beforeDraw = (chart) => {
      const {
        ctx,
        chartArea: { left, top, width, bottom },
        scales: { x, y },
      } = chart;
      const endTop = y.getPixelForValue(max);
      const endMid = y.getPixelForValue(min);

      ctx.save();

      if (type === "redAbove") {
        ctx.fillStyle = "#F5AB96";
        ctx.fillRect(left, top, width, endTop - top);
        ctx.fillStyle = "#c7e7c6ad";
        ctx.fillRect(left, endTop, width, endMid - endTop);
        ctx.fillStyle = "#FEFCB3";
        ctx.fillRect(left, endMid, width, bottom - endMid);
        ctx.restore();
      } else if (type === "redBelow") {
        ctx.fillStyle = "#c7e7c6ad";
        ctx.fillRect(left, top, width, endTop - top);
        ctx.fillStyle = "#FEFCB3";
        ctx.fillRect(left, endTop, width, endMid - endTop);
        ctx.fillStyle = "#F5AB96";
        ctx.fillRect(left, endMid, width, bottom - endMid);
        ctx.restore();
      }
    };
  }
} // toggleBackgroundColors

function toggleBackgroundWhite(chart) {
  if (chart.config) {
    chart.config.plugins[0].beforeDraw = (chart) => {
      const {
        ctx,
        chartArea: { left, top, width, bottom },
        scales: { x, y },
      } = chart;
      const endTop = y.getPixelForValue(Infinity);
      const endMid = y.getPixelForValue(0);

      ctx.save();

      ctx.fillStyle = "white";
      ctx.fillRect(left, top, width, endTop - top);
      ctx.fillStyle = "white";
      ctx.fillRect(left, endTop, width, endMid - endTop);
      ctx.fillStyle = "white";
      ctx.fillRect(left, endMid, width, bottom - endMid);
      ctx.restore();
    };
  } // chart.config
} // toggleBackgroundWhite

// CONFIGURE ALL SETTINGS

const configure = document.getElementById("configure");

configure.addEventListener("click", () => {
  container.style.opacity = ".25";
  uploading.style.display = "block";

  setTimeout(() => {
    //console.log('clickApiCall()')
    clickApiCall(); // Calls to the API

    setTimeout(() => {
      container.style.opacity = "1";
      uploading.style.display = "none";

      updateYearChart();
    }, 2500);
  }, 500); //setTimeout
});
