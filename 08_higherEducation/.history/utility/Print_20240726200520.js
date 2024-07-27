const printButton = document.getElementById("printCharts");


async function getBase64Strings(){
    
    const png = await svgToPngBase64(document.getElementById('cfiRatio_chart'))
    // console.log(png);
}


printButton.addEventListener("click", getBase64Strings)

