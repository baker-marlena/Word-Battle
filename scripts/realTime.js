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

// ----- create a new session - working
$("#sessionKeyGenBut").click(function (){
  let sessionKey = getSessionKey();
  let sessionRef = database.ref(sessionKey);
  createNewSession(sessionRef);
  currentSession = sessionRef;
  userName = "user_1";
  setDisabledContent(userName);
  listenForTyping(userName);
  //listenForCount(userName);
  listenForOther(userName);
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
      wordCount:0
    },
    user_2:{
      textInput:"",
      wordCount:0
    },
    timer: true,
    timeSet: 0,
    timeLeft: 0,
    start: false,
    end: false
  });
}

// ----- Join session -- working
$("#sessionKeyAcceptBut").click(function(){
  let keyInput = $("#sessionKeyAccept").val();
  currentSession = database.ref(keyInput);
  userName = "user_2";
  //if ($("user_1_text").prop("disabled") !== true && $("user_2_text").prop("disabled") !== true) {
    setDisabledContent(userName);
//  }
  listenForTyping(userName);
  //listenForCount(userName);
  listenForOther(userName);
  $("#sessionJoinSuccessMessage").text("Success! Refresh to create or join a different session.");
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
  console.log(update);
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
    $(`#${otherUser}_words`).text(data.wordCount);
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
