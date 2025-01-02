function openSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.remove('-left-full');
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.add('-left-full');
}

function updateNavbar(user) {
    const loginButton = document.getElementById("login-button");
    const userDropdown = document.getElementById("user-dropdown");

    // Elementos da sidebar
    const loginLink = document.getElementById('login-link');
    const profileSection = document.getElementById('profile-section');

    if (user) {
        // Se o usuário estiver logado
        loginButton.classList.add("hidden");
        userDropdown.classList.remove("hidden");
        
        loginLink.classList.add('hidden');
        profileSection.classList.remove('hidden');
    } else {
        // Se o usuário não estiver logado
        loginButton.classList.remove("hidden");
        userDropdown.classList.add("hidden");

        loginLink.classList.remove('hidden');
        profileSection.classList.add('hidden');
    }
}

firebase.auth().onAuthStateChanged((user) => {
    updateNavbar(user);
});

document.getElementById("logout-button").addEventListener("click", async () => {
    try {
        firebase.auth().signOut();
        alert("Você foi desconectado.");
        window.location.href = '/frontend/public/index.html';
    } catch (error) {
        console.error("Erro ao fazer logout:", error);
    }
});