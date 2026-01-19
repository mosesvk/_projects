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

    // Cash
    daysExpendableNetAssets: [30, 60],
    daysOperatingCash: [40, 80],
    availableDaysOfCashFlow: [120, 180],
    liquidityRatio: [5],
    netCashAvailability: null,

    // Debt
    debtToContributionsWithout: [2],
    currentRatio: [2],
    cashFlowsFromOperatingActivities: [0],
    mandatoryDebtServiceToContributionsWithout: [15, 20],
    debtPerGivingUnit: null,
    debtCoverage: [1.15],

    // Income
    netIncomeRatio: [0], // positive is good
    contributionsWithoutDonorPerGivingUnit: null,
    totalContributionsPerGivingUnit: null,

    // Expense
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

  // Calculate smart y-axis range based on actual data (always needed)
  const allDataValues = [...clientArray, ...peerAvg, ...peerMid, ...peer25, ...peer75, ...(benchmark || [])].filter(v => v !== null && v !== undefined);
  const dataMin = Math.min(...allDataValues);
  const dataMax = Math.max(...allDataValues);
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
      
      // Determine step size (must be 1, 2, or 5)
      let stepSize;
      if (cleanMax <= 10) {
        stepSize = 1; // For max 1-10, use step of 1
      } else if (cleanMax <= 15) {
        stepSize = 2; // For max 11-15, use step of 2
      } else {
        stepSize = 5; // For max 16-20, use step of 5
      }
      
      // Ensure cleanMax is a multiple of stepSize for even spacing
      cleanMax = Math.ceil(cleanMax / stepSize) * stepSize;
      
      // Calculate tickAmount (number of intervals)
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
      // For percentages, cap at actual max/min with clean 15% intervals
      // Example: max=30%, min=-11% -> max=30%, min=-15% (0, 15, 30 for positive, -15, 0 for negative)
      let cleanMax = Math.ceil(dataMax / 15) * 15; // Round up to nearest multiple of 15
      let cleanMin = Math.floor(dataMin / 15) * 15; // Round down to nearest multiple of 15
      
      // Ensure we have headroom
      if (cleanMax === dataMax) {
        cleanMax += 15;
      }
      if (cleanMin === dataMin) {
        cleanMin -= 15;
      }
      
      yaxisMin = cleanMin;
      yaxisMax = cleanMax;
      yaxisStepSize = 15;
      yaxisTickAmount = (cleanMax - cleanMin) / 15;
    } else {
      // For non-percent types with negative values, use symmetric or balanced axis
      const absMax = Math.max(Math.abs(dataMin), Math.abs(dataMax));
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
  } else {
    padding = Math.ceil(dataRange * 0.1); // 10% padding for large ranges
  }
  
  // Ensure minimum padding for very small values
  if (dataMax < 1 && padding < 0.05) {
    padding = 0.05;
  }
  
  // Smart y-axis maximum calculation
    // For percent type with values >= 10, treat like num/dollar - round to nearest 10
  if (numType === "percent" && dataMax >= 10) {
    // Percent type should round to nearest 10 for clean tick marks (0%, 10%, 20%, etc.)
    const rawMax = dataMax + padding;
    if (rawMax >= 100) {
      yaxisMax = Math.ceil(rawMax / 10) * 10;
    } else if (rawMax >= 50) {
      yaxisMax = Math.ceil(rawMax / 10) * 10;
    } else if (rawMax >= 20) {
      yaxisMax = Math.ceil(rawMax / 10) * 10;
    } else {
      yaxisMax = Math.ceil(rawMax / 5) * 5;
    }
  } else if (dataMax <= 20 && numType !== "percent") {
    // Use clean chart principles for values <= 20 (non-percent types)
    const cleanAxis = calculateCleanYAxis(dataMax, 0, numType);
    if (cleanAxis) {
      yaxisMax = cleanAxis.max;
      yaxisStepSize = cleanAxis.stepSize;
      yaxisTickAmount = cleanAxis.tickAmount;
    } else {
      // Fallback
      yaxisMax = Math.ceil(dataMax);
      if (yaxisMax === dataMax) {
        yaxisMax += 1;
      }
      yaxisStepSize = yaxisMax <= 10 ? 1 : yaxisMax <= 15 ? 2 : 5;
      yaxisMax = Math.ceil(yaxisMax / yaxisStepSize) * yaxisStepSize;
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
      // For dataMax under 20, use dataMax directly to keep yaxisMax close to actual max
      if (dataMax <= 12) {
        yaxisMax = 12; // maxVal 12: use 12 for ticks 0, 3, 6, 9, 12
      } else if (dataMax <= 15) {
        yaxisMax = 15; // maxVal 15: use 15 for ticks 0, 3, 6, 9, 12, 15
      } else if (dataMax <= 16) {
        yaxisMax = 16; // maxVal 16: use 16 for ticks 0, 4, 8, 12, 16
      } else if (dataMax <= 17) {
        yaxisMax = 18; // maxVal 17: use 18 for ticks 0, 3, 6, 9, 12, 15, 18
      } else if (dataMax <= 18) {
        yaxisMax = 18; // maxVal 18: use 18 for ticks 0, 3, 6, 9, 12, 15, 18
      } else {
        yaxisMax = 20; // maxVal 19: use 20
      }
    } else if (rawMax >= 100000000) {
      // For values >= 100M, round up to nearest 10M
      yaxisMax = Math.ceil(rawMax / 10000000) * 10000000;
    } else if (rawMax >= 50000000) {
      // For values >= 50M, round up to nearest 10M for clean 10M intervals
      yaxisMax = Math.ceil(rawMax / 10000000) * 10000000;
    } else if (rawMax >= 10000000) {
      // For values >= 10M, round up to nearest 5M
      yaxisMax = Math.ceil(rawMax / 5000000) * 5000000;
    } else if (rawMax >= 3000000) {
      // For values >= 3M, round up to nearest 5M for clean 5M intervals
      yaxisMax = Math.ceil(rawMax / 5000000) * 5000000;
    } else if (rawMax >= 1000000) {
      // For values 1M-3M, use 0.5M intervals and cap closer to actual max
      // Example: max ~2M -> max = 2.5M with ticks at 0, 0.5M, 1M, 1.5M, 2M, 2.5M
      yaxisMax = Math.ceil(rawMax / 500000) * 500000; // Round up to nearest 0.5M
      // Store step size for tickAmount calculation (in actual value, not millions)
      yaxisStepSize = 500000; // 0.5M step size (500000)
      yaxisTickAmount = yaxisMax / 500000; // Number of 0.5M intervals
    } else if (rawMax >= 500000) {
      // For values 500K-1M, round up to nearest 100K
      yaxisMax = Math.ceil(rawMax / 100000) * 100000;
    } else if (rawMax >= 200000) {
      // For values 200K-500K, round up to nearest 50K for tighter spacing
      yaxisMax = Math.ceil(rawMax / 50000) * 50000;
    } else if (rawMax >= 100000) {
      // For values 100K-200K, round up to nearest 20K for tighter spacing
      // Example: 137K rounds to 140K instead of 200K
      yaxisMax = Math.ceil(rawMax / 20000) * 20000;
    } else if (rawMax >= 50000) {
      // For values 50K-100K, round up to nearest 10K
      yaxisMax = Math.ceil(rawMax / 10000) * 10000;
    } else if (rawMax >= 20000) {
      // For values 20K-50K, round up to nearest 5K for tighter spacing
      // Example: 25K rounds to 30K instead of 30K (same), 35K rounds to 40K
      yaxisMax = Math.ceil(rawMax / 5000) * 5000;
    } else if (rawMax >= 10000) {
      // For values 10K-20K, round up to nearest 2K for even spacing
      // Example: 14K rounds to 14K, 15K rounds to 16K
      yaxisMax = Math.ceil(rawMax / 2000) * 2000;
    } else if (rawMax >= 1000) {
      // For values 1K-10K, round up to nearest 1K for whole thousands
      // Example: 5.8K rounds to 6K, 7.2K rounds to 8K
      yaxisMax = Math.ceil(rawMax / 1000) * 1000;
    } else if (rawMax >= 800) {
      // For values 800-1000, round up to nearest 100 for clean 100 intervals
      yaxisMax = Math.ceil(rawMax / 100) * 100;
    } else if (rawMax >= 500) {
      // For values 500-800, use 100 interval for even spacing
      // Example: 600 rounds to 600 (0, 100, 200, 300, 400, 500, 600)
      yaxisMax = Math.ceil(rawMax / 100) * 100;
    } else if (rawMax >= 400) {
      // For values 400-500, use 100 interval (400, 500)
      yaxisMax = Math.ceil(rawMax / 100) * 100;
    } else if (rawMax >= 300) {
      // For values 300-400, use 100 interval (300, 400)
      yaxisMax = Math.ceil(rawMax / 100) * 100;
    } else if (rawMax >= 200) {
      // For values 200-300, use 100 interval (200, 300)
      yaxisMax = Math.ceil(rawMax / 100) * 100;
    } else if (rawMax >= 100) {
      // For values 100-200, use 50 interval (100, 150, 200)
      yaxisMax = Math.ceil(rawMax / 50) * 50;
    } else if (rawMax >= 50) {
      // For values 50-100, round to nearest 10 but keep closer to actual max
      // For maxVal 47, rawMax ~50, round to 50 (not 60) for cleaner ticks
      if (rawMax <= 55) {
        yaxisMax = 50; // Keep at 50 for values 45-55
      } else {
        yaxisMax = Math.ceil(rawMax / 10) * 10; // Round to nearest 10 (60, 70, 80, 90, 100)
      }
    } else if (rawMax >= 40) {
      // For values 40-50, round to nearest 10
      yaxisMax = Math.ceil(rawMax / 10) * 10; // 40, 50
    } else {
      // For values 20-40, round to nearest multiple of 4 for clean spacing
      yaxisMax = Math.ceil(rawMax / 4) * 4; // Round to nearest multiple of 4 (20, 24, 28, etc.)
    }
  }
  }


  const yaxisLabelFormatter = (value) => {
    let formattedValue;
    const absValue = Math.abs(value);
    const isNegative = value < 0;
    
    // Handle very large numbers (millions and billions) - use absolute value for range checks
    if (absValue >= 100000000) {
      // Round to nearest 10M for values >= 100M
      formattedValue = `${Math.round(absValue / 10000000) * 10}M`;
    } else if (absValue >= 50000000) {
      // Round to nearest 10M for values between 50M and 100M
      formattedValue = `${Math.round(absValue / 10000000) * 10}M`;
    } else if (absValue >= 10000000) {
      // Round to nearest 5M for values between 10M and 50M
      formattedValue = `${Math.round(absValue / 5000000) * 5}M`;
    } else if (absValue >= 1000000) {
      // Round to nearest 1M for values between 1M and 10M
      // This prevents small millions from rounding to 0M
      formattedValue = `${Math.round(absValue / 1000000)}M`;
    } else if (absValue >= 100000) {
      // For values >= 100K, display actual K value without rounding
      const kValue = absValue / 1000;
      // Only show decimal if it's not a whole number
      formattedValue = kValue % 1 === 0 ? `${kValue}K` : `${kValue.toFixed(1)}K`;
    } else if (absValue >= 10000) {
      // For values >= 10K, round to nearest whole thousand
      // Example: 14.2K -> 14K, 15.8K -> 16K
      formattedValue = `${Math.round(absValue / 1000)}K`;
    } else if (absValue >= 1000) {
      // For values 1K-10K, round to nearest whole thousand for clean labels
      // Example: 1.4K -> 1K, 2.8K -> 3K, 5.6K -> 6K, 7K -> 7K
      formattedValue = `${Math.round(absValue / 1000)}K`;
    } else if (absValue >= 100) {
      // Round to nearest 100 for values between 100 and 1000
      // This handles cases like 510 -> 500, 410 -> 400, etc.
      // Only round if not already a multiple of 100 to avoid duplicate labels
      if (absValue % 100 === 0) {
        formattedValue = absValue;
      } else {
        formattedValue = Math.round(absValue / 100) * 100;
      }
    } else if (absValue >= 10) {
      // Round to nearest 10 for values between 10 and 100
      // Only round if not already a multiple of 10 to avoid duplicate labels
      if (absValue % 10 === 0) {
        formattedValue = absValue;
      } else {
        formattedValue = Math.round(absValue / 10) * 10;
      }
    } else if (Math.max(Math.abs(dataMin), Math.abs(dataMax)) <= 10) {
      // Special handling only for charts with small data ranges (≤10)
      // Round to avoid floating point precision issues
      const roundedValue = Math.round(value * 1000) / 1000;
      const roundedAbsValue = Math.abs(roundedValue);
      
      if (Math.abs(yaxisMax) === 2.5 || Math.abs(yaxisMax) === 2) {
        // For charts with max of 2 or 2.5, use 0.5 increments
        // Ensure we handle 0.5 values correctly
        if (roundedAbsValue === 0.5 || Math.abs(roundedAbsValue - 0.5) < 0.01) {
          formattedValue = 0.5;
        } else {
          formattedValue = Math.round(roundedAbsValue * 2) / 2;
        }
      } else if (Number.isInteger(yaxisMax) && yaxisMax >= 2 && yaxisMax <= 10) {
        // For integer yaxisMax 2-10, round to nearest integer for clean labels
        formattedValue = Math.round(roundedAbsValue);
      } else if (roundedAbsValue >= 1) {
        // For values 1-10, show 0.5 increments
        formattedValue = Math.round(roundedAbsValue * 2) / 2;
      } else if (roundedAbsValue >= 0.1) {
        // For values 0.1-1, show 0.1 increments
        formattedValue = Math.round(roundedAbsValue * 10) / 10;
      } else if (roundedAbsValue >= 0.01) {
        // For values 0.01-0.1, show 0.01 increments
        formattedValue = Math.round(roundedAbsValue * 100) / 100;
      } else if (roundedAbsValue > 0) {
        // For very small positive values, show 0.001 increments
        formattedValue = Math.round(roundedAbsValue * 1000) / 1000;
      } else {
        formattedValue = 0;
      }
      
      // Apply sign
      if (isNegative && formattedValue !== 0) {
        formattedValue = -formattedValue;
      }
    } else {
      // For larger charts, use standard rounding
      if (absValue >= 1) {
        // Round to nearest 1 for values between 1 and 10
        formattedValue = Math.round(absValue);
      } else if (absValue >= 0.1) {
        // For values between 0.1 and 1, always use 0.05 increments to avoid repeating labels
        // This ensures clean increments like 0.05, 0.10, 0.15, 0.20, 0.25, 0.30, etc.
        formattedValue = Math.round(absValue * 20) / 20;
      } else if (absValue >= 0.01) {
        // For values between 0.01 and 0.1, use 0.02 increments
        formattedValue = Math.round(absValue * 50) / 50;
      } else {
        // For very small values, round to nearest 0.01
        formattedValue = Math.round(absValue * 100) / 100;
      }
      
      // Apply sign
      if (isNegative && formattedValue !== 0) {
        formattedValue = -formattedValue;
      }
    }
    
    // Apply prefix/suffix based on numType
    if (numType === "dollar") {
      // For dollar values, always show whole numbers for clean labels
      if (Math.abs(formattedValue) >= 1) {
        formattedValue = isNegative ? -Math.round(absValue) : Math.round(absValue);
      } else if (Math.abs(formattedValue) >= 0.1) {
        // For values 0.1-1, round to 1 decimal place but prefer whole numbers
        const rounded = Math.round(absValue * 10) / 10;
        // If close to a whole number, use whole number
        if (Math.abs(rounded - Math.round(rounded)) < 0.01) {
          formattedValue = isNegative ? -Math.round(rounded) : Math.round(rounded);
        } else {
          formattedValue = isNegative ? -rounded : rounded;
        }
      }
      return `$${formattedValue}`;
    } else if (numType === "percent") {
      // For percentage values, use whole numbers for clean labels (0%, 10%, 20%, etc.)
      if (absValue >= 10) {
        // For percentages >= 10, round to nearest whole number
        formattedValue = isNegative ? -Math.round(absValue) : Math.round(absValue);
      } else if (absValue >= 1) {
        // For percentages 1-10, round to nearest whole number
        formattedValue = isNegative ? -Math.round(absValue) : Math.round(absValue);
      } else if (absValue >= 0.1) {
        // For small percentages 0.1-1, use 0.1 increments
        formattedValue = isNegative ? -(Math.round(absValue * 10) / 10) : (Math.round(absValue * 10) / 10);
      } else {
        // For very small percentages, use 0.01 increments
        formattedValue = isNegative ? -(Math.round(absValue * 100) / 100) : (Math.round(absValue * 100) / 100);
      }
      return `${formattedValue}%`;
    } else {
      return formattedValue; // "num" or "number" - no prefix/suffix
    }
  };

  const tooltipFormatter = (value) => {
    if (!value) return;
    const formattedValue = value.toLocaleString();
    if (numType === "dollar") {
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
    title: {
      text: "",
      align: "left",
      offsetX: 110,
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
        ...(yaxisMin !== undefined ? { min: yaxisMin } : {}),
        max: yaxisMax,
        // Configure y-axis based on data range
        ...(yaxisMax === 2 || yaxisMax === 2.5 ? {
          // Special handling for 2 and 2.5 max values
          forceNiceScale: false,
          tickAmount: 4, // This should create 5 ticks: 0, 0.5, 1, 1.5, 2 (and 2.5 if max is 2.5)
          floating: false,
          decimalsInFloat: 1,
          labels: {
            ...((dataMax <= 10) && {
              show: true,
              hideOverlappingLabels: false,
            }),
            formatter: (value) => {
              // Custom formatter specifically for 2/2.5 range charts
              const roundedValue = Math.round(value * 2) / 2; // Round to nearest 0.5
              
              if (numType === "dollar") {
                return `$${roundedValue}`;
              } else if (numType === "percent") {
                return `${roundedValue}%`;
              } else {
                return roundedValue;
              }
            },
            style: {
              colors: chartColors.labelColor,
              fontSize: "1.25rem",
            },
            align: chartId === "personnelToCashExpenditure_chart" || chartId === "benefitsToSalaries_chart" ? "left" : undefined,
          },
        } : dataMin < 0 && numType === "percent" && yaxisStepSize && yaxisTickAmount ? {
          // Handle percentage charts with negative values (e.g., -15% to 30% with 15% intervals)
          forceNiceScale: false,
          min: yaxisMin,
          max: yaxisMax,
          tickAmount: yaxisTickAmount,
          labels: {
            formatter: (value) => {
              // Round to nearest 15 for percentage intervals
              const roundedValue = Math.round(value / 15) * 15;
              return `${roundedValue}%`;
            },
            style: {
              colors: chartColors.labelColor,
              fontSize: "1.25rem",
            },
            align: chartId === "personnelToCashExpenditure_chart" || chartId === "benefitsToSalaries_chart" ? "left" : undefined,
            show: true,
            hideOverlappingLabels: false,
          },
        } : yaxisStepSize === 500000 && yaxisMax >= 1000000 && yaxisTickAmount ? {
          // Handle million values with 0.5M step sizes (e.g., 0, 0.5M, 1M, 1.5M, 2M, 2.5M)
          forceNiceScale: false,
          min: 0,
          max: yaxisMax,
          tickAmount: yaxisTickAmount,
          labels: {
            formatter: (value) => {
              // Format as millions with 0.5M intervals
              const millionValue = value / 1000000;
              const roundedValue = Math.round(millionValue * 2) / 2; // Round to nearest 0.5
              if (numType === "dollar") {
                return `$${roundedValue}M`;
              } else {
                return `${roundedValue}M`;
              }
            },
            style: {
              colors: chartColors.labelColor,
              fontSize: "1.25rem",
            },
            align: chartId === "personnelToCashExpenditure_chart" || chartId === "benefitsToSalaries_chart" ? "left" : undefined,
            show: true,
            hideOverlappingLabels: false,
          },
        } : dataMax <= 20 && yaxisStepSize && yaxisTickAmount ? {
          // Use clean chart principles for values <= 20 with step sizes of 0.5, 1, 2, or 5
          forceNiceScale: false,
          min: yaxisMin !== undefined ? yaxisMin : 0,
          max: yaxisMax,
          tickAmount: yaxisTickAmount,
          labels: {
            formatter: (value) => {
              // Handle 0.5 step size for small decimal values
              if (yaxisStepSize === 0.5) {
                const roundedValue = Math.round(value * 2) / 2; // Round to nearest 0.5
                if (numType === "dollar") {
                  return `$${roundedValue}`;
                } else if (numType === "percent") {
                  return `${roundedValue}%`;
                } else {
                  return roundedValue;
                }
              }
              // Round to ensure clean integer labels when stepSize is 1, 2, or 5
              const roundedValue = Math.round(value);
              if (numType === "dollar") {
                return `$${roundedValue}`;
              } else if (numType === "percent") {
                return `${roundedValue}%`;
              } else {
                return roundedValue;
              }
            },
            style: {
              colors: chartColors.labelColor,
              fontSize: "1.25rem",
            },
            align: chartId === "personnelToCashExpenditure_chart" || chartId === "benefitsToSalaries_chart" ? "left" : undefined,
            show: true,
            hideOverlappingLabels: false,
          },
        } : dataMax <= 10 ? {
          forceNiceScale: false,
          // For integer yaxisMax 2-10, force exact integer ticks
          ...(Number.isInteger(yaxisMax) && yaxisMax >= 2 && yaxisMax <= 10 ? {
            min: 0,
            max: yaxisMax,
            tickAmount: yaxisMax,
          } : {
          tickAmount: (() => {
            const range = yaxisMax - (yaxisMin || 0);
            if (range >= 5) {
              return 5;
            } else if (range >= 2) {
              return 4;
            } else if (range >= 1) {
              return 4;
            } else {
              return 5;
            }
          })(),
          }),
          labels: {
            formatter: (value) => {
              // For integer yaxisMax 2-10, always show integers
              if (Number.isInteger(yaxisMax) && yaxisMax >= 2 && yaxisMax <= 10) {
                const intValue = Math.round(value);
                if (numType === "dollar") {
                  return `$${intValue}`;
                } else if (numType === "percent") {
                  return `${intValue}%`;
                } else {
                  return intValue;
                }
              }
              // Otherwise use the standard formatter
              return yaxisLabelFormatter(value);
            },
            style: {
              colors: chartColors.labelColor,
              fontSize: "1.25rem",
            },
            align: chartId === "personnelToCashExpenditure_chart" || chartId === "benefitsToSalaries_chart" ? "left" : undefined,
            show: true,
            hideOverlappingLabels: false,
          },
        } : {
          // For larger values (>10), calculate dynamic tick amount for even spacing
          forceNiceScale: false,
          tickAmount: (() => {
            const range = yaxisMax - (yaxisMin || 0);
            
            // Calculate ideal tick count based on range scale
            if (range >= 100000000) {
              // For ranges >= 100M, use 5-10 ticks
              return Math.min(10, Math.max(5, Math.floor(range / 10000000)));
            } else if (range >= 50000000) {
              // For ranges >= 50M, aim for 5 ticks (e.g., 0, 10M, 20M, 30M, 40M, 50M)
              return 5;
            } else if (range >= 10000000) {
              // For ranges >= 10M, aim for 5 ticks
              return 5;
            } else if (range >= 1000000) {
              // For ranges >= 1M, use appropriate intervals based on range size
              const millionRange = range / 1000000;
              if (millionRange <= 3) {
                // For ranges 1-3M, use 0.5M intervals (0, 0.5M, 1M, 1.5M, 2M, 2.5M, 3M)
                return Math.floor(range / 500000);
              } else if (millionRange <= 15) {
                // For ranges 3-15M, use 5M intervals (0, 5M, 10M, 15M)
                return Math.floor(range / 5000000);
              } else if (millionRange <= 50) {
                // For ranges 15-50M, use 5M intervals
                return Math.floor(range / 5000000);
              } else {
                // For ranges > 50M, use 10M intervals
                return Math.floor(range / 10000000);
              }
            } else if (range >= 500000) {
              // For ranges 500K-1M, use 100K intervals
              return Math.floor(range / 100000);
            } else if (range >= 200000) {
              // For ranges 200K-500K, use 50K intervals
              return Math.floor(range / 50000);
            } else if (range >= 100000) {
              // For ranges 100K-200K, use 20K intervals
              // Example: 140K range / 20K = 7 ticks (0, 20K, 40K, 60K, 80K, 100K, 120K, 140K)
              return Math.floor(range / 20000);
            } else if (range >= 50000) {
              // For ranges 50K-100K, use 10K intervals
              return Math.floor(range / 10000);
            } else if (range >= 20000) {
              // For ranges 20K-50K, use 5K intervals
              // Example: 30K range / 5K = 6 ticks (0, 5K, 10K, 15K, 20K, 25K, 30K)
              return Math.floor(range / 5000);
            } else if (range >= 10000) {
              // For ranges 10K-20K, use 2K intervals
              // Example: 14K range / 2K = 7 ticks (0, 2K, 4K, 6K, 8K, 10K, 12K, 14K)
              return Math.floor(range / 2000);
            } else if (range >= 1000) {
              // For ranges 1K-10K, use 1K intervals for whole thousands
              // Example: 7K range / 1K = 7 ticks (0, 1K, 2K, 3K, 4K, 5K, 6K, 7K)
              return Math.floor(range / 1000);
            } else if (range >= 500) {
              // For ranges 500-1000, use 100 intervals
              // Example: 800 range / 100 = 8 ticks (0, 100, 200, ..., 800)
              return Math.floor(range / 100);
            } else if (range >= 200) {
              // For ranges 200-500, use 100 intervals
              // Example: 400 range / 100 = 4 ticks (0, 100, 200, 300, 400)
              return Math.floor(range / 100);
            } else if (range >= 100) {
              // For ranges 100-200, use 50 intervals
              // Example: 200 range / 50 = 4 ticks (0, 50, 100, 150, 200)
              return Math.floor(range / 50);
            } else if (range >= 20 && range < 100) {
              // For ranges 20-100, ensure step sizes are multiples of 1, 2, or 5
              // Use step sizes of 5 or 10 for clean spacing
              let stepSize;
              if (yaxisMax <= 30) {
                stepSize = 5; // For max 20-30, use step of 5 (0, 5, 10, 15, 20, 25, 30)
              } else {
                stepSize = 10; // For max 31-100, use step of 10 (0, 10, 20, 30, 40, 50, ...)
              }
              return Math.floor(range / stepSize);
            } else if (range < 20 && yaxisMax < 20) {
              // For ranges under 20 with yaxisMax under 20, use simple tickAmount based on yaxisMax
              // This approach matches how other projects handle small ranges
              if (yaxisMax === 15) {
                // maxVal 15: use tickAmount = 5 for interval of 3 → ticks: 0, 3, 6, 9, 12, 15 (6 ticks)
                return 5;
              } else if (yaxisMax === 16) {
                // maxVal 16: use tickAmount = 4 for interval of 4 → ticks: 0, 4, 8, 12, 16 (5 ticks)
                return 4;
              } else if (yaxisMax === 18) {
                // maxVal 18: use tickAmount = 6 for interval of 3 → ticks: 0, 3, 6, 9, 12, 15, 18 (7 ticks)
                return 6;
              } else if (yaxisMax === 12) {
                // maxVal 12: use tickAmount = 4 for interval of 3 → ticks: 0, 3, 6, 9, 12 (5 ticks)
                return 4;
              } else if (yaxisMax === 20) {
                // maxVal 20: use tickAmount = 4 for interval of 5 → ticks: 0, 5, 10, 15, 20 (5 ticks)
                return 4;
              } else {
                // Fallback: use tickAmount = 5 for simplicity
                return 5;
              }
            } else {
              // For other ranges, use 5 ticks
              return 5;
            }
          })(),
          labels: {
            formatter: yaxisLabelFormatter,
            style: {
              colors: chartColors.labelColor,
              fontSize: "1.25rem",
            },
            align: chartId === "personnelToCashExpenditure_chart" || chartId === "benefitsToSalaries_chart" ? "left" : undefined,
            hideOverlappingLabels: true,
          },
        }),
      },
    ],
    tooltip: {
      fixed: {
        enabled: true,
        position: "topLeft",
        offsetY: 30,
        offsetX: 60,
      },
      theme: isDarkMode ? "dark" : "light",
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
    },
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

