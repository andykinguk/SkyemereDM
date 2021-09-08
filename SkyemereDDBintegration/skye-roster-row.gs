// Skyemere Roster D&DBeyond integration (ohshitson)
// AK 20201220

function updateRosterRow(rosterSheet, i) {
    var pulledCharInfo = rosterSheet.getSheetValues(i, columnBeyondLink, 1, 2)
  
    // Is this character active or busy? If they're out of play, skip the row entirely
    if (pulledCharInfo[0][1] == "Active" || pulledCharInfo[0][1] == "Busy" || pulledCharInfo[0][1] == "Submitted")
      var response = getJsonResponse(rosterSheet, pulledCharInfo[0][0], i)
    else {     
      recordStatus(i,"Not Attempted",rosterSheet)
      return 'done';
    }  
  
    // Do we get a 'fail' back from getJsonResponse? Check that and fail safely
    if (response == 'fail') {
      recordStatus(i,"Fail - No Response",rosterSheet)
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
    
    // 20210228 Lets add extra steps for the Res Rules + DC
    var resFormula = "=IF($T" + i + "=0,\"Free\",($T" + i + "*2+8))"
    rosterSheet.getRange(i,columnResurrectionFormula).setValue(resFormula)
  
    // Sign off that everything has worked correctly
    var diagArray = [ [Utilities.formatDate(new Date(), "GMT", "yyyy-MM-dd HH:mm:ss"), 'Success', response["data"]["name"]] ]
    rosterSheet.getRange(i,columnCompletedDatetime,1,3).setValues(diagArray)
  
    return 'done';
  }