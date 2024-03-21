document.addEventListener("DOMContentLoaded", function() {
    fetchData(); // Call the function to fetch data when the DOM is loaded
});

function fetchData() {
    //fetch user data (server.js)
    fetch('/api/profile')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Update the content of the <p> elements with fetched data
        updateContent(data);
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        // If there's an error fetching data, replace content with "Error"
        displayError();
    });
}

function updateContent(data) {
    // Update the content of the <p> elements with fetched data
    document.getElementById('clientID').textContent = data.clientID || "Not Available";
    document.getElementById('fname').textContent = data.firstName || "Not Available";
    document.getElementById('lname').textContent = data.lastName || "Not Available";
    document.getElementById('email').textContent = data.email || "Not Available";
    document.getElementById('add1').textContent = data.address1 || "Not Available";
    document.getElementById('add2').textContent = data.address2 || "Not Available";
    document.getElementById('city').textContent = data.city || "Not Available";
    document.getElementById('state').textContent = data.state || "Not Available";
    document.getElementById('zip').textContent = data.zipCode || "Not Available";

}

function displayError() {
    // Replace the content of all <p> elements with "Error"
    document.querySelectorAll('p').forEach(p => {
        p.textContent = "Error";
    });
}
//NEED TO ADD THE EDIT PROFILE SECTION
