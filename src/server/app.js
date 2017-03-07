'use strict';
const compression     = require('compression');
const configWebSocket = require('./symbol-sync/websocket');
const express         = require('express');
const helmet          = require('helmet');
const httpStatus      = require('http-status');
const path            = require('path');
const quoteRouter     = require('./symbol-lookup/quote-query.route');

const API_MOUNT   = '/api/v1';
const ASSETS_PATH = path.join(__dirname, '..', '..', 'assets');
const BIN_PATH    = path.join(__dirname, '..', '..', 'bin');
const DEV_PORT    = 3000;
const PORT        = process.env.PORT || DEV_PORT;

const server = express().
  use(helmet()).
  use(compression()).
  use(express.static(BIN_PATH)).
  use(express.static(ASSETS_PATH)).
  use(API_MOUNT, quoteRouter).
  get('/*', displayHomepage).
  use(errorHandler).
  listen(PORT, displayServerDetails);

configWebSocket(server);

function displayHomepage(req, res) {
  res.sendFile('index.html', { root: BIN_PATH });
}

function displayServerDetails() {
  console.log(`Server listening on port ${PORT}`);
}

function errorHandler(err, req, res, next) {
  res.
    status(httpStatus.INTERNAL_SERVER_ERROR).
    send('An error has occured!');
}
