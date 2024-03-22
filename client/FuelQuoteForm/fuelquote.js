document.addEventListener('DOMContentLoaded', function() {
    const gallonsInput = document.getElementById('galreq');
    const suggestedPriceInput = document.getElementById('suggestedprice');
    const totaldueInput = document.getElementById('totaldue');

    gallonsInput.addEventListener('input', calculatetotaldue);
    suggestedPriceInput.addEventListener('input', calculatetotaldue);

    function calculatetotaldue() {
        const galreq = parseFloat(gallonsInput.value);
        const suggestedprice = parseFloat(suggestedPriceInput.value);

        if (!isNaN(galreq) && !isNaN(suggestedprice)) {
            const totaldue = galreq * suggestedprice;
            totaldueInput.value = totaldue.toFixed(2);
        }
    }

    suggestedPriceInput.value = '2.57'; // hardcoding for now
});

const fuelQuoteForm = document.getElementById('fuel_quote_form');
fuelQuoteForm.addEventListener('submit', function(event) {
    event.preventDefault(); 

    const galreq = document.getElementById('galreq').value;
    const deliveryAddress = document.getElementById('deliveryaddress').value;
    const deliveryDate = document.getElementById('deliverydate').value;
    const suggestedprice = document.getElementById('suggestedprice').value;
    const totaldue = document.getElementById('totaldue').value;

    fetch('/fuelquote/submit_quote', {
        method: 'POST',
        body: JSON.stringify({ 
            galreq, 
            deliveryAddress, 
            deliveryDate, 
            suggestedprice,
            totaldue
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error submitting fuel quote');
        }
        return response.json();
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
