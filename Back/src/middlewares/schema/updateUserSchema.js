import Joi from "joi";

/**
 * Schéma de validation pour la mise à jour des informations d'un utilisateur.
 * @type {import('yup').ObjectSchema}
 */
export const updateUserSchema = Joi.object({
  // Déclaration de l'objet Joi
  // Définition des entrées relatives à un utilisateur
  // Joi.string() : vérifie que la valeur est une chaîne de caractères
  // .trim(): supprime les espaces de début et de fin
  // .min() : longueur minimale de caractères (ici 2)
  // .max() : longueur maximale de caractères (ici 100)
  // .optional(): propriété optionnelle
  // .messages ({...}) : définit un messages d'erreurs personnalisés
  pseudo: Joi.string().min(2).max(100).optional().messages({
    "string.base": "Le pseudo doit être une chaîne de caractères", // Vérifie que la valeur est une chaîne de caractères
    "string.empty": "Le pseudo ne peut pas être vide", // Vérifie que la chaîne n'est pas vide
    "string.min": "Le pseudo doit comporter au moins 2 caractères", // Vérifie que la chaîne a une longueur minimale de 2 caractères
    "string.max": "Le pseudo doit comporter au maximum 100 caractères", // Vérifie que la chaîne a une longueur maximale de 100 caractères
  }),
  // Définition de lobjet email
  // Joi.string() : vérifie que la valeur est une chaîne de caractères
  // .email() : vérifie que la chaîne est une adresse email valide
  // .max() : longueur maximale de caractères (ici 255)
  // .optional(): propriété optionnelle
  // .messages ({...}) : définit un messages d'erreurs personnalisés
  email: Joi.string().email().max(255).optional().messages({
    "string.base": "L'email doit être une chaîne de caractères", // Vérifie que la valeur est une chaîne de caractères
    "string.email": "L'email doit être une adresse email valide", // Vérifie que la validité de l'email
    "string.empty": "L'email ne peut pas être vide", // Vérifie que la présence de l'email
    "string.max": "L'email doit comporter au maximum 255 caractères", // Vérifie que la chaîne a une longueur maximale de 255 caractères
  }),
  // Définition de l'objet password
  // Joi.string() : vérifie que la valeur est une chaîne de caractères
  // .min() : longueur minimale de caractères (ici 12)
  // .max() : longueur maximale de caractères (ici 128)
  // .pattern() : vérifie que la chaîne respecte un motif spécifique (ici, au moins une majuscule, un chiffre et un caractère spécial)
  // .optional(): propriété optionnelle
  // .messages ({...}) : définit un messages d'erreurs personnalisés
  password: Joi.string().min(12).max(128).pattern(new RegExp("^(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9])")).optional().messages({
    "string.base": "Le mot de passe doit être une chaîne de caractères", // Vérifie que la valeur est une chaîne de caractères
    "string.empty": "Le mot de passe ne peut pas être vide", // Vérifie que la présence de password
    "string.min": "Le mot de passe doit comporter au moins 12 caractères", // Vérifie que le password a une longueur minimale de 12 caractères
    "string.max": "Le mot de passe doit comporter au maximum 128 caractères", // Vérifie que le password a une longueur maximale de 128 caractères
    "string.pattern.base": "Le mot de passe doit contenir au moins une lettre majuscule, un chiffre et un caractère spécial", // Vérifie que le mot de passe contient au moins une majuscule, un chiffre et un caractère spécial
  }),
  // Définition de l'objet role
  // Joi.string() : vérifie que la valeur est une chaîne de caractères
  // .valid() : vérifie que la valeur est égale à "member" ou "admin"
  // .optional(): propriété optionnelle
  // .messages ({...}) : définit un messages d'erreurs personnalisés

  role: Joi.string().valid("member", "admin").optional().messages({
    "string.base": "Le rôle doit être une chaîne de caractères", // Vérifie que la valeur est une chaîne de caractères
    "any.only": 'Le rôle doit être soit "member" ou "admin"', // Vérifie que le rôle est "member" ou "admin"
  }),
});
