const mysql = require("mysql");
let instance = null;

// Change this connection to connect to your own local server
// We will change this to a cloud server later.
const connection = mysql.createConnection({
    host: "localhost",
    database: "swd42group",
    user: "root",
    password: "Localhost123!",
});

connection.connect((err) => {
    if (err) throw err;
    console.log("Connected to database.");
});