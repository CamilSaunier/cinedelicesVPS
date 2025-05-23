import { BrowserRouter } from "react-router-dom";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import ErrorPage from "./pages/500/ErrorPage.jsx";
import { ErrorBoundary } from "react-error-boundary";
import Footer from "./component/Partials/Footer/Footer.jsx";
import Header from "./component/Partials/Header/Header.jsx";

// resetKeys={[location.pathname]}> = reset l'erreur quand l'URL change
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ErrorBoundary FallbackComponent={ErrorPage} resetKeys={[location.pathname]}>
        <Header />
        <App />
        <Footer />
      </ErrorBoundary>
    </BrowserRouter>
  </StrictMode>
);
