const admin = require('../config/firebase');

async function verificarToken(req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error('Erro ao verificar token:', error);
        return res.status(401).json({ message: 'Token inválido ou expirado.' });
    }
}

module.exports = verificarToken;