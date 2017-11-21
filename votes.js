class Votes {
 constructor({id, adminId, userRoute, adminRoute, pollChoices, title,
               question, active, privatePoll, time, choices}) {
                 console.log('called!')
  this.id          = id,
  this.adminId     = adminId,
  this.userRoute   = userRoute + id,
  this.adminRoute  = adminRoute + '/' + id + '/' + adminId,
  this.choices     = choices
  this.pollChoices = this.generatePoll(this.choices),
  this.title       = title,
  this.question    = question,
  this.active      = true,
  this.privatePoll = privatePoll || false
  this.time        = time
  }

  generatePoll(choices) {
    return choices.reduce((choiceObj, choice) => (
      Object.assign({ [choice.trim()]: 0 }, choiceObj)
    ),{})
  }
}

module.exports = Votes
