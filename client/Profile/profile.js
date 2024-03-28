const back_end_url = "http://localhost:500";
const clientID = window.localStorage.getItem("clientID");

document.addEventListener('DOMContentLoaded', function(){
    // Retrieve clientID from local storage
    console.log("DOMContentLoaded event fired");
    console.log("Retrieved client ID:", clientID);

    if (clientID) {
        // If clientID exists, use it to fetch profile data
        console.log("client id gotten")
        fetchProfileData(clientID);
    } else {
        // Handle case when clientID is not available
        displayError("ClientID not found in local storage.");
    }

    // Select edit button
    const editButton = document.querySelector('.button-container .btn-info');

    // Select address fields
    const address1 = document.getElementById('add1');
    const address2 = document.getElementById('add2');
    const city = document.getElementById('city');
    const state = document.getElementById('state');
    const zip = document.getElementById('zip');


    // Add event listener to edit button
    editButton.addEventListener('click', function() {
        // Toggle between displaying text and input fields for editing
        toggleEditable(add1);
        toggleEditable(add2);
        toggleEditable(city);
        toggleEditable(state);
        toggleEditable(zip);

        if (editButton.textContent === 'Edit Profile') {
            alert("Editing is now allowed. You can edit Address 1, Address 2, State, Zip, and City.");
            editButton.textContent = 'Save Changes';
        } else {
            const updatedData = {
                address1: document.getElementById('add1').innerHTML,
                address2: document.getElementById('add2').innerHTML,
                city: document.getElementById('city').innerHTML,
                state: document.getElementById('state').innerHTML,
                zip: document.getElementById('zip').innerHTML,
                
            };



            updateProfile(clientID, updatedData);
            editButton.textContent = 'Edit Profile';
            // Here you can add code to save changes to the address
        }
    });

});


function fetchProfileData(clientID) {
    fetch(`${back_end_url}/api/profile?clientID=${clientID}`)
    .then(response => response.json())
    .then(data => {
        console.log("Data fetched:", data);
        if (Object.keys(data).length === 0 && data.constructor === Object) {
            displayEmptyData();
        } else {
            // Update client-side HTML with fetched data
            fetchData(data);
        }
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        displayError("Error fetching profile data.");
    });
}

function fetchData(data){
    // Populate data into HTML elements
    const nonBreakingSpace = '\u00A0'; 
    document.getElementById('clientID').textContent = clientID || "Not Available";
    document.getElementById('fname').textContent = data.fname || "Not Available";
    const welcomeMessage = `Welcome ${data.fname || "User"}!`;
    document.getElementById('welcomeMessage').textContent = welcomeMessage;
    document.getElementById('lname').textContent = data.lname || "Not Available";
    document.getElementById('add1').textContent = data.address1 || nonBreakingSpace;
    document.getElementById('add2').textContent = data.address2 || nonBreakingSpace;
    document.getElementById('city').textContent = data.city || nonBreakingSpace;
    document.getElementById('state').textContent = data.state || nonBreakingSpace;
    document.getElementById('zip').textContent = data.zipcode || nonBreakingSpace;

    // Populate email (username) field
    const email = data.username || "Not Available";
    document.getElementById('email').textContent = email;
}

function displayEmptyData() {
    // Replace the content of all <p> elements with "Not Available"
    document.querySelectorAll('.wrapper p').forEach(p => {
        p.textContent = "Not Available";
    });
}

function displayError(message) {
    // Display error message
    console.error(message);
    document.querySelectorAll('.wrapper p').forEach(p => {
        p.textContent = "Error: " + message;
    });
}


function toggleEditable(element) {
    element.contentEditable = (element.contentEditable === 'true') ? 'false' : 'true';
}
function updateProfile(clientID, updatedData) {
    console.log("trying to access api...")
    console.log("this is the data:", updatedData)
    fetch(`${back_end_url}/api/update_profile`, { // Constructing the URL using back_end_url
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ clientID, ...updatedData })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update profile');
        }
        return response.json();
    })
    .then(data => {
        console.log('Profile updated successfully:', data);
        // Optionally, you can perform additional actions after the profile is updated
    })
    .catch(error => {
        console.error('Error updating profile:', error);
        // Handle the error appropriately, such as displaying an error message to the user
    });
}

