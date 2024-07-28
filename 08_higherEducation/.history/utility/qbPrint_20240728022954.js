const urlUploadFile =
  "https://capincrouse.quickbase.com/db/bub5a8w2g?a=API_AddRecord";
let uploadMainFile = "";
const printButton = document.getElementById("printCharts");

async function svgToPngBase64(element, id) {
    let canvasElement = document.createElement("canvas");
    canvasElement.id = "canvas";
    document.body.appendChild(canvasElement);
  
    html2canvas(element).then(function (canvas) {
      let picture = document.getElementById("canvas").appendChild(canvas);
      let base64String = canvas.toDataURL("image/png");
      const exportString = base64String.slice("data:image/png;base64,".length);
      map_dataUri.set(id, exportString)
      picture.remove();
    });
  }

const getPngString = async (id, fieldId) => {
    const element = document.getElementById(id)
    const idx = id.replace("_Chart", "")
    console.log({element, idx});
    const string = await svgToPngBase64(element, idx)

    uploadSingleToFile(fieldId, string);
}

const mainPrint = async () => {
  uploadMainFile += "<qdbapi><apptoken>bpat4pgu9t69yby5gbemdbej52j</apptoken>";
   
  await getPngString('cfiRatio_chart', 6)
  
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
