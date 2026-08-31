require("dotenv").config();
const axios = require("axios");
const x = require("xml2js");
const b = new x.Builder();
const q = b.buildObject({ qdbapi: { $: { version: "1.0" }, action: "API_AddReplaceDBPage", pagename: "zz_deploy_test.html", pagetype: "1", pagebody: "<h1>deploy test v1</h1>" } });
axios.post("https://" + process.env.QUICKBASE_REALM + "/db/" + process.env.QUICKBASE_APP_ID, q, {
  headers: {
    "Content-Type": "text/xml",
    "QUICKBASE-ACTION": "API_AddReplaceDBPage",
    "Authorization": "QB-USER-TOKEN " + process.env.QUICKBASE_USER_TOKEN,
    "QB-APP-TOKEN": process.env.QUICKBASE_APP_TOKEN
  }
})
  .then(r => x.parseStringPromise(r.data))
  .then(p => {
    console.log("errcode:", p.qdbapi.errcode[0]);
    console.log("errtext:", p.qdbapi.errtext ? p.qdbapi.errtext[0] : "none");
    console.log("pageID:", p.qdbapi.pageID ? p.qdbapi.pageID[0] : "N/A");
  })
  .catch(e => console.log("ERR", e.message));
