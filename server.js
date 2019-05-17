var compression = require('compression')
var express = require('express');
var server = express();
server.use(compression({ threshold: 0 }));
server.use(express.static(__dirname));

server.listen(4200);

console.log('server is running 4200');