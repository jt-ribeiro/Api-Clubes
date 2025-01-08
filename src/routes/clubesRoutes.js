const express = require('express');
const router = express.Router();
const clubesController = require('../controllers/clubesController');

// Rota para listar todos os clubes
router.get('/', clubesController.getAllClubes);

// Rota para listar os clubes de uma liga específica
router.get('/liga', clubesController.getClubesByLiga);

// Rota para obter um clube específico pelo ID
router.get('/:id', clubesController.getClubeById);

// Rota para criar um novo clube
router.post('/', clubesController.createClube);

// Rota para atualizar um clube existente
router.put('/:id', clubesController.updateClube);

// Rota para excluir um clube
router.delete('/:id', clubesController.deleteClube);

module.exports = router;
