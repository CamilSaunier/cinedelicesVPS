import Joi from "joi";

/**
 * Schéma de validation pour la création d'un utilisateur.
 * @type {import('yup').ObjectSchema}
 */
export const createUserSchema = Joi.object({
  // Définition des entrées relatives à un utilisateur
  // Joi.string() : vérifie que la valeur est une chaîne de caractères
  // .trim(): supprime les espaces de début et de fin
  // .min() : longueur minimale de caractères (ici 2)
  // .max() : longueur maximale de caractères (ici 100)
  // .required(): propriété obligatoire
  // .messages ({...}) : définit un messages d'erreurs personnalisés
  pseudo: Joi.string().min(2).max(100).required().messages({
    "string.base": "le pseudo doit être une chaîne de caractères",
    "string.empty": "le pseudo ne peut pas être vide",
    "string.min": "le pseudo doit comporter au moins 2 caractères",
    "string.max": "le pseudo doit comporter 100 caractères maximum",
    "any.required": "le pseudo est requis",
  }),

  email: Joi.string().email().max(255).required().messages({
    "string.base": "l'email doit être une chaîne de caractères",
    "string.email": "l'email doit être un email valide",
    "string.empty": "l'email ne peut pas être vide",
    "string.max": "l'email doit comporter 255 caractères maximum",
    "any.required": "l'email est requis",
  }),

  password: Joi.string().min(12).max(128).pattern(new RegExp("^(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9])")).required().messages({
    "string.base": "Le mot de passe doit être une chaîne de caractères",
    "string.empty": "Le mot de passe ne peut pas être vide",
    "string.min": "Le mot de passe doit comporter au moins 12 caractères",
    "string.max": "Le mot de passe doit comporter 128 caractères maximum",
    // Vérifie que le mot de passe contient au moins une majuscule, un chiffre et un caractère spécial
    "string.pattern.base": "Le mot de passe doit contenir au moins une majuscule, un chiffre et un caractère spécial",
    "any.required": "Le mot de passe est requis",
  }),

  role: Joi.string().valid("member", "admin").default("member").messages({
    "string.base": "le rôle doit être une chaîne de caractères",
    "any.only": 'le rôle doit être "member" ou "admin"',
  }),
});
