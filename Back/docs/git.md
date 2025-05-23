# Rappel des bonnes pratiques GitHub

### **Rappel :**

Pour le bon déroulement du projet, il est préférable que chacun travaille sur une branche qui lui est dédiée avant de mettre le travail en commun sur la branche main.
Cette pratique permet de travailler séparément sans provoquer de conflits lors des push sur la branche main.
Il est donc important que ces consignes soient respectées et appliquées correctement pour assurer le bon développement du projet.


## 1) Sauvegarder son travail

### **Crée une nouvelle branche** 

Commandes à tapper dans le terminal pour sauvegarder son travail dans l'emplacement actuel: 

-`git add .`

-`git commit -m "nom-de-la-sauvegarde"`

-`git push`







## 2) Création d'une branche "perso"

###  **Créer une nouvelle branche** 

Commande a tapper dans le terminal pour créer une nouvelle branche de travail sans s'y déplacer : 

-`git branch nom-de-la-branche`

### **Créer une nouvelle branche et s'y déplacer**

Commande a tapper dans le terminal pour créer une nouvelle branche de travail et s'y déplacer : 

-`git checkout -b nom-de-la-branche`







## 3) Fusionner la branche MAIN dans sa branche "perso"

### **Se placer dans sa branche perso**

Si vous n'êtes pas dans votre branche perso, tappez la commande suivante dans le terminal pour se placer dans sa branche :

-`git checkout nom-de-la-branche`

### **Récupérer les derniers changements de main dans sa branche** 

Commande a tapper dans le terminal pour récupérer les derniers changements de main dans sa branche : 

-`git merge main`

### 🚨ATTENTION : vous devez vous assurer que main est à jour avec le remote.  

Si ce n'est pas le cas ou pour en être sur : 

-`git checkout main`                  # Retourner sur la branche main

-`git pull origin main`               # Récupèrer les derniers changements du main

-`git checkout nom-de-la-branche`     # Retourner sur votre branche

-`git merge main`                     # Fusionner main dans votre branche




## 4) Fusionner votre branche "perso" dans la branche MAIN

### **1) Vérifier que votre branche est bien commitée et à jour**

-`git status`

### **2) Se placer dans la branche MAIN** 
 
-`git checkout main`

### **3) Mettre à jour main avec le remote (étape optionnel)** 
 
-`git pull origin main`

### **4) Fusionner votre branche dans la branche MAIN** 
 
-`git merge nom-de-la-branche`

### 🚨ATTENTION : Si des conflits doivent apparaître, ce sera à ce moment là.

Pour les résoudre, Git va indiquer les fichiers en conflit. Suivez les instructions de VSCode pour choisir les changements à appliquer aux conflits puis entrer les commandes suivantes dans le terminal : 

-`git add .`

-`git commit -m "fixed conflicts"`

### **5) Pusher la fusion sur le repo distant**

-`git push origin main`


## 5) 🚨ATTENTION : Pour la premiere fois que vous fusionnerez votre branche "perso" dans la branche MAIN 

La premiere fois que vous fusionnerez votre branche "perso" dans la branche MAIN,  vous devez paramétrer/lier votre branche "perso" à la branche main avec la commande suivante à tapper dans le terminal : 

-`git push --set-upstream origin nom-de-la-branche`

Une fois cela fait, vous pourrez ensuite réaliser vos Git push et Git pull sans la commande précédente et juste entrer vos commandes "normales", à savoir : 

-`git push`

-`git pull`