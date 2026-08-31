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
  .then(r => {
    console.log("raw length:", r.data.length);
    console.log("--- first 600 chars ---");
    console.log(String(r.data).slice(0, 600));
  })
  .catch(e => console.log("ERR", e.message));
