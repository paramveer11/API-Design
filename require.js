var CLIENT_ID = '742818722171-lavakgg8sc54q277tvdg4siao891qe26.apps.googleusercontent.com';//Respective ClientID should be mentioned
  var SCOPES_GA = ["https://www.googleapis.com/auth/analytics.readonly"];
  var SCOPES_GTM = ["https://www.googleapis.com/auth/tagmanager.readonly"];
  var JSONGA = [];
  var JSONGTM = [];

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
//Listing All Acount Details of the user in GA
function listAccountsGa() {
  var request = gapi.client.analytics.management.accounts.list();
  request.execute(printAccountsGa);
  console.log("Array",JSONGA);
}
//Listing All Acount Details of the user in GTM
function listAccountsGtm() {
  var request = gapi.client.tagmanager.accounts.list();
  request.execute(printAccountsGtm);
}

function printAccountsGa(results) {
  if (results && !results.error) {
    var accounts = results.items;
    for (var i = 0, account; account = accounts[i]; i++) {
      //console.log('Account Id: ' + account.id);
      listProperties(account.id);
      //console.log('Account Name: ' + account.name);
    }
  }
  csvConverterGA(JSONGA);
}

function printAccountsGtm(results) {
    console.log("result is",results);
    if (results && !results.error) {
    var accounts = results.accounts;
    console.log(accounts);
    for (var i = 0, account; account = accounts[i]; i++) {
      //console.log('Account Id: ' + account.accountId);
      listContainers(account.accountId);
      //console.log('Account Name: ' + account.name);
    }
  }
}

function listProperties(accountID){
  var request = gapi.client.analytics.management.webproperties.list({
    'accountId': accountID
  });
  request.execute(printProperties);
}

function printProperties(results){
  if (results && !results.error) {
    var properties = results.items;
    var tempObj={};
    //console.log(properties[0].accountId);
    $.each(properties,function(element){
      //console.log(properties[element].accountId);
      tempObj={
        'AccountID':properties[element].accountId,
        'PropertyID':properties[element].id,
        'Name':properties[element].name
      };
      console.log(element);
      JSONGA.push(tempObj);
    })
 } 
}


function listContainers(accountID){
  console.log("accountID for containers",accountID);
  var request = gapi.client.tagmanager.accounts.containers.list({
    'accountId' : accountID
  });
  request.execute(printContainers);
}

function printContainers(results){
  if(results && !results.error){
    var containers = results.containers;
    for(var i = 0 , container; container = containers[i] ; i++){
      console.log('ContainerId:', container.containerId);
      console.log("PublicId: ", container.publicId);
    }
  }
}


function csvConverterGA(array){
  var jsonObjects = JSON.stringify(array);
  console.log("JSON",jsonObjects);
   var result = '';
   array = JSON.parse(jsonObjects);
   //console.log(array);
      array.forEach(function(k,i){
      result += k.AccountID + "," + k.PropertyID + "," + k.Name + "\r\n";
      console.log(result)
    });
   
    console.log("convert",result);

    //window.open('data:text/csv;charset=utf-8,' + escape(result));
}


window.onload = function(){
  var el = document.getElementById('auth-button-ga');
  el.addEventListener('click', authorizeGa);
  var elt = document.getElementById("auth-button-gtm");
  elt.addEventListener('click', authorizeGtm);
}


