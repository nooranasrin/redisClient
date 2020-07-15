const net = require('net');

const sendRequest = function (client, req) {
  client.write(req);
  return new Promise((resolve, reject) => {
    client.on('data', (data) => {
      data = JSON.parse(data.toString());
      if (data.response) {
        resolve(data.response);
      }
      reject(data.err);
    });
    client.on('error', (err) => {
      reject(err);
    });
  });
};

const getRequestString = function (options) {
  const { method, path, body } = options;
  const protocol = 'TCP';
  const requestLine = [method, path, protocol].join(' ');
  return `${requestLine}\r\n\r\n${JSON.stringify(body)}`;
};

const getResult = async function (client, options) {
  let result, err;
  try {
    const req = getRequestString(options);
    result = await sendRequest(client, req);
  } catch (error) {
    err = error;
  }
  return { result, err };
};

class RedisClient {
  constructor(db, client) {
    this.client = client;
    this.db = db;
  }

  static createClient(options = { db: 0 }) {
    const client = net.createConnection({ port: 8000 }, () => {
      console.log('client connect to server');
    });
    return new RedisClient(options.db, client);
  }

  async ping(text, callback) {
    const options = {
      body: { text, db: this.db },
      method: 'GET',
      path: '/ping',
    };
    const { result, err } = await getResult(this.client, options);
    callback(err, result);
  }

  async set(key, value, callback) {
    const options = {
      body: { key, value, db: this.db },
      method: 'POST',
      path: '/set',
    };
    const { result, err } = await getResult(this.client, options);
    callback(err, result);
  }

  async get(key, callback) {
    const options = {
      body: { key, db: this.db },
      method: 'GET',
      path: '/get',
    };
    const { result, err } = await getResult(this.client, options);
    callback(err, result);
  }

  async lpush(key, args, callback) {
    const values = args != undefined && [args].flat();
    const options = {
      body: { key, values, db: this.db },
      method: 'POST',
      path: '/lpush',
    };
    const { result, err } = await getResult(this.client, options);
    callback(err, result);
  }

  async rpush(key, args, callback) {
    const values = args != undefined && [args].flat();
    const options = {
      body: { key, values, db: this.db },
      method: 'POST',
      path: '/rpush',
    };
    const { result, err } = await getResult(this.client, options);
    callback(err, result);
  }

  async lpop(key, callback) {
    const options = {
      body: { key, db: this.db },
      method: 'POST',
      path: '/lpop',
    };
    const { result, err } = await getResult(this.client, options);
    callback(err, result);
  }
}

module.exports = RedisClient;
