async function loginUser(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('password').value;

    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, senha);
        const user = userCredential.user;

        const token = await user.getIdToken(); // Obtendo o token de ID do Firebase

        const response = await fetch('http://localhost:5000/api/usuarios/login', {
            method: 'POST',  // Mudamos para POST
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Passando o token no cabeçalho
            },
            body: JSON.stringify({ uid: user.uid }) // Enviando o UID no corpo da requisição
        });

        console.log('Status da resposta:', response.status);
        
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.statusText}`);
        }

        const userData = await response.json();
        console.log('Dados do usuário recebidos:', userData);

        // Salvar os dados no localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', token);

        // Redirecionar para a página da dashboard ou outra página de sucesso
        window.location.href = './index.html';
    } catch (error) {
        console.error('Erro ao realizar o login:', error);
        alert('Email ou senha inválidos!');
    }
}

document.querySelector('#form-login').addEventListener('submit', loginUser);

