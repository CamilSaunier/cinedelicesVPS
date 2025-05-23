//Dépendances
import { useState } from "react";
import { useNavigate } from "react-router-dom";
//CSS
import "../authentification.css";
//React-icon
import { FaEye, FaEyeSlash } from "react-icons/fa";
//Api
import { createUser } from "../../../api/index.js";
//Store
import { useUserStore } from "../../../store/store.js";
//Toast
import toast from "../../../utils/toast.js";
import { useErrorHandler } from "../../../api/apiErrorHandler.js";

/** /* ---------------------------------------------------------------------------------------------- 
 * @description Page d’inscription pour permettre à un nouvel utilisateur de créer un compte.
 * Gère l’état des champs du formulaire, soumet les données à l’API, affiche un message de succès,
 * et redirige vers la page de connexion.
  /* ---------------------------------------------------------------------------------------------- */

const Register = () => {
  // ------------------ ÉTATS DU FORMULAIRE ------------------
  /**@state On state les données du formulaire pour les adapter en fonction de ce que l'utilisateur entre*/
  const [pseudo, setPseudo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // États pour afficher ou masquer les mots de passe
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ------------------ STORE & NAVIGATION ------------------
  //on utilise la propriété user et la fonction login de notre store zustand pour prévenir que ça y'est l'utilisateur est connecté
  //l'utilisateur est automatiquement conecté après avoir crée son compte ? our edirigé ver sla page de connexion ?
  const { user } = useUserStore();
  const navigate = useNavigate();
  const handleError = useErrorHandler(); // Hook de gestion d'erreurs
  // ------------------ REDIRECTION ------------------

  // on évite que l'utilisateur déjà connecté, puisse passer par là
  if (user) return navigate("/");

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

  // ------------------ SOUMISSION DU FORMULAIRE ------------------

  /**
   * @function handleSubmit - Fonction exécutée à la soumission du formulaire
   * Appelle l'API d'inscription puis redirige vers la page login.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Vérification si les mots de passe sont identiques
    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas.");
      return;
    }
    //appel à l'api de création de user avec les données du req.body
    try {
      await createUser(pseudo, email, password);

      // si succès -> on redirige vers la page d'acceil + On fait jouer la fonction login qui va stocker le state du user avec le nom et l'email pour qu'on puisse les réutiliser dans la page d'accueil
      toast.success("Votre compte a bien été crée. Vous pouvez à présent vous authentifier");
      return navigate("/login");

      //rediriger vers l'accueil
    } catch (error) {
      handleError(error); // Gérer l'erreur avec le hook
      toast.error(error.message);
    }
  };

  // ------------------ RENDU------------------

  return (
    <section className="section">
      {/* Balises qui seront intégrées dans le head */}
      <title>S'inscrire | Ciné Délices</title>
      <meta name="description" content="Page d'inscription" />

      <div className="container">
        <h2 className="section-title has-text-centered">Inscription</h2>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="field">
            <label className="label" htmlFor="pseudo">
              Pseudo :
            </label>
            <div className="control">
              <input type="text" id="pseudo" name="pseudo" value={pseudo} onChange={(e) => setPseudo(e.target.value)} required placeholder="Créez votre pseudo" />
            </div>
          </div>

          <div className="field">
            <label className="label" htmlFor="email">
              Email :
            </label>
            <div className="control">
              <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Créez votre email" />
            </div>
          </div>

          <div className="field">
            <label className="label" htmlFor="password">
              Mot de passe :
            </label>
            <div className="control">
              <input type={showPassword ? "text" : "password"} id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Créez votre mot de passe" />
              <span className="eye-icon" onClick={togglePasswordVisibility}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <div className="field">
            <label className="label" htmlFor="confirmPassword">
              Confirmer le mot de passe :
            </label>
            <div className="control">
              <input type={showConfirmPassword ? "text" : "password"} id="confirmPassword" name="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required placeholder="Confirmez votre mot de passe" />
              <span className="eye-icon" onClick={toggleConfirmPasswordVisibility}>
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <div className="field">
            <div className="control">
              <button className="btn" type="submit">
                Valider mon inscription
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Register;
