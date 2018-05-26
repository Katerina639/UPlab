const express = require('express');
const router = require('./server/router');
const logger = require('morgan')('dev');
const bodyParser = require('body-parser');

const PORT = 8080;
const staticPath = `${__dirname}/public`;

const app = express();
app.use(express.static(staticPath));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger);
app.use(router);
app.use((req, res) => {
  //res.status(404).sendFile(`${staticPath}/error.html`);
});

app.listen(PORT, (err) => {
  if (err) {
    console.log('failed to start server');
  } else {
    console.log(`server is running on port ${PORT}`);
  }
});