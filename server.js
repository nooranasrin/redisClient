const express = require('express');
const app = express();

// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

app.use((req, res, next) => {
  console.log(req.url);
  next();
});

app.post('/ping', (req, res) => {
  let data = '';
  req.on('data', (d) => (data += d));
  req.on('end', () => {
    data = JSON.parse(data);
    res.write(data.text || 'pong');
    res.end();
  });
});

app.listen(8000);
