const mysql = require('mysql2/promise'); // Usando a versão de promise do mysql2
require('dotenv').config();

// Configuração de conexão com o banco de dados MySQL local
const connection = mysql.createPool({ // Usando createPool para melhor performance
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

async function testConnection() {
    try {
        const [rows, fields] = await connection.execute('SELECT 1');
        console.log('Conexão ao banco de dados bem-sucedida');
    } catch (err) {
        console.error('Erro ao conectar ao banco de dados:', err.stack);
    }
}

testConnection();

module.exports = connection;
