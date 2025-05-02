// Data Model and Business Logic Classes

// DataStore class for organizing and storing data
class DataStore {
  constructor() {
    // Define categories once
    this.categories = {
      // intl_api.js categories
      general: 'generalData',
      cash: 'cashData',
      asset: 'assetData', 
      income: 'incomeData',
      expense: 'expenseData',
      misc: 'miscData',
      
      // original Api.js categories  
      debtEndowment: 'debtEndowmentData',
      revenueExpense: 'revenueExpenseData',
      financialPosition: 'financialPositionData',
      financialStatement: 'financialStatementData',
      financialAnalysis: 'financialAnalysisData',
      doe: 'doeData',
      cfi: 'cfiData'
    };

    // Initialize data objects
    Object.values(this.categories).forEach(category => {
      this[category] = {};
    });
  }

  // Save all data categories to localStorage
  saveAllToLocalStorage() {
    Object.values(this.categories).forEach(category => {
      localStorage.setItem(category, JSON.stringify(this[category]));
    });
  }

  // Get a reference to the appropriate data object based on category
  getDataCategory(category) {
    const dataKey = this.categories[category];
    if (!dataKey) {
        throw new Error(`Unknown data category: ${category}`);
    }
    return this[dataKey];
  }

  // Insert data into the appropriate category
  insertData(
    category,
    type,
    year,
    dataKey,
    record,
    child,
    dynamicValueClientPeer,
    name
  ) {
    const targetData = this.getDataCategory(category);

    if (type === "client") {
      this.insertClientData(targetData, dataKey, year, record, child);
    } else {
      this.insertPeerData(targetData, dataKey, year, record, child, dynamicValueClientPeer, name);
    }
  }

  // Insert client data
  insertClientData(targetData, dataKey, year, record, benchmarkField) {
    if (!targetData || !dataKey || !year || !record) {
      console.warn("Missing required parameters for insertClientData");
      return;
    }

    const value = record.querySelector(benchmarkField)?.textContent.trim() || "0";

    if (!targetData[dataKey]) {
      targetData[dataKey] = {};
    }

    if (!targetData[dataKey][year]) {
      targetData[dataKey][year] = {};
    }

    targetData[dataKey][year].value = value;
  }

  // Insert peer data
  insertPeerData(targetData, dataKey, year, record, yesNoField, name) {
    if (!targetData || !dataKey || !year || !record) {
      console.warn("Missing required parameters for insertPeerData");
      return;
    }

    const value = record.querySelector(yesNoField)?.textContent.trim() || "0";
    const shouldInclude = !yesNoField || value === "Yes";

    if (!targetData[dataKey]) {
      targetData[dataKey] = {};
    }

    if (!targetData[dataKey][year]) {
      targetData[dataKey][year] = [];
    }

    if (shouldInclude) {
      targetData[dataKey][year].push(value);
    }

    // Store the client name if provided
    if (name && shouldInclude) {
      if (!targetData[dataKey].clientNames) {
        targetData[dataKey].clientNames = new Set();
      }
      targetData[dataKey].clientNames.add(name);
    }
  }

  // Clear all data
  clear() {
    Object.values(this.categories).forEach(category => {
      this[category] = {};
    });
  }
}

// Create a global dataStore instance
const dataStore = new DataStore();

// Add the DataProcessor class 
class DataProcessor {
  constructor(dataStore) {
    this.dataStore = dataStore;
  }

  // Main method to process all data categories
  async processAllData(years, recordsPeer, recordsClient) {
    if (!years || !recordsPeer || !recordsClient) {
      console.error("Missing required parameters for data processing");
      return;
    }

    try {
      await Promise.all([
        this.processDebtEndowmentData(years, recordsPeer, recordsClient),
        this.processRevenueExpenseData(years, recordsPeer, recordsClient),
        this.processFinancialPositionData(years, recordsPeer, recordsClient),
        this.processFinancialStatementData(recordsPeer, recordsClient),
        this.processFinancialAnalysisData(years, recordsPeer, recordsClient),
        this.processDoeData(years, recordsPeer, recordsClient),
        this.processCfiData(years, recordsPeer, recordsClient)
      ]);
    } catch (error) {
      console.error("Error processing data:", error);
      throw error;
    }
  }

  // Process debt and endowment data
  processDebtEndowmentData(years, recordsPeer, recordsClient) {
    const category = 'debtEndowment';
    const targetData = this.dataStore.getDataCategory(category);
    
    // Process client records
    recordsClient.forEach(record => {
      const year = record.querySelector('year')?.textContent;
      if (!years.includes(year)) return;
      
      // Process each benchmark field
      this.dataStore.insertClientData(
        targetData,
        'totalAssets',
        year,
        record.querySelector('field_390')?.textContent,
        record,
        'field_390'
      );
      // Add other fields similarly...
    });

    // Process peer records
    recordsPeer.forEach(record => {
      const year = record.querySelector('year')?.textContent;
      if (!years.includes(year)) return;
      
      this.dataStore.insertPeerData(
        targetData,
        'totalAssets',
        year,
        record.querySelector('field_390')?.textContent,
        record,
        'field_390'
      );
      // Add other fields similarly...
    });
  }

  // Process revenue expense data  
  processRevenueExpenseData(years, recordsPeer, recordsClient) {
    processRevenueExpenseContentData(years, recordsPeer, recordsClient);
  }

  // Process financial position data
  processFinancialPositionData(years, recordsPeer, recordsClient) {
    processFinancialPositionContentData(years, recordsPeer, recordsClient);
  }

  // Process financial statement data
  processFinancialStatementData(recordsPeer, recordsClient) {
    processFinancialStatementContentData(recordsPeer, recordsClient);
  }

  // Process financial analysis data
  processFinancialAnalysisData(years, recordsPeer, recordsClient) {
    processFinancialAnalysisContentData(years, recordsPeer, recordsClient);
  }

  // Process DOE data
  processDoeData(years, recordsPeer, recordsClient) {
    processDoeData(years, recordsPeer, recordsClient);
  }

  // Process CFI data
  processCfiData(years, recordsPeer, recordsClient) {
    processCfiData(years, recordsPeer, recordsClient);
  }

  // Helper method to filter records by fiscal year
  filterRecordsByYear(records, year) {
    if (!records) {
      console.warn("Records is null or undefined");
      return [];
    }

    const recordsArray = Array.isArray(records) ? records : Array.from(records);

    return recordsArray.filter((record) => {
      try {
        if (record && typeof record.querySelector === "function") {
          const fiscalYear = record.querySelector("year")?.textContent;
          return fiscalYear && fiscalYear.includes(year.toString());
        } else if (record && record.year) {
          const fiscalYear = record.year;
          return fiscalYear && fiscalYear.includes(year.toString());
        } else {
          console.warn("Unrecognized record format:", record);
          return false;
        }
      } catch (error) {
        console.error("Error filtering record by year:", error, record);
        return false;
      }
    });
  }
}

// Create a global dataProcessor instance
const dataProcessor = new DataProcessor(dataStore);

// API Service class for handling API calls
class ApiService {
  constructor() {
    this.recordClientHTMLArray = [];
    this.recordPeerHTMLArray = [];
    
    // Common API fields for both peer and client queries
    this.commonFields = "7.3.536.619.537.618.534.539.758.759.757.760.761.741.541.549.551.547.553";
    
    // Define API endpoints
    this.endpoints = {
      peer: peerData,
      client: clientData
    };
  }

  // Generic method to parse XML response
  parseXMLResponse(dataStr) {
    if (dataStr === "<qdbapi>") {
      console.warn("No records collected, returning empty array");
      return [];
    }

    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(dataStr + "</qdbapi>", "text/xml");
      return xmlDoc.querySelectorAll("record");
    } catch (error) {
      console.error("Error parsing XML:", error);
      return [];
    }
  }

  // Generic method to process records
  processRecords(records, recordArray, dataStr = "") {
    records.forEach(record => {
      const newRecord = document.createElement("record");
      Array.from(record.children).forEach(child => {
        newRecord.appendChild(child.cloneNode(true));
      });
      recordArray.push(newRecord.outerHTML);
      dataStr += newRecord.outerHTML;
    });
    return dataStr;
  }

  // Generic method to make API calls
  async makeApiCall(endpoint, params) {
    try {
      const xml = await $.get(endpoint, params);
      return $("record", xml).toArray();
    } catch (error) {
      console.error("API call error:", error);
      if (error.status) {
        console.error(`Status: ${error.status}, StatusText: ${error.statusText}`);
      }
      return [];
    }
  }

  // Retrieve records for peer data
  async getRecordsForPeer(years, dataStr = "<qdbapi>") {
    if (years.length === 0) {
      return this.parseXMLResponse(dataStr);
    }

    const currentYear = years[0];
    const queryCondition = `{7.EX.${currentYear}} AND {638.EX.'COMPLETE'}`;
    
    const apiCallPeerData = {
      act: "API_DoQuery",
      query: queryCondition,
      clist: this.commonFields
    };

    const records = await this.makeApiCall(this.endpoints.peer, apiCallPeerData);
    if (records.length > 0) {
      dataStr = this.processRecords(records, this.recordPeerHTMLArray, dataStr);
    } else {
      console.warn(`No peer records found for year ${currentYear}`);
    }

    return this.getRecordsForPeer(years.slice(1), dataStr);
  }

  // Retrieve records for client data
  async getRecordsForClient(years, dataStr = "<qdbapi>") {
    if (years.length === 0) {
      return this.parseXMLResponse(dataStr);
    }

    const currentYear = years[0];
    const apiCallClientData = {
      act: "API_DoQuery",
      query: `{7.EX.${currentYear}} AND {533.EX.${ClientRid}}`,
      clist: this.commonFields
    };

    const records = await this.makeApiCall(this.endpoints.client, apiCallClientData);
    dataStr = this.processRecords(records, this.recordClientHTMLArray, dataStr);

    return this.getRecordsForClient(years.slice(1), dataStr);
  }

  // Get the combined XML strings
  getPeerXmlString() {
    return "<qdbapi>" + this.recordPeerHTMLArray.join("") + "</qdbapi>";
  }

  getClientXmlString() {
    return "<qdbapi>" + this.recordClientHTMLArray.join("") + "</qdbapi>";
  }

  // Clear all records
  clearRecords() {
    this.recordClientHTMLArray = [];
    this.recordPeerHTMLArray = [];
  }
}

// Create a global apiService instance
const apiService = new ApiService();

// Application controller class to manage the overall flow
class AppController {
  constructor() {
    this.apiService = new ApiService();
    this.dataProcessor = new DataProcessor(dataStore);
    this.runButton = null;
    this._initialized = false;
    this.initializeEventListeners();
  }

  // Initialize event listeners
  initializeEventListeners() {
    if (this._initialized) {
      console.log("AppController already initialized");
      return;
    }

    this.runButton = document.getElementById("run");
    if (this.runButton) {
      // Remove any existing listeners to prevent duplicates
      const newRunButton = this.runButton.cloneNode(true);
      this.runButton.parentNode.replaceChild(newRunButton, this.runButton);
      this.runButton = newRunButton;
      this.runButton.addEventListener("click", this.handleRunButtonClick.bind(this));
    }

    this._initialized = true;
  }

  // Process and validate selected years
  processSelectedYears() {
    const selectedYears = Array.from(document.querySelectorAll('#years option:checked'))
      .map(option => option.value);

    if (!selectedYears || selectedYears.length === 0) {
      throw new Error("No years selected");
    }

    return selectedYears;
  }

  // Validate client selection
  validateClientSelection() {
    if (!window.selectedClients_Array || window.selectedClients_Array.size === 0) {
      throw new Error("No clients selected");
    }
  }

  // Fetch and process records
  async fetchRecords(selectedYears) {
    // Clear existing data
    this.apiService.clearRecords();

    // Fetch peer data
    const recordsPeer = await this.fetchPeerRecords(selectedYears);
    
    // Fetch client data
    const recordsClient = await this.fetchClientRecords(selectedYears);

    // Validate we have some data
    if ((!recordsPeer || recordsPeer.length === 0) && 
        (!recordsClient || recordsClient.length === 0)) {
      throw new Error("No data available for either peer or client");
    }

    return { recordsPeer, recordsClient };
  }

  // Fetch and process peer records
  async fetchPeerRecords(selectedYears) {
    try {
      let recordsPeer = await this.apiService.getRecordsForPeer(selectedYears);
      
      if (!recordsPeer || recordsPeer.length === 0) {
        console.warn("No peer records returned");
        return [];
      }

      if (typeof validateAndNormalizeRecords === "function") {
        recordsPeer = await validateAndNormalizeRecords(recordsPeer);
      }
      
      window.recordsPeer = recordsPeer;
      if (typeof countUniqueClients === "function") {
        countUniqueClients(recordsPeer);
      }

      return recordsPeer;
    } catch (error) {
      console.error("Error fetching peer data:", error);
      throw error;
    }
  }

  // Fetch and process client records
  async fetchClientRecords(selectedYears) {
    try {
      let recordsClient = await this.apiService.getRecordsForClient(selectedYears);

      if (!recordsClient || recordsClient.length === 0) {
        console.warn("No client records returned");
        return [];
      }

      if (typeof validateAndNormalizeRecords === "function") {
        recordsClient = await validateAndNormalizeRecords(recordsClient);
      }

      window.recordsClientSelectedYears = recordsClient;
      if (recordsClient.length > 0) {
        window.monthYearEnd = recordsClient[recordsClient.length - 1]
          .querySelector("fiscal_ye_date_formatted_month")?.textContent;
      }

      return recordsClient;
    } catch (error) {
      console.error("Error fetching client data:", error);
      throw error;
    }
  }

  // Handle the run button click
  async handleRunButtonClick() {
    console.log("handleRunButtonClick() called");

    try {
      if (typeof showApiLoadingFunction === "function") {
        showApiLoadingFunction("open", "api");
      }
      toggleButtonLoadingState(this.runButton);

      // Process and validate selected years
      const selectedYears = this.processSelectedYears();
      localStorage.setItem("selectedYears", JSON.stringify(selectedYears));

      // Validate client selection
      this.validateClientSelection();

      // Fetch and process records
      const { recordsPeer, recordsClient } = await this.fetchRecords(selectedYears);

      // Process all data
      await this.processAllData(selectedYears, recordsPeer || [], recordsClient || []);
      
      // Display components
      this.displayAllComponents();
      
    } catch (error) {
      console.error("Error in handleRunButtonClick:", error);
      if (typeof createToastWarning === "function") {
        createToastWarning(this.getErrorMessage(error));
      }
    } finally {
      if (typeof showApiLoadingFunction === "function") {
        showApiLoadingFunction("close");
      }
      toggleButtonNormalState(this.runButton);
    }
  }

  // Get appropriate error message based on error type
  getErrorMessage(error) {
    const errorMessages = {
      "No years selected": "Please select at least one year",
      "No clients selected": "Please select at least one client",
      "No data available for either peer or client": "No data retrieved. Try selecting fewer clients or different years.",
      "Error fetching peer data": "Error fetching peer data. Please try again or adjust your filters.",
      "Error fetching client data": "Error fetching client data. Please try again."
    };

    return errorMessages[error.message] || "An unexpected error occurred. Please try again.";
  }

  // Process all data
  async processAllData(years, recordsPeer, recordsClient) {
    try {
      await this.dataProcessor.processAllData(years, recordsPeer, recordsClient);
    } catch (error) {
      console.error("Error using dataProcessor:", error);
      this.processWithLegacyFunctions(years, recordsPeer, recordsClient);
    }
  }

  // Process data using legacy functions as fallback
  processWithLegacyFunctions(years, recordsPeer, recordsClient) {
    try {
      if (typeof processApiCalls === "function") {
        processApiCalls(years, recordsPeer, recordsClient);
      } else {
        // Call individual processing functions if they exist
        const processors = {
          cfi: processCfiData,
          doe: processDoeData,
          financialAnalysis: processFinancialAnalysisContentData,
          financialStatement: processFinancialStatementContentData,
          financialPosition: processFinancialPositionContentData,
          revenueExpense: processRevenueExpenseContentData,
          debtEndowment: processDebtEndowmentContentData
        };

        Object.entries(processors).forEach(([key, processor]) => {
          if (typeof processor === "function") {
            try {
              if (key === 'financialStatement') {
                processor(recordsPeer, recordsClient);
              } else {
                processor(years, recordsPeer, recordsClient);
              }
            } catch (e) {
              console.error(`Error processing ${key} data:`, e);
            }
          }
        });
      }
    } catch (error) {
      console.error("Error using legacy functions:", error);
      throw error;
    }
  }

  // Display all components
  displayAllComponents() {
    if (typeof displayComponents === "function") {
      displayComponents();
    }
  }
}

// Create a global appController instance
const appController = new AppController();

// Function to restore initial client selection
function restoreInitialClientSelection() {
  if (!window.clientDataStore) {
    console.warn("Client data store not initialized");
    return;
  }

  // Get all client checkboxes
  const clientCheckboxes = document.querySelectorAll(
    '#options-list-client input[type="checkbox"]'
  );

  // Get the select all checkbox
  const selectAllCheckbox = document.getElementById(
    "select-all-checkbox-client"
  );

  // Clear previous selections
  window.selectedClients_Array = window.selectedClients_Array || new Set();
  window.selectedClients_Array.clear();

  // Iterate through all clients and check them
  clientCheckboxes.forEach((checkbox) => {
    if (checkbox.id !== "select-all-checkbox-client") {
      checkbox.checked = true;
      const clientName = checkbox.value;
      if (clientName) {
        window.selectedClients_Array.add(clientName);
      }
    }
  });

  // Set select all checkbox to checked state
  if (selectAllCheckbox) {
    selectAllCheckbox.checked = true;
  }

  console.log("Client selection restored to initial state");
}

// Update the document ready event handler to use appController
document.addEventListener("DOMContentLoaded", () => {
  // Keep existing event listeners that are not related to run button
  if (typeof getRecordsForUniqueClientPeerNames === "function") {
    getRecordsForUniqueClientPeerNames();
  }

  // Initialize various dropdowns
  if (typeof addUniqueRegionsToOptionsSelectRegionsDropdown === "function") {
    addUniqueRegionsToOptionsSelectRegionsDropdown(regions_Array);
  }

  if (typeof addUniqueStatesToOptionsSelectStatesDropdown === "function") {
    addUniqueStatesToOptionsSelectStatesDropdown(states_Array);
  }

  if (typeof addUniqueMembershipsToOptionsSelectMembershipsDropdown === "function") {
    addUniqueMembershipsToOptionsSelectMembershipsDropdown(memberships_Array);
  }

  if (typeof addUniqueTypesToOptionsSelectTypesDropdown === "function") {
    addUniqueTypesToOptionsSelectTypesDropdown(types_Array);
  }

  if (typeof addUniqueAthleticsToOptionsSelectAthleticsDropdown === "function") {
    addUniqueAthleticsToOptionsSelectAthleticsDropdown(athletics_Array);
  }

  if (typeof addUniqueRegionalsToOptionsSelectRegionalsDropdown === "function") {
    addUniqueRegionalsToOptionsSelectRegionalsDropdown(regional_Array);
  }

  if (typeof addUniqueSeminariesToOptionsSelectSeminariesDropdown === "function") {
    addUniqueSeminariesToOptionsSelectSeminariesDropdown(seminary_Array);
  }
});

// Keep the existing insert function for backwards compatibility
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
  // Call the new dataStore method based on the category 
  // Determine category based on dataKey or object reference
  let category = "debtEndowment"; // Default
  
  if (dataKey.includes("revenueExpense")) {
    category = "revenueExpense";
  } else if (dataKey.includes("financialPosition")) {
    category = "financialPosition";
  } else if (dataKey.includes("financialStatement")) {
    category = "financialStatement";
  } else if (dataKey.includes("financialAnalysis")) {
    category = "financialAnalysis";
  } else if (dataKey.includes("doe")) {
    category = "doe";
  } else if (dataKey.includes("cfi")) {
    category = "cfi";
  }
  
  dataStore.insertData(
    category,
    type,
    year,
    dataKey,
    record,
    child,
    dynamicValueClientPeer,
    name
  );
  
  // Also update existing object for backwards compatibility
  const innerData = !child || child == 0
    ? 0
    : record.querySelector(child)?.innerHTML.trim().length > 0
    ? record.querySelector(child).innerHTML.trim()
    : 0;

  if (!object[dataKey]) {
    object[dataKey] = {};
  }

  if (type === "client") {
    if (!object[dataKey][year]) {
      object[dataKey][year] = {};
    }
    
    object[dataKey][year].value = innerData;
  } else {
    if (!object[dataKey][year]) {
      object[dataKey][year] = [];
    }
    
    const shouldInclude =
      dynamicValueClientPeer === "Yes" ||
      (dynamicValueClientPeer &&
        record.querySelector(dynamicValueClientPeer)?.textContent.trim() === "Yes");
    
    if (shouldInclude) {
      object[dataKey][year].push(innerData);
    }
  }
};

let apiCallClientDataForUniqueYears = {
  act: "API_DoQuery",
  query: `{533.EX.${ClientRid}}`,
  clist: "533.7.539.3",
};

$.get(clientData, apiCallClientDataForUniqueYears)
  .then(async (xml) => {
    recordsClient = await $("record", xml).toArray();

    // console.log(recordsClient[0]);
    // console.log(xml);

    clientName =
      recordsClient[0].querySelector("merged_client_name").textContent;
    document.getElementById("firmName").textContent = clientName;
    window.firmName = clientName;

    recordId = recordsClient[0].querySelector("record_id_").textContent;

    // console.log(recordsClient[0].children)

    if (recordsClient.length > 0) {
      findUniqueYears(recordsClient);
      dataClient = recordsClient[0].children;
    } else {
      console.error(
        "No records found from this client for the specific years. Maybe check the spelling of clientrid and not clientRid"
      );
    }
  })
  .catch((err) => console.error(err));

window.addEventListener("beforeunload", () => {
  localStorage.clear();
});

document.addEventListener("DOMContentLoaded", () => {
  getRecordsForUniqueClientPeerNames();

  addUniqueRegionsToOptionsSelectRegionsDropdown(regions_Array);

  addUniqueStatesToOptionsSelectStatesDropdown(states_Array);

  addUniqueMembershipsToOptionsSelectMembershipsDropdown(memberships_Array);

  addUniqueTypesToOptionsSelectTypesDropdown(types_Array);

  addUniqueAthleticsToOptionsSelectAthleticsDropdown(athletics_Array);

  // addUniqueEnrollmentsToOptionsSelectEnrollmentsDropdown(enrollment_Array);

  addUniqueRegionalsToOptionsSelectRegionalsDropdown(regional_Array);

  addUniqueSeminariesToOptionsSelectSeminariesDropdown(seminary_Array);
});

const findUniqueYears = (data) => {
  // console.log({data});

  if (data) {
    data.forEach((item) => {
      const yearElement = item.querySelector("fiscal_ye_date_formatted_year");
      if (yearElement) {
        const year = yearElement.textContent;

        // Check if the year is not already in yearsData_Array to ensure uniqueness
        if (!yearsData_Array.includes(year)) {
          yearsData_Array.push(year);
        }
      }
    });

    yearsData_Array.sort();
    // console.log({yearsData_Array});

    // Add years to options dropdown
    addUniqueYearsToOptionsSelectDropdown(yearsData_Array);
  }
};

/**
 * Adds unique years to the year selection dropdown
 * @param {Array} yearsArray - Array of unique years
 */
const addUniqueYearsToOptionsSelectDropdown = (yearsArray) => {
  const optionsListElement = document.getElementById("options-list-year");

  if (!optionsListElement) {
    console.error("Options list element not found for years dropdown");
    return;
  }

  // Clear the selected years on page load
  if (!window.yearSelectionsInitialized) {
    resetSelectedYearsFromLocalStorage();
    selectedYears_Set.clear();
    window.yearSelectionsInitialized = true;
  }

  // Initialize selectedYears_Set from local storage if data exists
  const storedYears = getSelectedYearsFromLocalStorage();

  if (Array.isArray(storedYears)) {
    selectedYears_Set = new Set(storedYears);
  }

  // Clear existing content
  optionsListElement.innerHTML = "";

  // Create "Select All" checkbox
  const selectAllLabel = document.createElement("label");
  selectAllLabel.setAttribute("for", "select-all-checkbox-years");
  selectAllLabel.setAttribute(
    "class",
    "flex items-center justify-start px-4 py-2 cursor-pointer truncate"
  );

  const selectAllInput = document.createElement("input");
  selectAllInput.setAttribute("type", "checkbox");
  selectAllInput.setAttribute("id", "select-all-checkbox-years");
  selectAllInput.setAttribute(
    "class",
    "w-4 h-4 mr-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500 cursor-pointer"
  );
  selectAllInput.checked = false;

  const selectAllSpan = document.createElement("span");
  selectAllSpan.setAttribute("id", "select-all-text-years");
  selectAllSpan.innerText = "(select all)";
  selectAllSpan.setAttribute("class", "text-lg font-semibold");

  selectAllLabel.appendChild(selectAllInput);
  selectAllLabel.appendChild(selectAllSpan);

  optionsListElement.appendChild(selectAllLabel);

  // Sort years in descending order
  const sortedYears = yearsArray.sort((a, b) => b - a);

  // Add year options
  sortedYears.forEach((year) => {
    const newLabel = document.createElement("label");
    newLabel.setAttribute("for", `option-${year}`);
    newLabel.setAttribute(
      "class",
      "flex items-center justify-start px-4 py-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
    );

    const newInput = document.createElement("input");
    newInput.setAttribute("type", "checkbox");
    newInput.setAttribute("id", `option-${year}`);
    newInput.setAttribute(
      "class",
      `form-checkbox h-4 w-4 text-blue-600 bg-gray-200 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-300 dark:border-gray-500 mr-2 cursor-pointer`
    );
    newInput.setAttribute("value", year);
    newInput.checked = selectedYears_Set.has(year);

    newInput.addEventListener("change", (e) => {
      const isChecked = e.target.checked;

      if (isChecked) {
        selectedYears_Set.add(year);
      } else {
        selectedYears_Set.delete(year);
      }

      // Update "Select All" checkbox state
      const yearCheckboxes = document.querySelectorAll(
        "#options-list-year input[type='checkbox']"
      );
      const nonSelectAllCheckboxes = Array.from(yearCheckboxes).filter(
        (cb) => cb.id !== "select-all-checkbox-years"
      );

      const allChecked = nonSelectAllCheckboxes.every((cb) => cb.checked);
      const noneChecked = nonSelectAllCheckboxes.every((cb) => !cb.checked);

      selectAllInput.checked = allChecked;
      selectAllInput.indeterminate = !allChecked && !noneChecked;

      // Save to local storage
      const selectedYearsArray = Array.from(selectedYears_Set).sort(
        (a, b) => a - b
      );
      localStorage.setItem("selectedYears", JSON.stringify(selectedYearsArray));
    });

    const newSpan = document.createElement("span");
    newSpan.innerText = year;

    newLabel.appendChild(newInput);
    newLabel.appendChild(newSpan);

    optionsListElement.appendChild(newLabel);
  });

  // "Select All" checkbox behavior
  selectAllInput.addEventListener("change", function () {
    const isChecked = selectAllInput.checked;
    const yearCheckboxes = document.querySelectorAll(
      "#options-list-year input[type='checkbox']"
    );

    yearCheckboxes.forEach((checkbox) => {
      if (checkbox.id !== "select-all-checkbox-years") {
        checkbox.checked = isChecked;
        const year = parseInt(checkbox.value);

        if (isChecked) {
          selectedYears_Set.add(year);
        } else {
          selectedYears_Set.delete(year);
        }
      }
    });

    // Save to local storage
    const selectedYearsArray = Array.from(selectedYears_Set).sort(
      (a, b) => a - b
    );
    localStorage.setItem("selectedYears", JSON.stringify(selectedYearsArray));
  });
};

// Main Data Retrieval Functions ----------------------------------------------->

const processDebtEndowmentContentData = (
  seletectedYears,
  recordsPeer,
  recordsClient
) => {
  const ltDebtPerTotalOperatingRevenue_obj = {};
  const debtServiceCoverageRatio_obj = {};
  const debtBurdenRatio_obj = {};
  const endowmentOperatingBudget_obj = {};
  const endowmentAssetsPerStudent_obj = {};

  const years = seletectedYears.sort((a, b) => a - b);
  years.forEach((year) => {
    const filteredClientRecords = [...recordsClient].filter((record) => {
      const fiscalYear = record.querySelector("year").textContent;
      return fiscalYear.includes(year.toString());
    });
    filteredClientRecords.forEach((record) => {
      const ltDebtPerTotalOperatingRevenue_array = [
        {
          key: "longTermDebtForLongTermPurpose_Client",
          field: "r285_clong_term_debt_per_total_operating_revenue",
        },
        {
          key: "longTermDebt_Client",
          field: "r015_notes_payable",
        },
        {
          key: "totalOperatingRevenue_Client",
          field: "r036_coperating_revenues_support_and_releases",
        },
      ];
      ltDebtPerTotalOperatingRevenue_array.forEach(({ key, field }) => {
        insertDataIntoObject(
          "client",
          year,
          ltDebtPerTotalOperatingRevenue_obj,
          key,
          record,
          field
        );
      });

      const debtServiceCoverageRatio_array = [
        {
          key: "ratio_Client",
          field: "r288_cdebt_service_coverage_ratio",
        },
        {
          key: "debtService_Client",
          field: "r286_cdebt_service",
        },
        {
          key: "interest_Client",
          field: "r165_interest",
        },
        {
          key: "principalPayments_Client",
          field:
            "r087_cash_flows_from_financing_activities_principal_payments_on_notes_payable",
        },
        {
          key: "totalOperatingRevenue_Client",
          field: "r036_coperating_revenues_support_and_releases",
        },
      ];
      debtServiceCoverageRatio_array.forEach(({ key, field }) => {
        insertDataIntoObject(
          "client",
          year,
          debtServiceCoverageRatio_obj,
          key,
          record,
          field
        );
      });

      const debtBurdenRatio_array = [
        {
          key: "ratio_Client",
          field: "r287_cdebt_burden_ratio",
        },
        {
          key: "debtService_Client",
          field: "r286_cdebt_service",
        },
        {
          key: "interest_Client",
          field: "r165_interest",
        },
        {
          key: "principalPayments_Client",
          field:
            "r087_cash_flows_from_financing_activities_principal_payments_on_notes_payable",
        },
        {
          key: "operationalExpense_Client",
          field: "r044_ctotal_functional_expenses",
        },
      ];
      debtBurdenRatio_array.forEach(({ key, field }) => {
        insertDataIntoObject(
          "client",
          year,
          debtBurdenRatio_obj,
          key,
          record,
          field
        );
      });

      const endowmentOperatingBudget_array = [
        {
          key: "ratio_Client",
          field: "r153_cendowment_to_expenses_ratio",
        },
        {
          key: "endowment_Client",
          field: "e001_endowment_size",
        },
        {
          key: "annualOperatingBudget_Client",
          field: "r044_ctotal_functional_expenses",
        },
      ];
      endowmentOperatingBudget_array.forEach(({ key, field }) => {
        insertDataIntoObject(
          "client",
          year,
          endowmentOperatingBudget_obj,
          key,
          record,
          field
        );
      });

      const endowmentAssetsPerStudent_Array = [
        {
          key: "ratio_Client",
          field: "r152_cendowment_assets_per_student",
        },
        {
          key: "endowment_Client",
          field: "e001_endowment_size",
        },
        {
          key: "totalStudentFte_Client",
          field: "g025_ctotal_student_fte",
        },
      ];
      endowmentAssetsPerStudent_Array.forEach(({ key, field }) => {
        insertDataIntoObject(
          "client",
          year,
          endowmentAssetsPerStudent_obj,
          key,
          record,
          field
        );
      });
    });

    // PEER
    const filteredPeerRecords = [...recordsPeer].filter((record) => {
      const fiscalYear = record.querySelector("year").textContent;

      return fiscalYear.includes(year.toString());
    });
    filteredPeerRecords.forEach((record) => {
      const debtBurdenRatio_array = [
        {
          key: "ratio_Peer",
          field: "r287_cdebt_burden_ratio",
        },
        {
          key: "operationalExpense_Peer",
          field: "r044_ctotal_functional_expenses",
        },
      ];
      debtBurdenRatio_array.forEach(({ key, field }) => {
        insertDataIntoObject(
          "peer",
          year,
          debtBurdenRatio_obj,
          key,
          record,
          field,
          "Yes"
        );
      });

      const endowmentAssetsPerStudent_Array = [
        {
          key: "ratio_Peer",
          field: "r152_cendowment_assets_per_student",
        },
        {
          key: "endowment_Peer",
          field: "e001_endowment_size",
        },
        {
          key: "totalStudentFte_Peer",
          field: "g025_ctotal_student_fte",
        },
      ];
      endowmentAssetsPerStudent_Array.forEach(({ key, field }) => {
        insertDataIntoObject(
          "peer",
          year,
          endowmentAssetsPerStudent_obj,
          key,
          record,
          field,
          "Yes"
        );
      });
    });
  });

  const dataKeys = [
    "ltDebtPerTotalOperatingRevenueData",
    "debtServiceCoverageRatioData",
    "debtBurdenRatioData",
    "endowmentOperatingBudgetData",
    "endowmentAssetsPerStudentData",
  ];
  const dataObjects = [
    ltDebtPerTotalOperatingRevenue_obj,
    debtServiceCoverageRatio_obj,
    debtBurdenRatio_obj,
    endowmentOperatingBudget_obj,
    endowmentAssetsPerStudent_obj,
  ];
  dataKeys.forEach((key, index) => {
    localStorage.removeItem(key);
    localStorage.setItem(key, JSON.stringify(dataObjects[index]));
  });
};

const processRevenueExpenseContentData = (
  seletectedYears,
  recordsPeer,
  recordsClient
) => {
  const salariesAndBenefitsToTotalExpense_obj = {};
  const averageEmployeeSalary_obj = {};
  const salariesAndBenefitsPerNetTuition_obj = {};
  const adminCostsPerStudent_obj = {};
  const netEducationalExpensePerStudent_obj = {};
  const annualTraditionalNetTuitionPerStudent_obj = {};
  const tuitionDependency_obj = {};
  const tuitionDiscountRate_obj = {};

  const years = seletectedYears.sort((a, b) => a - b);
  years.forEach((year) => {
    const filteredClientRecords = [...recordsClient].filter((record) => {
      const fiscalYear = record.querySelector("year").textContent;
      return fiscalYear.includes(year.toString());
    });
    filteredClientRecords.forEach((record) => {
      const salariesAndBenefitsToTotalExpense_array = [
        {
          key: "salariesAndBenefitsToTotalExpense_Client",
          field: "r228_csalaries_and_benefits_to_total_expenses",
        },
        {
          key: "salariesAndWages_Client",
          field: "r160_salaries_and_wages",
        },
        {
          key: "employeeBenefits_Client",
          field: "r161_employee_benefits",
        },
        {
          key: "totalFunctionalExpenses_Client",
          field: "r044_ctotal_functional_expenses",
        },
      ];
      salariesAndBenefitsToTotalExpense_array.forEach(({ key, field }) => {
        insertDataIntoObject(
          "client",
          year,
          salariesAndBenefitsToTotalExpense_obj,
          key,
          record,
          field
        );
      });

      const averageEmployeeSalary_array = [
        {
          key: "president_Client",
          field: "c011_sal_president",
        },
        {
          key: "chiefAcademic_Client",
          field: "c021_sal_chief_academic",
        },
        {
          key: "chiefFinance_Client",
          field: "c031_sal_chief_finance",
        },
        {
          key: "chiefEnrollment_Client",
          field: "c041_sal_chief_enrollment",
        },
        {
          key: "chiefDevelopment_Client",
          field: "c051_sal_chief_development",
        },
        {
          key: "chiefOps_Client",
          field: "c061_sal_chief_ops",
        },
        {
          key: "dirFinance_Client",
          field: "c071_sal_dir_of_fin_aid",
        },
        {
          key: "dirHr_Client",
          field: "c081_sal_dir_of_hr",
        },
        {
          key: "dirIt_Client",
          field: "c091_sal_dir_of_it",
        },
        {
          key: "dirPhysPlant_Client",
          field: "c101_sal_dir_of_phys_plant",
        },
        {
          key: "controller_Client",
          field: "c111_sal_controller",
        },
        {
          key: "busMgr_Client",
          field: "c121_sal_bus_mgr",
        },
        {
          key: "bursar_Client",
          field: "c131_sal_bursar",
        },
        {
          key: "budgetDir_Client",
          field: "c141_sal_budget_dir",
        },
        {
          key: "dirAcct_Client",
          field: "c151_sal_dir_of_acct",
        },
        {
          key: "srAcct_Client",
          field: "c161_sal_sr_acct",
        },
        {
          key: "nonSrAcct_Client",
          field: "c171_sal_non_sr_acct",
        },
        {
          key: "stuAcctMgr_Client",
          field: "c181_sal_stu_acct_mgr",
        },
        {
          key: "otherBusOffice_Client",
          field: "c191_sal_other_bus_office",
        },
        {
          key: "adminAsst_Client",
          field: "c201_sal_admin_asst",
        },
      ];
      averageEmployeeSalary_array.forEach(({ key, field }) => {
        insertDataIntoObject(
          "client",
          year,
          averageEmployeeSalary_obj,
          key,
          record,
          field
        );
      });

      const salariesAndBenefitsPerNetTuition_array = [
        {
          key: "salariesAndWages_Client",
          field: "r160_salaries_and_wages",
        },
        {
          key: "employeeBenefits_Client",
          field: "r161_employee_benefits",
        },
        {
          key: "salariesAndBenefitsPerNetTuition_Client",
          field: "r284_csalaries_and_benefits_per_net_tuition_revenue",
        },
        {
          key: "netTuitionAndFees_Client",
          field: "r026_cnet_tuition_and_fees",
        },
      ];
      salariesAndBenefitsPerNetTuition_array.forEach(({ key, field }) => {
        insertDataIntoObject(
          "client",
          year,
          salariesAndBenefitsPerNetTuition_obj,
          key,
          record,
          field
        );
      });

      insertDataIntoObject(
        "client",
        year,
        adminCostsPerStudent_obj,
        "adminCostsPerStudent_Client",
        record,
        "r230_cadmin_costs_per_student"
      );

      const netEducationalExpensePerStudent_array = [
        {
          key: "ratio_Client",
          field: "r138_cnet_educational_expenses_per_student",
        },
        {
          key: "netEducationalExpenses_Client",
          field: "r137_cnet_educational_expenses",
        },
        {
          key: "totalStudents_Client",
          field: "g025_ctotal_student_fte",
        },
      ];
      netEducationalExpensePerStudent_array.forEach(({ key, field }) => {
        insertDataIntoObject(
          "client",
          year,
          netEducationalExpensePerStudent_obj,
          key,
          record,
          field
        );
      });

      const annualTraditionalNetTuitionPerStudent_array = [
        {
          key: "ratio_Client",
          field: "r136_cnet_tuition_per_student",
        },
        {
          key: "netTuitionAndFees_Client",
          field: "r026_cnet_tuition_and_fees",
        },
        {
          key: "totalStudents_Client",
          field: "g025_ctotal_student_fte",
        },
      ];
      annualTraditionalNetTuitionPerStudent_array.forEach(({ key, field }) => {
        insertDataIntoObject(
          "client",
          year,
          annualTraditionalNetTuitionPerStudent_obj,
          key,
          record,
          field
        );
      });

      const tuitionDependency_array = [
        {
          key: "ratio_Client",
          field: "r147_cnet_tuition_dependency_ratio",
        },
        {
          key: "netTuitionAndFees_Client",
          field: "r026_cnet_tuition_and_fees",
        },
        {
          key: "operatingRevenuesSupportAndRelease_Client",
          field: "r036_coperating_revenues_support_and_releases",
        },
      ];
      tuitionDependency_array.forEach(({ key, field }) => {
        insertDataIntoObject(
          "client",
          year,
          tuitionDependency_obj,
          key,
          record,
          field
        );
      });

      const tuitionDiscountRate_array = [
        {
          key: "ratio_Client",
          field: "r229_ctuition_discount_rate",
        },
        {
          key: "revenueScholarshipsAndFinanancialAid_Client",
          field: "r024_revenue_scholarships_and_financial_aid",
        },
        {
          key: "revenueTuitionAndFees_Client",
          field: "r023_revenue_tuition_and_fees",
        },
      ];
      tuitionDiscountRate_array.forEach(({ key, field }) => {
        insertDataIntoObject(
          "client",
          year,
          tuitionDiscountRate_obj,
          key,
          record,
          field
        );
      });
    });

    // PEER
    const filteredPeerRecords = [...recordsPeer].filter((record) => {
      const fiscalYear = record.querySelector("year").textContent;

      return fiscalYear.includes(year.toString());
    });
    filteredPeerRecords.forEach((record) => {
      const averageEmployeeSalary_array = [
        {
          key: "president_Peer",
          field: "c011_sal_president",
        },
        {
          key: "chiefAcademic_Peer",
          field: "c021_sal_chief_academic",
        },
        {
          key: "chiefFinance_Peer",
          field: "c031_sal_chief_finance",
        },
        {
          key: "chiefEnrollment_Peer",
          field: "c041_sal_chief_enrollment",
        },
        {
          key: "chiefDevelopment_Peer",
          field: "c051_sal_chief_development",
        },
        {
          key: "chiefOps_Peer",
          field: "c061_sal_chief_ops",
        },
        {
          key: "dirFinance_Peer",
          field: "c071_sal_dir_of_fin_aid",
        },
        {
          key: "dirHr_Peer",
          field: "c081_sal_dir_of_hr",
        },
        {
          key: "dirIt_Peer",
          field: "c091_sal_dir_of_it",
        },
        {
          key: "dirPhysPlant_Peer",
          field: "c101_sal_dir_of_phys_plant",
        },
        {
          key: "controller_Peer",
          field: "c111_sal_controller",
        },
        {
          key: "busMgr_Peer",
          field: "c121_sal_bus_mgr",
        },
        {
          key: "bursar_Peer",
          field: "c131_sal_bursar",
        },
        {
          key: "budgetDir_Peer",
          field: "c141_sal_budget_dir",
        },
        {
          key: "dirAcct_Peer",
          field: "c151_sal_dir_of_acct",
        },
        {
          key: "srAcct_Peer",
          field: "c161_sal_sr_acct",
        },
        {
          key: "nonSrAcct_Peer",
          field: "c171_sal_non_sr_acct",
        },
        {
          key: "stuAcctMgr_Peer",
          field: "c181_sal_stu_acct_mgr",
        },
        {
          key: "otherBusOffice_Peer",
          field: "c191_sal_other_bus_office",
        },
        {
          key: "adminAsst_Peer",
          field: "c201_sal_admin_asst",
        },
      ];
      averageEmployeeSalary_array.forEach(({ key, field }) => {
        insertDataIntoObject(
          "peer",
          year,
          averageEmployeeSalary_obj,
          key,
          record,
          field,
          "Yes"
        );
      });

      const adminCostsPerStudent_Array = [
        {
          key: "salAdminAsst_Peer",
          field: "c201_sal_admin_asst",
        },
        {
          key: "ficaAdminAsst_Peer",
          field: "c203_fica_admin_asst",
        },
        {
          key: "healthAdminAsst_Peer",
          field: "c204_health_admin_asst",
        },
        {
          key: "disabilityAdminAsst_Peer",
          field: "c205_disability_admin_asst",
        },
        {
          key: "retirementAdminAsst_Peer",
          field: "c206_retirement_admin_asst",
        },
        {
          key: "housingAdminAsst_Peer",
          field: "c207_housing_admin_asst",
        },
        {
          key: "otherAdminAsst_Peer",
          field: "c208_other_admin_asst",
        },
        {
          key: "totalStudentFte_Peer",
          field: "g025_ctotal_student_fte",
        },
        {
          key: "totalStudentUhc_Peer",
          field: "g035_ctotal_student_uhc",
        },
      ];
      adminCostsPerStudent_Array.forEach(({ key, field }) => {
        insertDataIntoObject(
          "peer",
          year,
          adminCostsPerStudent_obj,
          key,
          record,
          field,
          "Yes"
        );
      });

      insertDataIntoObject(
        "peer",
        year,
        netEducationalExpensePerStudent_obj,
        "ratio_Peer",
        record,
        "r138_cnet_educational_expenses_per_student",
        "Yes"
      );

      const tuitionDependency_array = [
        {
          key: "ratio_Peer",
          field: "r147_cnet_tuition_dependency_ratio",
        },
        {
          key: "netTuitionAndFees_Peer",
          field: "r026_cnet_tuition_and_fees",
        },
        {
          key: "operatingRevenuesSupportAndRelease_Peer",
          field: "r036_coperating_revenues_support_and_releases",
        },
      ];
      tuitionDependency_array.forEach(({ key, field }) => {
        insertDataIntoObject(
          "Peer",
          year,
          tuitionDependency_obj,
          key,
          record,
          field,
          "Yes"
        );
      });

      const tuitionDiscountRate_array = [
        {
          key: "ratio_Peer",
          field: "r229_ctuition_discount_rate",
        },
        {
          key: "revenueScholarshipsAndFinanancialAid_Peer",
          field: "r024_revenue_scholarships_and_financial_aid",
        },
        {
          key: "revenueTuitionAndFees_Peer",
          field: "r023_revenue_tuition_and_fees",
        },
      ];
      tuitionDiscountRate_array.forEach(({ key, field }) => {
        insertDataIntoObject(
          "Peer",
          year,
          tuitionDiscountRate_obj,
          key,
          record,
          field,
          "Yes"
        );
      });
    });
  });

  const dataKeys = [
    "salariesAndBenefitsToTotalExpenseData",
    "averageEmployeeSalaryData",
    "salariesAndBenefitsPerNetTuitionData",
    "adminCostsPerStudentData",
    "netEducationalExpensePerStudentData",
    "annualTraditionalNetTuitionPerStudentData",
    "tuitionDependencyData",
    "tuitionDiscountRateData",
  ];
  const dataObjects = [
    salariesAndBenefitsToTotalExpense_obj,
    averageEmployeeSalary_obj,
    salariesAndBenefitsPerNetTuition_obj,
    adminCostsPerStudent_obj,
    netEducationalExpensePerStudent_obj,
    annualTraditionalNetTuitionPerStudent_obj,
    tuitionDependency_obj,
    tuitionDiscountRate_obj,
  ];
  dataKeys.forEach((key, index) => {
    localStorage.removeItem(key);
    localStorage.setItem(key, JSON.stringify(dataObjects[index]));
  });
};

const processFinancialPositionContentData = (
  seletectedYears,
  recordsPeer,
  recordsClient
) => {
  const currentRatio_obj = {};
  const liquidity_obj = {};

  const years = seletectedYears.sort((a, b) => a - b);
  years.forEach((year) => {
    const filteredClientRecords = [...recordsClient].filter((record) => {
      const fiscalYear = record.querySelector("year").textContent;
      return fiscalYear.includes(year.toString());
    });
    filteredClientRecords.forEach((record) => {
      const currentRatio_array = [
        {
          key: "cashAndCashEquivalents_Client",
          field: "r001_cash_and_cash_equivalents",
        },
        {
          key: "accountsReceivable_Client",
          field: "r002_accounts_receivable_net",
        },
        {
          key: "studentLoansAndOtherReceivables_Client",
          field: "r003_student_loans_and_other_receivables",
        },
        {
          key: "contributionsReceivable_Client",
          field: "r004_contributions_receivable",
        },
        {
          key: "prepaidExpensesAndOtherAssets_Client",
          field: "r005_prepaid_expenses_and_other_assets",
        },
        {
          key: "accountsPayable_Client",
          field: "r009_accounts_payable_and_accrued_liabilities",
        },
        {
          key: "deferredRevenue_Client",
          field: "r010_deferred_revenue",
        },
        {
          key: "postRetirementHealthBenefits_Client",
          field: "r011_post_retirement_health_benefits",
        },
        {
          key: "annuityObligations_Client",
          field: "r012_annuity_obligations",
        },
        {
          key: "otherLiabilities_Client",
          field: "r013_other_liabilities",
        },
      ];
      currentRatio_array.forEach(({ key, field }) => {
        insertDataIntoObject(
          "client",
          year,
          currentRatio_obj,
          key,
          record,
          field
        );
      });

      const liquidity_array = [
        {
          key: "fasbLiquidity_Client",
          field: "r250_fasb_liquidity",
        },
        {
          key: "quasiEndowment_Client",
          field: "r251_quasi_endowment",
        },
        {
          key: "lineOfCredit_Client",
          field: "r252_line_of_credit_available",
        },
      ];
      liquidity_array.forEach(({ key, field }) => {
        insertDataIntoObject("client", year, liquidity_obj, key, record, field);
      });
    });

    const filteredPeerRecords = [...recordsPeer].filter((record) => {
      const fiscalYear = record.querySelector("year").textContent;

      return fiscalYear.includes(year.toString());
    });
    filteredPeerRecords.forEach((record) => {
      // currentRatio
      insertDataIntoObject(
        "peer",
        year,
        currentRatio_obj,
        "currentRatio_Peer",
        record,
        "r258_ccurrent_ratio",
        "Yes"
      );

      // currentRatio
      insertDataIntoObject(
        "peer",
        year,
        currentRatio_obj,
        "currentAssets_Peer",
        record,
        "r256_ccurrent_assets",
        "Yes"
      );

      // currentRatio
      insertDataIntoObject(
        "peer",
        year,
        currentRatio_obj,
        "currentLiabilities_Peer",
        record,
        "r257_ccurrent_liabilities",
        "Yes"
      );

      // liquidity
      insertDataIntoObject(
        "peer",
        year,
        liquidity_obj,
        "liquidity_Peer",
        record,
        "r250_fasb_liquidity",
        "Yes"
      );
    });
  });

  const dataKeys = ["currentRatioData", "liquidityData"];
  const dataObjects = [currentRatio_obj, liquidity_obj];
  dataKeys.forEach((key, index) => {
    localStorage.removeItem(key);
    localStorage.setItem(key, JSON.stringify(dataObjects[index]));
  });
};

const processFinancialStatementContentData = (recordsPeer, recordsClient) => {
  const totalAssets_obj = {};
  const totalLiabilities_obj = {};
  const netAssets_obj = {};
  const revenueAndSupport_obj = {};
  const educationalProgram_obj = {};
  const nonOperatingActivities_obj = {};
  const changesInNetAssetsWithDR_obj = {};
  const naturalExpenseCategories_obj = {};
  const cashFlowsOperating_obj = {};
  const cashFlowsInvesting_obj = {};
  const cashFlowsFinancing_obj = {};

  const propertyAndEquipment_obj = {};

  const years = yearsData_Array.sort((a, b) => a - b);
  years.forEach((year) => {
    const filteredClientRecords = [...recordsClient].filter((record) => {
      const fiscalYear = record.querySelector("year").textContent;
      return fiscalYear.includes(year.toString());
    });
    filteredClientRecords.forEach((record) => {
      if (
        record.querySelector("_9999_completion_test_fs_tab").innerHTML ==
        "IN PROCESS"
      ) {
        return;
      }
      const totalAssets_array = [
        {
          key: "cashAndCashEquivalents_Client",
          field: "r001_cash_and_cash_equivalents",
        },
        {
          key: "accountsReceivable_Client",
          field: "r002_accounts_receivable_net",
        },
        {
          key: "studentLoansAndOtherReceivables_Client",
          field: "r003_student_loans_and_other_receivables",
        },
        {
          key: "contributionsReceivable_Client",
          field: "r004_contributions_receivable",
        },
        {
          key: "prepaidExpensesAndOtherAssets_Client",
          field: "r005_prepaid_expenses_and_other_assets",
        },
        {
          key: "propertyAndEquipment_Client",
          field: "r006_property_and_equipment_net",
        },
        {
          key: "investmentsHeldForLongTermPurposes_Client",
          field: "r007_investments_held_for_long_term_purposes",
        },
        {
          key: "totalAssets_Client",
          field: "r008_ctotal_assets",
        },
      ];
      totalAssets_array.forEach(({ key, field }) => {
        insertDataIntoObject(
          "client",
          year,
          totalAssets_obj,
          key,
          record,
          field
        );
      });

      const totalLiabilities_array = [
        {
          key: "accountsPayable_Client",
          field: "r009_accounts_payable_and_accrued_liabilities",
        },
        {
          key: "deferredRevenue_Client",
          field: "r010_deferred_revenue",
        },
        {
          key: "postRetirementHealthBenefits_Client",
          field: "r011_post_retirement_health_benefits",
        },
        {
          key: "annuityObligations_Client",
          field: "r012_annuity_obligations",
        },
        {
          key: "otherLiabilities_Client",
          field: "r013_other_liabilities",
        },
        {
          key: "interestRateSwapLiability_Client",
          field: "r014_interest_rate_swap_liability",
        },
        {
          key: "bondsNotesPayable_Client",
          field: "r015_notes_payable",
        },
        {
          key: "totalLiabilities_Client",
          field: "r016_ctotal_liabilities",
        },
      ];
      totalLiabilities_array.forEach(({ key, field }) => {
        insertDataIntoObject(
          "client",
          year,
          totalLiabilities_obj,
          key,
          record,
          field
        );
      });

      const netAssets_array = [
        {
          key: "netAssetsWithoutDonorRestriction_Client",
          field: "r017_net_assets_without_donor_restriction",
        },
        {
          key: "netAssetsRestrictedByTimeOrPurpose_Client",
          field: "r018_net_assets_restricted_by_time_or_purpose",
        },
        {
          key: "netChangeInNetAssetsRestrictedInPerpetuity_Client",
          field: "r019_net_assets_restricted_in_perpetuity",
        },
        {
          key: "netAssets_Client",
          field: "r020_ctotal_net_assets",
        },
      ];
      netAssets_array.forEach(({ key, field }) => {
        insertDataIntoObject("client", year, netAssets_obj, key, record, field);
      });

      const revenueAndSupport_array = [
        {
          key: "tuitionAndFees_Client",
          field: "r023_revenue_tuition_and_fees",
        },
        {
          key: "scholarshipsAndFinancialaid_Client",
          field: "r024_revenue_scholarships_and_financial_aid",
        },
        {
          key: "auxiliaryActivities_Client",
          field: "r028_revenue_auxiliary_activities",
        },
        {
          key: "investmentIncome_Client",
          field: "r029_revenue_investment_income",
        },
        {
          key: "endowmentSpendingAppropriation_Client",
          field: "r030_revenue_endowment_spending_appropriation",
        },
        {
          key: "other_Client",
          field: "r031_revenue_other",
        },
        {
          key: "contributionsLargeOneTimeGifts_Client",
          field: "r033a_revenue_contributions_large_one_time_gifts",
        },
        {
          key: "netAssetsReleasedFromRestriction_Client",
          field: "r034_revenue_net_assets_released_from_restriction",
        },
        {
          key: "totalRevenueContributions_Client",
          field: "r035_ctotal_revenue_from_contributions",
        },
        {
          key: "revenueAndSupport_Client",
          field: "r036_coperating_revenues_support_and_releases",
        },
      ];
      revenueAndSupport_array.forEach(({ key, field }) => {
        insertDataIntoObject(
          "client",
          year,
          revenueAndSupport_obj,
          key,
          record,
          field
        );
      });

      const educationalProgramExpenses_array = [
        {
          key: "expensesEducationalInstruction_Client",
          field: "r037_expenses_educational_program_instruction",
        },
        {
          key: "expensesEducationalResearch_Client",
          field: "r038_expenses_educational_program_research",
        },
        {
          key: "expensesEducationalAcademicSupport_Client",
          field: "r039_expenses_educational_program_academic_support",
        },
        {
          key: "expensesEducationalStudentServices_Client",
          field: "r040_expenses_educational_program_student_services",
        },
        {
          key: "expensesEducationalAuxiliaryActivities_Client",
          field: "r041_expenses_educational_program_auxiliary_activities",
        },
        {
          key: "expensesEducationalInstitutionalSupport_Client",
          field: "r042_expenses_educational_program_institutional_support",
        },
        {
          key: "expensesEducationalPublicService_Client",
          field: "r043_expenses_educational_program_public_service",
        },
        {
          key: "educationalProgramExpenses_Client",
          field: "r044_ctotal_functional_expenses",
        },
        {
          key: "fundraisingExpenses_Client",
          field: "r280_fundraising_expenses",
        },
        {
          key: "otherExpenses_Client",
          field: "r281_other_expenses",
        },
      ];
      educationalProgramExpenses_array.forEach(({ key, field }) => {
        insertDataIntoObject(
          "client",
          year,
          educationalProgram_obj,
          key,
          record,
          field
        );
      });

      const nonOperatingActivities_array = [
        {
          key: "investmentIncome_Client",
          field: "r047_non_operating_activities_investment_income",
        },
        {
          key: "endowmentSpendingPolicy_Client",
          field:
            "r048_investments_net_in_excess_of_amounts_appropriated_for_spending",
        },
        {
          key: "changeInValueInterestRateSwap_Client",
          field:
            "r049_non_operating_activities_change_in_value_of_split_interest_agreements",
        },
        {
          key: "adjustmentPrbo_Client",
          field: "r050_non_operating_activities_adjustment_to_prbo",
        },
        {
          key: "contributionsAndOther_Client",
          field: "r051_other_gains_losses",
        },
        {
          key: "nonOperatingActivities_Client",
          field: "r052_ctotal_non_operating_changes",
        },
      ];
      nonOperatingActivities_array.forEach(({ key, field }) => {
        insertDataIntoObject(
          "client",
          year,
          nonOperatingActivities_obj,
          key,
          record,
          field
        );
      });

      const changesInNetAssetsWithDR_array = [
        {
          key: "contributions_Client",
          field: "r054_contributions",
        },
        {
          key: "investmentIncomePlusEndowment_Client",
          field: "r055_investment_return_net",
        },
        {
          key: "endowmentSpendingPolicy_Client",
          field:
            "r056_change_in_temporarily_restricted_net_assets_endowment_spending_policy_approp",
        },
        {
          key: "NetAssetsReleasedFromProgram_Client",
          field: "r058_net_assets_released_from_restriction",
        },
        {
          key: "temporarilyRestrictedNetChange_Client",
          field: "r059_cchange_in_net_assets_with_donor_restrictions",
        },
        {
          key: "contributions2_Client",
          field:
            "r060_change_in_permanently_restricted_net_assets_contributions",
        },
        {
          key: "investmentIncome_Client",
          field:
            "r061_change_in_permanently_restricted_net_assets_investment_income",
        },
        {
          key: "netAssetsReleased_Client",
          field:
            "r063_change_in_permanently_restricted_net_assets_released_from_program_restrictions",
        },
        {
          key: "permanentlyRestricted_Client",
          field: "r064_cnet_change_restricted_in_perpetuity",
        },
        {
          key: "changesInNetAssetsWithDR_Client",
          field: "r065_cchange_in_net_assets",
        },
      ];
      changesInNetAssetsWithDR_array.forEach(({ key, field }) => {
        insertDataIntoObject(
          "client",
          year,
          changesInNetAssetsWithDR_obj,
          key,
          record,
          field
        );
      });

      const naturalExpenseCategories_array = [
        {
          key: "salariesAndWages_Client",
          field: "r160_salaries_and_wages",
        },
        {
          key: "employeeBenefits_Client",
          field: "r161_employee_benefits",
        },
        {
          key: "servicesSuppliesAndOther_Client",
          field: "r162_services_supplies_and_other",
        },
        {
          key: "occupancyUtilitiesAndMaintenance_Client",
          field: "r163_occupancy_utilities_and_maintenance",
        },
        {
          key: "depreciationAndAmortization_Client",
          field: "r164_depreciation_and_amortization",
        },
        {
          key: "interest_Client",
          field: "r165_interest",
        },
        {
          key: "naturalExpenseCategories_Client",
          field: "r166_ctotal_natural_category_expenses",
        },
      ];
      naturalExpenseCategories_array.forEach(({ key, field }) => {
        insertDataIntoObject(
          "client",
          year,
          naturalExpenseCategories_obj,
          key,
          record,
          field
        );
      });

      const cashFlowsOperating_array = [
        {
          key: "depreciation_Client",
          field: "r070_adjustments_depreciation",
        },
        {
          key: "giftsAndGrantsRestrictedInPerpetuity_Client",
          field: "r071_adjustments_gifts_and_grants_restricted_in_perpetuity",
        },
        {
          key: "gainOnInvestment_Client",
          field: "r072_adjustments_gain_on_investments",
        },
        {
          key: "derivativeCSLVIAmortBondCosts_Client",
          field: "r073_adjustments_derivative_cslvi_amort_bond_costs",
        },
        {
          key: "accountsReceivable_Client",
          field: "r074_adjustments_accounts_receivable",
        },
        {
          key: "inventory_Client",
          field: "r075_adjustments_inventory",
        },
        {
          key: "prepaidsAndOtherAssets_Client",
          field: "r076_adjustments_prepaids_and_other_assets",
        },
        {
          key: "accountsPayableAndAccruedExpenses_Client",
          field: "r077_adjustments_accounts_payable_and_accrued_expenses",
        },
        {
          key: "deferredRevenue_Client",
          field: "r078_adjustments_deferred_revenue",
        },
        {
          key: "otherLiabilities_Client",
          field: "r079_adjustments_other_liabilities",
        },
        {
          key: "cashFlowsOperatingActivities_Client",
          field: "r080_cnet_cash_provided_by_operating_activities",
        },
      ];
      cashFlowsOperating_array.forEach(({ key, field }) => {
        insertDataIntoObject(
          "client",
          year,
          cashFlowsOperating_obj,
          key,
          record,
          field
        );
      });

      const cashFlowsInvesting_array = [
        {
          key: "purchaseOfInvestments_Client",
          field:
            "r081_cash_flows_from_investing_activities_purchase_of_investments",
        },
        {
          key: "proceedsFromSaleOfInvestments_Client",
          field:
            "r082_cash_flows_from_investing_activities_proceeds_from_sale_of_investments",
        },
        {
          key: "PurchaseOfPropertyAndEquipment_Client",
          field:
            "r083_cash_flows_from_investing_activities_purchases_of_property_and_equipment",
        },
        {
          key: "studentLoanFund_Client",
          field: "r084_cash_flows_from_investing_activities_student_loan_fund",
        },
        {
          key: "cashFlowsInvestingActivities_Client",
          field: "r085_cnet_cash_used_in_investing_activities",
        },
        {
          key: "otherInvestingActivity_Client",
          field: "r282_other_investing_activity",
        },
      ];
      cashFlowsInvesting_array.forEach(({ key, field }) => {
        insertDataIntoObject(
          "client",
          year,
          cashFlowsInvesting_obj,
          key,
          record,
          field
        );
      });

      const cashFlowsFinancing_array = [
        {
          key: "proceedsFromNotesPayable_Client",
          field:
            "r086_cash_flows_from_financing_activities_proceeds_from_notes_payable",
        },
        {
          key: "principalPayments_Client",
          field:
            "r087_cash_flows_from_financing_activities_principal_payments_on_notes_payable",
        },
        {
          key: "other_Client",
          field: "r088_cash_flows_from_financing_activities_other",
        },
        {
          key: "cashFlowsFinancingActivities_Client",
          field: "r089_cnet_cash_used_in_financing_activities",
        },
      ];
      cashFlowsFinancing_array.forEach(({ key, field }) => {
        insertDataIntoObject(
          "client",
          year,
          cashFlowsFinancing_obj,
          key,
          record,
          field
        );
      });

      const propertyAndEquipment_array = [
        {
          key: "landImprovements_Client",
          field: "r093_property_and_equipment_land_and_improvements",
        },
        {
          key: "buildingImprovements_Client",
          field: "r094_property_and_equipment_buildings_and_improvements",
        },
        {
          key: "furnitureEquipment_Client",
          field: "r095_property_and_equipment_furniture_and_equipment",
        },
        {
          key: "cip_Client",
          field: "r096_property_and_equipment_cip",
        },
        {
          key: "totalPEatCost_Client",
          field: "r097_ctotal_property_and_equipment_at_cost",
        },
        {
          key: "accumulatedDepreciation_Client",
          field: "r098_accumulated_depreciation",
        },
        {
          key: "propertyAndEquipment_Client",
          field: "r099_ctotal_property_and_equipment_less_depreciation",
        },
      ];
      propertyAndEquipment_array.forEach(({ key, field }) => {
        insertDataIntoObject(
          "client",
          year,
          propertyAndEquipment_obj,
          key,
          record,
          field
        );
      });
    });
  });

  const dataKeys = [
    "totalAssetsData",
    "totalLiabilitiesData",
    "netAssetsData",
    "revenueAndSupportData",
    "educationalProgramData",
    "nonOperatingActivitiesData",
    "changesInNetAssetsWithDRData",
    "naturalExpenseCategoriesData",
    "cashFlowsOperatingData",
    "cashFlowsInvestingData",
    "cashFlowsFinancingData",
    "propertyAndEquipmentData",
  ];
  const dataObjects = [
    totalAssets_obj,
    totalLiabilities_obj,
    netAssets_obj,
    revenueAndSupport_obj,
    educationalProgram_obj,
    nonOperatingActivities_obj,
    changesInNetAssetsWithDR_obj,
    naturalExpenseCategories_obj,
    cashFlowsOperating_obj,
    cashFlowsInvesting_obj,
    cashFlowsFinancing_obj,
    propertyAndEquipment_obj,
  ];
  dataKeys.forEach((key, index) => {
    localStorage.removeItem(key);
    localStorage.setItem(key, JSON.stringify(dataObjects[index]));
  });
};

const processFinancialAnalysisContentData = (
  years,
  recordsPeer,
  recordsClient
) => {
  const object = {};

  years.forEach((year) => {
    const filteredPeerRecords = [...recordsPeer].filter((record) => {
      const fiscalYear = record.querySelector("year").textContent;

      return fiscalYear.includes(year.toString());
    });
    filteredPeerRecords.forEach((record) => {
      // totalLiabilities
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalLiabilities_Peer",
        record,
        "r016_ctotal_liabilities",
        "Yes"
      );

      // totalAssets
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalAssets_Peer",
        record,
        "r008_ctotal_assets",
        "Yes"
      );

      // SOURCE OF INCOME ---------------------------------->

      // revenueTuitionAndFees
      insertDataIntoObject(
        "peer",
        year,
        object,
        "revenueTuitionAndFees_Peer",
        record,
        "dashboard_c002a_income_____tuition",
        "Yes"
      );

      // revenueAuxiliaryActivities
      insertDataIntoObject(
        "peer",
        year,
        object,
        "revenueAuxiliaryActivities_Peer",
        record,
        "dashboard_c002b_income_____auxiliary",
        "Yes"
      );

      // revenueContributions
      insertDataIntoObject(
        "peer",
        year,
        object,
        "revenueContributions_Peer",
        record,
        "dashboard_c002c_income_____contributions",
        "Yes"
      );

      // revenueInvestmentIncome
      insertDataIntoObject(
        "peer",
        year,
        object,
        "revenueInvestmentIncome_Peer",
        record,
        "dashboard_c002d_income_____investments",
        "Yes"
      );

      // revenueGifts
      insertDataIntoObject(
        "peer",
        year,
        object,
        "releasedGifts_Peer",
        record,
        "dashboard_c002f_income_____released_gifts",
        "Yes"
      );
      // revenueOther
      insertDataIntoObject(
        "peer",
        year,
        object,
        "revenueOther_Peer",
        record,
        "dashboard_c002e_income_____other_sources",
        "Yes"
      );

      // Financial Flow Analysis ---------------------------------->
    });

    const filteredClientRecords = [...recordsClient].filter((record) => {
      const fiscalYear = record.querySelector("year").textContent;
      return fiscalYear.includes(year.toString());
    });
    filteredClientRecords.forEach((record) => {
      // totalAssets
      insertDataIntoObject(
        "client",
        year,
        object,
        "totalAssets_Client",
        record,
        "r008_ctotal_assets"
      );
      // totalLiabilities
      insertDataIntoObject(
        "client",
        year,
        object,
        "totalLiabilities_Client",
        record,
        "r016_ctotal_liabilities"
      );
      // netPosition
      insertDataIntoObject(
        "client",
        year,
        object,
        "netPosition_Client",
        record,
        "r020_ctotal_net_assets"
      );

      // SOURCE OF INCOME ---------------------------------->

      // si_revenueTuitionAndFees_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "si_revenueTuitionAndFees_Client",
        record,
        "r026_cnet_tuition_and_fees"
      );
      // si_revenueAuxiliaryActivities_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "si_revenueAuxiliaryActivities_Client",
        record,
        "r028_revenue_auxiliary_activities"
      );
      // si_revenueContributions_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "si_revenueContributions_Client",
        record,
        "r033_revenue_contributions"
      );
      // si_revenueContributionsLargeOneTimeGifts_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "si_revenueContributionsLargeOneTimeGifts_Client",
        record,
        "r033a_revenue_contributions_large_one_time_gifts"
      );
      // si_revenueInvestmentIncome_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "si_revenueInvestmentIncome_Client",
        record,
        "r029_revenue_investment_income"
      );
      // si_revenueEndowmentSpendingAppropriation_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "si_revenueEndowmentSpendingAppropriation_Client",
        record,
        "r030_revenue_endowment_spending_appropriation"
      );
      // si_revenueOther_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "si_revenueOther_Client",
        record,
        "r031_revenue_other"
      );
      // si_netAssetsReleased_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "si_netAssetsReleased_Client",
        record,
        "r034_revenue_net_assets_released_from_restriction"
      );

      // Financial Flow Analysis ---------------------------------->

      // ffa_revenueTuitionAndFees_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "ffa_revenueTuitionAndFees_Client",
        record,
        "r023_revenue_tuition_and_fees"
      );

      // ffa_revenueScholarshipsAndFinancialAid_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "ffa_revenueScholarshipsAndFinancialAid_Client",
        record,
        "r024_revenue_scholarships_and_financial_aid"
      );

      // ffa_totalRevenueContributions_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "ffa_totalRevenueContributions_Client",
        record,
        "r035_ctotal_revenue_from_contributions"
      );

      // ffa_revenueAuxiliaryActivities_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "ffa_revenueAuxiliaryActivities_Client",
        record,
        "r028_revenue_auxiliary_activities"
      );

      // ffa_revenueOther_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "ffa_revenueOther_Client",
        record,
        "r031_revenue_other"
      );

      // ffa_revenueInvestmentIncome_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "ffa_revenueInvestmentIncome_Client",
        record,
        "r029_revenue_investment_income"
      );

      // ffa_revenueEndowmentSpendingAppropriation_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "ffa_revenueEndowmentSpendingAppropriation_Client",
        record,
        "r030_revenue_endowment_spending_appropriation"
      );

      // ffa_changeInNetAssetsWithDR_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "ffa_changeInNetAssetsWithDR_Client",
        record,
        "r059_cchange_in_net_assets_with_donor_restrictions"
      );

      // ffa_netChangeRestrictedInPerpetuity_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "ffa_netChangeRestrictedInPerpetuity_Client",
        record,
        "r064_cnet_change_restricted_in_perpetuity"
      );

      // ffa_contributions_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "ffa_contributions_Client",
        record,
        "r054_contributions"
      );

      // ffa_changeInPermanentlyRestrictedNA_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "ffa_changeInPermanentlyRestrictedNA_Client",
        record,
        "r060_change_in_permanently_restricted_net_assets_contributions"
      );

      // ffa_salariesAndWages_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "ffa_salariesAndWages_Client",
        record,
        "r160_salaries_and_wages"
      );

      // ffa_employeeBenefits_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "ffa_employeeBenefits_Client",
        record,
        "r161_employee_benefits"
      );

      // ffa_servicesSuppliesOther_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "ffa_servicesSuppliesOther_Client",
        record,
        "r162_services_supplies_and_other"
      );

      // ffa_occupancyUtilitiesAndMaintenance_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "ffa_occupancyUtilitiesAndMaintenance_Client",
        record,
        "r163_occupancy_utilities_and_maintenance"
      );

      // ffa_incomeExpenseSurplusDefecit_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "ffa_incomeExpenseSurplusDefecit_Client",
        record,
        "dashboard_c001_income_expense_surplus_defecit"
      );

      // ffa_interest_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "ffa_interest_Client",
        record,
        "r165_interest"
      );

      // ffa_totalFunctionalExpenses_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "ffa_totalFunctionalExpenses_Client",
        record,
        "r044_ctotal_functional_expenses"
      );

      // ffa_servicesSuppliesAndOther_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "ffa_servicesSuppliesAndOther_Client",
        record,
        "r162_services_supplies_and_other"
      );

      // ffa_occupancyUtilitiesAndMaintenance_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "ffa_occupancyUtilitiesAndMaintenance_Client",
        record,
        "r163_occupancy_utilities_and_maintenance"
      );

      // ffa_depreciationAndAmortization_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "ffa_depreciationAndAmortization_Client",
        record,
        "r164_depreciation_and_amortization"
      );

      // ffa_interest_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "ffa_interest_Client",
        record,
        "r165_interest"
      );

      // ffa_incomeExpenseSurplusDefecit_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "ffa_incomeExpenseSurplusDefecit_Client",
        record,
        "dashboard_c001_income_expense_surplus_defecit"
      );

      // dashboardSurplusDefecit_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "dashboardSurplusDefecit_Client",
        record,
        "dashboard_c001_income_expense_surplus_defecit"
      );

      // Cash Flows Trend ---------------------------------->

      // cft_OperatingActivities_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "cft_OperatingActivities_Client",
        record,
        "r080_cnet_cash_provided_by_operating_activities"
      );

      // cft_InvestingActivities_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "cft_InvestingActivities_Client",
        record,
        "r085_cnet_cash_used_in_investing_activities"
      );

      // cft_FinancingActivities_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "cft_FinancingActivities_Client",
        record,
        "r089_cnet_cash_used_in_financing_activities"
      );

      // cft_TotalActivities_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "cft_TotalActivities_Client",
        record,
        "r283_ctotal_cash_flows"
      );

      // Salaries & Benefits to Total Expenses ---------------------------------->

      // salariesAndBenefitsToTotalExpenses_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "salariesAndBenefitsToTotalExpenses_Client",
        record,
        "r228_csalaries_and_benefits_to_total_expenses"
      );

      // salariesAndWages_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "salariesAndWages_Client",
        record,
        "r160_salaries_and_wages"
      );

      // employeeBenefits_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "employeeBenefits_Client",
        record,
        "r161_employee_benefits"
      );

      // totalFunctionalExpenses_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "totalFunctionalExpenses_Client",
        record,
        "r044_ctotal_functional_expenses"
      );
    });
  });

  localStorage.removeItem("financialAnalysisContentData");
  localStorage.setItem("financialAnalysisContentData", JSON.stringify(object));
};

const processDoeData = (years, recordsPeer, recordsClient) => {
  const object = {};

  years.forEach((year) => {
    const filteredClientRecords = [...recordsClient].filter((record) => {
      const fiscalYear = record.querySelector("year").textContent;

      return fiscalYear.includes(year.toString());
    });
    filteredClientRecords.forEach((record) => {
      // doePrimaryReserveRatio
      insertDataIntoObject(
        "client",
        year,
        object,
        "doePrimaryReserveRatio_Client",
        record,
        "r232_cdoe_primary_reserve_ratio"
      );

      // doePrimaryReserveStrengthFactor
      insertDataIntoObject(
        "client",
        year,
        object,
        "doePrimaryReserveStrengthFactor_Client",
        record,
        "r233_cdoe_primary_reserve_strength_factor"
      );

      // doePrimaryReserveRatioWeighted
      insertDataIntoObject(
        "client",
        year,
        object,
        "doePrimaryReserveRatioWeighted_Client",
        record,
        "r234_cdoe_primary_reserve_ratio_weighted"
      );

      // doeEquityRatio
      insertDataIntoObject(
        "client",
        year,
        object,
        "doeEquityRatio_Client",
        record,
        "r237_cdoe_equity_ratio"
      );

      // doeEquityStrengthFactor
      insertDataIntoObject(
        "client",
        year,
        object,
        "doeEquityStrengthFactor_Client",
        record,
        "r238_cdoe_equity_strength_factor"
      );

      // doeEquityRatioWeighted
      insertDataIntoObject(
        "client",
        year,
        object,
        "doeEquityRatioWeighted_Client",
        record,
        "r239_cdoe_equity_ratio_weighted"
      );

      // doeNetIncomeRatio
      insertDataIntoObject(
        "client",
        year,
        object,
        "doeNetIncomeRatio_Client",
        record,
        "r242_cdoe_net_income_ratio"
      );

      // doeNetIncomeStrengthFactor
      insertDataIntoObject(
        "client",
        year,
        object,
        "doeNetIncomeStrengthFactor_Client",
        record,
        "r243_cdoe_net_income_strength_factor"
      );

      // doeNetIncomeRatioWeighted
      insertDataIntoObject(
        "client",
        year,
        object,
        "doeNetIncomeRatioWeighted_Client",
        record,
        "r244_cdoe_net_income_ratio_weighted"
      );

      // doeOverall
      insertDataIntoObject(
        "client",
        year,
        object,
        "doeOverall_Client",
        record,
        "r245_cdoe_overall__composite_score_"
      );
    });
  });

  localStorage.removeItem("doeData");
  localStorage.setItem("doeData", JSON.stringify(object));

  // console.log({ selectedYears });
};

const processCfiData = (years, recordsPeer, recordsClient) => {
  const object = {};

  years.forEach((year) => {
    const filteredPeerRecords = [...recordsPeer].filter((record) => {
      const fiscalYear = record.querySelector("year").textContent;

      return fiscalYear.includes(year.toString());
    });
    filteredPeerRecords.forEach((record) => {
      // cfiRatio_peerAverage
      insertDataIntoObject(
        "peer",
        year,
        object,
        "cfiRatio_peerAverage_Peer",
        record,
        "r119_ccfi_overall_ratio",
        "r119_ccfi_overall_ratioyn"
      );

      // primaryReserveRatio_peerAverage
      insertDataIntoObject(
        "peer",
        year,
        object,
        "primaryReserveRatio_peerAverage_Peer",
        record,
        "r115_ccfi_primary_reserve_ratio",
        "r115_ccfi_primary_reserve_ratioyn"
      );

      // netIncomeOperationsRatio_peerAverage
      insertDataIntoObject(
        "peer",
        year,
        object,
        "netIncomeOperationsRatio_peerAverage_Peer",
        record,
        "r116_ccfi_net_income_operations_ratio",
        "r116_ccfi_net_income_operations_ratioyn"
      );

      // returnOnNetAssets_peerAverage
      insertDataIntoObject(
        "peer",
        year,
        object,
        "returnOnNetAssets_peerAverage_Peer",
        record,
        "r117_ccfi_return_on_net_assets_total_return_ratio",
        "r117_ccfi_return_on_net_assets_total_return_ratioyn"
      );

      // viabilityRatio_peerAverage
      insertDataIntoObject(
        "peer",
        year,
        object,
        "viabilityRatio_peerAverage_Peer",
        record,
        "r118_ccfi_viability_ratio",
        "r118_ccfi_viability_ratioyn"
      );
    });

    const filteredClientRecords = [...recordsClient].filter((record) => {
      const fiscalYear = record.querySelector("year").textContent;
      return fiscalYear.includes(year.toString());
    });
    filteredClientRecords.forEach((record) => {
      // cfiRatio
      insertDataIntoObject(
        "client",
        year,
        object,
        "cfiRatio_Client",
        record,
        "r119_ccfi_overall_ratio"
      );

      // cfi_primaryReserveRatio
      insertDataIntoObject(
        "client",
        year,
        object,
        "cfi_primaryReserveRatio_Client",
        record,
        "r115_ccfi_primary_reserve_ratio"
      );

      // cfi_primaryReserveRatio_Strength
      insertDataIntoObject(
        "client",
        year,
        object,
        "cfi_primaryReserveRatio_Strength_Client",
        record,
        "r115_ccfi_primary_reserve_ratio_cfi_score___strength"
      );

      // cfi_primaryReserveRatio_Weight_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "cfi_primaryReserveRatio_Weight_Client",
        record,
        "r115_ccfi_primary_reserve_ratio_cfi_score___weight"
      );

      // cfi_primaryReserveRatio_Score_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "cfi_primaryReserveRatio_Score_Client",
        record,
        "r115_ccfi_primary_reserve_ratio_cfi_score"
      );

      // cfi_netIncomeOperationsRatio
      insertDataIntoObject(
        "client",
        year,
        object,
        "cfi_netIncomeOperationsRatio_Client",
        record,
        "r116_ccfi_net_income_operations_ratio"
      );

      // cfi_netIncomeOperationsRatio_Strength_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "cfi_netIncomeOperationsRatio_Strength_Client",
        record,
        "r116_ccfi_net_income_operations_ratio_cfi_score___strength"
      );

      // cfi_netIncomeOperationsRatio_Weight_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "cfi_netIncomeOperationsRatio_Weight_Client",
        record,
        "r116_ccfi_net_income_operations_ratio_cfi_score___weight"
      );

      // cfi_netIncomeOperationsRatio_Score_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "cfi_netIncomeOperationsRatio_Score_Client",
        record,
        "r116_ccfi_net_income_operations_ratio_cfi_score"
      );

      // cfi_returnOnNetAssets
      insertDataIntoObject(
        "client",
        year,
        object,
        "cfi_returnOnNetAssets_Client",
        record,
        "r117_ccfi_return_on_net_assets_total_return_ratio"
      );

      // cfi_returnOnNetAssets_Strength_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "cfi_returnOnNetAssets_Strength_Client",
        record,
        "r117_ccfi_return_on_net_assets_total_return_ratio_cfi_score___strength"
      );

      // cfi_returnOnNetAssets_Weight_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "cfi_returnOnNetAssets_Weight_Client",
        record,
        "r117_ccfi_return_on_net_assets_total_return_ratio_cfi_score___weight"
      );

      // cfi_returnOnNetAssets_Score_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "cfi_returnOnNetAssets_Score_Client",
        record,
        "r117_ccfi_return_on_net_assets_total_return_ratio_cfi_score"
      );

      // cfi_viabilityRatio
      insertDataIntoObject(
        "client",
        year,
        object,
        "cfi_viabilityRatio_Client",
        record,
        "r118_ccfi_viability_ratio"
      );

      // cfi_viabilityRatio_Strength_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "cfi_viabilityRatio_Strength_Client",
        record,
        "r118_ccfi_viability_ratio_cfi_score___strength"
      );

      // cfi_viabilityRatio_Weight_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "cfi_viabilityRatio_Weight_Client",
        record,
        "r118_ccfi_viability_ratio_cfi_score___weight"
      );

      // cfi_viabilityRatio_Score_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "cfi_viabilityRatio_Score_Client",
        record,
        "r118_ccfi_viability_ratio_cfi_score"
      );

      // PRIMARY RESERVE RATIO ---------------------------------->

      // primaryReserveRatio
      insertDataIntoObject(
        "client",
        year,
        object,
        "primaryReserveRatio_Client",
        record,
        "r115_ccfi_primary_reserve_ratio"
      );
      // pr_nonrestrictedNetAssets_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "pr_nonrestrictedNetAssets_Client",
        record,
        "r017_net_assets_without_donor_restriction"
      );

      // pr_restrictedNetAssets_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "pr_restrictedNetAssets_Client",
        record,
        "r018_net_assets_restricted_by_time_or_purpose"
      );

      // pr_propertyAndEquipment_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "pr_propertyAndEquipment_Client",
        record,
        "r099_ctotal_property_and_equipment_less_depreciation"
      );

      // pr_notesPayable_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "pr_notesPayable_Client",
        record,
        "r015_notes_payable"
      );

      // pr_cfi_primaryReserveAdjustment_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "pr_cfi_primaryReserveAdjustment_Client",
        record,
        "r114_cfi_primary_reserve_adjustment_number"
      );

      // pr_totalFunctionalExpenses_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "pr_totalFunctionalExpenses_Client",
        record,
        "r044_ctotal_functional_expenses"
      );

      // NET INCOME OPERATIONS RATIO ---------------------------------->

      // netIncomeOperationsRatio
      insertDataIntoObject(
        "client",
        year,
        object,
        "netIncomeOperationsRatio_Client",
        record,
        "r116_ccfi_net_income_operations_ratio"
      );

      // ni_operatingRevenuesSupportAndReleases
      insertDataIntoObject(
        "client",
        year,
        object,
        "ni_operatingRevenuesSupportAndReleases_Client",
        record,
        "r036_coperating_revenues_support_and_releases"
      );

      // ni_totalFunctionalExpenses
      insertDataIntoObject(
        "client",
        year,
        object,
        "ni_totalFunctionalExpenses_Client",
        record,
        "r044_ctotal_functional_expenses"
      );

      // ni_nonOperatingActivitiesInvestmentIncome
      insertDataIntoObject(
        "client",
        year,
        object,
        "ni_nonOperatingActivitiesInvestmentIncome_Client",
        record,
        "r047_non_operating_activities_investment_income"
      );

      // CFI RETURN ON NET ASSETS ---------------------------------->

      // returnOnNetAssets
      insertDataIntoObject(
        "client",
        year,
        object,
        "returnOnNetAssets_Client",
        record,
        "r117_ccfi_return_on_net_assets_total_return_ratio"
      );
      // ro_changeInNetAssets_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "ro_changeInNetAssets_Client",
        record,
        "r065_cchange_in_net_assets"
      );
      // ro_netAssetsBeginningOfYear_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "ro_netAssetsBeginningOfYear_Client",
        record,
        "r066_net_assets_beginning_of_year"
      );

      // CFI RETURN ON NET ASSETS ---------------------------------->

      // viabilityRatio
      insertDataIntoObject(
        "client",
        year,
        object,
        "viabilityRatio_Client",
        record,
        "r118_ccfi_viability_ratio"
      );
      // vr_nonrestrictedNetAssets
      insertDataIntoObject(
        "client",
        year,
        object,
        "vr_nonrestrictedNetAssets_Client",
        record,
        "r017_net_assets_without_donor_restriction"
      );
      // vr_restrictedNetAssets
      insertDataIntoObject(
        "client",
        year,
        object,
        "vr_restrictedNetAssets_Client",
        record,
        "r018_net_assets_restricted_by_time_or_purpose"
      );
      // vr_totalPropertyAndEquipment
      insertDataIntoObject(
        "client",
        year,
        object,
        "vr_totalPropertyAndEquipment_Client",
        record,
        "r099_ctotal_property_and_equipment_less_depreciation"
      );
      // vr_accumulatedDepreciation
      insertDataIntoObject(
        "client",
        year,
        object,
        "vr_accumulatedDepreciation_Client",
        record,
        "r098_accumulated_depreciation"
      );
      // vr_notesPayable
      insertDataIntoObject(
        "client",
        year,
        object,
        "vr_notesPayable_Client",
        record,
        "r015_notes_payable"
      );
    });
  });

  localStorage.removeItem("cfiData");
  localStorage.setItem("cfiData", JSON.stringify(object));

  const selectedYears = getSelectedYearsFromLocalStorage();

  // console.log({ selectedYears });

  const cfiValue =
    object.cfiRatio_Client[seledctedYears[selectedYears.length - 1]].value;
  updateCfiValue(cfiValue, selectedYears[selectedYears.length - 1]);
  const thCfiScoreElement = document.getElementById("th_cfiScore");
  thCfiScoreElement.textContent =
    cfiValue !== undefined && !isNaN(cfiValue) && cfiValue !== 0
      ? cfiValue
      : "-";
};

// Helper functions   ----------------------------------------------->

const countUniqueClients = (records) => {
  uniqueClients = new Set();
  const clientsByYear = new Map(); // Map to store unique clients by year
  
  try {
    records.forEach((record) => {
      const mainRelatedClient = record.querySelector("merged_client_name").textContent;
      const year = record.querySelector("year").textContent;
      
      // Add to overall unique clients
      uniqueClients.add(mainRelatedClient);
      
      // Add to year-specific tracking
      if (!clientsByYear.has(year)) {
        clientsByYear.set(year, new Set());
      }
      clientsByYear.get(year).add(mainRelatedClient);
    });

    window.uniqueClientSize = uniqueClients.size;
    window.clientsByYear = clientsByYear; // Store in window for access elsewhere
    
    // Update total unique clients count
    document.getElementById("uniqueClients").textContent = uniqueClients.size;
    
    // Log year-by-year breakdown
    console.log("Unique clients by year:");
    clientsByYear.forEach((clients, year) => {
      console.log(`${year}: ${clients.size} unique clients`);
    });
    
  } catch (error) {
    console.error("Error counting unique clients:", error);
    document.getElementById("uniqueClients").textContent = 0;
  }
};

const toggleButtonLoadingState = (btn) => {
  btn.innerHTML = `
    <svg aria-hidden="true" role="status" class="inline w-6 h-6 me-3 text-xl colorGreen font-extrabold animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
    </svg>
    Loading...`;
  btn.disabled = true;
};

const toggleButtonNormalState = (btn) => {
  btn.innerHTML = `
    <span class='text-xl mr-2'>Run</span>
    <svg class="w-8 h-8 text-2xl text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m7 16 4-4-4-4m6 8 4-4-4-4"/>
    </svg>`;
  btn.disabled = false;
};

const toggleGenerateReportButtonNormalState = (btn) => {
  btn.innerHTML = `
  Generate Trends and Benchmark Reports
`;
};

const processSelectedYears = () => {
  const selectedYears = getSelectedYearsFromLocalStorage();

  // console.log(selectedYears);

  if (!selectedYears) {
    createToastWarning("Please select year(s) for data to appear");
    throw new Error("No years selected.");
  }

  if (!selectedYears.length) {
    createToastWarning("Please select year(s) for data to appear");
    throw new Error("No years selected.");
  }

  return selectedYears;
};

const saveSelectedYearsToLocalStorage = (selectedYears_Set) => {
  const selectedYearsArray = Array.from(selectedYears_Set).sort(
    (a, b) => a - b
  );
  localStorage.setItem("selectedYears", JSON.stringify(selectedYearsArray));
};

const resetSelectedYears = () => {
  const selectedYears_Set = new Set();
  saveSelectedYearsToLocalStorage(selectedYears_Set);
};

const processApiCalls = (selectedYears, recordsPeer, recordsClient) => {
  processCfiData(selectedYears, recordsPeer, recordsClient);
  processDoeData(selectedYears, recordsPeer, recordsClient);
  processFinancialAnalysisContentData(
    selectedYears,
    recordsPeer,
    recordsClient
  );
  processFinancialStatementContentData(recordsPeer, recordsClient);
  processFinancialPositionContentData(
    selectedYears,
    recordsPeer,
    recordsClient
  );
  processRevenueExpenseContentData(selectedYears, recordsPeer, recordsClient);
  processDebtEndowmentContentData(selectedYears, recordsPeer, recordsClient);
};

const displayComponents = () => {
  displayCfiComponent();
  displayDoeComponent();
  displayFinancialAnalysisContentComponent();
  displayFinancialStatementComponent();
  displayFinancialPositionComponent();
  displayRevenueAndExpenseComponent();
  displayDebtAndEndowmentComponent();
  displayReportComponent();
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let recordClientHTMLArray = [];
let recordPeerHTMLArray = [];

// Replace the existing run button event listener with the AppController-based version
document.addEventListener("DOMContentLoaded", () => {
  // Initialize the run button with the AppController
  const run_btn = document.querySelector("#run");
  if (run_btn) {
    // Remove any existing listeners to prevent duplicates
    const newRunButton = run_btn.cloneNode(true);
    if (run_btn.parentNode) {
      run_btn.parentNode.replaceChild(newRunButton, run_btn);
    }
    
    // Use the AppController's handleRunButtonClick method
    newRunButton.addEventListener("click", () => {
      // Show loading state
      toggleButtonLoadingState(newRunButton);
      // Call the AppController method
      appController.handleRunButtonClick().finally(() => {
        // Ensure button returns to normal state when done
        toggleButtonNormalState(newRunButton);
      });
    });
  }
});

// Remove the old event listener - it's being replaced by the AppController
// const run_btn = document.querySelector("#run");
// run_btn.addEventListener("click", async () => {
//   // Old implementation removed
// });

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const getParsedData = (xmlString) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");
  return xmlDoc.querySelectorAll("record");
};

const getRecordsForPeer = async (years, dataStr = "<qdbapi>") => {
  if (years.length === 0) {
    const parsedData = getParsedData(dataStr + "</qdbapi>");
    return parsedData;
  }

  const currentYear = years[0];
  let allRecords = new Set();
  let recordsArray = [];

  try {
    const query = {
      act: "API_DoQuery",
      query: `{7.EX.${currentYear}} AND {638.EX.'COMPLETE'}`,
      clist: "7.3.536.619.537.618.534.539.758.759.757.760.761.741.541.549.551.547.553.390.392.396.393.395.600.606.390.392.396.393.395.390.391.549.392.395.393.394.411.450.451.452.453.454.455.727.546.397.394.398.622.621.623.624.625.626.627.629.630.631.632.633.634.635.636.32.33.34.35.36.37.38.39.40.41.42.43.44.45.46.47.48.49.50.51.481.91.111.131.151.171.191.557.616.614.615.386.641.217.557.611.605.552.391.390.609.217.557.643.644.645.646.550.638.566"
    };

    const xml = await $.get(peerData, query);
    const records = $("record", xml).toArray();

    records.forEach(record => {
      const newRecord = document.createElement("record");
      Array.from(record.children).forEach((child) => {
        newRecord.appendChild(child.cloneNode(true));
      });
      recordPeerHTMLArray.push(newRecord.outerHTML);
      dataStr += newRecord.outerHTML;
    });

  } catch (error) {
    console.error("Error in query execution:", error);
  }

  return getRecordsForPeer(years.slice(1), dataStr);
};

// Initialize client data store and dispatch event
const initializeClientDataStore = (peerRecords) => {
  // Create client data store if it doesn't exist
  window.clientDataStore = window.clientDataStore || {};
  
  // Process peer records to populate client data store
  peerRecords.forEach(record => {
    const clientName = record.querySelector('merged_client_name')?.textContent;
    if (!clientName) return;
    
    // Create or update client data object
    window.clientDataStore[clientName] = window.clientDataStore[clientName] || {};
    
    // Store filter-relevant data
    window.clientDataStore[clientName].region = record.querySelector('merged_region')?.textContent;
    window.clientDataStore[clientName].state = record.querySelector('merged_state')?.textContent;
    window.clientDataStore[clientName].type = record.querySelector('merged_type')?.textContent;
    window.clientDataStore[clientName].athletic = record.querySelector('merged_athletic')?.textContent;
    window.clientDataStore[clientName].seminary = record.querySelector('merged_seminary')?.textContent;
    window.clientDataStore[clientName].regional = record.querySelector('merged_regional')?.textContent;
    window.clientDataStore[clientName].enrollment = parseInt(record.querySelector('merged_enrollment')?.textContent) || 0;
    
    // Parse memberships field (comma-separated)
    const membershipsStr = record.querySelector('merged_memberships')?.textContent;
    if (membershipsStr) {
      window.clientDataStore[clientName].memberships = membershipsStr.split(',').map(m => m.trim());
    }
  });
  
  // Dispatch event to notify that client data is loaded
  const event = new CustomEvent('clientDataLoaded', {
    detail: { dataStore: window.clientDataStore }
  });
  document.dispatchEvent(event);
};

// Update getRecordsForUniqueClientPeerNames to include client data store initialization
const getRecordsForUniqueClientPeerNames = async () => {
  if (!window.selectedClients_Array) {
    window.selectedClients_Array = new Set();
  }

  const apiCallPeerData = {
    act: "API_DoQuery",
    clist: "7.533.539.536.619.741.758.759.757.760.761.638" // Keep existing field numbers
  };

  try {
    const xml = await $.get(peerData, apiCallPeerData);
    const recordsForPeerUniqueClientPeerNames = $("record", xml).toArray();
    const uniquePeerClientNames = new Set();

    // Create a global client data storage if it doesn't exist
    if (!window.clientDataStore) {
      window.clientDataStore = {};
    }

    // Create a string to hold the XML data
    let xmlString = "<qdbapi>";

    recordsForPeerUniqueClientPeerNames.forEach((record) => {
      const clientInformalName = record.querySelector(
        "pe___client_informal_name"
      )?.textContent;

      if (clientInformalName) {
        uniquePeerClientNames.add(clientInformalName);

        // Store client data with all required fields
        if (!window.clientDataStore[clientInformalName]) {
          // Get fiscal year
          const year = record.querySelector(
            "fiscal_ye_date_formatted_year_text"
          )?.textContent;

          // Store client data with existing fields
          window.clientDataStore[clientInformalName] = {
            name: clientInformalName,
            year: year
          };
        }

        // Add record's outerHTML to the XML string
        xmlString += record.outerHTML;
      }
    });

    // Close the XML string
    xmlString += "</qdbapi>";

    const sortedUniquePeerClientNames = Array.from(
      uniquePeerClientNames
    ).sort();

    // Add to global selected clients array
    if (typeof selectedClients_Array !== "undefined") {
      sortedUniquePeerClientNames.forEach((item) =>
        selectedClients_Array.add(item)
      );
    }

    // Check if the function exists before calling it
    if (typeof addUniqueClientsToOptionsSelectClientsDropdown === "function") {
      addUniqueClientsToOptionsSelectClientsDropdown(
        sortedUniquePeerClientNames
      );
    } else {
      console.error(
        "addUniqueClientsToOptionsSelectClientsDropdown function is not defined"
      );
    }

    // Initialize filter handlers after client data is loaded
    initializeFilterHandlers();

    window.sortedUniquePeerClientNames = sortedUniquePeerClientNames;
    
    // Process the records
    processClientPeerRecords(recordsForPeerUniqueClientPeerNames);

    return sortedUniquePeerClientNames;
  } catch (error) {
    console.error("Error fetching unique client names:", error);
    return [];
  }
}

// Helper function to process peer records
const processClientPeerRecords = (records) => {
  if (!records || !Array.isArray(records) || records.length === 0) {
    console.warn("No records provided to processClientPeerRecords");
    return;
  }

  const uniquePeerClientNames = new Set();

  records.forEach((record) => {
    const clientNameElement = record.querySelector("merged_client_name");
    if (clientNameElement && clientNameElement.textContent) {
      const clientInformalName = clientNameElement.textContent;
      uniquePeerClientNames.add(clientInformalName);
    }
  });

  const sortedUniquePeerClientNames = Array.from(uniquePeerClientNames).sort();
  sortedUniquePeerClientNames.forEach((item) => window.selectedClients_Array.add(item));

  // Store peer record data for later use
  window.recordPeerHTMLArray = records.map(record => record.outerHTML);

  // Initialize client data store
  initializeClientDataStore(records);

  // Add unique clients to dropdown
  addUniqueClientsToOptionsSelectClientsDropdown(sortedUniquePeerClientNames);
};

const getRecordsForClient = async (years, dataStr) => {
  if (years.length === 0) {
    // Base case: return the final string when the array is empty
    const parsedData = getParsedData(dataStr + "</qdbapi>");
    return parsedData;
  }

  const currentYear = years[0];
  const apiCallClientData = {
    act: "API_DoQuery",
    query: `
	    {7.EX.${currentYear}} AND {533.EX.${ClientRid}}`,
    clist:
      "539.7.533.536.619.537.618.534.580.578.576.577.579.712.725.722.719.714.726.723.720.717.724.721.718.387.388.569.386.632.551.550.406.561.418.567.441.540.541.542.600.606.390.392.396.393.395.391.549.394.411.450.451.452.453.454.455.727.570.571.572.546.397.398.373.374.375.376.377.378.379.380.381.382.383.384.385.326.541.387.338.542.390.391.548.402.403.404.405.551.407.408.409.410.557.411.412.415.416.417.560.561.419.420.421.422.423.424.425.426.427.428.571.435.572.566.389.399.400.401.402.403.404.405.551.406.407.408.409.410.557.411.412.413.414.559.415.416.417.560.561.450.451.452.453.454.455.429.430.431.432.571.433.434.435.572.437.438.439.440.567.441.567.441.569.442.429.641.635.481.482.483.709.32.33.34.35.36.37.38.39.40.41.42.43.44.45.46.47.48.49.50.51.450.451.551.546.711.614.613.633.603.633.621.710.504.550.217.980.981.982.985.983.984.609.608.581.582.583.584.585.586.587.588.589.590.591.592.593.594.595.596.971.972.973.355.1075.1076.1077.1078",
  };

  try {
    const xml = await $.get(clientData, apiCallClientData);
    const recordsForClient = $("record", xml).toArray();
    //console.log('recordsForClient', recordsForClient[0].children)
    //console.log($('record', xml))
    //console.log(`year - ${currentYear}`)

    // Update dataStr with the records from the current API call
    recordsForClient.forEach((record, index) => {
      // if (index < 4) console.log(`Client`, record);

      // Create a new record element
      const newRecord = document.createElement("record");

      // Append each child element to the new record
      Array.from(record.children).forEach((child) => {
        newRecord.appendChild(child.cloneNode(true));
      });

      recordClientHTMLArray.push(newRecord.outerHTML);

      // Append the new record's outerHTML to dataStr
      dataStr += newRecord.outerHTML;
    });

    // Recursive call with updated years and dataStr
    return getRecordsForClient(years.slice(1), dataStr);
  } catch (error) {
    console.error("Error fetching data:", error);
    // Handle the error as needed
    return dataStr; // Return the accumulated data so far even in case of an error
  }
};

// Initialize filter handlers
const initializeFilterHandlers = () => {
  document.addEventListener('filtersChanged', handleFiltersChanged);
};

// Handle filters changed
const handleFiltersChanged = async () => {
  try {
    // Clear existing records
    recordPeerHTMLArray = [];
    
    // Get selected years
    const selectedYears = getSelectedYearsFromLocalStorage();
    if (!selectedYears || selectedYears.length === 0) {
      console.error("No years selected");
      return;
    }

    // Update UI to show loading state
    const generateReportBtn = document.getElementById("generateReportBtn");
    if (generateReportBtn) {
      toggleButtonLoadingState(generateReportBtn);
    }

    // Get records with updated filters
    const records = await getRecordsForPeer(selectedYears);
    
    // Update unique clients count
    countUniqueClients(records);
    
    // Process the data
    processApiCalls(selectedYears, records, recordsClient);
    
    // Display components
    displayComponents();

    // Reset UI loading state
    if (generateReportBtn) {
      toggleButtonNormalState(generateReportBtn);
    }
  } catch (error) {
    console.error("Error handling filters changed:", error);
    
    // Reset UI loading state on error
    const generateReportBtn = document.getElementById("generateReportBtn");
    if (generateReportBtn) {
      toggleButtonNormalState(generateReportBtn);
    }
  }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', async () => {
  // Initialize filter handlers
  initializeFilterHandlers();
  
  // First get unique client names to populate dropddown
  await getRecordsForUniqueClientPeerNames();
  
  // Process selected years (if any are already selected)
  const selectedYears = getSelectedYearsFromLocalStorage();
  if (selectedYears && selectedYears.length > 0) {
    // Get peer records for selected years
    const peerRecords = await getRecordsForPeer(selectedYears);
    
    // Get client records if needed
    const clientRecords = await getRecordsForClient(selectedYears);
    
    // Process API calls with the data
    processApiCalls(selectedYears, peerRecords, clientRecords);
    
    // Display components
    displayComponents();
  }
});

// UI Manager class to handle all UI-related operations
class UIManager {
  constructor() {
    this.dropdowns = {
      years: document.getElementById('years'),
      regions: document.getElementById('regions'),
      states: document.getElementById('states'),
      memberships: document.getElementById('memberships'),
      types: document.getElementById('types'),
      athletics: document.getElementById('athletics'),
      regionals: document.getElementById('regionals'),
      seminaries: document.getElementById('seminaries')
    };
    
    this.buttons = {
      run: document.getElementById('run'),
      generateReport: document.getElementById('generateReport')
    };
    
    this.firmNameElement = document.getElementById('firmName');
  }

  // Initialize all UI components
  initialize() {
    this.initializeFilterHandlers();
    this.initializeEventListeners();
  }

  // Initialize event listeners
  initializeEventListeners() {
    // Add any additional event listeners here
  }

  // Initialize filter handlers
  initializeFilterHandlers() {
    const filterElements = document.querySelectorAll('[data-filter]');
    filterElements.forEach(element => {
      element.addEventListener('change', this.handleFiltersChanged.bind(this));
    });
  }

  // Handle filter changes
  async handleFiltersChanged() {
    try {
      await getRecordsForUniqueClientPeerNames();
      this.updateDropdowns();
    } catch (error) {
      console.error('Error handling filter changes:', error);
    }
  }

  // Update all dropdowns with current data
  updateDropdowns() {
    this.addUniqueItemsToDropdown('regions', regions_Array);
    this.addUniqueItemsToDropdown('states', states_Array);
    this.addUniqueItemsToDropdown('memberships', memberships_Array);
    this.addUniqueItemsToDropdown('types', types_Array);
    this.addUniqueItemsToDropdown('athletics', athletics_Array);
    this.addUniqueItemsToDropdown('regionals', regional_Array);
    this.addUniqueItemsToDropdown('seminaries', seminary_Array);
  }

  // Generic method to add items to a dropdown
  addUniqueItemsToDropdown(dropdownId, items) {
    const dropdown = this.dropdowns[dropdownId];
    if (!dropdown || !Array.isArray(items)) return;

    // Clear existing options except the first one (if it exists)
    while (dropdown.options.length > 1) {
      dropdown.remove(1);
    }

    // Add new options
    items.forEach(item => {
      if (item && item.trim()) {
        const option = document.createElement('option');
        option.value = item;
        option.textContent = item;
        dropdown.appendChild(option);
      }
    });
  }

  // Add years to the year selection dropdown
  addUniqueYearsToDropdown(years) {
    if (!Array.isArray(years)) {
      console.warn('Invalid years array provided');
      return;
    }

    const yearsDropdown = this.dropdowns.years;
    if (!yearsDropdown) return;

    // Clear existing options
    yearsDropdown.innerHTML = '';

    // Add new options
    years.forEach(year => {
      const option = document.createElement('option');
      option.value = year;
      option.textContent = year;
      yearsDropdown.appendChild(option);
    });
  }

  // Update firm name in UI
  updateFirmName(name) {
    if (this.firmNameElement) {
      this.firmNameElement.textContent = name;
    }
    window.firmName = name;
  }

  // Toggle button states
  toggleButtonLoadingState(button) {
    if (!button) return;
    button.disabled = true;
    button.classList.add('loading');
  }

  toggleButtonNormalState(button) {
    if (!button) return;
    button.disabled = false;
    button.classList.remove('loading');
  }

  toggleGenerateReportButtonNormalState(button) {
    if (!button) return;
    button.disabled = false;
    button.classList.remove('loading');
    button.textContent = 'Generate Report';
  }
}

// Create a global instance of UIManager
const uiManager = new UIManager();

// Initialize UI when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  uiManager.initialize();
  getRecordsForUniqueClientPeerNames();
});

// Handle page unload
window.addEventListener('beforeunload', () => {
  localStorage.clear();
});

// Data Manager class to handle all data-related operations
class DataManager {
  constructor() {
    this.clientData = null;
    this.peerData = null;
    this.uniqueYears = new Set();
  }

  // Process and find unique years from data
  findUniqueYears(data) {
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.warn("Invalid or empty data provided to findUniqueYears");
      return;
    }

    this.uniqueYears.clear();
    const firstRecord = data[0];
    
    try {
      // If data is array of objects with year property
      if (typeof firstRecord === 'object' && firstRecord.year) {
        data.forEach((record) => {
          if (record.year && !this.uniqueYears.has(record.year)) {
            this.uniqueYears.add(record.year);
          }
        });
      } 
      // If data is from DOM elements/records with year child element
      else if (firstRecord.querySelector) {
        data.forEach((record) => {
          const yearElement = record.querySelector("year");
          if (yearElement && yearElement.textContent) {
            this.uniqueYears.add(yearElement.textContent);
          }
        });
      }
      
      const uniqueYearsArray = Array.from(this.uniqueYears).sort((a, b) => b - a);
      window.uniqueYears_Array = uniqueYearsArray;
      
      // Update UI with unique years
      uiManager.addUniqueYearsToDropdown(uniqueYearsArray);
    } catch (error) {
      console.error("Error processing years data:", error);
    }
  }

  // Count unique clients in records
  countUniqueClients(records) {
    if (!records || !Array.isArray(records)) {
      console.warn("Invalid records provided to countUniqueClients");
      return;
    }

    const uniqueClients = new Set();
    
    records.forEach(record => {
      const clientName = record.querySelector("merged_client_name")?.textContent;
      if (clientName) {
        uniqueClients.add(clientName);
      }
    });

    window.uniqueClientsCount = uniqueClients.size;
    return uniqueClients.size;
  }

  // Parse XML data
  getParsedData(xmlString) {
    const parser = new DOMParser();
    return parser.parseFromString(xmlString, "text/xml");
  }

  // Initialize client data store
  initializeClientDataStore(peerRecords) {
    if (!peerRecords || !Array.isArray(peerRecords)) {
      console.warn("Invalid peer records provided");
      return;
    }

    const uniqueClients = new Set();
    const uniqueStates = new Set();
    const uniqueMemberships = new Set();
    const uniqueTypes = new Set();
    const uniqueAthletics = new Set();
    const uniqueRegionals = new Set();
    const uniqueSeminaries = new Set();
    const uniqueRegions = new Set();

    peerRecords.forEach(record => {
      const clientName = record.querySelector("merged_client_name")?.textContent;
      const state = record.querySelector("state")?.textContent;
      const membership = record.querySelector("membership")?.textContent;
      const type = record.querySelector("type")?.textContent;
      const athletic = record.querySelector("athletic")?.textContent;
      const regional = record.querySelector("regional")?.textContent;
      const seminary = record.querySelector("seminary")?.textContent;
      const region = record.querySelector("region")?.textContent;

      if (clientName) uniqueClients.add(clientName);
      if (state) uniqueStates.add(state);
      if (membership) uniqueMemberships.add(membership);
      if (type) uniqueTypes.add(type);
      if (athletic) uniqueAthletics.add(athletic);
      if (regional) uniqueRegionals.add(regional);
      if (seminary) uniqueSeminaries.add(seminary);
      if (region) uniqueRegions.add(region);
    });

    // Update global arrays
    window.clients_Array = Array.from(uniqueClients);
    window.states_Array = Array.from(uniqueStates);
    window.memberships_Array = Array.from(uniqueMemberships);
    window.types_Array = Array.from(uniqueTypes);
    window.athletics_Array = Array.from(uniqueAthletics);
    window.regional_Array = Array.from(uniqueRegionals);
    window.seminary_Array = Array.from(uniqueSeminaries);
    window.regions_Array = Array.from(uniqueRegions);

    // Update UI dropdowns
    uiManager.updateDropdowns();
  }

  // Process client and peer records
  processClientPeerRecords(records) {
    if (!records || !Array.isArray(records)) {
      console.warn("Invalid records provided to processClientPeerRecords");
      return;
    }

    const processedRecords = records.map(record => {
      const newRecord = document.createElement("record");
      Array.from(record.children).forEach(child => {
        newRecord.appendChild(child.cloneNode(true));
      });
      return newRecord;
    });

    return processedRecords;
  }
}

// Create a global instance of DataManager
const dataManager = new DataManager();