(function() {
  'use strict';
  angular.
    module('stockChart').
    component('stockChart', {
      controller: StockChartController,
      controllerAs: 'vm',
      templateUrl: '/stock-chart/stock-chart.template.html'
    });

  StockChartController.$inject = ['quoteStore', 'symbolSync'];
  function StockChartController(quoteStore, symbolSync) {
    const vm = this;

    vm.quoteStore = quoteStore;
    vm.symbolSync = symbolSync;
    vm.hasData = hasData;

    function hasData(obj) {
      return !angular.equals({}, obj);
    }

  }
}());
