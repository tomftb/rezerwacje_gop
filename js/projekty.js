var err = new Array();
// origin
var memberProjTab=new Array();
var countOfMemberProjTab=0;
var countOfAvaliableMemberProjTab=0;
var memberProjTabSumPerc=new Array();
var currentProjectDetails=new Array();
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
var currentTeamPers=new Array();
var currentTeamPersLength=0;
var teamPers= new Array();
var teamAvaliablePers= new Array();
var teamAvaliablePersCount=0;
var teamBodyDataLengthContent=0;
var numberOfMemebersInProject=0;
var currentProjMemberTeam=new Array();
var legendExtraLabels = new Array(
        ', Actual number of members : '
        );
var currentProjectDoc=new Array();
var projectFileds=new Array(
        new Array('hidden',"",'idProject'),
        new Array('s-umowa',"Do realizacji :",'typ_umowy'),
        new Array('t','Numer:','numer_umowy'),
        new Array('t','Temat:','temat_umowy'),
        new Array('s-prac','Do kierowania grupa powołuje:','kier_grupy'),
        new Array('d','Termin realizacji','term_realizacji'),
        new Array('d','Kierującego zobowiązuję do przedstawienia harmonogramu prac do dnia','harm_data'),
        new Array('d','Kierującego zobowiązuję do zakończenia prac i napisania raportu z realizacji zadania do dnia:','koniec_proj'),
        new Array('s-prac','Nadzór nad realizacją | powierzam','nadzor'),
        new Array('l-dok','Wykaz powiązanych dokumentów:','proj_dok','dokPowiazane')
    );
    
    var inputAttribute= new Array(
        Array('type','text'),
        Array('class','form-control'),
        Array('name','inputProject'),
        Array('id','inputProject'),
        Array('value',''),
        Array('placeholder',''),
        Array('readOnly','true')     
        )
    var inputClass=new Array(
	'mb-1'
	);

//<span id="pdfTypUmowy">umowy</span> 
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
    var fields=new Array();
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
            fields.push('id','ImieNazwisko');
            memberProjTab=getDataFromJson(data,fields);
            //console.log(memberProjTab);
            countOfMemberProjTab=memberProjTab.length;
            MemberProj=createTagWithData('select',data,id,name);
            //console.log('Member Array:');
            //console.log(MemberProj);
            //console.log(memberProjTab);
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
                teamBodyDataLengthContent=data.length;
                fields.push('idPracownik','ImieNazwisko','procentUdzial','datOd','datDo');
                currentProjMemberTeam=getDataFromJson(data,fields);
                numberOfMemebersInProject=teamBodyDataLengthContent;
                document.getElementById("projectId2").innerHTML = legendExtraLabels+numberOfMemebersInProject;
                createTeamBodyContent(id,currentProjMemberTeam); // data
                break;
        case 'getallavaliableemployeeprojsumperc':
                break;
        case 'getallemployeeprojsumperc':
                fields.push('idPracownik','sumProcentowyUdzial');
                memberProjTabSumPerc=getDataFromJson(data,fields);
                createAvaliableTeam();
                createAddTeamBodyContent(document.getElementById('ProjectAdaptedDynamicData'),'addTeamToProject',idProject);
                break;
            case 'getprojectdetail':
                currentProjectDetails=[];
                inputAttribute[6][0]='readOnly';
                fields.push('id','create_date','typ_umowy','typ_umowy_alt','numer_umowy','temat_umowy','kier_grupy','kier_grupy_id','term_realizacji','harm_data','koniec_proj','nadzor','nadzor_id');
                console.log(data[0]);
                console.log(data[1]);
                currentProjectDetails=getDataFromJson(data[0],fields);
                fields=[];
                fields.push('ID','NAZWA');
                currentProjectDetails.push(getDataFromJson(data[1],fields));
                console.log(currentProjectDetails);
                createProjectDetailView(document.getElementById('ProjectAdaptedDynamicData'),taskToRun);
                break;
        case 'getprojectdocuments':
                inputAttribute[6][0]='readOnly';
                currentProjectDoc=[];
                fields.push('ID','NAZWA');
                currentProjectDoc=getDataFromJson(data,fields);
                //console.log(currentProjectDoc);
                createProjectDocView(document.getElementById('ProjectAdaptedDynamicData'),taskToRun);
                break;
        default:
            alert('[manageTask]ERROR - wrong task');
            break;
    }
}
function createProjectDocView(elementWhereAdd,taskData)
{
    console.log('---createProjectDocView---');
    var mainTemplate=document.getElementById('addProjectModalDetail').cloneNode(true);
    mainTemplate.classList.remove("modal");
    mainTemplate.classList.remove("fade");
    createProjectDocViewFields(mainTemplate.childNodes[1].childNodes[1].childNodes[1])
    
    var confirmButton=mainTemplate.childNodes[1].childNodes[1].childNodes[3].childNodes[1].childNodes[1].childNodes[3];
    
    confirmButton.onclick=function()
    {
        confirmButton.innerText='Zatwierdź';
        editForm(mainTemplate.childNodes[1].childNodes[1].childNodes[1],taskData,confirmButton);
    };
    elementWhereAdd.append(mainTemplate);
    console.log(elementWhereAdd);
}
function createProjectDocViewFields(elementWhereAppend)
{
    console.log('---createProjectDocViewFields---');
    removeNodeChilds(elementWhereAppend);
    var labelAttribute=new Array(
	Array('for','inputProject'),
	Array('class','col-sm-6')
	);
    var labelClass=new Array(
	'control-label',
        'text-right',
        'font-weight-bold'
	);
    var div1=new Array(
	Array('class','col-sm-6')
	);
    labelAttribute[0][1]='inputProject'+i;
    labelElement=createHtmlElement('label',labelAttribute,labelClass,null);  
    labelElement.innerText=projectFileds[9][1];
    div1Element=createHtmlElement('div',div1,null,null);
   
    elementWhereAppend.appendChild(labelElement);
    console.log(currentProjectDoc);
    createProjectDocList(currentProjectDoc,div1Element,'inputProjectDoc',1);
    elementWhereAppend.appendChild(div1Element);
    console.log(elementWhereAppend);
}
function createProjectDetailView(elementWhereAdd,taskData)
{
    console.log('---createProjectDetailView---');
    console.log(elementWhereAdd);
    var mainTemplate=document.getElementById('addProjectModalDetail').cloneNode(true);
    var confirmButton=mainTemplate.childNodes[1].childNodes[1].childNodes[3].childNodes[1].childNodes[1].childNodes[3];
    
    console.log(mainTemplate.childNodes[1].childNodes[1].childNodes[1]);
    console.log(mainTemplate.childNodes[1].childNodes[1].childNodes[3].childNodes[1].childNodes[1].childNodes[3]);
    //createProjectDetailViewFields(document.getElementById("addProjectModalDetailFields"));
    createProjectDetailViewFields(mainTemplate.childNodes[1].childNodes[1].childNodes[1]);
    
    confirmButton.onclick=function(){
        //console.log(confirmButton);
        confirmButton.innerText='Zatwierdź';
        //console.log(confirmButton);
        editForm(mainTemplate.childNodes[1].childNodes[1].childNodes[1],taskData,confirmButton);
    };
    
    mainTemplate.classList.remove("modal");
    mainTemplate.classList.remove("fade");
    
    console.log(mainTemplate);
    elementWhereAdd.append(mainTemplate);
}
function createProjectDetailViewFields(elementWhereAppend)
{
    console.log('---createProjectDetailViewFields---');
    //console.log(elementWhereAppend);
    removeNodeChilds(elementWhereAppend);
    // HTML TAGS
    var labelAttribute=new Array(
	Array('for','inputProject'),
	Array('class','col-sm-8')
	);
    var labelClass=new Array(
	'control-label',
        'text-right',
        'font-weight-bold'
	);
    var div1=new Array(
	Array('class','col-sm-4')
	);

    //
    for(var i=0;i<projectFileds.length;i++)
    {
        //console.log(projectFileds[i]);
        labelAttribute[0][1]='inputProject'+i;
        labelElement=createHtmlElement('label',labelAttribute,labelClass,null);
        div1Element=createHtmlElement('div',div1,null,null);
        var tmpArray=new Array();
        if(projectFileds[i][0]=='hidden')
        {
            inputAttribute[0][1]='hidden';  
        }
        else
        {
            inputAttribute[0][1]='text'; 
        };
        //console.log(projectFileds[i][2]);
        inputAttribute[2][1]='inputProject'+i;
        inputAttribute[3][1]='inputProject'+i;
        if(projectFileds[i][2]==='nadzor')
        {
            tmpArray=splitValue(projectFileds[i][1],"|");
            labelElement.innerText=tmpArray[0]+currentProjectDetails[0][2]+tmpArray[1];
        }
        else
        {
             labelElement.innerText=projectFileds[i][1];
        }
       
        elementWhereAppend.appendChild(labelElement);
        
        if(projectFileds[i][2]!='proj_dok')
        {
            inputAttribute[4][1]=assignProjectDataToField(projectFileds[i][2]);
            inputElement=createHtmlElement('input',inputAttribute,inputClass,null);
            div1Element.appendChild(inputElement);
            
        }
        else
        {
            createProjectDocList(currentProjectDetails[1],div1Element,'inputProjectDoc',1);
        };

        elementWhereAppend.appendChild(div1Element);
        
       
    };
}
function createProjectDocList(docArray,elementWhereAppend,inpName,nrColWithData)
{
    var dokCount=0;
    var inputElement;
    
    for(var d=0;d<docArray.length;d++)
    {
        //console.log(docArray[d][nrColWithData]);
        inputAttribute[2][1]=inpName+dokCount;
        inputAttribute[3][1]=inpName+dokCount;
        inputAttribute[4][1]=docArray[d][nrColWithData];
        inputElement=createHtmlElement('input',inputAttribute,inputClass,null);
        elementWhereAppend.appendChild(inputElement);
        dokCount++
    };
}
function assignProjectDataToField(fieldId)
{
    console.log('---assignProjectDataToField---');
    var valueToReturn='';
    switch(fieldId)
    {
        case 'idProject':
            valueToReturn=currentProjectDetails[0][0];
            break;
        case 'typ_umowy':
            valueToReturn=currentProjectDetails[0][2];
            break;
        case 'numer_umowy':
            valueToReturn=currentProjectDetails[0][4];
            break;
        case 'temat_umowy':
            valueToReturn=currentProjectDetails[0][5];
            break;
        case 'kier_grupy':
            valueToReturn=currentProjectDetails[0][6];
            break;
        case 'term_realizacji':
            valueToReturn=currentProjectDetails[0][8];
            break;
        case 'harm_data':
            valueToReturn=currentProjectDetails[0][9];
            break;
        case 'koniec_proj':
            valueToReturn=currentProjectDetails[0][10];
            break;
        case 'nadzor':
             valueToReturn=currentProjectDetails[0][11];
            break;
        default:
            break;
    };
                
    return (valueToReturn);            
}
function removeNodeChilds(elementWhereRemove)
{
    console.log('---removeNodeChilds---');
    while (elementWhereRemove.firstChild) 
    {
        elementWhereRemove.removeChild(elementWhereRemove.firstChild);
    };
}
function createAvaliableTeam()
{
    console.log('---createAvaliableTeam---');
    console.log('[memberProjTab]L : '+countOfMemberProjTab);
    console.log('[getprojectteam]L :'+teamBodyDataLengthContent);
    console.log('[memberProjTabSumPerc]L : '+memberProjTabSumPerc.length);
    //console.log('memberProjTab:');
    //console.log(memberProjTab);
    //console.log('currentProjMemberTeam:');
    //console.log(currentProjMemberTeam);
    //console.log('memberProjTabSumPerc:');
    //console.log(memberProjTabSumPerc);
    var tmpArray=new Array();
    var found=false;
    var currentUsed=0;
    var avaliableUsed=0;
    for(var i=0;i<memberProjTab.length;i++)
    {
        //CHECK IN CURRENT PROJECT
        for(j=0;j<currentProjMemberTeam.length;j++)
        {
            if(memberProjTab[i][0]===currentProjMemberTeam[j][0])
            {
                //console.log('FOUND IN CURRENT PROJECT '+memberProjTab[i][1]);
                //console.log(memberProjTab[i][0]+' - '+memberProjTab[i][0]);
                /*
                 * [id]
                 * [Imie i Nazwisko]
                 * [Used Percent]
                 * [Data Start]
                 * [Data End]
                 * [NOT AVALIABLE]
                 */ 
                currentUsed=parseInt(currentProjMemberTeam[j][2]);
                //CHECK OVERALL USED
                for(k=0;k<memberProjTabSumPerc.length;k++)
                {
                    if(memberProjTab[i][0]===memberProjTabSumPerc[k][0])
                    {
                        avaliableUsed=parseInt(memberProjTabSumPerc[k][1]);
                        avaliableUsed=100-avaliableUsed+currentUsed;
                        break;
                    }
                }
                tmpArray=createArray(memberProjTab[i][0],currentProjMemberTeam[j][1],currentUsed,currentProjMemberTeam[j][3],currentProjMemberTeam[j][4],avaliableUsed);
                currentTeamPers.push(tmpArray);
                found=true;
                tmpArray=[];
                tmpArray=createArray(memberProjTab[i][0],currentProjMemberTeam[j][1],1,currentProjMemberTeam[j][3],currentProjMemberTeam[j][4],avaliableUsed);
                teamAvaliablePers.push(tmpArray);
                break;
            }
        }
        // IF NOT FOUND
        if(!found)
        {
            //console.log('NOT FOUND '+memberProjTab[i][1]);
            //CHECK OVERALL USED
            for(k=0;k<memberProjTabSumPerc.length;k++)
            {
                if(memberProjTab[i][0]===memberProjTabSumPerc[k][0])
                {
                    if(memberProjTabSumPerc[k][1]<100)
                    {
                        // ONLY LESS THAN 100% USED PERCENT
                        currentUsed=parseInt(memberProjTabSumPerc[k][1]);
                        avaliableUsed=100-currentUsed;
                        teamAvaliablePers.push(createArray(memberProjTab[i][0],memberProjTab[i][1],1,'00.00.0000','00.00.0000',avaliableUsed)); 
                    }
                    else
                    {
                        //
                        console.log('100 % USED - NOT ADD');
                    }
                    found=true;
                    break;
                }
            }
            if(!found)
            {
                // ADD WITH ZEROS
                teamAvaliablePers.push(createArray(memberProjTab[i][0],memberProjTab[i][1],1,'00.00.0000','00.00.0000',100)); 
            }
        }
        tmpArray=[];
        found=false;
    }    
    teamAvaliablePersCount=teamAvaliablePers.length;
    currentTeamPersLength=currentTeamPers.length;
    console.log('[COUNT] AVALIABLE PERS : '+teamAvaliablePersCount);
    console.log('[COUNT] CURRENT TEAM PERS : '+currentTeamPersLength);
    console.log('TEAM AVALIABLE PERS:');
    console.log(teamAvaliablePers);
    console.log('CURRENT TEAM:');
    console.log(currentTeamPers);
    
}
function createArray()
{
    //console.log('--createArray---');
    var tmpArray=new Array();
    for (var i = 0; i < arguments.length; i++)
    {
      tmpArray.push(arguments[i]);
    }
    //console.log(tmpArray);
    return tmpArray;
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
            break;
        case 'ol':
            createdTag=createOl(data,id,name);
            break;
        default:
            alert('wrong tag to create');
            return "";
            break;
    }
    //console.log(createdTag);
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
                fields.push('id','ImieNazwisko');
            break;
        case 'typ_umowy':
                fields.push('ID','Nazwa','NazwaAlt');
            break;
        case 'dodatkowe_dokumenty':
                fields.push('ID','Nazwa','SpecificId');
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
    console.log('---createTeamRow---\n'+type);
    //console.log(whereAppend);
    //console.log(rowName);
    
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

    // CREATE SELECT WITH OPTION czlonek_grupy
    var tmpPers=new Array();
    var dateStart=null;
    var dateEnd=null;  
    if(type==='exist')
    {
        //console.log(teamEditPers[0]);
        tmpPers.push(currentTeamPers[0][0],currentTeamPers[0][1],currentTeamPers[0][2],currentTeamPers[0][5]);
        dateStart=currentTeamPers[0][3];
        dateEnd=currentTeamPers[0][4];
        actUsedMemberProjTab.push(currentTeamPers[0][0]); 
        selectTeamWorkerPercentElement.appendChild(createTeamRowOption(tmpPers[2]));
        currentTeamPers.shift();
    }
    else
    {
        changeNumberOfMembers(1);
        for(z=i;z<teamAvaliablePers.length;z++)
        {
            //console.log('ADD NEW PERS');
            if(actUsedMemberProjTab.indexOf(teamAvaliablePers[z][0])===-1)
            {
                actUsedMemberProjTab.push(teamAvaliablePers[z][0]);
                tmpPers.push(teamAvaliablePers[z][0],teamAvaliablePers[z][1],teamAvaliablePers[z][2],teamAvaliablePers[z][5]);
                selectTeamWorkerPercentElement.appendChild(createTeamRowOption(tmpPers[2]));
                break;
            }; 
        };
    }
   
    for(z=i+1;z<tmpPers[3]+1;z++)
    {
        if(z!=tmpPers[2])
        {
            selectTeamWorkerPercentElement.appendChild(createTeamRowOption(z));
        }
    };
    selectTeamWorkerPercentElement.onfocus=function(){ manageActMemberProjUsedPercent(tmpPers[0],selectTeamWorkerPercentElement,rowName,teamElementCounter);};
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
    
    teamElementCounter++;
    controlAddTeamButton();
    document.getElementById(whereAppend).append(divRowElement);
}
function controlAddTeamButton()
{
    console.log('---controlAddTeamButton---');
    console.log('Avaliable pers : '+teamAvaliablePersCount);
    console.log('Current used pers : '+teamElementCounter);
    var buttonAdd=document.getElementById('addNewTeamRecord');
    
    if(teamAvaliablePersCount==teamElementCounter && buttonAdd!=null)
    {
        console.log('FINISH');
        buttonAdd.setAttribute("disabled", "true"); 
    }
}
function manageActMemberProjUsedPercent(idPers,elementWhereUpdate,rowName,teamElementCounter)
{
    console.log('---manageActMemberProjUsedPercent---\n'+idPers);
    //console.log('Last Team Member id : '+lastTeamMemberId);
    if(lastTeamMemberId!=-1 && lastTeamMemberId!=idPers)
    {
        //console.log(elementWhereUpdate.firstChild);
        while (elementWhereUpdate.firstChild) 
        {
            elementWhereUpdate.removeChild(elementWhereUpdate.firstChild);
        };
        //console.log(elementWhereUpdate);
        elementWhereUpdate.onfocus=function(){ manageActMemberProjUsedPercent(idPers,elementWhereUpdate,rowName,teamElementCounter);};
        console.log('UPDATE AVALIABLE USED VALUE');
        for(var z=0;z<teamAvaliablePersCount;z++)
        {
            if(teamAvaliablePers[z][0]==lastTeamMemberId)
            {
                //console.log(teamAvaliablePers[z][1]);
                //console.log(teamAvaliablePers[z][5]+1);
                for(var y=1;y<teamAvaliablePers[z][5]+1;y++)
                {
                    elementWhereUpdate.appendChild(createTeamRowOption(y));
                };
                break;
            }
        }
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
    for(var z=0;z<teamAvaliablePers.length;z++)
    {
        
        if(actUsedMemberProjTab.indexOf(teamAvaliablePers[z][0])===-1 && teamAvaliablePers[z][0]!==idToSetup)
        {
            optionTeamWorkerAttribute[0][1]=teamAvaliablePers[z][0];
            optionTeamWorkerElement=createHtmlElement('option',optionTeamWorkerAttribute,null,null);
            optionTeamWorkerElement.textContent=teamAvaliablePers[z][1];
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
        //console.log(array[z]);
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
        //console.log(data[i].length);
        for(j=0;j<data[i].length;j++)
        {
            //console.log(data[i][j]);
            th=document.createElement("th");
            th.setAttribute("scope","col");
            if(j==2)
            {
                 th.textContent = data[i][j]+'%';
            }
            else
            {
                th.textContent = data[i][j];
            }
            
            trTbody.appendChild(th);
        }
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
function createProjectRemoveBodyContent(elementWhereAdd,formName,idData)
{ 
    console.log('---createProjectRemoveBodyContent---');
    console.log('elementWhereAdd :');
    console.log(elementWhereAdd);
   
    removeHtmlChilds(elementWhereAdd);
    removeHtmlChilds(document.getElementById('ProjectAdaptedButtonsBottom'));

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
    var inputIdAttribute=new Array(
        Array('name',formName+'id'),
        Array('type','hidden'),
        Array('value',idData)
	);
    var inputIdElement=createHtmlElement('input',inputIdAttribute,null,null);
    formElement.appendChild(inputIdElement);
    elementWhereAdd.appendChild(formElement);

    console.log(elementWhereAdd);
}
//##################################### createAddTeamBodyContent END ######################################
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
  
    if(currentTeamPersLength>0)
    {
        for(var tt=0;tt<currentTeamPersLength;tt++)
        {
            createTeamRow(formName,'team_czlonek_grupy','exist');
        }
    }
    else
    {
        createTeamRow(formName,'team_czlonek_grupy','new');
    };
    elementWhereAdd.appendChild(divAdd);
    console.log(elementWhereAdd);
    createBodyButtonContent(document.getElementById('ProjectAdaptedButtonsBottom'),'addTeamToProject',idData);
    controlAddTeamButton();
}
//##################################### createAddTeamBodyContent END ######################################
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
    var cancelButtonAttribute=new Array(
                Array('class','btn')
                );
    var canceButtonClass=new Array(
                'btn-dark',
                'pull-right'
                );
    var cancelButtonElement=createHtmlElement('button',cancelButtonAttribute,canceButtonClass,null);
    cancelButtonElement.innerText = "Anuluj";
    cancelButtonElement.onclick = function() { closeModal('ProjectAdaptedModal'); };
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
                getAjaxData('getallemployeeprojsumperc','','',''); //getallemployeeprojsumperc
                
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
                getAjaxData('getallemployeeprojsumperc','','',''); //getallemployeeprojsumperc
                
            };
            
            cancelButtonElement.innerText = "Zamknij";
            
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
        case 'closeProject':   
        case 'removeProject':
            var confirmButtonAttribute=new Array(
                Array('class','btn')
                );
            var confirmButtonClass=new Array(
                'btn-secondary',
                'pull-right'
                ); 
            var label='Zamknij';
            if(task==='removeProject')
            {
                label= "Usuń";
                confirmButtonClass[0]='btn-danger';
            }
            var confirmButtonElement=createHtmlElement('button',confirmButtonAttribute,confirmButtonClass,null);
            confirmButtonElement.innerText = label;
            confirmButtonElement.onclick = function() { postDataToUrl(task); };
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
            //new Array('btn-info','edit',"Edytuj"),
            //new Array('btn-info','show','Podgląd'),
        var buttonConfig=new Array(
            new Array('btn-info','details','Szczegóły'),
            new Array('btn-info','documents','Dokumenty'),
            new Array('btn-warning','team','Zespół'),
            
         );
        var button='';
        var out = "";
        var i;
        var j;
        var statusProj='';

        for(i = 0; i < arr.length; i++)
        {    
            buttonConfig=[];
            buttonConfig.push(new Array('btn-info','details','Szczegóły'));
            buttonConfig.push(new Array('btn-info','documents','Dokumenty'));
            buttonConfig.push(new Array('btn-warning','team','Zespół'));
            switch(arr[i].status)
            {
                case 'n':
                    statusProj='Nowy';
                case 'm':
                    
                    if(arr[i].status==='m')
                    {
                        statusProj='W trakcie';
                    }
                    buttonConfig.push(new Array('btn-secondary','close','Zamknij'));
                    buttonConfig.push(new Array('btn-danger','delete','Usuń'));
                    break;
                case 'd':
                    statusProj='Usunięty';
                case 'c':
                    statusProj='Zamknięty';
                    break;
                default:
                    break;
            };
            
            for(j = 0; j <buttonConfig.length; j++)
            {
                button+="<button class=\"btn "+buttonConfig[j][0]+" mr-0 mb-0 mt-0 ml-0\" data-toggle=\"modal\" data-target=\"#ProjectAdaptedModal\" onclick=\"createAdaptedModal('"+buttonConfig[j][1]+"',"+arr[i].id+",'"+arr[i].temat_umowy+"')\">"+buttonConfig[j][2]+"</button>";
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
    setAdaptedModalProperties(modalType,idData,titleData);
    idRecord=idData;
    //console.log("record to deleted - "+id);
    
    document.getElementById("projectId").innerHTML = idData;
}
function removeHtmlChilds(htmlElement)
{
    while (htmlElement.firstChild)
    {
        htmlElement.firstChild.remove(); 
    };
};
function setAdaptedModalProperties(modalType,idData,titleData)
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
            document.getElementById("projectTitle").innerHTML = titleData;
            bgTitle.classList.add("bg-info");
            title.innerHTML="DOKUMENTY PROJEKTU:";
            getAjaxData('getprojectdocuments','ProjectAdaptedDynamicData','project_documents','&id='+idData);
            break;
        case 'details':
            document.getElementById("projectTitle").innerHTML = '';
            bgTitle.classList.add("bg-info");
            title.innerHTML="SZCZEGÓŁY PROJEKTU:";
            getAjaxData('getprojectdetail','ProjectAdaptedDynamicData','project_details','&id='+idData);
            break;
        case 'team':
            document.getElementById("projectTitle").innerHTML = titleData;
            actUsedMemberProjTab=[];
            teamElementCounter=0;
            teamEditPers=[];
            currentTeamPers=[];
            teamAvaliablePers=[];
            idProject=idData;
            document.getElementById("errDiv-Adapted-overall").style.display = "none";
            document.getElementById("errText-Adapted-overall").innerHTML = "";
            bgTitle.classList.add("bg-warning");
            title.innerHTML="ZESPÓŁ PROJEKTU:";
            getAjaxData('getprojectteam','ProjectAdaptedDynamicData','zespol_projektu','&id='+idData);
            break;
        case 'delete':
            document.getElementById("projectTitle").innerHTML = titleData;
            bgTitle.classList.add("bg-danger");
            title.innerHTML="USUWANIE PROJEKTU:";
            createProjectRemoveBodyContent(document.getElementById('ProjectAdaptedDynamicData'),'removeProject',idData);
            createBodyButtonContent(document.getElementById('ProjectAdaptedButtonsBottom'),'removeProject',idData);
            break;
        case 'team_edit':
            document.getElementById("projectTitle").innerHTML = titleData;
            actUsedMemberProjTab=[];
            teamElementCounter=0;
            createAddTeamBodyContent(document.getElementById('ProjectAdaptedDynamicData'),'addTeamToProject',idData);
            createBodyButtonContent(document.getElementById('ProjectAdaptedButtonsBottom'),'addTeamToProject',idData);
        case 'close':
            document.getElementById("projectTitle").innerHTML = titleData;
            bgTitle.classList.add("bg-secondary");
            title.innerHTML="ZAMYKANIE PROJEKTU:";
            createProjectRemoveBodyContent(document.getElementById('ProjectAdaptedDynamicData'),'closeProject',idData);
            createBodyButtonContent(document.getElementById('ProjectAdaptedButtonsBottom'),'closeProject',idData);
            break;
        default:
            alert('[setAdaptedModalProperties]ERROR - wrong type');
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
function postDataToUrl(nameOfForm)
{
    console.log('---postDataToUrl---');
    console.log(nameOfForm);
    var taskUrl;
    var errTextAjax='';
    var errDivAjax='';
    var confirmTask=false;
    var label;
    switch(nameOfForm)
    {
        case 'addTeamToProject':
            taskUrl='modul/manageProject.php?task=addteam';
            errTextAjax='errText-Adapted-overall';
            errDivAjax='errDiv-Adapted-overall';
            confirmTask=true;
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
            confirmTask=true;
            break;
        case 'removeProject':
            label='usunięcie'
        case 'closeProject':
            if(nameOfForm==='closeProject')
            {
                label='zamknięcie'
            }
            taskUrl='modul/manageProject.php?task='+nameOfForm;
            confirmTask = confirm("Potwierdź "+label);
            break;
        default:
            break;
    };
    //console.log('postDataToUrl()');
    var xmlhttp = new XMLHttpRequest();
    var host =  getUrl();
    var response="";
    var url =  host+taskUrl;
    if (confirmTask === true)
    {
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
    };
}
function runTaskAfterAjax(nameOfForm)
{
    
    switch(nameOfForm)
    {
        case 'addTeamToProject':
            // CLEAR
            alert('Team updated');
            $('#ProjectAdaptedModal').modal('hide'); 
            break;
        case 'removeProject':
            getAjaxData('getprojects','test','test');
            $('#ProjectAdaptedModal').modal('hide'); 
            break;
        case 'createPdfForm':
            getAjaxData('getprojects','test','test');
            $('#addProjectModal').modal('hide'); 
            break;
        default:
            alert('[runTaskAfterAjax]WRONG TASK - '+nameOfForm);
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
    console.log("---setDefault()---");
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
    changeNumberOfMembers(-1);
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
function changeNumberOfMembers(value)
{
    numberOfMemebersInProject=numberOfMemebersInProject+value;
    document.getElementById("projectId2").innerHTML = legendExtraLabels+numberOfMemebersInProject;
}
function editForm(elementWhereChange,taskData,editButton)
{ 
    switch(taskData)
    {
        case 'getprojectdocuments':
            editButton.onclick=function(){ postDataToUrl();};
            inputAttribute[6][0]='noreadOnly';
            createProjectDocViewFields(elementWhereChange);
            break;
        case 'getprojectdetail':
            inputAttribute[6][0]='noreadOnly';
            createProjectDetailViewFields(elementWhereChange);
            break;
        default:
            break;
    };
    console.log(elementWhereChange);
}
function testNothing()
{
    console.log('---testNothing---');
}
getAjaxData('getprojects','test','test','');
getAjaxData('getprojectsleader','inputPdf7','nadzor','');
getAjaxData('getprojectsmanager','inputPdf3','kier_grupy','');
getAjaxData('gettypeofagreement','inputPdf0','typ_umowy','');
getAjaxData('getprojectsmember','projectsmember','czlonek_grupy','');
getAjaxData('getadditionaldictdoc','inputPdf8','dodatkowe_dokumenty','');