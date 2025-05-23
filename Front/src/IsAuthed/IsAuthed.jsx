import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import toast from "../utils/toast.js"; // Importation du toast pour les messages d'erreur
import { getAuthToken } from "../store/authToken.js"; // Récupération du token depuis le localStorage
import jwt_decode from "jwt-decode"; // Décodage du token JWT
import { refreshAccessToken } from "../api/userApi.js"; // Appel API pour rafraîchir le token
import { useErrorHandler } from "../api/apiErrorHandler.js";

/** ----------------------------------------------------------------------------------------------
 * Composant de protection d'accès basé sur l'authentification.
 * Si l'utilisateur n'est pas authentifié ou que son token est expiré sans possibilité de refresh,
 * il est redirigé vers la page de connexion.
 * Si le token est expiré mais que le refresh réussit, on lui permet d'accéder à la page.
 * ---------------------------------------------------------------------------------------------- */

const IsAuthed = () => {
  // ----------------- HOOK D'ERREUR-----------------
  /**
   * @hook
   * hook pour la gestion d'erreur
   */
  const handleError = useErrorHandler(); // Hook de gestion d'erreurs
  // Indique si la vérification de l'utilisateur est terminée
  const [validated, setValidated] = useState(false);

  // Indique si l'utilisateur est connecté avec un token valide
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  //Pour éviter l'affichage en plusieurs fois du toast
  const hasShownToast = useRef(false);

  // ----------------- ACTION LORS DU PREMIER RENDU -----------------
  /**
   * Effet déclenché au montage du composant pour :
   * - Vérifier si un token est présent
   * - Vérifier si ce token est expiré
   * - Tenter un rafraîchissement du token si nécessaire
   * - Autoriser ou refuser l'accès en fonction du résultat
   */
  useEffect(() => {
    const checkAuthAccess = async () => {
      // Récupération du token JWT stocké localement
      let token = getAuthToken();

      // ----------------- CAS : AUCUN TOKEN TROUVÉ -----------------
      if (!token) {
        // L'utilisateur n'est pas connecté
        setValidated(true); // On finit la vérification
        return;
      }

      try {
        // ----------------- DÉCODAGE DU TOKEN -----------------
        const decoded = jwt_decode(token);

        // ----------------- VÉRIFICATION D'EXPIRATION -----------------
        /**
         * .exp est une propriété standard des JWT : elle représente la date d’expiration en secondes UNIX.
         * Date.now() / 1000 : conversion de la date actuelle en secondes.
         * Si la date d'expiration est passée → le token est expiré.
         */
        const isExpired = decoded.exp < Date.now() / 1000;

        // ----------------- CAS : TOKEN EXPIRÉ -----------------
        if (isExpired) {
          try {
            await refreshAccessToken(); // Appel de l'API pour obtenir un nouveau token
            token = getAuthToken(); // Récupération du nouveau token du localStorage
          } catch (error) {
            // Échec du refresh (ex : refresh token expiré ou absent)
            handleError(error);
            toast.error("Session expirée, veuillez vous reconnecter.");
            setValidated(true); // Fin de la vérification
            return;
          }
        }

        // ----------------- VÉRIFICATION APRÈS REFRESH -----------------
        const refreshedDecoded = jwt_decode(token);
        if (refreshedDecoded) {
          setIsAuthenticated(true); // L'utilisateur est bien connecté
        }
      } catch (error) {
        // Erreur si le token est mal formé ou le décodage échoue
        handleError(error);
      }

      setValidated(true); //Fin de la vérification quelle qu'elle soit
    };

    checkAuthAccess(); // Exécution de la logique
  }, []);

  // ----------------- COMPORTEMENT D'AFFICHAGE -----------------
  /**
   * Tant que la vérification est en cours, on ne rend rien
   */
  if (!validated) return null;

  /**
   * Cas 1 : aucun token valide présent → redirection vers la page de connexion
   */
  if (!getAuthToken() || !isAuthenticated) {
    if (!hasShownToast.current) {
      toast.error("Veuillez d'abord vous authentifier");
      hasShownToast.current = true;
    }

    return <Navigate to="/login" replace />;
  }

  /**
   * Cas 2 : tout est bon → on autorise l’accès à la page protégée
   */
  return <Outlet />;
};

export default IsAuthed;
