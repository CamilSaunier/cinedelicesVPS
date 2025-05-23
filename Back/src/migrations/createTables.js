import { sequelize } from "../models/association.js";

/**
 * @description Script pour créer les tables dans la base de données
 * @async
 * @function createTables
 * @returns {Promise<void>}
 */

// Importation de sequelize depuis le fichier association.js
try {
  await sequelize.drop(); // Supprime toutes les tables existantes
  await sequelize.sync(); // Synchronise le modèle avec la base de données
} catch (error) { // Gestion des erreurs
  console.error(error); // Affiche l'erreur dans la console
  process.exit(1); // Quitte le processus avec un code d'erreur
}
