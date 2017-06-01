// ----- capture typing and store to db -- working
function listenForTyping (user){
  $(`#${user}_text`).keyup(function() {
    let wordCountValue = this.value.trim().split(/\s+/).length
    let update = {
      [user]: {
        textInput: this.value,
        wordCount: wordCountValue
      }
    };
    $(`#${user}_words`).text("Word Count: " +  wordCountValue);
    currentSession.update(update);
  });
};

// ----- listen for other typing and update from -- working
function listenForOther (partner){
let partnerDB = currentSession.child(partner);
partnerDB.on("value", snapshot => {
  const data = snapshot.val();
  $(`#${partner}_text`).text(data.textInput);
  $(`#${partner}_words`).text("Word Count: " + data.wordCount);
});
};
