const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const models = require('./models');

const app = express();
const PORT = 7000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, './dist')));

// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
// });

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

//var pgp = require('pg-promise')(/* options */);
//var db = pgp('postgres://username:password@host:port/database')
//var db = pgp('postgres://postgres:docker@localhost:5432/sdc1');

//routes

app.get('/', function(req, res) {
  res.send('hello world');
});

//List Products
//GET /products/list  Retrieves the list of products
//parameters: page, count
app.get('/products/list', function(req, res) {
  models.listProductsQuery().then((data) => {
    res.status(200).send(data);
  });
});

//Products Information
//GET /products/:product_id
//parameters: product_id
app.get('/products/:product_id', function(req, res) {
  //now query the database for this info
  models.productInformationQuery(req.params.product_id).then((data) => {
    res.status(200).send(data);
  });
});

//product styles
//GET /products/:product_id/styles
//parameters: product_id
