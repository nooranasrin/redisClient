const net = require('net');

const getRequestString = function (options) {
  const { method, path, headers, body } = options;
  const protocol = 'TCP';
  const requestLine = [method, path, protocol].join(' ');
  const headerList = [];
  for (const headerName in headers) {
    headerList.push(`${headerName}: ${headers[headerName]}`);
  }
  const headersString = headerList.join('\r\n');
  return `${requestLine}\r\n${headersString}\r\n\r\n${JSON.stringify(body)}`;
};

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

const getResult = async function (client, options, path) {
  let result, err;
  try {
    const req = getRequestString(Object.assign({ path }, options));
    result = await sendRequest(client, req);
  } catch (error) {
    err = error;
  }
  return { result, err };
};

class Redis {
  constructor(db, client) {
    this.client = client;
    this.db = db;
    this.port = 8000;
    this.hostname = 'localhost';
    this.method = 'GET';
    this.headers = { 'Content-Type': 'application/json' };
  }

  static createClient(options = { db: 0 }) {
    const client = net.createConnection({ port: 8000 }, () => {
      console.log('client connect to server');
    });
    return new Redis(options.db, client);
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
    const { result, err } = await getResult(this.client, options, '/ping');
    callback(err, result);
  }

  async set(key, value, callback) {
    const options = this.getOptions({ key, value });
    options.method = 'POST';
    const { result, err } = await getResult(this.client, options, '/set');
    callback(err, result);
  }

  async get(key, callback) {
    const options = this.getOptions({ key });
    const { result, err } = await getResult(this.client, options, '/get');
    callback(err, result);
  }

  async lpush(key, args, callback) {
    const values = args != undefined && [args].flat();
    const options = this.getOptions({ key, values });
    options.method = 'POST';

    const { result, err } = await getResult(this.client, options, '/lpush');
    callback(err, result);
  }

  async rpush(key, args, callback) {
    const values = args != undefined && [args].flat();
    const options = this.getOptions({ key, values });
    options.method = 'POST';

    const { result, err } = await getResult(this.client, options, '/rpush');
    callback(err, result);
  }

  async lpop(key, callback) {
    const options = this.getOptions({ key });
    const { result, err } = await getResult(this.client, options, '/lpop');
    callback(err, result);
  }
}

module.exports = Redis;
