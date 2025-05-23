// Middleware de gestion des erreurs pour Express.

/**
 * Gestion des erreurs dans l'application Express.
 * @param {Error} error - L'erreur à traiter.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {Function} next
 */

// Middleware de gestion des erreurs pour Express.
export const errorHandler = (error, req, res, next) => {
  const status = error.statusCode || 500; // Code d'état HTTP par défaut à 500 (erreur interne du serveur)
  const message = error.message || "Une erreur est survenue"; // Message d'erreur par défaut
  const details = error.details || []; 
  

  // Vérification pour le type d'erreur de rate limit
  // Si l'erreur a un type spécifique, on peut le gérer différemment, ici le type est "RateLimitError"
  // et il est défini dans le middleware de rate limit
  if (error.type === "RateLimitError") {
    // Si c'est une erreur de rate limit, on renvoie un message spécifique
    const resetTime = error.resetTime || Date.now() / 1000; // Si l'heure de reset est fournie
    // Sinon, on utilise l'heure actuelle
    const resetDate = new Date(resetTime * 1000);
    // On crée une nouvelle date à partir de l'heure de reset
    return res.status(429).json({
      status: 429, // HTTP 429 Too Many Requests
      message: `Trop de tentatives. Essayez à nouveau après ${resetDate.toLocaleTimeString()}.`, // Message d'erreur
      details: ["Trop de tentatives, veuillez réessayer dans 15 minutes"], // Détails supplémentaires
    });
  }
   
  // Si ce n'est pas une erreur de rate limit, on gère normalement
  return res.status(status).json({ status, message, details });
};
