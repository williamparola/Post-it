let fs = require("fs");
var data = new Date();

function writeJSON(filePath, data) {
  fs.writeFile(filePath, JSON.stringify(data), function(err) {
    if (err) {
      console.log("Error");
    } else {
      console.log("Written succesfully");
    }
  });
}

function dataString() {
  return data.getDate() + "/" + (data.getMonth() + 1) + "/" + data.getFullYear();
}

function changeColorMode(sessionid, accountPath) {
  let accountData = readJSON(accountPath);
  let trov = false;
  let i = 0;
  
  do {
    if (accountData[i].utente == sessionid) {
      trov = true;
      accountData[i].impostazioni.darkMode = !accountData[i].impostazioni.darkMode;
      console.log(accountData[i].impostazioni.darkMode)
    }
    i++
  } while (!trov && i < accountData.length)
  
  writeJSON(accountPath, accountData);
}

function isDarkMode(sessionid, accountPath) {
  let accountData = readJSON(accountPath);
  let trov = false;
  let i = 0;
  do {
    if (accountData[i].utente == sessionid) {
      trov = true;
      return accountData[i].impostazioni.darkMode;
    }
    i++
  } while (!trov && i < accountData.length)
}

function countCharacters(stringa) {
  return stringa.length;
}

function readJSON(filePath) {
  var dataReturn;
  dataReturn = fs.readFileSync(filePath, { encoding: 'utf8' }, (err, data) => {
    if (err) {
      return undefined;
    } else {
      return data;
    }
  })
  return JSON.parse(dataReturn);
}


module.exports = { readJSON, writeJSON, dataString, countCharacters, changeColorMode, isDarkMode };