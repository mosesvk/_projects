require("dotenv").config();
const axios = require("axios");
const x = require("xml2js");
const b = new x.Builder();
const realm = process.env.QUICKBASE_REALM, app = process.env.QUICKBASE_APP_ID;
const hdr = a => ({
  "Content-Type": "text/xml",
  "QUICKBASE-ACTION": a,
  "Authorization": "QB-USER-TOKEN " + process.env.QUICKBASE_USER_TOKEN,
  "QB-APP-TOKEN": process.env.QUICKBASE_APP_TOKEN
});
const marker = "deploy test v2 " + Date.now();
const put = b.buildObject({ qdbapi: { $: { version: "1.0" }, action: "API_AddReplaceDBPage", pageid: "225", pagename: "zz_deploy_test.html", pagetype: "1", pagebody: "<h1>" + marker + "</h1>" } });
axios.post("https://" + realm + "/db/" + app, put, { headers: hdr("API_AddReplaceDBPage") })
  .then(r => x.parseStringPromise(r.data))
  .then(p => { console.log("write errcode:", p.qdbapi.errcode[0]); })
  .then(() => {
    const get = b.buildObject({ qdbapi: { $: { version: "1.0" }, action: "API_GetDBPage", pageid: "225" } });
    return axios.post("https://" + realm + "/db/" + app, get, { headers: hdr("API_GetDBPage") });
  })
  .then(r => {
    console.log("expected marker:", marker);
    console.log("found in page:", String(r.data).includes(marker));
  })
  .catch(e => console.log("ERR", e.message));
