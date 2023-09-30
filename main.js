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

function ClearList(list,father){
    list.forEach(function(oneElement) {
        oneElement.style.display = "none";
        //father.removeChild(oneElement);
        oneElement.remove()
    });
    ll = list.length;
    for (let i = 0; i<ll; i ++){
        list.pop();
    }
    
}

function tuple_in_list(coordinateToCheck, coordinatesList){
    return coordinatesList.some(
    (coordinate) => coordinate.toString() === coordinateToCheck.toString()
  );
}

function tuple_index(tp,list){
    a = tp[0];
    b = tp[1];
    return list.findIndex(([x, y]) => x === a && y === b);
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
      this.lb = canvas.height - this.destheight;

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

function build_pool_here(x,y){
    const transparentLayer = document.getElementById("transparent-layer");
    
    ClearList(construction_list[y*ntileperrow+x][1],transparentLayer)
    let sidewater = [+tuple_in_list([x+1,y], pool_location_list),
        +tuple_in_list([x,y+1], pool_location_list),
        +tuple_in_list([x-1,y], pool_location_list),
        +tuple_in_list([x,y-1], pool_location_list)];
    let cornerwater = [+tuple_in_list([x+1,y-1], pool_location_list),
        +tuple_in_list([x+1,y+1], pool_location_list),
        +tuple_in_list([x-1,y+1], pool_location_list),
        +tuple_in_list([x-1,y-1], pool_location_list)];
    
    const sumofnoedge = sidewater.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    if (sumofnoedge == 4){
            construction_list[y*ntileperrow+x][0].style.backgroundImage = 
          `url(assets/pictures/pool/water.png)`;
          for (let i = 0; i < 4; i++) {
            if (cornerwater[i] == 0){
                const corner = createTileTop(x,y,"assets/pictures/pool/corner.png");
                corner.style.transform = "rotate("+String(90*i)+"deg)";
                corner.style.backgroundColor = "initial"; 
                transparentLayer.appendChild(corner);
                construction_list[y*ntileperrow+x][1].push(corner);
            }
          }
    }
    else if (sumofnoedge == 3){
           //add line
            construction_list[y*ntileperrow+x][0].style.backgroundImage = 
          `url(assets/pictures/pool/water.png)`;
          for (let i = 0; i < 4; i++) {
            if (sidewater[i] == 0){
                const side = createTileTop(x,y,"assets/pictures/pool/oneline.png");
                side.style.transform = "rotate("+String(90*i)+"deg)";
                side.style.backgroundColor = "initial"; 
                transparentLayer.appendChild(side);
                construction_list[y*ntileperrow+x][1].push(side);
            }
          }
          //add corner
          for (let i = 0; i < 4; i++) {
            if ((cornerwater[i] == 0)&&(sidewater[i]==1)&&(sidewater[(i+3)%4]==1)){
                const corner = createTileTop(x,y,"assets/pictures/pool/corner.png");
                corner.style.transform = "rotate("+String(90*i)+"deg)";
                corner.style.backgroundColor = "initial"; 
                transparentLayer.appendChild(corner);
                construction_list[y*ntileperrow+x][1].push(corner);
            }
          }
    }
    else if (sumofnoedge == 2){
            if ((sidewater[0]+sidewater[2] == 0) || (sidewater[1] + sidewater[3] == 0)){
                //separate lines

                construction_list[y*ntileperrow+x][0].style.backgroundImage = 
                `url(assets/pictures/pool/water.png)`;
                for (let i = 0; i < 4; i++) {
                    if (sidewater[i] == 0){
                        const side = createTileTop(x,y,"assets/pictures/pool/oneline.png");
                        side.style.transform = "rotate("+String(90*i)+"deg)";
                        side.style.backgroundColor = "initial"; 
                        transparentLayer.appendChild(side);
                        construction_list[y*ntileperrow+x][1].push(side);
                    }
                }
            }
            else{
                construction_list[y*ntileperrow+x][0].style.backgroundImage = 
                `url(assets/pictures/pool/twolines.png)`;
                for (let i = 0; i < 4; i++) {
                  if (sidewater[i]+sidewater[(i+3)%4] == 0){
                      construction_list[y*ntileperrow+x][0].style.transform = "rotate("+String(90*i)+"deg)";
                      
                      //add corner
                      if (cornerwater[(i+2)%4]==0){
                        const corner = createTileTop(x,y,"assets/pictures/pool/corner.png");
                        corner.style.transform = "rotate("+String(90*((i+2)%4))+"deg)";
                        corner.style.backgroundColor = "initial"; 
                        transparentLayer.appendChild(corner);
                        construction_list[y*ntileperrow+x][1].push(corner);
                      }
                      
                    }
                }

            }
            
    }
    else if (sumofnoedge == 1){
            construction_list[y*ntileperrow+x][0].style.backgroundImage = 
          `url(assets/pictures/pool/threelines.png)`;
          for (let i = 0; i < 4; i++) {
            if (sidewater[(i+2)%4] == 1){
                construction_list[y*ntileperrow+x][0].style.transform = "rotate("+String(90*i)+"deg)";
            }
          }
    }
    else if (sumofnoedge == 0){
            construction_list[y*ntileperrow+x][0].style.backgroundImage = 
          `url(assets/pictures/pool/fourlines.png)`;
    }
}  

function check_neighbor_pool(x,y){
    let nlist = [[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1]];
    for (let i=0;i<8;i++){
        nx = nlist[i][0]+x;
        ny = nlist[i][1]+y;
        if (tuple_in_list([nx,ny],pool_location_list)){
            build_pool_here(nx,ny);
        }
    }
}

function build_something(x,y) {
    if (gameState=='buildpool'){
        console.log(`build pool at: x=${x}, y=${y}`);
        
        build_pool_here(x,y)
        // check a lot of things
        pool_location_list.push([x,y]);
        check_neighbor_pool(x,y);        
    }
    else{
        console.log(`Clicked tile: x=${x}, y=${y}, to demolish`);
        construction_list[y*ntileperrow+x][0].style.backgroundImage = 
          `url(assets/pictures/tile.png)`;
        ClearList( construction_list[y*ntileperrow+x][1], document.getElementById("transparent-layer"))
        
        if (tuple_in_list([x,y],pool_location_list)){
            
            const index = tuple_index([x,y],pool_location_list); 
            
            if (index > -1) {
                pool_location_list.splice(index, 1);
            }
            check_neighbor_pool(x,y);
        }
        
    }
    
}

function createTile(x, y) {
    const tile = document.createElement("div");
    tile.className = "tile";
    //tile.style.display = "None";
    tile.style.zIndex = "10";
    //tile.style.top = y*10;
    //tile.style.left = x*10;
    tile.addEventListener("click", function(){ build_something(x,y);
    });
    return tile;
}

function createTileTop(x, y, filename) {
    const tile = document.createElement("div");
    tile.className = "tile";
    tile.style.zIndex = "20";
    tile.style.backgroundImage = 'url(\"'+filename+'\")';
    tile.style.backgroundColor = "transparent";
    tile.style.gridRow = `${y+1} / span 1`;
    tile.style.gridColumn = `${x+1} / span 1`;
    tile.style.zIndex = 20;
    return tile;
}

function createActionButton(imgfilename,functionwhenclicked,xpos){
    const pool = document.createElement("div");
    pool.className = "poolbutton";
    pool.style.backgroundImage = 'url(\"'+imgfilename+'\")';
    pool.style.gridColumn = String(xpos)+" / span 1";
    pool.style.gridRow = "12 / span 1";
    pool.style.zIndex = "10";
    pool.addEventListener("click", function(){ functionwhenclicked();
    });
    return pool;
}

function initializeGame() {  
    // some set-ups
    const gameContainer = document.getElementById("game-container");
    for (let y = 0; y < ntilerow; y++) {
      for (let x = 0; x < ntileperrow; x++) {
        const tile = createTile(x, y);
        gameContainer.appendChild(tile);
        let tiletop = []; 
        construction_list.push([tile,tiletop]);
      }
    }
    const poolbutton = createActionButton("assets/pictures/pool/fourlines.png",
    ()=>{gameState='buildpool';console.log(gameState);},8);
    gameContainer.appendChild(poolbutton)
    const cancelbutton = createActionButton("assets/pictures/cancel.png",
    ()=>{gameState='demolish';console.log(gameState);},12);
    gameContainer.appendChild(cancelbutton)

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
  let character_list = [];
  let gameState = 'demolish';
  let construction_list = [];
  let ntileperrow = 20;
  let ntilerow = 10;
  let pool_location_list = [];

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