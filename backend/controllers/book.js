const Book = require("../models/Book");
const sharp = require("sharp");
const fs = require("fs").promises;

exports.createBook = async (req, res, next) => {
  try {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;

    const originalImagePath = `images/${req.file.filename}`;
    const optimizedImagePath = `images/optimized_${req.file.filename}`;

    await sharp(originalImagePath).resize({ width: 500 }).webp({ quality: 80 }).toFile(optimizedImagePath);

    try {
      await fs.unlink(originalImagePath);
    } catch (err) {
      console.error("Erreur lors de la suppression de l'image originale :", err);
    }

    const book = new Book({
      ...bookObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get("host")}/${optimizedImagePath}`,
      ratings: [],
      averageRating: 0,
    });

    const savedBook = await book.save();

    res.status(201).json({
      message: "Livre enregistré avec succès !",
      book: savedBook,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de l'ajout du livre",
      error: error.message,
    });
  }
};

exports.getAllBooks = async (req, res, next) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des livres", error: error.message });
  }
};

exports.getOneBook = async (req, res, next) => {
  try {
    const book = await Book.findOne({ _id: req.params.id });
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.modifyBook = async (req, res, next) => {
  try {
    const bookObject = req.file ? { ...JSON.parse(req.body.book) } : { ...req.body };

    if (req.file) {
      const originalImagePath = `images/${req.file.filename}`;
      const optimizedImagePath = `images/optimized_${req.file.filename}`;
      await sharp(originalImagePath).resize({ width: 500 }).webp({ quality: 80 }).toFile(optimizedImagePath);
      try {
        await fs.unlink(originalImagePath);
        console.log("Image originale supprimée avec succès");
      } catch (err) {
        console.error("Erreur lors de la suppression de l'image originale :", err);
      }
      bookObject.imageUrl = `${req.protocol}://${req.get("host")}/${optimizedImagePath}`;
    }

    delete bookObject._userId;

    const book = await Book.findOne({ _id: req.params.id });

    if (book.userId !== req.auth.userId) {
      return res.status(401).json({ message: "Non autorisé" });
    }

    await Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id });
    res.status(200).json({ message: "Livre modifié avec succès !" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findOne({ _id: req.params.id });

    if (book.userId !== req.auth.userId) {
      return res.status(401).json({ message: "Non autorisé" });
    }

    const filename = book.imageUrl.split("/images/")[1];
    try {
      await fs.unlink(`images/${filename}`);
      console.log("Image supprimée avec succès :", filename);
    } catch (err) {
      console.error("Erreur lors de la suppression de l'image :", err.message);
    }

    await Book.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Livre supprimé avec succès !" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.addRating = async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const newRating = req.body.rating;

    const book = await Book.findOne({ _id: req.params.id });

    const userHasRated = book.ratings.some((rating) => rating.userId === userId);
    if (userHasRated) {
      return res.status(400).json({ message: "Vous avez déjà noté ce livre." });
    }

    book.ratings.push({ userId: userId, grade: newRating });

    const sumOfRatings = book.ratings.reduce((sum, rating) => sum + rating.grade, 0);
    book.averageRating = (sumOfRatings / book.ratings.length).toFixed(1);

    const updatedBook = await book.save();
    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de l'ajout de la note.",
      error: error.message,
    });
  }
};

exports.getBestBooks = async (req, res, next) => {
  try {
    const books = await Book.find().sort({ averageRating: -1 }).limit(3);
    res.status(200).json(books);
  } catch {
    (error) => {
      res.status(500).json({ message: "Erreur lors de la récupération des meilleurs livres", error });
    };
  }
};
