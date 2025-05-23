// ─── Librairies externes ──────────────────────────────────────────────────────
import { Router } from "express";

// ─── Middlewares ──────────────────────────────────────────────────────────────
import { canModifySelf } from "./middlewares/canModifySelf.js";
import { isAdmin } from "./middlewares/isAdmin.js";
import { isAuthenticated } from "./middlewares/isAuthenticated.js";
import { validate } from "./middlewares/validateWrapper.js";
import { validateIdParam } from "./middlewares/validateIdParam.js";
import limiter from "./middlewares/rateLimit.js";

// ─── Schémas de validation ────────────────────────────────────────────────────
import { createMotionSchema } from "./middlewares/schema/createMotionSchema.js";
import { createRecipeSchema } from "./middlewares/schema/createRecipeSchema.js";
import { createUserSchema } from "./middlewares/schema/createUserSchema.js";
import { loginUserSchema } from "./middlewares/schema/loginUserSchema.js";
import { updateRecipeSchema } from "./middlewares/schema/updateRecipeSchema.js";
import { updateUserSchema } from "./middlewares/schema/updateUserSchema.js";
import { updateMotionSchema } from "./middlewares/schema/updateMotionSchema.js";
import { verifyUserSchema } from "./middlewares/schema/verifyUserSchema.js";
import { createIngredientSchema } from "./middlewares/schema/createIngredientSchema.js";
import { resetUserPasswordSchema } from "./middlewares/schema/resetUserPasswordSchema.js";
import { forgotPasswordSchema } from "./middlewares/schema/forgotPasswordSchema.js";

// ─── Contrôleurs ──────────────────────────────────────────────────────────────
import difficultyController from "./controllers/difficultyController.js";
import dishCategoryController from "./controllers/dishCategoryController.js";
import genreController from "./controllers/genreController.js";
import ingredientsController from "./controllers/ingredientsController.js";
import motionController from "./controllers/motionController.js";
import recipeController from "./controllers/recipeController.js";
import userController from "./controllers/userController.js";

// ─── Utilitaires ──────────────────────────────────────────────────────────────
import upload from "./utils/multer.js";

const router = Router();

// ─── ROUTES RECETTES ──────────────────────────────────────────────────────────

router.get("/recipes", recipeController.getAllRecipes);
// pour l'erreur 404
router.get("/recipes/search", recipeController.getRecipesBySearch);
// pour l'erreur 500
router.get("/recipes/search/:search", recipeController.getRecipesBySearch);
router.get("/recipes/:id", validateIdParam, recipeController.getOneRecipe);
router.post("/recipes", isAuthenticated, upload.single("picture"), validate(createRecipeSchema), recipeController.createOneRecipe);

// ─── ROUTES CATÉGORIES & DIFFICULTÉS DE PLATS ────────────────────────────────

router.get("/dishesCategories", dishCategoryController.getAllDishesCategories);
router.get("/dishesDifficulty", difficultyController.getAllDifficulty);
router.get("/ingredients", ingredientsController.getAllIngredients);
router.get("/genres", genreController.getAllGenres);

// ─── ROUTES UTILISATEURS ──────────────────────────────────────────────────────

router.post("/user/register", validate(createUserSchema), userController.createOneUser);
router.post("/refresh-token", userController.generateRefreshToken); //Permet de créer un nouvel access token si le refresh token existe toujours dans les cookies
router.post("/user/login", validate(loginUserSchema), userController.login);
router.post("/user/verify", isAuthenticated, validate(verifyUserSchema), userController.VerifyUser);
router.post("/user/logout", userController.logout); // on nettoie le cookie côté client donc pas besoin de middleware IsAuthenticated ici
router.post("/user/forgotPassword", validate(forgotPasswordSchema), userController.forgotPassword);
router.post("/user/resetPassword/:token", validate(resetUserPasswordSchema), userController.resetPassword);
router.patch("/user/:id", validateIdParam, isAuthenticated, canModifySelf, validate(updateUserSchema), userController.modifyOneUser);
router.delete("/user/:id", validateIdParam, isAuthenticated, canModifySelf, userController.deleteOneUser);

// ─── ROUTES ADMINISTRATEURS ──────────────────────────────────────────────────────

router.get("/admin/users", isAuthenticated, isAdmin, userController.getAllUsers);
router.delete("/admin/user/:id", validateIdParam, isAuthenticated, isAdmin, userController.deleteOneUser);
router.delete("/admin/recipes/:id", validateIdParam, isAuthenticated, isAdmin, recipeController.deleteOneRecipe);
router.post("/admin/ingredients", isAuthenticated, isAdmin, validate(createIngredientSchema), ingredientsController.createOneIngredient);
router.delete("/admin/ingredients/:id", validateIdParam, isAuthenticated, isAdmin, ingredientsController.deleteOneIngredient);
router.delete("/admin/motions/:id", validateIdParam, isAuthenticated, isAdmin, motionController.deleteOneMotion);
router.patch("/admin/recipes/:id", validateIdParam, isAuthenticated, isAdmin, upload.single("picture"), validate(updateRecipeSchema), recipeController.modifyOneRecipe);
router.patch("/admin/motions/:id", validateIdParam, isAuthenticated, isAdmin, upload.single("picture"), validate(updateMotionSchema), motionController.modifyOneMotion);
// ─── ROUTES OEUVRES (MOTIONS) ─────────────────────────────────────────────────

router.get("/motions", motionController.getAllMotions);
router.post("/motions", isAuthenticated, upload.single("picture"), validate(createMotionSchema), motionController.createOneMotion);
router.get("/motions/:id", validateIdParam, motionController.getOneMotion);
router.delete("/motions/:id", validateIdParam, motionController.deleteOneMotion);
router.get("/motionsFormats", motionController.getAllMotionsFormats);
router.get("/motionsGenres", motionController.getAllMotionsGenres);

// ─── EXPORT ROUTER ────────────────────────────────────────────────────────────

export { router };
