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
      personnelIncludingToTotalCashExpenditures: [40, 55],
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
        labelColor: "#F9FAFB",       // Lighter label color for dark mode
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

  // Initialize annotation variables
  let yaxisAnnotation;
  let previousData;

  // Chart events for annotation positioning
  const chartEvents = {
    beforeMount: function (chartContext, config) {
      // First, wait for the chart and annotations to be rendered
      setTimeout(() => {
        const chartElement = document.getElementById(chartId);
        if (!chartElement) return;

        // Get the first grid line to use as reference
        const gridLine = chartElement.querySelector(
          `.apexcharts-gridlines-horizontal line`
        );
        if (!gridLine) return;

        // Get the annotation line (y-axis annotation)
        const annotationLine = chartElement.querySelector(
          `.apexcharts-yaxis-annotations line`
        );
        if (!annotationLine) return;

        // Get the exact x1 and x2 values from the grid line
        const x1 = gridLine.getAttribute("x1");
        const x2 = gridLine.getAttribute("x2");

        // Set the annotation line to match exactly
        annotationLine.setAttribute("x1", x1);
        annotationLine.setAttribute("x2", x2);

        // Ensure all annotation lines extend fully across the chart
        const allAnnotationLines = chartElement.querySelectorAll(
          `.apexcharts-yaxis-annotations line`
        );
        allAnnotationLines.forEach((line) => {
          line.setAttribute("x1", x1);
          line.setAttribute("x2", x2);
        });

        // Ensure data labels appear on top of annotations
        const dataLabels = chartElement.querySelectorAll('.apexcharts-datalabels');
        dataLabels.forEach(label => {
          label.style.zIndex = '999';
          label.style.position = 'relative';
        });

        // Ensure annotations appear below data labels
        const annotations = chartElement.querySelectorAll('.apexcharts-annotations');
        annotations.forEach(annotation => {
          annotation.style.zIndex = '1';
          annotation.style.position = 'relative';
        });
      }, 200); // Extra delay to ensure annotations are rendered
    },
    updated: function (chartContext, config) {
      // First, wait for the chart and annotations to be rendered
      const chartElement = document.getElementById(chartId);
      if (!chartElement) return;

      // Get the first grid line to use as reference
      const gridLine = chartElement.querySelector(
        `.apexcharts-gridlines-horizontal line`
      );
      if (!gridLine) return;

      // Get the annotation line (y-axis annotation)
      const annotationLine = chartElement.querySelector(
        `.apexcharts-yaxis-annotations line`
      );
      if (!annotationLine) return;

      // Get the exact x1 and x2 values from the grid line
      const x1 = gridLine.getAttribute("x1");
      const x2 = gridLine.getAttribute("x2");

      // Set the annotation line to match exactly
      annotationLine.setAttribute("x1", x1);
      annotationLine.setAttribute("x2", x2);

      // Ensure all annotation lines extend fully across the chart
      const allAnnotationLines = chartElement.querySelectorAll(
        `.apexcharts-yaxis-annotations line`
      );
      allAnnotationLines.forEach((line) => {
        line.setAttribute("x1", x1);
        line.setAttribute("x2", x2);
      });

      // Ensure data labels appear on top of annotations
      const dataLabels = chartElement.querySelectorAll('.apexcharts-datalabels');
      dataLabels.forEach(label => {
        label.style.zIndex = '999';
        label.style.position = 'relative';
      });

      // Ensure annotations appear below data labels
      const annotations = chartElement.querySelectorAll('.apexcharts-annotations');
      annotations.forEach(annotation => {
        annotation.style.zIndex = '1';
        annotation.style.position = 'relative';
      });
    },
  };
  
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
  
  // Calculate y-axis minimum and maximum, handling negative values
  let yaxisMin, yaxisMax;
  
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

  // Set up annotations based on mainName and benchmark
  if (benchmark !== undefined && benchmark !== null) {
    // Benchmark is always an array with 1 or 2 values
    if (Array.isArray(benchmark)) {
      // Create annotation lines for each benchmark value (1 or 2 lines)
      const benchmarkAnnotations = benchmark.map((value, index) => ({
        id: `annotation_${index}`,
        y: value,
        borderColor: chartColors.labelColor,
        strokeDashArray: 0,
        width: "100%",
        label: {
          text: getBenchmarkLabel(mainName, benchmark, index),
          borderColor: "transparent",
          borderWidth: 0,
          position: "left",
          textAnchor: "start",
          offsetX: -50,
          offsetY: 0,
          style: {
            background: "transparent",
            color: chartColors.labelColor,
            fontSize: "16px",
            fontWeight: 600,
          },
        },
        zIndex: 1,
      }));

      // Add range fill between two benchmarks if there are exactly 2 values
      if (benchmark.length === 2) {
        const lowerValue = Math.min(...benchmark);
        const higherValue = Math.max(...benchmark);
        
        benchmarkAnnotations.push({
          id: 'benchmark_range',
          y: lowerValue,
          y2: higherValue,
          borderColor: 'transparent',
          fillColor: isDarkMode ? '#374151' : window.chartColors.green,
          opacity: 0.15,
          width: "100%",
          zIndex: 0,
        });
      }
      yaxisAnnotation = benchmarkAnnotations;
      previousData = clientArray;
    }
  } else {
    // Ensure yaxisAnnotation is always a valid value (empty array) when no benchmark
    yaxisAnnotation = [];
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
      events: chartEvents,
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
        enabled: true,
        foreColor: isDarkMode ? "#1F2937" : window.chartColors.green,
        padding: 4,
        borderRadius: 2,
        borderWidth: 1,
        borderColor: isDarkMode ? "#374151" : "#ffffff",
        opacity: isDarkMode ? 0.9 : 0.7,
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
          forceNiceScale: false,
          tickAmount: 4,
          floating: false,
          decimalsInFloat: 1,
          labels: {
            ...((dataMax <= 10) && {
              show: true,
              hideOverlappingLabels: false,
            }),
            formatter: (value) => {
              const roundedValue = Math.round(value * 2) / 2;
              
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
              // For ranges >= 1M, calculate ticks based on the rounded max
              // Since yaxisMax is rounded to nearest 2M, use 2M intervals
              // Example: 12M range = 6 ticks (0, 2M, 4M, 6M, 8M, 10M, 12M = 7 labels)
              const millionRange = range / 1000000;
              if (millionRange <= 4) {
                // For ranges 1-4M, use 1M intervals
                return Math.floor(millionRange);
              } else if (millionRange <= 20) {
                // For ranges 4-20M (rounded to even 2M), use 2M intervals
                // tickAmount = range / 2M
                return Math.floor(range / 2000000);
              } else if (millionRange <= 50) {
                // For ranges 20-50M, use 5M intervals
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
    annotations: {
      yaxis: yaxisAnnotation,
    },
      tooltip: {
        fixed: {
          enabled: true,
        position: "topLeft",
          offsetY: 30,
        offsetX: 60,
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

// Global function to position annotation labels for all charts
window.positionAllAnnotationLabels = function() {
  const chartIds = [
    "givingUnits_chart",
    "givingUnitsToStaff_chart",
    "contributionsWithoutDonorExcludingLargeGifts_chart", 
    "daysExpendableNetAssets_chart",
    "daysOperatingCash_chart",
    "cashFlowsFromOperatingActivities_chart",
    "liquidityRatio_chart",
    "netCashAvailability_chart",
    "debtToContributionsWithout_chart",
    "currentRatio_chart",
    "mandatoryDebtServiceToContributionsWithout_chart",
    "debtPerGivingUnit_chart",
    "debtCoverage_chart",
    "netIncomeRatio_chart",
    "contributionsWithoutDonorPerGivingUnit_chart",
    "totalContributionsPerGivingUnit_chart",
    "benefitsToSalaries_chart",
    "salariesBenefitsIncludingOutsourcedEmployees_chart",
    "personnelToCashExpenditure_chart",
    "cashExpendituresPerGivingUnit_chart",
  ];

  chartIds.forEach(chartId => {
    const chartElement = document.getElementById(chartId);
    if (!chartElement) return;

    // Get the first grid line to use as reference
    const gridLine = chartElement.querySelector(
      `.apexcharts-gridlines-horizontal line`
    );
    if (!gridLine) return;

    // Get the annotation line (y-axis annotation)
    const annotationLine = chartElement.querySelector(
      `.apexcharts-yaxis-annotations line`
    );
    if (!annotationLine) return;

    // Get the exact x1 and x2 values from the grid line
    const x1 = gridLine.getAttribute("x1");
    const x2 = gridLine.getAttribute("x2");

    // Set the annotation line to match exactly
    annotationLine.setAttribute("x1", x1);
    annotationLine.setAttribute("x2", x2);

    // Ensure all annotation lines extend fully across the chart
    const allAnnotationLines = chartElement.querySelectorAll(
      `.apexcharts-yaxis-annotations line`
    );
    allAnnotationLines.forEach((line) => {
      line.setAttribute("x1", x1);
      line.setAttribute("x2", x2);
    });
  });
};

// Call the function after a delay to ensure all charts are rendered
setTimeout(() => {
  if (typeof window.positionAllAnnotationLabels === 'function') {
    window.positionAllAnnotationLabels();
  }
}, 1000);
