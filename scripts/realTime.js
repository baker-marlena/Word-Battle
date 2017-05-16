// -----init the real time database
  var config = {
     apiKey: "AIzaSyCoF8-O434tawCarh4eA4ICGnBElYpgYWE",
     databaseURL: "https://q1-project-1ce2b.firebaseio.com/",
   };

firebase.initializeApp(config);

var database = firebase.database();
var currentSession;
var userName;

// ----- create a new session
$("#sessionKeyGenBut").click(function (){
  let sessionKey = getSessionKey();
  let sessionRef = database.ref(sessionKey);
  createNewSession(sessionRef);
  currentSession = sessionRef;
  userName = "user_1";
});

function getSessionKey (){
  // ----- retrive session key
  let newKey = $("#sessionKeyGen").val();
  // ----- check if session exists in db
  if (newKey in database) {
    alert ("That game already exists!");
  }
  else{
    return newKey;
  }
}

// -----write a new session to the database
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
    start: false,
    end: false
  });
}

// ----- Join session
$("#sessionKeyAcceptBut").click(function(){
  let keyInput = $("#sessionKeyAccept").val();
  currentSession = database.ref(keyInput);
  userName = "user_2";
  console.log(userName);
})

// ----- Write text to db
var userInput =
$(`#${userName}_text`).keyup(function() {
  currentSession.update({
    [userName]: {
      textInput: this.value,
      wordCount: this.value.split(" ").length
    }
  })
})

// ----- display other user's content
// function setDisabledContent (name){
// ----- Record other user
//   let otherUser;
//   if (name == "user_1") {
//     otherUser = "user_2";
//   }
//   if (name == "user_2") {
//     otherUser = "user_1";
//   }
// ----- listen for changes to the other user's text to display on page
//   $(`#${otherUser}_text`).prop('disabled', true);
//   var otherUserText = database.ref(`${otherUser}/textInput`);
//   var otherUserCount = database.ref(`${otherUser}/wordCount`);
//   otherUserText.on('value', function(snapshot) {
//     $(`#${otherUser}_text`) (snapshot.val());
//   });
// }
