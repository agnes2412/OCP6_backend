//Dans ce fichier, je crée un modèle user avec mongoose

const mongoose = require('mongoose');

//J'installe le package 'mongoose-unique-validator'et le rajoute comme plugin au schema
const uniqueValidator = require('mongoose-unique-validator');

//J'utilise la fonction 'Schema' de mongoose
const userSchema = mongoose.Schema({
    //Je stocke l'email de l'utilisateur
    //La configuration unique: true empêche de s'inscrire plusieurs fois avec la même adresse mail
    email: { type: String, required: true, unique: true },
    //Et le mot de passe crypté (hash) qui sera un string
    password: { type: String, required: true }
});

//J'applique ce validateur au schema
userSchema.plugin(uniqueValidator);

//J'exporte ce schéma sous forme de modèle avec la fonction model de mongoose
//Le modèle s'appelle 'User' et le schema de données s'appelle 'userSchema'
module.exports = mongoose.model('User', userSchema);