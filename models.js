var pgp = require('pg-promise')(/* options */);

let dbHost = '18.191.199.22';
var db = pgp(`postgres://postgres:docker@${dbHost}:5432/sdc1`);

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
  //   const product = db.any('SELECT * FROM products WHERE product_id = $1;', [
  //     item
  //   ]);
  //   const features = db.any('SELECT * FROM features WHERE product_id = $1;', [
  //     item
  //   ]);

  const output = db.any(
    'SELECT * FROM features INNER JOIN products ON (features.product_id = products.product_id) where products.product_id = $1;',
    [item]
  );

  return output;

  //SELECT * FROM features INNER JOIN products ON (features.product_id = products.product_id) where products.product_id = 11;

  //   return Promise.all([product, features]);
  //return { product: product, features: features };
};

const productsList = function(options) {
  //the math here is still wonky, come back and fix
  let count = 0;
  let page = 1;
  if (options.count) {
    count = Number(options.count);
  }
  if (options.page) {
    page = Number(options.page);
  }

  let start;

  if ((page = 1)) {
    start = 0;
  } else {
    start = 0 + count;
  }

  return db.any(
    'SELECT * FROM products WHERE product_id >$1 and product_id <=$2;',
    [start, 10]
  );
};

const productStyles = function(item) {
  let images = db.any(
    'WITH sty as (SELECT * FROM styles WHERE product_id = $1) SELECT style_id, main_url, thumbnail_url, product_id FROM images INNER JOIN sty ON images.styleid = sty.style_id;',
    [item]
  );

  let styles = db.any(
    'WITH sty as (SELECT * FROM styles WHERE product_id = $1) SELECT * FROM skus INNER JOIN sty ON skus.style_id = sty.style_id;',
    [item]
  );

  return Promise.all([styles, images]);
};

const improvedImages = function(item) {
  let images = db.any(
    'WITH sty as (SELECT * FROM styles WHERE product_id = $1) SELECT style_id, main_url, thumbnail_url, product_id FROM images INNER JOIN sty ON images.styleid = sty.style_id;',
    [item]
  );
};

module.exports = {
  productsList,
  productStyles,
  prodInfo,
  related,

  improvedImages
};

//SELECT * FROM features INNER JOIN products ON (features.product_id = products.product_id) where products.product_id = 11;
