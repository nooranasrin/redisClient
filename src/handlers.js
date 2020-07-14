const loadLocals = (req, res, next) => {
  req.redisDB = req.app.locals.redisDB;
  next();
};

const handlePingRequest = (req, res) => {
  res.json({ response: req.body.text || 'pong' });
};

const setKeyValuePair = (req, res) => {
  const { key, value, db } = req.body;
  const { redisDB } = req;
  if (!key || !value) {
    res.json({ err: `wrong number of arguments for 'set' command` });
  }
  redisDB[db][key] = JSON.stringify(value);
  res.json({ response: 'OK' });
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

const pushToLeft = (req, res) => {
  const { key, values, db } = req.body;
  const { redisDB } = req;
  if (!key || !values || !values.length) {
    res.json({ err: `wrong number of arguments for 'lpush' command` });
  }
  if (!redisDB[db][key]) {
    redisDB[db][key] = [];
  }
  redisDB[db][key].unshift(...values);
  res.json({ response: redisDB[db][key].length });
};

const pushToRight = (req, res) => {
  const { key, values, db } = req.body;
  const { redisDB } = req;
  if (!key || !values || !values.length) {
    return res.json({ err: `wrong number of arguments for 'rpush' command` });
  }
  if (!redisDB[db][key]) {
    redisDB[db][key] = [];
  }
  redisDB[db][key].push(...values);
  res.json({ response: redisDB[db][key].length });
};

module.exports = {
  loadLocals,
  handlePingRequest,
  setKeyValuePair,
  getValue,
  pushToLeft,
  pushToRight,
};
