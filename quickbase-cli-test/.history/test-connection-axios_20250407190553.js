// test-connection.js
// This file tests the connection to your Quickbase application
require("dotenv").config();

// Import the QuickBaseClient from the quickbase package
const { QuickBaseClient } = require("quickbase");

// Configuration for your Quickbase app
const qbConfig = {
  server: `${process.env.QUICKBASE_REALM}.quickbase.com`,
  userToken: process.env.QUICKBASE_USER_TOKEN,
  tempToken: process.env.QUICKBASE_APP_TOKEN || undefined,
  
  // Optional configurations
  timeout: 10000, // timeout in milliseconds
  retryOptions: {
    maxRetries: 3,
    delayMs: 1000
  }
};

// Log configuration for debugging (masking sensitive data)
console.log('Using configuration:');
console.log(`- Server: ${qbConfig.server}`);
console.log(`- User Token: ${qbConfig.userToken ? '********' : 'Not provided'}`);

// Create a QuickBase client instance
const qb = new QuickBaseClient(qbConfig);

// Test the connection by retrieving app info
async function testConnection() {
  try {
    console.log("\nTesting connection to Quickbase...");

    // Get app information using your app ID
    const appId = process.env.QUICKBASE_APP_ID;
    console.log(`- Testing with App ID: ${appId}`);

    // Try to get app info
    console.log("\nAttempting to get app details...");
    const appInfo = await qb.getApp({ appId });
    
    console.log("\nConnection successful!");
    console.log("App Info:", JSON.stringify(appInfo, null, 2));

    // Try to get tables
    console.log("\nRetrieving tables...");
    const tables = await qb.getTablesByAppId({ appId });
    
    console.log(`Successfully retrieved ${tables.length} tables`);
    
    // Print the table names
    if (tables.length > 0) {
      console.log('Tables:');
      tables.forEach((table) => {
        console.log(`- ${table.name} (ID: ${table.id})`);
      });
    }

    return true;
  } catch (error) {
    console.error("\nConnection failed!");
    console.error("Error details:", error.message);

    // Try to provide more detailed error information
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error(
        "Response data:",
        JSON.stringify(error.response.data, null, 2)
      );
    }

    return false;
  }
}

// Run the test
testConnection()
  .then((success) => {
    if (success) {
      console.log("\nAll tests completed successfully!");
    } else {
      console.log("\nConnection test failed. Please check your configuration.");
    }
  })
  .catch((err) => {
    console.error("\nAn unexpected error occurred:", err);
    console.error(err.stack);
  });