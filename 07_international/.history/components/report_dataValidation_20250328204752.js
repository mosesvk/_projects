/**
 * QuickBase Data Validator
 * Utility to verify that all fields are being correctly prepared for QuickBase export
 */
const QuickBaseValidator = (() => {
    // Field ID mapping for all metrics that should be in the XML
    const EXPECTED_FIELD_IDS = [
      // General data
      [6, 44, 82, 120], // itExpenses
      
      // Cash data
      [7, 45, 83, 121], // daysCashOnHand
      [8, 46, 84, 122], // daysExpensesInUnrestrictedNA
      [9, 47, 85, 123], // daysExpensesInUnrestrictedNA_excludingPPE
      [10, 48, 86, 124], // daysExpensesInNAwithDR
      [11, 49, 87, 125], // daysExpensesInNAwithDR_excludingPPE
      [12, 50, 88, 126], // liquidityFundsAvailable
      [13, 51, 89, 127], // financialAssetsAvailableFY
      [14, 52, 90, 128], // daysFinancialAssetsOnHand
      [15, 53, 91, 129], // currentRatio
      [16, 54, 92, 130], // totalCoverageRatio
      [17, 55, 93, 131], // cashFlowsTrendFinancing
      [18, 56, 94, 132], // cashFlowsTrendInvesting
      [19, 57, 95, 133], // cashFlowsTrendOperating
      
      // Asset data
      [20, 58, 96, 134], // percentWithDR
      [21, 59, 97, 135], // percentWithoutDR_excludingPPE
      [22, 60, 98, 136], // percentWithoutDR
      
      // Income data
      [23, 61, 99, 137], // netIncomeRatio
      [24, 62, 100, 138], // contributionsTrend_basedOnNumberOfDonors
      [25, 63, 101, 139], // contributionsTrend
      [26, 64, 102, 140], // contributionsPercentWithoutDR
      [27, 65, 103, 141], // contributionsPercentWithDR
      [28, 66, 104, 142], // contributionsPerGivingUnit
      [29, 67, 105, 143], // contributionsPerMissionaryUnit
      [30, 68, 106, 144], // contributionsPerFullTimeEquivalent
      [31, 69, 107, 145], // fundraisingAsPercentOfContributions
      [32, 70, 108, 146], // annualizedInvestmentReturn
      
      // Expense data
      [33, 71, 109, 147], // functionalExpensePercent_program
      [34, 72, 110, 148], // functionalExpensePercent_administrative
      [35, 73, 111, 149], // functionalExpensePercent_fundraising
      [37, 75, 113, 151], // costOfContributions
      [38, 76, 114, 152], // expensesPerGivingUnit
      [39, 77, 115, 153], // expensesPerMissionaryUnit
      [40, 78, 116, 154], // expensesPerFullTimeEquivalent
      [41, 79, 117, 155], // salariesAndBenefitsAsPercentOfTotalExpenses
      [42, 80, 118, 156], // salariesAndBenefitsPerFTE
      
      // Misc data
      [43, 81, 119, 157], // percentageAssessmentOnRestrictedGifts
    ];
    
    /**
     * Check if uploadToFile is capturing all expected field IDs
     */
    function validateUploadToFile() {
      console.log("Validating uploadToFile function...");
      
      // Store original function
      const originalUploadToFile = window.uploadToFile;
      
      // Replace with instrumented version
      window.uploadToFile = function(avg, mid, min, max, fIdArray, begin, end) {
        console.log(`uploadToFile called with field IDs: ${fIdArray}`);
        
        // Call original function
        if (typeof originalUploadToFile === 'function') {
          originalUploadToFile(avg, mid, min, max, fIdArray, begin, end);
        }
      };
      
      console.log("uploadToFile function instrumented for validation");
    }
    
    /**
     * Check if the XMLPayload contains all necessary field IDs
     * @param {string} xmlPayload - The XML payload to validate
     * @returns {boolean} True if all expected fields are found
     */
    function validateXmlPayload(xmlPayload) {
      console.log("Validating XML payload...");
      
      if (!xmlPayload) {
        console.error("No XML payload provided");
        return false;
      }
      
      // Flatten the array of field IDs
      const allExpectedIds = EXPECTED_FIELD_IDS.flat();
      const missingIds = [];
      
      // Check each expected field ID
      allExpectedIds.forEach(fieldId => {
        const fieldTag = `<field fid='${fieldId}'>`;
        if (!xmlPayload.includes(fieldTag)) {
          missingIds.push(fieldId);
        }
      });
      
      if (missingIds.length > 0) {
        console.error(`Missing field IDs in XML payload: ${missingIds.join(', ')}`);
        return false;
      }
      
      console.log("All expected field IDs found in XML payload");
      return true;
    }
    
    /**
     * Hook into the printToExcel function to validate XML before sending
     */
    function interceptPrintToExcel() {
      console.log("Intercepting printToExcel function...");
      
      // Store original function
      const originalPrintToExcel = window.printToExcel;
      
      // Replace with instrumented version
      window.printToExcel = function(dataString) {
        console.log("printToExcel called - validating XML payload");
        
        // Check XML for all required fields
        const isValid = validateXmlPayload(dataString);
        
        if (!isValid) {
          console.error("XML validation failed - some fields are missing");
          
          // Log a sample of the XML for debugging
          console.log("XML payload sample:", dataString.substring(0, 500) + "...");
          
          if (typeof createToastWarning === 'function') {
            createToastWarning("Missing field data for QuickBase export. Please check console for details.");
          }
        } else {
          console.log("XML validation passed - all fields are present");
        }
        
        // Call original function
        if (typeof originalPrintToExcel === 'function') {
          return originalPrintToExcel(dataString);
        }
      };
      
      console.log("printToExcel function instrumented for validation");
    }
    
    /**
     * Test the createFileForPrint function with sample data
     */
    function testCreateFileForPrint() {
      console.log("Testing createFileForPrint function...");
      
      // Create a sample metric
      const sampleMetric = "testMetric";
      const sampleFieldIds = [99, 100, 101, 102];
      const samplePeerData = { "total": [1, 2, 3, 4, 5] };
      const sampleClientData = { "2022": { value: 3 } };
      
      // Create sample dataObject
      const sampleDataObject = {
        [`${sampleMetric}_Peer`]: samplePeerData,
        [`${sampleMetric}_Client`]: sampleClientData
      };
      
      // Call createFileForPrint
      if (typeof window.createFileForPrint === 'function') {
        window.createFileForPrint(
          sampleMetric,
          sampleFieldIds,
          true,  // begin
          false, // end
          2.5,   // avg
          3,     // mid
          1,     // min
          5,     // max
          samplePeerData,
          sampleDataObject
        );
        
        console.log("createFileForPrint test completed");
      } else {
        console.error("createFileForPrint function not available");
      }
    }
    
    /**
     * Verify that all necessary data is loaded and available
     */
    function verifyDataAvailability() {
      console.log("Verifying data availability...");
      
      const dataCategories = [
        "generalData",
        "cashData",
        "assetData",
        "incomeData",
        "expenseData",
        "miscData"
      ];
      
      const missingCategories = [];
      
      dataCategories.forEach(category => {
        const data = localStorage.getItem(category);
        if (!data) {
          missingCategories.push(category);
        } else {
          try {
            const parsedData = JSON.parse(data);
            const keys = Object.keys(parsedData);
            console.log(`${category}: ${keys.length} keys available`);
          } catch (error) {
            console.error(`Error parsing ${category}:`, error);
            missingCategories.push(`${category} (parse error)`);
          }
        }
      });
      
      if (missingCategories.length > 0) {
        console.error(`Missing data categories: ${missingCategories.join(', ')}`);
        return false;
      }
      
      console.log("All data categories are available");
      return true;
    }
    
    /**
     * Run all validators
     */
    function runAllValidators() {
      console.log("Running all QuickBase validators...");
      
      validateUploadToFile();
      interceptPrintToExcel();
      verifyDataAvailability();
      testCreateFileForPrint();
      
      console.log("All validators initialized");
      
      return {
        validateXmlPayload,
        verifyDataAvailability,
        testCreateFileForPrint
      };
    }
    
    // Return public API
    return {
      runAllValidators,
      validateXmlPayload,
      validateUploadToFile,
      interceptPrintToExcel,
      verifyDataAvailability,
      testCreateFileForPrint
    };
  })();
  
  // Make globally available for debugging
  window.QuickBaseValidator = QuickBaseValidator;