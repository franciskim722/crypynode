var config = require('./appconfig.js')

var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: config.esHost,
  log: 'trace'
});

var bittrex = require('node.bittrex.api');
var jsonic = require('jsonic');

bittrex.options({
  'apikey' : config.bittrexKey,
  'apisecret' : config.bittrexSecret,
  'cleartext' : true

});

var websocketsclient = bittrex.websockets.client();

websocketsclient.serviceHandlers.connected = function (conn) {
  console.log("Connected to Bittrex");
}


websocketsclient.serviceHandlers.reconnecting = function (message) {
  return true;
}

websocketsclient.serviceHandlers.messageReceived = function (message) {
  var message = jsonic(message.utf8Data);

  client.index({
          index: config.esIndex,
          type: "document",
          body: message
      });
}
