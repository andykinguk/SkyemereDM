function getJsonResponse(rosterSheet, pulledCharLink,i) {
  
    // If in play, start processing. Record the "Datetime Attempted" cell. 
    var currTime = Utilities.formatDate(new Date(), "GMT", "yyyy-MM-dd HH:mm:ss");
    rosterSheet.getRange(i,columnAttemptedDatetime).setValue(currTime)
    
    // Is this link valid? Check it's a proper ddb.ac link
    if (pulledCharLink.includes('ddb.ac',0) < 1) {
      recordStatus(i,'Fail - Link Invalid',rosterSheet)
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
      recordStatus(i,"Fail - Response Not Received",rosterSheet)
      var log = "fail"
      return log
    } 
    
    // The response is HTTP. We need JSON so parse it.
    var responseText = JSON.parse(response.getContentText())
    
    // Do we actually have a response? Check it.
    if (responseText.length < 1) {
      recordStatus (i,"Fail - Response Invalid",rosterSheet)
      var log = 'fail'
      return log
    }
    
    // Does the response ring as "true"? This blocks stuff like character deletion.
    if (responseText["success"] == 'false') {
      recordStatus (i,"Fail - Character Info not available",rosterSheet)
      var log = 'fail'
      return log
    }
    
    // If we're this far, great! Return the JSON response.
    return responseText
  }