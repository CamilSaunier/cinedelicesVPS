import React from "react";
import "./recipe-card.css";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;
/** ----------------------------------------------------------------------------------------------
 * Composant affichant une card avec quelques infos teasing sur la recette
 * @component
 * @param recipe - La recette à afficher
 * @returns une card d'une recette
 /* ---------------------------------------------------------------------------------------------- */
const RecipeCard = ({ recipe, motion }) => {
  return (
    <>
      <Link key={recipe.id} to={`/recipes/${recipe.id}`} className="recipe__card-link">
        <div className="recipe__card box">
          <figure className=" recipe__card-img">
            <img src={`${API_URL}/${recipe.picture}`} alt={`${recipe.title}`} />
          </figure>
          <article className="recipe__card-description">
            <h3 className="recipe__card-title"> {recipe.title} </h3>

            <h4 className="recipe__card-motion"> {typeof motion === "object" && motion !== null ? motion.title : motion} </h4>
            <p> {recipe.description} </p>
          </article>
        </div>
      </Link>
    </>
  );
};

export default RecipeCard;
