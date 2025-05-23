// importation de la function pour récupéré le Token

import { authFetch } from "./urlWrapperApiToken.js";
// import de la variable d'environnement VITE
const API_URL = import.meta.env.VITE_API_URL;

/**
 * Créer une nouvelle oeuvre
 * @param {string} id- Id de l'user à supprimer
 * @param {string} token - token de l'utilisateur conecté
 */
// function pour récupérer tous les utilisateurs
export async function getAllUsers() {
  // on fait la demande API avec la route parametrée du back
  const response = await authFetch(`${API_URL}/admin/users`, {
    // on complete le header avec les données de formulaire et le token
    method: "GET",
    credentials: "include",
  });
  // on vérifie que l'on a une réponse
  if (!response.ok) {
    // Gestion des erreurs HTTP
    throw new Error(`Erreur HTTP : ${response.status} ${response.statusText}`);
  }
  // on récupère la réponse de l'API avec les données demandées (ici les données de tous les utilisateurs)
  const dataUsers = await response.json();
  // console.log(dataUsers);
  // on renvoie les données
  return dataUsers;
}

/**
 * Suprimmer un utilisateur
 * @param {string} id- Id de l'user à supprimer
 */

// function pour supprimmer un utilisateur par son ID
export async function deleteOneUser(id) {
  const response = await authFetch(`${API_URL}/admin/user/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  //  Vérifie si la requête a réussi (statut HTTP 2xx)
  if (!response.ok) {
    const errorBody = await response.text(); // on lit le texte brut, qu'il soit JSON ou non
    const error = new Error(errorBody || "Une erreur est survenue lors de la suppression de l'utilisateur");
    error.response = response;
    throw error;
  }

  // Si tout va bien, on parse le JSON
  const deletedUser = await response.json();
  return deletedUser;
}

/**
 * Supprimmer un ingrédient
 * @param {string} id- Id de l'ingrédient à supprimer
 */
// function pour supprimer un ingrédient par son ID
export async function deleteOneIngredient(id) {
  // on fait la demande API avec la route paramétré du back, l'ID de l'ingredient.
  // on précise la méthode et le contenu du header avec le token
  const response = await authFetch(`${API_URL}/admin/ingredients/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  // on récupère la réponse de l'API (ici la suppression de l'ingrédient)
  const data = await response.json();

  if (!response.ok) {
    const error = new Error("Erreur lors de la suppression");
    error.status = response.status;
    error.response = response;

    // Ajoute des détails utiles dans error.message
    if (Array.isArray(data.details)) {
      error.message = data.details.join(" / ");
      error.details = data.details; // au cas où tu veux l'afficher proprement
    } else {
      error.message = data.message || "Erreur serveur.";
    }

    throw error;
  }

  // on renvoie les données
  return data;
}

/**
 * Supprimmer un film
 * @param {string} id- ID du film à supprimer
 */
// function pour supprimmer une motion par son ID
export async function deleteOneMotion(id) {
  const response = await authFetch(`${API_URL}/admin/motions/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  //  Vérifie le statut HTTP
  if (!response.ok) {
    const errorBody = await response.text(); // on lit même si ce n’est pas du JSON valide
    const error = new Error(errorBody || "Erreur lors de la suppression");
    error.response = response;
    throw error;
  }

  // Si OK, on parse le JSON
  const deletedMotion = await response.json();
  return deletedMotion;
}

/**
 * Supprimmer un utilisateur
 * @param {string} ingredient- l'éngredient à créer
 */
// function pour créeé un ingredient
export async function createIngredient(ingredient) {
  // on fait la demande API avec la route paramétrée du back pour créer un ingredient.
  // on précise la methode et le contenu du header avec le èoken
  const response = await authFetch(`${API_URL}/admin/ingredients`, {
    method: "POST",
    credentials: "include",

    // on transforme le body en string
    body: JSON.stringify(ingredient),
  });
  // on récupere la réponse de l'API (ici la création d'un ingrédient)
  const data = await response.json();
  // on vérifie que l'on a une réponse positive
  if (!response.ok) {
    // Construire un message d'erreur plus lisible selon les détails
    const message = data.details && Array.isArray(data.details) ? JSON.stringify(data.details) : data.message || "Une erreur est survenue";

    const error = new Error(message);
    error.status = response.status;
    error.response = response;

    throw error;
  }
  // Renvoie l'ingrédient créé si tout va bien
  return data;
  // si une erreur survient on l'indique
}

/**
 * Supprimer une recette
 * @param {string} id- Id de la recette à supprimer
 */
// fonction pour supprimmer une recette
export async function deleteOneRecipe(id) {
  const response = await authFetch(`${API_URL}/admin/recipes/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  // Vérifie le statut de la réponse
  if (!response.ok) {
    const errorBody = await response.text(); // pour récupérer le message d'erreur, même si ce n'est pas un JSON valide
    const error = new Error(errorBody || "Une erreur est survenue lors de la suppression de la recette");
    error.response = response;
    throw error;
  }

  //  Si tout va bien, on parse le JSON et retourne la recette supprimée
  const deletedRecipe = await response.json();
  return deletedRecipe;
}

/**
 * Modifier une nouvelle recette
 * @param {string} formData- Formulaire de la recette à modifier
 */

// fonction pour modifier une recette
export async function modifyOneRecipe(id, formData) {
  // on fait la demande API avec la route paramétrée du back avec l'ID de la recette.
  // on précise la méthode et le contenu du header avec le token
  const response = await authFetch(`${API_URL}/admin/recipes/${id}`, {
    method: "PATCH",
    credentials: "include",
    body: formData,
  });
  // on récupère la réponse de l'API (ici la modification d'une recette)
  const changedRecipe = await response.json();
  // on vérifie que l'on a une réponse positive
  if (!response.ok) {
    const error = new Error(changedRecipe?.details?.[0] || "Erreur lors de la modification");
    error.response = response; //  on attache le status
    throw error;
  }
  // Renvoie la recette modifiée si tout va bien
  return changedRecipe;
}

/**
 * Modification d'une motion en envoyant une requête PATCH
 * @async
 * @function modifyOneMotion
 * @param {string} id - ID de la motion à modifier
 * @param {FormData} formData - Données du formulaire contenant les informations de la motion
 * @returns {Promise<object>} - La motion modifiée
 * @throws {Error} - En cas d'erreur lors de la requête ou de la réponse
 */

// fonction pour modifier une motion
export async function modifyOneMotion(id, formData) {
  const response = await authFetch(`${API_URL}/admin/motions/${id}`, {
    method: "PATCH",
    credentials: "include",
    body: formData,
  });
  // on vérifie que l'on a une réponse positive
  const changedMotion = await response.json();
  if (!response.ok) {
    const error = new Error(changedMotion?.details?.[0] || "Erreur lors de la modification de l'œuvre");
    error.status = response.status; //  on attache le status
    throw error;
  }
  // Renvoie la motion modifiée si tout va bien
  return changedMotion;
}
