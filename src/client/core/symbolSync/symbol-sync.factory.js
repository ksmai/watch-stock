(function() {
  'use strict';
  angular.
    module('core.symbolSync').
    factory('symbolSync', symbolSyncFactory);

  symbolSyncFactory.$inject = ['quoteStore', 'ws', '$rootScope'];
  function symbolSyncFactory(quoteStore, ws, $rootScope) {
    const symbolSync = {
      add,
      remove,
      clearError,
      symbols: [],
      error: {
        message: '',
        alternatives: []
      }
    };

    ws.setCallback(onMessage);

    return symbolSync;
    //////////////////////////////////////////////////

    function add(symbol) {
      console.log(`Adding symbol: ${symbol}`);
      if(!symbol) {
        symbolSync.error.message = 'Please enter a symbol to add.';
        return;
      }

      try {
        ws.send({
          action: 'add',
          symbol: symbol.trim().toUpperCase()
        });
      } catch(e) {
        symbolSync.error.message = e.message;
      }
    }

    function remove(symbol) {
      console.log(`Removing symbol: ${symbol}`);
      if(!symbol) return;

      try {
        ws.send({
          action: 'remove',
          symbol: symbol.trim().toUpperCase()
        });
      } catch(e) {
        console.error(e);
      }
    }

    function onMessage(msg) {
      let data;
      try {
        data = JSON.parse(msg.data);
      } catch(e) {
        symbolSync.error.message = e.message;
      }

      if(Array.isArray(data)) {
        symbolSync.symbols = data;
        quoteStore.update(data).
          catch(function(invalidSymbol) {
            symbolSync.remove(invalidSymbol);
          });
      } else if(data.hasOwnProperty('valid') && !data.valid) {
        symbolSync.error.message = `Symbol not found: ${data.symbol}`;
        symbolSync.error.alternatives = data.alternatives;
      }

      $rootScope.$digest();
    }

    function clearError() {
      symbolSync.error.message = '';
      symbolSync.error.alternatives = [];
    }
  }
}());
