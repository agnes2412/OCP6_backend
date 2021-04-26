//Le fichier de routes permet de voir toutes les routes disponibles de notre application
//Le nom des fonctions permet de voir de quelle route il s'agit

//Je récupère express pour crée un routeur
const express = require('express');
const router = express.Router();

//J'importe le middleware qui protège mes routes
const auth = require('../middleware/auth');
//J'importe le middleware qui permet de télécharger des fichiers image depuis le frontend
const multer = require('../middleware/multer-config');

const saucesCtrl = require('../controllers/sauces');

//J'importe la fonction createSauces pour l'appliquer à la route
//Pour protéger mes routes, je rajoute le middleware 'auth' avant le controleur
//J'ajoute le middleware pour avoir un fichier image avec la requête post
router.post('/', auth, multer, saucesCtrl.createSauce);
router.put('/:id', auth, multer, saucesCtrl.modifySauce);
router.delete('/:id', auth, saucesCtrl.deleteSauce);
//router.post('/:id/like', auth, sauceCtrl.)
//Le : devant id indique à Express que ce chemin est dynamique 
router.get('/:id', auth, saucesCtrl.getOneSauce);
router.get('/', auth, saucesCtrl.getAllSauces);

//Je réexporte le routeur
module.exports = router;