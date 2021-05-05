//Middleware d'authentification
//Je récupère le package 'jsonwebtoken'
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
    try {
        //Je récupère le token dans le header autorization. Je 'split' autour des espaces et crée un tableau
        //Le split me retourne les élements du tableau, dans le 2ème [1], je récupère la chaine du bearer
        const token = req.headers.authorization.split(' ')[1];
        //Je décode le token qui devient un objet js
        const decodedToken = jwt.verify(token, `${process.env.JWT_KEY}`);
        //Je récupère le userId 
        const userId = decodedToken.userId;
        //si il y a un userId dans le corps de la requête et qu'il est différent du userId
        if(req.body.userId && req.body.userId !== userId) {
            throw 'User ID non valable !';
        } else {
            //Sinon, si tout est correct, je passe la requête au prochain Middleware
            next();
        }

    } catch (error) {
        //Renvoi d'une erreur 401: problème d'authentification
        res.status(401).json({ error: error | 'Requête non authentifiée !' });
    }
};