class Request {
  constructor(method, url, body) {
    this.method = method;
    this.path = url;
    this.body = body;
  }

  static parse(requestText) {
    let [requestLine, ...body] = requestText.split('\r\n\r\n');
    const [method, url] = requestLine.split(' ');
    body = JSON.parse(body);
    const req = new Request(method, url, body);
    return req;
  }
}

module.exports = Request;
