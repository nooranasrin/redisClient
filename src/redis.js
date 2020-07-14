const http = require('http');

const sendRequest = function (options) {
  return new Promise((resolve, reject) => {
    const request = http.request(options, (res) => {
      res.setEncoding('utf8');
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        data = JSON.parse(data);
        if (data.response) {
          resolve(data.response);
        }
        reject(data.err);
      });
      res.on('error', (err) => reject(err));
    });
    request.write(JSON.stringify(options.body), 'utf8');
    request.end();
  });
};

const getResult = async function (options, path) {
  let result, err;
  try {
    result = await sendRequest(Object.assign({ path }, options));
  } catch (error) {
    err = error;
  }
  return { result, err };
};

class Redis {
  constructor(db) {
    this.db = db;
    this.port = 8000;
    this.hostname = 'localhost';
    this.method = 'POST';
    this.headers = { 'Content-Type': 'application/json' };
  }

  static createClient(options = { db: 0 }) {
    return new Redis(options.db);
  }

  getOptions(body, headers) {
    body.db = this.db;
    return {
      port: this.port,
      hostname: this.hostname,
      method: this.method,
      headers: headers || this.headers,
      body,
    };
  }

  async ping(text, callback) {
    const options = this.getOptions({ text });
    const { result, err } = await getResult(options, '/ping');
    callback(err, result);
  }

  async set(key, value, callback) {
    const options = this.getOptions({ key, value });
    const { result, err } = await getResult(options, '/set');
    callback(err, result);
  }

  async get(key, callback) {
    const options = this.getOptions({ key });
    const { result, err } = await getResult(options, '/get');
    callback(err, result);
  }

  async lpush(key, args, callback) {
    const values = args != undefined && [args].flat();
    const options = this.getOptions({ key, values });
    const { result, err } = await getResult(options, '/lpush');
    callback(err, result);
  }

  async rpush(key, args, callback) {
    const values = args != undefined && [args].flat();
    const options = this.getOptions({ key, values });
    const { result, err } = await getResult(options, '/rpush');
    callback(err, result);
  }
}

module.exports = Redis;
