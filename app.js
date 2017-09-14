var config = require('./appconfig.js')
//Elastic Search
var elasticsearch = require('elasticsearch');
var esClient = new elasticsearch.Client({
  host: config.esHost,
  log: 'trace'
});

//Bittrex Dependencies
var bittrex = require('node-bittrex-api');
var jsonic = require('jsonic');

//Socket IO
var io = require('socket.io')();
var port = 8000;


//Express Dependecies
var express = require('express');
var app = express();

// Add headers
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.get('/', function (req, res) {
  bittrex.getmarketsummaries( function( data, err ) {
    if (err) {
      return console.error(err);
    }
    res.send(data);
  });
})

app.listen(4000, function () {
  console.log('Example app listening on port 4000!')
})


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
