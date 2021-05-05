//J'importe le package avec require qui me donne accès à l'objet http
const http = require('http');
//J'importe mon application que je récupère dans mon ficier app.js
const app = require('./app');

//Cette fonction renvoie un port valide (numéro ou chaîne)
const normalizePort = val => {
    const port = parseInt(val, 10);
  
    if (isNaN(port)) {
      return val;
    }
    if (port >= 0) {
      return port;
    }
    return false;
  };
  //si l'environnement sur lequel tourne mon serveur m'envoie un port, 
  //je l'utilise sinon par défaut j'utilise le port 3000 
  const port = normalizePort(process.env.PORT || '3000');
  app.set('port', port);
  
  //Cette fonction recherche les différentes erreurs et les gére. Elle est ensuite enregistrée dans le serveur
  const errorHandler = error => {
    if (error.syscall !== 'listen') {
      throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges.');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use.');
        process.exit(1);
        break;
      default:
        throw error;
    }
  };
  
  //Je passe d'application express (fonction qui va recevoir la requête et la réponse) à mon serveur Node
  //La méthode createServer (qui prend comme argument la fonction 'app' mon application) sera appelée à chaque requête reçue par le serveur
  const server = http.createServer(app);
  
  server.on('error', errorHandler);
  server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Listening on ' + bind);
  });
  
  server.listen(port);
