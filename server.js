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
  var votes = app.locals.votes[req.params.id];
  res.render(__dirname + '/views/admin', {votes: votes});
})

app.get('/poll/:id', function(req, res){
  var votes = app.locals.votes[req.params.id];
  var id = req.url.split(/poll/)[1].slice(1,20)
  var voteChoices = app.locals.votes[req.params.id].choices
  res.render(__dirname + '/views/vote', {votes:votes} )
})

app.post('/poll', function(request, results){
  var pollChoices    = {}
  var id             = generateId()
  var adminId        = generateRoutes.adminId()
  var userRoute      = generateRoutes.votePath(request)
  var adminRoute     = generateRoutes.adminPath(request)
  var requestPayload = request.body
  var title          = requestPayload.poll.title
  var choices        = requestPayload.pollInformation.choices
  var question       = requestPayload.pollInformation.question
  var active         = true
  var privatePoll    = request.body.pollInformation.privatePoll
  var time           = request.body.pollInformation.time


  var votes = new Votes( id, adminId, userRoute, adminRoute,pollChoices, title, question, choices, active, privatePoll, time)

  app.locals.votes[id] = votes

  pollExpire(votes)

  var newPoll = choices.forEach(function(choice){
    return (pollChoices[choice.trim()] = 0)
  })

  results.render(__dirname + '/views/poll',{
    vote:votes
  })

})

io.on('connection', function (socket) {
  var userVotes = {};
  socket.on('message', function (channel, message, id) {
    if (channel === 'voteCast') {
      userVotes[socket.id] = message
      io.sockets.emit('voteCount', countVotes(userVotes, id));
      socket.emit('currentVoteCount','You voted for: ' + message)
    }
  })

  socket.on('message', function (channel, pollId) {
    if (channel === 'endVotingPoll'){
      app.locals.votes[pollId].active = false
    }
  });


   socket.on('disconnect', function () {
     console.log('A user has disconnected.', io.engine.clientsCount);
     delete userVotes[socket.id];
     socket.emit('voteCount',countVotes(userVotes,id));
     io.sockets.emit('userConnection', io.engine.clientsCount);
   });
});

 function countVotes(userVotes, id) {
 var voteCount = app.locals.votes[id].pollChoices;
   for (var pick in userVotes) {
     voteCount[userVotes[pick]]++
   }
   return voteCount;
   }




function pollExpire(votes) {
  if (votes.time) {
    setTimeout(function () {
      votes.active = false
    }, votes.time * 60000);
  }
}

if (!module.parent) {
  app.listen(app.get('port'), () => {
    console.log(`${app.locals.title} is running on ${port}.`);
  });
}

module.exports = server;
