'use strict';
const request = require('request');

const cache = Object.create(null);

module.exports = query;
//////////////////////////////////////////////////

// input: an array of symbols, e.g. ['GOOG', 'AAPL']
// output: a promise that resolves to an array of stock prices (up to
//   a year) for each stock
function query(symbols) {
  const promises = symbols.
    map(symbol => new global.Promise(function(resolve, reject) {
      if(getCache(symbol)) return resolve(getCache(symbol));

      request(generateYQL(symbol), function(err, res, body) {
        if(err) return reject(err);

        let data;
        try {
          data = JSON.parse(body).query.results.quote;
        } catch(e) {
          return reject(e);
        }
        const filteredData = data.map((entry) => ({
          date: entry.Date,
          price: entry.Adj_Close
        }));

        setCache(symbol, filteredData);

        resolve({
          symbol,
          prices: filteredData
        });
      });
    }));

  return global.Promise.all(promises);
}

function generateYQL(symbol) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const date = now.getDate();

  const mm = month.toString().length === 1
    ? `0${month}`
    : month;

  const dd = date.toString().length === 1
    ? `0${date}`
    : date;

  const start = `${year - 1}-${mm}-${dd}`;
  const end = `${year}-${mm}-${dd}`;

  return `http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20
    yahoo.finance.historicaldata%20where%20symbol="${symbol}"%20and%20
    startDate="${start}"%20and%20endDate="${end}"&format=json
    &diagnostics=true
    &env=store://datatables.org/alltableswithkeys&callback=`;
}

function getCache(symbol) {
  const ONE_DAY = 86400000;
  const YESTERDAY = Date.now() - ONE_DAY;

  if(cache[symbol] && cache[symbol].cacheDate > YESTERDAY) {
    return {
      symbol,
      prices: cache[symbol].prices
    };
  }
}

function setCache(symbol, prices) {
  cache[symbol] = {
    prices,
    cacheDate: Date.now()
  };
}
