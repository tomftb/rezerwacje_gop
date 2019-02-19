// origin
var errInputValue= new Array();
var memberProjTab=new Array();
var countOfMemberProjTab=0;
var countOfAvaliableMemberProjTab=0;
var memberProjTabSumPerc=new Array();
var currentProjectDetails=new Array();
// for manipulate
var actUsedMemberProjTab=new Array();
var actMemberProjPers=0;
var counter = 0;

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
var TypeOfAgreementTab=new Array();
var AddDictDocTab= new Array();
var ManagerProjTab= new Array();
var liderProjTab = new Array();
var liderProj="";
var gltechProjTab = new Array();
var gltechProj="";
var glkierProjTab = new Array();
var glkierProj="";
var projectEditMode=false;
var projectDocEditMode=false;
var dokCount=0;
var legendExtraLabels = new Array(
        ', Actual number of members : '
        );
var currentProjectDoc=new Array();
var projectFileds=new Array(
        new Array('hidden','','idProject'),
        new Array('s-umowa',"Do realizacji :",'typ_umowy'),
        new Array('t','Numer:','numer_umowy'),
        new Array('t','Temat:','temat_umowy'),
        new Array('s-kier','Do kierowania grupa powołuje:','kier_grupy'),
        new Array('d','Termin realizacji','term_realizacji'),
        new Array('d','Kierującego zobowiązuję do przedstawienia harmonogramu prac do dnia','harm_data'),
        new Array('d','Kierującego zobowiązuję do zakończenia prac i napisania raportu z realizacji zadania do dnia:','koniec_proj'),
        new Array('s-nadzor','Nadzór nad realizacją | powierzam','nadzor'),
        new Array('s-gltech','Główny technolog: ','gl_tech'),
        new Array('s-glkier','Kierownik Ośrodka: ','gl_kier'),
        new Array('l-dok','Wykaz powiązanych dokumentów:','proj_dok','dokPowiazane')
    );
// GLOBAL INPUT PROPERTIES
var inputAttribute= new Array(
        Array('type','text'),
        Array('class','form-control'),
        Array('name','inputProject'),
        Array('id','inputProject'),
        Array('value',''),
        Array('placeholder',''),
        Array('no-readOnly','true'),
        Array('no-disabled','')
        );
var inputClass=new Array(
    'mb-1'
    );
var inputStyle=new Array();
 // END GLOBAL INPUT PROPERTIES
 // GLOBAL SELECT PROPERTIES
 // GLOBAL DATA PICKER PROPERTIES
var datePickerAttribute=new Array(
	Array('type','text'),
	Array('class','form-control'),
	Array('name',''),
	Array('id',''),
        Array('value',''),
	Array('placeholder','DD.MM.RRRR'),
        Array('no-readOnly','true'),
        Array('no-disabled','')
    );
var datePickerClass=new Array();
var datePickerStyle=new Array();
        // span PARAMETERS
var datePickerSpanAttribute=new Array(
	Array('class','input-group-text'),
        Array('no-readOnly','true'),
	Array('aria-hidden','true'),
        Array('no-disabled',''),
	);
var datePickerSpanClass=new Array();
var datePickerSpanStyle=new Array();
// div-input-group PARAMETERS
var datePickerDivGroupAttribute=new Array(
	Array('class','input-group'),
	Array('data-provide','datepicker'),
        Array('no-disabled','')
	);
        // 
var datePickerDivGroupClass=new Array(
	'date',
        'mb-1'
	);
var datePickerIstyle=new Array();
 // END GLOBAL DATA PICKER PROPERTIES
// GLOBAL SELECT
var selectAttribute=new Array(
            Array('class','form-control'),
            Array('id',''),
            Array('name',''),
            Array('no-readOnly','true'),
            Array('no-disabled','true')
            );
var selectClass=new Array();
var selectStyle=new Array();
// BUTTON

    var removeButtonDivButtonClass=new Array(
	'btn-danger',
        'gt-no-rounded-left',
        'disabled'
	);
// ADD BUTTON
var addButtonAttribute=new Array(
            Array('class','btn')

            );
var addButtonClass=new Array(
	'btn-success',
        'btn-add',
        'disabled'
	);
// END ADD BUTTON
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
        case 'display':
            htmlElement.style.display=styleValue;
            break;
        default:
            break;
    };
    return(htmlElement);
}
function parseFieldValue(data,fieldType,errDivAlt)
{
    console.log('---parseFieldValue()---');
    console.log(data);
    console.log('FIELD TYPE: '+fieldType+'\nERR DIV ALT: '+errDivAlt);
    console.log("DATA TYPE: "+typeof(data));
    var errDiv='';
    var plChars='ąĄćĆęĘłŁńŃóÓśŚżŻźŹ';
    var valueToParse;
    var typeOfValueToParse;
    
    if(typeof(data)==='object')
    {
        valueToParse=data.value;
        typeOfValueToParse=data.name;
        errDiv=data.parentNode.childNodes[1];   
        console.log(data.parentNode.childNodes[1]);
    }
    else
    {
        valueToParse=data;
        typeOfValueToParse=fieldType;
        errDiv=document.getElementById(errDivAlt);
    };
    valueToParse=myTrim(valueToParse);
    var thisRegex = new RegExp("^[\\da-zA-Z'"+plChars+"][\\/\\-\\_\\s\\da-zA-Z"+plChars+"]*[\\.\\s\\da-zA-Z"+plChars+"]{1}$");
    if(!thisRegex.test(valueToParse))
    {
        console.log('[err]['+typeOfValueToParse+'] '+valueToParse);
        if(errInputValue.indexOf(typeOfValueToParse)===-1)
        {
            errInputValue.push(typeOfValueToParse); 
        };
        errDiv.innerText = "Błąd składni";
        errDiv.style.display = "block";
    }
    else
    {
        if(errInputValue.indexOf(typeOfValueToParse)!==-1)
        {
            errInputValue.splice(errInputValue.indexOf(typeOfValueToParse), 1 );
        };
        console.log('[ok]['+typeOfValueToParse+'] '+valueToParse);
        errDiv.innerText = "";
        errDiv.style.display = "none";
    }
    checkIsErr();
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

function setTypOfAgreement(valueToSetup,idLabel,idListDok)
{
    console.log('---setTypeOfAgreement---');
    console.log("VALUE: "+valueToSetup+"\nID ELEMENT LABEL: "+idLabel+"\nID ELEMENT IN DOK LIST: "+idListDok);
    var splitValue=valueToSetup.split("|");
    
    document.getElementById(idLabel).innerText =splitValue[1];
    //document.getElementById("pdfDokListTypUmowy").innerHTML =splitValue[2];
}
function addFormField()
{
    console.log('---addFormField()---\ncounter :'+counter);
    var newFields = document.getElementById('readroot').cloneNode(true);
    newFields.id = '';

	newFields.style.display = 'block';
	var newField = newFields.childNodes;
        var finallyField=newField[1].childNodes;
	for (var i=0;i<finallyField.length;i++)
        {
            var theName = finallyField[i].name;
		if (theName)
                {
                        newField[1].childNodes[i].name = "pdfExtra"+counter;
                        newField[1].childNodes[5].id="errDiv-pdfExtra"+counter;
                        newField[1].childNodes[5].childNodes[1].childNodes[1].id="errText-pdfExtra"+counter;
                }
	}
	var insertHere = document.getElementById('writeroot');
        insertHere.appendChild(newFields); 
        counter++;
}
//function getAjaxData(modul,task)
function getAjaxData(task,fieldIdToSetup,nameToSetup,addon,projectStatus)
{
    console.log('---getAjaxData()---');
    console.log("TASK : "+task+"\nID FIELD TO SETUP : "+fieldIdToSetup+"\nADDON : "+addon);

    if(typeof addon === 'undefined')
    {
        addon='';
    };
    var host =  getUrl();
    // example of url host + modul/manageProject.php?task+ task getprojects
    var url =  host+'modul/manageProject.php?task='+task+addon;
    var xmlhttp = new XMLHttpRequest();
    var ajaxData = new Array();
    xmlhttp.onreadystatechange = function()
    {
      if (this.readyState === 4 && this.status === 200)
      {
        if(task==='getpdf')
        {
            ajaxData=this.getAllResponseHeaders();
            //ajaxData=this.responseText;
            console.log(ajaxData);
        }
        else
        {
            ajaxData = JSON.parse(this.responseText);
            if(ajaxData[0][0]==='0')
            {
                manageTaskAfterAjaxGet(task,ajaxData[1],fieldIdToSetup,nameToSetup,projectStatus);
            }
            else
            {
                alert("[getAJaxData]ERROR: "+ajaxData[1]);
            };
        }
        //console.log(ajaxData);
        //console.log(ajaxData[0][0]);
      }
      else
      {
          //console.log("error ajax"+this.status+" state - "+this.readyState);
      }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send(); 
}
function manageTaskAfterAjaxGet(taskToRun,data,fieldId,name,projectStatus)
{
    console.log('---manageTaskAfterAjaxGet()---');
    //console.log('TASK TO RUN - '+taskToRun+'\nDATA - '+data+'\nID - '+fieldId+'\nNAME - '+name+'\nPROJECT STATUS - '+projectStatus);
    var fields=new Array();
    //console.log('data - '+data+'\nid - '+id+'\nname - '+name);
    switch(taskToRun)
    {
        case 'getprojects':
            setAllProjects(data);
            break;
        case 'getprojectgltech': // SET GLOBAL liderProj
            fields.push('id','ImieNazwisko');
            gltechProjTab=getDataFromJson(data,fields);
            gltechProj=createTagWithData('select',gltechProjTab,fieldId,name);
            break;
        case 'getprojectglkier': // SET GLOBAL liderProj
            fields.push('id','ImieNazwisko');
            glkierProjTab=getDataFromJson(data,fields);
            glkierProj=createTagWithData('select',glkierProjTab,fieldId,name);
            break;
        case 'getprojectsleader': // SET GLOBAL liderProj
            fields.push('id','ImieNazwisko');
            liderProjTab=getDataFromJson(data,fields);
            liderProj=createTagWithData('select',liderProjTab,fieldId,name);
            break;
        case 'getprojectsmember': // SET GLOBAL PROJECT Members
            fields.push('id','ImieNazwisko');
            memberProjTab=getDataFromJson(data,fields);
            countOfMemberProjTab=memberProjTab.length;
            MemberProj=createTagWithData('select',memberProjTab,fieldId,name);
            break;
        case 'getprojectsmanager': // SET GLOBAL liderProj
            fields.push('id','ImieNazwisko');
            ManagerProjTab=getDataFromJson(data,fields);
            ManagerProj=createTagWithData('select',ManagerProjTab,fieldId,name);
            break;
        case 'gettypeofagreement': // SET GLOBAL Type Of Agreement
            fields.push('ID','Nazwa','NazwaAlt');
            TypeOfAgreementTab=getDataFromJson(data,fields);
            TypeOfAgreementTabJson=data;
            //TypeOfAgreement=createTagWithData('select',data,id,name);
            TypeOfAgreement=createTagWithData('select',TypeOfAgreementTab,fieldId,name);
            console.log('Type Of Agreement Array:');
            break;
        case 'getadditionaldictdoc': // SET GLOBAL DICTIONARY OF ADDITIONAL DOCUMENTS
            fields.push('ID','Nazwa','SpecificId');
            AddDictDocTab=getDataFromJson(data,fields);
            AddDictDoc=createTagWithData('ol',AddDictDocTab,fieldId,name);
            break;
        case 'getprojectteam':
            teamBodyDataLengthContent=data.length;
            fields.push('idPracownik','ImieNazwisko','procentUdzial','datOd','datDo');
            currentProjMemberTeam=getDataFromJson(data,fields);
            numberOfMemebersInProject=teamBodyDataLengthContent;
            document.getElementById("projectId2").innerHTML = legendExtraLabels+numberOfMemebersInProject;
            createTeamBodyContent(fieldId,currentProjMemberTeam,projectStatus); // data
            break;
        case 'getallavaliableemployeeprojsumperc':
                break;
        case 'getallemployeeprojsumperc':
                fields.push('idPracownik','sumProcentowyUdzial');
                memberProjTabSumPerc=getDataFromJson(data,fields);
                setEnabledFields(taskToRun);
                createAvaliableTeam();
                createAddTeamBodyContent(document.getElementById('ProjectAdaptedDynamicData'),'addTeamToProject',idProject,projectStatus);
                break;
            case 'getprojectdetails':
                projectEditMode=false;
                dokCount=0;
                currentProjectDetails=[];
                setDisabledFields(taskToRun);
                fields.push('id','create_date','typ_umowy','typ_umowy_alt','numer_umowy','temat_umowy','kier_grupy','kier_grupy_id','term_realizacji','harm_data','koniec_proj','nadzor','nadzor_id','kier_osr','kier_osr_id','technolog','technolog_id');
                currentProjectDetails=getDataFromJson(data[0],fields);
                fields=[];
                fields.push('ID','NAZWA');
                currentProjectDetails.push(getDataFromJson(data[1],fields));
                //console.log(currentProjectDetails);
                createProjectDetailView(document.getElementById('ProjectAdaptedDynamicData'),taskToRun,projectStatus);
                break;
        case 'getprojectdocuments':
                projectDocEditMode=false;
                dokCount=0;
                setDisabledFields(taskToRun);
                currentProjectDoc=[];
                fields.push('ID','NAZWA');
                currentProjectDoc=getDataFromJson(data,fields);
                //console.log(currentProjectDoc);
                createProjectDocView(document.getElementById('ProjectAdaptedDynamicData'),taskToRun,projectStatus);
                break;
        case 'getProjectDefaultValues':
            setFieldsAtr(taskToRun);
            setEnabledFields(taskToRun);
            /*
             * SLOWNIKI:
             * data[0] = UMOWY
             * data[1] = LIDER
             * data[2] = KIEROWNIK
             * data[3] = DODATKOWE DOKUMENTY 
             * data[4] = GLOWNY TECHNOLOG
             * data[5] = KIEROWNIK OSRODKA
             */
            //console.log(data[0]);
            manageTaskAfterAjaxGet('gettypeofagreement',data[0],'typ_umowy','typ_umowy','n');
            //console.log(data[1]);
            manageTaskAfterAjaxGet('getprojectsleader',data[1],'kier_grupy','kier_grupy','n');
            //console.log(data[2]);
            manageTaskAfterAjaxGet('getprojectsmanager',data[2],'nadzor','nadzor','n');
            //console.log(data[3]);
            manageTaskAfterAjaxGet('getadditionaldictdoc',data[3],'dokPowiazane','dokPowiazane','n');
            manageTaskAfterAjaxGet('getprojectgltech',data[4],'gl_tech','gl_tech','n');
            manageTaskAfterAjaxGet('getprojectglkier',data[5],'gl_kier','gl_kier','n');
            createNewProjectView(document.getElementById('ProjectAdaptedDynamicData'),'addNewProject');
            break;
        case 'getpdf':
            alert(data);
            break;
        default:
            alert('[manageTask]ERROR - wrong task');
            break;
    }
}
function setFieldsAtr(task)
{
    console.log('---setFieldsAtr---\n'+task);
    switch (task)
    {
        case 'getProjectDefaultValues':
        case 'getprojectdetails':
            selectClass=[];
            selectStyle=[];
            datePickerSpanStyle=[];
            datePickerSpanClass=[];
            datePickerIstyle=[];
            datePickerClass=[];
            datePickerStyle=[];
            selectClass.push('mb-1');
            inputClass[0]='mb-1';
            inputStyle=[];
            datePickerDivGroupClass[1]='mb-1';
            break;
        case 'getprojectdocuments':
            inputAttribute[0][1]='hidden'; 
            inputAttribute[2][1]='idProject';
            inputAttribute[3][1]='idProject';
            inputAttribute[4][1]=idProject;
            break;
            
        default:
            break;
    };  
}
function setDisabledFields(task)
{
    addButtonClass[2]='disabled';
    switch(task)
    {
        case 'getprojectdocuments':
                inputAttribute[6][0]='readOnly';
                inputAttribute[7][0]='disabled';
                removeButtonDivButtonClass[2]='disabled';
            break;
        case 'getprojectdetails':
            datePickerAttribute[6][0]='readOnly';
            datePickerAttribute[7][0]='disabled';
            datePickerSpanAttribute[1][0]='readOnly';
            datePickerSpanAttribute[3][0]='disabled';
            datePickerDivGroupAttribute[2][0]='disabled';
            datePickerDivGroupAttribute[1][0]='no-data-provide';
            selectAttribute[3][0]='readolny';
            selectAttribute[4][0]='disabled';
            inputAttribute[6][0]='readOnly';
            inputAttribute[7][0]='disabled';
            removeButtonDivButtonClass[2]='disabled';
            break;
        default:
            break;  
    }
}
function setEnabledFields(task)
{
    console.log('---setEnabledFields()---');
    console.log('TASK: '+task);
    addButtonClass[2]='no-disabled';
    removeButtonDivButtonClass[2]='no-disabled';
    console.log('---setEnabledFields---');
    switch(task)
    {
        case 'getprojectdocuments':
                inputAttribute[6][0]='no-readOnly';
                inputAttribute[7][0]='no-disabled';
            break;
        case 'getProjectDefaultValues':
        case 'getprojectdetails':
                datePickerAttribute[6][0]='no-readOnly';
                datePickerAttribute[7][0]='no-disabled';
                datePickerSpanAttribute[1][0]='no-readOnly';
                datePickerSpanAttribute[3][0]='no-disabled'
                datePickerDivGroupAttribute[1][0]='data-provide';
                datePickerDivGroupAttribute[2][0]='no-disabled';
                selectAttribute[3][0]='no-readolny';
                selectAttribute[4][0]='no-disabled';
                inputAttribute[6][0]='no-readOnly';
                inputAttribute[7][0]='no-disabled';
            break;
        case 'getallemployeeprojsumperc':
                datePickerAttribute[6][0]='no-readOnly';
                datePickerAttribute[7][0]='no-disabled';
                datePickerDivGroupAttribute[1][0]='data-provide';
                datePickerDivGroupAttribute[2][0]='no-disabled';
            break;
        default:
            break;  
    } 
}
function createProjectDocView(elementWhereAdd,taskToRun,projectStatus)
{
    console.log('---createProjectDocView()---\n'+taskToRun);
    setFieldsAtr(taskToRun);
    var mainTemplate=getProjectModalDetail();
    var formName=mainTemplate.childNodes[1].childNodes[1];
    formName.name='setprojectdocuments';

    var inputElement=createHtmlElement('input',inputAttribute,inputClass,inputStyle);
    formName.append(inputElement);
    inputAttribute[0][1]='text'; 
    createProjectDocViewFields(mainTemplate.childNodes[1].childNodes[1].childNodes[1],taskToRun);
    //console.log(elementWhereAdd.parentNode.parentNode.parentNode.childNodes[3].childNodes[]]);
    var confirmButton=mainTemplate.childNodes[1].childNodes[1].childNodes[3].childNodes[1].childNodes[1].childNodes[3];
    
    console.log(confirmButton);
    if(projectStatus==='m' || projectStatus==='n')
    {
        confirmButton.onclick=function()
        {
            confirmButton.innerText='Zatwierdź';
            setEnabledFields('getprojectdocuments');
            editForm(mainTemplate.childNodes[1].childNodes[1].childNodes[1],taskToRun,confirmButton,formName);
        };
    }
    else
    {
        confirmButton.classList.add("disabled");
        //confirmButton.setAttribute("hidden",'true');
        //confirmButton.addClass='disabled';
    };
    
    elementWhereAdd.append(mainTemplate);
    console.log(elementWhereAdd);
}
function createProjectDocViewFields(elementWhereAppend,taskToRun)
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
    createProjectDocList(currentProjectDoc,div1Element,1,taskToRun);
    elementWhereAppend.appendChild(div1Element);
    console.log(elementWhereAppend);
}
function getProjectModalDetail()
{
    console.log('---getProjectModalDetail()---');
    var mainTemplate=document.getElementById('addProjectModalDetail').cloneNode(true);
    mainTemplate.classList.remove("modal");
    mainTemplate.classList.remove("fade");
    return(mainTemplate);
}
function getLegendDiv()
{
    console.log('---getLegendDiv()---');
    var legendDiv=document.getElementById('legendDiv').cloneNode(true);
    legendDiv.classList.remove("modal");
    legendDiv.classList.remove("fade"); 
    return(legendDiv);
}
function createNewProjectView(elementWhereAdd,formNameToSetup)
{
    console.log('---createNewProjectView()---\n'+formNameToSetup);
    console.log(elementWhereAdd);
    // SET PROPERTIES OF ELEMENT ATRIBUTES

    var mainTemplate=getProjectModalDetail();
    var formName=mainTemplate.childNodes[1].childNodes[1];
    formName.name=formNameToSetup;
    var confirmButton=mainTemplate.childNodes[1].childNodes[1].childNodes[3].childNodes[1].childNodes[1].childNodes[3];
    confirmButton.innerText='Dodaj';
    confirmButton.onclick=function()
    {
            postDataToUrl(formNameToSetup);
    };
    createNewProjectViewFields(mainTemplate.childNodes[1].childNodes[1].childNodes[1],formNameToSetup);
    elementWhereAdd.append(mainTemplate);
       
}
function createNewProjectViewFields(elementWhereAppend,formName)
{
    console.log('---createNewProjectViewFields()---\n'+formName);
    console.log(elementWhereAppend);
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
    var divErrAtr=new Array(
            Array('class','col-sm-auto'),
            Array('id','')
            );
    var divErrClass=new Array(
            'alert',
            'alert-danger'
            );
    var divErrStyle=new Array(
            Array('display','none')
            );
    var spanAgreementAtr=new Array(
            Array('id','')
            );
    var text='';
    for(var i=0;i<projectFileds.length;i++)
    {
        var tmpArray=new Array();
        inputAttribute[0][1]='text';
        inputAttribute[2][1]=projectFileds[i][2];
        inputAttribute[3][1]=projectFileds[i][2];
        inputAttribute[4][1]='';
        labelAttribute[0][1]='inputProject'+i;
        labelElement=createHtmlElement('label',labelAttribute,labelClass,null);
        div1Element=createHtmlElement('div',div1,null,null);
        labelElement.innerText=projectFileds[i][1];
        switch(projectFileds[i][0])
        {
            case 'hidden':
                console.log('HIDDEN');
                inputAttribute[0][1]='hidden'; 
                break;
            case 's-umowa':
                TypeOfAgreement.onchange = function() { setTypOfAgreement(this.value,projectFileds[8][0],projectFileds[9][0]); };
                div1Element.appendChild(TypeOfAgreement);
                break;
            case't':
                inputElement=createHtmlElement('input',inputAttribute,inputClass,inputStyle);
                divErrAtr[1][1]='errDiv-'+projectFileds[i][2];
                divErr=createHtmlElement('div',divErrAtr,divErrClass,divErrStyle);
                inputElement.onblur=function()
                {
                    parseFieldValue(this,null,null);
                };
                div1Element.appendChild(inputElement);
                div1Element.appendChild(divErr);
                break;
            case 's-kier':
                 div1Element.appendChild(ManagerProj);
                break;
            case 's-gltech':
                 div1Element.appendChild(gltechProj);
                break;
            case 's-glkier':
                 div1Element.appendChild(glkierProj);
                break;
            case 'd':
                div1Element.appendChild(createDatePicker('inputProject'+i,'d-'+projectFileds[i][2],''));
                break;
            case 's-nadzor':
                // ADD EXTRA SPAN WITH ID
                labelElement=createHtmlElement('label',labelAttribute,labelClass,null);
                //console.log('S-NADZÓR');
                spanAgreementAtr[0][1]=projectFileds[i][0];
                spanAgreement=createHtmlElement('span',spanAgreementAtr,null,null);
                //console.log(TypeOfAgreementTab);
                spanAgreement.innerText=TypeOfAgreementTab[0][1];
                tmpArray=splitValue(projectFileds[i][1],"|");
                //console.log(tmpArray);
                text = document.createTextNode(tmpArray[0]);
                labelElement.appendChild(text);
                labelElement.appendChild(spanAgreement);
                text = document.createTextNode(tmpArray[1]);
                labelElement.appendChild(text);
                div1Element.appendChild(liderProj);
                break;
            case 'l-dok':
                div1Element.appendChild(AddDictDoc);
                createHiddenInputs(AddDictDocTab,div1Element,'addDoc');
                AddDictDocTab=[];
                createProjectDocList(AddDictDocTab,div1Element,1,formName);
                
                break;
            default:
                break;
        };
        elementWhereAppend.appendChild(labelElement);
        elementWhereAppend.appendChild(div1Element);
    };
}
function createHiddenInputs(dataArray,elementWhereAppend,name)
{
    console.log('---createHiddenInputs()---');
    var inpAtr= new Array(
            Array('name',''),
            Array('type','hidden'),
            Array('value','')
            );
    var input='';
    for(var i=0; i<dataArray.length;i++)
    {
        inpAtr[0][1]=name+i;
        inpAtr[2][1]=i+"|"+dataArray[i][1];
        input=createHtmlElement('input',inpAtr,null,null);
        elementWhereAppend.appendChild(input);
    };
}
function createProjectDetailView(elementWhereAdd,taskToRun,projectStatus)
{
    console.log('---createProjectDetailView()---\n'+taskToRun);
    console.log(elementWhereAdd);
    // SET PROPERTIES OF ELEMENT ATRIBUTES
    setFieldsAtr(taskToRun);
    var mainTemplate=getProjectModalDetail();
    var formName=mainTemplate.childNodes[1].childNodes[1];
    formName.name='setprojectdetails';
    var confirmButton=mainTemplate.childNodes[1].childNodes[1].childNodes[3].childNodes[1].childNodes[1].childNodes[3];
    // SET FIELDS
    createProjectDetailViewFields(mainTemplate.childNodes[1].childNodes[1].childNodes[1],taskToRun);
    
    if(projectStatus==='m' || projectStatus==='n')
    {
        confirmButton.onclick=function()
        {
            document.getElementById('ProjectAdaptedBodyExtra').appendChild(getLegendDiv());
            
            confirmButton.innerText='Zatwierdź';
            setEnabledFields('getprojectdetails');
            editForm(mainTemplate.childNodes[1].childNodes[1].childNodes[1],taskToRun,confirmButton,formName);
        };
    }
    else
    {
        confirmButton.classList.add("disabled");
    };
    
    elementWhereAdd.append(mainTemplate);
}

function createProjectDetailViewFields(elementWhereAppend,taskToRun)
{
    console.log('---createProjectDetailViewFields---');
    inputClass[0]='mb-1';
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
    var divErrAtr=new Array(
            Array('class','col-sm-auto'),
            Array('id','')
            );
    var divErrClass=new Array(
            'alert',
            'alert-danger'
            );
    var divErrStyle=new Array(
            Array('display','none')
            );
     var spanAgreementAtr=new Array(
            Array('id','')
            );
    var currentDataArray=new Array();
    var rebuildedArray=new Array();
    var tmpArray=new Array();
    var newSelect='';
    for(var i=0;i<projectFileds.length;i++)
    {
        inputAttribute[0][1]='text';
        inputAttribute[2][1]=projectFileds[i][2];
        inputAttribute[3][1]=projectFileds[i][2];
        inputAttribute[4][1]='';
        labelAttribute[0][1]='inputProject'+i;
        labelElement=createHtmlElement('label',labelAttribute,labelClass,null);
        div1Element=createHtmlElement('div',div1,null,null);
        labelElement.innerText=projectFileds[i][1];
        switch(projectFileds[i][0])
        {
            case 'hidden':
                console.log('HIDDEN\n'+currentProjectDetails[0][0]);
                inputAttribute[0][1]='hidden';
                inputAttribute[4][1]=currentProjectDetails[0][0];
                inputElement=createHtmlElement('input',inputAttribute,inputClass,inputStyle);
                div1Element.appendChild(inputElement);
                break;
            case 's-umowa':
                currentDataArray=Array (0,currentProjectDetails[0][2],currentProjectDetails[0][3]);
                rebuildedArray=(rebuildDataInArray(TypeOfAgreementTab,1,currentDataArray,1));
                newSelect=createSelect(rebuildedArray,projectFileds[i][2],projectFileds[i][2]);
                newSelect.onchange = function() { setTypOfAgreement(this.value,projectFileds[8][0],projectFileds[9][0]); };
                div1Element.appendChild(newSelect);
                break;
            case 's-glkier':// CREATE REBUILD TASK
                currentDataArray=Array (currentProjectDetails[0][14],currentProjectDetails[0][13]);
                rebuildedArray=(rebuildDataInArray(glkierProjTab,0,currentDataArray,0));
                div1Element.appendChild(createSelect(rebuildedArray,projectFileds[i][2],projectFileds[i][2]));
                break;
            case 's-gltech':// CREATE REBUILD TASK
                currentDataArray=Array (currentProjectDetails[0][16],currentProjectDetails[0][15]);
                rebuildedArray=(rebuildDataInArray(gltechProjTab,0,currentDataArray,0));
                div1Element.appendChild(createSelect(rebuildedArray,projectFileds[i][2],projectFileds[i][2]));
                break;
            case't':
                inputAttribute[4][1]=assignProjectDataToField(projectFileds[i][2]);
                inputElement=createHtmlElement('input',inputAttribute,inputClass,inputStyle);
                divErrAtr[1][1]='errDiv-'+projectFileds[i][2];
                divErr=createHtmlElement('div',divErrAtr,divErrClass,divErrStyle);
                inputElement.onblur=function()
                {
                    parseFieldValue(this,null,null);
                };
                div1Element.appendChild(inputElement);
                div1Element.appendChild(divErr);
                break;
            case 's-kier':
                currentDataArray=Array (currentProjectDetails[0][7],currentProjectDetails[0][6]);
                rebuildedArray=(rebuildDataInArray(ManagerProjTab,0,currentDataArray,0));
                div1Element.appendChild(createSelect(rebuildedArray,projectFileds[i][2],projectFileds[i][2]));
                //div1Element.appendChild(ManagerProj);
                break;
            case 'd':
                div1Element.appendChild(createDatePicker('inputProject'+i,'d-'+projectFileds[i][2],assignProjectDataToField(projectFileds[i][2])));
                //div1Element.appendChild(createDatePicker('inputProject'+i,'d-'+projectFileds[i][2],''));
                break;
            case 's-nadzor':
                // ADD EXTRA SPAN WITH ID
                labelElement=createHtmlElement('label',labelAttribute,labelClass,null);
                spanAgreementAtr[0][1]='s-nadzor';
                spanAgreement=createHtmlElement('span',spanAgreementAtr,null,null);
                spanAgreement.innerText=currentProjectDetails[0][2];
                tmpArray=splitValue(projectFileds[i][1],"|");
                text = document.createTextNode(tmpArray[0]);
                labelElement.appendChild(text);
                labelElement.appendChild(spanAgreement);
                text = document.createTextNode(tmpArray[1]);
                labelElement.appendChild(text);
                currentDataArray=Array (currentProjectDetails[0][12],currentProjectDetails[0][11]);
                rebuildedArray=(rebuildDataInArray(liderProjTab,0,currentDataArray,0));
                newSelect=createSelect(rebuildedArray,projectFileds[i][2],projectFileds[i][2]);
                div1Element.appendChild(newSelect);
                break;
            case 'l-dok':
                createProjectDocList(currentProjectDetails[1],div1Element,1,taskToRun);
                break;
            default:
                break;
        };
        currentDataArray=[];
        rebuildedArray=[];
        newSelect='';
        elementWhereAppend.appendChild(labelElement);
        elementWhereAppend.appendChild(div1Element);
    };
}
function rebuildDataInArray(mainArray,mainColToCompare,swapRecord,swapColToCompare)
{
    console.log('---rebuildDataInArray---');
    //console.log('MAIN ARRAY: '+mainArray+'\nMAIN COL: '+mainColToCompare+'SWAP RECORD: '+swapRecord+'SWAP COL: '+swapColToCompare);
    var selectArray= new Array();
    selectArray.push(swapRecord);
    for(var a=0;a<mainArray.length;a++)
    {
        if(mainArray[a][mainColToCompare]===swapRecord[swapColToCompare])
        {
            //console.log('FOUND - '+mainArray[a][mainColToCompare]); // assign id = 0
        }
        else
        {
            selectArray.push(mainArray[a]);
        };
    };
    return (selectArray);
}
function createProjectDocList(docArray,elementWhereAppend,nrColWithData,taskToRun)
{
    console.log('---createProjectDocList()---');
    console.log('TASK TO RUN: '+taskToRun);
    //console.log(docArray);
    //console.log(nrColWithData);
    inputStyle.push(Array('borderTopRightRadius','0px'));
    inputStyle.push(Array('borderBottomRightRadius','0px'));
    inputClass[0]='mb-0';
    //console.log(inputStyle);
    var divDynamicAttribute=new Array(
            Array('id','dynamicDocList'),
            );
    var divDynamic=createHtmlElement('div',divDynamicAttribute,null,null);
    var divAddAttribute=new Array(
            Array('class','row'),
            );
     var divAddClass=new Array(
            'mt-0',
            'mb-0'
            );    
    var divAddInsideAttribute=new Array(
            Array('class','col-sm-auto'),
            );
     var divAddInsideClass=new Array(
            'mt-0',
            'mb-0'
            );   
    var divAddButton=createHtmlElement('div',divAddAttribute,divAddClass,null);
    var divAddButtonInside=createHtmlElement('div',divAddInsideAttribute,divAddInsideClass,null);
    var newInputElement;
    var addButtonAvaliable=false;
    var inputElement;
    var addBtn=createAddButton();
    
    for(var d=0;d<docArray.length;d++)
    {
        //console.log(docArray[d][0]);
        inputAttribute[2][1]='orgDok-'+docArray[d][0];
        inputAttribute[3][1]='orgDok-'+docArray[d][0];
        inputAttribute[4][1]=docArray[d][nrColWithData];

        inputElement=createHtmlElement('input',inputAttribute,inputClass,inputStyle);
        inputElement.onblur=function()
        {
            
            checkLength(this,'doc');
        };
        createDocListRow(elementWhereAppend,inputElement,taskToRun);
    };
    // CHECK SWITCH THAT ENABLE RUN IN EDIT MODE
    switch (taskToRun)
    {
        case 'getprojectdocuments':
                if(projectDocEditMode)
                {
                    document.getElementById('ProjectAdaptedBodyExtra').appendChild(getLegendDiv());
                    addButtonAvaliable=true;
                }
                break;
            case 'getprojectdetails':
                
                if(projectEditMode) addButtonAvaliable=true;
                break;
            case 'addNewProject':
                addButtonAvaliable=true;
            default:
                break;
    };      
    if(addButtonAvaliable)
    {
        addBtn.onclick=function()
        {
            inputAttribute[2][1]='newDok-'+dokCount;
            inputAttribute[3][1]='newDok-'+dokCount;
            inputAttribute[4][1]='';
            newInputElement=createHtmlElement('input',inputAttribute,inputClass,inputStyle);
            newInputElement.onblur=function()
            {
                checkLength(this,'doc');
            };
            createDocListRow(divDynamic,newInputElement,taskToRun);
        };
    }
    
    divAddButtonInside.appendChild(addBtn);
    divAddButton.appendChild(divAddButtonInside);
    
    //divOverAll.appendChild(divAddButton);
    elementWhereAppend.appendChild(divDynamic);
    elementWhereAppend.appendChild(divAddButton);
    // END ADD BUTTON
}
function checkLength(field,type)
{
    console.log('---checkLength()---');
    console.log('TYPE: '+type);
    console.log('NAME: '+field.name);
    var max=30;
    var min=0;
    var fValue=field.value;
    var fName=field.name;
    var divId='';
    var divErr='';
    fValue=fValue.trim();
    var fLength=fValue.length;
    console.log(fValue.length);
    switch(type)
    {
       case 'doc':
            // GET DIV ERR
            // SET ARRAY OF ERRORS
            //console.log(field.parentNode.parentNode.childNodes[2].getAttribute('id'));
            //divErr=field.parentNode.parentNode.childNodes[2];
            //divId=field.parentNode.parentNode.childNodes[2].getAttribute('id');
            divErr=document.getElementById('errDiv-'+field.name);
            divId='errDiv-'+field.name;
            if(fLength>min)
            {
                if(fLength>max)
                {
                    setErrTab(fName);
                    showDivErr(divErr,'[L:'+fLength+']FIELD VALUE TOO LONG');
                }
                else
                {
                    parseFieldValue(fValue,fName,divId);
                };
            }
            else
            {
                removeErrTab(fName);
                hideDivErr(divErr);
            };
            break;
        case 'umowa':
            break;
        case 'temat':
            break;
        default:
            break;
    };
}
function setErrTab(fName)
{
    console.log('---setErrTab()---');
    console.log('FNAME: '+fName);
    if(errInputValue.indexOf(fName)===-1)
    {
        errInputValue.push(fName); 
    };
}
function removeErrTab(fName)
{
    console.log('---removeErrTab()---');
    console.log('FNAME: '+fName);
    if(errInputValue.indexOf(fName)!==-1)
    {
        errInputValue.splice(errInputValue.indexOf(fName), 1 );
    };
}
function showDivErr(div,value)
{
    console.log('---showDivErr()---');
    div.innerHTML=value;
    div.style.display = "block";
}
function hideDivErr(div)
{
    console.log('---hideDivErr()---');
    div.innerText='';
    div.style.display = "none";
}
function createDocListRow(elementWhereAppend,inputElement,taskToRun)
{
    console.log('---createDocListRow()---');
    //console.log(inputElement);
    //console.log(inputElement.name);
    
    var removeMode=false;
    var divColButtonAttribute=new Array(
	Array('class','col-sm-auto')
	);
    var divColButtonClass=new Array(
            'pl-0'
	);
    divColButtonElement=createHtmlElement('div',divColButtonAttribute,divColButtonClass,null);
    var divColInputAttribute= new Array(
               Array('class','col-sm')
        );
    var divColInputClass= new Array(
             'mr-0',
             'pr-0'
        );
    divColInputElement=createHtmlElement('div',divColInputAttribute,divColInputClass,null);
    var divOverAllAttribute=new Array(
            Array('class','row'),
            Array('id','divOverAll')
            );
    var divOverAllClass=new Array(
            'mt-0',
            'mb-0'
            );
    var divErrAtr=new Array(
            Array('class','col mt-1 mb-1'),
            Array('id','')
            );
    var divErrClass=new Array(
            'alert',
            'alert-danger'
            );
    var divErrStyle=new Array(
            Array('display','none')
            );
    divErrAtr[1][1]='errDiv-'+inputElement.name; //+projectFileds[i][2];
    var divErr=createHtmlElement('div',divErrAtr,divErrClass,divErrStyle);
    
    divOverAll=createHtmlElement('div',divOverAllAttribute,divOverAllClass,null);
    var removeButtonElement=createRemoveButton();
    //console.log(taskToRun);
    switch(taskToRun)
    {
        case 'getprojectdetails': 
            if(projectEditMode)
            {
                removeMode=true; 
            };
            break;
        case 'getprojectdocuments':
            if(projectDocEditMode)
            {
                removeMode=true;
            };
            break;
        case 'addNewProject':
                removeMode=true;
            break;
        default:
            break;
    };
    if(removeMode)
    {
       removeButtonElement.onclick=function(){removeRow(this,divErr,inputElement.name);}; 
    };
  
    divColInputElement.appendChild(inputElement);
    divColButtonElement.appendChild(removeButtonElement);
    divOverAll.appendChild(divColInputElement);
    divOverAll.appendChild(divColButtonElement);
    elementWhereAppend.appendChild(divOverAll);
    elementWhereAppend.appendChild(divErr);
    dokCount++;
    //console.log(elementWhereAppend);
}
function removeRow(element,divErr,inputName)
{
    console.log('---removeRow()---');
    console.log(divErr);
    removeErrTab(inputName);
    hideDivErr(divErr);  
    element.parentNode.parentNode.parentNode.removeChild(element.parentNode.parentNode);
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
    datePickerAttribute[6][0]='no-readOnly';
    datePickerSpanAttribute[1][0]='no-readOnly';
    datePickerDivGroupAttribute[1][0]='data-provide';
    datePickerSpanClass.push('rounded-0');
    datePickerSpanStyle.push(new Array('backgroundColor','#80bfff'));
    datePickerSpanStyle.push(new Array('borderColor','#80bfff'));
    datePickerSpanStyle.push(new Array('border','1px solid #80bfff'));
    datePickerIstyle.push(new Array('color','#ffffff'));
    datePickerClass=[];
    datePickerClass.push('rounded-0');
    datePickerStyle.push(new Array('border','1px solid #80bfff'));
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

function createOl(dataArray,fieldId,fieldName)
{
    console.log('---createOl()---');
    console.log(dataArray);
    console.log('DATA LENGTH : '+dataArray.length);
    var ol=document.createElement("OL");
    var li=document.createElement("LI");
    var optionText = document.createTextNode("");
    
    ol.setAttribute("type","a");
    ol.setAttribute("id",fieldId);
    ol.setAttribute("name",fieldName);
    
    for(var i=0;i<dataArray.length;i++)
    {
        console.log(dataArray[i][0]+" - "+dataArray[i][1]);
        li=document.createElement("LI");
        if(dataArray[i][2]!=='')
        {
            li.setAttribute("id",dataArray[i][2]);
        };
        li.setAttribute("class","mt-1");
        li.classList.add("mb-1");
        console.log(dataArray[i][2]);
        li.setAttribute("value",dataArray[i][0]+'|'+dataArray[i][1]);
        optionText = document.createTextNode(dataArray[i][1]);
        
        li.appendChild(optionText);
        ol.appendChild(li);
        //addHiddenInput("addDoc"+i,dataArray[i][0]+"|"+dataArray[i][1]);
    };
    return ol;
}
// NOT USED
function createDiv(elementWhereAdd)
{
    console.log('---createDIV()---');
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
    console.log('---createDatePicker---');
    //console.log('id - '+idDatePicker+'\nname - '+nameDatePicker+'\nvalue - '+value);
    if(value==null)
    {
        value='';
    }
    datePickerAttribute[2][1]=nameDatePicker; // name
    datePickerAttribute[3][1]=idDatePicker; // id
    datePickerAttribute[4][1]=value; // value
    var inputElement=createHtmlElement('input',datePickerAttribute,datePickerClass,datePickerStyle);
    // i PARAMETERS
    var datePickerIattribute=new Array(
	Array('class','fa'),
	Array('aria-hidden','true')
	);
    var datePickerIclass=new Array(
	'fa-calendar'
	);
    var iElement=createHtmlElement('i',datePickerIattribute,datePickerIclass,datePickerIstyle);

    var spanElement=createHtmlElement('span',datePickerSpanAttribute,datePickerSpanClass,datePickerSpanStyle);
    // div-input-group-addon PARAMETERS
    var datePickerDivAddonAttribute=new Array(
	Array('class','input-group-addon')
	);
    var datePickerDivAddonClass=new Array(
	'input-group-append',
	);
    var divAddonElement=createHtmlElement('div',datePickerDivAddonAttribute,datePickerDivAddonClass,null);

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
	Array('class','btn'),
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
    selectTeamWorkerPercentElement.onfocus=function(){ manageActMemberProjUsedPercent(selectTeamWorkerPercentElement);};
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
function manageActMemberProjUsedPercent(elementWhereUpdate)
{
    console.log('---manageActMemberProjUsedPercent---\n');
    var currentPersId=elementWhereUpdate.parentNode.parentNode.childNodes[0].childNodes[0].value;
    console.log("Current id user - "+currentPersId);
 
        //console.log(elementWhereUpdate.firstChild);
        while (elementWhereUpdate.firstChild) 
        {
            elementWhereUpdate.removeChild(elementWhereUpdate.firstChild);
        };
        //console.log(elementWhereUpdate);
        elementWhereUpdate.onfocus=function(){ manageActMemberProjUsedPercent(elementWhereUpdate);};
        console.log('UPDATE AVALIABLE USED VALUE');
        for(var z=0;z<teamAvaliablePersCount;z++)
        {
            if(teamAvaliablePers[z][0]==currentPersId)
            {
                console.log(teamAvaliablePers[z][1]);
                //console.log(teamAvaliablePers[z][5]+1);
                for(var y=1;y<teamAvaliablePers[z][5]+1;y++)
                {
                    elementWhereUpdate.appendChild(createTeamRowOption(y));
                };
                break;
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
function createTeamBodyContent(elementWhereAdd,data,projectStatus)
{
    console.log('---createTeamtBodyContent---');
    console.log('Project status : '+projectStatus);
    //console.log('elementWhereAdd - '+elementWhereAdd);
    //console.log(data);
    datePickerDivGroupClass[1]='mb-0';
    addButtonClass[2]='no-disabled';
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
    createBodyButtonContent(document.getElementById('ProjectAdaptedButtonsBottom'),'showTeamProject','noValue',projectStatus);
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
function getFormHeader(formName)
{
    console.log('---getFormHeader---');
    var formAttribute=new Array(
        Array('name',formName),
        Array('id',formName),
        Array('class','form-horizontal'),
        Array('autocomplete','off'),
        Array('method','POST'),
        Array('ENCTYPE','multipart/form-data'),
        Array('action','javascript:void(0);')        
	);
    return(createHtmlElement('form',formAttribute,null,null));
}
function createDivCol(divName,colNumbers)
{
    var divAtr=new Array(
        Array('name',divName),
        Array('id',divName),
        Array('class','col-sm-'+colNumbers)      
	);
     return(createHtmlElement('div',divAtr,null,null));   
}
function createProjectRemoveBodyContent(elementWhereAdd,formName,idData)
{ 
    console.log('---createProjectRemoveBodyContent---');
    console.log('elementWhereAdd :');
    console.log(elementWhereAdd);
    removeHtmlChilds(elementWhereAdd);
    removeHtmlChilds(document.getElementById('ProjectAdaptedButtonsBottom'));
    var formElement=getFormHeader(formName);
    var div=createDivCol('closeProject',12);
    div.innerText='Podaj powód :';
    // input hidden with id FORM
    var inputIdAttribute=new Array(
        Array('name',formName+'id'),
        Array('type','hidden'),
        Array('value',idData)
	);
    var inputIdElement=createHtmlElement('input',inputIdAttribute,null,null);
    formElement.appendChild(div);
    formElement.appendChild(inputIdElement);
    
    elementWhereAdd.appendChild(formElement);
    console.log(elementWhereAdd);
}
//##################################### createAddTeamBodyContent END ######################################
function createAddTeamBodyContent(elementWhereAdd,formName,idData,projectStatus)
{ 
    console.log('---createAddTeamBodyContent---');
    console.log('elementWhereAdd :');
    console.log(elementWhereAdd);
   
    removeHtmlChilds(elementWhereAdd);
    removeHtmlChilds(document.getElementById('ProjectAdaptedButtonsBottom'));
    actUsedMemberProjTab=[];
    teamElementCounter=0;
    selectAttribute[3][0]='no-readolny';
    selectAttribute[4][0]='no-disabled';
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
    var button=createAddButton();
    button.onclick=function(){createTeamRow('addTeamToProject','team_czlonek_grupy','new');};

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
    createBodyButtonContent(document.getElementById('ProjectAdaptedButtonsBottom'),'addTeamToProject',idData,projectStatus);
    controlAddTeamButton();
}
//##################################### createAddTeamBodyContent END ######################################
function createAddButton()
{
    
    //var addBtn=createHtmlElement('button',);
    var iIco=document.createElement("i");
        iIco.setAttribute('class','fa');
        iIco.classList.add("fa-plus");
        iIco.setAttribute("aria-hidden","true");
    var addBtn=createHtmlElement('button',addButtonAttribute,addButtonClass,null);
    addBtn.appendChild(iIco);
    return (addBtn);
}
function createBodyButtonContent(elementWhereAdd,task,formName,projectStatus)
{
    console.log('---createBodyButtonContent---');
    console.log('Project status : '+projectStatus);
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
            
            var addButtonElement=createHtmlElement('button',addButtonAttribute,addButtonClass,null);
            addButtonElement.innerText = "Dodaj zespół";

            var editButtonAttribute=new Array(
                Array('class','btn')
                );
            var editButtonClass=new Array(
                      'btn-primary',
                      'pull-right'
                       ); 
            if(projectStatus!=='m' && projectStatus!=='n')
            {
                editButtonClass.push('disabled');
                addButtonElement.classList.add("disabled");
                
            };
            var editButtonElement=createHtmlElement('button',editButtonAttribute,editButtonClass,null);
            editButtonElement.innerText = "Edytuj zespół";
            if(projectStatus==='m' || projectStatus==='n')
            {
                editButtonElement.onclick = function()
                {
                    getAjaxData('getallemployeeprojsumperc','','','',projectStatus); //getallemployeeprojsumperc

                };
                addButtonElement.onclick = function()
                {
                    getAjaxData('getallemployeeprojsumperc','','','',projectStatus); //getallemployeeprojsumperc
                };
            }
            
            
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
            divButtonElement.appendChild(cancelButtonElement);
            
            var confirmButtonAttribute=new Array(
                Array('class','btn')
                );
            var confirmButtonClass=new Array(
                'btn-info',
                'pull-right'
                ); 
            if(projectStatus!=='m' && projectStatus!=='n')
            {
                confirmButtonClass.push('disabled');
            };
            var confirmButtonElement=createHtmlElement('button',confirmButtonAttribute,confirmButtonClass,null);
            confirmButtonElement.innerText = "Zatwierdź";
            if(projectStatus==='m' || projectStatus==='n')
            {
                confirmButtonElement.onclick = function() { postDataToUrl(task); };
            }
            
            // END confirm BUTTON
            
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
    //console.log('---createSelect---\n'+fieldId);
    //console.log('data - '+dataArray+'\n id - '+fieldId+'\n name - '+fieldName);
    selectAttribute[1][1]=fieldId; // id 
    selectAttribute[2][1]=fieldName; // name

    var option=document.createElement("OPTION");
    var optionText = document.createTextNode("");
    
    if(fieldName==='czlonek_grupy')
    {
        selectClass.push("gt-border-light-blue","gt-no-rounded-right");
        selectStyle.push(Array('borderColor',"#80bfff"),Array('borderTopRightRadius','0px'),Array('borderBottomRightRadius','0px'));
    }
    var select=createHtmlElement('select',selectAttribute,selectClass,selectStyle);    
    for(var i=0;i<dataArray.length;i++)
    {
        //console.log(dataArray[i][fieldsToSetup[0]]+" - "+dataArray[i][fieldsToSetup[1]]);
        option=document.createElement("OPTION");
        if(fieldName==='typ_umowy')
        {
            //console.log(dataArray[i][2]);
            option.setAttribute("value",dataArray[i][0]+'|'+dataArray[i][1]+"|"+dataArray[i][2]);
        }
        else
        {
            option.setAttribute("value",dataArray[i][0]+'|'+dataArray[i][1]);
        }
        optionText = document.createTextNode(dataArray[i][1]);
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
            new Array('btn-info','details','Szczegóły'),
            new Array('btn-info','documents','Dokumenty'),
            new Array('btn-warning','team','Zespół'),
            
         );
        var button='';
        var buttonpdf='';
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
                    //buttonConfig.push(new Array('btn-danger','getpdf','PDF'));//btn-outline-danger
                    buttonConfig.push(new Array('btn-secondary','close','Zamknij'));
                    buttonConfig.push(new Array('btn-danger ','delete','Usuń'));
                    //buttonpdf="<button class=\"btn  btn-outline-danger btn-danger mr-0 mb-0 mt-0 ml-0\" data-toggle=\"modal\" ><a href=\"http://rezerwacje-gop.local:8080/modul/manageProject.php?task=getpdf&id=36\">PDF</a></button>";
                    buttonpdf="<a href=\""+getUrl()+"modul/manageProject.php?task=getpdf&id="+arr[i].id+"\" class=\"btn btn-danger btn-outline-danger mr-0 mb-0 mt-0 ml-0\" role=\"button\" aria-disabled=\"true\" target=\"_blank\">PDF</a>";
                    //onclick=\"getPDF('"+arr[i].id+"','"+arr[i].status+"')\"
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
                button+="<button class=\"btn "+buttonConfig[j][0]+" mr-0 mb-0 mt-0 ml-0\" data-toggle=\"modal\" data-target=\"#ProjectAdaptedModal\" onclick=\"createAdaptedModal('"+buttonConfig[j][1]+"',"+arr[i].id+",'"+arr[i].temat_umowy+"','"+arr[i].status+"')\">"+buttonConfig[j][2]+"</button>";
            }
            if(arr[i].status==='m' || arr[i].status==='n')
            {
                button+=buttonpdf;
            }
            
            out+="<tr id=\"project"+arr[i].id+"\"><th scope=\"row\">"+arr[i].id+"</th><td>"+arr[i].numer_umowy+"</td><td>"+arr[i].temat_umowy+"</td><td>"+arr[i].create_date+"</td><td>"+arr[i].kier_grupy+"</td><td>"+arr[i].nadzor+"</td><td>"+arr[i].term_realizacji+"</td><td>"+arr[i].harm_data+"</td><td>"+arr[i].koniec_proj+"</td><td>"+statusProj+"</td><td><div class=\"btn-group\">"+button+"</div></td></tr>";
            button='';
        }
        document.getElementById("projectData").innerHTML = out;
    }
}
function getPDF(idProject,projectStatus)
{
    // NOT NEEDED
   console.log('---getPDF---'); 
   console.log(idProject); 
   console.log(projectStatus); 
   getAjaxData('getpdf','test','test','&id='+idProject,projectStatus);
}
function createAdaptedModal(modalType,idData,titleData,projectStatus)
{
    console.log('---createAdaptedModal()---');
    console.log("TASK - "+modalType+"\nID PROJECT - "+idData+"\nTITLE - "+titleData);
    setAdaptedModalProperties(modalType,idData,titleData,projectStatus);  
    document.getElementById("projectId").innerHTML = idData;
}
function removeHtmlChilds(htmlElement)
{
    while (htmlElement.firstChild)
    {
        htmlElement.firstChild.remove(); 
    };
};
function setAdaptedModalProperties(modalType,idData,titleData,projectStatus)
{
    console.log('---setAdaptedModalProperties()---');
    console.log("MODAL TYPE - "+modalType+"\nID PROJECT - "+idData+"\nTITLE DATA - "+titleData);
    var bgTitle =document.getElementById("ProjectAdaptedBgTitle");
    var title=document.getElementById("ProjectAdaptedTextTitle");
    var divBodyExtra=document.getElementById('ProjectAdaptedBodyExtra');
    bgTitle.classList.value="";
    bgTitle.classList.add("modal-header");

    removeHtmlChilds(document.getElementById('ProjectAdaptedDynamicData'));
    removeHtmlChilds(document.getElementById('ProjectAdaptedButtonsBottom'));
    removeHtmlChilds(divBodyExtra);
    
    switch(modalType)
    {
        case 'createProject':
            bgTitle.classList.add("bg-info");
            title.innerHTML="POWOŁANIE GRUPY REALIZUJĄCEJ:";
            setDataDiv('');
            getAjaxData('getProjectDefaultValues','','','','');
            divBodyExtra.appendChild(getLegendDiv());
            break;
        case 'edit': // NOT USED
            bgTitle.classList.add("bg-info");
            title.innerHTML="EDYCJA PROJEKTU:";
            break;
        case 'show': // NOT USED
            bgTitle.classList.add("bg-info");
            title.innerHTML="PODGLĄD PROJEKTU:";
            break;
        case 'documents':
            idProject=idData;
            setDataDiv(titleData)
            bgTitle.classList.add("bg-info");
            title.innerHTML="DOKUMENTY PROJEKTU:";
            getAjaxData('getprojectdocuments','ProjectAdaptedDynamicData','project_documents','&id='+idData,projectStatus);
            break;
        case 'details':
            setDataDiv('')
            bgTitle.classList.add("bg-info");
            title.innerHTML="SZCZEGÓŁY PROJEKTU:";
            getAjaxData('getprojectdetails','ProjectAdaptedDynamicData','project_details','&id='+idData,projectStatus);
            break;
        case 'team':
            document.getElementById("errDiv-Adapted-overall").style.display = "none";
            document.getElementById("errDiv-Adapted-overall").innerHTML = "";
            document.getElementById("projectTitle").innerHTML = titleData;
            document.getElementById("projectId2").innerHTML ='';
            actUsedMemberProjTab=[];
            teamElementCounter=0;
            teamEditPers=[];
            currentTeamPers=[];
            teamAvaliablePers=[];
            idProject=idData;
            
            bgTitle.classList.add("bg-warning");
            title.innerHTML="ZESPÓŁ PROJEKTU:";
            getAjaxData('getprojectteam','ProjectAdaptedDynamicData','zespol_projektu','&id='+idData,projectStatus);
            break;
        case 'delete':
            setDataDiv(titleData)
            bgTitle.classList.add("bg-danger");
            title.innerHTML="USUWANIE PROJEKTU:";
            createProjectRemoveBodyContent(document.getElementById('ProjectAdaptedDynamicData'),'removeProject',idData);
            createBodyButtonContent(document.getElementById('ProjectAdaptedButtonsBottom'),'removeProject',idData);
            break;
        case 'team_edit':
            document.getElementById("projectTitle").innerHTML = titleData;
            actUsedMemberProjTab=[];
            teamElementCounter=0;
            createAddTeamBodyContent(document.getElementById('ProjectAdaptedDynamicData'),'addTeamToProject',idData,projectStatus);
            createBodyButtonContent(document.getElementById('ProjectAdaptedButtonsBottom'),'addTeamToProject',idData,projectStatus);
        case 'close':
             setDataDiv(titleData)
            bgTitle.classList.add("bg-secondary");
            title.innerHTML="ZAMYKANIE PROJEKTU:";
            createProjectRemoveBodyContent(document.getElementById('ProjectAdaptedDynamicData'),'closeProject',idData,projectStatus);
            createBodyButtonContent(document.getElementById('ProjectAdaptedButtonsBottom'),'closeProject',idData,projectStatus);
            break;
        default:
            alert('[setAdaptedModalProperties]ERROR - wrong type');
            break;
    };
}
function setDataDiv(titleData)
{
    document.getElementById("errDiv-Adapted-overall").style.display = "none";
    document.getElementById("errDiv-Adapted-overall").innerHTML = "";
    document.getElementById("projectTitle").innerHTML = titleData;
    document.getElementById("projectId2").innerHTML ='';
}
function closeModal(modalId)
{
    $('#'+modalId).modal('hide');
}
function checkIsErr()
{
    console.log('---checkIsErr()---');
    var errExists=false;
    for(i=0;i<errInputValue.length;i++)
    {
        errExists=true;
        console.log(i+" - "+errInputValue[i]);
    }
    return (errExists);
}
function postDataToUrl(nameOfForm)
{
    console.log('---postDataToUrl---');
    console.log(nameOfForm);
    var taskUrl;
    var errDivAjax='errDiv-Adapted-overall';
    var confirmTask=false;
    var label;
    var dataForm;
    switch(nameOfForm)
    {
        case 'addTeamToProject':
            taskUrl='modul/manageProject.php?task=addteam';
            confirmTask=true;
            break;
        case 'createPdfForm':
            parseFieldValue( document.getElementById('temat_umowy').value,"temat_umowy","errDiv-temat_umowy");
            parseFieldValue( document.getElementById('numer_umowy').value,"numer_umowy","errDiv-numer_umowy");
            if(checkIsErr())
            {
                console.log("err is true");
                setSubmitButton(true);
                return(0);
            };
            setSubmitButton(false);
            taskUrl='modul/manageProject.php?task=add';
            document.getElementById("errDiv-overall").style.display = "none";
            errDivAjax='errDiv-overall';
            confirmTask=true;
            break;
        case 'removeProject':
            label='usunięcie';
        case 'closeProject':
            if(nameOfForm==='closeProject')
            {
                label='zamknięcie'
            }
            taskUrl='modul/manageProject.php?task='+nameOfForm;
            confirmTask = confirm("Potwierdź "+label);
            break;
        case 'setprojectdetails':
            console.log('NUMER UMOWY: '+document.getElementById('numer_umowy').value);
            console.log('TEMAT UMOWY: '+document.getElementById('temat_umowy').value);
            parseFieldValue( document.getElementById('temat_umowy').value,"temat_umowy","errDiv-temat_umowy");
            parseFieldValue( document.getElementById('numer_umowy').value,"numer_umowy","errDiv-numer_umowy");
        case 'setprojectdocuments':
            //console.log(dataForm);
            if(checkIsErr())
            {
                console.log("err is true");
                return(0);
            };
            confirmTask=true;
            taskUrl='modul/manageProject.php?task='+nameOfForm;
            break;
        case 'addNewProject':
            parseFieldValue( document.getElementById('temat_umowy').value,"temat_umowy","errDiv-temat_umowy");
            parseFieldValue( document.getElementById('numer_umowy').value,"numer_umowy","errDiv-numer_umowy");
            if(checkIsErr())
            {
                console.log("err is true");
                //setSubmitButton(true);
                return(0);
            };
            //setSubmitButton(false);
            taskUrl='modul/manageProject.php?task=add';
            //document.getElementById("errDiv-overall").style.display = "none";
            //errDivAjax='errDiv-overall';
            confirmTask=true;
            break;
        default:
            break;
    }; 
    if (confirmTask)
    {
        sendData(nameOfForm,taskUrl,errDivAjax);
    };
}
function sendData(nameOfForm,taskUrl,errDivAjax)
{
    var errDiv=document.getElementById(errDivAjax);
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
                errDiv.innerHTML=response[1];
                errDiv.style.display = "block";
            }
            else
            {
                runTaskAfterAjax(nameOfForm,errDiv);
            }
          }
          else
          {
              //console.log("error ajax"+this.status+" state - "+this.readyState);
          }
        };
        xmlhttp.open("POST", url, true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send(createDataToSend(nameOfForm));
}
function runTaskAfterAjax(nameOfForm,errDivAjax)
{
    console.log('---runTaskAfterAjax()---');
    errDivAjax.innerHTML='';
    errDivAjax.style.display = "none";
    switch(nameOfForm)
    {
        
        case 'addTeamToProject':
            alert('Team updated');
            $('#ProjectAdaptedModal').modal('hide'); 
            break;
        case 'closeProject':
        case 'addNewProject':   
        case 'removeProject':
        case 'setprojectdetails':   
            getAjaxData('getprojects','test','test');
            $('#ProjectAdaptedModal').modal('hide'); 
            break;
        case 'setprojectdocuments':
            alert('Documents updated');
        
            $('#ProjectAdaptedModal').modal('hide'); 
            break;
        default:
            alert('[runTaskAfterAjax()]WRONG TASK - '+nameOfForm);
            break;
    };
};
function getFormData(formName)
{
    console.log('---getFormData---\nName of form - '+formName);

    var formToCheck=document.getElementsByName(formName);
    var fieldName;
    var fieldValue;
    var tmpArray = new Array();
    var params = new Array();

    for( var i=0; i<formToCheck[0].elements.length; i++ )
    {
        fieldName =formToCheck[0].elements[i].name;
        fieldValue =formToCheck[0].elements[i].value;
        if(fieldName==='inputPdfDok3')
        {
           fieldValue=document.getElementById("pdfTypUmowy").innerHTML;
        };

        tmpArray.push(fieldName,fieldValue);
        params.push(tmpArray);
        tmpArray=[];
    }
    return params;
}
function createDataToSend(nameOfForm)
{
    console.log('---createDataToSend---\nName of form - '+nameOfForm);
    var formToCheck=document.getElementsByName(nameOfForm);
    var fieldName;
    var fieldValue;
    var params = '';
    
    for( var i=0; i<formToCheck[0].elements.length; i++ )
    {
        
        fieldName =formToCheck[0].elements[i].name;
        fieldValue =formToCheck[0].elements[i].value;
        //console.log(i+'| form name: '+fieldName+" form value: "+fieldValue);
        if(fieldName!=='')
        {
           if(fieldName==='inputPdfDok3')
            {
               fieldValue=document.getElementById("pdfTypUmowy").innerHTML;
            };
            console.log(fieldName+" - "+fieldValue);
            params += fieldName + '=' + fieldValue + '&'; 
        } 
    }
    //console.log(params);
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
        //setDefault(); NO MORE AVALIABLE
    }
});
function closeNode(nodeToClose,clearErr)
{
    console.log("---closeNode---");
    indexToRemove=clearErr.childNodes[1].name;
    console.log(clearErr.childNodes[1].name);
    console.log(nodeToClose);
    errInputValue.splice( errInputValue.indexOf(indexToRemove), 1 );
    checkIsErr();
}
function removeTeamPersRow(nodeToClose,clearErr)
{
    changeNumberOfMembers(-1);
    console.log("---removeTeamPersRow---\n");
    var idToRemove=nodeToClose.childNodes[0].childNodes[0].firstChild.value;

    console.log("Retrive id - "+idToRemove);
    console.log("Retrive id indexOf to remove - "+actUsedMemberProjTab.indexOf(idToRemove));
    actUsedMemberProjTab.splice( actUsedMemberProjTab.indexOf(idToRemove),1);
    teamElementCounter--;
    // 
    closeNode(nodeToClose,clearErr);
    
}
function changeNumberOfMembers(value)
{
    numberOfMemebersInProject=numberOfMemebersInProject+value;
    document.getElementById("projectId2").innerHTML = legendExtraLabels+numberOfMemebersInProject;
}
function editForm(elementWhereChange,taskToRun,editButton,formName)
{ 
    switch(taskToRun)
    {
        case 'getprojectdetails':
            projectEditMode=true;
            editButton.onclick=function(){ postDataToUrl(formName.name);};
            createProjectDetailViewFields(elementWhereChange,taskToRun);
            break;
        case 'getprojectdocuments':
            projectDocEditMode=true;
            editButton.onclick=function(){ postDataToUrl(formName.name);};
            createProjectDocViewFields(elementWhereChange,taskToRun);
            break;
        default:
            break;
    };
    console.log(elementWhereChange);
}
getAjaxData('getprojects','','','','');
getAjaxData('getprojectgltech','','nadzor','','');
getAjaxData('getprojectglkier','','kier_grupy','','');
getAjaxData('getprojectsleader','','nadzor','','');
getAjaxData('getprojectsmanager','','kier_grupy','','');
getAjaxData('gettypeofagreement','','typ_umowy','','');
getAjaxData('getprojectsmember','','czlonek_grupy','','');//projectsmember
getAjaxData('getadditionaldictdoc','','dodatkowe_dokumenty','','');//inputPdf8