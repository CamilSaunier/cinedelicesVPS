import React, { useState } from "react";
import toast from "../../../../utils/toast.js";
import { deleteOneIngredient } from "../../../../api/adminApi.js";
import { useErrorHandler } from "../../../../api/apiErrorHandler.js";

const DeleteIngredients = ({ ingredientList, setIngredientList }) => {
  // ----------------- HOOK D'ERREUR-----------------
  /**
   * @hook
   * hook pour la gestion d'erreur
   */
  const handleError = useErrorHandler();
  const [ingredientId, setIngredientId] = useState("");
  // ----------------- Formulaire de suppression d'ingrédients-----------------

  const handleDeleteIngredient = (e) => {
    // Hook de gestion d'erreurs
    e.preventDefault();

    // Vérifie si l'utilisateur a sélectionné un ingrédient
    if (!ingredientId) {
      return toast.error("Veuillez sélectionner un ingrédient à supprimer.");
    }

    // Appelle le toast de confirmation avec les bonnes options
    toast.confirmAction({
      title: "Suppression de l'ingrédient",
      message: "Êtes-vous sûr de vouloir supprimer cet ingrédient ?",
      // Fonction appelée en cas de confirmation
      onConfirm: async () => {
        try {
          const deleted = await deleteOneIngredient(ingredientId);

          // Vérifie si la suppression a réussi
          if (!deleted) {
            return toast.error("Une erreur est survenue lors de la suppression de l'ingrédient.");
          }

          // Mise à jour de la liste d'ingrédients (on retire celui qui vient d'être supprimé)
          setIngredientList((prevList) => prevList.filter((ingredient) => ingredient.id !== parseInt(ingredientId)));

          // Réinitialise la sélection
          setIngredientId("");

          // Affiche un message de succès
          toast.success("Ingrédient supprimé avec succès !");
        } catch (error) {
          handleError(error);
          // Gestion des erreurs
          // Gestion des erreurs avec affichage toast
          if (error.details && Array.isArray(error.details)) {
            // Si tu as un tableau de messages dans error.details, affiche-les tous
            error.details.forEach((msg) => toast.error(msg));
          } else {
            toast.error("Une erreur est survenue");
          }
        }
      },
      onCancel: () => {
        toast.info("Suppression annulée");
      },
    });
  };
  return (
    <>
      {/*Formulaire pour SUPPRIMER un ingrédient */}

      <div className="form__container" data-aos="fade-up">
        <h2 className="section-title form-title">Supprimer un ingrédient</h2>

        <form onSubmit={handleDeleteIngredient}>
          <div className="form-group">
            <label htmlFor="ingredient_id">Liste d'ingrédients</label>
            <select id="ingredient_id" name="ingredient_id" value={ingredientId} onChange={(e) => setIngredientId(e.target.value)} required>
              <option value="">Choisis l'ingrédient à supprimer dans la liste</option>
              {/*Map pour afficher le menu déroulant */}
              {ingredientList.map((ingredient) => (
                <option key={ingredient.id} value={ingredient.id}>
                  {ingredient.name}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn">
            Supprimer l'ingrédient
          </button>
        </form>
      </div>
    </>
  );
};

export default DeleteIngredients;
