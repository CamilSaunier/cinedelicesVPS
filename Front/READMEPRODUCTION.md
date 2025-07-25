# CinéDélice - Guide de déploiement en production

Ce document détaille les étapes nécessaires pour déployer l'application CinéDélice sur un serveur VPS en production.

## Sommaire

- Prérequis
- Installation initiale sur le VPS
- Configuration de la base de données PostgreSQL
- Configuration du gestionnaire de processus PM2
- Build de l'application front-end
- Configuration de Nginx
- Mise en place HTTPS avec Certbot
- Configuration des variables d'environnement
- Redémarrage et vérification
- Dépannage courant

### Prérequis

- Un serveur VPS avec Ubuntu (ou autre distribution Linux)
- Node.js et npm installés
- PostgreSQL installé et configuré
- Un nom de domaine pointant vers votre serveur

## Installation initiale sur le VPS

### Se connecter au VPS via SSH

```bash

ssh student@votrenom-server.eddi.cloud

```

### Créer une clé SSH pour le dépôt GitHub

```bash

ssh-keygen -t ed25519 -C "votre-email@example.com" -f ~/.ssh/id_ed25519_Cinedelice

```

### Démarrer l'agent SSH et ajouter la clé

```bash

eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519_Cinedelice

```

### Afficher la clé publique pour l'ajouter à GitHub

```bash

cat ~/.ssh/id_ed25519_Cinedelice.pub

```

### Copiez la clé publique affichée et ajoutez-la à votre dépôt GitHub

- Allez dans votre dépôt GitHub → Settings → Deploy Keys
- Cliquez sur "Add deploy key"
- Collez votre clé SSH et activez "Allow write access"

### Cloner le dépôt sur le VPS

```bash

git clone git@github.com:votre-utilisateur/CineDeliceV0.git
cd CineDeliceV0

```

## Configuration de la base de données PostgreSQL

### Installer PostgreSQL

```bash

sudo apt install -y postgresql

```

### Vérifier l'installation

```bash

systemctl status postgresql

```

### Se connecter à PostgreSQL

```bash

sudo -i -u postgres psql

```

### Dans PostgreSQL, créer l'utilisateur et la base de données

```sql

CREATE ROLE cinedelice WITH LOGIN PASSWORD 'cinedelice';
CREATE DATABASE cinedelice WITH OWNER cinedelice;

\q
```

### Tester la connexion depuis le bash

```bash

psql -U cinedelice -d cinedelice -h localhost

```

### Créer les tables et importer les données depuis le bash

```bash

cd ~/CineDeliceV0
psql -h localhost -U cinedelice -d cinedelice -f data/create_tables.sql
psql -h localhost -U cinedelice -d cinedelice -f data/seeding_tables.sql

```

## Configuration du gestionnaire de processus PM2

PM2 va permettre de maintenir l'application Node.js en fonctionnement et de la redémarrer automatiquement.

### Installation pm2

```bash

npm install -g pm2

```

### Démarrer en tâche de fond

```bash

pm2 start npm --name cinedelice-back
pm2 save
pm2 startup
sudo env PATH=$PATH:/home/student/.nvm/versions/node/v22.14.0/bin /home/student/.nvm/versions/node/v22.14.0/lib/node_modules/pm2/bin/pm2 startup systemd -u student --hp /home/student
pm2 save
pm2 restart cinedelice-back

```

## Build de l'application front-end

### Se rendre dans le dossier front-end

```bash

cd Front/

```

### Générer le build de production

```bash

npm run build

```

### Créer le dossier qui contiendra les fichiers statiques

```bash

sudo mkdir -p /var/www/cinedelice

```

### Copier les fichiers générés vers ce dossier

```bash

sudo cp -r dist/* /var/www/cinedelice/

```

## Configuration de Nginx

### Vérifier que Nginx est installé

```bash

nginx -v

```

### Si nécessaire, l'installer

```bash
sudo apt install nginx
```

### Créer le fichier de configuration nginx pour notre application

```bash
sudo nano /etc/nginx/sites-available/cinedelice
```

Copiez la configuration suivante (en changeant bien le server_name) :

```markdown
server {
server_name tonNomPrenom-server.eddi.cloud;

    root /var/www/cinedelice;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:3000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/tonNomPrenom-server.eddi.cloud/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/tonNomPrenom-server.eddi.cloud/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

}
server {
if ($host = tonNomPrenom-server.eddi.cloud) {
        return 301 https://$host$request_uri;
} # managed by Certbot

    listen 80;
    server_name tonNomPrenom-server.eddi.cloud;
    return 404; # managed by Certbot

}
```

- `ctrl+o`
- `enter`
- `ctrl+x`

### Activer la configuration

```bash
sudo ln -s /etc/nginx/sites-available/cinedelice /etc/nginx/sites-enabled/
```

### Tester la configuration

```bash

sudo nginx -t

```

### Démarrer nginx

```bash
sudo systemctl restart nginx
```

## Certificat HTTPS

### Installation de certbot pour le certificat HTTPS

```bash

sudo apt install certbot python3-certbot-nginx

```

### Générer le certificat HTTPS

```bash

sudo certbot --nginx

```

### Redémarrer nginx

```bash
sudo systemctl reload nginx
```

## Changer le .env du Back

### Se rendre dans le back du projet et éditer le .env

```bash
nano .env
```

Ne pas oublier de changer avec vos noms de serveur...

```bash
# --- Configuration serveur ---
PORT=3000
BASE_URL=https://tonNomPrenom-server.eddi.cloud
# --- Configuration base de données PostgreSQL ---
PG_HOST=localhost
PG_USER=cinedelice
PG_DATABASE=cinedelice
PG_URL=postgres://cinedelice:cinedelice@localhost:5432/cinedelice
# --- Sécurité / JWT ---
JWT_SECRET=cinedelice
JWT_REFRESH_SECRET=cinedelice
# --- Environnement ---
NODE_ENV=production
# --- Configuration email (pour nodemailer) ---
MAIL_ADMIN=delicecine@gmail.com
MAIL_PASS=zxqd hwaz hyqx umre
# --- Configuration front-end ---
FRONT_URL=https://tonNomPrenom-server.eddi.cloud
# --- Configuration CORS ---
CORS_ORIGINS=https://localhost:4173,https://localhost:5173,https://cinedelice.tonNomPrenom-server.eddi.cloud:4173,https://tonNomPrenom-server.eddi.cloud

```

- `ctrl+o`
- `enter`
- `ctrl+x`

## Changer le .env du Front

### Se rendre dans le Front du projet et éditer le .env

```bash
nano .env
```

```bash

VITE_API_URL=https://tonNomPrenom-server.eddi.cloud/api

```

- `ctrl+o`
- `enter`
- `ctrl+x`

## Changer les accès CORS

### Se rendre dans le fichier index.js du back dans VSCode

Changer la ligne :

```js
const allowedOrigins = process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(",") : ["http://localhost:5173"];
```

par :

```js
const allowedOrigins = process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(",") : ["https://localhost:5173"];
```

- `git add .`
- `git commit -m "Mise à jour configuration production"`
- `git push`

### Récupérer avec un git pull dans son serveur SSH

```bash
git pull
```

### Relancer son back et son front

```bash

pm2 restart cinedelice-back

```

## Aller dans le dossier front-end

```bash
cd Front/
```

## Générer à nouveau le build de production

```bash

npm run build
```

### Supprimer le dossier précédent qui contient les fichiers statiques

```bash

sudo rm -rf /var/www/cinedelice/*

```

### Copier les nouveaux fichiers générés vers le dossier

```bash

sudo cp -r dist/* /var/www/cinedelice/

```

### Redémarrer nginx

```bash

sudo systemctl restart nginx

```
