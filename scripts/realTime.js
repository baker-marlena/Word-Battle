// -----init the real time database - working
function firebaseInit(){
  var config = {
    apiKey: "AIzaSyCoF8-O434tawCarh4eA4ICGnBElYpgYWE",
    databaseURL: "https://q1-project-1ce2b.firebaseio.com/",
    };

  firebase.initializeApp(config);
  return firebase.database();
}


// ---- create global vars
const database = firebaseInit()
let  currentSession;
var timeInterval;

$("#timerOn").click(function(){
  currentSession.update({timer:true})
});

$("#timerOff").click(function(){
  currentSession.update({timer:false})
});

$("#start").click(timerCheck);

// ----- listen for end button and update database -- working
$("#clearTimer").click(()=>{
  currentSession.update({startStatus:false});
});

// ----- watching for the start and stop in the database -- working
function listenToStart (){
  currentSession.child('startStatus').on("value", snapshot=>startRound(snapshot))
}

function startRound (snapshot){
  let currentValue = snapshot.val();
  let initalizedDB = currentSession.child('initilized');
  // ----- looks up if the session is initalized
  initalizedDB.once('value').then(snapshot=>checkInit(snapshot,currentValue))
}

function checkInit (snapshot,currentValue) {
  let initStatus = snapshot.val();
  // ----- if the session is started, start the timer and update the buttons
  if (currentValue == true){
    timerRun();
    displayTimer();
    roundActiveStartEnd();
  }
  // ----- if the session is over, clear the timer and update the buttons
  if (currentValue == false){
    // ----- skip unless the session is initialized
    if (initStatus == true) {
      clearInterval(timeInterval);
      endTimer();
    }
    resetTimer();
    resetStartEnd();
  }
}

function roundActiveStartEnd (){
  $("#start").prop('disabled', true);
  $("#clearTimer").prop('disabled', false);
}

function resetStartEnd () {
  $("#start").prop('disabled', false);
  $("#clearTimer").prop('disabled', true);
}
