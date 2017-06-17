function checkCounterStatus (){
  let counterStatusDB = currentSession.child("counter").child("status");
  counterStatusDB.on("value", (snapshot)=>{
    let currentStatus = snapshot.val();
    if (currentStatus == false){
      counterHide();
      startButtonDispay();
    };
    if (currentStatus == true) {
      counterShow();
      startButtonDispay();
    };
    return currentStatus;
  });
};

function counterHide (){
  $("#counterMain").css("display","none");
  $("#counterOff").prop("checked",true);
}

function counterShow(){
  $("#counterMain").css("display","initial");
  $("#counterOn").prop("checked",true);
}
