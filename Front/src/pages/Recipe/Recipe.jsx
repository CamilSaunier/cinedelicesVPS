// ==================== IMPORTS ====================
import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { getRecipeById } from "../../api/index.js";
import { useErrorHandler } from "../../api/apiErrorHandler.js";
import "./recipe.css";

// ==================== CONST ====================
const API_URL = import.meta.env.VITE_API_URL;

/**
 * @description Page de détails pour une recette individuelle.
 */
const Recipe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const handleError = useErrorHandler(); //  Hook d'erreur centralisé
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Ajout de l'état de chargement

  // ==================== CHARGEMENT DES DONNÉES ====================
  useEffect(() => {
    const loadData = async () => {
      try {
        if (id) {
          const newRecipe = await getRecipeById(parseInt(id));
          setRecipe(newRecipe);
        }
      } catch (error) {
        handleError(error);
      } finally {
        setIsLoading(false); //  Fin du chargement
      }
    };

    loadData();
  }, [id]);

  // ==================== GESTION DU CHARGEMENT ====================
  if (isLoading) {
    return <div className="loader"></div>;
  }

  // ==================== GESTION ERREUR / 404 ====================
  if (!recipe) {
    return <Navigate to="/404" replace />;
  }

  // ==================== RENDU ====================
  return (
    <section className="section__recipe section">
      <div className="container recipe__details-container">
        <title>{recipe.title}</title>
        <meta name="description" content={`page de la recette : ${recipe.title}`} />
        <meta name="keywords" content={`Ciné délices, recettes, cinéma, ${recipe.title}`} />

        <h2 className="section-title has-text-centered">{recipe.title}</h2>

        <div className="recipe_items">
          <figure id="recipe_img" data-aos="zoom-in">
            <img src={`${API_URL}/${recipe.picture}`} alt={recipe.title} />
          </figure>

          <div className="level_completion-recipe" data-aos="fade-up">
            <p className="has-text-centered" id="level">
              Difficulté : {recipe.difficulty.name}
            </p>
            <p className="has-text-centered">-</p>
            <p className="has-text-centered" id="complétion">
              Temps de réalisation : {recipe.completion_time} minutes
            </p>
          </div>

          <div className="anecdote card" data-aos="fade-down">
            <h3 className="card_title">{recipe.title}</h3>

            <p className="text_recipe">{recipe.description}</p>
          </div>

          <div className="ingredients card" data-aos="fade-up">
            <h3 className="card_title">Ingrédients :</h3>
            <ul className="text_recipe">
              {recipe.ingredients.map((ingredient, index) => (
                <li className="ingredient_items" key={index}>
                  • {ingredient.name} - {ingredient.RecipeHasIngredient.quantity} {ingredient.RecipeHasIngredient.unit}
                </li>
              ))}
            </ul>
          </div>

          <div className="instruction card" data-aos="zoom-in">
            <h3 className="card_title">Étapes :</h3>
            <p className="text_recipe">{recipe.instruction}</p>
          </div>
        </div>

        <div className="button-center">
          <button className="button-return-catalog btn" onClick={() => navigate(-1)}>
            Retour
          </button>
        </div>
      </div>
    </section>
  );
};

export default Recipe;
