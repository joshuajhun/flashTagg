function Votes(){
  this.poll = {}
}

Votes.prototype.countVotes = function(poll){
  var voteCount = {
      A: 0,
      B: 0,
      C: 0,
      D: 0
  };
  for ( vote in poll) {
    voteCount[poll[vote]]++
  }
    return voteCount;
};

Votes.prototype.createPoll = function(){
}



module.exports = Votes;
