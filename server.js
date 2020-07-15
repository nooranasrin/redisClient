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

  process.on('SIGINT', () => {
    console.log('saving to disk');
    socket.end();
    server.close();
  });

  socket.on('close', () => console.log('client connection closed !!'));
});
console.log(a);

server.on('close', () => {
  const { path, redisDB, writeTo } = app.locals;
  console.log(redisDB);
  writeTo(path, JSON.stringify(redisDB));
  console.log('closing connection');
});

server.listen(8000, 'localhost', () => {
  console.log('server listening on port 8000');
});
