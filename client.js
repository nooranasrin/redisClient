const Redis = require('./src/redis');

const client = Redis.createClient();

const showResult = function (err, result) {
  err && console.log(err);
  console.log(result);
};

client.ping('', showResult);

client.ping('hello', showResult);

client.set('name', 'JOHN', showResult);

client.get('name', showResult);

client.lpush('list', undefined, showResult);

client.lpush('list', 3, showResult);

client.lpush('list', [1, 2, 3], showResult);

client.rpush('list', undefined, showResult);

client.rpush('list', 1000, showResult);

client.rpush('list', [6, 7, 8], showResult);
