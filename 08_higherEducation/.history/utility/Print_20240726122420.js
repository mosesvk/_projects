const printButton = document.getElementById("printCharts");


const mainPrint = () => {
    console.log(svgToPngBase64(cfiRatioChart.paper().svg()));
}


printButton.addEventListener("click", mainPrint)