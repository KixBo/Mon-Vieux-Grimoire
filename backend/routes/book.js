const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

const bookCtrl = require('../controllers/book');

// Traitement de requête post sur /api/books
router.post('/', auth, bookCtrl.createBook)

// Traitement de requête get pour un seul livre selon l'id sur /api/books
router.get('/:id', auth, bookCtrl.getOneBook)

// Traitement de requête put pour un seul livre selon l'id sur /api/books
router.put('/:id', auth, bookCtrl.modifyBook)

// Traitement de requête delete pour un seul livre selon l'id sur /api/books
router.delete('/:id', auth, bookCtrl.deleteBook)

// Traitement de requête get pour tout les livres sur /api/books
router.get("/", auth, bookCtrl.getAllBooks)



module.exports = router;