(function() {
  'use strict';
  angular.
    module('core.quoteStore').
    factory('quoteStore', quoteStoreFactory);

  quoteStoreFactory.$inject = ['$http'];
  function quoteStoreFactory($http) {
    const quoteStore = {
      data: {},
      update
    };

    const cache = {};

    return quoteStore;
    //////////////////////////////////////////////////

    function update(inputSymbols) {
      const symbols = transformInput(inputSymbols);
      const newData = {};
      quoteStore.data = newData;
      checkCache(symbols, newData);

      if(symbols.length === 0) {
        return;
      }

      $http.
        get(`/api/v1/quotes/${symbols.join(',')}`).
        then(successHandler).
        catch(errorHandler);

      ////////////////////////////////////////////////////
      function transformInput(symbols) {
        if(!Array.isArray(symbols)) {
          return symbols.split(',');
        }

        return symbols.slice();
      }

      function checkCache(symbols, newData) {
        const ONE_DAY = 86400000;
        const YESTERDAY = Date.now() - ONE_DAY;
        for(let i = symbols.length - 1; i >= 0; i--) {
          const symbol = symbols[i];
          const cacheHit = cache[symbol] && cache[symbol].date > YESTERDAY;
          if(cacheHit) {
            newData[symbol] = cache[symbol].prices;
            symbols.splice(i, 1);
          }
        }
      }

      function successHandler(res) {
        res.data.forEach(stock => {
          newData[stock.symbol] = stock.prices;
          cache[stock.symbol] = {
            prices: stock.prices,
            date: Date.now()
          };
        });

        return res;
      }

      function errorHandler(res) {
        const HTTP_STATUS_BAD_REQUEST = 400;
        const shouldRetry = res.status === HTTP_STATUS_BAD_REQUEST &&
          symbols.length > 1;

        if(shouldRetry) {
          symbols.forEach(update);
        }

        return res;
      }
    }

  }
}());
