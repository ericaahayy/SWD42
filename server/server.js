const express = require("express");
const app = express();
const cors = require("cors");
const port = 5001;
const dbService = require("./db");

app.use(cors());
app.use(express());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


//start fuel history

//end fuel history

//start fuel quote
// app.get("/profile/addresses", async (req, res) => {
//     const { clientID } = req.query;

//     try {
//         const addresses = await getAddresses(clientID);

//         if (addresses) {
//             // format the address line
//             let deliveryAddress1 = `${addresses.address1}, ${addresses.city}, ${addresses.state} ${addresses.zipcode}`;

//             let response;
//             if (addresses.address2) {
//                 let deliveryAddress2 = `${addresses.address2}, ${addresses.city}, ${addresses.state} ${addresses.zipcode}`;

//                 response = {
//                     address1: deliveryAddress1,
//                     address2: deliveryAddress2
//                 };
//             } else {
//                 // if address2 does not exist, only include address1 in the response
//                 response = {
//                     address1: deliveryAddress1
//                 };
//             }

//             res.status(200).json(response);
//         } else {
//             res.status(404).json({ error: "Address not found" });
//         }
//     } catch (error) {
//         console.error("Error fetching address:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// });


app.post("/fuelquote/submit_quote", async (req, res) => {
    const db = dbService.getDbServiceInstance();
    const { galreq, deliveryaddress, deliverydate, suggestedprice, totaldue, clientID } = req.body;

    // validate
    if (!galreq || !deliverydate || !deliveryaddress || !suggestedprice || !totaldue) {
        return res.status(400).json({ message: "Please fill in required information." });
    }
    try {
        const results = await db.submitFuelQuote(galreq, deliveryaddress, deliverydate, suggestedprice, totaldue, clientID);
        res.json({ success: results });
    } catch (error) {
        console.error('Error submitting fuel quote:', error);
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
app.get("/api/profile", async (req, res) => {
    try {
        const clientID = req.query.clientID; // Retrieve clientID from query parameters
        //console.log("Received clientID:", clientID); 

        if (!clientID) {
            return res.status(401).json({ message: "Unauthorized, clientID not provided" });
        }

        // Fetch the profile data
        const db = dbService.getDbServiceInstance();
        const profileData = await db.getProfileData(clientID);

        if (profileData) {
            return res.status(200).json(profileData);
        } else {
            return res.status(404).json({ message: "Profile data not found" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
//For editing
app.put("/api/update_profile", async (req, res) => {
    try {
        console.log('Received data:', req.body);
        const { clientID, address1, address2, city, state, zip } = req.body;
                // Update the user's profile data in the database
                const db = dbService.getDbServiceInstance();
                const updateResult = await db.updateProfile(clientID, address1, address2, city, state, zip);
        
                if (updateResult) {
                    // Profile update successful
                    return res.status(200).json({ message: "Profile updated successfully" });
                } else {
                    // Failed to update profile
                    return res.status(500).json({ message: "Failed to update profile" });
                }
            } catch (error) {
                console.error(error);
                return res.status(500).json({ message: "Internal Server Error" });
            }
});
//end profile

//History Getter

// API endpoint to retrieve fuel history based on clientID
app.get("/api/history", async (req, res) => {
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