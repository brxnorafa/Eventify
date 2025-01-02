const express = require('express');
const db = require('../../config/db');

const router = express.Router();

router.get('/search', async (req, res) => {
    const { nome, estado, cidade } = req.query;

    let query = 'SELECT * FROM eventos WHERE 1 = 1';  // Base da query
    let params = [];

    if (nome) {
        console.log(`Filtrando por nome: ${nome}`);
        query += ' AND nome LIKE ?';  // Filtra por nome
        params.push(`%${nome}%`); // Busca parcial pelo nome
    }

    if (estado) {
        console.log(`Filtrando por estado: ${estado}`);
        query += ' AND estado = ?';  // Filtra pelo estado
        params.push(estado.toUpperCase()); // Normaliza para maiúsculas
    }

    if (cidade) {
        console.log(`Filtrando por cidade: ${cidade}`);
        query += ' AND cidade = ?';  // Filtra pela cidade
        params.push(cidade);
    }

    console.log('Consulta SQL:', query);
    console.log('Parâmetros:', params);

    try {
        const [results] = await db.query(query, params);
        console.log('Resultados encontrados:', results);
        res.json(results);
    } catch (err) {
        console.error('Erro ao buscar eventos:', err);
        res.status(500).send('Erro ao buscar eventos');
    }
});

module.exports = router;
