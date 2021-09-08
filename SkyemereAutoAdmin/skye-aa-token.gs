//contains both player token + summon token 
//TODO - should be a better way of doing this than "copy paste the function lol"

function logToken(arrayTask,i) {

    //needs to
    //take file
    var sourceFileID = getIdFromUrl(arrayTask[0][columnNewToken-1])
  
    //rename it using info from the roster
    var rosterLastRow = rosterSheet.getLastRow();
    var charNameArray = rosterSheet.getSheetValues(1, 2, rosterLastRow, 1)
    var matchName = arrayTask[0][columnExistingChar-1].toString();
    
    for(var j = 0; j < charNameArray.length; j++) {
      var checkName = charNameArray[j][0].toString();
  
      if (checkName == matchName) {
        var charRowNumber = j + 1
        break
      }
    }
  
    //array 0,0 is number. 0,1 is char name, 0,2 is player name, 0,3 is discord tag
    var charDataArray = rosterSheet.getSheetValues(charRowNumber, 1, 1, 4)
    var tokenFileName = charDataArray[0][1] + " - " + charDataArray[0][0] + " - " + charDataArray[0][2] + " - Character"
  
    //replacing other token if needed
    
    var oldTokenFolder = DriveApp.getFolderById(oldTokenFolderID);
    var newTokenFolder = DriveApp.getFolderById(newTokenFolderID);
    var oldTokenIterator = newTokenFolder.getFilesByName(tokenFileName);
  
    while (oldTokenIterator.hasNext()) {
      var oldToken = oldTokenIterator.next()
      oldToken.moveTo(oldTokenFolder)
    }
  
    //copy it to token directory
    
    var newToken = DriveApp.getFileById(sourceFileID)
    newToken.moveTo(newTokenFolder)
    newToken.setName(tokenFileName)
    
    //write back to roster that token is available
    //Yes I could have made this configurable. No I didn't want to. Fuck you future self.
  
    var newTokenURL = newToken.getUrl();
    rosterSheet.getRange(charRowNumber, 18).setValue(newTokenURL)
    
    return 30
  }
  
  
  function logTokenSummon(arrayTask,i) {
  
    //needs to
    //take file
    var sourceFileID = getIdFromUrl(arrayTask[0][columnNewToken-1])
  
    //rename it using info from the roster
    var rosterLastRow = rosterSheet.getLastRow();
    var charNameArray = rosterSheet.getSheetValues(1, 2, rosterLastRow, 1)
    var matchName = arrayTask[0][columnExistingChar-1].toString();
    
    for(var j = 0; j < charNameArray.length; j++) {
      var checkName = charNameArray[j][0].toString();
  
      if (checkName == matchName) {
        var charRowNumber = j + 1
        break
      }
    }
  
    //array 0,0 is number. 0,1 is char name, 0,2 is player name, 0,3 is discord tag
    var charDataArray = rosterSheet.getSheetValues(charRowNumber, 1, 1, 4)
    var tokenFileName = charDataArray[0][1] + " - " + charDataArray[0][0] + " - " + charDataArray[0][2] + " - Summon"
  
    //replacing other token if needed
    
    var oldTokenFolder = DriveApp.getFolderById(oldTokenFolderID);
    var newTokenFolder = DriveApp.getFolderById(newTokenFolderID);
    var oldTokenIterator = newTokenFolder.getFilesByName(tokenFileName);
  
    while (oldTokenIterator.hasNext()) {
      var oldToken = oldTokenIterator.next()
      oldToken.moveTo(oldTokenFolder)
    }
  
    //copy it to token directory
    
    var newToken = DriveApp.getFileById(sourceFileID)
    newToken.moveTo(newTokenFolder)
    newToken.setName(tokenFileName)
    
    //write back to roster that token is available
    //Yes I could have made this configurable. No I didn't want to. Fuck you future self.
  
    var newTokenURL = newToken.getUrl();
    rosterSheet.getRange(charRowNumber, 19).setValue(newTokenURL)
    
    return 40
  }