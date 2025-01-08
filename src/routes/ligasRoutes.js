const express = require('express');
const router = express.Router();
const ligasController = require('../controllers/ligasController');

// Rotas para gerenciar ligas
router.get('/', ligasController.getAllLigas);
router.get('/:id', ligasController.getLigaById);
router.post('/', ligasController.createLiga);
router.put('/:id', ligasController.updateLiga);
router.delete('/:id', ligasController.deleteLiga);

module.exports = router;
