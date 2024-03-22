function generateFakeFuelQuotes(numQuotes) {
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
    // fuelhistory.js

document.addEventListener("DOMContentLoaded", async () => {
  // Retrieve clientID from localStorage
  const clientID = localStorage.getItem("clientID");

  try {
    // Send a request to the server to fetch fuel history data
    const response = await fetch(`/api/profile/${clientID}`);
    if (!response.ok) {
      throw new Error("Failed to fetch fuel history");
    }
    const fuelHistory = await response.json();

    // Populate the table with fuel history data
    const quoteTableBody = document.getElementById("quoteTableBody");
    quoteTableBody.innerHTML = ""; // Clear existing table body content
    fuelHistory.forEach((quote) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${quote.quoteID}</td>
        <td>${quote.galreq}</td>
        <td>${quote.deliveryaddress}</td>
        <td>${quote.deliverydate}</td>
        <td>${quote.suggestedprice}</td>
        <td>${quote.totaldue}</td>
      `;
      quoteTableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error fetching fuel history:", error);
  }
});



// Optional: Implement applyFilters() function for filtering fuel history based on user input
function applyFilters() {
  // Implement filtering logic here if needed
}
   
  document.getElementById('generateButton').addEventListener('click', function() { 
    // Generate fake fuel quote data and populate the table
    const numQuotes = 10; // Number of fake quotes
    const fakeQuotes = generateFakeFuelQuotes(numQuotes);
    //populateFuelQuoteTable(fakeQuotes);
  });
  
