const BASE_API_URL = 'https://tg-dispatch-ehbvhcbwcqgcabde.northeurope-01.azurewebsites.net/customers';

document.addEventListener('DOMContentLoaded', function () {
    protectPage();
    setupLogout();
    loadCustomers();
    setupCreateCustomer();
});

async function loadCustomers() {
    const token = localStorage.getItem('token');
    const customerTableBody = document.getElementById('customer-table-body');

    try {
        const response = await fetch(`${BASE_API_URL}/`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (response.ok) {
            const customers = await response.json();
            customerTableBody.innerHTML = '';
            customers.forEach((customer) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${customer.id}</td>
                    <td>${customer.name}</td>
                    <td>${customer.address}</td>
                    <td>${customer.zip}</td>
                    <td>${customer.city}</td>
                    <td>${customer.vat}</td>
                    <td>${customer.email}</td>
                    <td>${customer.phone}</td>
                    <td>
                        <button class="btn btn-warning btn-sm edit-btn" data-id="${customer.id}" data-name="${customer.name}" data-address="${customer.address}" data-zip="${customer.zip}" data-city="${customer.city}" data-vat="${customer.vat}" data-email="${customer.email}" data-phone="${customer.phone}">Rediger</button>
                        <button class="btn btn-danger btn-sm delete-btn" data-id="${customer.id}">Slet</button>
                    </td>
                `;
                customerTableBody.appendChild(row);
            });

            document.querySelectorAll('.delete-btn').forEach((button) => {
                button.addEventListener('click', handleDeleteClick);
            });

            document.querySelectorAll('.edit-btn').forEach((button) => {
                button.addEventListener('click', handleEditClick);
            });
        } else {
            displayMessage('Kunne ikke hente kunder', 'red');
        }
    } catch (error) {
        displayMessage('Fejl ved hentning af kunder', 'red');
    }
}

function handleEditClick(event) {
    const customerId = event.target.dataset.id;
    const name = event.target.dataset.name;
    const address = event.target.dataset.address;
    const zip = event.target.dataset.zip;
    const city = event.target.dataset.city;
    const vat = event.target.dataset.vat;
    const email = event.target.dataset.email;
    const phone = event.target.dataset.phone;

    document.getElementById('edit-name').value = name;
    document.getElementById('edit-address').value = address;
    document.getElementById('edit-zip').value = zip;
    document.getElementById('edit-city').value = city;
    document.getElementById('edit-vat').value = vat;
    document.getElementById('edit-email').value = email;
    document.getElementById('edit-phone').value = phone;

    const editCustomerModal = new bootstrap.Modal(document.getElementById('editCustomerModal'));
    editCustomerModal.show();

    const editCustomerForm = document.getElementById('edit-customer-form');
    editCustomerForm.addEventListener('submit', function (event) {
        event.preventDefault();
        updateCustomer(customerId, editCustomerModal);
    });
}

async function updateCustomer(customerId, editCustomerModal) {
    const token = localStorage.getItem('token');
    const name = document.getElementById('edit-name').value;
    const address = document.getElementById('edit-address').value;
    const zip = document.getElementById('edit-zip').value;
    const city = document.getElementById('edit-city').value;
    const vat = document.getElementById('edit-vat').value;
    const email = document.getElementById('edit-email').value;
    const phone = document.getElementById('edit-phone').value;

    const customerData = { name, address, zip, city, vat, email, phone };

    try {
        const response = await fetch(`${BASE_API_URL}/${customerId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(customerData),
        });

        const messageElement = document.getElementById('edit-customer-message');
        if (response.ok) {
            messageElement.textContent = 'Kunde blev opdateret!';
            messageElement.style.color = 'green';
            messageElement.classList.remove('d-none');

            setTimeout(() => {
                messageElement.classList.add('d-none');
            }, 1500);

            setTimeout(() => {
                editCustomerModal.hide();
                document.getElementById('edit-customer-form').reset();
                loadCustomers();
            }, 1500);
        } else {
            messageElement.textContent = 'Kunne ikke opdatere kunde';
            messageElement.style.color = 'red';
            messageElement.classList.remove('d-none');

            setTimeout(() => {
                messageElement.classList.add('d-none');
            }, 1500);
        }
    } catch (error) {
        const messageElement = document.getElementById('edit-customer-message');
        messageElement.textContent = 'Fejl ved opdatering af kunde.';
        messageElement.style.color = 'red';
        messageElement.classList.remove('d-none');

        setTimeout(() => {
            messageElement.classList.add('d-none');
        }, 1500);
    }
}

function handleDeleteClick(event) {
    const customerId = event.target.dataset.id;

    const deleteConfirmationModal = new bootstrap.Modal(document.getElementById('deleteConfirmationModal'));

    deleteConfirmationModal.show();

    document.getElementById('confirm-delete').addEventListener('click', async function () {
        try {
            const success = await deleteCustomer(customerId);

            if (success) {
                deleteConfirmationModal.hide();
                loadCustomers();
            } else {
                document.getElementById('delete-modal-message').textContent = 'Fejl ved sletning af kunde';
                document.getElementById('delete-modal-message').style.color = 'red';
            }
        } catch (error) {
            document.getElementById('delete-modal-message').textContent = 'Fejl ved sletning af kunde';
            document.getElementById('delete-modal-message').style.color = 'red';
        }
    });
}

async function deleteCustomer(customerId) {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${BASE_API_URL}/${customerId}`, {
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

function setupCreateCustomer() {
    const createCustomerForm = document.getElementById('create-customer-form');
    createCustomerForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const name = document.getElementById('new-name').value;
        const address = document.getElementById('new-address').value;
        const zip = document.getElementById('new-zip').value;
        const city = document.getElementById('new-city').value;
        const vat = document.getElementById('new-vat').value;
        const email = document.getElementById('new-email').value;
        const phone = document.getElementById('new-phone').value;

        const newCustomer = { name, address, zip, city, vat, email, phone };

        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${BASE_API_URL}/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(newCustomer),
            });

            const messageElement = document.getElementById('create-customer-message');
            if (response.ok) {
                messageElement.textContent = 'Kunde blev oprettet!';
                messageElement.style.color = 'green';
                messageElement.classList.remove('d-none');

                setTimeout(() => {
                    messageElement.classList.add('d-none');
                }, 1500);

                setTimeout(() => {
                    createCustomerForm.reset();
                    loadCustomers();
                }, 1500);
            } else {
                messageElement.textContent = 'Kunne ikke oprette kunde';
                messageElement.style.color = 'red';
                messageElement.classList.remove('d-none');

                setTimeout(() => {
                    messageElement.classList.add('d-none');
                }, 1500);
            }
        } catch (error) {
            const messageElement = document.getElementById('create-customer-message');
            messageElement.textContent = 'Fejl ved oprettelse af kunde';
            messageElement.style.color = 'red';
            messageElement.classList.remove('d-none');

            setTimeout(() => {
                messageElement.classList.add('d-none');
            }, 1500);
        }
    });
}

function displayMessage(message, color) {
    const messageElement = document.getElementById('create-customer-message');
    messageElement.textContent = message;
    messageElement.style.color = color;
    messageElement.classList.remove('d-none');
    setTimeout(() => {
        messageElement.classList.add('d-none');
    }, 3000);
}
