import React from "react";

import { useNavigate } from "react-router-dom";

import RecipeContainer from "../../component/RecipeContainer/RecipeContainer.jsx";

/** ----------------------------------------------------------------------------------------------
 * @description Affiche la liste des recettes groupées par catégorie.
 * Chaque bloc correspond à une catégorie (ex: "Dessert", "Entrée", etc.).
 * ---------------------------------------------------------------------------------------------- */

const RecipesList = ({ recipes }) => {
  const navigate = useNavigate();
  // ------------------ GROUPEMENT DES RECETTES PAR CATÉGORIE ------------------

  const groupedByCategory = recipes.reduce((acc, recipe) => {
    const categoryName = recipe.category.name; // On récupère le nom de la catégorie de la recette
    if (!acc[categoryName]) {
      acc[categoryName] = []; // Si la catégorie n'existe pas encore dans l'objet accumulateur, on l'initialise avec un tableau vide
    }
    acc[categoryName].push(recipe); // On ajoute la recette dans le tableau correspondant à sa catégorie

    return acc; // On retourne l'accumulateur pour la prochaine itération
  }, {});

  // ------------------ RENDU ------------------

  return (
    <section className="section__recipe-all">
      {/* Balises qui seront intégrées dans le head */}
      <title>Liste des recettes | Ciné Délices</title>
      <meta name="description" content="liste de recettes inspirées du cinéma" />
      <meta name="keywords" content="Ciné délices, recettes, cinéma, cuisine, films, liste" />

      {/* Transformation de l'objet groupedByCategory en tableau de paires clé/valeur pour pouvoir utiliser des méthodes propres aux tableaux */}
      {Object.entries(groupedByCategory).map(([categoryName, categoryRecipes]) => {
        return (
          <div key={categoryName} className={`container__${categoryName.toLowerCase().replace(/\s+/g, "-")}`} data-aos="fade-up">
            <h2 className="section-title recipe-book-title">{categoryName}</h2>
            <RecipeContainer recipes={categoryRecipes} />
          </div>
        );
      })}
      <button className="button-return-catalog btn" onClick={() => navigate(-1)}>
        Retourner à la page précédente
      </button>
    </section>
  );
};

export default RecipesList;
