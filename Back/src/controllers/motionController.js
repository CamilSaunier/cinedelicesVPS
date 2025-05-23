import { Motion, MotionFormat, MotionGenre } from "../models/association.js";
import { sequelize } from "../models/association.js";
import sharp from "sharp";
import path from "path";
// Importation de fileURLToPath pour convertir l'URL du fichier en chemin local
import { fileURLToPath } from "url";
// Importation de dirname pour obtenir le répertoire d'un fichier donné
import { dirname } from "path";

const motionController = {
  /**
   * Récupère toutes les œuvres (films/séries) avec leurs recettes et genres associés.
   * @async
   * @function getAllMotions
   * @param {import('express').Request} req - Requête Express
   * @param {import('express').Response} res - Réponse Express
   * @returns {Promise<void>}
   */
  async getAllMotions(req, res) {
    const motions = await Motion.findAll({ include: ["recipes", "genres"] });
    res.status(200).json(motions); // Si films trouvés, on les renvoie au format JSON avec un statut 200
  },
  /**
   * Récupère tous les formats d'œuvres.
   * @async
   * @function getAllMotionsFormats
   * @param {import('express').Request} req - Requête Express
   * @param {import('express').Response} res - Réponse Express
   * @returns {Promise<void>}
   */
  async getAllMotionsFormats(req, res) {
    const motionsFormats = await MotionFormat.findAll();
    res.status(200).json(motionsFormats); // Si formats trouvés, on les renvoie au format JSON avec un statut 200
  },
  /**
   * Récupère tous les genres d'œuvres.
   * @async
   * @function getAllMotionsGenres
   * @param {import('express').Request} req - Requête Express
   * @param {import('express').Response} res - Réponse Express
   * @returns {Promise<void>}
   */
  async getAllMotionsGenres(req, res) {
    const motionsGenres = await MotionGenre.findAll();
    res.status(200).json(motionsGenres); // Si genres trouvés, on les renvoie au format JSON avec un statut 200
  },
  /**
   * Crée une nouvelle œuvre (film/série) avec gestion de l'image et des genres associés.
   * @async
   * @function createOneMotion
   * @param {import('express').Request} req - Requête Express
   * @param {import('express').Response} res - Réponse Express
   * @returns {Promise<void>}
   */
  async createOneMotion(req, res) {
    // on démarre une transaction avec Sequelize ( comme un script SQL avec BEGIN et COMMIT, pour s'assurer que toutes les opérations en BDD soient effectuées ou non)
    // ici on utilise une transaction pour être sûr que l'ont enregistre bien un film avec un Genre associée (la réalisation d'une transaction sequelize est rendu "obligatoire"/essentielle)
    // de par la définition de nos models de données et de leur relations. Les script SQL font mention de valeur NOTNULL dans certains champs de nos tables, ainsi un film ne peut pas etre crée sans genres. Néanmoins, dans cette requête, nous devons procéder a plusieurs
    // enregistrements dans différentes tables de données : "Motion et MotionGenre", cela permet donc que chaque enregistrements se fassent ou non, ce qui évite d'avoir des données compromises en BDD ou de lever une erreur si l'opération ne se passe pas bien dans un des enregistrements en BDD)
    const t = await sequelize.transaction();
    // Ces deux lignes permettent d'obtenir __dirname dans un module ES6
    // __filename permet d'obtenir l'URL du fichier actuel
    const __filename = fileURLToPath(import.meta.url);
    // __dirname permet d'obtenir le répertoire où se trouve le fichier actuel
    const __dirname = dirname(__filename);
    // on extrait les données que l'ont veut récupérer dans le req.body
    const { title, release_date, director, catchphrase, description, motion_format_id } = req.body;
    //on crée une variable pour l'image avec une valeur NULL
    let imagePath = null;
    //si il y a un fichier dans req alors :
    if (req.file) {
      // on génère un suffixe unique basé sur l'heure actuelle et un nombre aléatoire
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      // on crée un dossier où les fichiers seront enregistrés
      const outputDir = path.resolve(__dirname, "../../public/uploads/movies");
      // on génère le nom final du fichier en ajoutant le suffixe unique et l'extension
      const filename = `${uniqueSuffix}.webp`;
      // on crée un chemin absolu vers le dossier où les fichiers seront enregistrés composé du nom du répertoire et du nom du fichier
      const outputPath = path.join(outputDir, filename);
      //on compresse l'image en webp avec sharp
      await sharp(req.file.buffer).webp({ quality: 70 }).toFile(outputPath);
      //on change la valeur de la variable imagePath avec les nouvelle données
      imagePath = `uploads/movies/${filename}`;
    }
    //on crée une variable pour récupérer les Genres associés au film et on definit la valeur comme un tableau vide
    let parsedGenres = [];
    // on extrait les genres associé au film qui se trouve dans le req.body et qui ont eté parsés dans le middleware de validation
    parsedGenres = req.body.motion_genres;
    //on extrait l'ID de chaque Genre dans une variable
    const genreIDs = parsedGenres.map((genre) => genre.motion_genre_id);
    console.log(req.body);
    // on crée le film en BDD avec tous les champs voulus
    const motion = await Motion.create(
      {
        title,
        release_date,
        director,
        catchphrase,
        description,
        motion_format_id,
        picture: imagePath,
      },
      // on précise que la création du film en BDD se fait dans le cadre de la transaction
      { transaction: t }
    );
    //on rentre les informations d'association des Genres et films dans le cadre de la transaction
    await motion.setGenres(genreIDs, { transaction: t });
    // on valide la fin de la transaction
    await t.commit();
    // on envoie la réponse
    res.status(201).json({
      message: "film créé avec succès !",
      motionId: motion.id,
    });
  },
  /**
   * Supprime une œuvre par son ID, ainsi que ses recettes associées.
   * @async
   * @function deleteOneMotion
   * @param {import('express').Request} req - Requête Express
   * @param {import('express').Response} res - Réponse Express
   * @param {Function} next - Fonction middleware suivante
   * @returns {Promise<void>}
   */
  async deleteOneMotion(req, res, next) {
    // Récupération de l'ID depuis les paramètres de la route
    const id = req.params.id;
    // Vérification de l'existence de l'oeuvre
    const motion = await Motion.findByPk(id, {
      //on y inclut les recettes associées à la Motion
      include: ["recipes"],
    });
    // Si l'oeuvre n'existe pas, erreur et on passe au middlewares associé
    if (!motion) {
      const error = new Error("film non trouvé"); // On crée l'instance d'erreur avec message personnalisé
      error.statusCode = 404; // On lui attribue un code HTTP qui fera appel à errorMessages
      error.details = ["Il semble que l'oeuvre que vous cherchez n'existe pas"]; // On lui attribue un tableau de détails
      return next(error); // On la passe au middleware d'erreur
    }
    //si il y a une recette associée au film et que l'index de motion.recipes est plus grand que 0 (double verification) alors :
    if (motion.recipes && motion.recipes.length > 0) {
      // pour chaque recipe du tableau motion.recipes
      for (const recipe of motion.recipes) {
        // on suprimme la recette associée via séquelize (et déclenche donc le hook paramétré dans le model sequelize Recipe)
        await recipe.destroy(); // on supprime la recette associée
      }
    }
    // on detruit la motion dans la BDD
    await motion.destroy();
    res.status(200).json({ message: "oeuvre et recette associées supprimées avec succès" }); // On renvoie un message de succès
  },
  /**
   * Modify une œuvre (film/série) avec gestion de l'image et des genres associés.
   * @async
   * @function deleteOneMotion
   * @param {import('express').Request} req - Requête Express
   * @param {import('express').Response} res - Réponse Express
   * @param {Function} next - Fonction middleware suivante
   * @returns {Promise<void>}
   */
  async modifyOneMotion(req, res, next) {
    // on démarre une transaction avec Sequelize ( comme un script SQL avec BEGIN et COMMIT, pour s'assurer que toutes les opérations en BDD soient effectuées ou noê)
    // ici on utilise une transaction pour etre sûr que l'on modifie bien un film avec un Genre associé (la réalisation d'une transaction sequelize est rendue "obligatoire"/essentielle)
    // de par la définition de nos models de données et de leur relations. Les script SQL font mention de valeur NOTNULL dans certains champs de nos tables, ainsi un film ne peut pas être crée sans genres. Néanmoins, dans cette requête, nous devons procéder à plusieurs
    // enregistrements dans différentes tablesde données : "Motion et MotionGenre", cela permet donc que chaque enregistrement se fasse ou non, ce qui évite d'avoir des données compromises en BDD ou de lever une erreur si l'opération ne se passe pas bien dans un des enregistrement en BDD)
    const t = await sequelize.transaction();
    // Ces deux lignes permettent d'obtenir __dirname dans un module ES6
    // __filename permet d'obtenir l'URL du fichier actuel
    const __filename = fileURLToPath(import.meta.url);
    // __dirname permet d'obtenir le répertoire où se trouve le fichier actuel
    const __dirname = dirname(__filename);
    // Je récupère l'ID de la motion depuis l'URL (par exemple : /motion/5)
    const { id } = req.params;
    // on extrait les données que l'on veut récupérer dans le req.body
    const { title, release_date, director, catchphrase, description, motion_format_id } = req.body;
    //on récupere le film en BDD
    const motion = await Motion.findByPk(id);
    // Si la recette n'existe pas, j'envoie une réponse d'erreur 404
    if (!motion) {
      const error = new Error("Film non trouvés"); // On crée l'instance d'erreur avec message personnalisé
      error.statusCode = 404; // On lui attribue un code HTTP qui fera appel à errorMessages
      error.details = ["Il semble que le film que vous cherchez n'existe pas"]; // On lui attribue un tableau de détails
      return next(error); // On la passe au middleware d'erreur
    }
    //on va chercher le fichier que multer a récupéré et renommé
    let imagePath = motion.picture;
    //si il y a un fichier dans req alors :
    if (req.file) {
      // on génère un suffixe unique basé sur l'heure actuelle et un nombre aléatoire
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      // on crée un dossier où les fichiers seront enregistrés
      const outputDir = path.resolve(__dirname, "../../public/uploads/movies");
      // on génère le nom final du fichier en ajoutant le suffixe unique et l'extension
      const filename = `${uniqueSuffix}.webp`;
      // on crée un chemin absolu vers le dossier où les fichiers seront enregistrés composé du nom du répertoire et du nom du fichier
      const outputPath = path.join(outputDir, filename);
      //on compress l'image en webp avec sharp
      await sharp(req.file.buffer).webp({ quality: 70 }).toFile(outputPath);
      //on change la valeur de la variable imagePath avec les nouvelle données
      imagePath = `uploads/movies/${filename}`;
    }
    // on extrait les genres associés au film qui se trouve dans le req.body et qui ont eté parsés dans le middleware de validation ou un tableau vide
    let parsedGenres = req.body.motion_genres || [];
    //on extrait l'ID de chaque Genre dans une variable
    const genreIDs = parsedGenres.map((genre) => genre.motion_genre_id);
    // console.log(req.body);

    try {
      // on met a jour les propriétés de l'instance
      motion.title = title;
      motion.release_date = release_date;
      motion.director = director;
      motion.catchphrase = catchphrase;
      motion.description = description;
      motion.motion_format_id = motion_format_id;
      motion.picture = imagePath;

      // on modifie le film en BDD avec tous les champs voulus
      await motion.save({ transaction: t });

      // on met a jour les genres associés au film en BDD avec tous les champs vouls
      await motion.setGenres(genreIDs, { transaction: t });
      // on valide la fin de la transaction
      await t.commit();
      // on renvoie la réponse
      res.status(200).json({
        message: "film modifié avec succès !",
        motionId: motion.id,
      });
      // si une erreur se produit on le précise
    } catch (error) {
      // on annule la transaction sequelize
      await t.rollback();
      console.error("Erreur lors de la modification :", error);
      res.status(500).json({ message: "Erreur serveur lors de la modification." }); // On renvoie une erreur 500
    }
  },

  /**
   * Récupère une œuvre (film ou série) spécifique à partir de son ID,
   * incluant les genres associés.
   * @async
   * @function deleteOneMotion
   * @param {import('express').Request} req - Requête Express
   * @param {import('express').Response} res - Réponse Express
   * @param {Function} next - Fonction middleware suivante
   * @returns {Promise<void>}
   */
  async getOneMotion(req, res, next) {
    // Récupération de l'ID depuis les paramètres de la route
    const id = req.params.id;
    // Recherche du film dans la base de données
    const motion = await Motion.findByPk(id, {
      include: [
        // on inclut les genres associés au film
        { association: "genres" },
      ],
    });
    // Si la recette n'existe pas, erreur et on passe au middleware associé
    if (!motion) {
      const error = new Error("film non trouvé"); // On crée l'instance d'erreur avec message personnalisé
      error.statusCode = 404; // On lui attribue un code HTTP qui fera appel à errorMessages
      error.details = ["Il semble que le film que vous cherchez n'existe pas"]; // On lui attribue un tableau de détails
      return next(error); // On la passe au middleware d'erreur
    }
    // Si le film est trouvé, on la renvoie avec un code 200
    res.status(200).json(motion);
  },
};

export default motionController;
