//Ce controleur comporte deux middleware d'authentification
//Après avoir installé le package bcrypt, je l'importe
const bcrypt = require('bcrypt');
//Après avoir installé le package jsonwebtoken, je l'importe
const jwt = require('jsonwebtoken');

//J'importe mon modèle user pour lire et enregistrer des users dans les middleware suivants
const User = require('../models/user');

//J'importe mon module password validator 
const passwordValidator = require('password-validator');

//Je crée un schéma pour recevoir des mots de passe sécurisés
const schema = new passwordValidator();

//La fonction 'signup' pour l'enregistrement de nouveaux utilisateurs depuis l'appli frontend
exports.signup = (req, res, next) => {
    //Si les données entrées ne correspondent pas au schéma
    if (!schema.validate(req.body.password)) {
        res.status(401).json({ error: 'Les données entrées ne correspondent pas au schéma demandé !' });
        //Sinon si les données entrées correspondent au schéma
    } else if (schema.validate(req.body.password)) {
        //Hashage du mot de passe du user avec bcrypt et je l'enregistre dans la base de données
        //Avec la fonction bcrypt.hash, je hash, cripte le mot de passe; je lui passe le mdp du corps de la requête passé par le frontend
        //10 correspond au salt, càd combien de fois on exécute l'algorythme de hashage, ici 10 tours(c'est une méthode asychrone, càd qui prend du temps, 10 tours sufffisent)
        bcrypt.hash(req.body.password, 10)
            //Je récupère le hash de mot de passe
            .then(hash => {
                //Je l'enregistre dans un nouveau user. Donc je crée un nouvel user avec mon modèle mongoose
                const user = new User({
                    //Je passe l'adresse qui est fourni dans le corps de la requête
                    email: req.body.email,
                    //Comme mot de passe, j'enregistre le hash, donc le mot de passe crypté
                    password: hash
                });
                //J'utilise la méthode save pour l'enregistrer dans la base de données
                user.save()
                    //Renvoi d'un 201 pour une création de ressource et un message
                    .then(() => res.status(201).json({ message: 'Utisateur crée !' }))
                    .catch(error => res.status(400).json({ error }));
            })
            .catch(error => res.status(500).json({ error }));
    }
};

schema
    .is().min(8)            //minimum 8 caractères
    .has().uppercase(1)     //minimum 1 caractère majuscule
    .has().lowercase(1)     //minimum 1 caractère minuscule
    .has().digits(2)        //minimum 2 chiffres
    .has().not().spaces();  //aucun espace

//La fonction login pour la connexion des utilisateurs existants
exports.login = (req, res, next) => {
    //Je mets l'objet de comparaison, ici l'utilisateur pour qui l'adresse mail correspond à l'adresse mail envoyée dans la requête
    User.findOne({ email: req.body.email })
        //Je vérifie s'il la promise a récupérer un use
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            //J'utilise bcrypt pour comparer le mot de passe de l'utilisateur qui essaie de se connecter 
            //avec le hash enregistré avec le user reçu dans le then
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    //Si la comparaison des mdp n'est pas valable
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    //Si elle est bonne, renvoi d'un status 200 pour une requête ok
                    res.status(200).json({
                        //Renvoi d'un objet json qui contient l'identifiant du user dans la base
                        userId: user._id,
                        //Renvoi d'un token, appel de la fonction 'sign' de jwt qui prend comme arguments les données que je veux encoder
                        token: jwt.sign(
                            //1er argument : L'objet userId sera l'identifiant user de l'utilisateur
                            { userId: user._id },
                            //2ème argument: clé secrète pour l'encodage
                            'RANDOM_TOKEN_SECRET',
                            //3ème argument de configuration avec expiration du token à 24h
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};