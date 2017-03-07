'use strict';
const quoteQuery = require('./quote-query.js');

describe('quoteQuery', function() {
  const symbols = ['GOOG', 'AAPL'];
  const shortTimeout = 500;
  let prevData;

  it('resolves to stock prices of multiple symbols', function(done) {
    quoteQuery(symbols).
      then(function(data) {
        expect(data.length).toBe(symbols.length);
        expect(data.map(el => el.symbol)).toEqual(symbols);
        expect(data[0].prices).toEqual(jasmine.any(Array));
        expect(data[0].prices[0].price).toBeDefined();
        expect(data[0].prices[0].date).toBeDefined();
        prevData = data;
        done();
      }).
      catch(done.fail);
  });

  it('caches previous result', function(done) {
    quoteQuery(symbols).
      then(function(data) {
        expect(data).toEqual(prevData);
        done();
      }).
      catch(done.fail);
  }, shortTimeout);
});
