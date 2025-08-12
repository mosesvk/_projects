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

        // Field IDs for Quickbase (from printExcelFields.md)
        this.FIELD_IDS = {
            // Basic client information
            CLIENT_ID: "227",
            CLIENT_NAME: "223", 
            RECORDS_RETURNED: "224",
            TYPE: "287",
            
            // Years (up to 5 years supported)
            YEAR_1: "228",
            YEAR_2: "229", 
            YEAR_3: "230",
            YEAR_4: "231",
            YEAR_5: "232",
            YEAR_COUNT: "290",
            
            // Query parameters
            QUERY_GU_MIN: "296",
            QUERY_GU_MAX: "297",
            QUERY_YEARS: "298",
            QUERY_REGIONS: "299",
            
            // URL fields for reports
            PRINT_URL_TRENDS_PDF: "288",
            PRINT_URL_TRENDS_XLS: "292",
            PRINT_URL_BENCHMARK_PDF: "293",
            PRINT_URL_BENCHMARK_XLS: "294",
        };

        // Quickbase URLs
        this.QUICKBASE_URLS = {
            UPLOAD_URL: "https://capincrouse.quickbase.com/db/bt76haf6m?a=API_AddRecord",
            REPORT_BASE_URL: "https://www.quickbaseutilities1.com/CapinTechnology_1795/XL%20Docs/ExcelGen_UA.aspx"
        };

        // Comprehensive field mappings for all metrics (from printExcelFields.md)
        this.METRIC_FIELD_IDS = {
            // C01 - Demo Data
            "givingUnits": { AVG: "6", MID: "7", MIN: "8", MAX: "9" },
            "attendeesToStaff": { AVG: "22", MID: "23", MIN: "24", MAX: "25" },
            
            // C03 - Cash Data  
            "daysExpendableNetAssets": { AVG: "55", MID: "56", MIN: "57", MAX: "58" },
            "daysOperatingCash": { AVG: "59", MID: "60", MIN: "61", MAX: "62" },
            "availableDaysOfCashFlow": { AVG: "63", MID: "64", MIN: "65", MAX: "66" },
            "liquidityRatio": { AVG: "67", MID: "68", MIN: "69", MAX: "70" },
            "netCashAvailability": { AVG: "71", MID: "72", MIN: "73", MAX: "74" },
            
            // C04 - Debt Data
            "debtToContributionsWithout": { AVG: "83", MID: "84", MIN: "85", MAX: "86" },
            "currentRatio": { AVG: "87", MID: "88", MIN: "89", MAX: "90" },
            "mandatoryDebtServiceToContributionsWithout": { AVG: "91", MID: "92", MIN: "93", MAX: "94" },
            "debtPerGivingUnit": { AVG: "103", MID: "104", MIN: "105", MAX: "106" },
            "debtCoverage": { AVG: "111", MID: "112", MIN: "113", MAX: "114" },
            
            // C05 - Income Data
            "netIncomeRatio": { AVG: "115", MID: "116", MIN: "117", MAX: "118" },
            "contributionsWithoutDonorPerGivingUnit": { AVG: "123", MID: "124", MIN: "125", MAX: "126" },
            "totalContributionsPerGivingUnit": { AVG: "131", MID: "132", MIN: "133", MAX: "134" },
            
            // C06 - Expense Data
            "benefitsToSalaries": { AVG: "135", MID: "136", MIN: "137", MAX: "138" },
            "salariesBenefitsIncludingOutsourcedEmployees": { AVG: "151", MID: "152", MIN: "153", MAX: "154" },
            "personnelToCashExpenditure": { AVG: "155", MID: "156", MIN: "157", MAX: "158" },
            "cashExpendituresPerGivingUnit": { AVG: "183", MID: "184", MIN: "185", MAX: "186" }
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
                // Map the metric name to the field mapping name
                const mappedMetricName = this.mapChartNameToMetricName(metricName);
                
                // Calculate peer statistics
                const stats = this.calculateStatistics(data, metricName);
                
                // Get the correct field IDs from our comprehensive mapping
                const fieldIds = this.getFieldIdsForMetric(category, mappedMetricName);
                
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
                    
                    console.log(`Uploaded data for ${mappedMetricName}: AVG=${stats.avg}, MID=${stats.median}, MIN=${stats.min}, MAX=${stats.max}`);
                } else {
                    console.warn(`No field mapping available for metric: ${mappedMetricName} in category: ${category}`);
                }
            }
        });
    }

    /**
     * Get field IDs for a specific metric (based on printExcelFields.md mapping)
     */
    getFieldIdsForMetric(category, metricName) {
        // Get the metric field mapping from our comprehensive list
        const metricFields = this.METRIC_FIELD_IDS[metricName];
        
        if (metricFields) {
            return [
                metricFields.AVG,
                metricFields.MID, 
                metricFields.MIN,
                metricFields.MAX
            ];
        }
        
        console.warn(`No field mapping found for metric: ${metricName} in category: ${category}`);
        return null;
    }

    /**
     * Get the metric name mapped to the actual field names used in the data
     */
    mapChartNameToMetricName(chartName) {
        // Map chart names to the metric names used in METRIC_FIELD_IDS
        const chartToMetricMap = {
            // Demo charts
            "givingUnits": "givingUnits",
            "attendeesToStaff": "attendeesToStaff",
            
            // Cash charts
            "daysExpendableNetAssets": "daysExpendableNetAssets", 
            "daysOperatingCash": "daysOperatingCash",
            "availableDaysOfCashFlow": "availableDaysOfCashFlow",
            "liquidityRatio": "liquidityRatio",
            "netCashAvailability": "netCashAvailability",
            
            // Debt charts
            "debtToContributionsWithout": "debtToContributionsWithout",
            "currentRatio": "currentRatio", 
            "mandatoryDebtServiceToContributionsWithout": "mandatoryDebtServiceToContributionsWithout",
            "debtPerGivingUnit": "debtPerGivingUnit",
            "debtCoverage": "debtCoverage",
            
            // Income charts
            "netIncomeRatio": "netIncomeRatio",
            "contributionsWithoutDonorPerGivingUnit": "contributionsWithoutDonorPerGivingUnit",
            "totalContributionsPerGivingUnit": "totalContributionsPerGivingUnit",
            
            // Expense charts
            "benefitsToSalaries": "benefitsToSalaries",
            "salariesBenefitsIncludingOutsourcedEmployees": "salariesBenefitsIncludingOutsourcedEmployees", 
            "personnelToCashExpenditure": "personnelToCashExpenditure",
            "cashExpendituresPerGivingUnit": "cashExpendituresPerGivingUnit"
        };
        
        return chartToMetricMap[chartName] || chartName;
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
            const clientId = "CFHI_COMP_" + Date.now(); // Generate unique ID
            const clientName = "CFHI Comprehensive Report"; // Report name
            const recordsReturned = window.selectedClients_Array ? window.selectedClients_Array.size.toString() : "0";
            const sliderMin = window.sliderValue || 0;
            const sliderMax = window.sliderValue2 || 25000;
            const types = Array.from(window.selectedTypes_Array || []).join(",");
            const regions = Array.from(window.selectedAreas_Array || []).join(",");
            const selectedYears = this.getSelectedYears();

            // Debug log values
            console.log("Excel report data values:", {
                clientId,
                clientName,
                recordsReturned,
                sliderMin,
                sliderMax,
                types,
                regions,
                selectedYears
            });

            // Start the XML with the header
            this.xmlPayload = this.XML.HEADER;

            // Add basic client information
            this.xmlPayload += `<field fid='${this.FIELD_IDS.CLIENT_ID}'>${this.escapeXml(clientId)}</field>`;
            this.xmlPayload += `<field fid='${this.FIELD_IDS.CLIENT_NAME}'>${this.escapeXml(clientName)}</field>`;
            this.xmlPayload += `<field fid='${this.FIELD_IDS.RECORDS_RETURNED}'>${this.escapeXml(recordsReturned)}</field>`;
            this.xmlPayload += `<field fid='${this.FIELD_IDS.TYPE}'>${this.escapeXml(types)}</field>`;

            // Add query parameters
            this.xmlPayload += `<field fid='${this.FIELD_IDS.QUERY_GU_MIN}'>${this.escapeXml(sliderMin)}</field>`;
            this.xmlPayload += `<field fid='${this.FIELD_IDS.QUERY_GU_MAX}'>${this.escapeXml(sliderMax)}</field>`;
            this.xmlPayload += `<field fid='${this.FIELD_IDS.QUERY_YEARS}'>${this.escapeXml(selectedYears.join(","))}</field>`;
            this.xmlPayload += `<field fid='${this.FIELD_IDS.QUERY_REGIONS}'>${this.escapeXml(regions)}</field>`;

            // Add years data (up to 5 years)
            const yearFields = [
                this.FIELD_IDS.YEAR_1, this.FIELD_IDS.YEAR_2, this.FIELD_IDS.YEAR_3, 
                this.FIELD_IDS.YEAR_4, this.FIELD_IDS.YEAR_5
            ];
            
            selectedYears.forEach((year, index) => {
                if (index < yearFields.length) {
                    this.xmlPayload += `<field fid='${yearFields[index]}'>${this.escapeXml(year)}</field>`;
                }
            });

            // Add year count
            this.xmlPayload += `<field fid='${this.FIELD_IDS.YEAR_COUNT}'>${this.escapeXml(selectedYears.length)}</field>`;

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
                const url = `https://www.quickbaseutilities1.com/CapinTechnology_1795/XL%20Docs/ExcelGen_UA.aspx?clientid=Q1795&appid=bps9da9i5&tpdbid=btcc8gq3r&tpid=${tpid}&fn=InternationalSummary&dbid=bt76haf6m&msid=${recordId}&docfmt=${docFormat}&stream=y&apptoken=---`;
                
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
