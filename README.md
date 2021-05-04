OCP5 
Construisez une API sécurisée pour une application d'avis gastronomique
Projet réalisé dans le cadre de la formation "Développeur Web" d'OpenClassrooms

Technologies utilisées
Projet hébergé: par un serveur Node.js
		Framework utilisé:  Express

Base de données: MongoDB
		Plugin: Mongoose



Ce projet représente le backend de l'application 
Exigences concernant la sécurité :
● l’API doit respecter le RGPD et les standards OWASP ;
● le mot de passe des utilisateurs doit être chiffré ;
● 2 types de droits administrateur à la base de données doivent être définis : un accès
pour supprimer ou modifier des tables, et un accès pour éditer le contenu de la base
de données ;
● la sécurité de la base de données MongoDB (à partir d’un service tel que MongoDB
Atlas) doit être faite de telle sorte que le validateur puisse lancer l’application depuis
sa machine ;
● l’authentification est renforcée sur les routes requises ;
● les mots de passe sont stockés de manière sécurisée ;
● les adresses mails de la base de données sont uniques et un plugin Mongoose
approprié est utilisé pour s’assurer de leur caractère unique et rapporter des erreurs.
