/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         pseudo:
 *           type: string
 *           example: Alice
 *         email:
 *           type: string
 *           example: alice@email.com
 */

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Créer un nouvel utilisateur
 *     tags: [Utilisateurs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pseudo:
 *                 type: string
 *                 example: Alice
 *               email:
 *                 type: string
 *                 example: alice@email.com
 *               password:
 *                 type: string
 *                 example: motdepasse123
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 201
 *                 userId:
 *                   type: integer
 *                   example: 1
 *       400:
 *         description: Données invalides ou utilisateur déjà existant
 */

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Authentifier un utilisateur
 *     tags: [Utilisateurs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: alice@email.com
 *               password:
 *                 type: string
 *                 example: motdepasse123
 *     responses:
 *       200:
 *         description: Connexion réussie, tokens retournés
 *       401:
 *         description: Identifiants invalides
 */

/**
 * @swagger
 * /refresh-token:
 *   post:
 *     summary: Générer un nouveau token d'accès à partir d'un refresh token valide
 *     tags: [Utilisateurs]
 *     responses:
 *       200:
 *         description: Nouveau token généré
 *       401:
 *         description: Refresh token manquant ou invalide
 */

/**
 * @swagger
 * /user/verify:
 *   post:
 *     summary: Vérifier le mot de passe de l'utilisateur courant (authentifié)
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 example: motdepasse123
 *     responses:
 *       200:
 *         description: Mot de passe correct
 *       401:
 *         description: Non autorisé ou mot de passe incorrect
 */

/**
 * @swagger
 * /user/logout:
 *   post:
 *     summary: Déconnecter l'utilisateur (suppression du refresh token)
 *     tags: [Utilisateurs]
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 */

/**
 * @swagger
 * /user/{id}:
 *   patch:
 *     summary: Modifier les informations d'un utilisateur (authentifié, propriétaire)
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pseudo:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Utilisateur modifié avec succès
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Utilisateur non trouvé
 */

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Supprimer un utilisateur (authentifié, propriétaire)
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur à supprimer
 *     responses:
 *       200:
 *         description: Utilisateur supprimé avec succès
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Utilisateur non trouvé
 */

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Récupérer tous les utilisateurs (admin uniquement)
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     description: Cette route nécessite d'être administrateur.
 *     responses:
 *       200:
 *         description: Liste de tous les utilisateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Non autorisé, l'utilisateur doit être administrateur
 */

/**
 * @swagger
 * /admin/user/{id}:
 *   delete:
 *     summary: Supprimer un utilisateur par un administrateur
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur à supprimer
 *     responses:
 *       200:
 *         description: Utilisateur supprimé avec succès
 *       401:
 *         description: Non autorisé, l'utilisateur doit être administrateur
 *       404:
 *         description: Utilisateur non trouvé
 */
/**
 * @swagger
 * /user/forgotPassword:
 *   post:
 *     summary: Demander la réinitialisation du mot de passe
 *     tags: [Utilisateurs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: alice@email.com
 *     responses:
 *       200:
 *         description: Lien de réinitialisation envoyé (si l'email existe)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Si cet email existe, un lien de réinitialisation a été envoyé.
 *       404:
 *         description: Utilisateur non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /user/resetPassword/{token}:
 *   post:
 *     summary: Réinitialiser le mot de passe avec un token valide
 *     tags: [Utilisateurs]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Token de réinitialisation envoyé par email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *                 example: MonNouveauMotDePasse123!
 *               confirm:
 *                 type: string
 *                 example: MonNouveauMotDePasse123!
 *     responses:
 *       200:
 *         description: Mot de passe réinitialisé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Mot de passe réinitialisé avec succès.
 *       400:
 *         description: Les mots de passe ne correspondent pas ou données invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Token invalide ou expiré
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Utilisateur non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Error:
 *       type: object
 *       properties:
 *         status:
 *           type: integer
 *           example: 400
 *         message:
 *           type: string
 *           example: Une erreur est survenue
 *         details:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Détail de l'erreur"]
 */
