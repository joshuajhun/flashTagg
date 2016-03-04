const http     = require('http');
const express  = require('express');
const app      = express()
var server     = http.createServer(app)
const socketIo = require('socket.io');
const io       = socketIo(server);
var port       = process.env.PORT || 3000;
const Votes      = require('./votes')
const votes      = new Votes()

server.listen(port, function(){
  console.log('listening on port '+ port + '.');
});


app.use(express.static('public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
})

app.get('/admin', function(req, res){
  res.sendFile(__dirname + '/public/admin.html');
})

app.get('/votes', function(req, res){
  res.sendFile(__dirname + '/public/vote.html');
})





io.on('connection', function (socket) {
  console.log('A user has connected.', io.engine.clientsCount);

  io.sockets.emit('usersConnected', io.engine.clientsCount);

  socket.emit('statusMessage', 'You have connected.');

  socket.on('message', function (channel, message) {
    if (channel === 'voteCast') {
      votes.poll[socket.id] = message;
      socket.emit('voteCount', votes.countVotes(votes.poll));
      socket.emit('currentVoteCount','You voted for: ' + message)
    }
  });

  socket.on('disconnect', function () {
    console.log('A user has disconnected.', io.engine.clientsCount);
    delete votes.poll[socket.id];
    socket.emit('voteCount',votes.countVotes(votes.poll));
    io.sockets.emit('userConnection', io.engine.clientsCount);
  });
});

// function countVotes(votes) {
// var voteCount = {
//     A: 0,
//     B: 0,
//     C: 0,
//     D: 0
// };
//   for (var vote in votes) {
//     voteCount[votes[vote]]++
//   }
//   return voteCount;
// }


module.exports = server;
