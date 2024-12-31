function openSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.remove('-left-full');
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.add('-left-full');
}