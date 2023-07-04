// Cria o objeto "circle"
  class Circle {
    constructor(x, y, radius, color, image) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.color = color;
      this.image = image;
      this.initialColor = color; // Função utilizada para salvar a cor inicial para criar linhas gradientes
      this.dx = (Math.random() - 0.5) * 2; // Velocidade Horizontal aleatória
      this.dy = (Math.random() - 0.5) * 2; // Velocidade Vertical aleatória
    }
    
    
    
    // Atualiza a posição do circulo e reverte o movimento caso bata nas bordas da tela
    update(canvasWidth, canvasHeight, circle) {
      this.x += this.dx;
      this.y += this.dy;
    
      if (this.x + this.radius > canvasWidth || this.x - this.radius < 0) {
        this.dx = -this.dx;
      }
    
      if (this.y + this.radius > canvasHeight || this.y - this.radius < 0) {
        this.dy = -this.dy;
      }
    
      circles.forEach((circle) => {
        if (circle !== this) {
          const distance = getDistance(this, circle);
          const sumOfRadii = this.radius + circle.radius;
    
          if (distance <= sumOfRadii) {
            const collisionAngle = Math.atan2(circle.y - this.y, circle.x - this.x);
    
            // Definir a tangente
            const tangentAngle = collisionAngle + Math.PI * 0.5;
    
            // Mover/reverter a direção dos circulos da tangente em relação ao centro para fazer eles se afastarem
            const newDx1 = Math.cos(tangentAngle) * this.dx + Math.sin(tangentAngle) * this.dy;
            const newDy1 = Math.cos(tangentAngle) * this.dy - Math.sin(tangentAngle) * this.dx;
            const newDx2 = Math.cos(tangentAngle) * circle.dx + Math.sin(tangentAngle) * circle.dy;
            const newDy2 = Math.cos(tangentAngle) * circle.dy - Math.sin(tangentAngle) * circle.dx;
    
            // Atualiza a direção antiga pela nova
            this.dx = newDx2;
            this.dy = newDy2;
            circle.dx = newDx1;
            circle.dy = newDy1;
    
            // Prevenção de sobreposição dos circulos baseado na soma dos raios
            const overlap = sumOfRadii - distance;
            const separationX = Math.cos(collisionAngle) * overlap * 0.5;
            const separationY = Math.sin(collisionAngle) * overlap * 0.5;
    
            this.x -= separationX;
            this.y -= separationY;
            circle.x += separationX;
            circle.y += separationY;
          }
        }
      });
    }   
    
    // Desenha o "circle" dentro do canvas
    draw(context, isLightMode, isUnderContainer) {
      context.beginPath();
      context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
  
      // Cria o preenchimento do circulo baseado no Light mode (ON/OFF)
      if (isLightMode && !isUnderContainer) {
        context.fillStyle = 'rgba(255, 255, 255, 0.2)';
        context.strokeStyle = this.color;
        context.lineWidth = 2;
      } else {
        context.fillStyle = 'rgba(0, 0, 0, 0.2)';
        context.strokeStyle = this.color;
        context.lineWidth = 2;
      }
  
      context.fill();
      context.stroke();
      context.closePath();
  
      // Coloca uma imagem em cima de cada "circle"
      if (this.image) {
        context.drawImage(
          this.image,
          this.x - this.radius,
          this.y - this.radius,
          this.radius * 2,
          this.radius * 2
        );
      }
    }
  }
  
  // Pega o canvas pelo ID do HTML e cria o "render context 2d", acerta as dimensões do canvas pro tamanho da tela.
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  // Definição de parâmetros para criação de circulos (quantidade, imagens, margem para não criar eles fora/em cima das bordas do canvas, tamanho do circulo baseado no raio)
  const circles = [];
  const numCircles = 4; // Numero de circulos
  const imagePaths = ['./assets//bocchiface.png', './assets/ryoface.png', './assets/nijikaface.png', './assets/kitaface.png']; // Diretório das imagens
  const margin = 100; // Tamanho da margem para spawn em pixels

  for (let i = 0; i < numCircles; i++) {
    const x = Math.random() * (canvas.width - 2 * margin) + margin;
    const y = Math.random() * (canvas.height - 2 * margin) + margin;
    const radius = Math.random() * 30 + 80;
    const color = getRandomColor();
    const image = new Image();
    image.src = imagePaths[i % imagePaths.length];
    circles.push(new Circle(x, y, radius, color, image));
  }
    
  // Gera uma cor aleatória para os circulos
  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  
  // Liga/Desliga o Darkmode e faz as substituições básicas na foto de perfil
  function toggleMode() {
    const html = document.documentElement;
    const isLightMode = html.classList.toggle('light');
  
    const img = document.querySelector("#profile img");
  
    if (isLightMode) {
      img.setAttribute('src', './assets/avatar-light.png');
      img.setAttribute('alt', 'Foto de Angelo, de perfil, usando roupas pretas e com fone de ouvido, olhar distante com barba longa e fundo verde.');
    } else {
      img.setAttribute('src', './assets/avatar.png');
      img.setAttribute('alt', 'Foto de Angelo, de perfil, usando roupas pretas e com fone de ouvido, olhar distante com barba longa e fundo amarelo.');
    }
  
    // Ativa a function drawCircles para fazer o circulo aderir as propriedades do Light/Dark mode
    drawCircles(isLightMode);
  }
  
// Recria os circulos baseado no switch Light/Dark mode
function drawCircles(isLightMode) {
    // Limpa o canvas pra inserir o "circle" com novas propriedades
    context.clearRect(0, 0, canvas.width, canvas.height);
  
    // Variavel para conferir a posição do container
    const containerRect = document.getElementById('container').getBoundingClientRect();
  
  // Update and draw circles
  circles.forEach((circle) => {
    circle.update(canvas.width, canvas.height);
  
      // Calcula o tamanho do circulo
      const circleRect = {
        left: circle.x - circle.radius,
        top: circle.y - circle.radius,
        right: circle.x + circle.radius,
        bottom: circle.y + circle.radius
      };
  
      // Checa se o circulo entrou dentro do container baseado nas propriedades da variável "containerRect"
      const isUnderContainer = circleRect.left >= containerRect.left &&
        circleRect.top >= containerRect.top &&
        circleRect.right <= containerRect.right &&
        circleRect.bottom <= containerRect.bottom;
  
      // Propriedade que ajuda a esconder melhor circulos abaixo do container (além da função blur no CSS)
    circle.draw(context, isLightMode, isUnderContainer);
});
  
    // Calcula a distância entre 2 circulos (em breve vou adicionar colisão)
    circles.forEach((circle1) => {
      circles.forEach((circle2) => {
        if (circle1 !== circle2) {
          const distance = getDistance(circle1, circle2);
        }
      });
    });
  }
  
  // Calcula a distância entre 2 circulos (utilizado pelo visualizer)
  function getDistance(circle1, circle2) {
    const dx = circle1.x - circle2.x;
    const dy = circle1.y - circle2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // Função que anima os circulos
  function animate() {
    requestAnimationFrame(animate);
    drawCircles(document.documentElement.classList.contains('light'));
  }
  
  // Inicia a animação (pode ser atrelado a um botão/condição)
  animate();
  
  // Rotaciona o outline do botão Light/Dark mode pra parte interior, dando um efeito 3d para o botão (modificado no css pela classe .no-darken)
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

let animationFrameId = null;
const visualizerCanvas = document.getElementById('visualizer');
const visualizerContext = visualizerCanvas.getContext('2d');
visualizerCanvas.width = window.innerWidth;
visualizerCanvas.height = window.innerHeight;

// Visualização de audio
function drawTimeData(analyzer, bufferLength, isLightMode) {
  // EVENTUALMENTE RETORNAR DEPOIS CASO TENHA ERRO
  // Clear de canvas acaba limpando os elementos de circulo, encontrar uma forma de remover o visualizer
  visualizerContext.clearRect(0, 0, visualizerCanvas.width, visualizerCanvas.height);

  // Captura as informações do profile picture para aplicar no visualizer mobile
  const imgElement = document.querySelector('#profile img');
  const imgWidth = imgElement.width;
  const imgHeight = imgElement.height;

  // Capture the profile image position relative to the canvas
  const imgRect = imgElement.getBoundingClientRect();
  const imgX = imgRect.left;
  const imgY = imgRect.top - 2;
  
  // Captura as informações de audio a serem passadas para o Visualizer
  const timeData = new Uint8Array(bufferLength);
  analyzer.getByteTimeDomainData(timeData);

  // Define a sombra aplicada ao circulo e o tamanho da linha do visualizer
  visualizerContext.lineWidth = 4;
  visualizerContext.shadowBlur = 10;
  visualizerContext.shadowColor = 'rgba(0, 0, 0, 0.8)';

  if (window.innerWidth > 700) {
    circles.forEach((circle, index) => {
      const centerX = circle.x;
      const centerY = circle.y;
      const radius = circle.radius;
      
      // Toggle de Light/Dark mode altera a cor da linha do visualizer, possível aplicar gradiente caso o background tenha cores diferentes na vertical
      const gradient = visualizerContext.createLinearGradient(0, 0, visualizerCanvas.width, 0);
      gradient.addColorStop(0, 'rgba(0, 0, 0, 1)'); 
      gradient.addColorStop(0.5, 'rgba(0, 0, 0, 1)'); 
      gradient.addColorStop(1, 'rgba(0, 0, 0, 1)'); 
      visualizerContext.beginPath();
      visualizerContext.strokeStyle = gradient;

      if (!isLightMode) {
        const gradient = visualizerContext.createLinearGradient(0, 0, visualizerCanvas.width, 0);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.5, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 1)');
        visualizerContext.beginPath();
        visualizerContext.strokeStyle = gradient;
      }

      const anglePerSlice = (2 * Math.PI) / bufferLength;
      let angle = 0;

      timeData.forEach((data) => {
        const v = data / 128;
        const lineLength = v * radius;
        angle += anglePerSlice;

        const x = centerX + Math.cos(angle) * lineLength;
        const y = centerY + Math.sin(angle) * lineLength;

        if (x !== centerX && y !== centerY) {
          visualizerContext.lineTo(x, y);
        }
      });
      visualizerContext.closePath();
      visualizerContext.stroke();
    });
  } else {
    // Toggle de Light/Dark mode altera a cor da linha do visualizer, possível aplicar gradiente caso o background tenha cores diferentes na vertical
    const gradient = visualizerContext.createLinearGradient(0, 0, visualizerCanvas.width, 0);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 1)'); 
    gradient.addColorStop(0.5, 'rgba(0, 0, 0, 1)'); 
    gradient.addColorStop(1, 'rgba(0, 0, 0, 1)'); 
    visualizerContext.beginPath();
    visualizerContext.strokeStyle = gradient;
    visualizerContext.shadowColor = 'rgba(0, 0, 0, 1)';

    if (!isLightMode) {
      const gradient = visualizerContext.createLinearGradient(0, 0, visualizerCanvas.width, 0);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.5, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 1)');
      visualizerContext.beginPath();
      visualizerContext.strokeStyle = gradient;
      visualizerContext.shadowColor = 'rgba(255, 255, 255, 1)';
    }
    
    const anglePerSlice = (2 * Math.PI) / bufferLength;
    let angle = 0;

    timeData.forEach((data) => {
      const v = data / 128;
      const lineLength = v * (imgWidth / 2);
      angle += anglePerSlice;

      const x = imgX + imgWidth / 2 + Math.cos(angle) * lineLength;
      const y = imgY + imgHeight / 2 + Math.sin(angle) * lineLength;

      visualizerContext.beginPath();
      visualizerContext.moveTo(imgX + imgWidth / 2, imgY + imgHeight / 2); // Move to the center of the image
      visualizerContext.lineTo(x, y);
      visualizerContext.closePath();
      visualizerContext.stroke();
    });
  }

  //Inicia a animação de todos os visualizers criados "forEach circle"
  //requestAnimationFrame(() => drawTimeData(analyzer, bufferLength, document.documentElement.classList.contains('light')));
  animationFrameId = requestAnimationFrame(() => drawTimeData(analyzer, bufferLength, document.documentElement.classList.contains('light')));
}
  
  // Loga os erros no console caso não consiga acessar Screen/Audio do computador
  function handleError(err) {
    console.log('Error: ', err);
  }
  
  let displayStream;
  let audioCtx;
  let analyzer;
  let source;
  
  // Cria um pop up para obter "DisplayMedia", tela e audio para alimentar o Visualizer
  async function getAudio() {
    displayStream = await navigator.mediaDevices.getDisplayMedia({ audio: true }).catch(handleError);
    audioCtx = new AudioContext();
    analyzer = audioCtx.createAnalyser();
    source = audioCtx.createMediaStreamSource(displayStream);
    source.connect(analyzer);
  
    // Define o comprimento do buffer (divisões na linha que receberão a animação do visualizer)
    // Observação, aumentar muito o segundo parâmetro pode causar lag intenso
    analyzer.fftSize = 2 ** 9;
    const bufferLength = analyzer.frequencyBinCount;
  
    // Inicia a visualização
    drawTimeData(analyzer, bufferLength);
  }
  
  // Function to stop the displayStream
  function stopStream() {
    // Disconnect the media stream source
    if (source) source.disconnect();

    // Close the audio context
    if (audioCtx) audioCtx.close().catch(handleError);

    // Stop all tracks in the MediaStream
    if (displayStream) {
      displayStream.getTracks().forEach((track) => {
        track.stop();
      });
    }
  }

  // Adiciona a função "getAudio" ao botão "Start Visualizer" do HTML (com id shareButton)
  const shareButton = document.getElementById('shareButton');
  
  shareButton.addEventListener('click', async () => {
    try {
      if (shareButton.textContent === 'Start Visualizer') {
        await getAudio();
        shareButton.textContent = 'Stop Visualizer';
      } else if (shareButton.textContent === 'Stop Visualizer') {
        stopStream();
        cancelAnimationFrame(animationFrameId);
        visualizerContext.clearRect(0, 0, visualizerCanvas.width, visualizerCanvas.height);
        shareButton.textContent = 'Start Visualizer';
      }
    } catch (error) {
      console.error('Error accessing screen and audio:', error);
    }
  });