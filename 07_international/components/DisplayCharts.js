displayCashComponent = (data) => {
  const savedData = getStoredData("cashData");
  const parseData = parseStoredData(savedData);

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

  // daysExpensesInUnrestrictedNA
  createChartFromParsedData(
    parseData,
    "daysExpensesInUnrestrictedNA_chart",
    "daysExpensesInUnrestrictedNA_Peer",
    "daysExpensesInUnrestrictedNA_Client",
    "number",
    0,
    "daysExpensesInUnrestrictedNA"
  );

  // totalCoverageRatio
  createChartFromParsedData(
    parseData,
    "totalCoverageRatio_chart",
    "totalCoverageRatio_Peer",
    "totalCoverageRatio_Client",
    "number",
    0,
    "totalCoverageRatio"
  );
};
