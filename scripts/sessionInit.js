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
      wordGoalProgress:0
      userNumber: 1,
      connectionStatus: true,
      roundsWon: 0
    },
    user_2:{
      textInput:"",
      wordCount:0,
      wordGoalProgress:0
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
  enableItem($(`#${name}_text`));
  disableItem($("#sessionKeyGenBut"));
  disabledItem($("#sessionKeyAcceptBut"));
  $(`#${name}_text_prompt`).text("You'll type here.");
  $(`#${otherUser}_text_prompt`).text("Your partner's typing will show up here.");
  $(`#${name}_text`).addClass("white");
  enableItem($("#timerOn"));
  enableItem($("#timerOff"));
  enableItem($('#counterOn'));
  enableItem($('counterOff'));
  enableItem($('timer'));
  enableItem($('counterOn'));
  enableItem($('counterOff'));
  enableItem($('counter'));
};

function enableItem(item)){
  item.prop('disabled',false);
}

function disableItem(item){
  item.prop('disabled',true);
}

function displayItem(item){
  item.css('dispaly','initial');
}

function hideItem (item){
  itme.css('display','none');
}

function startButtonDispay () {
  if (timerSet == false && counterSet == false) {
    hideItem($("#startEndMain"));
  }
  if (timerSet == true || counterSet == true)
    displayItem($("#startEndMain"));
}
