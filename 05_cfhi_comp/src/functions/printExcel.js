/**
 * Excel Report Generator for CFHI Comprehensive Dashboard
 * Generates and exports Excel reports with client data, peer data, and metrics
 */

class ExcelReportGenerator {
    constructor() {
        console.log("ExcelReportGenerator initialized");
        
        // XML templates
        this.XML = {
            HEADER: `<?xml version="1.0" encoding="UTF-8"?><qdbapi><record>`,
            FOOTER: `</record></qdbapi>`
        };

        // Field IDs for Quickbase (based on test configuration)
        this.FIELD_IDS = {
            CLIENT_RID: "171",
            FIRM_NAME: "170", 
            UNIQUE_CLIENTS: "169",
            SLIDER_MIN: "163",
            SLIDER_MAX: "164",
            MISSION_MIN: "165",
            MISSION_MAX: "166",
            AREAS: "167",
            TYPES: "168",
            YEARS: "172",
            // Add more field IDs as needed for your specific Quickbase structure
        };

        // Quickbase URLs
        this.QUICKBASE_URLS = {
            UPLOAD_URL: "https://capincrouse.quickbase.com/db/bt76haf6m?a=API_AddRecord",
            REPORT_BASE_URL: "https://www.quickbaseutilities1.com/CapinTechnology_1795/XL%20Docs/ExcelGen_UA.aspx"
        };

        // URLs for different report formats
        this.REPORT_URLS = {
            SINGLE_YEAR: {
                EXCEL: "https://capin-crouse.quickbase.com/db/bqg7ddtci?a=GenResultsTable&rdr=%2Fdb%2Fbqg7ddtci%3Fa%3Dq%26qid%3D",
                PDF: "https://capin-crouse.quickbase.com/db/bqg7ddtci?a=GenResultsTable&rdr=%2Fdb%2Fbqg7ddtci%3Fa%3Dq%26qid%3D"
            },
            MULTI_YEAR: {
                EXCEL: "https://capin-crouse.quickbase.com/db/bqg7ddtci?a=GenResultsTable&rdr=%2Fdb%2Fbqg7ddtci%3Fa%3Dq%26qid%3D",
                PDF: "https://capin-crouse.quickbase.com/db/bqg7ddtci?a=GenResultsTable&rdr=%2Fdb%2Fbqg7ddtci%3Fa%3Dq%26qid%3D"
            }
        };

        this.xmlPayload = "";
        this.init();
    }

    /**
     * Initialize the Excel Report Generator
     */
    init() {
        console.log("ExcelReportGenerator init() called");
        
        // Ensure DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupEventListeners());
        } else {
            this.setupEventListeners();
        }
    }

    /**
     * Setup event listeners for the report generator
     */
    setupEventListeners() {
        const generateButton = document.getElementById("generateReports");
        if (generateButton) {
            console.log("Setting up generateReports button listener");
            
            // Remove existing listeners to prevent duplicates
            const newButton = generateButton.cloneNode(true);
            generateButton.parentNode.replaceChild(newButton, generateButton);
            
            // Add new listener
            newButton.addEventListener("click", (event) => {
                event.preventDefault();
                this.handleGenerateReport();
            });
        }
    }

    /**
     * Handle the generate report button click
     */
    async handleGenerateReport() {
        console.log("Generate Report button clicked");
        
        try {
            // Show loading state
            const button = document.getElementById("generateReports");
            if (button) {
                button.disabled = true;
                button.textContent = "Generating Report...";
            }

            // Validate data availability
            const hasData = this.validateDataAvailability();
            if (!hasData) {
                createToastWarning("No data available to generate reports. Please run the dashboard first.");
                return;
            }

            // Prepare and send data to Quickbase
            await this.createPrintExcel();
            
            // Show success message
            createToastSuccess("Reports generated successfully! Check the download links below.");
            
            // Show the print modal footer with download links
            this.showPrintModalFooter();

        } catch (error) {
            console.error("Error generating reports:", error);
            createToastWarning("Error generating reports. Please try again.");
        } finally {
            // Reset button state
            const button = document.getElementById("generateReports");
            if (button) {
                button.disabled = false;
                button.textContent = "Generate Trends and Benchmark Reports";
            }
        }
    }

    /**
     * Validate that required data is available for report generation
     */
    validateDataAvailability() {
        // Check if we have data in localStorage
        const dataCategories = ['demoData', 'cashData', 'debtData', 'incomeData', 'expenseData', 'additionalData'];
        
        for (const category of dataCategories) {
            const data = localStorage.getItem(category);
            if (data && data !== 'null' && data !== '{}') {
                const parsedData = JSON.parse(data);
                if (Object.keys(parsedData).length > 0) {
                    return true; // Found at least one category with data
                }
            }
        }
        
        return false;
    }

    /**
     * Show the print modal footer with download links
     */
    showPrintModalFooter() {
        const footer = document.getElementById("print_modal_footer");
        if (footer) {
            footer.classList.remove("hidden");
        }
    }

    /**
     * Escape XML special characters
     */
    escapeXml(unsafe) {
        if (unsafe === null || unsafe === undefined) {
            return "";
        }
        
        return unsafe.toString()
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    /**
     * Calculate statistics for peer data
     */
    calculateStatistics(data, metricName) {
        if (!data || !data[metricName]) {
            return { avg: 0, median: 0, min: 0, max: 0 };
        }

        const values = [];
        const metricData = data[metricName];

        // Collect all peer values
        Object.keys(metricData).forEach(year => {
            if (metricData[year] && metricData[year].peer) {
                Object.values(metricData[year].peer).forEach(peerData => {
                    if (peerData && peerData.value !== undefined && peerData.value !== null) {
                        const value = parseFloat(peerData.value);
                        if (!isNaN(value)) {
                            values.push(value);
                        }
                    }
                });
            }
        });

        if (values.length === 0) {
            return { avg: 0, median: 0, min: 0, max: 0 };
        }

        // Sort values for median calculation
        values.sort((a, b) => a - b);

        const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
        const median = values.length % 2 === 0
            ? (values[values.length / 2 - 1] + values[values.length / 2]) / 2
            : values[Math.floor(values.length / 2)];
        const min = values[0];
        const max = values[values.length - 1];

        return { avg, median, min, max };
    }

    /**
     * Upload field data to the XML payload
     */
    uploadToFile(avg, median, min, max, fieldIds, begin, end) {
        try {
            if (!Array.isArray(fieldIds) || fieldIds.length < 4) {
                console.error("uploadToFile: Invalid fieldIds array");
                return;
            }

            const values = [avg, median, min, max];
            
            for (let i = 0; i < values.length && i < fieldIds.length; i++) {
                const fieldId = fieldIds[i];
                const value = values[i];
                
                if (fieldId && value !== undefined && value !== null) {
                    this.xmlPayload += `<field fid='${fieldId}'>${this.escapeXml(value)}</field>`;
                }
            }

            if (begin && end) {
                console.log(`Uploaded data for fields ${begin} to ${end}`);
            }
        } catch (error) {
            console.error("Error in uploadToFile:", error);
        }
    }

    /**
     * Upload single value to file
     */
    uploadSingleToFile(fieldId, value, isEnd = false) {
        try {
            if (fieldId && value !== undefined && value !== null) {
                this.xmlPayload += `<field fid='${fieldId}'>${this.escapeXml(value)}</field>`;
                
                if (isEnd) {
                    console.log(`Uploaded final field: ${fieldId} = ${value}`);
                }
            }
        } catch (error) {
            console.error("Error in uploadSingleToFile:", error);
        }
    }

    /**
     * Prepare all field data for the report
     */
    async prepareAllFieldData() {
        console.log("Preparing all field data for Excel report");
        
        try {
            // Get current selections and data
            const selectedYears = this.getSelectedYears();
            const selectedClients = Array.from(window.selectedClients_Array || []);
            const clientData = this.getAllClientData();
            const peerData = this.getAllPeerData();

            // Process each data category
            const dataCategories = ['demoData', 'cashData', 'debtData', 'incomeData', 'expenseData', 'additionalData'];
            
            for (const category of dataCategories) {
                await this.processDataCategory(category, selectedYears, clientData, peerData);
            }

            console.log("Field data preparation completed");
            
        } catch (error) {
            console.error("Error preparing field data:", error);
            throw error;
        }
    }

    /**
     * Process a specific data category for report generation
     */
    async processDataCategory(category, selectedYears, clientData, peerData) {
        const data = JSON.parse(localStorage.getItem(category) || '{}');
        
        if (!data || Object.keys(data).length === 0) {
            console.log(`No data found for category: ${category}`);
            return;
        }

        // Process each metric in the category
        Object.keys(data).forEach(metricName => {
            const metricData = data[metricName];
            
            if (metricData && typeof metricData === 'object') {
                // Calculate peer statistics
                const stats = this.calculateStatistics(data, metricName);
                
                // You would map these to appropriate field IDs in your Quickbase
                // This is a simplified example - adjust based on your actual field mapping
                const fieldIds = this.getFieldIdsForMetric(category, metricName);
                
                if (fieldIds && fieldIds.length >= 4) {
                    this.uploadToFile(
                        stats.avg,
                        stats.median,
                        stats.min,
                        stats.max,
                        fieldIds,
                        `${category}_${metricName}`,
                        true
                    );
                }
            }
        });
    }

    /**
     * Get field IDs for a specific metric (customize based on your Quickbase structure)
     */
    getFieldIdsForMetric(category, metricName) {
        // This is a placeholder - you'll need to map your actual field IDs
        // based on your Quickbase application structure
        const baseId = this.getBaseFieldId(category, metricName);
        
        if (baseId) {
            return [baseId, baseId + 1, baseId + 2, baseId + 3]; // avg, median, min, max
        }
        
        return null;
    }

    /**
     * Get base field ID for a metric (customize based on your Quickbase structure)
     */
    getBaseFieldId(category, metricName) {
        // This is a placeholder mapping - customize based on your actual field structure
        const fieldMap = {
            'demoData': 100,
            'cashData': 200,
            'debtData': 300,
            'incomeData': 400,
            'expenseData': 500,
            'additionalData': 600
        };
        
        return fieldMap[category] || null;
    }

    /**
     * Get selected years from localStorage
     */
    getSelectedYears() {
        try {
            const years = localStorage.getItem('selectedYears');
            return years ? JSON.parse(years) : [];
        } catch (error) {
            console.error("Error getting selected years:", error);
            return [];
        }
    }

    /**
     * Get all client data from localStorage
     */
    getAllClientData() {
        const clientData = {};
        const categories = ['demoData', 'cashData', 'debtData', 'incomeData', 'expenseData', 'additionalData'];
        
        categories.forEach(category => {
            try {
                const data = localStorage.getItem(category);
                if (data) {
                    clientData[category] = JSON.parse(data);
                }
            } catch (error) {
                console.error(`Error loading ${category}:`, error);
            }
        });
        
        return clientData;
    }

    /**
     * Get all peer data from localStorage  
     */
    getAllPeerData() {
        // Similar to getAllClientData but focused on peer data
        return this.getAllClientData(); // Same structure, different usage
    }

    /**
     * Create and submit the Excel report to Quickbase
     */
    async createPrintExcel() {
        console.log("Creating Excel report for Quickbase submission");
        
        try {
            // Get current filter values
            const ClientRid = "CFHI_COMP_" + Date.now(); // Generate unique ID
            const firmName = "Capin Crouse"; // Or get from configuration
            const uniqueClientsSize = window.selectedClients_Array ? window.selectedClients_Array.size : 0;
            const sliderValue = window.sliderValue || 0;
            const sliderValue2 = window.sliderValue2 || 25000;
            const types = Array.from(window.selectedTypes_Array || []).join(",");
            const areas = Array.from(window.selectedAreas_Array || []).join(",");
            const selectedYears = this.getSelectedYears();
            
            // Note: This project only uses slider values, not mission values
            const missionValue = 0; // Not used in CFHI project
            const missionValue2 = 0; // Not used in CFHI project

            // Debug log values
            console.log("Excel report data values:", {
                ClientRid,
                firmName,
                uniqueClientsSize,
                sliderValue,
                sliderValue2,
                types,
                areas,
                selectedYears
            });

            // Start the XML with the header
            this.xmlPayload = this.XML.HEADER;

            // Add client data with direct field additions
            this.xmlPayload += `<field fid='${this.FIELD_IDS.CLIENT_RID}'>${this.escapeXml(ClientRid)}</field>`;
            this.xmlPayload += `<field fid='${this.FIELD_IDS.FIRM_NAME}'>${this.escapeXml(firmName)}</field>`;
            this.xmlPayload += `<field fid='${this.FIELD_IDS.UNIQUE_CLIENTS}'>${this.escapeXml(uniqueClientsSize)}</field>`;
            this.xmlPayload += `<field fid='${this.FIELD_IDS.SLIDER_MIN}'>${this.escapeXml(sliderValue)}</field>`;
            this.xmlPayload += `<field fid='${this.FIELD_IDS.SLIDER_MAX}'>${this.escapeXml(sliderValue2)}</field>`;
            this.xmlPayload += `<field fid='${this.FIELD_IDS.MISSION_MIN}'>${this.escapeXml(missionValue)}</field>`;
            this.xmlPayload += `<field fid='${this.FIELD_IDS.MISSION_MAX}'>${this.escapeXml(missionValue2)}</field>`;
            this.xmlPayload += `<field fid='${this.FIELD_IDS.AREAS}'>${this.escapeXml(areas)}</field>`;
            this.xmlPayload += `<field fid='${this.FIELD_IDS.TYPES}'>${this.escapeXml(types)}</field>`;

            // Add years data
            selectedYears.forEach((year, index) => {
                const yearFieldId = this.FIELD_IDS.YEARS + index;
                this.xmlPayload += `<field fid='${yearFieldId}'>${this.escapeXml(year)}</field>`;
            });

            // Prepare all metric data
            await this.prepareAllFieldData();

            // Close the XML
            this.xmlPayload += this.XML.FOOTER;

            // Generate the metrics XML and submit
            const metricsXml = this.generateMetricsXml();
            await this.printToExcel(metricsXml);

        } catch (error) {
            console.error("Error creating Excel report:", error);
            throw error;
        }
    }

    /**
     * Generate the metrics XML for submission
     */
    generateMetricsXml() {
        console.log("Generating metrics XML");
        
        // Use the prepared XML payload
        return this.xmlPayload;
    }

    /**
     * Submit the Excel report to Quickbase and setup download links
     */
    async printToExcel(dataString) {
        console.log("Submitting Excel report to Quickbase");
        
        try {
            // Function to get URL based on year count
            function getUrlBasedOnYearCount(format, recordId) {
                const selectedYears = JSON.parse(localStorage.getItem('selectedYears') || '[]');
                const yearCount = selectedYears.length;
                
                // Map format to docfmt parameter
                const docFormat = format === 'EXCEL' ? 'XL' : 'PDF';
                
                // Map year count to template ID (tpid)
                let tpid;
                switch (yearCount) {
                    case 1: tpid = 42; break;
                    case 2: tpid = 41; break;
                    case 3: tpid = 40; break;
                    case 4: tpid = 39; break;
                    case 5: tpid = 38; break;
                    case 6: tpid = 37; break;
                    case 7: tpid = 36; break;
                    case 8: tpid = 35; break;
                    default: 
                        console.error("Invalid year count:", yearCount);
                        tpid = 42; // Default to single year
                }
                
                // Construct the URL using the pattern from test file
                const url = `https://www.quickbaseutilities1.com/CapinTechnology_1795/XL%20Docs/ExcelGen_UA.aspx?clientid=Q1795&appid=bps9da9i5&tpdbid=bsaavek7s&tpid=${tpid}&fn=InternationalSummary&dbid=bt76haf6m&msid=${recordId}&docfmt=${docFormat}&stream=y&apptoken=---`;
                
                console.log(`Generated URL for format ${format} and RecordId ${recordId}: ${url}`);
                return url;
            }

            // Submit data to Quickbase
            const response = await fetch(this.QUICKBASE_URLS.UPLOAD_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/xml",
                    "QUICKBASE-ACTION": "API_AddRecord"
                },
                body: dataString
            });

            if (!response.ok) {
                throw new Error(`Quickbase submission failed: ${response.status}`);
            }

            const responseText = await response.text();
            console.log("Quickbase response:", responseText);

            // Parse the response to get the record ID
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(responseText, "text/xml");
            const recordId = xmlDoc.querySelector("rid")?.textContent;

            if (recordId) {
                // Setup download links
                const trendXLSButton = document.getElementById("trendXLSFinal");
                const trendPDFButton = document.getElementById("trendPDFFinal");

                if (trendXLSButton) {
                    trendXLSButton.href = getUrlBasedOnYearCount("EXCEL", recordId);
                }

                if (trendPDFButton) {
                    trendPDFButton.href = getUrlBasedOnYearCount("PDF", recordId);
                }

                console.log("Download links updated with record ID:", recordId);
            } else {
                console.error("No record ID found in Quickbase response");
            }

        } catch (error) {
            console.error("Error in printToExcel:", error);
            throw error;
        }
    }
}

// Global functions for backward compatibility
window.ExcelReportGenerator = ExcelReportGenerator;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (!window.excelReportGenerator) {
            window.excelReportGenerator = new ExcelReportGenerator();
        }
    });
} else {
    if (!window.excelReportGenerator) {
        window.excelReportGenerator = new ExcelReportGenerator();
    }
}
