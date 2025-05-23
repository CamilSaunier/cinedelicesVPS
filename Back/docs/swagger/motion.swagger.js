/**
 * @swagger
 * components:
 *   schemas:
 *     Motion:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: Naruto
 *         picture:
 *           type: string
 *           example: /uploads/movies/1.webp
 *         release_date:
 *           type: string
 *           example: 03-10-2002
 *         director:
 *           type: string
 *           example: Hayato Date
 *         catchphrase:
 *           type: string
 *           example: Le ninja le plus déterminé
 *         description:
 *           type: string
 *           example: L'aventure d'un jeune ninja...
 *         motion_format_id:
 *           type: integer
 *           example: 2
 *         genres:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Genre'
 */

/**
 * @swagger
 * /motions:
 *   get:
 *     summary: Récupérer toutes les œuvres (films/séries)
 *     tags: [Œuvres]
 *     responses:
 *       200:
 *         description: Liste des œuvres avec leurs recettes et genres associés
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Motion'
 *       404:
 *         description: Aucune œuvre trouvée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: "movies not found"
 *                 details:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: "Il semble que les films ne s'affichent pas, nous mettons tout en œuvre pour résoudre le problème"
 */

/**
 * @swagger
 * /motions/formats:
 *   get:
 *     summary: Récupérer tous les formats d'œuvres
 *     tags: [Œuvres]
 *     responses:
 *       200:
 *         description: Liste des formats d'œuvres
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Format'
 *       404:
 *         description: Aucun format trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: "formats not found"
 *                 details:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: "Il semble que les formats d'oeuvres ne s'affichent pas, nous mettons tout en œuvre pour résoudre le problème"
 */

/**
 * @swagger
 * /motions/genres:
 *   get:
 *     summary: Récupérer tous les genres d'œuvres
 *     tags: [Œuvres]
 *     responses:
 *       200:
 *         description: Liste des genres d'œuvres
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Genre'
 *       404:
 *         description: Aucun genre trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: "genres not found"
 *                 details:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: "Il semble que les genres d'oeuvres ne s'affichent pas, nous mettons tout en œuvre pour résoudre le problème"
 */

/**
 * @swagger
 * /motions:
 *   post:
 *     summary: Créer une nouvelle œuvre (utilisateur authentifié)
 *     tags: [Œuvres]
 *     security:
 *       - bearerAuth: []
 *     description: Cette route nécessite d'être connecté (token JWT).
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Naruto
 *               release_date:
 *                 type: string
 *                 example: 03-10-2002
 *               director:
 *                 type: string
 *                 example: Hayato Date
 *               catchphrase:
 *                 type: string
 *                 example: Le ninja le plus déterminé
 *               description:
 *                 type: string
 *                 example: L'aventure d'un jeune ninja...
 *               motion_format_id:
 *                 type: integer
 *                 example: 2
 *               picture:
 *                 type: string
 *                 format: binary
 *                 description: L'image de l'œuvre (fichier à télécharger)
 *               motion_genres:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     motion_genre_id:
 *                       type: integer
 *                       example: 1
 *     responses:
 *       201:
 *         description: Œuvre créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Motion successfully created!"
 *                 motionId:
 *                   type: integer
 *                   example: 1
 *       400:
 *         description: Données invalides ou erreurs de validation
 *       401:
 *         description: Non autorisé, l'utilisateur doit être authentifié
 *       500:
 *         description: Erreur serveur interne
 */

/**
 * @swagger
 * /admin/motions/{id}:
 *   delete:
 *     summary: Supprimer une œuvre par son ID (admin uniquement)
 *     tags: [Œuvres]
 *     security:
 *       - bearerAuth: []
 *     description: Cette route nécessite d'être administrateur.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'œuvre à supprimer
 *     responses:
 *       200:
 *         description: Œuvre et recettes associées supprimées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "oeuvre et recette associées supprimées avec succès"
 *       401:
 *         description: Non autorisé, l'utilisateur doit être administrateur
 *       404:
 *         description: Œuvre non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: "Motion not found"
 *                 details:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: "Il semble que l'oeuvre que vous cherchez n'existe pas"
 */
