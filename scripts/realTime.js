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

// ----- create a new session - working
$("#sessionKeyGenBut").click(function (){
  let sessionKey = getSessionKey();
  let sessionRef = database.ref(sessionKey);
  currentSession = sessionRef;
  userName = "user_1";
  createNewSession(sessionRef);
  startSession(userName);
  $("#sessionGenSuccessMessage").text("Success! Refresh to create or join a different session.");
});

function getSessionKey (){
  // ----- retrive session key - working
  let newKey = $("#sessionKeyGen").val();
  // ----- check if session exists in db - not working
  // let dataBaseTest = database.equalTo(newKey);
  // console.log(dataBaseTest);
  // if (dataBaseTest !== undefined) {
  //   alert ("That game already exists!");
  // }
//  else{
    return newKey;
//  }
}

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
}

// ----- Join session -- working
$("#sessionKeyAcceptBut").click(function(){
  let keyInput = $("#sessionKeyAccept").val();
  currentSession = database.ref(keyInput);
  userName = "user_2";
  startSession(userName);
  $("#sessionJoinSuccessMessage").text("Success! Refresh to create or join a different session.");
})

// ----- initialize session - working
function startSession (name){
  setDisabledContent(name);
  listenForTyping(name);
  listenForOther(name);
  listenToStart();
  currentSession.update({startStatus:false});

}

// ----- Listen for start button -- working
$("#start").click(function(){
  let timerInput = $("#timer").val();
  // ----- Check that timer input is valid
  if (timerInput < 0 || typeof timerInput !== "number" || (timerInput % 1 !== 0)){
    alert ("Please enter a positive integer for the timer.");
  }
  else {
    currentSession.update({startStatus:true,timeSet:timerInput});
    currentSession.update({initilized:true});
    timerRun();
  }
});

// ----- listen for end button -- working
$("#clearTimer").click(function(){
  currentSession.update({startStatus:false});
})

// ----- capture typing -- working
function listenForTyping (name){
  console.log("Listing to you!")
$(`#${userName}_text`).keyup(function() {
  let update = {
    [userName]: {
      textInput: this.value,
      wordCount: this.value.split(" ").length
    }
  };
  $(`#${userName}_words`).text("Word Count: " +  this.value.split(" ").length);
  currentSession.update(update);
})
}

// ----- listen for other typing -- not working
function listenForOther (name){
  console.log("Listing to partner!")
  currentSession.child(otherUser).on("value", function(snapshot){
    const data = snapshot.val();
    console.log (data.textInput);
    $(`#${otherUser}_text`).val(data.textInput);
    $(`#${otherUser}_words`).text("Word Count: " + data.wordCount);
  })
}

// ----- Set
// function listenForCount (name){
//   currentSession.child(name).chile(wordCount).on("value", function(snapshot){
//     $(`#${userName}_words`).textContent = "Word Count: " + this.value;
//   })
// }

// ----- make other user's content uneditable -- working
function setDisabledContent (name){
  if (name == "user_1") {
    otherUser = "user_2";
  }
  if (name == "user_2") {
    otherUser = "user_1";
  }
  $(`#${otherUser}_text`).prop('disabled', true);
  $("#sessionKeyGenBut").prop('disabled', true);
  $("#sessionKeyAcceptBut").prop('disabled', true);
  };

  // ----- Database Timer -- working
  function timerRun () {
    let secs;
    var timerAmmount = currentSession.child('timeSet').once('value').then(function (snapshot){
      secs = snapshot.val()*60;
    });
    console.log(secs);
    // actual timer intervals
    timeInterval = setInterval(function(){
      secs--;
      console.log("counting:"+secs);
      currentSession.update({timeLeft:`${calculateMintues(secs)}:${calculateSeconds(secs)}`});
      // timer runs out
      if(secs == 0){
        endTimer();
        }
      }, 1000);
  };

  // ----- listen to database for timer updates and update user's page -- working
  function displayTimer () {
    currentSession.child('timeLeft').on("value", function(snapshot){
      $("#timer").val(snapshot.val());
    })
  }

  // ----- end the timer and update start value -- working
  function endTimer (){
    console.log("Checking timer end:" + timeInterval);
    currentSession.update({startStatus:false});
    // ----- set timer field to last entered value
    let timerValueSet = currentSession.child('timeSet').once('value').then(function(snapshot){
          $("#timer").val(snapshot.val());
    })
    alert ("Time's up!");
  }

  // ----- watching for the start and stop -- working
  function listenToStart (){
    console.log("Listening for db changes on 'start'");
    currentSession.child('startStatus').on("value", function(snapshot){
      let currentValue = snapshot.val();
      console.log(currentValue);
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
        }
      })
    })
  }

  // calculate remaining minutes -- working
  function calculateMintues(value){
    return Math.floor(value/60);
  }

  //caluclate remaining seconds -- working
  function calculateSeconds(value){
    let displaySeconds = value-(Math.floor(value/60)*60);
    if (displaySeconds < 10) {
      return `0${displaySeconds}`;
    }
    return displaySeconds;
  }
