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
                    <td>
                        <button class="btn btn-warning btn-sm edit-btn" data-id="${user.id}" data-username="${user.username}" data-role="${user.role}">Rediger</button>
                        <button class="btn btn-danger btn-sm delete-btn" data-id="${user.id}">Slet</button>
                    </td>
                `;
                userTableBody.appendChild(row);
            });

            document.querySelectorAll('.delete-btn').forEach((button) => {
                button.addEventListener('click', handleDeleteClick);
            });

            document.querySelectorAll('.edit-btn').forEach((button) => {
                button.addEventListener('click', handleEditClick);
            });
        } else {
            displayMessage('Kunne ikke hente brugere', 'red');
        }
    } catch (error) {
        displayMessage('Fejl ved hentning af brugere', 'red');
    }
}

function handleEditClick(event) {
    const userId = event.target.dataset.id;
    const username = event.target.dataset.username;
    const role = event.target.dataset.role;

    document.getElementById('edit-username').value = username;
    document.getElementById('edit-role').value = role;

    const editUserModal = new bootstrap.Modal(document.getElementById('editUserModal'));
    editUserModal.show();

    const editUserForm = document.getElementById('edit-user-form');
    editUserForm.addEventListener('submit', function (event) {
        event.preventDefault();
        updateUser(userId, editUserModal);
    });
}

async function updateUser(userId, editUserModal) {
    const token = localStorage.getItem('token');
    const username = document.getElementById('edit-username').value;
    const password = document.getElementById('edit-password').value;
    const role = document.getElementById('edit-role').value;

    const userData = { username, role };

    if (password) {
        userData.password = password;
    }

    try {
        const response = await fetch(`${BASE_API_URL}/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(userData),
        });

        const messageElement = document.getElementById('edit-user-message');
        if (response.ok) {
            messageElement.textContent = 'Bruger blev opdateret!';
            messageElement.style.color = 'green';
            messageElement.classList.remove('d-none');

            setTimeout(() => {
                editUserModal.hide();
                document.getElementById('edit-user-form').reset();
                loadUsers();
            }, 1500);
        } else {
            messageElement.textContent = 'Kunne ikke opdatere bruger';
            messageElement.style.color = 'red';
            messageElement.classList.remove('d-none');
        }
    } catch (error) {
        const messageElement = document.getElementById('edit-user-message');
        messageElement.textContent = 'Fejl ved opdatering af bruger.';
        messageElement.style.color = 'red';
        messageElement.classList.remove('d-none');
    }
}

function handleDeleteClick(event) {
    const userId = event.target.dataset.id;
    const deleteConfirmationModal = new bootstrap.Modal(document.getElementById('deleteConfirmationModal'));
    const modalMessage = document.getElementById('delete-modal-message');
    modalMessage.textContent = '';
    modalMessage.style.color = '';

    deleteConfirmationModal.show();

    document.getElementById('confirm-delete').addEventListener('click', async function () {
        try {
            const success = await deleteUser(userId);

            if (success) {
                modalMessage.textContent = 'Bruger blev slettet.';
                modalMessage.style.color = 'green';

                setTimeout(() => {
                    deleteConfirmationModal.hide();
                    loadUsers();
                }, 1500);
            } else {
                modalMessage.textContent = 'Kunne ikke slette bruger.';
                modalMessage.style.color = 'red';
            }
        } catch (error) {
            modalMessage.textContent = 'Fejl under sletning af bruger.';
            modalMessage.style.color = 'red';
        }
    });
}

async function deleteUser(userId) {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${BASE_API_URL}/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        return response.ok;
    } catch (error) {
        return false;
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
                displayMessage('Bruger blev oprettet!', 'green');
                loadUsers();
                createUserForm.reset();
            } else {
                const error = await response.json();
                displayMessage(error.message || 'Kunne ikke oprette bruger.', 'red');
                createUserForm.reset();
            }
        } catch (error) {
            displayMessage('Fejl ved oprettelse af bruger.', 'red');
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
    logoutButton.addEventListener('click', function () {
        localStorage.clear();
        window.location.href = 'index.html';
    });
}
