// DM Menu
function createMenu() {
    SpreadsheetApp.getUi()
        .createMenu('Skyemere DMs')
        .addItem('Link to D&DBeyond', 'updateRosterHandler')
        .addItem('Refresh Deadpool', 'updateDeadpoolForm')
        .addToUi();
  }
  
  function getSheetById(id) {
    return SpreadsheetApp.getActive().getSheets().filter(
      function(s) {return s.getSheetId() === id;}
    )[0];
  }