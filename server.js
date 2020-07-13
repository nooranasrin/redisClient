const express = require('express');
const { writeFileSync } = require('fs');
const app = express();
const redisDB = require('./data/redisDB.json');

const writeToRedis = function (data, encoding = 'utf8') {
  writeFileSync('./data/redisDB.json', JSON.stringify(data), encoding);
};

app.use(express.json());

app.use((req, res, next) => {
  console.log(req.url);
  next();
});

app.post('/ping', (req, res) => {
  res.json({ response: req.body.text || 'pong' });
});

app.post('/set', (req, res) => {
  const { key, value, db } = req.body;
  if (!key || !value) {
    res.json({ err: `wrong number of arguments for 'set' command` });
  }
  redisDB[db][key] = JSON.stringify(value);
  writeToRedis(redisDB);
  res.json({ response: 'OK' });
});

app.post('/get', (req, res) => {
  const { key, db } = req.body;
  if (!key) {
    res.json({ err: `wrong number of arguments for 'get' command` });
  }
  const response = redisDB[db][key];
  res.json({ response });
});

app.listen(8000, () => console.log('listening on ', 8000));
