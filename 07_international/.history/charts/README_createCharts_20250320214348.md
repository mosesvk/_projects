Chart System Architecture
Overview
The chart system has been refactored to follow object-oriented programming and clean code principles. The new architecture separates concerns, improves maintainability, and makes it easier to extend the system with new chart types.
Key Components
1. ChartSystem.js
Core class for managing chart instances and handling modal updates. It provides:

Chart creation and rendering
Theme-based updates
Modal management for displaying chart data

2. ChartConfigFactory.js
Factory class for creating chart configurations. It:

Generates configurations based on chart type
Handles theme-based styling
Provides specialized formatters for different data types

3. ChartManager.js
Main entry point for creating and managing charts. It:

Creates charts from parsed data
Updates chart modals
Manages chart lifecycle

4. ChartDisplayComponents.js
Module for displaying charts in different sections of the application:

General component
Cash component
Income component
Expense component

5. index.js
Main entry point that ties everything together:

Initializes the chart system
Registers event listeners
Provides global access to chart functions

Data Flow

Data Retrieval: Data is fetched from API and parsed
Configuration: ChartConfigFactory creates chart options based on data type
Rendering: ChartManager creates and renders chart instances
Display: ChartDisplayComponents organizes charts into sections
Updates: Charts automatically update when data or theme changes

Chart Types
The system supports various chart types:

Main Charts: Standard charts with client data bars and peer averages lines
Line Charts: Line-based charts for trend data
Functional Allocation: Stacked bar charts for expense breakdowns
Cost of Contributions: Mixed bar/line charts with dual Y-axes
Net Asset Breakdown: Grouped bar charts for asset categories

Using the System
Creating a New Chart
javascriptCopy// Create a chart from parsed data
chartManager.createChartFromParsedData(
  parsedData,            // Data source
  "myChart_id",          // DOM element ID
  "peerDataKey",         // Key for peer data in parsed data
  "clientDataKey",       // Key for client data in parsed data
  "dollar",              // Data type (dollar, percent, number)
  0,                     // Decimal places
  "chartName",           // Unique name for the chart
  false,                 // Whether to use weighted average
  null,                  // Benchmark value (optional)
  "Chart Title",         // Chart title (optional)
  "line"                 // Chart type (optional)
);
Creating a Cash Flow Chart
javascriptCopychartManager.createCashFlowChart(
  "cashFlow_chart_id",
  parsedData,
  [
    "financingKey",
    "investingKey",
    "operatingKey",
    "totalKey"
  ]
);
Accessing Chart Instances
javascriptCopy// Get a chart instance
const chart = chartManager.getChart("myChart_id");

// Update chart options
chartManager.updateChartOptions("myChart_id", newOptions);

// Destroy all charts
chartManager.destroyAllCharts();
Best Practices

Use Meaningful Names: Chart IDs and names should reflect their purpose
Match Data Types: Ensure correct data type (dollar, percent, number)
Provide Proper Formatting: Use appropriate number of decimal places
Handle Errors: Check for null/undefined data before creating charts
Clean Up: Destroy charts when no longer needed

Extending the System
To add a new chart type:

Add a new configuration method in ChartConfigFactory
Add handling for the new type in createConfig
Update ChartManager to support the new type
Create display methods in ChartDisplayComponents