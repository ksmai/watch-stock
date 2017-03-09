(function() {
  'use strict';
  angular.
    module('core.annotationChart').
    run(initAnnotationChart);

  initAnnotationChart.$inject = ['$window'];
  function initAnnotationChart($window) {
    $window.google.charts.load('current', {
      packages: ['annotationchart']
    });
  }
}());
