import React, { useState } from "react";
import toast from "../../../../utils/toast.js";
import { deleteOneRecipe } from "../../../../api/adminApi.js";
import { useErrorHandler } from "../../../../api/apiErrorHandler.js";

const DeleteRecipe = ({ recipes, setRecipes }) => {
  /**
   * @hook
   * hook pour la gestion d'erreur
   */
  const handleError = useErrorHandler(); // Hook de gestion d'erreurs
  const [recipeId, setRecipeId] = useState("");
  // ----------------- Formulaire de suppression de recette ----------------
  //fonction qui gère l'envoi du formulaire de suppression de recette

  const handleDeleteRecipe = (e) => {
    e.preventDefault();

    // Vérifie si une recette a bien été sélectionnée
    if (!recipeId) {
      return toast.error("Veuillez sélectionner une recette à supprimer.");
    }

    // Affiche une boîte de dialogue de confirmation avant suppression
    toast.confirmAction({
      title: "Suppression de la recette",
      message: "Êtes-vous sûr de vouloir supprimer cette recette ?",

      // Fonction appelée si l'utilisateur confirme la suppression
      onConfirm: async () => {
        try {
          // Appel de la fonction deleteOneRecipe avec l'ID de la recette à supprimer
          await deleteOneRecipe(recipeId);

          // Met à jour la liste des recettes en excluant celle qui a été supprimée
          setRecipes((prevList) => {
            const updatedList = prevList.filter((recipe) => recipe.id !== parseInt(recipeId));

            return updatedList;
          });

          // Réinitialise la sélection
          setRecipeId("");

          // Affiche un message de succèsp
          toast.success("Recette supprimée avec succès !");
        } catch (error) {
          handleError(error);

          // Gestion des erreurs côté client
          if (error.message) {
            try {
              // Tente de parser les détails de l'erreur (ex: erreurs Joi)
              const errorDetails = JSON.parse(error.message);
              errorDetails.forEach((msg) => {
                // Affiche chaque message d'erreur dans un toast
                toast.error(msg);
              });
            } catch {
              // Si l'erreur ne peut pas être parsée, affiche un message générique
              toast.error("Une erreur est survenue");
            }
          } else {
            // Si l'erreur est inconnue, affiche un message par défaut
            toast.error(error.message || "Une erreur est survenue");
          }
        }
      },

      // Fonction appelée si l'utilisateur annule la suppression
      onCancel: () => {
        toast.info("Suppression annulée");
      },
    });
  };

  return (
    <>
      <div className="form__container" data-aos="fade-up">
        <h2 className="section-title form-title">Supprimer une recette</h2>

        <form onSubmit={handleDeleteRecipe}>
          <div className="form-group">
            <label htmlFor="recipe_id">Liste de recettes</label>
            <select id="recipe_id" name="recipe_id" value={recipeId} onChange={(e) => setRecipeId(e.target.value)} required>
              <option value="">Choisis la recette à supprimer dans la liste</option>
              {/*Map pour afficher le menu déroulant */}
              {recipes.map((recipe) => (
                <option key={recipe.id} value={recipe.id}>
                  {recipe.title}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn">
            Supprimer une recette
          </button>
        </form>
      </div>
    </>
  );
};

export default DeleteRecipe;
