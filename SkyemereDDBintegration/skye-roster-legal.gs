function checkLegality(response) {

    // Get rid of items & extras, we don't care and they're gonna conflict with our approved sources all over the place
    delete response.data.inventory;
    delete response.data.creatures;
    delete response.data.background;
  
    var legalStatus = "Issue: "
  
    // Are stats using standard array?
    var abilityScoreType = response["data"]["configuration"]["abilityScoreType"]
    switch (abilityScoreType) { 
      case 2 :
        legalStatus += "Ability Scores set to Manual/Rolled. "
        break;
      case 3 :
        legalStatus += "Ability Scores set to Point Buy. "
        break;
    }
  
    var characterValues = JSON.stringify(response.data.characterValues)
  
    // Proficiencies
    if (checkTypeID(characterValues, 32) == true)
      legalStatus += "Illegal proficiency - armour. "
  
    if (checkTypeID(characterValues, 33) == true)
      legalStatus += "Illegal proficiency - weapon. "
  
    if (checkTypeID(characterValues, 34) == true)
      legalStatus += "Illegal proficiency - tool. "
  
    if (checkTypeID(characterValues, 35) == true)
      legalStatus += "Illegal proficiency - language. "
  
    // generic custom
    if (response.data.customProficiencies.hasOwnProperty(0) == true)
      legalStatus += "Custom proficiencies used. "
  
    // Armour Class
    if (checkTypeID(characterValues, 1) == true)
      legalStatus += "Illegal AC - overridden AC. "
  
    if (checkTypeID(characterValues, 2) == true)
      legalStatus += "Illegal AC - Additional magic bonus. "
  
    if (checkTypeID(characterValues, 3) == true)
      legalStatus += "Illegal AC - Additional misc bonus. "
  
    if (checkTypeID(characterValues, 4) == true)
      legalStatus += "Illegal AC - overridden Base Armour + DEX. "
  
    // Passive Senses
    if (checkTypeID(characterValues, 5) == true)
      legalStatus += "Illegal Passive Perception. "
  
    if (checkTypeID(characterValues, 6) == true)
      legalStatus += "Illegal Passive Insight. "
  
    if (checkTypeID(characterValues, 7) == true)
      legalStatus += "Illegal Passive Investigation. "    
  
    // Skills
    if (checkTypeID(characterValues, 23) == true)
      legalStatus += "Illegal Skills - overridden stat bonus. "
  
    if (checkTypeID(characterValues, 24) == true)
      legalStatus += "Illegal Skills - Additional misc bonus. "
  
    if (checkTypeID(characterValues, 25) == true)
      legalStatus += "Illegal Skills - Additional magic bonus. "
  
    if (checkTypeID(characterValues, 26) == true)
      legalStatus += "Illegal Skills - custom proficiency. "
  
    if (checkTypeID(characterValues, 27) == true)
      legalStatus += "Illegal Skills - overridden stat/skill pairing. "        
  
    // Saving Throws
    if (checkTypeID(characterValues, 38) == true)
      legalStatus += "Illegal Saves - overridden Saving Throw. "
  
    if (checkTypeID(characterValues, 39) == true)
      legalStatus += "Illegal Saves - Additional misc bonus. "
  
    if (checkTypeID(characterValues, 40) == true)
      legalStatus += "Illegal Saves - Additional magic bonus. "
  
    if (checkTypeID(characterValues, 41) == true)
      legalStatus += "Illegal Saves - Additional proficiency. "
      
    // check for custom stats (override)
    var overrideStatTotal = 0
    for (x in response["data"]["overrideStats"]) {
      overrideStatTotal += response["data"]["overrideStats"][x]["value"]
    } 
  
    if (overrideStatTotal != 0)
      legalStatus += "Stats have been overridden. "
  
    // check for custom stats (bonus)
    var bonusStatTotal = 0
    for (x in response["data"]["bonusStats"]) {
      bonusStatTotal += response["data"]["bonusStats"][x]["value"]
    } 
  
    if (bonusStatTotal != 0)
      legalStatus += "Stats have custom bonuses. "
  
    // check for custom speeds
    var speedTotal = 0
    for (x in response["data"]["customSpeeds"]) {
      speedTotal += response["data"]["customSpeeds"][x]["distance"]
    } 
  
    if (speedTotal != 0)
      legalStatus += "Custom Speeds used. "
  
    // check for custom senses
    var sensesTotal = 0
    for (x in response["data"]["customSenses"]) {
      sensesTotal += response["data"]["customSenses"][x]["distance"]
    } 
  
    if (sensesTotal != 0)
      legalStatus += "Custom Senses used. "    
  
    if (response["data"]["preferences"]["useHomebrewContent"] == false)
      legalStatus += "Homebrew content is not enabled. "
  
    if (response["data"]["preferences"]["progressionType"] == 1)
      legalStatus += "Experience is set to Milestone. "
  
    if (response["data"]["preferences"]["enforceFeatRules"] == false)
      legalStatus += "Feat Prerequisites are not enabled. "
  
    if (response["data"]["preferences"]["enforceMulticlassRules"] == false)
      legalStatus += "Multiclass Prerequisites are not enabled. "
  
    if (response["data"]["preferences"]["enableOptionalClassFeatures"] == true)
      legalStatus += "Optional Class Features are enabled. "
  
    if (response["data"]["preferences"]["enableOptionalOrigins"] == true)
      legalStatus += "Optional Origin Features are enabled. "
  
    // get all sourceIds from the response
    var charSheetSources = allNodes(response, 'sourceId');
  
    // get rid of any nulls
    charSheetSources = charSheetSources.filter(function( element ) {
      return element !== null;
    });
  
    // cross reference approved list
    var sourceStatus = approvedSourceChecker(charSheetSources)
    if (sourceStatus == false)
      legalStatus += "Content from unapproved sources in use. "
  
    // Final clean up if someone is squeaky clean
    if (legalStatus == "Issue: ")
      legalStatus = "Legal"
  
  return legalStatus;
  }
  
  function checkTypeID (characterValues, typeID) {
    // return true if issue is found
    var status = characterValues.includes("\"typeId\":" + typeID + ",") // this suggests an issue
    && !characterValues.includes("\"typeId\":" + typeID + ",\"value\":0,") // if this is true, no issue
    && !characterValues.includes("\"typeId\":" + typeID + ",\"value\":null,") // if this is true, no issue
  
    return status
  }
  
  function approvedSourceChecker (charSheetSources) {
    // basic rules - 1, phb - 2, ee - 4, scag - 13, volo - 15, xgte - 27, tortle - 28, mtof - 33, ggtr - 38, eber - 49, tcoe - 67
    var approvedSources = ([1,2,4,5,13,15,27,28,33,38,49,67])
    return charSheetSources.every(elem => approvedSources.includes(elem))
  }
  
  function allNodes(obj, key, array) {
    array = array || [];
    if ('object' === typeof obj) {
      for (let k in obj) {
        if (k === key) {
          array.push(obj[k]);
        } else {
          allNodes(obj[k], key, array);
        }
      }
    }
    return array;
  }
  