const printButton = document.getElementById("printCharts");


async function mainPrint(){
    // console.log(cfiRatioChart.paper().svg());
    const png = await svgToPngBase64(cfiRatioChart.paper().svg())
    // console.log(png);
}


printButton.addEventListener("click", mainPrint)

