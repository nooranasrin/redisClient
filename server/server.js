const {Server} = require('net');
const Request = require('./src/request');
const {writeFileSync} = require('fs');
const app = require('./src/routes');
const server = new Server();

server.on('connection', socket => {
  socket.on('data', data => {
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

server.on('close', () => {
  const {redisDB} = app.locals;
  console.log(redisDB);
  writeFileSync('./server/data/redisDB.json', JSON.stringify(redisDB));
  console.log('closing connection');
});

server.listen(8000, 'localhost', () => {
  console.log('server listening on port 8000');
});
