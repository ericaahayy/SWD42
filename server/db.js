const mysql = require("mysql2");
let instance = null;

//connecting locally
/*const connection = mysql.createConnection({
    host: "localhost",
    database: "swd42group",
    user: "root",
    password: "root123"
});*/

//this will actually make edits to the database.
 const connection = mysql.createConnection({
    host: "34.171.92.157",
    database: "swd42group",
    user: "root",
    password: "root123"
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

    //start fuel history
    //end fuel history

    //start fuel quote
    async submitFuelQuote(galreq, deliveryaddress, deliverydate, suggestedprice, totaldue, clientID){
        try{
                if (!galreq || !deliverydate || !deliveryaddress || !suggestedprice || !totaldue) {
                    throw new Error("All fields are required.");
        }
        const query = "INSERT INTO fuelquote (galreq, deliveryaddress, deliverydate, suggestedprice, totaldue, clientID) VALUES (?,?,?, ?, ?, ?);";
            const connection = this.getConnection();
    
            const response = await new Promise((resolve, reject) => {
                connection.query(query, [galreq, deliveryaddress, deliverydate, suggestedprice, totaldue, clientID], (err, result) => {
                    if (err) {
                        console.error("Error inserting data into database:", err);
                        reject(new Error("form submission failed"));
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
    //end fuel quote

    //start login

    //user authentication ERICA CHANGE BACK TO client_id to match khuongs later
    async authenticateUser(username, password) {
        try {
            // Validate required fields
            if (!username || !password) {
                throw new Error("Username and password are required.");
            }

            const query = "SELECT username, first_login, clientID FROM login WHERE username = ? AND password = ?;";
            const connection = this.getConnection();
    
            const response = await new Promise((resolve, reject) => {
                connection.query(query, [username, password], (err, result) => {
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
            throw error; // Re-throw the error to propagate it to the caller
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
    
            const query = "INSERT INTO login (username, password, first_login) VALUES (?,?,?);";
            const connection = this.getConnection();
    
            const response = await new Promise((resolve, reject) => {
                connection.query(query, [username, password, first_login], (err, result) => {
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
    async getProfileData(clientID){
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM profile WHERE clientID = ?";
                connection.query(query, [clientID], (err, result) => {
                    if (err) {
                        console.error("Error fetching profile data from database:", err);
                        reject(err);
                        return;
                    }
                    resolve(result[0]); //One row since clientID is primary key, shold be unique
                });
            });
            return response;
        } catch (error) {
            console.error("Error fetching profile data:", error);
            return null;
        }
    }

    //end profile

    //start fuel history
    //Place holder code FINALIZE FILTER IN FUEL HISTORY JS
    async searchFuelQuotesByDate(startDate, endDate) {
        try {
            const query = "SELECT * FROM fuelquote WHERE deliverydate BETWEEN ? AND ?";
            const [rows, fields] = await this.connection.promise().query(query, [startDate, endDate]);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    // Add your SQL query here to fetch historical data from the database
    //Temporary code
    async getDataHistory() {
        try {
            const query = "SELECT * FROM fuelquote_history";
            const [rows, fields] = await this.connection.promise().query(query);
            return rows;
        } catch (error) {
            throw error;
        }
    }
    //end fuel history

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