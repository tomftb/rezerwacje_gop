var err = new Array();
// origin
var memberProjTab=new Array();
// for manipulate
var actUsedMemberProjTab=new Array();
var actMemberProjPers=0;
var idRecord;
var counter = 0;
var liderProj="";
var MemberProj="";
var ManagerProj="";
var TypeOfAgreement="";
var AddDictDoc="";
var datePickerCounter=0;
var appendElementCounter=0;
var extraDivCounter=0;
var teamElementCounter=0;
var lastTeamMemberId=-1;
$.fn.datepicker.defaults.format = "dd.mm.yyyy";
$.fn.datepicker.defaults.todayHighlight = true;
$.fn.datepicker.defaults.language = 'pl';
$.fn.datepicker.defaults.autoclose = true;
// FUNCTION CREATE ANY HTML ELEMENT
// a. html tag to setup
// b. array of array to setup tag attribute
// c. array of classes
// d. array of css
function createHtmlElement(htmlTag,elementAttribute,elementClassList,elementStyle)
{
    //console.log('---createElement---\n'+htmlTag);
    //console.log(elementAttribute);
    //console.log(elementClassList);
    //console.log(elementStyle);
    var htmlElement=document.createElement(htmlTag);
    var i=0;
    // ASSIGN Attribute
    if(elementAttribute!==null && elementAttribute!==undefined)
    {
        for(j=i;j<elementAttribute.length;j++)
        {
            htmlElement.setAttribute(elementAttribute[j][0],elementAttribute[j][1]);
        };
    }
    // ASSIGN ADDITIONAL CLASS
    if(elementClassList!==null && elementClassList!==undefined)
    {
        for(j=i;j<elementClassList.length;j++)
        {
            htmlElement.classList.add(elementClassList[j]);
        };
    };
    // ASSIGN STYLES
    if(elementStyle!==null && elementStyle!==undefined)
    {
         for(j=i;j<elementStyle.length;j++)
        {
            //console.log(elementStyle[j][0]);
            //console.log(elementStyle[j][1]);
            //htmlElement.style.elementStyle[j][0] = elementStyle[j][1];
            htmlElement=addStyleToHtmlTag(htmlElement,elementStyle[j][0],elementStyle[j][1]);
        };
    }
    //console.log(htmlElement);
    return (htmlElement);
}
function addStyleToHtmlTag(htmlElement,styleName,styleValue)
{
    switch(styleName)
    {
        case 'border':
            htmlElement.style.border=styleValue;
            break;
        case 'backgroundColor':
            htmlElement.style.backgroundColor=styleValue;
            break;
        case 'borderColor':
            htmlElement.style.borderColor=styleValue;
            break;
        case 'color':
            htmlElement.style.color=styleValue;
            break;
        case 'borderTopRightRadius':
            htmlElement.style.borderTopRightRadius=styleValue;
            break;
        case 'borderBottomRightRadius':
            htmlElement.style.borderBottomRightRadius=styleValue;
            break;
        case 'borderTopLeftRadius':
            htmlElement.style.borderTopLeftRadius=styleValue;
            break;
        case 'borderBottomLeftRadius':
            htmlElement.style.borderBottomLeftRadius=styleValue;
            break;
        default:
            break;
    };
    return(htmlElement);
}
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
function addFormField2(elementWhereAdd)
{
    // CONTAINER FORM FIELD
    var newFieldContainer=document.createElement("div");
    newFieldContainer.setAttribute('class','input-group-addon');
    newFieldContainer.setAttribute('name','newFieldContainer');
   
    // REMOVE BUTTON
    var removeButtonContainer=document.createElement("div");
    removeButtonContainer.setAttribute('class','input-group-addon');
    removeButtonContainer.classList.add("input-group-append");

    var removeButton=document.createElement("div");
    removeButton.setAttribute('class','btn');
    removeButton.classList.add("btn-danger");
    removeButton.classList.add("rounded-right");
    removeButton.onclick = function() { closeNode(this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode),this.parentNode.parentNode); };
    var removeIco=document.createElement("i");
    removeIco.setAttribute('class','fa');
    removeIco.classList.add("fa-minus");
    removeIco.setAttribute('aria-hidden','true');
    removeButton.appendChild(removeIco);
    removeButtonContainer.appendChild(removeButton);
    //
    console.log('addFormField - '+extraDivCounter);
    console.log('element where to add : ');
    console.log(elementWhereAdd);
    console.log(document.getElementById('projectsMemberAll'));
    var newFields = document.getElementById('projectsMemberAll').cloneNode(true);
    //newFields.id = 'dynamicField'+extraDivCounter;
    newFields.id = 'extraDiv'+extraDivCounter;
    console.log('newFields:');
    console.log(newFields);
    newFields.style.display = 'block';
    var newField = newFields.childNodes;
    var finallyField=newField[1].childNodes;
    for (var i=0;i<finallyField.length;i++)
    {
        var theName = finallyField[i].name;
        console.log(finallyField[i]);    
        console.log('theName - '+theName);
        if (theName)
        {
            newField[1].childNodes[i].name = "newField"+extraDivCounter;
            newField[1].childNodes[5].id="errDiv-newField"+extraDivCounter;
            newField[1].childNodes[5].childNodes[1].childNodes[1].id="errText-newField"+extraDivCounter;
            }
    }
    //var insertHere = document.getElementById('extraFormDoc');
    var insertHere = document.getElementById(elementWhereAdd);
    //insertHere.parentNode.insertBefore(newFields,insertHere);
    newFields.appendChild(removeButtonContainer);
    //newFieldContainer.appendChild(newFields);
    insertHere.appendChild(newFields);
    
    //insertHere(newFields,insertHere);
    console.log(document.getElementById(elementWhereAdd)); 
    extraDivCounter++;
}
function addFormField3(elementWhereAdd)
{
    //console.log('addFormField - '+counter);
    var newFields = document.getElementById('projectsMemberAll-TEST').cloneNode(true);
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
	var insertHere = document.getElementById(elementWhereAdd);
	//insertHere.parentNode.insertBefore(newFields,insertHere);
        insertHere.appendChild(newFields);
        //insertHere(newFields,insertHere);
        //console.log(insertHere.childNodes); 
        counter++;
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
            // SET GLOBAL 
            var fields=new Array('id','ImieNazwisko');
            memberProjTab=getDataFromJson(data,fields);
            console.log(memberProjTab);
            MemberProj=createTagWithData('select',data,id,name);
            console.log('Member Array:');
            console.log(MemberProj);
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
function getDataFromJson(dataJson,fieldsToSetup)
{
    //console.log(fieldsToSetup.length);
    var dataArray=new Array();
    var tmpArray= new Array();
    for(var i=0;i<dataJson.length;i++)
    {
        for(j=0;j<fieldsToSetup.length;j++)
        {
            tmpArray.push(dataJson[i][fieldsToSetup[j]]);
        }
        dataArray[i]=tmpArray;
        tmpArray=[];
    };
    return dataArray;
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
    console.log('---manageTagFileds---\n'+name);
    var fields=new Array();
    switch(name)
    {
        case 'nadzor':
        case 'czlonek_grupy':
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
// FUNCTION CREATE DEFAULT DATE PICKER ELEMENT
function createDatePicker(idDatePicker,nameDatePicker)
{
    //console.log('---createDatePicker---');
    //var datePickerElement;
    // input PARAMETERS
    var datePickerAttribute=new Array(
	Array('type','text'),
	Array('class','form-control'),
	Array('name',nameDatePicker),
	Array('id',idDatePicker),
	Array('placeholder','DD.MM.RRRR')
	);
    var datePickerClass=new Array(
	'rounded-0'
	);
    var datePickerStyle=new Array(
	Array('border','1px solid #80bfff')
	);
    var inputElement=createHtmlElement('input',datePickerAttribute,datePickerClass,datePickerStyle);
    // i PARAMETERS
    var datePickerIattribute=new Array(
	Array('class','fa'),
	Array('aria-hidden','true')
	);
    var datePickerIclass=new Array(
	'fa-calendar'
	);
    var datePickerIstyle=new Array(
	Array('color','#ffffff')
    );
    var iElement=createHtmlElement('i',datePickerIattribute,datePickerIclass,datePickerIstyle);
    // span PARAMETERS
    var datePickerSpanAttribute=new Array(
	Array('class','input-group-text'),
	Array('aria-hidden','true')
	);
    var datePickerSpanClass=new Array(
	'rounded-0'
	);
    var datePickerSpanStyle=new Array(
	Array('backgroundColor','#80bfff'),
        Array('borderColor','#80bfff'),
        Array('border','1px solid #80bfff')
    );
    var spanElement=createHtmlElement('span',datePickerSpanAttribute,datePickerSpanClass,datePickerSpanStyle);
    // div-input-group-addon PARAMETERS
    var datePickerDivAddonAttribute=new Array(
	Array('class','input-group-addon')
	);
    var datePickerDivAddonClass=new Array(
	'input-group-append'
	);
    var divAddonElement=createHtmlElement('div',datePickerDivAddonAttribute,datePickerDivAddonClass,null);
     // div-input-group PARAMETERS
    var datePickerDivGroupAttribute=new Array(
	Array('class','input-group'),
	Array('data-provide','datepicker')
	);
    var datePickerDivGroupClass=new Array(
	'date'
	);
    var divGroupElement=createHtmlElement('div',datePickerDivGroupAttribute,datePickerDivGroupClass,null);
    
    spanElement.appendChild(iElement);
    divAddonElement.appendChild(spanElement);
    divGroupElement.appendChild(inputElement);
    divGroupElement.appendChild(divAddonElement);
    //datePickerElement=inputElement;
    console.log(divGroupElement);
    return (divGroupElement);
}
function createRemoveButton()
{
    // i PARAMETERS
    var removeButtonIattribute=new Array(
	Array('class','fa'),
	Array('aria-hidden','true')
	);
    var removeButtonIclass=new Array(
	'fa-minus'
	);
    var removeButtonIstyle=new Array(
	Array('color','#ffffff')
    );
    var iElement=createHtmlElement('i',removeButtonIattribute,removeButtonIclass,removeButtonIstyle,null);
    // div-button PARAMETERS
    var removeButtonDivButtonAttribute=new Array(
	Array('class','btn')
	);
    var removeButtonDivButtonClass=new Array(
	'btn-danger',
        'gt-no-rounded-left'
	);
    var removeButtonDivButtonStyle=new Array(
	Array('borderTopLeftRadius','0px'),
        Array('borderBottomLeftRadius','0px')
    );
    var removeButtonDivFunction=new Array(
        Array('onclick','closeNode(this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode),this.parentNode.parentNode)')    
        );
    var divRemoveButtonElement=createHtmlElement('div',removeButtonDivButtonAttribute,removeButtonDivButtonClass,removeButtonDivButtonStyle);
    divRemoveButtonElement.onclick=function(){closeNode(this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode),this.parentNode.parentNode);};
    divRemoveButtonElement.appendChild(iElement);
    return(divRemoveButtonElement); 
}
function createTeamRow(whereAppend,rowName)
{
    // div-row
    var i=0;
    var z;
    var includeInArray=0;
    var firstElement=0;
    var divRowAttribute=new Array(
	Array('class','row')
	);
    var divRowSmClass=new Array(
	'ml-0',
        'mr-0'
	);
    var divRowElement=createHtmlElement('div',divRowAttribute,divRowSmClass,null);
    // div-col-md-4 PARAMETERS
    var divColMd4Attribute=new Array(
	Array('class','col-md-4')
	);
    var divColMd4Class=new Array(
	'pl-0',
        'pr-0'
	);
    var divColMd4Element=createHtmlElement('div',divColMd4Attribute,divColMd4Class,null);
    // div-col-md-2 PARAMETERS
    var divColMd2Attribute=new Array(
	Array('class','col-md-2')
	);
    var divColMd2Class=new Array(
	'pl-0',
        'pr-0'
	);
    var divColMd2Element=createHtmlElement('div',divColMd2Attribute,divColMd2Class,null);
    // div-col-sm PARAMETERS
    var divColSmAttribute=new Array(
	Array('class','col-sm'),
        Array('name','divCol')
	);
    var divColSmClass=new Array(
	'pl-0',
        'pr-0'
	);
    var divColSmElement=createHtmlElement('div',divColSmAttribute,divColSmClass,null);
    // div-col-sm-2 PARAMETERS
    var divColSm2Attribute=new Array(
	Array('class','col-sm'),
        Array('name','divCol2')
	);
    var divColSm2Class=new Array(
	'pl-0',
        'pr-0'
	);
    var divColSmElement2=createHtmlElement('div',divColSm2Attribute,divColSm2Class,null);
    // div-col-md-auto PARAMETERS
    var divColMdAutoAttribute=new Array(
	Array('class','col-md-auto')
	);
    var divColMdAutoClass=new Array(
	'pl-0',
        'pr-0',
        'mr-0'
	);
    var divColMdAutoElement=createHtmlElement('div',divColMdAutoAttribute,divColMdAutoClass,null);
    // select-team-worker PARAMETERS
    var selectTeamWorkerAttribute=new Array(
        Array('class','form-control'),
        Array('name','team_czlonek_grupy')
	);
    var selectTeamWorkerClass=new Array(
	'gt-border-light-blue',
        'gt-no-rounded-right'
	);
    var selectTeamWorkerStyle=new Array(
	Array('borderColor','#80bfff'),
        Array('borderTopRightRadius','0px'),
        Array('borderBottomRightRadius','0px')
    );
    // dodac funkcje on select lub on change lub blur
    var selectTeamWorkerElement=createHtmlElement('select',selectTeamWorkerAttribute,selectTeamWorkerClass,selectTeamWorkerStyle);
    selectTeamWorkerElement.onclick=function(){ setLastTeamMember(this.value);};
    selectTeamWorkerElement.onchange=function(){ setActTeamMember(this.value);};
    // option-team-worker PARAMETERS
    var optionTeamWorkerAttribute=new Array(
            Array('value','dynamicChange')
            );
    var optionTeamWorkerElement;
    // select-team-worker-percent PARAMETERS
    var selectTeamWorkerPercentAttribute=new Array(
        Array('class','form-control'),
        Array('name','teamPercent_czlonek_grupy')
	);
    var selectTeamWorkerPercentClass=new Array(
	'gt-border-light-blue',
        'rounded-0'
	);
    var selectTeamWorkerPercentStyle=new Array(
	Array('borderColor','#80bfff')
    );
        //dodac check used perent in rest project
    var selectTeamWorkerPercentElement=createHtmlElement('select',selectTeamWorkerPercentAttribute,selectTeamWorkerPercentClass,selectTeamWorkerPercentStyle);
    // option-team-worker-percent PARAMETERS
    var optionTeamWorkerPercentAttribute=new Array(
            Array('value','dynamicChange')
            );
    var optionTeamWorkerPercentElement;
    // CREATE SELECT WITH OPTION percent of usage
    for(z=i+1;z<101;z++)
    {
        //optionTeamWorkerAttribute[0][1]=memberProjTab[z][0]+'|'+memberProjTab[z][1];
        optionTeamWorkerPercentAttribute[0][1]=z;
        //console.log(optionTeamWorkerAttribute[0]['value']);
        optionTeamWorkerPercentElement=createHtmlElement('option',optionTeamWorkerPercentAttribute,null,null);
        optionTeamWorkerPercentElement.textContent=z+'%';
        selectTeamWorkerPercentElement.appendChild(optionTeamWorkerPercentElement);
    };
   
    // CREATE SELECT WITH OPTION czlonek_grupy
    for(z=i;z<memberProjTab.length;z++)
    {
        // check recod not exist in actUsedMemberProjTab
        //includeInArray=actUsedMemberProjTab.includes(memberProjTab[z][0]);
        includeInArray=actUsedMemberProjTab.indexOf(memberProjTab[z][0]);
        console.log('indexOf - '+includeInArray);
        if(actUsedMemberProjTab.indexOf(memberProjTab[z][0])===-1)
        {
            if(firstElement===0)
            {
                //if(compareLastUsedTeamPersId(memberProjTab[z][0]))
                //{
                    actUsedMemberProjTab.push(memberProjTab[z][0]);
                //} 
            };
            firstElement=1;
            
            
            //optionTeamWorkerAttribute[0][1]=memberProjTab[z][0]+'|'+memberProjTab[z][1];
            optionTeamWorkerAttribute[0][1]=memberProjTab[z][0];
            //console.log(optionTeamWorkerAttribute[0]['value']);
            optionTeamWorkerElement=createHtmlElement('option',optionTeamWorkerAttribute,null,null);
            optionTeamWorkerElement.textContent=memberProjTab[z][1];
            selectTeamWorkerElement.appendChild(optionTeamWorkerElement);
        }
       
    };
    // SET WSK VISIBLE PERS (REKORD) FROM actMemberProjTab
    //actUsedMemberProjTab.push("Kiwi");
    
    divColSmElement.append(createDatePicker('date-'+datePickerCounter,'date-'+datePickerCounter));
    datePickerCounter++;
    divColSmElement2.append(createDatePicker('date-'+datePickerCounter,'date-'+datePickerCounter));

    divColMdAutoElement.append(createRemoveButton());
    divColMd4Element.appendChild(selectTeamWorkerElement);
    divColMd2Element.appendChild(selectTeamWorkerPercentElement);
    
    divRowElement.appendChild(divColMd4Element);
    divRowElement.appendChild(divColMd2Element);
    divRowElement.appendChild(divColSmElement);
    divRowElement.appendChild(divColSmElement2);
    divRowElement.appendChild(divColMdAutoElement);
    document.getElementById(whereAppend).append(divRowElement);
    //var divRow=document.createElement('div');
    //return (divRow);
    console.log(document.getElementById(whereAppend));

}
function setLastTeamMember(idToSetup)
{
    console.log('---setLastTeamMember---\n'+idToSetup);
    lastTeamMemberId=idToSetup;
}
function setActTeamMember(id)
{
    console.log('---selectedId---\n'+id);
    console.log('Before:');
    for(var i=0; i<actUsedMemberProjTab.length;i++)
    {
        console.log('id in array - '+actUsedMemberProjTab[i]);
    };
    
    console.log('index of last id - '+actUsedMemberProjTab.indexOf(lastTeamMemberId));
    actUsedMemberProjTab.splice( actUsedMemberProjTab.indexOf(lastTeamMemberId),1,id);
    
    console.log('After:');
    for(var i=0; i<actUsedMemberProjTab.length;i++)
    {
        console.log('id in array - '+actUsedMemberProjTab[i]);
    };
}
function compareLastUsedTeamPersId(compareId)
{
    if(lastTeamMemberId===compareId)
    {
        return (1);
    }
    else
    {
        return(0);
    }
    
}
function appendElement(elementToAdd,whereToAdd)
{
    console.log('appendElement - '+appendElementCounter);
    console.log(elementToAdd);
    console.log(whereToAdd);
    var divDynamicTmp=document.createElement("div");
    divDynamicTmp.setAttribute("id","divDynamicTmp"+appendElementCounter);
    divDynamicTmp.appendChild(elementToAdd);
    document.getElementById(whereToAdd).appendChild(divDynamicTmp);
    console.log(document.getElementById('divBodyData'));
    appendElementCounter++;
}
function addContent(elementWhereAdd)
{
    document.getElementById('projectsMemberAll').append(MemberProj);
    console.log('elementWhereAdd:');
    console.log(elementWhereAdd);
    console.log(MemberProj);
    var nameOfDynamicDiv="dynamicDivField";
    // TITLE OF SELECT
    var text = document.createTextNode("Członkowie zespołu:");
    document.getElementById(elementWhereAdd).appendChild(text);
    // END TITLE OF SELECT
    var divDynamic=document.createElement("div");
    divDynamic.setAttribute("id",nameOfDynamicDiv);
    document.getElementById(elementWhereAdd).appendChild(divDynamic);
    var divAdd=document.createElement("div");
    divAdd.setAttribute("class","entry");
    divAdd.classList.add("input-group");
    // BUTTON
    var button=document.createElement("button");
    button.setAttribute("class","btn");
    button.classList.add("btn-success");
    button.classList.add("btn-add");
    button.setAttribute("type","button");
    //button.onclick = function() { addFormField3(nameOfDynamicDiv); };
    button.onclick=function(){createTeamRow(nameOfDynamicDiv,'hahaha');};
    //button.onclick = function() { appendElement(MemberProj,nameOfDynamicDiv); };
    var iIco=document.createElement("i");
    iIco.setAttribute('class','fa');
    iIco.classList.add("fa-plus");
    iIco.setAttribute("aria-hidden","true");
    button.appendChild(iIco);
    // END BUTTON
    divAdd.appendChild(button);
    //addFormField3(nameOfDynamicDiv);
    createTeamRow(nameOfDynamicDiv,'hahaha');
    //document.getElementById(elementWhereAdd).appendChild(divDate);
    
    //document.getElementById(nameOfDynamicDiv).appendChild(MemberProj);
    document.getElementById(elementWhereAdd).appendChild(divAdd);
    console.log(document.getElementById(elementWhereAdd));
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
    console.log('---createSelect---\n'+fieldId);
    console.log(dataArray);
    //console.log(dataArray);
    //console.log(dataArray.length);
    var select=document.createElement("SELECT");
    select.setAttribute('class','form-control');
    var option=document.createElement("OPTION");
    var optionText = document.createTextNode("");
    var fieldsToSetup=new Array();
    // SELECT
    select.setAttribute("class","form-control");
    if(fieldName==='czlonek_grupy')
    {
        console.log('add - gt-no-rounded-right');
        select.classList.add("gt-border-light-blue");
        select.style.borderColor = "#80bfff";
        select.style.borderTopRightRadius = "0px";
        select.style.borderBottomRightRadius = "0px";
        select.classList.add("gt-no-rounded-right");
    }
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
    console.log('---createAdaptedModal---');
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
    var button2= document.createElement('button');
    button2.setAttribute('class','btn');
    button2.classList.add('btn-info');
    button2.classList.add('pull-right');
    button2.innerText = "Zatwierdź";
    //var button2text = document.createTextNode('Zatwierdź');
    //button2.appendChild(button2text);
   
    
    //btn btn-danger pull-right
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
            button.innerHTML='Anuluj';
            document.getElementById('ProjectAdaptedButtonsBottom').appendChild(button2);
            //createTeamRow('div-inputPdf7a','hahaha');
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
    document.getElementById('projectsMemberAll').append(MemberProj);
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
getAjaxData('getprojectsmember','projectsmember','czlonek_grupy');
getAjaxData('getadditionaldictdoc','inputPdf8','dodatkowe_dokumenty');

