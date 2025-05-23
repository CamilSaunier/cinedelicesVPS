import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "../utils/toast.js";
import { getAuthToken } from "../store/authToken.js";
import jwt_decode from "jwt-decode";
import { refreshAccessToken } from "../api/userApi.js";
import { useErrorHandler } from "../api/apiErrorHandler.js";

const IsAdmin = () => {
  // ----------------- HOOK D'ERREUR-----------------
  /**
   * @hook
   * hook pour la gestion d'erreur
   */
  const handleError = useErrorHandler(); // Hook de gestion d'erreurs
  //State qui attend la validation pour afficher la page
  const [validated, setValidated] = useState(false);
  //State qui attend la validation du rôle de l'utilisateur
  const [isAdmin, setIsAdmin] = useState(false);
  // Référence persistante pour éviter l'affichage en plusieurs fois du toast
  // useRef est utilisé pour garder une valeur persistante entre les rendus sans provoquer de re-rendu

  // ----------------- ACTION À CHAQUE CHARGEMENT DE LA PAGE-----------------
  /**
   * Effet déclenché à chaque changement de `token` ou `userRole`.
   * Affiche un message d'erreur si l'utilisateur n'est pas authentifié ou n'a pas le rôle d'admin.
   */
  useEffect(() => {
    // Fonction qui vérifie que l'utilisateur coche bien tous les critères pour accéder à la page
    const checkAdminAccess = async () => {
      let token;

      try {
        //Récupération du token depuis le localStorage
        token = getAuthToken();
        //Déjà, si il n'y a pas de token c'est que l'user n'est pas connecté
        if (!token) {
          setValidated(true);
          return;
        }
      } catch (error) {
        handleError(error);
      }
      // ----------------- ON VÉRIFIE SI LE TOKEN EST TOUJOURS VALIDE -----------------
      try {
        //On décode le token existant
        const decoded = jwt_decode(token);
        //Vérification de si le token est périmé
        //.exp est une propriété spécifique au format JWT (JSON Web Token). Qui récupère la date d'expiration du token
        //À la création du token, JWT génére une date de péremption du token (par exemple 12 mai 2025 à 11:05)
        //Ici on vérifie que cette date de péremption n'est pas inférieure à la date actuelle
        //ex : 12 mai 2025 à 11:05 < 12 mai 2023 à 11:06 = Le token est périmé
        const isExpired = decoded.exp < Date.now() / 1000;

        if (isExpired) {
          // Si le token est expiré, on appelle l'API pour le rafraichir
          try {
            await refreshAccessToken(); // cela devrait mettre à jour le token dans le localStorage
            token = getAuthToken(); // On récupère le nouveau token
          } catch (error) {
            handleError(error);
            toast.error("Session expirée, veuillez vous reconnecter.");
            setValidated(true);
            return;
          }
        }

        // ----------------- DECODE DU TOKEN POUR EXTRAIRE LE ROLE ------
        //On décode le nouveau token
        const newDecoded = jwt_decode(token);
        //oO vérifie qu'il a bien le rôle admin
        if (newDecoded.role === "admin") {
          //Si oui, on set le state admin sur true
          setIsAdmin(true);
          //Sinon 404
        }
      } catch (error) {
        handleError(error);
      }

      setValidated(true);
    };

    checkAdminAccess();
  }, []);

  // ----------------- GESTION DES ACCÈS -----------------
  if (!validated) return null; // ou un loader

  //Si on n'a pas reussi a récupérer le token dans les local storage alors on re dirige l'user vers la page 404
  if (!getAuthToken()) {
    return <Navigate to="/*" replace />;
  }
  //Si l'user n'a pas le bon rôle, il est redirigé vers la page d'accueil
  if (!isAdmin) {
    return <Navigate to="/*" replace />;
  }
  //Sinon, si tout se passe bien, il peut afficher la page enfant
  return <Outlet />;
};

export default IsAdmin;
