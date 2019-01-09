const express = require('express');
const path = require('path');
const logger = require('morgan');
const router = require('./router/router');

// **** express app setup *****
const app = express();

app.use(logger('dev'));
app.use(express.static('public'));

app.use('/api', router);

app.get('*', function(req, res) {
  res.sendFile('index.html');
});

app.listen(8080, () => console.log('***Server is listening on 8080***'));