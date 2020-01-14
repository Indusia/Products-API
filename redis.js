//let util = require('util');
const { promisify } = require('util');

var redis = require('redis'),
  client = redis.createClient();
//host: 'redis'
client.on('error', function(err) {
  console.log('error with redis connection: ' + err);
});

// client.set('string key', 'string val', redis.print);
// client.hset('hash key', 'hashtest 1', 'some value', redis.print);
// client.hset(['hash key', 'hashtest 2', 'some other value'], redis.print);
// client.hkeys('hash key', function(err, replies) {
//   console.log(replies.length + ' replies:');
//   replies.forEach(function(reply, i) {
//     console.log('    ' + i + ': ' + reply);
//   });
//   client.quit();
// });

module.exports = {
  ...client,
  get: promisify(client.hget).bind(client),
  set: promisify(client.hset).bind(client),
  expire: promisify(client.expire).bind(client),
  redis
};
