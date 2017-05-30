// ----- take the session key and start the functions for a new session - working
$("#sessionKeyGenBut").click(function (){
  let sessionKey = $("#sessionKeyGen").val();
  currentSession = database.ref(sessionKey);
  userName = "user_1";
  createNewSession(currentSession);
  startSession(userName);
});

// ----- join session -- working
$("#sessionKeyAcceptBut").click(function(){
  let keyInput = $("#sessionKeyAccept").val();
  currentSession = database.ref(keyInput);
  userName = "user_2";
  startSession(userName);
});

// -----write a new session to the database - working
function createNewSession (value){
  value.set({
    initilized: false,
    startStatus: false,
    totalRounds: 0,
    numberOfUsers: 2,
    timer:{
      status: true,
      timeSet: 0,
      timeLeft: 0,
      timerPause: false
    },
    counter :{
      status: true,
      countSet: 0
    },
    user_1:{
      textInput:"",
      wordCount:0,
      wordGoalProgress:0,
      userNumber: 1,
      connectionStatus: true,
      roundsWon: 0
    },
    user_2:{
      textInput:"",
      wordCount:0,
      wordGoalProgress:0,
      userNumber: 2,
      connectionStatus: true,
      roundsWon: 0
    }
  });
};

// --------- ACTIVATE LISTENERS AND SET VALUES FOR SESSION START

// ----- initialize session - working
function startSession (name){
  setPageContent(name);
  listenForTyping(name);
  listenForOther(name);
  listenToStart();
  checkTimerStatus();
  checkCounterStatus();
  currentSession.update({startStatus:false});
};

// ----- update the page to reflect the user's status
function setPageContent (name){
  if (name == "user_1") {
    otherUser = "user_2";
    $("#sessionGenSuccessMessage").text("Success! Refresh to create or join a different session.");
  }
  if (name == "user_2") {
    otherUser = "user_1";
    $("#sessionJoinSuccessMessage").text("Success! Refresh to create or join a different session.");
  }
  $(`#${name}_text`).prop('disabled',false);
  $("#sessionKeyGenBut").prop('disabled',true);
  $("#sessionKeyAcceptBut").prop('disabled',true);
  $(`#${name}_text_prompt`).text("You'll type here.");
  $(`#${otherUser}_text_prompt`).text("Your partner's typing will show up here.");
  $(`#${name}_text`).addClass("white");
  $("#timerOn").prop('disabled',false);
  $("#timerOff").prop('disabled',false);
  $('#counterOn').prop('disabled',false);
  $('#counterOff').prop('disabled',false);
  $('#timer').prop('disabled',false);
  $('#counter').prop('disabled',false);
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

      // ----- if the session is started, check  timer and counter status, update the buttons
      if (currentValue == true){
        let counterInput = Number($("#counter").val());
        var counterOkay = checkCounter(counterInput);
        if (timerSet == true){
          var timerOkay = timerCheck();
        }
        if (counterSet == true){
          currentSession.child("counter").update({countSet:counterInput})
          getCounterValue();
          displayCounter();
          $("#counter").prop('disabled',true);
        }
        if (counterOkay == true && timerOkay == true){
          startButton.prop('disabled',true);
          endButton.prop('disabled',false);
        }
      }
      // ----- if the session is over, clear the timer and update the buttons
      if (currentValue == false){
        // ----- skip unless the session is initialized
        if (initStatus == true) {
          clearInterval(timeInterval);
          endRound();
        }
        if (timerSet == true){
          currentSession.child.("timer").update({timeLeft:0});
          currentSession.child('timeLeft').off();
          $("#timer").prop('disabled',false);
        }
        if (counterSet == true){
          $("counter").prop('disabled',false);
          currentSession.child("user_1").child('wordGoalProgress').off();
          currentSession.child("user_2").child("wordGoalProgress").off();
        }
        startButton.prop('disabled',false);
        endButton.prop('disabled',true);
      }
    })
  })
}

// --------- Round START AND END

// ----- Listen for start button, check input values, and update database -- working
$("#start").click(function(){
  inputChecks();
});

function inputChecks(){
  let counterOkay = checkCounterStatus();
  let timerOkay = checkTimerStatus();
  if ( counterOkay == true || timerOkay == true){
    currentSession.update({startStatus:true,initilized:true});
    console.log("Checks came back")
  }
}


// ----- listen for end button and update database -- working
$("#clearTimer").click(function(){
  currentSession.update({startStatus:false});
});

function startButtonDispay () {
  if (timerSet == false && counterSet == false) {
    $("#startEndMain").css('display','none');
  }
  if (timerSet == true || counterSet == true){
    $("#startEndMain").css('display','initial');
    console.log("I should be displaying the buttons")
  }
}
