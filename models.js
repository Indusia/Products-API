var pgp = require('pg-promise')(/* options */);
var db = pgp('postgres://postgres:docker@localhost:5432/sdc1');

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

  //console.log(typeof count);

  if (options.page) {
    page = Number(options.page);
    //console.log();
  }

  //console.log('count:', count, 'page:', page);
  let start;

  if ((page = 1)) {
    start = 0;
  } else {
    start = 0 + count;
    //console.log(start);
  }

  //   console.log(start, end);

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

module.exports = {
  productsList,
  productStyles,
  prodInfo,
  related
};

//SELECT * FROM features INNER JOIN products ON (features.product_id = products.product_id) where products.product_id = 11;
