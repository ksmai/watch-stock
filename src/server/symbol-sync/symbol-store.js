'use strict';
const fs             = require('fs');
const path           = require('path');
const validateSymbol = require('../symbol-lookup/validate-symbol');

let symbols;
try {
  // eslint-disable-next-line global-require
  symbols = require('./symbols.json');
} catch(err) {
  symbols = [];
}
const symbolSet = new global.Set(symbols);
const SAVE_PERIOD = 5000;
let saveTimer = null;

module.exports = { add, remove, list };
//////////////////////////////////////////////////

function add(symbol) {
  const SYMBOL = symbol.toUpperCase().trim();

  return validateSymbol(SYMBOL).
    then(function(res) {
      symbolSet.add(SYMBOL);
      scheduleSave(SAVE_PERIOD);

      return res;
    });
}

function remove(symbol) {
  return new global.Promise(function(resolve, reject) {
    symbolSet.delete(symbol.toUpperCase());
    scheduleSave(SAVE_PERIOD);
    resolve();
  });
}

function list() {
  return [...symbolSet];
}

function persistData() {
  const filename = path.join(__dirname, 'symbols.json');
  const data = JSON.stringify([...symbolSet]);
  fs.writeFile(filename, data, rethrowError);
}

function scheduleSave(delay) {
  clearTimeout(saveTimer);

  saveTimer = setTimeout(function() {
    persistData();
    saveTimer = null;
  }, delay);

  return saveTimer;
}

function rethrowError(err) {
  if(err) throw err;
}
