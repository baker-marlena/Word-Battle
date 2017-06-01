// -----write a new session to the database - working
function createNewSession (value){
  value.set({
    user_1:{
      textInput:"",
      wordCount:0,
    },
    user_2:{
      textInput:"",
      wordCount:0,
    },
    timer: true,
    timeSet: 0,
    timeLeft: 0,
    startStatus: false,
    initilized: false
  });
};

// ----- take the session key and start the functions for a new session - working
$("#sessionKeyGenBut").click(()=>{
  let sessionKey = $("#sessionKeyGen").val();
  currentSession = database.ref(sessionKey);
  createNewSession(currentSession);
  startSession('user_1','user_2');
});

// ----- join session -- working
$("#sessionKeyAcceptBut").click(()=>{
  let keyInput = $("#sessionKeyAccept").val();
  currentSession = database.ref(keyInput);
  startSession('user_2','user_1');
});

// ----- initialize session - working
function startSession (user,partner){
  setPageContent(user,partner);
  listenForTyping(user);
  listenForOther(partner);
  listenToStart();
  checkTimerStatus();
  currentSession.update({startStatus:false});
};

// ----- update the page to reflect the user's status
function setPageContent (user,partner){
  if (user == "user_1") {
    $("#sessionGenSuccessMessage").text("Success! Refresh to create or join a different session.");
  }
  if (user == "user_2") {
    $("#sessionJoinSuccessMessage").text("Success! Refresh to create or join a different session.");
  }
  $(`#${partner}_text`).prop('disabled', true);
  disableSessionStart();
  $(`#${user}_text_prompt`).text("You'll type here.");
  $(`#${partner}_text_prompt`).text("Your partner will type here.");
};

function disableSessionStart (){
  $("#sessionKeyGenBut").prop('disabled', true);
  $("#sessionKeyAcceptBut").prop('disabled', true);
}
