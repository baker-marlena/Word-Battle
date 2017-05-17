//-----Starts the round
$("#start").click(roundStart);

function roundStart(){
  timerRun();
  $("#start").prop("disabled", true);
}
