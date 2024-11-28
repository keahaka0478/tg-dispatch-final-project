const BASE_API_URL = 'https://tg-dispatch-ehbvhcbwcqgcabde.northeurope-01.azurewebsites.net';

document.addEventListener('DOMContentLoaded', function () {
    protectPage();
    setupLogout();
    loadUsers();
    setupCreateUser();
});

async function loadUsers() {
    const token = localStorage.getItem('token');
    const userTableBody = document.getElementById('user-table-body');

    try {
        const response = await fetch(`${BASE_API_URL}/users/`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (response.ok) {
            const users = await response.json();
            userTableBody.innerHTML = '';
            users.forEach((user) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.username}</td>
                    <td>${user.role}</td>
                `;
                userTableBody.appendChild(row);
            });
        } else {
            displayMessage('Failed to fetch users', 'red');
        }
    } catch (error) {
        displayMessage('Error occurred while fetching users', 'red');
    }
}

function setupCreateUser() {
    const createUserForm = document.getElementById('create-user-form');
    const token = localStorage.getItem('token');

    createUserForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const username = document.getElementById('new-username').value;
        const password = document.getElementById('new-password').value;
        const role = document.getElementById('new-role').value;

        const userData = { username, password, role };

        try {
            const response = await fetch(`${BASE_API_URL}/users/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                displayMessage('User created successfully!', 'green');
                loadUsers();
                createUserForm.reset();
            } else {
                const error = await response.json();
                displayMessage(error.message || 'Failed to create user.', 'red');
                createUserForm.reset();
            }
        } catch (error) {
            displayMessage('An error occurred. Please try again.', 'red');
            createUserForm.reset();
        }
    });
}

function displayMessage(message, color) {
    const messageElement = document.getElementById('create-user-message');
    messageElement.textContent = message;
    messageElement.style.color = color;
    messageElement.classList.remove('d-none');
    setTimeout(() => {
        messageElement.classList.add('d-none');
    }, 3000);
}
