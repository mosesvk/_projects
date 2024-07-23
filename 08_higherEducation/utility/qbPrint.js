const urlUploadFile =
  "https://capincrouse.quickbase.com/db/bub5a8w2g?a=API_AddRecord";
let uploadMainFile = "";
const printButton = document.getElementById("printCharts");

const mainPrint = () => {
  uploadMainFile += "<qdbapi><apptoken>bpat4pgu9t69yby5gbemdbej52j</apptoken>";
  uploadSingleToFile(6, map_dataUri.get("cfiRatio"));
//   uploadSingleToFile(8, map_dataUri.get("financialAnalysisContent"));
  uploadMainFile += "</qdbapi>";

  console.log({ uploadMainFile });

  $.ajax({
    type: "POST",
    contentType: "text/xml",
    async: true,
    url: urlUploadFile,
    dataType: "xml",
    processData: false,
    data: uploadMainFile,
    success: function (response) {
      var xmlUpload = $(response);
      console.log(response);
      console.log(xmlUpload);
      newRecordID = xmlUpload[0].all[4].innerHTML;
      //console.log(newRecordID)

      if (xmlUpload.find("qdbapi").find("errcode").text() == "0") {
        newDownloadURL = xmlUpload
          .find("qdbapi")
          .find("record")
          .find("f")
          .text();
      } else {
        console.log("Quickbase returned an error.");
        createToastWarning(
          `Quickbase returned an error: if (xmlUpload.find("qdbapi").find("errcode").text() == "0")`
        );
      }
    },
    error: function (err) {
      // console.log("Quickbase returned an error: " + response);
      console.log(err);
      createToastWarning(`Quickbase returned an error: ${err}`);
    },
  }); //end ajax call
};

function uploadSingleToFile(id, val) {
  uploadMainFile += `<field fid='${id}'>${val}</field>`;
}

printButton.addEventListener("click", mainPrint); //uploadToFile
