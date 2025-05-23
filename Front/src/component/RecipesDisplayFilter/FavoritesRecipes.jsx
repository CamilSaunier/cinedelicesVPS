import { Link } from "react-router-dom";
import "../../pages/Carnet/carnet.css";
import RecipeContainer from "../RecipeContainer/RecipeContainer.jsx";

/** ----------------------------------------------------------------------------------------------
 * Composant affichant les trois premières recettes.
 * en utilisant le composant `RecipeContainer` qui s'occupe de filtrer les recettes de son côté.
 * avec un lien vers chaque recette individuelle.
 * @component
 * @param recipes - Toutes les recettes de la BDD
 * @returns Section contenant les trois premières recettes avec un bouton pour voir toutes les recettes.
 /* ---------------------------------------------------------------------------------------------- */

const FavoritesRecipes = ({ recipes }) => {
  return (
    <section className="section__favorite section" aria-labelledby="favorite-recipes-title">
      <h2 id="favorite-recipes-title" className="section-title title">Nos favoris</h2>
      <RecipeContainer recipes={recipes} mode="first" />

      <Link className="nav-link" id="recipes" to="/recipes">
        <button className="btn btn-see-more">Voir tout</button>
      </Link>
    </section>
  );
};

export default FavoritesRecipes;
