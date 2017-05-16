// -----session information
// -----create new session or pull past session information
// const testSession = {
//   "user1":{
//     "textInput":"",
//     "wordCount":0
//   },
//   "user2":{
//     "textInput":"",
//     "wordCount":0
//   }
//   "timer": true,
//   "currentTime": "",
//   "timeSet": 0,
//   "start": false,
//   "end": false
// };

// -----generate a session id
function sessionGenerator(length){
  let sessionKey =  Math.random().toString(36).replace(/\W+/g, '').substr(0, length);
  return `http://q1-project-1ce2b.firebaseapp.com/?${sessionKey}`;
}

//-----gives a session url to the user
$("#sessionKey").click(function(){
  $("sessionKeyOut").val(sessionGenerator(5));
});
