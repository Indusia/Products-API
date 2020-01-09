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

const related = function(item) {
  return db.any('SELECT * FROM related WHERE product_id = $1;', [item]);
};

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
const prodInfo = function(item) {
  const product = db.any('SELECT * FROM products WHERE product_id = $1;', [
    item
  ]);
  const features = db.any('SELECT * FROM features WHERE product_id = $1;', [
    item
  ]);

  return Promise.all([product, features]);
  //return { product: product, features: features };
};

module.exports = {
  productInformationQuery,
  listProductsQuery,
  prodInfo,
  related
};
