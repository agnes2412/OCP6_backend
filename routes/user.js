//Je crée le routeur correspondant aux fonctions signup et login
//J'importe express pour créer le routeur
const express = require('express');
//Je crée le routeur avec la fonction Router d'express
const router = express.Router();
//J'associe les fonctions aux différentes routes avec le controleur
const userCtrl = require('../controllers/user');

//Je crée deux routes post parce que le frontend doit envoyer des informations(adresse mail et mot de passe)
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

//J'exporte ce routeur pour pouvoir l'importer sur app.js
module.exports = router;