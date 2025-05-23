// Importation de la bibliothèque Joi
import Joi from "joi";

// Déclaration de la constante createMotionSchema contenant l'objet Joi
/**
 * Schéma de validation pour la création d'une oeuvre.
 * @type {import('yup').ObjectSchema}
 */
export const createMotionSchema = Joi.object({
  // Définition des entrées relatives à une oeuvre
  title: Joi.string().trim().min(2).max(150).required().messages({
    // Joi.string() : vérifie que la valeur est une châine de caractères
    // .trim(): supprime les espaces de début et de fin
    // .min() : longueur minimale de caractères (ici 2)
    // .max() : longueur maximale de caractères (ici 150)
    // .required(): propriété obligatoire
    // .messages ({...}) : définit un messages d'erreurs personnalisés
    "string.base": "Le titre doit être une chaîne de caractères.",
    "string.min": "Le titre doit comporter au moins 2 caractères.",
    "string.max": "Le titre doit comporter 50 caractères maximum.",
    "any.required": "Le requis est obligatoire.",
  }),

  // Définition propriété release_date qui doit être une chaîne de caractères
  // .pattern(/^\d{2}\/\d{2}\/\d{4}$/) : vérifie que la châine correspond au format DD/MM/YYYY
  // .required() : propriété obligatoire
  // .messages({...}) : définit un messages d'erreurs personnalisés
  release_date: Joi.string()
    .pattern(/^\d{2}\/\d{2}\/\d{4}$/)
    .required()
    .messages({
      "string.pattern.base": "Le format de la date doit être similaire au format suivant : DD/MM/YYYY.",
    }),

  // Définition propriété director
  director: Joi.string().min(3).max(50).required().messages({
    "string.base": "Le nom du réalisateur doit être une chaîne de caractères", // Vérifie que la valeur est une chaîne de caractères
    "string.min": "Le nom du réalisateur doit comporter au moins 3 caractères", // Vérifie que la chaîne a une longueur minimale de 3 caractères
    "string.max": "Le nom du réalisateur doit comporter au maximum 50 caractères", // Vérifie que la chaîne a une longueur maximale de 50 caractères
    "any.required": "Le nom du réalisateur est requis", // Vérifie que la propriété est obligatoire
  }),

  // Définition propriété description
  description: Joi.string().required().messages({
    "string.base": "La description doit être une chaîne de caractères", // Vérifie que la valeur est une chaîne de caractères
    "any.required": "La description est requise", // Vérifie que la propriété est obligatoire
  }),

  // Définition propriété catchphrase
  catchphrase: Joi.string().required().messages({
    "string.base": "L'anecdote doit être une chaîne de caractères", // Vérifie que la valeur est une chaîne de caractères
    "any.required": "L'anecdote est requise", // Vérifie que la propriété est obligatoire
  }),

  // Définition propriété motion-format-id
  // Joi.nomber(): vérifie que la valeur est un nombre
  // .integer(): vérifie que le nombre est un entier
  // .positive(): vérifie que le nombre est positif
  // .required(): propriété obligatoire
  motion_format_id: Joi.number().integer().positive().required().messages({
    "number.base": "Le format doit être un nombre",
    "number.integer": "Le format doit être un entier",
    "number.positive": "Le format doit être un nombre positif",
    "any.required": "Le format est requis",
  }),

  motion_genres: Joi.array() // Joi.array() : vérifie que la valeur est un tableau
    .items(
      // Joi.object() : vérifie que chaque élément du tableau est un objet
      Joi.object({
        motion_genre_id: Joi.number().integer().positive().required(),
      }) // Joi.number() : vérifie que la valeur est un nombre
      // .integer() : vérifie que le nombre est un entier
      // .positive() : vérifie que le nombre est positif
      // .required() : propriété obligatoire
    )
    .required()
    .messages({
      "array.base": "Le genre doit être un tableau.",
      "any.required": "Le genre est requis.",
    }),

  // Définition propriété picture
  // .required() : propriété obligatoire
  picture: Joi.any().required().messages({
    "any.required": "Veuillez proposer une image pour l'oeuvre", // Vérifie que la propriété est obligatoire
  }),
});
