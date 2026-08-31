require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const xml2js = require('xml2js');

const realm = process.env.QUICKBASE_REALM || 'capincrouse.quickbase.com';
const appId = process.env.QUICKBASE_APP_ID;
const userToken = process.env.QUICKBASE_USER_TOKEN;
const appToken = process.env.QUICKBASE_APP_TOKEN;

const mapping = {
  'src/Index.html': '227',
  'src/functions/Utility.js': '228',
  'src/Api.js': '229',
  'src/functions/WeightedAverages.js': '230',
  'src/components/Header.js': '231',
  'src/content/DisplayCharts.js': '232',
  'src/content/CreateCharts.js': '233',
  'src/content/uiManagement.js': '234',
  'src/components/Report.js': '235',
  'src/functions/PrintBase64.js': '236',
  'src/functions/PrintExcel.js': '237',
};

const builder = new xml2js.Builder();

async function deploy(filePath, pageId) {
  const body = fs.readFileSync(filePath, 'utf8').replace(/http:\/\//g, 'https://');
  const xml = builder.buildObject({
    qdbapi: {
      $: { version: '1.0' },
      action: 'API_AddReplaceDBPage',
      pageid: pageId,
      pagename: path.basename(filePath),
      pagetype: '1',
      pagebody: body,
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
}

(async () => {
  for (const [filePath, pageId] of Object.entries(mapping)) {
    if (!fs.existsSync(filePath)) {
      console.error(`MISSING  ${filePath}`);
      continue;
    }
    try {
      await deploy(filePath, pageId);
      console.log(`deployed ${filePath.padEnd(38)} -> ${pageId}`);
    } catch (e) {
      console.error(`FAILED   ${filePath.padEnd(38)} -> ${e.message}`);
    }
  }
})()