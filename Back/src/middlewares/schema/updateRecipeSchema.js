import Joi from "joi";

/**
 * Schéma de validation pour la mise à jour d'une recette.
 * @type {import('yup').ObjectSchema}
 */
export const updateRecipeSchema = Joi.object({
  // Déclaration de l'objet Joi
  // Définition des entrées relatives à une recette
  // Joi.string() : vérifie que la valeur est une chaîne de caractères
  // .trim(): supprime les espaces de début et de fin
  // .min() : longueur minimale de caractères (ici 3)
  // .max() : longueur maximale de caractères (ici 150)
  // .messages ({...}) : définit un messages d'erreurs personnalisés
  title: Joi.string().trim().min(3).max(150).messages({
    "string.base": "Le titre doit être une chaîne de caractères.", // Vérifie que la valeur est une chaîne de caractères
    "string.min": "Le titre doit comporter au moins 3 caractères.", // Vérifie que la chaîne a une longueur minimale de 3 caractères
    "string.max": "Le titre doit comporter 150 caractères au maximum.", // Vérifie que la chaîne a une longueur maximale de 150 caractères
  }),
  // Définition de l'objet description
  // Joi.string() : vérifie que la valeur est une chaîne de caractères
  // .messages ({...}) : définit un messages d'erreurs personnalisés
  description: Joi.string().messages({
    "string.base": "La description doit être une chaîne de caractères.", // Vérifie que la valeur est une chaîne de caractères
  }),
  // Définition de l'objet instruction
  // Joi.string() : vérifie que la valeur est une chaîne de caractères
  // .messages ({...}) : définit un messages d'erreurs personnalisés
  instruction: Joi.string().messages({
    "string.base": "L'instruction doit être une chaîne de caractères.", // Vérifie que la valeur est une chaîne de caractères
  }),
  // Définition de l'objet anecdote
  // Joi.string() : vérifie que la valeur est une chaîne de caractères
  // .messages ({...}) : définit un messages d'erreurs personnalisés
  anecdote: Joi.string().messages({
    "string.base": "L'anecdote doit être une chaîne de caractères.", // Vérifie que la valeur est une chaîne de caractères
  }),
  // Définition de l'objet completion_time
  // Joi.number() : vérifie que la valeur est un nombre
  // .integer() : vérifie que le nombre est un entier
  // .messages ({...}) : définit un messages d'erreurs personnalisés
  completion_time: Joi.number().integer().messages({
    "number.base": "Le temps de réalisation doit être un nombre.", // Vérifie que la valeur est un nombre
    "integer.base": "Le temps de réalisation doit être un nombre entier.", // Vérifie que la valeur est un entier
  }),
  // Définition de l'objet user_id
  // Joi.number() : vérifie que la valeur est un nombre
  // .integer() : vérifie que le nombre est un entier
  // .positive() : vérifie que le nombre est positif
  // .messages ({...}) : définit un messages d'erreurs personnalisés
  user_id: Joi.number().integer().positive().messages({
    "number.base": "user_id doit être un nombre.", // Vérifie que la valeur est un nombre
  }),
  // Définition de l'objet dish_category_id
  // Joi.number() : vérifie que la valeur est un nombre
  // .integer() : vérifie que le nombre est un entier
  // .positive() : vérifie que le nombre est positif
  // .messages ({...}) : définit un messages d'erreurs personnalisés
  dish_category_id: Joi.number().integer().positive().messages({
    "number.base": "dish_category_id doit être un numbre.",
  }),
  // Définition de l'objet motion_id
  // Joi.number() : vérifie que la valeur est un nombre
  // .integer() : vérifie que le nombre est un entier
  // .positive() : vérifie que le nombre est positif
  // .messages ({...}) : définit un messages d'erreurs personnalisés
  motion_id: Joi.number().integer().positive().messages({
    "number.base": "motion_id doit être un nombre.", // Vérifie que la valeur est un nombre
  }),
  // Définition de l'objet difficulty_id
  // Joi.number() : vérifie que la valeur est un nombre
  // .integer() : vérifie que le nombre est un entier
  // .positive() : vérifie que le nombre est positif
  // .messages ({...}) : définit un messages d'erreurs personnalisés
  difficulty_id: Joi.number().integer().positive().messages({
    "number.base": "difficulty_id doit être un nombre.", // Vérifie que la valeur est un nombre
  }),
  // Définition de l'objet ingredients
  // Joi.array() : vérifie que la valeur est un tableau
  // .items() : vérifie que chaque élément du tableau est un objet
  // Joi.object() : vérifie que chaque élément du tableau est un objet
  // Joi.number() : vérifie que la valeur est un nombre
  // .integer() : vérifie que le nombre est un entier
  // .positive() : vérifie que le nombre est positif
  // .messages ({...}) : définit un messages d'erreurs personnalisés
  ingredients: Joi.array()
    .items(
      Joi.object({
        ingredient_id: Joi.number().integer().positive().required().messages({
          "number.base": "ingredient_id doit être un nombre.", // Vérifie que la valeur est un nombre
          "number.integer": "ingredient_id doint être un entier.", // Vérifie que la valeur est un entier
          "number.positive": "ingredient_id doit être un entier positif.", // Vérifie que la valeur est un entier positif
          "any.required": "ingredient_id est requis.", // Vérifie que la propriété est obligatoire
        }),
        // Définition de l'objet quantity
        // Joi.number() : vérifie que la valeur est un nombre
        // .positive() : vérifie que le nombre est positif
        // .required() : propriété obligatoire
        // .messages ({...}) : définit un messages d'erreurs personnalisés
        quantity: Joi.number().positive().required().messages({
          "number.base": "La quantité doit être un nombre.", // Vérifie que la valeur est un nombre
          "number.positive": "La quantité doit être un nombre positif.", // Vérifie que la valeur est un nombre positif
          "any.required": "La quantité est requise.", // Vérifie que la propriété est obligatoire
        }),
        // Définition de l'objet unit
        // Joi.string() : vérifie que la valeur est une chaîne de caractères
        // .trim(): supprime les espaces de début et de fin
        // .required() : propriété obligatoire
        // .messages ({...}) : définit un messages d'erreurs personnalisés
        unit: Joi.string().trim().required().messages({
          "string.base": "L'unité de mesure doit être une chaîne de caractères.", // Vérifie que la valeur est une chaîne de caractères
          "any.required": "L'unité de mesure est requise.", // Vérifie que la propriété est obligatoire
        }),
      })
    )

    .min(1) // Vérifie que le tableau contient au moins un élément
    .messages({
      //
      "array.base": "ingredient doit être un tableau.", // Vérifie que la valeur est un tableau
      "array.min": "Doit contenir au moins un élément.", // Vérifie que le tableau contient au moins un élément
    }),
  picture: Joi.any().required().messages({
    "any.required": "Veuillez proposer une image pour la recette.",
  }),
});
