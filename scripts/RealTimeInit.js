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
var timeInterval;
var timerSet;
var counterSet;
var sessionActive = false;
