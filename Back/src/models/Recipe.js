import { DataTypes, Model } from "sequelize";
import { sequelize } from "./sequelize-client.js";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";

// Ces deux lignes permettent d'obtenir __dirname dans un module ES6
// __filename permet d'obtenir l'URL du fichier actuel
const __filename = fileURLToPath(import.meta.url);
// __dirname permet d'obtenir le répertoire où se trouve le fichier actuel
const __dirname = dirname(__filename);

export class Recipe extends Model {
  get localeCreationDate() {
    return this.created_at.toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  get localeUpdateDate() {
    return this.updated_at.toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
}

/**
/* On initialise le modèle Recipe avec les attributs et les options
/* @param {Object} sequelize - Instance de Sequelize
/* @param {Object} DataTypes - Types de données de Sequelize
/* @param {Object} Model - Classe de base pour les modèles Sequelize
/* @returns {void}
/*/
Recipe.init(
  {
    title: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    picture: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    instruction: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    anecdote: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    completion_time: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "recipe",
  }
);

//on utilise un 'Hook de Sequelize.
//ici : beforDestroy qui permet de realiser la fonction a la supression d'une instance de Recipe
Recipe.beforeDestroy(async (recipe) => {
  // si il y a une picture associé a la recipe alors:
  if (recipe.picture) {
    console.log("Hook beforeDestroy appelé pour :", recipe.title);
    // on récupère le chemin de l'immage associé a l'instance qui va etre suprimmer
    const completPath = path.join(__dirname, "../../public", recipe.picture);
    try {
      //on suprimme l'image
      await fs.unlink(completPath);
      //fs pour filer systeme permet de manipuler les fichiers et dossiers
      //unlink pour suprimme un fichier
      console.log("Image supprimée :", completPath);
    } catch (error) {
      //si une erreur survient alors on la log
      console.error("Erreur lors de la suppression de l'image :", error.message);
    }
  }
});

//on utilise un 'Hook de Sequelize.
//ici :beforeUpdate qui exécute la fonction avant la mise à jour d'une instance de modèle "Recipe"
Recipe.beforeUpdate(async (recipe) => {
  // On vérifie si le champ "picture" a été modifié dans cette mise à jour
  if (recipe.changed("picture")) {
    // On récupère l'ancienne valeur du champ "picture" avant modification
    const oldPicture = recipe.previous("picture");

    // Si une ancienne image existe (c’est-à-dire que ce n’est pas la première image ou qu’elle a bien été changée)
    if (oldPicture) {
      // On construit le chemin absolu vers l'ancienne image à supprimer
      const oldImagePath = path.join(__dirname, "../../public", oldPicture);

      try {
        // On tente de supprimer l'ancienne image du système de fichiers (fs.unlink etant une methode Node.js qui suprimme un fichier du système.)
        await fs.unlink(oldImagePath);
        console.log("Ancienne image supprimée :", oldImagePath);
      } catch (err) {
        // Si une erreur survient (par exemple, fichier déjà supprimé ou introuvable), on l'affiche dans la console
        console.error("Erreur lors de la suppression de l'ancienne image :", err.message);
      }
    }
  }
});
