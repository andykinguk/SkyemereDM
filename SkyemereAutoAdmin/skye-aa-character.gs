function logCharacter(arrayTask,i){

    var rosterLastRow = rosterSheet.getLastRow();
    var k = rosterLastRow + 1
    var newCharArray = [ [rosterLastRow, arrayTask[0][columnNewCharName-1], "=VLOOKUP(D" + k + ",NameLookup!A:B,2,FALSE)", arrayTask[0][columnPerson-1], arrayTask[0][columnNewCharLink-1], "Active"  ] ]
  
    rosterSheet.getRange(k,1,1,6).setValues(newCharArray)
  
    SkyemereDDBintegration.updateRosterRow(rosterSheet,k)
  
    updateCharacterList();
  
    return 20
  }
  
  function updateCharacterList() {
    var characterListValues = activeCharListSheet.getRange(2, 3, activeCharListSheet.getMaxRows() - 1).getValues();
    var characterListArray = [];
  
    // convert the array ignoring empty cells
    for(var i = 0; i < characterListValues.length; i++)   
      if(characterListValues[i][0] != "")
        characterListArray[i] = characterListValues[i][0];
  
    // populate the drop-down with the array data
    rosterCharacterList.setChoiceValues(characterListArray);
    
  }