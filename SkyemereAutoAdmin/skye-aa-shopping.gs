function logShopping(arrayTask,i){
  
    var shoppingLastRow = shoppingSheet.getLastRow();
    var newShopArray = [ [arrayTask[0][0], arrayTask[0][columnExistingChar-1], arrayTask[0][columnPurchaseItem-1], arrayTask[0][columnPurchaseCost-1], arrayTask[0][columnSaleItem-1], arrayTask[0][columnSaleCost-1],  ] ]
  
    shoppingSheet.getRange(shoppingLastRow+1,1,1,6).setValues(newShopArray)
  
    return 10
  }