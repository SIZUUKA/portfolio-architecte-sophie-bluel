
let allWorks = [];

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
    container
        .querySelectorAll(".filter-btn")
        .forEach(function (bouton) {
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

async function lancerSite() {
    await recupererTravaux();
    const categories = await recupererCategories();
    const containerFiltres = document.querySelector(".filter-container");

    containerFiltres.innerHTML = "";
    creerBoutonTous(containerFiltres);
    categories.forEach(function (categorie) {
        creerBoutonCategorie(categorie, containerFiltres);
    });
}

lancerSite();




