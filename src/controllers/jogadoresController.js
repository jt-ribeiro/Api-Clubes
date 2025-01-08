const db = require('../models/db');

// Retornar todos os jogadores
exports.getAllJogadores = (req, res) => {
    db.query('SELECT * FROM jogadores', (err, results) => {
        if (err) res.status(500).send(err);
        else res.status(200).json(results);
    });
};

// Retornar um jogador específico por ID
exports.getJogadorById = (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM jogadores WHERE id = ?', [id], (err, results) => {
        if (err) res.status(500).send(err);
        else res.status(200).json(results[0]);
    });
};

// Obter jogadores por clube
exports.getJogadoresByClube = (req, res) => {
    const { clubeId } = req.params; // Obtém o clubeId dos parâmetros da URL

    if (!clubeId) {
        return res.status(400).send('Clube ID não fornecido.');
    }

    const query = 'SELECT * FROM jogadores WHERE clube_id = ?';
    db.query(query, [clubeId], (err, results) => {
        if (err) {
            console.error('Erro ao buscar jogadores:', err);
            return res.status(500).send('Erro ao buscar jogadores.');
        }

        res.status(200).json(results);
    });
};


// Criar um novo jogador
exports.createJogador = (req, res) => {
    const { nome, clube_id, posicao } = req.body;

    // Validação dos campos
    if (!nome || !clube_id || !posicao) {
        return res.status(400).send('Todos os campos (nome, clube_id, posicao) são obrigatórios.');
    }

    // Verificar se a posição é válida
    const posicoesValidas = ['Guarda-Redes', 'Defesa', 'Médio', 'Avançado'];
    if (!posicoesValidas.includes(posicao)) {
        return res.status(400).send(`A posição deve ser uma das seguintes: ${posicoesValidas.join(', ')}`);
    }

    // Inserir jogador no banco de dados
    const query = 'INSERT INTO jogadores (nome, clube_id, posicao) VALUES (?, ?, ?)';
    db.query(query, [nome, clube_id, posicao], (err) => {
        if (err) {
            console.error('Erro ao criar jogador:', err);
            return res.status(500).send('Erro ao criar jogador.');
        }
        res.status(201).send('Jogador criado com sucesso!');
    });
};

// Atualizar um jogador
exports.updateJogador = (req, res) => {
    const { id } = req.params;
    const { nome, posicao } = req.body;

    // Validação dos campos
    if (!nome || !posicao) {
        return res.status(400).send('Os campos nome e posicao são obrigatórios.');
    }

    // Verificar se a posição é válida
    const posicoesValidas = ['Guarda-Redes', 'Defesa', 'Médio', 'Avançado'];
    if (!posicoesValidas.includes(posicao)) {
        return res.status(400).send(`A posição deve ser uma das seguintes: ${posicoesValidas.join(', ')}`);
    }

    // Atualizar jogador no banco de dados
    const query = 'UPDATE jogadores SET nome = ?, posicao = ? WHERE id = ?';
    db.query(query, [nome, posicao, id], (err) => {
        if (err) {
            console.error('Erro ao atualizar jogador:', err);
            return res.status(500).send('Erro ao atualizar jogador.');
        }
        res.status(200).send('Jogador atualizado com sucesso!');
    });
};


// Excluir um jogador
exports.deleteJogador = (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM jogadores WHERE id = ?';
    db.query(query, [id], (err) => {
        if (err) {
            console.error('Erro ao excluir jogador:', err);
            return res.status(500).send('Erro ao excluir jogador.');
        }
        res.status(200).send('Jogador excluído com sucesso!');
    });
};

