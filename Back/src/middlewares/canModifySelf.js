/**
 * Vérifie que l'utilisateur peut modifier sa propre ressource (informations).
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {Function} next
 */
export function canModifySelf(req, res, next) {

  // Sécurité : on vérifie que req.user et userId existent bien
  if (!req.user?.userId) {
    const error = new Error("Unauthorized"); // on crée une nouvelle erreur
    error.statusCode = 401; // on lui attribut un code HTTP qui fera appel à errorMessages
    error.details = ["Token invalide ou manquant"]; // on lui attribut un tableau de détails
    return next(error); // on passe l'erreur au middleware d'erreur
  }
  // on récupère l'ID de l'utilisateur connecté depuis le token (que  l'on a déjà vérifié dans un middleware précédent)
  const userIdFromToken = req.user.userId;

  // on récupère l'ID présent dans l'URL, par exemple /users/42 → req.params.id vaut "42"
  const userIdFromParams = req.params.id;

  // on compare les deux identifiants pour vérifier que l'utilisateur essaie bien de modifier son propre compte
  if (userIdFromToken !== userIdFromParams) {
    // Si les ID sont différents, on bloque la requête avec une erreur 403 (interdit)
    const error = new Error("Forbidden");
    error.statusCode = 403; // on lui attribue un code HTTP qui fera appel à errorMessages
    error.details = ["Vous ne pouvez modifier que vos propres informations"];
    return next(error); //on passe l’erreur au gestionnaire d’erreurs d’Express
  }
  // Si les ID correspondent, on laisse la requête continuer normalement
  next();
}
