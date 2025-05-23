import React, { useEffect, useState } from "react";
import { getAllIngredients } from "../../../api/ingredientsApi.js";
import AddIngredientForm from "./components/AddIngredientForm.jsx";
import DeleteIngredients from "./components/DeleteIngredients.jsx";

/**
 * @description Page d'administration pour gérer les ingrédients.
 * @returns {JSX.Element} La page d'administration pour gérer les ingrédients.
 */


// fonction principale de la page d'administration des ingrédients
const HandleIngredientsPage = () => {
  const [ingredientList, setIngredientList] = useState([]);

// ----------------- Récupération de la liste des ingrédients au chargement de la page -----------------
  // useEffect pour charger la liste des ingrédients au chargement de la page
  useEffect(() => {
    const loadIngredients = async () => {
      const ingredientsData = await getAllIngredients();
      setIngredientList(ingredientsData);
    };
    // Appel de la fonction pour charger les ingrédients
    loadIngredients();
  }, []);


  // ----------------- Rendu de la page -----------------
  return (
    <>
      <AddIngredientForm setIngredientList={setIngredientList} data-aos="fade-up" />
      <DeleteIngredients ingredientList={ingredientList} setIngredientList={setIngredientList} data-aos="fade-up" />
    </>
  );
};

export default HandleIngredientsPage;
