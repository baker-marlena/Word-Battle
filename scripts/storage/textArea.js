// --------- USER TYPING

// ----- capture typing and store to db -- working
function listenForTyping (name){
$(`#${name}_text`).keyup(function() {
  currentSession.child(userName).update({textInput:this.value});
  if (sessionActive == false || counterSet == false){
    currentSession.child(userName).update({wordCount:wordCountSum(this.value)})
    $(`#${userName}_words`).text("Word Count: " +  wordCountSum(this.value));
  }
  else {
    currentSession.child(userName).update({wordGoalProgress: wordCountSum(this.value) - standingWordCount})
      };
  })
};

function wordCountSum (string){
  return string.trim().split(/\s+/).length
}

// ----- listen for other typing and update from -- working
function listenForOther (name){
currentSession.child(otherUser).on("value", function(snapshot){
  const data = snapshot.val();
  $(`#${otherUser}_text`).text(data.textInput);
  $(`#${otherUser}_words`).text("Word Count: " + data.wordCount);
});
};
