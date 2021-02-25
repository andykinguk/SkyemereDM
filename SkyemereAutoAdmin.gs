// DM Menu
function createMenu() {
  SpreadsheetApp.getUi()
      .createMenu('Skyemere DMs')
      .addItem('Refresh Forms - Characters', 'updateCharacterList')
      .addItem('Refresh Forms - Kickstarter', 'updateKickstarterList')
      .addItem('Process Tasks', 'processTasks')
      .addToUi();
}

// Global Bits
// The Google Sheet IDs
var rosterSpreadsheet = SpreadsheetApp.openById("xxx")
var kickstarterSpreadsheet = SpreadsheetApp.openById("xxx")
var submissionSpreadsheet = SpreadsheetApp.openById("xxx")
var shoppingSpreadsheet = SpreadsheetApp.openById("xxx")

var rosterSheet = getSheetById(rosterSpreadsheet,123);
var activeCharListSheet = getSheetById(rosterSpreadsheet,123);

var submissionSheet = getSheetById(submissionSpreadsheet, 123);
var unprocessedSheet = getSheetById(submissionSpreadsheet, 123); 

var kickstarterSheet = getSheetById(kickstarterSpreadsheet, 123); 
var activeKickstarterListSheet = getSheetById(kickstarterSpreadsheet, 123); 

var shoppingSheet = getSheetById(shoppingSpreadsheet,123)

var thisForm = FormApp.openById("xxx")
// Select the correct sheet - xxx is the sheet ID for roster 2.0 / xxx for the deadpool list
function getSheetById(spreadsheet, id) {
  return spreadsheet.getSheets().filter(
    function(s) {return s.getSheetId() === id;}
  )[0];
}

function getIdFromUrl(url) { return url.match(/[-\w]{25,}/); }

// Column numbers
var columnTimestamp = 1
var columnEmail = 2
var columnPerson = 3
var columnJobType = 4
var columnNewCharName = 5
var columnNewCharLink = 6
var columnNewToken = 7
var columnPurchaseItem = 8
var columnPurchaseCost = 9
var columnSaleItem = 10
var columnSaleCost = 11
var columnKickstarter = 12
var columnKickstarterCost = 13
var columnExistingChar = 14
var columnProcessed = 15

function processTasks (){
  var unprocessedLastRow = unprocessedSheet.getLastRow();
  var lastColumn = unprocessedSheet.getLastColumn();
    
  // Using this, set up a for loop. i is the designation for currentRowNumber
  // For each row, work out
  for (i=2; i<=unprocessedLastRow;) {

    var unprocessedLastRow = unprocessedSheet.getLastRow();
    var jobType = unprocessedSheet.getSheetValues(i, columnJobType, 1, 1)[0][0]
    var taskArray = unprocessedSheet.getSheetValues(i, 1, 1, lastColumn)
  
    switch (jobType) {
      case "Declaring shopping":
      var handshake = logShopping(taskArray,i)
      break;
      case "Submitting a new character":
      var handshake = logCharacter(taskArray,i)
      break;
      case "Submitting a token for a character":
      var handshake = logToken(taskArray,i)
      break;
      case "Contributing to a kickstarter":
      var handshake = logKickstarter(taskArray,i)
    }
  confirmDoneTask(taskArray,i)
  } 
}

function logShopping(taskArray,i){
  
  var shoppingLastRow = shoppingSheet.getLastRow();
  var newShopArray = [ [taskArray[0][0], taskArray[0][columnExistingChar-1], taskArray[0][columnPurchaseItem-1], taskArray[0][columnPurchaseCost-1], taskArray[0][columnSaleItem-1], taskArray[0][columnSaleCost-1],  ] ]

  shoppingSheet.getRange(shoppingLastRow+1,1,1,6).setValues(newShopArray)
}

function logCharacter(taskArray,i){

  var rosterLastRow = rosterSheet.getLastRow();
  var k = rosterLastRow + 1
  var newCharArray = [ [rosterLastRow, taskArray[0][columnNewCharName-1], "=VLOOKUP(D" + k + ",NameLookup!A:B,2,FALSE)", taskArray[0][columnPerson-1], taskArray[0][columnNewCharLink-1], "Active"  ] ]

  rosterSheet.getRange(k,1,1,6).setValues(newCharArray)

  SkyemereDDBintegration.updateRosterRow(rosterSheet,k)

  return 2
}

function logToken(taskArray,i) {

  //needs to
  //take file
  var sourceFileID = getIdFromUrl(taskArray[0][columnNewToken-1])
  var newTokenFolderID = "xxx";
  var oldTokenFolderID = "xxx"

  //rename it using info from the roster
  var rosterLastRow = rosterSheet.getLastRow();
  var charNameArray = rosterSheet.getSheetValues(1, 2, rosterLastRow, 1)
  var matchName = taskArray[0][columnExistingChar-1].toString();
  
  for(var j = 0; j < charNameArray.length; j++) {
    var checkName = charNameArray[j][0].toString();

    if (checkName == matchName) {
      var charRowNumber = j + 1
      break
    }
  }

  var charDataArray = rosterSheet.getSheetValues(charRowNumber, 1, 1, 4)
  var tokenFileName = charDataArray[0][0] + " - " + charDataArray[0][2] + " - " + charDataArray[0][1]

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
  
  return 3
}

function logKickstarter(taskArray,i){

  var kickstarterLastRow = kickstarterSheet.getLastRow();
  var o = kickstarterLastRow + 1
  var newKickstarterArray = [ [ taskArray[0][0], taskArray[0][columnExistingChar-1], taskArray[0][columnKickstarter-1], taskArray[0][columnKickstarterCost-1], "=SUMIF($C$2:$C" + o + ",$C" + o + ",$D$2:$D" + o + ")", "=VLOOKUP($C" + o + ",'KickstarterStretchGoals-Full'!$B:$E,4,FALSE)-$E" + o ] ]
  
  kickstarterSheet.getRange(kickstarterLastRow+1,1,1,6).setValues(newKickstarterArray)

  //Timestamp	Contributor	Kickstarter	Amount	Progress Total	Remaining

}

function confirmDoneTask(taskArray,i){
  var submissionsLastRow = submissionSheet.getLastRow();
  var timestampArray = submissionSheet.getSheetValues(1, columnTimestamp,submissionsLastRow,1)
  
  var matchDate = taskArray[0][0].toString();
  
  for(var j = 0; j < timestampArray.length;j++) {
    var checkDate = timestampArray[j][0].toString();
    
    if(checkDate == matchDate) {
    submissionSheet.getRange(j+1,columnProcessed).setValue(1)
    return;
    }
  }
}

function updateCharacterList() {
  
    var characterList = thisForm.getItemById(123).asListItem();
  
    var characterListValues = activeCharListSheet.getRange(2, 3, activeCharListSheet.getMaxRows() - 1).getValues();
    var characterListArray = [];
  
    // convert the array ignoring empty cells
    for(var i = 0; i < characterListValues.length; i++)   
      if(characterListValues[i][0] != "")
        characterListArray[i] = characterListValues[i][0];
  
    // populate the drop-down with the array data
    characterList.setChoiceValues(characterListArray);
    
  }
  
  function updateKickstarterList() {
    
    var characterList = thisForm.getItemById(123).asListItem();
  
    var characterListValues = activeKickstarterListSheet.getRange(2, 2, activeKickstarterListSheet.getMaxRows() - 1).getValues();
    var characterListArray = [];
  
    // convert the array ignoring empty cells
    for(var i = 0; i < characterListValues.length; i++)   
      if(characterListValues[i][0] != "")
        characterListArray[i] = characterListValues[i][0];
  
    // populate the drop-down with the array data
    characterList.setChoiceValues(characterListArray);
    
  }