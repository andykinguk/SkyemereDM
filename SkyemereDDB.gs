

// Skyemere Roster

// Global Bits
// The Google Sheet IDs
var rosterSheet = getSheetById(123);
var deadpoolSheet = getSheetById(123);

// Select the correct sheet - xxx is the sheet ID for roster 2.0 / xxx for the deadpool list
function getSheetById(id) {
  return SpreadsheetApp.getActive().getSheets().filter(
    function(s) {return s.getSheetId() === id;}
  )[0];
}

// DM Menu
function createMenu() {
  SpreadsheetApp.getUi()
      .createMenu('Skyemere DMs')
      .addItem('Link to D&DBeyond', 'updateRosterHandler')
      .addItem('Refresh Deadpool', 'updateDeadpoolForm')
      .addToUi();
}


// Deadpool Form Updater
function updateDeadpoolForm(){
  // call your form and connect to the drop-down item
  var form = FormApp.openById('xxx');
  
  var customerList = form.getItemById(123).asListItem();
  var bettingOnList = form.getItemById(123).asListItem();

  // grab the values in the first column of the sheet - use 2 to skip header row
  var deadpoolNamesValues = deadpoolSheet.getRange(2, 3, deadpoolSheet.getMaxRows() - 1).getValues();

  var deadpoolNames = [];

  // convert the array ignoring empty cells
  for(var i = 0; i < deadpoolNamesValues.length; i++)   
    if(deadpoolNamesValues[i][0] != "")
      deadpoolNames[i] = deadpoolNamesValues[i][0];

  // populate the drop-down with the array data
  customerList.setChoiceValues(deadpoolNames);
  bettingOnList.setChoiceValues(deadpoolNames);
  //bigdaddyformList.setChoiceValues(deadpoolNames);
 
}


// Skyemere Roster D&DBeyond integration (ohshitson)
// AK 20201220

// Columns used for inputs. If changing the layout of the sheet, review these
//##	Character Name	Player Name	Discord Tag	D&D Beyond Link	Status	Rank	Portrait	PC Level	Race	Subrace	Classes	Subclasses	Class Levels	Notes	First Week	Token	Datetime Attempted	Datetime Completed	Success	Handshake	Webservice Link										
var columnBeyondLink = 5
var columnPortrait = 9
var columnTotalLevel = 10
var columnAttemptedDatetime = 19
var columnCompletedDatetime = 20
var columnProcessedStatus = 21
var columnWebserviceLink = 23

function updateRosterRow(rosterSheet, i) {
  var pulledCharInfo = rosterSheet.getSheetValues(i, columnBeyondLink, 1, 2)

  // Is this character active or busy? If they're out of play, skip the row entirely
  if (pulledCharInfo[0][1] == "Active" || pulledCharInfo[0][1] == "Busy")
    var response = getJsonResponse(rosterSheet, pulledCharInfo[0][0], i)
  else {     
    recordStatus(i,"Not Attempted",rosterSheet)
    return 'done';
  }  

  // Do we get a 'fail' back from getJsonResponse? Check that and fail safely
  if (response == 'fail') {
    recordStatus(i,"Failed Response",rosterSheet)
    return 'done';
  }
  
  // Start parsing the datas
  // We want to do a single input if possible, so need an array with "Race, Subrace, Classes, Subclasses, Class Levels.
  
  // Classes are weird. We need to declare vars, set up a loop for each class node and throw whatever is in there.
  var mcNames = ""
  var mcSubs = ""
  var mcLevels = ""
  
  // For each available node, concat the info together and add a comma & space
  for (x in response["data"]["classes"]) {
    
    mcNames += response["data"]["classes"][x]["definition"]["name"]
    mcNames += ', '
    
    // subclasses are weird because you may not have one, hence the trycatch
    try {
      mcSubs += response["data"]["classes"][x]["subclassDefinition"]["name"]
      mcSubs += ', '
    }
    catch (e) {
      mcSubs = ''
    }
    
    mcLevels += response["data"]["classes"][x]["level"]
    mcLevels += ', '
  }
  
  // Get rid of the last comma
  mcNames = mcNames.slice(0,-2)
  mcSubs = mcSubs.slice(0,-2)
  mcLevels = mcLevels.slice(0,-2)
  
  // Generate a total level
  var tempLevelArray = mcLevels.split(',').map(Number);
  var totalLevel = tempLevelArray.reduce((a,b) => a + b, 0)

  // Get the rest of the array we need
  var charInfoArray = [ [totalLevel,response["data"]["race"]["baseName"],response["data"]["race"]["subRaceShortName"],mcNames,mcSubs,mcLevels] ]

  // Write that shit   
  rosterSheet.getRange(i,columnTotalLevel,1,6).setValues(charInfoArray)
  
  // Let's be fucking fancy and put the Portraits in
  var imageFormula = '=IMAGE("' + response["data"]["avatarUrl"] + '",4, 35, 35)'
  rosterSheet.getRange(i,columnPortrait).setValue(imageFormula)
  rosterSheet.setRowHeight(i,35)
  
  // Sign off that everything has worked correctly
  var diagArray = [ [Utilities.formatDate(new Date(), "GMT", "yyyy-MM-dd HH:mm:ss"), 'Success', response["data"]["name"]] ]
  rosterSheet.getRange(i,columnCompletedDatetime,1,3).setValues(diagArray)

  return 'done';
}

function updateRosterHandler() {
  updateRosterMain(rosterSheet)
}

function updateRosterMain(rosterSheet) {
  
  // Work out how many rows we have (we start the loop from row 2, to exclude the header row)
  var lastRow = rosterSheet.getLastRow();

  // Using this, set up a for loop. i is the designation for currentRowNumber
  // For each row, work out
  for (i=2; i<=lastRow; i++) {
    updateRosterRow(rosterSheet,i)

  }
}

function getJsonResponse(rosterSheet, pulledCharLink,i) {
  
  // If in play, start processing. Record the "Datetime Attempted" cell. 
  var currTime = Utilities.formatDate(new Date(), "GMT", "yyyy-MM-dd HH:mm:ss");
  rosterSheet.getRange(i,columnAttemptedDatetime).setValue(currTime)
  
  // Is this link valid? Check it's a proper ddb.ac link
  if (pulledCharLink.includes('ddb.ac',0) < 1) {
    recordStatus(i,'Link Invalid',rosterSheet)
    var log = 'fail'
    return log
  }
  
  // Parse the character link. We need the number only |  https://ddb.ac/characters/38513640/w3EHY1 becomes 38513640
  var tempCharLinkArray = pulledCharLink.split ("/")
  var charID = tempCharLinkArray[4]
  
  // Generate D&DBeyond Webservice Link ("https://character-service.dndbeyond.com/character/v3/character/[charID]")
  // Record this to "WebServiceLink" cell.
  var webServiceLink = "https://character-service.dndbeyond.com/character/v3/character/".concat(charID)
  rosterSheet.getRange(i,columnWebserviceLink).setValue(webServiceLink)
  
  // Extract all the data into a variable response
  try {
    var response = UrlFetchApp.fetch(webServiceLink);
  } 
  catch (e) {
    recordStatus(i,"Response Not Received",rosterSheet)
    var log = "fail"
    return log
  } 
  
  // The response is HTTP. We need JSON so parse it.
  var responseText = JSON.parse(response.getContentText())
  
  // Do we actually have a response? Check it.
  if (responseText.length < 1) {
    recordStatus (i,"Response Invalid",rosterSheet)
    var log = 'fail'
    return log
  }
  
  // Does the response ring as "true"? This blocks stuff like character deletion.
  if (responseText["success"] == 'false') {
    recordStatus (i,"Character Info not available",rosterSheet)
    var log = 'fail'
    return log
  }
  
  // If we're this far, great! Return the JSON response.
  return responseText
}


function recordStatus(i,statusString,rosterSheet) {
  rosterSheet.getRange(i,columnProcessedStatus).setValue(statusString)
}  


// Split the response down into little bits and pieces. We need: Char name (handshake), PC level, Race, Subrace

// ?? - Support for multiclasses: Loop for classes (data, classes, (count nodes), cycle through each one, maybe concat them? need to think about this
// ?? - do we do DDB character portraits? If so, what size?
// ?? - current XP? Use this to calculate XP required to next level maybe?

// Once we've worked out our little array of variables, paste that shit into the row.

// I want a handshake to confirm this has all worked. Last five rows will be "Success Y/N", "Char Name", "Webservice Link", "Datetime Attempted", "Datetime Succeeded" - these will be hidden for the most part
// If successful, print Yes and all the other vars in fields.
// If not successful, print No, CharName(), WebserviceLink(), AttemptedDatetime() and leave the last field as it is, don't overwrite it

// Clear all vars down, go for the next row

// Get to the end and report success!


// We also need a webUI function to call this. Probably create a Skyemere menu and have a big "REFRESH THIS SHIT" option in it.

// Either way, can't be fucked to do it right now lol.