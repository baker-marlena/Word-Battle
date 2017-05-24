let user_1_wordcount;
let user_2_wordcount;
let wordCountGoal;
let counterInput;

function checkCounterStatus () {
  let counterInput = Number($("#counter").val());
  if (counterInput <= 0 || typeof conterInput !== "number") {
    alert("Please enter a positive, whole number of words.");
  }
  if (counterInput > 10000) {
    alert("The limit for one round is 5,000 words. Remember to take breaks!");
  }
  else {
    currentSession.update({startStatus:true,initilized:true});
    currentSession.child("counter").update({countSet:counterInput})
  }
}

// set gloal to db
function setWordCountGoal () {
  currentSession.child("counter").update({countSet:counterInput})
}

function getCounterValue (){
  currentSession.child("counter").child("counntSet").once("value", function(snapshot) {
    wordCountGoal = snapshot.val();
  })
}

// change display to round mode
function displayCounter () {
  $("#user_2_words").text(user_2_wordcount+"/"+wordCountGoal);
  $("#user_1_words").text(user_1_wordcount+"/"+wordCountGoal);
}

// write's user's word count to the db
function workCountPut () {
  currentSession.(userName).update({wordGoalProgress:})
}

// updates word count when db updates

// end round

// // ----- Checks word counts of each user against the goal and ends when one is met -- working
// function counterRun () {
//   let words = ;
//   currentSession.child('counter').child().once('countLeft').then(function (snapshot){
//   words = snapshot.val();
// });
//   // counter reaches 0
//   if(s == 0){
//     currentSession.update({startStatus:false});
//   };
// }, 1000);
// };
//
// // ----- listen to database for timer updates and update user's page -- working
// function displayTimer () {
// currentSession.child('countLeft').on("value", function(snapshot){
//   $("#timer").val(snapshot.val());
// });
// };
//
// // ----- end the timer and update start value -- working
// function endTimer (){
//   // ----- set timer field to last entered value
//   let timerValueSet = currentSession.child('timeSet').once('value').then(function(snapshot){
//     $("#timer").val(snapshot.val());
//   })
//   Materialize.toast("Time's up!", 6000);
// }
