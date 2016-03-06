var locus = require('locus')
function Votes(id, adminId, userRoute,adminRoute,pollChoices, title, question, choices){
  this.id          = id,
  this.adminId     = adminId,
  this.userRoute   = userRoute + id,
  this.adminRoute  = adminRoute + '/' + id + '/' + adminId,
  this.pollChoices = pollChoices,
  this.title       = title,
  this.question    = question
  this.choices     = choices

}

Votes.prototype.countVotes = function(pollChoices){

  var voteCount = this.pollChoices
  for ( vote in poll) {
    voteCount[poll[vote]]++
  }
    return voteCount;
};


module.exports = Votes;
