const express = require("express");

const app = express();

const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://kixboy:Pchmylzmgr1@cluster0.vh7gi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const bookRoutes = require('./routes/book');

app.use('/api/books', bookRoutes);

// Intercepte les requêtes avec un content-type json et met à disposition le body dans l'objet requête (req.body)
app.use(express.json());

// Headers pour les autorisation cors
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});



module.exports = app;
