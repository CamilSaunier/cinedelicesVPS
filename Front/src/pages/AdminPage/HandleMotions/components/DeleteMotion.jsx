import React, { useState } from "react";
import toast from "../../../../utils/toast.js";
import { deleteOneMotion } from "../../../../api/adminApi.js";
import { useErrorHandler } from "../../../../api/apiErrorHandler.js";

const DeleteMotion = ({ motionsList, setMotionsList }) => {
  // ----------------- HOOK D'ERREUR-----------------
  /**
   * @hook
   * hook pour la gestion d'erreur
   */
  const handleError = useErrorHandler(); // Hook de gestion d'erreurs
  const [motionId, setMotionId] = useState("");

  // ----------------- Formulaire de suppression d'oeuvre ----------------
  //fonction qui gère l'envoi du formulaire de suppression d'oeuvre

  const handleDeleteMotion = (e) => {
    e.preventDefault();

    // Vérifie si une œuvre a bien été sélectionnée
    if (!motionId) {
      return toast.error("Veuillez sélectionner une œuvre à supprimer.");
    }

    // Affiche une boîte de dialogue de confirmation avant suppression
    toast.confirmAction({
      title: "Suppression de l'œuvre",
      message: "Êtes-vous sûr de vouloir supprimer cette œuvre ?",

      // Fonction appelée si l'utilisateur confirme la suppression
      onConfirm: async () => {
        try {
          // Appel de la fonction deleteOneMotion avec l'ID de l'œuvre à supprimer
          await deleteOneMotion(motionId);

          // Met à jour la liste des œuvres en excluant celle qui a été supprimée
          setMotionsList((prevList) => prevList.filter((motion) => motion.id !== parseInt(motionId)));

          // Réinitialise la sélection
          setMotionId("");

          // Affiche un message de succès
          toast.success("Œuvre supprimée avec succès !");
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
              toast.error("Une erreur est survenue : " + error.message);
            }
          } else {
            // Si l'erreur est inconnue, affiche un message par défaut
            toast.error(error.message || "Une erreur est survenue");
          }
        }
      },

      // Fonction appelée si l'utilisateur annule la suppression
      onCancel: () => {
        console.log("Suppression annulée");
      },
    });
  };

  return (
    <>
      <div className="form__container" data-aos="fade-up">
        <h2 className="section-title form-title">Supprimer une oeuvre</h2>

        <form onSubmit={handleDeleteMotion}>
          <div className="form-group">
            <label htmlFor="motion_id">Liste d'oeuvre</label>
            <select id="motion_id" name="motion_id" value={motionId} onChange={(e) => setMotionId(e.target.value)} required>
              <option value="">Choisis l'oeuvre à supprimer dans la liste</option>
              {/*Map pour afficher le menu déroulant */}
              {motionsList.map((motion) => (
                <option key={motion.id} value={motion.id}>
                  {motion.title}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn">
            Supprimer une oeuvre
          </button>
        </form>
      </div>
    </>
  );
};

export default DeleteMotion;
