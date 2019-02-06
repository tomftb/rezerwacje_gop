var err = new Array();
// origin
var memberProjTab=new Array();
var countOfMemberProjTab=0;
var memberProjTabSumPerc=new Array();
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
var idProject=0;
var teamEditPers=new Array();
var teamPers= new Array();
var teamBodyDataLengthContent=0;

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
function getAjaxData(task,idToSetup,nameToSetup,addon)
{
    console.log("getAjaxData - task="+task);
    console.log("getAjaxData - addon="+addon);
    if(typeof addon === 'undefined')
    {
        addon='';
    };
    var host =  getUrl();
    // example of url host + modul/manageProject.php?task+ task getprojects
    var url =  host+'modul/manageProject.php?task='+task+addon;
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
            alert("[getAJaxData]ERROR: "+ajaxData[1]);
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
    console.log('---manageTask---\ntak to run - '+taskToRun);
    //console.log('data - '+data+'\nid - '+id+'\nname - '+name);
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
            //console.log(memberProjTab);
            countOfMemberProjTab=memberProjTab.length;
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
            //console.log(TypeOfAgreement);
            break;
        case 'getadditionaldictdoc':
            // SET GLOBAL DICTIONARY OF ADDITIONAL DOCUMENTS
            AddDictDoc=createTagWithData('ol',data,id,name);
            //console.log('Dictionary of Additional Documents Array:');
            //console.log(AddDictDoc);
            break;
        case 'getprojectteam':
                createTeamBodyContent(id,data);
                break;
        case 'getallemployeeprojsumperc':
                console.log('Member proj v2');
                var fields=new Array('idPracownik','sumProcentowyUdzial');
                memberProjTabSumPerc=getDataFromJson(data,fields);
                // CHECK EXIST ID AND THEN PUSH PERCENT VALUE
                var found=false;
                for(var i=0;i<memberProjTab.length;i++)
                {
                    //console.log('Member - '+memberProjTab[i][0]);
                    for(j=0;j<memberProjTabSumPerc.length;j++)
                    {
                        //console.log('Member Sum - '+memberProjTabSumPerc[j][0]);
                        if(memberProjTab[i][0]==memberProjTabSumPerc[j][0])
                        {
                            console.log('[SUM PERCENT '+memberProjTab[i][1]+'] FOUND : '+memberProjTabSumPerc[j][1]);
                            // check key exists
                            if(memberProjTab[i][2]!=undefined)
                            {
                                //console.log('UPDATE');
                                memberProjTab[i][2]=parseInt(memberProjTabSumPerc[j][1]);
                            }
                            else
                            {
                                //console.log('PUSH');
                                memberProjTab[i].push(parseInt(memberProjTabSumPerc[j][1]));
                            }
                            found=true;
                            break;
                        }
                    }
                    if(found!==true)
                    {
                        if(memberProjTab[i][2]==undefined)
                        {
                            //console.log(memberProjTab[i][2]);
                            memberProjTab[i].push(0);
                        };
                    }
                    found=false;
                };
                //console.log(memberProjTab);
                createAddTeamBodyContent(document.getElementById('ProjectAdaptedDynamicData'),'addTeamToProject',idProject);
                
                break;
        default:
            alert('[manageTask]ERROR - wrong task');
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
    div.setAttribute("id",divName);
    div.setAttribute("class","col-sm-12");
    div.classList.add("mt-1");
    
    document.getElementById(elementWhereAdd).append(div);
    return divName;
}
// FUNCTION CREATE DEFAULT DATE PICKER ELEMENT
function createDatePicker(idDatePicker,nameDatePicker,value)
{
    if(value==null)
    {
        value='';
    }
    //console.log('---createDatePicker---');
    //var datePickerElement;
    // input PARAMETERS
    var datePickerAttribute=new Array(
	Array('type','text'),
	Array('class','form-control'),
	Array('name',nameDatePicker),
	Array('id',idDatePicker),
        Array('value',value),
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
    //console.log(divGroupElement);
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
    var divRemoveButtonElement=createHtmlElement('div',removeButtonDivButtonAttribute,removeButtonDivButtonClass,removeButtonDivButtonStyle);
    
    divRemoveButtonElement.appendChild(iElement);
    return(divRemoveButtonElement); 
}
function createTeamRow(whereAppend,rowName,type)
{
    console.log('---createTeamRow---');
    console.log(whereAppend);
    console.log(rowName);
    var teamPersLength=teamEditPers.length;
    // div-row
    var i=0;
    var z;
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
        Array('name',rowName+'_pers'+teamElementCounter),
        Array('id',rowName+'_pers'+teamElementCounter)
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
    var selectTeamWorkerElement=createHtmlElement('select',selectTeamWorkerAttribute,selectTeamWorkerClass,selectTeamWorkerStyle);
    selectTeamWorkerElement.onfocus=function(){ manageActMemberProjTab(this.value,this);}; //onclick onfocus
    selectTeamWorkerElement.onchange=function(){ updateActTeamMember(this.value,this);};
    var optionTeamWorkerAttribute=new Array(
            Array('value','dynamicChange')
            );
    var optionTeamWorkerElement;
    // select-team-worker-percent PARAMETERS
    var selectTeamWorkerPercentAttribute=new Array(
        Array('class','form-control'),
        Array('name',rowName+'_percent'+teamElementCounter),
        Array('id',rowName+'_percent'+teamElementCounter)
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

    // CREATE SELECT WITH OPTION percent of usage
    var usedPercent=0;

    // CREATE SELECT WITH OPTION czlonek_grupy
    var tmpPers=new Array();
    var dateStart=null;
    var dateEnd=null;  
    var maxPercent=101;
    if(teamPersLength>0)
    {
        console.log(teamEditPers[0]);
        console.log('ADD EXIST PERS');
        tmpPers[0]=teamEditPers[0][0];
        tmpPers[1]=teamEditPers[0][1];
        actUsedMemberProjTab.push(teamEditPers[0][0]);   
        dateStart=teamEditPers[0][3];
        dateEnd=teamEditPers[0][4];
        
        usedPercent=parseInt(teamEditPers[0][2]); 
       
        selectTeamWorkerPercentElement.appendChild(createTeamRowOption(usedPercent));
    }
   
    else if(type==='new')
    {
        for(z=i;z<memberProjTab.length;z++)
        {
            console.log('ADD NEW PERS');
            console.log(memberProjTab[z][0]);
            if(actUsedMemberProjTab.indexOf(memberProjTab[z][0])===-1)
            {
                // check overall used percent
                console.log(memberProjTab[z][2]);
                if(memberProjTab[z][2]<100)
                {
                    actUsedMemberProjTab.push(memberProjTab[z][0]);
                    tmpPers[0]=memberProjTab[z][0];
                    tmpPers[1]=memberProjTab[z][1];
                    // check used percent
                    usedPercent=checkAvaliableProjPercent(tmpPers[0]);
                    if(usedPercent!=0)
                    {
                        selectTeamWorkerPercentElement.appendChild(createTeamRowOption(usedPercent));
                    }
                    break;
                }
                else
                {
                    console.log('100% usage : '+memberProjTab[z][1]);
                };
            }; 
        };
    }
    else
    {
        // NOTHIN TO DO
    };
   
    for(var ii=0;ii<memberProjTab.length;ii++)
    {
        if(memberProjTab[ii][0]==tmpPers[0])
        {
            console.log('['+ii+'] Max percent : '+maxPercent+'\nMember overall proj percent used : '+memberProjTab[ii][2]+'\nIn this project used percent : '+usedPercent)
            maxPercent=maxPercent-memberProjTab[ii][2]+usedPercent;
            console.log('[MAX PERCENT] : '+maxPercent);
            break;
        }
    };
    for(z=i+1;z<maxPercent;z++)
    {
        if(z!=usedPercent)
        {
            selectTeamWorkerPercentElement.appendChild(createTeamRowOption(z));
        }
    };
    
    optionTeamWorkerAttribute[0][1]=tmpPers[0];
    optionTeamWorkerElement=createHtmlElement('option',optionTeamWorkerAttribute,null,null);
    optionTeamWorkerElement.textContent= tmpPers[1];
    selectTeamWorkerElement.appendChild(optionTeamWorkerElement);
    
    divColSmElement.append(createDatePicker('d-start_'+rowName+teamElementCounter,'d-start_'+rowName+teamElementCounter,dateStart));
    datePickerCounter++;
    divColSmElement2.append(createDatePicker('d-end_'+rowName+teamElementCounter,'d-end_'+rowName+teamElementCounter,dateEnd));
    var removeButtonElement=createRemoveButton();
    removeButtonElement.onclick=function(){removeTeamPersRow(this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode),this.parentNode.parentNode,rowName+'_pers'+teamElementCounter);};
    divColMdAutoElement.append(removeButtonElement);
    divColMd4Element.appendChild(selectTeamWorkerElement);
    divColMd2Element.appendChild(selectTeamWorkerPercentElement);
    
    divRowElement.appendChild(divColMd4Element);
    divRowElement.appendChild(divColMd2Element);
    divRowElement.appendChild(divColSmElement);
    divRowElement.appendChild(divColSmElement2);
    divRowElement.appendChild(divColMdAutoElement);
    
    //console.log(document.getElementById(whereAppend));
    teamElementCounter++;
    console.log('MEMBER DATA LENGTH : '+countOfMemberProjTab);
    console.log('TEAM ELEMENT COUNTER :'+teamElementCounter);
    controlAddTeamButton();
    // REKURENCCJA
    
    if(teamPersLength>0)
    {
        document.getElementById(whereAppend).append(divRowElement);
        teamEditPers.shift();
        createTeamRow(whereAppend,rowName,'exist');
    }
    if(type==='new')
    {
        document.getElementById(whereAppend).append(divRowElement);
    }
    // KONIEC REKURENCCJA
}
function controlAddTeamButton()
{
    console.log('---controlAddTeamButton---');
    console.log(' '+countOfMemberProjTab);
    console.log(' '+teamElementCounter);
    var buttonAdd=document.getElementById('addNewTeamRecord');
    
    if(countOfMemberProjTab==teamElementCounter && buttonAdd!=null)
    {
        console.log('FINISH');
        
        buttonAdd.setAttribute("disabled", "true");
        
    }

}
function createTeamRowOption(usedPercent)
{
        var optionTeamWorkerPercentAttribute=new Array(
            Array('value','dynamicChange')
            );
        var optionTeamWorkerPercentElement;
        optionTeamWorkerPercentAttribute[0][1]=usedPercent;
        optionTeamWorkerPercentElement=createHtmlElement('option',optionTeamWorkerPercentAttribute,null,null);
        optionTeamWorkerPercentElement.textContent=usedPercent+'%';
        return (optionTeamWorkerPercentElement);
}
function checkAvaliableProjPercent(idUser)
{
    var intPercent=0;
    for(ww=0;ww<teamPers.length;ww++)
    {
        if(teamPers[ww][0]==idUser)
        {
            console.log('FOUND '+teamPers[ww][1]);
            intPercent=parseInt(teamPers[ww][2]); 
            console.log('PERCENT - '+intPercent);             
            break;
        };
    };
    return intPercent;
}
function manageActMemberProjTab(idToSetup,elementWhereAppend)
{
    console.log('---manageActMemberProjTab---\nValue: '+idToSetup);
    console.log(elementWhereAppend.firstElementChild.innerHTML);
    console.log(elementWhereAppend.value);
    while (elementWhereAppend.firstChild) 
    {
        //console.log('option to remove: '+elementWhereAppend.firstChild);
        elementWhereAppend.removeChild(elementWhereAppend.firstChild);
    };
    // option-team-worker PARAMETERS
    var optionTeamWorkerAttribute=new Array(
            Array('value',idToSetup)
            );
    var optionTeamWorkerElement;    
    optionTeamWorkerElement=createHtmlElement('option',optionTeamWorkerAttribute,null,null);
    //optionTeamWorkerElement.textContent=memberProjTab[z][1];

    var idNameToSetup=returnRowIdInArray(memberProjTab,0,idToSetup);
    console.log(idNameToSetup);
    nameToSetup=memberProjTab[idNameToSetup][1];
    console.log('true name to setup - '+nameToSetup);
    optionTeamWorkerElement.textContent=nameToSetup;
    elementWhereAppend.appendChild(optionTeamWorkerElement);
    for(var z=0;z<memberProjTab.length;z++)
    {
        
        if(actUsedMemberProjTab.indexOf(memberProjTab[z][0])===-1 && memberProjTab[z][0]!==idToSetup && memberProjTab[z][2]<100)
        {
            optionTeamWorkerAttribute[0][1]=memberProjTab[z][0];
            optionTeamWorkerElement=createHtmlElement('option',optionTeamWorkerAttribute,null,null);
            optionTeamWorkerElement.textContent=memberProjTab[z][1];
            elementWhereAppend.appendChild(optionTeamWorkerElement);
        }
    }
    
    setLastTeamMember(idToSetup);
}
function returnRowIdInArray(array,colToCheck,searchId)
{
    // default if not found
    var returnedId=-1;
    for(var z=0;z<array.length;z++)
    {
        if(array[z][colToCheck]===searchId)
        {
            returnedId=z;
            break;
        }
    }
    return (returnedId);
}
function updateActTeamMember(idToAdd,elementToUpdate)
{
    console.log('---updateActTeamMember---\n');
    console.log('act value of element - '+elementToUpdate.value);
    // RETRIVE LAST ID
    // ADD NEW ID
    console.log('value to remove - '+lastTeamMemberId);
    console.log('removed id - '+actUsedMemberProjTab.indexOf(lastTeamMemberId));
    console.log('value to to add - '+idToAdd);
    // update value of current element
    elementToUpdate.value=idToAdd;
    actUsedMemberProjTab.splice( actUsedMemberProjTab.indexOf(lastTeamMemberId),1,idToAdd);
    //actUsedMemberProjTab.push(idToAdd);
    setLastTeamMember(idToAdd);
}
function setLastTeamMember(idToSetup)
{
    console.log('---setLastTeamMember---\n'+idToSetup);
    lastTeamMemberId=idToSetup;
    
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
function createTeamBodyContent(elementWhereAdd,data)
{
    console.log('---createTeamtBodyContent---');
    //console.log('elementWhereAdd - '+elementWhereAdd);
    //console.log(data);
    
    var tmpArray=new Array();
    //console.log('data length - '+dataLength);
    teamBodyDataLengthContent=data.length;
    //data[]['idPracownik'];
    //data[]['NazwiskoImie'];
    //data[]['procentUdzial'];
    //data[]['datOd'];
    //data[]['datDo'];
    var divElement=createHtmlElement('div',null,null,null);
    var theadLabels=new Array(
            'ID',
            'Imię i nazwisko',
            'Procent udziału',
            'Data od',
            'Data do'
            );
    // table PARAMETERS
    var tableAttribute=new Array(
	Array('class','table')
	);
    var tableClass=new Array(
	'table-striped',
        'table-condensed'
	);
    // thead PARAMETERS
    var theadAttribute=new Array(
	Array('class','bg-warning')
	);
   
    // tbody PARAMETERS
    var tbodyAttribute=new Array(
	Array('id','teamBodyPers')
	);
   
    var table=createHtmlElement('table',tableAttribute,tableClass,null);
    var thead=createHtmlElement('thead',theadAttribute,null,null);
    var trThead=createHtmlElement('tr',null,null,null);
    //var th=createHtmlElement('th',thAttribute,null,null);
    var th;
    var trTbody; // =createHtmlElement('tr',null,null,null);
    var tbody=createHtmlElement('tbody',tbodyAttribute,null,null);
    // THEAD
    for(i=0;i<theadLabels.length;i++)
    {
        th=document.createElement("th");
        th.setAttribute("scope","col");
        th.textContent = theadLabels[i];
        trThead.appendChild(th);
    };
    // TBODY
    for(i=0;i<data.length;i++)
    {
        trTbody=document.createElement('tr');
        Object.keys(data[i]).forEach(function(key,index) {
            tmpArray.push(data[i][key]);
            //console.log(key);
            if(key==='datOd' || key==='datDo')
            {
                // parse data value;
                //var tmp=splitValue(data[i][key],'-');
                //tmp=createValidData(tmp);
                //data[i][key]=tmp;
            }
            //console.log(data[i][key]);
            th=document.createElement("th");
            th.setAttribute("scope","col");
            th.textContent = data[i][key];
            trTbody.appendChild(th);
        });
        teamEditPers.push(tmpArray);
        teamPers.push(tmpArray);
        tmpArray=[];
        tbody.appendChild(trTbody);
    };
    
    //console.log(teamEditPers);
    thead.appendChild(trThead);
    table.appendChild(thead);
    table.appendChild(tbody);
    divElement.appendChild(table); 
    document.getElementById(elementWhereAdd).append(divElement);
    //console.log(table);
    createBodyButtonContent(document.getElementById('ProjectAdaptedButtonsBottom'),'showTeamProject','noValue');
}
//##################################### createAddTeamBodyContent ##########################################
function splitValue(value,delimiter)
{
    if(value.trim()!=='')
    {
        return value.split(delimiter)
    }
    else
    {
        return 0;
    }
}
function createValidData(value)
{
    // value is must be array of 3 elements
    if(value.length!==3)
    {
        return 0;
    }
    else
    {
        return value[2]+"."+value[1]+"."+value[0];
    };
}
function createAddTeamBodyContent(elementWhereAdd,formName,idData)
{ 
    console.log('---createAddTeamBodyContent---');
    console.log('elementWhereAdd :');
    console.log(elementWhereAdd);
   
    removeHtmlChilds(elementWhereAdd);
    removeHtmlChilds(document.getElementById('ProjectAdaptedButtonsBottom'));
    actUsedMemberProjTab=[];
    teamElementCounter=0;
    // add-team FORM
    var formAttribute=new Array(
        Array('name',formName),
        Array('id',formName),
        Array('class','form-horizontal'),
        Array('autocomplete','off'),
        Array('method','POST'),
        Array('ENCTYPE','multipart/form-data'),
        Array('action','javascript:void(0);')
	);
    var formElement=createHtmlElement('form',formAttribute,null,null); 
    // END add-team FORM
    // input hidden with id FORM
    // 
    // TITLE OF SELECT
    var text = document.createTextNode("Członkowie zespołu:");
    elementWhereAdd.appendChild(text);
    // END TITLE OF SELECT
    var inputIdAttribute=new Array(
        Array('name',formName+'id'),
        Array('type','hidden'),
        Array('value',idData)
	);
    var inputIdElement=createHtmlElement('input',inputIdAttribute,null,null);
    var divAdd=document.createElement("div");
    divAdd.setAttribute("class","entry");
    divAdd.classList.add("input-group");
    // add BUTTON
    var button=document.createElement("button");
    button.setAttribute("class","btn");
    button.setAttribute("id","addNewTeamRecord");
    button.classList.add("btn-success");
    button.classList.add("btn-add");
    button.setAttribute("type","button");
    button.onclick=function(){createTeamRow('addTeamToProject','team_czlonek_grupy','new');};

    var iIco=document.createElement("i");
    iIco.setAttribute('class','fa');
    iIco.classList.add("fa-plus");
    iIco.setAttribute("aria-hidden","true");
    button.appendChild(iIco);
    // END add BUTTON
    
    
    divAdd.appendChild(button);
    formElement.appendChild(inputIdElement);
    elementWhereAdd.appendChild(formElement);
    var typeOfRow='new';
    if(teamEditPers.length>0)
    {
        typeOfRow='exist';
    };
    createTeamRow(formName,'team_czlonek_grupy',typeOfRow);
    
    elementWhereAdd.appendChild(divAdd);
    console.log(elementWhereAdd);
    createBodyButtonContent(document.getElementById('ProjectAdaptedButtonsBottom'),'addTeamToProject',idData);
    controlAddTeamButton();
}
//##################################### createAddTeamBodyContent END ######################################
//function createBodyButtonContent(elementWhereAdd,formName)
function createBodyButtonContent(elementWhereAdd,task,formName)
{
    console.log('---createBodyButtonContent---');
    //console.log('elementWhereAdd - '+elementWhereAdd);
    //console.log('task - '+task);
    // GROUP DIV BUTTON
    var divButtonAttribute=new Array(
                Array('class','btn-group')
                );
            var divButtonClass=new Array(
                'pull-right'
                );
            var divButtonElement=createHtmlElement('div',divButtonAttribute,divButtonClass,null);
    // END GROUP DIV BUTTON
    switch(task)
    {
        case 'showTeamProject':
            var addButtonAttribute=new Array(
                Array('class','btn')
                );
            var addButtonClass=new Array(
                      'btn-success',
                      'pull-right'
                       ); 
            var addButtonElement=createHtmlElement('button',addButtonAttribute,addButtonClass,null);
            addButtonElement.innerText = "Dodaj zespół";
            addButtonElement.onclick = function() {
                getAjaxData('getallemployeeprojsumperc','','','');
                
            };
            var editButtonAttribute=new Array(
                Array('class','btn')
                );
            var editButtonClass=new Array(
                      'btn-primary',
                      'pull-right'
                       ); 
            var editButtonElement=createHtmlElement('button',editButtonAttribute,editButtonClass,null);
            editButtonElement.innerText = "Edytuj zespół";
            editButtonElement.onclick = function()
            {
                getAjaxData('getallemployeeprojsumperc','','','');
                
            };
            var cancelButtonAttribute=new Array(
                Array('class','btn')
                );
            var canceButtonClass=new Array(
                'btn-dark',
                'pull-right'
                );
            var cancelButtonElement=createHtmlElement('button',cancelButtonAttribute,canceButtonClass,null);
            cancelButtonElement.innerText = "Zamknij";
            cancelButtonElement.onclick = function() { closeModal('ProjectAdaptedModal'); };
            divButtonElement.appendChild(cancelButtonElement);
            if(teamBodyDataLengthContent>0)
            {
                divButtonElement.appendChild(editButtonElement);
            }
            else
            {
                 divButtonElement.appendChild(addButtonElement);
            };
            elementWhereAdd.appendChild(divButtonElement);
            break;
        case 'addTeamToProject':
            
             // cancel BUTTON
            var cancelButtonAttribute=new Array(
                Array('class','btn')
                );
            var canceButtonClass=new Array(
                'btn-warning',
                'pull-right'
                );
            var cancelButtonElement=createHtmlElement('button',cancelButtonAttribute,canceButtonClass,null);
            cancelButtonElement.innerText = "Anuluj";
            cancelButtonElement.onclick = function() { closeModal('ProjectAdaptedModal'); };
            // END cancel BUTTON
            // confirm BUTTON
            var confirmButtonAttribute=new Array(
                Array('class','btn')
                );
            var confirmButtonClass=new Array(
                'btn-info',
                'pull-right'
                ); 
            var confirmButtonElement=createHtmlElement('button',confirmButtonAttribute,confirmButtonClass,null);
            confirmButtonElement.innerText = "Zatwierdź";
            confirmButtonElement.onclick = function() { postDataToUrl(task); };
            // END confirm BUTTON
            divButtonElement.appendChild(cancelButtonElement);
            divButtonElement.appendChild(confirmButtonElement);
            elementWhereAdd.appendChild(divButtonElement);
            break;
        default:
            alert('[createBodyButtonContent]ERROR - wrong task');
            break;
    };
}
function addHiddenInput(name,value)
{
    console.log('---addHiddenInput---');
    var input=document.createElement("input");
        input.setAttribute("type", "hidden");
        input.setAttribute("value",value);
        input.setAttribute("name",name);
    document.getElementById("additionalDoc").append(input);
}
function createSelect(dataArray,fieldId,fieldName)
{
    console.log('---createSelect---\n'+fieldId);
    //console.log(dataArray);
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
        //console.log('add - gt-no-rounded-right');
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
        var statusProj='';

        for(i = 0; i < arr.length; i++)
        {    
            for(j = 0; j <buttonConfig.length; j++)
            {
                button+="<button class=\"btn "+buttonConfig[j][0]+" mr-0 mb-0 mt-0 ml-0\" data-toggle=\"modal\" data-target=\"#ProjectAdaptedModal\" onclick=\"createAdaptedModal('"+buttonConfig[j][1]+"',"+arr[i].id+",'"+arr[i].temat_umowy+"')\">"+buttonConfig[j][2]+"</button>";
            }
            if(arr[i].status=='n')
            {
                statusProj='Nowy';
            }
            out+="<tr id=\"project"+arr[i].id+"\"><th scope=\"row\">"+arr[i].id+"</th><td>"+arr[i].numer_umowy+"</td><td>"+arr[i].temat_umowy+"</td><td>"+arr[i].create_date+"</td><td>"+arr[i].kier_grupy+"</td><td>"+arr[i].nadzor+"</td><td>"+arr[i].term_realizacji+"</td><td>"+arr[i].harm_data+"</td><td>"+arr[i].koniec_proj+"</td><td>"+statusProj+"</td><td><div class=\"btn-group\">"+button+"</div></td></tr>";
            button='';
        }
        document.getElementById("projectData").innerHTML = out;
    }
}

function createAdaptedModal(modalType,idData,titleData)
{
    console.log('---createAdaptedModal---');
    console.log("TASK "+modalType+" - "+idData+" - "+titleData);
    setAdaptedModalProperties(modalType,idData);
    idRecord=idData;
    //console.log("record to deleted - "+id);
    document.getElementById("projectTitle").innerHTML = titleData;
    document.getElementById("projectId").innerHTML = idData;
}
function removeHtmlChilds(htmlElement)
{
    while (htmlElement.firstChild)
    {
        htmlElement.firstChild.remove(); 
    };
};
function setAdaptedModalProperties(modalType,idData)
{
    console.log('---setAdaptedModalProperties---');
    var bgTitle = document.getElementById("ProjectAdaptedBgTitle");
    var title=document.getElementById("ProjectAdaptedTextTitle");
    bgTitle.classList.value="";
    bgTitle.classList.add("modal-header");

    removeHtmlChilds(document.getElementById('ProjectAdaptedDynamicData'));
    removeHtmlChilds(document.getElementById('ProjectAdaptedButtonsBottom'));
    
    switch(modalType)
    {
        case 'edit':
            bgTitle.classList.add("bg-info");
            title.innerHTML="EDYCJA PROJEKTU:";

            break;
        case 'show':
            bgTitle.classList.add("bg-info");
            title.innerHTML="PODGLĄD PROJEKTU:";

            break;
        case 'documents':
            bgTitle.classList.add("bg-info");
            title.innerHTML="DOKUMENTY PROJEKTU:";
            break;
        case 'team':
            actUsedMemberProjTab=[];
            teamElementCounter=0;
            teamEditPers=[];
            idProject=idData;
            document.getElementById("errDiv-Adapted-overall").style.display = "none";
            document.getElementById("errText-Adapted-overall").innerHTML = "";
            bgTitle.classList.add("bg-warning");
            title.innerHTML="ZESPÓŁ PROJEKTU:";
            getAjaxData('getprojectteam','ProjectAdaptedDynamicData','zespol_projektu','&id='+idData);
            
            break;
        case 'delete':
            bgTitle.classList.add("bg-danger");
            title.innerHTML="USUWANIE PROJEKTU:";
            break;
        case 'team_edit':
            actUsedMemberProjTab=[];
            teamElementCounter=0;
            createAddTeamBodyContent(document.getElementById('ProjectAdaptedDynamicData'),'addTeamToProject',idData);
            createBodyButtonContent(document.getElementById('ProjectAdaptedButtonsBottom'),'addTeamToProject',idData);
        default:
            alert('[ModalCreate]ERROR - wrong type');
            break;
    };
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
function postDataToUrl(nameOfForm)
{
    console.log('---postDataToUrl---');
    console.log(nameOfForm);
    var taskUrl;
    var errTextAjax='';
    var errDivAjax='';
    switch(nameOfForm)
    {
        case 'addTeamToProject':
            taskUrl='modul/manageProject.php?task=addteam';
            errTextAjax='errText-Adapted-overall';
            errDivAjax='errDiv-Adapted-overall';
            break;
        case 'createPdfForm':
            parseValue( document.getElementById('temat_umowy').value,"temat_umowy");
            parseValue( document.getElementById('numer_umowy').value,"numer_umowy");
            if(checkErr())
            {
                console.log("err is true");
                return(0);
            };
            taskUrl='modul/manageProject.php?task=add';
            document.getElementById("errDiv-overall").style.display = "none";
            errTextAjax='errText-overall';
            errDivAjax='errDiv-overall';
            break;
        default:
            break;
    };
    //console.log('postDataToUrl()');
    var xmlhttp = new XMLHttpRequest();
    var host =  getUrl();
    var response="";
    var url =  host+taskUrl;
   
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
            document.getElementById(errTextAjax).innerHTML=response[1];
            document.getElementById(errDivAjax).style.display = "block";
        }
        else
        {
            runTaskAfterAjax(nameOfForm);
        }
      }
      else
      {
          //console.log("error ajax"+this.status+" state - "+this.readyState);
      }
    };
    xmlhttp.open("POST", url, true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(getDataForm(nameOfForm));
}
function runTaskAfterAjax(nameOfForm)
{
    
    switch(nameOfForm)
    {
        case 'addTeamToProject':
            // CLEAR
           
            alert('ok');
            $('#ProjectAdaptedModal').modal('hide'); 
            break;
        case 'createPdfForm':
            getAjaxData('getprojects','test','test');
            $('#addProjectModal').modal('hide'); 
            break;
        default:
            alert('ok'+nameOfForm);
            break;
    };
};
function getDataForm(nameOfForm)
{
    console.log('---getDataForm---\nName of form - '+nameOfForm);
    var formToCheck=document.getElementsByName(nameOfForm);
    var fieldName;
    var fieldValue;
    var params = '';

    for( var i=0; i<formToCheck[0].elements.length; i++ )
    {
        fieldName =formToCheck[0].elements[i].name;
        fieldValue =formToCheck[0].elements[i].value;
        if(fieldName==='inputPdfDok3')
        {
           fieldValue=document.getElementById("pdfTypUmowy").innerHTML;
        };
        console.log(fieldName+" - "+fieldValue);
        params += fieldName + '=' + fieldValue + '&';
    }
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
    console.log("---closeNode---");
    indexToRemove=clearErr.childNodes[1].name;
    console.log(clearErr.childNodes[1].name);
    console.log(nodeToClose);
    err.splice( err.indexOf(indexToRemove), 1 );
    checkErr();
}
function removeTeamPersRow(nodeToClose,clearErr)
{
    console.log("---removeTeamPersRow---\n");
    var idToRemove=nodeToClose.childNodes[0].childNodes[0].firstChild.value;

    console.log("Retrive id - "+idToRemove);
    console.log("Retrive id indexOf to remove - "+actUsedMemberProjTab.indexOf(idToRemove));
    actUsedMemberProjTab.splice( actUsedMemberProjTab.indexOf(idToRemove),1);
    // button
        var buttonAdd=document.getElementById('addNewTeamRecord');
        buttonAdd.removeAttribute("disabled");
        //controlAddTeamButton(false);
        console.log(buttonAdd);
        teamElementCounter--;
    // 
    closeNode(nodeToClose,clearErr);
    
}
//getAllProjects();
getAjaxData('getprojects','test','test','');
getAjaxData('getprojectsleader','inputPdf7','nadzor','');
getAjaxData('getprojectsmanager','inputPdf3','kier_grupy','');
getAjaxData('gettypeofagreement','inputPdf0','typ_umowy','');
getAjaxData('getprojectsmember','projectsmember','czlonek_grupy','');
getAjaxData('getadditionaldictdoc','inputPdf8','dodatkowe_dokumenty','');


