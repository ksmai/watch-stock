'use strict';
const validateSymbol = require('./validate-symbol');

const extendedTimeout = 10000;

describe('validateSymbol', function() {
  it('returns a promise', function() {
    const returnValue = validateSymbol('GOOG');
    expect(returnValue).toEqual(jasmine.any(global.Promise));
  });

  it('resolves with a valid symbol', function(done) {
    validateSymbol('GOOG').
      then(function(res) {
        expect(res.valid).toBe(true);
        expect(res.symbol).toBe('GOOG');
        expect(res.exchange).toBe('NASDAQ');
        expect(res.name).toBe('Alphabet Inc.');
        done();
      }).
      catch(done.fail);
  }, extendedTimeout);

  it('rejects with alternatives for invalid symbol', function(done) {
    validateSymbol('GOOGLE').
      then(done.fail).
      catch(function(res) {
        expect(res.valid).toBe(false);
        expect(res.alternatives).toEqual(jasmine.any(Array));
        done();
      });
  }, extendedTimeout);
});
