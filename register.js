document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const roleSelect = document.getElementById('reg-role');
    const doctorFields = document.getElementById('doctorFields');
    const pharmacyFields = document.getElementById('pharmacyFields');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const toggleConfirmPasswordBtn = document.getElementById('toggleConfirmPassword');
    const passwordInput = document.getElementById('reg-password');
    const confirmPasswordInput = document.getElementById('confirm-password');

    roleSelect.addEventListener('change', function() {
        const selectedRole = this.value;

        if (selectedRole === 'doctor') {
            doctorFields.style.display = 'block';
            pharmacyFields.style.display = 'none';
        } else if (selectedRole === 'pharmacy') {
            pharmacyFields.style.display = 'block';
            doctorFields.style.display = 'none';
        } else {
            doctorFields.style.display = 'none';
            pharmacyFields.style.display = 'none';
        }
    });

    togglePasswordBtn.addEventListener('click', function() {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
    });

    toggleConfirmPasswordBtn.addEventListener('click', function() {
        const type = confirmPasswordInput.type === 'password' ? 'text' : 'password';
        confirmPasswordInput.type = type;
    });

    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const role = roleSelect.value;
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const terms = document.getElementById('terms').checked;

        let isValid = true;

        if (!name || name.length < 2) {
            showError('name', 'Please enter a valid name');
            isValid = false;
        } else {
            clearError('name');
        }

        if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            showError('reg-email', 'Please enter a valid email address');
            isValid = false;
        } else {
            clearError('reg-email');
        }

        if (!phone || phone.length < 10) {
            showError('phone', 'Please enter a valid phone number');
            isValid = false;
        } else {
            clearError('phone');
        }

        if (!role) {
            showError('reg-role', 'Please select a role');
            isValid = false;
        } else {
            clearError('reg-role');
        }

        if (role === 'doctor') {
            const specialization = document.getElementById('specialization').value.trim();
            if (!specialization) {
                showError('specialization', 'Please enter your specialization');
                isValid = false;
            } else {
                clearError('specialization');
            }
        }

        if (role === 'pharmacy') {
            const address = document.getElementById('pharmacy-address').value.trim();
            if (!address) {
                showError('pharmacy-address', 'Please enter your pharmacy address');
                isValid = false;
            } else {
                clearError('pharmacy-address');
            }
        }

        if (!password || password.length < 6) {
            showError('reg-password', 'Password must be at least 6 characters');
            isValid = false;
        } else {
            clearError('reg-password');
        }

        if (password !== confirmPassword) {
            showError('confirm-password', 'Passwords do not match');
            isValid = false;
        } else {
            clearError('confirm-password');
        }

        if (!terms) {
            alert('Please agree to the Terms and Conditions');
            isValid = false;
        }

        if (isValid) {
            const formData = {
                name,
                email,
                phone,
                role,
                terms
            };

            if (role === 'doctor') {
                formData.specialization = document.getElementById('specialization').value;
            }

            if (role === 'pharmacy') {
                formData.pharmacyAddress = document.getElementById('pharmacy-address').value;
            }

            if (isValid) {
    const formData = new FormData(registerForm);

    fetch('register.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        alert(data);
        registerForm.reset();
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

        }
    });

    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorElement = field.parentElement.querySelector('.form-text');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
            field.classList.add('is-invalid');
        }
    }

    function clearError(fieldId) {
        const field = document.getElementById(fieldId);
        const errorElement = field.parentElement.querySelector('.form-text');
        if (errorElement) {
            errorElement.classList.remove('show');
            field.classList.remove('is-invalid');
        }
    }
});