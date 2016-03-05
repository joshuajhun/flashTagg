const http     = require('http');
const path     = require('path')
const express  = require('express');
const app      = express()
var server     = http.createServer(app)
const socketIo = require('socket.io');
const io       = socketIo(server);
var port       = process.env.PORT || 3000;
const Votes    = require('./votes')
const votes    = new Votes()
const locus    = require('locus');
const generateId = require('./lib/generateId')
const generateRoutes = require('./lib/generateRoutes')
app.locals.votes = {}
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

server.listen(port, function(){
  console.log('listening on port '+ port + '.');
});

app.set('view engine', 'ejs');


app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(request, response){
  response.render(__dirname + '/views/index');
})

app.get('/admin/:id/:adminId', function(req, res){
  res.render(__dirname + '/views/vote');
})

app.get('/poll/:id', function(req, res){
  var votes = app.locals.votes[req.params.id];
  res.render('vote');
})

app.post('/poll', function(request, results){

  var pollChoices = {}
  var id = generateId()
  var adminId = generateRoutes.adminId()
  var userRoute = generateRoutes.votePath(request)
  var adminRoute = generateRoutes.adminPath(request)
  var requestPayload = request.body
  var title = requestPayload.poll.title
  var choices = requestPayload.pollInformation.choices
  var question = requestPayload.pollInformation.question
  app.locals.votes[id] = votes

  var newPoll = choices.forEach(function(choice){
    return (pollChoices[choice] = 0)
  })


  var votes = new Votes( id,adminId, userRoute, adminRoute,pollChoices, title, question)

  results.render(__dirname + '/views/poll',{
    vote:votes
  })

})

io.on('connection', function (socket) {
  console.log('A user has connected.', io.engine.clientsCount);

  io.sockets.emit('usersConnected', io.engine.clientsCount);

  socket.emit('statusMessage', 'You have connected.');

  socket.on('message', function (channel, message) {
    if (channel === 'voteCast') {
      votes.poll[socket.id] = message;
      socket.emit('voteCount', votes.countVotes(votes.pollChoices));
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
