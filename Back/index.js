import "dotenv/config";
import express from "express";
import { router } from "./src/router.js";
import { xss } from "express-xss-sanitizer";
import cors from "cors";
import { errorHandler } from "./src/middlewares/errorHandlers.js";
import cookieParser from "cookie-parser";
import { swaggerUi, swaggerSpec } from "./docs/swagger/swagger.js";

const app = express(); // On crée une instance d'Express
app.set("trust proxy", 1); //Indique a express que ton app est derrière un proxy, ce qui est le cas sur render et perment l'envoi des cookies meme sur les navigateur sécurisé

app.use(cookieParser()); // Le middleware pour parser les cookies

app.use(express.json()); // Middleware pour parser le corps des requêtes JSON

// allowedOrigins est un tableau d'origines autorisées pour les requêtes CORS
// Si CORS_ORIGINS n'est pas défini dans le fichier .env, on autorise localhost:5173
const allowedOrigins = process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(",") : ["https://localhost:5173"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    allowedHeaders: "Content-Type, Authorization, X-Requested-With",
    methods: "GET, POST, PUT, DELETE, PATCH",
  })
);
// On définit le dossier public pour les fichiers statiques
app.use(express.static("public"));
// xss est un middleware qui permet de nettoyer les entrées de l'utilisateur pour éviter les attaques XSS
app.use(xss());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// Routes
app.use(router);
// Middleware gestion des erreurs
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  // On écoute sur le port défini dans le fichier .env
  console.log(`Listening on ${process.env.BASE_URL}:${process.env.PORT}`); // Affiche l'URL d'écoute
});
