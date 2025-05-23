/**
 * Vérifie que l'utilisateur est administrateur.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {Function} next
 */
export function isAdmin(req, res, next) {
  // si l'utilisateur n'est pas authentifié ou n'est pas un administrateur
  // on bloque la requête avec une erreur 403 (interdit)
  // on passe l’erreur au gestionnaire d’erreurs d’Express
  if (!req.user || req.user.role !== "admin") {
    const error = new Error("Forbidden"); // on crée une nouvelle erreur avec un message "Forbidden"
    error.statusCode = 403; // n lui donne un code d'erreur 403
    error.details = ["Accès réservé aux administrateurs"]; // on lui attribue un tableau de détails
    return next(error); // on passe l'erreur au middleware d'erreur
  }

  next();
}
