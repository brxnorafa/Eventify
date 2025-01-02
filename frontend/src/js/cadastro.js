async function registerUser(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        alert("As senhas não coincidem.");
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/usuarios/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nome: name,
                email: email,
                senha: password
            })
        });

        const result = await response.json();
        console.log(result);

        if (response.status === 201) {
            window.location.href = './login.html';
        } else {
            alert("Erro ao cadastrar usuário.");
        }
    } catch (error) {
        console.error("Erro ao criar conta:", error);
        alert("Erro ao criar conta. Tente novamente.");
    }
}

document.querySelector('#form-register').addEventListener('submit', registerUser);