function toggleMode() {
    const html = document.documentElement
    html.classList.toggle('light')

    const img = document.querySelector("#profile img")
    
    if(html.classList.contains('light')) {
        img.setAttribute('src', './assets/avatar-light.png')
        img.setAttribute('alt', 'Foto de Angelo, de perfil, usando roupas pretas e com fone de ouvido, olhar distante com barba longa e fundo verde.')
    }
    else {
        img.setAttribute('src', './assets/avatar.png')
        img.setAttribute('alt', 'Foto de Angelo, de perfil, usando roupas pretas e com fone de ouvido, olhar distante com barba longa e fundo amarelo.')
    }


}