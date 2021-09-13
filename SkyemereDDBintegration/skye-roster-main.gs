// Skyemere Roster

// Deadpool Form Updater
function updateDeadpoolForm(){

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
}

// this just exists for the UI. We can't be expected to put the sheetID manually.
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

function recordStatus(i,statusString,rosterSheet) {
  rosterSheet.getRange(i,columnProcessedStatus).setValue(statusString)
}  