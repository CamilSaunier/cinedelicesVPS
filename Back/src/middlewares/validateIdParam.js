// On importe une fonction utilitaire pour vérifier qu'un nombre est bien un entier positif
import { isPositiveInteger } from "../utils/validator.js";
console.log("je suis dans le middleware is positive integer");

// Ce middleware permet de valider que le paramètre "id" dans l'URL est un entier positif.
// Par exemple, il est utile pour des routes comme GET /users/:id ou DELETE /posts/:id
/**
 * Valide l'ID passé en paramètre de route.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {Function} next
 */
export function validateIdParam(req, res, next) {
  const { id } = req.params; // On récupère l'identifiant depuis les paramètres de route

  // Si l'identifiant n'est pas un entier positif, on déclenche une erreur 400 (mauvaise requête)
  if (!isPositiveInteger(id)) {
    const error = new Error("L'identifiant fourni n'est pas valide."); // On crée une nouvelle instance d'erreur avec un message personnalisé
    error.statusCode = 404; // On lui attribue un code HTTP qui fera appel à errorMessages
    error.details = ["L'identifiant doit être un entier positif, sans espaces ni caractères spéciaux."]; // On lui attribue un tableau de détails
    return next(error); // On passe l'erreur au middleware de gestion des erreurs
  }

  // Si tout est bon, on convertit l'identifiant (qui est une chaîne de caractères par défaut) en nombre
  req.params.id = Number(id);

  // Puis on continue vers le contrôleur ou middleware suivant
  next();
}

// On parse l'id pour en faire un entier en base 10 (système décimal classique)
// Le deuxième argument "10" garantit que l'interprétation se fait bien en base décimale
