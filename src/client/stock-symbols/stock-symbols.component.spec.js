'use strict';

describe('stockSymbols component', function() {
  let vm;
  let quoteStore;
  let symbolSync;

  beforeEach(module('app.stockSymbols'));

  beforeEach(inject(function($componentController, _quoteStore_, _symbolSync_) {
    vm = $componentController('stockSymbols');
    quoteStore = _quoteStore_;
    symbolSync = _symbolSync_;

    quoteStore.data = {
      'MYSYM': [{
        date: '2017-03-12',
        price: '95.00'
      }, {
        date: '2017-03-11',
        price: '100.00'
      }]
    };
  }));

  it('retrieves data from symbolSync service', function() {
    expect(vm.symbolSync).toBe(symbolSync);
  });

  it('initializes modal', function() {
    expect(vm.showModal).toBe(false);
    expect(vm.modalData).toEqual({ data: {} });
  });
});

