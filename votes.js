var locus = require('locus')
function Votes(id, adminId, userRoute,adminRoute,pollChoices, title, question, choices, active, privatePoll){
  this.id          = id,
  this.adminId     = adminId,
  this.userRoute   = userRoute + id,
  this.adminRoute  = adminRoute + '/' + id + '/' + adminId,
  this.pollChoices = pollChoices,
  this.title       = title,
  this.question    = question,
  this.choices     = choices,
  this.active      = active,
  this.privatePoll = privatePoll || false 

}


module.exports = Votes;
