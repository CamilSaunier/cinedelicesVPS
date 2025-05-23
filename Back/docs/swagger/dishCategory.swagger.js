/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 2
 *         name:
 *           type: string
 *           example: Plat principal
 */

/**
 * @swagger
 * /dishesCategories:
 *   get:
 *     summary: Récupérer toutes les catégories de plats
 *     tags: [Catégories]
 *     responses:
 *       200:
 *         description: Liste des catégories de plats
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       404:
 *         description: Aucune catégorie trouvée
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
 *                   example: "category not found"
 *                 details:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: "Il semble que les catégories de plats ne s'affichent pas, nous mettons tout en œuvre pour résoudre le problème"
 */
