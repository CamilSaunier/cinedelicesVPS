import { Op } from "sequelize";
import { Motion, Recipe } from "../models/association.js";
import { RecipeHasIngredient } from "../models/association.js";
import path from "path";
import sharp from "sharp";
// Importation de fileURLToPath pour convertir l'URL du fichier en chemin local
import { fileURLToPath } from "url";
// Importation de dirname pour obtenir le répertoire d'un fichier donné
import { dirname } from "path";

const recipeController = {
  /**
   * Récupère toutes les recettes avec leurs associations (motion, auteur, catégorie, difficulté).
   * @async
   * @param {import('express').Request} req - Requête Express
   * @param {import('express').Response} res - Réponse Express
   * @returns {void}
   */
  async getAllRecipes(req, res) {
    // Récupération de toutes les recettes
    const recipes = await Recipe.findAll({
      // On utilise findAll pour récupérer toutes les recettes
      include: [
        { association: "motion", include: ["genres", "format"] },
        { association: "author", attributes: ["pseudo"] },
        { association: "category" },
        { association: "difficulty" },
      ],
      order: [["created_at", "ASC"]],
    });

    res.status(200).json(recipes); // Si recettes trouvées, on les renvoie au format JSON avec un statut 200
  },

  /**
   * Récupère une recette par son ID avec toutes ses associations.
   * @async
   * @param {import('express').Request} req - Requête Express
   * @param {import('express').Response} res - Réponse Express
   * @param {Function} next - Fonction middleware suivante
   * @returns {Promise<void>}
   */
  async getOneRecipe(req, res, next) {
    // Récupération de l'ID depuis les paramètres de la route
    const id = req.params.id;

    // Recherche de la recette dans la base de donnée avec toutes ses associations
    const recipe = await Recipe.findByPk(id, {
      include: [
        {
          association: "motion", // L’œuvre liée à la recette
          include: ["genres", "format"], // Sous-inclusions : genres et format de l’œuvre
        },
        {
          association: "author", // L’auteur de la recette
          attributes: ["pseudo"], // On ne récupère que le pseudo de l’auteur
        },
        {
          association: "category", // Catégorie du plat
        },
        {
          association: "difficulty", // Niveau de difficulté
        },
        {
          association: "ingredients", // Ingrédients associés à la recette (many-to-many)
          through: {
            attributes: ["quantity", "unit"], // Champs issus de la table de liaison RecipeHasIngredient
          },
        },
      ],
    });

    // Si la recette n'existe pas, erreur et on passe au middleware associé
    if (!recipe) {
      const error = new Error("recette non trouvée"); // On crée l'instance d'erreur avec message personnalisé
      error.statusCode = 404; // On lui attribue un code HTTP qui fera appel à errorMessages
      error.details = ["Il semble que la recette que vous cherchez n'existe pas"];
      return next(error); // On la passe au middleware d'erreur
    }

    // Si la recette est trouvée, on la renvoie avec un code 200
    res.status(200).json(recipe);
  },

  /**
   * Crée une nouvelle recette, gère l’upload de l’image et l’ajout des ingrédients.
   * @async
   * @param {import('express').Request} req - Requête Express
   * @param {import('express').Response} res - Réponse Express
   * @returns {Promise<void>}
   */
  async createOneRecipe(req, res) {
    // Ces deux lignes permettent d'obtenir __dirname dans un module ES6
    // __filename permet d'obtenir le chemin absolu du fichier actuel
    const __filename = fileURLToPath(import.meta.url);
    // __dirname permet d'obtenir le répertoire où se trouve le fichier actuel
    const __dirname = dirname(__filename);

    const { title, description, instruction, anecdote, completion_time, user_id, dish_category_id, difficulty_id, motion_id } = req.body; // Récupération des données envoyées dans le corps de la requête
    // console.log(req.body);

    //on va chercher le fichier que multer a récupéré et renommé
    let imagePath = null;

    //si il y a un fichier dans req alors :
    if (req.file) {
      // on génère un suffixe unique basé sur l'heure actuelle et un nombre aléatoire
      // ainsi on évite les conflits de noms de fichiers
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      // on définit le répertoire de destination pour les images
      // on utilise path.resolve pour obtenir le chemin absolu du répertoire
      const outputDir = path.resolve(__dirname, "../../public/uploads/recipes");
      // on génère le nom final du fichier en ajoutant le suffixe unique et l'extension
      const filename = `${uniqueSuffix}.webp`;
      // on crée un chemin absolu vers le dossier où les fichiers seront enregistrés composé du nom du répertoire et du nom du fichier
      const outputPath = path.join(outputDir, filename);

      //on compresse l'image avec sharp
      await sharp(req.file.buffer).webp({ quality: 70 }).toFile(outputPath);

      //on change la valeur de la variable imagePath avec les nouvelles données
      imagePath = `uploads/recipes/${filename}`;
    }

    // Créer la recette
    // On crée une nouvelle recette avec les données fournies dans le corps de la requête
    const recipe = await Recipe.create({
      title,
      description,
      instruction,
      anecdote,
      completion_time,
      user_id,
      dish_category_id,
      difficulty_id,
      motion_id,
      picture: imagePath,
    });
    // Ajouter les ingrédients
    // On vérifie si des ingrédients ont été fournis dans le corps de la requête
    // Si oui, on les traite
    // On construit un tableau d'objets pour chaque ingrédient à insérer dans la table de liaison
    // On utilise la méthode map pour transformer chaque ingrédient en un objet avec les propriétés nécessaires
    const ingredientsData = req.body.ingredients.map((ingredient) => ({
      recipe_id: recipe.id,
      ingredient_id: ingredient.ingredient_id,
      quantity: ingredient.quantity,
      unit: ingredient.unit,
    }));
    // On insère tous les ingrédients en une seule fois dans la table de liaison RecipeHasIngredient
    await RecipeHasIngredient.bulkCreate(ingredientsData);

    res.status(201).json(recipe); // On renvoie la recette créée avec un code 201
  },

  /**
   * Modifie une recette existante et met à jour ses ingrédients associés.
   * @async
   * @param {import('express').Request} req - Requête Express
   * @param {import('express').Response} res - Réponse Express
   * @param {Function} next - Fonction middleware suivante
   * @returns {Promise<void>}
   */
  async modifyOneRecipe(req, res, next) {
    // Ces deux lignes permettent d'obtenir __dirname dans un module ES6
    // __filename permet d'obtenir le chemin absolu du fichier actuel
    const __filename = fileURLToPath(import.meta.url);
    // __dirname permet d'obtenir le répertoire où se trouve le fichier actuel
    const __dirname = dirname(__filename);

    // on récupère l'ID de la recette depuis l'URL (par exemple : /recipes/5)
    const { id } = req.params;

    // on récupère toutes les données envoyées dans le corps de la requête
    const { title, description, instruction, anecdote, completion_time, ingredients, user_id, dish_category_id, difficulty_id, motion_id } = req.body;

    // Étape 1 : On cherche la recette dans la base de données avec l'ID fourni
    const recipe = await Recipe.findByPk(id);

    // Si la recette n'existe pas, on envoie une réponse d'erreur 404
    if (!recipe) {
      const error = new Error("recette non trouvée"); // On crée l'instance d'erreur avec message personnalisé
      error.statusCode = 404; // On lui attribue un code HTTP qui fera appel à errorMessages
      error.details = ["Il semble que la recette que vous cherchez n'existe pas"];
      return next(error); // On la passe au middleware d'erreur
    }

    //on va chercher le fichier que multer a récupéré et renommé
    let imagePath = recipe.picture;

    //si il y a un fichier dans req alors :
    if (req.file) {
      // on génère un suffixe unique basé sur l'heure actuelle et un nombre aléatoire
      // ainsi on évite les conflits de noms de fichiers
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      // on définit le répertoire de destination pour les images
      // on utilise path.resolve pour obtenir le chemin absolu du répertoire
      const outputDir = path.resolve(__dirname, "../../public/uploads/recipes");
      // on génère le nom final du fichier en ajoutant le suffixe unique et l'extension
      const filename = `${uniqueSuffix}.webp`;
      // on crée un chemin absolu vers le dossier où les fichiers seront enregistrés composé du nom du répertoire et du nom du fichier
      const outputPath = path.join(outputDir, filename);

      //on compresse l'image avec sharp
      await sharp(req.file.buffer).webp({ quality: 70 }).toFile(outputPath);

      //on change la valeur de la variable imagePath avec les nouvelles données
      imagePath = `uploads/recipes/${filename}`;
    }

    // Étape 2 : on met à jour les infos principales de la recette
    await recipe.update({
      title,
      description,
      instruction,
      anecdote,
      completion_time,
      user_id,
      dish_category_id,
      difficulty_id,
      motion_id,
      picture: imagePath,
    });

    // Étape 3 : on met à jour les ingrédients associés à cette recette

    // D'abord, on supprime tous les anciens ingrédients liés à cette recette
    await RecipeHasIngredient.destroy({ where: { recipe_id: id } });

    // Ensuite, si un tableau d'ingrédients a bien été fourni
    if (Array.isArray(ingredients)) {
      // on construit les nouvelles lignes à insérer dans la table de liaison
      const ingredientsData = ingredients.map((ingredient) => ({
        recipe_id: recipe.id,
        ingredient_id: ingredient.ingredient_id,
        quantity: ingredient.quantity,
        unit: ingredient.unit,
      }));

      // on insère tous les nouveaux ingrédients en une seule fois
      await RecipeHasIngredient.bulkCreate(ingredientsData);
    }

    // Étape 4 : on renvoie une réponse avec un message de succès
    res.status(201).json(recipe);
  },

  /**
   * Recherche des recettes par mot-clé dans le titre ou le titre de l’œuvre associée.
   * @async
   * @param {import('express').Request} req - Requête Express
   * @param {import('express').Response} res - Réponse Express
   * @param {Function} next - Fonction middleware suivante
   * @returns {Promise<void>}
   */
  async getRecipesBySearch(req, res, next) {
    // Récupère le terme de recherche depuis les paramètres de l'URL
    const search = req.params.search;

    // Vérifie que le paramètre search est bien présent et non vide
    if (!search || search.trim() === "") {
      const error = new Error("Aucun terme de recherche fourni");
      error.statusCode = 404;
      error.details = ["Veuillez saisir un mot-clé pour la recherche"];
      return next(error);
    }
    // Recherche dans les titres de recettes OU les titres de films associés avec une requête Sequelize
    const recipe = await Recipe.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.iLike]: `%${search}%` } }, // Cherche dans les titres de recherche si elle contient une partie de la recherche
          { "$motion.title$": { [Op.iLike]: `%${search}%` } }, // Cherche dans les titre des films associés si elle contient une partie de la recherche
        ],
      },
      include: [
        {
          model: Motion,
          as: "motion",
          attributes: ["title"], // On limite les données récupérées du modèle Motion au champ "title"
        },
      ],
    });

    if (!recipe || recipe.length === 0) {
      // Si aucune recette n'est trouvée, on envoie une erreur 404
      const error = new Error("recette non trouvée"); // On crée l'instance d'erreur avec message personnalisé
      error.statusCode = 404; // On lui attribue un code HTTP qui fera appel à errorMessages
      error.details = ["Il semble que la recette que vous cherchez n'existe pas"]; // Détail de l’erreur à destination du client
      return next(error); // Passage de l'erreur au middleware d'erreur d'Express
    }

    res.status(200).json(recipe); // Si recettes trouvées, on les renvoie au format JSON avec un statut 200
  },

  /**
   * Supprime une recette par son ID.
   * @async
   * @param {import('express').Request} req - Requête Express
   * @param {import('express').Response} res - Réponse Express
   * @param {Function} next - Fonction middleware suivante
   * @returns {Promise<void>}
   */
  async deleteOneRecipe(req, res, next) {
    // Récupération de l'ID depuis les paramètres de la route
    const recipeId = req.params.id;
    // Vérification de l'existence de la recipe
    const recipe = await Recipe.findByPk(recipeId);
    // si on ne trouve pas la recipe on renvoie l'erreur
    if (!recipe) {
      const error = new Error("recette non trouvée"); // On crée l'instance d'erreur avec message personnalisé
      error.statusCode = 404; // On lui attribue un code HTTP qui fera appel à errorMessages
      error.details = ["Il semble que la recette que vous cherchez n'existe pas"]; // Détail de l’erreur à destination du client
      return next(error); // Passage de l'erreur au middleware d'erreur d'Express
    }
    // on detruis la recipe dans la BDD
    await recipe.destroy();
    res.status(200).json({ message: "Recette et image supprimées avec succès" }); // On renvoie un message de succès
  },
};

export default recipeController;
