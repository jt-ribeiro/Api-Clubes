const db = require('../models/db');

// Controlador para listar todos os clubes
exports.getAllClubes = (req, res) => {
    db.query('SELECT * FROM clubes', (err, results) => {
        if (err) {
            console.error('Erro ao buscar clubes:', err);
            res.status(500).send('Erro ao buscar clubes.');
        } else {
            res.status(200).json(results);
        }
    });
};

// Controlador para listar clubes de uma liga específica
exports.getClubesByLiga = (req, res) => {
    const { ligaId } = req.query; // Obtém o parâmetro ligaId da query string

    if (!ligaId) {
        return res.status(400).send('Liga ID não fornecido.'); // Retorna erro se ligaId não for enviado
    }

    const query = 'SELECT * FROM clubes WHERE liga_id = ?';
    db.query(query, [ligaId], (err, results) => {
        if (err) {
            console.error('Erro ao buscar clubes por liga:', err);
            return res.status(500).send('Erro ao buscar clubes.');
        }

        res.status(200).json(results); // Retorna os clubes filtrados pelo ligaId
    });
};



// Controlador para obter um clube específico pelo ID
exports.getClubeById = (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM clubes WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Erro ao buscar clube:', err);
            res.status(500).send('Erro ao buscar clube.');
        } else {
            res.status(200).json(results[0]);
        }
    });
};

// Controlador para criar um novo clube
exports.createClube = (req, res) => {
    const { nome, localizacao, anoFundacao, ligaId } = req.body;

    if (!nome || !localizacao || !anoFundacao || !ligaId) {
        return res.status(400).send('Todos os campos são obrigatórios.');
    }

    const query = 'INSERT INTO clubes (nome, localizacao, ano_fundacao, liga_id) VALUES (?, ?, ?, ?)';
    db.query(query, [nome, localizacao, anoFundacao, ligaId], (err) => {
        if (err) {
            console.error('Erro ao criar clube:', err);
            return res.status(500).send('Erro ao criar clube.');
        }
        res.status(201).send('Clube criado com sucesso!');
    });
};


// Controlador para atualizar um clube existente
exports.updateClube = (req, res) => {
    const { id } = req.params;
    const { nome, localizacao, anoFundacao } = req.body;

    const query = 'UPDATE clubes SET nome = ?, localizacao = ?, ano_fundacao = ? WHERE id = ?';
    db.query(query, [nome, localizacao, anoFundacao, id], (err) => {
        if (err) {
            console.error('Erro ao atualizar clube:', err);
            return res.status(500).send('Erro ao atualizar clube.');
        }
        res.status(200).send('Clube atualizado com sucesso!');
    });
};


// Controlador para excluir um clube
exports.deleteClube = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM clubes WHERE id = ?', [id], (err) => {
        if (err) {
            console.error('Erro ao excluir clube:', err);
            res.status(500).send('Erro ao excluir clube.');
        } else {
            res.status(200).send('Clube excluído com sucesso!');
        }
    });
};
