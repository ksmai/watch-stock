(function() {
  'use strict';
  angular.
    module('core.quoteStore').
    factory('quoteStore', quoteStoreFactory);

  quoteStoreFactory.$inject = ['$http', '$window'];
  function quoteStoreFactory($http, $window) {
    const quoteStore = {
      data: {},
      update
    };

    const cache = {};

    return quoteStore;
    //////////////////////////////////////////////////

    // return a Promise that rejects if no data for the symbol
    function update(inputSymbols, retry = false) {
      const symbols = transformInput(inputSymbols);
      let newData;

      if(retry) {
        newData = quoteStore.data;
      } else {
        newData = {};
        quoteStore.data = newData;
      }
      checkCache(symbols, newData);

      if(symbols.length === 0) {
        return $window.Promise.resolve();
      }

      return $http.
        get(`/api/v1/quotes/${symbols.join(',')}`).
        then(function successHandler(res) {
          res.data.forEach(stock => {
            newData[stock.symbol] = stock.prices;
            cache[stock.symbol] = {
              prices: stock.prices,
              date: Date.now()
            };
          });

          return res;
        }).
        catch(function errorHandler(res) {
          const HTTP_STATUS_BAD_REQUEST = 400;
          const badRequest = res.status === HTTP_STATUS_BAD_REQUEST;
          const shouldRetry = badRequest && symbols.length > 1;

          if(shouldRetry) {
            const promises = symbols.map((symbol) => update(symbol, true));
            return $window.Promise.all(promises);
          } else if(badRequest) {
            return $window.Promise.reject(symbols[0]);
          }

          return res;
        });

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
    }

  }
}());
