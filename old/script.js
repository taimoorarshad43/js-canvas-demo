// Get the canvas element and context
const canvas = document.getElementById("characterCanvas");
const ctx = canvas.getContext("2d");

// Character properties
let character = {
    x: 200,
    y: 200,
    size: 20,
    color: "blue",
    speed: 10
};

// Handle keyboard input
document.addEventListener("keydown", moveCharacter);

// Function to draw the character on the canvas
function drawCharacter() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = character.color;
    ctx.fillRect(character.x, character.y, character.size, character.size);
}

// Function to handle keyboard input and move the character
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

    // Ensure the character stays within the canvas boundaries
    character.x = Math.max(0, Math.min(canvas.width - character.size, character.x));
    character.y = Math.max(0, Math.min(canvas.height - character.size, character.y));

    // Redraw the character after movement
    drawCharacter();
}

// Initial character draw
drawCharacter();
