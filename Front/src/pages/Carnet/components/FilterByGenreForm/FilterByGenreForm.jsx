import React from "react";
import "./filterbygenreform.css";

/**------------------------------------------------------------------------------------------- 
 * Component contenant le système de filtrage par genre d'oeuvres
 *  il se concentre uniquement sur l'interface utilisateur
 * et délègue entièrement la gestion de l'état et de la logique de filtrage au parent (Carnet) 
 * @component
 * @param genres : tous les genres existant en BDD
 * @param selectedGenre: Le genre séléctionné par l'utilisateur dans le select
 * @param setSelectedGenre: Fonction pour mettre à jour le genre sélectionné.
 * @returns  Formulaire de sélection de genre.
/* ---------------------------------------------------------------------------------------------- */

const FilterByGenreForm = ({ genres, selectedGenre, setSelectedGenre }) => {
  // ----------------- RÉCUPÉRATION DES VALEURS DES CHAMPS UTILISATEUR-----------------
  /**
   * @param event - L'événement déclenché par le changement de valeur dans le select.
   * @function handleGenreChange
   * @description: Fonction appelée lors de la sélection d'un genre dans le formulaire.
   * Met à jour l'état du genre sélectionné dans le parent.
   */
  const handleGenreChange = (event) => {
    const selectionId = event.target.value;
    // on récupère la valeur de l'élément sur lequel le onChange joue ( c'est à dire le select )
    // On a défini sa value comme étant l'id du genre séléctionné (voir ligne 34)

    // ----------------- AFFICHAGE FILTRÉ DES FILMS-----------------

    if (selectionId === "all") {
      setSelectedGenre(null); // Réinitialiser le genre sélectionné si "Catégorie" est choisi
    } else {
      const genre = genres.find((genre) => genre.id === parseInt(selectionId));
      //On cherche dans tous les genre celui qui a le même ID
      setSelectedGenre(genre);
      //On met à jour l'état
    }
    // ----------------- RENDU----------------
  };
  return (
    <form>
      <select aria-label="filmCategory" name="filmCategory" className="select__category" value={selectedGenre ? selectedGenre.id : "all"} onChange={handleGenreChange}>
        {/* Au changement, ( quand l'utilisateur séléctionne un genre) on joue la fonction handleGenreChange */}

        {/* Afficher tous les genres disponibles : */}
        <option value="all">Catégorie</option>
        {genres.map((genre) => (
          <option key={genre.id} value={genre.id}>
            {genre.name}
          </option>
        ))}
      </select>
    </form>
  );
};

export default FilterByGenreForm;
