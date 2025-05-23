import Joi from "joi";

// Déclaration de la constante createMotionSchema contenant l'objet Joi
/**
 * Schéma de validation pour la création d'un ingrédient.
 * @type {import('yup').ObjectSchema}
 */
export const createIngredientSchema = Joi.object({ // Déclaration de l'objet Joi
  name: Joi.string().min(2).max(50).required().messages({   // Validation du nom de l'ingrédient
    "string.base": "Le nom doit être une chaîne de caractères", // Vérifie que la valeur est une chaîne de caractères
    "string.min": "Le nom doit comporter au moins 2 caractères", // Vérifie que la chaîne a une longueur minimale de 2 caractères
    "string.max": "Le nom doit comporter 50 caractères maximum ", // Vérifie que la chaîne a une longueur maximale de 50 caractères
    "any.required": "Le nom est obligatoire", // Vérifie que la propriété est obligatoire
  }),
});
