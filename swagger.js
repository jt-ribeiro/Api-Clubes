const swaggerJSDoc = require('swagger-jsdoc');

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Documentação da API',
            version: '1.0.0',
            description: 'Documentação gerada automaticamente com Swagger',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor de Desenvolvimento',
            },
        ],
    },
    apis: ['./src/routes/*.js'], // Caminho para as rotas com comentários de documentação
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
module.exports = swaggerDocs;
