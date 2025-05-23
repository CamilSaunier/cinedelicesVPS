import joi from "joi";

/**
 * Schéma de validation pour la réinitialisation du mot de passe d'un utilisateur.
 * @type {import('yup').ObjectSchema}
 */
export const resetUserPasswordSchema = joi.object({
  // Définition des entrées relatives à la réinitialisation du mot de passe
  // Joi.string() : vérifie que la valeur est une chaîne de caractères
  // .min() : longueur minimale de caractères (ici 12)
  // .max() : longueur maximale de caractères (ici 128)
  // .pattern() : vérifie que la chaîne respecte un motif spécifique (ici, au moins une majuscule, un chiffre et un caractère spécial)
  newPassword: joi.string().min(12).max(128).pattern(new RegExp("^(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9])")).required().messages({
    "string.base": "Le mot de passe doit être une chaîne de caractères", // Vérifie que la valeur est une chaîne de caractères
    "string.empty": "Le mot de passe ne peut pas être vide", // Vérifie que la chaîne n'est pas vide
    "string.min": "Le mot de passe doit comporter au moins 12 caractères", // Vérifie que la chaîne a une longueur minimale de 12 caractères
    "string.max": "Le mot de passe doit comporter au maximum 128 caractères", // Vérifie que la chaîne a une longueur maximale de 128 caractères
    "string.pattern.base": "Le mot de passe doit contenir au moins une lettre majuscule, un chiffre et un caractère spécial", // Vérifie que le mot de passe contient au moins une majuscule, un chiffre et un caractère spécial
  }),
  // Définition de la confirmation du mot de passe
  // Joi.string() : vérifie que la valeur est une chaîne de caractères
  // .valid() : vérifie que la valeur est égale à la valeur de newPassword
  // .required(): propriété obligatoire
  // .messages ({...}) : définit un messages d'erreurs personnalisés
  confirm: joi.string().valid(joi.ref("newPassword")).required().messages({
    "any.only": "Les mots de passe ne correspondent pas", // Vérifie que la valeur est égale à la valeur de newPassword
    "string.empty": "La confirmation du mot de passe ne peut pas être vide", // Vérifie que la chaîne n'est pas vide
    "any.required": "La confirmation du mot de passe est requise", // Vérifie que la propriété est obligatoire
  }),
});
