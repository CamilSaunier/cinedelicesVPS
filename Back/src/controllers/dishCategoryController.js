import { DishCategory } from "../models/association.js";

const dishCategoryController = {
  /**
   * Récupère toutes les catégories de plats.
   * @async
   * @function getAllDishesCategories
   * @param {import('express').Request} req - Requête Express
   * @param {import('express').Response} res - Réponse Express
   * @returns {Promise<void>}
   */
  async getAllDishesCategories(req, res) {
    const categories = await DishCategory.findAll();
    // Si catégories trouvées, on les renvoie au format JSON avec un statut 200
    res.status(200).json(categories);
  },
};

export default dishCategoryController;
