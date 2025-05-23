//Composants et dépendances
import React, { useEffect, useState } from "react";

import jwtDecode from "jwt-decode";
//CSS
import "./profilepage.css";
//toast
import toast from "../../../utils/toast.js";
//localStorage
import { getAuthToken } from "../../../store/authToken.js";
//API
import { deleteMe, modifyUser, verifyUser } from "../../../api/index.js";
import { useUserStore } from "../../../store/store.js";
import { useNavigate } from "react-router-dom";
import { useErrorHandler } from "../../../api/apiErrorHandler.js";
//React Icons
import { FaEye, FaEyeSlash } from "react-icons/fa";

/** ----------------------------------------------------------------------------------------------
 *  @description Page de profil utilisateur, permettant de visualiser et modifier ses informations personnelles.
 * Nécessite une authentification via token JWT.
 *  Les modifications incluent le pseudo, l'email, et le mot de passe.
 /* ---------------------------------------------------------------------------------------------- */

const ProfilePage = () => {
  // ----------------- HOOK D'ERREUR-----------------
  /**
   * @hook
   * hook pour la gestion d'erreur
   */
  const handleError = useErrorHandler(); // Hook de gestion d'erreurs
  // ----------------- RÉCUPÉRATION DU TOKEN ET DÉCODAGE-----------------

  /** @const token - On récupère le Token JWT d’authentification stocké localement */
  const token = getAuthToken();

  /** @const decoded - Données décodées du token JWT (ex: pseudo, email, userId) */
  const decoded = jwtDecode(token);

  // ----------------- METTRE À JOUR L'ÉTAT GLOBAL USER APRÈS CHAQUE MODIFICATIONS-----------------

  /**
   * @const  user - Données utilisateur stockées dans le store Zustand.
   * @const  login - Fonction du store permettant de stocker et décoder un token utilisateur.
   */
  const { user, login, logout } = useUserStore();
  const navigate = useNavigate();

  // SYNCHRONISATION DU PROFIL LOCAL AVEC LE STORE

  /**
   * @function useEffect
   * @description Lorsque `user` est mis à jour dans le store, on synchronise les valeurs locales du profil (pseudo et email).
   */
  useEffect(() => {
    if (user) {
      setPseudo(user.pseudo); // Mise à jour locale du pseudo
      setEmail(user.email); // Mise à jour locale de l'e-mail
    }
  }, [user]);

  // ----------------- ETATS----------------odi

  /** @state  Gère l'affichage du formulaire de modification */
  const [isEditing, setIsEditing] = useState(false);

  /** @state Indique si le mot de passe a été confirmé pour modifier les données */
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  //state pour dire que le password a été validé ou pas

  /** @state Champs utilisateur */
  const [pseudo, setPseudo] = useState(decoded.pseudo || "");
  const [email, setEmail] = useState(decoded.email || "");
  const [currentPassword, setCurrentPassword] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // États pour afficher ou masquer les mots de passe

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ------------------ VISIBILITÉ DU MOT DE PASSE ------------------

  /**
   * @function togglePasswordVisibility
   * Fonction pour inverser la visisbilité du Password
   */
  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  /**
   * @function toggleConfirmPasswordVisibility
   * Fonction pour inverser la visisbilité du confirmPassword
   */
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prevState) => !prevState);
  };

  // ----------------- VÉRIFICATION DU PASSWORD-----------------
  /**
   * @function handleVerifyPassword
   * @description Vérifie que le champ mot de passe n’est pas vide pour autoriser la modification
   */
  const handleVerifyPassword = async (e) => {
    e.preventDefault();
    // Si le mot de passe est vide ou rempli d'espace on affiche un message d'erreur
    if (!currentPassword.trim()) {
      toast.error("Veuillez entrer votre mot de passe.");
      return;
    }
    try {
      //Appel API de la fonction verifyUser en lui passant le mot de passe et le token
      //Renvoie au Backend pour valider que l'utilisateur est bien connecté et autorisé à modifier ses infos
      await verifyUser(currentPassword);
      // on passe SetIsPasswordVerified à true ça permet de débloquer le formulaire d'édition dans le composant.
      setIsPasswordVerified(true);
    } catch (error) {
      handleError(error); // Gérer l'erreur avec le hook
      toast.error(error.message);
    }
    setCurrentPassword("");
  };
  // ----------------- SOUMISSION DU FORMULAIRE-----------------
  /**
   * @function handleSaveChanges
   * @description Envoie les nouvelles informations utilisateur à l’API
   * @async
   */
  const handleSaveChanges = async (e) => {
    e.preventDefault();
    try {
      if (newPassword !== confirmPassword) {
        toast.error("Les mots de passe ne correspondent pas.");
        return;
      }
      //Appel à l'api Patch
      const modifiedUser = await modifyUser(decoded.userId, pseudo, email, newPassword);

      // Mise à jour du store avec les nouvelles données
      login(modifiedUser.token);

      // Message de succès
      toast.success("Profil mis à jour avec succès !");

      //Réinitialise les champs du formulaire
      setNewPassword("");
      setConfirmPassword("");
      setCurrentPassword("");
      setIsEditing(false);
      setIsPasswordVerified(false);
    } catch (error) {
      handleError(error); // Gérer l'erreur avec le hook
      toast.error(error.message || "Erreur lors de la mise à jour du profil.");
    }
  };

  // ----------------- SUPPRESSION DU USER -----------------

  /**
   * @function handleDeleteAccount
   * @description supprime l'account de l'user définitivement
   * @async
   */
  const handleDeleteAccount = async (e) => {
    e.preventDefault();

    toast.confirmAction({
      title: "Suppression du compte",
      message: "Etes vous sur de vouloir supprimer votre compte ?",
      onConfirm: async () => {
        try {
          const removedMe = await deleteMe(user.id);
          if (removedMe === null) {
            return toast.error("Une erreur est survenue lors de la suppression de votre compte");
          }
          toast.success("Votre compte a bien été supprimé");
          logout();
          navigate("/");
        } catch (error) {
          handleError(error); // Gérer l'erreur avec le hook
          toast.error(error || "Erreur lors de la suppression du compte.");
        }
      },
      onCancel: () => {
        toast.info("Suppression annulée");
      },
    });
  };

  // ----------------- RENDU -----------------
  return (
    <section className="section__my-profile" data-aos="fade-in">
      {/* Balises qui seront intégrées dans le head */}
      <title>{`${pseudo} | Ciné Délices`}</title>
      <meta name="description" content="Page de profil" />

      <div className="profile">
        <div className="profile-header">
          <h2 className="section-title profile-title">Mon Profil</h2>
          <img src="/images/serveuse.webp" alt="serveuse" className="profile-img" />
        </div>
        {!isEditing && (
          <div className="profile-overview">
            <p className="pseudo-profile">
              <strong>Pseudo :</strong> {pseudo}
            </p>
            <p className="email-profile">
              <strong>Email :</strong> {email}
            </p>
            <button className="btn" onClick={() => setIsEditing(true)}>
              Modifier mes informations
            </button>
          </div>
        )}

        {isEditing && !isPasswordVerified && (
          <form className="password-verification" onSubmit={handleVerifyPassword}>
            <label htmlFor="password-validation">Pour modifier vos informations, veuillez confirmer votre mot de passe :</label>
            <input name="password-validation" type="password" placeholder="Mot de passe actuel" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />

            <div className="profile-actions">
              <button className="btn" type="submit">
                Valider
              </button>
              <button type="button" className="btn" onClick={() => setIsEditing(false)}>
                Annuler
              </button>
            </div>
          </form>
        )}

        {isEditing && isPasswordVerified && (
          <form className="profile-form" onSubmit={handleSaveChanges}>
            <div className="pseudo-field">
              <label htmlFor="pseudo">Pseudo :</label>
              <input className="pseudo-input" type="text" name="pseudo" value={pseudo} onChange={(e) => setPseudo(e.target.value)} />
            </div>

            <div className="email-field">
              <label htmlFor="email">Email :</label>
              <input className="email-input" type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="password-field">
              <label htmlFor="password">Nouveau mot de passe</label>
              <div className="control">
                <input className="password-input" type={showPassword ? "text" : "password"} id="password" name="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Nouveau mot de passe" />
                <span className="eye-icon" onClick={togglePasswordVisibility}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <div className="confirm-password-field">
              <label className="label" htmlFor="confirmPassword">
                Confirmer le mot de passe :
              </label>
              <div className="control">
                <input
                  className="confirm-password-inpu"
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirmez votre mot de passe"
                />
                <span className="eye-icon" onClick={toggleConfirmPasswordVisibility}>
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <div className="profile-actions">
              <button className="btn" type="submit">
                Enregistrer
              </button>
              <button
                className="btn"
                onClick={() => {
                  setIsEditing(false);
                  setIsPasswordVerified(false);
                }}
              >
                Annuler
              </button>
              <button className="btn" onClick={handleDeleteAccount}>
                Supprimer mon compte{" "}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};

export default ProfilePage;
