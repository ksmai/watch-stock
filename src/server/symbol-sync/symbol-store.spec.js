'use strict';
const symbols = require('./symbol-store.js');

describe('Symbol Store', function() {
  const testSym = '0420.HK';

  beforeAll(function(done) {
    symbols.remove(testSym).then(done, done.fail);
  });

  afterAll(function(done) {
    symbols.remove(testSym).then(done, done.fail);
  });

  it('lists symbol', function() {
    expect(symbols.list()).toEqual(jasmine.any(Array));
  });

  it('validates and adds new symbol', function(done) {
    expect(symbols.list()).not.toContain(testSym);

    symbols.
      add(testSym).
      then(function() {
        expect(symbols.list()).toContain(testSym);
        done();
      });
  });

  it('removes symbol', function(done) {
    expect(symbols.list()).toContain(testSym);

    symbols.
      remove(testSym).
      then(function() {
        expect(symbols.list()).not.toContain(testSym);
        done();
      });
  });
});
