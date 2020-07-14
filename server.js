const { Server } = require('net');
const Request = require('./src/request');
const app = require('./src/routes');
const server = new Server();

server.on('connection', (socket) => {
  socket.on('data', (data) => {
    const request = Request.parse(data.toString());
    request.app = app;
    app.processRequest(request, socket);
  });
  socket.on('close', () => {
    console.log('client connection closed !!');
    const { path, redisDB, writeTo } = app.locals;
    console.log(redisDB);
    writeTo(path, JSON.stringify(redisDB));
  });
});

server.listen(8000, 'localhost', () => {
  console.log('server listening on port 8000');
});
