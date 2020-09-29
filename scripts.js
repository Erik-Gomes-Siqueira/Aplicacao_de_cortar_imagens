const photoFile =document.getElementById('photo-file')


document.getElementById('select-image')
.onclick = function(){
    photoFile.click();
}

window.addEventListener('DOMContentLoad', () => {
    photoFile.addEventListener('change', () => {

        let file = photoFile.files.item(0)

        //Ler um arquivo

        let reader = new FileReader()
        reader.readAsDataURL(file)

    })
})