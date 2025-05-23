import { Link } from "react-router-dom";
import "../../pages/Carnet/carnet.css";
import RecipeContainer from "../RecipeContainer/RecipeContainer.jsx";

/** ----------------------------------------------------------------------------------------------
 * Composant affichant les trois dernières recettes.
 * en utilisant le composant `RecipeContainer` qui s'occupe de filtrer les recettes de son côté.
 * avec un lien vers chaque recette individuelle.
 * @component
 * @param recipes - Toutes les recettes de la BDD
 * @returns Section contenant les trois dernières recettes avec un bouton pour voir toutes les recettes.
 /* ---------------------------------------------------------------------------------------------- */

const LastRecipes = ({ recipes }) => {
  return (
    <section className="section__last-recipes section" aria-labelledby="last-recipes-title">
      <h2 id="last-recipes-title" className="section-title title">Dernière recettes</h2>
      <RecipeContainer recipes={recipes} mode="last" />
      <Link className="nav-link" id="recipes" to="/recipes">
        <button className="btn btn-see-more">Voir tout</button>
      </Link>
    </section>
  );
};

export default LastRecipes;
