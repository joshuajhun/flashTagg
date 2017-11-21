require('locus')
const http     = require('http');
const path     = require('path')
const express  = require('express');
const app      = express()
var server     = http.createServer(app)
const socketIo = require('socket.io');
const io       = socketIo(server);
var port       = process.env.PORT || 3000;
const Votes    = require('./votes')
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

app.post('/poll', (req, res) => {
  const { poll, pollInformation } = req.body
  const { generateAdminId, generateVotePath, generateAdminPath } = generateRoutes
  const { choices, question, privatePoll, time } = pollInformation
  const { title }      = poll
  const id             = generateId()
  const adminId        = generateAdminId()
  const userRoute      = generateVotePath(req)
  const adminRoute     = generateAdminPath(req)

  const votes = new Votes({ id, adminId, userRoute, adminRoute , title, question,
                            choices, privatePoll, time })

  app.locals.votes = Object.assign({[id]: votes}, app.locals.votes)
  pollExpire(votes)
  res.render(__dirname + '/views/poll', { vote: votes })
})

app.get('/admin/:id/:adminId', function(req, res){
  var votes = app.locals.votes[req.params.id];
  res.render(__dirname + '/views/admin', { votes: votes });
})

app.get('/poll/:id', function(req, res){
  const id = req.params.id
  var votes = app.locals.votes[id];
  res.render(__dirname + '/views/vote', { votes: votes })
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
    eval(locus)
    if (channel === 'endVotingPoll'){
      app.locals.votes[pollId].active = false
    }
  });


   socket.on('disconnect', function () {
     console.log('A user has disconnected.', io.engine.clientsCount);
     delete userVotes[socket.id];
     io.sockets.emit('userConnection', io.engine.clientsCount);
   });
});

 function countVotes(userVotes, id) {
 var voteCount = app.locals.votes[id].pollChoices; /// needs a resuce make sure to exit out of the process
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
