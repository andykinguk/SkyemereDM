function logKickstarter(arrayTask,i){

  var kickstarterLastRow = kickstarterSheet.getLastRow();
  var o = kickstarterLastRow + 1
  var arrayKickstarter = [ [ arrayTask[0][0], arrayTask[0][columnExistingChar-1], arrayTask[0][columnKickstarter-1], arrayTask[0][columnKickstarterCost-1], "=SUMIF($C$2:$C" + o + ",$C" + o + ",$D$2:$D" + o + ")", "=VLOOKUP($C" + o + ",'KickstarterStretchGoals-Full'!$B:$E,4,FALSE)-$E" + o , "=IF(F" + o + "=0,C" + o + ",\"\")", "=IF(G" + o + "<>\"\",A" + o + ",\"\")" ] ]
  
  //Timestamp	Contributor	Kickstarter	Amount	Progress 	Remaining Completion  Date
  kickstarterSheet.getRange(kickstarterLastRow+1,1,1,8).setValues(arrayKickstarter)
  var arrayKickstarterValues = kickstarterSheet.getRange(kickstarterLastRow+1,1,1,8).getValues();

  postKickstarterToDiscord(arrayKickstarterValues);
  updateKickstarterList();

  return 50
}

function updateKickstarterList() {

  var kickstarterListValues = activeKickstarterListSheet.getRange(2, 2, activeKickstarterListSheet.getMaxRows() - 1).getValues();
  var kickstarterListArray = [];

  // convert the array ignoring empty cells
  for(var i = 0; i < kickstarterListValues.length; i++)   
    if(kickstarterListValues[i][0] != "")
      kickstarterListArray[i] = kickstarterListValues[i][0];

  // populate the drop-down with the array data
  kickstarterList.setChoiceValues(kickstarterListArray);
}