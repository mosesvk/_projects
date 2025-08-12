/**
 * Base64 Chart Export and Print Functionality for CFHI Comprehensive Dashboard
 * Exports ApexCharts as base64 images and submits to Quickbase for presentation printing
 */

/**
 * Chart mappings for different chart types and their configurations
 * Based on actual chart IDs from DisplayCharts.js and Utility.js
 */
const chartMappings = {
    // Demo Charts
    "givingUnits_chart": { type: "apex", category: "demoData" },
    "attendeesToStaff_chart": { type: "apex", category: "demoData" },
    
    // Cash Flow Charts  
    "daysExpendableNetAssets_chart": { type: "apex", category: "cashData" },
    "daysOperatingCash_chart": { type: "apex", category: "cashData" },
    "availableDaysOfCashFlow_chart": { type: "apex", category: "cashData" },
    "liquidityRatio_chart": { type: "apex", category: "cashData" },
    "netCashAvailability_chart": { type: "apex", category: "cashData" },
    
    // Debt Charts
    "debtToContributionsWithout_chart": { type: "apex", category: "debtData" },
    "currentRatio_chart": { type: "apex", category: "debtData" },
    "mandatoryDebtServiceToContributionsWithout_chart": { type: "apex", category: "debtData" },
    "debtPerGivingUnit_chart": { type: "apex", category: "debtData" },
    "debtCoverage_chart": { type: "apex", category: "debtData" },
    
    // Income Charts
    "netIncomeRatio_chart": { type: "apex", category: "incomeData" },
    "contributionsWithoutDonorPerGivingUnit_chart": { type: "apex", category: "incomeData" },
    "totalContributionsPerGivingUnit_chart": { type: "apex", category: "incomeData" },
    
    // Expense Charts
    "benefitsToSalaries_chart": { type: "apex", category: "expenseData" },
    "salariesBenefitsIncludingOutsourcedEmployees_chart": { type: "apex", category: "expenseData" },
    "personnelToCashExpenditure_chart": { type: "apex", category: "expenseData" },
    "cashExpendituresPerGivingUnit_chart": { type: "apex", category: "expenseData" }
};

/**
 * Process charts with proper spacing for presentation layout
 */
async function processChartsWithSpacing(chartMappings) {
    const results = [];
    let processedCount = 0;
    const totalCharts = Object.keys(chartMappings).length;
    
    console.log(`Starting to process ${totalCharts} charts for presentation export`);
    
    // Setup progress UI
    setupProgressUI(totalCharts);
    
    try {
        for (const [chartId, config] of Object.entries(chartMappings)) {
            try {
                updateProgressUI(processedCount + 1, totalCharts);
                
                const chartElement = document.getElementById(chartId);
                if (!chartElement) {
                    console.warn(`Chart element not found: ${chartId}`);
                    processedCount++;
                    continue;
                }
                
                // Check if chart has data
                const hasData = await validateChartData(chartId, config.category);
                if (!hasData) {
                    console.warn(`No data available for chart: ${chartId}`);
                    processedCount++;
                    continue;
                }
                
                console.log(`Processing chart: ${chartId} (${processedCount + 1}/${totalCharts})`);
                
                let base64Result;
                
                if (config.type === "apex") {
                    base64Result = await exportApexChart(chartElement, chartId);
                } else {
                    console.warn(`Unsupported chart type: ${config.type} for ${chartId}`);
                    processedCount++;
                    continue;
                }
                
                if (base64Result && base64Result.success) {
                    results.push({
                        chartId: chartId,
                        base64: base64Result.base64,
                        category: config.category,
                        type: config.type
                    });
                    console.log(`Successfully exported: ${chartId}`);
                } else {
                    console.error(`Failed to export chart: ${chartId}`, base64Result?.error);
                }
                
                processedCount++;
                
                // Add small delay between chart processing to prevent browser lockup
                await new Promise(resolve => setTimeout(resolve, 100));
                
            } catch (error) {
                console.error(`Error processing chart ${chartId}:`, error);
                processedCount++;
            }
        }
        
        completeProgressUI(totalCharts);
        
        console.log(`Chart processing completed. Successfully exported ${results.length} out of ${totalCharts} charts`);
        return results;
        
    } catch (error) {
        console.error("Error in processChartsWithSpacing:", error);
        completeProgressUI(totalCharts);
        throw error;
    }
}

/**
 * Validate if a chart has data available
 */
async function validateChartData(chartId, category) {
    try {
        const data = localStorage.getItem(category);
        if (!data || data === 'null' || data === '{}') {
            return false;
        }
        
        const parsedData = JSON.parse(data);
        return Object.keys(parsedData).length > 0;
        
    } catch (error) {
        console.error(`Error validating data for ${chartId}:`, error);
        return false;
    }
}

/**
 * Save complete chart state for restoration later
 */
function saveCompleteChartState(chart) {
    if (!chart) return null;
    
    try {
        const chartElement = chart.el;
        if (!chartElement) return null;
        
        return {
            // Chart configuration
            config: JSON.parse(JSON.stringify(chart.w.config)),
            
            // Chart dimensions and styling
            dimensions: {
                width: chartElement.offsetWidth,
                height: chartElement.offsetHeight,
                position: window.getComputedStyle(chartElement).position,
                top: window.getComputedStyle(chartElement).top,
                left: window.getComputedStyle(chartElement).left,
                zIndex: window.getComputedStyle(chartElement).zIndex,
                transform: window.getComputedStyle(chartElement).transform
            },
            
            // Container styling
            containerStyle: {
                display: chartElement.style.display,
                visibility: chartElement.style.visibility,
                opacity: chartElement.style.opacity,
                background: window.getComputedStyle(chartElement).background,
                padding: window.getComputedStyle(chartElement).padding,
                margin: window.getComputedStyle(chartElement).margin,
                border: window.getComputedStyle(chartElement).border,
                borderRadius: window.getComputedStyle(chartElement).borderRadius,
                boxShadow: window.getComputedStyle(chartElement).boxShadow
            },
            
            // Parent container info
            parentElement: chartElement.parentElement,
            nextSibling: chartElement.nextSibling,
            
            // Chart instance properties
            chartProps: {
                rendered: chart.w.globals.rendered,
                dataChanged: chart.w.globals.dataChanged,
                resized: chart.w.globals.resized
            }
        };
    } catch (error) {
        console.error("Error saving chart state:", error);
        return null;
    }
}

/**
 * Get chart type from chart ID for proper handling
 */
function getChartTypeFromId(chartId) {
    // Map chart IDs to their types for better categorization
    const chartTypeMap = {
        // Demo Charts
        "givingUnits_chart": "demo",
        "attendeesToStaff_chart": "demo",
        
        // Cash Flow Charts
        "daysExpendableNetAssets_chart": "cashflow",
        "daysOperatingCash_chart": "cashflow",
        "availableDaysOfCashFlow_chart": "cashflow",
        "liquidityRatio_chart": "cashflow",
        "netCashAvailability_chart": "cashflow",
        
        // Debt Charts
        "debtToContributionsWithout_chart": "debt",
        "currentRatio_chart": "debt",
        "mandatoryDebtServiceToContributionsWithout_chart": "debt",
        "debtPerGivingUnit_chart": "debt",
        "debtCoverage_chart": "debt",
        
        // Income Charts
        "netIncomeRatio_chart": "income",
        "contributionsWithoutDonorPerGivingUnit_chart": "income",
        "totalContributionsPerGivingUnit_chart": "income",
        
        // Expense Charts
        "benefitsToSalaries_chart": "expense",
        "salariesBenefitsIncludingOutsourcedEmployees_chart": "expense",
        "personnelToCashExpenditure_chart": "expense",
        "cashExpendituresPerGivingUnit_chart": "expense"
    };
    
    return chartTypeMap[chartId] || "unknown";
}

/**
 * Restore complete chart state after export
 */
function restoreCompleteChartState(chart, originalState) {
    if (!chart || !originalState) return;
    
    try {
        const chartElement = chart.el;
        if (!chartElement) return;
        
        // Restore dimensions
        if (originalState.dimensions) {
            chartElement.style.width = originalState.dimensions.width + 'px';
            chartElement.style.height = originalState.dimensions.height + 'px';
            chartElement.style.position = originalState.dimensions.position;
            chartElement.style.top = originalState.dimensions.top;
            chartElement.style.left = originalState.dimensions.left;
            chartElement.style.zIndex = originalState.dimensions.zIndex;
            chartElement.style.transform = originalState.dimensions.transform;
        }
        
        // Restore container styling
        if (originalState.containerStyle) {
            Object.keys(originalState.containerStyle).forEach(prop => {
                if (originalState.containerStyle[prop]) {
                    chartElement.style[prop] = originalState.containerStyle[prop];
                }
            });
        }
        
        // Restore parent relationship if needed
        if (originalState.parentElement && chartElement.parentElement !== originalState.parentElement) {
            if (originalState.nextSibling) {
                originalState.parentElement.insertBefore(chartElement, originalState.nextSibling);
            } else {
                originalState.parentElement.appendChild(chartElement);
            }
        }
        
        // Update chart configuration if needed
        if (originalState.config && JSON.stringify(chart.w.config) !== JSON.stringify(originalState.config)) {
            chart.updateOptions(originalState.config, false, true);
        }
        
        console.log("Chart state restored successfully");
        
    } catch (error) {
        console.error("Error restoring chart state:", error);
    }
}

/**
 * Create number formatter with global configuration
 */
function createFormatterWithGlobals(numType, fixedNum) {
    return function(val) {
        if (val === null || val === undefined || isNaN(val)) {
            return 'N/A';
        }
        
        const num = parseFloat(val);
        
        if (numType === 'currency') {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: fixedNum || 0,
                maximumFractionDigits: fixedNum || 0
            }).format(num);
        } else if (numType === 'percentage') {
            return new Intl.NumberFormat('en-US', {
                style: 'percent',
                minimumFractionDigits: fixedNum || 1,
                maximumFractionDigits: fixedNum || 1
            }).format(num / 100);
        } else if (numType === 'decimal') {
            return new Intl.NumberFormat('en-US', {
                minimumFractionDigits: fixedNum || 2,
                maximumFractionDigits: fixedNum || 2
            }).format(num);
        } else {
            // Default number formatting
            return new Intl.NumberFormat('en-US', {
                minimumFractionDigits: fixedNum || 0,
                maximumFractionDigits: fixedNum || 0
            }).format(num);
        }
    };
}

/**
 * Export ApexChart as base64 image with enhanced error handling
 */
async function exportApexChart(chart, chartId) {
    console.log(`Starting ApexChart export for: ${chartId}`);
    
    try {
        // Get chart instance
        let chartInstance;
        
        if (chart && chart.chart) {
            chartInstance = chart.chart;
        } else if (chart && typeof chart.dataURI === 'function') {
            chartInstance = chart;
        } else if (window.ApexCharts && window.ApexCharts.getChartByID) {
            chartInstance = window.ApexCharts.getChartByID(chartId);
        }
        
        if (!chartInstance) {
            console.error(`Chart instance not found for: ${chartId}`);
            return { success: false, error: 'Chart instance not found' };
        }
        
        // Save original state
        const originalState = saveCompleteChartState(chartInstance);
        
        try {
            // Configure export options for high-quality presentation
            const exportOptions = {
                type: 'png',
                width: 1200,  // High resolution for presentation
                height: 600,
                background: '#ffffff',
                pixelRatio: 2, // For retina displays
                scale: 1
            };
            
            console.log(`Exporting chart ${chartId} with options:`, exportOptions);
            
            // Generate the base64 data URI
            const dataURI = await chartInstance.dataURI(exportOptions);
            
            if (!dataURI) {
                throw new Error('Chart export returned empty data URI');
            }
            
            // Validate the base64 data
            if (!dataURI.startsWith('data:image/')) {
                throw new Error('Invalid data URI format');
            }
            
            console.log(`Successfully exported chart: ${chartId}`);
            
            return {
                success: true,
                base64: dataURI,
                chartId: chartId,
                exportOptions: exportOptions
            };
            
        } finally {
            // Always restore original state
            if (originalState) {
                restoreCompleteChartState(chartInstance, originalState);
            }
        }
        
    } catch (error) {
        console.error(`Error exporting ApexChart ${chartId}:`, error);
        
        // Fallback: try html2canvas export
        console.log(`Attempting fallback export for: ${chartId}`);
        
        const chartElement = document.getElementById(chartId);
        if (chartElement) {
            try {
                const fallbackResult = await exportWithHtml2Canvas(chartElement);
                if (fallbackResult && fallbackResult.success) {
                    console.log(`Fallback export successful for: ${chartId}`);
                    return fallbackResult;
                }
            } catch (fallbackError) {
                console.error(`Fallback export failed for ${chartId}:`, fallbackError);
            }
        }
        
        return {
            success: false,
            error: error.message || 'Unknown export error',
            chartId: chartId
        };
    }
}

/**
 * Fallback export using html2canvas (if available)
 */
async function exportWithHtml2Canvas(chartElement) {
    // Check if html2canvas is available
    if (typeof html2canvas === 'undefined') {
        throw new Error('html2canvas not available for fallback export');
    }
    
    try {
        const canvas = await html2canvas(chartElement, {
            backgroundColor: '#ffffff',
            scale: 2,
            useCORS: true,
            allowTaint: true,
            width: 1200,
            height: 600
        });
        
        const dataURI = canvas.toDataURL('image/png');
        
        return {
            success: true,
            base64: dataURI,
            method: 'html2canvas'
        };
        
    } catch (error) {
        console.error('html2canvas export failed:', error);
        throw error;
    }
}

/**
 * Setup progress UI for chart export
 */
function setupProgressUI(totalCharts) {
    try {
        // Create or update progress indicator
        let progressContainer = document.getElementById('chart-export-progress');
        
        if (!progressContainer) {
            progressContainer = document.createElement('div');
            progressContainer.id = 'chart-export-progress';
            progressContainer.className = 'fixed top-4 right-4 bg-blue-500 text-white p-4 rounded-lg shadow-lg z-50';
            document.body.appendChild(progressContainer);
        }
        
        progressContainer.innerHTML = `
            <div class="flex items-center space-x-3">
                <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                <div>
                    <div class="text-sm font-medium">Exporting Charts for Presentation</div>
                    <div class="text-xs opacity-75">Preparing chart 1 of ${totalCharts}...</div>
                </div>
            </div>
        `;
        
        progressContainer.style.display = 'block';
        
    } catch (error) {
        console.error('Error setting up progress UI:', error);
    }
}

/**
 * Update progress UI during chart export
 */
function updateProgressUI(current, total) {
    try {
        const progressContainer = document.getElementById('chart-export-progress');
        if (progressContainer) {
            const percentage = Math.round((current / total) * 100);
            
            progressContainer.innerHTML = `
                <div class="flex items-center space-x-3">
                    <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    <div>
                        <div class="text-sm font-medium">Exporting Charts for Presentation</div>
                        <div class="text-xs opacity-75">Chart ${current} of ${total} (${percentage}%)</div>
                    </div>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error updating progress UI:', error);
    }
}

/**
 * Complete progress UI after export
 */
function completeProgressUI(total) {
    try {
        const progressContainer = document.getElementById('chart-export-progress');
        if (progressContainer) {
            progressContainer.innerHTML = `
                <div class="flex items-center space-x-3">
                    <div class="rounded-full h-6 w-6 bg-green-400 flex items-center justify-center">
                        <svg class="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <div>
                        <div class="text-sm font-medium">Export Complete!</div>
                        <div class="text-xs opacity-75">Successfully processed ${total} charts</div>
                    </div>
                </div>
            `;
            
            // Hide after 3 seconds
            setTimeout(() => {
                if (progressContainer) {
                    progressContainer.style.display = 'none';
                }
            }, 3000);
        }
    } catch (error) {
        console.error('Error completing progress UI:', error);
    }
}

/**
 * Main function to export all charts for presentation printing
 * Enhanced version using ApexCharts dataURI with fixed dimensions
 */
async function apexChartsExportPrint() {
    showApiLoadingFunction("open", "print");

    const printButton = document.getElementById("printBase64");
    if (!printButton) {
        console.error("Print button not found");
        return;
    }

    try {
        // Disable button and show loading state
        printButton.disabled = true;
        printButton.textContent = "Exporting Charts...";

        console.log("Starting ApexCharts export for presentation printing");

        // Validate that we have data to export
        const hasData = validateDataAvailability();
        if (!hasData) {
            createToastWarning("No chart data available for printing. Please run the dashboard first.");
            return;
        }

        // Process all charts
        const results = await processChartsWithSpacing(chartMappings);
        
        if (results.length === 0) {
            createToastWarning("No charts were successfully exported. Please check that charts are loaded properly.");
            return;
        }

        console.log(`Successfully exported ${results.length} charts, preparing for upload`);

        // Update button state
        printButton.textContent = "Uploading to Quickbase...";

        // Build upload XML and send to Quickbase
        const uploadXml = buildUploadXml(results);
        const uploadResult = await sendToQuickbase(uploadXml);

        if (uploadResult.success) {
            createToastSuccess(`Presentation exported successfully! ${results.length} charts uploaded to Quickbase.`);
            console.log("Chart export and upload completed successfully");
        } else {
            throw new Error(uploadResult.error || "Upload to Quickbase failed");
        }

    } catch (error) {
        console.error("Error in apexChartsExportPrint:", error);
        createToastWarning(`Error exporting presentation: ${error.message}`);
    } finally {
        // Reset button state
        printButton.disabled = false;
        printButton.textContent = "Print Presentation";
        showApiLoadingFunction("close", "print");
    }
}

/**
 * Validate that required data is available for chart export
 */
function validateDataAvailability() {
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
 * Build XML for uploading chart images to Quickbase
 */
function buildUploadXml(results) {
    console.log("Building upload XML for Quickbase submission");
    
    try {
        // Get current selections and metadata
        const selectedYears = JSON.parse(localStorage.getItem('selectedYears') || '[]');
        const clientCount = window.selectedClients_Array ? window.selectedClients_Array.size : 0;
        const sliderValue = window.sliderValue || 0;
        const sliderValue2 = window.sliderValue2 || 25000;
        const missionValue = 0; // Not used in CFHI project
        const missionValue2 = 0; // Not used in CFHI project
        
        // Start XML
        let uploadXml = '<?xml version="1.0" encoding="UTF-8"?><qdbapi><record>';
        
        // Add metadata fields
        uploadXml += createFieldXml(20, new Date().toISOString()); // Timestamp
        uploadXml += createFieldXml(21, selectedYears.join(",")); // Years
        uploadXml += createFieldXml(22, clientCount); // Client count
        uploadXml += createFieldXml(23, selectedYears[selectedYears.length - 1]); // Latest year
        uploadXml += createFieldXml(24, window.monthYearEnd || new Date().getFullYear()); // End year
        uploadXml += createFieldXml(36, sliderValue); // Min slider value
        uploadXml += createFieldXml(37, sliderValue2); // Max slider value
        uploadXml += createFieldXml(38, missionValue); // Min mission value
        uploadXml += createFieldXml(39, missionValue2); // Max mission value
        
        // Add chart images
        results.forEach((result, index) => {
            if (result.base64) {
                const fieldId = 100 + index; // Starting from field 100 for chart images
                uploadXml += createImageFieldXml(fieldId, result.base64);
            }
        });
        
        // Close XML
        uploadXml += '</record></qdbapi>';
        
        console.log(`Upload XML prepared with ${results.length} chart images`);
        return uploadXml;
        
    } catch (error) {
        console.error("Error building upload XML:", error);
        throw error;
    }
}

/**
 * Create XML field element
 */
function createFieldXml(id, val) {
    if (val === null || val === undefined) {
        val = "";
    }
    
    const escapedVal = val.toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    
    return `<field fid='${id}'>${escapedVal}</field>`;
}

/**
 * Create XML field element for image data
 */
function createImageFieldXml(id, val) {
    if (!val || !val.startsWith('data:image/')) {
        return createFieldXml(id, "");
    }
    
    // Extract just the base64 part (remove data:image/png;base64, prefix)
    const base64Data = val.split(',')[1] || val;
    
    return `<field fid='${id}'>${base64Data}</field>`;
}

/**
 * Send chart data to Quickbase
 */
async function sendToQuickbase(xml) {
    console.log("Sending chart data to Quickbase");
    
    try {
        const response = await fetch("https://capincrouse.quickbase.com/db/bt76haf6m?a=API_AddRecord", {
            method: "POST",
            headers: {
                "Content-Type": "application/xml",
                "QUICKBASE-ACTION": "API_AddRecord"
            },
            body: xml
        });

        if (!response.ok) {
            throw new Error(`Quickbase submission failed: ${response.status} ${response.statusText}`);
        }

        const responseText = await response.text();
        console.log("Quickbase upload response:", responseText);

        // Parse response to check for success
        if (responseText.includes('<errcode>0</errcode>') || responseText.includes('<rid>')) {
            return { success: true, response: responseText };
        } else {
            throw new Error("Quickbase returned an error: " + responseText);
        }

    } catch (error) {
        console.error("Error sending to Quickbase:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Initialize the ApexCharts export print functionality
 */
function initApexChartsPrintFunction() {
    const printButton = document.getElementById("printBase64");
    if (!printButton) {
        console.error("Print button not found for ApexCharts export print functionality");
        return;
    }

    // Remove existing event listeners
    const newPrintButton = printButton.cloneNode(true);
    printButton.parentNode.replaceChild(newPrintButton, printButton);

    // Add ApexCharts export print function
    newPrintButton.addEventListener("click", (event) => {
        event.preventDefault();
        apexChartsExportPrint();
    });

    console.log("ApexCharts export print functionality initialized");
}

// Initialize when document is loaded
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApexChartsPrintFunction);
} else {
    initApexChartsPrintFunction();
}

// Export functions for global access
window.apexChartsExportPrint = apexChartsExportPrint;
window.initApexChartsPrintFunction = initApexChartsPrintFunction;
