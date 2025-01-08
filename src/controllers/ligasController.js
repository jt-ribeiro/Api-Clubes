const db = require('../models/db');

// Listar todas as ligas
exports.getAllLigas = (req, res) => {
    const query = 'SELECT * FROM ligas'; // Não filtra por clubes
    db.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao buscar ligas:', err);
            res.status(500).send('Erro ao buscar ligas.');
        } else {
            res.status(200).json(results);
        }
    });
};


// Obter uma liga por ID
exports.getLigaById = (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM ligas WHERE id = ?', [id], (err, results) => {
        if (err) res.status(500).send(err);
        else res.status(200).json(results[0]);
    });
};

// Criar uma nova liga
exports.createLiga = (req, res) => {
    const { nome, descricao } = req.body;

    if (!nome || !descricao) {
        return res.status(400).send('Nome e descrição são obrigatórios.');
    }

    const query = 'INSERT INTO ligas (nome, descricao) VALUES (?, ?)';
    db.query(query, [nome, descricao], (err) => {
        if (err) {
            console.error('Erro ao criar liga:', err);
            return res.status(500).send('Erro ao criar liga.');
        }
        res.status(201).send('Liga criada com sucesso!');
    });
};

// Atualizar dados de uma liga
exports.updateLiga = (req, res) => {
    const { id } = req.params;
    const { nome, descricao } = req.body;

    if (!nome || !descricao) {
        return res.status(400).send('Nome e descrição são obrigatórios.');
    }

    const query = 'UPDATE ligas SET nome = ?, descricao = ? WHERE id = ?';
    db.query(query, [nome, descricao, id], (err) => {
        if (err) {
            console.error('Erro ao atualizar liga:', err);
            return res.status(500).send('Erro ao atualizar liga.');
        }
        res.status(200).send('Liga atualizada com sucesso!');
    });
};

// Excluir uma liga
exports.deleteLiga = (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM ligas WHERE id = ?';
    db.query(query, [id], (err) => {
        if (err) {
            console.error('Erro ao excluir liga:', err);
            return res.status(500).send('Erro ao excluir liga.');
        }
        res.status(200).send('Liga excluída com sucesso!');
    });
};