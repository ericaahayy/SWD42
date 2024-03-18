const express = require("express");
const app = express();
const cors = require("cors");
const port = 500;

app.use(cors());
app.use(express());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


//start fuel history

//end fuel history

//start fuel quote
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
//end fuel quote

//start login

//end login

//start loginform

//end loginform

//start profile

//end profile


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});