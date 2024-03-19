
// Sample data (you would replace this with actual data retrieved from the database)
  function sayHello(name){
    console.log('name'+name);
  }
 // Function to generate fake data
 function generateFakeData(numRows) {
  const data = [];
  for (let i = 1; i <= numRows; i++) {
    const name = faker.name.findName();
    const email = faker.internet.email();
    data.push({ id: i, name, email });
  }
  return data;
}

// Function to populate data into the table
function populateTable(data) {
  const tableBody = document.getElementById('data-body');
  data.forEach(row => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${row.id}</td>
      <td>${row.name}</td>
      <td>${row.email}</td>
    `;
    tableBody.appendChild(tr);
  });
}

// Generate fake data and populate the table
const numRows = 10; // Number of rows of fake data
const fakeData = generateFakeData(numRows);
populateTable(fakeData);

