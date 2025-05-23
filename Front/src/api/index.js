// import génerale de toute les requettes API
import { getRecipes, getRecipeById, createRecipes, getRecipeBySearch } from "./recipesApi.js";
import { createMotions, getAllMotionsFormats, getAllMotionsGenres, getAllMotions, getAllGenres } from "./motionsApi.js";
import { createUser, loginUser, verifyUser, modifyUser, deleteMe } from "./userApi.js";
import { getAllIngredients } from "./ingredientsApi.js";
import { getDishesCategories, getDishesDifficulty } from "./dishesApi.js";
import { getAllUsers, deleteOneUser, deleteOneIngredient, deleteOneMotion, createIngredient, deleteOneRecipe } from "./adminApi.js";

//exportation de toutes les requêtes API
export {
  getRecipes,
  getRecipeById,
  createRecipes,
  getRecipeBySearch,
  createMotions,
  getAllMotionsFormats,
  getAllMotionsGenres,
  getAllMotions,
  getAllGenres,
  createUser,
  loginUser,
  verifyUser,
  modifyUser,
  deleteMe,
  getAllIngredients,
  getDishesCategories,
  getDishesDifficulty,
  getAllUsers,
  deleteOneUser,
  deleteOneIngredient,
  deleteOneMotion,
  createIngredient,
  deleteOneRecipe,
};
