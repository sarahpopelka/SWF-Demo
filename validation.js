var ValidForm=0

function validateField(item){
    console.log(item);
    console.log('test');
    var parentDiv=item.parentNode;
    if (item.value==""){
        parentDiv.getElementsByTagName("p")[0].style.visibility="visible";
        ValidForm=ValidForm+1;
        console.log('empty')
    }
    else if (item.id=="zip"){
        if (item.value.toString().length==5){
            parentDiv.getElementsByTagName("p")[0].style.visibility="hidden";
        }
        else {
            parentDiv.getElementsByTagName("p")[0].style.visibility="visible";
            ValidForm=ValidForm+1
        }
    }
    else if (item.id=="email"){
        if (item.value.includes(".") && item.value.includes("@")){
            parentDiv.getElementsByTagName("p")[0].style.visibility="hidden";
        }
        else{
            parentDiv.getElementsByTagName("p")[0].style.visibility="visible";
            ValidForm=ValidForm+1
        }
    }
    else if (item.id=="attachment"){
        if (item.value.includes(".pdf")){
            parentDiv.getElementsByTagName("p")[0].style.visibility="hidden";
        }
        else{
            parentDiv.getElementsByTagName("p")[0].style.visibility="visible";
            ValidForm=ValidForm+1
        }
    }
    else{
        parentDiv.getElementsByTagName("p")[0].style.visibility="hidden";
    }
};

function addpListener(){
    console.log("hello");
    var ptags = document.getElementsByTagName("p");
    var plen=document.getElementsByTagName("p").length;
    for (var i=0; i<plen;i++){
        if (ptags[i].id!=="submit_error"){
        var formElement=ptags[i].parentNode.getElementsByClassName("form-control")[0];
        console.log(formElement);
        formElement.addEventListener("click",function(){validateField(this)})
        formElement.addEventListener("change",function(){validateField(this)})
        }
    };
};



addpListener();



const stateAbbreviations = [
    'AL','AK','AS','AZ','AR','CA','CO','CT','DE','DC','FM','FL','GA',
    'GU','HI','ID','IL','IN','IA','KS','KY','LA','ME','MH','MD','MA',
    'MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND',
    'MP','OH','OK','OR','PW','PA','PR','RI','SC','SD','TN','TX','UT',
    'VT','VI','VA','WA','WV','WI','WY'
   ];

   const stateLen=stateAbbreviations.length;
   var stateSelector= document.getElementById("state");
   for (var i=0; i<stateLen; i++){
    var opt = document.createElement("option");

    opt.value = stateAbbreviations[i];
    opt.text=stateAbbreviations[i]

    stateSelector.add(opt,null)
}; 
