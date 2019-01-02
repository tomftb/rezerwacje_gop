var err = new Array();
var idRecord;
var counter = 0;
var liderProj="";
var MemberProj="";
var ManagerProj="";
var TypeOfAgreement="";
var AddDictDoc="";
$.fn.datepicker.defaults.format = "dd.mm.yyyy";
$.fn.datepicker.defaults.todayHighlight = true;
$.fn.datepicker.defaults.language = 'pl';
$.fn.datepicker.defaults.autoclose = true;

function parseValue(data,field)
{
    var valueToParse="";
    var typeOfValueToParse="";

    //console.log(typeof(data));
    if(typeof(data)==='object')
    {
        //console.log("object");
        valueToParse=data.value;
        typeOfValueToParse=data.name;
    }
    else
    {
         valueToParse=data;
         typeOfValueToParse=field;
    };
    //console.log(valueToParse);
    //console.log('parseValue - '+ valueToParse+' - '+typeOfValueToParse);

    //console.log('name: '+typeOfValueToParse);
    var plChars='ąĄćĆęĘłŁńŃóÓśŚżŻźŹ';

    valueToParse=myTrim( valueToParse);
   
    var thisRegex = new RegExp("^[\\da-zA-Z'"+plChars+"][\\/\\-\\_\\s\\da-zA-Z"+plChars+"]*[\\.\\s\\da-zA-Z"+plChars+"]{1}$");

    if(!thisRegex.test(valueToParse))
    {  
        //console.log('faile');
        // check exist 
        if(err.indexOf(typeOfValueToParse)===-1)
        {
            //console.log("index "+typeOfValueToParse+" not exists ");
            err.push(typeOfValueToParse); 
        }
        document.getElementById("errText-"+typeOfValueToParse).innerHTML="Błąd składni";
        document.getElementById("errDiv-"+typeOfValueToParse).style.display = "block";
    }
    else
    {
        err.splice( err.indexOf(typeOfValueToParse), 1 );
        //console.log('ok');
        document.getElementById("errText-"+typeOfValueToParse).innerHTML="";
        document.getElementById("errDiv-"+typeOfValueToParse).style.display = "none";
    }
    checkErr();

}
function setSubmitButton(err)
{
    var element = document.getElementById("postData");
    if(err)
    {
        //console.log("button disabled");
        element.classList.add("disabled");
    }
   else
   {
       //console.log("button enabled");
       element.classList.remove("disabled");
   };
}
function myTrim(x)
{
    return x.replace(/^\s+|\s+$/gm,'');
}

function setTypOfAgreement(valueToSetup)
{
    var splitValue=valueToSetup.split("|");
    //console.log('setTypeOfAgreement');
    //console.log(valueToSetup);
    document.getElementById("pdfDokListTypUmowy").innerHTML =splitValue[2];
    document.getElementById("pdfTypUmowy").innerHTML =splitValue[2];
}

function addFormField()
{
    //console.log('addFormField - '+counter);
    var newFields = document.getElementById('readroot').cloneNode(true);
    newFields.id = '';

	newFields.style.display = 'block';
	var newField = newFields.childNodes;
        var finallyField=newField[1].childNodes;
	for (var i=0;i<finallyField.length;i++)
        {
            var theName = finallyField[i].name;
            //console.log(finallyField[i]);    
            //console.log('theName - '+theName);
		if (theName)
                {
                        newField[1].childNodes[i].name = "pdfExtra"+counter;
                        newField[1].childNodes[5].id="errDiv-pdfExtra"+counter;
                        newField[1].childNodes[5].childNodes[1].childNodes[1].id="errText-pdfExtra"+counter;
                }
	}
        //var insertHere = document.getElementById('extraFormDoc');
	var insertHere = document.getElementById('writeroot');
	//insertHere.parentNode.insertBefore(newFields,insertHere);
        insertHere.appendChild(newFields);
        //insertHere(newFields,insertHere);
        //console.log(insertHere.childNodes); 
        counter++;
}
//function getAjaxData(modul,task)
function getAjaxData(task,idToSetup,nameToSetup)
{
    console.log("getAjaxData - "+task);
    var host =  getUrl();
    // example of url host + modul/manageProject.php?task+ task getprojects
    var url =  host+'modul/manageProject.php?task='+task;
    var xmlhttp = new XMLHttpRequest();
    var ajaxData;
    xmlhttp.onreadystatechange = function()
    {
      if (this.readyState === 4 && this.status === 200)
      {
        ajaxData = JSON.parse(this.responseText);
        //console.log(ajaxData);
        //console.log(ajaxData[0][0]);
        if(ajaxData[0][0]==='0')
        {
            manageTask(task,ajaxData[1],idToSetup,nameToSetup);
            
        }
        else
        {
            alert("ERROR: "+ajaxData[1]);
        };
      }
      else
      {
          //console.log("error ajax"+this.status+" state - "+this.readyState);
      }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send(); 
}
function manageTask(taskToRun,data,id,name)
{
    //console.log('manageTask'+taskToRun);
    switch(taskToRun)
    {
        case 'getprojects':
            setAllProjects(data);
            break;
        case 'getprojectsleader':
            // SET GLOBAL liderProj
            liderProj=createTagWithData('select',data,id,name);
            //console.log('Lider Array:');
            //console.log(liderProj);
            break;
        case 'getprojectsmember':
            // SET GLOBAL liderProj
            MemberProj=createTagWithData('select',data,id,name);
            //console.log('Member Array:');
            //console.log(MemberProj);
            break;
        case 'getprojectsmanager':
            // SET GLOBAL liderProj
            ManagerProj=createTagWithData('select',data,id,name);
            //console.log('Member Array:');
            //console.log(MemberProj);
            break;
        case 'gettypeofagreement':
            // SET GLOBAL liderProj
            TypeOfAgreement=createTagWithData('select',data,id,name);
            console.log('Type Of Agreement Array:');
            console.log(TypeOfAgreement);
            break;
        case 'getadditionaldictdoc':
            // SET GLOBAL DICTIONARY OF ADDITIONAL DOCUMENTS
            AddDictDoc=createTagWithData('ol',data,id,name);
            //console.log('Dictionary of Additional Documents Array:');
            //console.log(AddDictDoc);
            break;
        default:
            alert('ERROR - wrong task');
            break;
    }
}
function createTagWithData(tag,data,id,name)
{
    //console.log('createTagWithData');
    var createdTag;
    switch(tag)
    {
        case 'select':
            createdTag=createSelect(data,id,name);
            //console.log(createdTag);
            break;
        case 'ol':
            createdTag=createOl(data,id,name);
            //console.log(createdTag);
            break;
        default:
            alert('wrong tag to create');
            return "";
            break;
    }
    return createdTag;
}
function manageTagFileds(name)
{
    var fields=new Array();
    switch(name)
    {
        case 'nadzor':
        case 'kier_grupy':
                fields[0]='id';
                fields[1]='ImieNazwisko';
            break;
        case 'typ_umowy':
                fields[0]='ID';
                fields[1]='Nazwa';
                fields[2]='NazwaAlt';
            break;
        case 'dodatkowe_dokumenty':
                fields[0]='ID';
                fields[1]='Nazwa';
                fields[2]='SpecificId';
            break;
        default:
            alert('ERROR - wrong name to setup');
    }
    return fields;
}
function createOl(dataArray,fieldId,fieldName)
{
    console.log('createOl');
    console.log(dataArray);
    console.log(dataArray.length);
    var ol=document.createElement("OL");
    var li=document.createElement("LI");
    var optionText = document.createTextNode("");
    var fieldsToSetup=new Array();
    
    ol.setAttribute("type","a");
    ol.setAttribute("id",fieldId);
    ol.setAttribute("name",fieldName);

    fieldsToSetup=manageTagFileds(fieldName);

    for(var i=0;i<dataArray.length;i++)
    {
        console.log(dataArray[i][fieldsToSetup[0]]+" - "+dataArray[i][fieldsToSetup[1]]);
        li=document.createElement("LI");
        if(dataArray[i][fieldsToSetup[2]]!=='')
        {
            li.setAttribute("id",dataArray[i][fieldsToSetup[2]]);
        };
        li.setAttribute("class","mt-1");
        li.classList.add("mb-1");
        console.log(dataArray[i][fieldsToSetup[2]]);
        li.setAttribute("value",dataArray[i][fieldsToSetup[0]]+'|'+dataArray[i][fieldsToSetup[1]]);
        optionText = document.createTextNode(dataArray[i][fieldsToSetup[1]]);
        
        li.appendChild(optionText);
        ol.appendChild(li);
        addHiddenInput("addDoc"+i,dataArray[i][fieldsToSetup[0]]+"|"+dataArray[i][fieldsToSetup[1]]);

    };

    return ol;
}
// NOT USED
function createDiv(elementWhereAdd)
{
    console.log('createDIV');
    var divName='divBodyData';
    var div=document.createElement("DIV");

    div.setAttribute("id",divName)
    div.setAttribute("class","col-sm-12");
    div.classList.add("mt-1");
    
    document.getElementById(elementWhereAdd).append(div);
    return divName;
}
function addContent(elementToAdd)
{
    var text = document.createTextNode("test");
    document.getElementById(elementToAdd).appendChild(text);
}
function addHiddenInput(name,value)
{
    var input=document.createElement("input");
        input.setAttribute("type", "hidden");
        input.setAttribute("value",value);
        input.setAttribute("name",name);
    document.getElementById("additionalDoc").append(input);
}
function createSelect(dataArray,fieldId,fieldName)
{
    console.log('createSelect');
    //console.log(dataArray);
    //console.log(dataArray.length);
    var select=document.createElement("SELECT");
    var option=document.createElement("OPTION");
    var optionText = document.createTextNode("");
    var fieldsToSetup=new Array();
    // SELECT
    select.setAttribute("class","form-control");
    if(fieldName==='typ_umowy')
    {
       select.onchange = function() { setTypOfAgreement(this.value); };
    };
    select.setAttribute("id",fieldId);
    select.setAttribute("name",fieldName);
    // OPTION IN LOOP WITH DATA
    // TEXT
    fieldsToSetup=manageTagFileds(fieldName);
    // onchange="setTypOfAgreement()
    for(var i=0;i<dataArray.length;i++)
    {
        //console.log(dataArray[i][fieldsToSetup[0]]+" - "+dataArray[i][fieldsToSetup[1]]);
        option=document.createElement("OPTION");
        if(fieldName==='typ_umowy')
        {
            console.log(dataArray[i][fieldsToSetup[2]]);
            option.setAttribute("value",dataArray[i][fieldsToSetup[0]]+'|'+dataArray[i][fieldsToSetup[1]]+"|"+dataArray[i][fieldsToSetup[2]]);
            //option.onselect = function() { setTypOfAgreement(dataArray[i][fieldsToSetup[2]]); }; //dataArray[i][fieldsToSetup[2]]
        }
        else
        {
            option.setAttribute("value",dataArray[i][fieldsToSetup[0]]+'|'+dataArray[i][fieldsToSetup[1]]);
        }
        optionText = document.createTextNode(dataArray[i][fieldsToSetup[1]]);
        option.appendChild(optionText);
        select.appendChild(option);
    };
    return select;
}
function setAllProjects(data)
{
   // console.log('getAllProjects');
    myFunction(data);
    function myFunction(arr)
    {
        var buttonConfig=new Array(
            new Array('btn-info','edit',"Edytuj"),
            new Array('btn-info','show','Podgląd'),
            new Array('btn-info','documents','Dokumenty'),
            new Array('btn-warning','team','Zespół'),
            new Array('btn-danger','delete','Usuń') 
         );
        var button='';
        var out = "";
        var i;
        var j;

        for(i = 0; i < arr.length; i++)
        {    
            for(j = 0; j <buttonConfig.length; j++)
            {
                button+="<button class=\"btn "+buttonConfig[j][0]+" mr-0 mb-0 mt-0 ml-0\" data-toggle=\"modal\" data-target=\"#ProjectAdaptedModal\" onclick=\"createAdaptedModal('"+buttonConfig[j][1]+"',"+arr[i].id+",'"+arr[i].temat_umowy+"')\">"+buttonConfig[j][2]+"</button>";
            }
            out+="<tr id=\"project"+arr[i].id+"\"><th scope=\"row\">"+arr[i].id+"</th><td>"+arr[i].numer_umowy+"</td><td>"+arr[i].temat_umowy+"</td><td>"+arr[i].create_date+"</td><td>"+arr[i].kier_grupy+"</td><td>"+arr[i].nadzor+"</td><td>"+arr[i].term_realizacji+"</td><td>"+arr[i].harm_data+"</td><td>"+arr[i].koniec_proj+"</td><td>"+arr[i].status+"</td><td><div class=\"btn-group\">"+button+"</div></td></tr>";
            button='';
        }
        document.getElementById("projectData").innerHTML = out;
    }
}

function createAdaptedModal(modalType,idData,titleData)
{
    console.log("TASK "+modalType+" - "+idData+" - "+titleData);
    setAdaptedModalProperties(modalType);
    idRecord=idData;
    //console.log("record to deleted - "+id);
    document.getElementById("projectTitle").innerHTML = titleData;
    document.getElementById("projectId").innerHTML = idData;
}
function setAdaptedModalProperties(modalType)
{
    var bgTitle = document.getElementById("ProjectAdaptedBgTitle");
    var button =  document.getElementById("ProjectAdaptedButton");
    var title=document.getElementById("ProjectAdaptedTextTitle");
    var divWithData='';
    //bgTitle.classList.add("modal-header");
    //modal-header
    //console.log(bgTitle.classList);
  
    bgTitle.classList.value="";
    button.classList.value="";

    bgTitle.classList.add("modal-header");
    button.classList.add("btn","pull-right");
    button.onclick = function() { closeModal('ProjectAdaptedModal'); };
    // check additional div exists
    
    if(document.getElementById('divBodyData')!==null)
    {
        console.log('divBodyData - exist');
        var divRemove=document.getElementById('divBodyData');
        divRemove.parentNode.removeChild(divRemove);
    }
    else
    {
        console.log('divBodyData - not exist');
    }
    switch(modalType)
    {
        case 'edit':
            bgTitle.classList.add("bg-info");
            title.innerHTML="EDYCJA PROJEKTU:";
            button.classList.add("btn-info");
            button.innerHTML='Edytuj';
            break;
        case 'show':
            bgTitle.classList.add("bg-info");
             title.innerHTML="PODGLĄD PROJEKTU:";
             button.classList.add("btn-info");
             button.innerHTML='Zamknij';
            break;
        case 'documents':
            bgTitle.classList.add("bg-info");
            title.innerHTML="DOKUMENTY PROJEKTU:";
            button.classList.add("btn-info");
            button.innerHTML='Zamknij';
            break;
        case 'team':
            bgTitle.classList.add("bg-warning");
            button.classList.add("btn-warning");
            title.innerHTML="ZESPÓŁ PROJEKTU:";
            button.innerHTML='Zamknij';
            // return name of div
            // ProjectAdaptedBodyContent ProjectAdaptedBodyContentTitle
            divWithData=createDiv('ProjectAdaptedDynamicData'); // ProjectAdaptedBodyContent
            addContent(divWithData);
            break;
        case 'delete':
            bgTitle.classList.add("bg-danger");
            button.classList.add("btn-danger");
            title.innerHTML="USUWANIE PROJEKTU:";
            button.innerHTML='Usuń';
            button.onclick = function() { deleteData(); };
            break;
        default:
            alert('[ModalCreate]ERROR - wrong type');
            break;
    }
    //console.log("AFTER");
    //console.log(bgTitle.classList);
}
function closeModal(modalId)
{
     $('#'+modalId).modal('hide');
}
function checkErr()
{
    var errExists=false;
    for(i=0;i<err.length;i++)
    {
        errExists=true;
        //console.log(i+" - "+err[i]);
    }
    if(errExists)
    {
         setSubmitButton(true);
    }
    else
    {
         setSubmitButton(false);
    }
    return (errExists);
}
function deleteData()
{
    //console.log('deleteData()');
    //CHECK document wsk_b == buffor , somebody works on this document??
    //confirm("Potwierdź usunięcie");
    var r = confirm("Potwierdź usunięcie");
    if (r === true)
    {
        var xmlhttp = new XMLHttpRequest();
        var host =  getUrl();
        var response="";
        var url =  host+'modul/manageProject.php?task=del';
        document.getElementById("errDiv-Adapted-overall").style.display = "none";

        xmlhttp.onreadystatechange = function()
        {
          if (this.readyState === 4 && this.status === 200)
          {
            //var myArr = JSON.parse(this.responseText);
            console.log(this.responseText);
            //myFunction(myArr);
             var response = JSON.parse(this.responseText);
            //response=this.responseText;
            //console.log("id0 - "+response[0]);
            //console.log("id1 - "+response[1]);
            if(response[0]==='1')
            {
                //err.push(typeOfValueToParse); 
                //console.log("response not null - "+response);
                document.getElementById("errText-Adapted-overall").innerHTML=response[1];
                document.getElementById("errDiv-Adapted-overall").style.display = "block";
            }
            else
            {
                idRecord="";
                getAjaxData('getprojects','test','test');
                $('#ProjectAdaptedModal').modal('hide');
            }
            //console.log("respones text - "+this.responseText);

          }
          else
          {
              //console.log("error ajax"+this.status+" state - "+this.readyState);
          }
        };
        xmlhttp.open("POST", url, true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send("id="+idRecord);
    }
    else
    {
        //;
    }
}
function postDataToUrl()
{
    parseValue( document.getElementById('temat_umowy').value,"temat_umowy");
    parseValue( document.getElementById('numer_umowy').value,"numer_umowy");
    if(checkErr())
    {
        console.log("err is true");
        return(0);
    };
    
    //console.log('postDataToUrl()');
    var xmlhttp = new XMLHttpRequest();
    var host =  getUrl();
    var response="";
    var url =  host+'modul/manageProject.php?task=add';
    document.getElementById("errDiv-overall").style.display = "none";

    xmlhttp.onreadystatechange = function()
    {
      if (this.readyState === 4 && this.status === 200)
      {
        response = JSON.parse(this.responseText);
        console.log("id0 - "+response[0]);
        console.log("id1 - "+response[1]);
        if(response[0]==='1')
        {
            //err.push(typeOfValueToParse); 
            //console.log("response not null - "+response);
            document.getElementById("errText-overall").innerHTML=response[1];
            document.getElementById("errDiv-overall").style.display = "block";
        }
        else
        {
            //getDataFromUrl();
            getAjaxData('getprojects','test','test');
            $('#addProjectModal').modal('hide');
        }
      }
      else
      {
          //console.log("error ajax"+this.status+" state - "+this.readyState);
      }
    };
    xmlhttp.open("POST", url, true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(getDataForm());
}
function getDataForm()
{
    var formPdf = document.forms.createPdfForm;
    var params = '';
    //console.log(document.getElementById("pdfTypUmowy").innerHTML);
    for( var i=0; i<document.createPdfForm.elements.length; i++ )
    {
       var fieldName = document.createPdfForm.elements[i].name;
       var fieldValue = document.createPdfForm.elements[i].value;
       if(fieldName==='inputPdfDok3')
       {
           fieldValue=document.getElementById("pdfTypUmowy").innerHTML;
       }
       console.log(fieldName+" - "+fieldValue);
       params += fieldName + '=' + fieldValue + '&';
       
    }
    //console.log(params);
    //console.log(formPdf);
    return params;
}
function getUrl()
{
    var currentLocation = window.location;
    return currentLocation.protocol+"//"+currentLocation.host+"/";
}
$(document).keyup(function(e)
{
    if (e.key === "Escape")
    { // escape key maps to keycode `27`
        setDefault();
    }
});
function setDefault()
{
    console.log("setDefault()");

    var inputFileds=new Array(
        new Array('s-umowa',"Do realizacji :",'typ_umowy'),
        new Array('t','Numer:','numer_umowy'),
        new Array('t','Temat:','temat_umowy'),
        new Array('s-prac','Do kierowania grupa powołuje:','kier_grupy'),
        new Array('d','Termin realizacji','term_realizacji'),
        new Array('d','Kierującego zobowiązuję do przedstawienia harmonogramu prac do dnia','harm_data'),
        new Array('d','Kierującego zobowiązuję do zakończenia prac i napisania raportu z realizacji zadania do dnia)','koniec_proj'),
        new Array('s-prac','Nadzór nad realizacją <span id="pdfTypUmowy">umowy</span> powierzam','nadzor'),
        new Array('l-dok','Wykaz dokumentów związanych:','dokList','dokPowiazane')
    );
    console.log(inputFileds[0][1]);
    var element = document.getElementById("postData");
    element.classList.remove("disabled"); 
    document.getElementById('div-inputPdf0').append(TypeOfAgreement);
    document.getElementById('div-inputPdf3').append(ManagerProj);
    document.getElementById('div-inputPdf7').append(liderProj);
    document.getElementById('div-inputPdf8').append(AddDictDoc);
    
    document.getElementById('temat_umowy').value="";
    document.getElementById('numer_umowy').value="";
    document.getElementById('d-term_realizacji').value="";
    document.getElementById('d-harm_data').value="";
    document.getElementById('d-koniec_proj').value="";
    document.getElementById("errDiv-overall").style.display = "none";
    document.getElementById("errDiv-temat_umowy").style.display = "none";
    document.getElementById("errDiv-numer_umowy").style.display = "none";
  
    var extraFormDoc = document.getElementById('writeroot');
    console.log(extraFormDoc.childNodes);
    var indexToRemove;
    while (extraFormDoc.firstChild)
    {
        console.log(extraFormDoc.firstChild);
        console.log(extraFormDoc.firstChild.childNodes[1].childNodes[1].name);
        indexToRemove=extraFormDoc.firstChild.childNodes[1].childNodes[1].name;
         err.splice( err.indexOf(indexToRemove), 1 );
        extraFormDoc.firstChild.remove();
        console.log('remove');
        
    }
    counter=0;
    addFormField();
}
function closeNode(nodeToClose,clearErr)
{
    console.log("closeNode");
    indexToRemove=clearErr.childNodes[1].name;
    console.log(clearErr.childNodes[1].name);
    console.log(nodeToClose);
    err.splice( err.indexOf(indexToRemove), 1 );
    checkErr();
}
//getAllProjects();

getAjaxData('getprojects','test','test');
getAjaxData('getprojectsleader','inputPdf7','nadzor');
getAjaxData('getprojectsmanager','inputPdf3','kier_grupy');
getAjaxData('gettypeofagreement','inputPdf0','typ_umowy');
getAjaxData('getadditionaldictdoc','inputPdf8','dodatkowe_dokumenty');