// Fonction pour stocker un token JWT dans le localStorage
export function setAuthToken(token) {
  localStorage.setItem("x-auth-token", token); // On enregistre le token sous la clé "x-auth-token"
}

// Fonction pour récupérer le token JWT depuis le localStorage
export function getAuthToken() {
  return localStorage.getItem("x-auth-token"); // On lit et retourne le token s'il existe
}

// Fonction pour supprimer le token JWT du localStorage
export function removeAuthToken() {
  localStorage.removeItem("x-auth-token"); // On efface le token stocké
}
