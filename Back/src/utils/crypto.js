import "dotenv/config";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

// fonction qui permet de hasher le mdp
/**
 * Hash un mot de passe avec Argon2.
 * @param {string} password - Le mot de passe en clair à hasher.
 * @returns {Promise<string>} Le hash du mot de passe.
 */
export async function hash(password) {
  return await argon2.hash(password);
}

// fonction pour comparer le mdp
/**
 * Compare un mot de passe en clair avec un hash Argon2.
 * @param {string} plainTextPassword - Le mot de passe en clair.
 * @param {string} hashedPassword - Le hash du mot de passe.
 * @returns {Promise<boolean>} true si le mot de passe correspond, sinon false.
 */
export async function compare(plainTextPassword, hashedPassword) {
  return await argon2.verify(hashedPassword, plainTextPassword);
}
//fonction qui permet de générer un token JWT
/**
 * Génère un token JWT d'accès.
 * @param {object} payload - Les données à inclure dans le token.
 * @returns {string} Le token JWT signé.
 */
export function generateJwtToken(payload) {
  // console.log(payload);
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" });
} // générer une clé secrète en .env par la suite

/**
 * Génère un token JWT de rafraîchissement.
 * @param {object} payload - Les données à inclure dans le token.
 * @returns {string} Le token JWT de rafraîchissement signé.
 */
export function refreshJwtToken(payload) {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
}
/**
 * Génère un token JWT pour la réinitialisation de mot de passe.
 * @param {object} payload - Les données à inclure dans le token.
 * @returns {string} Le token JWT signé pour reset.
 */
export function generateResetPasswordToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" });
}
//fonction qui permet de vérifier le token
/**
 * Vérifie et décode un token JWT.
 * @param {string} token - Le token JWT à vérifier.
 * @returns {object|false} Les données décodées ou false si invalide.
 */
export function verifyJwtToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error(error);
    return null;
  }
}
// Vérifie le refresh token
/**
 * Vérifie et décode un token JWT de rafraîchissement.
 * @param {string} token - Le token JWT de rafraîchissement à vérifier.
 * @returns {object|null} Les données décodées ou null si invalide.
 */
export function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    console.error(error);
    return null;
  }
}
