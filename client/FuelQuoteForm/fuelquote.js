const gallonsInput = document.getElementById('gallons_requested');
const gallonsError = document.getElementById('gallons_error');

gallonsInput.addEventListener('input', function() {
    const value = gallonsInput.value;
    if (!isNumeric(value)) {
        gallonsError.style.display = 'block';
    } else {
        gallonsError.style.display = 'none';
    }
});

function isNumeric(value) {
    return /^\d+$/.test(value);
}

$(document).ready(function() {
    $('#fuel_quote_form').submit(function(event) {
        event.preventDefault();

        // Gather form data
        const formData = $(this).serialize();

        // Send form data to backend
        $.post('/submit-fuel-quote', formData, function(response) {
            console.log(response); // Log the response from the server
            // You can handle the response here (e.g., show a success message to the user)
        });
    });
});