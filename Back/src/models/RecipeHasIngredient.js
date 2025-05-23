import { DataTypes, Model } from "sequelize";
import { sequelize } from "./sequelize-client.js";

export class RecipeHasIngredient extends Model {}

/**
 * On initialise le modèle RecipeHasIngredient avec les attributs et les options
 * @param {Object} sequelize - Instance de Sequelize
 * @param {Object} DataTypes - Types de données de Sequelize
 * @param {Object} Model - Classe de base pour les modèles sequelize
 * @returns {void}
 */
RecipeHasIngredient.init(
  {
    ingredient_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "ingredient",
        key: "id",
      },
    },
    recipe_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "recipe",
        key: "id",
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    unit: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "RecipeHasIngredient",
    tableName: "recipe_has_ingredient",
  }
);
