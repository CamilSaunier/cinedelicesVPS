import React from "react";
//API
import { getAllMotionsFormats, getAllMotionsGenres, getMotionById } from "../../../../api/motionsApi.js";
import { modifyOneMotion } from "../../../../api/adminApi.js";
//Dépendances
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
//Toast
import toast from "../../../../utils/toast.js";
import { useErrorHandler } from "../../../../api/apiErrorHandler.js";
//Variable d'environnement
const API_URL = import.meta.env.VITE_API_URL;

/**
 * @description Formulaire de modification d'une oeuvre
 * @param {Array} motionsList - Liste des oeuvres
 * @returns {JSX.Element} Formulaire de modification d'une oeuvre
 **/

const ModifyMotionForm = ({ motionsList }) => {
  // ----------------- HOOK D'ERREUR-----------------
  /**
   * @hook
   * hook pour la gestion d'erreur
   */
  const handleError = useErrorHandler(); // Hook de gestion d'erreurs

  const navigate = useNavigate(); // ← Initialisation du hook

  //useState des appels api
  const [motionsFormats, setMotionsFormats] = useState([]);
  const [motionsGenres, setMotionsGenres] = useState([]);

  const [motionId, setMotionId] = useState("");

  useEffect(() => {
    const loadMotionsFormats = async () => {
      const motionsFormatsData = await getAllMotionsFormats();
      setMotionsFormats(motionsFormatsData);
    };
    const loadMotionsGenres = async () => {
      const motionsGenresData = await getAllMotionsGenres();
      setMotionsGenres(motionsGenresData);
    };

    const loadOneMotion = async () => {
      if (!motionId) return;

      try {
        const motionData = await getMotionById(motionId);

        // Remplir les champs du formulaire avec les données récupérées (ça évite par exemple que l'utilisateur doivent retapper toute la description pour une faute d'ortographe)
        setTitle(motionData.title || "");
        setDescription(motionData.description || "");
        setReleaseDate(motionData.release_date || "");
        setDirector(motionData.director || "");
        setCatchphrase(motionData.catchphrase || "");
        setFormatsId(motionData.motion_format_id || "");
        setGenresList(motionData.genres || "");
        setImage(motionData.picture || "");
        setGenresList(
          motionData.genres?.map((genre) => ({
            motion_genre_id: genre.id || "",
            //genre_name: genre.name || "",
          })) || []
        );
      } catch (error) {
        handleError(error);
      }
    };
    loadMotionsFormats();
    loadMotionsGenres();

    loadOneMotion();
  }, [motionId]);

  //useState des champs du formulaires
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [director, setDirector] = useState("");
  const [catchphrase, setCatchphrase] = useState("");
  const [formatId, setFormatsId] = useState("");
  const [genresList, setGenresList] = useState([{ motion_genre_id: "" }]);
  const [image, setImage] = useState(null);

  const handleModifyMotion = async (e) => {
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
    formData.append("release_date", releaseDate);
    formData.append("director", director);
    formData.append("catchphrase", catchphrase);
    formData.append("motion_format_id", formatId);
    formData.append("motion_genres", JSON.stringify(genresList));

    //si il y a une image alors on l'envoie dans le formData
    if (image) {
      formData.append("picture", image);
    }

    try {
      await modifyOneMotion(motionId, formData);
      navigate(`/user/admin`);
      toast.success("L'oeuvre a bien été modifiée");
    } catch (error) {
      handleError(error);
      toast.error(error.message);
    }
  };

  // Fonction déclenchée lorsqu'on modifie un champ "genre"
  const handleGenreChange = (index, value) => {
    // On crée une copie de la liste actuelle des genres pour éviter de modifier directement l'état
    const updatedGenres = [...genresList];

    // On met à jour l'entrée à l'index spécifié avec le nouvel ID de genre (converti en nombre)
    updatedGenres[index] = { motion_genre_id: parseInt(value) };

    // On met à jour l'état avec la nouvelle liste modifiée
    setGenresList(updatedGenres);
  };

  const addGenreField = () => {
    setGenresList([...genresList, { motion_genre_id: "" }]);
  };

  return (
    <div className="form__container" data-aos="fade-up">
      <h1 className="section-title form-title">Modifier une oeuvre</h1>
      {/* On change le type de formulaire, necessaire pour pouvoir envoyer des images */}

      <form onSubmit={handleModifyMotion} encType="multipart/form-data">
        <div className="form-group">
          <label htmlFor="title">Titre de l'oeuvre</label>
          <select id="motion_id" name="motion_id" value={motionId} onChange={(e) => setMotionId(e.target.value)} required>
            {" "}
            {/* on set l'id de la motion qui dans le use effect ira chercher les informations de la motion choisi et remplira les champs du formulaire avec*/}
            <option value="">Choisis le film à modifier dans la liste</option>
            {/*Map pour afficher le menu déroulant */}
            {motionsList.map((motion) => (
              <option key={motion.id} value={motion.id}>
                {motion.title}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="title">Titre du film</label>
          <input type="text" id="title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Titre du film" />
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
          <select id="format_id" name="format_id" value={formatId} onChange={(e) => setFormatsId(e.target.value)} required>
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
            <select id={`genre_id_${index}`} name={`genre_id_${index}`} value={selectedGenre.motion_genre_id} onChange={(e) => handleGenreChange(index, e.target.value)} required>
              <option value="">Choisis le genre</option>
              {motionsGenres.map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
          </div>
        ))}
        <button type="button" className="btn btn-add-element" onClick={addGenreField}>
          Ajouter un genre
        </button>

        <div className="form-group">
          <label htmlFor="picture">Image de l'oeuvre</label>
          <input type="file" id="picture" name="picture" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
        </div>

        <figure id="motion_img">
          <img src={`${API_URL}/${image}`} alt={title} />
        </figure>

        <button type="submit" className="btn">
          Valider les modifications
        </button>
      </form>
    </div>
  );
};

export default ModifyMotionForm;
