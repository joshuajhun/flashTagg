var locus = require('locus')
function Votes(id, adminId, userRoute,adminRoute,pollChoices, title, question){
  this.id          = id,
  this.adminId     = adminId,
  this.userRoute   = userRoute + id,
  this.adminRoute  = adminRoute + '/' + id + '/' + adminId,
  this.pollChoices = pollChoices,
  this.title       = title,
  this.question    = question


function countVote(pollChoices){

  eval(locus)
//   var voteCount = {
//       A: 0,
//       B: 0,
//       C: 0,
//       D: 0
//   };
//   for ( vote in poll) {
//     voteCount[poll[vote]]++
//   }
//     return voteCount;
// };
//
// Votes.prototype.createPoll = function(){
// }
}
}

module.exports = Votes;
