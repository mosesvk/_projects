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
      daysExpendableNetAssets: [60],
      daysOperatingCash: [90],
      availableDaysOfCashFlow: [120, 180],
      liquidityRatio: [5],
      netCashAvailability: null,
  
      // Debt
      debtToContributionsWithout: [2],
      currentRatio: [2],
      cashFlowsFromOperatingActivities: [0],
      mandatoryDebtServiceToContributionsWithout: [20],
      debtPerGivingUnit: null,
      debtCoverage: [1.25],
  
      // Income
      netIncomeRatio: [0], // positive is good
      contributionsWithoutDonorPerGivingUnit: null,
      totalContributionsPerGivingUnit: [4500],
  
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
      
      // General (standard project specific)
      givingUnits: null,
      givingUnitsToStaff: null,
      contributionsWithoutDonorExcludingLargeGifts: null,
      
      // Expense (standard project specific)
      cashExpendituresPerGivingUnit: null,
    };
  
    return Object.prototype.hasOwnProperty.call(map, fieldName)
      ? map[fieldName]
      : null;
  };
  
  /**
   * Get the appropriate benchmark label based on field name and benchmark values
   * @param {string} fieldName - The field name to get benchmark label for
   * @param {Array} benchmarkArray - Array of benchmark values (1 or 2 values)
   * @param {number} index - Index of current benchmark (0 or 1)
   * @returns {string} The appropriate benchmark label
   */
  window.getBenchmarkLabel = function getBenchmarkLabel(fieldName, benchmarkArray, index) {
    if (benchmarkArray.length === 1) {
      return "Benchmark";
    }
  
    // For two benchmarks, determine which is higher/lower based on field type
    const isHigherBetter = isFieldHigherBetter(fieldName);
    const lowerValue = Math.min(...benchmarkArray);
    const higherValue = Math.max(...benchmarkArray);
    const currentValue = benchmarkArray[index];
  
    if (isHigherBetter) {
      // For fields where higher values are better
      return currentValue === higherValue ? "Benchmark - higher end" : "Benchmark - lower end";
    } else {
      // For fields where lower values are better
      return currentValue === lowerValue ? "Benchmark - higher end" : "Benchmark - lower end";
    }
  };
  
  /**
   * Determine if higher values are better for a given field
   * @param {string} fieldName - The field name to check
   * @returns {boolean} True if higher values are better, false if lower values are better
   */
  function isFieldHigherBetter(fieldName) {
    const higherIsBetter = [
      'givingUnits',
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
  

const positionChartTooltip = (chartId) => {
  const chartElement = document.getElementById(chartId);
  if (!chartElement) return;
  const tooltipEl = chartElement.querySelector(".apexcharts-tooltip");
  if (!tooltipEl || tooltipEl.style.opacity === "0" || tooltipEl.style.display === "none") {
    return;
  }

  const chartRect = chartElement.getBoundingClientRect();
  const tooltipRect = tooltipEl.getBoundingClientRect();
  const margin = 12;

  // Compute where the tooltip is currently centered relative to the chart.
  const tooltipCenterX = tooltipRect.left + tooltipRect.width / 2;
  const chartMidX = chartRect.left + chartRect.width / 2;

  // Decide whether to place the tooltip to the right or left of the bar band.
  let newLeft;
  if (tooltipCenterX <= chartMidX) {
    // On the left half of the chart: show tooltip to the right of the bar.
    newLeft = tooltipCenterX + margin;
  } else {
    // On the right half of the chart: show tooltip to the left of the bar.
    newLeft = tooltipCenterX - tooltipRect.width - margin;
  }

  // Clamp horizontally within the chart area.
  const minLeft = chartRect.left + margin;
  const maxLeft = chartRect.right - margin - tooltipRect.width;
  if (newLeft < minLeft) newLeft = minLeft;
  if (newLeft > maxLeft) newLeft = maxLeft;

  // Nudge the tooltip slightly upward to avoid overlapping the bar value label.
  const currentTop = tooltipRect.top;
  const newTop = currentTop - chartRect.top - 24;

  tooltipEl.style.left = `${newLeft - chartRect.left}px`;
  tooltipEl.style.top = `${newTop}px`;
  tooltipEl.style.transform = "none";
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

  // Get selected years - ensure we get the most up-to-date version
  let selectedYearsArray = getSelectedYearsFromLocalStorage() || [];
  
  // Validate and ensure selectedYearsArray is an array
  if (!Array.isArray(selectedYearsArray)) {
    // console.warn("selectedYears is not an array, converting:", selectedYearsArray);
    selectedYearsArray = [];
  }

  // Validate that we have years selected
  if (!selectedYearsArray || selectedYearsArray.length === 0) {
    // console.warn("No years selected for chart:", mainName);
    return null; // Return null to prevent chart creation
  }
  
  // Ensure we only use the selected years (defensive check)
  // Sort years to ensure consistent ordering
  selectedYearsArray = selectedYearsArray.sort((a, b) => a - b);

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
  const allDataValues = [...clientArray, ...peerAvg, ...peerMid, ...peer25, ...peer75, ...(benchmark || [])].filter(v => v !== null && v !== undefined);
  const dataMin = Math.min(...allDataValues);
  const dataMax = Math.max(...allDataValues);
  const dataRange = dataMax - dataMin;
  
  // Calculate y-axis minimum and maximum, handling negative values
  
  if (dataMin < 0) {
    // If we have negative values, create symmetric or balanced axis
    const absMax = Math.max(Math.abs(dataMin), Math.abs(dataMax));
    const maxMagnitude = absMax;
    
    // Calculate padding based on magnitude (not just positive range)
    let paddingForNegative;
    if (maxMagnitude <= 10) {
      paddingForNegative = 1;
    } else if (maxMagnitude <= 100) {
      paddingForNegative = Math.ceil(maxMagnitude * 0.1);
    } else if (maxMagnitude <= 1000) {
      paddingForNegative = Math.ceil(maxMagnitude * 0.1);
    } else if (maxMagnitude <= 10000) {
      paddingForNegative = Math.ceil(maxMagnitude * 0.1);
    } else if (maxMagnitude <= 100000) {
      paddingForNegative = Math.ceil(maxMagnitude * 0.1);
    } else {
      paddingForNegative = Math.ceil(maxMagnitude * 0.1);
    }
    
    const paddedMagnitude = maxMagnitude + paddingForNegative;
    
    // Round the magnitude to nice values using the same logic as positive values
    let roundedMagnitude;
    if (paddedMagnitude >= 100000000) {
      roundedMagnitude = Math.ceil(paddedMagnitude / 10000000) * 10000000;
    } else if (paddedMagnitude >= 50000000) {
      roundedMagnitude = Math.ceil(paddedMagnitude / 10000000) * 10000000;
    } else if (paddedMagnitude >= 10000000) {
      roundedMagnitude = Math.ceil(paddedMagnitude / 5000000) * 5000000;
    } else if (paddedMagnitude >= 1000000) {
      roundedMagnitude = Math.ceil(paddedMagnitude / 2000000) * 2000000;
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
      roundedMagnitude = Math.ceil(paddedMagnitude / 4000) * 4000;
    } else if (paddedMagnitude >= 1000) {
      roundedMagnitude = Math.ceil(paddedMagnitude / 1000) * 1000;
    } else if (paddedMagnitude >= 100) {
      roundedMagnitude = Math.ceil(paddedMagnitude / 100) * 100;
    } else if (paddedMagnitude >= 50) {
      roundedMagnitude = paddedMagnitude <= 55 ? 50 : Math.ceil(paddedMagnitude / 10) * 10;
    } else if (paddedMagnitude >= 40) {
      roundedMagnitude = Math.ceil(paddedMagnitude / 10) * 10;
    } else {
      roundedMagnitude = Math.ceil(paddedMagnitude / 4) * 4;
    }
    
    // Set symmetric min and max
    yaxisMin = -roundedMagnitude;
    yaxisMax = roundedMagnitude;
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
    } else if (rawMax >= 1000000) {
      // For values >= 1M, round up to nearest 2M for clean 2M intervals
      // This ensures ranges like 10.67M become 12M, giving ticks at 0, 2, 4, 6, 8, 10, 12
      yaxisMax = Math.ceil(rawMax / 2000000) * 2000000;
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

  // Single benchmark line per chart (same style as higherEd); label on the right, past the last bar
  const selectedYearsLength = selectedYearsArray.length;
  let offsetXRight;
  switch (selectedYearsLength) {
    case 1:
      offsetXRight = 80;
      break;
    case 2:
    case 3:
      offsetXRight = 120;
      break;
    case 4:
    case 5:
      offsetXRight = 180;
      break;
    case 6:
      offsetXRight = 220;
      break;
    case 7:
      offsetXRight = 260;
      break;
    case 8:
      offsetXRight = 300;
      break;
    case 9:
      offsetXRight = 340;
      break;
    case 10:
      offsetXRight = 380;
      break;
    case 11:
      offsetXRight = 420;
      break;
    default:
      offsetXRight = 120;
  }

  const yaxisAnnotations = [];
  if (benchmark && Array.isArray(benchmark) && benchmark.length > 0) {
    // Use one benchmark value: for 2-value ranges use the lower end (minimum threshold)
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
        const gridLine = chartElement.querySelector(
          ".apexcharts-gridlines-horizontal line"
        );
        if (!gridLine) return;
        const annotationLines = chartElement.querySelectorAll(
          ".apexcharts-yaxis-annotations line"
        );
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
      // Re-apply benchmark annotations if they were removed when all trend lines (Avg, 25th, 50th, 75th) are hidden.
      // Defer so we run after ApexCharts has finished updating; use redrawPaths: true so annotations actually redraw.
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
      const gridLine = chartElement.querySelector(
        ".apexcharts-gridlines-horizontal line"
      );
      if (!gridLine) return;
      const annotationLines = chartElement.querySelectorAll(
        ".apexcharts-yaxis-annotations line"
      );
      const x1 = gridLine.getAttribute("x1");
      const x2 = gridLine.getAttribute("x2");
      annotationLines.forEach((line) => {
        line.setAttribute("x1", x1);
        line.setAttribute("x2", x2);
      });
    },
    mouseMove: function (event, chartContext, config) {
      positionChartTooltip(chartId);
    },
    dataPointMouseEnter: function (event, chartContext, config) {
      positionChartTooltip(chartId);
    },
  };

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

