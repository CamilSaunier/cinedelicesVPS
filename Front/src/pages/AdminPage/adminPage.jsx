// Import des hooks React nécessaires
import React, { useState, useEffect } from "react";

// Import d'une fonction API pour récupérer les œuvres
import { getAllMotions } from "../../api/index.js";

// CSS de la page admin
import "./admin_page.css";
//React-icon
import { TbHandFingerLeft } from "react-icons/tb";
import { FaUserNinja } from "react-icons/fa6";

// Import du composant de navigation latérale
import Navbar from "./Navbar/Navbar.jsx";

//import de la librairie React Charts
import { BarChart, Bar } from "recharts";

// Import des composants enfants pour la gestion de chaque entité
import HandleIngredientsPage from "./HandleIngredients/HandleIngredientsPage.jsx";
import HandleUserPage from "./HandleUsers/HandleUserPage.jsx";
import HandleMotionsPage from "./HandleMotions/HandleMotionsPage.jsx";
import HandleRecipePage from "./HandleRecipes/HandleRecipePage.jsx";
import { useErrorHandler } from "../../api/apiErrorHandler.js";

// Définition du composant principal AdminPage
// Il reçoit en props les recettes et leur setter
const AdminPage = ({ recipes, setRecipes }) => {
  // ----------------- HOOK D'ERREUR-----------------
  /**
   * @hook
   * hook pour la gestion d'erreur
   */
  const handleError = useErrorHandler(); // Hook de gestion d'erreurs
  // ----------------- ÉTAT POUR STOCKER LES DONNÉES DE LA BDD -----------------

  /**
   * State pour stocker la liste des œuvres (motions). Car j'en ai beosin dans 2 components
   */
  const [motionsList, setMotionsList] = useState([]);

  // ----------------- CHARGEMENT DES DONNÉES AU MONTAGE DU COMPOSANT -----------------

  useEffect(() => {
    /**
     * Fonction asynchrone pour charger les œuvres depuis l'API
     * Appelée automatiquement à chaque changement de la prop `recipes`
     */
    const loadMotions = async () => {
      try {
        const motionsData = await getAllMotions(); // Appel API
        setMotionsList(motionsData);
      } catch (error) {
        handleError(error);
      } // Mise à jour du state avec les données récupérées
    };

    loadMotions(); // Lancement de la fonction au montage
  }, []);

  // ----------------- ÉTAT POUR GÉRER L'AFFICHAGE DES FORMULAIRES -----------------

  /**
   * State qui détermine quel formulaire est actuellement actif (affiché à l'écran)
   * Ex : "user", "ingredient", etc.
   */
  const [activeForm, setActiveForm] = useState("");

  // ----------------- RENDU DU COMPOSANT -----------------
  return (
    <>
      {/* Balises qui seront intégrées dans le head */}
      <title>Page d'administrateur | Ciné Délices</title>
      <meta name="description" content="page d'administrateur" />

      <div className="admin__page-container">
        {/* Barre de navigation latérale. setActiveForm permet de changer de formulaire */}
        <Navbar setActiveForm={setActiveForm} />

        {/* Section principale qui affiche le bon formulaire selon le state activeForm */}
        <section className="section__form section__form-admin">
          {/* Formulaire de gestion des ingrédients */}
          {activeForm === "ingredients" && <HandleIngredientsPage />}

          {/* Formulaire de gestion des utilisateurs */}
          {activeForm === "user" && <HandleUserPage />}

          {/* Formulaire de gestion des œuvres */}
          {activeForm === "motions" && <HandleMotionsPage motionsList={motionsList} setMotionsList={setMotionsList} />}

          {/* Formulaire de gestion des recettes */}
          {activeForm === "recipes" && <HandleRecipePage recipes={recipes} setRecipes={setRecipes} motionsList={motionsList} />}

          {/* Contenu d'accueil par défaut */}
          {activeForm === "" && (
            <div className="admin__welcome" data-aos="zoom-in">
              <h2 className="section-title welcome-title">Bienvenue sur le tableau de bord administrateur</h2>
              <p className="welcome-text"> Depuis cette interface, tu peux gérer dans l'ombre tel un ninja :</p>
              <FaUserNinja className="welcome-icon" />
              <ul>
                <li className="welcome-link" onClick={() => setActiveForm("user")}>
                  les utilisateurs
                </li>
                <li className="welcome-link" onClick={() => setActiveForm("recipes")}>
                  les recettes
                </li>
                <li className="welcome-link" onClick={() => setActiveForm("motions")}>
                  les œuvres
                </li>
                <li className="welcome-link" onClick={() => setActiveForm("ingredients")}>
                  et même les ingrédients !
                </li>
              </ul>
              <p>
                <TbHandFingerLeft /> Navigue grâce la barre latérale à gauche et accomplis ta destinée.
              </p>
            </div>
          )}

          {/* Bouton de retour vers la page du carnet */}
          {activeForm !== "" && (
            <button
              className="button-return-catalog btn"
              onClick={() => {
                setActiveForm("");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Retour
            </button>
          )}
        </section>
      </div>
    </>
  );
};

export default AdminPage;
