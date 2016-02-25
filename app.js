'use strict'

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./db/chinook.sqlite'); //route to our db file

// db.all('SELECT * FROM Employee;', (err, res) => {
//   console.log(res);
// });//gives array of objects

// db.each('SELECT * FROM Employee;', (err, res) => {
//   console.log(res);
// });//returns eacj row as an object (not an array of objects)


console.log("# of invoices per country");

db.each(
  `SELECT COUNT(*) as count,
  BillingCountry AS country
  FROM Invoice
  GROUP BY BillingCountry
  ORDER BY count DESC`,
    (err, res) => {
      console.log(res);
});

