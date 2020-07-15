const net = require('net');

const sendRequest = function(client, req) {
  client.write(req);
  return new Promise((resolve, reject) => {
    client.on('data', data => {
      data = JSON.parse(data.toString());
      if (data.response !== undefined) {
        resolve(data.response);
      }
      reject(data.err);
    });

    client.on('error', err => {
      reject(err);
    });
  });
};

const getRequestString = function(options) {
  const {method, path, body} = options;
  const protocol = 'TCP';
  const requestLine = [method, path, protocol].join(' ');
  return `${requestLine}\r\n\r\n${JSON.stringify(body)}`;
};

const getResult = async function(client, options) {
  let result, err;
  try {
    const req = getRequestString(options);
    result = await sendRequest(client, req);
  } catch (error) {
    err = error;
  }
  return {result, err};
};

const getOptions = function(method, path, body) {
  return {body, path, method};
};

class RedisClient {
  constructor(db, client) {
    this.client = client;
    this.db = db;
  }

  async runQuery(method, path, text) {
    const options = getOptions(method, path, {...text, db: this.db});
    return await getResult(this.client, options);
  }

  static createClient(options = {db: 0}) {
    const client = net.createConnection({port: 8000}, () => {
      console.log('client connect to server');
    });
    return new RedisClient(options.db, client);
  }

  async ping(text, callback) {
    const {result, err} = await this.runQuery('GET', '/ping', {text});
    callback(err, result);
  }

  async set(key, value, callback) {
    const {result, err} = await this.runQuery('POST', '/set', {key, value});
    callback(err, result);
  }

  async get(key, callback) {
    const {result, err} = await this.runQuery('GET', '/get', {key});
    callback(err, result);
  }

  async lpush(key, args, callback) {
    const values = args != undefined && [args].flat();
    const {result, err} = await this.runQuery('POST', '/lpush', {key, values});
    callback(err, result);
  }

  async rpush(key, args, callback) {
    const values = args != undefined && [args].flat();
    const {result, err} = await this.runQuery('POST', '/rpush', {key, values});
    callback(err, result);
  }

  async lpop(key, callback) {
    const {result, err} = await this.runQuery('GET', '/lpop', {key});
    callback(err, result);
  }
}

module.exports = RedisClient;
