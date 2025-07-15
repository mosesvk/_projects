// test-connection.js
// Direct API call to Quickbase using axios
require("dotenv").config();
const axios = require("axios");

console.log('Environment Variables:');
console.log('- QB_APP_ID:', process.env.QB_APP_ID ? 'Set' : 'Not set');
console.log('- QB_REALM:', process.env.QB_REALM ? process.env.QB_REALM : 'Not set');
console.log('- QB_USER_TOKEN:', process.env.QB_USER_TOKEN ? 'Set (hidden)' : 'Not set');

// Make sure to run: npm install axios

async function testConnection() {
  try {
    console.log("Testing connection to Quickbase using direct API calls...");
    
    const appId = process.env.QB_APP_ID;
    const realm = process.env.QB_REALM;
    const userToken = process.env.QB_USER_TOKEN;
    
    console.log(`- Testing with App ID: ${appId}`);
    console.log(`- Using realm: ${realm}`);
    
    // Get app info
    const response = await axios({
      method: 'get',
      url: `https://api.quickbase.com/v1/apps/${appId}`,
      headers: {
        'QB-Realm-Hostname': `${realm}`,
        'Authorization': `QB-USER-TOKEN ${userToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log("\nConnection successful!");
    console.log("App Info:", JSON.stringify(response.data, null, 2));
    
    // Get tables
    const tablesResponse = await axios({
      method: 'get',
      url: `https://api.quickbase.com/v1/tables?appId=${appId}`,
      headers: {
        'QB-Realm-Hostname': `${realm}`,
        'Authorization': `QB-USER-TOKEN ${userToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`\nSuccessfully retrieved ${tablesResponse.data.length} tables`);
    
    if (tablesResponse.data.length > 0) {
      console.log('Tables:');
      tablesResponse.data.forEach(table => {
        console.log(`- ${table.name} (ID: ${table.id})`);
      });
    }
    
    return true;
  } catch (error) {
    console.error("\nConnection failed!");
    
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error("Response data:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.error("Error details:", error.message);
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
  });