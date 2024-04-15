const canvas = document.getElementById("characterCanvas");
const ctx = canvas.getContext("2d");

let character = {
    x: 50,
    y: 50,
    size: 20,
    color: "blue",
    speed: 5
};

let squares = [];

let bullet = {
    x: 0,
    y: 0,
    size: 2,
    color: "green",
    speed: 5
}

// Generate random squares
function generateSquares(numSquares) {
    for (let i = 0; i < numSquares; i++) {
        squares.push({
            x: Math.random() * (canvas.width - character.size), //minus character size b/c same size as enemy and want to spawn away from boundary
            y: Math.random() * (canvas.height - character.size),
            size: 20,
            color: "red",
            speed: Math.random() * 3 + 1, // Random speed between 1 and 4
            xDirection: Math.random() > 0.5 ? 1 : -1,
            yDirection: Math.random() > 0.5 ? 1 : -1
        });
    }
}


function drawCharacter() { //draws both character and squares
    //Character Block
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = character.color;
    ctx.fillRect(character.x, character.y, character.size, character.size); //character size is both height and width b/c square

    //Enemy Block
    for (const square of squares) {
        ctx.fillStyle = square.color;
        ctx.fillRect(square.x, square.y, square.size, square.size);
    }
}


//Changing the coordinates based on input and then redrawing the square while also checking for collision
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
    character.x = Math.max(0, Math.min(canvas.width - character.size, character.x));
    character.y = Math.max(0, Math.min(canvas.height - character.size, character.y));

    checkCollisions();
    drawCharacter();
}

function moveSquares() {
    for (const square of squares) {
        square.x += square.speed * square.xDirection;
        square.y += square.speed * square.yDirection;

        // Reverse direction if hitting canvas boundaries
        if (square.x <= 0 || square.x >= canvas.width - square.size) {
            square.xDirection *= -1;
        }

        if (square.y <= 0 || square.y >= canvas.height - square.size) {
            square.yDirection *= -1;
        }
    }
}

function checkCollisions() {
    for (let i = squares.length - 1; i >= 0; i--) {
        const square = squares[i];
        if (
            character.x < square.x + square.size &&
            character.x + character.size > square.x &&
            character.y < square.y + square.size &&
            character.y + character.size > square.y
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
            case 37: //left
            case 38: //up
            case 39: //right
            case 40: //down
        }
}

function drawBullet(){
    ctx.fillStyle = bullet.color;
    ctx.fillRect(square.x, square.y, bullet.size, bullet.size);
}

generateSquares(5); // Generate 5 random squares
setInterval(() => {
    moveSquares();
    checkCollisions(); //should this be here twice? Already in drawCharacter
    drawCharacter();
}, 30);

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


~~~~~~~~~~~~~~~~~~ TODO ~~~~~~~~~~~~~~~~~~~~~~~
Add projectiles out of character

shootBullet()
    Will have to work with checkCollisions()
    Read player input
    drawBullet()?

*/