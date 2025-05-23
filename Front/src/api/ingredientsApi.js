// import de la variable d'environnement VITE
const API_URL = import.meta.env.VITE_API_URL;

/**
 * Récupère tous les ingrédients depuis l'API.
 * @async
 * @function getAllIngredients
 * @returns {Promise<Array>} - Un tableau d'objets contenant les ingrédients.
 * @throws {Error} - Si une erreur se produit lors de la récupération des données.
 */
export async function getAllIngredients() {
  // on fait la demande API avec la route parrametré du back
  const response = await fetch(`${API_URL}/ingredients`);
  // on verrifie que l'on ai une réponse
  if (!response.ok) {
    // Gestion des erreurs HTTP
    throw new Error(`Erreur HTTP : ${response.status} ${response.statusText}`);
  }
  // on récupere la réponse de l'API avec les données demandé (ici touts les aliments)
  const dataIngredients = await response.json();
  // on renvois les données
  return dataIngredients;
}
