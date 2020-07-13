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

class Redis {
  constructor(db) {
    this.db = db;
    this.port = 8000;
    this.hostname = 'localhost';
    this.method = 'get';
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
    let result, err;
    this.method = 'post';
    const options = this.getOptions({ text });
    try {
      result = await sendRequest(Object.assign({ path: '/ping' }, options));
    } catch (error) {
      err = error;
    } finally {
      callback(err, result);
    }
  }

  async set(key, value, callback) {
    let result, err;
    this.method = 'post';
    const options = this.getOptions({ key, value });
    try {
      result = await sendRequest(Object.assign({ path: '/set' }, options));
    } catch (error) {
      err = error;
    } finally {
      callback(err, result);
    }
  }

  async get(key, callback) {
    let result, err;
    this.method = 'post';
    const options = this.getOptions({ key });
    try {
      result = await sendRequest(Object.assign({ path: '/get' }, options));
    } catch (error) {
      err = error;
    } finally {
      callback(err, result);
    }
  }
}

module.exports = Redis;
