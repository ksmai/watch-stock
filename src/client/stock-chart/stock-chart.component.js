(function() {
  'use strict';
  angular.
    module('stockChart').
    component('stockChart', {
      controller: StockChartController,
      controllerAs: 'vm',
      templateUrl: '/stock-chart/stock-chart.template.html'
    });

  StockChartController.$inject = [];
  function StockChartController() {
    const vm = this;

  }
}());
