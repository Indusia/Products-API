var pgp = require('pg-promise')(/* options */);
var db = pgp('postgres://postgres:docker@localhost:5432/sdc1');

const productInformationQuery = function(item) {
  return db.any('SELECT * FROM products WHERE product_id = $1;', [item]);
};

const listProductsQuery = function(item) {
  return db.any(
    'SELECT * FROM products WHERE product_id >1 and product_id <100;',
    []
  );
};

const relatedQuery = function(item) {
  return db.any('SELECT * FROM products WHERE product_id = $1;', [item]);
};

module.exports = { productInformationQuery, listProductsQuery };

//Related Products
//GET /products/:product_id/related
//parameters: product_id

//database queries
// const productInformationQuery = function(item) {
//   return db.any('SELECT * FROM products WHERE product_id = $1;', [item]);
// };

// const listProductsQuery = function(item) {
//   return db.any(
//     'SELECT * FROM products WHERE product_id >1 and product_id <100;',
//     []
//   );
// };

//product information

// {
// 	"id": 11,
// 	"name": "Air Minis 250",
// 	"slogan": "Full court support",
// 	"description": "This optimized air cushion pocket reduces impact but keeps a perfect balance underfoot.",
// 	"category": "Basketball Shoes",
// 	"default_price": "0",
// 	"features": [
//   	{
// 			"feature": "Sole",
// 			"value": "Rubber"
// 		},
//   	{
// 			"feature": "Material",
// 			"value": "FullControlSkin"
// 		},
//   	// ...
// 	],
// }
