'use strict';
const express = require('express');
const httpStatus = require('http-status');
const supertest = require('supertest');
const queryRouter = require('./quote-query.route');

describe('Quote query API', function() {
  let request;

  beforeAll(function() {
    const app = express().
      use(queryRouter);

    request = supertest(app);
  });

  it('responds with price data for multiple symbols', function(done) {
    request.
      get('/quotes/GOOG,AAPL').
      expect(httpStatus.OK).
      expect('Content-Type', /json/).
      then(function(res) {
        expect(res.body[0].symbol).toBe('GOOG');
        expect(res.body[1].symbol).toBe('AAPL');
        expect(res.body[0].prices[0].date).toBeDefined();
        expect(res.body[0].prices[0].price).toBeDefined();
        done();
      }).
      catch(done.fail);
  });

  it('responds with 400 for invalid symbols', function(done) {
    request.
      get('/quotes/GOOG,FOOBARBAZ').
      expect(httpStatus.BAD_REQUEST, done);
  });
});
