import Joi from "joi";

/**
 * Schéma de validation pour le login d'un utilisateur.
 * @type {import('yup').ObjectSchema}
 */
export const loginUserSchema = Joi.object({
  // Définition des entrées relatives à la connexion d'un utilisateur
  // Joi.string() : vérifie que la valeur est une chaîne de caractères
  // .trim(): supprime les espaces de début et de fin
  // .email() : vérifie que la chaîne est une adresse email valide
  // .required(): propriété obligatoire
  // .messages ({...}) : définit un messages d'erreurs personnalisés
  email: Joi.string().email().required().messages({
    "string.base": "l'email doit être une chaîne de caractères",
    "string.email": "l'email doit être valide",
    "string.empty": "l'email ne peut pas être vide",
    "any.required": "l'email est requis",
  }),
  // Pas besoin ici de valider les critères de compléxité du mot de passe, puisque le mot de passe est déjà supposé avoir été validé à la création de compte avec "createUserSchema"
  // Définition propriété password
  // Joi.string() : vérifie que la valeur est une chaîne de caractères
  // .required(): propriété obligatoire
  // .messages ({...}) : définit un messages d'erreurs personnalisés
  password: Joi.string().required().messages({
    "string.base": "Le mot de passe doit être une chaîne de caractères",
    "string.empty": "Le mot de passe ne peut pas être vide",
    "any.required": "Le mot de passe est requis",
  }),
});
