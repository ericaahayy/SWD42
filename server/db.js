const mysql = require("mysql2");
const bcrypt = require('bcrypt');
const saltRounds = 10;
let instance = null;

//connecting locally
// const connection = mysql.createConnection({
//     host: "localhost",
//     database: "swd42",
//     user: "root",
//     password: "root123"
// });

//this will actually make edits to the database.
 const connection = mysql.createConnection({
    host: "34.71.123.255",
    database: "swd42",
    user: "swd42",
    password: "Swd2024.KbEhKnTn.2049545.1539"
  });


connection.connect((err) => {
    if (err) throw err;
    console.log("Connected to database.");
});

// class containing all functions
class dbService {
    static getDbServiceInstance() {
        return instance ? instance : new dbService();
    }

    //start fuel quote
    async submitFuelQuote(galreq, deliveryaddress, deliverydate, suggestedprice, totaldue, clientID){
        try {
            if (!galreq || !deliverydate || !deliveryaddress || !suggestedprice || !totaldue || !clientID) {
                throw new Error("All fields are required.");
            }
            const query = "INSERT INTO fuelquote (clientID, galreq, deliveryaddress, deliverydate, totaldue, suggestedprice) VALUES (?,?,?,?,?,?)";
            const connection = this.getConnection();
    
            const response = await new Promise((resolve, reject) => {
                connection.query(query, [clientID, galreq, deliveryaddress, deliverydate,totaldue, suggestedprice], (err, result) => {
                    if (err) {
                        console.error("Error inserting data into database:", err);
                        reject(new Error("Form submission failed"));
                        return;
                    }
                    resolve(result.insertId);
                });
            });
            return response === 0 ? false : true;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }
    
    //end fuel quote

    //start login

    //user authentication
    async authenticateUser(username, password) {
        try {
            // Validate required fields
            if (!username || !password) {
                throw new Error("Username and password are required.");
            }
    
            const query = "SELECT username, first_login, clientID, password FROM login WHERE username = ?;";
            const connection = this.getConnection();
    
            const userData = await new Promise((resolve, reject) => {
                connection.query(query, [username], (err, result) => {
                    if (err) {
                        console.error("Error executing database query:", err);
                        reject(new Error(err.message));
                        return;
                    }
                    resolve(result[0]);
                });
            });
    
            // If no user found, return null
            if (!userData) {
                throw new Error("Username and password do not match");
            }
    
            // Compare hashed passwords
            const hashedPassword = userData.password;
            const match = await bcrypt.compare(password, hashedPassword);
    
            if (match) {
                // console.log(userData);
                return [userData]; // Return user data if passwords match
            } else {
                throw new Error("Username and password do not match");
            }
        } catch (error) {
            throw error;
        }
    }

    //check if email already exists
    async checkUsernameExists(username) {
        try {
            // Validate required field
            if (!username) {
                throw new Error("Username is required.");
            }
    
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT COUNT(*) as count FROM login WHERE username = ?;";
                connection.query(query, [username], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result[0].count > 0);
                });
            });
            return response;
        } catch (error) {
            throw error;
        }
    }

    //user registration
    async userRegister(username, password, first_login) {
        try {
            // Validate required fields
            if (!username || !password || first_login === undefined) {
                throw new Error("Username, password, and first_login are required.");
            }
    
            // Hash the password
            const hashedPassword = await bcrypt.hash(password, saltRounds);
    
            // Insert hashed password into the database
            const query = "INSERT INTO login (username, password, first_login) VALUES (?,?,?);";
            const connection = this.getConnection();
    
            const response = await new Promise((resolve, reject) => {
                connection.query(query, [username, hashedPassword, first_login], (err, result) => {
                    if (err) {
                        console.error("Error inserting data into database:", err);
                        reject(new Error("User registration failed"));
                        return;
                    }
                    resolve(result.insertId);
                });
            });
            return response === 0 ? false : true;
        } catch (error) {
            throw error;
        }
    }

    //end login

    //start loginform

    //inital profile management
    async addProfile(username, fname, lname, address1, address2, city, state, zipcode, clientID) {
        try {
            // Validate required fields
            if (!username || !fname || !lname || !address1 || !city || !state || !zipcode || !clientID) {
                throw new Error("All fields are required.");
            }

            const query = "INSERT INTO profile (username, fname, lname, address1, address2, city, state, zipcode, clientID) VALUES (?,?,?,?,?,?,?,?,?)";
            const connection = this.getConnection();
    
            const response = await new Promise((resolve, reject) => {
                const query = "INSERT INTO profile (username, fname, lname, address1, address2, city, state, zipcode, clientID) VALUES (?,?,?,?,?,?,?,?,?)";
                connection.query(query, [username, fname, lname, address1, address2, city, state, zipcode, clientID], (err, result) => {
                    if (err) {
                        console.error("Error executing SQL query:", err);
                        reject(err);
                        return;    
                    }
                    resolve(result && result.affectedRows > 0);
                });
            });
            return response;
        } catch (error) {
            throw error;
        }
    }
    
    //update first_login attribute
    async updateFirstLogin(username) {
        try {
            // Validate required field
            if (!username) {
                throw new Error("Username is required.");
            }

            const query = "UPDATE login SET first_login = 0 WHERE username = ?";
            const connection = this.getConnection();
    
            const response = await new Promise((resolve, reject) => {
                connection.query(query, [username], (err, result) => {
                    if (err) {
                        console.error("Error updating first_login attribute:")
                        resolve(false);
                        return;
                    }
                    resolve(result.affectedRows > 0);
                });
            });
            return response; 
        } catch (error) {
            throw error;
        }
    }

    //end loginform

    //start profile
    async getProfileData(clientID) {
        try {

            const query = "SELECT * FROM profile WHERE clientID = ?";
            const connection = this.getConnection();

            const response = await new Promise((resolve, reject) => {
                connection.query(query, [clientID], (err, result) => {
                    if (err) {
                        console.error("Error fetching profile data from database:", err);
                        reject(err);
                        return;
                    }
                    resolve(result.length > 0 ? result[0] : null); // Resolve with the profile data
            
            });
        });
            console.log(response)
            console.log("response gotten from db")
            return response;
        } catch (error) {
            throw error;
        }
    }

    // Add the updateProfile method to the dbService class
    async updateProfile(clientID, address1, address2, city, state, zip) {
        try {
            // Validate required fields
            if (!clientID) {
                throw new Error("clientID is required.");
            }
    
            // Prepare the update query
            const query = "UPDATE profile SET address1 = ?, address2 = ?, city = ?, state = ?, zipcode = ? WHERE clientID = ?";
                
            // Execute the update query
            const connection = this.getConnection();
            const response = await new Promise((resolve, reject) => {
                connection.query(query, [address1, address2, city, state, zip, clientID], (err, result) => {
                    if (err) {
                        console.error("Error updating profile data:", err);
                        resolve(false);
                        return;
                    }
                    resolve(result.affectedRows > 0);
                });
            });
            
            return response;
        } catch (error) {
            throw error;
        }
    }

    //end profile

    //start fuel history

    async getFuelHistory(clientID) {
    try {
        // Validate required field
        if (!clientID) {
            throw new Error("clientID is required.");
        }

        const query = "SELECT * FROM fuelquote WHERE clientID = ?;";
        const connection = this.getConnection();

        const response = await new Promise((resolve, reject) => {
            connection.query(query, [clientID], (err, result) => {
                if (err) {
                    console.error("Error executing database query:", err);
                    reject(new Error(err.message));
                    return;
                }
                resolve(result);
            });
        });
        return response;
        } catch (error) {
            throw error;
        }
    }

    async quoteFilter(clientID, quoteID) {
    try {
        // Validate required fields
        if (!clientID || !quoteID) {
            throw new Error("clientID and quoteID are required.");
        }

        const query = "SELECT * FROM fuelquote WHERE clientID = ? AND quoteID = ?;";
        const connection = this.getConnection();

        const response = await new Promise((resolve, reject) => {
            connection.query(query, [clientID, quoteID], (err, result) => {
                if (err) {
                    console.error("Error executing database query:", err);
                    reject(new Error(err.message));
                    return;
                }
                resolve(result.length > 0 ? result : null);
            });
        });
        return response;
        } catch (error) {
            throw error;
        }
    }

    async filterByDate(clientID, startDate, endDate) {
        try {
            // Validate required fields
            if (!clientID || !startDate || !endDate) {
                throw new Error("clientID, start date, and end date are required.");
            }
    
            const query = "SELECT * FROM fuelquote WHERE clientID = ? AND deliverydate BETWEEN ? AND ?;";
            const connection = this.getConnection();
    
            const response = await new Promise((resolve, reject) => {
                connection.query(query, [clientID, startDate, endDate], (err, result) => {
                    if (err) {
                        console.error("Error executing database query:", err);
                        reject(new Error(err.message));
                        return;
                    }
                    resolve(result.length > 0 ? result : null);
                });
            });
            return response;
        } catch (error) {
            throw error;
        }
    }    

    //end fuel history

    //help functions for unit testing
    async deleteEntry(username, tableName) {
        try {
            if (!username) {
                throw new Error("Username is required");
            }
    
            let query;
            if (tableName === "profile") {
                query = "DELETE FROM profile WHERE username = ?";
            } else if (tableName === "login"){
                query = "DELETE FROM login WHERE username = ?";
            } else if (tableName === "fuelquote") {
                query = "DELETE FROM fuelquote WHERE clientID = ?"
            }
    
            const connection = this.getConnection();
    
            await new Promise((resolve, reject) => {
                connection.query(query, [username], (err, result) => {
                    if (err) {
                        console.error(`Error deleting ${tableName} entry:`, err);
                        reject(err);
                        return;
                    }
                    resolve(result);
                });
            });
            return true;
        } catch (error) {
            throw error;
        }
    }

    getConnection() {
        return connection;
    }
    
    async closeConnection() {
        try {
            await connection.end();
            console.log("Database connection closed");
        } catch (error) {
            console.error("Error closing database conncection:", error);
        }
    }
}

module.exports = dbService;