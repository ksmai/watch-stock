(function() {
  'use strict';
  angular.module('app.core', [
    'core.annotationChart',
    'core.quoteStore',
    'core.symbolSync',
    'core.ws'
  ]);
}());
