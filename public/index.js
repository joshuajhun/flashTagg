var addPollChoiceToPage = $('#add-poll-choice')
  addPollChoiceToPage.click(event, function(){
    $('#choice-index').append('<div class="row">'
          +'<div class="input-field col s12">'
            +'<input name="pollInformation[choices][]" type="text" placeholder="Choice">'
          +'</div>'
      + '</div>')
  })

var hideVoteResults = $('#hide')
  hideVoteResults.click(event,function(){
    
  })
