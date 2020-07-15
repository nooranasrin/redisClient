const RedisClient = require('./src/redisClient');

let client = RedisClient.createClient();

const showResult = function(err, result) {
  err && console.log(err);
  console.log(result);
};

const main = async () => {
  await client.ping('', showResult);
  await client.ping('hello', showResult);
  await client.set('name', 'revathi', showResult);
  await client.get('name', showResult);
  await client.lpush('list', undefined, showResult);
  await client.lpush('list', 0, showResult);
  await client.lpush('list', [1, 2, 3], showResult);
  await client.rpush('list', undefined, showResult);
  await client.rpush('list', 4, showResult);
  await client.rpush('list', [5, 6, 7, 8], showResult);
  client = RedisClient.createClient();
  await client.lpop('list', showResult);
};

main();
