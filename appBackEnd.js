require([
    "esri/tasks/support/Query",
    "esri/tasks/QueryTask",
    "esri/layers/FeatureLayer"
  ], function(Query,QueryTask,FeatureLayer) {

  var queryTask = new QueryTask({
      url:
        "https://services9.arcgis.com/9CpmhHxB8FqduRyJ/arcgis/rest/services/Map1/FeatureServer/0"
    });

    var query1 = new Query();
    query1.outFields = ["*"];

    var polesLayer = new FeatureLayer({
      url: "https://services9.arcgis.com/9CpmhHxB8FqduRyJ/arcgis/rest/services/Arl_SWF_WFL1/FeatureServer/0"
  });

  var appsLayer= new FeatureLayer({
    url: "https://services9.arcgis.com/9CpmhHxB8FqduRyJ/arcgis/rest/services/Map1/FeatureServer/0"
});
    var appfeatures
    var csvdata

    function selectPole() {
      // Set the search text to the value of the input box
      query1.where = "OBJECTID>0";

      queryTask
        .execute(query1)
        .then(showpoleResults)
        .catch(rejectedPromise)
    }

    function formatDate(dateval){
        var objToday=dateval
        domEnder = function() { var a = objToday; if (/1/.test(parseInt((a + "").charAt(0)))) return "th"; a = parseInt((a + "").charAt(1)); return 1 == a ? "st" : 2 == a ? "nd" : 3 == a ? "rd" : "th" }(),
        dayOfMonth = today + ( objToday.getDate() < 10) ? objToday.getDate() + domEnder : objToday.getDate() + domEnder,
        months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'),
        curMonth = months[objToday.getMonth()],
        curYear = objToday.getFullYear(),
        curHour = objToday.getHours() > 12 ? objToday.getHours() - 12 : (objToday.getHours() < 10 ? "0" + objToday.getHours() : objToday.getHours()),
        curMinute = objToday.getMinutes() < 10 ? "0" + objToday.getMinutes() : objToday.getMinutes(),
        curSeconds = objToday.getSeconds() < 10 ? "0" + objToday.getSeconds() : objToday.getSeconds(),
        curMeridiem = objToday.getHours() > 12 ? "PM" : "AM";
        var today =   curMonth + " " + dayOfMonth + ", " + curYear+ " " +curHour + ":" + curMinute + "." + curSeconds + curMeridiem;
        return today
    }

    // Executes when the promise from find.execute() resolves
    function showpoleResults(result) {
      var results = result;
      console.log(results)
      // Clear the cells and rows of the table to make room for new results
      console.log('queryexecuted')
      var featureLen=results.features.length
      // If no results are returned from the task, notify the user
      if (featureLen === 0) {
        console.log('No Features')
        return;
      }
      else{
        appfeatures=results.features
      for (var i=0; i < featureLen; i++){
      // Loop through each result in the response and add as a row in the table
      var pID = results.features[i].attributes["poleID"];
      var firstname = results.features[i].attributes["firstName"];
      var lastname = results.features[i].attributes["lastName"];
      var email = results.features[i].attributes["email"];
      var objToday= formatDate(new Date(results.features[i].attributes["dateSubmitted"]));
        
      

      var poleTab = document.getElementById("poleTable");
      // Add each resulting value to the table as a row
      var row = poleTab.insertRow(-1)
      var col_id=row.insertCell(0);
      var col_fn=row.insertCell(1);
      var col_ln=row.insertCell(2);
      var col_e=row.insertCell(3);
      var col_d=row.insertCell(4);
    
      col_id.innerHTML=pID;
      col_fn.innerHTML=firstname;
      col_ln.innerHTML=lastname;
      col_e.innerHTML=email;
      col_d.innerHTML=objToday;
      
      row.addEventListener("click", expand)
    }};};
    var tab=document.getElementById('poleTable');
    tab.querySelectorAll('tr')
            .forEach(e => e.addEventListener("click", expand));

    function rejectedPromise(error) {
      console.error("Promise didn't resolve: ", error.message);
      loadingImg.style.visibility = "hidden";
      resultsTable.innerHTML = "<i>Error finding poles :(</i>";
    };
    
    var pID
    var editObj

    function expand(){
      var i=this.rowIndex-1;
      appdata=appfeatures;
      editObj=appfeatures[i];
      pID = appfeatures[i].attributes["poleID"];
      var firstname = appfeatures[i].attributes["firstName"];
      var lastname = appfeatures[i].attributes["lastName"];
      var email = appfeatures[i].attributes["email"];
      var today= formatDate(new Date(appfeatures[i].attributes["dateSubmitted"]));

      var poleID=document.getElementById('edit_pID');
      var FN=document.getElementById('edit_FN');
      var LN=document.getElementById('edit_LN');
      var E=document.getElementById('edit_email');
      var D=document.getElementById('edit_Date');
      poleID.innerHTML=pID;
      FN.innerHTML=firstname;
      LN.innerHTML=lastname;
      E.innerHTML=email;
      D.innerHTML=today;
      console.log('click');
    }
    document.onload=selectPole()
/////////////////////////////////////////////////////////////////////////////////////////////////
function makeAvailable() {
  var queryTask2 = new QueryTask({
    url:
      "https://services9.arcgis.com/9CpmhHxB8FqduRyJ/arcgis/rest/services/Arl_SWF_WFL1/FeatureServer/0"
  });
  console.log(pID)
  var query2 = new Query();
    query2.outFields = ["Status","OBJECTID"];
    // Set the search text to the value of the input box
    query2.where = "poleID = '" + pID + "'";

    queryTask2
      .execute(query2)
      .then(updateStatus)
      .catch(rejectedPromise)
  };

  function updateStatus(result){
    console.log(result)
  var updateObj=result.features[0]
  updateObj.attributes["Status"]="Available";
  const edits={updateFeatures:[updateObj]};
  polesLayer
    .applyEdits(edits)
    .then(function(editsResult){window.location.replace("SWFPermit - Backend.html")})
    .catch(function(error) {
        console.log("===============================================");
        console.error(
          "[ applyEdits ] FAILURE: ",
          error.code,
          error.name,
          error.message
        );
        console.log("error = ", error);
      });
    };

function deleteApp(){
  const deletefeats=editObj;
  makeAvailable();
console.log({deleteFeatures:[deletefeats]});
appsLayer
  .applyEdits({deleteFeatures:[deletefeats]})
  .catch(function(error) {
        console.log("===============================================");
        console.error(
          "[ applyEdits ] FAILURE: ",
          error.code,
          error.name,
          error.message
        );
        console.log("error = ", error);});  
};
document.getElementById("Btn-delete").addEventListener("click", deleteApp);

function csvButton(){
   exportToCsv('SWFPermitAppExport.csv',convertToCSV(appfeatures))
};

function exportToCsv(filename, rows) {
  var processRow = function (row) {
      var finalVal = '';
      for (var j = 0; j < row.length; j++) {
          var innerValue = row[j] === null ? '' : row[j].toString();
          if (row[j] instanceof Date) {
              innerValue = row[j].toLocaleString();
          };
          var result = innerValue.replace(/"/g, '""');
          if (result.search(/("|,|\n)/g) >= 0)
              result = '"' + result + '"';
          if (j > 0)
              finalVal += ',';
          finalVal += result;
      }
      return finalVal + '\n';
  };

  var csvFile = '';
  for (var i = 0; i < rows.length; i++) {
      csvFile += processRow(rows[i]);
  }

  var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
  if (navigator.msSaveBlob) { // IE 10+
      navigator.msSaveBlob(blob, filename);
  } else {
      var link = document.createElement("a");
      if (link.download !== undefined) { // feature detection
          // Browsers that support HTML5 download attribute
          var url = URL.createObjectURL(blob);
          link.setAttribute("href", url);
          link.setAttribute("download", filename);
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
      }
  }
}

function convertToCSV(feats){
  console.log(feats[0]["attributes"]);
var firstrow=Object.keys(feats[0]["attributes"]);
var dataarray=[firstrow];
var featureLen=feats.length;
var attributeLen=firstrow.length;
for (var i=0; i < featureLen; i++){
  var nextrow=[];
  for ( var k=0; k<attributeLen;k++){
    nextrow.push(feats[i].attributes[firstrow[k]])
  };
  dataarray.push(nextrow)
};
return dataarray;
};

document.getElementById("Btn-export").addEventListener("click", csvButton);

  });