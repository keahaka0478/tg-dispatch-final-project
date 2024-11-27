document.addEventListener('DOMContentLoaded', function () {
    const currentPage = window.location.pathname.split('/').pop();

    if (currentPage === 'index.html') {
        setupLoginPage();
    } else {
        protectPage();
        setupLogout();
    }
});

function setupLoginPage() {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async function (event) {
            event.preventDefault();

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            const loginData = { username, password };

            try {
                const response = await fetch('https://tg-dispatch-ehbvhcbwcqgcabde.northeurope-01.azurewebsites.net/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(loginData),
                });

                const data = await response.json();

                if (data.message === 'Invalid credentials') {
                    showError('Invalid credentials. Please try again.');
                } else {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('role', data.role);
                    localStorage.setItem('username', username);

                    if (data.role === 'ADMIN') {
                        window.location.href = 'admin.html';
                    } else if (data.role === 'DRIVER') {
                        window.location.href = 'driver.html';
                    }
                }
            } catch (error) {
                console.error('Error:', error);
                showError('Something went wrong. Please try again later.');
            }
        });
    }
}

function protectPage() {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const username = localStorage.getItem('username');

    if (!token || !role || !username) {
        window.location.href = 'index.html';
    }

    const roleElement = document.getElementById('role');
    const usernameElement = document.getElementById('username');

    if (roleElement && usernameElement) {
        roleElement.textContent = role;
        usernameElement.textContent = username;
    }
}

function setupLogout() {
    const logoutButton = document.getElementById('logout');
    if (logoutButton) {
        logoutButton.addEventListener('click', function () {
            localStorage.clear();
            window.location.href = 'index.html';
        });
    }
}

function showError(message) {
    const errorElement = document.getElementById('error-message');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.remove('d-none');
    }
}
