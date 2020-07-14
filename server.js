const app = require('./src/routes');

const main = function () {
  const server = app.listen(8000, () => console.log('listening on ', 8000));

  process.on('SIGINT', () => {
    console.log('Closing http server.');
    server.close(() => {
      const { path, redisDB, writeTo } = app.locals;
      writeTo(path, JSON.stringify(redisDB));
    });
  });
};

main();
