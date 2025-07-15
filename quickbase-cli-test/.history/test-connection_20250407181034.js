// test-connection.js
// This file tests the connection to your Quickbase application

const QuickBase = require('quickbase');

// Configuration for your Quickbase app
const qbConfig = {
  realm: 'YOUR_REALM', // e.g. 'yourcompany' if your URL is yourcompany.quickbase.com
  userToken: 'YOUR_USER_TOKEN', // your user token from Quickbase user settings
  appToken: 'YOUR_APP_TOKEN', // (optional) your app token if you use one
  
  // Optional configurations
  connectionLimit: 10, // number of concurrent connections allowed
  connectionLimitPeriod: 1000, // time in milliseconds for connection limit
  errorOnConnectionLimit: true, // throw error when connection limit reached
  useAgent: true // enable persistent connections
};

// Create a Quickbase client instance
const qb = new QuickBase(qbConfig);

// Test the connection by retrieving app info
async function testConnection() {
  try {
    console.log('Testing connection to Quickbase...');
    
    // Get app information using your app ID
    const appId = 'YOUR_APP_ID';
    
    // Get tables in your app (this is a good connection test)
    const tablesResponse = await qb.getTables({
      appId: appId
    });
    
    console.log('Connection successful!');
    console.log(`Successfully retrieved ${tablesResponse.length} tables`);
    
    // Print the table names
    if (tablesResponse.length > 0) {
      console.log('Tables:');
      tablesResponse.forEach(table => {
        console.log(`- ${table.name} (ID: ${table.id})`);
      });
    }
    
    // Try to get some basic app info
    console.log('\nAttempting to get app details...');
    const appInfo = await qb.getApp({
      appId: appId
    });
    
    console.log('App Info:', JSON.stringify(appInfo, null, 2));
    
    return true;
  } catch (error) {
    console.error('Connection failed!');
    console.error('Error details:', error.message);
    
    // Try to provide more detailed error information
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
    
    return false;
  }
}

// Run the test
testConnection()
  .then(success => {
    if (success) {
      console.log('All tests completed successfully!');
    } else {
      console.log('Connection test failed. Please check your configuration.');
    }
  })
  .catch(err => {
    console.error('An unexpected error occurred:', err);
  });