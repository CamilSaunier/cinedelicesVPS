import { Difficulty } from "./Difficulty.js";
import { DishCategory } from "./DishCategory.js";
import { Ingredient } from "./Ingredient.js";
import { MotionFormat } from "./MotionFormat.js";
import { Motion } from "./Motion.js";
import { MotionGenre } from "./MotionGenre.js";
import { Recipe } from "./Recipe.js";
import { User } from "./User.js";
import { RecipeHasIngredient } from "./RecipeHasIngredient.js";
import { sequelize } from "./sequelize-client.js";

// Doc : https://sequelize.org/docs/v6/core-concepts/assocs/
// Plusieurs manières de faire en Sequelize

// 3 types d'associations (Rappel) :
// - One-To-One : hasOne + belongsTo
// - One-To-Many : hasMany + belongsTo
// - Many-To-Many : belongsToMany + belongsToMany

// --------------------------------
// User <--> Recipe (One-To-Many)
// --------------------------------
User.hasMany(Recipe, {
  foreignKey: "user_id",
  as: "recipes", // lorsqu' on requête un user, on veut récupérer SES recipes
});
Recipe.belongsTo(User, {
  foreignKey: "user_id",
  as: "author", // lorsqu' on requête une recette, on veut récupérer SON author
});

// --------------------------------
// DishCategory <--> Recipe (One-To-Many)
// --------------------------------
DishCategory.hasMany(Recipe, {
  foreignKey: "dish_category_id",
  as: "recipes", // lorsqu' on requête une catégorie de plat , on veut récupérer SES recipes
});
Recipe.belongsTo(DishCategory, {
  foreignKey: "dish_category_id",
  as: "category", // lorsqu' on requêtes une recette, je veux récupérer SA category
});

// --------------------------------
// Difficulty <--> Recipe (One-To-Many)
// --------------------------------
Difficulty.hasMany(Recipe, {
  foreignKey: "difficulty_id",
  as: "recipes", // lorsqu' on requête une difficulté on veut récupérer SES recipes
});
Recipe.belongsTo(Difficulty, {
  foreignKey: "difficulty_id",
  as: "difficulty", // lorsqu'on requête une recette, on veut récupérer SA difficulty
});

// --------------------------------
// Motion <--> Recipe (One-To-Many)
// --------------------------------

Motion.hasMany(Recipe, {
  foreignKey: "motion_id",
  as: "recipes", // lorsqu'on requête une oeuvre, on veut récupérer SES recipes
  onDelete: "CASCADE", // Supprime toutes les recettes liées à ce film lors de la suppression du film
});
Recipe.belongsTo(Motion, {
  foreignKey: "motion_id",
  as: "motion", // lorsqu'on requête une recette, on veut récupérer SON oeuvre.
});

// --------------------------------
// MotionFormat <--> Motion (one-To-Many)
// --------------------------------
MotionFormat.hasMany(Motion, {
  foreignKey: "motion_format_id",
  as: "motions", // lorsqu'on requête un format d'oeuvre, on veut récupérer SES motions
});
Motion.belongsTo(MotionFormat, {
  foreignKey: "motion_format_id",
  as: "format", // lorsqu'on requête un film, on veut récupérer SON format d'oeuvre
});

// --------------------------------
// MotionGenre <--> Motion (Many-To-Many)
// --------------------------------

MotionGenre.belongsToMany(Motion, {
  through: "motion_genre_has_motion", // nom de la table de liaison
  as: "motions", //alias au pluriel
  foreignKey: "motion_genre_id", // nom de la clé étrangère qui pointe vers le modèle "target table", ici MotionGenre
  otherKey: "motion_id", //(optionnel pour rappel) nom de la clé étrangère qui pointe vers le "join model"
});
Motion.belongsToMany(MotionGenre, {
  through: "motion_genre_has_motion", // nom de la table de liaison
  as: "genres", // alias au pluriel
  foreignKey: "motion_id", // nom de la clé étrangère qui pointe vers le modèle "target table", ici Motion
  otherKey: "motion_genre_id", //(optionnel pour rappel) nom de la clé étrangère qui pointe vers le "join model"
});

// --------------------------------
// Ingredient <--> Recipe (Many-To-Many)
// --------------------------------
Ingredient.belongsToMany(Recipe, {
  through: RecipeHasIngredient, //nom de la table de liaison
  as: "recipes", // alias au pluriel
  foreignKey: "ingredient_id", // nom de la clé étrangère qui pointe vers le modèle Ingredient
  otherKey: "recipe_id", //(optionnel pour rappel) nom de la clé étrangère qui pointe vers le "join model"
});
Recipe.belongsToMany(Ingredient, {
  through: RecipeHasIngredient, //nom de la table de liaison
  as: "ingredients", // alias au pluriel
  foreignKey: "recipe_id", // nom de la clé étrangère qui pointe vers le modèle Recipe
  otherKey: "ingredient_id", //(optionnel pour rappel) nom de la clé étrangère qui pointe vers le "join model"
});

export { Difficulty, DishCategory, Ingredient, Motion, MotionFormat, MotionGenre, Recipe, RecipeHasIngredient, User, sequelize };
