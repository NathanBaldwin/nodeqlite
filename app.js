'use strict'

const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./db/chinook.sqlite'); //route to our db file

// db.all('SELECT * FROM Employee;', (err, res) => {
//   console.log(res);
// });//gives array of objects

// db.each('SELECT * FROM Employee;', (err, res) => {
//   console.log(res);
// });//returns eacj row as an object (not an array of objects)


console.log("# of invoices per country");

// db.each(
//   `SELECT COUNT(*) as count,
//   BillingCountry AS country
//   FROM Invoice
//   GROUP BY BillingCountry
//   ORDER BY count DESC`,
//     (err, res) => {
//       console.log(res);
// });
app.get('/sales-per-year', (req, res) => {
  //How many Invoices were there in 2009 and 2011?
  //What are the respective total sales for each of those years?
  
  // console.log(req.query);

  //must convert to number so that do one can run get"drop table"!
  
  let having = '';

  if (req.query.filter) {
    let having = 'HAVING';

    req.query.filter.year
      .split(',')
      .map(y => +y)
      .forEach(y => {
        having += ` year = "${y}" OR`;
      });
  
    having = having.substring(0, having.length - 3);
  }

  db.all(`
    SELECT count(*) as invoices,
           sum(Total) as total,
           strftime('%Y', InvoiceDate) as year
    FROM   Invoice
    GROUP BY year
    ${having}`,
      (err, data) => {
        if (err) throw err;

        const roundedData = data.map(function (obj) {
          return {
            invoices: obj.invoices,
            year: +obj.year,
            total: +obj.total.toFixed(2)
          }
        })

        res.send({
          data: roundedData,
          info: '# of invoices and sales per year'
        });
      }
    );
});

app.get('/invoices-by-country', (req, res) => {
  db.all(
  `SELECT COUNT(*) as count,
  BillingCountry AS country
  FROM Invoice
  GROUP BY BillingCountry
  ORDER BY count DESC`,
    (err, data) => {
      if (err) throw err;
      res.send({
        data: data,
        info: '# of invoices per country'
      });   
    });
  })

app.listen(PORT, () => {
  console.log(`Express server listening on port: ${PORT}`);
})

