/**
 * Excel Report Generator
 * A module for generating and uploading financial reports to QuickBase
 */
const ExcelReportGenerator = (() => {
    // API Constants
    const API = {
      APP_TOKEN: 'bpat4pgu9t69yby5gbemdbej52j',
      UPLOAD_URL: 'https://capincrouse.quickbase.com/db/bt76haf6m?a=API_AddRecord'
    };
  
    // XML Template Strings
    const XML = {
      HEADER: `<?xml version="1.0" ?><qdbapi><apptoken>${API.APP_TOKEN}</apptoken>`,
      FOOTER: '</qdbapi>',
      COLUMN_LIST: '<clist>171</clist>'
    };
  
    // Field IDs for QuickBase
    const FIELD_IDS = {
      CLIENT_RID: 171,
      FIRM_NAME: 170,
      UNIQUE_CLIENTS: 169,
      SLIDER_MIN: 163,
      SLIDER_MAX: 164,
      MISSION_MIN: 165,
      MISSION_MAX: 166,
      REGIONS: 167,
      TYPES: 168,
      YEARS_START: 158
    };
  
    // Internal state
    let xmlPayload = '';
  
    /**
     * Initialize the Excel report generator
     */
    function init() {
      const generateReportsBtn = document.getElementById('generateReports');
      
      if (generateReportsBtn) {
        generateReportsBtn.addEventListener('click', handleGenerateReport);
      }
    }
  
    /**
     * Handle generate report button click
     */
    function handleGenerateReport() {
      const button = document.getElementById('generateReports');
      toggleButtonLoadingState(button);
      
      // Validate data is available
      if (!localStorage.generalData) {
        createToastWarning('No data available. Please select years and run the report first.');
        toggleGenerateReportButtonNormalState(button);
        return;
      }
      
      // Generate report with slight delay to ensure UI updates
      setTimeout(() => {
        createPrintExcel()
          .then(() => {
            toggleGenerateReportButtonNormalState(button);
          })
          .catch(error => {
            console.error('Report generation failed:', error);
            createToastWarning(`Report generation failed: ${error.message || 'Unknown error'}`);
            toggleGenerateReportButtonNormalState(button);
          });
      }, 100);
    }
  
    /**
     * Escape XML special characters to prevent malformed XML
     * @param {*} unsafe - Value to escape
     * @returns {string} - XML-safe string
     */
    function escapeXml(unsafe) {
      if (unsafe === undefined || unsafe === null) {
        return '';
      }
      
      return String(unsafe)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
    }
  
    /**
     * Safely get a global variable value, with a default fallback
     * @param {string} varName - Global variable name
     * @param {*} defaultValue - Default value if global var is undefined
     * @returns {*} Variable value or default
     */
    function safeGetGlobal(varName, defaultValue) {
      return typeof window[varName] !== 'undefined' ? window[varName] : defaultValue;
    }

    /**
     * Process data arrays and calculate statistics
     * @param {Array} avgArray - Array of average values
     * @param {Array} midArray - Array of median values
     * @param {Array} minArray - Array of minimum values
     * @param {Array} maxArray - Array of maximum values
     * @param {boolean} weighted - Use weighted calculation
     * @param {boolean} percent - Values are percentages
     * @param {boolean} fixed - Use fixed precision
     * @param {number} num - Number of decimal places
     * @returns {Object} Statistics object
     */
    function dataArrayObjects(avgArray, midArray, minArray, maxArray, weighted, percent, fixed, num) {
      // Ensure all input arrays are valid
      avgArray = Array.isArray(avgArray) ? avgArray : [];
      midArray = Array.isArray(midArray) ? midArray : [];
      minArray = Array.isArray(minArray) ? minArray : [];
      maxArray = Array.isArray(maxArray) ? maxArray : [];
      
      // Filter out non-numeric values
      const filterNumeric = arr => arr.filter(item => !isNaN(parseFloat(item)));
      
      avgArray = filterNumeric(avgArray);
      midArray = filterNumeric(midArray);
      minArray = filterNumeric(minArray);
      maxArray = filterNumeric(maxArray);
      
      if (percent) {
        avgArray = avgArray.map((item) => item / 100);
        midArray = midArray.map((item) => item / 100);
        minArray = minArray.map((item) => item / 100);
        maxArray = maxArray.map((item) => item / 100);
      }

      let avgVal, midVal, minVal, maxVal;

      // Calculate average
      const average = array => {
        if (!array || array.length === 0) return 0;
        return array.reduce((sum, val) => sum + Number(val), 0) / array.length;
      };
      
      // Calculate median
      const median = (array) => {
        if (!array || array.length === 0) return 0;
        const sorted = [...array].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 === 0 
          ? (Number(sorted[mid-1]) + Number(sorted[mid])) / 2 
          : Number(sorted[mid]);
      };

      if (fixed) {
        if (weighted) {
          let i = 0;
          let str = "";
          let arr = String(avgArray[0] || 0);
          while (i <= num + 1) {
            str += arr[i] || '';
            i++;
          }
          avgVal = str || '0';
        } else {
          let i = 0;
          let str = "";
          let arr = String(average(avgArray));
          while (i <= num + 1) {
            str += arr[i] || '';
            i++;
          }
          avgVal = str || '0';
        }
      } else {
        avgVal = weighted ? (avgArray[0] || 0) : Math.round(average(avgArray));
      }

      midVal = fixed 
        ? (median(midArray) || 0).toFixed(num) 
        : median(midArray) || 0;
      
      minVal = minArray.length 
        ? (fixed ? Math.min(...minArray).toFixed(num) : Math.min(...minArray)) 
        : 0;
      
      maxVal = maxArray.length 
        ? (fixed ? Math.max(...maxArray).toFixed(num) : Math.max(...maxArray)) 
        : 0;

      return {
        avg: avgVal,
        mid: midVal,
        min: minVal,
        max: maxVal
      };
    }
  
    /**
     * Add peer statistics to XML payload
     * @param {*} avg - Average value
     * @param {*} mid - Median value
     * @param {*} min - Minimum value
     * @param {*} max - Maximum value
     * @param {Array} fIdArray - Field ID array
     * @param {boolean} begin - Start new XML document
     * @param {boolean} end - End XML document
     */
    function uploadToFile(avg, mid, min, max, fIdArray, begin, end) {
      if (!fIdArray || !Array.isArray(fIdArray) || fIdArray.length < 4) {
        console.warn('Invalid fIdArray provided to uploadToFile:', fIdArray);
        return;
      }
      
      const avgId = fIdArray[0];
      const midId = fIdArray[2];
      const minId = fIdArray[1];
      const maxId = fIdArray[3];
      
      // Escape values for XML
      const safeAvg = escapeXml(avg);
      const safeMid = escapeXml(mid);
      const safeMin = escapeXml(min);
      const safeMax = escapeXml(max);
  
      if (begin) {
        xmlPayload = XML.HEADER;
      }

      xmlPayload += `<field fid='${avgId}'>${safeAvg}</field>` +
                    `<field fid='${midId}'>${safeMid}</field>` +
                    `<field fid='${minId}'>${safeMin}</field>` +
                    `<field fid='${maxId}'>${safeMax}</field>`;
      
      if (end) {
        xmlPayload += XML.COLUMN_LIST + XML.FOOTER;
      }
    }
  
    /**
     * Add a single field to XML payload
     * @param {number} id - Field ID
     * @param {*} val - Field value
     * @param {boolean} end - End XML document
     */
    function uploadSingleToFile(id, val, end = false) {
      // Validate parameters
      if (id === undefined || id === null) {
        console.warn('Invalid field ID provided to uploadSingleToFile');
        return;
      }
      
      const safeVal = escapeXml(val);
      xmlPayload += `<field fid='${id}'>${safeVal}</field>`;
  
      if (end) {
        xmlPayload += XML.COLUMN_LIST;
        xmlPayload += XML.FOOTER;
      }
    }
  
    /**
     * Create file for print with peer statistics
     * @param {string} name - Metric name
     * @param {Array} fIdArray - Field ID array
     * @param {boolean} begin - Start new XML
     * @param {boolean} end - End XML
     * @param {*} avg - Average value
     * @param {*} mid - Median value
     * @param {*} min - Minimum value
     * @param {*} max - Maximum value
     * @param {*} peer - Peer data
     * @param {*} data - Chart data
     */
    function createFileForPrint(name, fIdArray, begin, end, avg, mid, min, max, peer, data) {
      // Skip if null metric or field array
      if (!name || !fIdArray) {
        console.warn(`Skipping metric ${name} - invalid data or field IDs`);
        return;
      }
      
      uploadToFile(avg, mid, min, max, fIdArray, begin, end);
    }
  
    /**
     * Generate Excel report with all data
     * @returns {Promise} Promise that resolves when report is sent
     */
    async function createPrintExcel() {
      // Reset XML payload
      xmlPayload = '';
      
      try {
        // Start a new XML document
        xmlPayload = XML.HEADER;
        
        // Get global variables safely with defaults
        const ClientRid = safeGetGlobal('ClientRid', '');
        const firmName = safeGetGlobal('firmName', '');
        
        // Handle uniqueClients properly - it might be a Set or not defined
        let uniqueClientsSize = 0;
        const uniqueClients = safeGetGlobal('uniqueClients', null);
        if (uniqueClients) {
          uniqueClientsSize = uniqueClients instanceof Set ? uniqueClients.size : 
                            (uniqueClients.length ? uniqueClients.length : 0);
        }
        
        // Get slider values with defaults
        const sliderValue = safeGetGlobal('sliderValue', 0);
        const sliderValue2 = safeGetGlobal('sliderValue2', 0);
        const missionValue = safeGetGlobal('missionValue', 0);
        const missionValue2 = safeGetGlobal('missionValue2', 0);
        
        // Get selected types and regions safely
        const selectedTypes_Array = safeGetGlobal('selectedTypes_Array', []);
        const selectedRegions_Array = safeGetGlobal('selectedRegions_Array', []);
        
        // Format arrays as strings
        const types = Array.isArray(selectedTypes_Array) 
          ? selectedTypes_Array.join(";") 
          : "";
          
        const regions = Array.isArray(selectedRegions_Array) 
          ? selectedRegions_Array.join(";") 
          : "";
        
        // Add client and filter data
        uploadSingleToFile(FIELD_IDS.CLIENT_RID, ClientRid);
        uploadSingleToFile(FIELD_IDS.FIRM_NAME, firmName);
        uploadSingleToFile(FIELD_IDS.UNIQUE_CLIENTS, uniqueClientsSize);
        uploadSingleToFile(FIELD_IDS.SLIDER_MIN, sliderValue);
        uploadSingleToFile(FIELD_IDS.SLIDER_MAX, sliderValue2);
        uploadSingleToFile(FIELD_IDS.MISSION_MIN, missionValue);
        uploadSingleToFile(FIELD_IDS.MISSION_MAX, missionValue2);
        uploadSingleToFile(FIELD_IDS.REGIONS, regions);
        uploadSingleToFile(FIELD_IDS.TYPES, types);
  
        // Add years
        const selectedYears_Set = safeGetGlobal('selectedYears_Set', new Set());
        const yearArray = selectedYears_Set instanceof Set 
          ? Array.from(selectedYears_Set) 
          : [];
          
        const yearLength = yearArray.length;
        let j = FIELD_IDS.YEARS_START;
  
        // Sort years if we have a sortSet function
        if (typeof sortSet === 'function') {
          sortSet(selectedYears_Set);
        } else {
          // Fallback sorting
          yearArray.sort((a, b) => a - b);
        }
  
        // Add years to XML
        yearArray.forEach((year, index) => {
          const isLast = index === yearLength - 1;
          uploadSingleToFile(j, year, isLast);
          j++;
        });
        
        // If we have no years, close the XML properly
        if (yearLength === 0) {
          xmlPayload += XML.COLUMN_LIST + XML.FOOTER;
        }
  
        // Debug: Log the XML payload length (not the full content to avoid console flooding)
        console.log(`XML Payload ready (${xmlPayload.length} bytes)`);
        
        // Validate XML before sending
        if (!xmlPayload.includes('<?xml') || !xmlPayload.endsWith('</qdbapi>')) {
          throw new Error('Malformed XML: Document structure is invalid');
        }
        
        // Send to QuickBase
        await printToExcel(xmlPayload);
        
        return { success: true };
      } catch (error) {
        console.error('Error creating Excel report:', error);
        throw error;
      }
    }
  
    /**
     * Send XML data to QuickBase
     * @param {string} dataString - XML payload
     * @returns {Promise} Promise that resolves when data is sent
     */
    function printToExcel(dataString) {
      return new Promise((resolve, reject) => {
        // Debug output the first 500 chars of the XML for verification
        console.log('Sending XML (first 500 chars):', dataString.substring(0, 500));
        
        $.ajax({
          type: "POST",
          contentType: "text/xml",
          async: true,
          url: API.UPLOAD_URL,
          dataType: "xml",
          processData: false,
          data: dataString,
          success: function(response) {
            try {
              const xmlUpload = $(response);
              const errorCode = xmlUpload.find("qdbapi").find("errcode").text();
              
              if (errorCode === "0") {
                const recordId = xmlUpload.find("qdbapi").find("rid").text();
                
                createToastSuccess("Generated Reports successfully to Quickbase.");
                
                const printModalFooter = document.getElementById("print_modal_footer");
                if (printModalFooter) {
                  printModalFooter.classList.remove("hidden");
                }
                
                const trendXLSFinal = document.getElementById("trendXLSFinal");
                if (trendXLSFinal) {
                  trendXLSFinal.href = getUrlBasedOnYearCount("xls", recordId);
                }
                
                const trendPDFFinal = document.getElementById("trendPDFFinal");
                if (trendPDFFinal) {
                  trendPDFFinal.href = getUrlBasedOnYearCount("pdf", recordId);
                }
                
                resolve({ recordId });
              } else {
                const errorText = xmlUpload.find("qdbapi").find("errtext").text() || "Unknown QuickBase error";
                const error = new Error(`QuickBase error (${errorCode}): ${errorText}`);
                console.error(error);
                createToastWarning(error.message);
                reject(error);
              }
            } catch (parseError) {
              console.error("Error parsing QuickBase response:", parseError);
              createToastWarning(`Failed to parse QuickBase response: ${parseError.message}`);
              reject(new Error(`Failed to parse QuickBase response: ${parseError.message}`));
            }
          },
          error: function(xhr, status, error) {
            // Extract meaningful error information
            let errorMessage = "Unknown error";
            
            if (xhr && xhr.responseText) {
              try {
                // Try to parse XML response
                const $errorXml = $(xhr.responseText);
                errorMessage = $errorXml.find("errtext").text() || error || status;
              } catch (e) {
                // If we can't parse XML, use the raw responseText or status
                errorMessage = xhr.responseText || error || status;
              }
            } else {
              errorMessage = error || status;
            }
            
            console.error("QuickBase API error:", {
              status,
              error,
              message: errorMessage
            });
            
            createToastWarning(`QuickBase API error: ${errorMessage}`);
            reject(new Error(`QuickBase API error: ${errorMessage}`));
          },
        });
      });
    }
  
    // Public API
    return {
      init,
      createPrintExcel,
      uploadToFile,
      uploadSingleToFile,
      createFileForPrint,
      dataArrayObjects,
      printToExcel
    };
  })();
  
  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    ExcelReportGenerator.init();
    
    // Expose functions globally for backward compatibility
    window.createPrintExcel = ExcelReportGenerator.createPrintExcel;
    window.uploadToFile = ExcelReportGenerator.uploadToFile; 
    window.uploadSingleToFile = ExcelReportGenerator.uploadSingleToFile;
    window.createFileForPrint = ExcelReportGenerator.createFileForPrint;
    window.dataArrayObjects = ExcelReportGenerator.dataArrayObjects;
    window.printToExcel = ExcelReportGenerator.printToExcel;
  });