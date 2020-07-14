const express = require('express');
const { writeFileSync } = require('fs');
const handlers = require('./handlers');
const redisDB = require('../data/redisDB.json');

const app = express();
app.use(express.json());
app.locals.redisDB = redisDB;
app.locals.path = './data/redisDB.json';
app.locals.writeTo = writeFileSync;

app.use(handlers.loadLocals);

app.post('/ping', handlers.handlePingRequest);

app.post('/set', handlers.setKeyValuePair);

app.post('/get', handlers.getValue);

module.exports = app;
