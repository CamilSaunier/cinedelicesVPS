/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Genre:
 *       type: object
 *       properties:
 *         id: { type: integer, example: 1 }
 *         name: { type: string, example: Animation }
 *     Format:
 *       type: object
 *       properties:
 *         id: { type: integer, example: 12 }
 *         name: { type: string, example: Série animée }
 *     Motion:
 *       type: object
 *       properties:
 *         id: { type: integer, example: 1 }
 *         title: { type: string, example: Naruto }
 *         picture: { type: string, example: /uploads/movies/1.webp }
 *         release_date: { type: string, example: 03-10-2002 }
 *         director: { type: string, example: Hayato Date }
 *         catchphrase: { type: string, example: Le ninja le plus déterminé }
 *         description: { type: string, example: L'aventure d'un jeune ninja... }
 *         genres:
 *           type: array
 *           items: { $ref: '#/components/schemas/Genre' }
 *         format: { $ref: '#/components/schemas/Format' }
 *     Author:
 *       type: object
 *       properties:
 *         pseudo: { type: string, example: Alice }
 *     Category:
 *       type: object
 *       properties:
 *         id: { type: integer, example: 2 }
 *         name: { type: string, example: Plat principal }
 *     Difficulty:
 *       type: object
 *       properties:
 *         id: { type: integer, example: 2 }
 *         name: { type: string, example: Facile }
 *     Ingredient:
 *       type: object
 *       properties:
 *         id: { type: integer, example: 5 }
 *         name: { type: string, example: Miso }
 *         quantity: { type: number, example: 2 }
 *         unit: { type: string, example: cuillères à soupe }
 *     Recipe:
 *       type: object
 *       properties:
 *         id: { type: integer, example: 1 }
 *         title: { type: string, example: Miso Ramen de Naruto }
 *         picture: { type: string, example: /uploads/recipes/1.webp }
 *         description: { type: string, example: Un bol de ramen chaud et nourrissant... }
 *         instruction: { type: string, example: "1. Préparer un dashi..." }
 *         anecdote: { type: string, example: C'est le plat préféré de Naruto... }
 *         completion_time: { type: integer, example: 40 }
 *         created_at: { type: string, format: date-time, example: 2025-05-13T07:25:06.033Z }
 *         updated_at: { type: string, format: date-time, example: 2025-05-13T08:30:00.000Z }
 *         motion: { $ref: '#/components/schemas/Motion' }
 *         author: { $ref: '#/components/schemas/Author' }
 *         category: { $ref: '#/components/schemas/Category' }
 *         difficulty: { $ref: '#/components/schemas/Difficulty' }
 *         ingredients:
 *           type: array
 *           items: { $ref: '#/components/schemas/Ingredient' }
 */

/**
 * @swagger
 * /recipes:
 *   get:
 *     summary: Récupérer toutes les recettes
 *     tags: [Recettes]
 *     responses:
 *       200:
 *         description: Liste des recettes avec tous les détails et associations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Recipe'
 *       404:
 *         description: Aucune recette n'a été trouvée.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: integer, example: 404 }
 *                 message: { type: string, example: "recipes not found" }
 *                 details:
 *                   type: array
 *                   items: { type: string, example: "Il semble que les recettes ne s'affichent pas, nous mettons tout en œuvre pour résoudre le problème" }
 */

/**
 * @swagger
 * /recipes/search/{search}:
 *   get:
 *     summary: Rechercher des recettes par mot-clé
 *     tags: [Recettes]
 *     parameters:
 *       - in: path
 *         name: search
 *         required: true
 *         schema: { type: string }
 *         description: Mot-clé à rechercher dans le titre des recettes ou des œuvres associées
 *     responses:
 *       200:
 *         description: Liste des recettes correspondant au mot-clé de recherche
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Recipe'
 *       404:
 *         description: Aucune recette trouvée pour ce mot-clé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: integer, example: 404 }
 *                 message: { type: string, example: "recipe not found" }
 *                 details:
 *                   type: array
 *                   items: { type: string, example: "Il semble que la recette que vous cherchez n'existe pas" }
 */

/**
 * @swagger
 * /recipes/{id}:
 *   get:
 *     summary: Récupérer une recette par son ID
 *     tags: [Recettes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID de la recette à récupérer
 *     responses:
 *       200:
 *         description: Détails de la recette avec toutes ses associations
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 *       404:
 *         description: Recette non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: "La recette que vous cherchez n'existe pas" }
 */

/**
 * @swagger
 * /recipes:
 *   post:
 *     summary: Créer une nouvelle recette (utilisateur authentifié)
 *     tags: [Recettes]
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
 *               title: { type: string, example: "Miso Ramen de Naruto" }
 *               description: { type: string, example: "Un bol de ramen chaud et nourrissant..." }
 *               instruction: { type: string, example: "1. Préparer un dashi..." }
 *               anecdote: { type: string, example: "C'est le plat préféré de Naruto..." }
 *               completion_time: { type: integer, example: 40 }
 *               picture: { type: string, format: binary, description: L'image de la recette (fichier à télécharger) }
 *               user_id: { type: integer, example: 1 }
 *               dish_category_id: { type: integer, example: 2 }
 *               difficulty_id: { type: integer, example: 2 }
 *               motion_id: { type: integer, example: 1 }
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     ingredient_id: { type: integer, example: 3 }
 *                     quantity: { type: number, example: 2 }
 *                     unit: { type: string, example: "tasses" }
 *     responses:
 *       201:
 *         description: Recette créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: "Recipe successfully created!" }
 *                 recipeId: { type: integer, example: 1 }
 *       400:
 *         description: Données invalides ou erreurs de validation
 *       401:
 *         description: Non autorisé, l'utilisateur doit être authentifié
 *       500:
 *         description: Erreur serveur interne
 */

/**
 * @swagger
 * /admin/recipes/{id}:
 *   patch:
 *     summary: Modifier une recette existante (admin uniquement)
 *     tags: [Recettes]
 *     security:
 *       - bearerAuth: []
 *     description: Cette route nécessite d'être administrateur.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID de la recette à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               instruction: { type: string }
 *               anecdote: { type: string }
 *               completion_time: { type: integer }
 *               user_id: { type: integer }
 *               dish_category_id: { type: integer }
 *               difficulty_id: { type: integer }
 *               motion_id: { type: integer }
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     ingredient_id: { type: integer }
 *                     quantity: { type: number }
 *                     unit: { type: string }
 *     responses:
 *       200:
 *         description: Recette mise à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: "Recette mise à jour avec succès." }
 *                 recipeId: { type: integer, example: 1 }
 *       401:
 *         description: Non autorisé, l'utilisateur doit être administrateur
 *       404:
 *         description: Recette non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: "Recette non trouvée." }
 */

/**
 * @swagger
 * /admin/recipes/{id}:
 *   delete:
 *     summary: Supprimer une recette par son ID (admin uniquement)
 *     tags: [Recettes]
 *     security:
 *       - bearerAuth: []
 *     description: Cette route nécessite d'être administrateur.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID de la recette à supprimer
 *     responses:
 *       200:
 *         description: Recette supprimée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: "Recette et image supprimées avec succès" }
 *       401:
 *         description: Non autorisé, l'utilisateur doit être administrateur
 *       404:
 *         description: Recette non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: integer, example: 404 }
 *                 message: { type: string, example: "recipe not found" }
 *                 details:
 *                   type: array
 *                   items: { type: string, example: "Il semble que la recette que vous cherchez n'existe pas" }
 */
