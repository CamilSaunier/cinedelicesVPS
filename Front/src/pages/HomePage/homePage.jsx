//dépendances
import { Link } from "react-router-dom";
//css
import "./homePage.css";
//Components
import LastRecipes from "../../component/RecipesDisplayFilter/LastRecipes.jsx";

import FavoritesRecipes from "../../component/RecipesDisplayFilter/FavoritesRecipes.jsx";

/** /* ---------------------------------------------------------------------------------------------- 
 * @description Page d’accueil de l’application. Présente un message d’introduction,
 * les dernières recettes publiées ainsi qu’une sélection de recettes favorites.
  /* ---------------------------------------------------------------------------------------------- */
function Home({ recipes }) {
  // ------------------ COMPOSANT PRINCIPAL ------------------

  return (
    <>
      {/* Balises qui seront intégrées dans le head */}
      <title>Accueil | Ciné Délices</title>
      <meta name="description" content="Bienvenue sur Cinédélice, un sitede recettes inspirées du cinéma" />
      <meta name="keywords" content="Ciné délices, recettes, cinéma, cuisine, films" />

      <div className="bg-home">
        {/* ----------- SECTION DE PRÉSENTATION ----------- */}

        {/* H1 MASQUÉ POUR L'ACCESSIBILITÉ */}
        <h1 className="sr-only">Bienvenue sur Ciné Délices</h1>
        <section className="section__presentation has-text-centered">
          <div className="container" data-aos="zoom-in">
            <div className="box">
              <h2 className="section__presentation-title ">Mon précieux ...repas</h2>
              <p className="section__presentation-text">
                Pour les amoureux de la bobine, les grands enfants, et tous ceux qui ont besoin d’un peu de fantasy dans leur assiette : ici, on
                recrée les recettes cultes du cinéma, les sérieuses comme les complètement barrées. Le but ? Kiffer. Et bien manger, évidemment. Une
                idée de plat inspiré d’un film ? Lance-toi, cuisine-la, et partage-la avec tous les autres fous de la pellicule !
              </p>
              <Link className="button__catalog button mt-3" to="/carnet">
                Voir le catalogue
              </Link>
            </div>
          </div>
        </section>

        {/* ----------- SECTION DES DERNIÈRES RECETTES ----------- */}

        <section className="section__recipes-block " data-aos="fade-up">
          <LastRecipes recipes={recipes} />

          {/* ----------- SECTION FAVORIS ----------- */}

          <FavoritesRecipes recipes={recipes} />
        </section>
      </div>
    </>
  );
}

export default Home;
