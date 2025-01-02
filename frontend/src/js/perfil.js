document.addEventListener("DOMContentLoaded", () => {
    try {
        // Tenta obter os dados do usuário do localStorage
        const userData = JSON.parse(localStorage.getItem("user")) || {};

        // Preenche os campos com os valores do usuário
        document.getElementById("name").value = userData.nome || "";
        document.getElementById("email").value = userData.email || "";
        document.getElementById("birthdate").value = userData.data_nascimento || "";


        document.getElementById("cpf").value = userData.cpf || "";

        // Gerencia o estado do botão e do campo de CPF com base no status de verificação
        const verifyCpfButton = document.getElementById("verify-cpf");
        const cpfAlert = document.getElementById("cpf-alert");

        if (userData.cpf) {
            if (verifyCpfButton) verifyCpfButton.disabled = true;
            verifyCpfButton.innerHTML = "Verificado";
            document.getElementById("cpf").readOnly = true;
            document.getElementById("cpf").disabled = true;
            if (cpfAlert) cpfAlert.classList.add("hidden");
        } else {
            if (verifyCpfButton)  verifyCpfButton.disabled = false;
        }
    } catch (error) {
        console.error("Erro ao carregar os dados do usuário:", error);
        alert("Erro ao carregar os dados. Por favor, recarregue a página.");
    }
});

document.getElementById("profile-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    // Obtém os dados do usuário do localStorage
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData || !userData.id) {
        alert("Usuário não encontrado. Por favor, faça login novamente.");
        return;
    }

    // Dados atualizados do formulário
    const updatedData = {
        id: userData.id,
        nome: document.getElementById("name").value,
        data_nascimento: document.getElementById("birthdate").value,
    };

    try {
        // Faz a requisição para atualizar os dados
        const response = await fetch('http://localhost:5000/api/usuarios/atualizar-dados', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        });

        // Verifica o status da resposta
        const result = await response.json();
        if (response.ok) {
            alert("Alterações salvas com sucesso!");
            // Atualiza os dados no localStorage
            localStorage.setItem('user', JSON.stringify({ ...userData, ...updatedData }));
        } else {
            alert(`Erro: ${result.message || "Não foi possível salvar as alterações."}`);
        }
    } catch (error) {
        console.error("Erro ao salvar as alterações:", error);
        alert("Erro ao salvar as alterações. Por favor, tente novamente mais tarde.");
    }
});


document.getElementById("verify-cpf").addEventListener("click", async () => {
    const cpf = document.getElementById("cpf").value;
    const userData = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token'); // Supondo que o token esteja no localStorage

    if (!token) {
        alert("Token não encontrado. Faça login novamente.");
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/usuarios/verificar-cpf', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Passando o token no cabeçalho
            },
            body: JSON.stringify({ id: userData.id, cpf: cpf }) // Enviando os dados para verificação
        });

        if (response.ok) {
            const result = await response.json();
            alert(result.message || "CPF verificado com sucesso!");

            // Atualizar o localStorage corretamente
            userData.cpf = cpf; // Atualizar o CPF no objeto
            localStorage.setItem('user', JSON.stringify(userData)); // Salvar novamente como string JSON

        } else {
            const error = await response.json();
            alert(error.message || "Erro ao verificar CPF.");
        }
    } catch (error) {
        console.error('Erro ao fazer a requisição:', error);
        alert("Erro ao fazer a requisição.");
    }
});

