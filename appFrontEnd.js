require([
    "esri/Map",
    "esri/Basemap",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/renderers/UniqueValueRenderer",
    "esri/tasks/support/Query",
    "esri/tasks/QueryTask",
    "esri/geometry/SpatialReference",
    "esri/geometry/Point",
    "esri/widgets/Search",
    "esri/Graphic",
    "esri/tasks/support/AttachmentQuery"
  ], function(Map, Basemap, MapView, FeatureLayer, UniqueValueRenderer, Query,QueryTask,SpatialReference,Point, Search, Graphic,AttachmentQuery) {

    document.getElementById("AppBody").style.visibility='hidden';
    function reSizeScreen(){
      var h = document.getElementById("viewDiv").clientHeight;
      var h80 = h-250;
      h80string=h80.toString();
      document.getElementById("appDiv").style.maxHeight=h80string+"px";
    };
    
      reSizeScreen();
      window.addEventListener("resize",reSizeScreen);

      var basemap = new Basemap({
        portalItem: {
          id: "cb855a7be8d64a2bb84ad5dea7a36d5c"  // WGS84 Streets Vector webmap
        }
      });

  var map = new Map({
    basemap: basemap
  });

  var view = new MapView({
    container: "viewDiv",
    map: map,
    center: [-77.085453,38.890389], // longitude, latitude
    zoom: 14
  });

  var searchWidget = new Search({
view: view
});
// Adds the search widget below other elements in
// the top left corner of the view
view.ui.add(searchWidget, {
position: "top-right",
index: 2
});
  
  function createFillSymbol(value, color) {
      return {
        value: value,
        symbol: {
          color: color,
          type: "simple-marker",
          style: "circle",
          outline: {
            style: "none"
          }
        },
        label: value
      };
    }
   var poleRenderer = {
      type: "unique-value",
      field: "Status",
      defaultSymbol: {type: "simple-marker"},
      uniqueValueInfos: [
        createFillSymbol("Available", "#1f9b3a"),
        createFillSymbol("Unavailable", "#c63636"),
      ]
    };

  var popupPoles = {
      "title": "{poleID}",
      "content": "<b>Status:</b> {Status}<br><b>Height:</b> {Height}<br><b>Type:</b> {Type}<br>"
    }

  var polesLayer = new FeatureLayer({
      url: "https://services9.arcgis.com/9CpmhHxB8FqduRyJ/arcgis/rest/services/Arl_SWF_WFL1/FeatureServer/0",
      renderer: poleRenderer,
      popupTemplate: popupPoles
  });
  var appsLayer = new FeatureLayer({
      url: "https://services9.arcgis.com/9CpmhHxB8FqduRyJ/arcgis/rest/services/Map1/FeatureServer/0"
  });
  
  map.add(polesLayer);

  var queryTask = new QueryTask({
      url:
        "https://services9.arcgis.com/9CpmhHxB8FqduRyJ/arcgis/rest/services/Arl_SWF_WFL1/FeatureServer/0"
    });

    var query1 = new Query();
    query1.outFields = ["poleID"]

    function selectPole() {
      // Set the search text to the value of the input box
      query1.where = "Status = 'Available'";

      queryTask
        .execute(query1)
        .then(showpoleResults)
        .catch(rejectedPromise)
    }

    var poleSelector= document.getElementById("poleSelect");

    // Executes when the promise from find.execute() resolves
    function showpoleResults(result) {
      var results = result;

      // Clear the cells and rows of the table to make room for new results
      console.log('queryexecuted')
      var featureLen=results.features.length
      // If no results are returned from the task, notify the user
      if (featureLen === 0) {
        console.log('No Features')
        return;
      }
      else{
      for (var i=0; i < featureLen; i++){
      // Loop through each result in the response and add as a row in the table
      var pID = results.features[i].attributes["poleID"];

      // Add each resulting value to the table as a row
      var opt = document.createElement("option");

      opt.value = pID;
      opt.text=pID
    
      poleSelector.add(opt,null)
    }};};

    document.onload=selectPole()
/////////////////////////////////////////////////////////////////////////////////////////////////
  view.on("double-click",function(){if (view.popup.selectedFeature==null){}
  else{document.getElementById("poleSelect").value=view.popup.selectedFeature.attributes.poleID;
 doFind()}})


    var loadingImg = document.getElementById("loading");

    var editObj

    var geom
    // Set parameters to only query the Counties layer by name
    var query = new Query();
    query.returnGeometry = true;
    query.outFields = ["Height","Status","Type","OBJECTID"]
    query.outSpatialReference=SpatialReference(102100)

    var highlightSelect
    view.on("pointer-down",function(){if (highlightSelect){highlightSelect.remove();}});

    // Executes on each button click
    function doFind() {
      if (document.getElementById("poleSelect").value == " "){return}
      else {
      loadingImg.style.visibility = "visible";
      // Set the search text to the value of the input box
      
      query.where = "poleID = '" + document.getElementById("poleSelect").value + "'";
  
      resultsTable.innerHTML = "";
      // The execute() performs a LIKE SQL query based on the provided text value
      // showResults() is called once the promise returned here resolves
      // find.execute(params).then(showResults, rejectedPromise);

      queryTask
        .execute(query)
        .then(showResults)
        .catch(rejectedPromise);
    };};

    var resultsTable = document.getElementById("tbl");

    // Executes when the promise from find.execute() resolves
    function showResults(result) {
      var results = result;

      // Clear the cells and rows of the table to make room for new results
      resultsTable.innerHTML = "";

      // If no results are returned from the task, notify the user
      if (results.features.length === 0) {
        resultsTable.innerHTML = "<i>No results found</i>";
        loadingImg.style.visibility = "hidden";
        return;
      }

      // Loop through each result in the response and add as a row in the table
      var height = results.features[0].attributes["Height"];
      var status = results.features[0].attributes["Status"];
      var type = results.features[0].attributes["Type"];
      editObj = results.features[0];
      geom = new Point({
        x:results.features[0].geometry["x"],
        y:results.features[0].geometry["y"],
        spatialReference: SpatialReference(102100)});

      // Add each resulting value to the table as a row
      var row1 = resultsTable.insertRow(0);
      var cell1 = row1.insertCell(0);
      var row2 = resultsTable.insertRow(1);
      var cell2 = row2.insertCell(0);
      var row3 = resultsTable.insertRow(2);
      var cell3 = row3.insertCell(0);

      cell1.innerHTML = "Height: " + height;
      cell2.innerHTML = "Status: " + status;
      cell3.innerHTML = "Type: " + type;
      view.popup.visible=true;
      view.popup.location=geom;
      view.popup.title=document.getElementById("poleSelect").value;
      view.popup.content="<span style='font-size:14px; color:#212529' id='popup'><b>Status:</b> "+status+"<br><b>Height:</b> "+height+"<br><b>Type:</b> "+type+"<br></span> <br/> Please double-click point to select pole in form.";
      view.whenLayerView(polesLayer)
          .then(function(layerView){
      if (highlightSelect) {
                highlightSelect.remove();
              }

              highlightSelect = layerView.highlight(
                editObj.attributes["OBJECTID"]
              );
          });
      
      //view.popup.content="<p style='font-size:14px'><b>Status:</b> "+status+"<br><b>Height:</b> "+height+"<br><b>Type:</b> "+type+"<br></p>"
      console.log("< style='font-size:14px'><b>Status:</b> "+status+"<br><b>Height:</b> "+height+"<br><b>Type:</b> "+type+"<br></p>");
      
      
      view.goTo({center:geom, zoom:20});

      loadingImg.style.visibility = "hidden";
    }

    // Executes each time the promise from find.execute() is rejected.
    function rejectedPromise(error) {
      console.error("Promise didn't resolve: ", error.message);
      loadingImg.style.visibility = "hidden";
      resultsTable.innerHTML = "<i>Error finding poles :(</i>";
    };

    function makeUnavailable() {
      editObj.attributes["Status"]="Unavailable";
      const edits={updateFeatures:[editObj]};
      polesLayer
        .applyEdits(edits)
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
    
    function checkform(){
      formElements=document.getElementsByClassName('form-control');
      formLen=formElements.length;
      console.log(formLen);
      ValidForm=0;
      for (var i=0; i<formLen; i++){
            validateField(formElements[i]);
        };
        console.log(ValidForm)
        return new Promise(function(resolve, reject){
          resolve(ValidForm)
        })
      };

      function SUBMIT(){
        checkform().then(function(result){
          if (result==0){
            submitApp()
          }
          else{
            console.log(result);
            document.getElementById('submit_error').style.visibility="visible"
          }
        })
      }

    function submitApp(){
      var objToday = new Date(),
        weekday = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'),
        dayOfWeek = weekday[objToday.getDay()],
        domEnder = function() { var a = objToday; if (/1/.test(parseInt((a + "").charAt(0)))) return "th"; a = parseInt((a + "").charAt(1)); return 1 == a ? "st" : 2 == a ? "nd" : 3 == a ? "rd" : "th" }(),
        dayOfMonth = today + ( objToday.getDate() < 10) ? '0' + objToday.getDate() + domEnder : objToday.getDate() + domEnder,
        months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'),
        curMonth = months[objToday.getMonth()],
        curYear = objToday.getFullYear(),
        curHour = objToday.getHours() > 12 ? objToday.getHours() - 12 : (objToday.getHours() < 10 ? "0" + objToday.getHours() : objToday.getHours()),
        curMinute = objToday.getMinutes() < 10 ? "0" + objToday.getMinutes() : objToday.getMinutes(),
        curSeconds = objToday.getSeconds() < 10 ? "0" + objToday.getSeconds() : objToday.getSeconds(),
        curMeridiem = objToday.getHours() > 12 ? "PM" : "AM";
      var today = curHour + ":" + curMinute + "." + curSeconds + curMeridiem + " " + dayOfWeek + " " + dayOfMonth + " of " + curMonth + ", " + curYear;
      const addfeats=new Graphic({"geometry":geom,"attributes":{
        "Status":"Pending",
        "MLA":document.getElementById("mla").value,
        "poleID":document.getElementById("poleSelect").value,
        "firstName":document.getElementById("firstname").value,
        "lastName":document.getElementById("lastname").value,
        "email":document.getElementById("email").value,
        "company":document.getElementById("company").value,
        "address":document.getElementById("address").value,
        "city":document.getElementById("city").value,
        "state":document.getElementById("state").value,
        "zip":document.getElementById("zip").value,
        "phone":document.getElementById("phone").value,
        "email":document.getElementById("email").value,
        "provider":document.getElementById("provider").value,
        "frequency":document.getElementById("frequency").value,
        "elevation":document.getElementById("elevation").value,
        "description":document.getElementById("description").value,
        "dateSubmitted":objToday,
        "MLA_verify":"",
        "TEO_num":"",
        "handhole":""
    }});
    var attachmentForm = document.getElementById("plan")
    console.log(attachmentForm);
    const formData= new FormData(attachmentForm);
    formData.append("f","json");
      //const form = new FormData();
      //form.set("attachment", file);
      //form.append("f","json")
      //var form = document.getElementById("myForm");

    makeUnavailable();
    console.log({addFeatures:[addfeats]});
    appsLayer
      .applyEdits({addFeatures:[addfeats]})
      .then(function(editsResult){
        console.log(editsResult);
        var newOID= editsResult.addFeatureResults[0].objectId;
        console.log(newOID)
        addfeats.attributes["OBJECTID"]=newOID;
        appsLayer
            .addAttachment(addfeats, formData)
            .then(function(result){window.location.replace("success.html")})
            /*.then(function(result){
              console.log("attachment added");
              var attachQ = new AttachmentQuery({
                objectIds:[editObj.attributes["OBJECTID"]]
              });
        
              appsLayer
                .queryAttachments(attachQ)
                .then(window.location.replace("success.html"))
                .catch(rejectedPromise);
              
            })*/
            
            .catch(function(error) {
              console.log("===============================================");
              console.error(
                "[ applyEdits ] FAILURE: ",
                error.code,
                error.name,
                error.message
              );
              console.log("error = ", error);}); 
      })
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

    function checkMLAs(){
    var MLAS = ['1','2','3','4','5']
    mla=document.getElementById("mla").value
    console.log(MLAS.includes(mla))
    if (MLAS.includes(mla)){
      document.getElementById("AppBody").style.visibility='visible';
      document.getElementById("plan").style.visibility='visible';
      document.getElementById("Btn").style.visibility='visible';
      document.getElementById("mla_status").style.visibility='hidden';
    }
    else{
      document.getElementById("AppBody").style.visibility='hidden';
      document.getElementById("plan").style.visibility='hidden';
      document.getElementById("Btn").style.visibility='hidden';
      document.getElementById("mla_status").style.visibility='visible';
    }
    };

    document.getElementById("poleSelect").addEventListener("change", doFind); 
    document.getElementById("Btn").addEventListener("click", SUBMIT);
    document.getElementById("mla").addEventListener("change",checkMLAs)
  });

