import Joi from "joi";

/**
 * Schéma de validation pour la réinitialisation du mot de passe d'un utilisateur.
 * @type {import('yup').ObjectSchema}
 */
export const forgotPasswordSchema = Joi.object({
  // Définition des entrées relatives à la réinitialisation du mot de passe
  // Joi.string() : vérifie que la valeur est une chaîne de caractères
  // .trim(): supprime les espaces de début et de fin
  // .email() : vérifie que la chaîne est une adresse email valide
  // .required(): propriété obligatoire
  // .messages ({...}) : définit un messages d'erreurs personnalisés
  email: Joi.string().email().required().messages({
    "string.base": "L'email doit être une chaîne de caractères", // Vérifie que la valeur est une chaîne de caractères
    "string.email": "L'email doit être une adresse email valide", // Vérifie que la chaîne est une adresse email valide
    "string.empty": "L'email ne peut pas être vide", // Vérifie que la chaîne n'est pas vide
    "any.required": "L'email est requis", // Vérifie que la propriété est obligatoire
  }),
});
