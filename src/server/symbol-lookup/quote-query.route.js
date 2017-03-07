'use strict';
const express = require('express');
const httpStatus = require('http-status');
const quoteQuery = require('./quote-query');

const router = express.Router();
router.get('/quotes/:symbols', respondQuotes);
router.use(errorHandler);
module.exports = router;
//////////////////////////////////////////////////

function respondQuotes(req, res, next) {
  const symbols = req.params.symbols.split(',').
    map(sym => sym.trim().toUpperCase());

  quoteQuery(symbols).
    then(function(data) {
      res.json(data);
      return data;
    }).
    catch(function(err) {
      next(err);
      return err;
    });
}

function errorHandler(err, req, res, next) {
  res.status(httpStatus.BAD_REQUEST).end();
}
