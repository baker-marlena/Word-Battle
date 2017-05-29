$("#counterOn").click(function(){
  currentSession.child("counter").update({status:true});
});

$("#counterOff").click(function(){
  currentSession.child("counter").update({status:false})
});

// ----- listen for changes to timer status in db and hide timer on page - working
function checkCounterStatus (){
  currentSession.child("counter").child("status").on("value", function(snapshot){
    let currentStatus = snapshot.val();
    if (currentStatus == false){
      $("#counterMain").css("display","none");
      $("#counterOff").prop("checked",true);
      counterSet = false;
      startButtonDispay();
    };
    if (currentStatus == true) {
      $("#counterMain").css("display","initial");
      $("#counterOn").prop("checked",true);
      counterSet = true;
      startButtonDispay();
    };
  });
};

// -- see if counter value is valid
function checkCounter () {
  let counterInput = Number($("#counter").val());
  if (counterInput <= 0 || typeof conterInput !== "number") {
    alert("Please enter a positive, whole number of words.");
    return false;
  }
  if (counterInput > 10000) {
    alert("The limit for one round is 5,000 words. Remember to take breaks!");
    return false;
  }
  else {
    currentSession.child("counter").update({countSet:counterInput})
    getCounterValue();
    displayCounter();
    $("#counter").prop('disabled',true);
    return true;
  }
}


function getCounterValue (){
  currentSession.child("counter").child("counntSet").once("value", function(snapshot) {
    wordCountGoal = snapshot.val();
  })
  currentSession.child(userName).child("wordCount").once("value", function(snapshot){
    standingWordCount = snapshot.value;
  })
}

// change display to round mode
function displayCounter () {
  currentSession.child("user_1").child('wordGoalProgress').on("value", function(snapshot){
    user_1_wordcount = snapshot.val();
    $("#user_1_words").text(user_1_wordcount+"/"+wordCountGoal);
  });
  currentSession.child("user_2").child("wordGoalProgress").on("value", function(snapshot){
    user_2_wordcount = snapshot.val();
    $("#user_2_words").text(user_2_wordcount+"/"+wordCountGoal);
  });
}

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
