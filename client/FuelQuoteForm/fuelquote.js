document.addEventListener('DOMContentLoaded', function() {
    const back_end_url = "http://localhost:500";
    const clientID = localStorage.getItem("clientID");
    const gallonsInput = document.getElementById('galreq');
    const suggestedPriceInput = document.getElementById('suggestedprice');
    const totaldueInput = document.getElementById('totaldue');
    const deliveryAddressSelect = document.getElementById('deliveryaddress');
    let state; // needed for the pricing module

    async function fetchDeliveryAddresses() {
        try {
            const response = await fetch(`${back_end_url}/api/profile?clientID=${clientID}`);
            const profileData = await response.json();
            state = profileData.state; //saving for the pricing module
            deliveryAddressSelect.innerHTML = "";
            if (profileData.address1) {
                const option1 = document.createElement('option');
                option1.value = profileData.address1;
                option1.textContent = `${profileData.address1}, ${profileData.city}, ${profileData.state} ${profileData.zipcode}`;
                deliveryAddressSelect.appendChild(option1);
            }
            if (profileData.address2) {
                const option2 = document.createElement('option');
                option2.value = profileData.address2;
                option2.textContent = `${profileData.address2}, ${profileData.city}, ${profileData.state} ${profileData.zipcode}`;
                deliveryAddressSelect.appendChild(option2);
            }
        } catch (error) {
            console.error('Error fetching delivery addresses:', error);
        }
    }

    fetchDeliveryAddresses();

    async function calculateAndUpdateSuggestedPrice() {
        const gallonsRequested = parseFloat(gallonsInput.value);
        const locationFactor = state === 'TX' ? 0.02 : 0.04;
        const rateHistoryFactor = await checkHistory() ? 0.01 : 0; // check rate history
        const gallonsRequestedFactor = gallonsRequested > 1000 ? 0.02 : 0.03;
        const companyProfitFactor = 0.10;

        const suggestedPricePerGallon = calculateSuggestedPrice(gallonsRequested, locationFactor, rateHistoryFactor, gallonsRequestedFactor, companyProfitFactor);

        suggestedPriceInput.value = suggestedPricePerGallon.toFixed(3);
        calculatetotaldue();
    }

    // function to check rate history
    async function checkHistory() { //used for pricing module
        try {
            const response = await fetch(`${back_end_url}/api/history?clientID=${clientID}`);
            const data = await response.json();
            return data.length > 0; // return true if history exists
        } catch (error) {
            console.error('Error checking history:', error);
            return false;
        }
    }


    gallonsInput.addEventListener('input', calculateAndUpdateSuggestedPrice);
    deliveryAddressSelect.addEventListener('change', calculateAndUpdateSuggestedPrice);

    function calculateSuggestedPrice(gallonsRequested, locationFactor, rateHistoryFactor, gallonsRequestedFactor, companyProfitFactor) {
        const currentPrice = 1.50; // price given in assignment 5
        const margin = currentPrice * (locationFactor - rateHistoryFactor + gallonsRequestedFactor + companyProfitFactor); 
        return currentPrice + margin;
    }

    //event listener for the form submission
    const fuelQuoteForm = document.getElementById('submit_quote');
    fuelQuoteForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const galreq = gallonsInput.value;
        const deliveryaddress = deliveryAddressSelect.value;
        const deliverydate = formatDate(document.getElementById('deliverydate').value);
        const suggestedprice = suggestedPriceInput.value;
        const totaldue = totaldueInput.value;

        const data = {
            galreq,
            deliveryaddress, 
            deliverydate, 
            suggestedprice,
            totaldue, 
            clientID
        };

        submitFuelQuote(data);
    });

    // function to submit fuel quote
    async function submitFuelQuote(data) {
        try {
            const response = await fetch(`${back_end_url}/fuelquote/submit_quote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                throw new Error('Error submitting fuel quote');
            }
            const responseData = await response.json();
            console.log("Server response:", responseData);
            alert("Fuel quote submitted");
            gallonsInput.value = '';
            deliveryAddressSelect.value = '';
            document.getElementById('deliverydate').value = '';
            suggestedPriceInput.value = '';
            totaldueInput.value = '';
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // formats the date properly
    function formatDate(dateString) {
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

    // function to calculate total due
    function calculatetotaldue() {
        const galreq = parseFloat(gallonsInput.value);
        const suggestedprice = parseFloat(suggestedPriceInput.value);

        if (!isNaN(galreq) && !isNaN(suggestedprice)) {
            const totaldue = galreq * suggestedprice;
            totaldueInput.value = totaldue.toFixed(2);
        }
    }
});
