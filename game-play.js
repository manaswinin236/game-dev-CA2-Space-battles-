// Username display
function inputDetails() {
   
    const username = document.getElementById('username').value;
    const warriorname = document.getElementById('warriorname').value;
    
    //pushing the value derived to the local storage 
    localStorage.setItem('username', username);
    localStorage.setItem('warriorname', warriorname);
}
    //extracting the value from the local storage
    var savedUsername = localStorage.getItem("username");
    var savedWarriorname = localStorage.getItem("warriorname");
    
    // Display the username on the page
    document.getElementById("givenWariorName").textContent = savedWarriorname;


//Layout and size of the canvas board in px
let tileSize = 32;
let rows = 24;
let columns = 24;
//overall size of the canvas board
let board;
let boardWidth = tileSize * columns; 
let boardHeight = tileSize * rows;
let context;


//size of the spaceship
//one tile size id 32px so the spaceship will be 64*64px
let shipWidth = tileSize*2;
let shipHeight = tileSize*2;

//initialising the position of the spaceship on the canvas board
//to place the spaceship in the center of the canvas board
let shipXaxis = tileSize * columns/2 - tileSize;
//to place the ship in the bottom 2 tiles of the canvas 
let shipYaxis = tileSize * rows - tileSize*2;

let ship = {
    x : shipXaxis,
    y : shipYaxis,
    width : shipWidth,
    height : shipHeight
}

let shipImg;
//ship moving speed
let shipVelocityX = tileSize; 

//enemy
let enemyArray = [];
// defining enemy size 
let enemyWidth = tileSize*2;
let enemyHeight = tileSize*2;
// enemies will start from the second tile horizontally and vertically.
//ie: from the co-ordinates 1,1.
let enemyX = tileSize;
let enemyY = tileSize;
let enemyImg;

//initial rows and columns of the enemies.
let enemyRows = 2;
let enemyColumns = 3;

//NO. of starting enemies 
let enemyCount = 0;

//velocity of the enemies
let enemyVelocityX = 1; 

//bullets
let bulletArray = [];
let bulletVelocityY = -10; //bullet moving speed

let score = 0;
let gameOver = false;

window.onload = function() {
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;

    //it requests to get 2D context 
    context = board.getContext("2d"); 

    //Spaceship image 
    //creating an 'Image' object of the ship
    shipImg = new Image();
    shipImg.src = "./spaceship.png";
    shipImg.onload = function() {
      //as it is a canvas we need to keep drawin the spaceship
        context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);
    }
    //enemy image 
    //creating an 'Image' object of the enemy
    enemyImg = new Image();
    enemyImg.src = "./enemies.png";
    createEnemies();


    //The requestAnimationFrame(update) function is called to
    //schedule the next frame of the animation.
    requestAnimationFrame(update);

    //adding an event listener(keydown and keyup) to move the ship when the keys are used 
    //by associating it with the function moveShip amd shoot
    document.addEventListener("keydown", moveShip);
    document.addEventListener("keyup", shoot);
}

function update() {
    
    requestAnimationFrame(update);

    if (gameOver) {
        location.href = "result.html";
        return;
    }

    //To clear out the first drawing of the spaceship while moving 
    //clearRect() is a method of the CanvasRenderingContext2D interface, used for drawing rectangles, images,
    // or other objects on a canvas.
    //This method is called with four arguments: the x-coordinate of the upper-left corner of the rectangle, 
    //the y-coordinate of the upper-left corner of the rectangle, the width of the rectangle, and the height of the rectangle.
    //In the given code, the clearRect() method is called before the animation starts to ensure that the canvas
    // is empty. This prevents the previous frame of the animation from being displayed on the canvas during the current frame.
    context.clearRect(0, 0, board.width, board.height);

    //Spaceship
    context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);

    //enemy
    for (let i = 0; i < enemyArray.length; i++) {
        let enemy = enemyArray[i];
        // If an enemy is alive, its behavior is updated.
        if (enemy.alive) {

            //This line updates the x-coordinate of the enemy by adding the enemyVelocityX value.
            //This typically represents the horizontal movement of the enemy.
            enemy.x += enemyVelocityX;

        //if enemy touches the borders
        if (enemy.x + enemy.width >= board.width || enemy.x <= 0) {

            //then the direction of the enemy is flipped 
            enemyVelocityX *= -1;

            //This adjusts the enemy's position to move it away from the border,
            // preventing it from getting stuck at the edge.
            enemy.x += enemyVelocityX*2;

            //move all enemies down by one row or by the height of one enemy
            for (let j = 0; j < enemyArray.length; j++) {
                enemyArray[j].y += enemyHeight;
            }
        }
        
    context.drawImage(enemyImg, enemy.x, enemy.y, enemy.width, enemy.height);


        //This checks if the y-coordinate of the current enemy is greater than or equal to the y-coordinate of the ship. 
        //If true, it sets the gameOver variable to true, indicating that the game is over.
        if (enemy.y >= ship.y) {
            gameOver = true;
        }

        }
    }

    //bullets
    for (let i = 0; i < bulletArray.length; i++) {
        let bullet = bulletArray[i];

        //This line updates the y-coordinate of the bullet by adding the bulletVelocityY value. 
        //This typically represents the vertical movement of the bullet, causing it to move upward.
        bullet.y += bulletVelocityY;
        context.fillStyle="white";

        //fillRect = fill rectangle
        context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

        //bullet collision with enemys
        for (let j = 0; j < enemyArray.length; j++) {
            let enemy = enemyArray[j];

            //!bullet.used: Ensures that the bullet has not been used previously
            //enemy.alive: Ensures that the enemy is still alive.
            //detectCollision(bullet, enemy): Calls a function (detectCollision) to check if there is a collision between the bullet and the enemy.
            if (!bullet.used && enemy.alive && detectCollision(bullet, enemy)) {
                bullet.used = true;
                enemy.alive = false;
                enemyCount--;
                score += 100;
                localStorage.setItem("score",score)
            }
        }
    }

    //clear bullets
    //The length of the bulletArray is greater than 0 
    //first bullet in the array is used 
    //or the bullet reaches the end of the canvas
    while (bulletArray.length > 0 && (bulletArray[0].used || bulletArray[0].y < 0)) {
        bulletArray.shift(); //removes the first element of the array
    }

    //next level
    if (enemyCount == 0) {

        //bonus point when all the enemies are cleared
        score += 500;

        //increase the number of enemys in columns by 1
        //This is done using Math.min to limit the increase and prevent it from going beyond the specified value set that is columns/2 -2.
        enemyColumns = Math.min(enemyColumns + 1, columns/2 -2); 

        //increase the number of enemys in rows by 1
        //This is done using Math.min to limit the increase and prevent it from going beyond the specified value set that is rows-4.
        enemyRows = Math.min(enemyRows + 1, rows-4);  
        if (enemyVelocityX > 0) {

            // If the enemies are moving towards the right, their speed is increased by 0.2 and if they are moving towards the left, their speed is decreased by 0.2
            enemyVelocityX += 0.2; //increase the enemy movement speed towards the right
        }
        else {
            enemyVelocityX -= 0.2; //increase the enemy movement speed towards the left
        }

        //Reset the enemyArray and bulletArray arrays, clearing any existing enemies and bullets.
        enemyArray = [];
        bulletArray = [];
        createEnemies();
    }

    //score display on the screen
    context.fillStyle="white";
    context.font="22px courier";
    context.fillText( "Score: " + score, 5, 20);
    
}

function moveShip(event) {
    if (gameOver) {
        location.href = "result.html";
        return;
    }


    //to move the spaceship left by one tile
    //ship.x - shipVelocityX >= 0 so that the spaceship doesnt bounce off from the screen
    if (event.code == "ArrowLeft" && ship.x - shipVelocityX >= 0) {
        ship.x = ship.x - shipVelocityX; 
    }
    //to move the spaceship right by one tile
    //ship.x + shipVelocityX + ship.width <= board.width so that the spaceship doesnt bounce off from the screen
    else if (event.code == "ArrowRight" && ship.x + shipVelocityX + ship.width <= board.width) {
        ship.x = ship.x + shipVelocityX;
    }
}
//creating a function so that each time a set of enemies are cleared 
//more enemies need to pop-up
function createEnemies() {
    for (let canvasColumn = 0; canvasColumn < enemyColumns; canvasColumn++) {
        for (let canvasRow = 0; canvasRow < enemyRows; canvasRow++) {
            let enemy = {
                img : enemyImg,
                x : enemyX + canvasColumn*enemyWidth,
                y : enemyY + canvasRow*enemyHeight,
                width : enemyWidth,
                height : enemyHeight,
                //setting the enemy to alive by default
                alive : true
            }
            enemyArray.push(enemy);
        }
    }
    enemyCount = enemyArray.length;
}

// audio for my bullets 
var shootSound = new Audio('./audio/shooting.mp3');
function shoot(event) {
    if (gameOver) {
        // Redirect to result.html when game is over
        location.href = "result.html";
        return; 
    }

    if (event.code == "Space") {
        //shoot
        let bullet = {
            x : ship.x + shipWidth*15/32,
            y : ship.y,
            width : tileSize/8,
            height : tileSize/2,
            used : false
        }
        bulletArray.push(bullet);

        //play the shoot sound 
        shootSound.play();
    }
} 

//mobile responsive 
//buttons to control my spaceship
let leftButton = document.getElementById('leftButton');
let shootButton = document.getElementById('shootButton');
let rightButton = document.getElementById('rightButton');

// Check screen width and display mobile controls if needed
function checkScreenWidth() {
  const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

  if (screenWidth < 900) {
    document.getElementById('mobileControls').style.display = 'flex';
  } else {
    document.getElementById('mobileControls').style.display = 'none';
  }
}

// Event listeners for mobile controls
leftButton.addEventListener('click', () => moveShipMobile('left'));
rightButton.addEventListener('click', () => moveShipMobile('right'));
shootButton.addEventListener('click', shootMobile);

// Function to move the ship on mobile
function moveShipMobile(direction) {
  if (gameOver) {
    location.href = "result.html";
    return;
  }

  if (direction === 'left' && ship.x - shipVelocityX >= 0) {
    ship.x = ship.x - shipVelocityX;
  } else if (direction === 'right' && ship.x + shipVelocityX + ship.width <= board.width) {
    ship.x = ship.x + shipVelocityX;
  }
}

// Function to shoot bullets on mobile
function shootMobile() {
  if (gameOver) {
    // Redirect to result.html when the game is over
    location.href = "result.html";
    return;
  }

  // Shoot
  let bullet = {
    x: ship.x + shipWidth * 15 / 32,
    y: ship.y,
    width: tileSize / 8,
    height: tileSize / 2,
    used: false
  };
  bulletArray.push(bullet);

  // Play the shoot sound
  shootSound.play();
}

// Check screen width initially and on resize
checkScreenWidth();
window.addEventListener('resize', checkScreenWidth);



function detectCollision(a, b) {
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
           a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}