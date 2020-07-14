const App = require('./app');
const { writeFileSync } = require('fs');
const handlers = require('./handlers');
const redisDB = require('../data/redisDB.json');

const app = new App();
app.locals.redisDB = redisDB;
app.locals.path = './data/redisDB.json';
app.locals.writeTo = writeFileSync;

app.use(handlers.loadLocals);

app.get('/ping', handlers.handlePingRequest);

app.post('/set', handlers.setKeyValuePair);

app.get('/get', handlers.getValue);

app.post('/lpush', handlers.pushToLeft);

app.post('/rpush', handlers.pushToRight);

app.get('/lpop', handlers.popLeft);

module.exports = app;
