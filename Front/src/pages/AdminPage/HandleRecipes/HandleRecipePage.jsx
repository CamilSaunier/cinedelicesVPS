import ModifyRecipePage from "./components/ModifyRecipePage.jsx";
import DeleteRecipe from "./components/DeleteRecipe.jsx";

/**
 * @description Page d'administration pour gérer les recettes.
 * @param {Array} recipes - Liste des recettes
 * @param {Function} setRecipes - Fonction pour mettre à jour la liste des recettes
 * @param {Array} motionsList - Liste des films/séries
 * @returns {JSX.Element} La page d'administration pour gérer les recettes.
 */

const HandleRecipePage = ({ recipes, setRecipes, motionsList }) => {
  return (
    <>
      <ModifyRecipePage recipes={recipes} setRecipes={setRecipes} motionsList={motionsList} />
      <DeleteRecipe recipes={recipes} setRecipes={setRecipes} />
    </>
  );
};

export default HandleRecipePage;
