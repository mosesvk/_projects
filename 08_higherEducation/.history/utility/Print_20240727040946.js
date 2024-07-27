const printButton = document.getElementById("printCharts");

function getBase64Strings() {
  // console.log(dataUrLObj)

  const png = svgToPngBase64(document.getElementById("cfiRatio_chart"));
  console.log(png);
}

printButton.addEventListener("click", getBase64Strings);
