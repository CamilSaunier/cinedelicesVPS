import { getAuthToken } from "../store/authToken.js";
import { refreshAccessToken } from "./userApi.js";

//Fonction qui entoure un appel Api qui nécessite le token
//Évite de tapper plusieurs fois le même code
//Elle met en place un système de gestion de l'erreur 401 qui envoie automatiquement l'appel vers l'api de refresh token et rejoue l'appel initial une fois le nouveau token récupéré

//Elle prend 3 paramétres :
// url qui est l'url de l'api appelée
// options : les options envoyés à l'API (method, headers)
// le retry : true. Indique si la demande API doit être rejouée une fois le token rafraichi
export async function authFetch(url, options = {}, retry = true) {
  //Récupère le token du local storage
  const token = getAuthToken();
  if (!token) {
    throw new Error("Token d'authentification manquant.");
  }

  // Ne pas forcer Content-Type si le body est un FormData
  //Pour rappel formData c'est inhérent à JS qui transforme les données du formulaire en paire clé valeur
  const isFormData = options.body instanceof FormData;
  //Met en place les headers pour qu'on n'ai pas à le réécrire à chaque fois
  const headers = {
    // on parcourt les options, on s'arrête au headers et on les remplit avec les données Authorization et Content-Type
    ...options.headers,
    Authorization: `Bearer ${token}`,
    //Si le body est un formData, tu ne forces pas le headers, sinon tu mets content-type : application/json
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
  };
  // on les rajoute dans l'appel Api
  const response = await fetch(url, {
    ...options,
    // headers fait référence à la const headers citée plus haut
    headers,
  });
  //Gestion de l'erreur 401
  //Si la requête Api renvoie une erreur 401 (= le token a expiré), alors
  if (response.status === 401 && retry) {
    //Fait appel à l'Api de génération d'un nouvel accessToken
    await refreshAccessToken();
    //Renvoie la requête initiale pour qu'elle se rejoue avec le nouveau accessToken
    //Met le retry en false pour éviter que la requête se rejoue à l'infini
    return authFetch(url, { ...options }, false);
  }

  return response;
}
