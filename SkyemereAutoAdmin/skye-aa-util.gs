// DM Menu
function createMenu() {
  SpreadsheetApp.getUi()
      .createMenu('Skyemere DMs')
      .addItem('Refresh Forms - Characters', 'updateCharacterList')
      .addItem('Refresh Forms - Kickstarter', 'updateKickstarterList')
      .addItem('Process Tasks', 'processTasks')
      .addToUi();
}

function getSheetById(spreadsheet, id) {
  return spreadsheet.getSheets().filter(
    function(s) {return s.getSheetId() === id;}
  )[0];
}

function getIdFromUrl(url) { return url.match(/[-\w]{25,}/); }
