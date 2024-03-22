const express = require("express");
const app = express();
const cors = require("cors");
const port = 500;
const dbService = require("./db");

app.use(cors());
app.use(express());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


//start fuel history

//end fuel history

//start fuel quote
app.post("/fuelquote/submit", async (req, res) => {
    const db = dbService.getDbServiceInstance();
    const clientID = req.session.clientID;
    const {galreq, deliveryaddress, deliverydate, suggestedprice, totaldue } = req.body;

    //validatio n
    if (!galreq || !deliverydate || !deliveryaddress || !suggestedprice || !totaldue) {
        return res.status(400).json({ message: "Please fill in required information." });
    }
    try {
        const results = await db.submitFuelQuote(galreq, deliveryaddress, deliverydate, suggestedprice, totaldue, clientID);
        res.json({ success: results });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
//end fuel quote

//start login

// login api
app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;
    
    // Validate required fields
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    const db = dbService.getDbServiceInstance();
    const results = db.authenticateUser(username, password);

    results
        .then((data) => {
            if (data.length === 0)
                throw new Error("Username and password do not match");
            return res.status(200).json({ message: "Login successful", data: data });
        })
        .catch((err) => {
            return res.status(401).json({ message: err.message });
        });
});

//register api
app.post("/user/register", async (req, res) => {
    const { username, password, first_login } = req.body;
    
    // Validate required fields
    if (!username || !password || first_login === undefined) {
        return res.status(400).json({ message: "Username, password, and first_login are required." });
    }

    const db = dbService.getDbServiceInstance();
  
    try {
        const usernameExists = await db.checkUsernameExists(username);
        if (usernameExists) {
            return res.status(400).json({ message: "Email already exists" });
        }
        const registrationResult = await db.userRegister(username, password, first_login);
        if (registrationResult) {
            return res.status(200).json({ message: "User registered successfully" });
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
    
    // Validate required fields
    if (!username || !fname || !lname || !address1 || !city || !state || !zipcode || !clientID) {
        return res.status(400).json({ message: "All fields are required." });
    }

    const db = dbService.getDbServiceInstance();

    try {
        const profileAdded = await db.addProfile(username, fname, lname, address1, address2, city, state, zipcode, clientID);
        if (profileAdded) {
            const firstLoginUpdated = await db.updateFirstLogin(username);
            if (firstLoginUpdated) {
                return res.status(200).json({ message: "Profile added successfully and first login updated" });
            }
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

//History Getter

// API endpoint to retrieve fuel history based on clientID
app.get("/api/history/:clientID", async (req, res) => {
    const { clientID } = req.params;
    const db = dbService.getDbServiceInstance();
  
    try {
      // Fetch fuel history data from the database based on clientID
      const fuelHistory = await db.getFuelHistory(clientID);
      res.json(fuelHistory);
    } catch (error) {
      console.error("Error fetching fuel history:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
//End History Getter


const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

const closeServer = () => {
    server.close(() => {
        console.log('Server closed');
    });
};

module.exports = { app, closeServer };