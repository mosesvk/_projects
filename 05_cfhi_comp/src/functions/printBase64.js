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
                    // Try to get chart instance like the working testPrintBase64.js does
                    let chartInstanceForExport;
                    if (window.chartManager && typeof window.chartManager.getChart === 'function') {
                        chartInstanceForExport = window.chartManager.getChart(chartId);
                    }
                    if (!chartInstanceForExport) {
                        chartInstanceForExport = window[chartId];
                    }
                    
                    base64Result = await exportApexChart(chartInstanceForExport, chartId);
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
 * Get chart instance by ID from global variables
 */
function getChartInstanceById(chartId) {
    // Map chart IDs to their global variable names
    const chartVariableMap = {
        "givingUnits_chart": "givingUnits_chart",
        "attendeesToStaff_chart": "attendeesToStaff_chart",
        "daysExpendableNetAssets_chart": "daysExpendableNetAssets_chart",
        "daysOperatingCash_chart": "daysOperatingCash_chart",
        "availableDaysOfCashFlow_chart": "availableDaysOfCashFlow_chart",
        "liquidityRatio_chart": "liquidityRatio_chart",
        "netCashAvailability_chart": "netCashAvailability_chart",
        "debtToContributionsWithout_chart": "debtToContributionsWithout_chart",
        "currentRatio_chart": "currentRatio_chart",
        "mandatoryDebtServiceToContributionsWithout_chart": "mandatoryDebtServiceToContributionsWithout_chart",
        "debtPerGivingUnit_chart": "debtPerGivingUnit_chart",
        "debtCoverage_chart": "debtCoverage_chart",
        "netIncomeRatio_chart": "netIncomeRatio_chart",
        "contributionsWithoutDonorPerGivingUnit_chart": "contributionsWithoutDonorPerGivingUnit_chart",
        "totalContributionsPerGivingUnit_chart": "totalContributionsPerGivingUnit_chart",
        "benefitsToSalaries_chart": "benefitsToSalaries_chart",
        "salariesBenefitsIncludingOutsourcedEmployees_chart": "salariesBenefitsIncludingOutsourcedEmployees_chart",
        "personnelToCashExpenditure_chart": "personnelToCashExpenditure_chart",
        "cashExpendituresPerGivingUnit_chart": "cashExpendituresPerGivingUnit_chart"
    };
    
    const variableName = chartVariableMap[chartId];
    if (variableName && window[variableName]) {
        console.log(`Found chart instance for ${chartId} in global variable: ${variableName}`);
        return window[variableName];
    }
    
    console.warn(`No global chart instance found for: ${chartId}`);
    return null;
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
        // Get chart instance using the same approach as working testPrintBase64.js
        let chartInstance;
        
        // Try multiple approaches to find the chart instance
        
        // Method 1: chartManager (from working test)
        if (window.chartManager && typeof window.chartManager.getChart === 'function') {
            chartInstance = window.chartManager.getChart(chartId);
            console.log(`Method 1 (chartManager): ${chartInstance ? 'found' : 'not found'}`);
        }
        
        // Method 2: ApexCharts global registry
        if (!chartInstance && window.ApexCharts) {
            // Try different ways to get from ApexCharts global
            if (window.ApexCharts.getChartByID) {
                chartInstance = window.ApexCharts.getChartByID(chartId);
                console.log(`Method 2a (ApexCharts.getChartByID): ${chartInstance ? 'found' : 'not found'}`);
            }
            
            // Try ApexCharts.exec
            if (!chartInstance && window.ApexCharts.exec) {
                try {
                    // ApexCharts.exec can access chart instances
                    const execResult = window.ApexCharts.exec(chartId, 'dataURI');
                    if (execResult) {
                        console.log(`Method 2b (ApexCharts.exec): found via exec`);
                        // Create a minimal chart-like object for exec
                        chartInstance = {
                            dataURI: (options) => window.ApexCharts.exec(chartId, 'dataURI', options)
                        };
                    }
                } catch (e) {
                    console.log(`Method 2b (ApexCharts.exec): failed -`, e.message);
                }
            }
        }
        
        // Method 3: Global variables (existing approach)
        if (!chartInstance) {
            chartInstance = getChartInstanceById(chartId);
            console.log(`Method 3 (global variables): ${chartInstance ? 'found' : 'not found'}`);
        }
        
        // Method 4: From passed chart parameter
        if (!chartInstance) {
            if (chart && chart.chart) {
                chartInstance = chart.chart;
                console.log(`Method 4a (chart.chart): found`);
            } else if (chart && typeof chart.dataURI === 'function') {
                chartInstance = chart;
                console.log(`Method 4b (chart directly): found`);
            }
        }
        
        if (!chartInstance) {
            console.error(`Chart instance not found for: ${chartId}`);
            return { success: false, error: 'Chart instance not found' };
        }
        
        // Chart instance found successfully
        
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
            
            // Check if chart has dataURI method (relax validation for debugging)
            if (!chartInstance || typeof chartInstance.dataURI !== 'function') {
                throw new Error(`Chart instance missing dataURI method. Type: ${typeof chartInstance}, Has dataURI: ${typeof chartInstance?.dataURI}`);
            }
            
            // Ensure chart is visible and properly rendered before export
            const chartElement = document.getElementById(chartId);
            let originalStyles = {};
            if (chartElement) {
                // Save original styles
                originalStyles = {
                    display: chartElement.style.display,
                    visibility: chartElement.style.visibility,
                    opacity: chartElement.style.opacity
                };
                
                // Make sure chart container is visible
                chartElement.style.display = 'block';
                chartElement.style.visibility = 'visible';
                chartElement.style.opacity = '1';
                
                // Force a small delay to ensure rendering is complete
                await new Promise(resolve => setTimeout(resolve, 150));
            }
            
            // Use the same export approach as the working testPrintBase64.js
            const uri = await chartInstance.dataURI({
                width: exportOptions.width,
                height: exportOptions.height,
                scale: exportOptions.pixelRatio || 2
            });
            
            // Restore original styles
            if (chartElement && originalStyles) {
                chartElement.style.display = originalStyles.display;
                chartElement.style.visibility = originalStyles.visibility;
                chartElement.style.opacity = originalStyles.opacity;
            }
            
            console.log(`Export result for ${chartId}:`, uri);
            
            // Extract base64 data the same way as testPrintBase64.js (line 918)
            let base64Data;
            if (uri && uri.imgURI) {
                // Split and get just the base64 part (same as testPrintBase64.js line 918)
                base64Data = uri.imgURI.split(",")[1];
            } else if (typeof uri === 'string') {
                // If it's already a string, extract base64 part
                base64Data = uri.includes(',') ? uri.split(",")[1] : uri;
            } else {
                throw new Error(`Unexpected export result format: ${typeof uri}`);
            }
            
            // Validate base64 data with better checks
            if (!base64Data || base64Data.trim() === '' || base64Data === 'data:,' || base64Data.length < 100) {
                console.warn(`Chart ${chartId} returned empty or invalid base64 data:`, { uri, base64Data: base64Data?.substring(0, 50) });
                
                // Try alternative export approach for problematic charts
                console.log(`Attempting alternative export for ${chartId}...`);
                
                // Alternative approach - try forcing a redraw and re-export
                if (chartElement && chartElement.offsetHeight > 0 && chartElement.offsetWidth > 0) {
                    if (typeof chartInstance.render === 'function') {
                        await chartInstance.render();
                        await new Promise(resolve => setTimeout(resolve, 200));
                        
                        const retryUri = await chartInstance.dataURI({
                            width: exportOptions.width,
                            height: exportOptions.height,
                            scale: exportOptions.pixelRatio || 2
                        });
                        
                        if (retryUri && retryUri.imgURI && retryUri.imgURI !== 'data:,') {
                            base64Data = retryUri.imgURI.split(",")[1];
                        }
                    }
                }
                
                // Final validation after retry
                if (!base64Data || base64Data.trim() === '' || base64Data === 'data:,' || base64Data.length < 100) {
                    throw new Error('Chart export returned empty base64 data');
                }
            }
            
            // Return the data URI format expected by our upload function
            const dataURI = `data:image/png;base64,${base64Data}`;
            
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
        
        // Field IDs from printFields.md
        const FIELD_IDS = {
            // Metadata fields
            CLIENT_NAME: "30",
            UNIQUE_CLIENT_COUNT: "31", 
            QUERY_SITES: "33",
            QUERY_REGIONS: "34",
            CURRENT_MONTH_YE: "36",
            QUERY_GIVING_MIN: "53",
            QUERY_GIVING_MAX: "54",
            
            // Year fields (up to 8 years)
            YEAR_1: "37", YEAR_2: "38", YEAR_3: "39", YEAR_4: "40",
            YEAR_5: "41", YEAR_6: "42", YEAR_7: "43", YEAR_8: "44",
            
            // Chart base64 fields - exact mapping from printFields.md
            BASE64_GIVING_UNITS: "11",
            BASE64_ATTENDEES_TO_STAFF: "12",
            BASE64_DAYS_EXPENDABLE_NET_ASSETS: "13",
            BASE64_DAYS_OPERATING_CASH: "14",
            BASE64_AVAILABLE_DAYS_OF_CASH_FLOW: "15",
            BASE64_LIQUIDITY_RATIO: "16",
            BASE64_NET_CASH_AVAILABILITY: "17",
            BASE64_DEBT_TO_CONTRIBUTIONS_WITHOUT: "18",
            BASE64_CURRENT_RATIO: "19",
            BASE64_MANDATORY_DEBT_SERVICE_TO_CONTRIBUTIONS_WITHOUT: "20",
            BASE64_DEBT_PER_GIVING_UNIT: "21",
            BASE64_DEBT_COVERAGE: "22",
            BASE64_NET_INCOME_RATIO: "23",
            BASE64_CONTRIBUTIONS_WITHOUT_DONOR_PER_GIVING_UNIT: "24",
            BASE64_TOTAL_CONTRIBUTIONS_PER_GIVING_UNIT: "25",
            BASE64_BENEFITS_TO_SALARIES: "26",
            BASE64_SALARIES_BENEFITS_INCLUDING_OUTSOURCED_EMPLOYEES: "27",
            BASE64_PERSONNEL_TO_CASH_EXPENDITURE: "28",
            BASE64_CASH_EXPENDITURES_PER_GIVING_UNIT: "29"
        };
        
        // Start XML with app token for authentication
        let uploadXml = '<?xml version="1.0" encoding="UTF-8"?><qdbapi><apptoken>bpat4pgu9t69yby5gbemdbej52j</apptoken><record>';
        
        // Add metadata fields
        uploadXml += createFieldXml(FIELD_IDS.CLIENT_NAME, "CFHI Comprehensive Dashboard");
        uploadXml += createFieldXml(FIELD_IDS.UNIQUE_CLIENT_COUNT, clientCount.toString());
        uploadXml += createFieldXml(FIELD_IDS.QUERY_REGIONS, Array.from(window.selectedAreas_Array || []).join(","));
        uploadXml += createFieldXml(FIELD_IDS.CURRENT_MONTH_YE, window.monthYearEnd || new Date().getFullYear());
        uploadXml += createFieldXml(FIELD_IDS.QUERY_GIVING_MIN, sliderValue.toString());
        uploadXml += createFieldXml(FIELD_IDS.QUERY_GIVING_MAX, sliderValue2.toString());
        
        // Add years data (up to 8 years)
        const yearFields = [
            FIELD_IDS.YEAR_1, FIELD_IDS.YEAR_2, FIELD_IDS.YEAR_3, FIELD_IDS.YEAR_4,
            FIELD_IDS.YEAR_5, FIELD_IDS.YEAR_6, FIELD_IDS.YEAR_7, FIELD_IDS.YEAR_8
        ];
        
        selectedYears.forEach((year, index) => {
            if (index < yearFields.length) {
                uploadXml += createFieldXml(yearFields[index], year.toString());
            }
        });
        
        // Chart to field ID mapping
        const chartFieldMapping = {
            "givingUnits_chart": FIELD_IDS.BASE64_GIVING_UNITS,
            "attendeesToStaff_chart": FIELD_IDS.BASE64_ATTENDEES_TO_STAFF,
            "daysExpendableNetAssets_chart": FIELD_IDS.BASE64_DAYS_EXPENDABLE_NET_ASSETS,
            "daysOperatingCash_chart": FIELD_IDS.BASE64_DAYS_OPERATING_CASH,
            "availableDaysOfCashFlow_chart": FIELD_IDS.BASE64_AVAILABLE_DAYS_OF_CASH_FLOW,
            "liquidityRatio_chart": FIELD_IDS.BASE64_LIQUIDITY_RATIO,
            "netCashAvailability_chart": FIELD_IDS.BASE64_NET_CASH_AVAILABILITY,
            "debtToContributionsWithout_chart": FIELD_IDS.BASE64_DEBT_TO_CONTRIBUTIONS_WITHOUT,
            "currentRatio_chart": FIELD_IDS.BASE64_CURRENT_RATIO,
            "mandatoryDebtServiceToContributionsWithout_chart": FIELD_IDS.BASE64_MANDATORY_DEBT_SERVICE_TO_CONTRIBUTIONS_WITHOUT,
            "debtPerGivingUnit_chart": FIELD_IDS.BASE64_DEBT_PER_GIVING_UNIT,
            "debtCoverage_chart": FIELD_IDS.BASE64_DEBT_COVERAGE,
            "netIncomeRatio_chart": FIELD_IDS.BASE64_NET_INCOME_RATIO,
            "contributionsWithoutDonorPerGivingUnit_chart": FIELD_IDS.BASE64_CONTRIBUTIONS_WITHOUT_DONOR_PER_GIVING_UNIT,
            "totalContributionsPerGivingUnit_chart": FIELD_IDS.BASE64_TOTAL_CONTRIBUTIONS_PER_GIVING_UNIT,
            "benefitsToSalaries_chart": FIELD_IDS.BASE64_BENEFITS_TO_SALARIES,
            "salariesBenefitsIncludingOutsourcedEmployees_chart": FIELD_IDS.BASE64_SALARIES_BENEFITS_INCLUDING_OUTSOURCED_EMPLOYEES,
            "personnelToCashExpenditure_chart": FIELD_IDS.BASE64_PERSONNEL_TO_CASH_EXPENDITURE,
            "cashExpendituresPerGivingUnit_chart": FIELD_IDS.BASE64_CASH_EXPENDITURES_PER_GIVING_UNIT
        };
        
        // Add chart images with correct field IDs
        results.forEach((result) => {
            if (result.base64 && result.chartId) {
                const fieldId = chartFieldMapping[result.chartId];
                if (fieldId) {
                    uploadXml += createImageFieldXml(fieldId, result.base64);
                    console.log(`Added chart ${result.chartId} to field ${fieldId}`);
                } else {
                    console.warn(`No field mapping found for chart: ${result.chartId}`);
                }
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
        const response = await fetch("https://capincrouse.quickbase.com/db/bvcr2chqi?a=API_AddRecord", {
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
