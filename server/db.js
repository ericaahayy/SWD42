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

// class containing all functions
class dbService {
    static getDbServiceInstance() {
        return instance ? instance : new dbService();
    }

    //start fuel history

    //end fuel history

    //start fuel quote

    //end fuel quote

    //start login

    //end login

    //start loginform

    //end loginform

    //start profile

    //end profile
}