import { DataTypes, Model } from "sequelize";
import { sequelize } from "./sequelize-client.js";

export class Difficulty extends Model {}

/**
 * On initialise le modèle Difficulty avec les attributs et les options
 * @param {Object} sequelize - Instance de Sequelize
 * @param {Object} DataTypes - Types de données de Sequelize
 * @param {Object} Model - Classe de base pour les modèles Sequelize
 * @returns {void}
 */

Difficulty.init(
  {
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "difficulty",
  }
);
