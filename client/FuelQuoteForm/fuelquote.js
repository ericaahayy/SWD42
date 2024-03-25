document.addEventListener('DOMContentLoaded', function() {
    const back_end_url = "http://localhost:500";
    const clientID = localStorage.getItem("clientID");
    const gallonsInput = document.getElementById('galreq');
    const suggestedPriceInput = document.getElementById('suggestedprice');
    const totaldueInput = document.getElementById('totaldue');
    const deliveryAddressSelect = document.getElementById('deliveryaddress'); // Select element for delivery address

    // fetch(`${back_end_url}/profile/addresses?clientID=${clientID}`, {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     }
    // })
    // .then(response => {
    //     if (!response.ok) {
    //         throw new Error('Error fetching addresses');
    //     }
    //     return response.json();
    // })
    // .then(data => {
    // })
    // .catch(error => {
    //     console.error('Error fetching addresses:', error);
    // });

    //calculate the totaldue attribute (using hardcoded suggestedprice value)
    gallonsInput.addEventListener('input', calculatetotaldue);
    suggestedPriceInput.addEventListener('input', calculatetotaldue);

    function calculatetotaldue() {
        const galreq = parseFloat(gallonsInput.value);
        const suggestedprice = parseFloat(suggestedPriceInput.value);

        //checks if input is valid
        if (!isNaN(galreq) && !isNaN(suggestedprice)) {
            const totaldue = galreq * suggestedprice;
            totaldueInput.value = totaldue.toFixed(2);
        }
        console.log("Total due calculated:", totaldueInput.value); //console message to make sure totaldue is correctly calculated
    }

    suggestedPriceInput.value = '2.57'; // hardcoding for now

    const fuelQuoteForm = document.getElementById('submit_quote');
    fuelQuoteForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const galreq = document.getElementById('galreq').value;
        const deliveryaddress = deliveryAddressSelect.value; // Get selected delivery address
        const deliverydate = formatDate(document.getElementById('deliverydate').value);
        const suggestedprice = document.getElementById('suggestedprice').value;
        const totaldue = document.getElementById('totaldue').value;
        //console message to make sure correct data was sent to db
        console.log("Form data:", galreq, deliveryaddress, deliverydate, suggestedprice, totaldue);

        const response = fetch(back_end_url + "/fuelquote/submit_quote", {
            method: 'POST',
            body: JSON.stringify({ 
                galreq,
                deliveryaddress, 
                deliverydate, 
                suggestedprice,
                totaldue, 
                clientID
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
        .then(data => {
            console.log("Server response:", data);
            alert("Fuel quote submitted");
            gallonsInput.value = '';
            deliveryAddressSelect.value = ''; // Reset selected delivery address
            deliverydate.value = '';
            totaldueInput.value = '';
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });

    function formatDate(dateString) { // formats the date correctly to match the database format for the deliverydate attribute of the fuelquote table.
        const date = new Date(dateString);
        const utcDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
        const year = utcDate.getFullYear();
        let month = utcDate.getMonth() + 1;
        let day = utcDate.getDate();
        if (month < 10) {
            month = '0' + month;
        }
        if (day < 10) {
            day = '0' + day;
        }

        return `${year}-${month}-${day}`;
    }
});
