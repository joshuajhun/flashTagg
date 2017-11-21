require('locus')
var socket = io();

var connectionCount = document.getElementById('connection-count');

socket.on('usersConnected', function (count) {

  connectionCount.innerText = 'Connected Users: ' + count;
});

var statusMessage = document.getElementById('status-message');

socket.on('statusMessage', function (message) {
  statusMessage.innerText = message;
});


var buttons = document.querySelectorAll('#choices button');
for (var i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('click', function () {
  var id = window.location.pathname.split(/poll/)[1].slice(1,21)
  socket.send('voteCast', this.innerText, id);
  });
}


var votesOnPage = $('#votes-count')

socket.on('voteCount', function (votes) {
  debugger;
  var currentVote = 'Vote count';
  for (var vote in votes) {
    currentVote = currentVote + ' ' + vote + ': ' + votes[vote] + ' ';
   }
   votesOnPage.text(currentVote)
}); // grab object with Object.keys(object) // reurn an array of object
// itterate of that and reference the object.

var currentVoteItem = $('#vote-item')

socket.on('currentVoteCount',function(votes){
  $('#greeting').text('thank you for voting')
  $('#choices').children().remove()
  currentVoteItem.text(votes)
})

debugger;
$('#close-poll').on('click', function(){
  alert('why tho')
  // var pollId = window.location.pathname.split('/')[2];
  // socket.send('endVotingPoll', pollId)
})
