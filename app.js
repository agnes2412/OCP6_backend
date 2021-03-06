const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const mongoose = require('mongoose');
const mongoSanitize = require('express-mongo-sanitize');
//J'importe path de Node pour accéder au chemin du système de fichier
const path = require('path');
require('dotenv').config();

//J'importe mes routes sauces et user
const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');

mongoose.connect(`${process.env.MONGO_URl}`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

//La constante app est mon application express
const app = express();

//Middleware appliqué à toutes les routes, les requêtes envoyées au serveur
//Afin d'éviter que le système de sécurité 'CORS' ne bloque les appels HTTP entre les deux serveurs différents
//Ajout de headers sur l'objet réponse pour permettre à l'application d'accéder à l'API
app.use((req, res, next) => {   
    //1er Header = Accès à l'API depuis toute origine (*)
    res.setHeader('Access-Control-Allow-Origin', '*');
    //2ème header = autorise l'ajout des headers mentionnés aux requêtes envoyées vers l'API
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    //3ème header = permet d'envoyer les requêtes cotenant les méthodes mentionnées
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    //next permet d'envoyer la réponse et de passer au middleware suivant
    next();
});

//Ce middlware utilise une méthode de body-parser qui va transformer le corps de la requête en json
app.use(bodyParser.json());
//Helmet (module de Node) aide à sécuriser les en-tête http
app.use(helmet());
//Les champs utilisateurs sont nettoyés des tentatives d'injection de code malveillants
app.use(mongoSanitize({ 
    replaceWith: '_' 
  }));

//Je crée un middleware qui va répondre aux requêtes faites à /images et servir le dossier static image 
app.use('/images', express.static(path.join(__dirname, 'images')));
//J'enregistre les routes attendues par le frontend
//Ces routes sont les routes racines sur lesquelles j'utilise les routers sauces et user
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);

//J'exporte l'application pour y accéder depuis les autres fichiers
module.exports = app;