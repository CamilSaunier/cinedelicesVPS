/**
 * @swagger
 * components:
 *   schemas:
 *     Difficulty:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 2
 *         name:
 *           type: string
 *           example: Facile
 */

/**
 * @swagger
 * /dishesDifficulty:
 *   get:
 *     summary: Récupérer toutes les difficultés de plats
 *     tags: [Difficultés]
 *     responses:
 *       200:
 *         description: Liste des difficultés de plats
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Difficulty'
 *       404:
 *         description: Aucune difficulté trouvée
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
 *                   example: "difficulty not found"
 *                 details:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: "Il semble que les difficultées de plats ne s'affichent pas, nous mettons tout en œuvre pour résoudre le problème"
 */
