// -----init the real time database - working
var config = {
  apiKey: "AIzaSyCoF8-O434tawCarh4eA4ICGnBElYpgYWE",
  databaseURL: "https://q1-project-1ce2b.firebaseio.com/",
  };

firebase.initializeApp(config);

// ---- create global vars
const database = firebase.database();
var currentSession;
var userName;
var otherUser;
var timeInterval;

// --------- CREATE SESSION

// ----- take the session key and start the functions for a new session - working
$("#sessionKeyGenBut").click(function (){
  let sessionKey = $("#sessionKeyGen").val();
  currentSession = database.ref(sessionKey);
  userName = "user_1";
  createNewSession(currentSession);
  startSession(userName);
});

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

// --------- JOIN A SESSION

// ----- join session -- working
$("#sessionKeyAcceptBut").click(function(){
  let keyInput = $("#sessionKeyAccept").val();
  currentSession = database.ref(keyInput);
  userName = "user_2";
  startSession(userName);
});

// --------- ACTIVATE LISTENERS AND SET VALUES FOR SESSION START

// ----- initialize session - working
function startSession (name){
  setPageContent(name);
  listenForTyping(name);
  listenForOther(name);
  listenToStart();
  checkTimerStatus();
  currentSession.update({startStatus:false});
};

// ----- update the page to reflect the user's status
function setPageContent (name){
  if (name == "user_1") {
    otherUser = "user_2";
    successMessage("#sessionGenSuccessMessage");
  }
  if (name == "user_2") {
    otherUser = "user_1";
    successMessage("#sessionJoinSuccessMessage");
  }
  enable(`#${otherUser}_text`);
  disable('#sessionKeyGenBut');
  disable('#sessionKeyAcceptBut');
  $(`#${name}_text_prompt`).text("You'll type here.");
  $(`#${otherUser}_text_prompt`).text("Your partner will type here.");
};



  // --------- USER TYPING

  // ----- capture typing and store to db -- working
function listenForTyping (name){
  $(`#${name}_text`).keyup(function() {
  let wordCountValue = this.value.trim().split(/\s+/).length
  let update = {
    [userName]: {
      textInput: this.value,
      wordCount: wordCountValue
      }
    };
  $(`#${userName}_words`).text("Word Count: " +  wordCountValue);
  currentSession.update(update);
  });
};

  // ----- listen for other typing and update from -- working
function listenForOther (name){
  currentSession.child(otherUser).on("value", function(snapshot){
    const data = snapshot.val();
    $(`#${otherUser}_text`).text(data.textInput);
    $(`#${otherUser}_words`).text("Word Count: " + data.wordCount);
  });
};

// --------- HIDING AND SHOWING TIMER

// ----- check if timer is active and save to db -- working
$("#timerOn").click(function(){
  currentSession.update({timer:true})
});

$("#timerOff").click(function(){
  currentSession.update({timer:false})
});

// ----- listen for changes to timer status in db and hide timer on page - working
function checkTimerStatus (){
  currentSession.child("timer").on("value", function(snapshot){
    let currentStatus = snapshot.val();
    if (currentStatus == false){
      $("#timerMain").css("display","none");
      $("#timerOff").prop("checked",true);
    };
    if (currentStatus == true) {
      $("#timerMain").css("display","initial");
      $("#timerOn").prop("checked",true);
    };
  });
};

// --------- TIMER START AND END

// ----- Listen for start button, check input value, and update database -- working
$("#start").click(function(){
  let timerInput = Number($("#timer").val());
  // ----- Check that timer input is valid
  if (timerInput <= 0 || (timerInput % 1) !== 0){
    alert ("Please enter a positive, whole number of minutes.");
  }
  if(timerInput > 120){
    alert ("Two hours is the limit. Don't forget to take breaks!");
  }
  else {
    currentSession.update({startStatus:true,timeSet:timerInput});
    currentSession.update({initilized:true});
    timerRun();
  };
});

// ----- listen for end button and update database -- working
$("#clearTimer").click(function(){
  currentSession.update({startStatus:false});
});

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
        disable(startButton);
        enable(endButton);
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
        enable(startButton);
        disable(endButton);
      }
    })
  })
}

// ----- end the timer and update start value -- working
function endTimer (){
  // ----- set timer field to last entered value
  let timerValueSet = currentSession.child('timeSet').once('value').then(function(snapshot){
    $("#timer").val(snapshot.val());
  })
  Materialize.toast("Time's up!", 6000);
}

// --------- TIMER

  // ----- Timer Iterates and writes to db, when 0, ends -- working
function timerRun () {
  let secs;
  var timerAmmount = currentSession.child('timeSet').once('value').then(function (snapshot){
    secs = snapshot.val()*60;
  });
  // actual timer intervals
  timeInterval = setInterval(function(){
    currentSession.update({timeLeft:`${calculateMintues(secs)}:${calculateSeconds(secs)}`});
    secs--;
    // timer runs out
    if(secs == 0){
      currentSession.update({startStatus:false});
    };
  }, 1000);
};

// ----- listen to database for timer updates and update user's page -- working
function displayTimer () {
  currentSession.child('timeLeft').on("value", function(snapshot){
    $("#timer").val(snapshot.val());
  });
};

// calculate remaining minutes -- working
function calculateMintues(value){
  return Math.floor(value/60);
};

//caluclate remaining seconds -- working
function calculateSeconds(value){
  let displaySeconds = value-(Math.floor(value/60)*60);
  if (displaySeconds < 10) {
    return `0${displaySeconds}`;
  };
  return displaySeconds;
};


// DRY refactoring
function disable(elementName){
  $(elementName).prop('disabled', true);
}

function enable(elementName){
  $(elementName).prop('', false);
}

function successMessage(elementName){
  $(elementName).text("Success! Refresh to create or join a different session.");
}
