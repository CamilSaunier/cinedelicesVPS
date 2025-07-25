//Dépendances
import { Navigate, Route, Routes } from "react-router";
import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
//Import des éléments du store
import { getAuthToken } from "./store/authToken.js";
import { useUserStore } from "./store/store.js";
//Route protecteur
import IsAuthed from "./IsAuthed/IsAuthed.jsx";
//Imports API
import { getRecipes } from "./api/index.js";
//Error Handler
import { useErrorHandler } from "./api/apiErrorHandler.js";
//Import des pages
import Home from "./pages/HomePage/homePage.jsx";
import Carnet from "./pages/Carnet/Carnet.jsx";
import Login from "./pages/Authentification/Login/Login.jsx";
import Register from "./pages/Authentification/Register/Register.jsx";
import AddRecipeForm from "./pages/AddRecipeForm/AddRecipeForm.jsx";
import RecipesList from "./pages/RecipesList/RecipesList.jsx";
import ProfilePage from "./pages/Authentification/ProfilePage/ProfilePage.jsx";
import Recipe from "./pages/Recipe/Recipe.jsx";
import SearchResultPage from "./pages/SearchResultPage/SearchResultPage.jsx";
import AddMotionForm from "./pages/AddMotionForm/addMotionForm.jsx";
import NotFoundPage from "./pages/404/404.jsx";
import LegalMention from "./pages/LegalMention/legalMention.jsx";

import IsAdmin from "./IsAuthed/IsAdmin.jsx";
import ResetPassword from "./pages/Authentification/ResetPassword/ResetPassword.jsx";
import AdminPage from "./pages/AdminPage/adminPage.jsx";
import MotionsList from "./pages/MotionsList/MotionsList.jsx";
import ScrollToTop from "./component/ScrollToTop.jsx";

function App() {
  const handleError = useErrorHandler(); // Hook de gestion d'erreurs

  const [recipes, setRecipes] = useState([]);

  const login = useUserStore((state) => state.login);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    //on charge toutes les recipes au chargement de la page
    const loadRecipes = async () => {
      try {
        const recipesData = await getRecipes();
        setRecipes(recipesData);
      } catch (error) {
        handleError(error); // Gestion de l'erreur
      }
    };

    loadRecipes();

    //Au chargement de la page, toujours, on va chercher dans le local storage si un token est présent
    const token = getAuthToken();

    // console.log(token);
    AOS.init({ duration: 1000, once: false });
    //si il trouve bien un token, alors il le décode, pour avoir accès à ses propriétés définies en back
    if (token) {
      try {
        // si on recharge la page on conserve le token
        login(token);
      } catch (err) {
        console.error("Token invalide ou expiré :", err.message);
      }
    }
  }, []);

  return (
    <>
      <main>
        <ScrollToTop />

        <Routes>
          {/* Routes accessibles à tous */}
          <Route path="/" element={<Home recipes={recipes} />} />
          <Route path="/search-results" element={<SearchResultPage />} />
          <Route path="/carnet" element={<Carnet recipes={recipes} />} />
          <Route path="/recipes/:id" element={<Recipe />} />
          <Route path="/recipes" element={<RecipesList recipes={recipes} />} />
          <Route path="/motions" element={<MotionsList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/contact" />
          <Route path="/legal-mention" element={<LegalMention />} />
          {/* Routes pour l'utilisateur connecté */}
          <Route element={<IsAuthed />}>
            <Route path="/user/me" element={<ProfilePage />} />
            <Route path="/recipes/create" element={<AddRecipeForm recipes={recipes} setRecipes={setRecipes} />} />
            <Route path="/motions/create" element={<AddMotionForm />} />
          </Route>
          {/* Routes pour l'admin connecté */}

          <Route element={<IsAdmin />}>
            <Route path="/user/admin" element={<AdminPage recipes={recipes} setRecipes={setRecipes} />} />
          </Route>

          {/* Fallback route */}
          <Route path="/*" element={<NotFoundPage />} />
          {/* on met ici notre page 404 personnalisé comme élément */}
        </Routes>
      </main>
    </>
  );
}

export default App;
