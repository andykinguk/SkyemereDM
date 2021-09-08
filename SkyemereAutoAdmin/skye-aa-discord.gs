function postErrorToDiscord(message) {

  message = message || "An undisclosed error has happened with the automation stuff, " + AndyDiscordID + " your shit code is breaking again " + TearsDiscordID;
  
  var payload = JSON.stringify({content: message});

  var params = {
    headers: {
      'Content-Type': 'application/json'
    },
    method: "POST",
    payload: payload,
    muteHttpExceptions: true
  };

  var response = UrlFetchApp.fetch(discordAlertsUrl, params);

  Logger.log(response.getContentText());

}


function postKickstarterToDiscord(arrayKickstarterValues) {

  var message = arrayKickstarterValues[0][1] + " just contributed " + arrayKickstarterValues[0][3] + " gold to " + arrayKickstarterValues[0][2] + "! As of " + arrayKickstarterValues[0][0] + " a total of " + arrayKickstarterValues[0][4] + " gold has been spent on it,"
  
  if (arrayKickstarterValues[0][5] <= 0)
    message += " completing the project. " + DMsDiscordID + " will implement it shortly."
  else
    message += " with " + arrayKickstarterValues[0][5] + " gold left to go."

  var payload = JSON.stringify({content: message});

  var params = {
    headers: {
      'Content-Type': 'application/json'
    },
    method: "POST",
    payload: payload,
    muteHttpExceptions: true
  };

  var response = UrlFetchApp.fetch(discordMarketplaceUrl, params);

  Logger.log(response.getContentText());

}