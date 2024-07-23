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
  