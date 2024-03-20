$(document).ready(function() {
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
    
            const formData = $(this).serialize();

            $.post('/submit-fuel-quote', formData, function(response) {
                console.log(response); 
            });
        });
    });

    const suggestedPriceInput = document.getElementById('suggested_price');
    const totalAmountDueInput = document.getElementById('total_amount_due');

    gallonsInput.addEventListener('input', function() {
        const gallonsRequested = parseFloat(gallonsInput.value);
        const suggestedPricePerGallon = parseFloat(suggestedPriceInput.value);

        const totalAmountDue = gallonsRequested * suggestedPricePerGallon;
        totalAmountDueInput.value = totalAmountDue.toFixed(2); 
    });

    suggestedPriceInput.value = '2.57'; //hard coding for now
});
