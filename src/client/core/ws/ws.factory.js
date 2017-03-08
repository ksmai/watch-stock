(function() {
  'use strict';
  angular.
    module('core.ws').
    factory('ws', wsFactory);

  wsFactory.$inject = ['$location', '$window', '$timeout'];
  function wsFactory($location, $window, $timeout) {
    const host = $location.host();
    const port = $location.port();
    const protocol = $location.protocol() === 'https'
      ? 'wss'
      : 'ws';

    const ws = { send, setCallback };

    const initialDelay = 100;
    const multiplier = 2;
    const maxDelay = 10000;
    let delay = initialDelay;
    let conn;
    let onMessage;
    connect();

    return ws;
    //////////////////////////////////////////////////

    function connect() {
      $timeout(function() {
        conn = new $window.WebSocket(`${protocol}://${host}:${port}`);
        conn.onopen = onOpen;
        conn.onmessage = onMessage;
        conn.onclose = connect;
      }, delay);

      if(delay < maxDelay) delay *= multiplier;
    }

    function onOpen() {
      delay = initialDelay;
      conn.send(JSON.stringify({
        action: 'list'
      }));
    }

    function send(obj) {
      if(!conn || conn.readyState !== conn.OPEN) {
        throw new Error('Connection is not ready. Please try again later');
      }

      conn.send(JSON.stringify(obj));
    }

    function setCallback(cb) {
      onMessage = cb;
      if(conn) conn.onmessage = cb;
    }
  }
}());
