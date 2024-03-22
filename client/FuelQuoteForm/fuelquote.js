document.addEventListener('DOMContentLoaded', function() {
    const gallonsInput = document.getElementById('galreq');
    const fuelQuoteForm = document.getElementById('fuel_quote_form');
    const deliveryAddressInput = document.getElementById('deliveryaddress');
    const deliveryDateInput = document.getElementById('deliverydate');
    const suggestedPriceInput = document.getElementById('suggestedprice');
    const totalAmountDueInput = document.getElementById('totaldue');
    const fuelQuoteError = document.getElementById('fuel_quote_error');

    fuelQuoteForm.addEventListener('submit', function(event) {
        event.preventDefault(); 

        const gallonsRequested = gallonsInput.value;
        const deliveryAddress = deliveryAddressInput.value;
        const deliveryDate = deliveryDateInput.value;
        const suggestedPricePerGallon = suggestedPriceInput.value;

        fetch('/fuelquote/submit', {
            method: 'POST',
            body: JSON.stringify({ gallonsRequested, deliveryAddress, deliveryDate, suggestedPricePerGallon }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                fuelQuoteError.innerHTML = 'Error submitting fuel quote';
                throw new Error('Error submitting fuel quote');
            }
            return response.json();
        })
        .then(data => {
            console.log(data); 
            fuelQuoteError.innerText = '';
            totalAmountDueInput.value = data.totalAmountDue.toFixed(2);
        })
        .catch(error => {
            fuelQuoteError.innerHTML = 'Error submitting fuel quote';
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