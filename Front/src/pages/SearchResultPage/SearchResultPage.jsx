import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import RecipeCard from "../../component/RecipeCard/RecipeCard.jsx";
import "./SearchResultPage.css";
const SearchResultPage = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  //Fais appel à la fonction useLocation, elle dit qu'elle veux récupérer seulement le state
  const { state } = useLocation();
  //et dans ce state, elle a besoin de récupérer le tableau filteredRecipes.
  //Si state n'est pas là, filteredRecipes est vide
  // Ce composant est donc dépendant du state de useLocation pour fonctionner
  const { filteredRecipes, motion, category } = state || {};

  return (
    <>
      {/* Gestion des recettes */}
      {!filteredRecipes || filteredRecipes.length === 0 ? (
        <div className="no-recipes-found-container">
          <img src="/images/not-found.webp" alt="une serveuse désolé de ne pas pouvoir répondre à une demande" className="no-recipes-found-img" />
          <p className="no-recipes-found-text">Désolé, il n'y a pas encore de recettes correspondant à votre recherche.</p>
          <button className="no-recipes-found-btn btn" onClick={() => navigate("/recipes/create")}>
            Proposez la vôtre !
          </button>
          <button className="button-return-catalog btn" onClick={() => navigate(-1)}>
            Retourner à la page précédente
          </button>
        </div>
      ) : (
        <section className="section__result">
          {/* Si motion est présent et est un objet (pas un tableau) */}

          {motion && typeof motion === "object" && !Array.isArray(motion) && (
            <section className="section__result-motion" data-aos="fade-up">
              <img src={`${API_URL}/${motion.picture}`} className="motion__picture" alt={`affiche de ${motion.title}`} />
              <h2 className="motion__title section-title">{motion.title}</h2>
              <p className="motion__date">
                <strong>Sorti le :</strong> {motion.release_date}
              </p>
              <p className="motion__director">
                <strong>Réalisateur:</strong> {motion.director}
              </p>
              <p className="motion__description card">{motion.description}</p>
              <blockquote className="motion__catchphrase card">
                <em>"{motion.catchphrase}"</em>
              </blockquote>
            </section>
          )}
          <section className="section__result-recipes" data-aos="fade-up">
            <h2 className="section-title result-title">{category ? category : "Recettes Associées"}</h2>

            <div className="recipe__container result-container">
              {filteredRecipes.map((recipe, index) => (
                <RecipeCard recipe={recipe} key={index} />
              ))}
            </div>
            <button className="button-return-catalog btn" onClick={() => navigate(-1)}>
              Retourner à la page précédente
            </button>
          </section>
        </section>
      )}
    </>
  );
};

export default SearchResultPage;
