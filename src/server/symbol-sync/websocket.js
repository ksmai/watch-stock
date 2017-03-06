'use strict';
const symbols   = require('./symbol-store');
const WebSocket = require('ws');

module.exports = configWebSocket;
//////////////////////////////////////////////////

function configWebSocket(server) {
  const wss = new WebSocket.Server({ server });
  wss.on('connection', setupSocketConnection(wss));

  return wss;
}

function setupSocketConnection(wss) {
  return function(ws) {
    sendDataTo(ws);

    ws.on('message', function(message) {
      let req;
      try {
        req = JSON.parse(message);
      } catch(err) {
        req = {};
      }

      switch(req.action) {
        case 'add':
          symbols.
            add(req.symbol).
            then(function() {
              broadcast(wss);
            });
          break;
        
        case 'remove':
          symbols.
            remove(req.symbol).
            then(function() {
              broadcast(wss);
            });
          break;

        case 'list':
          sendDataTo(ws);
          break;
      }
    });
  };
}

function broadcast(wss) {
  wss.clients.forEach(function(client) {
    if(client.readyState === WebSocket.OPEN) {
      sendDataTo(client);
    }
  });
}

function sendDataTo(client) {
  client.send(JSON.stringify(symbols.list()));
}
