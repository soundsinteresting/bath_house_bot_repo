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

  function chooseRandomElement(list) {
    // Generate a random index within the range of the list's length
    const randomIndex = Math.floor(Math.random() * list.length);
    
    // Return the randomly selected element
    return list[randomIndex];
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

function deleteMatchingElement(list1, xi0, yi0) {
  for (let i = 0; i < list1.length; i++) {
    const element = list1[i];
    if (element[0] === xi0 && element[1] === yi0) {
      list1.splice(i, 1);
      break;
    }
  }
  return list1;
}

function deleteMatchingElement1(list1, xi0, yi0) {
  for (let i = 0; i < list1.length; i++) {
    const element = list1[i];
    if (element[0][0] === xi0 && element[0][1] === yi0) {
      list1.splice(i, 1);
      break;
    }
  }
  return list1;
}

function find_path(sp, ep, fg, x_min, x_max, y_min, y_max) {
  // Queue to store the points to be explored
  const queue = [sp];
  
  // Visited set to keep track of explored points
  const visited = new Set([sp.toString()]);
  
  // Object to keep track of the parent point for each point in the path
  const parents = {};
  parents[sp.toString()] = null;
  
  // Directions to move in the grid
  const directions = [
    [0, 1], // right
    [1, 0], // down
    [0, -1], // left
    [-1, 0] // up
  ];
  
  // Helper function to check if a point is within bounds
  function isWithinBounds(x, y) {
    return x >= x_min && x <= x_max && y >= y_min && y <= y_max;
  }
  
  // Helper function to check if a point is feasible
  function isFeasible(x, y) {
    return isWithinBounds(x, y) && fg.some(([fx, fy]) => fx === x && fy === y);
  }
  
  // Helper function to get the adjacent points of a point
  function getAdjacentPoints([x, y]) {
    return directions.map(([dx, dy]) => [x + dx, y + dy]).filter(([nx, ny]) => isFeasible(nx, ny));
  }
  
  while (queue.length > 0) {
    const [x, y] = queue.shift();
    
    if (x === ep[0] && y === ep[1]) {
      // Reached the end point, construct the shortest path
      const shortestPath = [];
      let curr = ep.toString();
      
      while (curr !== null) {
        shortestPath.unshift(curr.split(',').map(Number));
        curr = parents[curr];
      }
      
      return shortestPath;
    }
    
    const adjacentPoints = getAdjacentPoints([x, y]);
    
    for (const [nx, ny] of adjacentPoints) {
      const nextPoint = [nx, ny].toString();
      
      if (!visited.has(nextPoint)) {
        visited.add(nextPoint);
        parents[nextPoint] = [x, y].toString();
        queue.push([nx, ny]);
      }
    }
  }
  
  // No path found
  return [];
}


function find_path_v0(sp, ep, ab, x_min, x_max, y_min, y_max) {
  // Define a helper function to calculate the Manhattan distance between two points
  function calculateDistance(pointA, pointB) {
    return Math.abs(pointA[0] - pointB[0]) + Math.abs(pointA[1] - pointB[1]);
  }

  // Define a helper function to check if a point is valid (not in nab and within the boundaries)
  function isValidPoint(point) {
    const [x, y] = point;
    return x >= x_min && x <= x_max && y >= y_min && y <= y_max &&
      ab.some(abPoint => abPoint[0] === x && abPoint[1] === y);
  }

  // Define the valid neighbors of a given point
  function getNeighbors(point) {
    const [x, y] = point;
    const neighbors = [[x, y - 1], [x, y + 1], [x - 1, y], [x + 1, y]];
    return neighbors.filter(neighbor => isValidPoint(neighbor));
  }

  // Initialize the open and closed sets for A* algorithm
  const openSet = [sp];
  const closedSet = new Set();

  // Initialize the parent map to keep track of the previous point in the path
  const parentMap = new Map();

  // Initialize the gScore (the cost from start to each point) and fScore (the total cost from start to a point through the current path)
  const gScore = new Map();
  const fScore = new Map();

  gScore.set(JSON.stringify(sp), 0);
  fScore.set(JSON.stringify(sp), calculateDistance(sp, ep));

  for (let iter = 0;iter<1000;iter++) {
    // Find the point with the lowest cost from the start via the current path
    let current = openSet[0];
    let currentFScore = fScore.get(JSON.stringify(current));
    openSet.forEach(point => {
      const pointFScore = fScore.get(JSON.stringify(point));
      if (pointFScore < currentFScore) {
        current = point;
        currentFScore = pointFScore;
      }
    });

    // Check if the current point is the end point
    if (current[0] === ep[0] && current[1] === ep[1]) {
      // Reconstruct the path by following the parent pointers
      const path = [current];
      while (parentMap.has(JSON.stringify(current))) {
        current = parentMap.get(JSON.stringify(current));
        path.unshift(current);
      }
      return path;
    }

    openSet.splice(openSet.indexOf(current), 1);
    closedSet.add(JSON.stringify(current));

    const neighbors = getNeighbors(current);
    neighbors.forEach(neighbor => {
      const tentativeGScore = gScore.get(JSON.stringify(current)) + 1;

      if (closedSet.has(JSON.stringify(neighbor))) {
        if (tentativeGScore >= gScore.get(JSON.stringify(neighbor))) {
          return;
        }
        closedSet.delete(JSON.stringify(neighbor));
      }

      if (!openSet.includes(neighbor) || tentativeGScore < gScore.get(JSON.stringify(neighbor))) {
        parentMap.set(JSON.stringify(neighbor), current);
        gScore.set(JSON.stringify(neighbor), tentativeGScore);
        fScore.set(JSON.stringify(neighbor), tentativeGScore + calculateDistance(neighbor, ep));

        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        }
      }
    });
    if (openSet.length == 0){
      break;
    }
    
  }

  // If no path is found, return an empty array
  return [];
}


function findAdjacentSubset(list1, xstar, ystar) {
  const visited = new Set();
  const subset = [];

  function dfs(x, y) {
    const currentCoordinate = [x, y];
    //visited.add(currentCoordinate);
    subset.push(currentCoordinate);

    const adjacentCoordinates = [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1],
    ];

    for (const [adjX, adjY] of adjacentCoordinates) {
      const adjacentCoordinate = [adjX, adjY];

      if (!subset.some(coord => coord[0] === adjX && coord[1] === adjY) && list1.some(coord => coord[0] === adjX && coord[1] === adjY)) {
        dfs(adjX, adjY);
      }
    }
  }

  dfs(xstar, ystar);

  return subset;
}


class Character {
    constructor(canvas,ctx) {
      //let canvas = document.getElementById('main-canvas');
      //let ctx = canvas.getContext('2d');
      
      this.state = 'new_customer';
      this.next_state = 'leave_now';

      this.speedX = 1.5;
      this.speedY = 1.5;
      this.in_bound_x = 1.5*this.speedX;
      this.in_bound_y = 1.5*this.speedY;
      
      this.potential_speedx = [0,0,-this.speedX,this.speedX]
      this.potential_speedy = [this.speedY,-this.speedY,0,0]

      this.positionX = entrance_position[0]*character_xscale;
      this.positionY = entrance_position[1]*character_yscale;
      this.coordX = entrance_position[0];
      this.coordY = entrance_position[1];

      this.path = [];
      this.leave_now = 0;

      this.direction = 3 // options are 0,1,2,3
      this.destwidth = 16*0.5;
      this.destheight = 18*0.5;

      this.rb = canvas.width - this.destwidth +10;
      this.lb = canvas.height - this.destheight + 10;
      this.ub = -10;
      this.lftb = -10;
      
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

    transform_coordinate(x,y){
        this.positionX = (x+0.5)*character_xscale - this.destwidth/2;
        this.positionY = (y+0.5)*character_yscale - this.destheight/2;
    }

    transform_position(posx,posy){
        this.coordX = Math.floor((posx + this.destwidth/2)/character_xscale);
        this.coordY = Math.floor((posy + this.destheight/2)/character_yscale);
    }

    think() {
        console.log('thinking: '+this.state);
        if (this.state == 'new_customer'){
            this.state = 'think_what_to_do_at_floor';
            this.think();
        }
        else if(this.state == 'think_what_to_do_at_floor') {
            let probabilities = [1,0];
            if (assembly_positions.length > 0){
              probabilities = [0,1];
            }
            this.state = getRandomNumberWithProbabilities(['random_target_at_floor','go_to_pool'],probabilities);
            this.think();
        }
        else if(this.state == 'think_what_to_do_at_floor_after_pool') {
          this.state = getRandomNumberWithProbabilities(['random_target_at_floor','leaving'],[0.5,0.5]);
          this.think();
        }
        else if(this.state == 'random_target_at_floor') {
          const destination = chooseRandomElement(floor_location_list);
          
          console.log('destination is'+destination);
          this.path = find_path([this.coordX, this.coordY], destination, floor_location_list, 0, ntileperrow, 0, ntilerow);
          this.next_state = 'think_what_to_do_at_floor';
          
          
          console.log('path is');
          console.log(this.path);
        }
        else if(this.state == 'go_to_pool') {
          const assembly_on_floor = assembly_positions.map((item) => item[0]);
          const destination = chooseRandomElement(assembly_on_floor);
          this.path = find_path([this.coordX, this.coordY], destination, floor_location_list, 0, ntileperrow, 0, ntilerow);
          this.next_state = 'entering_pool';

          console.log('destination is'+destination);
          console.log('path is');
          console.log(this.path);

        }
        else if (this.state == 'entering_pool'){
          let destination = [0,0];

          for (let i = 0; i < assembly_positions.length; i++) {
            const element = assembly_positions[i];
            
            if (element[0][0] === this.coordX && element[0][1] === this.coordY) {
              destination = element[1];
              break;
            }
          }
          this.path = [destination];
          this.next_state = 'random_target_in_pool';
        }
        else if (this.state == 'random_target_in_pool'){
          //this.transform_position();
          let j = 0;
          for (let i =0;i<construction_location_list.length;i++){
            if (tuple_in_list([this.coordX, this.coordY],construction_location_list[i])){
              j = i;
              break;
            }
          }
          let pool_locations = findAdjacentSubset(construction_location_list[j], this.coordX, this.coordY);
          let destination = chooseRandomElement(pool_locations);
          this.path = find_path([this.coordX, this.coordY], destination, construction_location_list[j], 0, ntileperrow, 0, ntilerow);
          this.next_state = 'leaving_pool';
        }
        else if (this.state == 'leaving_pool'){
          let j = 0;
          this.transform_position(this.positionX, this.positionY);

          let findexit = false;
          for (let i =0;i<construction_location_list.length;i++){
            if (tuple_in_list([this.coordX, this.coordY],construction_location_list[i])){
              j = i;
              findexit = true;
              break;
            }
          }
          //if (! findexit){
          //  return;
          //}
          let in_this_pool = findAdjacentSubset(construction_location_list[j], this.coordX, this.coordY);
          const pool_exit_locations = assembly_positions.map((item) => item[1]);

          let sorti = [];
          for (let i =0; i < in_this_pool.length; i ++ ){
            if (tuple_in_list(in_this_pool[i],pool_exit_locations)){
              sorti.push(in_this_pool[i]);
            }
          }
          let destination = chooseRandomElement(sorti);
          this.path = find_path([this.coordX, this.coordY], destination, construction_location_list[j], 0, ntileperrow, 0, ntilerow);
          this.next_state = 'exiting_pool';
        }
        else if (this.state == 'exiting_pool'){
          let destination = [0,0];

          for (let i = 0; i < assembly_positions.length; i++) {
            const element = assembly_positions[i];
            if (element[1][0] === this.coordX && element[1][1] === this.coordY) {
              destination = element[0];
              break;
            }
          }
          this.path = [destination];
          this.next_state = 'think_what_to_do_at_floor_after_pool';
        }
        else if(this.state == 'leaving'){
          const destination = exit_position;
          this.path = find_path([this.coordX, this.coordY], destination, floor_location_list, 0, ntileperrow, 0, ntilerow);
          this.next_state = 'leave_now';
        }
        else if(this.state == 'leave_now'){
          this.leave_now = 1;
          this.path = [];
        }
    }

    rethink() {

      if (this.path.length==0){
        return;
      }

      let destination = this.path[this.path.length-1];
      this.transform_position(this.positionX,this.positionY);
      let sp = [this.coordX, this.coordY];

      
      let neighbors = [[-1,0],[-1,-1],[-1,1],[0,-1],[0,1],[1,0],[1,-1],[1,1]];
      if (! tuple_in_list([this.coordX, this.coordY], floor_location_list)){
          for (let i=0;i<neighbors.length;i++){
            if(tuple_in_list([this.coordX+neighbors[i][0], this.coordY+ neighbors[i][1]], floor_location_list)){
              sp = [this.coordX+neighbors[i][0], this.coordY+ neighbors[i][1]];
              break;
            }
          }
      }

      //console.log(destination);
      if (! tuple_in_list(destination, floor_location_list)){
          for (let i=0;i<neighbors.length;i++){
            if(tuple_in_list([destination[0]+neighbors[i][0], destination[1]+ neighbors[i][1]], floor_location_list)){
              destination = [destination[0]+neighbors[i][0], destination[1]+ neighbors[i][1]];
              break;
            }
          }
      }

      this.path = find_path(sp, destination, floor_location_list, 0, ntileperrow, 0, ntilerow);

    
    }

    coord2pos(coord){
      const x = coord[0];
      const y = coord[1];
      return [(x+0.5)*character_xscale, (y+0.5)*character_yscale ];
  
    }


    walk() {
        //console.log(this.positionX,this.positionY);
        if (this.path.length == 0){
          //this.state = this.next_state;
          this.think();
          return;
        }
        
        let target = this.coord2pos(this.path[0]);

        /*
        console.log('path 0');
        console.log(this.path[0]);
        console.log('target');
        console.log(target);
        */
        

        if (Math.abs(this.positionX + this.destwidth/2-target[0]) <= this.in_bound_x && Math.abs(this.positionY + this.destheight/2-target[1]) <= this.in_bound_y){
          //console.log('reached small target');
          this.positionX = target[0] - this.destwidth/2;
          this.positionY = target[1] - this.destheight/2;
          this.path.shift();
          this.transform_position(this.positionX, this.positionY);

          if (this.path.length == 0){
            console.log('rethinking my goal...');
            this.state = this.next_state;
            this.think();
            return;
          }
          target = this.path[0];
        }

        const xvelocity = target[0] - this.positionX - this.destwidth/2;
        const yvelocity = target[1] - this.positionY - this.destheight/2;
        let newdir = 0;
        if (Math.abs(xvelocity) > Math.abs(yvelocity)){
            if (xvelocity > 0){
              newdir = 3;
            }
            else{
              newdir = 2;
            }
        }
        else{
          if (yvelocity > 0){
            newdir = 0;
          }
          else{
            newdir = 1;
          }
        }
        //console.log('new direction is'+newdir);
        if(newdir == this.direction){
            this.positionX += this.speedX;
            this.positionY += this.speedY;
            this.walking_stage += 1;
            this.walking_stage = this.walking_stage % this.maximum_walking_stage;
        }
        else{
            this.direction = newdir;
            this.speedX = this.potential_speedx[this.direction];
            this.speedY = this.potential_speedy[this.direction];
            this.walking_stage = 0;
        }
        //console.log(this.positionX,this.positionY)
        if(this.positionY>this.lb){
            this.positionY = this.lb;
            console.log('my position');
            console.log(this.positionX, this.positionY);
            console.log('target')
            console.log(target);
        }
        else if (this.positionY<0){
            this.positionY=0;
            console.log('my position');
            console.log(this.positionX, this.positionY);
            console.log('target')
            console.log(target);
        }

        if(this.positionX>this.rb){
            this.positionX = this.rb;
            console.log('my position');
            console.log(this.positionX, this.positionY);
            console.log('target')
            console.log(target);
        }
        else if (this.positionX<0){
            this.positionX=0;
            console.log('my position');
            console.log(this.positionX, this.positionY);
            console.log('target')
            console.log(target);
        }
    }

    update() {
      this.walk();
    }
  }

function check_enter_or_exit(x,y){
  if(x == entrance_position[0] && y == entrance_position[1]){
    return true;
  }
  else if(x == exit_position[0] && y == exit_position[1]){
    return true;
  }
  return false;
}

function build_pool_here(x,y,which_pool,the_location_list){
    const transparentLayer = document.getElementById("transparent-layer");
    
    ClearList(construction_list[y*ntileperrow+x][1],transparentLayer)
    let sidewater = [+tuple_in_list([x+1,y], the_location_list),
        +tuple_in_list([x,y+1], the_location_list),
        +tuple_in_list([x-1,y], the_location_list),
        +tuple_in_list([x,y-1], the_location_list)];
    let cornerwater = [+tuple_in_list([x+1,y-1], the_location_list),
        +tuple_in_list([x+1,y+1], the_location_list),
        +tuple_in_list([x-1,y+1], the_location_list),
        +tuple_in_list([x-1,y-1], the_location_list)];
    
    const sumofnoedge = sidewater.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    if (sumofnoedge == 4){
            construction_list[y*ntileperrow+x][0].style.backgroundImage = 
          "url(\'"+which_pool+"/water.png\')";
          for (let i = 0; i < 4; i++) {
            if (cornerwater[i] == 0){
                const corner = createTileTop(x,y,which_pool+"/corner.png");
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
            "url(\'"+which_pool+"/water.png\')";
          for (let i = 0; i < 4; i++) {
            if (sidewater[i] == 0){
                const side = createTileTop(x,y, which_pool+"/oneline.png");
                side.style.transform = "rotate("+String(90*i)+"deg)";
                side.style.backgroundColor = "initial"; 
                transparentLayer.appendChild(side);
                construction_list[y*ntileperrow+x][1].push(side);
            }
          }
          //add corner
          for (let i = 0; i < 4; i++) {
            if ((cornerwater[i] == 0)&&(sidewater[i]==1)&&(sidewater[(i+3)%4]==1)){
                const corner = createTileTop(x,y, which_pool+"/corner.png");
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
                "url(\'"+which_pool+"/water.png\')";
                for (let i = 0; i < 4; i++) {
                    if (sidewater[i] == 0){
                        const side = createTileTop(x,y, which_pool+"/oneline.png");
                        side.style.transform = "rotate("+String(90*i)+"deg)";
                        side.style.backgroundColor = "initial"; 
                        transparentLayer.appendChild(side);
                        construction_list[y*ntileperrow+x][1].push(side);
                    }
                }
            }
            else{
                construction_list[y*ntileperrow+x][0].style.backgroundImage = 
                "url(\'"+which_pool+"/twolines.png\')";
                for (let i = 0; i < 4; i++) {
                  if (sidewater[i]+sidewater[(i+3)%4] == 0){
                      construction_list[y*ntileperrow+x][0].style.transform = "rotate("+String(90*i)+"deg)";
                      
                      //add corner
                      if (cornerwater[(i+2)%4]==0){
                        const corner = createTileTop(x,y, which_pool+"/corner.png");
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
            "url(\'"+which_pool+"/threelines.png\')";
          for (let i = 0; i < 4; i++) {
            if (sidewater[(i+2)%4] == 1){
                construction_list[y*ntileperrow+x][0].style.transform = "rotate("+String(90*i)+"deg)";
            }
          }
    }
    else if (sumofnoedge == 0){
            construction_list[y*ntileperrow+x][0].style.backgroundImage = 
            "url(\'"+which_pool+"/fourlines.png\')";
    }
}  

function build_obj_here(x,y,the_location_list){
    const objLayer = document.getElementById("obj-layer-1");
    
    let sidewater = [+tuple_in_list([x+1,y], the_location_list),
      +tuple_in_list([x,y+1], the_location_list),
      +tuple_in_list([x-1,y], the_location_list),
      +tuple_in_list([x,y-1], the_location_list)];
    //console.log('sidewater');
    //console.log(sidewater);
    //console.log(the_location_list)
    const sumofnoedge = sidewater.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    if (construction_list[y*ntileperrow+x][2].length > 0){
      return
    }
    if (sumofnoedge == 4){
      return;
    }
    else if(sidewater[0] + sidewater[2] == 2 && objtoplace =='assets/pictures/pool/objects/stair_horizontal.png'){
      return;
    }
    else if(sidewater[1] + sidewater[3] == 2 && objtoplace =='assets/pictures/pool/objects/stair_vertical.png'){
      return;
    }
    else{
      const stair = createTileTop(x,y,objtoplace);
      if (sidewater[0] == 0 && objtoplace =='assets/pictures/pool/objects/stair_horizontal.png'){
        stair.style.transform = "scaleX(-1)";
        assembly_positions.push([[x+1,y],[x,y]]);
      }
      else if (sidewater[3] == 0 && objtoplace =='assets/pictures/pool/objects/stair_vertical.png'){
        stair.style.transform = "rotate("+String(180)+"deg)";
        assembly_positions.push([[x,y-1],[x,y]]);
      }
      else if (objtoplace =='assets/pictures/pool/objects/stair_vertical.png'){
        assembly_positions.push([[x,y+1],[x,y]]);
      }
      else if (objtoplace =='assets/pictures/pool/objects/stair_horizontal.png'){
        assembly_positions.push([[x-1,y],[x,y]]);
      }
      stair.style.backgroundColor = "initial"; 
      stair.style.zIndex = "30";
      objLayer.appendChild(stair);
      construction_list[y*ntileperrow+x][2].push(stair);
    }
    
}
function check_neighbor_pool(x,y){
    let nlist = [[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1]];
    for (let i=0;i<8;i++){
        nx = nlist[i][0]+x;
        ny = nlist[i][1]+y;
        for (let j=0;j<construction_path_list.length;j++){
          if (tuple_in_list([nx,ny],construction_location_list[j])){
            build_pool_here(nx,ny,construction_path_list[j],construction_location_list[j]);
        }
        }
        
    }
}

function build_something(x,y) {
    for (let j=0;j<construction_location_list.length;j++){
      const lastIndex = construction_path_list[j].lastIndexOf('/');
      target_name = "build"+construction_path_list[j].substring(lastIndex + 1);
      if (gameState==target_name){
        console.log(target_name + `at: x=${x}, y=${y}`);

        if (!tuple_in_list([x,y], floor_location_list)){
          return;
        }
        if (check_enter_or_exit(x,y)){
          return;
        }
        // graphical manipulations
        build_pool_here(x,y, construction_path_list[j], construction_location_list[j]);

        // change
        construction_location_list[j].push([x,y]);
        check_neighbor_pool(x,y);     
        
        // change variables
        assembly_positions = deleteMatchingElement1(assembly_positions,x,y);
        floor_location_list = deleteMatchingElement(floor_location_list,x,y);

        for (let i =0;i<character_list.length;i++){
          character_list[i].rethink();
        }
        return;
    }
    }
    
    if (gameState=='buildobj'){
        console.log(`attempt to build at: x=${x}, y=${y}`);
        for (let j=0;j<construction_location_list.length;j++){
        if (tuple_in_list([x,y],construction_location_list[j])){
          build_obj_here(x,y,[].concat(...construction_location_list));
          return;
        }
      }
        
    }
    else if (gameState == 'demolish'){
        console.log(`Clicked tile: x=${x}, y=${y}, to demolish`);

        if (check_enter_or_exit(x,y)){
          return;
        }
        let isConstruction = false;
        let cid = 0;
        for (let j=0;j<construction_location_list.length;j++){
          if(tuple_in_list([x,y], construction_location_list[j])){
            isConstruction = true;
            cid = j;
            break;
          }
        }
        if (isConstruction){
            if (construction_list[y*ntileperrow+x][2].length > 0){
              // only clear the objects
              ClearList(construction_list[y*ntileperrow+x][2], document.getElementById("obj-layer-1"));
              return;
            }

            construction_list[y*ntileperrow+x][0].style.backgroundImage = 
              `url(assets/pictures/tile.png)`;
              
            ClearList(construction_list[y*ntileperrow+x][1], document.getElementById("transparent-layer"))
          
            construction_location_list[cid] = deleteMatchingElement(construction_location_list[cid],x,y)
            check_neighbor_pool(x,y);
            floor_location_list.push([x,y]);
            //for (let i =0;i<character_list.length;i++){
            //  character_list[i].rethink();
            //}


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
    return tile;
}

function createActionButton(imgfilename,functionwhenclicked,xpos, ypos){
    const pool = document.createElement("div");
    pool.className = "poolbutton";
    pool.style.backgroundImage = 'url(\"'+imgfilename+'\")';
    pool.style.gridColumn = String(xpos)+" / span 1";
    pool.style.gridRow = String(ypos)+" / span 1";
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
        if (x == entrance_position[0] && y == entrance_position[1]){
          tile.style.backgroundImage = "url('assets/pictures/enter_tile.png')";
        }
        else if (x == exit_position[0] && y == exit_position[1]){
          tile.style.backgroundImage = "url('assets/pictures/exit_tile.png')"

        }
        gameContainer.appendChild(tile);
        construction_list.push([tile,[],[]]); // the first list for decoration, the second list for objects
        floor_location_list.push([x,y]);
      }
    }
    // create the buttoms 
    const poolbutton = createActionButton("assets/pictures/pool/fourlines.png",
    ()=>{gameState='buildpool';console.log(gameState);},8,12);
    gameContainer.appendChild(poolbutton)

    const fancypoolbutton = createActionButton("assets/pictures/fancypool/fourlines.png",
    ()=>{gameState='buildfancypool';console.log(gameState);},9,12);
    gameContainer.appendChild(fancypoolbutton)

    const cancelbutton = createActionButton("assets/pictures/cancel.png",
    ()=>{gameState='demolish';console.log(gameState);},12,12);
    gameContainer.appendChild(cancelbutton)

    const stairbutton_h = createActionButton("assets/pictures/pool/objects/stair_horizontal.png",
    ()=>{gameState='buildobj';objtoplace = 'assets/pictures/pool/objects/stair_horizontal.png'; console.log(gameState);},8,13);
    gameContainer.appendChild(stairbutton_h)

    const stairbutton_v = createActionButton("assets/pictures/pool/objects/stair_vertical.png",
    ()=>{gameState='buildobj';objtoplace = 'assets/pictures/pool/objects/stair_vertical.png'; console.log(gameState);},9,13);
    gameContainer.appendChild(stairbutton_v)

    let ctx = canvas.getContext('2d');
    for (let i = 0; i < 1; i++) {
        const character = new Character(canvas, ctx);// createCharacter();
        character_list.push(character);
      }
    
    
    // begin the game loop
    window.requestAnimationFrame(step);
  }
  
  let canvas = document.getElementById('main-canvas');

  let frameCount = 0;
  let character_list = [];
  let gameState = 'demolish';
  let objtoplace = 'none';

  let construction_list = [];
  let ntileperrow = 20;
  let ntilerow = 10;

  let character_xscale = canvas.width/ntileperrow;
  let character_yscale = canvas.height/ntilerow;

  let floor_location_list = [];
  let pool_location_list = [];
  let fancy_pool_location_list = [];
  let construction_location_list = [pool_location_list,fancy_pool_location_list];
  let construction_path_list = ['assets/pictures/pool','assets/pictures/fancypool'];


  let assembly_positions = [];// each element is [[xfloor,yfloor],[xpool, ypool]];
  let entrance_position = [10,1];
  let exit_position = [10,0];

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

    // some new customers might arrive
    newcustomer = getRandomNumberWithProbabilities([0,1],[0.97,0.03]);
    if (character_list.length >= 10){
      newcustomer = 0;
    }
    if  (newcustomer==1) {
        const character = new Character(canvas, ctx);// createCharacter();
        character_list.push(character);
      }

    // update existing customers
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let removeidx = [];
    for (let i =0; i<character_list.length; i ++ ){
      const character = character_list[i];
      character.update();
      if (character.leave_now == 1){
        removeidx.push(i);
        //delete character;
      }
      else {
        character.show_up();
      }
    }

    for(let i=0;i<removeidx.length;i++){
        //delete character_list[removeidx.length-i];
        console.log('someone leaving');
        console.log(character_list.length);
        character_list.splice(removeidx[removeidx.length-i-1],1);
        console.log('after leaving');
        console.log(character_list.length);
    }
  

    
    window.requestAnimationFrame(step);
  }
  
  initializeGame();