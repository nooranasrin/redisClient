const { writeFileSync } = require("fs");

const writeToRedis = function (data, encoding = "utf8") {
  writeFileSync("./data/redisDB.json", JSON.stringify(data), encoding);
};

const handlePingRequest = (req, res) => {
  res.json({ response: req.body.text || "pong" });
};

const setKeyValuePair = (req, res) => {
  const { key, value, db } = req.body;
  const { redisDB } = req;
  if (!key || !value) {
    res.json({ err: `wrong number of arguments for 'set' command` });
  }
  redisDB[db][key] = JSON.stringify(value);
  writeToRedis(redisDB);
  res.json({ response: "OK" });
};

const getValue = (req, res) => {
  const { key, db } = req.body;
  const { redisDB } = req;
  if (!key) {
    res.json({ err: `wrong number of arguments for 'get' command` });
  }
  const response = redisDB[db][key];
  res.json({ response });
};

module.exports = { handlePingRequest, setKeyValuePair, getValue };
