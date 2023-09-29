function getRandomNumberWithProbabilities(numbers, probabilities) {
    const cumulativeProbabilities = [];
    let sum = 0;
  
    for (let i = 0; i < probabilities.length; i++) {
      sum += probabilities[i];
      cumulativeProbabilities.push(sum);
    }
  
    const random = Math.random();
    let randomNumber;
  
    for (let i = 0; i < cumulativeProbabilities.length; i++) {
      if (random < cumulativeProbabilities[i]) {
        randomNumber = numbers[i];
        break;
      }
    }
  
    return randomNumber;
  }

class Character {
    constructor(canvas,ctx) {
      //let canvas = document.getElementById('main-canvas');
      //let ctx = canvas.getContext('2d');
      

      this.speedX = 3;
      this.speedY = 3;
      
      this.potential_speedx = [0,0,-3,3]
      this.potential_speedy = [3,-3,0,0]

      this.positionX = 100;
      this.positionY = 100;
      this.direction = 3 // options are 0,1,2,3
      this.destwidth = 16;
      this.destheight = 18;

      this.rb = canvas.width - this.destwidth;
      this.lb = canvas.height - self.destheight;

      this.ctx=ctx;
      this.walking_stage = 0;
      this.maximum_walking_stage = 3;

      this.img = new Image();
      this.img.src = 'assets/pictures/greenhatwalk.png';

      
      this.img.onload = () => {
        //init();
        this.show_up();
      };

    }
    
    show_up() {
        this.ctx.drawImage(this.img, this.walking_stage*16, this.direction*18, 16, 18, this.positionX, this.positionY, this.destwidth, this.destheight);
    }

    update() {
        
        let newdir = getRandomNumberWithProbabilities([0,1,2,3],[0.7, 0.1, 0.1, 0.1])
        //console.log(newdir)
        if(newdir == 0){
            this.positionX += this.speedX;
            this.positionY += this.speedY;
            this.walking_stage += 1;
            this.walking_stage = this.walking_stage % this.maximum_walking_stage;
        }
        else{
            this.direction = (newdir + this.direction)%4;
            this.speedX = this.potential_speedx[this.direction];
            this.speedY = this.potential_speedy[this.direction];
            this.walking_stage = 0;
        }
        //console.log(this.positionX,this.positionY)
        if(this.positionY>this.lb){
            this.positionY = this.lb;
        }
        else if (this.positionY<0){
            this.positionY=0;
        }

        if(this.positionX>this.rb){
            this.positionX = this.rb;
        }
        else if (this.positionX<0){
            this.positionX=0;
        }
    }
  }

  

function print_coordinates(x,y) {
    console.log(`Clicked tile: x=${x}, y=${y}`);
}

function createTile(x, y) {
    const tile = document.createElement("div");
    tile.className = "tile";
    //tile.style.display = "None";
    tile.style.zIndex = "10";
    tile.addEventListener("click", function(){ print_coordinates(x,y);
    });
    return tile;
  }
  
  function initializeGame() {  
    // some set-ups
    const gameContainer = document.getElementById("game-container");
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        const tile = createTile(x, y);
        gameContainer.appendChild(tile);
      }
    }
    let canvas = document.getElementById('main-canvas');
    let ctx = canvas.getContext('2d');
    for (let i = 0; i < 3; i++) {
        const character = new Character(canvas, ctx);// createCharacter();
        character_list.push(character);
      }
    
    
    // begin the game loop
    window.requestAnimationFrame(step);
  }
  
  let frameCount = 0;
  let character_list = []
  
   // main loop
  function step() {
    frameCount++;
    if (frameCount < 15) {
      window.requestAnimationFrame(step);
      return;
    }
    frameCount = 0;

    let canvas = document.getElementById('main-canvas');
    let ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    character_list.forEach(function(character) {
        character.update();
        character.show_up();
    });

    
    window.requestAnimationFrame(step);
  }
  
  initializeGame();