import jwtDecode from "jwt-decode";

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

export function isTokenExpired(token) {
  try {
    const payload = jwtDecode(token); // décode le token
    //Un JWT contient 3 parties : header.payload.signature. Ce qu'on veut ici, c'est le payload, qui contient les données utiles
    //payload.exp représente la date d’expiration du token
    //Date.now() renvoie un timestamp en millisecondes.  Donc pour comparer proprement, on multiplie par 1000 pour convertir exp en millisecondes.
    const expiry = payload.exp * 1000; // exp est en secondes
    //Date.now() donne l’heure actuelle en millisecondes.
    //On compare :

    //Si Date.now() est plus grand que la date d’expiration, ça veut dire que le token est expiré.

    //La fonction renvoie donc :

    //true si le token est expiré

    //false s’il est encore valide
    return Date.now() > expiry;
  } catch {
    return true; // si erreur de décodage, on considère le token comme invalide
  }
}
