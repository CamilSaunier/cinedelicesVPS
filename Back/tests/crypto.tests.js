/**
 * @fileoverview
 * Tests unitaires pour les fonctions de hachage, comparaison et gestion des JWT.
 *
 * Fonctions testées :
 * - hash : hashage d'un mot de passe
 * - compare : comparaison d'un mot de passe avec son hash
 * - generateJwtToken : génération d'un JWT à partir d'un payload
 * - verifyJwtToken : vérification et décodage d'un JWT
 *
 * Utilise node:test et node:assert pour les assertions.
 *
 * Pour exécuter ces tests :
 *   node --test tests/crypto.tests.js
 */

//Importe des fonctions nécessaires pour écrire les tests depuis le module 'node:test'
import { describe, it } from "node:test";
//Import du module d’assertions pour vérifier les résultats
import assert from "node:assert";
//Import les fonctions à tester du fichier crypto.js
import { hash, compare, generateJwtToken, verifyJwtToken } from "../src/utils/crypto.js";
//Import de JWT pour manipuler et vérifier les tokens
import jwt from "jsonwebtoken";
//Charge les variables d'environnement depuis le fichier .env.exemple
import "dotenv/config";

// ----------------------------------------
//test pour la fonction d'hashage de mot de passe
// ----------------------------------------

/**
 * Tests pour la fonction hash :
 * - Vérifie que le hash généré est différent du mot de passe original
 * - Vérifie que la comparaison avec le bon mot de passe retourne true
 * - Vérifie que la comparaison avec un mauvais mot de passe retourne false
 */
describe("hash", () => {
  // Test pour vérifier que le hash généré est différent du mot de passe original
  it(" devrait renvoyer un mot de passe chiffré différent du mot de passe d'origine", async () => {
    // Mot de passe d'origine
    const plainPassword = "MySecurePassword123";
    // Hash du mot de passe
    const hashedPassword = await hash(plainPassword);
    // Vérifie que le hash a bien été généré
    assert.ok(hashedPassword);
    // Vérifie que le hash est différent du mot de passe brut
    assert.notStrictEqual(hashedPassword, plainPassword);
    // Vérifie que le hash correspond au mot de passe d'origine (test de validité du hash)
    const isMatch = await compare(plainPassword, hashedPassword);
    // Doit être égal à true
    assert.strictEqual(isMatch, true);
  });

  // Test pour vérifier que la comparaison avec un mauvais mot de passe renvoie false
  it("invalide si le mot de passe est incorrect", async () => {
    // Mot de passe correct
    const plainPassword = "CorrectPassword";
    // Mauvais mot de passe
    const wrongPassword = "WrongPassword";
    // Hash du bon mot de passe
    const hashedPlainPassword = await hash(plainPassword);
    // Le mauvais mot de passe ne doit pas correspondre au hash
    const isMatch = await compare(wrongPassword, hashedPlainPassword);
    // Doit être égal à false
    assert.strictEqual(isMatch, false);
  });
});

// ------------------------------------------------
//test de la fonction de comparaison de mot de passe
// ------------------------------------------------

/**
 * Tests pour la fonction compare :
 * - Vérifie que la comparaison avec le bon mot de passe retourne true
 * - Vérifie que la comparaison avec un mauvais mot de passe retourne false
 * - Vérifie qu'une erreur est levée si le hash est invalide
 */
describe("compare", () => {
  // Test pour vérifier que le mot de passe brut correspond à son hash
  it("doit renvoyer true lors de la comparaison d'un mot de passe ordinaire correct avec son hachage", async () => {
    // Mot de passe correct
    const plainPassword = "MyStrongPassword42";
    // Hash du bon mot de passe
    const hashedPassword = await hash(plainPassword);
    // Vérifie que le hash correspond au mot de passe d'origine (test de validité du hash)
    const isMatch = await compare(plainPassword, hashedPassword);
    // Doit être égal à true
    assert.strictEqual(isMatch, true);
  });

  // Test pour vérifier que la comparaison d'un mot de passe hash avec un mauvais mot de pass renvoi bien false
  it(" doit renvoyer false lors de la comparaison d'un mot de passe invalide avec un mot de passe valide haché", async () => {
    // Mot de passe correct
    const correctPassword = "MyStrongPassword42";
    // Mauvais mot de passe
    const wrongPassword = "NotMyPassword123";
    // Hash du bon mot de passe
    const hashedPassword = await hash(correctPassword);
    // comparraison du mot de passe hash et du mauvais mot de passe
    const isMatch = await compare(wrongPassword, hashedPassword);
    // Le mauvais mot de passe ne doit pas correspondre au hash
    // Doit être égal à false
    assert.strictEqual(isMatch, false);
  });

  // Test pour vérifier que la comparaison avec un hash invalide lance une erreur
  it("doit renvoyer une erreur lorsque le mot de passe haché est invalide", async () => {
    // Mot de passe correct
    const plainPassword = "MyStrongPassword42";
    // Mot de passe invalide
    const invalidHash = "thisIsNotAValidHash";
    //try catch pour attraper les erreurs
    try {
      // comparraison du mot de passe et du mauvais mot de passe
      await compare(plainPassword, invalidHash);
      // La comparaison doit renvoyer une erreur
      assert.fail("la comparaison aurait dû générer une erreur avec un hashage invalide");
    } catch (error) {
      // Vérifie qu'une erreur est bien levée
      assert.ok(error instanceof Error);
    }
  });
});

// ------------------------------------------------
//test pour la fonction qui génère un JWT Token
// ------------------------------------------------

/**
 * Tests pour la fonction generateJwtToken :
 * - Vérifie que le token généré est valide et contient le bon payload
 * - Vérifie que le token possède une date d'expiration
 */

// Simule une clé secrète si elle n'est pas déjà définie
process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret-key";

// Test pour vérifier la generation d'un Token
describe("generateJwtToken", () => {
  // Test qui vérifie que le token contient bien les informations du payload
  it("devrait renvoyer un jeton JWT valide avec un payload correcte", () => {
    // Génère un payload
    const payload = {
      userId: 1,
      email: "test@example.com",
      pseudo: "pseudoDu28",
      role: "user",
    };
    // Génère un token
    const token = generateJwtToken(payload);
    // Le token doit exister
    assert.ok(token);
    // Le token doit être une chaîne de caractère
    assert.strictEqual(typeof token, "string");
    // Décode le token pour vérifier son contenue
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // userId doit correspondre
    assert.strictEqual(decoded.userId, payload.userId);
    // email doit correspondre
    assert.strictEqual(decoded.email, payload.email);
    // pseudo doit correspondre
    assert.strictEqual(decoded.pseudo, payload.pseudo);
    // role doit correspondre
    assert.strictEqual(decoded.role, payload.role);
    // Vérifie que l'expiration existe (en secondes UNIX)
    assert.ok(decoded.exp);
  });
});

// ------------------------------------------------
//test de la fonction qui verifie un JWT Token
// ------------------------------------------------

/**
 * Tests pour la fonction verifyJwtToken :
 * - Vérifie qu'un token valide est bien décodé et retourne le bon payload
 * - Vérifie qu'un token invalide retourne null
 * - Vérifie qu'un token expiré retourne null
 */

// Test de verification de la fonction pour verifier un token
describe("verifyJwtToken", () => {
  // Test qui vérifie que le token est bien décodé avec un token valide et renvoi le payload avec ces informations
  it(" devrait renvoyer le payload décodé avec un jeton validé", () => {
    // Génère un payload
    const payload = {
      userId: 42,
      email: "decode@example.com",
      pseudo: "pseudoDu28",
      role: "admin",
    };
    // Génère un token avec le payload
    const token = generateJwtToken(payload);
    // Vérifie que verifyJwtToken décode correctement
    const result = verifyJwtToken(token);
    // userId doit correspondre
    assert.strictEqual(result.userId, payload.userId);
    // email doit correspondre
    assert.strictEqual(result.email, payload.email);
    // pseudo doit correspondre
    assert.strictEqual(result.pseudo, payload.pseudo);
    // role doit correspondre
    assert.strictEqual(result.role, payload.role);
  });

  //   Test qui vérifie l'arret de la fonction si un token invalide est communiquer
  it("devrait renvoyer null en cas de de jeton invalide", () => {
    // Génère un Token invalide
    const invalidToken = "invalid.token.structure";
    // Vérifie que verifyJwtToken renvoi l'erreur
    const result = verifyJwtToken(invalidToken);
    // Le résultat doit etre null (erreur)
    assert.strictEqual(result, null);
  });

  // Test qui vérifie l'arret de la fonction si un token expiré a été communiquer
  it("devrait renvoyer null en cas de jeton expiré", async () => {
    // Génère un token qui expire immédiatement
    const shortToken = jwt.sign({ userId: 7 }, process.env.JWT_SECRET, { expiresIn: "1ms" });
    // Attends un peu que le token expire
    await new Promise((resolve) => setTimeout(resolve, 10));
    // Vérifie que verifyJwtToken retourne null pour un token expiré
    const result = verifyJwtToken(shortToken);
    // Le résultat doit etre null
    assert.strictEqual(result, null);
  });
});
