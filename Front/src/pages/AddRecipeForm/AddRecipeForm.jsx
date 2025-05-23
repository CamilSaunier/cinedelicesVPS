//Composants et dépendances
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
//CSS
import "./add-recipe.css";
//API
import { createRecipes, getAllMotions, getAllIngredients, getDishesCategories, getDishesDifficulty, getRecipeById } from "../../api/index.js";

//Store
import { useUserStore } from "../../store/store.js";
//toast
import toast from "../../utils/toast.js";
import { useErrorHandler } from "../../api/apiErrorHandler.js";
/** ----------------------------------------------------------------------------------------------
 *  @description permettant d'ajouter une nouvelle recette.
 /* ---------------------------------------------------------------------------------------------- */

const AddRecipeForm = ({ setRecipes }) => {
  // ----------------- HOOK D'ERREUR-----------------
  /**
   * @hook
   * hook pour la gestion d'erreur
   */
  const handleError = useErrorHandler(); // Hook de gestion d'erreurs
  // ----------------- STATE DES DONNÉES DE LA BDD-----------------
  /**
   * @state
   * États pour stocker les données des différentes tables : catégories, difficultés, ingrédients et motions
   * tableau vide par défaut
   */

  const [dishCategory, setdishCategory] = useState([]);
  const [dishDifficulty, setdishDifficulty] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [motions, setMotions] = useState([]);

  // ----------------- RÉCUPÉRATION DE L'USER CONECTÉ----------------
  /**
   * @const user - Données utilisateur récupérées depuis le store Zustand.
   * Contient les informations de l'utilisateur connecté (pseudo, email, userId, etc.)
   */

  const { user } = useUserStore();
  const navigate = useNavigate(); // ← Initialisation du hook

  // ----------------- RÉCUPÉRATION DES DONNÉES AU CHARGEMENT DE LA PAGE-----------------
  /**
   * @useEffect
   * Récupère les données des différentes tables à l'initialisation de la page.
   * Utilisé pour charger les catégories, difficultés, ingrédients et motions dans l'état de la page.
   */
  useEffect(() => {
    //Table des categories
    const loadCategory = async () => {
      try {
        const categoryData = await getDishesCategories();
        setdishCategory(categoryData);
      } catch (error) {
        handleError(error); // Gestion de l'erreur
      }
    };
    //Table des difficultés
    const loadDifficulty = async () => {
      try {
        const difficultyData = await getDishesDifficulty();
        setdishDifficulty(difficultyData);
      } catch (error) {
        handleError(error); // Gestion de l'erreur
      }
    };
    //Table des ingrédients
    const loadIngredients = async () => {
      try {
        const ingredientsData = await getAllIngredients();
        setIngredients(ingredientsData);
      } catch (error) {
        handleError(error); // Gestion de l'erreur
      }
    };
    //Table des motions
    const loadMotions = async () => {
      try {
        const motionsData = await getAllMotions();
        setMotions(motionsData);
      } catch (error) {
        handleError(error); // Gestion de l'erreur
      }
    };

    loadCategory();
    loadDifficulty();
    loadIngredients();
    loadMotions();
  }, []);

  // ----------------- STATES DU FORMULAIRE-----------------
  /**
   * @state
   * États pour chaque champs du formulaire
   * vide au début
   */
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [instruction, setInstruction] = useState("");
  const [anecdote, setAnecdote] = useState("");
  const [completionTime, setCompletionTime] = useState("");
  const [dishCategoryId, setDishCategoryId] = useState("");
  const [difficultyId, setDifficultyId] = useState("");
  const [ingredientsList, setIngredientsList] = useState([{ ingredient_id: "", quantity: "", unit: "" }]);
  const [motionId, setMotionId] = useState("");
  const [image, setImage] = useState(null);

  // const [image, setImage] = useState(null);

  // ----------------- GESTION DES INGRÉDIENTS-----------------
  /**
   * @function handleIngredientChange
   * Gère le changement de valeur pour chaque ingrédient dans la liste des ingrédients.
   * @param  index - la position de l'ingrédient qu'on veux modifer dans la liste
   * @param  field - le nom du champs que l'on veux modifer (ex: quantity,unit etc...)
   * @param  value - la nouvelle valeur saisie par l'utilisateur pour ce champ
   */

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

  /**
   * @function handleRemoveIngredient
   * Permet de supprimer un élément de la liste
   * Ne se lance qu'à partir du 2ème ingrédient (car la recette doit contenir au moins 1 ingrédient)
   * Si il n'y a qu'un ingrédient dans la liste => on ne peut pas le supprimer
   * @params index - la position de l'ingrédient qu'on veut supprimer dans la liste
   */

  const handleRemoveIngredient = (index) => {
    const updatedIngredients = [...ingredientsList];
    updatedIngredients.splice(index, 1);
    //index : L'index à partir d'où le splice doit s'opérer
    //1 : Le nombre d'éléments à supprimer (ici, on en supprime un).
    setIngredientsList(updatedIngredients);
  };

  // ----------------- SOUMISSION DU FORMULAIRE-----------------
  /**
   *  @function handleSubmit
   * Fonction de gestion de la soumission du formulaire.
   * Collecte les données du formulaire, les transforme en `FormData`
   * et envoie la requête à l'API pour créer la recette.
   *
   * @param e - L'événement de soumission du formulaire.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // on crée un objet FormData (fonction inhérente à JS qui transforme les données d'un formulaire en un ensemble [clé,valeur])
    const formData = new FormData();
    // Pour chaque data récupérée dans le formulaire,
    // on la range et on l'ajoute à l'objet formData
    // exemple ici de a quoi ressemblerait le form data :
    // title : "Spaghetti Carbonara"
    // decription :"Des supers pates trop bonnes"
    //etc etc avec tous les champs
    formData.append("title", title);
    formData.append("description", description);
    formData.append("instruction", instruction);
    formData.append("anecdote", anecdote);
    formData.append("completion_time", completionTime);
    formData.append("user_id", user.id);
    formData.append("dish_category_id", dishCategoryId);
    formData.append("difficulty_id", difficultyId);
    // petite particularité pour les ingrédients qui ont un tableau:
    //On ne peut pas ajouter ce tableau tel quel dans FormData, donc on doit le transformer en chaîne JSON :
    //exemple : ingredients: "[{\"ingredient_id\":1,\"quantity\":200,\"unit\":\"g\"},{\"ingredient_id\":2,\"quantity\":3,\"unit\":\"pcs\"}]"
    formData.append("ingredients", JSON.stringify(ingredientsList));
    formData.append("motion_id", motionId);
    //Envoi de l'image
    if (image) {
      formData.append("picture", image);
    }

    // Console.log pour vérifier les données du formulaire
    // for (let [key, value] of formData.entries()) {
    //   console.log(`${key}:`, value);
    // }

    // Envoi des données à l'api de création de recette
    try {
      const createdRecipe = await createRecipes(formData);
      //On va chercher la recette complète dans la bdd avant de la renvoyer dans le props
      const fullRecipe = await getRecipeById(createdRecipe.id);
      setRecipes((prevList) => [...prevList, fullRecipe]);

      navigate(`/recipes/${fullRecipe.id}`);
      toast.success("La recette a bien été crée");
    } catch (error) {
      handleError(error);
      toast.error(error.message);
    }
  };

  // ----------------- RENDU -----------------
  return (
    <section className="section__form section__form-add-recipe">
      {/* Balises qui seront intégrées dans le head */}
      <title>ajouter une recette | Ciné Délices</title>
      <meta name="description" content="Formulaire pour ajouter une recette" />

      <div className="form__container" data-aos="fade-in">
        <h1 className="section-title form-title">Créer une Nouvelle Recette</h1>
        {/* On change le type de formulaire, nécessaire pour pouvoir envoyer des images */}

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="form-group">
            <label htmlFor="title">Titre de la recette</label>
            <input type="text" id="title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Comment s'appelle ta super recette ?" />
          </div>

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

          <Link className="btn-add-element__container" to="/motions/create">
            <button className="btn btn-add-element">Créer une oeuvre</button>
          </Link>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" value={description} onChange={(e) => setDescription(e.target.value)} required placeholder="Décris nous ta recette en quelques mots" rows="4" />
          </div>

          <div className="form-group">
            <label htmlFor="instruction">Instructions</label>
            <textarea id="instruction" name="instruction" value={instruction} onChange={(e) => setInstruction(e.target.value)} required placeholder="Ici, tu peux écrire toutes les étapes à suivre pour le bon déroulement de ta recette" rows="6" />
          </div>

          <div className="form-group">
            <label htmlFor="anecdote">Anecdote</label>
            <textarea id="anecdote" name="anecdote" value={anecdote} onChange={(e) => setAnecdote(e.target.value)} placeholder="Raconte nous une anecdote en rapport avec l'oeuvre ou ta recette, ou les deux " rows="4" />
          </div>

          <div className="form-group">
            <label htmlFor="completion_time">Temps de préparation (en minutes)</label>
            <input type="number" id="completion_time" name="completion_time" value={completionTime} onChange={(e) => setCompletionTime(e.target.value)} required placeholder="Exemple: 30" />
          </div>
          {/*==========Input pour envoyer l'id de l'utilisateur============
          Invisible pour l'utilisateur*/}
          <div className="form-group">
            {/* <label htmlFor="user_id">ID de l'utilisateur</label> */}
            <input type="hidden" id="user_id" name="user_id" value={user.id} readOnly required placeholder="ID utilisateur" />
          </div>
          {/*==========Input pour envoyer l'id de l'utilisateur============*/}

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

          <div className="add-ingredient__container">
            {/** On parcours le tableau ingredientsList, chaque item est un ingrédient  ({ ingredient_id: 2, quantity: 100, unit: "g" }, par exemple), et index représente sa position dans le tableau.*/}

            {/**===========================SELECT POUR 1 INGRÉDIENT============================== */}
            {/*ingredientsList = [{ ingredient_id: "1", quantity: "50", unit: "gr" },{ ingredient_id: "2", quantity: "25", unit: "ml" }]*/}
            {ingredientsList.map((item, index) => (
              <div className="ingredient-details" key={index}>
                <div className="form-group">
                  <label htmlFor={`ingredient_id_${index}`}>Ingrédient</label>
                  <select
                    aria-label="sélectionne un ingrédient"
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
                    <option value="">Sélectionne un ingrédient</option>
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
                {/* Affiche le bouton "Retirer l'ingrédient" uniquement à partir du 2ème élément (index > 0) */}
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
          </div>

          {/**===========================FIN DU SELECT POUR 1 INGRÉDIENT============================== */}

          <div className="form-group">
            <label htmlFor="picture">Image de la recette</label>
            <input type="file" id="picture" name="picture" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
          </div>

          <button type="submit" className="btn su">
            Soumettre la recette
          </button>
        </form>
      </div>
      <button className="button-return-catalog btn" onClick={() => navigate("/carnet")}>
        Retourner au carnet
      </button>
    </section>
  );
};

export default AddRecipeForm;
