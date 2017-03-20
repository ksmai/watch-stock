(function() {
  'use strict';
  angular.
    module('app.stockSymbols').
    component('stockSymbols', {
      controller: StockSymbolsController,
      controllerAs: 'vm',
      templateUrl: '/stock-symbols/stock-symbols.template.html'
    });

  StockSymbolsController.$inject = ['symbolSync', 'quoteStore'];
  function StockSymbolsController(symbolSync, quoteStore) {
    const vm = this;

    vm.symbolSync = symbolSync;
    vm.remove = symbolSync.remove;
    vm.add = add;
    vm.correct = correct;
    vm.computeLastReturn = computeLastReturn;
    vm.openModal = openModal;
    vm.closeModal = closeModal;
    vm.newSymbol = '';
    vm.err = '';
    vm.showModal = false;
    vm.modalData = {
      data: {}
    };

    function openModal(symbol) {
      vm.showModal = true;
      vm.modalData.data = {
        [symbol]: quoteStore.data[symbol]
      };
    }

    function closeModal(evt) {
      if(!evt.target.classList.contains('modal')) return;

      vm.showModal = false;
    }

    function computeLastReturn(symbol) {
      const hasReturn = quoteStore.data[symbol] &&
        quoteStore.data[symbol].length > 1;

      if(!hasReturn) return {};

      const [{
        date,
        price: currentPrice
      }, {
        price: lastPrice
      }] = quoteStore.data[symbol];

      const ret = parseFloat((currentPrice - lastPrice) / lastPrice);

      // eslint-disable-next-line
      const percent = (ret * 100).toFixed(4);

      return { percent, date };

    }

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
