//variable globeau
let allWorks = [];
let allCategories = [];
const token = localStorage.getItem('token');



async function recupererTravaux() {
    try {
        const reponse = await fetch('http://localhost:5678/api/works');
        const travaux = await reponse.json();
        allWorks = travaux;
        afficherTravaux(travaux);
    } catch (error) {
        console.error('Erreur lors de la récupération des travaux :', error);
    }
}

async function recupererCategories() {
    const reponse = await fetch('http://localhost:5678/api/categories');
    const categories = await reponse.json();
    allCategories = categories;
    return categories;
}



function afficherTravaux(travaux) {
    const galerie = document.querySelector('.gallery');
    galerie.innerHTML = '';

    travaux.forEach(function(travail) {
        const figure = document.createElement('figure');
        const image = document.createElement('img');
        const figcaption = document.createElement('figcaption');

        image.src = travail.imageUrl;
        image.alt = travail.title;
        figcaption.textContent = travail.title;

        figure.appendChild(image);
        figure.appendChild(figcaption);
        galerie.appendChild(figure);
    });
}



// Je crée le bouton "Tous" qui affiche tous les travaux
function creerBoutonTous(container) {
    const bouton = document.createElement('button');
    bouton.textContent = 'Tous';
    bouton.classList.add('filter-btn', 'active');

    bouton.addEventListener('click', function() {
        afficherTravaux(allWorks);
        activerBouton(bouton);
    });

    container.appendChild(bouton);
}

// J'active le bouton cliqué et je désactive les autres
function activerBouton(boutonActif) {
    const container = document.querySelector('.filter-container');

    container.querySelectorAll('.filter-btn').forEach(function(bouton) {
        bouton.classList.remove('active');
    });

    boutonActif.classList.add('active');
}

// Je crée un bouton pour chaque catégorie
function creerBoutonCategorie(categorie, container) {
    const bouton = document.createElement('button');
    bouton.textContent = categorie.name;
    bouton.classList.add('filter-btn');

    bouton.addEventListener('click', function() {
        const travauxFiltres = allWorks.filter(function(travail) {
            return travail.categoryId === categorie.id;
        });
        afficherTravaux(travauxFiltres);
        activerBouton(bouton);
    });

    container.appendChild(bouton);
}



// Je redirige vers la page de connexion
function allerAuLogin() {
    window.location.href = 'login.html';
}

// Je déconnecte l'utilisateur
function seDeconnecter() {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
}

// Je mets à jour le bouton login/logout selon si on est connecté ou pas
function mettreAJourBoutonConnexion() {
    const boutonConnexion = document.getElementById('login-btn');

    if (token) {
        boutonConnexion.textContent = 'logout';
        boutonConnexion.addEventListener('click', seDeconnecter);
    } else {
        boutonConnexion.textContent = 'login';
        boutonConnexion.addEventListener('click', allerAuLogin);
    }
}

// Je montre ou je cache les boutons selon si on est connecté ou pas
function mettreAJourAffichage() {
    const boutonModifier = document.querySelector('.edit-btn');
    const containerFiltres = document.querySelector('.filter-container');

    if (token) {
        boutonModifier.style.display = 'flex';
        containerFiltres.style.display = 'none';
    } else {
        boutonModifier.style.display = 'none';
        containerFiltres.style.display = 'flex';
    }
}

// J'ajoute la barre noire "mode édition" en haut de la page
function ajouterBarreAdmin() {
    const barreAdmin = document.createElement('div');
    barreAdmin.classList.add('admin-bar');
    barreAdmin.innerHTML = '<img src="./assets/icons/edit-icon.svg" alt="Modifier">' +
        '<span>Mode édition</span>';
    document.body.prepend(barreAdmin);
}



const modal = document.getElementById('modal');
const fondModal = document.querySelector('.modal-overlay');
const boutonFermer = document.querySelector('.modal-close');
const vueGalerie = document.querySelector('.modal-gallery-view');
const vueFormulaire = document.querySelector('.modal-form-view');
const galerieModal = document.querySelector('.modal-gallery');
const boutonAjouterPhoto = document.querySelector('.btn-add-photo');
const boutonRetour = document.querySelector('.modal-back');
const formulaireModal = document.querySelector('.modal-form');
const inputImage = document.getElementById('modal-image');
const inputTitre = document.getElementById('modal-title');
const selectCategorie = document.getElementById('modal-category');
const messageErreur = document.querySelector('.modal-error');

// J'ouvre la modal
function ouvrirModal() {
    if (!token) return;

    remplirGalerieModal();
    remplirSelectCategories();

    formulaireModal.reset();
    messageErreur.textContent = '';

    document.querySelector('.preview-image').src = './assets/icons/image-placeholder.svg';

    vueGalerie.style.display = 'block';
    vueFormulaire.style.display = 'none';

    modal.classList.add('is-open');
}

// Je ferme la modal
function fermerModal() {
    modal.classList.remove('is-open');
}

// Je remplis la galerie dans la modal avec tous les travaux
function remplirGalerieModal() {
    galerieModal.innerHTML = '';

    allWorks.forEach(function(travail) {
        const div = document.createElement('div');
        div.className = 'modal-work';
        div.id = travail.id;

        div.innerHTML =
            "<img src='" + travail.imageUrl + "' alt='" + travail.title + "'>" +
            "<button type='button' class='modal-delete'>" +
                "<img src='./assets/icons/trash-can-solid.svg' alt='Supprimer'>" +
            "</button>";

        div.querySelector('.modal-delete').addEventListener('click', function() {
            supprimerTravail(travail.id);
        });

        galerieModal.appendChild(div);
    });
}

// Je remplis le menu déroulant des catégories dans le formulaire
function remplirSelectCategories() {
    if (!selectCategorie) return;

    selectCategorie.innerHTML = '';

    const optionVide = document.createElement('option');
    optionVide.value = '';
    optionVide.textContent = '';
    selectCategorie.appendChild(optionVide);

    allCategories.forEach(function(categorie) {
        const option = document.createElement('option');
        option.value = categorie.id;
        option.textContent = categorie.name;
        selectCategorie.appendChild(option);
    });
}

// Je passe à la vue formulaire
function afficherFormulaireModal() {
    vueGalerie.style.display = 'none';
    vueFormulaire.style.display = 'block';
}

// Je reviens à la vue galerie
function afficherGalerieModal() {
    vueGalerie.style.display = 'block';
    vueFormulaire.style.display = 'none';
}

// Je montre un aperçu de l'image choisie avant l'envoi
function apercuImage(event) {
    const image = event.target.files[0];

    if (image) {
        const apercu = document.querySelector('.preview-image');
        apercu.src = URL.createObjectURL(image);
    }
}

// J'envoie le nouveau travail à l'API
async function envoyerFormulaire(event) {
    event.preventDefault();

    const image = inputImage.files[0];
    const titre = inputTitre.value.trim();
    const categorieId = selectCategorie.value;

    if (!image || !titre || !categorieId) {
        messageErreur.textContent = 'Veuillez remplir tous les champs.';
        return;
    }

    const formData = new FormData();
    formData.append('image', image);
    formData.append('title', titre);
    formData.append('category', categorieId);

    try {
        const reponse = await fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + token },
            body: formData
        });

        if (reponse.ok) {
            const nouveauTravail = await reponse.json();
            allWorks.push(nouveauTravail);
            afficherTravaux(allWorks);
            remplirGalerieModal();
            formulaireModal.reset();
            messageErreur.textContent = '';
        } else {
            messageErreur.textContent = "Erreur lors de l'envoi.";
        }
    } catch (error) {
        console.error("Erreur lors de l'envoi du formulaire :", error);
        messageErreur.textContent = 'Une erreur est survenue, réessayez.';
    }
}

// Je supprime un travail
async function supprimerTravail(id) {
    try {
        const reponse = await fetch('http://localhost:5678/api/works/' + id, {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + token }
        });

        if (reponse.ok) {
            allWorks = allWorks.filter(function(travail) {
                return travail.id !== id;
            });
            afficherTravaux(allWorks);
            remplirGalerieModal();
        } else {
            console.error('Erreur lors de la suppression :', reponse.status);
        }
    } catch (error) {
        console.error('Erreur lors de la suppression :', error);
    }
}

// J'active les boutons de la modal seulement si on est connecté
if (token) {
    document.querySelector('.edit-btn').addEventListener('click', ouvrirModal);
    boutonFermer.addEventListener('click', fermerModal);
    fondModal.addEventListener('click', fermerModal);
    boutonAjouterPhoto.addEventListener('click', afficherFormulaireModal);
    boutonRetour.addEventListener('click', afficherGalerieModal);
    inputImage.addEventListener('change', apercuImage);
    formulaireModal.addEventListener('submit', envoyerFormulaire);
}



async function lancerSite() {
    await recupererTravaux();
    const categories = await recupererCategories();

    const containerFiltres = document.querySelector('.filter-container');
    containerFiltres.innerHTML = '';

    creerBoutonTous(containerFiltres);
    categories.forEach(function(categorie) {
        creerBoutonCategorie(categorie, containerFiltres);
    });

    mettreAJourBoutonConnexion();
    mettreAJourAffichage();

    if (token) {
        document.body.classList.add('admin');
        ajouterBarreAdmin();
        remplirSelectCategories();
    }
}

lancerSite();