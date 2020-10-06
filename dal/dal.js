const mysql = require("mysql");
// const HOST = "localhost" || process.env.DB_HOST;
// const USERNAME = "root" || process.env.DB_USERNAME;
// const PASSWORD = "" || process.env.DB_PASSWORD;
// const DATABASE = "VacationsDB" || process.env.DATABASE_NAME;


// Create a communication line to MySQL Database: 
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "VacationsDB"
}) || process.env.DATABASE_URL;

// Connecting to the database: 
connection.connect(err => {
    if (err) {
        console.log(err);
        return;
    }
    console.log("We're connected to MySQL");
});

// Execute a command (select / insert / update / delete):
function execute(sql) {

    // Returning a promise: 
    return new Promise((resolve, reject) => {

        // Execute one query: 
        connection.query(sql, (err, result) => {

            // If there is an error - call reject: 
            if (err) {
                reject(err);
                return;
            }

            // If query succeeds - send back its result: 
            resolve(result);
        });
    });
}

module.exports = { execute };
