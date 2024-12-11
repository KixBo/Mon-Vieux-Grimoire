const express = require("express");

const app = express();

const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://kixboy:Pchmylzmgr1@cluster0.vh7gi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


//* Middlewares

// Intercepte les requêtes avec un content-type json et met à disposition le body dans l'objet requête (req.body)
app.use(express.json());

// Headers pour les autorisation cors
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});

// Traitement de requête post sur /api/books
app.post('/api/books', (req, res, next) => {
  console.log(req.body);
  res.status(201).json({
    message: 'Objet créé !'
  });
});

// Traitement de requête get sur /api/books
app.get("/api/books", (req, res, next) => {
  const books = [
    {
      id: "id",
      userId: "userId",
      title: "Mon Livre",
      author: "Tolkien",
      year: 1954,
      imageUrl: "",
      genre: "Fantastique",
      ratings: [
        { userId: "userId2", grade: 3 },
        { userId: "userId1", grade: 4 },
      ],
      averageRating: 5,
    },
    {
      id: "1",
      userId : "clc4wj5lh3gyi0ak4eq4n8syr",
      title : "Milwaukee Mission",
      author: "Elder Cooper",
      imageUrl : "https://via.placeholder.com/206x260",
      year : 2021,
      genre : "Policier",
      ratings : [{
        userId : "1",
        grade: 5
      },
        {
          userId : "1",
          grade: 5
        },
        {
          userId : "clc4wj5lh3gyi0ak4eq4n8syr",
          grade: 5
        },
        {
          userId : "1",
          grade: 5
        }],
      averageRating: 3
    },
  ];
  res.status(200).json(books);
});

module.exports = app;
