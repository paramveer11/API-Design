//Respective ClientID should be mentioned,Replace it with a new clientID obtained from console.developers.google.com
var CLIENT_ID = '806264380803-b3p93b9804hf2lt53n96lbp21a7got2h.apps.googleusercontent.com';
  var SCOPES_GA = ["https://www.googleapis.com/auth/analytics.readonly"];
  var SCOPES_GTM = ["https://www.googleapis.com/auth/tagmanager.readonly"];
  var JSONGA = [];
  var JSONGTM = [];
  var count = 0;
  var i = 0;
  var j = 0;

//Function to Authorize user for accessing Google Analytics 
  function authorizeGa(event) {
    var useImmdiate = event ? false : true;
    var authData = {
      client_id: CLIENT_ID,
      scope: SCOPES_GA,
      immediate: useImmdiate
    };

    gapi.auth.authorize(authData, function(response) {
      var authButton = document.getElementById('auth-button-ga');
      if (response.error) {
        authButton.hidden = false;
      }
      else {
        authButton.hidden = true;
        queryAccountsGa();
      }
    });
  }

//Function to Authorize user for accessing Google Tag Manager
  function authorizeGtm(event) {
    var useImmdiate = event ? false : true;
    var authData = {
      client_id: CLIENT_ID,
      scope: SCOPES_GTM,
      immediate: useImmdiate
    };

    gapi.auth.authorize(authData,function(response) {
      var authButton = document.getElementById("auth-button-gtm");
      if (response.error) {
        authButton.hidded = false;
      }
      else{
        authButton.hidden = true;
        queryAccountsGtm();
      }
    });
  }

//Once Authorization This Function is called for Querying the respective accounts in GA
function queryAccountsGa() {
  gapi.client.load('analytics', 'v3').then(function() {
    gapi.client.analytics.management.accounts.list().then(listAccountsGa);
  });
}

//Once Authorization This Function is called for Querying the respective accounts in GTM
function queryAccountsGtm(){
  gapi.client.load('tagmanager', 'v1').then(function() {
    gapi.client.tagmanager.accounts.list().then(listAccountsGtm);
  });
}

//Listing All Acount Details of the user in GA..
function listAccountsGa() {
  var request = gapi.client.analytics.management.accounts.list();
  request.execute(printAccountsGa);  
}

//Listing All Acount Details of the user in GTM..
function listAccountsGtm() {
  var request = gapi.client.tagmanager.accounts.list();
  request.execute(printAccountsGtm);
}

//Printing Accounts of GA as per the AccountID which is a parameter accepting results as arguments...
function printAccountsGa(results) {
  if (results && !results.error) {
    var accounts = results.items;
    var account;
    for ( i = 0,account; account = accounts[i]; i++) {
      listProperties(account.id);
    }
  }  
}

//Printing Accounts of GTM as per the AccountID which is a parameter accepting results as arguments...
function printAccountsGtm(results) {
    if (results && !results.error) {
    var accounts = results.accounts;
    var account;
    count = 0;
    for ( j = 0, account; account = accounts[j]; j++) {
      listContainers(account.accountId);
    }
  }
}

//Listing properties of GA linked to the particular accountID which is passed as argument
function listProperties(accountID){
  var request = gapi.client.analytics.management.webproperties.list({
    'accountId': accountID
  });
  request.execute(printProperties);
}

//Printing properties of GA iterating over different properties of the accountID
function printProperties(results){
  count++;
  if (results && !results.error) {
    var properties = results.items;
    if(properties.length > 0){
      var tempObj={};
    $.each(properties,function(element){
      tempObj={
        'AccountID':properties[element].accountId,
        'PropertyID':properties[element].id,
        'Name':properties[element].name
      };
      JSONGA.push(tempObj);//Push the required properties to a global array
    })
  }    
 }
 if (count == i){
  csvConverterGA(JSONGA);//Pass this to a function which converts it to a CSV
 } 
}

//Listing containers of GTM linked to the particular accountID which is passed as argument
function listContainers(accountID){
  var request = gapi.client.tagmanager.accounts.containers.list({
    'accountId' : accountID
  });
  request.execute(printContainers);
}

//Printing container properties of GTM iterating over different container properties of the accountID
function printContainers(results){
  count++;
  if(results && !results.error){
    var containers = results.containers;
    var tempObj = {};
    $.each(containers,function(element){
      tempObj={
        'AccountID':containers[element].accountId,
        'ContainerID':containers[element].containerId,
        'PublicID':containers[element].publicId
      };
      JSONGTM.push(tempObj);
    })    
  }
  if(count == j){
    csvConverterGTM(JSONGTM);
  }
}

//Function to get GA properties in a CSV
function csvConverterGA(array){
  var jsonObjects = JSON.stringify(array);
  var result = '';
  array = JSON.parse(jsonObjects);
  var headers = ["AccountID","PropertyID","Name"].join(",");
  result = headers + "\r\n";
  array.forEach(function(k,i){
      result += k.AccountID + "," + k.PropertyID + "," + k.Name + "\r\n";
    });   

    window.open('data:text/csv;charset=utf-8,' + escape(result));
}

//Function to get GTM properties in a CSV
function csvConverterGTM(array){
  var jsonObjects = JSON.stringify(array);
  var result = '';
  array = JSON.parse(jsonObjects);
  var headers = ["AccountID","ContainerID","PublicID"].join(",");
  result = headers + "\r\n";
  array.forEach(function(k,i){
    result += (k.AccountID + "," + k.ContainerID + "," + k.PublicID + "\r\n");
  });

  window.open("data:text/csv;charset=utf-8," + escape(result));
}

window.onload = function(){
  var el = document.getElementById('auth-button-ga');
  el.addEventListener('click', authorizeGa);
  var elt = document.getElementById("auth-button-gtm");
  elt.addEventListener('click', authorizeGtm);
}


