const fetchClientData = async () => {
  return fetch("./data/clientData.xml")
    .then((response) => response.text())
    .then((xmlString) => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, "text/xml");
      return xmlDoc.querySelectorAll("record");
    })
    .catch((error) => {
      console.error("Error fetching XML file (fetchClientData):", error);
      return []; // Return an empty array in case of error
    });
};

const fetchPeerData = async () => {
  return fetch("./data/peerData.xml")
    .then((response) => response.text())
    .then((xmlString) => {
      // console.log(xmlString);
      const parser = new DOMParser();
      // changes
      const xmlDoc = parser.parseFromString(xmlString, "text/xml");
      return xmlDoc.querySelectorAll("record");
    })
    .catch((error) => {
      console.error("Error fetching XML file (fetchPeerData):", error);
      return []; // Return an empty array in case of error
    });
};

document.addEventListener("DOMContentLoaded", async () => {
  const recordsClient = await fetchClientData();
  const recordsPeer = await fetchPeerData();
  const clientsArray = [...recordsPeer].map((record) => {
    return record.querySelector("merged_client_name").textContent;
  }
  );
  const uniqueClients = [...new Set(clientsArray)];



  // console.log(recordsClient[0]);

  const firmName = recordsClient[0].querySelector("merged_client_name").textContent;
  document.getElementById("firmName").textContent = firmName;

  findUniqueYears(recordsClient);

  addUniqueRegionsToOptionsSelectRegionsDropdown(regions_Array);

  addUniqueStatesToOptionsSelectStatesDropdown(states_Array);

  addUniqueMembershipsToOptionsSelectMembershipsDropdown(memberships_Array);

  addUniqueClientsToOptionsSelectClientsDropdown(uniqueClients);

  addUniqueTypesToOptionsSelectTypesDropdown(types_Array);

  addUniqueAthleticsToOptionsSelectAthleticsDropdown(athletics_Array);

  addUniqueTrendlinesToOptionsSelectTrendlinesDropdown(trendlines_Array);

  localStorage.clear();
});

const findUniqueYears = data => {
  if (data) {
    data.forEach (item => {
      // console.log(item);
      const yearElement = item.querySelector ('year');
      if (yearElement) {
        const year = yearElement.textContent;

        // Check if the year is not already in yearsData_Array to ensure uniqueness
        if (!yearsData_Array.includes (year)) {
          yearsData_Array.push (year);
        }
      }
    });

    yearsData_Array.sort ();

    //nav-component
    addUniqueYearsToOptionsSelectDropdown(yearsData_Array);
  }
};

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
  console.log({ type, year, object, dataKey, record, child, dynamicValueClientPeer, name });

  const innerData =
    child == 0
      ? 0
      : record.querySelector(child).innerHTML.split("").length > 0
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
      record.querySelector(dynamicValueClientPeer).textContent.trim();
    object[dataKey][year].benchmark = benchmarkField;
  } else {
    // type === 'peer'

    const yesNoField =
      dynamicValueClientPeer == "Yes"
        ? "Yes"
        : dynamicValueClientPeer &&
          record.querySelector(dynamicValueClientPeer).textContent.trim();

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
          object[dataKey][name] = [];
        }
        object[dataKey][name].push(innerData);
      }

      object[dataKey][year].push(innerData);
    }
  }
};

const processCfiData = (years, recordsPeer, recordsClient) => {
  const object = {};

  years.forEach((year) => {
    const filteredPeerRecords = [...recordsPeer].filter((record) => {
      const fiscalYear = record.querySelector(
        "year"
      ).textContent;

      return fiscalYear.includes(year.toString());
    });
    filteredPeerRecords.forEach((record) => {
      // cfiRatio
      insertDataIntoObject(
        "peer",
        year,
        object,
        "cfiRatio_Peer",
        record,
        "r119_ccfi_overall_ratio"
      );


    });

    const filteredClientRecords = [...recordsClient].filter((record) => {
      const fiscalYear = record.querySelector(
        "year"
      ).textContent;
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


    });

  });

  localStorage.removeItem("cfiData");
  localStorage.setItem("cfiData", JSON.stringify(object));
};

// Helper functions

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

};

const displayComponents = () => {
  displayCfiComponent();
  // displayCashComponent();
  // displayIncomeComponent();
  // displayExpenseComponent();
  // displayReportComponent();

};

const run_btn = document.querySelector("#run");
run_btn.addEventListener("click", async () => {
  // uploadMainFile = ''
  // document.getElementById('print_modal_footer').classList.add('hidden');
  const recordsClient = await fetchClientData();
  const recordsPeer = await fetchPeerData()

  console.log({ recordsClient, recordsPeer });

  try {
    toggleButtonLoadingState(run_btn);
    const selectedYears = processSelectedYears();
    saveSelectedYearsToLocalStorage(selectedYears);
    processApiCalls(selectedYears, recordsPeer, recordsClient);
    displayComponents();
  } catch (err) {
    console.error(err);
  } finally {
    toggleButtonNormalState(run_btn);
  }
});
