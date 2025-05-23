import React from "react";
import { useNavigate } from "react-router-dom";
import { IoFastFoodSharp } from "react-icons/io5";
import { RiDrinks2Fill } from "react-icons/ri";
import { GiCakeSlice } from "react-icons/gi";
import { PiIceCreamFill } from "react-icons/pi";
import { MdBreakfastDining } from "react-icons/md";
import { GiFullPizza } from "react-icons/gi";
import { TbSaladFilled } from "react-icons/tb";
import { MdOutlineFoodBank } from "react-icons/md";
import "./filterbydishcategories.css";

/**
 * Composant React qui affiche une liste filtrable de catégories de plats, avec une icône personnalisée pour chaque catégorie.
 * */

const FilterByDishCategories = ({ dishCategories, recipes }) => {
  const navigate = useNavigate();

  /**
   * Retourne l'icône React appropriée en fonction du nom de la catégorie.
   *
   * @function
   * @param {string} categoryName - Nom de la catégorie (ex: "Dessert", "Boissons").
   * @returns {JSX.Element} Icône React correspondant à la catégorie, avec une classe CSS appliquée.
   */
  const getCategoryIcon = (categoryName) => {
    const iconMap = {
      Entrée: <TbSaladFilled className="dish__category-icon" />,
      "Plat principal": <IoFastFoodSharp className="dish__category-icon" />,
      Dessert: <PiIceCreamFill className="dish__category-icon" />,
      Apéritif: <GiFullPizza className="dish__category-icon" />,
      Boisson: <RiDrinks2Fill className="dish__category-icon" />,
      Pâtisserie: <GiCakeSlice className="dish__category-icon" />,
      "Petit-déjeuner": <MdBreakfastDining className="dish__category-icon" />,
    };
    // Icône par défaut si aucune correspondance
    return iconMap[categoryName] || <MdOutlineFoodBank className="dish__category-icon" />; // fallback
  };
  return (
    <div>
      <h2 className="container-title has-text-centered" data-aos="zoom-in">
        Par catégorie de plat
      </h2>
      <div className="dish__category-filters">
        {dishCategories.map((dishCategory) => (
          <div
            key={dishCategory.id}
            className="dish__category-filter"
            onClick={() => {
              const filteredRecipes = recipes.filter((recipe) => recipe.dish_category_id === dishCategory.id);
              navigate("/search-results", {
                state: {
                  filteredRecipes,
                  source: "category",
                  category: dishCategory.name,
                  motion: filteredRecipes.map((recipe) => recipe.motion.title),
                },
              });
            }}
            data-aos="zoom-in"
          >
            {/* Affichage d’une seule icône par catégorie */}
            {getCategoryIcon(dishCategory.name)}
            <h3 className="dish__category-name ">{dishCategory.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterByDishCategories;
