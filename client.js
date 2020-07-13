const Redis = require('./src/redis');

const client = Redis.createClient();

client.ping('', (err, result) => {
  err && console.log(err);
  console.log(result);
});

client.ping('hello', (err, result) => {
  err && console.log(err);
  console.log(result);
});
