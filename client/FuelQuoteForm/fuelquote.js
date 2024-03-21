document.addEventListener('DOMContentLoaded', function() {
    const clientIDInput = document.getElementById('clientID');
    const deliveryAddressSelect = document.getElementById('deliveryaddress');

    fetchClientID();

    fetchProfileData();

    function fetchClientID() {
        fetch('/api/profile', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            clientIDInput.value = data.clientID;
        })
        .catch(error => {
            console.error('Error fetching client ID:', error);
        });
    }

    function fetchProfileData() {
        fetch('/api/profile', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.address1) {
                const addressOption1 = document.createElement('option');
                addressOption1.value = data.address1;
                addressOption1.textContent = data.address1;
                deliveryAddressSelect.appendChild(addressOption1);
            }
            if (data.address2) {
                const addressOption2 = document.createElement('option');
                addressOption2.value = data.address2;
                addressOption2.textContent = data.address2;
                deliveryAddressSelect.appendChild(addressOption2);
            }
        })
        .catch(error => {
            console.error('Error fetching profile data:', error);
        });
    }
});
