import rateLimit from "express-rate-limit";

// Limiteur de requêtes avec une fenêtre de 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 tentatives max

  // C’est cette fonction qui sera appelée quand la limite est atteinte
  handler: (req, res, next) => {
    const error = new Error("Trop de tentatives"); // message d'erreur
    error.statusCode = 429; // code erreur HTTP pour trop de requêtes
    // On ajoute un type d'erreur spécifique pour le rate limit
    error.type = "RateLimitError"; // type d'erreur
    error.resetTime = Date.now() / 1000 + 15 * 60; // heure de reset
    next(error); // Important : passe au errorHandler
  },

  standardHeaders: true, // Renvoie les en-têtes de la limite de vitesse dans `RateLimit-*`
  legacyHeaders: false, // Désactive les en-têtes `X-RateLimit-*` (deprecated)
});

export default limiter;
