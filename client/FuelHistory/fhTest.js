alert("Hellow Owrlds");
//<script src="https://cdn.jsdelivr.net/npm/faker"></script>
//var faker=require('faker');

//document.addEventListener('DOMContentLoaded', function() {
    // Function to generate fake data for fuel quote history
    function generateFakeFuelQuotes(numQuotes) {
      const fuelQuotes = [];
      for (let i = 1; i <= numQuotes; i++) {
        const gallonsRequested = Math.floor(Math.random() * 100) + 1; // Random gallons requested
        //const deliveryAddress = faker.address.streetAddress() + ', ' + faker.address.city() + ', ' + faker.address.stateAbbr(); // Random delivery address
        const deliveryAddress = 'address, city, stateAbbr'; // Random delivery address
        
        //const deliveryDate = faker.date.between('2022-01-01', '2024-12-31').toLocaleDateString(); // Random delivery date between 2022 and 2024
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

   
    document.getElementById('generateButton').addEventListener('click', function() { 
      console.log("1231313")
    // Generate fake fuel quote data and populate the table
    const numQuotes = 10; // Number of fake quotes
    const fakeQuotes = generateFakeFuelQuotes(numQuotes);
    populateFuelQuoteTable(fakeQuotes);
  });
  