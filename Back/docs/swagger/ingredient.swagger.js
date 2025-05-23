/**
 * @swagger
 * components:
 *   schemas:
 *     Ingredient:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 5
 *         name:
 *           type: string
 *           example: Miso
 *         quantity:
 *           type: number
 *           example: 2
 *         unit:
 *           type: string
 *           example: cuillères à soupe
 */

/**
 * @swagger
 * /ingredients:
 *   get:
 *     summary: Récupérer tous les ingrédients
 *     tags: [Ingrédients]
 *     responses:
 *       200:
 *         description: Liste des ingrédients
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ingredient'
 *       404:
 *         description: Aucun ingrédient trouvé
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
 *                   example: "ingredient not found"
 *                 details:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: "Il semble que les ingrédients ne s'affichent pas, nous mettons tout en œuvre pour résoudre le problème"
 */

/**
 * @swagger
 * /admin/ingredients:
 *   post:
 *     summary: Créer un nouvel ingrédient (admin uniquement)
 *     tags: [Ingrédients]
 *     security:
 *       - bearerAuth: []
 *     description: Cette route nécessite d'être administrateur.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Miso"
 *     responses:
 *       201:
 *         description: Ingrédient créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Ingrédient créé avec succès"
 *                 ingredientId:
 *                   type: integer
 *                   example: 10
 *       400:
 *         description: Données invalides ou ingrédient déjà existant
 *       401:
 *         description: Non autorisé, l'utilisateur doit être administrateur
 *       500:
 *         description: Erreur serveur interne
 */

/**
 * @swagger
 * /admin/ingredients/{id}:
 *   delete:
 *     summary: Supprimer un ingrédient par son ID (admin uniquement)
 *     tags: [Ingrédients]
 *     security:
 *       - bearerAuth: []
 *     description: Cette route nécessite d'être administrateur.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'ingrédient à supprimer
 *     responses:
 *       200:
 *         description: Ingrédient supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Ingrédient supprimé avec succès"
 *       401:
 *         description: Non autorisé, l'utilisateur doit être administrateur
 *       404:
 *         description: Ingrédient non trouvé
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
 *                   example: "ingredient not found"
 *                 details:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: "Il semble que l'ingrédient que vous cherchez n'existe pas"
 */
