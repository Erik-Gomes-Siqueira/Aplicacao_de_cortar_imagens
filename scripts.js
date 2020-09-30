const photoFile =document.getElementById('photo-file')
let photoPreview= document.getElementById('photo-preview')
let image;
let photoName;


//Select & Preview image

document.getElementById('select-image')
.onclick = function(){
    photoFile.click();
}

window.addEventListener('DOMContentLoaded', () => {
    photoFile.addEventListener('change', () => {

        let file = photoFile.files.item(0)
        photoName = file.name;

        //Ler um arquivo

        let reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = function(event){
            image = new Image();
            image.src = event.target.result
            image.onload = onLoadImage
        }

    })
})

//Selection tool

const selection = document.getElementById('selection-tool')

let startX, startY, relativeStartX, relativeStartY, endX, endY,
relativeEndX, relativeEndY;

let startSelection = false;

const events = {
    mouseover(){
        this.style.cursor = 'crosshair'
    },
    mousedown(){
        const {clientX, clientY, offsetX, offsetY} = event
       // console.table({
            //'client': [clientX, clientY],
            //'offseat': [offsetX, offsetY]
       // })

        startX = clientX
        startY = clientY
        relativeStartX = offsetX
        relativeStartY = offsetY

        startSelection = true    
        
    },
    mousemove(){
        endX = event.clientX
        endY = event.clientY

        if (startSelection) {
            selection.style.display = 'initial';
            selection.style.top = startY+'px';
            selection.style.left = startX+'px';

            selection.style.width = (endX-startX) + 'px';
            selection.style.height = (endY-startY) + 'px';
        }
        
    },
    mouseup(){
        startSelection = false

        relativeEndX = event.layerX; 
        relativeEndY = event.layerY; 
        
        //Mostrar o botão de cortar a imagem

        cropButton.style.display = 'initial';
    }
}

Object.keys(events)
.forEach(eventName=>{
    photoPreview.addEventListener(eventName, events[eventName])
})

//Canvas

let canvas = document.createElement('canvas');
let ctx = canvas.getContext('2d')

function onLoadImage(){
    const {width, height} = image
    canvas.width = width;
    canvas.height = height;

    //Limpando o contexto
    ctx.clearRect(0, 0, width, height)

    //Desenhar a imagem no contexto
    ctx.drawImage(image, 0, 0)

    photoPreview.src = canvas.toDataURL()

}

//Cortar imagem

const cropButton = document.getElementById('crop-image');
cropButton.onclick = () => {
    const {width: imgW, height: imgH} = image
    const {width: previewW, height: previewH} = photoPreview


    const [widhtFactor, heightFactor] = [
        +(imgW / previewW),
        +(imgH / previewH)
    ]
    
    const[selectionWidht, selectionHeight] = [
        parseFloat(selection.style.width.replace('px', '')),
        parseFloat(selection.style.height.replace('px', ''))
    ]

    const [croppedWidth, croppedHeight] = [
        +(selectionWidht * widhtFactor),
        +(selectionHeight * heightFactor)
    ]

    const [actualX, actulaY] = [
        +(relativeStartX * widhtFactor),
        +(relativeStartY * heightFactor)
    ]

    //Pegar do cxt imagem cortada

    const croppedImage = ctx.getImageData(actualX, actulaY, croppedWidth, croppedHeight)

    //limpar o ctx

    ctx.clearRect(0, 0, ctx.width, ctx.height)

    //Ajuste de proporções

    image.width = canvas.width = croppedWidth
    image.height = canvas.height = croppedHeight

    //Adiconar imagem cortada ao ctx

    ctx.putImageData(croppedImage, 0, 0)

    //Esconder a ferramenta de seleção

    selection.style.display = 'none';

    //Atualizar o preview da imagem

    photoPreview.src = canvas.toDataURL()

    //Mostrar o botão de download  
    downloadButton.style.display = 'initial'

}

//Download

const downloadButton = document.getElementById('download');
downloadButton.onclick = function () {
    const a = document.createElement('a');
    a.download = photoName + '-cropped.png';
    a.href  = canvas.toDataURL();
    a.click()
}
