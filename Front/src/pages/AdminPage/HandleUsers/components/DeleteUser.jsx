import React, { useEffect, useState } from "react";
import toast from "../../../../utils/toast.js";
import { deleteOneUser, getAllUsers } from "../../../../api/adminApi.js";
import { useErrorHandler } from "../../../../api/apiErrorHandler.js";

/**
 *
 * @returns {JSX.Element} Formulaire de suppression d'un utilisateur
 */

const DeleteUser = () => {
  /**
   * @hook
   * hook pour la gestion d'erreur
   */
  const handleError = useErrorHandler(); // Hook de gestion d'erreurs
  const [usersList, setUsersList] = useState([]);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const usersData = await getAllUsers();
        setUsersList(usersData);
      } catch (error) {
        handleError(error);
      }
    };
    loadUsers();
  }),
    [];
  // ----------------- Formulaire de suppression d'user-----------------
  //fonction qui gère l'envoi du formulaire de suppression d'un utilisateur

  const handleDeleteUser = (e) => {
    e.preventDefault();

    // Vérifie si un utilisateur a bien été sélectionné
    if (!userId) {
      return toast.error("Veuillez sélectionner un utilisateur à supprimer.");
    }

    // Affiche une boîte de dialogue de confirmation avant suppression
    toast.confirmAction({
      title: "Suppression de l'utilisateur",
      message: "Êtes-vous sûr de vouloir supprimer cet utilisateur ?",

      // Fonction appelée si l'utilisateur confirme la suppression
      onConfirm: async () => {
        try {
          // Appel de la fonction deleteOneUser avec l'ID de l'utilisateur à supprimer
          await deleteOneUser(userId);

          // Met à jour la liste des utilisateurs en excluant celui qui a été supprimé
          setUsersList((prevList) => prevList.filter((user) => user.id !== parseInt(userId)));

          // Réinitialise la sélection de l'utilisateur
          setUserId("");

          // Affiche un message de succès
          toast.success("Utilisateur supprimé avec succès !");
        } catch (error) {
          handleError(error);
          // Gestion des erreurs côté client
          if (error.message) {
            try {
              // Tente de parser les détails de l'erreur en JSON (ex: erreurs Joi)
              const errorDetails = JSON.parse(error.message);
              errorDetails.forEach((msg) => {
                // Affiche chaque message d'erreur dans un toast
                toast.error(msg);
              });
            } catch {
              // Si l'erreur ne peut pas être parsée, affiche un message générique
              toast.error("Une erreur est survenue ");
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
      {/*Formulaire pour SUPPRIMER un utilisateur */}

      <div className="form__container" data-aos="fade-up">
        <h2 className="section-title form-title">Supprimer un utilisateur</h2>

        <form onSubmit={handleDeleteUser}>
          <div className="form-group">
            <label htmlFor="user_id">Liste d'utilisateurs</label>
            <select id="user_id" name="user_id" value={userId} onChange={(e) => setUserId(e.target.value)} required>
              <option value="">Choisis l'utilisateur à supprimer dans la liste</option>
              {/*Map pour afficher le menu déroulant */}
              {usersList.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.pseudo}
                  {" - " + user.email}
                </option>
              ))}
            </select>
            <button type="submit" className="btn">
              Supprimer un utilisateur
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default DeleteUser;
