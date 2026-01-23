// Data Model and Business Logic Classes
class DataStore {
  constructor() {
    this.generalData = {};
    this.cashData = {};
    this.debtData = {};
    this.incomeData = {};
    this.expenseData = {};
    this.additionalData = {};
  }

  /**
   * Save all data categories to localStorage with compression and error handling
   */
  saveAllToLocalStorage() {
    try {
      // Check storage quota first
      const quotaInfo = this.checkStorageQuota();

      // Estimate new data size
      const sizeInfo = this.estimateDataSize();
      // console.log(`New data size: ${sizeInfo.sizeMB}MB`);

      // Check if we're approaching quota limits
      if (parseFloat(quotaInfo.percentage) > 80) {
        // console.warn("Storage quota is high, clearing old data before saving");
        this.clearAllStorage();
      }

      // Only log if there's an issue
      if (parseFloat(quotaInfo.percentage) > 50) {
        // console.log(
        //   `Storage usage: ${quotaInfo.usedMB}MB (${quotaInfo.percentage}%)`
        // );
      }

      // Try to save all data at once first
      this.saveCompressedData();
    } catch (error) {
      // console.warn(
      //   "Failed to save all data at once, trying chunked approach:",
      //   error
      // );

      // If bulk save fails, try chunked approach
      this.saveDataInChunks();
    }
  }

  /**
   * Save compressed data with size checking
   */
  saveCompressedData() {
    const data = {
      generalData: this.generalData,
      cashData: this.cashData,
      debtData: this.debtData,
      incomeData: this.incomeData,
      expenseData: this.expenseData,
      additionalData: this.additionalData,
    };

    const dataString = JSON.stringify(data);
    const dataSize = new Blob([dataString]).size;
    const maxSize = 6 * 1024 * 1024; // 6MB limit

    // Only log if there's an issue
    if (dataSize > maxSize) {
      // console.log(
      //   `Data size: ${(dataSize / 1024 / 1024).toFixed(
      //     2
      //   )}MB - exceeds limit, using chunked approach`
      // );
      throw new Error(
        `Data size (${(dataSize / 1024 / 1024).toFixed(
          2
        )}MB) exceeds safe limit`
      );
    }

    // Save each category separately to avoid quota issues
    Object.keys(data).forEach((category) => {
      const categoryData = JSON.stringify(data[category]);
      const categorySize = new Blob([categoryData]).size;

      if (categorySize > 1 * 1024 * 1024) {
        // 1MB per category limit
        // console.warn(
        //   `Category ${category} is large: ${(
        //     categorySize /
        //     1024 /
        //     1024
        //   ).toFixed(2)}MB`
        // );
      }

      localStorage.setItem(category, categoryData);
    });
  }

  /**
   * Save data in chunks if too large
   */
  saveDataInChunks() {
    const categories = [
      "generalData",
      "cashData",
      "debtData",
      "incomeData",
      "expenseData",
      "additionalData",
    ];

    categories.forEach((category) => {
      const categoryData = this[category];
      const categoryString = JSON.stringify(categoryData);
      const categorySize = new Blob([categoryString]).size;

      if (categorySize > 1 * 1024 * 1024) {
        // If category > 1MB, split it
        this.saveLargeCategoryInChunks(category, categoryData);
      } else {
        localStorage.setItem(category, categoryString);
      }
    });
  }

  /**
   * Save large category data in chunks
   */
  saveLargeCategoryInChunks(categoryKey, categoryData) {
    const chunkSize = 500 * 1024; // 500KB chunks
    const dataString = JSON.stringify(categoryData);
    const totalChunks = Math.ceil(dataString.length / chunkSize);

    // Save metadata
    localStorage.setItem(
      `${categoryKey}_metadata`,
      JSON.stringify({ totalChunks, chunked: true })
    );

    // Save chunks
    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, dataString.length);
      const chunk = dataString.slice(start, end);
      localStorage.setItem(`${categoryKey}_chunk_${i}`, chunk);
    }
  }

  /**
   * Check storage quota
   */
  checkStorageQuota() {
    try {
      let totalSize = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          totalSize += localStorage[key].length + key.length;
        }
      }

      const sizeInMB = (totalSize / (1024 * 1024)).toFixed(2);
      const quota = 10; // Typical 10MB limit
      const percentage = ((totalSize / (quota * 1024 * 1024)) * 100).toFixed(1);

      return {
        usedMB: sizeInMB,
        totalMB: quota,
        percentage: percentage,
      };
    } catch (error) {
      // console.error("Error checking storage quota:", error);
      return { usedMB: "unknown", totalMB: 10, percentage: "unknown" };
    }
  }

  /**
   * Estimate data size before saving
   */
  estimateDataSize() {
    const data = {
      generalData: this.generalData,
      cashData: this.cashData,
      debtData: this.debtData,
      incomeData: this.incomeData,
      expenseData: this.expenseData,
      additionalData: this.additionalData,
    };

    const dataString = JSON.stringify(data);
    const sizeInBytes = new Blob([dataString]).size;
    const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2);

    return { sizeBytes: sizeInBytes, sizeMB: sizeInMB };
  }

  /**
   * Load from localStorage
   */
  loadFromLocalStorage() {
    const categories = [
      "generalData",
      "cashData",
      "debtData",
      "incomeData",
      "expenseData",
      "additionalData",
    ];

    categories.forEach((category) => {
      this[category] = this.loadCategoryFromStorage(category);
    });
  }

  /**
   * Load category from storage (handle chunked data)
   */
  loadCategoryFromStorage(categoryKey) {
    const metadata = localStorage.getItem(`${categoryKey}_metadata`);

    if (metadata) {
      const { totalChunks, chunked } = JSON.parse(metadata);
      if (chunked) {
        return this.reconstructChunkedData(categoryKey, { totalChunks });
      }
    }

    const data = localStorage.getItem(categoryKey);
    return data ? JSON.parse(data) : {};
  }

  /**
   * Reconstruct chunked data
   */
  reconstructChunkedData(categoryKey, metadata) {
    let reconstructed = "";
    for (let i = 0; i < metadata.totalChunks; i++) {
      const chunk = localStorage.getItem(`${categoryKey}_chunk_${i}`);
      if (chunk) {
        reconstructed += chunk;
      }
    }
    return reconstructed ? JSON.parse(reconstructed) : {};
  }

  /**
   * Get all data
   */
  getAllData() {
    return {
      generalData: this.generalData,
      cashData: this.cashData,
      debtData: this.debtData,
      incomeData: this.incomeData,
      expenseData: this.expenseData,
      additionalData: this.additionalData,
    };
  }

  /**
   * Check if data exists in storage
   */
  hasDataInStorage() {
    return (
      localStorage.getItem("generalData") !== null ||
      localStorage.getItem("cashData") !== null ||
      localStorage.getItem("debtData") !== null ||
      localStorage.getItem("incomeData") !== null ||
      localStorage.getItem("expenseData") !== null
    );
  }

  /**
   * Clear all storage
   */
  clearAllStorage() {
    // Preserve selectedYears before clearing
    const preservedKeys = ["selectedYears"];
    const savedValues = {};
    
    // Save values we want to keep
    preservedKeys.forEach((key) => {
      savedValues[key] = localStorage.getItem(key);
    });
    
    // Clear all localStorage (like HigherEducation project)
    localStorage.clear();
    
    // Restore preserved values
    Object.keys(savedValues).forEach((key) => {
      if (savedValues[key]) {
        localStorage.setItem(key, savedValues[key]);
      }
    });
  }

  /**
   * Clear method for data model
   */
  clear() {
    this.generalData = {};
    this.cashData = {};
    this.debtData = {};
    this.incomeData = {};
    this.expenseData = {};
    this.additionalData = {};

    // Also clear localStorage
    this.clearAllStorage();
  }

  /**
   * Get data category
   */
  getDataCategory(category) {
    return this[category] || {};
  }

  /**
   * Decode HTML entities
   */
  decodeHtmlEntities(htmlString) {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = htmlString;
    return textarea.value;
  }

  /**
   * Insert data into the data store
   * @param {string} category - Data category (general, cash, debt, income, expense)
   * @param {string} type - Type of data (client or peer)
   * @param {string} year - Year
   * @param {string} dataKey - Key for the data
   * @param {object} record - XML record
   * @param {string} child - XML child element name
   * @param {string} dynamicValueClientPeer - Field for dynamic value
   * @param {string} name - Optional name for grouping
   */
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
    const targetData = this[`${category}Data`];

    const childElement = record.querySelector(child);
    let innerData;
    if (childElement && childElement.innerHTML !== null && childElement.innerHTML !== undefined) {
      const trimmedContent = childElement.innerHTML.trim();
      // Store value even if it's "0" (valid data), but store null if truly empty
      if (trimmedContent.length > 0) {
        innerData = trimmedContent;
      } else {
        innerData = null; // Field exists but is empty
      }
    } else {
      // Field doesn't exist in XML
      innerData = null;
    }

    // Decode HTML entities if the value is a string (typically for benchmark paragraphs)
    // Don't decode "0" as it's a valid numeric value
    if (typeof innerData === 'string' && innerData !== '0' && innerData !== null) {
      innerData = this.decodeHtmlEntities(innerData);
    }

    if (type === "client") {
      const benchmarkField = dynamicValueClientPeer
        ? record.querySelector(dynamicValueClientPeer)?.textContent.trim()
        : undefined;
      // Store data even if null (field missing/empty), so structure exists
      this.insertClientData(
        targetData,
        dataKey,
        year,
        innerData, // This will be null if field doesn't exist
        record,
        benchmarkField
      );
    } else if (type === "peer") {
      const yesNoField = dynamicValueClientPeer
        ? record.querySelector(dynamicValueClientPeer)?.textContent.trim()
        : "empty";
      this.insertPeerData(
        targetData,
        dataKey,
        year,
        innerData,
        record,
        yesNoField,
        name
      );
    }
  }

  /**
   * Insert client data
   */
  insertClientData(targetData, dataKey, year, value, record, benchmarkField) {
    if (!targetData[dataKey]) {
      targetData[dataKey] = {};
    }
    if (!targetData[dataKey][year]) {
      targetData[dataKey][year] = {};
    }
    // Store value (which can be null if field doesn't exist or is empty)
    targetData[dataKey][year].value = value;
    if (benchmarkField !== undefined && benchmarkField !== null && benchmarkField !== "") {
      targetData[dataKey][year].benchmark = benchmarkField;
    }
  }

  /**
   * Insert peer data
   */
  insertPeerData(targetData, dataKey, year, value, record, yesNoField, name) {
    // Log first few calls for debugging
    if (!this._peerDataLogCount) this._peerDataLogCount = 0;
    if (this._peerDataLogCount < 3) {
      // console.log(`insertPeerData called: dataKey=${dataKey}, year=${year}, value=${value}, yesNoField=${yesNoField}`);
      this._peerDataLogCount++;
    }
    
    if (yesNoField === "Yes" || yesNoField === "empty") {
      if (!targetData[dataKey]) {
        targetData[dataKey] = {};
      }
      if (!targetData[dataKey][year]) {
        targetData[dataKey][year] = [];
      }

      const dataValue = yesNoField === "Yes" ? value : 0;

      if (!name) {
        if (!targetData[dataKey]["total"]) {
          targetData[dataKey]["total"] = [];
        }
        targetData[dataKey]["total"].push(dataValue);
      } else {
        // If name is provided, organize by name as well (for weighted averages)
        if (!targetData[dataKey][name]) {
          targetData[dataKey][name] = {};
        }

        if (!targetData[dataKey][name]["total"]) {
          targetData[dataKey][name]["total"] = [];
        }

        if (!targetData[dataKey][name][year]) {
          targetData[dataKey][name][year] = [];
        }

        targetData[dataKey][name]["total"].push(dataValue);
        targetData[dataKey][name][year].push(dataValue);
      }

      targetData[dataKey][year].push(dataValue);
    }
  }
}

// Data Processing Class
class DataProcessor {
  constructor(dataStore) {
    this.dataStore = dataStore;
  }

  /**
   * Process all data categories
   */
  processAllData(years, recordsPeer, recordsClient) {
    this.processGeneralData(years, recordsPeer, recordsClient);
    this.processCashData(years, recordsPeer, recordsClient);
    this.processDebtData(years, recordsPeer, recordsClient);
    this.processIncomeData(years, recordsPeer, recordsClient);
    this.processExpenseData(years, recordsPeer, recordsClient);

    // Log generalData structure before saving
    // console.log("📦 generalData before saving to localStorage:");
    // console.log("Keys:", Object.keys(this.dataStore.generalData || {}));
    const firstKey = Object.keys(this.dataStore.generalData || {})[0];
    if (firstKey) {
      // console.log(`Sample (${firstKey}):`, this.dataStore.generalData[firstKey]);
    }

    // Save to localStorage
    this.dataStore.saveAllToLocalStorage();
    
    // Verify what was saved
    const savedGeneral = JSON.parse(localStorage.getItem("generalData"));
    // console.log("💾 generalData after saving to localStorage:");
    // console.log("Keys:", Object.keys(savedGeneral || {}));
  }

  /**
   * Filter records by year
   */
  filterRecordsByYear(records, year) {
    // Handle null or undefined records
    if (!records) {
      // console.warn("Records is null or undefined");
      return [];
    }

    // Convert to array if it's not already one
    const recordsArray = Array.isArray(records) ? records : Array.from(records);

    return recordsArray.filter((record) => {
      try {
        // Check if record is a DOM element
        if (record && typeof record.querySelector === "function") {
          const fiscalYear =
            record.querySelector("s52_formatted_year")?.textContent;
          return fiscalYear && fiscalYear.includes(year.toString());
        }
        // Check if record is an object with direct properties
        else if (record && record.year) {
          const fiscalYear = record.year;
          return fiscalYear && fiscalYear.includes(year.toString());
        }
        // If neither format works, log and skip this record
        else {
          // console.warn("Unrecognized record format:", record);
          return false;
        }
      } catch (error) {
        // console.error("Error filtering record by year:", error, record);
        return false;
      }
    });
  }

  /**
   * Process General Data
   */
  processGeneralData(years, recordsPeer, recordsClient) {
    // console.log(
    //   `📊 processGeneralData called with ${years.length} years, ${recordsPeer?.length || 0} peer records, ${recordsClient?.length || 0} client records`
    // );
    
    years.forEach((year) => {
      const filteredPeerRecords = this.filterRecordsByYear(recordsPeer, year);
      // console.log(`Year ${year}: ${filteredPeerRecords.length} peer records filtered`);
      
      filteredPeerRecords.forEach((record, idx) => {
        // Log first record for debugging
        if (idx === 0) {
          const givingUnits = record.querySelector("s02___giving_units")?.textContent;
          const yesNo = record.querySelector("cfhi_stand_00a_yes_no___giving_units")?.textContent;
          // console.log(`  First record - Giving Units: ${givingUnits}, YesNo: ${yesNo}`);
        }
        
        // givingUnits
        this.dataStore.insertData(
          "general",
          "peer",
          year,
          "givingUnits_Peer",
          record,
          "s02___giving_units",
          "cfhi_stand_00a_yes_no___giving_units"
        );

        // contributionsWithoutDonorExcludingLargeGifts
        this.dataStore.insertData(
          "general",
          "peer",
          year,
          "contributionsWithoutDonorExcludingLargeGifts_Peer",
          record,
          "s39___contribution_without_donor_restriction",
          "cfhi_stand_00b_yes_no___contribution_w_o_dr"
        );

        // totalContributionsExclude
        this.dataStore.insertData(
          "general",
          "peer",
          year,
          "totalContributionsExclude_Peer",
          record,
          "s40___total_contribution",
          "cfhi_stand_00b_yes_no___total_contributions"
        );
      });

      const filteredClientRecords = this.filterRecordsByYear(
        recordsClient,
        year
      );
      // console.log(`Year ${year}: ${filteredClientRecords.length} client records filtered`);
      // console.log(`Total client records passed: ${recordsClient?.length || 0}`);
      
      filteredClientRecords.forEach((record, idx) => {
        // Log first record for debugging
        if (idx === 0) {
          const givingUnits = record.querySelector("s02___giving_units")?.textContent;
          // console.log(`  First client record - Giving Units: ${givingUnits}`);
        }
        
        // givingUnits
        this.dataStore.insertData(
          "general",
          "client",
          year,
          "givingUnits_Client",
          record,
          "s02___giving_units"
        );


        // givingUnits_percentChange (client data only, no peer data)
        this.dataStore.insertData(
          "general",
          "client",
          year,
          "givingUnits_percentChange_Client",
          record,
          "cfhi_stand_00_ratio_change___giving_units"
        );

        // contributionsWithoutDonorExcludingLargeGifts
        this.dataStore.insertData(
          "general",
          "client",
          year,
          "contributionsWithoutDonorExcludingLargeGifts_Client",
          record,
          "s39___contribution_without_donor_restriction"
        );


        // totalContributionsExclude
        this.dataStore.insertData(
          "general",
          "client",
          year,
          "totalContributionsExclude_Client",
          record,
          "s40___total_contribution"
        );
      });
    });
  }

  /**
   * Process Cash Data
   */
  processCashData(years, recordsPeer, recordsClient) {
    years.forEach((year) => {
      const filteredPeerRecords = this.filterRecordsByYear(recordsPeer, year);
      filteredPeerRecords.forEach((record) => {
        // f
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "daysOperatingCash_Peer",
          record,
          "cfhi_stand_01_ratio___days_oper_cash_and_inv_on_hand_to_fund_annual_expenditures",
          "cfhi_stand_01_yes_no___days_oper_cash_and_inv_on_hand_to_fund_annual_expenditures"
        );

        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "totalCash",
          record,
          "s18___total_cash",
          "cfhi_stand_01_yes_no___days_oper_cash_and_inv_on_hand_to_fund_annual_expenditures",
          "daysOperatingCash"
        );

        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "nonEndowmentInvestment",
          record,
          "s20___non_endowment_investment",
          "cfhi_stand_01_yes_no___days_oper_cash_and_inv_on_hand_to_fund_annual_expenditures",
          "daysOperatingCash"
        );

        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "netAssetWithDonorRestriction",
          record,
          "s36___net_asset_with_donor_restriction",
          "cfhi_stand_01_yes_no___days_oper_cash_and_inv_on_hand_to_fund_annual_expenditures",
          "daysOperatingCash"
        );

        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "totalExpense",
          record,
          "s45___total_expense",
          "cfhi_stand_01_yes_no___days_oper_cash_and_inv_on_hand_to_fund_annual_expenditures",
          "daysOperatingCash"
        );

        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "totalDepreciationExpense",
          record,
          "s46___total_depreciation_expense",
          "cfhi_stand_01_yes_no___days_oper_cash_and_inv_on_hand_to_fund_annual_expenditures",
          "daysOperatingCash"
        );

        // netCashAvailability
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "netCashAvailability_Peer",
          record,
          "cfhi_stand_02_ratio___net_cash_availability",
          "cfhi_stand_02_yes_no___net_cash_availability"
        );

        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "totalCash",
          record,
          "s18___total_cash",
          "cfhi_stand_02_yes_no___net_cash_availability",
          "netCashAvailability"
        );

        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "nonEndowmentInvestment",
          record,
          "s20___non_endowment_investment",
          "cfhi_stand_02_yes_no___net_cash_availability",
          "netCashAvailability"
        );

        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "currentLiabilities",
          record,
          "s26___current_liabilities",
          "cfhi_stand_02_yes_no___net_cash_availability",
          "netCashAvailability"
        );

        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "shortTermConstructionLineOfCredit",
          record,
          "s31___short_term_construction_line_of_credit",
          "cfhi_stand_02_yes_no___net_cash_availability",
          "netCashAvailability"
        );

        // netCashAvailability_standard
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "netCashAvailability_standard_Peer",
          record,
          "cfhi_stand_02a_ratio___one_month_of_cash_expenses",
          "cfhi_stand_02a_yes_no___one_month_of_cash_expenses"
        );

        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "totalExpense",
          record,
          "s45___total_expense",
          "cfhi_stand_02a_yes_no___one_month_of_cash_expenses",
          "netCashAvailability_standard"
        );

        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "totalDepreciationExpense",
          record,
          "s46___total_depreciation_expense",
          "cfhi_stand_02a_yes_no___one_month_of_cash_expenses",
          "netCashAvailability_standard"
        );
      });

      const filteredClientRecords = this.filterRecordsByYear(
        recordsClient,
        year
      );
      filteredClientRecords.forEach((record) => {
        // daysOperatingCash
        this.dataStore.insertData(
          "cash",
          "client",
          year,
          "daysOperatingCash_Client",
          record,
          "cfhi_stand_01_ratio___days_oper_cash_and_inv_on_hand_to_fund_annual_expenditures",
          "cfhi_stand_01_bench_rating___days_oper_cash_and_inv_on_hand_to_fund_annual_expenditures"
        );

        // daysOperatingCash benchmark paragraph
        this.dataStore.insertData(
          "cash",
          "client",
          year,
          "daysOperatingCash_benchmarkParagraph",
          record,
          "cfhi_stand_01_bench_paragraph___days_oper_cash_and_inv_on_hand_to_fund_annual_expenditures"
        );

        // netCashAvailability
        this.dataStore.insertData(
          "cash",
          "client",
          year,
          "netCashAvailability_Client",
          record,
          "cfhi_stand_02_ratio___net_cash_availability",
          "cfhi_stand_02_bench_rating___net_cash_availability"
        );

        // netCashAvailability benchmark paragraph
        this.dataStore.insertData(
          "cash",
          "client",
          year,
          "netCashAvailability_benchmarkParagraph",
          record,
          "cfhi_stand_02_bench_paragraph___net_cash_availability"
        );

        // netCashAvailability_standard
        this.dataStore.insertData(
          "cash",
          "client",
          year,
          "netCashAvailability_standard_Client",
          record,
          "cfhi_stand_02a_ratio___one_month_of_cash_expenses"
        );
      });
    });
  }

  /**
   * Process Debt Data
   */
  processDebtData(years, recordsPeer, recordsClient) {
    years.forEach((year) => {
      const filteredPeerRecords = this.filterRecordsByYear(recordsPeer, year);
      filteredPeerRecords.forEach((record) => {
        // debtToContributionsWithout
        this.dataStore.insertData(
          "debt",
          "peer",
          year,
          "debtToContributionsWithout_Peer",
          record,
          "cfhi_stand_03_ratio___debt_to_contribution_w_o_donor_rest",
          "cfhi_stand_03_yes_no___debt_to_contribution_w_o_donor_rest"
        );
        this.dataStore.insertData(
          "debt",
          "peer",
          year,
          "totalDebt",
          record,
          "s155___total_debt",
          "cfhi_stand_03_yes_no___debt_to_contribution_w_o_donor_rest",
          "debtToContributionsWithout"
        );
        this.dataStore.insertData(
          "debt",
          "peer",
          year,
          "contributionWithoutDonor",
          record,
          "s39___contribution_without_donor_restriction",
          "cfhi_stand_03_yes_no___debt_to_contribution_w_o_donor_rest",
          "debtToContributionsWithout"
        );

        // debtPerGivingUnit
        this.dataStore.insertData(
          "debt",
          "peer",
          year,
          "debtPerGivingUnit_Peer",
          record,
          "cfhi_stand_04_ratio___debt_per_givingunit",
          "cfhi_stand_04_yes_no___debt_per_givingunit"
        );

        this.dataStore.insertData(
          "debt",
          "peer",
          year,
          "totalDebt",
          record,
          "s155___total_debt",
          "cfhi_stand_04_yes_no___debt_per_givingunit",
          "debtPerGivingUnit"
        );

        this.dataStore.insertData(
          "debt",
          "peer",
          year,
          "givingUnits",
          record,
          "s02___giving_units",
          "cfhi_stand_04_yes_no___debt_per_givingunit",
          "debtPerGivingUnit"
        );

        // contributionsWithoutDonorPerGivingUnit_standard
        this.dataStore.insertData(
          "debt",
          "peer",
          year,
          "contributionsWithoutDonorPerGivingUnit_standard_Peer",
          record,
          "cfhi_stand_04a_ratio___2_x_contributions_w_o_donor_restrictions_per_giving_unit",
          "cfhi_stand_04a_yes_no___2_x_contributions_w_o_donor_restrictions_per_giving_unit"
        );

        this.dataStore.insertData(
          "debt",
          "peer",
          year,
          "contributionWithoutDonor",
          record,
          "s39___contribution_without_donor_restriction",
          "cfhi_stand_04a_yes_no___2_x_contributions_w_o_donor_restrictions_per_giving_unit",
          "contributionsWithoutDonorPerGivingUnit_standard"
        );

        this.dataStore.insertData(
          "debt",
          "peer",
          year,
          "givingUnits",
          record,
          "s02___giving_units",
          "cfhi_stand_04a_yes_no___2_x_contributions_w_o_donor_restrictions_per_giving_unit",
          "contributionsWithoutDonorPerGivingUnit_standard"
        );
      });

      const filteredClientRecords = this.filterRecordsByYear(
        recordsClient,
        year
      );
      filteredClientRecords.forEach((record) => {
        // debtToContributionsWithout
        this.dataStore.insertData(
          "debt",
          "client",
          year,
          "debtToContributionsWithout_Client",
          record,
          "cfhi_stand_03_ratio___debt_to_contribution_w_o_donor_rest",
          "cfhi_stand_03_bench_rating___debt_to_contribution_w_o_donor_rest"
        );

        // debtToContributionsWithout benchmark paragraph
        this.dataStore.insertData(
          "debt",
          "client",
          year,
          "debtToContributionsWithout_benchmarkParagraph",
          record,
          "cfhi_stand_03_bench_paragraph___debt_to_contribution_w_o_donor_rest"
        );

        // debtPerGivingUnit
        this.dataStore.insertData(
          "debt",
          "client",
          year,
          "debtPerGivingUnit_Client",
          record,
          "cfhi_stand_04_ratio___debt_per_givingunit",
          "cfhi_stand_04_bench_rating___debt_per_givingunit"
        );

        // debtPerGivingUnit benchmark paragraph
        this.dataStore.insertData(
          "debt",
          "client",
          year,
          "debtPerGivingUnit_benchmarkParagraph",
          record,
          "cfhi_stand_04_bench_paragraph___debt_per_givingunit"
        );

        // contributionsWithoutDonorPerGivingUnit_standard
        this.dataStore.insertData(
          "debt",
          "client",
          year,
          "contributionsWithoutDonorPerGivingUnit_standard_Client",
          record,
          "cfhi_stand_04a_ratio___2_x_contributions_w_o_donor_restrictions_per_giving_unit"
        );
      });
    });
  }

  /**
   * Process Income Data
   */
  processIncomeData(years, recordsPeer, recordsClient) {
    years.forEach((year) => {
      const filteredPeerRecords = this.filterRecordsByYear(recordsPeer, year);
      filteredPeerRecords.forEach((record) => {
        // contributionsWithoutDonorPerGivingUnit
        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "contributionsWithoutDonorPerGivingUnit_Peer",
          record,
          "cfhi_stand_05_ratio___contribution_w_o_donor_restriction_per_giving_unit",
          "cfhi_stand_05_yes_no___contribution_w_o_donor_restriction_per_giving_unit"
        );

        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "contributionWithoutDonor",
          record,
          "s39___contribution_without_donor_restriction",
          "cfhi_stand_05_yes_no___contribution_w_o_donor_restriction_per_giving_unit",
          "contributionsWithoutDonorPerGivingUnit"
        );

        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "givingUnits",
          record,
          "s02___giving_units",
          "cfhi_stand_05_yes_no___contribution_w_o_donor_restriction_per_giving_unit",
          "contributionsWithoutDonorPerGivingUnit"
        );

        // totalContributionsPerGivingUnit
        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "totalContributionsPerGivingUnit_Peer",
          record,
          "cfhi_stand_06_ratio___total_contributions_per_giving_unit",
          "cfhi_stand_06_yes_no___total_contributions_per_giving_unit"
        );

        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "totalContributions",
          record,
          "s40___total_contribution",
          "cfhi_stand_06_yes_no___total_contributions_per_giving_unit",
          "totalContributionsPerGivingUnit"
        );

        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "givingUnits",
          record,
          "s02___giving_units",
          "cfhi_stand_06_yes_no___total_contributions_per_giving_unit",
          "totalContributionsPerGivingUnit"
        );
      });

      const filteredClientRecords = this.filterRecordsByYear(
        recordsClient,
        year
      );
      filteredClientRecords.forEach((record) => {
        // contributionsWithoutDonorPerGivingUnit
        this.dataStore.insertData(
          "income",
          "client",
          year,
          "contributionsWithoutDonorPerGivingUnit_Client",
          record,
          "cfhi_stand_05_ratio___contribution_w_o_donor_restriction_per_giving_unit"
        );

        // contributionsWithoutDonorPerGivingUnit benchmark paragraph
        this.dataStore.insertData(
          "income",
          "client",
          year,
          "contributionsWithoutDonorPerGivingUnit_benchmarkParagraph",
          record,
          "cfhi_stand_05_bench_paragraph___contribution_w_o_donor_restriction_per_giving_unit"
        );

        // contributionsWithoutDonorPerGivingUnit_percentChange
        this.dataStore.insertData(
          "income",
          "client",
          year,
          "contributionsWithoutDonorPerGivingUnit_percentChange_Client",
          record,
          "cfhi_stand_05a_ratio_change___contribution_w_o_donor_restriction_per_giving_unit",
          "cfhi_stand_05a_bench_rating__percent_change___contribution_w_o_donor_restriction_per_giving_unit"
        );

        // contributionsWithoutDonorPerGivingUnit_percentChange benchmark paragraph
        this.dataStore.insertData(
          "income",
          "client",
          year,
          "contributionsWithoutDonorPerGivingUnit_percentChange_benchmarkParagraph",
          record,
          "cfhi_stand_05a_bench_paragraph___percent_change___contribution_w_o_donor_restriction_per_giving_unit"
        );

        // totalContributionsPerGivingUnit
        this.dataStore.insertData(
          "income",
          "client",
          year,
          "totalContributionsPerGivingUnit_Client",
          record,
          "cfhi_stand_06_ratio___total_contributions_per_giving_unit", 
          "cfhi_stand_06_bench_rating___total_contributions_per_giving_unit"
        );

        // totalContributionsPerGivingUnit benchmark paragraph
        // this.dataStore.insertData(
        //   "income",
        //   "client",
        //   year,
        //   "totalContributionsPerGivingUnit_benchmarkParagraph",
        //   record,
        //   "cfhi_compre_06_bench_paragraph___debt_to_contributions_w_o_donor_restrictions"
        // );

        this.dataStore.insertData(
          "debt",
          "client",
          year,
          "debtPerGivingUnit_benchmarkParagraph",
          record,
          "cfhi_stand_04_bench_paragraph___debt_per_givingunit"
        );

        // totalContributionsPerGivingUnit_percentChange
        this.dataStore.insertData(
          "income",
          "client",
          year,
          "totalContributionsPerGivingUnit_percentChange_Client",
          record,
          "cfhi_stand_06a_ratio_change__total_contributions_per_giving_unit",
          "cfhi_stand_06a_bench_rating___percentage_change__total_contributions_per_giving_unit"
        );

        // totalContributionsPerGivingUnit_percentChange benchmark paragraph
        this.dataStore.insertData(
          "income",
          "client",
          year,
          "totalContributionsPerGivingUnit_percentChange_benchmarkParagraph",
          record,
          "cfhi_stand_06a_bench_paragraph___percent_change__total_contributions_per_giving_unit"
        );

        // localCountyPerGivingUnit
        this.dataStore.insertData(
          "income",
          "client",
          year,
          "localCountyPerGivingUnit_Client",
          record,
          "cfhi_stand_07_ratio___median_household_income_given_to_the_church"
        );

        // localCountyMedianHouseholdIncome
        this.dataStore.insertData(
          "income",
          "client",
          year,
          "localCountyMedianHouseholdIncome_Client",
          record,
          "s54_county_code___data"
        );

        // localCountyName
        this.dataStore.insertData(
          "income",
          "client",
          year,
          "localCountyName_Client",
          record,
          "s54_county_code___county"
        );
      });
    });
  }

  /**
   * Process Expense Data
   */
  processExpenseData(years, recordsPeer, recordsClient) {
    years.forEach((year) => {
      const filteredPeerRecords = this.filterRecordsByYear(recordsPeer, year);
      filteredPeerRecords.forEach((record) => {
        // cashExpendituresPerGivingUnit
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "cashExpendituresPerGivingUnit_Peer",
          record,
          "cfhi_stand_08_ratio___cash_expenses_per_giving_unit",
          "cfhi_stand_08_yes_no___cash_expenses_per_giving_unit"
        );

        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "totalExpense",
          record,
          "s45___total_expense",
          "cfhi_stand_08_yes_no___cash_expenses_per_giving_unit",
          "cashExpendituresPerGivingUnit"
        );

        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "totalDepreciationExpense",
          record,
          "s46___total_depreciation_expense",
          "cfhi_stand_08_yes_no___cash_expenses_per_giving_unit",
          "cashExpendituresPerGivingUnit"
        );

        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "givingUnits",
          record,
          "s02___giving_units",
          "cfhi_stand_08_yes_no___cash_expenses_per_giving_unit",
          "cashExpendituresPerGivingUnit"
        );

        // personnelIncludingToTotalCashExpenditures
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "personnelIncludingToTotalCashExpenditures_Peer",
          record,
          "cfhi_stand_09_ratio___personnel__including_outsourced_personnel__to_total_cash_expenditures",
          "cfhi_stand_09_yes_no___personnel__including_outsourced_personnel__to_total_cash_expenditures"
        );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "costOfOutsourcedEmployee",
          record,
          "s162___cost_of_outsourced_employee",
          "cfhi_stand_09_yes_no___personnel__including_outsourced_personnel__to_total_cash_expenditures",
          "personnelIncludingToTotalCashExpenditures"
        );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "totalSalaries",
          record,
          "s10___total_salaries_and_housing",
          "cfhi_stand_09_yes_no___personnel__including_outsourced_personnel__to_total_cash_expenditures",
          "personnelIncludingToTotalCashExpenditures"
        );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "totalExpense",
          record,
          "s45___total_expense",
          "cfhi_stand_09_yes_no___personnel__including_outsourced_personnel__to_total_cash_expenditures",
          "personnelIncludingToTotalCashExpenditures"
        );

        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "totalDepreciationExpense",
          record,
          "s46___total_depreciation_expense",
          "cfhi_stand_09_yes_no___personnel__including_outsourced_personnel__to_total_cash_expenditures",
          "personnelIncludingToTotalCashExpenditures"
        );
      });

      const filteredClientRecords = this.filterRecordsByYear(
        recordsClient,
        year
      );
      filteredClientRecords.forEach((record) => {
        // cashExpendituresPerGivingUnit
        this.dataStore.insertData(
          "expense",
          "client",
          year,
          "cashExpendituresPerGivingUnit_Client",
          record,
          "cfhi_stand_08_ratio___cash_expenses_per_giving_unit"
        );

        // cashExpendituresPerGivingUnit benchmark paragraph
        this.dataStore.insertData(
          "expense",
          "client",
          year,
          "cashExpendituresPerGivingUnit_benchmarkParagraph",
          record,
          "cfhi_stand_08_bench_paragraph___cash_expenses_per_giving_unit"
        );

        // personnelIncludingToTotalCashExpenditures
        this.dataStore.insertData(
          "expense",
          "client",
          year,
          "personnelIncludingToTotalCashExpenditures_Client",
          record,
          "cfhi_stand_09_ratio___personnel__including_outsourced_personnel__to_total_cash_expenditures",
          "cfhi_stand_09_bench_rating___personnel__including_outsourced_personnel__to_total_cash_expenditures"
        );

        // personnelIncludingToTotalCashExpenditures benchmark paragraph
        this.dataStore.insertData(
          "expense",
          "client",
          year,
          "personnelIncludingToTotalCashExpenditures_benchmarkParagraph",
          record,
          "cfhi_stand_09_bench_paragraph___personnel__including_outsourced_personnel__to_total_cash_expenditures"
        );
      });
    });
  }
}

// API Service Class for Quickbase Integration
class ApiService {
  constructor() {
    this.baseUrl = "https://qbcapitalmanagement.quickbase.com";
    this.userToken = "bdqk4z_qh_0_efzgz73p69tg4exwdqhxudtg6s2fgje";
    this.appId = "bsnm4tgde";
    this.recordClientHTMLArray = [];
    this.recordPeerHTMLArray = [];
  }

  /**
   * Deduplicate peer records by keeping only the most recent record per client per year.
   * Uses s52 - Fiscal YE Date (field 222) as the primary criterion, with Record ID# (field 3) as tiebreaker.
   * This ensures that eligibility is determined per year by evaluating only the most recent YE record for each client.
   * 
   * @param {NodeList|Array} records - Array of peer XML record elements
   * @returns {Array} - Deduplicated array of record elements
   */
  deduplicatePeerRecordsByClientAndYear(records) {
    if (!records || records.length === 0) {
      return [];
    }

    // Convert NodeList to Array if necessary
    const recordsArray = Array.isArray(records) ? records : Array.from(records);
    
    // Map to store: { "clientName|year": { record, yeDate, recordId } }
    const clientYearMap = new Map();
    
    let duplicatesFound = 0;
    let recordsProcessed = 0;

    recordsArray.forEach((record) => {
      try {
        // Extract client name - try multiple possible field names
        const clientName = 
          record.querySelector("client___merged_client_name")?.textContent?.trim() ||
          record.querySelector("client_name")?.textContent?.trim();
        
        // Extract year (field 195 - s52 Formatted Year)
        const year = 
          record.querySelector("s52_formatted_year")?.textContent?.trim() ||
          record.querySelector("year")?.textContent?.trim();
        
        // Extract fiscal YE date (field 222 - s52 - Fiscal YE Date)
        const yeDateStr = 
          record.querySelector("s52___fiscal_ye_date")?.textContent?.trim() ||
          record.querySelector("fiscal_ye_date")?.textContent?.trim();
        
        // Extract record ID (field 3)
        const recordIdStr = 
          record.querySelector("record_id_")?.textContent?.trim() ||
          record.querySelector("rid")?.textContent?.trim() ||
          record.getAttribute("rid");

        if (!clientName || !year) {
          // Skip records without essential identification fields
          // console.warn("Skipping record without client name or year:", { clientName, year });
          return;
        }

        recordsProcessed++;
        const key = `${clientName}|${year}`;
        
        // Parse YE date - Quickbase dates are typically in format: YYYY-MM-DD or epoch
        let yeDate = null;
        if (yeDateStr) {
          // Try parsing as date string or epoch
          const parsed = Date.parse(yeDateStr);
          if (!isNaN(parsed)) {
            yeDate = parsed;
          } else {
            // Try as epoch number
            const epoch = parseInt(yeDateStr, 10);
            if (!isNaN(epoch)) {
              yeDate = epoch;
            }
          }
        }
        
        const recordId = parseInt(recordIdStr, 10) || 0;
        
        const existing = clientYearMap.get(key);
        
        if (!existing) {
          // First record for this client-year combination
          clientYearMap.set(key, { record, yeDate, recordId });
        } else {
          // Compare to determine which record to keep
          duplicatesFound++;
          let shouldReplace = false;
          
          if (yeDate !== null && existing.yeDate !== null) {
            // Both have YE dates - compare dates (keep more recent)
            if (yeDate > existing.yeDate) {
              shouldReplace = true;
            } else if (yeDate === existing.yeDate && recordId > existing.recordId) {
              // Same YE date - use record ID as tiebreaker (higher = newer)
              shouldReplace = true;
            }
          } else if (yeDate !== null && existing.yeDate === null) {
            // Current has YE date, existing doesn't - prefer current
            shouldReplace = true;
          } else if (yeDate === null && existing.yeDate === null) {
            // Neither has YE date - use record ID as tiebreaker
            if (recordId > existing.recordId) {
              shouldReplace = true;
            }
          }
          // If existing has YE date and current doesn't, keep existing (no replace)
          
          if (shouldReplace) {
            clientYearMap.set(key, { record, yeDate, recordId });
          }
        }
      } catch (error) {
        // console.error("Error processing record for deduplication:", error);
      }
    });

    // Extract just the records from the map
    const deduplicatedRecords = Array.from(clientYearMap.values()).map(entry => entry.record);
    
    if (duplicatesFound > 0) {
      // console.log(`📊 Peer deduplication: Processed ${recordsProcessed} records, found ${duplicatesFound} duplicates, returning ${deduplicatedRecords.length} unique client-year records`);
    }
    
    return deduplicatedRecords;
  }

  /**
   * Get records for peer organizations with filtering
   * @param {Array} years - Array of years to fetch
   * @param {string} dataStr - Accumulated XML data string
   */
  async getRecordsForPeer(years, dataStr = "<qdbapi>") {
    if (years.length === 0) {
      // Base case: return the final string when the array is empty
      try {
        // If no data was collected, return empty array
        if (dataStr === "<qdbapi>") {
          // console.warn("No records collected, returning empty array");
          return [];
        }

        const parser = new DOMParser();
        const finalXmlString = dataStr + "</qdbapi>";
        // console.log('peer records (non-batched)', finalXmlString);
        const xmlDoc = parser.parseFromString(
          finalXmlString,
          "text/xml"
        );
        const records = xmlDoc.querySelectorAll("record");
        
        // Deduplicate peer records: keep only the most recent YE record per client per year
        const deduplicatedRecords = this.deduplicatePeerRecordsByClientAndYear(records);
        return deduplicatedRecords;
      } catch (error) {
        // console.error("Error parsing XML in getRecordsForPeer:", error);
        return [];
      }
    }

    const currentYear = years[0];

    try {
      // Get selected clients query
      const clientQuery = this.getClientQuery(window.selectedClients_Array);

      // Basic query condition with year and client query
      let queryCondition = `{195.EX.${currentYear}} AND ${clientQuery}`;

      // Add survey type filter based on includeComprehensive state
      if (window.includeComprehensive === true) {
        queryCondition += " AND ({193.EX.'Standard'} OR {193.EX.'Comprehensive'})";
      } else {
        queryCondition += " AND {193.EX.'Standard'}";
      }

      // Add giving units filter
      if (
        window.sliderValue !== undefined &&
        window.sliderValue2 !== undefined
      ) {
        queryCondition += ` AND {123.GTE.${window.sliderValue}} AND {123.LTE.${window.sliderValue2}}`;
      }

      // Add regions filter
      if (
        window.selectedRegions_Array &&
        window.selectedRegions_Array.length > 0
      ) {
        const regionConditions = window.selectedRegions_Array
          .map((region) => `{267.EX.${region}}`)
          .join(" OR ");
        queryCondition += ` AND (${regionConditions})`;
      }

      // Add sites filter
      if (window.selectedSites_Array && window.selectedSites_Array.length > 0) {
        const siteConditions = window.selectedSites_Array
          .map((site) => `{268.EX.${site}}`)
          .join(" OR ");
        queryCondition += ` AND (${siteConditions})`;
    }

    const apiCallPeerData = {
      act: "API_DoQuery",
        query: queryCondition,
      clist:
          // Added field 3 (Record ID#) and 222 (s52 - Fiscal YE Date) for proper deduplication by most recent YE
          "3.222.195.123.122.186.301.267.268.193.160.161.143.145.164.165.149.154.184.304.305.306.307.308.309.310.311.312.313.314.315.316.317.318.319.320.321.407.408.409.329.352.137.155.158.330.331.420.421.131.175",
      };

      // Use await to make the async operation more explicit
      const xml = await $.get(peerData, apiCallPeerData);
      // console.log("PEER XML", xml);
      const recordsForPeer = $("record", xml).toArray();

      // Collect records for later use
      if (recordsForPeer.length > 0) {
        for (const record of recordsForPeer) {
          const newRecord = document.createElement("record");

          // Append each child element to the new record
          Array.from(record.children).forEach((child) => {
            newRecord.appendChild(child.cloneNode(true));
          });

          this.recordPeerHTMLArray.push(newRecord.outerHTML);
          dataStr += newRecord.outerHTML;
        }
      } else {
        // console.warn(`No records found for year ${currentYear}`);
      }

      // Update per-year record count map
      try {
        if (
          !window.peerRecordMapPerYear ||
          typeof window.peerRecordMapPerYear.set !== "function"
        ) {
          window.peerRecordMapPerYear = new Map();
        }
        window.peerRecordMapPerYear.set(
          String(currentYear),
          recordsForPeer.length
        );
      } catch (e) {
        // console.error("Unable to update peerRecordMapPerYear:", e);
      }

      // Recursive call with updated years and dataStr
      return await this.getRecordsForPeer(years.slice(1), dataStr);
    } catch (error) {
      // console.error("Error fetching peer data for year", currentYear, error);

      // Log error details
      if (error.status) {
        // console.error(
        //   `Status: ${error.status}, StatusText: ${error.statusText}`
        // );
      }

      // Continue with next year even if this one failed
      try {
        if (
          !window.peerRecordMapPerYear ||
          typeof window.peerRecordMapPerYear.set !== "function"
        ) {
          window.peerRecordMapPerYear = new Map();
        }
        window.peerRecordMapPerYear.set(String(currentYear), 0);
      } catch (e) {
        // console.error(
        //   "Unable to set 0 count in peerRecordMapPerYear after error:",
        //   e
        // );
      }
      return await this.getRecordsForPeer(years.slice(1), dataStr);
    }
  }

  /**
   * Get records for peer with batching to handle large client lists
   * @param {Array} years - Array of years to fetch
   * @param {Set|Array} selectedClientsSet - Set or array of selected client names
   * @param {string} dataStr - Accumulated XML data string
   */
  async getRecordsForPeerWithBatching(
    years,
    selectedClientsSet,
    dataStr = "<qdbapi>"
  ) {
    // Initialize record arrays if they don't exist
    if (!this.recordPeerHTMLArray) {
      this.recordPeerHTMLArray = [];
    }

    const selectedClients = Array.from(selectedClientsSet);

    // If 15 or fewer clients, use the original method
    if (selectedClients.length <= 15) {
      return await this.getRecordsForPeer(years, dataStr);
    }

    // console.log(
    //   `Using batching for ${selectedClients.length} clients across ${years.length} years`
    // );

    // Pre-calculate all filter conditions once
    const filterParts = [];
    
    // Include survey type filter based on includeComprehensive state
    if (window.includeComprehensive === true) {
      filterParts.push(`({193.EX.'Standard'} OR {193.EX.'Comprehensive'})`);
    } else {
      filterParts.push(`{193.EX.'Standard'}`);
    }
    
    // Add giving units filter if defined
    // console.log("🎚️ Slider values:", {
    //   sliderValue: window.sliderValue,
    //   sliderValue2: window.sliderValue2,
    //   selectedRegions: window.selectedRegions_Array?.length || 0,
    //   selectedSites: window.selectedSites_Array?.length || 0
    // });
    
    if (window.sliderValue !== undefined && window.sliderValue2 !== undefined) {
      filterParts.push(
        `{123.GTE.${window.sliderValue}} AND {123.LTE.${window.sliderValue2}}`
      );
    }
    
    if (window.selectedRegions_Array?.length > 0) {
      const regionConditions = window.selectedRegions_Array
        .map((region) => `{267.EX.${region}}`)
        .join(" OR ");
      filterParts.push(`(${regionConditions})`);
    }
    if (window.selectedSites_Array?.length > 0) {
      const siteConditions = window.selectedSites_Array
        .map((site) => `{268.EX.${site}}`)
        .join(" OR ");
      filterParts.push(`(${siteConditions})`);
    }
    const additionalFilters = ` AND ${filterParts.join(" AND ")}`;
    
    // console.log("📝 Filter parts:", filterParts);

    // Pre-escape all client names once
    const escapedClients = selectedClients.map((client) =>
      this._escapeClientName(client)
    );

    // Split clients into batches of 15 (Standard mode uses field 186 which can be longer)
    const BATCH_SIZE = 15;
    const clientBatches = [];
    for (let i = 0; i < escapedClients.length; i += BATCH_SIZE) {
      clientBatches.push(escapedClients.slice(i, i + BATCH_SIZE));
    }

    // console.log(
    //   `Split into ${clientBatches.length} batches of ${BATCH_SIZE} clients each`
    // );

    // apiCallForPeerDataBatched
    const apiCalls = [];
    // Added field 3 (Record ID#) and 222 (s52 - Fiscal YE Date) for proper deduplication by most recent YE
    const clist =
      "3.222.195.123.122.186.301.267.268.193.160.161.143.145.164.165.149.154.184.304.305.306.307.308.309.310.311.312.313.314.315.316.317.318.319.320.321.407.408.409.329.352.137.158.155.330.331.420.421.131.175";

    for (const currentYear of years) {
      for (let batchIndex = 0; batchIndex < clientBatches.length; batchIndex++) {
        const clientBatch = clientBatches[batchIndex];
        const clientConditions = clientBatch
          .map((client) => `{301.EX.'${client}'}`)
          .join(" OR ");
        const queryCondition = `{195.EX.${currentYear}} AND (${clientConditions})${additionalFilters}`;

        // Log first query for debugging
        if (currentYear === years[0] && batchIndex === 0) {
          // console.log("🔍 Sample query for year", currentYear, "batch 1:");
          // console.log("Query:", queryCondition);
          // console.log("clist:", clist);
        }

        const apiCallPeerData = {
          act: "API_DoQuery",
          query: queryCondition,
          clist: clist,
        };

        apiCalls.push($.get(peerData, apiCallPeerData));
      }
    }

    // console.log(
    //   `Executing ${apiCalls.length} API calls (${years.length} years × ${clientBatches.length} batches)`
    // );

    // Execute all API calls in parallel with limited concurrency
    const CONCURRENCY_LIMIT = 5; // Limit concurrent requests to avoid overwhelming server
    const results = [];

    for (let i = 0; i < apiCalls.length; i += CONCURRENCY_LIMIT) {
      const batch = apiCalls.slice(i, i + CONCURRENCY_LIMIT);
      try {
        const batchResults = await Promise.allSettled(batch);
        results.push(...batchResults);

        // console.log(
        //   `Completed batch ${Math.floor(i / CONCURRENCY_LIMIT) + 1}/${Math.ceil(apiCalls.length / CONCURRENCY_LIMIT)}`
        // );

        // Small delay between batches to be API-friendly
        if (i + CONCURRENCY_LIMIT < apiCalls.length) {
          await new Promise((resolve) => setTimeout(resolve, 50));
        }
      } catch (error) {
        // console.error("Error in batch execution:", error);
      }
    }

    // Process all results efficiently
    const recordHtmlParts = [];
    let successfulCalls = 0;
    let failedCalls = 0;
    
    for (let idx = 0; idx < results.length; idx++) {
      const result = results[idx];
      
      if (result.status === "fulfilled") {
        successfulCalls++;
        try {
          const xml = result.value;
          
          // Use jQuery once per response, then process natively
          const $records = $("record", xml);
          
          // Log record count for first batch
          if (idx === 0) {
            // console.log("Records found in first response:", $records.length);
            if ($records.length > 0) {
              // console.log("First record preview:", $records[0].outerHTML.substring(0, 300));
            }
          }

          // Process records using native DOM for better performance
          for (let i = 0; i < $records.length; i++) {
            const recordHtml = $records[i].outerHTML;
            recordHtmlParts.push(recordHtml);
            this.recordPeerHTMLArray.push(recordHtml);
          }
        } catch (error) {
          // console.error("Error processing XML result at index", idx, ":", error);
        }
        } else {
        failedCalls++;
        // console.warn("API call", idx + 1, "failed:", result.reason);
      }
    }
    
    // console.log(`✅ Successful calls: ${successfulCalls}, ❌ Failed calls: ${failedCalls}`);

    // console.log(`Total records collected: ${recordHtmlParts.length}`);

    // Parse and return final results
    try {
      if (recordHtmlParts.length === 0) {
        // console.warn("No records collected from batched requests");
        return [];
      }

      const finalXmlString = dataStr + recordHtmlParts.join("") + "</qdbapi>";
      // console.log('peer records (batched)', finalXmlString);


      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(finalXmlString, "text/xml");
      const rawRecords = xmlDoc.querySelectorAll("record");

      // Deduplicate peer records: keep only the most recent YE record per client per year
      const records = this.deduplicatePeerRecordsByClientAndYear(rawRecords);

      // Build per-year record counts (now using deduplicated records)
      try {
        const yearTotals = {};
        records.forEach((rec) => {
          const yearElem = rec.querySelector("s52_formatted_year") || rec.querySelector("year");
          if (yearElem) {
            const yearKey = yearElem.textContent.trim();
            if (yearKey) {
              yearTotals[yearKey] = (yearTotals[yearKey] || 0) + 1;
            }
          }
        });

        if (
          !window.peerRecordMapPerYear ||
          typeof window.peerRecordMapPerYear.clear !== "function"
        ) {
          window.peerRecordMapPerYear = new Map();
        } else {
          window.peerRecordMapPerYear.clear();
        }

        Object.entries(yearTotals).forEach(([year, count]) => {
          window.peerRecordMapPerYear.set(String(year), count);
          // console.log(`Year ${year}: ${count} peer records (deduplicated)`);
        });
      } catch (e) {
        // console.error(
        //   "Unable to compute/set peerRecordMapPerYear in batched approach:",
        //   e
        // );
      }

      return records;
    } catch (error) {
      // console.error("Error parsing XML in batched approach:", error);
      return [];
    }
  }

  /**
   * Get records for client organizations
   * @param {Array} years - Array of years to fetch
   * @param {string} dataStr - Accumulated XML data string
   */
  async getRecordsForClient(years, dataStr = "<qdbapi>") {
    if (years.length === 0) {
      // Base case: return the final XML when the array is empty
      try {
        // If no data was collected, return empty array
        if (dataStr === "<qdbapi>") {
          // console.warn("No client records collected, returning empty array");
          return [];
        }

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(
          dataStr + "</qdbapi>",
          "text/xml"
        );
        const records = xmlDoc.querySelectorAll("record");

        return records;
      } catch (error) {
        // console.error("Error parsing client XML:", error);
        return [];
      }
    }

    const currentYear = years[0];
    const apiCallClientData = {
      act: "API_DoQuery",
      query: `
        {98.EX.${ClientRid}} AND {474.EX.${currentYear}} 
      `,
      clist:
        "452.98.474.22.59.60.211.212.213.215.216.217.227.218.219.220.221.222.223.228.224.415.462.229.460.463.232.230.233.294.700.698.702.703.704.421.420",
    };

    // console.log(`🔵 Fetching client data for year ${currentYear}, ClientRid: ${ClientRid}, clientData URL: ${clientData}`);
    // console.log(`🔵 Query: ${apiCallClientData.query}`);

    try {
      // Use await to make the async operation more explicit
      const xml = await $.get(clientData, apiCallClientData);
      const recordsForClient = $("record", xml).toArray();
      // console.log(`🔵 Year ${currentYear}: Found ${recordsForClient.length} client records`);

      // Process the records
      for (const record of recordsForClient) {
        const newRecord = document.createElement("record");

        // Append each child element to the new record
        Array.from(record.children).forEach((child) => {
          newRecord.appendChild(child.cloneNode(true));
        });

        this.recordClientHTMLArray.push(newRecord.outerHTML);
        dataStr += newRecord.outerHTML;

        console.log('client records', dataStr);
      }

      // Recursive call with updated years and dataStr
      return await this.getRecordsForClient(years.slice(1), dataStr);
    } catch (error) {
      // console.error(`🔴 Error fetching client data for year ${currentYear}:`, error);
      // console.error(`🔴 Error details:`, {
      //   status: error.status,
      //   statusText: error.statusText,
      //   responseText: error.responseText?.substring(0, 200)
      // });

      // Log error details
      if (error.status) {
        // console.error(
        //   `Status: ${error.status}, StatusText: ${error.statusText}`
        // );
      }

      // Continue with next year even if this one failed
      return await this.getRecordsForClient(years.slice(1), dataStr);
    }
  }

  /**
   * Get unique client names for dropdown.
   * Now properly stores the MOST RECENT YE record per client (by fiscal year-end date),
   * rather than the first record encountered.
   */
  async getRecordsForUniqueClientPeerNames() {
    // Build query based on includeComprehensive state
    let surveyTypeFilter = "{193.EX.'Standard'}";
    if (window.includeComprehensive === true) {
      surveyTypeFilter = "({193.EX.'Standard'} OR {193.EX.'Comprehensive'})";
    }
    
    const apiCallPeerData = {
      act: "API_DoQuery",
      query: `{195.XEX.''} AND ${surveyTypeFilter}`,
      // Added field 222 (s52 - Fiscal YE Date), field 3 (Record ID#), and field 193 (Survey Type) for proper most-recent-YE selection
      clist: "3.222.195.301.123.267.268.186.193",
      slist: "195",      // Sort by year (field 195 = s52_formatted_year)
      sortorder: "D",    // Descending - most recent year first
    };

    try {
      const xml = await $.get(peerData, apiCallPeerData);
      const recordsForPeerUniqueClientPeerNames = $("record", xml).toArray();
      const uniquePeerClientNames = new Set();

      // Create a global client data storage if it doesn't exist
      if (!window.clientDataStore) {
        window.clientDataStore = {};
      }
      
      // Temporary storage to track the most recent record per client
      // Structure: { clientName: { yeDate, recordId, record } }
      const clientMostRecentMap = {};

      // Create a string to hold the XML data
      let xmlString = "<qdbapi>";

      recordsForPeerUniqueClientPeerNames.forEach((record) => {
        const clientName = record.querySelector(
          "client___merged_client_name"
        )?.textContent;

        if (clientName) {
          uniquePeerClientNames.add(clientName);

          // Extract fiscal YE date (field 222)
          const yeDateStr = 
            record.querySelector("s52___fiscal_ye_date")?.textContent?.trim() ||
            record.querySelector("fiscal_ye_date")?.textContent?.trim();
          
          // Extract record ID (field 3)
          const recordIdStr = 
            record.querySelector("record_id_")?.textContent?.trim() ||
            record.querySelector("rid")?.textContent?.trim() ||
            record.getAttribute("rid");
          
          // Parse YE date
          let yeDate = null;
          if (yeDateStr) {
            const parsed = Date.parse(yeDateStr);
            if (!isNaN(parsed)) {
              yeDate = parsed;
            } else {
              const epoch = parseInt(yeDateStr, 10);
              if (!isNaN(epoch)) {
                yeDate = epoch;
              }
            }
          }
          
          const recordId = parseInt(recordIdStr, 10) || 0;
          
          // Check if we should update the stored record for this client
          const existing = clientMostRecentMap[clientName];
          let shouldStore = false;
          
          if (!existing) {
            // First record for this client
            shouldStore = true;
          } else {
            // Compare to determine if this is more recent
            if (yeDate !== null && existing.yeDate !== null) {
              if (yeDate > existing.yeDate) {
                shouldStore = true;
              } else if (yeDate === existing.yeDate && recordId > existing.recordId) {
                shouldStore = true;
              }
            } else if (yeDate !== null && existing.yeDate === null) {
              shouldStore = true;
            } else if (yeDate === null && existing.yeDate === null && recordId > existing.recordId) {
              shouldStore = true;
            }
          }
          
          if (shouldStore) {
            // Get fiscal year
            const year = record.querySelector("s52_formatted_year")?.textContent || 
                        record.querySelector("year")?.textContent;

            // Get mission unit value
            const givingUnitVal =
              record.querySelector("s02___giving_units")?.textContent || "0";

            // Get region value
            const regionVal =
              record.querySelector("main_queryregions")?.textContent || "0";

            // Get site value
            const siteVal =
              record.querySelector("main_querymultisite")?.textContent || "0";

            // Get survey type (field 193)
            const surveyType =
              record.querySelector("main_surveytype")?.textContent?.trim() ||
              record.querySelector("surveytype")?.textContent?.trim() ||
              "Standard";

            // Store all client data (based on most recent YE)
            clientMostRecentMap[clientName] = {
              yeDate,
              recordId,
              record,
              data: {
                name: clientName,
                year: year,
                givingUnitVal: parseFloat(givingUnitVal) || 0,
                region: regionVal,
                site: siteVal,
                surveyType: surveyType,
              }
            };
          }

          // Add record's outerHTML to the XML string
          xmlString += record.outerHTML;
        }
      });

      // Populate window.clientDataStore with the most recent YE record per client
      Object.entries(clientMostRecentMap).forEach(([clientName, entry]) => {
        window.clientDataStore[clientName] = entry.data;
      });
      
      // console.log(`📊 Client data store populated with ${Object.keys(clientMostRecentMap).length} clients (using most recent YE per client)`);

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
      if (typeof addUniqueClientsToOptionsSelectClientDropdown === "function") {
        addUniqueClientsToOptionsSelectClientDropdown(
          sortedUniquePeerClientNames
        );
      } else {
        // console.error(
        //   "addUniqueClientsToOptionsSelectClientDropdown function is not defined"
        // );

        // Provide a simple fallback for populating clients if needed
        this._populateClientsDropdownFallback(sortedUniquePeerClientNames);
      }

      // Initialize filter handlers after client data is loaded
      if (sortedUniquePeerClientNames.length > 0) {
        this._initializeFilterHandlers();
      } else {
        // console.log(
        //   "No client data loaded, skipping filter handler initialization"
        // );
      }

      window.sortedUniquePeerClientNames = sortedUniquePeerClientNames;

      return sortedUniquePeerClientNames;
    } catch (error) {
      // console.error("Error fetching unique client names:", error);
      return [];
    }
  }

  /**
   * Initialize filter event handlers
   */
  _initializeFilterHandlers() {
    // Handle changes to any filter
    const handleFilterChange = () => this._handleFiltersChanged();

    // Note: Client selection is handled by custom dropdown checkboxes in options-list-client
    // The checkboxes have their own event listeners that update window.selectedClients_Array

    // Region selection
    const regionSelect = document.getElementById("regionSelect");
    if (regionSelect) {
      regionSelect.addEventListener("change", handleFilterChange);
    }

    // Site selection
    const siteSelect = document.getElementById("siteSelect");
    if (siteSelect) {
      siteSelect.addEventListener("change", handleFilterChange);
    }

    // Slider controls
    const slider1 = document.getElementById("slider1");
    const slider2 = document.getElementById("slider2");
    if (slider1) {
      slider1.addEventListener("input", handleFilterChange);
    }
    if (slider2) {
      slider2.addEventListener("input", handleFilterChange);
    }
  }

  /**
   * Handle filter changes
   */
  _handleFiltersChanged() {
    // Update global variables based on current filter state
    const regionSelect = document.getElementById("regionSelect");
    const siteSelect = document.getElementById("siteSelect");
    const slider1 = document.getElementById("slider1");
    const slider2 = document.getElementById("slider2");

    if (regionSelect) {
      window.selectedRegions_Array = Array.from(
        regionSelect.selectedOptions
      ).map((option) => option.value);
    }
    if (siteSelect) {
      window.selectedSites_Array = Array.from(siteSelect.selectedOptions).map(
        (option) => option.value
      );
    }
    if (slider1) {
      window.sliderValue = parseInt(slider1.value);
    }
    if (slider2) {
      window.sliderValue2 = parseInt(slider2.value);
    }

    // Trigger update event
    this._triggerFiltersChanged();
  }

  /**
   * Trigger filters changed event
   */
  _triggerFiltersChanged() {
    // Dispatch custom event that can be listened to
    const event = new CustomEvent("filtersChanged", {
      detail: {
        clients: window.selectedClients_Array
          ? Array.from(window.selectedClients_Array)
          : [],
        regions: window.selectedRegions_Array || [],
        sites: window.selectedSites_Array || [],
        sliderValue: window.sliderValue,
        sliderValue2: window.sliderValue2,
      },
    });
    document.dispatchEvent(event);
  }

  /**
   * Fallback for populating clients dropdown
   */
  _populateClientsDropdownFallback(clientArray) {
    const clientSelect = document.getElementById("options-list-client");
    if (clientSelect) {
      // console.log("Using fallback to populate clients dropdown");
      // Simple fallback implementation
    }
  }

  /**
   * Build client query for Quickbase
   */
  getClientQuery(selectedClientsSet) {
    if (!selectedClientsSet || selectedClientsSet.size === 0) {
      return "{301.XEX.''}"; // Return all clients if none selected
    }

    const clientsArray = Array.from(selectedClientsSet);
    const escapedClients = clientsArray.map((client) =>
      this._escapeClientName(client)
    );
    const clientConditions = escapedClients
      .map((client) => `{301.EX.'${client}'}`)
      .join(" OR ");

    return `(${clientConditions})`;
  }

  /**
   * Escape client name for query
   */
  _escapeClientName(clientName) {
    return clientName.replace(/'/g, "\\'");
  }

  /**
   * Get peer XML string for display
   */
  getPeerXmlString() {
    return this.recordPeerHTMLArray.join("");
  }

  /**
   * Get client XML string for display
   */
  getClientXmlString() {
    return this.recordClientHTMLArray.join("");
  }

  /**
   * Clear all records
   */
  clearRecords() {
    this.recordPeerHTMLArray = [];
    this.recordClientHTMLArray = [];
  }
}

// Application Controller Class
class AppController {
  constructor() {
    this.dataStore = new DataStore();
    this.dataProcessor = new DataProcessor(this.dataStore);
    this.apiService = new ApiService();

    // Add initialization flag
    this._initialized = false;

    this.initializeEventListeners();
  }

  /**
   * Initialize event listeners
   */
  initializeEventListeners() {
    // Prevent duplicate initialization
    if (this._initialized) {
      return;
    }

    // Clear localStorage but preserve any existing selections
    const preservedKeys = ["selectedYears"];
    const savedValues = {};

    // Save values we want to keep
    preservedKeys.forEach((key) => {
      savedValues[key] = localStorage.getItem(key);
    });

    // Clear localStorage
    localStorage.clear();

    // Restore preserved values
    Object.keys(savedValues).forEach((key) => {
      if (savedValues[key]) {
        localStorage.setItem(key, savedValues[key]);
      }
    });

    // Initialize dropdowns only if they aren't already populated
    const regionsListElement = document.getElementById("options-list-region");
    if (
      regionsListElement &&
      (!regionsListElement.children.length ||
        regionsListElement.children.length <= 1)
    ) {
      if (
        typeof addUniqueRegionsToOptionsSelectRegionsDropdown === "function"
      ) {
        addUniqueRegionsToOptionsSelectRegionsDropdown(regions_Array);
      }
    }

    const sitesListElement = document.getElementById("options-list-site");
    if (
      sitesListElement &&
      (!sitesListElement.children.length ||
        sitesListElement.children.length <= 1)
    ) {
      if (typeof addUniqueSitesToOptionsSelectSitesDropdown === "function") {
        addUniqueSitesToOptionsSelectSitesDropdown(sites_Array);
      }
    }

    // Set up run button event listener
    const runButton = document.getElementById("run");
    if (runButton) {
      this.runButton = runButton;

      // Remove any existing listeners to prevent duplicates
      const newRunButton = runButton.cloneNode(true);
      runButton.parentNode.replaceChild(newRunButton, runButton);
      this.runButton = newRunButton;

      // Add click listener
      this.runButton.addEventListener(
        "click",
        this.handleRunButtonClick.bind(this)
      );
    }

    // Mark as initialized
    this._initialized = true;
  }

  /**
   * Handle run button click
   */
  async handleRunButtonClick() {
    // Declare variables for record counts
    let totalRecordsPeer = 0;
    let totalRecordsClient = 0;

    try {
      // Show loading indicator
      if (typeof showApiLoadingFunction === "function") {
        showApiLoadingFunction("open", "api");
      }

      // Reset per-year peer record counts for this run
      try {
        if (
          !window.peerRecordMapPerYear ||
          typeof window.peerRecordMapPerYear.clear !== "function"
        ) {
          window.peerRecordMapPerYear = new Map();
        } else {
          window.peerRecordMapPerYear.clear();
        }
      } catch (e) {
        // console.error("Unable to initialize peerRecordMapPerYear:", e);
      }

      // Process selected years FIRST - use Set as source of truth, not localStorage
      let selectedYears;
      try {
        // CRITICAL: Check Set first (user's current selections), then fallback to localStorage
        if (typeof selectedYears_Set !== "undefined" && selectedYears_Set.size > 0) {
          // Use Set as source of truth - this is what the user actually selected
          selectedYears = Array.from(selectedYears_Set).sort((a, b) => a - b);
          // console.log("Using selectedYears_Set:", selectedYears);
        } else {
          // Fallback to processSelectedYears if Set is empty
          selectedYears = this.processSelectedYears();
        }
      } catch (error) {
        // console.error("Error processing selected years:", error);
        if (typeof showApiLoadingFunction === "function") {
          showApiLoadingFunction("close");
        }
        return;
      }

      if (!selectedYears || selectedYears.length === 0) {
        // console.error("No years selected");
        if (typeof createToastWarning === "function") {
          createToastWarning("Please select at least one year");
        }
        if (typeof showApiLoadingFunction === "function") {
          showApiLoadingFunction("close");
        }
        return;
      }

      // Save selected years to localStorage BEFORE clearing data
      // This ensures localStorage matches the Set (source of truth)
      this.saveSelectedYearsToLocalStorage(selectedYears);
      
      // Also ensure the Set is synced (in case it got out of sync)
      if (typeof selectedYears_Set !== "undefined") {
        selectedYears.forEach(year => selectedYears_Set.add(year));
        // Remove any years from Set that aren't in selectedYears
        Array.from(selectedYears_Set).forEach(year => {
          if (!selectedYears.includes(year)) {
            selectedYears_Set.delete(year);
          }
        });
      }

      // Check for selected clients
      if (
        !window.selectedClients_Array ||
        window.selectedClients_Array.size === 0
      ) {
        // console.warn("No clients selected");
        if (typeof createToastWarning === "function") {
          createToastWarning("Please select at least one client");
        } else {
          alert("Please select at least one client");
        }
        if (typeof showApiLoadingFunction === "function") {
          showApiLoadingFunction("close");
        }
        return;
      }

      // Clear existing data (clearAllStorage will preserve selectedYears)
      if (this.dataStore && typeof this.dataStore.clear === "function") {
        this.dataStore.clear();
      }

      if (this.apiService && typeof this.apiService.clearRecords === "function") {
        this.apiService.clearRecords();
      }

      // Clear all charts before rerunning API
      if (typeof destroyAllCharts === "function") {
        destroyAllCharts();
      }

      // Fetch peer data with improved error handling
      let recordsPeer;
      try {
        // Use batching if more than 15 clients selected
        if (window.selectedClients_Array.size > 15) {
          // console.log(
        //   `Using batching for ${window.selectedClients_Array.size} clients`
        // );
          recordsPeer = await this.apiService.getRecordsForPeerWithBatching(
        selectedYears,
            window.selectedClients_Array
          );
        } else {
          recordsPeer = await this.apiService.getRecordsForPeer(selectedYears);
        }

        // Validate records
        if (!recordsPeer || recordsPeer.length === 0) {
          // console.warn("No peer records returned");
          if (typeof createToastWarning === "function") {
            createToastWarning(
              "No peer records extracted. Please select more filters"
            );
          } else {
            alert("No peer records extracted. Please select more filters");
          }
          if (typeof showApiLoadingFunction === "function") {
            showApiLoadingFunction("close");
          }
          return; // Stop the whole process here
        } else {
          // Process peer records
          recordsPeer = await validateAndNormalizeRecords(recordsPeer);
          window.recordsPeer = recordsPeer;
          totalRecordsPeer = recordsPeer.length;
          window.totalRecordsPeer = totalRecordsPeer;
          countUniqueClients(recordsPeer);
        }
    } catch (error) {
        // console.error("Error fetching peer data:", error);
        if (typeof createToastWarning === "function") {
          createToastWarning(
            "Error fetching peer data. Please try again or adjust your filters."
          );
        } else {
          alert(
            "Error fetching peer data. Please try again or adjust your filters."
          );
        }
        if (typeof showApiLoadingFunction === "function") {
          showApiLoadingFunction("close");
        }
        return; // Stop the process on error as well
      }

      // Fetch client data with error handling
      let recordsClient;
      try {
        recordsClient = await this.apiService.getRecordsForClient(
          selectedYears
        );

        window.testRecordsClient = recordsClient;

        if (!recordsClient || recordsClient.length === 0) {
          // console.warn("No client records returned");
          // Continue anyway, we might have peer data
        } else {
          // Process client records
          recordsClient = await validateAndNormalizeRecords(recordsClient);

          window.recordsClientSelectedYears = recordsClient;
          totalRecordsClient = recordsClient.length;
          window.totalRecordsClient = totalRecordsClient;
          if (
            recordsClient.length > 0 &&
            recordsClient[recordsClient.length - 1]
          ) {
            const monthYearElement = recordsClient[
              recordsClient.length - 1
            ].querySelector("fiscal_ye_date_formatted_month");
            if (monthYearElement) {
              window.monthYearEnd = monthYearElement.textContent;
            }
          }
        }
      } catch (error) {
        // console.error("Error fetching client data:", error);
        if (typeof createToastWarning === "function") {
          createToastWarning("Error fetching client data. Please try again.");
        } else {
          alert("Error fetching client data. Please try again.");
        }
        // Continue anyway, we might have peer data
      }

      // Check if we have any data at all
      if (
        (!recordsPeer || recordsPeer.length === 0) &&
        (!recordsClient || recordsClient.length === 0)
      ) {
        // console.error("No data available for either peer or client");
        if (typeof createToastWarning === "function") {
          createToastWarning(
            "No data retrieved. Try selecting fewer clients or different years."
      );
    } else {
          alert(
            "No data retrieved. Try selecting fewer clients or different years."
          );
        }
        if (typeof showApiLoadingFunction === "function") {
          showApiLoadingFunction("close");
        }
        return;
      }

      // Process the data
      try {
      this.dataProcessor.processAllData(
        selectedYears,
          recordsPeer || [],
          recordsClient || []
        );
      } catch (error) {
        // console.error("Error processing data:", error);

        // Check if it's a storage quota error
        if (
          error.name === "QuotaExceededError" ||
          error.message.includes("quota")
        ) {
          // console.warn("Storage quota exceeded, showing management options");
          const message =
            "Storage limit exceeded. Try selecting fewer years or clear browser data.";
          if (typeof createToastWarning === "function") {
            createToastWarning(message);
          } else {
            alert(message);
          }
        } else {
          if (typeof createToastWarning === "function") {
            createToastWarning("Error processing data. Please try again.");
          } else {
            alert("Error processing data. Please try again.");
          }
        }

        if (typeof showApiLoadingFunction === "function") {
          showApiLoadingFunction("close");
        }
        return;
      }

      // Display charts
      try {
      await this.displayAllComponents();

      // console.log("✅ Data processing complete");
    } catch (error) {
        // console.error("Error displaying components:", error);

        // Check if it's a data-related error
        if (
          error.message &&
          error.message.includes("Cannot read properties of undefined")
        ) {
          // console.warn(
          //   "Data structure issue detected, attempting to continue with available data"
          // );
          // Continue anyway since some data might be available
        } else {
          if (typeof createToastWarning === "function") {
            createToastWarning(
              "Error displaying charts. Please check console for details."
            );
          } else {
            alert("Error displaying charts. Please check console for details.");
          }
        }
      } finally {
        // Always hide loading indicator
        if (typeof showApiLoadingFunction === "function") {
          showApiLoadingFunction("close");
        }
      }
    } catch (err) {
      // console.error("Unexpected error in handleRunButtonClick:", err);
      if (typeof createToastWarning === "function") {
        createToastWarning("An unexpected error occurred. Please try again.");
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
      if (typeof showApiLoadingFunction === "function") {
        showApiLoadingFunction("close");
      }
    }
  }


  /**
   * Process selected years
   */
  processSelectedYears() {
    const selectedYearsData =
      typeof getSelectedYearsFromLocalStorage === "function"
        ? getSelectedYearsFromLocalStorage()
        : null;

    if (selectedYearsData) {
      return selectedYearsData;
    }

    // Fallback to selectedYears_Set if available
    if (
      typeof selectedYears_Set !== "undefined" &&
      selectedYears_Set.size > 0
    ) {
      const selectedYearsArray = Array.from(selectedYears_Set).sort(
        (a, b) => a - b
      );
      return selectedYearsArray;
    }

    return [];
  }

  /**
   * Save selected years to localStorage
   */
  saveSelectedYearsToLocalStorage(selectedYearsData) {
    if (
      typeof selectedYears_Set !== "undefined" &&
      selectedYears_Set.size > 0
    ) {
      const selectedYearsArray = Array.from(selectedYears_Set).sort(
        (a, b) => a - b
      );
      localStorage.setItem("selectedYears", JSON.stringify(selectedYearsArray));
    } else if (selectedYearsData) {
      localStorage.setItem("selectedYears", JSON.stringify(selectedYearsData));
    }
  }

  /**
   * Display all components
   */
  async displayAllComponents() {
    if (typeof displayGeneralComponent === "function") {
      displayGeneralComponent();
    }
    if (typeof displayCashComponent === "function") {
      displayCashComponent();
    }
    if (typeof displayDebtComponent === "function") {
      displayDebtComponent();
    }
    if (typeof displayIncomeComponent === "function") {
      displayIncomeComponent();
    }
    if (typeof displayExpenseComponent === "function") {
      displayExpenseComponent();
    }
    if (typeof displayReportComponent === "function") {
      displayReportComponent();
    }
  }

  /**
   * Validate data structure
   */
  validateDataStructure() {
    const data = this.dataStore.getAllData();
    const categories = [
      "generalData",
      "cashData",
      "debtData",
      "incomeData",
      "expenseData",
    ];

    let isValid = true;
    categories.forEach((category) => {
      if (!data[category] || Object.keys(data[category]).length === 0) {
        // console.warn(`Warning: ${category} is empty`);
        isValid = false;
      }
    });

    return isValid;
  }
}

// Restore initial client selection
function restoreInitialClientSelection() {
  try {
    const savedSelection = localStorage.getItem("selectedClients");
    if (savedSelection) {
      const clientArray = JSON.parse(savedSelection);
      window.selectedClients_Array = new Set(clientArray);

      // Update UI if client select exists
      const clientSelect = document.getElementById("clientSelect");
      if (clientSelect) {
        Array.from(clientSelect.options).forEach((option) => {
          option.selected = window.selectedClients_Array.has(option.value);
        });
      }
    }
  } catch (error) {
    // console.error("Error restoring client selection:", error);
  }
}

// Count unique clients in records
function countUniqueClients(records) {
  // Check if records is valid and has a forEach method
  if (!records || typeof records.forEach !== "function") {
    // console.error("Invalid records provided to countUniqueClients:", records);
    const element = document.getElementById("uniqueClients");
    if (element) {
      element.textContent = "0";
    }
    return;
  }

  // Get the current filter state
  const selectedClients = window.selectedClients_Array
    ? Array.from(window.selectedClients_Array)
    : [];

  // Use a Set to track unique client names
  const uniqueClients = new Set();

  /**
   * Initializes uniqueClientsPerYearMap and uniqueClientsNamesPerYearMap based on selected years.
   * uniqueClientsPerYearMap: { [year]: Set<string> } - Set of unique client names per year.
   * uniqueClientsNamesPerYearMap: { [year]: Array<string> } - Array of unique client names per year.
   */
  window.uniqueClientsPerYearMap = {};
  window.uniqueClientsNamesPerYearMap = {};

  const selectedYears = getSelectedYearsFromLocalStorage() || [];
  selectedYears.forEach((year) => {
    window.uniqueClientsPerYearMap[year] = new Set();
    window.uniqueClientsNamesPerYearMap[year] = [];
  });

  try {
    records.forEach((record) => {
      const clientName = record
        .querySelector("client___merged_client_name")
        ?.textContent?.trim();
      const year = record.querySelector("s52_formatted_year")?.textContent;

      // Only count clients that are in the selectedClients_Array
      if (clientName && selectedClients.includes(clientName)) {
        uniqueClients.add(clientName);

        // Track unique clients per year
        if (
          year &&
          window.uniqueClientsPerYearMap &&
          window.uniqueClientsPerYearMap[year]
        ) {
          window.uniqueClientsPerYearMap[year].add(clientName);

          // Also populate the names array if client name not already in it
          if (
            window.uniqueClientsNamesPerYearMap &&
            window.uniqueClientsNamesPerYearMap[year] &&
            !window.uniqueClientsNamesPerYearMap[year].includes(clientName)
          ) {
            window.uniqueClientsNamesPerYearMap[year].push(clientName);
          }
        }
      }
    });

    // Convert Sets to counts for the per-year map
    if (window.uniqueClientsPerYearMap) {
      Object.keys(window.uniqueClientsPerYearMap).forEach((year) => {
        window.uniqueClientsPerYearMap[year] =
          window.uniqueClientsPerYearMap[year].size;
      });
    }

    // Update the UI with the count
    const count = uniqueClients.size;
    window.uniqueClientSize = count;
    if (count < 6) {
      if (typeof createToastWarning === "function") {
        createToastWarning(
          "There are 5 or less Unique Clients in Peer Records."
        );
      }
    }
    const element = document.getElementById("uniqueClients");
    if (element) {
      element.textContent = count;
    }

    // console.log(`Counted ${count} unique clients after filtering`);
    // console.log("Unique clients per year:", window.uniqueClientsPerYearMap);
  } catch (error) {
    // console.error("Error counting unique clients:", error);
    const element = document.getElementById("uniqueClients");
    if (element) {
      element.textContent = "0";
    }
  }
}

// Toggle button loading state
function toggleButtonLoadingState(btn) {
  btn.innerHTML = `
        <svg aria-hidden="true" role="status" class="inline w-6 h-6 me-3 text-xl colorGreen font-extrabold animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
        </svg>
        Loading...`;
  btn.disabled = true;
}

// Toggle print presentation button normal state
const togglePrintPresentationButtonNormalState = (btn) => {
  if (!btn) return;

  btn.disabled = false;
  btn.classList.remove("loading");
  btn.textContent = "Print Presentation";
};

// Toggle generate report button normal state
const toggleGenerateReportButtonNormalState = (btn) => {
  if (!btn) return;

  btn.disabled = false;
  btn.classList.remove("loading");
  btn.textContent = "Generate Report";
};

// Toggle button normal state
function toggleButtonNormalState(btn) {
  if (!btn) return;

  btn.disabled = false;
  btn.classList.remove("loading");

  const originalText = btn.dataset.originalText;
  if (originalText) {
    btn.textContent = originalText;
    delete btn.dataset.originalText;
  }
}

// API Client Data Query
let apiCallClientDataForUniqueYears = {
  act: "API_DoQuery",
  query: `{98.EX.${ClientRid}}`,
  clist: "98.474.452.3",
};

// Fetch client information
$.get(clientData, apiCallClientDataForUniqueYears)
  .then(async (xml) => {
    recordsClient = await $("record", xml).toArray();

    // console.log({recordsClient});

    if (recordsClient.length > 0) {
      firmName = recordsClient[0].children[2].innerHTML;
      window.firmName = firmName;
      document.querySelector("#firmName").textContent = firmName;
      findUniqueYears(recordsClient);
    } else {
      // console.error(
      //   "No records found from this client for the specific years. Maybe check the spelling of clientrid and not clientRid"
      // );
    }
  })
  .catch((err) => { /* console.error(err); */ });

// Find and add unique years from data
const findUniqueYears = (data) => {
  // console.log('findUniqueYears', {data});

  if (data) {
    data.forEach((item) => {
      const yearElement = item.querySelector("s52_formatted_year");
      if (yearElement) {
        const year = yearElement.textContent;

        // Check if the year is not already in yearsData_Array to ensure uniqueness
        if (!yearsData_Array.includes(year)) {
          yearsData_Array.push(year);
        }
      }
    });

    yearsData_Array.sort();
    // console.log('findUniqueYears', {yearsData_Array});

    // Add years to options dropdown
    addUniqueYearsToOptionsSelectDropdown(yearsData_Array);
  }
};

// Validate and normalize records
async function validateAndNormalizeRecords(records) {
  // Handle empty or invalid input
  if (!records) {
    // console.warn("Empty records received");
    return [];
  }

  // If records is already an array, process it
  if (Array.isArray(records)) {
    // Create a new array with properly processed records
    const result = [];

    for (const record of records) {
      // If it's a DOM node, return as is
      if (record && typeof record.querySelector === "function") {
        result.push(record);
      }
      // If it's an object but not a DOM node, convert to a simulated DOM-like object
      else if (record && typeof record === "object") {
        // Create a wrapper with querySelector method
        const wrapper = {
          querySelector: function (selector) {
            // Strip any leading underscores or other characters from selector to match property name
            const propName = selector.replace(/^[_.]/, "");
            if (this.hasOwnProperty(propName)) {
              return { textContent: this[propName] };
            }
            return null;
          },
        };

        // Copy all properties from the original record
        Object.assign(wrapper, record);
        result.push(wrapper);
      }
    }

    // console.log(`Validated ${result.length} out of ${records.length} records`);
    return result;
  }

  // If records is NodeList or other iterable, convert to array
  if (typeof records[Symbol.iterator] === "function") {
    return Array.from(records);
  }

  // If records is a single object, wrap in array
  if (typeof records === "object") {
    return [records];
  }

  // console.error("Unrecognized records format:", records);
  return [];
}

window.processApiData = function (selectedYears, recordsPeer, recordsClient) {
  // console.log("processApiData called with", {
  //   yearsCount: selectedYears.length,
  //   peerCount: recordsPeer ? recordsPeer.length : 0,
  //   clientCount: recordsClient ? recordsClient.length : 0,
  // });

  // Call the processApiCalls function which will update the dataStore
  if (typeof processApiCalls === "function") {
    const processedData = processApiCalls(
      selectedYears,
      recordsPeer,
      recordsClient
    );

    // Signal that data processing is complete
    document.dispatchEvent(new CustomEvent("dataProcessingComplete"));

    // Attempt to trigger chart initialization
    setTimeout(() => {
      if (typeof enhancedInitializeChartDisplay === "function") {
        // console.log(
        //   "Triggering enhancedInitializeChartDisplay from processApiData"
        // );
        enhancedInitializeChartDisplay();
      } else if (typeof initializeChartDisplay === "function") {
        // console.log("Triggering initializeChartDisplay from processApiData");
        initializeChartDisplay();
      } else if (
        window.systemConnector &&
        typeof window.systemConnector.displayCharts === "function"
      ) {
        // console.log(
        //   "Triggering systemConnector.displayCharts from processApiData"
        // );
        window.systemConnector.displayCharts();
      }
    }, 500);

    return processedData;
  } else {
    // console.error("processApiCalls function not available");

    // Create a fallback function
    if (!window.dataStore) {
      window.dataStore = new DataStore();
    }

    const dataProcessor = new DataProcessor(window.dataStore);
    dataProcessor.processAllData(selectedYears, recordsPeer, recordsClient);

    // Signal completion
    document.dispatchEvent(new CustomEvent("dataProcessingComplete"));

    // Load data using the new centralized method
    window.dataStore.loadFromLocalStorage();
    return window.dataStore.getAllData();
  }
};

// Ensure other key components are globally accessible
window.DataStore = DataStore;
window.DataProcessor = DataProcessor;
window.ApiService = ApiService;

// Create global instances if they don't exist
if (!window.dataStore) {
  window.dataStore = new DataStore();
} else {
  // Ensure the existing instance has all the new methods
  const newDataStore = new DataStore();
  Object.getOwnPropertyNames(Object.getPrototypeOf(newDataStore)).forEach(
    (method) => {
      if (
        method !== "constructor" &&
        typeof newDataStore[method] === "function"
      ) {
        window.dataStore[method] = newDataStore[method];
      }
    }
  );
}

if (!window.dataProcessor) {
  window.dataProcessor = new DataProcessor(window.dataStore);
}

// Ensure DataStore has all required methods
window.ensureDataStoreMethods = function () {
  if (window.dataStore) {
    const newDataStore = new DataStore();
    Object.getOwnPropertyNames(Object.getPrototypeOf(newDataStore)).forEach(
      (method) => {
        if (
          method !== "constructor" &&
          typeof newDataStore[method] === "function"
        ) {
          window.dataStore[method] = newDataStore[method];
        }
      }
    );
    // console.log("DataStore methods updated");
  }
};

// Add global storage management functions
window.clearAppStorage = function () {
  // Ensure methods are available
  window.ensureDataStoreMethods();

  if (
    window.dataStore &&
    typeof window.dataStore.clearAllStorage === "function"
  ) {
    window.dataStore.clearAllStorage();
    // console.log("App storage cleared successfully");

    if (typeof createToastWarning === "function") {
      createToastWarning(
        "Storage cleared successfully. You can now try loading data again."
      );
    } else {
      alert(
        "Storage cleared successfully. You can now try loading data again."
      );
    }
  } else {
    // console.error("DataStore or clearAllStorage method not available");
  }
};

window.checkAppStorage = function () {
  // Ensure methods are available
  window.ensureDataStoreMethods();

  if (
    window.dataStore &&
    typeof window.dataStore.checkStorageQuota === "function"
  ) {
    const quotaInfo = window.dataStore.checkStorageQuota();
    const message = `Storage Usage: ${quotaInfo.usedMB}MB (${quotaInfo.percentage}%)`;

    if (typeof createToastWarning === "function") {
      createToastWarning(message);
    } else {
      alert(message);
    }
  } else {
    // console.error("DataStore or checkStorageQuota method not available");
  }
};

window.onload = async () => {
  // Initialize global state for includeComprehensive checkbox
  window.includeComprehensive = false;
  
  if (!window.appController) {
    // console.log("Initializing AppController");
    window.appController = new AppController();
    
    // Initialize client dropdown by fetching unique client names
    try {
      await window.appController.apiService.getRecordsForUniqueClientPeerNames();
      // console.log("✅ Client dropdown initialized");
    } catch (error) {
      // console.error("Error initializing client dropdown:", error);
      if (typeof createToastWarning === "function") {
        createToastWarning("Failed to load client list. Please refresh the page.");
      }
    }
  }
  
  // Add event listener for includeComprehensive checkbox
  const includeComprehensiveCheckbox = document.getElementById("includeComprehensive");
  if (includeComprehensiveCheckbox) {
    includeComprehensiveCheckbox.addEventListener("change", async function() {
      window.includeComprehensive = this.checked;
      
      // Re-fetch unique client names with updated query
      if (window.appController && window.appController.apiService) {
        try {
          await window.appController.apiService.getRecordsForUniqueClientPeerNames();
          
          // After client list is refreshed, apply filters and show toast with count
          // Use a small delay to ensure DOM is updated
          setTimeout(() => {
            if (typeof updateClientDropdownFilters === "function") {
              updateClientDropdownFilters();
            } else if (typeof executeClientDropdownFilters === "function") {
              executeClientDropdownFilters();
            }
          }, 100);
        } catch (error) {
          // console.error("Error refreshing client list:", error);
          if (typeof createToastWarning === "function") {
            createToastWarning("Failed to refresh client list. Please try again.");
          }
        }
      }
    });
  }
};

// Storage Management Utilities for Users
// These functions can be called from the browser console to manage storage issues

/**
 * Storage Management Utility Functions
 *
 * Usage from browser console:
 * - checkStorage() - Check current storage usage
 * - clearStorage() - Clear all app data
 * - optimizeStorage() - Show optimization suggestions
 * - getStorageInfo() - Get detailed storage information
 */

window.checkStorage = function () {
  // Ensure methods are available
  window.ensureDataStoreMethods();

  if (
    window.dataStore &&
    typeof window.dataStore.checkStorageQuota === "function"
  ) {
    const quotaInfo = window.dataStore.checkStorageQuota();
    const sizeInfo = window.dataStore.estimateDataSize();

    // console.log("=== Storage Information ===");
    // console.log(
    //   `Current Usage: ${quotaInfo.usedMB}MB (${quotaInfo.percentage}%)`
    // );
    // console.log(`Estimated New Data: ${sizeInfo.sizeMB}MB`);
    // console.log(
    //   `Available Space: ${(
    //     (quotaInfo.maxQuota - quotaInfo.used) /
    //     1024 /
    //     1024
    //   ).toFixed(2)}MB`
    // );

    if (parseFloat(quotaInfo.percentage) > 80) {
      // console.warn("⚠️ Storage usage is high! Consider clearing old data.");
    }

    return { quotaInfo, sizeInfo };
  } else {
    // console.error("DataStore not available");
    return null;
  }
};

window.clearStorage = function () {
  // Ensure methods are available
  window.ensureDataStoreMethods();

  if (
    window.dataStore &&
    typeof window.dataStore.clearAllStorage === "function"
  ) {
    const before = window.dataStore.checkStorageQuota();
    window.dataStore.clearAllStorage();
    const after = window.dataStore.checkStorageQuota();

    // console.log("=== Storage Cleared ===");
    // console.log(`Before: ${before.usedMB}MB`);
    // console.log(`After: ${after.usedMB}MB`);
    // console.log(`Freed: ${(before.used - after.used) / 1024 / 1024}MB`);

    return { before, after };
  } else {
    // console.error("DataStore not available");
    return null;
  }
};

window.optimizeStorage = function () {
  const suggestions = [
    "1. Select fewer years (3-4 instead of 6)",
    "2. Clear browser data for this site",
    "3. Use private/incognito mode",
    "4. Close other browser tabs",
    "5. Try a different browser",
  ];

  // console.log("=== Storage Optimization Suggestions ===");
  // suggestions.forEach((suggestion) => console.log(suggestion));

  return suggestions;
};

window.getStorageInfo = function () {
  // Ensure methods are available
  window.ensureDataStoreMethods();

  if (
    window.dataStore &&
    typeof window.dataStore.checkStorageQuota === "function"
  ) {
    const quotaInfo = window.dataStore.checkStorageQuota();
    const sizeInfo = window.dataStore.estimateDataSize();
    const hasData = window.dataStore.hasDataInStorage();

    const info = {
      currentUsage: quotaInfo,
      estimatedNewData: sizeInfo,
      hasExistingData: hasData,
      recommendations: [],
    };

    // Add recommendations based on current state
    if (parseFloat(quotaInfo.percentage) > 80) {
      info.recommendations.push("Clear old data before loading new data");
    }

    if (parseFloat(sizeInfo.sizeMB) > 3) {
      info.recommendations.push(
        "Consider selecting fewer years to reduce data size"
      );
    }

    if (hasData) {
      info.recommendations.push(
        "Existing data found - consider clearing if having issues"
      );
    }

    // console.log("=== Detailed Storage Information ===");
    // console.log(info);

    return info;
  } else {
    // console.error("DataStore not available");
    return null;
  }
};

// Auto-check storage on page load
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(() => {
    // Ensure methods are available
    window.ensureDataStoreMethods();

    if (
      window.dataStore &&
      typeof window.dataStore.checkStorageQuota === "function"
    ) {
      const quotaInfo = window.dataStore.checkStorageQuota();
      if (parseFloat(quotaInfo.percentage) > 90) {
        // console.warn("⚠️ Storage usage is very high! Consider clearing data.");
        if (typeof createToastWarning === "function") {
          createToastWarning(
            "Storage is nearly full. Use checkStorage() in console for details."
          );
        }
      }
    }
  }, 2000);
});
