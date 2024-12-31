const express = require('express');
const dotenv = require('dotenv');
const db = require('./config/db'); // Conexão com o banco de dados
const admin = require('./config/firebase'); // Configuração do Firebase
const cors = require('cors');

const registerUserRoutes = require('./routes/users/registerUser');
const searchEventsRoutes = require('./routes/events/searchEvents');


dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());

app.use(express.json());

// Usando a rota de cadastro de usuário
app.use('/api/usuarios', registerUserRoutes);

// Usando a rota de busca de eventos
app.use('/api/eventos', searchEventsRoutes);

// Rota para testar o servidor
app.get('/', (req, res) => {
    res.send('Olá, seja bem-vindo ao Eventify!');
})

// Testar novamente conexão com o banco de dados
db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.stack);
    } else {
        console.log('Banco de dados conectado com ID', db.threadId);
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`)
});