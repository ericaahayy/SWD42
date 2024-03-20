const express = require("express");
const app = express();
const cors = require("cors");
const port = 500;
const dbService = require("./db");
const { v4: uuidv4 } = require('uuid');

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

    const getClientIDQuery = `SELECT clientID FROM login WHERE username = ?`;

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

// login api
app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    const db = dbService.getDbServiceInstance();
    const results = db.authenticateUser(username, password);

    results
        .then((data) => {
            if (data.length === 0)
                throw new Error("Username and password do not match");
            return res.json({ data });
        })
        .catch((err) => {
            return res.status(401).json({ message: err.message });
        });
});

//register api
app.post("/user/register", async (req, res) => {
    const { username, password, first_login } = req.body;
    const db = dbService.getDbServiceInstance();
  
    try {
        const usernameExists = await db.checkUsernameExists(username);
        if (usernameExists) {
            return res.status(400).json({ message: "Email already exists" });
        }
        const registrationResult = await db.userRegister(username, password, first_login);
        if (registrationResult) {
            return res.status(200).json({ message: "User registered successfully" });
        } else {
            return res.status(500).json({ message: "User registration failed" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

//end login

//start loginform

//end loginform

//start profile

//end profile


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});