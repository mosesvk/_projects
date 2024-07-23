const printButton = document.getElementById("printCharts");


const mainPrint = () => {
    console.log(svgToBase64(cfiRatioChart.paper().svg()));
}


printButton.addEventListener("click", mainPrint)