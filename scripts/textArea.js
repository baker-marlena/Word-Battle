// --------- USER TYPING

// ----- capture typing and store to db -- working
function listenForTyping (name){
$(`#${name}_text`).keyup(function() {
  if (sessionActive == false){
    let update = {
      [userName]: {
        textInput: this.value,
        wordCount: wordCountSum(this.value);
        }
      };
  }
  else {
    let update = {
      [userName]: {
        textInput: this.value
        }
      };
  }
$(`#${userName}_words`).text("Word Count: " +  wordCountValue);
currentSession.update(update);
});
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

// ----- watching for the start and stop in the database -- working
function listenToStart (){
  currentSession.child('startStatus').on("value", function(snapshot){
    let currentValue = snapshot.val();
    let startButton = $("#start")
    let endButton = $("#clearTimer")
    // ----- looks up if the session is initalized
    currentSession.child('initilized').once('value').then(function(snapshot){
      let initStatus = snapshot.val();
      // ----- if the session is started, start the timer and update the buttons
      if (currentValue == true){
        currentSession.update({timeLeft:0});
        displayTimer();
        startButton.prop('disabled', true);
        endButton.prop('disabled', false);
        $("#timer").prop('disabled', true);

      }
      // ----- if the session is over, clear the timer and update the buttons
      if (currentValue == false){
        // ----- skip unless the session is initialized
        if (initStatus == true) {
          clearInterval(timeInterval);
          endTimer();
        }
        currentSession.update({timeLeft:0});
        currentSession.child('timeLeft').off();
        startButton.prop('disabled', false);
        endButton.prop('disabled', true);
        $("#timer").prop('disabled', false);
      }
    })
  })
}
