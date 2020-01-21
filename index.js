const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const models = require('./models');
const client = require('./redis.js');
const cors = require('cors');

const app = express();
const PORT = 17777;

app.use(cors());

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, './dist')));

// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
// });

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

//redis init
// var redis = require('redis'),
//   client = redis.createClient({ host: 'redis' });

client.set('string key test', 'string val test', client.redis.print);

// client.hkeys('hash key', function(err, replies) {
//   console.log(replies.length + ' replies:');
//   replies.forEach(function(reply, i) {
//     console.log('    ' + i + ': ' + reply);
//   });
//   client.quit();
// });

//var pgp = require('pg-promise')(/* options */);
//var db = pgp('postgres://username:password@host:port/database')
//var db = pgp('postgres://postgres:docker@localhost:5432/sdc1');

//routes

app.get('/', function(req, res) {
  res.send('hello world');
});

app.get('/loaderio-04326d2e4250a96e6094cbb2507bf703/', function(req, res) {
  let token = 'loaderio-04326d2e4250a96e6094cbb2507bf703';

  res.status(200).send(token);
});

//List Products
//GET /products/list  Retrieves the list of products
//parameters: page, count
app.get('/products/list', function(req, res) {
  let options = req.query;
  console.log('options:');
  console.log(options);
  models
    .productsList(options)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).send('404 error');
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
      res.status(404).send('404 error');
    });
});

//related products
//GET /products/:product_id/related
app.get('/products/:product_id/related', function(req, res) {
  models
    .related(req.params.product_id)
    .then((data) => {
      const relatedArray = [];
      for (let i = 0; i < data.length; i++) {
        relatedArray.push(Number(data[i].related_id));
      }
      res.status(200).send(relatedArray);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).send('404 error');
    });
});

//product styles
//GET /products/:product_id/styles
//parameters: product_id
app.get('/products/:product_id/styles', function(req, res) {
  //check cache for the entered query'
  let cachedRes = client
    .get('styles', req.params.product_id)
    .then((data) => {
      if (data) {
        //if present in query, send it from there
        // console.log('cached response:');
        // console.log(data);

        //added JSON.parse here. Needs a little testing
        res.status(200).send(JSON.parse(data));
      } else {
        //otherwise query postgres
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

            console.log('images');
            console.log(images);
            console.log('styles');
            console.log(styles);
            //let counter = 0
            for (let i = 0; i < images.length; i++) {
              console.log(i);

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

            client.set(
              'styles',
              req.params.product_id,
              JSON.stringify(payload)
            );

            res.status(200).send(payload);
          })
          .catch((err) => {
            console.log(err);
            res.status(404).send('404 error');
          });
      }
    })
    .catch((err) => {
      console.log('error with redis');
      console.log(err);
    });
});
