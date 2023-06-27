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

const switchElement = document.getElementById('switch');
const buttonElement = switchElement.querySelector('button');
const spanElement = switchElement.querySelector('span');

function handleOverlap() {
  if (isOverlapping(buttonElement, spanElement)) {
    buttonElement.classList.add('no-darken');
    spanElement.classList.add('no-darken');
  } else {
    buttonElement.classList.remove('no-darken');
    spanElement.classList.remove('no-darken');
  }
}

function isOverlapping(element1, element2) {
  const rect1 = element1.getBoundingClientRect();
  const rect2 = element2.getBoundingClientRect();

  return (
    rect1.left < rect2.right &&
    rect1.right > rect2.left &&
    rect1.top < rect2.bottom &&
    rect1.bottom > rect2.top
  );
}

window.addEventListener('resize', handleOverlap);
handleOverlap();