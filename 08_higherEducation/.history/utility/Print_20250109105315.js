const printButton = document.getElementById("printCharts");


async function svgToPngBase64(element, id) {
    let canvasElement = document.createElement("canvas");
    canvasElement.id = "canvas";
    document.body.appendChild(canvasElement);
  
    html2canvas(element).then(function (canvas) {
      console.log({ canvas, id: canvas.id });
      let picture = document.getElementById("canvas").appendChild(canvas);
      let base64String = canvas.toDataURL("image/png");
      const exportString = base64String.slice("data:image/png;base64,".length);
      map_dataUri.set(id, exportString)
      picture.remove();d
    });
  }

const getPngString = async (id) => {
    const element = document.getElementById(id)
    const idx = id.replace("_Chart", "")
    const string = await svgToPngBase64(element, idx)

    return string
}
async function getBase64Strings(){

    // console.log(dataUrLObj)

    const png = await svgToPngBase64(document.getElementById('cfiRatio_chart'), 'cfiRatio')
    // console.log(png);
}


printButton.addEventListener("click", getBase64Strings)

