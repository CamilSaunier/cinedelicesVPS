import { DataTypes, Model } from "sequelize";
import { sequelize } from "./sequelize-client.js";

export class MotionGenre extends Model {}

/**
 * On initialise le modèle MotionGenre avec les attributs et les options
 * @param {Object} sequelize - Instance de Sequelize
 * @param {Object} DataTypes - Types de données de Sequelize
 * @param {Object} Model - Classe de base pour les modèles Sequelize
 * @returns {void}
 */
MotionGenre.init(
  {
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "motion_genre",
  }
);
