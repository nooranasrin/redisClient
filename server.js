const express = require("express");
const handlers = require("./src/handlers");
const app = express();
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.url);
  next();
});

app.post("/ping", handlers.handlePingRequest);

app.post("/set", handlers.setKeyValuePair);

app.post("/get", handlers.getValue);

app.listen(8000, () => console.log("listening on ", 8000));
