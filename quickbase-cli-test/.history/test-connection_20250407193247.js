// test-connection.js
require('dotenv').config();
const axios = require('axios');

// Validate environment variables
console.log('Environment Variables:');
console.log('- QB_APP_ID:', process.env.QB_APP_ID ? 'Set' : 'Not set');
console.log('- QB_REALM:', process.env.QB_REALM ? process.env.QB_REALM : 'Not set');
console.log('- QB_USER_TOKEN:', process.env.QB_USER_TOKEN ? 'Set (hidden)' : 'Not set');

// Try different formats for the realm
const realmOptions = [
  process.env.QB_REALM,
  process.env.QB_REALM.replace('.quickbase.com', ''),
  `${process.env.QB_REALM.replace('.quickbase.com', '')}.quickbase.com`
];

async function testWithRealm(realm) {
  console.log(`\nTesting with realm: ${realm}`);
  
  try {
    // Try getting app info as our test
    const appResponse = await axios({
      method: 'get',
      url: `https://api.quickbase.com/v1/apps/${process.env.QB_APP_ID}`,
      headers: {
        'QB-Realm-Hostname': realm,
        'Authorization': `QB-USER-TOKEN ${process.env.QB_USER_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✓ Connection successful!');
    console.log('App Info:', JSON.stringify(appResponse.data, null, 2));
    
    // Try getting tables
    const tablesResponse = await axios({
      method: 'get',
      url: 'https://api.quickbase.com/v1/tables',
      params: {
        appId: process.env.QB_APP_ID
      },
      headers: {
        'QB-Realm-Hostname': realm,
        'Authorization': `QB-USER-TOKEN ${process.env.QB_USER_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`✓ Successfully retrieved ${tablesResponse.data.length} tables`);
    
    if (tablesResponse.data.length > 0) {
      console.log('\nTables:');
      tablesResponse.data.forEach(table => {
        console.log(`- ${table.name} (ID: ${table.id})`);
      });
    }
    
    return { success: true, realm };
  } catch (error) {
    console.error(`❌ Test failed with realm "${realm}"`);
    
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Error details:', error.message);
    }
    
    return { success: false };
  }
}

async function testConnection() {
  console.log('\nTesting connection to Quickbase using different realm formats...');
  
  // Try each realm format until one works
  for (const realm of realmOptions) {
    console.log(`\nAttempting connection with realm: ${realm}`);
    const result = await testWithRealm(realm);
    
    if (result.success) {
      console.log(`\n✅ Connection successful with realm: ${result.realm}`);
      console.log('Use this realm format in your configuration.');
      return true;
    }
  }
  
  console.error('\n❌ All connection attempts failed.');
  console.error('Possible solutions:');
  console.error('1. Check if your user token is correct and not expired');
  console.error('2. Verify that the app ID is correct');
  console.error('3. Ensure your user has API access permissions in Quickbase');
  console.error('4. Try generating a new user token in Quickbase');
  
  return false;
}

testConnection()
  .then(success => {
    if (success) {
      console.log('\n✅ Test completed successfully!');
    } else {
      console.log('\n❌ All tests failed. Please check your configuration.');
    }
  })
  .catch(err => {
    console.error('\nAn unexpected error occurred:', err);
  });