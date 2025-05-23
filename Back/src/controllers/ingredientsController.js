import { Ingredient } from "../models/association.js";

const ingredientsController = {
  /**
   * Récupère tous les ingrédients.
   * @async
   * @function getAllIngredients
   * @param {import('express').Request} req - Requête Express
   * @param {import('express').Response} res - Réponse Express
   * @returns {Promise<void>}
   */
  async getAllIngredients(req, res) {
    const ingredients = await Ingredient.findAll({
      order: [["name", "ASC"]],
    });

    res.status(200).json(ingredients); // Si ingrédients trouvés, on les renvoie au format JSON avec un statut 200
  },

  /**
   * Crée un nouvel ingrédient après vérification de l'unicité du nom.
   * @async
   * @function createOneIngredient
   * @param {import('express').Request} req - Requête Express
   * @param {import('express').Response} res - Réponse Express
   * @param {Function} next - Fonction middleware suivante
   * @returns {Promise<void>}
   */
  async createOneIngredient(req, res, next) {
    let { name } = req.body;
    // Vérification de la présence du nom
    if (!name) {
      // Vérifie si le nom est présent
      const error = new Error("Le nom de l'ingrédient est requis"); // On crée l'instance d'erreur avec message personnalisé
      error.statusCode = 400; // On lui attribue un code HTTP qui fera appel à errorMessages
      error.details = ["Le nom de l'ingrédient est requis"]; // On lui attribue un tableau de détails
      return next(error); // On la passe au middleware d'erreur
    }
    // Vérification de l'unicité du nom
    // On vérifie si l'ingrédient existe déjà dans la base de données
    // Si l'ingrédient existe déjà, on renvoie une erreur

    name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(); // On met la première lettre en majuscule et le reste en minuscule

    const existingIngredient = await Ingredient.findOne({ where: { name } }); // On utilise findOne pour vérifier si l'ingrédient existe déjà
    if (existingIngredient) {
      // Si l'ingrédient existe déjà, on renvoie une erreur
      const error = new Error("Cet ingrédient existe déjà"); // On crée l'instance d'erreur avec message personnalisé
      error.statusCode = 400; // On lui attribue un code HTTP qui fera appel à errorMessages
      error.details = ["Cet ingrédient existe déjà"]; // On lui attribue un tableau de détails
      return next(error); // On la passe au middleware d'erreur
    }
    // Création de l'ingrédient
    const newIngredient = await Ingredient.create({ name });
    // Vérification de la création
    // Si la création échoue, on renvoie une erreur
    // Si la création réussit, on renvoie l'ingrédient créé
    if (!newIngredient) {
      const error = new Error("Erreur lors de la création de l'ingrédient"); // On crée l'instance d'erreur avec message personnalisé
      error.statusCode = 500; // On lui attribue un code HTTP qui fera appel à errorMessages
      error.details = ["Erreur lors de la création de l'ingrédient"]; // On lui attribue un tableau de détails
      return next(error); // On la passe au middleware d'erreur
    }
    console.log(newIngredient);
    res.status(201).json(newIngredient); // On renvoie l'ingrédient créé avec un statut 201
  },

  /**
   * Supprime un ingrédient par son ID.
   * @async
   * @function deleteOneIngredient
   * @param {import('express').Request} req - Requête Express
   * @param {import('express').Response} res - Réponse Express
   * @param {Function} next - Fonction middleware suivante
   * @returns {Promise<void>}
   */
  async deleteOneIngredient(req, res, next) {
    // Récupération de l'ID depuis les paramètres de la route
    const id = req.params.id;

    // Vérification de l'existence de l'ingrédient
    const ingredient = await Ingredient.findByPk(id);
    if (!ingredient) {
      // Si l'ingrédient n'existe pas, on renvoie une erreur
      const error = new Error("Ingrédient non trouvé"); // On crée l'instance d'erreur avec message personnalisé
      error.statusCode = 404; // On lui attribue un code HTTP qui fera appel à errorMessages
      error.details = ["Aucun ingrédient avec cet ID"]; // On lui attribue un tableau de détails
      return next(error);
    }

    // Vérifie s'il est utilisé dans une ou plusieurs recettes
    const associatedRecipes = await ingredient.getRecipes(); // Sequelize utilise l'association Ingredient.belongsToMany(Recipe, ...) pour créer cette fonction

    if (associatedRecipes.length > 0) {
      // Si l'ingrédient est utilisé dans une ou plusieurs recettes, on renvoie une erreur
      const error = new Error("Impossible de supprimer l'ingrédient"); // On crée l'instance d'erreur avec message personnalisé
      error.statusCode = 400; // On lui attribue un code HTTP qui fera appel à errorMessages
      error.details = [
        // On lui attribue un tableau de détails
        `L'ingrédient est utilisé dans ${associatedRecipes.length} recette(s) et ne peut pas être supprimé : ${associatedRecipes.map((recipe) => recipe.title).join(", ")}`,
      ];
      return next(error); // On la passe au middleware d'erreur
    }

    // Suppression de l'ingrédient
    await ingredient.destroy();
    res.status(200).json({ message: "Ingrédient supprimé avec succès" }); // On renvoie un message de succès
  },
};
export default ingredientsController;
