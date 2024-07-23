const uploadFileEnd = `</qdbapi>`;
const urlUploadFile =
  "https://capincrouse.quickbase.com/db/bub5a8w2g?a=API_AddRecord";
const printButton = document.getElementById("printCharts");

printButton.addEventListener("click", () => mainPrint); //uploadToFile

const mainPrint = () => {
  uploadMainFile += "<qdbapi><apptoken>bpat4pgu9t69yby5gbemdbej52j</apptoken>";

  uploadMainFile += "</qdbapi>";
};

function uploadSingleToFile(id, val) {
  uploadMainFile += `<field fid='${id}'>${val}</field>`;

  if (end) uploadMainFile += uploadClist;

  if (end);
}
