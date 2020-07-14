const Redis = require('./src/redis');

const client = Redis.createClient();

const showResult = function (err, result) {
  err && console.log(err);
  result && console.log(result);
};

const main = async () => {
  // await client.ping('', showResult);
  // await client.ping('hello', showResult);
  // await client.set('name', 'revathi', showResult);
  // await client.get('name', showResult);
  // await client.lpush('list', undefined, showResult);
  // await client.lpush('list', 3, showResult);
  // await client.lpush('list', [1, 2, 3], showResult);
  // await client.rpush('list', undefined, showResult);
  // await client.rpush('list', 1000, showResult);
  // await client.rpush('list', [6, 7, 8], showResult);
  await client.lpop('list', showResult);
};

main();
