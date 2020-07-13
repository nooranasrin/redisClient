const http = require('http');

const sendRequest = function (options) {
  return new Promise((resolve, reject) => {
    const request = http.request(options, (res) => {
      res.setEncoding('utf8');
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve(data));
      res.on('error', (err) => reject(err));
    });
    request.write(JSON.stringify({ text: options.body }), 'utf8');
    request.end();
  });
};

class Redis {
  constructor() {
    this.port = 8000;
    this.hostname = 'localhost';
    this.method = 'get';
  }

  static createClient() {
    return new Redis();
  }

  get options() {
    return { port: this.port, hostname: this.hostname, method: this.method };
  }

  async ping(text, callback) {
    let result, err;
    try {
      this.method = 'post';
      const options = this.options;
      result = await sendRequest(
        Object.assign({ path: '/ping', body: text }, options)
      );
    } catch (error) {
      err = error;
    } finally {
      callback(err, result);
    }
  }
}

module.exports = Redis;
