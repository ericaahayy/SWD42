const mysql = require("mysql2");
let instance = null;

/*connecting locally
const connection = mysql.createConnection({
    host: "localhost",
    database: "swd42group",
    user: "root",
    password: "root123"
  });
*/
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
    async submitFuelQuote(gallonsRequested, deliveryAddress, deliveryDate, totalDue, clientID, suggestedPrice) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "INSERT INTO fuelquote (quoteID, galreq, deliveryaddress, deliverydate, totaldue, clientID, suggestedprice) VALUES (?, ?, ?, ?, ?, ?, ?)";
                const quoteID = clientID + '_' + uuidv4(); // generating unique quoteID
                connection.query(query, [quoteID, gallonsRequested, deliveryAddress, deliveryDate, totalDue, clientID, suggestedPrice], (err, result) => {
                    if (err) {
                        console.error("Error inserting fuel quote into database:", err);
                        reject(new Error("Fuel quote submission failed"));
                        return;
                    }
                    resolve(result);
                });
            });
            return response;
        } catch (error) {
            console.error(error);
            return false;
        }
    }
    
    //end fuel quote

    //start login

    //user authentication ERICA CHANGE BACK TO client_id to match khuongs later
    async authenticateUser (username, password) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT username, first_login, clientID FROM login WHERE username = ? AND password = ?;";
                connection.query(query, [username, password], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result);
                });
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    //check if email already exists
    async checkUsernameExists(username) {
        try {
          const response = await new Promise((resolve, reject) => {
            const query = "SELECT COUNT(*) as count FROM login WHERE username = ?;";
            connection.query(query, [username], (err, result) => {
              if (err) reject(new Error(err.message));
              resolve(result[0].count > 0);
            });
          });
          return response;
        } catch (error) {
          console.log(error);
          return false;
        }
    }

    //user registration
    async userRegister(username, password, first_login) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "INSERT INTO login (username, password, first_login) VALUES (?,?,?);";
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
            console.error(error);
            return false;
        }
    }

    //end login

    //start loginform

    //inital profile management
    

    //end loginform

    //start profile

    //end profile
}

module.exports = dbService;