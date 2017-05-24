// ----- check if timer is active and save to db -- working
$("#timerOn").click(function(){
  currentSession.update({timer:true})
  startButtonDispay();
});

$("#timerOff").click(function(){
  currentSession.update({timer:false})
  startButtonDispay();
});

// ----- listen for changes to timer status in db and hide timer on page - working
function checkTimerStatus (){
  currentSession.child("timer").on("value", function(snapshot){
    let currentStatus = snapshot.val();
    if (currentStatus == false){
      $("#timerMain").css("display","none");
      $("#timerOff").prop("checked",true);
      timerSet = false;
      startButtonDispay();
    };
    if (currentStatus == true) {
      $("#timerMain").css("display","initial");
      $("#timerOn").prop("checked",true);
      timerSet = true;
      startButtonDispay();
    };
  });
};

// --------- TIMER START AND END

// ----- Listen for start button, check input value, and update database -- working
$("#start").click(function(){
  if (timerSet = true) {
    timerCheck();
  }
  if (counterSet = true) {
    counterCheck();
  }
});



// ----- listen for end button and update database -- working
$("#clearTimer").click(function(){
  currentSession.update({startStatus:false});
});

// ------ if timer is on and input is valid, update db and run timer
function  timerCheck () {
  let timerInput = Number($("#timer").val());
  // ----- Check that timer input is valid
  if (timerInput <= 0 || (timerInput % 1) !== 0){
    alert ("Please enter a positive, whole number of minutes.");
    return
  }
  if(timerInput > 120){
    alert ("Two hours is the limit. Don't forget to take breaks!");
    return
  }
  else {
    currentSession.update({startStatus:true,timeSet:timerInput});
    currentSession.update({initilized:true});
    timerRun();
  };
};

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

// ----- end the timer and update start value -- working
function endTimer (){
  // ----- set timer field to last entered value
  let timerValueSet = currentSession.child('timeSet').once('value').then(function(snapshot){
    $("#timer").val(snapshot.val());
  })
  Materialize.toast("Time's up!", 6000);
}

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
