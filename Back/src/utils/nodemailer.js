import "dotenv/config";
import nodemailer from "nodemailer";

/**
 * Crée et retourne un transporteur nodemailer configuré pour Gmail.
 *
 * Explications :
 * - host : le serveur SMTP de Gmail.
 * - port : 587 = port pour TLS (connexion sécurisée moderne, recommandée).
 * - secure :
 *     - false = la connexion commence non chiffrée, puis passe en sécurisé avec TLS (STARTTLS).
 *     - true = connexion sécurisée dès le début avec SSL (ancien protocole, port 465).
 *   Gmail recommande d'utiliser TLS sur le port 587 avec secure: false.
 * - auth : identifiants de connexion (email et mot de passe d'application, à mettre dans le .env).
 *
 * Résumé :
 *   → secure: false + port: 587 = connexion sécurisée avec TLS (STARTTLS), c'est la bonne pratique moderne.
 *   → secure: true + port: 465 = connexion sécurisée avec SSL (ancien, à éviter).
 *
 * @returns {import('nodemailer').Transporter}
 */
export function getTransporter() {
  return nodemailer.createTransport({
    host: "smtp.gmail.com", // Serveur SMTP de Gmail
    port: 587, // Port pour TLS (STARTTLS)
    secure: false, // false = STARTTLS (TLS moderne), true = SSL (ancien)
    auth: {
      user: process.env.MAIL_ADMIN, // Incrémente l'adresse email dans .env (MAIL_USER)
      pass: process.env.MAIL_PASS, // Incrémente le mot de passe d'application dans .env (MAIL_PASS)
    },
  });
}
