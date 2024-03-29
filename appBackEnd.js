require([
    "esri/tasks/support/Query",
    "esri/tasks/QueryTask",
    "esri/layers/FeatureLayer",
    "esri/tasks/support/AttachmentQuery",
    "esri/geometry/Point"
  ], function(Query,QueryTask,FeatureLayer,AttachmentQuery, Point) {

  var queryTask = new QueryTask({
      url:
        "https://services9.arcgis.com/9CpmhHxB8FqduRyJ/arcgis/rest/services/Map1/FeatureServer/0"
    });

    var query1 = new Query();
    query1.outFields = ["*"];
    query1.where = "Status = 'Pending'";
    query1.returnGeometry = true;

    var polesLayer = new FeatureLayer({
      url: "https://services9.arcgis.com/9CpmhHxB8FqduRyJ/arcgis/rest/services/Arl_SWF_WFL1/FeatureServer/0"
  });

  var appsLayer= new FeatureLayer({
    url: "https://services9.arcgis.com/9CpmhHxB8FqduRyJ/arcgis/rest/services/Map1/FeatureServer/0"
});
    var appfeatures
    var csvdata

    function selectPole() {

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

    function showpoleResults(result) {
      document.getElementById('edit_pID').innerHTML="Application for Pole: ";
      document.getElementById('edit_MLA').value="";
      document.getElementById('edit_FN').value="";
      document.getElementById('edit_LN').value="";
      document.getElementById('edit_co').value="";
      document.getElementById('edit_add').value="";
      document.getElementById('edit_city').value="";
      document.getElementById('edit_state').value="";
      document.getElementById('edit_zip').value="";
      document.getElementById('edit_email').value="";
      document.getElementById('edit_phone').value="";
      document.getElementById('edit_provider').value="";
      document.getElementById('edit_freq').value="";
      document.getElementById('edit_desc').value="";
      document.getElementById('edit_Date').innerHTML="";
      document.getElementById('TEO').value="";
      document.getElementById('MLASelect').value="";
      document.getElementById('DTS').innerHTML="<option> </option>";
      document.getElementById('edit_elev').value="";
      var results = result;

      var featureLen=results.features.length

      if (featureLen === 0) {
        console.log('No Features')
        return;
      }
      else{
        appfeatures=results.features
      for (var i=0; i < featureLen; i++){

      var pID = results.features[i].attributes["poleID"];
      var firstname = results.features[i].attributes["firstName"];
      var lastname = results.features[i].attributes["lastName"];
      var email = results.features[i].attributes["email"];
      var objToday= formatDate(new Date(results.features[i].attributes["dateSubmitted"]));
        
      var poleTab = document.getElementById("poleTable");

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
      var mla = appfeatures[i].attributes["MLA"];
      var firstname = appfeatures[i].attributes["firstName"];
      var lastname = appfeatures[i].attributes["lastName"];
      var company = appfeatures[i].attributes["company"];
      var address = appfeatures[i].attributes["address"];
      var city = appfeatures[i].attributes["city"];
      var state = appfeatures[i].attributes["state"];
      var zip = appfeatures[i].attributes["zip"];
      var email = appfeatures[i].attributes["email"];
      var phone = appfeatures[i].attributes["phone"];
      var provider = appfeatures[i].attributes["provider"];
      var frequency = appfeatures[i].attributes["frequency"];
      var description = appfeatures[i].attributes["description"];
      var today= formatDate(new Date(appfeatures[i].attributes["dateSubmitted"]));
      var TEO = appfeatures[i].attributes["TEO_num"];
      var REAL = appfeatures[i].attributes["MLA_verify"];
      var DTS = appfeatures[i].attributes["handhole"];
      var Elevation =appfeatures[i].attributes["elevation"];

      document.getElementById('edit_pID').innerHTML="Application for Pole: "+pID;
      document.getElementById('edit_MLA').value=mla;
      document.getElementById('edit_FN').value=firstname;
      document.getElementById('edit_FN').size=firstname.length;
      document.getElementById('edit_LN').value=lastname;
      document.getElementById('edit_LN').size=lastname.length;
      document.getElementById('edit_co').value=company;
      document.getElementById('edit_co').size=company.length;
      document.getElementById('edit_add').value=address;
      document.getElementById('edit_add').size=address.length;
      document.getElementById('edit_city').value=city;
      document.getElementById('edit_city').size=city.length;
      document.getElementById('edit_state').value=state;
      document.getElementById('edit_state').size=2;
      document.getElementById('edit_zip').value=zip;
      document.getElementById('edit_email').value=email;
      document.getElementById('edit_email').size=email.length;
      document.getElementById('edit_phone').value=phone;
      document.getElementById('edit_provider').value=provider;
      document.getElementById('edit_freq').value=frequency;
      document.getElementById('edit_desc').value=description;
      document.getElementById('edit_Date').innerHTML=today;
      document.getElementById('TEO').value=TEO;
      document.getElementById('MLASelect').value=REAL;
      document.getElementById('DTS').value=DTS;
      document.getElementById('edit_elev').value=Elevation;
      document.getElementById('DTS').innerHTML="<option> </option>";
      
      console.log('click');

      findHandholes();

      var attachQ = new AttachmentQuery({
        objectIds:[editObj.attributes["OBJECTID"]]
      });

      appsLayer
        .queryAttachments(attachQ)
        .then(function(result){
          var url=result[editObj.attributes["OBJECTID"]][0]["url"];
          document.getElementById("siteplan").href=url;
          console.log(result)
        })
        .catch(rejectedPromise);
    };
    function findHandholes(){
      var queryTask3 = new QueryTask({
        url: "https://services9.arcgis.com/9CpmhHxB8FqduRyJ/arcgis/rest/services/Arl_SWF_WFL1/FeatureServer/1/"
      });
      var query3 = new Query();
      query3.outFields=["*"];
      query3.geometry=new Point(editObj.geometry);
      console.log(editObj.geometry);
      query3.distance=50;
      query3.units="feet"
      query3.returnGeometry=true;
    
      queryTask3
        .execute(query3)
        .then(function(results){showhandholes(results)})
        .catch(function(error) {
          console.log("===============================================");
          console.error(
            "[ handhole ] FAILURE: ",
            error.code,
            error.name,
            error.message
          );
          console.log("error = ", error);})
    }; 
    var hhSelector= document.getElementById("DTS");
    function showhandholes(result) {
      var results = result;

      console.log('queryexecuted')
      var featureLen=results.features.length

      if (featureLen === 0) {
        console.log('No Features')
        return;
      }
      else{
      for (var i=0; i < featureLen; i++){

      var hh = results.features[i].attributes["poleID"];

      var opt = document.createElement("option");

      opt.value = hh;
      opt.text=hh
    
      hhSelector.add(opt,null)
    }};};

    document.onload=selectPole()

function editApp(){
  console.log("editing");
      editObj.attributes["MLA"]=document.getElementById('edit_MLA').value;
      editObj.attributes["firstName"]=document.getElementById('edit_FN').value;
      editObj.attributes["lastName"]=document.getElementById('edit_LN').value;
      editObj.attributes["company"]=document.getElementById('edit_co').value;
      editObj.attributes["address"]=document.getElementById('edit_add').value;
      editObj.attributes["city"]=document.getElementById('edit_city').value;
      editObj.attributes["state"]=document.getElementById('edit_state').value;
      editObj.attributes["zip"]=document.getElementById('edit_zip').value;
      editObj.attributes["email"]=document.getElementById('edit_email').value;
      editObj.attributes["phone"]=document.getElementById('edit_phone').value;
      editObj.attributes["provider"]=document.getElementById('edit_provider').value;
      editObj.attributes["frequency"]=document.getElementById('edit_freq').value;
      editObj.attributes["description"]=document.getElementById('edit_desc').value;
      editObj.attributes["TEO_num"]=document.getElementById('TEO').value;
      editObj.attributes["MLA_verify"]=document.getElementById('MLASelect').value;
      editObj.attributes["handhole"]=document.getElementById('DTS').value;
      editObj.attributes["elevation"]=document.getElementById("edit_elev").value;

appsLayer
  .applyEdits({updateFeatures:[editObj]})
  .then(function(editsResult){console.log(document.getElementById('edit_co').value);
  console.log(editObj.attributes["company"]);
  })
  .catch(function(error) {
        console.log("===============================================");
        console.error(
          "[ applyEdits ] FAILURE: ",
          error.code,
          error.name,
          error.message
        );
        console.log("error = ", error);})
};

function makeAvailable() {
  var queryTask2 = new QueryTask({
    url:
      "https://services9.arcgis.com/9CpmhHxB8FqduRyJ/arcgis/rest/services/Arl_SWF_WFL1/FeatureServer/0"
  });
  console.log(pID)
  var query2 = new Query();
    query2.outFields = ["Status","OBJECTID"];
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
    .then(function(editsResult){document.location.replace("SWFPermit - Backend.html")})
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
  editObj.attributes["Status"]="Rejected"
  const rejectfeats=editObj;
console.log({updateFeatures:[rejectfeats]});
appsLayer
  .applyEdits({updateFeatures:[rejectfeats]})
  .then(function(editsResult){makeAvailable()})
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
document.getElementById("Btn-edit").addEventListener("click", editApp);

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
      if (link.download !== undefined) {
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

function filterApps(){
  var appStat=document.getElementById("AppStatus").value;
  document.getElementById("poleTable").innerHTML=`<tr>
  <th>PoleID</th>
  <th>FirstName</th>
  <th>LastName</th>
  <th>Email</th>
  <th>Date</th>
</tr>`
  query1.where="Status = '"+appStat+"'";
  document.getElementById("Needed").style.visibility='hidden';
  if (appStat=="Pending"){
    document.getElementById("whatNeeded").value="";
    document.getElementById("Needed").style.visibility='visible';
  }
  else if (appStat=="All"){
    query1.where="OBJECTID>0";
  }
  selectPole()
  };

  function filterActs(){
    var actStat=document.getElementById("whatNeeded").value;
    document.getElementById("poleTable").innerHTML=`<tr>
    <th>PoleID</th>
    <th>FirstName</th>
    <th>LastName</th>
    <th>Email</th>
    <th>Date</th>
  </tr>`
    if (actStat!==""){
    if (actStat=="MLA"){
      query1.where="Status = 'Pending' AND MLA_verify = ''";
    }
    else if (actStat=="TE&O"){
      query1.where="Status = 'Pending' AND TEO_num = ''";
    }
    else if (actStat=="DTS"){
      query1.where="Status = 'Pending' AND handhole = ''";
    }
    else{
      query1.where="Status = 'Pending' AND handhole NOT LIKE '' AND MLA_verify NOT LIKE '' AND TEO_num NOT LIKE ''";
    }
  }
    selectPole()
    };
  document.getElementById("AppStatus").addEventListener("change", filterApps);
  document.getElementById("whatNeeded").addEventListener("change", filterActs);
  });