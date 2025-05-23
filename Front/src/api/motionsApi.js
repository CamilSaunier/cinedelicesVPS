// importation de la fonction pour récupérer le token

import { authFetch } from "./urlWrapperApiToken.js";
// import de la variable d'environnement VITE
const API_URL = import.meta.env.VITE_API_URL;

/**
 * Créer une nouvelle oeuvre
 * @async
 * @function createMotions
 * @param {FormData} formData- les données du formulaire de création
 * @param {string} token - token de l'utilisateur connecté
 * @returns {Promise<Object>} - Un objet contenant les données de la nouvelle oeuvre créée.
 * @throws {Error} - Si une erreur se produit lors de la création de l'oeuvre.
 */

// fonction pour créer un film
export async function createMotions(formData) {
  // Envoi de la requête POST pour créer une nouvelle oeuvre
  // on précise la méthode et le contenu du header avec le token
  const response = await authFetch(`${API_URL}/motions`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });
  // on récupère la réponse de l'API (ici la création d'un film)
  const dataMotion = await response.json();
  // Vérification du succès de la réponse
  if (!response.ok) {
    const error = new Error(dataMotion?.details?.[0] || "Erreur lors de la création de l'œuvre");
    error.status = response.status; // 👈 on attache le status
    throw error;
  }
  // on renvoie les données
  return dataMotion;
}

/**
 * Récupère toutes les catégories de plat depuis l'API.
 * @async
 * @function getAllMotionsCategories
 * @returns {Promise<Array>} - Un tableau d'objets contenant les catégories de plat.
 * @throws {Error} - Si une erreur se produit lors de la récupération des données.
 */

//récupérer toutes les formats des oeuvres
export async function getAllMotionsFormats() {
  // on fait la demande API avec la route paramétrée du back
  const response = await fetch(`${API_URL}/motionsFormats`);
  // Vérification du succès de la réponse
  if (!response.ok) {
    // Gestion des erreurs HTTP
    throw new Error(`Erreur HTTP : ${response.status} ${response.statusText}`);
  }
  // on récupère la réponse de l'API (ici tous les formats des oeuvres)
  const dataMotionsFormats = await response.json();
  // on renvoie les données
  return dataMotionsFormats;
}

/**
 * Récupère tous les genres des oeuvres disponibles depuis l'API
 * @async
 * @function getAllMotionsGenres
 * @returns {Promise<Array>} - Un tableau d'objets contenant les genres des oeuvres
 * @throws {Error} - Si une erreur se produit lors de la récupération des données
 */
export async function getAllMotionsGenres() {
  // on met dans un try-catch pour récupérer les erreurs
  try {
    // on fait la demande API avec la route paramétrée du back
    const response = await fetch(`${API_URL}/motionsGenres`);
    // Vérification du succès de la réponse
    if (!response.ok) {
      // Gestion des erreurs HTTP
      throw new Error(`Erreur HTTP : ${response.status} ${response.statusText}`);
    }
    // on récupère la réponse de l'API (ici tous les genres des oeuvres)
    const dataMotionsGenres = await response.json();
    // on renvoie les données
    return dataMotionsGenres;
    // si une erreur survient on l'indique.
  } catch (error) {
    console.error("Erreur lors de la récupération du genre des oeuvres:", error);
    return;
  }
}

/**
 * Récupére toutes les oeuvres depuis l'API.
 * @async
 * @function getAllMotions
 * @returns {Promise<Array>} - Un tableau d'objets contenant les oeuvres.
 * @throws {Error} - Si une erreur se produit lors de la récupération des données.
 */
export async function getAllMotions() {
  // on fait la demande API avec la route paramétrée du back
  const response = await fetch(`${API_URL}/motions`);
  // Vérification du succès de la réponse
  if (!response.ok) {
    //  Gestion des erreurs HTTP
    throw new Error(`Erreur HTTP : ${response.status} ${response.statusText}`);
  }
  // on récupère la réponse de l'API (ici toutes les oeuvres)
  const dataMotions = await response.json();
  // on renvoie les données
  return dataMotions;
}

/**
 * Récupère tous les genres de film depuis l'API.
 * @async
 * @function getAllGenres
 * @returns {Promise<Array>} - Un tableau d'objets contenant les genres de film.
 * @throws {Error} - Si une erreur se produit lors de la récupération des données.
 */
export async function getAllGenres() {
  // on fait la demande API avec la route parrametré du back
  const response = await fetch(`${API_URL}/genres`);
  // Vérification du succès de la réponse
  if (!response.ok) {
    // Gestion des erreurs HTTP
    throw new Error(`Erreur HTTP : ${response.status} ${response.statusText}`);
  }
  // on récupere la réponse de l'API (ici toutes les oeuvres)
  const dataGenres = await response.json();
  // on renvois les données
  return dataGenres;
}

/**
 * Récupère une oeuvre par son ID.
 * @param  id - L'identifiant de l'oeuvre' à récupérer.
 * @async
 * @function getMotionById
 * * @returns {Promise<Object>} - Un objet contenant les données de l'oeuvre.
  * @throws {Error} - Si une erreur se produit lors de la récupération des données.
 
 */
export async function getMotionById(id) {
  // on fait la demande API avec la route parramétrée du back et l'id de la recette
  const response = await fetch(`${API_URL}/motions/${id}`);
  // on récupère la réponse de l'API (ici le film ciblé)
  const motion = await response.json();
  // on vérifie que l'on a une réponse
  if (!response.ok) {
    throw new Error("Erreur lors de la récupération de la recette");
  }
  // on renvoie les données
  return motion;
}
