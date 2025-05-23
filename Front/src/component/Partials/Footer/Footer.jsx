import React from "react";
import { Link } from "react-router-dom";
import "./footer.css";

/**
 * Composant Footer du site.
 * Ce composant s'affiche en bas de page sur toutes les pages.
 * @component
 * @returns Pied de page avec logo, navigation et copyright.
 */

const Footer = () => {
  return (
    <footer className="footer ">
      <div className="content has-text-centered">
        <img src="/images/logo.webp" alt="Logo" className="footer__logo" />
        <div className="footer__menu">
          <Link className="nav-link" to="/">
            Accueil
          </Link>

          <Link className="nav-link" to="/carnet">
            Nos recettes
          </Link>

          <Link className="nav-link" to="/legal-mention">
            Mentions Légales
          </Link>

          <Link className="nav-link" to="/login">
            Connexion
          </Link>

          <Link className="nav-link" to="/register">
            Inscription
          </Link>
        </div>
        <p className="mt-2 copyright">© 2025 Ciné Délices. Tous droits réservés.</p>
      </div>
    </footer>
  );
};

export default Footer;
