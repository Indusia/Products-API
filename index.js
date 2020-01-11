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
  let options = req.query;
  console.log('options:');
  console.log(options);
  models.productsList(options).then((data) => {
    res.status(200).send(data);
  });
});

//Products Information
//GET /products/:product_id
//parameters: product_id

app.get('/products/:product_id', function(req, res) {
  models
    .prodInfo(req.params.product_id)
    .then((data) => {
      const featuresArray = [];
      for (let i = 0; i < data.length; i++) {
        let temp = {
          feature: data[i].feature,
          value: data[i].feature_value
        };
        featuresArray.push(temp);
      }

      data = data[0];

      const payload = {
        id: data.product_id,
        name: data.name,
        slogan: data.slogan,
        description: data.description,
        category: data.catagory,
        default_price: data.default_price,
        features: featuresArray
      };

      res.status(200).send(payload);
    })
    .catch((err) => {
      console.log('prod info error');
      console.log(error);
    });
});

//related products
//GET /products/:product_id/related
app.get('/products/:product_id/related', function(req, res) {
  models.related(req.params.product_id).then((data) => {
    const relatedArray = [];
    for (let i = 0; i < data.length; i++) {
      relatedArray.push(Number(data[i].related_id));
    }
    res.status(200).send(relatedArray);
  });
});

//product styles
//GET /products/:product_id/styles
//parameters: product_id
app.get('/products/:product_id/styles', function(req, res) {
  models
    .productStyles(req.params.product_id)
    .then((data) => {
      let skus = data[0];
      let images = data[1];
      let styles = {};

      // create style objects to send back
      let skuObj = {};
      let photoArray = [];

      for (let i = 0; i < skus.length; i++) {
        let temp = skus[i].style_id;

        if (styles[temp] !== undefined) {
          skuObj = styles[temp]['skus'];
          skuObj[skus[i].size] = skus[i].quantity;
        } else {
          skuObj[skus[i].size] = skus[i].quantity;
        }

        styles[temp] = {
          style_id: skus[i].style_id,
          name: skus[i].name,
          original_price: skus[i].original_price,
          sale_price: skus[i].sale_price,
          'default?': skus[i].default_style,
          photos: photoArray,
          skus: skuObj
        };
      }

      for (let i = 0; i < images.length; i++) {
        styles[images[i].style_id].photos.push({
          url: images[i].main_url,
          thumbnail_url: images[i].thumbnail_url
        });
      }

      let payload = {
        product_id: req.params.product_id,
        results: []
      };

      for (let key in styles) {
        payload.results.push(styles[key]);
      }

      res.status(200).send(payload);
    })
    .catch((err) => {
      console.log(err);
    });
});
