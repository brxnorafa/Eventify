const express = require('express');
const dotenv = require('dotenv');
const db = require('./config/db'); // Conexão com o banco de dados
const admin = require('./config/firebase'); // Configuração do Firebase
const cors = require('cors');

const UserRoutes = require('./routes/users/users');
const EventsRoutes = require('./routes/events/events');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());

app.use(express.json());

app.use('/api/usuarios', UserRoutes);
app.use('/api/eventos', EventsRoutes);

// Rota para testar o servidor
app.get('/', (req, res) => {
    res.send('Olá, seja bem-vindo ao Eventify!');
})


app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`)
});