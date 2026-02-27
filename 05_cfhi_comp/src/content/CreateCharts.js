// CreateCharts.js

// Centralized benchmark mapping for all fields.
// Returns either an array with two values [low, high],
// a single-value array [threshold], or null when no numeric benchmark applies.
// Titles for lines are handled in the chart renderer as
// "Benchmark - lower end" and "Benchmark - higher end" when two values are present,
// or simply "Benchmark" for a single value.
// Note: Values are defined based on business guidance in todo_Aug11.md and DisplayCharts copy.
window.getBenchmarksForField = function getBenchmarksForField(fieldName) {
  const map = {

    // Cash — CREATE BENCHMARK AT values from UI: 60 (Days Expendable), 90 (Days Operating Cash)
    daysExpendableNetAssets: [60],        // benchmark at 60 (Good > 60 | Warning 30-60 | Action < 30)
    daysOperatingCash: [90],              // benchmark at 90 (Good > 90 | Warning 60-90 | Action < 60)
    availableDaysOfCashFlow: [120, 180],
    liquidityRatio: [5],
    netCashAvailability: null,

    // Debt — CREATE BENCHMARK AT: 2 (Debt to Contrib, Current Ratio), 20 (Mandatory Debt Service), 1.25 (Debt Coverage). NO BENCHMARK: Debt per Giving Unit
    debtToContributionsWithout: [2],
    currentRatio: [2],
    cashFlowsFromOperatingActivities: [0],
    mandatoryDebtServiceToContributionsWithout: [20],  // benchmark at 20 (Good < 20 | Warning 20-30 | Action > 30)
    debtPerGivingUnit: null,                            // NO BENCHMARK - SKIP
    debtCoverage: [1.25],                               // benchmark at 1.25 (Good > 1.25 | Warning 1-1.25 | Action < 1)

    // Income — CREATE BENCHMARK AT: 0 (Net Income Ratio), 4,500 (Total Contributions per Giving Unit)
    netIncomeRatio: [0], // positive is good
    contributionsWithoutDonorPerGivingUnit: null,
    totalContributionsPerGivingUnit: [4500],             // benchmark at 4,500 (Good > 4,500 | Warning 3,000-4,500 | Action < 3,000)

    // Expense — CREATE BENCHMARK AT: 40 (Personnel to Total Cash; range 40-55)
    benefitsToSalaries: null,
    salariesBenefitsIncludingOutsourcedEmployees: null,
    personnelToCashExpenditure: [40, 55],
    mandatoryDebtServiceToCashExpenditure: [15],
    personnelIncludingToTotalCashExpenditures: null,
    totalGlobalAndLocalOutreachExpenses: [10, 25],
    facilitiesExpenseToTotalCashExpenditures_lessThanTen: [20, 30],
    facilitiesExpenseToTotalCashExpenditures_greaterThanTen: [20, 30],

    // Additional
    informationTechnologyCostPerFTE: null,
  };

  return Object.prototype.hasOwnProperty.call(map, fieldName)
    ? map[fieldName]
    : null;
};


/**
 * Determine if higher values are better for a given field
 * @param {string} fieldName - The field name to check
 * @returns {boolean} True if higher values are better, false if lower values are better
 */
function isFieldHigherBetter(fieldName) {
  const higherIsBetter = [
    'givingUnitsToStaff',
    'daysExpendableNetAssets',
    'daysOperatingCash', 
    'cashFlowsFromOperatingActivities',
    'liquidityRatio',
    'currentRatio',
    'debtCoverage',
    'netIncomeRatio',
    'contributionsWithoutDonorPerGivingUnit',
    'totalContributionsPerGivingUnit',
    'totalGlobalAndLocalOutreachExpenses'
  ];

  const lowerIsBetter = [
    'debtToContributionsWithout',
    'mandatoryDebtServiceToContributionsWithout',
    'mandatoryDebtServiceToCashExpenditure'
  ];

  const rangeFields = [
    'personnelToCashExpenditure' // 40-55 range, so 40 is lower end, 55 is higher end
  ];

  if (higherIsBetter.includes(fieldName)) {
    return true;
  } else if (lowerIsBetter.includes(fieldName)) {
    return false;
  } else if (rangeFields.includes(fieldName)) {
    // For range fields, treat as higher is better for labeling purposes
    return true;
  }

  // Default to higher is better if not specified
  return true;
};

/**
 * Get the appropriate benchmark label based on field name and benchmark values
 * @param {string} fieldName - The field name to get benchmark label for
 * @param {Array} benchmarkArray - Array of benchmark values (1 or 2 values)
 * @param {number} index - Index of current benchmark (0 or 1)
 * @returns {string} The appropriate benchmark label
 */
window.getBenchmarkLabel = function getBenchmarkLabel(fieldName, benchmarkArray, index) {
  if (!benchmarkArray || benchmarkArray.length === 0) return "Benchmark";
  if (benchmarkArray.length === 1) return "Benchmark";

  const isHigherBetter = isFieldHigherBetter(fieldName);
  const lowerValue = Math.min(...benchmarkArray);
  const higherValue = Math.max(...benchmarkArray);
  const currentValue = benchmarkArray[index];

  if (isHigherBetter) {
    return currentValue === higherValue ? "Benchmark - higher end" : "Benchmark - lower end";
  }
  return currentValue === lowerValue ? "Benchmark - higher end" : "Benchmark - lower end";
};

/**
 * Position the chart tooltip immediately to the left of the hovered bar.
 * Keeps tooltip close to the bar and prevents it from covering bar data.
 * @param {string} chartId - ID of the chart container element
 * @param {number} dataPointIndex - Index of the hovered category/bar
 */
const positionTooltipLeftOfBar = (chartId, dataPointIndex) => {
  const chartEl = document.getElementById(chartId);
  if (!chartEl) return;
  const tooltipEl = chartEl.querySelector(".apexcharts-tooltip");
  if (!tooltipEl || tooltipEl.style.opacity === "0" || tooltipEl.style.display === "none") {
    return;
  }

  const chartRect = chartEl.getBoundingClientRect();
  const tooltipRect = tooltipEl.getBoundingClientRect();
  const gap = 8;

  // Find the bar element for the hovered data point (column series is first)
  const barAreas = chartEl.querySelectorAll(".apexcharts-bar-series .apexcharts-bar-area");
  let barLeftRelative = 0;
  let barCenterYRelative = chartRect.height / 2;

  if (barAreas.length > 0 && dataPointIndex >= 0 && dataPointIndex < barAreas.length) {
    const barRect = barAreas[dataPointIndex].getBoundingClientRect();
    barLeftRelative = barRect.left - chartRect.left;
    barCenterYRelative = barRect.top - chartRect.top + barRect.height / 2;
  } else {
    // Fallback: approximate bar left from plot area (grid)
    const grid = chartEl.querySelector(".apexcharts-grid");
    if (grid) {
      const gridRect = grid.getBoundingClientRect();
      const plotLeft = gridRect.left - chartRect.left;
      const plotWidth = gridRect.width;
      const categories = chartEl.querySelectorAll(".apexcharts-bar-series .apexcharts-bar-area").length || 1;
      const barWidth = plotWidth / categories;
      barLeftRelative = plotLeft + dataPointIndex * barWidth;
      barCenterYRelative = gridRect.top - chartRect.top + gridRect.height / 2;
    }
  }

  // Place tooltip so its right edge is just left of the bar
  const left = barLeftRelative - tooltipRect.width - gap;
  tooltipEl.style.left = Math.max(0, left) + "px";
  tooltipEl.style.top = Math.max(0, barCenterYRelative - tooltipRect.height / 2) + "px";
  tooltipEl.style.transform = "none";
  tooltipEl.style.position = "absolute";
};

const getMainChartOptions = (
  dataPeer,
  dataClient,
  numType,
  fixedNum = 0,
  mainName,
  benchmark,
  title,
  chartId,
  wa = null,
  allData = null
) => {
  const isDarkMode = document.documentElement.classList.contains("dark");
  const chartColors = isDarkMode
    ? {
        borderColor: "#6B7280",      // Lighter border for dark mode
        labelColor: "#FFFFFF",       // White label color for dark mode
        lineColor: "#E5E7EB",        // Lighter line color for dark mode
        opacityFrom: 0,
        opacityTo: 0.15,
      }
    : {
        borderColor: "#F3F4F6",
        labelColor: "#6B7280",
        lineColor: "#3a464f",
        opacityFrom: 0.45,
        opacityTo: 0,
      };

  const chartColor = isDarkMode
    ? "#E5E7EB"                      // Lighter axis color for dark mode
    : "#3a464f";

  const selectedYearsArray = getSelectedYearsFromLocalStorage() || [];

  // Validate that we have years selected
  if (!selectedYearsArray || selectedYearsArray.length === 0) {
    console.warn("No years selected for chart:", mainName);
    return null; // Return null to prevent chart creation
  }


  const formatNumber = (value) => value.toLocaleString();

  ({ clientArray, peerAvg, peerMid, peer25, peer75 } =
    getPeerAndClientChartDataArrays(
      selectedYearsArray,
      dataPeer,
      dataClient,
      fixedNum,
      mainName,
      benchmark,
      numType,
      wa,
      allData
    ));

  // y-axis values are now handled by ApexCharts; keep these for formatter context
  let yaxisMin;
  let yaxisMax;

  const useApexYAxisDefaults = true;
  if (!useApexYAxisDefaults) {
  // Calculate smart y-axis range based on actual data (always needed)
  // Include peer data for y-axis scaling, but filter outliers to prevent small peer groups from causing issues
  const validClientData = clientArray.filter(v => v !== null && v !== undefined && !isNaN(v));
  const clientMin = validClientData.length > 0 ? Math.min(...validClientData) : 0;
  const clientMax = validClientData.length > 0 ? Math.max(...validClientData) : 0;
  const clientRange = clientMax - clientMin;
  
  // Include peer data that's within a reasonable range to ensure trendlines are visible
  // Use 2x client max as threshold (prevents extreme outliers while ensuring most peer data is visible)
  // This is less aggressive to ensure percentile lines (especially 75th) are included
  const peerMaxThreshold = clientMax > 0 ? Math.max(clientMax * 2, clientMax + (clientRange * 1)) : Infinity;
  // For negative values, filter out extreme negative outliers (when negative is much smaller than positive range)
  // Only filter if we have significant positive values (ratio check to avoid filtering when negatives dominate)
  let peerMinThreshold = -Infinity;
  if (clientMin < 0 && clientMax > 0 && Math.abs(clientMax) > Math.abs(clientMin) * 10) {
    // If max is 10x larger than min, treat negative as outlier - set threshold at reasonable negative range
    // Allow negative range up to 2x the magnitude of the smallest negative, or 10% of max, whichever is larger
    peerMinThreshold = Math.min(
      clientMin * 2, // Allow up to 2x the magnitude
      -Math.abs(clientMax) * 0.1 // Or 10% of max in negative direction
    );
  } else if (clientMin < 0) {
    // For balanced or negative-dominant ranges, use similar threshold as max (2x for consistency)
    peerMinThreshold = clientMin < 0 ? Math.min(clientMin * 2, clientMin - (clientRange * 1)) : -Infinity;
  }
  
  const validPeerData = [...peerAvg, ...peerMid, ...peer25, ...peer75]
    .filter(v => v !== null && v !== undefined && !isNaN(v) && v <= peerMaxThreshold && v >= peerMinThreshold);
  
  // Calculate dataMin and dataMax from client + reasonable peer data
  const allReasonableValues = [...validClientData, ...validPeerData];
  const dataMin = allReasonableValues.length > 0 ? Math.min(...allReasonableValues) : clientMin;
  const dataMax = allReasonableValues.length > 0 ? Math.max(...allReasonableValues) : clientMax;
  const dataRange = dataMax - dataMin;
  
  /**
   * Calculate clean y-axis max and step size following clean chart principles
   * - Max should be dataMax + appropriate padding to minimize whitespace
   * - Step size must be 1, 2, or 5 (or 0.5 for small decimal values)
   * - Ensure even spacing by making max a multiple of step size
   */
  const calculateCleanYAxis = (maxValue, minValue = 0, numType = "num") => {
    // Handle small decimal values (e.g., maxValue = 1.3 should use 0.5 step, max = 2)
    if (maxValue > 0 && maxValue < 2 && numType !== "percent") {
      let cleanMax = Math.ceil(maxValue * 2) / 2; // Round up to nearest 0.5
      if (cleanMax === maxValue) {
        cleanMax += 0.5; // Add 0.5 if at exact max
      }
      // Ensure cleanMax is a multiple of 0.5
      cleanMax = Math.ceil(cleanMax * 2) / 2;
      const stepSize = 0.5;
      const tickAmount = cleanMax / stepSize;
      return { max: cleanMax, stepSize, tickAmount };
    }
    
    if (maxValue <= 20) {
      let cleanMax = Math.ceil(maxValue);
      // Add 1 if at exact max to create headroom
      if (cleanMax === maxValue) {
        cleanMax += 1;
      }
      
      // Determine step size (must be 1, 2, 3, or 5) and ensure cleanMax is evenly divisible
      let stepSize;
      if (cleanMax <= 10) {
        stepSize = 1; // For max 1-10, use step of 1
        cleanMax = Math.ceil(cleanMax / stepSize) * stepSize;
      } else if (cleanMax <= 12) {
        stepSize = 3; // For max 11-12, use step of 3 -> cleanMax becomes 12 (0, 3, 6, 9, 12)
        cleanMax = 12;
      } else if (cleanMax <= 15) {
        stepSize = 3; // For max 13-15, use step of 3 -> cleanMax becomes 15 (0, 3, 6, 9, 12, 15)
        cleanMax = 15;
      } else if (cleanMax <= 16) {
        stepSize = 4; // For max 16, use step of 4 -> cleanMax becomes 16 (0, 4, 8, 12, 16)
        cleanMax = 16;
      } else if (cleanMax <= 18) {
        stepSize = 3; // For max 17-18, use step of 3 -> cleanMax becomes 18 (0, 3, 6, 9, 12, 15, 18)
        cleanMax = 18;
      } else {
        stepSize = 5; // For max 19-20, use step of 5 -> cleanMax becomes 20 (0, 5, 10, 15, 20)
        cleanMax = 20;
      }
      
      // Calculate tickAmount (number of intervals) - must result in integer
      const tickAmount = cleanMax / stepSize;
      
      return { max: cleanMax, stepSize, tickAmount };
    }
    return null;
  };
  
  // Calculate y-axis minimum and maximum, handling negative values
  let yaxisMin, yaxisMax, yaxisStepSize, yaxisTickAmount;
  
  if (dataMin < 0) {
    // If we have negative values, cap based on actual data range with clean intervals
    if (numType === "percent") {
      // For percentages with negative values, use scale-aware intervals
      const totalRange = Math.abs(dataMax) + Math.abs(dataMin);
      let stepSize;
      
      // Determine appropriate step size based on total range
      if (totalRange >= 100) {
        stepSize = 20; // 20% intervals for very large ranges
      } else if (totalRange >= 60) {
        stepSize = 10; // 10% intervals for 60-100% range
      } else if (totalRange >= 10) {
        // SIMPLIFIED: For ALL ranges 10-100%, use clean 5% intervals
        stepSize = 5; // 5% intervals for professional appearance
      } else {
        stepSize = 1; // 1% intervals for very small ranges
      }
      
      // Round max and min to multiples of step size
      let cleanMax = Math.ceil(dataMax / stepSize) * stepSize;
      let cleanMin = Math.floor(dataMin / stepSize) * stepSize;
      
      // Ensure we have headroom
      if (cleanMax === dataMax) {
        cleanMax += stepSize;
      }
      if (cleanMin === dataMin) {
        cleanMin -= stepSize;
      }
      
      yaxisMin = cleanMin;
      yaxisMax = cleanMax;
      yaxisStepSize = stepSize;
      yaxisTickAmount = (cleanMax - cleanMin) / stepSize;
    } else {
      // For non-percent types with negative values, use smart approach based on value distribution
      const negativeMagnitude = Math.abs(dataMin);
      const positiveMagnitude = dataMax;
      
      // Check if negative is a small outlier compared to positive (e.g., -15k among millions)
      // Use ratio to determine if we should use symmetric or asymmetric axis
      const isNegativeOutlier = positiveMagnitude > 0 && negativeMagnitude > 0 && 
                                 (positiveMagnitude / negativeMagnitude > 10 || 
                                  negativeMagnitude < positiveMagnitude * 0.05);
      
      if (isNegativeOutlier) {
        // For small negative outliers, use asymmetric axis
        // Special handling for very small negative values (< 5) with larger positive range
        let roundedNegMin;
        
        if (negativeMagnitude < 1 && positiveMagnitude >= 10) {
          // For tiny negative outliers (like -0.1) with large positive range (like 20)
          // Just round to -1 or -2 for clean professional look
          if (negativeMagnitude <= 0.5) {
            roundedNegMin = -1; // -0.1 to -0.5 rounds to -1
          } else {
            roundedNegMin = -2; // -0.6 to -1.0 rounds to -2
          }
        } else if (negativeMagnitude < 5 && positiveMagnitude >= 10) {
          // For small negative values (1-5) with larger positive range
          // Round to clean values: -1, -2, -5
          if (negativeMagnitude <= 1) {
            roundedNegMin = -1;
          } else if (negativeMagnitude <= 2) {
            roundedNegMin = -2;
          } else {
            roundedNegMin = -5;
          }
        } else if (negativeMagnitude <= 100) {
          roundedNegMin = Math.floor(dataMin / 5) * 5; // Round to nearest 5
        } else if (negativeMagnitude <= 1000) {
          roundedNegMin = Math.floor(dataMin / 10) * 10; // Round to nearest 10
        } else if (negativeMagnitude <= 10000) {
          roundedNegMin = Math.floor(dataMin / 1000) * 1000; // Round to nearest 1K
        } else if (negativeMagnitude <= 50000) {
          roundedNegMin = Math.floor(dataMin / 5000) * 5000; // Round to nearest 5K
        } else if (negativeMagnitude <= 100000) {
          roundedNegMin = Math.floor(dataMin / 10000) * 10000; // Round to nearest 10K
        } else if (negativeMagnitude <= 500000) {
          roundedNegMin = Math.floor(dataMin / 50000) * 50000; // Round to nearest 50K
        } else {
          roundedNegMin = Math.floor(dataMin / 100000) * 100000; // Round to nearest 100K
        }
        
        // Only add padding for larger negative values (not tiny outliers)
        if (negativeMagnitude >= 5 && negativeMagnitude <= 10000) {
          roundedNegMin -= Math.max(5000, negativeMagnitude * 0.5); // Add 5K or 50% padding
          // Round the negative min to a clean value
          roundedNegMin = Math.floor(roundedNegMin / 5000) * 5000; // Round to 5K intervals
        } else if (negativeMagnitude > 10000) {
          roundedNegMin -= Math.max(10000, negativeMagnitude * 0.3); // Add 10K or 30% padding
          // Round to clean intervals
          if (negativeMagnitude <= 50000) {
            roundedNegMin = Math.floor(roundedNegMin / 10000) * 10000; // Round to 10K intervals
          } else {
            roundedNegMin = Math.floor(roundedNegMin / 50000) * 50000; // Round to 50K intervals
          }
        }
        
        yaxisMin = roundedNegMin;
        
        // Calculate positive max using existing logic (will be set below in the else block)
        // We'll continue to the else block to set yaxisMax
      } else {
        // For balanced negative/positive ranges, use symmetric axis
        const absMax = Math.max(negativeMagnitude, positiveMagnitude);
        const maxMagnitude = absMax;
        
        // Calculate padding based on magnitude
        let paddingForNegative;
        if (maxMagnitude <= 10) {
          paddingForNegative = 1;
        } else if (maxMagnitude <= 100) {
          paddingForNegative = Math.ceil(maxMagnitude * 0.1);
        } else {
          paddingForNegative = Math.ceil(maxMagnitude * 0.1);
        }
        
        const paddedMagnitude = maxMagnitude + paddingForNegative;
        
        // Round the magnitude to nice values
        let roundedMagnitude;
        if (paddedMagnitude >= 100000000) {
          roundedMagnitude = Math.ceil(paddedMagnitude / 10000000) * 10000000;
        } else if (paddedMagnitude >= 50000000) {
          roundedMagnitude = Math.ceil(paddedMagnitude / 10000000) * 10000000;
        } else if (paddedMagnitude >= 10000000) {
          roundedMagnitude = Math.ceil(paddedMagnitude / 5000000) * 5000000;
        } else if (paddedMagnitude >= 1000000) {
          // For millions, use 5M intervals for clean spacing (0, 5M, 10M, 15M)
          roundedMagnitude = Math.ceil(paddedMagnitude / 5000000) * 5000000;
        } else if (paddedMagnitude >= 500000) {
          roundedMagnitude = Math.ceil(paddedMagnitude / 100000) * 100000;
        } else if (paddedMagnitude >= 200000) {
          roundedMagnitude = Math.ceil(paddedMagnitude / 50000) * 50000;
        } else if (paddedMagnitude >= 100000) {
          roundedMagnitude = Math.ceil(paddedMagnitude / 20000) * 20000;
        } else if (paddedMagnitude >= 50000) {
          roundedMagnitude = Math.ceil(paddedMagnitude / 10000) * 10000;
        } else if (paddedMagnitude >= 20000) {
          roundedMagnitude = Math.ceil(paddedMagnitude / 5000) * 5000;
        } else if (paddedMagnitude >= 10000) {
          roundedMagnitude = Math.ceil(paddedMagnitude / 5000) * 5000; // Use 5K intervals
        } else if (paddedMagnitude >= 1000) {
          roundedMagnitude = Math.ceil(paddedMagnitude / 1000) * 1000;
        } else if (paddedMagnitude >= 100) {
          roundedMagnitude = Math.ceil(paddedMagnitude / 100) * 100;
        } else if (paddedMagnitude >= 50) {
          roundedMagnitude = paddedMagnitude <= 55 ? 50 : Math.ceil(paddedMagnitude / 10) * 10;
        } else if (paddedMagnitude >= 40) {
          roundedMagnitude = Math.ceil(paddedMagnitude / 10) * 10;
        } else {
          roundedMagnitude = Math.ceil(paddedMagnitude / 5) * 5; // Use 5-unit intervals for small values
        }
        
        // Set symmetric min and max
        yaxisMin = -roundedMagnitude;
        yaxisMax = roundedMagnitude;
      }
      
      // If we used asymmetric approach for outlier, calculate positive max separately
      if (isNegativeOutlier) {
        // yaxisMin is already set above, now calculate yaxisMax using positive data only
        // Use similar logic as positive handling, but treat as if all values are positive
        const positiveDataMax = dataMax; // Already positive
        const positiveDataRange = positiveDataMax - (Math.max(0, dataMin)); // Range from 0 or small negative to max
        
        // Calculate padding for positive side
        let positivePadding;
        if (positiveDataRange <= 0.1) {
          positivePadding = 0.02;
        } else if (positiveDataRange <= 0.5) {
          positivePadding = 0.1;
        } else if (positiveDataRange <= 2) {
          positivePadding = 0.2;
        } else if (positiveDataRange <= 10) {
          positivePadding = 1;
        } else if (positiveDataMax >= 1000000 && positiveDataMax < 3000000) {
          positivePadding = Math.ceil(positiveDataRange * 0.05);
        } else {
          positivePadding = Math.ceil(positiveDataRange * 0.1);
        }
        
        if (positiveDataMax < 1 && positivePadding < 0.05) {
          positivePadding = 0.05;
        }
        
        const positiveRawMax = positiveDataMax + positivePadding;
        
        // Apply same rounding logic as positive-only case
        if (positiveRawMax >= 100000000) {
          yaxisMax = Math.ceil(positiveRawMax / 10000000) * 10000000;
          yaxisStepSize = 10000000;
          yaxisTickAmount = yaxisMax / 10000000;
        } else if (positiveRawMax >= 50000000) {
          yaxisMax = Math.ceil(positiveRawMax / 10000000) * 10000000;
          yaxisStepSize = 10000000;
          yaxisTickAmount = yaxisMax / 10000000;
        } else if (positiveRawMax >= 10000000) {
          yaxisMax = Math.ceil(positiveRawMax / 5000000) * 5000000;
          yaxisStepSize = 5000000;
          yaxisTickAmount = yaxisMax / 5000000;
        } else if (positiveDataMax >= 3000000) {
          yaxisMax = Math.ceil(positiveRawMax / 5000000) * 5000000;
          yaxisStepSize = 5000000;
          yaxisTickAmount = yaxisMax / 5000000;
        } else if (positiveRawMax >= 1000000) {
          yaxisMax = Math.ceil(positiveRawMax / 1000000) * 1000000;
          if (yaxisMax > 3000000) {
            yaxisMax = 3000000;
          }
          if (yaxisMax === 1000000) {
            yaxisStepSize = 250000;
            yaxisTickAmount = 4;
          } else {
            yaxisStepSize = 1000000;
            yaxisTickAmount = yaxisMax / 1000000;
          }
        } else if (positiveRawMax >= 500000) {
          yaxisMax = Math.ceil(positiveRawMax / 100000) * 100000;
        } else if (positiveRawMax >= 200000) {
          yaxisMax = Math.ceil(positiveRawMax / 50000) * 50000;
        } else if (positiveRawMax >= 100000) {
          yaxisMax = Math.ceil(positiveRawMax / 20000) * 20000;
        } else if (positiveRawMax >= 50000) {
          yaxisMax = Math.ceil(positiveRawMax / 10000) * 10000;
        } else if (positiveRawMax >= 20000) {
          yaxisMax = Math.ceil(positiveRawMax / 5000) * 5000;
        } else if (positiveRawMax >= 10000) {
          yaxisMax = Math.ceil(positiveRawMax / 2000) * 2000;
        } else if (positiveRawMax >= 1000) {
          yaxisMax = Math.ceil(positiveRawMax / 1000) * 1000;
        } else {
          // For smaller values, use appropriate rounding
          if (positiveDataMax <= 20 && numType !== "percent") {
            const cleanAxis = calculateCleanYAxis(positiveDataMax, 0, numType);
            if (cleanAxis) {
              yaxisMax = cleanAxis.max;
              yaxisStepSize = cleanAxis.stepSize;
              yaxisTickAmount = cleanAxis.tickAmount;
            } else {
              yaxisMax = Math.ceil(positiveDataMax);
              if (yaxisMax === positiveDataMax) {
                yaxisMax += 1;
              }
            }
          } else {
            yaxisMax = Math.ceil(positiveRawMax);
          }
        }
      }
    }
  } else {
    // All values are positive - use existing logic
    yaxisMin = 0;
  
  // Calculate appropriate padding based on data range
  let padding;
  if (dataRange <= 0.1) {
    padding = 0.02; // Small padding for very small ranges
  } else if (dataRange <= 0.5) {
    padding = 0.1; // Medium padding for small ranges
  } else if (dataRange <= 2) {
    padding = 0.2; // Medium padding for medium ranges
  } else if (dataRange <= 10) {
    padding = 1; // Larger padding for larger ranges
  } else if (dataMax >= 1000000 && dataMax < 3000000) {
    // For million values in 1M-3M range, use smaller padding to prevent jumping to 5M
    // Use 5% padding instead of 10% to keep rawMax closer to dataMax
    padding = Math.ceil(dataRange * 0.05);
  } else {
    padding = Math.ceil(dataRange * 0.1); // 10% padding for large ranges
  }
  
  // Ensure minimum padding for very small values
  if (dataMax < 1 && padding < 0.05) {
    padding = 0.05;
  }
  
  // Smart y-axis maximum calculation
    // For percent type with values >= 10, use clean intervals with explicit step size
  if (numType === "percent" && dataMax >= 10) {
    // Percent type should use clean intervals for professional appearance
    const rawMax = dataMax + padding;
    if (rawMax >= 100) {
      yaxisMax = Math.ceil(rawMax / 10) * 10;
      yaxisStepSize = 10; // 10% intervals (0%, 10%, 20%, ...)
      yaxisTickAmount = yaxisMax / 10;
    } else if (rawMax >= 50) {
      yaxisMax = Math.ceil(rawMax / 10) * 10;
      yaxisStepSize = 10; // 10% intervals (0%, 10%, 20%, ...)
      yaxisTickAmount = yaxisMax / 10;
    } else if (rawMax >= 30) {
      yaxisMax = Math.ceil(rawMax / 5) * 5;
      yaxisStepSize = 5; // 5% intervals (0%, 5%, 10%, 15%, 20%, ...)
      yaxisTickAmount = yaxisMax / 5;
    } else if (rawMax >= 10) {
      // SIMPLIFIED: For ALL 10-100% ranges, use clean 5% intervals (0%, 5%, 10%, 15%, 20%)
      yaxisMax = Math.ceil(rawMax / 5) * 5;
      yaxisStepSize = 5; // Clean 5% intervals
      yaxisTickAmount = yaxisMax / 5;
    } else {
      // For very small percentages < 10%, use 1-2% intervals
      yaxisMax = Math.ceil(rawMax);
      yaxisStepSize = rawMax <= 5 ? 1 : 2;
      yaxisTickAmount = yaxisMax / yaxisStepSize;
    }
  } else if (dataMax <= 20 && numType !== "percent") {
    // Use clean chart principles for values <= 20 (non-percent types)
    const cleanAxis = calculateCleanYAxis(dataMax, 0, numType);
    if (cleanAxis) {
      yaxisMax = cleanAxis.max;
      yaxisStepSize = cleanAxis.stepSize;
      yaxisTickAmount = cleanAxis.tickAmount;
    } else {
      // Fallback: ensure max is evenly divisible by step size
      yaxisMax = Math.ceil(dataMax);
      if (yaxisMax === dataMax) {
        yaxisMax += 1;
      }
      // Determine step size and round max to be evenly divisible
      if (yaxisMax <= 10) {
        yaxisStepSize = 1;
      } else if (yaxisMax <= 12) {
        yaxisStepSize = 3;
        yaxisMax = 12;
      } else if (yaxisMax <= 15) {
        yaxisStepSize = 3;
        yaxisMax = 15;
      } else if (yaxisMax <= 16) {
        yaxisStepSize = 4;
        yaxisMax = 16;
      } else if (yaxisMax <= 18) {
        yaxisStepSize = 3;
        yaxisMax = 18;
      } else {
        yaxisStepSize = 5;
        yaxisMax = 20;
      }
      yaxisTickAmount = yaxisMax / yaxisStepSize;
    }
  } else if (dataMax <= 10) {
    // Apply special scaling logic only for small values (≤10) - for num and dollar types
    if (numType === "dollar" && dataMax >= 1) {
      // For dollar type with values 1-10, round to nearest whole number for clean $1, $2, $3, etc.
      yaxisMax = Math.ceil(dataMax);
      // Add small headroom if at exact max
      if (yaxisMax === dataMax) {
        yaxisMax += 1;
      }
    } else if (dataMax >= 5) {
      // For values 5-10, round up to nearest 5
      yaxisMax = Math.ceil(dataMax / 5) * 5;
    } else if (dataMax >= 2.5) {
      // For values 2.5-5, round up to nearest 1
      yaxisMax = Math.ceil(dataMax);
    } else if (dataMax > 2) {
      // For values just above 2, set to 2.5
      yaxisMax = 2.5;
    } else if (dataMax === 2) {
      // For exactly 2, keep at 2
      yaxisMax = 2;
    } else if (dataMax >= 1.5) {
      // For values 1.5-2, round up to nearest 0.5
      yaxisMax = Math.ceil(dataMax * 2) / 2;
    } else if (dataMax >= 1) {
      // For values 1-1.5, round up to nearest 0.5
      yaxisMax = Math.ceil(dataMax * 2) / 2;
    } else if (dataMax >= 0.5) {
      // For values 0.5-1, round up to nearest 0.2
      yaxisMax = Math.ceil(dataMax * 5) / 5;
    } else if (dataMax >= 0.1) {
      // For values 0.1-0.5, round up to nearest 0.1
      yaxisMax = Math.ceil(dataMax * 10) / 10;
    } else {
      // For very small values, round up to nearest 0.05
      yaxisMax = Math.ceil(dataMax * 20) / 20;
    }
    
    // Only add headroom if we're at exactly the data max (no rounding occurred) - skip for dollar type already handled
    if (yaxisMax === dataMax && dataMax !== 2 && !(numType === "dollar" && dataMax >= 1)) {
      if (dataMax >= 5) {
        yaxisMax += 5;
      } else if (dataMax >= 2) {
        yaxisMax += 0.5; // Smaller increment for values around 2
      } else if (dataMax >= 1) {
        yaxisMax += 0.5;
      } else if (dataMax >= 0.5) {
        yaxisMax += 0.2;
      } else if (dataMax >= 0.1) {
        yaxisMax += 0.1;
      } else {
        yaxisMax += 0.05;
      }
    }
  } else {
    // For larger values (>10), use smart rounding based on scale
    // Ensure the max divides evenly by ideal tick intervals
    const rawMax = dataMax + padding;
    
    // Check dataMax first for values under 20 to prevent rounding up too much
    // This ensures maxVal 15 doesn't get yaxisMax 20 even if rawMax is higher
    if (dataMax < 20) {
      // For dataMax under 20, use dataMax directly with explicit step size for even spacing
      if (dataMax <= 12) {
        yaxisMax = 12; // maxVal 12: use 12 for ticks 0, 3, 6, 9, 12
        yaxisStepSize = 3;
        yaxisTickAmount = 4; // 12 / 3 = 4 intervals
      } else if (dataMax <= 15) {
        yaxisMax = 15; // maxVal 15: use 15 for ticks 0, 3, 6, 9, 12, 15
        yaxisStepSize = 3;
        yaxisTickAmount = 5; // 15 / 3 = 5 intervals
      } else if (dataMax <= 16) {
        yaxisMax = 16; // maxVal 16: use 16 for ticks 0, 4, 8, 12, 16
        yaxisStepSize = 4;
        yaxisTickAmount = 4; // 16 / 4 = 4 intervals
      } else if (dataMax <= 17) {
        yaxisMax = 18; // maxVal 17: use 18 for ticks 0, 3, 6, 9, 12, 15, 18
        yaxisStepSize = 3;
        yaxisTickAmount = 6; // 18 / 3 = 6 intervals
      } else if (dataMax <= 18) {
        yaxisMax = 18; // maxVal 18: use 18 for ticks 0, 3, 6, 9, 12, 15, 18
        yaxisStepSize = 3;
        yaxisTickAmount = 6; // 18 / 3 = 6 intervals
      } else {
        yaxisMax = 20; // maxVal 19: use 20 for ticks 0, 5, 10, 15, 20
        yaxisStepSize = 5;
        yaxisTickAmount = 4; // 20 / 5 = 4 intervals
      }
    } else if (rawMax >= 100000000) {
      // For values >= 100M, round up to nearest 10M
      yaxisMax = Math.ceil(rawMax / 10000000) * 10000000;
      yaxisStepSize = 10000000; // 10M step size
      yaxisTickAmount = yaxisMax / 10000000; // Number of 10M intervals
    } else if (rawMax >= 50000000) {
      // For values >= 50M, round up to nearest 10M for clean 10M intervals
      yaxisMax = Math.ceil(rawMax / 10000000) * 10000000;
      yaxisStepSize = 10000000; // 10M step size
      yaxisTickAmount = yaxisMax / 10000000; // Number of 10M intervals
    } else if (rawMax >= 10000000) {
      // For values >= 10M, round up to nearest 5M
      yaxisMax = Math.ceil(rawMax / 5000000) * 5000000;
      yaxisStepSize = 5000000; // 5M step size
      yaxisTickAmount = yaxisMax / 5000000; // Number of 5M intervals
    } else if (rawMax >= 1000000) {
      // SIMPLIFIED: For ALL values 1M-10M, use clean 1M intervals (0, 1M, 2M, 3M, ...)
      yaxisMax = Math.ceil(rawMax / 1000000) * 1000000;
      yaxisStepSize = 1000000; // Simple 1M intervals
      yaxisTickAmount = yaxisMax / 1000000;
    } else if (rawMax >= 500000) {
      // For values 500K-1M, round up to nearest 100K with explicit step size
      yaxisMax = Math.ceil(rawMax / 100000) * 100000;
      yaxisStepSize = 100000; // 100K intervals
      yaxisTickAmount = yaxisMax / 100000;
    } else if (rawMax >= 200000) {
      // For values 200K-500K, round up to nearest 50K for professional spacing
      yaxisMax = Math.ceil(rawMax / 50000) * 50000;
      yaxisStepSize = 50000; // 50K intervals
      yaxisTickAmount = yaxisMax / 50000;
    } else if (rawMax >= 100000) {
      // For values 100K-200K, use 20K intervals for professional spacing
      yaxisMax = Math.ceil(rawMax / 20000) * 20000;
      yaxisStepSize = 20000; // 20K intervals
      yaxisTickAmount = yaxisMax / 20000;
    } else if (rawMax >= 50000) {
      // For values 50K-100K, use 10K intervals
      yaxisMax = Math.ceil(rawMax / 10000) * 10000;
      yaxisStepSize = 10000; // 10K intervals
      yaxisTickAmount = yaxisMax / 10000;
    } else if (rawMax >= 20000) {
      // For values 20K-50K, use 5K intervals
      yaxisMax = Math.ceil(rawMax / 5000) * 5000;
      yaxisStepSize = 5000; // 5K intervals
      yaxisTickAmount = yaxisMax / 5000;
    } else if (rawMax >= 10000) {
      // For values 10K-20K, use 2K intervals
      yaxisMax = Math.ceil(rawMax / 2000) * 2000;
      yaxisStepSize = 2000; // 2K intervals
      yaxisTickAmount = yaxisMax / 2000;
    } else if (rawMax >= 1000) {
      // SIMPLIFIED: For ALL values 1K-10K, use 1K intervals (0, 1K, 2K, 3K, ...)
      yaxisMax = Math.ceil(rawMax / 1000) * 1000;
      yaxisStepSize = 1000; // Simple 1K intervals
      yaxisTickAmount = yaxisMax / 1000;
    } else if (rawMax >= 500) {
      // For values 500-1000, use 100 intervals
      yaxisMax = Math.ceil(rawMax / 100) * 100;
      yaxisStepSize = 100; // 100 intervals (0, 100, 200, 300, ...)
      yaxisTickAmount = yaxisMax / 100;
    } else if (rawMax >= 200) {
      // For values 200-500, use 50 intervals for professional spacing
      yaxisMax = Math.ceil(rawMax / 50) * 50;
      yaxisStepSize = 50; // 50 intervals (0, 50, 100, 150, 200, ...)
      yaxisTickAmount = yaxisMax / 50;
    } else if (rawMax >= 100) {
      // For values 100-200, use 20 intervals for professional spacing
      yaxisMax = Math.ceil(rawMax / 20) * 20;
      yaxisStepSize = 20; // 20 intervals (0, 20, 40, 60, 80, 100, ...)
      yaxisTickAmount = yaxisMax / 20;
    } else if (rawMax >= 50) {
      // For values 50-100, use 10 intervals
      yaxisMax = Math.ceil(rawMax / 10) * 10;
      yaxisStepSize = 10; // 10 intervals (0, 10, 20, 30, ...)
      yaxisTickAmount = yaxisMax / 10;
    } else if (rawMax >= 40) {
      // For values 40-50, use 5 intervals
      yaxisMax = Math.ceil(rawMax / 5) * 5;
      yaxisStepSize = 5; // 5 intervals (0, 5, 10, 15, 20, ...)
      yaxisTickAmount = yaxisMax / 5;
    } else if (rawMax >= 20) {
      // For values 20-40, use 5 intervals
      yaxisMax = Math.ceil(rawMax / 5) * 5;
      yaxisStepSize = 5; // 5 intervals (0, 5, 10, 15, 20, 25, ...)
      yaxisTickAmount = yaxisMax / 5;
    } else {
      // For values < 20, handled by earlier logic
      yaxisMax = Math.ceil(rawMax);
      if (yaxisMax === rawMax) {
        yaxisMax += 1;
      }
    }
  }
  
  // SPECIAL HANDLING: For asymmetric axis with negative min and positive max
  // Recalculate tickAmount to account for the full range including negative portion
  if (yaxisMin !== undefined && yaxisMin < 0 && yaxisMax > 0 && yaxisStepSize && dataMin < 0) {
    // For ranges with negative values, we need to ensure even spacing
    const fullRange = yaxisMax - yaxisMin;
    const negativeMagnitude = Math.abs(yaxisMin);
    
    // For small negative outliers (< step size) with clean positive ranges
    // Adjust min to fit the step pattern for even spacing
    if (negativeMagnitude < yaxisStepSize && yaxisMax <= 20 && yaxisStepSize >= 3) {
      // For tiny outliers like -0.1 with range 0-20 and step 5:
      // Best approach is to adjust min to fit the pattern (e.g., -5, 0, 5, 10, 15, 20)
      // This gives perfectly even spacing at the cost of a little vertical space
      yaxisMin = -yaxisStepSize;
      const newRange = yaxisMax - yaxisMin;
      yaxisTickAmount = newRange / yaxisStepSize;
    } else if (negativeMagnitude < yaxisStepSize && yaxisMax > 20) {
      // For larger positive ranges with tiny negative outliers
      // Adjust min to fit pattern based on step size
      if (yaxisStepSize >= 1000) {
        yaxisMin = -yaxisStepSize; // Round to nearest step
      } else if (yaxisStepSize >= 100) {
        yaxisMin = -yaxisStepSize;
      } else if (yaxisStepSize >= 10) {
        yaxisMin = -yaxisStepSize;
      } else {
        yaxisMin = -yaxisStepSize;
      }
      const newRange = yaxisMax - yaxisMin;
      yaxisTickAmount = newRange / yaxisStepSize;
    } else if (negativeMagnitude < yaxisStepSize * 2) {
      // For small negative ranges (1-2 steps), adjust to fit pattern
      yaxisMin = Math.floor(yaxisMin / yaxisStepSize) * yaxisStepSize;
      const newRange = yaxisMax - yaxisMin;
      yaxisTickAmount = newRange / yaxisStepSize;
    } else {
      // For larger negative ranges, calculate based on full range
      yaxisTickAmount = Math.ceil(fullRange / yaxisStepSize);
    }
  }
  
  // CRITICAL: Ensure y-axis min/max properly account for ALL ACTUAL rendered values
  // This prevents data points from being cut off at the top or bottom of the chart
  // Check ALL actual series data that will be rendered (including all peer lines, even if filtered earlier)
  const allRenderedSeriesData = [
    ...clientArray,
    ...peerAvg,
    ...peerMid,
    ...peer25,
    ...peer75
  ].filter(v => v !== null && v !== undefined && !isNaN(v));
  
  // Find the actual min and max values from all series that will be rendered
  // IMPORTANT: Use the actual rendered arrays, not the filtered data used for initial calculation
  // This ensures we catch ALL values that will be displayed, even if they were filtered out earlier
  const actualMinRenderedValue = allRenderedSeriesData.length > 0 ? Math.min(...allRenderedSeriesData) : dataMin;
  const actualMaxRenderedValue = allRenderedSeriesData.length > 0 ? Math.max(...allRenderedSeriesData) : dataMax;
  
  // CRITICAL FIX: If actualMaxRenderedValue is higher than dataMax (due to filtering),
  // and it's in the 11-14 range, we MUST use 15 for yaxisMax regardless of initial calculation
  // This fixes the issue where liquidityRatio with max value 14 was getting yaxisMax = 10
  if (actualMaxRenderedValue > dataMax && actualMaxRenderedValue > 10 && actualMaxRenderedValue < 15 && numType !== "percent") {
    // Override any previous yaxisMax calculation - this takes priority
    yaxisMax = 15;
    yaxisStepSize = 2;
    yaxisTickAmount = 8;
  }
  
  // Ensure y-axis min is never higher than the lowest rendered data point (for negative values)
  if (actualMinRenderedValue < 0 && (yaxisMin === undefined || yaxisMin > actualMinRenderedValue)) {
    let newMin = actualMinRenderedValue;
    // Add small padding to negative side based on scale
    if (Math.abs(actualMinRenderedValue) >= 1000000) {
      newMin = actualMinRenderedValue - Math.max(50000, Math.ceil(Math.abs(actualMinRenderedValue) * 0.01));
    } else if (Math.abs(actualMinRenderedValue) >= 1000) {
      newMin = actualMinRenderedValue - Math.max(10, Math.ceil(Math.abs(actualMinRenderedValue) * 0.01));
    } else if (Math.abs(actualMinRenderedValue) >= 10) {
      newMin = actualMinRenderedValue - Math.max(1, Math.ceil(Math.abs(actualMinRenderedValue) * 0.02));
    } else {
      newMin = actualMinRenderedValue - Math.max(0.1, Math.abs(actualMinRenderedValue) * 0.02);
    }
    
    // SIMPLE APPROACH: For number charts with negative values
    // Calculate clean min/max with minimal whitespace and even spacing
    if (numType !== "percent") {
      // Determine appropriate rounding based on scale of actual max value
      let roundingFactor;
      if (actualMaxRenderedValue <= 10) {
        roundingFactor = 1; // Round to nearest 1
      } else if (actualMaxRenderedValue <= 20) {
        roundingFactor = 2; // Round to nearest 2 for values like 14 → 16
      } else if (actualMaxRenderedValue <= 100) {
        roundingFactor = 10; // Round to nearest 10
      } else if (actualMaxRenderedValue <= 1000) {
        roundingFactor = 100; // Round to nearest 100
      } else if (actualMaxRenderedValue <= 10000) {
        roundingFactor = 1000; // Round to nearest 1K
      } else if (actualMaxRenderedValue <= 100000) {
        roundingFactor = 10000; // Round to nearest 10K
      } else if (actualMaxRenderedValue <= 1000000) {
        roundingFactor = 100000; // Round to nearest 100K
      } else if (actualMaxRenderedValue <= 10000000) {
        roundingFactor = 500000; // Round to nearest 500K for millions (less critical)
      } else {
        roundingFactor = 5000000; // Round to nearest 5M
      }
      
      // Round min/max to clean values
      yaxisMin = Math.floor(actualMinRenderedValue / roundingFactor) * roundingFactor;
      yaxisMax = Math.ceil(actualMaxRenderedValue / roundingFactor) * roundingFactor;
      
      // Don't set yaxisStepSize or yaxisTickAmount - let ApexCharts calculate even spacing
      // ApexCharts will automatically create evenly-spaced ticks between min and max
    }
  }
  
  // CRITICAL: Ensure y-axis max is NEVER lower than the highest rendered data point
  // This is the final safety check that MUST run to prevent any data from being cut off
  // This check runs AFTER all initial calculations to ensure ALL rendered values are visible
  if (yaxisMax < actualMaxRenderedValue) {
    // PRIORITY: Special handling for values 11-15 must always use 15 with 5-unit intervals
    // This must be checked FIRST before any other calculations
    if (actualMaxRenderedValue > 10 && actualMaxRenderedValue <= 15 && numType !== "percent") {
      yaxisMax = 15;
      yaxisStepSize = 5; // Clean 5-unit intervals
      // Recalculate tickAmount based on actual min (which may be negative)
      const currentMin = yaxisMin !== undefined ? yaxisMin : 0;
      yaxisTickAmount = (yaxisMax - currentMin) / yaxisStepSize;
    } else {
      // Calculate new max with padding
      let newMax = actualMaxRenderedValue;
      if (actualMaxRenderedValue > 0) {
        // Add padding based on scale
        if (actualMaxRenderedValue >= 1000000) {
          newMax = actualMaxRenderedValue + Math.max(50000, Math.ceil(actualMaxRenderedValue * 0.01));
        } else if (actualMaxRenderedValue >= 1000) {
          newMax = actualMaxRenderedValue + Math.max(10, Math.ceil(actualMaxRenderedValue * 0.01));
        } else if (actualMaxRenderedValue >= 10) {
          newMax = actualMaxRenderedValue + Math.max(1, Math.ceil(actualMaxRenderedValue * 0.02));
        } else {
          newMax = actualMaxRenderedValue + Math.max(0.1, actualMaxRenderedValue * 0.02);
        }
      }
      
      // For small values (<= 20), re-apply clean chart principles to ensure proper rounding
      if (newMax <= 20 && numType !== "percent") {
        const cleanAxis = calculateCleanYAxis(newMax, yaxisMin || 0, numType);
        if (cleanAxis) {
          yaxisMax = cleanAxis.max;
          yaxisStepSize = cleanAxis.stepSize;
          yaxisTickAmount = cleanAxis.tickAmount;
        } else {
          // Fallback: round up to next clean value
          if (newMax <= 10) {
            yaxisMax = Math.ceil(newMax);
            if (yaxisMax === newMax) yaxisMax += 1;
          } else if (newMax <= 15) {
            yaxisMax = Math.ceil(newMax / 2) * 2; // Round to nearest 2
            if (yaxisMax < newMax) yaxisMax += 2;
          } else {
            yaxisMax = Math.ceil(newMax / 5) * 5; // Round to nearest 5
            if (yaxisMax < newMax) yaxisMax += 5;
          }
        }
      } else {
        yaxisMax = newMax;
      }
    }
  }
  
  // FINAL ABSOLUTE CHECK: Ensure yaxisMax is at least actualMaxRenderedValue + minimum padding
  // This is a failsafe to catch any edge cases where the above logic might have failed
  if (yaxisMax < actualMaxRenderedValue) {
    // Special handling for values 11-14: always use 15
    if (actualMaxRenderedValue > 10 && actualMaxRenderedValue < 15 && numType !== "percent") {
      yaxisMax = 15;
      yaxisStepSize = 2;
      yaxisTickAmount = 8;
    } else {
      // If somehow yaxisMax is still too low, force it to be at least actualMaxRenderedValue + padding
      const minRequiredMax = actualMaxRenderedValue + (actualMaxRenderedValue >= 10 ? 1 : 0.1);
      if (minRequiredMax <= 20 && numType !== "percent") {
        // Round to clean value
        if (minRequiredMax <= 10) {
          yaxisMax = Math.ceil(minRequiredMax);
          if (yaxisMax === minRequiredMax) yaxisMax += 1;
        } else if (minRequiredMax <= 15) {
          yaxisMax = Math.ceil(minRequiredMax / 2) * 2;
          if (yaxisMax < minRequiredMax) yaxisMax += 2;
        } else {
          yaxisMax = Math.ceil(minRequiredMax / 5) * 5;
          if (yaxisMax < minRequiredMax) yaxisMax += 5;
        }
      } else {
        yaxisMax = minRequiredMax;
      }
    }
  }
  }

  // ============================================================================
  // UNIVERSAL SAFETY CHECK: Ensure ALL data points and trendlines are ALWAYS visible
  // ============================================================================
  // This final check guarantees no data is ever cut off, regardless of outliers or data changes.
  // It examines the ACTUAL data that will be rendered on the chart (not the filtered data used
  // for initial axis calculations) and ensures yaxisMax and yaxisMin accommodate ALL values.
  // This prevents the issue where peer data filtering (lines 180-181) removes outliers from
  // axis calculation, but those "outliers" are still rendered, causing them to be cut off.
  const allSeriesValues = [
    ...(clientArray || []),
    ...(peerAvg || []),
    ...(peerMid || []),
    ...(peer25 || []),
    ...(peer75 || []),
    ...(benchmark || [])
  ].filter(v => v !== null && v !== undefined && !isNaN(v));
  
  let safetyCheckAdjustedAxis = false; // Track if we made changes
  
  if (allSeriesValues.length > 0) {
    const actualMaxValue = Math.max(...allSeriesValues);
    const actualMinValue = Math.min(...allSeriesValues);
    
    // === MAXIMUM VALUE CHECK ===
    // Ensure yaxisMax is always high enough to show the highest data point
    if (!yaxisMax || yaxisMax < actualMaxValue) {
      safetyCheckAdjustedAxis = true;
      // Calculate appropriate padding based on value magnitude
      let padding;
      if (numType === "percent") {
        // Scale-aware padding for percentages
        if (actualMaxValue >= 50) {
          padding = 10; // 10% padding for large percentages
        } else if (actualMaxValue >= 20) {
          padding = 5; // 5% padding for medium percentages
        } else if (actualMaxValue >= 10) {
          padding = 3; // 3% padding for 10-20% range
        } else {
          padding = Math.max(1, actualMaxValue * 0.2); // 20% for very small percentages
        }
      } else if (actualMaxValue < 10) {
        padding = Math.max(1, actualMaxValue * 0.2); // 20% padding, minimum 1
      } else if (actualMaxValue < 100) {
        padding = Math.max(5, actualMaxValue * 0.15); // 15% padding, minimum 5
      } else if (actualMaxValue < 1000) {
        padding = Math.max(50, actualMaxValue * 0.1); // 10% padding, minimum 50
      } else {
        padding = actualMaxValue * 0.1; // 10% padding for large values
      }
      
      const minRequiredMax = actualMaxValue + padding;
      
      // Round to clean values
      if (numType === "percent") {
        // Scale-aware rounding for percentages
        if (minRequiredMax >= 100) {
          yaxisMax = Math.ceil(minRequiredMax / 10) * 10; // Round to 10%
        } else if (minRequiredMax >= 50) {
          yaxisMax = Math.ceil(minRequiredMax / 10) * 10; // Round to 10%
        } else if (minRequiredMax >= 30) {
          yaxisMax = Math.ceil(minRequiredMax / 5) * 5; // Round to 5%
        } else if (minRequiredMax >= 10) {
          // SIMPLIFIED: For ALL 10-100% values, use clean 5% rounding
          yaxisMax = Math.ceil(minRequiredMax / 5) * 5; // Round to 5%
        } else {
          yaxisMax = Math.ceil(minRequiredMax); // Round to 1% for very small percentages
        }
      } else if (minRequiredMax <= 2) {
        yaxisMax = Math.ceil(minRequiredMax * 2) / 2; // Round to 0.5
      } else if (minRequiredMax <= 10) {
        yaxisMax = Math.ceil(minRequiredMax);
      } else if (minRequiredMax <= 20) {
        // Special handling for 11-15 range
        if (minRequiredMax <= 15) {
          yaxisMax = 15;
        } else if (minRequiredMax <= 16) {
          yaxisMax = 16;
        } else if (minRequiredMax <= 18) {
          yaxisMax = 18;
        } else {
          yaxisMax = 20;
        }
      } else if (minRequiredMax <= 50) {
        yaxisMax = Math.ceil(minRequiredMax / 5) * 5; // Round to 5
      } else if (minRequiredMax <= 100) {
        yaxisMax = Math.ceil(minRequiredMax / 10) * 10; // Round to 10
      } else if (minRequiredMax <= 1000) {
        yaxisMax = Math.ceil(minRequiredMax / 50) * 50; // Round to 50
      } else if (minRequiredMax <= 10000) {
        // SIMPLIFIED: For ALL values 1K-10K, round to nearest 1K
        yaxisMax = Math.ceil(minRequiredMax / 1000) * 1000;
      } else if (minRequiredMax <= 100000) {
        yaxisMax = Math.ceil(minRequiredMax / 5000) * 5000; // Round to 5K
      } else if (minRequiredMax <= 500000) {
        yaxisMax = Math.ceil(minRequiredMax / 50000) * 50000; // Round to 50K
      } else if (minRequiredMax <= 1000000) {
        yaxisMax = Math.ceil(minRequiredMax / 100000) * 100000; // Round to 100K
      } else if (minRequiredMax <= 10000000) {
        // SIMPLIFIED: For ALL values 1M-10M, round to nearest 1M
        yaxisMax = Math.ceil(minRequiredMax / 1000000) * 1000000;
      } else {
        yaxisMax = Math.ceil(minRequiredMax / 5000000) * 5000000; // Round to 5M
      }
    }
    
    // === MINIMUM VALUE CHECK ===
    // Ensure yaxisMin is always low enough to show the lowest data point (including negatives)
    if (actualMinValue < 0) {
      const existingMin = yaxisMin !== undefined ? yaxisMin : 0;
      if (existingMin > actualMinValue) {
        safetyCheckAdjustedAxis = true;
      }
      const minValueMagnitude = Math.abs(actualMinValue);
      
      // Calculate appropriate padding for negative values
      let negativePadding;
      if (numType === "percent") {
        // Scale-aware padding for negative percentages
        if (minValueMagnitude >= 50) {
          negativePadding = 10;
        } else if (minValueMagnitude >= 20) {
          negativePadding = 5;
        } else if (minValueMagnitude >= 10) {
          negativePadding = 3;
        } else {
          negativePadding = Math.max(1, minValueMagnitude * 0.2);
        }
      } else if (minValueMagnitude < 10) {
        negativePadding = Math.max(1, minValueMagnitude * 0.2);
      } else if (minValueMagnitude < 100) {
        negativePadding = Math.max(5, minValueMagnitude * 0.15);
      } else if (minValueMagnitude < 1000) {
        negativePadding = Math.max(50, minValueMagnitude * 0.1);
      } else {
        negativePadding = minValueMagnitude * 0.1;
      }
      
      const minRequiredMin = actualMinValue - negativePadding;
      
      // Round to clean negative values
      if (numType === "percent") {
        // Scale-aware rounding for negative percentages
        if (Math.abs(minRequiredMin) >= 100) {
          yaxisMin = Math.floor(minRequiredMin / 10) * 10;
        } else if (Math.abs(minRequiredMin) >= 50) {
          yaxisMin = Math.floor(minRequiredMin / 10) * 10;
        } else if (Math.abs(minRequiredMin) >= 30) {
          yaxisMin = Math.floor(minRequiredMin / 5) * 5;
        } else if (Math.abs(minRequiredMin) >= 20) {
          yaxisMin = Math.floor(minRequiredMin / 5) * 5;
        } else if (Math.abs(minRequiredMin) >= 10) {
          yaxisMin = Math.floor(minRequiredMin / 3) * 3;
        } else {
          yaxisMin = Math.floor(minRequiredMin);
        }
      } else if (minRequiredMin >= -2) {
        yaxisMin = Math.floor(minRequiredMin * 2) / 2; // Round to -0.5
      } else if (minRequiredMin >= -10) {
        yaxisMin = Math.floor(minRequiredMin);
      } else if (minRequiredMin >= -20) {
        yaxisMin = Math.floor(minRequiredMin / 2) * 2; // Round to -2
      } else if (minRequiredMin >= -50) {
        yaxisMin = Math.floor(minRequiredMin / 5) * 5; // Round to -5
      } else if (minRequiredMin >= -100) {
        yaxisMin = Math.floor(minRequiredMin / 10) * 10; // Round to -10
      } else if (minRequiredMin >= -1000) {
        yaxisMin = Math.floor(minRequiredMin / 50) * 50; // Round to -50
      } else if (minRequiredMin >= -10000) {
        yaxisMin = Math.floor(minRequiredMin / 500) * 500; // Round to -500
      } else if (minRequiredMin >= -100000) {
        yaxisMin = Math.floor(minRequiredMin / 5000) * 5000; // Round to -5K
      } else if (minRequiredMin >= -1000000) {
        yaxisMin = Math.floor(minRequiredMin / 50000) * 50000; // Round to -50K
      } else if (minRequiredMin >= -10000000) {
        yaxisMin = Math.floor(minRequiredMin / 500000) * 500000; // Round to -500K
      } else {
        yaxisMin = Math.floor(minRequiredMin / 5000000) * 5000000; // Round to -5M
      }
    } else if (yaxisMin === undefined) {
      // No negative values, default to 0
      yaxisMin = 0;
    }
  } else {
    // No valid data, use defaults
    if (yaxisMax === undefined) yaxisMax = 10;
    if (yaxisMin === undefined) yaxisMin = 0;
  }

  // ============================================================================
  // RECALCULATE STEP SIZE AND TICK AMOUNT for professional, evenly-spaced axis
  // ============================================================================
  // After safety check adjustments, ensure step size and tick amount are appropriate
  // for the final yaxisMax and yaxisMin values to maintain visual professionalism.
  // ONLY recalculate if the safety check actually adjusted the axis values - this preserves
  // the existing careful step size/tick amount calculations when they're already correct.
  if (safetyCheckAdjustedAxis) {
    const finalMin = yaxisMin !== undefined ? yaxisMin : 0;
    const finalMax = yaxisMax;
    const axisRange = finalMax - finalMin;
    if (numType === "percent") {
      // For percentages, use appropriate intervals based on TOTAL range (not just max)
      // This properly handles charts with negative values
      if (axisRange >= 100) {
        yaxisStepSize = 20; // 20% intervals for very large ranges
      } else if (axisRange >= 60) {
        yaxisStepSize = 10; // 10% intervals for 60-100% range
      } else if (axisRange >= 10) {
        // SIMPLIFIED: For ALL 10-100% ranges, use clean 5% intervals
        yaxisStepSize = 5; // 5% intervals for professional look
      } else {
        yaxisStepSize = 1; // 1% intervals for very small percentages
      }
      
      // For asymmetric percentage axes, adjust min to fit step pattern
      if (finalMin < 0) {
        yaxisMin = Math.floor(finalMin / yaxisStepSize) * yaxisStepSize;
        const newRange = finalMax - yaxisMin;
        yaxisTickAmount = newRange / yaxisStepSize;
      } else {
        yaxisTickAmount = Math.round(axisRange / yaxisStepSize);
      }
    } else {
      // For number types (non-percent): Skip recalculation - let ApexCharts handle it
      // We've already set clean min/max values in the safety check above
      // ApexCharts will automatically create evenly-spaced ticks between min and max
      // This keeps the code simple and leverages ApexCharts' native spacing algorithm
    }
  }
  }

  const yaxisLabelFormatter = (value) => {
    const absValue = Math.abs(value);
    const isNegative = value < 0;
    const sign = isNegative ? "-" : "";

    const formatCompact = (val) => {
      if (val >= 1000000) {
        const m = val / 1000000;
        const display = m % 1 === 0 ? m.toString() : m.toFixed(1);
        return `${display}M`;
      }
      if (val >= 1000) {
        const k = val / 1000;
        const display = k % 1 === 0 ? k.toString() : k.toFixed(1);
        return `${display}K`;
      }
      const display = val % 1 === 0 ? val.toString() : val.toFixed(1);
      return display;
    };

    if (numType === "percent") {
      const display = absValue % 1 === 0 ? absValue.toString() : absValue.toFixed(1);
      return `${sign}${display}%`;
    }

    if (numType === "dollar") {
      const display = formatCompact(absValue);
      return `${sign}$${display}`;
    }

    return `${sign}${formatCompact(absValue)}`;
  };

  const tooltipFormatter = (value) => {
    if (value === null || value === undefined) return;
    const formattedValue = value.toLocaleString();
    if (numType === "dollar") {
      // For negative dollar values, format as -$X instead of $-X
      if (value < 0) {
        return `-$${Math.abs(value).toLocaleString()}`;
      }
      return `$${formattedValue}`;
    } else if (numType === "percent") {
      return `${formattedValue}%`;
    } else {
      return formattedValue;
    }
  };

  // console.log("getMainChartOptions()", {
  //   selectedYearsArray,
  //   dataPeer,
  //   dataClient,
  //   fixedNum,
  //   numType,
  //   mainName,
  //   clientArray,
  //   peerAvg,
  //   peerMid,
  //   peer25,
  //   peer75,
  // });

  // clientArray should already contain clean numeric values from getPeerAndClientChartDataArrays

  // Benchmark line: single horizontal line per chart (same style as standard); label on the right
  const selectedYearsLength = selectedYearsArray.length;
  let offsetXRight;
  switch (selectedYearsLength) {
    case 1: offsetXRight = 80; break;
    case 2:
    case 3: offsetXRight = 120; break;
    case 4:
    case 5: offsetXRight = 180; break;
    case 6: offsetXRight = 220; break;
    case 7: offsetXRight = 260; break;
    case 8: offsetXRight = 300; break;
    case 9: offsetXRight = 340; break;
    case 10: offsetXRight = 380; break;
    case 11: offsetXRight = 420; break;
    default: offsetXRight = 120;
  }

  const yaxisAnnotations = [];
  if (benchmark && Array.isArray(benchmark) && benchmark.length > 0) {
    const singleValue = benchmark[0];
    yaxisAnnotations.push({
      id: "annotation",
      y: singleValue,
      borderColor: "#000000",
      strokeDashArray: 0,
      label: {
        text: "Benchmark",
        borderColor: "transparent",
        borderWidth: 0,
        offsetX: offsetXRight,
        position: "right",
        style: {
          background: "transparent",
          color: "#000000",
          fontSize: "18px",
          fontWeight: 600,
        },
      },
    });
  }

  const chartEvents = {
    beforeMount: function (chartContext, config) {
      setTimeout(() => {
        const chartElement = document.getElementById(chartId);
        if (!chartElement) return;
        const gridLine = chartElement.querySelector(".apexcharts-gridlines-horizontal line");
        if (!gridLine) return;
        const annotationLines = chartElement.querySelectorAll(".apexcharts-yaxis-annotations line");
        const x1 = gridLine.getAttribute("x1");
        const x2 = gridLine.getAttribute("x2");
        annotationLines.forEach((line) => {
          line.setAttribute("x1", x1);
          line.setAttribute("x2", x2);
        });
      }, 200);
    },
    updated: function (chartContext, config) {
      const chartElement = document.getElementById(chartId);
      if (!chartElement) return;
      if (yaxisAnnotations && yaxisAnnotations.length > 0) {
        const annotationsToReapply = yaxisAnnotations;
        setTimeout(() => {
          const el = document.getElementById(chartId);
          if (!el) return;
          const lines = el.querySelectorAll(".apexcharts-yaxis-annotations line");
          if (lines.length === 0) {
            const chartInstance = window[chartId] || chartContext;
            if (chartInstance && typeof chartInstance.updateOptions === "function") {
              chartInstance.updateOptions(
                { annotations: { yaxis: annotationsToReapply } },
                true,
                false
              );
            }
          }
        }, 100);
      }
      const gridLine = chartElement.querySelector(".apexcharts-gridlines-horizontal line");
      if (!gridLine) return;
      const annotationLines = chartElement.querySelectorAll(".apexcharts-yaxis-annotations line");
      const x1 = gridLine.getAttribute("x1");
      const x2 = gridLine.getAttribute("x2");
      annotationLines.forEach((line) => {
        line.setAttribute("x1", x1);
        line.setAttribute("x2", x2);
      });
    },
    dataPointMouseEnter: function (event, chartContext, config) {
      if (config && typeof config.dataPointIndex === "number") {
        const chartElement = document.getElementById(chartId);
        if (chartElement) chartElement._lastTooltipDataPointIndex = config.dataPointIndex;
        setTimeout(() => positionTooltipLeftOfBar(chartId, config.dataPointIndex), 0);
      }
    },
    mouseMove: function (event, chartContext, config) {
      const chartElement = document.getElementById(chartId);
      if (!chartElement) return;
      const idx =
        config && typeof config.dataPointIndex === "number"
          ? config.dataPointIndex
          : chartElement._lastTooltipDataPointIndex;
      if (typeof idx === "number") positionTooltipLeftOfBar(chartId, idx);
    },
  };

  const series = [
    {
      name: firmName,
      type: "column",
      data: clientArray,
      style: {
        colors: [chartColors.labelColor],
      },
    },
    {
      name: "Avg",
      type: "line",
      data: peerAvg,
      yaxis: 0,
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.9,
          stops: [0, 80, 80],
        },
      },
      showInLegend: true,
      showForNullSeries: true,
    },
    {
      name: "25th",
      type: "line",
      data: peer25,
      visible: false,
      showInLegend: true,
      showForNullSeries: true,
    },
    {
      name: "50th",
      type: "line",
      data: peerMid,
      visible: false,
      showInLegend: true,
      showForNullSeries: true,
    },
    {
      name: "75th",
      type: "line",
      data: peer75,
      visible: false,
      showInLegend: true,
      showForNullSeries: true,
    },
  ];

  return {
    colors: [
      window.chartColors.green,
      window.chartColors.blue,
      window.chartColors.orange,
      window.chartColors.yellow,
      window.chartColors.purple,
    ],
    series: series,
    chart: {
      zoom: {
        enabled: false,
      },
      toolbar: {
        tools: {
          download: true,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false,
        },
      },
      height: 350,
      type: "line",
      stacked: false,
      background: "transparent",
      events: chartEvents,
    },
    annotations: {
      yaxis: yaxisAnnotations,
    },
    dataLabels: {
      enabled: true,
      enabledOnSeries: [0],
      offsetY: -20,
      formatter: tooltipFormatter,
      style: {
        fontSize: "20px",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: "bold",
        colors: ["#ffffff"],
      },
      background: {
        enabled: !isDarkMode,
        foreColor: window.chartColors.green,
        padding: 4,
        borderRadius: 2,
        borderWidth: 1,
        borderColor: "#ffffff",
        opacity: 0.7,
        dropShadow: {
          enabled: false,
          top: 1,
          left: 1,
          blur: 1,
          color: "#000",
          opacity: 0.45,
        },
      },
      zIndex: 999,
    },
    stroke: {
      width: [2, 3, 4, 4, 4],
      dashArray: series.map((s, i) => (i === 1 ? 4 : 0)),
    },
    markers: {
      size: 0,
      hover: {
        sizeOffset: 6,
      },
    },
    title: {
      text: "",
      align: "left",
      offsetX: 110,
    },
    subtitle: {
      text: "",
      align: "left",
      offsetX: 110,
      offsetY: 20,
      style: {
        fontSize: "14px",
        fontWeight: "normal",
        color: chartColors.labelColor,
      },
    },
    xaxis: {
      categories: selectedYearsArray,
      axisTicks: {
        color: chartColor,
      },
      axisBorder: {
        color: chartColor,
      },
      labels: {
        style: {
          colors: chartColors.labelColor,
          fontSize: "1rem",
        },
      },
    },
    yaxis: [
      {
        axisTicks: {
          show: true,
          color: chartColor,
        },
        axisBorder: {
          show: true,
          color: chartColor,
        },
        tooltip: {
          enabled: true,
        },
        labels: {
          formatter: yaxisLabelFormatter,
          style: {
            colors: chartColors.labelColor,
            fontSize: "1.25rem",
          },
          show: true,
          hideOverlappingLabels: false,
        },
      },
    ],
    tooltip: (() => {
      const chartTitle = title && String(title).trim() ? title : mainName || "Chart";
      const seriesColors = [
        window.chartColors.green,
        window.chartColors.blue,
        window.chartColors.orange,
        window.chartColors.yellow,
        window.chartColors.purple,
      ];
      const base = {
        theme: isDarkMode ? "dark" : "light",
        shared: true,
        style: {
          fontSize: "14px",
          fontFamily: "Helvetica, Arial, sans-serif",
        },
        y: {
          formatter: tooltipFormatter,
          title: {
            formatter: (seriesName) => `${seriesName}:`,
          },
        },
        custom: function ({ series, seriesIndex, dataPointIndex, w }) {
          const yearValue =
            Array.isArray(selectedYearsArray) && selectedYearsArray[dataPointIndex] !== undefined
              ? selectedYearsArray[dataPointIndex]
              : w.globals.labels[dataPointIndex];
          const year = yearValue != null ? String(yearValue) : "";
          const seriesNames = w.globals.seriesNames || [];
          let html =
            '<div class="cfhi-benchmark-tooltip" style="max-width: 200px; width: 200px; white-space: normal; overflow-wrap: break-word;">' +
            '<div class="apexcharts-tooltip-title" style="margin-bottom: 4px; text-align: center;">';
          if (year) {
            html += year;
          }
          html += "</div>";
          series.forEach((seriesData, i) => {
            const val = seriesData[dataPointIndex];
            if (val !== null && val !== undefined) {
              const formatted = tooltipFormatter(Number(val));
              const color = seriesColors[i] || chartColors.labelColor;
              html +=
                '<div class="apexcharts-tooltip-series-group" style="align-items: center; display: flex; gap: 6px; margin: 2px 0;">' +
                '<span class="apexcharts-tooltip-marker" style="background-color: ' + color + '; border-radius: 50%; width: 10px; height: 10px; display: inline-block;"></span>' +
                "<span><strong>" + (seriesNames[i] || "") + ":</strong> " + formatted + "</span></div>";
            }
          });
          html += "</div>";
          return html;
        },
      };
      return base;
    })(),
    legend: {
      horizontalAlign: "center",
      offsetX: 40,
      fontSize: "20px",
      show: true,
      showForNullSeries: true,
      showForZeroSeries: true,
      labels: {
        colors: chartColors.labelColor,
      },
    },
    grid: {
      row: {
        colors: ["transparent"],
        opacity: isDarkMode ? 0.3 : 0.5,
        thickness: 4,
      },
      borderColor: isDarkMode ? "#4B5563" : "#E5E7EB",
    },
    plotOptions: {
      bar: {
        barHeight: "90%",
      },
    },
  };
};

