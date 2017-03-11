(function() {
  'use strict';
  angular.
    module('stockSymbols').
    component('stockSymbols', {
      controller: StockSymbolsController,
      controllerAs: 'vm',
      templateUrl: '/stock-symbols/stock-symbols.template.html'
    });

  StockSymbolsController.$inject = ['symbolSync'];
  function StockSymbolsController(symbolSync) {
    const vm = this;

    vm.symbolSync = symbolSync;
    vm.remove = symbolSync.remove;
    vm.correct = correct;
    vm.add = add;
    vm.newSymbol = '';
    vm.err = '';

    function correct(alt) {
      clearError();
      vm.newSymbol = alt;
      vm.add();
    }

    function add() {
      clearError();

      if(!isValidSymbol(vm.newSymbol)) {
        vm.err = `Not a valid symbol: ${vm.newSymbol}`;
        return;
      }

      vm.newSymbol = vm.newSymbol.toUpperCase();
      symbolSync.add(vm.newSymbol);
    }

    function isValidSymbol(symbol) {
      const regex = /^\w{1,6}(?:\.\w{1,6})?$/i;

      return regex.test(symbol);
    }

    function clearError() {
      symbolSync.clearError();
      vm.err = '';
    }
  }
}());
