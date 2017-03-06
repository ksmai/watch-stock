'use strict';
const fs   = require('fs');
const path = require('path');

let symbols;
try {
  symbols = require('./symbols.json');
} catch(err) {
  symbols = [];
}
const symbolSet = new Set(symbols);
const SAVE_PERIOD = 1000;
let saveTimer = null;

module.exports = { add, remove, list };
//////////////////////////////////////////////////

function add(symbol) {
  return new global.Promise(function(resolve, reject) {
    symbolSet.add(symbol.toUpperCase());
    scheduleSave(SAVE_PERIOD);
    resolve();
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
  console.log('saved');
}
