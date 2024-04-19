const canvas = document.getElementById("characterCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let character = {
    x: 50,
    y: 50,
    width: 50,
    height: 50,
    color: "blue",
    sprite: document.getElementById("playerSprite"),
    speed: 5
};

let squares = [];

let bullets = [];


// Generate random squares
function generateSquares(numSquares) {
    for (let i = 0; i < numSquares; i++) {
        squares.push({
            x: Math.random() * (canvas.width - character.width), //minus character size b/c same size as enemy and want to spawn away from boundary
            y: Math.random() * (canvas.height - character.height),
            height: 40,
            width: 65,
            sprite: document.getElementById("enemySprite"),
            speed: Math.random() * 3 + 1, // Random speed between 1 and 4
            xDirection: Math.random() > 0.5 ? 1 : -1,
            yDirection: Math.random() > 0.5 ? 1 : -1
        });
    }
}

function generateBullet(xdir, ydir){
    // console.log("Character position is?");
    // console.log(character.x);
    // console.log(character.y);
    bullets.push({
        x: character.x,
        y: character.y,
        height: 32,
        width: 32,
        sprite: document.getElementById("bubbleSprite"),
        speed: 7,
        xDirection: xdir,
        yDirection: ydir
    })
}

function drawCharacters() { //main render function that draws all entities
    //Character Block
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ctx.fillStyle = character.color;
    // ctx.fillRect(character.x, character.y, character.size, character.size); //character size is both height and width b/c square
    ctx.drawImage(character.sprite, character.x, character.y, character.width, character.height);

    //Enemy Block
    for (const square of squares) {
        console.log(square);
        // ctx.fillStyle = square.color;
        // ctx.fillRect(square.x, square.y, square.size, square.size);
        ctx.drawImage(square.sprite, square.x, square.y, square.width, square.height);
    }

    //Bullet Block
    for (const bullet of bullets){
        console.log(bullet);
        // ctx.fillStyle = bullet.color;
        // ctx.fillRect(bullet.x, bullet.y, bullet.size, bullet.size);
        ctx.drawImage(bullet.sprite, bullet.x, bullet.y, bullet.width, bullet.height);
    }
}


//Changes character x and y and then calls the main render function as well as the check collision function.
function moveCharacter(event) {
    switch(event.key) {
        case "w":
            character.y -= character.speed;
            break;
        case "s":
            character.y += character.speed;
            break;
        case "a":
            character.x -= character.speed;
            break;
        case "d":
            character.x += character.speed;
            break;
    }

    //Checking for out of bounds
    character.x = Math.max(0, Math.min(canvas.width - character.width, character.x));
    character.y = Math.max(0, Math.min(canvas.height - character.height, character.y));

    checkCollisions();
    drawCharacters();
}

//Modifies the square object movements but doesn't actually render them.
function moveSquares() {
    for (const square of squares) {
        square.x += square.speed * square.xDirection;
        square.y += square.speed * square.yDirection;

        // Reverse direction if hitting canvas boundaries
        if (square.x <= 0 || square.x >= canvas.width - square.width) {
            square.xDirection *= -1;
        }

        if (square.y <= 0 || square.y >= canvas.height - square.width) {
            square.yDirection *= -1;
        }
    }
}

//Checks for geometry overlap and then removes from squares/bullets array.
function checkCollisions() {
    //square block
    for (let i = squares.length - 1; i >= 0; i--) {
        const square = squares[i];
        if (
            character.x < square.x + square.width &&
            character.x + character.width > square.x &&
            character.y < square.y + square.height &&
            character.y + character.height > square.y
        ) 
        {
            // Collision detected, remove the square
            squares.splice(i, 1);
        }
    }
}

//TODO: Implement shooting logic
function shootBullet(event){
        switch(event.key){
            case "j": //left
                generateBullet(-1, 0);
                break;
            case "i": //up
                generateBullet(0, -1);
                break;
            case "l": //right
                generateBullet(1, 0);
                break;
            case "k": //down
                generateBullet(0, 1);
                break;
        }
}

function moveBullets(){
    for(const bullet of bullets){
        bullet.x += bullet.speed * bullet.xDirection;
        bullet.y += bullet.speed * bullet.yDirection;
    }
}

//Where we call the rendering methods
generateSquares(5); // Generate 5 random squares
setInterval(() => {
    moveSquares();
    checkCollisions(); //should this be here twice? Already in drawCharacters
    drawCharacters();
    moveBullets();
}, 30); //This parameter is like FPS?

// Handle keyboard input
document.addEventListener("keydown", moveCharacter);
document.addEventListener("keydown", shootBullet);

// Continually adding squares
setInterval(generateSquares, 10000,1);

/*
~~~~~~~~~~~~~~~~~~ NOTES ~~~~~~~~~~~~~~~~~~~~~

generateSquares()

drawCharacter()

moveCharacter()
    -drawCharacter()
    -checkCollisions()

moveSquares()

checkCollisions()

document.addEventListener("keydown", moveCharacter);

Generally the logic for drawing the ctx and calculating the position is decoupled.


~~~~~~~~~~~~~~~~~~ TODO ~~~~~~~~~~~~~~~~~~~~~~~
Add projectiles out of character

shootBullet()
    Will have to work with checkCollisions()
    Read player input
    drawBullet()?

Test whether we can take out checkCollsions from main loop
*/