document.getElementById("login-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorMessage = document.getElementById("error-message");

    if (username === "testuser" && password === "password123") {
        window.location.href = "home.html";
    } else {
        errorMessage.innerText = "Invalid username or password. Please try again.";
        errorMessage.style.display = "block";
    }
});
