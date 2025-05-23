//Composants et dépendances
import React, { useState, useEffect } from "react";
//CSS
import "../AddRecipeForm/add-recipe.css";
import "./add-motion.css";

//API
import { createMotions, getAllMotionsFormats, getAllMotionsGenres } from "../../api/index.js";
import { useNavigate } from "react-router-dom";

//utils
import toast from "../../utils/toast.js";
import { useErrorHandler } from "../../api/apiErrorHandler.js";

//Localstorage
/** ----------------------------------------------------------------------------------------------
 *  @description permettant d'ajouter une nouvelle recette.
 /* ---------------------------------------------------------------------------------------------- */
const AddMotionForm = () => {
  // ----------------- STATE DES DONNÉES DE LA BDD-----------------
  /**
   * @state
   * États pour stocker les données des différentes tables : catégories, difficultés, ingrédients et motions
   * tableau vide par défaut
   */
  const navigate = useNavigate();
  const [motionsFormats, setMotionsFormats] = useState([]);
  const [motionsGenres, setMotionsGenres] = useState([]);

  // ----------------- HOOK D'ERREUR-----------------
  /**
   * @hook
   * hook pour la gestion d'erreur
   */
  const handleError = useErrorHandler(); // Hook de gestion d'erreurs

  // ----------------- RÉCUPÉRATION DES DONNÉES AU CHARGEMENT DE LA PAGE-----------------
  /**
   * @useEffect
   * Récupère les données des différentes tables à l'initialisation de la page.
   * Utilisé pour charger les catégories, difficultés, ingrédients et motions dans l'état de la page.
   */

  useEffect(() => {
    const loadMotionsFormats = async () => {
      try {
        const motionsFormatsData = await getAllMotionsFormats();
        setMotionsFormats(motionsFormatsData);
      } catch (error) {
        handleError(error); // Gestion de l'erreur
      }
    };
    const loadMotionsGenres = async () => {
      try {
        const motionsGenresData = await getAllMotionsGenres();
        setMotionsGenres(motionsGenresData);
      } catch (error) {
        handleError(error); // Gestion de l'erreur
      }
    };
    loadMotionsFormats();
    loadMotionsGenres();
  }, []);

  // ----------------- STATES DU FORMULAIRE-----------------
  /**
   * @state
   * États pour chaque champs du formulaire
   * vide au début
   */
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [director, setDirector] = useState("");
  const [catchphrase, setCatchphrase] = useState("");
  const [formatId, setFormatsId] = useState("");
  const [genresList, setGenresList] = useState([{ motion_genre_id: "" }]);
  const [image, setImage] = useState(null);

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
    // title : "Spaghetti Carbonaâtes trop bonnes"
    //etc etc avec tous les champs
    formData.append("title", title);
    formData.append("description", description);
    formData.append("release_date", releaseDate);
    formData.append("director", director);
    formData.append("catchphrase", catchphrase);
    formData.append("motion_format_id", formatId);
    formData.append("motion_genres", JSON.stringify(genresList));

    //si il y a une image alors on l'envoie dans le formData
    if (image) {
      formData.append("picture", image);
    }

    // petite particularité pour les ingrédients qui ont un tableau:
    //On ne peut pas ajouter ce tableau tel quel dans FormData, donc on doit le transformer en chaîne JSON :
    //exemple : ingredients: "[{\"ingredient_id\":1,\"quantity\":200,\"unit\":\"g\"},{\"ingredient_id\":2,\"quantity\":3,\"unit\":\"pcs\"}]"
    // formData.append("ingredients", JSON.stringify(ingredientsList));

    // Envoi des données à l'api de création de recette
    try {
      await createMotions(formData);
      navigate("/recipes/create");
      toast.success("Oeuvre ajoutée");
    } catch (error) {
      handleError(error);
      toast.error(error.message);
    }
  };
  // ----------------- AJOUT D'UN NOUVEAU GENRE-----------------

  const addGenreField = () => {
    setGenresList([...genresList, { motion_genre_id: "" }]);
  };
  const handleGenreChange = (index, value) => {
    const updatedGenres = [...genresList];
    updatedGenres[index] = { motion_genre_id: parseInt(value) };
    setGenresList(updatedGenres);
  };

  /**
   * @function handleRemoveGenre
   * Permet de supprimer un élément de la liste
   * Ne se lance qu'a partir du 2ème genre (car le film doit contenir au moins 1 genre)
   * @params index - la position du genre qu'on veux supprimer dans la liste
   */

  const handleRemoveGenre = (index) => {
    const updatedGenres = [...genresList];
    updatedGenres.splice(index, 1);

    setGenresList(updatedGenres);
  };
  // ----------------- RENDU -----------------
  return (
    <section className="section__form section__form-add-motion">
      {/* Balises qui seront intégrées dans le head */}
      <title>Ajouter une oeuvre | Ciné Délices</title>
      <meta name="description" content="Formulaire pour ajouter une recette" />
      <meta name="description" content="Formulaire pour ajouter une oeuvre" />

      <div className="form__container">
        <h1 className="section-title">Ajouter une nouvelle oeuvre</h1>
        {/* On change le type de formulaire, nécessaire pour pouvoir envoyer des images */}
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="form-group">
            <label htmlFor="title">Titre de l'oeuvre</label>
            <input type="text" id="title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Comment s'appelle l'oeuvre dont est inspiré ta recette ?" />
          </div>
          <div className="form-group">
            <label htmlFor="release_date">Date de sortie</label>
            <input type="text" id="release_date" name="release_date" value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} required placeholder="JJ/MM/AAAA" />
          </div>
          <div className="form-group">
            <label htmlFor="director">Réalisateur</label>
            <input type="text" id="director" name="director" value={director} onChange={(e) => setDirector(e.target.value)} required placeholder="Quel est le réalisateur de l'oeuvre !" />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" value={description} onChange={(e) => setDescription(e.target.value)} required placeholder="Décris nous l'oeuvre en quelques mots" rows="4" />
          </div>
          <div className="form-group">
            <label htmlFor="catchphrase">Citation</label>
            <input type="text" id="catchphrase" name="catchphrase" value={catchphrase} onChange={(e) => setCatchphrase(e.target.value)} required placeholder="Sors nous ta plus belle tirade de l'oeuvre !" />
          </div>
          <div className="form-group">
            <label htmlFor="format_id">Support</label>
            <select aria-label="choisi le format de loeuvre" id="format_id" name="format_id" value={formatId} onChange={(e) => setFormatsId(e.target.value)} required>
              <option value="">Choisis le type auquel est liée l'oeuvre</option>
              {/*Map pour afficher le menu déroulant */}
              {motionsFormats.map((format) => (
                <option key={format.id} value={format.id}>
                  {format.name}
                </option>
              ))}
            </select>
          </div>
          {genresList.map((selectedGenre, index) => (
            <div key={index} className="form-group">
              <label htmlFor={`genre_id_${index}`}>Genre {index + 1}</label>
              <select aria-label="choisi le genre de loeuvre" id={`genre_id_${index}`} name={`genre_id_${index}`} value={selectedGenre.motion_genre_id} onChange={(e) => handleGenreChange(index, e.target.value)} required>
                <option value="">Choisis le genre</option>
                {motionsGenres.map((genre) => (
                  <option key={genre.id} value={genre.id}>
                    {genre.name}
                  </option>
                ))}
              </select>
              {/* Affiche le bouton "Retirer l'ingrédient" uniquement à partir du 2ème élément (index > 0) */}
              {index > 0 && (
                <button type="button" className="btn btn-remove-element" onClick={() => handleRemoveGenre(index)}>
                  Retirer
                </button>
              )}
            </div>
          ))}

          <button type="button" className="btn btn-add-element" onClick={addGenreField}>
            Ajouter un genre
          </button>

          <div className="form-group">
            <label htmlFor="picture">Image de l'oeuvre</label>
            <input type="file" id="picture" name="picture" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
          </div>

          <button type="submit" className="btn">
            Valider l'oeuvre
          </button>
        </form>
      </div>
      <button className="button-return-catalog btn" onClick={() => navigate("/recipes/create")}>
        Retour
      </button>
    </section>
  );
};
export default AddMotionForm;
