import "izitoast/dist/css/iziToast.min.css";
// Importation de la bibliothèque iziToast pour l'affichage des notifications
import iziToast from "izitoast";

// Création de l'objet toast pour encapsuler les méthodes de gestion des notifications
const toast = {
  // Méthode qui initiliase et configuere les paramètres de iziToast
  init() {
    iziToast.settings({
      // Durée d'affichage de la notification (en millisecondes)
      timeout: 1000,
      // Réinitialiser la notification au passage de la souris
      resetOnHover: false,
      // Icône choisie pour les notifications
      icon: "material-icons",
      // Animation d'entrée de la notification
      transitionIn: "flipInX",
      // Animation de sortie de la notification
      transitionOut: "flipOutX",
      // Callback d'ouverture de la notification
      onOpening: function () {
        console.log("callback opened ! ");
      },
      // Callback de fermeture de la notification
      onClosing: function () {
        console.log("callback closed !");
      },
    });
  },
  // Affichage de la notification de suiccès
  success(message) {
    iziToast.success({ message });
  },

  // Affichage de la notification d'erreur
  error(message) {
    iziToast.error({ message });
  },
  // Affichage de la notification d'avertissement
  warning(message) {
    iziToast.warning({ message });
  },

  // Affichage de la notification d'information
  info(message) {
    iziToast.info({ message });
  },

  // Déclaration de la fonction de confirmation d'une action avec un objet de paramètres par défaut (destructuré directement)
  // définition des valeurs par défaut de l'objet si aucun argument n'est passé : un objet vide
  confirmAction({
    // Titre affiché dans la pop-up (valeur par défaut : "Confirmation")
    title = "Confirmation",
    // Message affiché dans la pop-up (valeur par défaut : "Êtes-vous sûr ?")
    message = "Êtes-vous sûr ?",
    // Fonction à exécuter quand l'utilisateur clique sur "confirmer" (à definir a l'utilisation)
    onConfirm = () => {},
    // Fonction à exécuter quand l'utilisateur clique sur "annuler" (à definir a l'utilisation)
    onCancel = () => {},
     // Texte du bouton de confirmation
    confirmText = "Oui",
    // Texte du bouton d'annulation
    cancelText = "Non",
    // Couleur de fond de la pop-up
    backgroundColor = "#E89FA4",
    // Couleur du texte du message
    messageColor = "black",
    // Position de la pop-up à l'écran
    position = "center",
  } = {}) {
    // Appel à la fonction iziToast.show pour afficher la pop-up personnalisée
    iziToast.show({
      title,
      message,
      messageColor,
      position,
      backgroundColor,
      // Tableau de boutons à afficher dans la pop-up
      buttons: [
        // Premier bouton : bouton de confirmation
        [
          `<button>${confirmText}</button>`,
          //fonction associé au boutton de confirmation
          function (instance, toast) {
            // Appel de la fonction onConfirm quand on clique dessus
            onConfirm();
            // Fermeture du toast avec une animation de type "fadeOut"
            instance.hide({ transitionOut: "fadeOut" }, toast, "button");
          },
          // focus on confirm button
          true, 
        ],
        // Deuxième bouton : bouton d'annulation
        [
          `<button>${cancelText}</button>`,
          //fonction associé au boutton d'annulation
          function (instance, toast) {
             // Appel de la fonction onCancel quand on clique dessus
            onCancel();
            // Fermeture du toast avec une animation de type "fadeOut"
            instance.hide({ transitionOut: "fadeOut" }, toast, "button");
          },
        ],
      ],
    });
  },
};

export default toast;
