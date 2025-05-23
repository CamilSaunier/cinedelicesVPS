import Joi from "joi";

/**
 * Schéma de validation pour la vérification du mot de passe d'un utilisateur.
 * @type {import('yup').ObjectSchema}
 */
export const verifyUserSchema = Joi.object({
  // Pas besoin ici de valider les critères de compléxité du mot de passe, puisque le mot de passe est déjà supposé avoir été validé à la création de compte avec "createUserSchema"
  // Définition propriété password
  // Joi.string() : vérifie que la valeur est une chaîne de caractères
  // .required(): propriété obligatoire
  // .messages ({...}) : définit un messages d'erreurs personnalisés
  password: Joi.string().required().messages({
    "string.base": "Le mot de passe doit être une chaîne de caractères", // Vérifie que la valeur est une chaîne de caractères
    "string.empty": "Le mot de passe ne peut pas être vide", // Vérifie que la chaîne n'est pas vide
    "any.required": "Le mot de passe est requis", // Vérifie que la propriété est obligatoire
  }),
});
