// DOM Event Handlers
document.addEventListener("DOMContentLoaded", () => {
  getRecordsForUniqueClientPeerNames();
  addUniqueRegionsToOptionsSelectRegionsDropdown(regions_Array);
  addUniqueTypesToOptionsSelectTypeDropdown(types_Array);
});

window.addEventListener("beforeunload", () => {
  localStorage.clear();
});

// Initialize client data
function initClientData() {
  let apiCallClientDataForUniqueYears = {
    act: "API_DoQuery",
    query: `{29.EX.${ClientRid}}`,
    clist: "29.191.31",
  };

  return $.get(clientData, apiCallClientDataForUniqueYears)
    .then(async (xml) => {
      const recordsClient = await $("record", xml).toArray();
      const firmName = recordsClient[0].children[2].innerHTML;
      document.querySelector("#firmName").textContent = firmName;

      if (recordsClient.length > 0) {
        findUniqueYears(recordsClient);
      } else {
        console.error(
          "No records found from this client for the specific years. Maybe check the spelling of clientrid and not clientRid"
        );
      }
    })
    .catch((err) => console.error(err));
}

// Run button setup
const setupRunButton = () => {
  const run_btn = document.querySelector("#run");
  run_btn.addEventListener("click", async () => {
    // Reset client and peer records
    dataStore.recordClientHTMLArray.length = 0;
    dataStore.recordPeerHTMLArray.length = 0;
    
    try {
      toggleButtonLoadingState(run_btn);
      const selectedYears = processSelectedYears();
      saveSelectedYearsToLocalStorage(selectedYears);

      const recordsPeer = await getRecordsForPeer(selectedYears, "<qdbapi>");
      countUniqueClients(recordsPeer);

      const recordsClient = await getRecordsForClient(selectedYears, "<qdbapi>");

      processApiCalls(selectedYears, recordsPeer, recordsClient);
      displayComponents();
    } catch (err) {
      console.error(err);
    } finally {
      toggleButtonNormalState(run_btn);
    }
  });
};

// Find unique years
const findUniqueYears = (data) => {
  if (!data) return;
  
  data.forEach((item) => {
    const yearElement = item.querySelector("fiscal_ye_date_formatted_year");
    if (yearElement) {
      const year = yearElement.textContent;
      
      // Check if the year is not already in yearsData_Array to ensure uniqueness
      if (!dataStore.yearsData_Array.includes(year)) {
        dataStore.yearsData_Array.push(year);
      }
    }
  });

  dataStore.yearsData_Array.sort();
  
  // Update dropdown
  addUniqueYearsToOptionsSelectDropdown(dataStore.yearsData_Array);
};

// Data Processing Functions
const processApiCalls = (selectedYears, recordsPeer, recordsClient) => {
  const processors = [
    processGeneralData,
    processCashData,
    processAssetData,
    processIncomeData,
    processExpenseData,
    processMiscData
  ];
  
  processors.forEach(processor => {
    processor(selectedYears, recordsPeer, recordsClient);
  });
};

// Display Components
const displayComponents = () => {
  const components = [
    displayGeneralComponent,
    displayCashComponent,
    // displayAssetComponent, // Currently commented out in original code
    displayIncomeComponent,
    displayExpenseComponent,
    displayReportComponent
  ];
  
  components.forEach(component => component());
};

// API Data Retrieval
const getRecordsForPeer = async (years, dataStr) => {
  if (years.length === 0) {
    // Base case: return the final string when the array is empty
    return getParsedData(dataStr + "</qdbapi>");
  }

  const currentYear = years[0];
  
  const apiCallPeerData = {
    act: "API_DoQuery",
    query: `
      (${getRegionQuery(selectedRegions_Array)}) AND
      (${getTypeQuery(selectedTypes_Array)}) AND
      {301.EX.${currentYear}}
    `,
    clist:
      "301.59.60.62.63.64.66.261.302.262.303.211.227.231.118.263.304.197.264.305.198.199.265.306.209.208.220.266.307.195.196.267.308.251.268.309.269.310.219.205.208.196.228.220.270.311.274.312.198.199.209.275.313.197.208.220.209.276.314.277.315.240.241.206.207.280.316.200.201.281.317.282.318.239.283.319.238.284.320.225.285.321.204.287.322.202.227.288.323.203.289.324.204.290.325.242.291.326.204.200.201.292.327.227.239.293.328.238.294.329.225.295.330.215.225.296.331.297.332.250.201.298.333.222.231.122.344.334.306.347.343.346.244.205.341.342.344.345.348",
  };

  try {
    const xml = await $.get(peerData, apiCallPeerData);
    const recordsForPeer = $("record", xml).toArray();

    // Process records and update dataStr
    recordsForPeer.forEach(record => {
      const newRecord = document.createElement("record");
      
      Array.from(record.children).forEach(child => {
        newRecord.appendChild(child.cloneNode(true));
      });

      dataStore.recordPeerHTMLArray.push(newRecord.outerHTML);
      dataStr += newRecord.outerHTML;
    });

    // Recursive call with updated years and dataStr
    return getRecordsForPeer(years.slice(1), dataStr);
  } catch (error) {
    console.error("Error fetching peer data:", error);
    return dataStr; // Return the accumulated data so far even in case of an error
  }
};

const getRecordsForClient = async (years, dataStr) => {
  if (years.length === 0) {
    // Base case: return the final string when the array is empty
    return getParsedData(dataStr + "</qdbapi>");
  }

  const currentYear = years[0];
  const apiCallClientData = {
    act: "API_DoQuery",
    query: `
    {192.EX.${currentYear}} AND
    {29.EX.${ClientRid}}`,
    clist:
      "29.192.157.158.159.160.141.142.143.144.145.146.147.148.149.185.186.187.212.189.188.150.161.162.163.164.165.166.167.168.169.170.171.172.42.173.174.175.176.177.178.179.180.181.182.183.184.31.213.42",
  };

  try {
    const xml = await $.get(clientData, apiCallClientData);
    const recordsForClient = $("record", xml).toArray();

    // Process records and update dataStr
    recordsForClient.forEach(record => {
      const newRecord = document.createElement("record");
      
      Array.from(record.children).forEach(child => {
        newRecord.appendChild(child.cloneNode(true));
      });

      dataStore.recordClientHTMLArray.push(newRecord.outerHTML);
      dataStr += newRecord.outerHTML;
    });

    // Recursive call with updated years and dataStr
    return getRecordsForClient(years.slice(1), dataStr);
  } catch (error) {
    console.error("Error fetching client data:", error);
    return dataStr; // Return the accumulated data so far even in case of an error
  }
};

const getRecordsForUniqueClientPeerNames = async () => {
  const apiCallPeerData = {
    act: "API_DoQuery",
    clist: "301.59",
  };

  try {
    const xml = await $.get(peerData, apiCallPeerData);
    const recordsForPeerUniqueClientPeerNames = $("record", xml).toArray();
    const uniquePeerClientNames = new Set();

    recordsForPeerUniqueClientPeerNames.forEach(record => {
      const clientInformalName = record.querySelector(
        "pe___client_informal_name"
      ).textContent;
      uniquePeerClientNames.add(clientInformalName);
    });

    const sortedUniquePeerClientNames = Array.from(uniquePeerClientNames).sort();
    sortedUniquePeerClientNames.forEach(item => selectedClients_Array.add(item));
    
    addUniqueClientsToOptionsSelectClientDropdown(sortedUniquePeerClientNames);
  } catch (error) {
    console.error("Error fetching unique client names:", error);
  }
};

// Query Builder Helper Functions
function getRegionQuery(selectedRegions) {
  const regionConditions = [...selectedRegions]
    .map((region) => `{122.EX.${region}}`)
    .join(" OR ");
  return `(${regionConditions})`;
}

function getTypeQuery(selectedTypes) {
  const typeConditions = [...selectedTypes]
    .map((type) => `{334.EX.${type}}`)
    .join(" OR ");
  return `(${typeConditions})`;
}

function getClientQuery(selectedClients) {
  const clientConditions = [...selectedClients]
    .map((client) => `{59.EX.'${client}'}`)
    .join(" OR ");
  return `(${clientConditions})`;
}

// Data Insertion Function
const insertDataIntoObject = (
  type,
  year,
  object,
  dataKey,
  record,
  child,
  dynamicValueClientPeer,
  name
) => {
  const innerData =
    !child || child == 0
      ? 0
      : record.querySelector(child)?.innerHTML.split("").length > 0
      ? record.querySelector(child).innerHTML.trim()
      : 0;

  if (type === "client") {
    if (!object[dataKey]) {
      object[dataKey] = {};
    }
    if (!object[dataKey][year]) {
      object[dataKey][year] = {};
    }
    object[dataKey][year].value = innerData;
    const benchmarkField =
      dynamicValueClientPeer &&
      record.querySelector(dynamicValueClientPeer)?.textContent.trim();
    object[dataKey][year].benchmark = benchmarkField;
  } else {
    // type === 'peer'
    const yesNoField =
      dynamicValueClientPeer == "Yes"
        ? "Yes"
        : dynamicValueClientPeer &&
          record.querySelector(dynamicValueClientPeer)?.textContent.trim();

    if (yesNoField == "Yes") {
      if (!object[dataKey]) {
        object[dataKey] = {};
      }
      if (!object[dataKey][year]) {
        object[dataKey][year] = [];
      }

      if (!name) {
        if (!object[dataKey]["total"]) {
          object[dataKey]["total"] = [];
        }
        object[dataKey]["total"].push(innerData);
      } else {
        if (!object[dataKey][name]) {
          object[dataKey][name] = {};
        }
        if (!object[dataKey][name]["total"]) {
          object[dataKey][name]["total"] = [];
        }
        if (!object[dataKey][name][year]) {
          object[dataKey][name][year] = [];
        }
        object[dataKey][name]['total'].push(innerData);
        object[dataKey][name][year].push(innerData);
      }

      object[dataKey][year].push(innerData);
    }
  }
};

// Process data functions
const processGeneralData = (years, recordsPeer, recordsClient) => {
  const object = {};

  years.forEach((year) => {
    const filteredPeerRecords = filterRecordsByYear(recordsPeer, year);
    const filteredClientRecords = filterRecordsByYear(recordsClient, year);

    filteredPeerRecords.forEach((record) => {
      // givingUnits
      insertDataIntoObject("peer", year, object, "givingUnits_Peer", record, "0");
      // missionaryUnit
      insertDataIntoObject("peer", year, object, "missionaryUnit_Peer", record, "0");
      // numberOfEmployeesFTE
      insertDataIntoObject("peer", year, object, "numberOfEmployeesFTE_Peer", record, "0");
      // itExpenses
      insertDataIntoObject("peer", year, object, "itExpenses_Peer", record, "c01_04_ratio_it_expenses", "c01_04_yes_no_it_expenses");
    });

    filteredClientRecords.forEach((record) => {
      // givingUnits
      insertDataIntoObject("client", year, object, "givingUnits_Client", record, "c01_01_ratio_giving_units");
      // missionaryUnit
      insertDataIntoObject("client", year, object, "missionaryUnit_Client", record, "c01_02_ratio_missionary_unit");
      // numberOfEmployeesFTE
      insertDataIntoObject("client", year, object, "numberOfEmployeesFTE_Client", record, "c01_03_ratio_number_of_employees_fte");
      // itExpenses
      insertDataIntoObject("client", year, object, "itExpenses_Client", record, "c01_04_ratio_it_expenses");
    });
  });

  localStorage.setItem("generalData", JSON.stringify(object));
};

const processCashData = (years, recordsPeer, recordsClient) => {
  const object = {};

  years.forEach((year) => {
    const filteredPeerRecords = filterRecordsByYear(recordsPeer, year);
    const filteredClientRecords = filterRecordsByYear(recordsClient, year);

    filteredPeerRecords.forEach((record) => {
      // Cash data metrics for peer
      processPeerCashMetrics(year, object, record);
    });

    filteredClientRecords.forEach((record) => {
      // Cash data metrics for client
      processClientCashMetrics(year, object, record);
    });
  });

  localStorage.setItem("cashData", JSON.stringify(object));
};

// Helper function to process peer cash metrics
function processPeerCashMetrics(year, object, record) {
  const metrics = [
    { 
      key: "daysCashOnHand_Peer", 
      field: "c02_01_ratio_days_cash_on_hand", 
      flag: "c02_01_yes_no_days_cash_on_hand",
      subFields: [
        { key: "cashAndCashEquivalents", field: "_01__01ass___01_cash_and_cash_equivalents" },
        { key: "totalExpenses", field: "_02_03exp___05_total_expenses" },
        { key: "depreciationAndAmortization", field: "_04_01fexp___06_depreciation_and_amortization" }
      ]
    },
    { 
      key: "daysExpensesInUnrestrictedNA_Peer", 
      field: "c02_02_ratio_days_expenses_in_unrestricted_na", 
      flag: "c02_02_yes_no_days_expenses_in_unrestricted_na",
      subFields: [
        { key: "netAssetsWithoutDR", field: "_01__03na___01_net_assets_without_donor_restrictions" },
        { key: "totalExpenses", field: "_02_03exp___05_total_expenses" }
      ]
    },
    // Additional metrics following same pattern...
    { 
      key: "daysExpensesInUnrestrictedNA_excludingPPE_Peer", 
      field: "c02_02a_ratio_days_expenses_in_unrestricted_na_less_ppe", 
      flag: "c02_02a_yes_no_days_expenses_in_unrestricted_na_less_ppe",
      subFields: [
        { key: "netAssetsWithoutDR", field: "_01__03na___01_net_assets_without_donor_restrictions" },
        { key: "propertyPlantAndEquipment", field: "_01__01ass___09_property__plant_and_equipment" },
        { key: "notesPayable", field: "_01__02liab___02_notes_payable" },
        { key: "totalExpenses", field: "_02_03exp___05_total_expenses" }
      ]
    },
    // ... rest of the cash metrics
  ];

  // Process each metric
  metrics.forEach(metric => {
    insertDataIntoObject("peer", year, object, metric.key, record, metric.field, metric.flag);
    
    // Process sub-fields if any
    if (metric.subFields && metric.name) {
      metric.subFields.forEach(subField => {
        insertDataIntoObject(
          "peer", year, object, subField.key, record, subField.field, metric.flag, metric.name
        );
      });
    }
  });

  // Basic metrics that don't need sub-processing
  ["cashFlowsTrendFinancing_Peer", "cashFlowsTrendInvesting_Peer", 
   "cashFlowsTrendOperating_Peer", "cashFlowsTrendTotal_Peer"].forEach(key => {
    insertDataIntoObject("peer", year, object, key, record, "0");
  });
}

// Helper function to process client cash metrics
function processClientCashMetrics(year, object, record) {
  const metrics = [
    { key: "daysCashOnHand_Client", field: "c02_01_ratio_days_cash_on_hand" },
    { key: "daysExpensesInUnrestrictedNA_Client", field: "c02_02_ratio_days_expenses_in_unrestricted_na" },
    { key: "daysExpensesInUnrestrictedNA_excludingPPE_Client", field: "c02_02a_ratio_days_expenses_in_unrestricted_na_less_ppe" },
    { key: "daysExpensesInNAwithDR_Client", field: "c02_03_ratio_days_expenses_in_net_assets_with_dr" },
    { key: "daysExpensesInNAwithDR_excludingPPE_Client", field: "c02_04_ratio_days_expenses_in_net_assets_with_dr_excluding_ppe" },
    { key: "liquidityFundsAvailable_Client", field: "c02_05_ratio_liquidity_funds_available" },
    { key: "liquidityRatio_Client", field: "c02_06_ratio_financial_assets_available_in_next_fy_to_fund_annual_expenditures" },
    { key: "financialAssetsAvailableFY_Client", field: "c02_06_ratio_financial_assets_available_in_next_fy_to_fund_annual_expenditures" },
    { key: "daysFinancialAssetsOnHand_Client", field: "c02_07_ratio_days_financial_assets_on_hand_to_fund_expenditures" },
    { key: "currentRatio_Client", field: "c02_08_ratio_current_ratio" },
    { key: "totalCoverageRatio_Client", field: "c02_09_ratio_total_coverage_ratio" },
    { key: "cashFlowsTrendFinancing_Client", field: "c02_10a_ratio_cash_flows_trend___financing" },
    { key: "cashFlowsTrendInvesting_Client", field: "c02_10b_ratio_cash_flows_trend___investing" },
    { key: "cashFlowsTrendOperating_Client", field: "c02_10c_ratio_cash_flows_trend___operating" },
    { key: "cashFlowsTrendTotal_Client", field: "_03_01cashflow___total" }
  ];

  metrics.forEach(metric => {
    insertDataIntoObject("client", year, object, metric.key, record, metric.field);
  });
}

const processAssetData = (years, recordsPeer, recordsClient) => {
  const object = {};

  years.forEach((year) => {
    const filteredPeerRecords = filterRecordsByYear(recordsPeer, year);
    const filteredClientRecords = filterRecordsByYear(recordsClient, year);

    filteredPeerRecords.forEach((record) => {
      processPeerAssetMetrics(year, object, record);
    });

    filteredClientRecords.forEach((record) => {
      processClientAssetMetrics(year, object, record);
    });
  });

  localStorage.setItem("assetData", JSON.stringify(object));
};

function processPeerAssetMetrics(year, object, record) {
  // percentWithDR
  insertDataIntoObject(
    "peer", year, object, "percentWithDR_Peer", record,
    "c03_01_ratio_percent_with_donor_restrictions",
    "c03_01_yes_no_percent_with_donor_restrictions"
  );
  insertDataIntoObject(
    "peer", year, object, "netAssetsWithDRByPurposeOrTime", record,
    "_01__03na___02_net_assets_with_donor_restrictions_by_purpose_or_time",
    "c03_01_yes_no_percent_with_donor_restrictions", "percentWithDR"
  );
  insertDataIntoObject(
    "peer", year, object, "netAssetsWithDRInPerpetuity", record,
    "_01__03na___03_net_assets_with_donor_restrictions_in_perpetuity",
    "c03_01_yes_no_percent_with_donor_restrictions", "percentWithDR"
  );
  insertDataIntoObject(
    "peer", year, object, "totalNetAssets", record,
    "_01__03na___04_total_net_assets",
    "c03_01_yes_no_percent_with_donor_restrictions", "percentWithDR"
  );

  // percentWithoutDR_excludingPPE
  insertDataIntoObject(
    "peer", year, object, "percentWithoutDR_excludingPPE_Peer", record,
    "c03_02_ratio_percent_without_donor_restrictions_excluding_net_investment_in_ppe",
    "c03_02_yes_no_percent_without_donor_restrictions_excluding_net_investment_in_ppe"
  );
  // ... other sub-fields for percentWithoutDR_excludingPPE

  // percentWithoutDR
  insertDataIntoObject(
    "peer", year, object, "percentWithoutDR_Peer", record,
    "c03_03_ratio_percent_without_donor_restrictions",
    "c03_03_yes_no_percent_without_donor_restrictions"
  );
  // ... other sub-fields for percentWithoutDR
}

function processClientAssetMetrics(year, object, record) {
  // percentWithDR
  insertDataIntoObject(
    "client", year, object, "percentWithDR_Client", record,
    "c03_01_ratio_percent_with_donor_restrictions"
  );

  // percentWithoutDR_excludingPPE
  insertDataIntoObject(
    "client", year, object, "percentWithoutDR_excludingPPE_Client", record,
    "c03_02_ratio_percent_without_donor_restrictions_excluding_net_investment_in_ppe"
  );

  // percentWithoutDR
  insertDataIntoObject(
    "client", year, object, "percentWithoutDR_Client", record,
    "c03_03_ratio_percent_without_donor_restrictions"
  );
}

const processIncomeData = (years, recordsPeer, recordsClient) => {
  const object = {};

  years.forEach((year) => {
    const filteredPeerRecords = filterRecordsByYear(recordsPeer, year);
    const filteredClientRecords = filterRecordsByYear(recordsClient, year);

    filteredPeerRecords.forEach((record) => {
      // Income data metrics for peer
      processPeerIncomeMetrics(year, object, record);
    });

    filteredClientRecords.forEach((record) => {
      // Income data metrics for client
      processClientIncomeMetrics(year, object, record);
    });
  });

  localStorage.setItem("incomeData", JSON.stringify(object));
};

const processExpenseData = (years, recordsPeer, recordsClient) => {
  const object = {};

  years.forEach((year) => {
    const filteredPeerRecords = filterRecordsByYear(recordsPeer, year);
    const filteredClientRecords = filterRecordsByYear(recordsClient, year);

    filteredPeerRecords.forEach((record) => {
      // Expense data metrics for peer
      processPeerExpenseMetrics(year, object, record);
    });

    filteredClientRecords.forEach((record) => {
      // Expense data metrics for client
      processClientExpenseMetrics(year, object, record);
    });
  });

  localStorage.setItem("expenseData", JSON.stringify(object));
};

const processMiscData = (years, recordsPeer, recordsClient) => {
  const object = {};

  years.forEach((year) => {
    const filteredPeerRecords = filterRecordsByYear(recordsPeer, year);
    const filteredClientRecords = filterRecordsByYear(recordsClient, year);

    filteredPeerRecords.forEach((record) => {
      // percentageAssessmentOnRestrictedGifts
      insertDataIntoObject(
        "peer", year, object, "percentageAssessmentOnRestrictedGifts_Peer", record,
        "c06_01_ratio_percentage_assessment_on_restricted_gifts",
        "c06_01_yes_no_percentage_assessment_on_restricted_gifts"
      );
      insertDataIntoObject(
        "peer", year, object, "totalAdministrativeAssessments", record,
        "_02_02reclass___01_total_administrative_assessments",
        "c06_01_yes_no_percentage_assessment_on_restricted_gifts",
        "percentageAssessmentOnRestrictedGifts"
      );
      insertDataIntoObject(
        "peer", year, object, "contributionsWithDR", record,
        "_02_01sr___02_contributions_with_donor_restrictions",
        "c06_01_yes_no_percentage_assessment_on_restricted_gifts",
        "percentageAssessmentOnRestrictedGifts"
      );
    });

    filteredClientRecords.forEach((record) => {
      // percentageAssessmentOnRestrictedGifts
      insertDataIntoObject(
        "client", year, object, "percentageAssessmentOnRestrictedGifts_Client", record,
        "c06_01_ratio_percentage_assessment_on_restricted_gifts"
      );
    });
  });

  localStorage.setItem("miscData", JSON.stringify(object));
};

// Helper Functions
const filterRecordsByYear = (records, year) => {
  return [...records].filter((record) => {
    const fiscalYear = record.querySelector(
      "fiscal_ye_date_formatted_year_text"
    )?.textContent;
    return fiscalYear && fiscalYear.includes(year.toString());
  });
};

const getParsedData = (xmlString) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");
  return xmlDoc.querySelectorAll("record");
};

const countUniqueClients = (records) => {
  const uniqueClients = new Set();
  try {
    records.forEach((record) => {
      const mainRelatedClient = record.querySelector(
        "pe___client_legal_name"
      ).textContent;
      uniqueClients.add(mainRelatedClient);
    });

    const count = uniqueClients.size;
    document.getElementById("uniqueClients").textContent = count;
  } catch (error) {
    console.error("Error counting unique clients:", error);
    document.getElementById("uniqueClients").textContent = 0; // Set to 0 in case of error
  }
};

// UI Helper Functions
const toggleButtonLoadingState = (btn) => {
  btn.innerHTML = `
    <svg aria-hidden="true" role="status" class="inline w-6 h-6 me-3 text-xl colorGreen font-extrabold animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.
    `}