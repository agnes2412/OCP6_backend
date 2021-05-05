const multer = require('multer');

//Je me prépare un dictionnaire des extensions
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

//Je crée un objet de configuration pour multer
//avec la fonction diskStorage, je l'enregistre sur le disque
const storage = multer.diskStorage({
    //l'objet de configuration que je passe à diskStorage a besoin de deux éléments
    //la destination va expliquer dans quel dossier enregistrer les fichiers
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    //explique à multer le nom du fichier à utiliser
    filename: (req, file, callback) => {
        //S'il existe des espaces dans un nom de fichier, je 'split' autour des espaces et crée un tableau avec les différents mots du nom du fichier
        //j'élimine les espaces potentiels dans les noms de fichier et avec 'join' les remplace par des underscore en rejoignant le tableau en un seul string
        const name = file.originalname.split(' ').join('_').split('.')[0];
        //J'accède aux mime-type (image/png) pour générer l'extension du fichier qui est l'élément de mon dictionnaire = fichier envoyé par le front-end
        const extension = MIME_TYPES[file.mimetype];
        //J'appelle le callback, j'ajoute un timestamp, un point et l'extension du fichier
        callback(null, name + Date.now() + '.' + extension);
    }
});

//J'exporte le middleware multer configuré, j'ajoute single pour signifié qu'il s'agit d'un fichier image unique
module.exports = multer({ storage }).single('image');