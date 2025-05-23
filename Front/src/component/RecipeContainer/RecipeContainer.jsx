import React, { useState, useEffect } from "react";
import RecipeCard from "../RecipeCard/RecipeCard.jsx";
import { Link } from "react-router-dom";
import "./recipe-container.css";

/** ----------------------------------------------------------------------------------------------
 * Composant affichant un ensemble de recettes selon la largeur d'écran et le mode choisi.
 * - Si mode = "first" → affiche les premières recettes
 * - Si mode = "last" → affiche les dernières recettes
 * - Si aucun mode → affiche toutes les recettes passées en paramètre
 * @component
 * @param  recipes - Toutes les recettes à afficher
 * @param  mode - "first", "last" ou non défini
 * @returns JSX avec les cartes recettes
 /* ---------------------------------------------------------------------------------------------- */

const RecipeContainer = ({ recipes, mode }) => {
  //State pour la taille de l'écran
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    //Cette fonction s'appelle "handleResize" car elle est chargée de gérer (handle) le redimensionnement (resize) de la fenêtre du navigateur.
    //Elle met à jour l'état screenWidth en récupérant la largeur actuelle de la fenêtre (window.innerWidth).

    const handleResize = () => setScreenWidth(window.innerWidth);

    //"resize" est un événement JavaScript natif du navigateur.
    //C'est un écouteur d'évènement
    //Il est déclenché à chaque fois que la fenêtre est redimensionnée (quand l'utilisateur ajuste manuellement la taille de la fenêtre, ou change l'orientation d’un mobile/tablette).
    window.addEventListener("resize", handleResize);
    //handleResize est la fonction qui s'exécute à chaque fois que l'événement "resize" se déclenche, pour mettre à jour la largeur de l’écran dans ton état React.
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  //En fonction de la taille de l'écran actuel défni dans le state
  //Affiche 5,4 ou 3 recettes
  const recipesToShow = screenWidth >= 2500 ? 5 : screenWidth >= 1800 ? 4 : 3;
  //En fonction du mode envoyé en props :
  let filteredRecipes = recipes;
  if (mode === "last") {
    filteredRecipes = recipes.slice(-recipesToShow);
  } else if (mode === "first") {
    filteredRecipes = recipes.slice(0, recipesToShow);
  }
  return (
    <div className="recipe__container" data-aos="fade-up">
      {filteredRecipes.map((recipe) => (
        <RecipeCard recipe={recipe} motion={recipe.motion.title} key={recipe.id} />
      ))}
    </div>
  );
};

export default RecipeContainer;
