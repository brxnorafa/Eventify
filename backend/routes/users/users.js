const express = require('express');
const db = require('../../config/db'); // Conexão com o MySQL (usando mysql2/promise)
const admin = require('../../config/firebase'); // Configuração do Firebase
const router = express.Router();

// Rota para cadastro de usuário
router.post('/register', async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
        // Criação do usuário no Firebase (agora com a senha)
        const userRecord = await admin.auth().createUser({
            email,
            password: senha,  // Firebase precisa da senha
            displayName: nome,
        });

        // Inserir os dados do usuário no banco de dados (sem CPF e data_nascimento por enquanto)
        const query = 'INSERT INTO usuarios (nome, email, firebase_uid) VALUES (?, ?, ?)';
        const values = [nome, email, userRecord.uid];

        const [result] = await db.query(query, values);

        res.status(201).json({
            message: 'Usuário cadastrado com sucesso!',
            id: result.insertId,
            firebase_uid: userRecord.uid
        });

    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        return res.status(500).json({ message: 'Erro ao cadastrar o usuário.', error: error.message });
    }
});


router.post('/login', async (req, res) => {
    const { uid } = req.body;

    if (!uid) {
        console.error('UID não fornecido no corpo da requisição');
        return res.status(400).json({ message: 'UID é necessário no corpo da requisição' });
    }

    console.log('Recebendo requisição com UID:', uid);  

    const query = 'SELECT * FROM usuarios WHERE firebase_uid = ?';

    try {
        // Usando a versão com promise do MySQL2
        const [results] = await db.query(query, [uid]);

        if (results.length === 0) {
            console.log('Nenhum usuário encontrado com o UID:', uid);  // Log para verificar se o usuário foi encontrado
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        console.log('Usuário encontrado:', results[0]);  // Log para verificar os dados retornados

        res.status(200).json(results[0]);

    } catch (error) {
        console.error('Erro ao buscar usuário no banco de dados:', error);
        return res.status(500).json({ message: 'Erro ao buscar usuário no banco de dados.' });
    }
});

// Verificar CPF
router.post('/verificar-cpf', async (req, res) => {
    const { cpf, id } = req.body;

    if (!cpf || !id) {
        console.error('CPF ou UID não fornecido no corpo da requisição');
        return res.status(400).json({ message: 'CPF e ID são necessários.' });
    }

    // Verifica se o CPF já está registrado
    const cpfCheckQuery = 'SELECT * FROM usuarios WHERE cpf = ?';
    const updateCpfQuery = 'UPDATE usuarios SET cpf = ? WHERE id = ?';

    try {
        const [cpfResults] = await db.query(cpfCheckQuery, [cpf]);

        if (cpfResults.length > 0) {
            // Se o CPF já existe, retorne erro
            return res.status(400).json({ message: 'CPF já está registrado em outra conta.' });
        }

        // Caso contrário, atualiza o CPF do usuário
        await db.query(updateCpfQuery, [cpf, id]);

        res.status(200).json({ message: 'CPF verificado com sucesso.' });

    } catch (error) {
        console.error('Erro ao verificar CPF:', error);
        return res.status(500).json({ message: 'Erro ao verificar CPF.' });
    }
});

// Atualizar dados do usuário
router.post('/atualizar-dados', async (req, res) => {
    const {nome, data_nascimento, id} = req.body;

    if (!nome || !data_nascimento || !id) {
        console.error('Dados incompletos para atualização');
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    const updateUserQuery = 'UPDATE usuarios SET nome = ?, data_nascimento = ? WHERE id = ?';

    try {
        const [results] = await db.query(updateUserQuery, [nome, data_nascimento, id]);

        if (results.affectedRows === 0) {
            console.log('Nenhum usuário encontrado para atualizar');
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        res.status(200).json({ message: 'Dados atualizados com sucesso.' });

    } catch (error) {
        console.error('Erro ao atualizar dados do usuário:', error);
        return res.status(500).json({ message: 'Erro ao atualizar dados do usuário.' });
    }
});




module.exports = router;