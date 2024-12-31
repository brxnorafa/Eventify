const express = require('express');
const db = require('../../config/db');
const admin = require('../../config/firebase'); // Configuração do Firebase
const router = express.Router();

// Função para calcular a idade
function calcularIdade(dataNascimento) {
    const nascimento = new Date(dataNascimento);
    const hoje = new Date();
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const m = hoje.getMonth() - nascimento.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
    }
    return idade;
}

// Rota para cadastro de usuário
router.post('/register', async (req, res) => {
    const { nome, email, senha, cpf, data_nascimento } = req.body;

    // Verificação de maioridade
    const idade = calcularIdade(data_nascimento);
    if (idade < 18) {
        return res.status(400).json({ message: 'Usuário menor de idade não permitido.' });
    }

    try {
        // Criação do usuário no Firebase
        const userRecord = await admin.auth().createUser({
            email,
            password: senha, 
            displayName: nome,
        });

        // Inserir os dados do usuário no banco de dados
        const query = 'INSERT INTO usuarios (nome, email, cpf, data_nascimento, firebase_uid) VALUES (?, ?, ?, ?, ?)';
        db.query(query, [nome, email, cpf, data_nascimento, userRecord.uid], (err, result) => {
            if (err) {
                console.error('Erro ao cadastrar usuário no banco de dados:', err);
                return res.status(500).json({ message: 'Erro ao cadastrar o usuário no banco de dados.', error: err });
            }

            res.status(201).json({ message: 'Usuário cadastrado com sucesso!', id: result.insertId, firebase_uid: userRecord.uid });
        });

    } catch (error) {
        console.error('Erro ao cadastrar usuário no Firebase:', error);
        return res.status(500).json({ message: 'Erro ao cadastrar o usuário no Firebase.', error: error.message });
    }
});

module.exports = router;
