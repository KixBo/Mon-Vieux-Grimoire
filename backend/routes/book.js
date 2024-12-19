const express = require("express");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const bookCtrl = require("../controllers/book");

const router = express.Router();

// Traitement de requête get pour les livres avec la meilleure note
router.get("/bestrating", bookCtrl.getBestBooks);

// Traitement de requête get pour tous les livres
router.get("/", bookCtrl.getAllBooks);

// Traitement de requête post pour créer un livre
router.post("/", auth, multer, bookCtrl.createBook);

// Traitement de requête post pour ajouter une note à un livre
router.post("/:id/rating", auth, bookCtrl.addRating);

// Traitement de requête get pour un seul livre selon l'id
router.get("/:id", bookCtrl.getOneBook);

// Traitement de requête put pour un seul livre selon l'id
router.put("/:id", auth, multer, bookCtrl.modifyBook);

// Traitement de requête delete pour un seul livre selon l'id
router.delete("/:id", auth, bookCtrl.deleteBook);

module.exports = router;
