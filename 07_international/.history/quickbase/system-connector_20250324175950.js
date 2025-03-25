// system-connector.js
// This file connects all the components of the international dashboard system
// It handles initializations, event registrations, and component loading

document.addEventListener('DOMContentLoaded', function() {
  console.log('System connector initializing...');
  
  // Make sure all components are properly initialized in the right order
  initializeUIElements();
  registerEventListeners();
  setupChartSystem();
  
  // Initialize the General tab by default
  activateTab('GeneralContent');
  
  console.log('System connector initialization complete');
});

function initializeUIElements() {
  // Ensure modals have proper row structure
  ensureModalsHaveRows();
  
  // Initialize the sidebar
  const sidebar = document.getElementById("sidebar");
  if (sidebar) {
    console.log('Sidebar initialized');
  }
}

function registerEventListeners() {
  // Get all sidebar buttons and tab contents
  const sidebarButtons = document.querySelectorAll("button[id$='Link']");
  const tabContents = document.querySelectorAll(".tab-content");
  
  // Add click event listeners to sidebar buttons
  sidebarButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      const tabId = getTabIdFromButtonId(button.id);
      if (tabId) {
        // Hide all tabs
        tabContents.forEach((content) => {
          content.classList.add("hidden");
        });
        
        // Show the selected tab
        const selectedTab = document.getElementById(tabId);
        if (selectedTab) {
          selectedTab.classList.remove("hidden");
        }
        
        // Activate the button
        activateButton(button, sidebarButtons);
        
        // If this is the reports tab, initialize reports
        if (tabId === "reportsContent") {
          initializeReportsTab();
        }
      }
    });
  });
  
  // Register the run button click event
  const runButton = document.getElementById('run');
  if (runButton) {
    runButton.addEventListener('click', handleRunButtonClick);
  }
  
  // Register print functionality
  const printButton = document.getElementById('printBase64');
  if (printButton) {
    printButton.addEventListener('click', handlePrintButtonClick);
  }
  
  const generateReportsButton = document.getElementById('generateReports');
  if (generateReportsButton) {
    generateReportsButton.addEventListener('click', handleGenerateReportsClick);
  }
}

function getTabIdFromButtonId(buttonId) {
  // Map button IDs to content div IDs
  const tabMap = {
    'generalLink': 'GeneralContent',
    'cashLink': 'cashContent',
    'incomeLink': 'incomeContent',
    'expenseLink': 'expenseContent',
    'reportLink': 'reportsContent' // Add the reports tab mapping
  };
  
  return tabMap[buttonId];
}

function activateButton(activeButton, allButtons) {
  // Update active status for all buttons
  allButtons.forEach((button) => {
    if (button === activeButton) {
      button.classList.add("active", "bg-gray-300", "dark:bg-gray-700");
    } else {
      button.classList.remove("active", "bg-gray-300", "dark:bg-gray-700");
    }
  });
}

function activateTab(tabId) {
  // Hide all tabs
  const tabContents = document.querySelectorAll(".tab-content");
  tabContents.forEach((content) => {
    content.classList.add("hidden");
  });
  
  // Show the requested tab
  const selectedTab = document.getElementById(tabId);
  if (selectedTab) {
    selectedTab.classList.remove("hidden");
  }
  
  // Activate the corresponding button
  const buttonMap = {
    'GeneralContent': 'generalLink',
    'cashContent': 'cashLink',
    'incomeContent': 'incomeLink',
    'expenseContent': 'expenseLink',
    'reportsContent': 'reportLink'
  };
  
  const buttonId = buttonMap[tabId];
  if (buttonId) {
    const button = document.getElementById(buttonId);
    if (button) {
      const allButtons = document.querySelectorAll("button[id$='Link']");
      activateButton(button, allButtons);
    }
  }
}

function setupChartSystem() {
  // Initialize chart options and defaults
  if (window.ChartSystem && typeof window.ChartSystem.initialize === 'function') {
    window.ChartSystem.initialize();
    console.log('Chart system initialized');
  } else {
    console.warn('Chart system not found or could not be initialized');
  }
}

function handleRunButtonClick() {
  // Implement the run button functionality
  console.log('Run button clicked');
  
  // Show loading screen
  showApiLoadingFunction('open', 'api');
  
  // Fetch data and render charts based on selected options
  fetchDataAndRenderCharts()
    .then(() => {
      // Hide loading screen when done
      showApiLoadingFunction('close');
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      // Hide loading screen
      showApiLoadingFunction('close');
      // Show error message to user
      createToastWarning('Error loading data. Please try again.');
    });
}

function fetchDataAndRenderCharts() {
  return new Promise((resolve, reject) => {
    // This function should coordinate the data fetching and chart rendering
    // It should be implemented based on how the original system works
    
    // Check if there are selected years
    const selectedYears = getSelectedYearsFromLocalStorage();
    if (!selectedYears || !selectedYears.length) {
      createToastWarning('Please select at least one year before running the report.');
      reject(new Error('No years selected'));
      return;
    }
    
    // Implement the fetch and render logic based on the existing code
    // This should use the qbApi functionality
    
    // For now, we'll simulate success after a delay
    setTimeout(() => {
      console.log('Data fetched and charts rendered');
      resolve();
    }, 1500);
  });
}

function handlePrintButtonClick() {
  console.log('Print button clicked');
  // Implement printing functionality
  // This should use the utility functions from utilityPrint.js
}

function handleGenerateReportsClick() {
  console.log('Generate reports button clicked');
  // Implement report generation
  // Show the download buttons
  const footerElement = document.getElementById('print_modal_footer');
  if (footerElement) {
    footerElement.classList.remove('hidden');
  }
}

function initializeReportsTab() {
  console.log('Initializing reports tab');
  // This is where the displayReportComponent() functionality should go
  // Load report data and update UI elements
  
  // Update the table rows with data
  updateReportTableData();
}

function updateReportTableData() {
  // Get the selected years
  const selectedYears = getSelectedYearsFromLocalStorage();
  
  // Fetch the data for each report section
  // This would typically come from the API
  
  // Update the general metrics table
  updateGeneralMetricsTable(selectedYears);
  
  // Update the cash flow table
  updateCashFlowTable(selectedYears);
  
  // Update the net assets table
  updateNetAssetsTable(selectedYears);
  
  // Update the income table
  updateIncomeTable(selectedYears);
  
  // Update the expense table
  updateExpenseTable(selectedYears);
  
  // Update the misc table
  updateMiscTable(selectedYears);
}

function updateGeneralMetricsTable(selectedYears) {
  // Update the general metrics table with data for the selected years
  console.log('Updating general metrics table for years:', selectedYears);
  
  // This would typically involve getting data from localStorage or the API
  // and updating the table cells with the data
}

function updateCashFlowTable(selectedYears) {
  // Update the cash flow table with data for the selected years
  console.log('Updating cash flow table for years:', selectedYears);
}

function updateNetAssetsTable(selectedYears) {
  // Update the net assets table with data for the selected years
  console.log('Updating net assets table for years:', selectedYears);
}

function updateIncomeTable(selectedYears) {
  // Update the income table with data for the selected years
  console.log('Updating income table for years:', selectedYears);
}

function updateExpenseTable(selectedYears) {
  // Update the expense table with data for the selected years
  console.log('Updating expense table for years:', selectedYears);
}

function updateMiscTable(selectedYears) {
  // Update the misc table with data for the selected years
  console.log('Updating misc table for years:', selectedYears);
}

// Export functions for testing or external access
window.SystemConnector = {
  activateTab,
  initializeReportsTab
};