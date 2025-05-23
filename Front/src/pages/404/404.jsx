import React from "react";
import { Link } from "react-router-dom";

/**
 * 
 * @returns Page d'erreur 404
 * @description Affiche une image d'erreur 404 et un bouton pour retourner à l'accueil
 */

const NotFoundPage = () => {
  return (
    <>
    {/* Balises qui seront intégrées dans le head */}
    <title>404| Ciné Délices</title>
    <meta name="description" content="Page d'erreur 404" />

    <div className="error-page">
      <img src="/images/404.webp" alt="404 image" className="error-image" />
      <Link to="/" className="home-link">
        <button className="btn btn-error-page ">Retour à l'accueil</button>
      </Link>
    </div>
    </>
  );
};

export default NotFoundPage;
