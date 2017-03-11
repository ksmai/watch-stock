(function() {
  'use strict';
  angular.
    module('app').
    config(configAnimation);

  configAnimation.$inject = ['$animateProvider'];
  function configAnimation($animateProvider) {
    $animateProvider.classNameFilter(/animate/i);
  }
}());
