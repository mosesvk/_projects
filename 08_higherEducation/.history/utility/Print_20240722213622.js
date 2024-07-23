const printButton = document.getElementById("printCharts");
printButton.addEventListener("click", () => mainPrint)


const mainPrint = () => {
    console.log(svgToBase64(cfiRatioChart.paper().svg()));
}