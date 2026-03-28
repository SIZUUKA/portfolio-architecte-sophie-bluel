
// Form submit
const form = document.getElementById("login-form");
const loginError = document.getElementById("login-error");
async function seConnecter(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;// ce que l'utilisateur a tapé
    const password = document.getElementById("password").value;


    const response = await fetch('http://localhost:5678/api/users/login', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({email:email, password:password})
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

form.addEventListener("submit", seConnecter);