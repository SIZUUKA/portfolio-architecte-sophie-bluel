
// Form submit
const form = document.getElementById("login-form");
const loginError = document.getElementById("login-error");
async function submitContactForm(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;// valuepour avoir l'utilisatue ce qu'il a tapé .
    const password = document.getElementById("password").value;

    const loginData = {
        email: email,
        password: password
    };

    const response = await fetch('http://localhost:5678/api/users/login', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(loginData)
    });

    if (response.ok) {
        loginError.textContent = "";
        const data = await response.json();
        localStorage.setItem("token", data.token);
        window.location.href = "index.html";
    } else {
        loginError.textContent = "Erreur dans l’identifiant ou le mot de passe";
    }
}

form.addEventListener("submit", submitContactForm);