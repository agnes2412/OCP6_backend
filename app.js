//J'importe express
const express = require('express'); 
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
//J'importe path de Node pour accéder au chemin du système de fichier
const path = require('path');

const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');

mongoose.connect('mongodb+srv://agnes2412:@Lina@cluster0.egtzz.mongodb.net/test?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

//La constante app est mon application
const app = express();

//Middleware appliqué à toutes les routes, les requêtes envoyées au serveur
app.use((req, res, next) => {
    //Ajout de headers sur l'objet réponse pour permettre à l'application d'accéder à l'API et éviter le cors
    //1er Header = Origine autorisée à accéder au serveur : tout le monde (*)
    res.setHeader('Access-Control-Allow-Origin', '*');
    //2ème header = autorisation d'utiliser certain headers
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    //3ème header = autorisation d'utiliser certaines méthodes
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//Ce middlware utilise une méthode de body-parser qui va transformer le corps de la requête en json
app.use(bodyParser.json());

//Je crée un middleware qui va répondre aux requêtes faites à /images et servir le dossier static image 
app.use('/images', express.static(path.join(__dirname, 'images')));

//J'enregistre les routes attendues par le frontend
//Ces routes sont les racines
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);

//J'exporte l'application pour y accéder depuis les autres fichiers
module.exports = app;