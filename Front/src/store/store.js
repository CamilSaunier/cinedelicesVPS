// On importe la fonction 'create' de Zustand pour créer un store global
import { create } from "zustand";

// On importe deux fonctions utilitaires pour gérer le token JWT (stockage et suppression)
import { setAuthToken, removeAuthToken } from "./authToken"; // Utilitaires locaux

// On importe la fonction pour décoder un JWT
import jwtDecode from "jwt-decode";

/**
 * création d'un Zustand store pour gérer l'état utilisateur dans l'application.
 * Ce store centralise la logique d'authentification et les données utilisateur.
 */
export const useUserStore = create((set) => ({
  // @property  user - Données de l'utilisateur actuellement connecté, ou null si aucun.

  user: null,

  /**
   * Authentifie l'utilisateur en stockant le token et en extrayant les infos via le décodage JWT.
   * @function login
   * @param  jwtToken - Le token JWT retourné par le backend après une authentification ou une modification.
   *
   * Le token est :
   * - Stocké en localStorage via `setAuthToken`
   * - Décodé pour en extraire `pseudo`, `userId` et `email`
   * - Les données sont ensuite stockées dans le store Zustand
   */
  login: (jwtToken) => {
    try {
      const decoded = jwtDecode(jwtToken);
      setAuthToken(jwtToken); // Stockage en localStorage
      set(() => ({
        user: {
          pseudo: decoded.pseudo,
          id: decoded.userId,
          email: decoded.email,
          role: decoded.role,
          token: jwtToken,
        },
      }));
      // console.log("User connected:", decoded.pseudo);
    } catch (error) {
      console.error("Échec du décodage du token :", error);
    }
  },

  /**
   * Déconnecte l'utilisateur.
   *
   * @function logout
   * Supprime le token du localStorage et réinitialise l'état `user` à `null`.
   */
  logout: () => {
    removeAuthToken();
    set({ user: null });
  },

  // Fonction pour rafraîchir le token
  refreshToken: (newToken) => {
    setAuthToken(newToken);
    set((state) => ({
      user: { ...state.user, token: newToken },
    }));
  },
}));
