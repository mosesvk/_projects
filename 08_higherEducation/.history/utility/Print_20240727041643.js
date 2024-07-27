const printButton = document.getElementById("printCharts");


async function getBase64Strings(){

    // console.log(dataUrLObj)

    const png = await svgToPngBase64(document.getElementById('cfiRatio_chart'), 'cfiRatio')
    // console.log(png);
}


printButton.addEventListener("click", getBase64Strings)

