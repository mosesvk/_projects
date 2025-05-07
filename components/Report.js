/**
 * Report Component
 * Handles displaying and managing financial report data in tables
 */
class ReportComponent {
  constructor() {
    this.initializeEventListeners();
  }

  /**
   * Initialize event listeners
   */
  initializeEventListeners() {
    // Report link handling
    const reportLink = document.getElementById("reportLink");
    if (reportLink) {
      reportLink.addEventListener("click", this.handleReportLinkClick.bind(this));
    }

    // Generate reports button
    const generateReportsBtn = document.getElementById("generateReports");
    if (generateReportsBtn) {
      generateReportsBtn.addEventListener(
        "click",
        this.handleGenerateReportClick.bind(this)
      );
    }

    // Listen for data processing complete
    document.addEventListener(
      "dataProcessingComplete",
      this.onDataProcessingComplete.bind(this)
    );
  }

  /**
   * Handle report link click
   */
  handleReportLinkClick(event) {
    // Show the report tab
    this.showReportsTab();

    // Only generate report if data is available
    if (localStorage.getItem("cfiData")) {
      this.displayReportComponent();
    } else {
      if (typeof createToastWarning === "function") {
        createToastWarning("Please select years and run the report first.");
      }
    }
  }

  /**
   * Handle generate report button click
   */
  handleGenerateReportClick() {
    if (typeof window.createPrintExcel === "function") {
      window.createPrintExcel();
    } else {
      console.error("Excel report generator not available");
    }
  }

  /**
   * Show reports tab
   */
  showReportsTab() {
    // Hide all content tabs
    document.querySelectorAll(".tab-content").forEach((tab) => {
      tab.classList.add("hidden");
    });

    // Show reports tab
    const reportsTab = document.getElementById("reportsContent");
    if (reportsTab) {
      reportsTab.classList.remove("hidden");
    }

    // Update active state on sidebar links
    document.querySelectorAll("#sidebar button").forEach((button) => {
      button.classList.remove("active", "bg-gray-300", "dark:bg-gray-700");
    });

    // Set reports link as active
    const reportsLink = document.getElementById("reportLink");
    if (reportsLink) {
      reportsLink.classList.add("active", "bg-gray-300", "dark:bg-gray-700");
    }
  }

  /**
   * Display report component with data
   */
  displayReportComponent() {
    console.log("Displaying report component");

    try {
      // Get data from localStorage
      const cfiData = JSON.parse(localStorage.getItem("cfiData"));
      const financialAnalysisContentData = JSON.parse(
        localStorage.getItem("financialAnalysisContentData")
      );
      const financialStatementContentData = JSON.parse(
        localStorage.getItem("financialStatementContentData")
      );
      const years = getSelectedYearsFromLocalStorage();
      const selectedYears = years && years.sort((a, b) => a - b);

      if (selectedYears) {
        // Insert CFI data
        this.insertDataToReport(
          cfiData,
          selectedYears,
          document.getElementById("cfiRatio_clientTable"),
          [
            ["cfiRatio_peerAverage_Peer", "num", 1],
            ["cfiRatio", "num", 1],
            ["cfi_primaryReserveRatio", "num", 2],
            ["cfi_netIncomeOperationsRatio", "percent", 1],
            ["cfi_returnOnNetAssets", "percent", 1],
            ["cfi_viabilityRatio", "num", 2],
          ]
        );

        // Insert calculated data
        this.insertCalculatedDataToReport(cfiData, selectedYears, [
          ["primaryReserveRatio", "num", 2],
          ["netIncomeOperationsRatio", "num", 2],
          ["returnOnNetAssets", "num", 2],
          ["viabilityRatio", "num", 2],
        ]);

        // Insert primary reserve ratio data
        this.insertDataToReport(
          cfiData,
          selectedYears,
          document.getElementById("primaryReserveRatio_clientTable"),
          [
            ["primaryReserveRatio_peerAverage_Peer", "num", 2],
            ["primaryReserveRatio", "num", 2],
            ["pr_nonrestrictedNetAssets", "dollar", 0],
            ["pr_restrictedNetAssets", "dollar", 0],
            ["pr_propertyAndEquipment", "dollar", 0],
            ["pr_notesPayable", "dollar", 0],
            ["pr_cfi_primaryReserveAdjustment", "num", 1],
            ["pr_totalFunctionalExpenses", "dollar", 0],
          ]
        );

        // Insert net income operations data
        this.insertDataToReport(
          cfiData,
          selectedYears,
          document.getElementById("netIncomeOperations_clientTable"),
          [
            ["netIncomeOperationsRatio_peerAverage_Peer", "percent", 1],
            ["netIncomeOperationsRatio", "percent", 1],
            ["ni_operatingRevenuesSupportAndReleases", "dollar", 0],
            ["ni_totalFunctionalExpenses", "dollar", 0],
          ]
        );

        // Insert return on net assets data
        this.insertDataToReport(
          cfiData,
          selectedYears,
          document.getElementById("returnOnNetAssets_clientTable"),
          [
            ["returnOnNetAssets_peerAverage_Peer", "percent", 1],
            ["returnOnNetAssets", "percent", 1],
            ["ro_changeInNetAssets", "dollar", 0],
            ["ro_netAssetsBeginningOfYear", "dollar", 0],
          ]
        );

        // Insert viability ratio data
        this.insertDataToReport(
          cfiData,
          selectedYears,
          document.getElementById("viabilityRatio_clientTable"),
          [
            ["viabilityRatio_peerAverage_Peer", "num", 2],
            ["viabilityRatio", "num", 2],
            ["vr_nonrestrictedNetAssets", "dollar", 0],
            ["vr_restrictedNetAssets", "dollar", 0],
            ["vr_totalPropertyAndEquipment", "dollar", 0],
            ["vr_accumulatedDepreciation", "dollar", 0],
            ["vr_notesPayable", "dollar", 0],
          ]
        );

        // Insert other report data
        this.insertDataToAssetToLiabilityReport(
          financialAnalysisContentData,
          selectedYears
        );
        this.insertDataToSourceOfInomeReport(
          financialAnalysisContentData,
          selectedYears
        );
        this.insertDataToFfaReport(financialAnalysisContentData, selectedYears);
        this.insertDataToFSReport(financialStatementContentData, selectedYears);

        // Format negative numbers
        this.formatNegativeNumbers();

        console.log("Report generated successfully");
      }
    } catch (error) {
      console.error("Error displaying report component:", error);
      if (typeof createToastWarning === "function") {
        createToastWarning("Error displaying report: " + error.message);
      }
    }
  }

  /**
   * Event handler for when data processing is complete
   */
  onDataProcessingComplete() {
    // Enable the report link
    const reportLink = document.getElementById("reportLink");
    if (reportLink) {
      reportLink.classList.remove("disabled");
    }
  }

  /**
   * Insert data to the report for a specific category
   */
  insertDataToReport(data, selectedYears, table, arrayOfNames) {
    this.addYearColumnsToReportTable(selectedYears, table);
    if (data && selectedYears) {
      this.addTotalDataToEveryRow(data, selectedYears, arrayOfNames, table);
    }
  }

  /**
   * Add total data to every row in the report
   */
  addTotalDataToEveryRow(data, selectedYears, arrayOfNames, table) {
    for (let name of arrayOfNames) {
      this.addToSingleRow(
        selectedYears,
        name[0],
        data,
        data[`${name[0]}_Client`],
        data[`${name[0]}`],
        name[1],
        name[2],
        name[3],
        name[4],
        name[5],
        name[6],
        name[7]
      );
    }
  }

  /**
   * Add data to a single row
   */
  addToSingleRow(
    selectedYears,
    name,
    data,
    client,
    peer,
    type,
    fixedNum,
    wa,
    cb,
    fIdArray,
    begin,
    end
  ) {
    const rowName = peer ? name.replace("_Peer", "") : name;
    const tableHeaderRow = document.getElementById(`row_${rowName}`);

    while (tableHeaderRow.children.length > 1) {
      tableHeaderRow.removeChild(tableHeaderRow.children[1]);
    }

    if (name.endsWith("_Peer")) {
      this.addPeerDataToReportRow(
        tableHeaderRow,
        peer,
        type,
        fixedNum,
        "total",
        wa,
        name,
        data,
        fIdArray,
        begin,
        end,
        selectedYears
      );
    } else {
      this.addClientDataToReportRow(
        tableHeaderRow,
        selectedYears,
        client,
        type,
        fixedNum,
        cb,
        name
      );
    }
  }

  /**
   * Add client data to a report row
   */
  addClientDataToReportRow(
    tableHeaderRow,
    selectedYears,
    client,
    type,
    fixedNum,
    cb,
    name
  ) {
    const propClass =
      "px-6 py-4 text-xl font-medium text-gray-900 whitespace-nowrap dark:text-white opacity-80 justify-between border-r-2 dark:border-gray-600";
    const propScope = "row";

    const tableRow = document.getElementById(`row_${name}`);

    selectedYears.forEach((year) => {
      const dataPoint = document.createElement("th");
      const text =
        Number(client[year].value) !== 0
          ? this.styleNumber(client[year].value, type, fixedNum)
          : "-";

      const spanElement = document.createElement("span");
      spanElement.textContent = text;
      spanElement.classList.add("mr-2");

      const divElement = document.createElement("div");
      divElement.classList.add("flex", "justify-between");
      divElement.appendChild(spanElement);

      dataPoint.appendChild(divElement);
      dataPoint.className = propClass;
      dataPoint.scope = propScope;

      tableRow.appendChild(dataPoint);
    });
  }

  /**
   * Add peer data to a report row
   */
  addPeerDataToReportRow(
    tableRow,
    peer,
    type,
    fixedNum,
    dataArray,
    wa,
    name,
    data,
    fIdArray,
    begin,
    end,
    selectedYears
  ) {
    const propClass =
      "px-6 py-4 text-xl font-medium text-gray-900 whitespace-nowrap dark:text-white opacity-80 justify-between border-r-2 dark:border-gray-600";
    const propScope = "row";

    selectedYears.forEach((year) => {
      let avg;
      if (peer && wa) {
        avg = parseFloat(getWeightedAverageOfArray(data, name));
      } else if (peer && !wa) {
        avg = peer[year] ? parseFloat(getAverageOfArray(peer[year])) : 0;
      } else {
        avg = 0;
      }

      const dataPoint = document.createElement("th");
      const text = peer ? this.styleNumber(avg, type, fixedNum) : "";

      const spanElement = document.createElement("span");
      spanElement.textContent = text;
      spanElement.classList.add("mr-2");

      const divElement = document.createElement("div");
      divElement.classList.add("flex", "justify-between");
      divElement.appendChild(spanElement);

      dataPoint.appendChild(divElement);
      dataPoint.className = propClass;
      dataPoint.scope = propScope;

      tableRow.appendChild(dataPoint);
    });
  }

  /**
   * Insert calculated data to the report
   */
  insertCalculatedDataToReport(data, selectedYears, arrayOfNames) {
    if (data && selectedYears) {
      const year = selectedYears[selectedYears.length - 1];
      const ratioValue =
        data["row_cfiRatio_Client"] && data["row_cfiRatio_Client"][year]
          ? data["row_cfiRatio_Client"][year].value
          : "-";

      for (let name of arrayOfNames) {
        this.addToCalculatedRow(year, data, name[0], name[1], name[2]);
      }
    }
  }

  /**
   * Add data to a calculated row
   */
  addToCalculatedRow(year, data, name, type, fixedNum) {
    const tableReportRow = document.getElementById(`row_cfiScore_${name}`);

    while (tableReportRow.children.length > 1) {
      tableReportRow.removeChild(tableReportRow.children[1]);
    }

    const propClass =
      "px-6 py-4 text-xl font-medium text-gray-900 whitespace-nowrap dark:text-white opacity-80 justify-between border-r-2 dark:border-gray-600";
    const propScope = "row";

    const fields = [
      `cfi_${name}_Client`,
      `cfi_${name}_Strength_Client`,
      `cfi_${name}_Weight_Client`,
      `cfi_${name}_Score_Client`,
    ];

    for (let i = 0; i < 4; i++) {
      const dataPoint = document.createElement("th");
      const field = fields[i];
      const value =
        data[field] && data[field][year] ? data[field][year].value : undefined;

      const text =
        value !== undefined && !isNaN(value) && value !== 0
          ? this.styleNumber(value, type, fixedNum)
          : "-";

      const spanElement = document.createElement("span");
      spanElement.textContent = text;
      spanElement.classList.add("mr-2");

      const divElement = document.createElement("div");
      divElement.classList.add("flex", "justify-between");
      divElement.appendChild(spanElement);

      dataPoint.appendChild(divElement);
      dataPoint.className = propClass;
      dataPoint.scope = propScope;

      tableReportRow.appendChild(dataPoint);
    }
  }

  /**
   * Add year columns to report table
   */
  addYearColumnsToReportTable(years, table) {
    const trElements = table.querySelectorAll("tr");
    const trIds = Array.from(trElements)
      .map((tr) => tr.getAttribute("id"))
      .filter((id) => id && id.endsWith("_tableHeader"));

    trIds.forEach((idName) => {
      this.clearTableColumns(idName);
      this.addSingleNewColumnToReportTable(idName, years);
    });
  }

  /**
   * Add a single new column to report table
   */
  addSingleNewColumnToReportTable(tableHeader, yearsArray) {
    const tableHeaderRow = document.getElementById(tableHeader);

    yearsArray.forEach((year) => {
      const newTh = document.createElement("th");
      newTh.setAttribute("scope", "col");
      newTh.setAttribute("class", "px-6 py-3 text-xl");
      newTh.innerText = year;
      tableHeaderRow.appendChild(newTh);
    });
  }

  /**
   * Clear table columns
   */
  clearTableColumns(idName) {
    const headerRow = document.getElementById(idName);
    const columnsToPreserve = ["Avg", "25%", "50%", "75%"];

    Array.from(headerRow.children)
      .slice(1)
      .forEach((th) => {
        const columnName = th.textContent.trim();
        if (!columnsToPreserve.includes(columnName)) {
          th.remove();
        }
      });

    this.clearColumnsFromOtherRowsInTable(idName, columnsToPreserve);
  }

  /**
   * Clear columns from other rows in table
   */
  clearColumnsFromOtherRowsInTable(idName, columnsToPreserve) {
    const rows = document.querySelectorAll(`#${idName} + tbody tr`);

    rows.forEach((row) => {
      Array.from(row.children)
        .slice(1)
        .forEach((td) => {
          const columnName = td.textContent.trim();
          if (!columnsToPreserve.includes(columnName)) {
            td.remove();
          }
        });
    });
  }

  /**
   * Format negative numbers in the report
   */
  formatNegativeNumbers() {
    // Select all <tr> elements with an id
    const rows = document.querySelectorAll("tr[id]");

    rows.forEach((row) => {
      const thElements = row.querySelectorAll("th");

      thElements.forEach((th) => {
        const divChild = th.querySelector("div");
        if (divChild) {
          const spanChild = divChild.querySelector("span");
          if (spanChild) {
            let textContent = spanChild.textContent.trim();
            if (/\d/.test(textContent)) {
              if (textContent.includes("-")) {
                spanChild.textContent = textContent;
                th.classList.remove("text-gray-900", "dark:text-white");
                th.classList.add("text-red-500", "dark:text-red-400");
              }
            }
          }
        } else if (th.childElementCount === 3) {
          const pTags = th.querySelectorAll("p");
          pTags.forEach((p) => {
            let textContent = p.textContent.trim();
            if (/\d/.test(textContent)) {
              if (textContent.includes("-")) {
                p.textContent = textContent;
                p.classList.remove("text-gray-900", "dark:text-white");
                p.classList.add("text-red-500", "dark:text-red-400");
              }
            }
          });
        } else {
          let textContent = th.textContent.trim();
          if (/\d/.test(textContent)) {
            if (textContent.includes("-")) {
              th.textContent = textContent;
              th.classList.remove("text-gray-900", "dark:text-white");
              th.classList.add("text-red-500", "dark:text-red-400");
            }
          }
        }
      });
    });

    // Format other elements
    this.formatNegativeNumbersForElements("td[class$='_dataPoint']");
    this.formatNegativeNumbersForElements("th[id]");
    this.formatNegativeNumbersForElements("p[id$='_yearSelectData']");
    this.formatNegativeNumbersForElements("div[id$='_summary'] td");
  }

  /**
   * Format negative numbers for specific elements
   */
  formatNegativeNumbersForElements(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element) => {
      let textContent = element.textContent.trim();
      if (/\d/.test(textContent)) {
        if (textContent.includes("-")) {
          element.textContent = textContent;
          element.classList.remove("text-gray-900", "dark:text-white");
          element.classList.add("text-red-500", "dark:text-red-400");
        }
      }
    });
  }

  /**
   * Style number based on type
   */
  styleNumber(value, type, fixedNum) {
    if (value === undefined || value === null) return "-";

    let num = parseFloat(value);
    if (isNaN(num)) return "-";

    let prefix = "";
    let suffix = "";
    let result = "";

    switch (type) {
      case "percent":
        num = num * 100;
        suffix = "%";
        result = num.toLocaleString("en-US", {
          minimumFractionDigits: fixedNum,
          maximumFractionDigits: fixedNum,
          useGrouping: false,
        });
        break;

      case "dollar":
        prefix = "$";
        result = num.toLocaleString("en-US", {
          minimumFractionDigits: fixedNum,
          maximumFractionDigits: fixedNum,
        });
        break;

      case "num":
      default:
        result = num.toLocaleString("en-US", {
          minimumFractionDigits: fixedNum,
          maximumFractionDigits: fixedNum,
        });
        break;
    }

    return `${prefix}${result}${suffix}`;
  }

  /**
   * Insert data to asset to liability report
   */
  insertDataToAssetToLiabilityReport(data, selectedYears) {
    const totalAssetsClient = data["totalAssets_Client"];
    const totalLiabilitiesClient = data["totalLiabilities_Client"];
    const tableBodyClient = document.getElementById(
      "assetToLiabilitiesClient_tbody"
    );
    tableBodyClient.innerHTML = "";

    const totalAssetsPeer = data["totalAssets_Peer"];
    const totalLiabilitiesPeer = data["totalLiabilities_Peer"];
    const tableBodyPeer = document.getElementById("assetToLiabilitiesPeer_tbody");
    tableBodyPeer.innerHTML = "";

    selectedYears.forEach((year, index) => {
      const totalAssetsClientValue =
        Number(totalAssetsClient[year].value) > 0
          ? this.styleNumber(totalAssetsClient[year].value, "dollar", 0)
          : "-";
      const totalLiabilitiesClientValue =
        Number(totalLiabilitiesClient[year].value) > 0
          ? this.styleNumber(totalLiabilitiesClient[year].value, "dollar", 0)
          : "-";
      const totalAssetToLiabilityClientValue =
        Number(totalAssetsClient[year].value) > 0
          ? this.styleNumber(
              Number(totalAssetsClient[year].value) /
                Number(totalLiabilitiesClient[year].value),
              "num",
              2
            )
          : "-";

      const classTrClient =
        index % 2 === 0
          ? "bg-white dark:bg-gray-800"
          : "backgroundOffGreen dark:bg-gray-700";
      const clientRow = document.createElement("tr");
      clientRow.className = classTrClient;
      clientRow.innerHTML = `
        <th scope="row" class="px-2 py-1 font-medium text-gray-900 whitespace-nowrap dark:text-white">${year}</th>
        <td class="px-2 py-1 font-medium text-gray-900 whitespace-nowrap dark:text-white">${totalAssetsClientValue}</td>
        <td class="px-2 py-1 font-medium text-gray-900 whitespace-nowrap dark:text-white">${totalLiabilitiesClientValue}</td>
        <td class="px-2 py-1 font-medium text-gray-900 whitespace-nowrap dark:text-white">${totalAssetToLiabilityClientValue}</td>
      `;
      tableBodyClient.appendChild(clientRow);

      const totalAssetsPeerValue = totalAssetsPeer[year]
        ? this.styleNumber(getSumOfArray(totalAssetsPeer[year]), "dollar", 0)
        : "-";
      const totalLiabilitiesPeerValue = totalLiabilitiesPeer[year]
        ? this.styleNumber(getSumOfArray(totalLiabilitiesPeer[year]), "dollar", 0)
        : "-";
      const ratioPeer = totalLiabilitiesPeer[year]
        ? Number(getSumOfArray(totalAssetsPeer[year])) /
          Number(getSumOfArray(totalLiabilitiesPeer[year]))
        : 0;
      const totalAssetToLiabilitysPeerValue =
        ratioPeer > 0 ? this.styleNumber(ratioPeer, "num", 2) : "-";

      const classTrPeer =
        index % 2 === 0
          ? "bg-white dark:bg-gray-800"
          : "backgroundOffBlue dark:bg-gray-700";
      const peerRow = document.createElement("tr");
      peerRow.className = classTrPeer;
      peerRow.innerHTML = `
        <th scope="row" class="px-2 py-1 font-medium text-gray-900 whitespace-nowrap dark:text-white">${year}</th>
        <td class="px-2 py-1 font-medium text-gray-900 whitespace-nowrap dark:text-white">${totalAssetsPeerValue}</td>
        <td class="px-2 py-1 font-medium text-gray-900 whitespace-nowrap dark:text-white">${totalLiabilitiesPeerValue}</td>
        <td class="px-2 py-1 font-medium text-gray-900 whitespace-nowrap dark:text-white">${totalAssetToLiabilitysPeerValue}</td>
      `;
      tableBodyPeer.appendChild(peerRow);
    });
  }

  /**
   * Insert data to source of income report
   */
  insertDataToSourceOfInomeReport(data, selectedYears) {
    const tableHeaderRow = document.getElementById(
      "row_sourceOfIncomeClient_tableHeader"
    );
    const tbody = document.getElementById("sourceOfIncomeClient_tbody");

    const yearElement = `
      <th scope="col" class="px-6 py-3 text-lg tracking-wide">
        ${selectedYears[selectedYears.length - 1]}
      </th>  
    `;
    tableHeaderRow.insertAdjacentHTML("afterbegin", yearElement);

    const variables = [
      ["Tuition", "revenueTuitionAndFees"],
      ["Auxiliary", "revenueAuxiliaryActivities"],
      ["Contributions", "revenueContributions"],
      ["Investments", "revenueInvestmentIncome"],
      ["Other", "revenueOther"],
    ];

    variables.forEach((variable, index) => {
      const clientName = `si_${variable[1]}_Client`;
      const peerName = `${variable[1]}_Peer`;
      const title = variable[0];

      const clientValue =
        Number(data[clientName][selectedYears[0]].value) > 0
          ? this.styleNumber(data[clientName][selectedYears[0]].value, "dollar", 0)
          : "-";

      const classTrEven =
        "bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600";
      const classTrOdd =
        "backgroundOffGreen border-b dark:bg-gray-700 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600";
      const rowElement = document.createElement("tr");
      rowElement.className = index % 2 === 0 ? classTrEven : classTrOdd;

      const cellHTML = `
        <th scope="row" class="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">${title}</th>
        <th scope="row" class="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">${clientValue}</th>
      `;

      rowElement.innerHTML = cellHTML;
      tbody.appendChild(rowElement);
    });
  }

  /**
   * Insert data to FFA report
   */
  insertDataToFfaReport(data, selectedYears) {
    const currentYear = selectedYears[selectedYears.length - 1];

    // Revenue data
    const revenueTuitionAndFeesClient = Number(
      data["ffa_revenueTuitionAndFees_Client"][currentYear].value
    );
    document.getElementById("ffa_tuitionFees").textContent =
      revenueTuitionAndFeesClient != 0
        ? this.styleNumber(revenueTuitionAndFeesClient, "dollar", 0)
        : "-";

    const revenueSchoolServicesClient = Number(
      data["ffa_revenueScholarshipsAndFinancialAid_Client"][currentYear].value
    );
    document.getElementById("ffa_scholarshipsFinancial").textContent =
      revenueSchoolServicesClient != 0
        ? this.styleNumber(revenueSchoolServicesClient, "dollar", 0)
        : "-";

    const totalRevenueContributionsClient = Number(
      data["ffa_totalRevenueContributions_Client"][currentYear].value
    );
    document.getElementById("ffa_unrestrictedGifts").textContent =
      totalRevenueContributionsClient != 0
        ? this.styleNumber(totalRevenueContributionsClient, "dollar", 0)
        : "-";

    // Auxiliary and other data
    const revenueAuxiliaryActivitiesClient = Number(
      data["ffa_revenueAuxiliaryActivities_Client"][currentYear].value
    );
    const revenueOtherClient = Number(
      data["ffa_revenueOther_Client"][currentYear].value
    );
    const revenueInvestmentIncomeClient = Number(
      data["ffa_revenueInvestmentIncome_Client"][currentYear].value
    );
    const revenueEndowmentSpendingAppropriationClient = Number(
      data["ffa_revenueEndowmentSpendingAppropriation_Client"][currentYear].value
    );
    const auxiliaryAndOtherClient =
      revenueAuxiliaryActivitiesClient +
      revenueOtherClient +
      revenueInvestmentIncomeClient +
      revenueEndowmentSpendingAppropriationClient;
    document.getElementById("ffa_auxiliaryOther").textContent =
      auxiliaryAndOtherClient != 0
        ? this.styleNumber(auxiliaryAndOtherClient, "dollar", 0)
        : "-";

    // Contributions data
    const contributionsClient = Number(
      data["ffa_contributions_Client"][currentYear].value
    );
    document.getElementById("ffa_restrictedGifts").textContent =
      contributionsClient != 0
        ? this.styleNumber(contributionsClient, "dollar", 0)
        : "-";

    // Compensation data
    const salariesAndWagesClient = Number(
      data["ffa_salariesAndWages_Client"][currentYear].value
    );
    const employeeBenefitsClient = Number(
      data["ffa_employeeBenefits_Client"][currentYear].value
    );
    const compensationAndBenefitsClient =
      salariesAndWagesClient + employeeBenefitsClient;
    document.getElementById("ffa_compensationBenefits").textContent =
      compensationAndBenefitsClient != 0
        ? this.styleNumber(compensationAndBenefitsClient, "dollar", 0)
        : "-";

    // General expense data
    const servicesSuppliesAndOtherClient = Number(
      data["ffa_servicesSuppliesAndOther_Client"][currentYear].value
    );
    const occupancyUtilitiesAndMaintenanceClient = Number(
      data["ffa_occupancyUtilitiesAndMaintenance_Client"][currentYear].value
    );
    const depreciationAndAmortizationClient = Number(
      data["ffa_depreciationAndAmortization_Client"][currentYear].value
    );
    const interestClient = Number(
      data["ffa_interest_Client"][currentYear].value
    );
    const incomeExpenseSurplusDefecitClient = Number(
      data["ffa_incomeExpenseSurplusDefecit_Client"][currentYear].value
    );
    const generalExpenseClient =
      servicesSuppliesAndOtherClient +
      occupancyUtilitiesAndMaintenanceClient +
      depreciationAndAmortizationClient +
      interestClient +
      incomeExpenseSurplusDefecitClient;
    document.getElementById("ffa_generalExpense").textContent =
      generalExpenseClient != 0
        ? this.styleNumber(generalExpenseClient, "dollar", 0)
        : "-";

    // Total calculations
    const totalRevenues =
      revenueTuitionAndFeesClient +
      totalRevenueContributionsClient +
      auxiliaryAndOtherClient +
      contributionsClient;
    const totalExpenses =
      revenueSchoolServicesClient +
      compensationAndBenefitsClient +
      generalExpenseClient;

    document.getElementById("ffa_totalRevenues").textContent =
      totalRevenues != 0 ? this.styleNumber(totalRevenues, "dollar", 0) : "-";
    document.getElementById("ffa_totalExpenses").textContent =
      totalExpenses != 0 ? this.styleNumber(totalExpenses, "dollar", 0) : "-";
  }

  /**
   * Insert data to financial statement report
   */
  insertDataToFSReport(data, selectedYears) {
    // Implementation can be added here if needed
  }
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  // Create report component
  const reportComponent = new ReportComponent();

  // Expose functions globally for backward compatibility
  window.reportComponent = reportComponent;
  window.displayReportComponent =
    reportComponent.displayReportComponent.bind(reportComponent);
});
