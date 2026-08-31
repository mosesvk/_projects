require("dotenv").config();
const axios = require("axios");
const x = require("xml2js");
const b = new x.Builder();
const q = b.buildObject({ qdbapi: { $: { version: "1.0" }, action: "API_GetDBPage", pageid: "152" } });
axios.post("https://" + process.env.QUICKBASE_REALM + "/db/" + process.env.QUICKBASE_APP_ID, q, {
  headers: {
    "Content-Type": "text/xml",
    "QUICKBASE-ACTION": "API_GetDBPage",
    "Authorization": "QB-USER-TOKEN " + process.env.QUICKBASE_USER_TOKEN,
    "QB-APP-TOKEN": process.env.QUICKBASE_APP_TOKEN
  }
})
  .then(r => x.parseStringPromise(r.data))
  .then(p => {
    console.log("errcode:", p.qdbapi.errcode[0]);
    console.log("errtext:", p.qdbapi.errtext ? p.qdbapi.errtext[0] : "none");
    console.log("pagename:", p.qdbapi.pagename ? p.qdbapi.pagename[0] : "N/A");
    console.log("body length:", p.qdbapi.pagebody ? String(p.qdbapi.pagebody[0]).length : 0);
  })
  .catch(e => console.log("ERR", e.message));
