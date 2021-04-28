//Dans le fichier controleur se trouve la logique métier de chaque fonction

const Sauce = require('../models/sauce');
//J'importe le package fs (file system) de node pour accéder aux opérations liées aux fichiers
const fs = require('fs');

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        //L'opérateur 'spread' va copier les champs dans le corps de la requête
        ...sauceObject,
        //Je renseigne le frontend sur l'url de l'image, c'est multer qui a généré ce fichier
        //Je génère l'url de l'image: le protocole, le nom d'hôte, /images/ et le nom du fichier
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    //Avec la méthode .save, j'enregistre l'objet dans la base de données et retourne une promesse
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
    //J'utilise l'opérateur ternaire ? pour savoir si req.file existe
    const sauceObject = req.file ?
        //S'il existe, je récupère la chaine de caractère, je la parse en objet et je génère l'image url car c'est une nouvelle image
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
            //sinon je prends le corps de la requête
        } : { ...req.body };
    //Je recherche l'id qui correspond à l'id dans les paramètres de recherche
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    //Avant de supprimer l'objet de la base, je vais le chercher pour avoir l'url de l'image, 
    //je récupère le nom du fichier pour le supprimer
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            //Je récupère le nom du fichier de l'image et le split
            //Le split retourne un tableau de 2 éléments ce qui vient avant le /images/ 
            //et ce qui vient après le /images/ donc le nom du fichier
            const filename = sauce.imageUrl.split('/images/')[1];
            //Avec ce nom, j'appelle la fonction unlink(supprimer un fichier)
            //1er argument = string qui correspond au chemin du fichier
            //2ème argument = le callback: ce qu'il faut faire une fois le fichier supprimé; càd supprimer le 'sauce' de la base de données
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    //findOne permet de récupérer une sauce
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
    //La méthode find permet de récupérer toutes les sauces
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

exports.likeSauce = (req, res, next) => {
    switch (req.body.like) {
        //Dans le cas où le req.body.like est à 0
        case 0:
            Sauce.findOne({ _id: req.params.id })
                .then(sauce => {
                    //Je cherche si le user est déjà dans le tableau usersLiked(en rapport à la requête du body)
                    if (sauce.usersLiked.find((user) => user === req.body.userId)) {
                        //Si oui, mise à jour de la sauce en rapport à l'id de la requête
                        Sauce.updateOne({ _id: req.params.id }, {
                            //Je décrémente la valeur de 1
                            $inc: {
                                likes: -1
                            },
                            //Je retire la valeur (req.body.userId) du champ (userLiked) 
                            $pull: {
                                usersLiked: req.body.userId
                            },
                            _id: req.params.id
                        })
                            .then(() => res.status(200).json({ message: 'Like supprimé !' }))
                            .catch(error => res.status(400).json({ error }));
                    }
                    if (sauce.usersDisliked.find((user) => user === req.body.userId)) {
                        Sauce.updateOne({ _id: req.params.id }, {
                            $inc: {
                                dislikes: -1
                            },
                            $pull: { usersDisliked: req.body.userId },
                            _id: req.params.id
                        })
                            .then(() => res.status(200).json({ message: 'Dislike supprimé !' }))
                            .catch(error => res.status(400).json({ error }));
                    }
                })
                .catch(error => res.status(404).json({ error }));
            break;

        //Dans le cas où le req.body.like est à 1
        case 1:
            //Je recherche la sauce en rapport à l'id présent dans la requête
            Sauce.updateOne({ _id: req.params.id }, {
                //J'incrémente de 1
                $inc: {
                    likes: 1
                },
                //J'ajoute la valeur (req.body.userId) du champ (userLiked)
                $push: { usersLiked: req.body.userId },
                _id: req.params.id
            })
                .then(() => res.status(200).json({ message: 'Like ajouté !' }))
                .catch(error => res.status(400).json({ error }));
            break;

        //Dans le cas où le req.body.like est à -1
        case -1:
            Sauce.updateOne({ _id: req.params.id }, {
                $inc: {
                    dislikes: 1
                },
                $push: { usersDisliked: req.body.userId },
                _id: req.params.id
            })
                .then(() => res.status(200).json({ message: 'Dislike ajouté !' }))
                .catch(error => res.status(400).json({ error }));
    }
}
