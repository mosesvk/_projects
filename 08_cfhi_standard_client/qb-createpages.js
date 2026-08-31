require('dotenv').config();
const axios = require('axios');
const xml2js = require('xml2js');

const realm = process.env.QUICKBASE_REALM || 'capincrouse.quickbase.com';
const appId = process.env.QUICKBASE_APP_ID;
const userToken = process.env.QUICKBASE_USER_TOKEN;
const appToken = process.env.QUICKBASE_APP_TOKEN;

const pages = {
  'Index.html': 'cfhi_client.html',
  'Utility.js': 'cfhi_client_utility.js',
  'Api.js': 'cfhi_client_api.js',
  'WeightedAverages.js': 'cfhi_client_weightedAverage.js',
  'Header.js': 'cfhi_client_header.js',
  'DisplayCharts.js': 'cfhi_client_chartDisplay.js',
  'CreateCharts.js': 'cfhi_client_chartCreate.js',
  'uiManagement.js': 'cfhi_client_uiManagement.js',
  'Report.js': 'cfhi_client_report.js',
  'PrintBase64.js': 'cfhi_client_printBase64.js',
  'PrintExcel.js': 'cfhi_client_printExcel.js',
};

const builder = new xml2js.Builder();

async function createPage(pageName) {
  const xml = builder.buildObject({
    qdbapi: {
      $: { version: '1.0' },
      action: 'API_AddReplaceDBPage',
      pagename: pageName,
      pagetype: '1',
      pagebody: '/* placeholder */',
    },
  });

  const res = await axios.post(`https://${realm}/db/${appId}`, xml, {
    headers: {
      'Content-Type': 'text/xml',
      'QUICKBASE-ACTION': 'API_AddReplaceDBPage',
      'Authorization': `QB-USER-TOKEN ${userToken}`,
      'QB-APP-TOKEN': appToken,
    },
  });

  const result = await xml2js.parseStringPromise(res.data);
  if (result.qdbapi?.errcode?.[0] !== '0') {
    throw new Error(result.qdbapi?.errtext?.[0] || 'unknown error');
  }
  return result.qdbapi.pageID[0];
}

(async () => {
  const mapping = {};
  for (const [file, pageName] of Object.entries(pages)) {
    try {
      const id = await createPage(pageName);
      mapping[file] = id;
      console.log(`created  ${pageName.padEnd(34)} -> ${id}`);
    } catch (e) {
      console.error(`FAILED   ${pageName.padEnd(34)} -> ${e.message}`);
    }
  }

  console.log('\n--- paste into qb-deploy.js pageMapping ---\n');
  for (const [file, id] of Object.entries(mapping)) {
    console.log(`    '${file}': '${id}',`);
  }
})();