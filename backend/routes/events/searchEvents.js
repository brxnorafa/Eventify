const express = require('express');
const db = require('../../config/db');

const router = express.Router();

router.get('/search', async (req, res) => {
    const { nome, estado, cidade } = req.query;

    let query = 'SELECT * FROM eventos WHERE 1 = 1';
    let params = [];

    if (nome) {
        console.log(`Filtrando por nome: ${nome}`);
        query += ' AND nome LIKE ?';
        params.push(`%${nome}%`);
    }

    if (estado) {
        console.log(`Filtrando por estado: ${estado}`);
        query += ' AND estado = ?';
        params.push(estado.toUpperCase()); // Garanta que o estado esteja no formato correto
    }

    if (cidade) {
        console.log(`Filtrando por cidade: ${cidade}`);
        query += ' AND cidade = ?';
        params.push(cidade);
    }

    console.log('Consulta SQL:', query);
    console.log('Parâmetros:', params);

    db.query(query, params, (err, results) => {
        if (err) {
            console.error('Erro ao buscar eventos:', err);
            return res.status(500).send('Erro ao buscar eventos');
        }
        
        console.log('Resultados encontrados:', results);
        res.json(results);
    });
});

module.exports = router;
