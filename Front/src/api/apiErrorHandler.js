import { useErrorBoundary } from "react-error-boundary";

/**
 * * Gère les erreurs en utilisant le hook useErrorBoundary de react-error-boundary.
 * @function useErrorHandler
 * @param {function} showBoundary - Fonction pour afficher la frontière d'erreur.
 * @param {Error} error - L'erreur à gérer.
 * @returns
 */

// Définition d'un hook adapté à la gestion des erreurs
export function useErrorHandler() {
  const { showBoundary } = useErrorBoundary();

  const handleError = (error) => {
    const statusCode = error.response?.status || error.status || error.statusCode || 500;

    if (error instanceof Error && statusCode === 500) {
      showBoundary(error); // maintenant ta page 500 s'affiche !
    }
  };

  return handleError;
}
