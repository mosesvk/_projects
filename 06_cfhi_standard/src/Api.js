// Data Model and Business Logic Classes
class DataStore {
  constructor() {
    this.demoData = {};
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
      console.log(`New data size: ${sizeInfo.sizeMB}MB`);

      // Check if we're approaching quota limits
      if (parseFloat(quotaInfo.percentage) > 80) {
        console.warn("Storage quota is high, clearing old data before saving");
        this.clearAllStorage();
      }

      // Only log if there's an issue
      if (parseFloat(quotaInfo.percentage) > 50) {
        console.log(
          `Storage usage: ${quotaInfo.usedMB}MB (${quotaInfo.percentage}%)`
        );
      }

      // Try to save all data at once first
      this.saveCompressedData();
  } catch (error) {
      console.warn(
        "Failed to save all data at once, trying chunked approach:",
        error
      );

      // If bulk save fails, try chunked approach
      this.saveDataInChunks();
    }
  }

  /**
   * Save compressed data with size checking
   */
  saveCompressedData() {
    const data = {
      demoData: this.demoData,
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
      console.log(
        `Data size: ${(dataSize / 1024 / 1024).toFixed(
          2
        )}MB - exceeds limit, using chunked approach`
      );
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
        console.warn(
          `Category ${category} is large: ${(
            categorySize /
            1024 /
            1024
          ).toFixed(2)}MB`
        );
      }

      localStorage.setItem(category, categoryData);
    });
  }

  /**
   * Save data in chunks if too large
   */
  saveDataInChunks() {
    const categories = [
      "demoData",
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
      console.error("Error checking storage quota:", error);
      return { usedMB: "unknown", totalMB: 10, percentage: "unknown" };
    }
  }

  /**
   * Estimate data size before saving
   */
  estimateDataSize() {
    const data = {
      demoData: this.demoData,
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
      "demoData",
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
      demoData: this.demoData,
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
      localStorage.getItem("demoData") !== null ||
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
    const categories = [
      "demoData",
      "cashData",
      "debtData",
      "incomeData",
      "expenseData",
      "additionalData",
    ];

    categories.forEach((category) => {
      localStorage.removeItem(category);
      localStorage.removeItem(`${category}_metadata`);

      // Remove any chunks
      let i = 0;
      while (localStorage.getItem(`${category}_chunk_${i}`)) {
        localStorage.removeItem(`${category}_chunk_${i}`);
        i++;
      }
    });
  }

  /**
   * Clear method for data model
   */
  clear() {
    this.demoData = {};
    this.cashData = {};
    this.debtData = {};
    this.incomeData = {};
    this.expenseData = {};
    this.additionalData = {};
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
   * @param {string} category - Data category (demo, cash, debt, income, expense)
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
  const innerData =
      childElement && childElement.innerHTML.split("").length > 0
        ? childElement.innerHTML.trim()
      : 0;

  if (type === "client") {
      const benchmarkField = dynamicValueClientPeer
        ? record.querySelector(dynamicValueClientPeer)?.textContent.trim()
        : undefined;
      this.insertClientData(
        targetData,
        dataKey,
        year,
        innerData,
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
    targetData[dataKey][year].value = value;
    if (benchmarkField !== undefined) {
      targetData[dataKey][year].benchmark = benchmarkField;
    }
  }

  /**
   * Insert peer data
   */
  insertPeerData(targetData, dataKey, year, value, record, yesNoField, name) {
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
        if (!targetData[dataKey][name]) {
          targetData[dataKey][name] = [];
        }
        targetData[dataKey][name].push(dataValue);
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
    this.processDemoData(years, recordsPeer, recordsClient);
    this.processCashData(years, recordsPeer, recordsClient);
    this.processDebtData(years, recordsPeer, recordsClient);
    this.processIncomeData(years, recordsPeer, recordsClient);
    this.processExpenseData(years, recordsPeer, recordsClient);

    // Save to localStorage
    this.dataStore.saveAllToLocalStorage();
  }

  /**
   * Filter records by year
   */
  filterRecordsByYear(records, year) {
    return [...records].filter((record) => {
      const fiscalYear = record.querySelector("s52_formatted_year")?.textContent;
      return fiscalYear && fiscalYear.includes(year.toString());
    });
  }

  /**
   * Process Demographics Data
   */
  processDemoData(years, recordsPeer, recordsClient) {
    years.forEach((year) => {
      const filteredPeerRecords = this.filterRecordsByYear(recordsPeer, year);
    filteredPeerRecords.forEach((record) => {
      // givingUnits
        this.dataStore.insertData(
          "demo",
        "peer",
        year,
        "givingUnits_Peer",
        record,
        "s02___giving_units",
        "cfhi_stand_00a_yes_no___giving_units"
      );

      // contributionsWithoutDonorExcludingLargeGifts
        this.dataStore.insertData(
          "demo",
        "peer",
        year,
        "contributionsWithoutDonorExcludingLargeGifts_Peer",
        record,
        "s39___contribution_without_donor_retriction",
        "cfhi_stand_00a_yes_no___giving_units"
      );

      // totalContributionsExclude
        this.dataStore.insertData(
          "demo",
        "peer",
        year,
        "totalContributionsExclude_Peer",
        record,
        "s40___total_contribution",
        "cfhi_stand_00b_yes_no___total_contributions"
      );
    });

      const filteredClientRecords = this.filterRecordsByYear(recordsClient, year);
    filteredClientRecords.forEach((record) => {
      // givingUnits
        this.dataStore.insertData(
          "demo",
        "client",
        year,
        "givingUnits_Client",
        record,
        "s02___giving_units"
      );

      // contributionsWithoutDonorExcludingLargeGifts
        this.dataStore.insertData(
          "demo",
        "client",
        year,
        "contributionsWithoutDonorExcludingLargeGifts_Client",
        record,
        "s39___contribution_without_donor_retriction"
      );

      // totalContributionsExclude
        this.dataStore.insertData(
          "demo",
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
        // daysOperatingCash
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

      const filteredClientRecords = this.filterRecordsByYear(recordsClient, year);
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
        "s32___total_debt",
        "cfhi_stand_03_yes_no___debt_to_contribution_w_o_donor_rest",
        "debtToContributionsWithout"
      );

        this.dataStore.insertData(
          "debt",
        "peer",
        year,
        "contributionWithoutDonor",
        record,
        "s39___contribution_without_donor_retriction",
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
        "s32___total_debt",
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
        "s39___contribution_without_donor_retriction",
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

      const filteredClientRecords = this.filterRecordsByYear(recordsClient, year);
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

      // debtPerGivingUnit_standard
        this.dataStore.insertData(
          "debt",
        "client",
        year,
        "debtPerGivingUnit_standard_Client",
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
        "s39___contribution_without_donor_retriction",
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

      const filteredClientRecords = this.filterRecordsByYear(recordsClient, year);
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

      // totalContributionsPerGivingUnit
        this.dataStore.insertData(
          "income",
        "client",
        year,
        "totalContributionsPerGivingUnit_Client",
        record,
        "cfhi_stand_06_ratio___total_contributions_per_giving_unit"
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
    });

      const filteredClientRecords = this.filterRecordsByYear(recordsClient, year);
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
    });
  });
  }
}

// API Service Class for Quickbase Integration
class ApiService {
  constructor() {
    this.recordsPeer = [];
    this.recordsClient = [];
    this.uniqueClientNames = [];
  }

  /**
   * Get records for peer data
   * @param {Array} years - Array of years to fetch
   * @param {Array} regions - Array of regions to filter by
   * @param {Number} sliderValue - Minimum giving units
   * @param {Number} sliderValue2 - Maximum giving units
   */
  async getRecordsForPeer(years, regions, sliderValue, sliderValue2) {
    const currentYear = years[0]; // Use first year in array
    const selectedRegionArray = regions.slice(0, 7); // Ensure 7 regions

    // Pad with empty strings if less than 7 regions
    while (selectedRegionArray.length < 7) {
      selectedRegionArray.push("");
    }

    const apiCallPeerData = {
      act: "API_DoQuery",
      query: `
        {195.EX.${currentYear}} AND 
        {123.GTE.${sliderValue}} AND 
        {123.LTE.${sliderValue2}} AND 
        {193.EX.'Standard'} AND 
        ( {267.EX.${selectedRegionArray[0]}} OR {267.EX.${selectedRegionArray[1]}} OR {267.EX.${selectedRegionArray[2]}} OR {267.EX.${selectedRegionArray[3]}} OR {267.EX.${selectedRegionArray[4]}} OR {267.EX.${selectedRegionArray[5]}} OR {267.EX.${selectedRegionArray[6]}} )
      `,
      clist:
        "195.123.407.160.408.161.409.143.164.165.145.149.154.184.160.304.305.306.307.308.309.310.311.312.197.313.314.315.316.317.318.319.320.321",
    };

    try {
      // Make API call to Quickbase
      const response = await this.makeQuickbaseApiCall(apiCallPeerData);
      this.recordsPeer = this.parseXmlResponse(response);
      return this.recordsPeer;
    } catch (error) {
      console.error("Error fetching peer records:", error);
      return [];
    }
  }

  /**
   * Get records for client data
   * @param {String} clientRid - Client record ID
   * @param {Array} years - Array of years to fetch
   */
  async getRecordsForClient(clientRid, years) {
    const yearQueries = years.map((year, index) => {
      if (index === 0) {
        return `{98.EX.${clientRid}} AND {105.EX.'Standard'} AND {474.EX.${year}}`;
      } else {
        return ` OR {474.EX.${year}}`;
      }
    }).join("");

    const apiCallClientData = {
      act: "API_DoQuery",
      query: yearQueries,
      clist:
        "452.98.474.22.59.60.211.212.215.217.227.218.219.221.222.228.224.415.462.229.460.463.232.230.233.294",
    };

    try {
      // Make API call to Quickbase
      const response = await this.makeQuickbaseApiCall(apiCallClientData);
      this.recordsClient = this.parseXmlResponse(response);
      return this.recordsClient;
    } catch (error) {
      console.error("Error fetching client records:", error);
      return [];
    }
  }

  /**
   * Get unique client names for dropdown
   */
  async getRecordsForUniqueClientPeerNames() {
    const apiCheckUniqueClient = {
      act: "API_DoQuery",
      query: "{195.XEX.''} AND {193.EX.'Standard'}",
      clist: "186.195.123.122.193.267.268",
    };

    try {
      // Make API call to Quickbase
      const response = await this.makeQuickbaseApiCall(apiCheckUniqueClient);
      const records = this.parseXmlResponse(response);
      
      // Extract unique client names
      const clientNames = new Set();
      records.forEach((record) => {
        const clientName = record.querySelector("f186")?.textContent;
        if (clientName) {
          clientNames.add(clientName);
        }
      });

      this.uniqueClientNames = Array.from(clientNames).sort();
      
      // Populate dropdown if function exists
      if (typeof addUniqueClientNamesToDropdown === "function") {
        addUniqueClientNamesToDropdown(this.uniqueClientNames);
      }

      return this.uniqueClientNames;
    } catch (error) {
      console.error("Error fetching unique client names:", error);
      return [];
    }
  }

  /**
   * Make Quickbase API call
   * @param {Object} apiParams - API parameters
   */
  async makeQuickbaseApiCall(apiParams) {
    // This is a placeholder for the actual Quickbase API implementation
    // In production, this would make actual API calls to Quickbase
    
    // For now, return mock response or throw error
    throw new Error("Quickbase API not configured. Please set up API credentials.");
  }

  /**
   * Parse XML response from Quickbase
   * @param {String} xmlString - XML response string
   */
  parseXmlResponse(xmlString) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");
    return xmlDoc.querySelectorAll("record");
  }

  /**
   * Get peer XML string for display
   */
  getPeerXmlString() {
    // Convert peer records to XML string
    return this.recordsPeer.length > 0
      ? new XMLSerializer().serializeToString(this.recordsPeer[0].ownerDocument)
      : "";
  }

  /**
   * Get client XML string for display
   */
  getClientXmlString() {
    // Convert client records to XML string
    return this.recordsClient.length > 0
      ? new XMLSerializer().serializeToString(
          this.recordsClient[0].ownerDocument
        )
      : "";
  }

  /**
   * Clear all records
   */
  clearRecords() {
    this.recordsPeer = [];
    this.recordsClient = [];
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
      if (typeof addUniqueRegionsToOptionsSelectRegionsDropdown === "function") {
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
    try {
      const selectedYears = this.processSelectedYears();

      if (!selectedYears || selectedYears.length === 0) {
        console.error("No years selected");
        if (typeof createToastWarning === "function") {
          createToastWarning("Please select at least one year");
        }
        return;
      }

      // Save selected years to localStorage
      this.saveSelectedYearsToLocalStorage(selectedYears);

      // Get filter values (these should come from UI)
      const regions = this.getSelectedRegions();
      const sliderValue = this.getSliderValue();
      const sliderValue2 = this.getSliderValue2();

      // Fetch data from API or use XML files
      await this.fetchData(selectedYears, regions, sliderValue, sliderValue2);

      // Process the data
      this.dataProcessor.processAllData(
        selectedYears,
        this.apiService.recordsPeer,
        this.apiService.recordsClient
      );

      // Display all components
      await this.displayAllComponents();

      console.log("✅ Data processing complete");
    } catch (error) {
      console.error("Error in handleRunButtonClick:", error);
      if (typeof createToastError === "function") {
        createToastError("Error processing data. Please try again.");
      }
    }
  }

  /**
   * Fetch data - either from API or XML files
   */
  async fetchData(selectedYears, regions, sliderValue, sliderValue2) {
    // Check if we should use API or XML files
    const useXmlFiles = true; // Set to false when API is configured

    if (useXmlFiles) {
      // Load from XML files
      this.apiService.recordsPeer = await this.fetchXmlData("./data/peerData.xml");
      this.apiService.recordsClient = await this.fetchXmlData("./data/clientData.xml");
    } else {
      // Load from API
      await this.apiService.getRecordsForPeer(
        selectedYears,
        regions,
        sliderValue,
        sliderValue2
      );
      
      // Get client RID (this should come from UI selection)
      const clientRid = this.getSelectedClientRid();
      if (clientRid) {
        await this.apiService.getRecordsForClient(clientRid, selectedYears);
      }
    }

    // Extract unique years from data
    if (typeof findUniqueYears === "function") {
      findUniqueYears(this.apiService.recordsClient);
    }
  }

  /**
   * Fetch XML data from file
   */
  async fetchXmlData(filePath) {
    try {
      const response = await fetch(filePath);
      const xmlString = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, "text/xml");
      return xmlDoc.querySelectorAll("record");
    } catch (error) {
      console.error(`Error fetching XML file ${filePath}:`, error);
      return [];
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
    if (typeof selectedYears_Set !== "undefined" && selectedYears_Set.size > 0) {
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
    if (typeof selectedYears_Set !== "undefined" && selectedYears_Set.size > 0) {
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
    if (typeof displayDemoComponent === "function") {
      displayDemoComponent();
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
   * Get selected regions from UI
   */
  getSelectedRegions() {
    if (typeof regions_Array !== "undefined") {
      return regions_Array;
    }
    return ["", "", "", "", "", "", ""];
  }

  /**
   * Get slider value from UI
   */
  getSliderValue() {
    const slider = document.getElementById("slider");
    return slider ? parseInt(slider.value) : 0;
  }

  /**
   * Get slider value 2 from UI
   */
  getSliderValue2() {
    const slider2 = document.getElementById("slider2");
    return slider2 ? parseInt(slider2.value) : 10000;
  }

  /**
   * Get selected client RID from UI
   */
  getSelectedClientRid() {
    const clientSelect = document.getElementById("client-select");
    return clientSelect ? clientSelect.value : null;
  }

  /**
   * Validate data structure
   */
  validateDataStructure() {
    const data = this.dataStore.getAllData();
    const categories = [
      "demoData",
      "cashData",
      "debtData",
      "incomeData",
      "expenseData",
    ];

    let isValid = true;
    categories.forEach((category) => {
      if (!data[category] || Object.keys(data[category]).length === 0) {
        console.warn(`Warning: ${category} is empty`);
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
    console.error("Error restoring client selection:", error);
  }
}

// Count unique clients in records
function countUniqueClients(records) {
  // Check if records is valid and has a forEach method
  if (!records || typeof records.forEach !== "function") {
    console.error("Invalid records provided to countUniqueClients:", records);
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
    console.error("Error counting unique clients:", error);
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
      document.querySelector("#firmName").textContent = firmName;
      findUniqueYears(recordsClient);
    } else {
      console.error(
        "No records found from this client for the specific years. Maybe check the spelling of clientrid and not clientRid"
      );
    }
  })
  .catch((err) => console.error(err));

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
    console.warn("Empty records received");
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

    console.log(`Validated ${result.length} out of ${records.length} records`);
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

  console.error("Unrecognized records format:", records);
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
    console.error("processApiCalls function not available");

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
    console.log("DataStore methods updated");
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
    console.log("App storage cleared successfully");

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
    console.error("DataStore or clearAllStorage method not available");
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
    console.error("DataStore or checkStorageQuota method not available");
  }
};

window.onload = () => {
  if (!window.appController) {
    // console.log("Initializing AppController");
    window.appController = new AppController();
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

    console.log("=== Storage Information ===");
    console.log(
      `Current Usage: ${quotaInfo.usedMB}MB (${quotaInfo.percentage}%)`
    );
    console.log(`Estimated New Data: ${sizeInfo.sizeMB}MB`);
    console.log(
      `Available Space: ${(
        (quotaInfo.maxQuota - quotaInfo.used) /
        1024 /
        1024
      ).toFixed(2)}MB`
    );

    if (parseFloat(quotaInfo.percentage) > 80) {
      console.warn("⚠️ Storage usage is high! Consider clearing old data.");
    }

    return { quotaInfo, sizeInfo };
  } else {
    console.error("DataStore not available");
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

    console.log("=== Storage Cleared ===");
    console.log(`Before: ${before.usedMB}MB`);
    console.log(`After: ${after.usedMB}MB`);
    console.log(`Freed: ${(before.used - after.used) / 1024 / 1024}MB`);

    return { before, after };
  } else {
    console.error("DataStore not available");
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

  console.log("=== Storage Optimization Suggestions ===");
  suggestions.forEach((suggestion) => console.log(suggestion));

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

    console.log("=== Detailed Storage Information ===");
    console.log(info);

    return info;
  } else {
    console.error("DataStore not available");
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
        console.warn("⚠️ Storage usage is very high! Consider clearing data.");
        if (typeof createToastWarning === "function") {
          createToastWarning(
            "Storage is nearly full. Use checkStorage() in console for details."
          );
        }
      }
    }
  }, 2000);
});
