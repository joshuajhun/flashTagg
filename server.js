const http     = require('http');
const express  = require('express');
const app      = express()
var server     = http.createServer(app)
const socketIo = require('socket.io');
const io       = socketIo(server);
var port       = process.env.PORT || 3000;


server.listen(port, function(){
  console.log('Listening on port' + port + '.');
});

app.use(express.static('public'));

app.get('/', function(req, res){
  res.sendFil(__dirname + '/public/index.html');
})


module.exports = server;
