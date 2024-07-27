const printButton = document.getElementById("printCharts");


const mainPrint = async () => {
    const png = await svgToPngBase64(cfiRatioChart.paper().svg())
    console.log(png);
}


printButton.addEventListener("click", mainPrint)