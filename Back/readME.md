# 🎬🍜 Cines Délices - Back-end

Projet d’apothéose de fin d’étude  
Ce back-end propose une API REST pour gérer des recettes inspirées d’œuvres cinématographiques et animées.

---

## 🚀 Fonctionnalités principales

- Authentification JWT (inscription, connexion, refresh token)
- Gestion des utilisateurs (CRUD, rôles admin)
- Gestion des recettes, ingrédients, catégories, difficultés, œuvres, genres
- Upload d’images (recettes, œuvres)
- Documentation Swagger interactive
- Sécurité via middlewares (auth, admin, validation)
- Validation des données (schemas)

---

## 🗂️ Structure du projet

```
Back/
├── src/
│   ├── controllers/      # Logique métier (recettes, users, etc.)
│   ├── middlewares/      # Middlewares (auth, validation, etc.)
│   ├── models/           # Modèles Sequelize
│   ├── utils/            # Fonctions utilitaires (crypto, multer, etc.)
│   ├── router.js         # Définition des routes principales
│   └── ...               # Autres fichiers sources
├── docs/
│   └── swagger/          # Documentation Swagger (OpenAPI)
├── .env                  # Variables d’environnement
├── package.json
└── readME.md
```

---

## ⚙️ Installation & lancement

1. **Cloner le projet**

   ```bash
   git clone <url-du-repo>
   cd cines-delices/Back
   ```

2. **Installer les dépendances**

   ```bash
   npm install
   ```

3. **Configurer l’environnement**

   - Renommer `.env.example` en `.env` si besoin
   - Adapter les variables (PORT, BASE_URL, PG_URL, JWT_SECRET, etc.)

4. **Lancer le serveur**
   ```bash
   npm run dev
   ```
   Le serveur démarre sur le port défini dans `.env` (par défaut : 3000).

---

## 📚 Documentation API

- Accès à la documentation interactive :  
  [http://localhost:3000/api-docs](http://localhost:3000/api-docs) (ou selon ton port)

---

## 🛠️ Scripts utiles

- `npm run dev` : Lancer le serveur en mode développement (avec nodemon)
- `npm start` : Lancer le serveur en mode production

---

## 📝 Bonnes pratiques

- Respecte la structure des dossiers
- Documente les fonctions avec JSDoc
- Utilise les middlewares pour la sécurité
- Teste des routes avec Swagger ou Postman

---

**Projet réalisé dans le cadre de l’apothéose de fin d’étude.**
