import { BrowserRouter, useLocation } from "react-router-dom";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import ErrorPage from "./pages/500/ErrorPage.jsx";
import { ErrorBoundary } from "react-error-boundary";
import Footer from "./component/Partials/Footer/Footer.jsx";
import Header from "./component/Partials/Header/Header.jsx";

function Root() {
  const location = useLocation();
  return (
    <>
      <Header />
      <ErrorBoundary FallbackComponent={ErrorPage} resetKeys={[location.pathname]}>
        <App />
      </ErrorBoundary>
      <Footer />
    </>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Root />
    </BrowserRouter>
  </StrictMode>
);
