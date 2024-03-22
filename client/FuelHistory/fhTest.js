// Function to generate fake fuel quotes
function generateFakeFuelQuotes(numQuotes) {
  console.log("Generating fake data")
  const fuelQuotes = [];
  for (let i = 1; i <= numQuotes; i++) {
    const gallonsRequested = Math.floor(Math.random() * 100) + 1; // Random gallons requested
    const deliveryAddress = 'address, city, stateAbbr'; // Random delivery address
    const deliveryDate ='2022-01-01';
    const suggestedPrice = '$' + (Math.random() * 5 + 4).toFixed(2) + '/gal'; // Random suggested price between $4.00 and $8.00 per gallon
    const totalPrice = '$' + (gallonsRequested * (Math.random() * 2 + 2)).toFixed(2); // Random total price
    fuelQuotes.push({ quoteID: i, gallonsRequested, deliveryAddress, deliveryDate, suggestedPrice, totalPrice });
  }
  return fuelQuotes;
}

// Function to populate fuel quote data into the table
function populateFuelQuoteTable(quotes) {
  const tableBody = document.querySelector('table tbody');
  quotes.forEach(quote => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${quote.quoteID}</td>
      <td>${quote.gallonsRequested}</td>
      <td>${quote.deliveryAddress}</td>
      <td>${quote.deliveryDate}</td>
      <td>${quote.suggestedPrice}</td>
      <td>${quote.totalPrice}</td>
    `;
    tableBody.appendChild(row);
  });
}


// Function to handle form submission for user login
document.getElementById("GoToNewPage").addEventListener("submit", function (event) {
  // Prevent the default form submission behavior
  console.log("Going to new page.")
  event.preventDefault();
  
  // Navigate to a new page
  window.location.href = "your_new_page.html";
});


// Function to apply date filters
function applyFilters() {
    // Get the start and end date values from the input fields
    const startDate = document.querySelector('input[type="date"][name="start"]').value;
    const endDate = document.querySelector('input[type="date"][name="end"]').value;
    
    // Convert the dates to Date objects
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    
    // Get all rows in the table body
    const rows = document.querySelectorAll('table tbody tr');
    
    // Loop through each row and check if the delivery date falls within the specified range
    rows.forEach(row => {
        // Get the delivery date cell value from the row
        const deliveryDate = row.querySelector('td:nth-child(4)').textContent;
        
        // Convert the delivery date to a Date object
        const deliveryDateObj = new Date(deliveryDate);
    
        // Check if the delivery date is within the specified range
        if (deliveryDateObj >= startDateObj && deliveryDateObj <= endDateObj) {
            // Show the row if it falls within the range
            row.style.display = '';
        } else {
            // Hide the row if it falls outside the range
            row.style.display = 'none';
        }
    });
}

// Function to search the table
//Insert Quote ID
document.getElementById("searchButton").addEventListener("click", function(){
    const searchInput = document.getElementById("searchInput");
    const searchText = searchInput.value; 
    const rows = document.querySelectorAll("#quoteTableBody tr");
    console.log("Input: "+searchText)
    rows.forEach(function(row) {
        const quoteIdCell = row.querySelector("td:nth-child(1)");
        if (quoteIdCell) {
            const quoteIdText = quoteIdCell.textContent.toLowerCase().trim();
            if (quoteIdText.includes(searchText)) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        }
  });
});


// Event listener for generate fake data button
document.getElementById('generateButton').addEventListener('click', function() { 
    // Generate fake fuel quote data and populate the table
    const numQuotes = 10; // Number of fake quotes
    //alert("Button Fake")
    const fakeQuotes = generateFakeFuelQuotes(numQuotes);
    populateFuelQuoteTable(fakeQuotes);
});
