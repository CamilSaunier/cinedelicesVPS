// Importation de la bibliothèque Joi
import Joi from "joi";

// Déclaration de la constante updateMotionSchema contenant l'objet Joi
export const updateMotionSchema = Joi.object({
  // Définitions des entrées relatives à un motion
  title: Joi.string().trim().min(2).max(150).required().messages({
    // Joi.string() : vérifie que la valeur est une châine de caractères
    // .trim(): supprime les espaces de début et de fin
    // .min() : longueur minimale de caractères (ici 2)
    // .max() : longueur maximale de caractères (ici 150)
    // .required(): propriété obligatoire
    // .messages ({...}) : définit un message d'erreurs personnalisés
    "string.base": "Le titre doit être une chaîne de caractères.",
    "string.min": "Le titre doit comporter au moins 2 caractères .",
    "string.max": "Le titre doit comporter 150 caractères au maximum .",
    "any.required": "Le titre est requis.",
  }),

  // Définition propriété release_date qui doit être une chaîne de caractères
  // .pattern(/^\d{4}-\d{2}-\d{2}$/) : vérifie que la châine correspond au format DD-MM-YYYY
  // .required() : propriété obligatoire
  // .messages({...}) : définit un message d'erreurs personnalisés
  release_date: Joi.string()
    .pattern(/^\d{2}\/\d{2}\/\d{4}$/)
    .required()
    .messages({
      "string.pattern.base": "Le format de la date doit être similaire au format suivant : DD/MM/YY.",
    }),

  // Définition propriété director
  // Joi.string() : vérifie que la valeur est une châine de caractères
  // .min() : longueur minimale de caractères (ici 3)
  // .max() : longueur maximale de caractères (ici 50)
  // .required(): propriété obligatoire
  // .messages ({...}) : définit un message d'erreurs personnalisés
  director: Joi.string().min(3).max(50).required().messages({
    "string.base": "Le réalisateur doit être une chaîne de caractères", // Vérifie que la valeur est une chaîne de caractères
    "string.min": "Le réalisateur doit comporter au moins 3 caractères", // Vérifie que la chaîne a une longueur minimale de 3 caractères
    "string.max": "Le réalisateur doit comporter au maximum 50 caractères", // Vérifie que la chaîne a une longueur maximale de 50 caractères
    "any.required": "Le réalisateur est requis", // Vérifie que la propriété est obligatoire
  }),

  // Définition propriété description
  // Joi.string() : vérifie que la valeur est une châine de caractères
  // .required(): propriété obligatoire
  description: Joi.string().required().messages({
    "string.base": "La description doit être une chaîne de caractères", // Vérifie que la valeur est une chaîne de caractères
    "any.required": "La description est requise", // Vérifie que la propriété est obligatoire
  }),

  // Définition propriété catchphrase
  // Joi.string() : vérifie que la valeur est une châine de caractères
  // .required(): propriété obligatoire
  // .messages ({...}) : définit un message d'erreurs personnalisés
  catchphrase: Joi.string().required().messages({
    "string.base": "L'anecdote doit être une chaîne de caractères", // Vérifie que la valeur est une chaîne de caractères
    "any.required": "L'anecdote est requise", // Vérifie que la propriété est obligatoire
  }),

  // Définition propriété motion-format-id
  // Joi.nomber(): vérifie que la valeur est un nombre
  // .integer(): vérifie que le nombre est un entier
  // .positive(): vérifie que le nombre est positif
  // .required(): propriété obligatoire
  // .messages ({...}) : définit un message d'erreurs personnalisés
  motion_format_id: Joi.number().integer().positive().required().messages({
    "number.base": "motion_format_id doit être un nombre.",
    "any.required": "motion_format_id est requis.",
  }),

  // Définition propriété motion_genres
  // Joi.array() : vérifie que la valeur est un tableau
  // .items() : vérifie que chaque élément du tableau est un objet
  // Joi.object() : vérifie que chaque élément du tableau est un objet
  // Joi.number() : vérifie que la valeur est un nombre
  // .integer() : vérifie que le nombre est un entier
  // .positive() : vérifie que le nombre est positif
  // .required() : propriété obligatoire
  // .messages({...}) : définit un message d'erreurs personnalisés
  motion_genres: Joi.array()
    .items(
      Joi.object({
        motion_genre_id: Joi.number().integer().positive().required(),
      })
    )
    .required()
    .messages({
      "array.base": "motion_genres doit être un tableau.", // Vérifie que la valeur est un tableau
      "any.required": "motion_genres est requis.", // Vérifie que la propriété est obligatoire
    }),

  // Définition propriété picture
  // Joi.any() : vérifie que la valeur est de n'importe quel type
  // .optionnal() : propriété optionnelle

  picture: Joi.any().required().messages({
    "any.required": "Veuillez proposer une image pour l'oeuvre", // Vérifie que la propriété est obligatoire
  }),
});
