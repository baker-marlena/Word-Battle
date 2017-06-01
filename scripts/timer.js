
// ----- listen for changes to timer status in db and hide timer on page - working
function checkTimerStatus (){
  let timerDB = currentSession.child("timer");
  timerDB.on("value", function(snapshot){
    let currentTimerStatus = snapshot.val();
    if (currentTimerStatus == false){
      disableTimer();
    };
    if (currentTimerStatus == true) {
      enableTimer();
    };
  });
};

function disableTimer (){
  $("#timerMain").css("display","none");
  $("#timerOff").prop("checked",true);
}

function enableTimer (){
  $("#timerMain").css("display","initial");
  $("#timerOn").prop("checked",true);
}

// ----- Listen for start button, check input value, and update database -- working
function timerCheck (){
  let timerInput = Number($("#timer").val());
  switch (true){
    case timerInput <= 0:
      alert ("Please enter a positive, whole number of minutes.");
      break;
    case timerInput % 1 !== 0:
      alert ("Please enter a positive, whole number of minutes.");
      break;
    case (typeof timerInput !== "number"):
      alert ("Please enter a positive, whole number of minutes.");
      break;
    case timerInput > 120:
      alert ("Two hours is the limit. Don't forget to take breaks!");
      break;
    default:
      currentSession.update({startStatus:true,timeSet:timerInput,initilized:true});
  }
}

function resetTimer () {
  let timeLeftDB = currentSession.child('timeLeft');
  currentSession.update({timeLeft:0});
  timeLeftDB.off();
}

// ----- end the timer and update start value -- working
function endTimer (){
  // ----- set timer field to last entered value
  let timeSetDB = currentSession.child('timeSet');
  let timerValueSet = timeSetDB.once('value').then((snapshot)=>{
    $("#timer").val(snapshot.val());
  })
  Materialize.toast("Time's up!", 6000);
}

// ----- Timer Iterates and writes to db, when 0, ends -- working
function timerRun () {
  let secs;
  let timeSetDB = currentSession.child('timeSet');
  var timerAmmount = timeSetDB.once('value').then((snapshot)=>{
    secs = snapshot.val()*60;
  });
// actual timer intervals
  timeInterval = setInterval(()=>{
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
  currentSession.child('timeLeft').on("value", (snapshot)=>{
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
