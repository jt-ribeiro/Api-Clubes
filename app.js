const express = require('express');
const path = require('path');
const fs = require('fs');

const swaggerUi = require('swagger-ui-express');


const clubesRoutes = require('./src/routes/clubesRoutes');
const jogadoresRoutes = require('./src/routes/jogadoresRoutes');
const ligasRoutes = require('./src/routes/ligasRoutes');

const app = express();

// Carregar o arquivo swagger.json
const swaggerDocument = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, 'src/docs/swagger.json'), 'utf8')
);

// Middleware para parsing do JSON e conteúdo estático
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Para suportar requisições com form-urlencoded
app.use(express.static(path.join(__dirname, 'public')));

// Configuração do Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rotas da API
app.use('/clubes', clubesRoutes);
app.use('/jogadores', jogadoresRoutes);
app.use('/ligas', ligasRoutes);

// Tratamento de Erros 404
app.use((req, res, next) => {
    res.status(404).json({ error: 'Rota não encontrada.' });
});

// Middleware Global para Erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Ocorreu um erro no servidor.' });
});

// Inicialização do Servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor a rodar em http://localhost:${PORT}`);
    console.log(`Documentação da API disponível em http://localhost:${PORT}/api-docs`);
});
