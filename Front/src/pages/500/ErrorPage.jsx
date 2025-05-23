import Header from "../../component/Partials/Header/Header.jsx";
import Footer from "../../component/Partials/Footer/Footer.jsx";

/**
 * Composant de page d'erreur 500 personnalisé.
 * Affiche un message d'erreur avec une image, ainsi que le Header et Footer du site.
 *
 * Ce composant est utilisé comme fallback dans un `ErrorBoundary` de `react-error-boundary`.
 * Le bouton permet de réinitialiser l'ErrorBoundary via la fonction `resetErrorBoundary`
 * afin de tenter un nouveau rendu.
 *
 * @param {Object} props - Les propriétés du composant.
 * @param {Function} props.resetErrorBoundary - Fonction fournie par react-error-boundary
 * qui permet de réinitialiser l'état de l'ErrorBoundary.
 *
 * @returns {JSX.Element} Une page d'erreur complète avec header, contenu et footer.
 */
const ErrorPage = ({ resetErrorBoundary }) => {
  return (
    <>
      <Header />
      <main>
        <title>500 | Ciné Délices</title>
        <meta name="description" content="Page d'erreur 500" />

        <div className="error-page">
          <img src="/images/error-page.webp" alt="error-page-image" className="error-image" />

          <button
            className="btn btn-error-page"
            onClick={() => {
              resetErrorBoundary();
            }}
          >
            Retour
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ErrorPage;
