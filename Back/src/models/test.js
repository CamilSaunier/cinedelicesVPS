import {
  Difficulty,
  DishCategory,
  Ingredient,
  Motion,
  MotionFormat,
  MotionGenre,
  Recipe,
  RecipeHasIngredient,
  User,
} from "./association.js";
import { sequelize } from "./sequelize-client.js";

// --------------------------------
// TEST RELATION USER <--> RECIPE
// --------------------------------

// test de l'association avec les éléments User et Recipe de la table User
const user = await User.findByPk(1, {
  //on cible le user par son Id
  include: "recipes", //on inclus le Model recipes
});
//console.log(user.toJSON());

// --------------------------------------
// TEST RELATION DIFFICULTY <--> RECIPE
// --------------------------------------

const difficulty = await Difficulty.findByPk(2, {
  //on cible la Dfficulty par son Id
  include: "recipes", //on inclus le Model Recipe par son alias
});
//console.log(difficulty.toJSON());

// --------------------------------------
// TEST RELATION DISHCATEGORY <--> RECIPE
// --------------------------------------

// test de l'association avec les models DishCategory et Recipe de la table DishCategory
const category = await DishCategory.findByPk(2, {
  //on cible le DishCategory par son Id
  include: "recipes", //on inclus le Model Recipe par son alias
});
//console.log(category.toJSON());

// --------------------------------------
// TEST RELATION MOTION <--> RECIPE
// --------------------------------------

//test de l'association avec les models Motion et Recipe
const motion = await Motion.findByPk(1, {
  include: "recipes",
});
//console.log(motion.toJSON());

// ------------------------------------
// TEST RELATION MOTIONFORMAT <--> MOTION
// ------------------------------------

//test de l'association avec les MotionFormat et Motion
const motionFormat = await MotionFormat.findByPk(1, {
  include: "motions",
});
//console.log(motionFormat.toJSON());

// ------------------------------------
// TEST RELATION MOTIONGENRE <--> MOTION
// ------------------------------------

//test de l'association avec les MotionGenre et Motion
const motionGenre = await MotionGenre.findByPk(2, {
  include: [
    {
      association: "motions",
      include: "formats",
    },
  ],
});
//console.log(motionGenre.toJSON());

// ------------------------------------
// TEST RELATION RECIPE <--> INGREDIENT
// ------------------------------------

// test de l'association avec les éléments unit et quantity de la table RecipeHasIngredient
const recipe = await Recipe.findByPk(2, {
  //on cible la recette par son Id
  include: {
    model: Ingredient, //on inclut le Model Ingredient
    as: "ingredients", // avec l'alias ingredients défini dans le Model Ingredient
    through: { attributes: ["quantity", "unit"] }, //on inclut les attributs quantity et unit du model Ingredient
  },
});
//console.log(JSON.stringify(recipe.ingredients, null, 2));


