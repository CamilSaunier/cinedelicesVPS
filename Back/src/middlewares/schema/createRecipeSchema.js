import Joi from "joi";

/**
 * Schéma de validation pour la création d'une recette.
 * @type {import('yup').ObjectSchema}
 */
export const createRecipeSchema = Joi.object({
  title: Joi.string().trim().min(3).max(150).required().messages({
    "string.base": "Le titre doit être une chaîne de caractères.",
    "string.min": "Le titre doit contenir au moins 3 caractères.",
    "string.max": "Le titre ne doit pas dépasser 150 caractères.",
    "any.required": "Le titre est requis.",
  }),
  description: Joi.string().required().messages({
    "any.required": "La description est requise.",
  }),
  instruction: Joi.string().required().messages({
    "any.required": "Les instructions sont requises.",
  }),
  anecdote: Joi.string().required().messages({
    "any.required": "L'anecdote est requise.",
  }),
  completion_time: Joi.number().integer().required().messages({
    "integer.base": "Le temps de préparation doit être un entier.",
    "any.required": "Le temps de préparation est requis.",
  }),
  user_id: Joi.number().integer().positive().required().messages({
    "number.base": "L'ID utilisateur doit être un nombre.",
    "any.required": "L'ID utilisateur est requis.",
  }),
  dish_category_id: Joi.number().integer().positive().required().messages({
    "number.base": "L'ID de la catégorie de plat doit être un nombre.",
    "any.required": "L'ID de la catégorie de plat est requis.",
  }),
  motion_id: Joi.number().integer().positive().required().messages({
    "number.base": "L'ID du mouvement doit être un nombre.",
    "any.required": "L'ID du mouvement est requis.",
  }),
  difficulty_id: Joi.number().integer().positive().required().messages({
    "number.base": "L'ID de difficulté doit être un nombre.",
    "any.required": "L'ID de difficulté est requis.",
  }),
  ingredients: Joi.array()
    .items(
      Joi.object({
        ingredient_id: Joi.number().integer().positive().required().messages({
          "number.base": "L'ID de l'ingrédient doit être un nombre.",
          "number.integer": "L'ID de l'ingrédient doit être un entier.",
          "number.positive": "L'ID de l'ingrédient doit être un nombre positif.",
          "any.required": "L'ID de l'ingrédient est requis.",
        }),
        quantity: Joi.number().positive().required().messages({
          "number.base": "La quantité doit être un nombre.",
          "number.positive": "La quantité doit être positive.",
          "any.required": "La quantité est requise.",
        }),
        unit: Joi.string().trim().required().messages({
          "string.base": "L'unité doit être une chaîne de caractères.",
          "any.required": "L'unité est requise.",
        }),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.base": "Les ingrédients doivent être un tableau.",
      "array.min": "Au moins un ingrédient est requis.",
      "any.required": "Les ingrédients sont requis.",
    }),
  picture: Joi.any().required().messages({
    "any.required": "Veuillez proposer une image pour la recette.",
  }),
});
