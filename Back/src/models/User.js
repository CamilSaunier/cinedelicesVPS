import { DataTypes, Model } from "sequelize";
import { sequelize } from "./sequelize-client.js";

export class User extends Model {}

/**
/ * On initialise le modèle User avec les attributs et les options
/* @param {Object} sequelize - Instance de Sequelize
/* @param {Object} DataTypes - Types de données de Sequelize
/* @param {Object} Model - Classe de base pour les modèles Sequelize
/* @returns {void}
*/
User.init(
  {
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    pseudo: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "member",
    },
  },
  {
    sequelize,
    tableName: "user",
  }
);
