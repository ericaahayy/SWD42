const mysql = require("mysql");
let instance = null;

// const connection = mysql.createConnection({
//     host: "127.0.0.1",
//     database: "localhost",
//     user: "root",
//     password: "root123",
//   });

connection.connect((err) => {
    if (err) throw err;
    console.log("Connected to database.");
});

// start fuel quote tbh idk if this works bc nothings set up but praying and slaying

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/submit_quote', (req, res) => {
    const { galreq, deliveryaddress, deliverydate, totaldue, suggestedprice } = req.body;

    const username = req.user.username; 

    const getClientIDQuery = `SELECT clientID FROM profile WHERE username = ?`;

    connection.query(getClientIDQuery, [username], (err, results) => {
        if (err) {
            console.error("Error fetching clientID:", err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        if (results.length === 0) {
            res.status(404).json({ error: 'User profile not found' });
            return;
        }
        const clientID = results[0].clientID;

        //gen unique quoteids
        const quoteID = clientID + '_' + uuidv4();

        //insert to db
        const insertQuery = `INSERT INTO fuelquote (quoteID, galreq, deliveryaddress, deliverydate, totaldue, clientID, suggestedprice) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        connection.query(insertQuery, [quoteID, galreq, deliveryaddress, deliverydate, totaldue, clientID, suggestedprice], (err, results) => {
            if (err) {
                console.error("Error inserting data into database:", err);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }
            console.log("Fuel quote submitted successfully");
            res.status(201).json({ message: 'Fuel quote submitted successfully' });
        });
    });
});

// end fuel quote