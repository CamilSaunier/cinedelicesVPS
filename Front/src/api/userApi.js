// importation de la function pour récupéré le Token
import { setAuthToken } from "../store/authToken.js";
import { useUserStore } from "../store/store.js";
import { authFetch } from "./urlWrapperApiToken.js";
// import de la variable d'environnement VITE
const API_URL = import.meta.env.VITE_API_URL;

/**
 * Crée un nouvel utilisateur.
 * @async
 * @function createUser
 * @param {string} pseudo - Le pseudo de l'utilisateur
 * @param {string} email - L'email
 * @param {string} password - Le mot de passe
 * @returns {Promise<Object>} - Un objet contenant les données de l'utilisateur créé.
 * @throws {Error} - Si une erreur se produit lors de la création de l'utilisateur.
 */
export async function createUser(pseudo, email, password) {
  // on fait la demande API avec la route paramétrée du back
  // on précise la methode et le contenu du header
  const response = await fetch(`${API_URL}/user/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    // on transforme le body en string
    body: JSON.stringify({ pseudo, email, password }),
  });
  // on récupère la réponse de l'API (ici la création d'un user)
  const user = await response.json();
  // on vérifie que l'on a une réponse positive
  if (!response.ok) {
    const error = new Error(user?.details?.[0] || "Erreur lors de la connexion");
    error.response = response;
    error.status = response.status; //  on attache le status
    throw error;
  }
  // Renvoie le user créé si tout va bien
  return user;
}

/**
 *
 * @returns {string} - Le token d'accès
 * @throws {Error} - Si une erreur se produit lors de la récupération du token
 */

export async function refreshAccessToken() {
  try {
    const response = await fetch(`${API_URL}/refresh-token`, {
      method: "POST",
      credentials: "include", //Envoie les cookies
    });

    if (!response.ok) throw new Error("Echec du rafraichissement du token");
    const data = await response.json();
    // Dans la data renvoyée on prend le token et on le stocke dans le local storage
    setAuthToken(data.token);

    //On set le nouveau token dans le store mais étant donné que on l'est pas dans un état react on ne peux pas destructurer
    useUserStore.getState().refreshToken(data.token);
    //Renvoie le nouveau token pour valider l'appel à l'API
    return data.token;
  } catch (error) {
    console.error("Erreur lors du refresh token :", error);
    //Si le refresh token ne s'est pas bien passé, on logout l'utilisateur qui doit se reconecter
    useUserStore.getState().logout();
    throw error;
  }
}

/**
 * Fonction de connexion de l'utilisateur.
 * @async
 * @function loginUser
 * @param {string} email - L'email de l'utilisateur
 * @param {string} password - Le mot de passe de l'utilisateur
 * @returns {Promise<Object>} - Un objet contenant les données de l'utilisateur connecté.
 * @throws {Error} - Si une erreur se produit lors de la connexion de l'utilisateur.
 */
export async function loginUser(email, password) {
  // on effectue la requête POST vers la route de login
  // on précise la methode et le contenu du header
  const response = await fetch(`${API_URL}/user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    // conversion des données en JSON (string)
    body: JSON.stringify({ email, password }),
  });
  // Si la réponse est un code de status 429 (rate limit), on la gère spécifiquement
  if (response.status === 429) {
    const error = new Error("Trop de tentatives, veuillez réessayer dans 15 minutes.");
    error.status = 429; // <== Ajout important
    throw error;
  }
  // Si la réponse est OK, on essaye de la parser en JSON
  const user = await response.json();
  // on vérifie que l'on a une réponse positive
  if (!response.ok) {
    const error = new Error(user?.details?.[0] || "Erreur lors de la connexion");
    error.response = response;
    error.status = response.status; //  on attache le status
    throw error;
  }
  // Renvoie le user loggé si tout va bien
  return user;
}

/**
 *
 * @returns {Promise<Response>} - La réponse de la requête de déconnexion
 * @throws {Error} - Si une erreur se produit lors de la déconnexion
 */

export async function logoutUser() {
  // on effectue la requête POST vers la route de logout
  const loggedOut = await fetch(`${API_URL}/user/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  // on vérifie que l'on a une réponse positives
  return loggedOut;
}

/**
 * Verification des informations utilisateur via email et mot de passe.
 * @async
 * @function verifyUser
 * @param {string} email - L'email
 * @param {string} password - Le mot de passe
 * @param {string} token - token de l'utilisateur connecté
 * @returns {Promise<Object>} - Un objet contenant les données de l'utilisateur vérifié.
 * @throws {Error} - Si une erreur se produit lors de la vérification de l'utilisateur.
 */
export async function verifyUser(password) {
  // on effectue la requête POST vers la route paramétrée en back
  // on précise la méthode et le contenu du header avec le token
  const response = await authFetch(`${API_URL}/user/verify`, {
    method: "POST",
    credentials: "include",
    // on transforme le body en string JSON
    body: JSON.stringify({ password }),
  });
  // Si la réponse est OK, on essaye de la parser en JSON
  const result = await response.json();

  // on véifie que l'on ai une réponse positive
  if (!response.ok) {
    const error = new Error(result?.details?.[0] || "Erreur lors de la connexion");
    error.response = response; //  on attache le status
    throw error;
  }
  // Renvoie le resultat
  return result;
  // si une erreur survient on l'indique
}

/**
 * Modifier ses informations user
 * @async
 * @function modifyUser
 * @param {number} id - L'id de  l'user a modifier
 * @param {string} currentPassword- L'ancien password de l'utilisateur pour vérifier'
 * @param {string} pseudo - Le pseudo de  l'user a modifier
 * @param {string} email - L'email
 * @param {string} password - Le mot de passe
 * @returns {Promise<Object>} - Un objet contenant les données de l'utilisateur modifié.
 * @throws {Error} - Si une erreur se produit lors de la modification de l'utilisateur.
 */
export async function modifyUser(id, pseudo, email, password) {
  // On crée la variable body qui contient pseudo et email obligatoirement
  // Mais contient password seulement si celui-ci est rempli, sinon il est évincé
  // Création de l'objet body, en excluant les champs vides
  const body = {};
  // Ajoute le pseudo seulement s'il est présent et non vide
  if (pseudo && pseudo.trim() !== "") {
    body.pseudo = pseudo;
  }
  // Ajoute l'email seulement s'il est présent et non vide
  if (email && email.trim() !== "") {
    body.email = email;
  }
  // Ajoute le mot de passe seulement s'il est présent et non vide
  if (password && password.trim() !== "") {
    body.password = password;
  }
  // on effectue la requête PATCH vers la route paramétrée en back et l'id
  // on précise la méthode et le contenu du header avec le token
  const response = await authFetch(`${API_URL}/user/${id}`, {
    method: "PATCH",
    credentials: "include",

    // on transforme le body en string JSON
    body: JSON.stringify(body),
  });
  // Si la réponse est OK, on essaye de la parser en JSON
  const user = await response.json();
  // on vrifie que l'on ai une réponse positive
  if (!response.ok) {
    const error = new Error(user?.details?.[0] || "Erreur lors de la connexion");
    error.response = response; //  on attache le status
    throw error;
  }
  // Renvoie le resultat
  return user;
}

/**
 * Envoyer un e-mail de réinitialisation de mot de passe
 * @async
 * @function forgotPassword
 * @param {string} email - L'email de l'utilisateur
 * @returns {Promise<Object>} - Un objet contenant les données de la réponse de l'API.
 * @throws {Error} - Si une erreur se produit lors de l'envoi de l'e-mail
 */
export async function forgotPassword(email) {
  // on effectue la requête POST vers la route de l'email de réinitialisation
  const response = await fetch(`${API_URL}/user/forgotPassword`, {
    // on précise la méthode et le contenu du header
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });
  // Si la réponse est OK, on essaye de la parser en JSON
  const data = await response.json();
  if (!response.ok) {
    const error = new Error(data?.details?.[0] || "Erreur lors de la connexion");
    error.response = response; //  on attache le status
    throw error;
  }
  return data;
}

/**
 * Réinitialise le mot de passe de l'utilisateur.
 * @async
 * @function resetPassword
 * @param {string} newPassword - Nouveau mot de passe de l'utilisateur
 * @param {string} confirm - Confirmation du nouveau mot de passe
 * @param {string} token - Token de réinitialisation envoyé dans l'URL
 * @returns {Promise<Object>} - Un objet contenant les données de la réponse de l'API.
 * @throws {Error} - Si une erreur se produit lors de la réinitialisation du mot de passe
 */
export async function resetPassword(newPassword, confirm, token) {
  // on effectue la requête POST vers la route de réinitialisation du mot de passe
  // on précise la méthode et le contenu du header
  const response = await fetch(`${API_URL}/user/resetPassword/${token}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ newPassword, confirm }),
  });
  // Si la réponse est OK, on essaye de la parser en JSON
  const data = await response.json();
  if (!response.ok) {
    const error = new Error(data?.details?.[0] || "Erreur lors de la connexion");
    error.response = response;
    error.status = response.status; //  on attache le status
    throw error;
  }
  return data;
}

/**
 * Verification des informations utilisateur via email et mot de passe.
 * @async
 * @function deleteMe
 * @param {string} id- Id de l'user à supprimer
 * @returns {Promise<Object>} - Un objet contenant les données de l'utilisateur supprimé.
 * @throws {Error} - Si une erreur se produit lors de la suppression de l'utilisateur.
 */
export async function deleteMe(id) {
  // on effectue la requête DELETE vers la route parrametrer en back et l'id
  // on précise la methode et le contenue du hearder avec le token
  const response = await authFetch(`${API_URL}/user/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  // on récupere la réponse de l'API (ici la confirmation de la supression du user)
  const deletedUser = await response.json();
  // Renvoie le resultat
  return deletedUser;
}
