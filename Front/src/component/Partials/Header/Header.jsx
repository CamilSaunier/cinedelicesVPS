//Dépendances
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
//Store
import { useUserStore } from "../../../store/store.js";
import { getRecipeBySearch } from "../../../api/index.js";
//CSS
import "./header.css";
import { logoutUser } from "../../../api/userApi.js";
//React-icons
import { FaUserTie } from "react-icons/fa";
import { FaPowerOff } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";
import { useErrorHandler } from "../../../api/apiErrorHandler.js";

/**
 * Composant Header du site.
 * Contient la navbar
 * Ce composant s'affiche en haut de la  page sur toutes les pages.
 * @component
 * @returns Header de page contenant une navbar avec logo, navigation, bouton de connexion/inscription ou informations du user
 */

const Header = () => {
  // ----------------- HOOK D'ERREUR-----------------
  /**
   * @hook
   * hook pour la gestion d'erreur
   */
  const handleError = useErrorHandler(); // Hook de gestion d'erreurs
  // ----------------- GESTION DU MENU BURGER-----------------
  /**
   * État local qui gère l’ouverture/fermeture du menu burger.
   * false par défaut (menu fermé)
   * @state
   */
  const [menuOpen, setMenuOpen] = useState(false);

  /**
   * @function toggleMenu
   * @description Gère l’ouverture et la fermeture du menu burger.
   * Inverse l’état actuel de `menuOpen` à chaque clic sur l’icône du menu.
   */
  const toggleMenu = () => {
    setMenuOpen((menuState) => !menuState);
    // Au click ==> tu prend l'état actuel du menu ( ouvert(true) ou fermé(false) et tu inverses cet état)
  };

  /**
   * @function closeMenu
   * @description ferme le burger menu quand on clique sur un lien
   */
  const closeMenu = () => {
    setMenuOpen(false);
  };

  // ----------------- RÉCUPÉRATION DU STORE USER-----------------
  /**
   * Récupération des données utilisateur et de la méthode logout par destructuration depuis le store global
   * @const user : contient les infos de l'utilisateur connecté
   * @const logout : fonction pour déconnecter l'utilisateur
   */
  const { user, logout } = useUserStore();

  /**  Hook de React Router pour rediriger l'utilisateur vers une autre page*/
  const navigate = useNavigate();

  // ----------------- GESTION DU BOUTON DE DECONNEXION-----------------
  /**
   * @function handleLogout
   * @description Fonction déclenchée lors de la déconnexion de l’utilisateur.
   * - Appelle la fonction `logout()` du store global pour supprimer l'utilisateur et le token.
   * - Redirige l'utilisateur vers la page d’accueil à l’aide de `navigate("/")`.
   */
  const handleLogout = async () => {
    // Fait jouer la fonction logout du store
    try {
      await logoutUser();
      logout();
    } catch (error) {
      handleError(error);
    }
    navigate("/");
  };

  // ----------------- GESTION DE LA BARRE DE RECHERCHE-----------------

  const [search, setSearch] = useState("");
  // console.log(search);
  /**
   * @function handleSearch
   * @description Fonction déclenchée lorsque l'utilisateur soumet une recherche
   */
  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const foundRecipes = await getRecipeBySearch(search);
      // Si foundRecipes est falsy (ex: null), on envoie un tableau vide
      navigate("/search-results", { state: { filteredRecipes: foundRecipes || [] } });
    } catch (error) {
      handleError(error);
      // En cas d'erreur (ex: API down), on navigue quand même avec un tableau vide
      navigate("/search-results", { state: { filteredRecipes: [] } });
    }
    setSearch("");
  };

  // ----------------- RENDU-----------------
  return (
    <header>
      <nav className="navbar__container">
        <div className="navbar__items">
          <Link className="nav-link" to="/">
            <div className="header__branding">
              <img src="/images/logo.webp" alt="Logo de Ciné Délices" className="header__branding-logo" />
              <h1 className="header__branding-title">Ciné Délices</h1>
            </div>
          </Link>
          <div className="search-bar field">
            <form className="search_bar-form" onSubmit={handleSearch}>
              <input className="input" value={search} type="text" placeholder="Rechercher une recette" onChange={(e) => setSearch(e.target.value)} />
              <button aria-label="Rechercher" type="submit">
                <IoIosArrowForward className="navbar-submit-icon" />
              </button>
            </form>
          </div>

          {!menuOpen && (
            //Si le menu est false(fermé), l'icône du menu burger est affichée
            <GiHamburgerMenu className="burger_menu-icon " onClick={toggleMenu} style={{ cursor: "pointer" }} />
          )}
          {menuOpen && (
            //Si le menu est true(ouvert), l'icône de fermeture est affichée
            <IoMdClose className="burger_menu-close " onClick={toggleMenu} style={{ cursor: "pointer" }} />
          )}
        </div>

        <div className={`menu ${menuOpen ? "menu__open" : ""}`}>
          {/* Si le menu est true(ouvert) alors tu lui met la class "menu__open", sinon tu ne met rien */}

          <ul>
            <Link className="nav-link" to="/" onClick={closeMenu}>
              Accueil
            </Link>

            <Link className="nav-link" to="/carnet" onClick={closeMenu}>
              Nos recettes
            </Link>

            {!user ? (
              <>
                <li>
                  <Link className="nav-link" id="login" to="/login" onClick={closeMenu}>
                    Connexion
                  </Link>
                </li>
                <li>
                  <Link className="nav-link" id="register" to="/register" onClick={closeMenu}>
                    Inscription
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link className="nav-link" to="/recipes/create" id="contact" onClick={closeMenu}>
                    Créer une recette
                  </Link>
                </li>
                {/* Lien vers la page d'administration visible uniquement pour les admins */}
                {user.role === "admin" && (
                  <li>
                    <Link className="nav-link" to="/user/admin" onClick={closeMenu}>
                      Administration
                    </Link>
                  </li>
                )}
                <li className="username">
                  <Link to="/user/me" onClick={closeMenu}>
                    <FaUserTie />
                    {user.pseudo}
                  </Link>
                </li>
                <li>
                  <button aria-label="Déconnexion" className="logout" onClick={handleLogout}>
                    <FaPowerOff onClick={closeMenu} />
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
