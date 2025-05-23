//Dépendances te composants
import { useState } from "react";
import { useNavigate } from "react-router-dom";
//CSS
import "../authentification.css";
//React-icon
import { FaEye, FaEyeSlash } from "react-icons/fa";
//API
import { loginUser } from "../../../api/index.js";
//store
import { useUserStore } from "../../../store/store.js";
//toast
import toast from "../../../utils/toast.js";
import { forgotPassword } from "../../../api/userApi.js";
import { useErrorHandler } from "../../../api/apiErrorHandler.js";
import ResetPasswordModal from "./components/ForgotPasswordModal.jsx";

/** /* ---------------------------------------------------------------------------------------------- 
 * @description Page de connexion utilisateur. Permet à un utilisateur existant de se connecter
 * en utilisant son email et mot de passe. Gère la validation, l’appel API et la redirection.
  /* ---------------------------------------------------------------------------------------------- */

const Login = () => {
  // ----------------- HOOK D'ERREUR-----------------
  /**
   * @hook
   * hook pour la gestion d'erreur
   */
  const handleError = useErrorHandler(); // Hook de gestion d'erreurs
  // ----------------- ÉTATS DU FORMULAIRE, STORE UTILISATEUR ET NAVIGATE -----------------

  /**
   * @state
   * États pour chaque champs du formulaire
   * vide au début
   */

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /**
   * @state
   * État showResetForm pour afficher le formulaire de demande de reset mot de passe
   * Etat resetEmail pour capter l'email entrée par l'utilisateur
   */
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  /**
   * @state
   * État showPassword pour afficher le mot de passe
   */
  const [showPassword, setShowPassword] = useState(false);

  /**
   * On destructure le store et on récupère que ce dont on a besoin depuis le store : la fonction login
   * @const logout : fonction pour déconnecter l'utilisateur
   */

  const { login } = useUserStore();

  /**  Hook de React Router pour rediriger l'utilisateur vers une autre page*/
  const navigate = useNavigate();

  // ------------------ VISIBILITÉ DU MOT DE PASSE ------------------
  /**
   * @function togglePasswordVisibility
   * Fonction pour inverser la visisbilité du Password
   */
  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };
  // ----------------- SOUMISSION DU FORMULAIRE -----------------
  /**
   * @function handleSubmit - Fonction exécutée à la soumission du formulaire
   * Appelle l'API de login, met à jour le store utilisateur, affiche un toast, puis redirige vers la page d’accueil.
   */
  // Fonction soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Appel API de login
      const userLog = await loginUser(email, password);

      // Mettre à jour le store avec le token de l'utilisateur
      login(userLog.token);

      // Afficher un toast de succès (à gérer ailleurs)
      toast.success("Vous êtes maintenant connecté");

      // Redirection vers la page d'accueil
      return navigate("/");
    } catch (error) {
      handleError(error); // Gérer l'erreur avec le hook

      // Si l'erreur contient un message valide, on affiche le toast d'erreur
      if (error.message) {
        toast.error(error.message); // Afficher un toast avec le message de l'erreur
      }
    }
  };

  /**
   * @function handleResetPassword - Fonction pour envoyer la requête API de reset password
   */

  const handleResetPassword = async (e) => {
    e.preventDefault();

    setShowResetForm(false);
    try {
      toast.success("Si cet adresse existe, un e-mail vous a été envoyé.");
      await forgotPassword(resetEmail);
    } catch (error) {
      handleError(error);
    }
    setEmail("");
  };

  return (
    <section className="section">
      {/* Balises qui seront intégrées dans le head */}
      <title>Connexion | Ciné Délices</title>
      <meta name="description" content="Page de connection" />

      <div className="container">
        <h2 className="section-title has-text-centered">Connexion</h2>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="field">
            <label className="label" htmlFor="email">
              Email :
            </label>
            <div className="control">
              <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Entrez votre email" />
            </div>
          </div>

          <div className="field">
            <label className="label" htmlFor="password">
              Mot de passe :
            </label>
            <div className="control">
              <input type={showPassword ? "text" : "password"} id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Entrez votre mot de passe" />
              <span className="eye-icon" onClick={togglePasswordVisibility}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <div className="field ">
            <div className="button__container">
              <button className="connexion-btn btn" type="submit">
                Se connecter
              </button>
              {/**Bouton pour afficher le formulaire de demande de reset mot de passe */}

              <button type="button" className="forgot-password-btn btn" onClick={() => setShowResetForm(!showResetForm)}>
                Mot de passe oublié ?
              </button>
            </div>
          </div>
        </form>
        {/**Formulaire pour rentrer son e-mail si mot de passe oublié, ne s'affiche que si on clique sur le bouton "mot de passe oublié" */}
        {showResetForm && <ResetPasswordModal onClose={() => setShowResetForm(false)} resetEmail={resetEmail} setResetEmail={setResetEmail} handleResetPassword={handleResetPassword} />}
      </div>
    </section>
  );
};

export default Login;
