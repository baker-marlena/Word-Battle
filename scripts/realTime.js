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
  setDisabledContent(userName);
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
  setDisabledContent(userName);
})

// ----- capture typing  -- Not working
$(`#${userName}_text`).keyup(function() {
  currentSession.update({
    [userName]: {
      textInput: this.value,
      wordCount: this.value.split(" ").length
    }
  })
// ----- post text to disable box for other user -- Not working
  .then(function(snapshot){
    const data = snapshot.val();
    $(`#${otherUser}_text`).textContent = data[otherUser].textInput;
  })
})

// ----- make other user's content uneditable
function setDisabledContent (name){
  let otherUser;
  if (name == "user_1") {
    otherUser = "user_2";
  }
  if (name == "user_2") {
    otherUser = "user_1";
  }
  $(`#${otherUser}_text`).prop('disabled', true);
  };
