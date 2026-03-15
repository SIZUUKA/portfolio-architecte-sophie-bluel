
let allWorks = [];
const token = localStorage.getItem("token");

async function recupererTravaux() {
    try {
        const reponse = await fetch("http://localhost:5678/api/works");
        const travaux = await reponse.json();
        allWorks = travaux;
        afficherTravaux(travaux);
    } catch (error) {
        console.error("Erreur lors de la recuperation des travaux :", error);
    }
}

function afficherTravaux(travaux) {
    const galerie = document.querySelector(".gallery");
    galerie.innerHTML = "";

    travaux.forEach(function (travail) {
        const figure = document.createElement("figure");
        const image = document.createElement("img");
        const figcaption = document.createElement("figcaption");

        image.src = travail.imageUrl;
        image.alt = travail.title;
        figcaption.textContent = travail.title;

        figure.appendChild(image);
        figure.appendChild(figcaption);
        galerie.appendChild(figure);
    });
}

async function recupererCategories() {
    const reponse = await fetch("http://localhost:5678/api/categories");
    return reponse.json();
}

function creerBoutonTous(container) {
    const bouton = document.createElement("button");
    bouton.textContent = "Tous";
    bouton.classList.add("filter-btn", "active");

    bouton.addEventListener("click", function () {
        afficherTravaux(allWorks);
        activerBoutonFiltre(bouton);
    });

    container.appendChild(bouton);
}

function activerBoutonFiltre(boutonActif) {
    const container = document.querySelector(".filter-container");
    container.querySelectorAll(".filter-btn").forEach(function (bouton) {
        bouton.classList.remove("active");
    });

    boutonActif.classList.add("active");
}

function creerBoutonCategorie(categorie, container) {
    const bouton = document.createElement("button");
    bouton.textContent = categorie.name;
    bouton.classList.add("filter-btn");

    bouton.addEventListener("click", function () {
        const travauxFiltres = allWorks.filter(function (travail) {
            return travail.categoryId === categorie.id;
        });
        afficherTravaux(travauxFiltres);
        activerBoutonFiltre(bouton);
    });

    container.appendChild(bouton);
}

function allerAuLogin() {
    window.location.href = "login.html";
}

function seDeconnecter() {
    localStorage.removeItem("token");
    window.location.href = "index.html";
}

function mettreAJourBoutonConnexion() {
    const boutonConnexion = document.getElementById("login-btn");
    if (token) {
        boutonConnexion.textContent = "logout";
        boutonConnexion.addEventListener("click", seDeconnecter);
    } else {
        boutonConnexion.textContent = "login";
        boutonConnexion.addEventListener("click", allerAuLogin);
    }
}

function mettreAJourAffichageAdmin() {
    const boutonModifier = document.querySelector(".edit-btn");
    const containerFiltres = document.querySelector(".filter-container");
    if (token) {
        boutonModifier.style.display = "block";
        containerFiltres.style.display = "none";
    } else {
        boutonModifier.style.display = "none";
        containerFiltres.style.display = "block";
    }
}

function ajouterBarreAdmin() {
    const barreAdmin = document.createElement("div");
    barreAdmin.classList.add("admin-bar");
    barreAdmin.innerHTML =
        '<img src="./assets/icons/edit-icon.svg" alt="Modifier">' +
        "<span>Mode edition</span>";
    document.body.prepend(barreAdmin);
}

async function lancerSite() {
    await recupererTravaux();
    const categories = await recupererCategories();
    const containerFiltres = document.querySelector(".filter-container");

    containerFiltres.innerHTML = "";
    creerBoutonTous(containerFiltres);
    categories.forEach(function (categorie) {
        creerBoutonCategorie(categorie, containerFiltres);
    });

    mettreAJourBoutonConnexion();
    mettreAJourAffichageAdmin();
    if (token) {
        document.body.classList.add("admin");
        ajouterBarreAdmin();
    }
}

lancerSite();
