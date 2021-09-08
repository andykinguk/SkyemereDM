function processTasks (){

  addJobID();

  try {
    var lastColumn = unprocessedSheet.getLastColumn();
    var unprocessedLastRow = unprocessedSheet.getLastRow();
      
    // Using this, set up a for loop. i is the designation for currentRowNumber
    // For each row, work out
    for (i=2; i<=unprocessedLastRow;) {

      var unprocessedLastRow = unprocessedSheet.getLastRow();
      var jobType = unprocessedSheet.getSheetValues(i, columnJobType, 1, 1)[0][0]
      var arrayTask = unprocessedSheet.getSheetValues(i, 1, 1, lastColumn)
    
      switch (jobType) {
        case "Declaring shopping":
        var handshake = logShopping(arrayTask,i)
        if(handshake != 10) {
          createMeaningfulError(arrayTask,'Incorrect operation. Attempted to declare shopping')
          return;
        }
        break;
        case "Submitting a new character":
        var handshake = logCharacter(arrayTask,i)
        if(handshake != 20) {
          createMeaningfulError(arrayTask,'Incorrect operation. Attempted to submit a character')
          return;
        }
        break;
        case "Submitting a token for a character":
        var handshake = logToken(arrayTask,i)
        if(handshake != 30) {
          createMeaningfulError(arrayTask,'Incorrect operation. Attempted to submit a character token')
          return;
        }
        break;
        case "Submitting a token for a summon":
        var handshake = logTokenSummon(arrayTask,i)
        if(handshake != 40) {
          createMeaningfulError(arrayTask,'Incorrect operation. Attempted to submit a summon token')
          return;
        }
        break;
        case "Contributing to a kickstarter":
        var handshake = logKickstarter(arrayTask,i)
        if(handshake != 50) {
          createMeaningfulError(arrayTask,'Incorrect operation. Attempted to contribute to crowdfunding')
          return;
        }
      }

    confirmDoneTask(arrayTask,i)
    } 
  }
  catch (err) {
    postErrorToDiscord(err)
  }
}

function addJobID () {
  var rangeColumnJobID = submissionSheet.getRange(2,columnJobID,submissionsLastRow-1,1)
  rangeColumnJobID.setValue("=ROW()-1")

  var valuesJobID = rangeColumnJobID.getValues()
  rangeColumnJobID.setValues(valuesJobID)
}

function createMeaningfulError (arrayTask, message) {
  message += ' - Issue with Job ID: ' + arrayTask[0][15].toString();
  message += ' - Bricked at ' + arrayTask[0][0].toString();
  message += ' - <@' + AndyDiscordID + '> help me senpai.'

  postErrorToDiscord(message);
}


//TODO - Put a check in using i, make sure the task we performed was the one we were asked to do (utilise Handshake var) - done 20210908
//TODO - BUG - If there are two inputs in quick succession, they won't mark as processed as "task time" (job 1) won't match "last row time" (job 2) - should be solved 20210908
function confirmDoneTask(arrayTask,i){

  var taskJobID = arrayTask[0][15]

  if (taskJobID == "")
  return;
  
  var arrayJobIDs = submissionSheet.getSheetValues(1,columnJobID,submissionsLastRow,1)
  
  for(var j = 0; j < arrayJobIDs.length;j++) {
    var checkJobID = arrayJobIDs[j][0]
    
    if(taskJobID == checkJobID) {
    submissionSheet.getRange(j+1,columnProcessed).setValue(1)
    return;
    }
  }

  createMeaningfulError(arrayTask,'Job completed with no matching Job ID')
}