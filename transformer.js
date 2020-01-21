// const styleTransformer = function(data) {
//   let skus = data[0];
//   let images = data[1];
//   let styles = {};

//   // create style objects to send back
//   let skuObj = {};
//   let photoArray = [];

//   for (let i = 0; i < skus.length; i++) {
//     let temp = skus[i].style_id;

//     if (styles[temp] !== undefined) {
//       skuObj = styles[temp]['skus'];
//       skuObj[skus[i].size] = skus[i].quantity;
//     } else {
//       skuObj[skus[i].size] = skus[i].quantity;
//     }

//     styles[temp] = {
//       style_id: skus[i].style_id,
//       name: skus[i].name,
//       original_price: skus[i].original_price,
//       sale_price: skus[i].sale_price,
//       'default?': skus[i].default_style,
//       photos: photoArray,
//       skus: skuObj
//     };
//   }

//   console.log('images');
//   console.log(images);
//   console.log('styles');
//   console.log(styles);
//   //let counter = 0
//   for (let i = 0; i < images.length; i++) {
//     console.log(i);

//     styles[images[i].style_id].photos.push({
//       url: images[i].main_url,
//       thumbnail_url: images[i].thumbnail_url
//     });
//   }

//   let payload = {
//     product_id: req.params.product_id,
//     results: []
//   };

//   for (let key in styles) {
//     payload.results.push(styles[key]);
//   }

//   return payload;
// };

// module.exports = {
//   styleTransformer
// };
