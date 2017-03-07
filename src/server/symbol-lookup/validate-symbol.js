'use strict';
const request = require('request');

module.exports = isValidSymbol;
//////////////////////////////////////////////////

function isValidSymbol(symbol) {
  const url = `http://d.yimg.com/aq/autoc?query=${symbol}&region=US&lang=en-US`;

  return new global.Promise(function(resolve, reject) {
    request(url, function(error, response, body) {
      if(error) return reject(error);

      let parsedResult;
      try {
        parsedResult = JSON.parse(body).ResultSet.Result;
      } catch(e) {
        parsedResult = [];
      }

      const isValid = parsedResult.some(
        (res) => res.symbol === symbol && res.type.match(/^s$/i));

      if(isValid) {
        const match = parsedResult.filter(
          (res) => res.symbol === symbol && res.type.match(/^s$/i))[0];

        resolve({
          valid: true,
          symbol: match.symbol,
          name: match.name,
          exchange: match.exchDisp
        });
      } else {
        const alternatives = parsedResult.
          filter((res) => res.type.match(/^s$/i)).
          map((res) => res.symbol);

        reject({
          valid: false,
          alternatives
        });
      }
    });
  });
}
