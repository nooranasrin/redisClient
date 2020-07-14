const express = require("express");
const handlers = require("./src/handlers");
const redisDB = require("./data/redisDB.json");

const app = express();
app.use(express.json());
app.locals.DB = redisDB;

app.use((req, res, next) => {
  req.redisDB = req.app.locals.DB;
  console.log(req.url);
  next();
});

app.post("/ping", handlers.handlePingRequest);

app.post("/set", handlers.setKeyValuePair);

app.post("/get", handlers.getValue);

app.listen(8000, () => console.log("listening on ", 8000));
