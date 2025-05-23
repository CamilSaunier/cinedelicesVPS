/**
 * Middleware générique pour valider les schémas.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {Function} next
 */
export function validate(schema) {
  return (req, res, next) => {
    // Cas particulier : si "ingredients" est une chaîne de caractères (ex: envoyée par formulaire), on la parse en tableau
    // en référence à la structure de données attendue dans le schéma de validation
    // (ex: ["ingredient1", "ingredient2"])
    if (typeof req.body.ingredients === "string") {
      req.body.ingredients = JSON.parse(req.body.ingredients);
    }

    // Si un fichier image est uploadé, on ajoute son chemin d'accès au champ picture
    // (utile pour les envois de fichiers via multer)
    // obligé de le préciser en multipart/form-data
    if (req.file) {
      req.body.picture = `/uploads/recipes/${req.file.filename}`;
    }

    // Même chose que pour les ingrédients, on parse "motion_genres" s'il arrive sous forme de chaîne de caractères
    // (ex: envoyée par formulaire) pour le transformer en tableau
    // ex: ["genre1", "genre2"]
    if (typeof req.body.motion_genres === "string") {
      req.body.motion_genres = JSON.parse(req.body.motion_genres);
    }

    // On valide le corps de la requête avec les options suivantes :
    const validation = schema.validate(req.body, {
      abortEarly: false, // Continue même s’il y a plusieurs erreurs, pour toutes les remonter
      allowUnknown: false, // Refuse les champs non définis dans le schéma
      stripUnknown: true, // Supprime automatiquement les champs non prévus
    });

    // Si la validation échoue, on récupère tous les messages d’erreurs et on les renvoie dans une erreur 400
    if (validation.error) {
      const messages = validation.error.details.map((detail) => detail.message); // Extrait tous les messages d'erreurs
      const error = new Error(); // On crée une nouvelle instance d'erreur
      error.statusCode = 400; // On lui attribue un code HTTP qui fera appel à errorMessages
      error.details = messages; // On lui attribue un message d'erreur
      return next(error); // On envoie l'erreur au middleware d'erreur global
    }

    // Si la validation réussit, on remplace req.body par les données validées et nettoyées
    req.body = validation.value;

    console.log(req.body); // Debug : log les données validées

    // Passe au middleware ou contrôleur suivant
    next();
  };
}
