// ==================== DÉPENDANCES ====================
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// ==================== STYLES ====================
import "./carnet.css";
import "../Recipe/recipe.css";

// ==================== COMPOSANTS ====================
import SwiperMovies from "./components/SwiperMovies/SwiperMovies.jsx";
import FilterByGenreForm from "./components/FilterByGenreForm/FilterByGenreForm.jsx";
import LastRecipes from "../../component/RecipesDisplayFilter/LastRecipes.jsx";
import FilterByDishCategories from "./components/FilterByDishCategories/FilterByDishCategories.jsx";

// ==================== FONCTIONS API ====================
import { getDishesCategories, getAllGenres, getAllMotions } from "../../api/index.js";
import { useErrorHandler } from "../../api/apiErrorHandler.js";
/** ---------------------------------------------------------------------------------------------
 * @description Composant "Carnet" : page affichant des films/séries en lien avec les recettes.
 * - Possibilité de filtrer les films/séries par genre.
 * - Possibilité de filtrer les recettes par catégorie de plat.
 * - Accès aux dernières recettes et lien pour en ajouter une.
 * 
 * @param {Array} recipes - Liste des recettes reçues en props
 /* ---------------------------------------------------------------------------------------------- */

const Carnet = ({ recipes }) => {
  // ----------------- HOOK D'ERREUR-----------------
  /**
   * @hook
   * hook pour la gestion d'erreur
   */
  const handleError = useErrorHandler(); // Hook de gestion d'erreurs

  // ==================== ÉTATS ====================
  const [motions, setMotions] = useState([]); // Films et séries
  const [dishCategories, setdishCategories] = useState([]); // Catégories de plat
  const [genres, setGenres] = useState([]); // Genres cinématographiques
  const [selectedGenre, setSelectedGenre] = useState(null); // Genre sélectionné

  // ==================== CHARGEMENT DES DONNÉES ====================
  useEffect(() => {
    /**
     * Charge les catégories de plats depuis l'API
     * @async
     * @function loadCategory
     * @returns {Promise<void>}
     */
    const loadCategory = async () => {
      try {
        const categoryData = await getDishesCategories();
        setdishCategories(categoryData);
      } catch (error) {
        handleError(error); // Gestion de l'erreur
      }
    };
    /**
     * Charge tous les films/séries ("motions") depuis l'API
     * @async
     * @function loadMotions
     * @returns {Promise<void>}
     */
    const loadMotions = async () => {
      try {
        const motionsData = await getAllMotions();
        setMotions(motionsData);
      } catch (error) {
        handleError(error);
      }
    };
    /**
     * Charge tous les genres cinématographiques depuis l'API
     * @async
     * @function loadGenres
     * @returns {Promise<void>}
     */
    const loadGenres = async () => {
      try {
        const genresData = await getAllGenres();
        setGenres(genresData);
      } catch (error) {
        handleError(error);
      }
    };

    loadGenres();
    loadCategory();
    loadMotions();
  }, []);

  // ==================== FILTRAGE DES FILMS PAR GENRE ====================
  const filteredMotions =
    selectedGenre && selectedGenre.id !== "all"
      ? motions.filter((motion) => {
          // Vérifie que motion.genres existe et contient le genre sélectionné
          return motion.genres && motion.genres.some((genre) => String(genre.id) === String(selectedGenre.id));
        })
      : motions; // Si aucun genre sélectionné, retourne tous les films/séries

  // ==================== RENDU JSX ====================
  return (
    <>
      {/* Balises qui seront intégrées dans le head */}
      <title>Carnet de recettes | Ciné Délices</title>
      <meta name="description" content="Explorez notre collection de recettes inspirées du cinéma." />
      <meta name="keywords" content="Ciné délices, recettes, cinéma, cuisine, films" />

      {/* Contenu de la page */}
      <section className="section__recipe-book">
        {/* H1 MASQUÉ POUR L'ACCESSIBILITÉ */}
        <h1 className="sr-only">Carnet de recette - Filtrer et découvrir les recettes inspirées du cinéma</h1>

        <h2 className="page-title title has-text-centered">Carnet de recettes</h2>
        <div className="filter-container">
          <div className="logo-container" data-aos="fade-down">
            <span className="line"></span>
            <img src="/images/logo.webp" alt="Logo de Ciné Délices" className="logo" />
            <span className="line"></span>
          </div>
          {/* ==================== FILTRES PAR CATÉGORIE DE PLAT ==================== */}

          <FilterByDishCategories dishCategories={dishCategories} recipes={recipes} />
          {/* ==================== SECTION FILMS & SÉRIES ==================== */}
          <div className="container__film">
            <div className="container__film-filter">
              <h2 className="container-title has-text-centered" data-aos="zoom-in">
                Par films ou série
              </h2>

              {/* Formulaire de filtre par genre */}
              <FilterByGenreForm genres={genres} selectedGenre={selectedGenre} setSelectedGenre={setSelectedGenre} />

              {/* Swiper pour affichage mobile/tablette */}
              <SwiperMovies motions={filteredMotions} />
            </div>

            {/* Lien pour créer une nouvelle recette */}
            <Link className="add-recipe-btn btn" to="/recipes/create">
              Ajoute ta recette !
            </Link>
          </div>
        </div>

        {/* ==================== DERNIÈRES RECETTES ==================== */}
        <section className="section__last-recipes-carnet ">
          <LastRecipes recipes={recipes} />
        </section>
      </section>
    </>
  );
};

export default Carnet;
