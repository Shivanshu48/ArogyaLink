document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const urlParams = new URLSearchParams(window.location.search);
    const role = urlParams.get('role');

    if (role) {
        document.getElementById('role').value = role;
    }

    togglePassword.addEventListener('click', function() {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
    });

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const selectedRole = document.getElementById('role').value;

        let isValid = true;

        if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            showError('email', 'Please enter a valid email address');
            isValid = false;
        } else {
            clearError('email');
        }

        if (!password || password.length < 6) {
            showError('password', 'Password must be at least 6 characters');
            isValid = false;
        } else {
            clearError('password');
        }

        if (!selectedRole) {
            showError('role', 'Please select your role');
            isValid = false;
        } else {
            clearError('role');
        }

        if (isValid) {
            alert(`Login attempt:\nEmail: ${email}\nRole: ${selectedRole}\n\nThis is a demo. Implement backend authentication.`);
        }
    });

    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorElement = field.parentElement.querySelector('.form-text');
        errorElement.textContent = message;
        errorElement.classList.add('show');
        field.classList.add('is-invalid');
    }

    function clearError(fieldId) {
        const field = document.getElementById(fieldId);
        const errorElement = field.parentElement.querySelector('.form-text');
        errorElement.classList.remove('show');
        field.classList.remove('is-invalid');
    }
});