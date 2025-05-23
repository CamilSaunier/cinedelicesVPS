import { MotionGenre } from "../models/association.js";

const genreController = {
  /**
   * Récupère tous les genres de films/œuvres.
   * @async
   * @function getAllGenres
   * @param {import('express').Request} req - Requête Express
   * @param {import('express').Response} res - Réponse Express
   * @returns {Promise<void>}
   */
  async getAllGenres(req, res) {
    const genres = await MotionGenre.findAll({
      order: [["name", "ASC"]],
    });

    res.status(200).json(genres); // Si genres trouvés, on les renvoie au format JSON avec un statut 200
  },
};

export default genreController;
