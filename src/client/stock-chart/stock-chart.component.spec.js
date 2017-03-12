'use strict';

describe('stockChart component', function() {
  let vm;
  let quoteStore;
  let symbolSync;

  beforeEach(module('app.stockChart'));

  beforeEach(inject(function($componentController, _quoteStore_, _symbolSync_) {
    quoteStore = _quoteStore_;
    symbolSync = _symbolSync_;
    vm = $componentController('stockChart');
  }));

  it('retrieves data from symbolSync service', function() {
    expect(vm.symbolSync).toBe(symbolSync);
  });

  it('retrieves data from queryStore service', function() {
    expect(vm.quoteStore).toBe(quoteStore);
  });

  it('checks against empty objects', function() {
    expect(vm.hasData({})).toBe(false);
    expect(vm.hasData({ foo: 'bar' })).toBe(true);
  });
});
