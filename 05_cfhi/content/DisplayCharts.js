const displayDemoComponent = () => {
  const savedData = getStoredData("demoData");
  const parseData = parseStoredData(savedData);

  // givingUnits
  createChartFromParsedData(
    parseData,
    "givingUnits_chart",
    "givingUnits_Peer",
    "givingUnits_Client",
    "number",
    0,
    "givingUnits"
  );
  // attendeesToStaff
  createChartFromParsedData(
    parseData,
    "attendeesToStaff_chart",
    "attendeesToStaff_Peer",
    "attendeesToStaff_Client",
    "number",
    0,
    "attendeesToStaff"
  );

  closeSidebarAfterSelectingOption("demo");
};

const displayCashComponent = () => {
  const savedData = getStoredData("cashData");
  const parseData = parseStoredData(savedData);

  // daysExpendableNetAssets
  createChartFromParsedData(
    parseData,
    "daysExpendableNetAssets_chart",
    "daysExpendableNetAssets_Peer",
    "daysExpendableNetAssets_Client",
    "number",
    0,
    "daysExpendableNetAssets"
  );

    // daysOperatingCash
    createChartFromParsedData(
      parseData,
      "daysOperatingCash_chart",
      "daysOperatingCash_Peer",
      "daysOperatingCash_Client",
      "number",
      0,
      "daysOperatingCash"
    );

    // availableDaysOfCashFlow
    createChartFromParsedData(
      parseData,
      "availableDaysOfCashFlow_chart",
      "availableDaysOfCashFlow_Peer",
      "availableDaysOfCashFlow_Client",
      "number",
      0,
      "availableDaysOfCashFlow"
    );

    // liquidityRatio
    createChartFromParsedData(
      parseData,
      "liquidityRatio_chart",
      "liquidityRatio_Peer",
      "liquidityRatio_Client",
      "number",
      0,
      "liquidityRatio"
    );

    // netCashAvailability
    createChartFromParsedData(
      parseData,
      "netCashAvailability_chart",
      "netCashAvailability_Peer",
      "netCashAvailability_Client",
      "number",
      0,
      "netCashAvailability"
    );

    

  closeSidebarAfterSelectingOption("cash");
};

const displayAssetComponent = () => {
  // const savedData = getStoredData('assetData');
  // const parseData = parseStoredData(savedData);

  // // netTuitionARasPercentCurrentAssets
  // createChartFromParsedData(
  //   parseData,
  //   'netTuitionARasPercentCurrentAssets_chart',
  //   'netTuitionARasPercentCurrentAssets_Peer',
  //   'netTuitionARasPercentCurrentAssets_Client',
  //   'number',
  //   1,
  //   'netTuitionARasPercentCurrentAssets'
  // );

  closeSidebarAfterSelectingOption("asset");
};

const displayDebtComponent = () => {
  // const savedData = getStoredData('debtData');
  // const parseData = parseStoredData(savedData);

  // // currentRatio
  // createChartFromParsedData(
  //   parseData,
  //   'currentRatio_chart',
  //   'currentRatio_Peer',
  //   'currentRatio_Client',
  //   'number',
  //   1,
  //   'currentRatio'
  // );

  closeSidebarAfterSelectingOption("debt");
};

const displayIncomeComponent = () => {
  // const savedData = getStoredData('incomeData');
  // const parseData = parseStoredData(savedData);

  // // netIncomeRatio
  // createChartFromParsedData(
  //   parseData,
  //   'netIncomeRatio_chart',
  //   'netIncomeRatio_Peer',
  //   'netIncomeRatio_Client',
  //   'number',
  //   1,
  //   'netIncomeRatio'
  // );

  // // grossTuition
  // createChartFromParsedData(
  //   parseData,
  //   'grossTuition_chart',
  //   'grossTuition_Peer',
  //   'grossTuition_Client',
  //   'number',
  //   1,
  //   'grossTuition'
  // );

  closeSidebarAfterSelectingOption("income");
};

const displayExpenseComponent = () => {
  // const savedData = getStoredData('expenseData');
  // const parseData = parseStoredData(savedData);

  // // salariesBenefitsTeachersAsPercentNetTuition_SalariesAndBenefits
  // createChartFromParsedData(
  //   parseData,
  //   'salariesBenefitsTeachersAsPercentNetTuition_SalariesAndBenefits_chart',
  //   'salariesBenefitsTeachersAsPercentNetTuition_SalariesAndBenefits_Peer',
  //   'salariesBenefitsTeachersAsPercentNetTuition_SalariesAndBenefits_Client',
  //   'number',
  //   1,
  //   'salariesBenefitsTeachersAsPercentNetTuition_SalariesAndBenefits'
  // );

  closeSidebarAfterSelectingOption("expense");
};
