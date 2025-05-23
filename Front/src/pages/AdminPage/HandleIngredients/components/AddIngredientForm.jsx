import React, { useState } from "react";
import { createIngredient } from "../../../../api/adminApi.js";
import toast from "../../../../utils/toast.js";
import { useErrorHandler } from "../../../../api/apiErrorHandler.js";

const AddIngredientForm = ({ setIngredientList }) => {
  // ----------------- HOOK D'ERREUR-----------------
  /**
   * @hook
   * hook pour la gestion d'erreur
   */
  const handleError = useErrorHandler(); // Hook de gestion d'erreurs
  const [ingredientName, setIngredientName] = useState("");
  // ----------------- Fonction concernant l'envoi des formulaires -----------------

  //fonction qui gère l'envoi du formulaire de création d'ingrédient

  const handleCreateIngredient = async (e) => {
    e.preventDefault();

    try {
      const createdIngredient = await createIngredient({ name: ingredientName });

      //Ajout + tri alphabétique
      // [...ingredientList, createdIngredient] : on ajoute l'ingrédient créé à la liste d'ingrédients
      // .sort((a, b) => a.name.localeCompare(b.name, "fr", { sensitivity: "base" })) : on trie la liste d'ingrédients par ordre alphabétique
      setIngredientList((prevList) => [...prevList, createdIngredient].sort((a, b) => a.name.localeCompare(b.name, "fr", { sensitivity: "base" })));

      // Réinitialise le champ de formulaire
      setIngredientName("");

      toast.success("Ingrédient créé avec succès !");
    } catch (error) {
      handleError(error);
      if (error.message) {
        try {
          // Si l'erreur est une chaîne JSON contenant les messages d'erreur Joi
          const errorDetails = JSON.parse(error.message); // Convertit la chaîne JSON en tableau
          errorDetails.forEach((msg) => {
            // on récupère comme ça les messages d'erreur de Joi
            // Affiche chaque message d'erreur dans un toast
            toast.error(msg); // Affiche chaque erreur dans un toast
          });
        } catch (error) {
          toast.error("Une erreur est survenue", error.message); // Si on ne peut pas parser l'erreur, on affiche un message générique
        }
      } else {
        // Si l'erreur est générique, l'afficher en toast
        toast.error(error.message || "Une erreur est survenue");
      }
    }
  };

  // ----------------- RENDU -----------------
  return (
    <>
      <div className="form__container " data-aos="fade-up">
        <h2 className="section-title form-title">Créer un nouvel ingrédient</h2>

        <form onSubmit={handleCreateIngredient}>
          <div className="form-group">
            {" "}
            <label htmlFor="name">Nom de l'ingrédient</label>
            <input type="text" id="name" name="name" value={ingredientName} onChange={(e) => setIngredientName(e.target.value)} required placeholder="Comment s'appelle ton ingrédient ?" />
          </div>
          <button type="submit" className="btn">
            Soumettre l'ingrédient
          </button>
        </form>
      </div>
    </>
  );
};

export default AddIngredientForm;
