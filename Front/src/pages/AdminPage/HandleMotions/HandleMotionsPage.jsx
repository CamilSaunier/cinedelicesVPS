import React from "react";
import DeleteMotion from "./components/DeleteMotion.jsx";
import ModifyMotionForm from "./components/ModifyMotionForm.jsx";


/**
 * @description Page d'administration pour gérer les films/séries.
 * @param {Array} motionsList - Liste des films/séries
 * @param {Function} setMotionsList - Fonction pour mettre à jour la liste des films/séries
 * @returns {JSX.Element} La page d'administration pour gérer les films/séries.
 */


// ----------------- Page d'administration des films/séries -----------------
const HandleMotionsPage = ({ motionsList, setMotionsList }) => {
  return (
    <>
      <ModifyMotionForm motionsList={motionsList} />
      <DeleteMotion motionsList={motionsList} setMotionsList={setMotionsList} />
    </>
  );
};

export default HandleMotionsPage;
