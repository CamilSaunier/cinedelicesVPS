// Hamburger Menu Toggle

/**
 * Fonction qui gère l'affichage du menu hamburger
 * Elle bascule l'état du menu entre ouvert et fermé
 * @function toggleMenu
 * @param {Event} event - L'événement de clic
 * @returns {void}
 */

// Au chargement du DOM, déclenchement de l'évènement
document.addEventListener("DOMContentLoaded", function () {
  const burgerIcon = document.querySelector(".burger_menu-icon");
  const closeIcon = document.querySelector(".burger_menu-close");
  const menu = document.querySelector(".menu");

  // Vérifie si les éléments existent avant d'ajouter des écouteurs d'événements
  function toggleMenu() {
    menu.classList.toggle("menu__open");
    burgerIcon.style.display = menu.classList.contains("menu__open") ? "none" : "block";
    closeIcon.style.display = menu.classList.contains("menu__open") ? "block" : "none";
  }

  burgerIcon.addEventListener("click", toggleMenu);
  closeIcon.addEventListener("click", toggleMenu);
});
