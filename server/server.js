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
app.post("/fuelquote/submit_quote", async (req, res) => {
    const { galreq, deliveryaddress, deliverydate, totaldue, suggestedprice } = req.body;
    const db = dbService.getDbServiceInstance();

    try {
        const clientID = req.body.clientID;
        const response = await db.submitFuelQuote(galreq, deliveryaddress, deliverydate, totaldue, clientID, suggestedprice);

        if (response) {
            return res.status(200).json({ message: "Quote submitted successfully" });
        } else {
            return res.status(500).json({ message: "An error occurred while submitting the quote" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
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

//add profile api
app.post("/api/add_profile", async (req, res) => {
    const { username, fname, lname, address1, address2, city, state, zipcode, clientID } = req.body;
    const db = dbService.getDbServiceInstance();

    try {
        const profileAdded = await db.addProfile(username, fname, lname, address1, address2, city, state, zipcode, clientID);
        if (profileAdded) {
            const firstLoginUpdated = await db.updateFirstLogin(username);
            if (firstLoginUpdated) {
                return res.status(200).json({ message: "Profile added successfully and first login updated" });
            } else {
                return res.status(500).json({ message: "Failed to update first login" });
            }
        } else {
            return res.status(500).json({ message: "Failed to add profile" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

//end loginform

//start profile
app.post("/api/profile", async (req, res) => {
    // Assuming we know the currently logged-in user
    const clientID = req.user.clientID; // Access clientID from the authenticated user object, might change to username

    const db = dbService.getDbServiceInstance();

    try {
        // Fetch profile data from the database based on the clientID
        const profileData = await db.getProfileData(clientID);

        if (profileData) {
            // If profile data is found, send it back to the client
            return res.status(200).json(profileData);
        } else {
            // If no profile data is found, return a 404 status with a message
            return res.status(404).json({ message: "Profile data not found" });
        }
    } catch (error) {
        console.error(error);
        // If an error occurs during fetching, return a 500 status with an error message
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
//end profile



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});