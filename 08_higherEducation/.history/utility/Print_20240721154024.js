const uploadFileBegin = `<qdbapi> <apptoken>bpat4pgu9t69yby5gbemdbej52j</apptoken>`;
const uploadFileEnd = `</qdbapi>`;
const uploadClist = `<clist>186</clist>`;
const urlUploadFile = "https://capincrouse.quickbase.com/db/bub5a8w2g?a=API_AddRecord";
const generateReportsBtn = document.getElementById("generateReports");
let uploadMainFile = "";

const printButton = document.getElementById("printCharts");

function uploadToFile(avg, mid, min, max, num, begin, end) {
  var avgVal = avg;
  var midVal = mid;
  var minVal = min;
  var maxVal = max;

  if (begin)
    uploadMainFile +=
      "<qdbapi><apptoken>bpat4pgu9t69yby5gbemdbej52j</apptoken>";

  uploadMainFile += `<field fid='${num}'>${avgVal}</field><field fid='${
    num + 1
  }'>${midVal}</field><field fid='${num + 2}'>${minVal}</field><field fid='${
    num + 3
  }'>${maxVal}</field>`;
} //uploadToFile

function uploadSingleToFile(id, val, end) {
  uploadMainFile += `<field fid='${id}'>${val}</field>`;

  if (end) uploadMainFile += uploadClist;

  if (end) uploadMainFile += "</qdbapi>";
}
