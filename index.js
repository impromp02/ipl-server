const express = require('express');
const path = require('path');
const logger = require('morgan');
const router = require('./router/router');

// **** express app setup *****
const app = express();

app.use(logger('dev'));
app.use(express.static(path.resolve('public')));
app.set('views', '/views');

app.use('/api', router);

app.listen(8080, () => console.log('***Server is listening on 8080***'));