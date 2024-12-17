const Book = require("../models/Book");
const sharp = require("sharp");
const fs = require("fs");

exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;

  const originalImagePath = `images/${req.file.filename}`;
  const optimizedImagePath = `images/optimized_${req.file.filename}`;

  // Étape 1 : Optimiser l'image avec Sharp
  sharp(originalImagePath)
    .resize({ width: 500 }) // Redimensionne l'image
    .webp({ quality: 80 }) // Convertit en format WebP
    .toFile(optimizedImagePath)
    .then(() => {
      // Étape 2 : Supprimer l'image originale
      fs.unlink(originalImagePath, (err) => {
        if (err) {
          console.error("Erreur lors de la suppression de l'image originale :", err);
        }
      });

      // Étape 3 : Créer et enregistrer le livre dans la base
      const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get("host")}/images/optimized_${req.file.filename}`,
      });

      return book.save(); // Retourne la promesse pour la chaîne de .then()
    })
    .then(() => {
      res.status(201).json({ message: "Livre enregistré !" });
    })
    .catch((error) => {
      res.status(500).json({ message: "Erreur lors de l'ajout du livre", error });
    });
};

exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ error }));
};


exports.modifyBook = (req, res, next) => {
  const bookObject = req.file
    ? { ...JSON.parse(req.body.book) }
    : { ...req.body };

  if (req.file) {
    const originalImagePath = `images/${req.file.filename}`;
    const optimizedImagePath = `images/optimized_${req.file.filename}`;

    // Étape 1 : Optimiser l'image avec Sharp
    sharp(originalImagePath)
      .resize({ width: 500 }) // Redimensionne l'image
      .webp({ quality: 80 })  // Convertit en WebP
      .toFile(optimizedImagePath)
      .then(() => {
        // Étape 2 : Supprimer l'image originale
        return new Promise((resolve, reject) => {
          fs.unlink(originalImagePath, (err) => {
            if (err) reject(err);
            else resolve();
          });
        });
      })
      .then(() => {
        // Étape 3 : Mettre à jour bookObject avec l'image optimisée
        bookObject.imageUrl = `${req.protocol}://${req.get("host")}/images/optimized_${req.file.filename}`;
        updateBook(req, res, bookObject);
      })
      .catch((error) => {
        res.status(500).json({ message: "Erreur lors de la modification du livre", error });
      });
  } else {
    // Si aucune image n'a été uploadée
    updateBook(req, res, bookObject);
  }
};

// Fonction pour mettre à jour le livre
function updateBook(req, res, bookObject) {
  delete bookObject._userId;

  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        return res.status(401).json({ message: "Not authorized" });
      }
      return Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id });
    })
    .then(() => res.status(200).json({ message: "Objet modifié !" }))
    .catch((error) => res.status(400).json({ error }));
}

// Fonction pour mettre à jour le livre
function updateBook(req, res, bookObject) {
  delete bookObject._userId;
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        return res.status(401).json({ message: "Not authorized" });
      }
      Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: "Objet modifié !" }))
        .catch((error) => res.status(401).json({ error }));
    })
    .catch((error) => res.status(400).json({ error }));
}

exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        const filename = book.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Objet supprimé !" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};
