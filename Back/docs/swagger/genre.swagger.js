/**
 * @swagger
 * components:
 *   schemas:
 *     Genre:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Animation
 */

/**
 * @swagger
 * /genres:
 *   get:
 *     summary: Récupérer tous les genres de films/œuvres
 *     tags: [Genres]
 *     responses:
 *       200:
 *         description: Liste des genres de films/œuvres
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
 *                   example: "genre not found"
 *                 details:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: "Il semble que les genres ne s'affichent pas, nous mettons tout en œuvre pour résoudre le problème"
 */
