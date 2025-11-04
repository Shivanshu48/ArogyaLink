document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    const urlParams = new URLSearchParams(window.location.search);
    const role = urlParams.get('role');

    if (role === 'patient') {
        window.location.href = 'login.html?role=patient';
    } else if (role === 'doctor') {
        window.location.href = 'login.html?role=doctor';
    }
});