var config = require('./appconfig.js')

var elasticsearch = require('elasticsearch');
var esClient = new elasticsearch.Client({
  host: config.esHost,
  log: 'trace'
});

var bittrex = require('node-bittrex-api');
var jsonic = require('jsonic');
var io = require('socket.io')();
var port = 8000;

bittrex.websockets.client(function(websocketsclient){
  io.on('connection', (socketClient) => {
    websocketsclient.serviceHandlers.messageReceived = function(data) {
      var parsedData = jsonic(data.utf8Data);
      socketClient.emit('receiveBittrex', parsedData);
      esClient.index({
              index: "crypy",
              type: "document",
              body: parsedData
      });
    };

    websocketsclient.serviceHandlers.onerror = function (error) {
      console.log('some error occured', error);
    };
  });
  
  io.listen(port);
  console.log('Listening on port ', port);
});
