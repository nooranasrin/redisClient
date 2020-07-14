const getMatchingHandler = function (route) {
  if (route.method) {
    return this.method === route.method && route.path == this.url;
  }
  return true;
};

class App {
  constructor() {
    this.routers = [];
    this.locals = {};
  }

  get(path, handler) {
    this.routers.push({ path, handler, method: "GET" });
  }

  post(path, handler) {
    this.routers.push({ path, handler, method: "POST" });
  }

  use(middleware) {
    this.routers.push({ handler: middleware });
  }

  processRequest(request, response) {
    const matchingHandlers = this.routers.filter(
      getMatchingHandler.bind(request)
    );
    const next = function () {
      const router = matchingHandlers.shift();
      router.handler(request, response, next);
    };
    next();
  }
}

module.exports = App;
