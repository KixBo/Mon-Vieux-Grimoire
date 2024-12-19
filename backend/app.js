const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const app = express();

// Connexion à la base de données
mongoose
  .connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/?retryWrites=true&w=majority&appName=Cluster0`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

// Permet à d'accepter des requêtes provenant d'autres domaines
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});

// Intercepte les requêtes avec un content-type json et met à disposition le body dans l'objet requête (req.body)
app.use(express.json());

// Permet l'accès aux fichiers statiques
app.use("/images", express.static(path.join(__dirname, "images")));

const bookRoutes = require("./routes/book");
const userRoutes = require("./routes/user");
app.use("/api/books", bookRoutes);
app.use("/api/auth", userRoutes);

module.exports = app;
