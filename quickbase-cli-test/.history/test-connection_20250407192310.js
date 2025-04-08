// test-connection.js
require('dotenv').config();
const axios = require('axios');

// Validate environment variables
console.log('Environment Variables:');
console.log('- QB_APP_ID:', process.env.QB_APP_ID ? 'Set' : 'Not set');
console.log('- QB_REALM:', process.env.QB_REALM ? process.env.QB_REALM : 'Not set');
console.log('- QB_USER_TOKEN:', process.env.QB_USER_TOKEN ? 'Set (hidden)' : 'Not set');

async function testConnection() {
  try {
    console.log('\nTesting connection to Quickbase using direct API calls...');
    console.log('- Testing with App ID:', process.env.QB_APP_ID);
    console.log('- Using realm:', process.env.QB_REALM);

    // First try connecting to the user endpoint to verify credentials
    console.log('\nTesting user authentication...');
    const userResponse = await axios({
      method: 'get',
      url: 'https://api.quickbase.com/v1/userinfo',
      headers: {
        'QB-Realm-Hostname': process.env.QB_REALM,
        'Authorization': `QB-USER-TOKEN ${process.env.QB_USER_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✓ Authentication successful!');
    console.log('User Info:', JSON.stringify(userResponse.data, null, 2));
    
    // Now try getting the app info with a revised endpoint
    console.log('\nTesting app access...');
    const appResponse = await axios({
      method: 'get',
      url: `https://api.quickbase.com/v1/apps/${process.env.QB_APP_ID}`,
      headers: {
        'QB-Realm-Hostname': process.env.QB_REALM,
        'Authorization': `QB-USER-TOKEN ${process.env.QB_USER_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✓ App access successful!');
    console.log('App Info:', JSON.stringify(appResponse.data, null, 2));
    
    // Try getting tables with the revised endpoint
    console.log('\nTesting table access...');
    const tablesResponse = await axios({
      method: 'get',
      url: `https://api.quickbase.com/v1/tables`,
      params: {
        appId: process.env.QB_APP_ID
      },
      headers: {
        'QB-Realm-Hostname': process.env.QB_REALM,
        'Authorization': `QB-USER-TOKEN ${process.env.QB_USER_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✓ Table access successful!');
    console.log(`Retrieved ${tablesResponse.data.length} tables`);
    
    if (tablesResponse.data.length > 0) {
      console.log('\nTables:');
      tablesResponse.data.forEach(table => {
        console.log(`- ${table.name} (ID: ${table.id})`);
      });
    }
    
    return true;
  } catch (error) {
    console.error('\n❌ Connection failed!');
    
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
      
      // Provide more detailed guidance based on status codes
      if (error.response.status === 400) {
        console.error('\nPossible solutions for 400 Bad Request:');
        console.error('1. Check if the API endpoint URL is correctly formatted');
        console.error('2. Make sure the app ID format is correct');
        console.error('3. Verify that all required parameters are included');
      } else if (error.response.status === 401) {
        console.error('\nPossible solutions for 401 Unauthorized:');
        console.error('1. Check if your user token is correct and not expired');
        console.error('2. Make sure there are no extra spaces or line breaks in your token');
      } else if (error.response.status === 403) {
        console.error('\nPossible solutions for 403 Forbidden:');
        console.error('1. Check if your user has permission to access this app/resource');
      }
    } else {
      console.error('Error details:', error.message);
    }
    
    return false;
  }
}

// Run the test
testConnection()
  .then((success) => {
    if (success) {
      console.log('\n✅ All tests completed successfully!');
    } else {
      console.log('\n❌ Test failed. Please check your configuration.');
    }
  })
  .catch((err) => {
    console.error('\n❌ An unexpected error occurred:', err);
  });