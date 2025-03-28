/**
 * Excel Report Generator
 * A module for generating Excel reports from chart data and uploading to QuickBase
 */
const ExcelReportGenerator = (() => {
    // API Constants
    const API = {
      APP_TOKEN: 'bpat4pgu9t69yby5gbemdbej52j',
      UPLOAD_URL: 'https://capincrouse.quickbase.com/db/bt76haf6m?a=API_AddRecord'
    };
  
    // XML Template Strings
    const XML = {
      HEADER: `<qdbapi><apptoken>${API.APP_TOKEN}</apptoken>`,
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
      YEAR_START: 158
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
     * @param {Event} event - Click event
     */
    function handleGenerateReport(event) {
      const button = event.currentTarget;
      
      // Show loading state
      toggleButtonLoadingState(button);
      
      // Validate data is available
      if (!localStorage.generalData) {
        createToastWarning('No data available. Please select years and run the report first.');
        toggleGenerateReportButtonNormalState(button);
        return;
      }
      
      // Generate report with slight delay to ensure UI updates
      setTimeout(() => {
        generateExcelReport()
          .then(() => {
            toggleGenerateReportButtonNormalState(button);
          })
          .catch(error => {
            console.error('Report generation failed:', error);
            createToastWarning(`Report generation failed: ${error.message}`);
            toggleGenerateReportButtonNormalState(button);
          });
      }, 100);
    }
  
    /**
     * Generate Excel report with data from selected filters
     * @returns {Promise} Promise that resolves when report is generated
     */
    async function generateExcelReport() {
      // Reset XML payload for new report
      xmlPayload = '';
      
      try {
        // Add all metadata fields to the report
        buildReportPayload();
        
        // Send to QuickBase and process response
        const result = await uploadToQuickBase(xmlPayload);
        
        // Update UI with report links
        updateReportLinks(result.recordId);
        
        return result;
      } catch (error) {
        console.error('Error generating Excel report:', error);
        throw error;
      }
    }
  
    /**
     * Build XML payload with all report data
     */
    function buildReportPayload() {
      // Format selection data
      const types = Array.from(selectedTypes_Array).join(';');
      const regions = Array.from(selectedRegions_Array).join(';');
      
      // Start building XML
      xmlPayload = XML.HEADER;
      
      // Add client information
      addField(FIELD_IDS.CLIENT_RID, ClientRid);
      addField(FIELD_IDS.FIRM_NAME, firmName);
      addField(FIELD_IDS.UNIQUE_CLIENTS, uniqueClients.size);
      
      // Add filter settings
      addField(FIELD_IDS.SLIDER_MIN, sliderValue);
      addField(FIELD_IDS.SLIDER_MAX, sliderValue2);
      addField(FIELD_IDS.MISSION_MIN, missionValue);
      addField(FIELD_IDS.MISSION_MAX, missionValue2);
      addField(FIELD_IDS.REGIONS, regions);
      addField(FIELD_IDS.TYPES, types);
      
      // Add years data
      addYearsToReport();
    }
  
    /**
     * Add selected years to the report
     */
    function addYearsToReport() {
      // Sort years for consistent display
      const sortedYears = [...selectedYears_Set].sort((a, b) => a - b);
      const yearCount = sortedYears.length;
      
      // Add each year as a field
      sortedYears.forEach((year, index) => {
        const isLastYear = index === yearCount - 1;
        const fieldId = FIELD_IDS.YEAR_START + index;
        
        // Add the year field, finalizing XML if it's the last one
        if (isLastYear) {
          addField(fieldId, year, true);
        } else {
          addField(fieldId, year);
        }
      });
    }
  
    /**
     * Add a field to the XML payload
     * @param {number} fieldId - QuickBase field ID
     * @param {*} value - Field value
     * @param {boolean} isFinal - Whether this is the final field in the XML
     */
    function addField(fieldId, value, isFinal = false) {
      // Add the field
      xmlPayload += `<field fid='${fieldId}'>${value}</field>`;
      
      // If this is the final field, add closing elements
      if (isFinal) {
        xmlPayload += XML.COLUMN_LIST + XML.FOOTER;
      }
    }
  
    /**
     * Upload XML payload to QuickBase
     * @param {string} xmlData - XML payload to upload
     * @returns {Promise<Object>} Promise resolving to response data
     */
    function uploadToQuickBase(xmlData) {
      return new Promise((resolve, reject) => {
        $.ajax({
          type: 'POST',
          contentType: 'text/xml',
          async: true,
          url: API.UPLOAD_URL,
          dataType: 'xml',
          processData: false,
          data: xmlData,
          success: function(response) {
            try {
              const $xml = $(response);
              const errorCode = $xml.find('qdbapi').find('errcode').text();
              
              if (errorCode !== '0') {
                const errorMsg = $xml.find('qdbapi').find('errtext').text() || 'Unknown error';
                reject(new Error(`QuickBase API error: ${errorMsg}`));
                return;
              }
              
              const recordId = $xml.find('qdbapi').find('rid').text();
              
              // Success message
              createToastSuccess('Generated Reports successfully to QuickBase.');
              
              resolve({ 
                success: true, 
                recordId 
              });
            } catch (error) {
              reject(new Error(`Failed to process QuickBase response: ${error.message}`));
            }
          },
          error: function(xhr, status, error) {
            reject(new Error(`QuickBase request failed: ${error}`));
          }
        });
      });
    }
  
    /**
     * Update UI with report download links
     * @param {string|number} recordId - Generated record ID
     */
    function updateReportLinks(recordId) {
      // Show the footer with links
      const footerElement = document.getElementById('print_modal_footer');
      if (footerElement) {
        footerElement.classList.remove('hidden');
      }
      
      // Update the Excel link
      const xlsLink = document.getElementById('trendXLSFinal');
      if (xlsLink) {
        xlsLink.href = getUrlBasedOnYearCount('xls', recordId);
      }
      
      // Update the PDF link
      const pdfLink = document.getElementById('trendPDFFinal');
      if (pdfLink) {
        pdfLink.href = getUrlBasedOnYearCount('pdf', recordId);
      }
    }
  
    // Public API
    return {
      init,
      generateExcelReport
    };
  })();
  
  // Initialize the module when DOM is ready
  document.addEventListener('DOMContentLoaded', ExcelReportGenerator.init);