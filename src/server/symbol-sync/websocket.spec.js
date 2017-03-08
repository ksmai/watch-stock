'use strict';
const configWebSocket = require('./websocket');
const express = require('express');
const dataStore = require('./symbol-store');
const WebSocket = require('ws');

let URL = 'ws://localhost:';

describe('configWebSocket', function() {
  let server, client, wss;
  const testData = [];

  beforeAll(function(done) {
    server = express().listen(0, function() {
      URL += server.address().port;
      wss = configWebSocket(server);
      client = new WebSocket(URL);
      client.on('message', done);
    });
  });

  afterAll(function(done) {
    wss.clients.forEach(client => client.close());
    server.close(done);
  });

  beforeEach(function() {
    spyOn(dataStore, 'list').and.returnValue(testData);
    spyOn(dataStore, 'add').and.returnValue(global.Promise.resolve());
    spyOn(dataStore, 'remove').and.returnValue(global.Promise.resolve());
  });

  it('responds to "add" action', function(done) {
    const data = JSON.stringify({
      action: 'add',
      symbol: 'GOOG'
    });

    client.once('message', function(message) {
      expect(dataStore.list).toHaveBeenCalledTimes(1);
      expect(dataStore.add).toHaveBeenCalledTimes(1);

      const parsedMessage = JSON.parse(message);
      expect(parsedMessage).toEqual(testData);
      done();
    });

    testData.push('GOOG');
    client.send(data);
  });

  it('responds to a "remove" action', function(done) {
    const data = JSON.stringify({
      action: 'remove',
      symbol: 'GOOG'
    });

    client.once('message', function(message) {
      expect(dataStore.list).toHaveBeenCalledTimes(1);
      expect(dataStore.remove).toHaveBeenCalledTimes(1);

      const parsedMessage = JSON.parse(message);
      expect(parsedMessage).toEqual(testData);
      done();
    });

    testData.pop();
    client.send(data);
  });

  it('responds to a "list" action', function(done) {
    const data = JSON.stringify({ action: 'list' });
    client.once('message', function(message) {
      expect(dataStore.list).toHaveBeenCalledTimes(1);
      expect(JSON.parse(message)).toEqual(testData);
      done();
    });
    client.send(data);
  });

  it('does not respond to any other action', function(done) {
    const data = JSON.stringify({ action: 'foobar' });
    client.once('message', done.fail);
    client.send(data);

    const timeout = 2000;
    setTimeout(done, timeout);
  });
});
