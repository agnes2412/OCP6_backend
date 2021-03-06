# OCP6 
Projet réalisé dans le cadre de la formation "Développeur Web" d'OpenClassrooms  
Intitulé: "Construisez une API sécurisée pour une application d'avis gastronomique"   
Ce projet représente le backend de l'application  

## Technologies utilisées  
* Projet hébergé par un serveur Node.js - Framework utilisé:  Express
* Base de données MongoDB - Plugin: Mongoose

## Exigences concernant la sécurité :
* l’API doit respecter le RGPD et les standards OWASP ;
* le mot de passe des utilisateurs doit être chiffré ;
* 2 types de droits administrateur à la base de données doivent être définis : un accès
pour supprimer ou modifier des tables, et un accès pour éditer le contenu de la base
de données ;
* la sécurité de la base de données MongoDB (à partir d’un service tel que MongoDB
Atlas) doit être faite de telle sorte que le validateur puisse lancer l’application depuis
sa machine ;
* l’authentification est renforcée sur les routes requises ;
* les mots de passe sont stockés de manière sécurisée ;
* les adresses mails de la base de données sont uniques et un plugin Mongoose
approprié est utilisé pour s’assurer de leur caractère unique et rapporter des erreurs.

## Pour accèder à ce projet :
* Dans un premier temps, il vous faut cloner le frontend de l'application via le lien suivant et installer node-sass:  
https://github.com/OpenClassrooms-Student-Center/dwj-projet6  
Depuis votre invite de commande, placez vous dans le dossier puis tapez les lignes suivantes  
npm install  
ng serve

* Dans un second temps, vous devez cloner le backend de ce projet et installer tous les modules:  
https://github.com/agnes2412/OCP6_backend  
Depuis votre terminal, placez-vous dans le dossier puis tapez la ligne suivante  
npm install

* Ensuite, créez un fichier .env à la racine du projet et ajoutez les lignes suivantes afin de récupérer la valeur des variables d'environnement MONGO_URl et JWT_KEY  
`MONGO_URl="mongodb+srv://DB_USER:5891*Agnes@cluster0.egtzz.mongodb.net/SoPiquante?retryWrites=true&w=majority"
JWT_KEY="19Li%85tSa"`  
Les lignes ci-dessus ne devront, EN AUCUN CAS, apparaître dans le cadre d'un projet réel

* Pour finir, depuis votre terminal, allez dans le dossier backend et entrez la ligne suivante  
nodemon

Vous pouvez vous rendre à l'adresse suivante: http://localhost:4200/  
Vous avez désormais accès à toutes les fonctionnalités de l'application "Piquante"


