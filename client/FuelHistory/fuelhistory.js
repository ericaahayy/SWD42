const back_end_url = "http://localhost:500";
const clientID = localStorage.getItem("clientID");

document.addEventListener("DOMContentLoaded", async function () {
  try {
    const response = await fetch(`${back_end_url}/api/history?clientID=${clientID}`);
    const data = await response.json();

    if (data.length === 0) {
      console.log("No fuel history found for this clientID");
      return;
    }

    const tableBody = document.getElementById("quoteTableBody");
    tableBody.innerHTML = "";

    data.forEach((entry) => {
      // Format delivery date to remove time part
      const formattedDeliveryDate = new Date(entry.deliverydate).toLocaleDateString('en-US');
      
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${entry.quoteID}</td>
        <td>${entry.galreq}</td>
        <td>${entry.deliveryaddress}</td>
        <td>${formattedDeliveryDate}</td>
        <td>${entry.suggestedprice}</td>
        <td>${entry.totaldue}</td>
      `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error fetching fuel history data:", error);
  }

  const filterButton = document.querySelector(".filter_button");
  filterButton.addEventListener("click", async function (event) {
    event.preventDefault(); // Prevent default form submission behavior

    // Get filter values
    const quoteID = document.getElementById("searchID").value;

    try {
      const response = await fetch(`${back_end_url}/api/history?clientID=${clientID}&quoteID=${quoteID}`);
      const data = await response.json();

      if (data.length === 0) {
        console.log("No fuel history found for this clientID and quoteID");
        return;
      }

      const tableBody = document.getElementById("quoteTableBody");
      tableBody.innerHTML = "";

      data.forEach((entry) => {
        const formattedDeliveryDate = new Date(entry.deliverydate).toLocaleDateString('en-US');

        const row = document.createElement("tr");
        row.innerHTML = `
        <td>${entry.quoteID}</td>
        <td>${entry.galreq}</td>
        <td>${entry.deliveryaddress}</td>
        <td>${formattedDeliveryDate}</td>
        <td>${entry.suggestedprice}</td>
        <td>${entry.totaldue}</td>
      `;
        tableBody.appendChild(row);
      });
    } catch (error) {
      console.error("Error fetching fuel history data:", error);
    }
  });
  
  const dateButton = document.querySelector(".date_button");
  dateButton.addEventListener("click", async function (event) {
  event.preventDefault(); // Prevent default form submission behavior

  // Get filter values
  const startDate = document.getElementById("start_date").value;
  const endDate = document.getElementById("end_date").value;

  try {
    const response = await fetch(`${back_end_url}/api/history?clientID=${clientID}&startDate=${startDate}&endDate=${endDate}`);
    const data = await response.json();

    if (data.length === 0) {
      console.log("No fuel history found for this date range");
      return;
    }

    const tableBody = document.getElementById("quoteTableBody");
    tableBody.innerHTML = "";

    data.forEach((entry) => {
      const formattedDeliveryDate = new Date(entry.deliverydate).toLocaleDateString('en-US');

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${entry.quoteID}</td>
        <td>${entry.galreq}</td>
        <td>${entry.deliveryaddress}</td>
        <td>${formattedDeliveryDate}</td>
        <td>${entry.suggestedprice}</td>
        <td>${entry.totaldue}</td>
      `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error fetching fuel history data:", error);
  }
});
});


