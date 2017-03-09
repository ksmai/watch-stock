(function() {
  'use strict';
  angular.
    module('stockChart').
    component('stockChart', {
      controller: StockChartController,
      controllerAs: 'vm',
      templateUrl: '/stock-chart/stock-chart.template.html'
    });

  StockChartController.$inject = ['quoteStore'];
  function StockChartController(quoteStore) {
    const vm = this;

    vm.quoteStore = quoteStore;
    vm.hasData = hasData;

    function hasData(obj) {
      return !angular.equals({}, obj);
    }

  }
}());
