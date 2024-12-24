require("dotenv").config();
const http = require("http");
const app = require("./app");

const port = process.env.PORT || 4000;

// Crée un serveur HTTP qui utilise l'application Express (app) pour traiter les requêtes
const server = http.createServer(app);

// Démarre le serveur et commence à écouter les requêtes sur le port défini
server.listen(port, () => {
  console.log(`Server is running on : ${port}`);
});
