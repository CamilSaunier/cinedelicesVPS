// Import de React et du hook useState pour gérer l'état local
import React, { useState } from "react";

// Import du fichier de styles pour la barre latérale
import "./navbar.css";

// Définition du composant Navbar, avec une prop : setActiveForm (fonction pour changer le formulaire affiché)
const Navbar = ({ setActiveForm }) => {
  // État local pour gérer l'affichage ou non de la barre latérale (ouverte ou fermée)
  const [showNav, setShowNav] = useState(false);

  /**
   * Fonction appelée lorsqu'on clique sur un lien du menu.
   * Elle active un formulaire spécifique via setActiveForm
   * et ferme la barre latérale sur mobile/tablette (fenêtre < 768px).
   */
  const handleFormSelection = (formName) => {
    // Déclenche le changement de formulaire dans le parent
    setActiveForm(formName);
    //On remonte la page
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Si l'utilisateur est sur mobile , on referme la barre
    if (window.innerWidth < 768) {
      setShowNav(false);
    }
  };

  return (
    // Ajoute la classe "open" à la barre latérale si showNav est true
    <div className={`sidenav ${showNav ? "open" : ""}`}>
      {/* Bouton pour ouvrir/fermer la barre latérale */}
      <div className="toggle-button" onClick={() => setShowNav(!showNav)}>
        {/* Flèche qui change selon l'état ouvert/fermé */}
        <span>{showNav ? "←" : "→ "}</span>
      </div>

      {/* Liste des liens de navigation */}
      <ul>
        {/* Chaque élément appelle handleFormSelection avec le nom du formulaire correspondant */}
        <li className="sidenav-link" onClick={() => handleFormSelection("")}>
          Administration
        </li>

        <li className="sidenav-link" onClick={() => handleFormSelection("recipes")}>
          Gérer les recettes
        </li>
        <li className="sidenav-link" onClick={() => handleFormSelection("user")}>
          Gérer les utilisateurs
        </li>
        <li className="sidenav-link" onClick={() => handleFormSelection("motions")}>
          Gérer les œuvres
        </li>
        <li className="sidenav-link" onClick={() => handleFormSelection("ingredients")}>
          Gérer les ingrédients
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
