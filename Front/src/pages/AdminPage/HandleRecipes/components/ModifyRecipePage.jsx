// Import des dépendances nécessaires
import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Import des appels API
import { modifyOneRecipe } from "../../../../api/adminApi.js";
import { getDishesDifficulty, getDishesCategories } from "../../../../api/dishesApi.js";
import { getRecipeById } from "../../../../api/recipesApi.js";
import { getAllIngredients } from "../../../../api/ingredientsApi.js";

// Import de la fonction de notification (toast)
import toast from "../../../../utils/toast.js";
import { useErrorHandler } from "../../../../api/apiErrorHandler.js";
// Import de la variable d'environnement
const API_URL = import.meta.env.VITE_API_URL;

const ModifyRecipeForm = ({ recipes, setRecipes, motionsList }) => {
  /**
   * @hook
   * hook pour la gestion d'erreur
   */
  const handleError = useErrorHandler(); // Hook de gestion d'erreurs
  // Composant de formulaire de modification de recette

  // ----------------- STATE DES DONNÉES DE LA BDD-----------------

  //Définition des states pour stocker les données récupérées au chargement de la page

  const [motions, setMotions] = useState([]); // liste des motions passé en props
  const [dishDifficulty, setdishDifficulty] = useState([]);
  const [dishCategory, setdishCategory] = useState([]);
  const [ingredients, setIngredients] = useState([]); //liste des ingrédients pour le menu déroulant

  // Définition des state pour stocker les données liées à la recette sélectionnée dans le premier champs du formulaire
  const [title, setTitle] = useState("");

  const [recipeId, setRecipeId] = useState("");
  const [motionId, setMotionId] = useState("");
  const [description, setDescription] = useState("");
  const [instruction, setInstruction] = useState("");
  const [anecdote, setAnecdote] = useState("");
  const [difficultyId, setDifficultyId] = useState("");
  const [completionTime, setCompletionTime] = useState("");
  const [dishCategoryId, setDishCategoryId] = useState("");
  //ingredientList est la liste des ingrédients associés à une recette (!!! ne pas confondre avec la liste des ingrédients que l'on récupère au chargement de la page pour le menu déroulant)
  const [ingredientsList, setIngredientsList] = useState([{ ingredient_id: "", quantity: "", unit: "" }]);
  const [userId, setUserId] = useState("");
  const [img, setImg] = useState("");

  const navigate = useNavigate(); //Hook pour rediriger l’utilisateur après modification

  // ----------------- RÉCUPÉRATION DES DONNÉES AU CHARGEMENT DE LA PAGE ET AU CHANGEMENT DE LA RECETTE SELECTIONNÉE -----------------

  useEffect(() => {
    // Chargement de la liste des ingrédients depuis l'API

    const loadIngredients = async () => {
      try {
        const ingredientsData = await getAllIngredients();
        setIngredients(ingredientsData);
      } catch (error) {
        handleError(error);
      }
    };

    // Chargement des catégories de plats depuis l'API
    const loadCategory = async () => {
      try {
        const categoryData = await getDishesCategories();
        setdishCategory(categoryData);
      } catch (error) {
        handleError(error);
      }
    };

    // Chargement des niveaux de difficulté depuis l'API
    const loadDifficulty = async () => {
      try {
        const difficultyData = await getDishesDifficulty();
        setdishDifficulty(difficultyData);
      } catch (error) {
        handleError(error);
      }
    };

    // Chargement d'une recette existante par son ID (pour préremplir le formulaire)
    const loadOneRecipe = async () => {
      if (!recipeId) return; // Si aucun ID sélectionné, on ne charge rien

      try {
        const recipeData = await getRecipeById(recipeId); // On récupère l'id de la recette selectionnée dans le premier champs du formulaire
        // On remplit les champs du formulaire avec les données de la recette récupérées juste au dessus (ça évite par exemple que l'utilisateur doivent retaper toute la description pour une faute d'ortographe)
        // on met le || "" pour être sûr que notre valeur ne soit jamais null (quand aucune recette n'a été selectionné dans le formulaire)
        setTitle(recipeData.title || "");
        setDescription(recipeData.description || "");
        setInstruction(recipeData.instruction || "");
        setAnecdote(recipeData.anecdote || "");
        setCompletionTime(recipeData.completion_time || "");
        setDifficultyId(recipeData.difficulty_id || "");
        setDishCategoryId(recipeData.dish_category_id || "");
        setMotionId(recipeData.motion_id || "");
        setUserId(recipeData.user_id || "");
        setIngredientsList(
          recipeData.ingredients?.map((ingredient) => ({
            ingredient_id: ingredient.id || "",
            quantity: ingredient.RecipeHasIngredient?.quantity || "",
            unit: ingredient.RecipeHasIngredient?.unit || "",
          })) || []
        );
        setImg(recipeData.picture);
      } catch (error) {
        handleError(error);
      }
    };

    // Appels des fonctions au chargement ou à la mise à jour des dépendances
    loadOneRecipe();
    loadDifficulty();
    loadCategory();
    loadIngredients();

    // Mise à jour des listes à partir des props
    setMotions(motionsList);
  }, [recipes, motionsList, recipeId]); //on passe au tableau de dépendances nos props et recipeId (pour qu'à chaque fois qu'on change la recette selectionné dans le premier champs du formulaire on met à jour les states)

  // ----------------- Fonctions concernant l'envoi des formulaires -----------------

  //soumission du formulaire de modification de recette
  const handleModifyRecipe = async (e) => {
    e.preventDefault();

    // on crée un objet FormData (fonction inhérente à JS qui transforme les données d'un formulaire en un ensemble [clé,valeur])
    const formData = new FormData();

    // Pour chaque data récupérée dans le formulaire,
    // on la range et on l'ajoute à l'objet formData

    formData.append("title", title);
    formData.append("description", description);
    formData.append("instruction", instruction);
    formData.append("anecdote", anecdote);
    formData.append("completion_time", completionTime);
    formData.append("dish_category_id", dishCategoryId);
    formData.append("difficulty_id", difficultyId);
    formData.append("ingredients", JSON.stringify(ingredientsList));
    formData.append("user_id", userId);
    formData.append("motion_id", motionId);
    //Envoi de l'image
    if (img) {
      formData.append("picture", img);
    }

    // Envoi des donnée à l'api de modification de recette
    try {
      const newRecipe = await modifyOneRecipe(recipeId, formData);
      //Obligé de faire appel l'api pour récupérer toutes les infos de la recettes avec ses associations
      const fullRecipe = await getRecipeById(newRecipe.id);
      //On actualise la liste en remplaçant la recette modifiée par sa nouvelle version
      setRecipes((prevList) => prevList.map((recipe) => (recipe.id === newRecipe.id ? fullRecipe : recipe)));
      // On redirige l'utilisateur vers la recette modifié
      navigate(`/recipes/${recipeId}`);
      toast.success("La recette a bien été modifié");
    } catch (error) {
      handleError(error);
      toast.error(error.message);
    }
  };

  // ----------------- fonctions pour gérer les ingrédients -----------------

  // Mise à jour d’un ingrédient dans la liste selon son index et le champ modifié
  const handleIngredientChange = (index, field, value) => {
    //On crée une nouvelle liste : parcours la liste d'ingrédients
    const updatedIngredients = [...ingredientsList];
    // Elle va chercher l'élement à la position [index] avec le champs [field] donné dans les paramètres
    // Puis une fois qu'elle l'a trouvé, elle modifie la value de cet ingrédient
    updatedIngredients[index][field] = value;
    // exemple handleIngredientChange(3, "quantity", 50)
    // enfin, elle met à jour le state avec le tableau modifié
    setIngredientsList(updatedIngredients);
  };

  // Suppression d’un ingrédient de la liste
  const handleRemoveIngredient = (index) => {
    const updatedIngredients = [...ingredientsList];
    updatedIngredients.splice(index, 1);
    //index : L'index à partir d'où le splice doit s'opérer
    //1 : Le nombre d'éléments à supprimer (ici, on en supprime un).
    setIngredientsList(updatedIngredients);
  };

  // ----------------- RENDU DU FORMULAIRE -----------------

  return (
    <div className="form__container" data-aos="fade-in">
      <h2 className="section-title form-title">Modifier une Recette</h2>

      {/* On change le type de formulaire, necessaire pour pouvoir envoyer des images */}
      <form onSubmit={handleModifyRecipe} encType="multipart/form-data">
        <div className="form-group">
          <label htmlFor="recipe_id">Liste de recette</label>
          {/* l'id de la recette selectionnée (recipeId) va servir à remplir les champs du formulaire (voir ligne 73-95) */}
          <select id="recipe_id" name="recipe_id" value={recipeId} onChange={(e) => setRecipeId(e.target.value)} required>
            <option value="">Choisis la recette à modifier dans la liste</option>
            {/*Map pour afficher le menu déroulant */}
            {recipes.map((recipe) => (
              <option key={recipe.id} value={recipe.id}>
                {recipe.title}
              </option>
            ))}
          </select>
        </div>

        {/* Champs pour modifier le titre de la recette */}
        <div className="form-group">
          <label htmlFor="title">Titre de la recette</label>
          <input type="text" id="title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Comment s'appelle ta super recette ?" />
        </div>

        {/* Champs pour modifier l'oeuvre associé à la recette */}
        <div className="form-group">
          <label htmlFor="motion_id">Oeuvre</label>
          <select id="motion_id" name="motion_id" value={motionId} onChange={(e) => setMotionId(e.target.value)} required>
            <option value="">À quelle oeuvre est associée ta recette ?</option>
            {/*Map pour afficher le menu déroulant */}
            {motions.map((motion) => (
              <option key={motion.id} value={motion.id}>
                {motion.title}
              </option>
            ))}
          </select>
        </div>

        {/* Champs pour modifier la description de la recette */}
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" value={description} onChange={(e) => setDescription(e.target.value)} required placeholder="Décris nous ta recette en quelques mots" rows="4" />
        </div>

        {/* Champs pour modifier les instructions de la recette */}
        <div className="form-group">
          <label htmlFor="instruction">Instructions</label>
          <textarea id="instruction" name="instruction" value={instruction} onChange={(e) => setInstruction(e.target.value)} required placeholder="Ici, tu peux écrire toutes les étapes à suivre pour le bon déroulement de ta recette" rows="6" />
        </div>

        {/* Champs pour modifier l'anecdote de la recette */}
        <div className="form-group">
          <label htmlFor="anecdote">Anecdote</label>
          <textarea id="anecdote" name="anecdote" value={anecdote} onChange={(e) => setAnecdote(e.target.value)} placeholder="Raconte nous une anecdote en rapport avec l'oeuvre ou ta recette, ou les deux " rows="4" />
        </div>

        {/* Champs pour modifier le temps de préparation de la recette */}
        <div className="form-group">
          <label htmlFor="completion_time">Temps de préparation (en minutes)</label>
          <input type="number" id="completion_time" name="completion_time" value={completionTime} onChange={(e) => setCompletionTime(e.target.value)} required placeholder="Exemple: 30" />
        </div>

        {/* Champs pour modifier la catégorie de la recette */}
        <div className="form-group">
          <label htmlFor="dish_category_id">Catégorie de plat</label>
          <select id="dish_category_id" name="dish_category_id" value={dishCategoryId} onChange={(e) => setDishCategoryId(e.target.value)} required>
            <option value="">Sélectionne une catégorie</option>
            {/*Map pour afficher le menu déroulant */}
            {dishCategory.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Champs pour modifier la difficulté de la recette */}
        <div className="form-group">
          <label htmlFor="difficulty_id">Difficulté</label>
          <select id="difficulty_id" name="difficulty_id" value={difficultyId} onChange={(e) => setDifficultyId(e.target.value)} required>
            <option value="">Choisis le niveau de difficulté de ta recette</option>
            {/*Map pour afficher le menu déroulant */}
            {dishDifficulty.map((difficulty) => (
              <option key={difficulty.id} value={difficulty.id}>
                {difficulty.name}
              </option>
            ))}
          </select>
        </div>
        <h3 className=" ingredients-title">Ingrédients</h3>
        {ingredientsList.map((item, index) => (
          <div className="ingredient-details" key={index}>
            {/* Champs pour modifier un ingrédient */}
            <div className="form-group">
              <label htmlFor={`ingredient_id_${index}`}>Ingrédient</label>
              <select
                /** chaque select du map aura le index pour le différencier*/
                id={`ingredient_${index}`}
                name={`ingredient_${index}`}
                /** La value est égale à l'id de l'ingrédient actuel*/
                value={item.ingredient_id}
                /* si l'utilisateur change la séléction, il fait jouer la fonction pour mettre à jour l'état de ingredients list (voir ligne 61)*/
                /* "à la position index, change la propriété ingredient_id avec la nouvelle value."*/
                onChange={(e) => handleIngredientChange(index, "ingredient_id", e.target.value)}
                required
              >
                <option value="">{item.name}</option>
                {/** map des ingrédients pour les afficher dans le menu déroulant */}
                {ingredients.map((ingredient) => (
                  <option key={ingredient.id} value={ingredient.id}>
                    {ingredient.name}
                  </option>
                ))}
              </select>
            </div>

            {/** Quantité de l'ingrédient .*/}
            <div className="form-group">
              <label htmlFor={`quantity_${index}`}>quantité</label>
              <input
                type="number"
                id={`quantity_${index}`}
                name={`quantity_${index}`}
                /** La value est égale à la quantité, au début elle est null car le state ingredientList (voir ligne 52) a été défini vide*/
                value={item.quantity}
                /* si l'utilisateur change la séléction, il fait jouer la fonction pour mettre à jour l'état du champs quantity de ingredients list (voir ligne 61)*/
                onChange={(e) => handleIngredientChange(index, "quantity", e.target.value)}
                required
                placeholder="entrer une quantité"
              />
            </div>

            {/** Unité de l'ingrédient .*/}
            {/** Même process que pour quantity .*/}
            <div className="form-group">
              <label htmlFor={`unit_${index}`}>unité</label>
              <input
                type="text"
                id={`unit_${index}`}
                name={`unit_${index}`}
                value={item.unit}
                /* si l'utilisateur change la séléction, il fait jouer la fonction pour mettre à jour l'état du champs unit de ingredients list (voir ligne 61)*/
                onChange={(e) => handleIngredientChange(index, "unit", e.target.value)}
                required
                placeholder="entrer une unité de mesure"
              />
            </div>

            {/* Affiche le bouton "Retirer l'ingrédient" uniquement si il y'a + d'un ingrédient dans la liste */}
            {ingredientsList.length > 1 && (
              <button type="button" className="btn btn-remove-element" onClick={() => handleRemoveIngredient(index)}>
                Retirer l'ingrédient
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          className="btn button add-ingredient-btn"
          /* Affiche un nouveau select pour ajouter un ingrédient*/
          onClick={() => setIngredientsList([...ingredientsList, { ingredient_id: "", quantity: "", unit: "" }])}
        >
          {" "}
          Ajouter un ingrédient{" "}
        </button>

        {/* Champ pour charger une nouvelle image */}
        <div className="form-group">
          <label htmlFor="picture">Image de la recette</label>
          <input type="file" id="picture" name="picture" accept="image/*" onChange={(e) => setImg(e.target.files[0])} />
        </div>

        {/* On affiche l'image selectionnée */}
        <figure id="recipe_img">
          <img src={`${API_URL}/${img}`} alt={title} />
        </figure>

        {/* Bouton pour soumettre le formulaire () */}
        <button type="submit" className="btn su">
          Valider les modifications
        </button>
      </form>
    </div>
  );
};

export default ModifyRecipeForm;
