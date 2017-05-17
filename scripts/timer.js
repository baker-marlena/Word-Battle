// check if timer is active
function checkTimerStatus (){
  if ($("#timerOn").checked === true){
    console.log("Timer On!")
  }
  if ($("timerOff".checked === true)) {
    console.log("Timer off!")
  }
}

// runs timer
function timerRun () {
  let timerAmmount = $("#timer").val();
  var secs = timerAmmount*60;
  var timeInterval = setInterval(function(){
      secs--; console.log(secs);
      $("#timer").val(`${calculateMintues(secs)}:${calculateSeconds(secs)}`);
    if(secs == 0){
      clearInterval(timeInterval);
      $("#start").prop("disabled", false);
      alert ("Time's up!");
     }
  }, 1000);
}


// calculate remaining minutes
function calculateMintues(value){
  return Math.floor(value/60);
}

//caluclate remaining seconds
function calculateSeconds(value){
  let displaySeconds = value-(Math.floor(value/60)*60);
  if (displaySeconds < 10) {
    return `0${displaySeconds}`;
  }
  return displaySeconds;
}
