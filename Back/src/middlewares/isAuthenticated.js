import { verifyJwtToken } from "../utils/crypto.js";
console.log("je suis dans le middleware is authenticated");
/**
 * Vérifie que l'utilisateur est authentifié via JWT.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {Function} next
 */
export function isAuthenticated(req, res, next) {
  // on récupère le token dans l’en-tête "Authorization" de la requête.
  // Normalement, il est envoyé au format : "Bearer <token>", donc on découpe la chaîne et on prend seulement le token.
  const token = req.headers.authorization?.split(" ")[1];

  // Si le token n’est pas présent, on renvoie une erreur 401 (non autorisé).
  if (!token) {
    const error = new Error("Unauthorized"); // on crée une nouvelle erreur
    error.statusCode = 401; // on lui attribue un code HTTP qui fera appel à errorMessages
    error.details = ["Vous n'avez pas accès"]; // on lui attribue un tableau de détails
    return next(error); // on passe l’erreur au middleware d’erreurs d’Express
  }

  // Ensuite, on essaie de décoder le token avec la fonction utilitaire verifyJwtToken.
  const decoded = verifyJwtToken(token);

  // Si le token est invalide ou qu’il n’a pas pu être décodé, on refuse aussi l’accès avec une erreur 401.
  if (!decoded) {
    const error = new Error("Unauthorized"); // on crée une nouvelle erreur
    error.statusCode = 401; // on lui attribue un code HTTP qui fera appel à errorMessages
    error.details = ["Vous n'avez pas accès"]; // on lui attribue un tableau de détails
    return next(error); // on passe l’erreur au middleware d’erreurs d’Express
  }

  // Si le token est valide, on le stocke dans req.user.
  // Comme ça, on peut y accéder dans d’autres middlewares ou dans le contrôleur (par exemple pour connaître l’id de l’utilisateur connecté).
  req.user = decoded;

  // on continue vers le prochain middleware ou contrôleur.
  next();
}
