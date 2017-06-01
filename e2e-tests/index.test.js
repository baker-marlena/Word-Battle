module.exports = {
  'Session Create test' : function (browser) {
    browser
      .url('http://localhost:8080/index.html')
      .waitForElementVisible('body', 1000)
      .setValue('#sessionKeyGen','Demo')
      .click('#sessionKeyGenBut')
      .pause(1000, function(){
        browser
          // .assert.containsText('#sessionJoinSuccessMessage', 'Success!')
          .assert.attributeEquals('#user_2_text','disabled','true')
          .assert.attributeEquals('#sessionKeyGenBut','disabled','true')
          .assert.attributeEquals('#sessionKeyAcceptBut','disabled','true')
          // .assert.attributeEquals('#start','disabled',null)
          // .assert.attributeEquals('clearTimer','disabled',null)
          browser.expect.element('#start').to.be.enabled
      })
      .setValue('#user_1_text','Hello, this is a test scentence')
      .pause(100, function (){
        browser
          .assert.containsText('#user_1_words','6')
      })
      .moveTo("#timerOff")
      .mouseButtonClick(0)
      .pause(3000, function(){
        browser
          .assert.hidden('#timerMain')
          .assert.hidden('#start')
          .assert.hidden('#clearTimer')
      })

      .end();
  }
};
