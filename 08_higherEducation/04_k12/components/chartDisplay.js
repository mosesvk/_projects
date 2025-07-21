const displayEnrollmentComponent = () => {
  // console.log('displayEnrollmentComponent()');

  const savedData = getStoredData("enrollmentData");
  const parseData = parseStoredData(savedData);

  // studentAverageEnrollment
  createChartFromParsedData(
    parseData,
    "studentAverageEnrollment_chart",
    "studentAverageEnrollment_Peer",
    "studentAverageEnrollment_Client",
    "number",
    0,
    "studentAverageEnrollment"
  );
  // studentFacilityRatio
  createChartFromParsedData(
    parseData,
    "studentFacilityRatio_chart",
    "studentFacilityRatio_Peer",
    "studentFacilityRatio_Client",
    "number",
    1,
    "studentFacilityRatio"
  );

  const expendableReserves_inDays_benchmark = [
    "Expendable Reserves in Days Benchmark",
    "We believe that a reasonable benchmark is between 30 - 60 range.",
  ];
  createBenchmark(expendableReserves_inDays_benchmark, "row_expendableReserves_inDays");

  const expendableReserves_Percent_benchmark = [
    "Expendable Reserves - Percent Benchmark",
    "We believe that a reasonable benchmark is between 10% - 20% range.",
  ];
  createBenchmark(expendableReserves_Percent_benchmark, "row_expendableReserves_Percent");

  const liquidityRatio_benchmark = [
    "Liquidity Ratio Benchmark",
    "We believe that a reasonable benchmark Greater than or Equal to 5",
  ];
  createBenchmark(liquidityRatio_benchmark, "row_liquidityRatio");



  closeSidebarAfterSelectingOption("enrollment");
};

const displayCashComponent = () => {
  const savedData = getStoredData("cashData");
  const parseData = parseStoredData(savedData);

  // expendableReserves_inDays
  createChartFromParsedData(
    parseData,
    "expendableReserves_inDays_chart",
    "expendableReserves_inDays_Peer",
    "expendableReserves_inDays_Client",
    "number",
    0,
    "expendableReserves_inDays"
  );

  // expendableReserves_Percent
  createChartFromParsedData(
    parseData,
    "expendableReserves_Percent_chart",
    "expendableReserves_Percent_Peer",
    "expendableReserves_Percent_Client",
    "percent",
    0,
    "expendableReserves_Percent"
  );

  // liquidityRatio
  createChartFromParsedData(
    parseData,
    "liquidityRatio_chart",
    "liquidityRatio_Peer",
    "liquidityRatio_Client",
    "number",
    1,
    "liquidityRatio"
  );

  // daysCashOnHand
  createChartFromParsedData(
    parseData,
    "daysCashOnHand_chart",
    "daysCashOnHand_Peer",
    "daysCashOnHand_Client",
    "number",
    0,
    "daysCashOnHand"
  );

  closeSidebarAfterSelectingOption("cash");
};

const displayAssetComponent = () => {
  const savedData = getStoredData("assetData");
  const parseData = parseStoredData(savedData);

  // netTuitionARasPercentCurrentAssets
  createChartFromParsedData(
    parseData,
    "netTuitionARasPercentCurrentAssets_chart",
    "netTuitionARasPercentCurrentAssets_Peer",
    "netTuitionARasPercentCurrentAssets_Client",
    "number",
    1,
    "netTuitionARasPercentCurrentAssets"
  );

  closeSidebarAfterSelectingOption("asset");
};

const displayDebtComponent = () => {
  const savedData = getStoredData("debtData");
  const parseData = parseStoredData(savedData);

  // currentRatio
  createChartFromParsedData(
    parseData,
    "currentRatio_chart",
    "currentRatio_Peer",
    "currentRatio_Client",
    "number",
    1,
    "currentRatio"
  );

  // debtPerStudent
  createChartFromParsedData(
    parseData,
    "debtPerStudent_chart",
    "debtPerStudent_Peer",
    "debtPerStudent_Client",
    "number",
    1,
    "debtPerStudent"
  );

  // debtCoverage
  createChartFromParsedData(
    parseData,
    "debtCoverage_chart",
    "debtCoverage_Peer",
    "debtCoverage_Client",
    "number",
    1,
    "debtCoverage"
  );

  // debtToNetAssets
  createChartFromParsedData(
    parseData,
    "debtToNetAssets_chart",
    "debtToNetAssets_Peer",
    "debtToNetAssets_Client",
    "number",
    1,
    "debtToNetAssets"
  );

  const currentRatio_benchmark = [
    "Current Ratio Benchmark",
    "We believe that a reasonable benchmark is Less than .6",
  ];
  createBenchmark(currentRatio_benchmark, "row_currentRatio");

  const currentLiabilitiesToAvailableNetAssets_benchmark = [
    "Current Liabilities to Available Net Assets Benchmark",
    "We believe that a reasonable benchmark is Less than .6",
  ];
  createBenchmark(currentLiabilitiesToAvailableNetAssets_benchmark, "row_currentLiabilitiesToAvailableNetAssets");

  closeSidebarAfterSelectingOption("debt");
};

const displayIncomeComponent = () => {
  const savedData = getStoredData("incomeData");
  const parseData = parseStoredData(savedData);

  // netIncomeRatio
  createChartFromParsedData(
    parseData,
    "netIncomeRatio_chart",
    "netIncomeRatio_Peer",
    "netIncomeRatio_Client",
    "number",
    1,
    "netIncomeRatio"
  );

  // grossTuition
  createChartFromParsedData(
    parseData,
    "grossTuition_chart",
    "grossTuition_Peer",
    "grossTuition_Client",
    "dollar",
    1,
    "grossTuition"
  );


  // financialAssistanceAsPercentTuitionAndFees
  createChartFromParsedData(
    parseData,
    "financialAssistanceAsPercentTuitionAndFees_chart",
    "financialAssistanceAsPercentTuitionAndFees_Peer",
    "financialAssistanceAsPercentTuitionAndFees_Client",
    "number", 
    1,
    "financialAssistanceAsPercentTuitionAndFees"
  );


  const netIncomeRatio_benchmark = [
    "Net Income Benchmark",
    "We believe that a reasonable benchmark is Greater than or equal to .6",
  ];
  createBenchmark(netIncomeRatio_benchmark, "row_netIncomeRatio");

  const netIncomeRatioExcludingDepreciation_benchmark = [
    "Net Income Ratio (Excluding Depreciation) Benchmark",
    "We believe that a reasonable benchmark is Greater than or equal to .6",
  ];
  createBenchmark(netIncomeRatioExcludingDepreciation_benchmark, "row_netIncomeRatioExcludingDepreciation");

  const percentAverageTuitionIncreaseBetweenYears_benchmark = [
    "Percentage of Average Tuition Increase Between Years Benchmark",
    "We believe that a reasonable benchmark is a Positive Yearly Trend",
  ];
  createBenchmark(percentAverageTuitionIncreaseBetweenYears_benchmark, "row_percentAverageTuitionIncreaseBetweenYears");

  closeSidebarAfterSelectingOption("income");
};

const displayExpenseComponent = () => {
  const savedData = getStoredData("expenseData");
  const parseData = parseStoredData(savedData);

  // salariesBenefitsTeachersAsPercentNetTuition_SalariesAndBenefits
  createChartFromParsedData(
    parseData,
    "salariesBenefitsTeachersAsPercentNetTuition_SalariesAndBenefits_chart",
    "salariesBenefitsTeachersAsPercentNetTuition_SalariesAndBenefits_Peer",
    "salariesBenefitsTeachersAsPercentNetTuition_SalariesAndBenefits_Client",
    "number",
    1,
    "salariesBenefitsTeachersAsPercentNetTuition_SalariesAndBenefits"
  );

  closeSidebarAfterSelectingOption("expense");
};
