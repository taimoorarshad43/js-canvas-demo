const loginForm = document.getElementById("loginForm");
const errorMessage = document.getElementById("error-message");

loginForm.addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent default form submission behavior

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Dummy validation (replace with backend validation)
    if (username === "user" && password === "password") {
        // Redirect to the game page (replace with backend logic)
        window.location.href = "/game";
    } else {
        errorMessage.textContent = "Invalid username or password";
    }
});
