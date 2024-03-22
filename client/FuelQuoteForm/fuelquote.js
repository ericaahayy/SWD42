document.addEventListener('DOMContentLoaded', function() {
    const gallonsInput = document.getElementById('galreq');
    const fuelQuoteForm = document.getElementById('fuel_quote_form');
    const deliveryAddressInput = document.getElementById('deliveryaddress');
    const deliveryDateInput = document.getElementById('deliverydate');
    const suggestedPriceInput = document.getElementById('suggestedprice');
    const totalAmountDueInput = document.getElementById('totaldue');

    fuelQuoteForm.addEventListener('submit', function(event) {
        event.preventDefault(); 

        const formData = new FormData(fuelQuoteForm); 

        fetch('/fuelquote/submit', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log(data); 
        })
        .catch(error => {
            console.error('Error:', error); 
        });
    });

    gallonsInput.addEventListener('input', calculateTotalAmountDue);
    suggestedPriceInput.addEventListener('input', calculateTotalAmountDue);

    function calculateTotalAmountDue() {
        const gallonsRequested = parseFloat(gallonsInput.value);
        const suggestedPricePerGallon = parseFloat(suggestedPriceInput.value);

        if (!isNaN(gallonsRequested) && !isNaN(suggestedPricePerGallon)) {
            const totalAmountDue = gallonsRequested * suggestedPricePerGallon;
            totalAmountDueInput.value = totalAmountDue.toFixed(2);
        }
    }

    suggestedPriceInput.value = '2.57'; // hardcoding for now
});
