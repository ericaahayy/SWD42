//import back_end_url from "../URL/link.js";


// fuelhistory.js

document.addEventListener("DOMContentLoaded", async () => {
// Retrieve clientID from localStorage
const clientID = localStorage.getItem("clientID");
if (!clientID) {
  throw new Error("Client ID not found in localStorage");
}

//console.log(clientID)
try {
// Send a request to the server to fetch fuel history data 
const response = await fetch(`${back_end_url}/api/history?clientID=${clientID}`);
if (!response.ok) {
  throw new Error("Failed to fetch fuel history");
}


const fuelHistory = await response.json();

console.log("Populating data")

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
console.error("Error fetching Fuel History:", error);
}
});



// function fetchHistoryData() {
//   //fetch user data (server.js)
//   const clientID = localStorage.getItem("clientID");
//   fetch(back_end_url +'/api/fuelhistory')
//   .then(response => {
//       if (!response.ok) {
//           throw new Error('Network response was not ok');
//       }
//       return response.json();
//   })
//   .then(data => {
//       // Update the content of the <p> elements with fetched data
//       updateTable(data);
//   })
//   .catch(error => {
//       console.error('There was a problem with the fetch operation:', error);
//       // If there's an error fetching data, replace content with "Error"
//       displayError();
//   });
//}

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

   
  document.getElementById('generateButton').addEventListener('click', function() { 
    // Generate fake fuel quote data and populate the table
    const numQuotes = 10; // Number of fake quotes
    const fakeQuotes = generateFakeFuelQuotes(numQuotes);
    populateFuelQuoteTable(fakeQuotes);
  });
  


// function updateTable(data) {
//   // Update the content of the <p> elements with fetched data
//   document.getElementById('clientID').textContent = data.clientID || "Not Available";
//   document.getElementById('fname').textContent = data.firstName || "Not Available";
//   document.getElementById('lname').textContent = data.lastName || "Not Available";
//   document.getElementById('email').textContent = data.email || "Not Available";
//   document.getElementById('add1').textContent = data.address1 || "Not Available";
//   document.getElementById('add2').textContent = data.address2 || "Not Available";
//   document.getElementById('city').textContent = data.city || "Not Available";
//   document.getElementById('state').textContent = data.state || "Not Available";
//   document.getElementById('zip').textContent = data.zipCode || "Not Available";
// }


// // Function to handle form submission for user login
// document.getElementById("GoToNewPage").addEventListener("submit", function (event) {
//   // Prevent the default form submission behavior
//   console.log("Going to new page.")
//   event.preventDefault();
  
//   // Navigate to a new page
//   window.location.href = "your_new_page.html";
// });



//SEARCH OPTIONS
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

