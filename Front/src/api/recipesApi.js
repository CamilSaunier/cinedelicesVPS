import { authFetch } from "./urlWrapperApiToken.js";
// import de la variable d'environnement VITE
const API_URL = import.meta.env.VITE_API_URL;

/**
 * Récupère toutes les recettes depuis l'API.
 * @async
 * @function getRecipes
 * @returns {Promise<Array>} - Un tableau d'objets contenant les recettes.
 * @throws {Error} - Si une erreur se produit lors de la récupération des données
 */

export async function getRecipes() {
  // on fait la demande API avec la route parametrée du back
  const response = await fetch(`${API_URL}/recipes`);
  // on récupère la réponse de l'API (ici les recettes disponibles)
  const dataRecipes = await response.json();
  // on vérifie que l'on a une réponse
  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des recettes");
  }
  // on renvoie les données
  return dataRecipes;
}

/**
 * Récupère une recette par son ID.
 * @param  id - L'identifiant de la recette
 * @async
 * @function getRecipeById
 * @returns {Promise<Object>} - Un objet contenant les données de la recette.
 * @throws {Error} - Si une erreur se produit lors de la récupération des données.
 */

export async function getRecipeById(id) {
  // on fait la demande API avec la route paramétrée du back et l'id de la recette
  const response = await fetch(`${API_URL}/recipes/${id}`);

  // on récupere la réponse de l'API (ici la recette ciblé)
  const recipe = await response.json();

  // on vérifie que la réponse est valide
  // on vérifie que l'on a une réponse
  if (!response.ok) {
    const error = new Error(recipe?.details?.[0] || "Erreur lors de la récupération des recettes");
    error.status = response.status; // Ajoute le code HTTP ici
    throw error;
  }
  // on renvoie les données
  return recipe;
}

/**
 * Créer une nouvelle recette
 * @async
 * @function createRecipes
 * @param {FormData} formData- les Données du formulaire de création
 * @param {string} token - token de l'utilisateur connecté
 * @returns {Promise<Object>} - Un objet contenant les données de la recette créée.
 * @throws {Error} - Si une erreur se produit lors de la création de la recette.
 */
export async function createRecipes(formData) {
  // on fait la demande API avec la route paramétrée du back
  // on précise la méthode et le contenu du header avec le token
  const response = await authFetch(`${API_URL}/recipes`, {
    method: "POST",
    body: formData,
  });
  // on récupère la réponse de l'API (ici les données de la recette crée)
  const dataRecipe = await response.json();
  // on vérifie que l'on a une réponse
  if (!response.ok) {
    const error = new Error(dataRecipe?.details?.[0] || "Erreur lors de la connexion");
    error.response = response; //  on attache le status
    throw error;
  }
  // on renvoie les données
  return dataRecipe;
}

/**
 * Récupèration des recettes en fonction de la recherche
 * @async
 * @function getRecipeBySearch
 * @param {string} search - Le terme de recherche
 * @returns {Promise<Array>} - Un tableau d'objets contenant les recettes trouvées.
 * @throws {Error} - Si une erreur se produit lors de la récupération des données.
 */

export async function getRecipeBySearch(search) {
  if (!search?.trim()) {
    // on retourne un tableau vide ou on gère ça autrement
    return [];
  }
  // on fait la demande API avec la route paramétrée du back, le mot rechercher
  const response = await fetch(`${API_URL}/recipes/search/${search}`);
  // on récupère la réponse de l'API (ici les recettes trouvées avec le mot recherché)
  const foundRecipes = await response.json();
  // on vérifie que l'on a une réponse
  if (!response.ok) {
    const error = new Error(foundRecipes?.details?.[0] || "Erreur lors de la connexion");
    error.response = response;
    error.status = response.status; //  on attache le status
    throw error;
  }

  // on renvoie les données
  return foundRecipes;
}
