'use strict';
const compression = require('compression');
const express     = require('express');
const helmet      = require('helmet');
const httpStatus  = require('http-status');
const path        = require('path');

const ASSETS_PATH = path.join(__dirname, '..', '..', 'assets');
const BIN_PATH    = path.join(__dirname, '..', '..', 'bin');
const DEBUG_PORT  = 3000;
const PORT        = process.env.PORT || DEBUG_PORT;

const app = express();
app.use(helmet());
app.use(compression());
app.use(express.static(BIN_PATH));
app.use(express.static(ASSETS_PATH));
app.get('/*', displayHomepage);
app.use(errorHandler);
app.listen(PORT, displayServerDetails);

function displayHomepage(req, res) {
  res.sendFile('index.html', { root: BIN_PATH });
}

function displayServerDetails() {
  console.log(`Server listening on port ${PORT}\nPID: ${process.pid}`);
}

function errorHandler(err, req, res, next) {
  res.
    status(httpStatus.INTERNAL_SERVER_ERROR).
    send('An error has occured!');
}
