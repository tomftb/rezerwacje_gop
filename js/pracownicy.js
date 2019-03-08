var currentIdEmployee=0;
var currentEmployeeData=new Array();
var loggedUserPerm=new Array();
var errInputValue= new Array();
var employeeTab=new Array();
var employeeSloSPecTab=new Array();
var employeeProj=new Array();
var employeeFields=new Array(
        new Array('hidden','','idEmployee'),
        new Array('t','Imię:','imie'),
        new Array('t','Nazwisko:','nazwisko'),
        new Array('t','Stanowisko:','stanowisko'),
        new Array('c-przydzial','Przydział:','przydzial')
    );
// GLOBAL INPUT PROPERTIES
var inputAttribute= new Array(
        Array('type','text'),
        Array('class','form-control mb-1'),
        Array('name','inputProject'),
        Array('id','inputProject'),
        Array('value',''),
        Array('placeholder',''),
        Array('no-readOnly','true'),
        Array('no-disabled','')
        );
var inputStyle=new Array();
function getAjaxData(task,taskAddon,functionStart,idRecord)
{
    console.log('---getAjaxData()---');
    console.log("TASK : "+task+"\nTASK ADDON : "+taskAddon);

    var url =  getUrl()+'modul/manageEmployee.php?task='+task+taskAddon;
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function()
    {
      if (this.readyState === 4 && this.status === 200)
      {
          parseAjaxResponse(this.responseText,task,functionStart,idRecord);
      }
      else
      {
          //console.log("error ajax"+this.status+" state - "+this.readyState);
      }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send(); 
}
function getUrl()
{
    console.log('---getUrl()---');
    var currentLocation = window.location;
    return currentLocation.protocol+"//"+currentLocation.host+"/";
}
function parseAjaxResponse(response,task,functionStart,idRecord)
{
    console.log('---parseAjaxResponse()---');
    var ajaxData = new Array();
    try
    {
     }
    catch(err)
    {
        //document.getElementById("demo").innerHTML = err.message;
        console.log('NOT A JSON FILE:\nERROR: '+err);
        console.log(response);
    }   
        ajaxData = JSON.parse(response);
        if(ajaxData[0][0]==='0')
        {
            console.log(ajaxData[1]);
            manageTaskAfterAjaxGet(task,ajaxData[1],functionStart,idRecord);
        }
        else
        {
            alert("[getAJaxData()]ERROR: "+ajaxData[1]);
        };
    
}
function manageTaskAfterAjaxGet(taskToRun,data,functionStart,idRecord)
{
    console.log('---manageTaskAfterAjaxGet()---');
    //console.log('TASK TO RUN - '+taskToRun+'\nDATA - '+data+'\nID - '+fieldId+'\nNAME - '+name+');
    //SET DATA TO TABLE
    switch(taskToRun)
    {
        case 'getemployeeslike':
        case 'getemployees':
            /* 
             * [].ID
             * [].ImieNazwisko
             * [].Stanowisko
             * [].Procent
             */
            employeeTab=data[0];
            loggedUserPerm=data[1];
            break;
        case 'getEmployeeAllocation':
        case 'getemployeesspecslo':
            /* 
             * [].ID
             * [].NAZWA
             * [].DEFAULT
             */
            employeeSloSpecTab=data;
            break;
        case 'getEmployeeProj':
            employeeProj=data;
            console.log(employeeProj);
            break;
        case 'getEmployeeDetails':
            currentEmployeeData=data[0];
            console.log(currentEmployeeData);
            employeeSloSpecTab=data[1];
            console.log(employeeSloSpecTab);
            break;
        default:
            alert('[manageTaskAfterAjaxGet()]ERROR - wrong task');
            break;
    }
    // RUN FUNCTION
    switch(functionStart)
    {
        case 'sEmployees':
                setButtonDisplay(document.getElementById('addNewEmployeeButton'),'ADD_EMPL',loggedUserPerm);
                setAllEmployees(data[0]);
            break;
        case 'cEmployee':
                setEmployeeBodyContent(functionStart,1);
            break;
        case 'details':
                setEmployeeBodyContent(functionStart,0);
            break;
        case 'dEmployee':
                setDeleteEmployeeBodyContent(functionStart,employeeProj,idRecord);
                console.log('dEmployee');
                break;
        case 'allocation':
                // ALL SLO SPEC
                setAlloacationEmployeeBodyContent(functionStart,0);
                // ALL EMPLOYEE SLO SPEC
                console.log('allocation');
                break;
        case 'projects':
                setEmployeeProjectBodyContent(functionStart,employeeProj,idRecord);
                break;
        default:
            break;
    }
}
function setAllEmployees(data)
{
    console.log('---setAllEmployees()---');
    var dataL=data.length;
    
    var docElement=document.getElementById("allEmployeesData");
    removeHtmlChilds(docElement);
    console.log('DATA LENGTH: '+dataL);
    
    var divBtnGroupAtr=new Array(
                Array('class','btn-group pull-left')
                );
    var divBtnGroup='';
    var btnAtr=new Array(
                Array('class',''),
                Array('name',''),
                Array('id',''),
                Array('data-toggle',"modal"),
                Array('data-target','#ProjectAdaptedModal'),
                Array('no-disabled','')     
                );
    var btnConfig=new Array(
            new Array('btn-info','details','Dane','SHOW_EMPL'),
            new Array('btn-info','allocation','Przydział','SHOW_ALLOC_EMPL'),
            new Array('btn-warning','projects','Projekty','SHOW_PROJ_EMPL'),
            new Array('btn-danger','dEmployee','Usuń','DEL_EMPL')
         );
    var btn='';
    var tr='';
    var td='';
    var tdOption='';
    var disabled='no-disabled';
    for(var i = 0; i < dataL; i++)
    {    
        tr=createHtmlElement('tr',null,null);
        for(var prop in data[i])
        {
            if(data[i].hasOwnProperty(prop))
            {
                td=createHtmlElement('td',null,null);
                td.innerText=data[i][prop];
                tr.appendChild(td);
            }
        }
        
        divBtnGroup=createHtmlElement('div',divBtnGroupAtr,null);
        
        for(var z=0;z<btnConfig.length;z++)
        {
            if(loggedUserPerm.indexOf(btnConfig[z][3])===-1)
            {
                disabled='disabled';
            }
            btnAtr[0][1]='btn '+btnConfig[z][0]+' '+disabled;
            btnAtr[1][1]=btnConfig[z][1];
            btnAtr[2][1]='idEmployee:'+data[i].ID;
            btnAtr[5][0]=disabled;
            btn=createHtmlElement('button',btnAtr,null);
            btn.innerText=btnConfig[z][2];
            btn.onclick=function(){ createAdaptedModal(this.name,this.id);};
            divBtnGroup.appendChild(btn);
            disabled='no-disabled';
        }
        tdOption=createHtmlElement('td',null,null);
        tdOption.appendChild(divBtnGroup);
        tr.appendChild(tdOption);
        docElement.appendChild(tr);
    };
}
function createHtmlElement(htmlTag,elementAttribute,elementStyle)
{
    //console.log('---createElement()---');
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
    //console.log('---addStyleToHtmlTag()---');
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
function createAdaptedModal(modalType,idEmployee)
{
    console.log('---createAdaptedModal()---');
    console.log("TASK - "+modalType+"\nID EMPLOYEE - "+idEmployee);
    console.log(idEmployee);
    removeHtmlChilds(document.getElementById('ProjectAdaptedDynamicData'));
    removeHtmlChilds(document.getElementById('ProjectAdaptedButtonsBottom'));
    removeHtmlChilds(document.getElementById('ProjectAdaptedBodyExtra'));
    removeHtmlChilds(document.getElementById('AdaptedModalInfo'));
    document.getElementById('errDiv-Adapted-overall').innerText='';
    document.getElementById('errDiv-Adapted-overall').style.display='none';
    var title=document.getElementById('ProjectAdaptedTextTitle');
    var bgTitle=document.getElementById("ProjectAdaptedBgTitle");
    bgTitle.classList.value="";
    bgTitle.classList.add("modal-header");
    var employeeData=splitValue(idEmployee,':');
    console.log(employeeData);
    switch(modalType)
    {
        case 'cEmployee':
            title.innerText='DODAJ PRACOWNIKA:';
            bgTitle.classList.add("bg-info");
            getAjaxData('getemployeesspecslo','',modalType,null);
            break;
        case 'details':
            title.innerText='DANE PRACOWNIKA:';
            bgTitle.classList.add("bg-info");
            getAjaxData('getEmployeeDetails','&id='+employeeData[1],modalType,null);
            document.getElementById('AdaptedModalInfo').innerText='Employee Id : '+employeeData[1];
            break;
        case 'allocation':
            title.innerText='PRZYDZIAŁ PRACOWNIKA:';
            bgTitle.classList.add("bg-info");
            document.getElementById('AdaptedModalInfo').innerText='Employee Id : '+employeeData[1];
            currentIdEmployee=employeeData[1];
            document.getElementById('div-inputPdf7a').innerText='Current Employee Id : '+currentIdEmployee;
            getAjaxData('getEmployeeAllocation','&id='+employeeData[1],modalType,null);
            break;
        case 'projects':
            title.innerText='PROJEKTY:';
            bgTitle.classList.add("bg-warning");
            document.getElementById('AdaptedModalInfo').innerText='Employee Id : '+employeeData[1];
            currentIdEmployee=employeeData[1];
            document.getElementById('div-inputPdf7a').innerText='Current Employee Id : '+currentIdEmployee;
            getAjaxData('getEmployeeProj','&id='+employeeData[1],modalType,employeeData[1]);
            break;
        case 'dEmployee':
            title.innerText='USUŃ PRACOWNIKA:';
            bgTitle.classList.add("bg-danger");
            console.log(employeeData[1]);
            document.getElementById('AdaptedModalInfo').innerText='Employee Id : '+employeeData[1];
            currentIdEmployee=employeeData[1];
            document.getElementById('div-inputPdf7a').innerText='Current Employee Id : '+currentIdEmployee;
            // GET FULL DATA ABOUT EMPLOYEE PROJECTS
            if(loggedUserPerm.indexOf('SHOW_PROJ_EMPL')!==-1)
            {
                console.log('SHOW_PROJ_EMPL : '+loggedUserPerm.indexOf('SHOW_PROJ_EMPL'));
                getAjaxData('getEmployeeProj','&id='+employeeData[1],modalType,employeeData[1]);
            }
            else
            {
                employeeProj=[];
                setDeleteEmployeeBodyContent(modalType,employeeProj,employeeData[1]);
            }
            // v_udzial_count_projekt_prac
            
            break;
        default:
            break;
    }
}
function splitValue(value,delimiter)
{
    console.log('---splitValue()---');
    if(value!==null && value!==undefined)
    {
        if(value.trim()!=='')
        {
            return value.split(delimiter);
        }
        else
        {
            return 0;
        }
    }  
}
function setEmployeeProjectBodyContent(task,employeeProj,idRecord)
{
    console.log('---setEmployeeProjectBodyContent()---');
    var mainDiv=document.getElementById('ProjectAdaptedButtonsBottom');
    if(employeeProj.length>0)
    {
        createEmployeeProjectsRowContent(mainDiv,employeeProj,genTextNode(task));
    }
    else
    {
        // NO PROJECT
        mainDiv.appendChild(genTextNode('noprojects'));
    }
    mainDiv.appendChild(createBodyButtonContent(task));
    console.log(mainDiv);
}
function setDeleteEmployeeBodyContent(task,employeeProj,idRecord)
{
    console.log('---setDeleteEmployeeBodyContent()---');
    var dataDiv=getEmplDefModal();
    var form=dataDiv.childNodes[1].childNodes[1];
    console.log(form.childNodes[1]);
    form.name='deleteEmployee';
   
    console.log(form.childNodes[1]);
    console.log('PROJECT COUNT: '+employeeProj.length);
    
    if(employeeProj.length>0)
    {
        createEmployeeProjectsRowContent(form.childNodes[1],employeeProj,genTextNode(task));
        document.getElementById('ProjectAdaptedButtonsBottom').appendChild(createBodyButtonContent('projects'));
    }
    else
    {
        createHiddenInpRowEmployeeRowContent(form.childNodes[1],idRecord);
        document.getElementById('ProjectAdaptedButtonsBottom').appendChild(createBodyButtonContent('deleteEmployee'));
    }
    document.getElementById('ProjectAdaptedDynamicData').appendChild(dataDiv);
    console.log(dataDiv);
}
function genTextNode(task)
{
    console.log('---genTextNode()---\n'+task);
    //var textAlert = document.createTextNode('Pracownik nie może zostać usunięty ponieważ bierze udział w poniższych projektach:');
    var info='';
    var tag='h4';
    var hAtr=new Array(
                Array('class','text-danger mb-3 text-center font-weight-bold')
                );
    //p.appendChild(textAlert);
    switch(task)
    {
        case 'projects':
            tag='h4'
            hAtr[0][1]='text-dark mb-3 text-center font-weight-bold';
            info='Aktualny wykaz projektów powiązanych z pracownikiem:';
            break;
        case 'noprojects':
            tag='h4'
            hAtr[0][1]='text-dark mb-3 text-center font-weight-bold';
            info='Aktualnie pracownik nie bierze udziału w żadnym projekcie.';
            break;
        case 'dEmployee':
            info='Pracownik nie może zostać usunięty ponieważ bierze udział w poniższych projektach:';
            break;
        default:
            break;
    }
    
    var h=createHtmlElement(tag,hAtr,null);
    h.innerText=info;
    return(h);
}
function createHiddenInpRowEmployeeRowContent(whereAppend,employeeId)
{
    // ADD HIDDEN INPUT WITH ID
    var inpAtr=new Array(
                Array('type','hidden'),
                Array('name','idEmployee'),
                Array('value',employeeId)
                );
    var inp=createHtmlElement('input',inpAtr,null);
    whereAppend.appendChild(inp); 
}
function createEmployeeProjectsRowContent(whereAppend,employeeProj,titleElement)
{
    console.log('---createDeleteEmployeeRowContent()---');
    console.log(whereAppend);
    var dataL=employeeProj.length;
    
    console.log('DATA LENGTH: '+dataL);
   
    // SET WARNING
    var divAlertAtr=new Array(
            Array('class','w-100')
            );
    var divAlert=createHtmlElement('div',divAlertAtr,null);
    
        divAlert.appendChild(titleElement);
        //divAlert.appendChild(p);
        whereAppend.appendChild(divAlert);
        
    var tableAtr=new Array(
            Array('class','table table-striped table-condensed')
            );
    var table=createHtmlElement('table',tableAtr,null);
    var tr=createHtmlElement('tr',null,null);

    // GET HEADER 
    for(var prop in employeeProj[0])
        {
            if(employeeProj[0].hasOwnProperty(prop))
            {
                td=createHtmlElement('td',null,null);
                prop=prop.replace("_", " ");
                td.innerText=prop;
                tr.appendChild(td);
            }
        }
    table.appendChild(tr);   
    // GET DATA
    for(var i=0;i<employeeProj.length;i++)
    {
        tr=createHtmlElement('tr',null,null);
        for(var prop in employeeProj[i])
        {
            if(employeeProj[i].hasOwnProperty(prop))
            {
                td=createHtmlElement('td',null,null);
                td.innerText=employeeProj[i][prop];
                tr.appendChild(td);
            }
        }
        table.appendChild(tr);
    };
    whereAppend.appendChild(table);
}
function setAlloacationEmployeeBodyContent(task,status)
{
    console.log('---setAlloacationEmployeeBodyContent()---');
    console.log('ID EMPLOYEE: '+currentIdEmployee);
    
    var dataDiv=getEmplDefModal();
    var form=dataDiv.childNodes[1].childNodes[1];
    form.name='employeeAllocation';
    createHiddenInpRowEmployeeRowContent(form.childNodes[1],currentIdEmployee)
    setAlloacationEmployeeContent(form.childNodes[1],status);
    document.getElementById('ProjectAdaptedDynamicData').appendChild(dataDiv);
    console.log(dataDiv);
    
    document.getElementById('ProjectAdaptedButtonsBottom').appendChild(createBodyButtonContent(task));

}
function setAlloacationEmployeeContent(whereAppend,status)
{
    console.log('---setAlloacationEmployeeContent()---');
    //employeeSloSpecTab,
    //currentIdEmployee
    var divSm2Atr=new Array(
	Array('class','col-sm-2')
	);
    var div1Sm2=createHtmlElement('div',divSm2Atr,null);
    var divSm8Atr=new Array(
	Array('class','col-sm-8')
	);
    var div1Sm8=createHtmlElement('div',divSm8Atr,null);
    div1Sm8.appendChild(createCheckBoxList(employeeSloSpecTab,status));
    whereAppend.appendChild(div1Sm2);
    whereAppend.appendChild(div1Sm8);
}
function setEmployeeBodyContent(task,status)
{
    console.log('---setEmployeeBodyContent()---');
    
    var dataDiv=getEmplDefModal();
    var form=dataDiv.childNodes[1].childNodes[1];
    console.log(form.childNodes[1]);
    form.name=task;
   
    console.log(form.childNodes[1]);
    switch(status)
    {
        case 0:
                //BLOCKED WITH DATA
                createEditedEmployeeRowContent(form.childNodes[1],status);
                document.getElementById('ProjectAdaptedButtonsBottom').appendChild(createBodyButtonContent(task));
            break;
        case 1:
                //NEW EMPLOYEE
                createNewEmployeeRowContent(form.childNodes[1]);
                document.getElementById('ProjectAdaptedButtonsBottom').appendChild(createBodyButtonContent(task));
                addLegendDiv();
            break;
        case 2:
                //EDIT EMPLOYEE
                createEditedEmployeeRowContent(form.childNodes[1],1);
                document.getElementById('ProjectAdaptedButtonsBottom').appendChild(createBodyButtonContent(task));
                addLegendDiv();
                
            break;
        default:
            break;
    }
    console.log(dataDiv);
    
    document.getElementById('ProjectAdaptedDynamicData').appendChild(dataDiv);
}
function addLegendDiv()
{
    var legendDiv=document.getElementById('legendDiv').cloneNode(true);
    legendDiv.classList.remove("modal");
    legendDiv.classList.remove("fade");
    document.getElementById('ProjectAdaptedBodyExtra').appendChild(legendDiv);
}
function createEditedEmployeeRowContent(whereAppend,status)
{
    console.log('---createEditedEmployeeRowContent()---');
    console.log(whereAppend);
    console.log(currentEmployeeData);
    // currentEmployeeData -> EMPLOYEE DATA
    // employeeSloSpecTab -> EMPLOYEE SLO
    
    // HTML TAGS
    console.log('STATUS -> '+status);
    if(status)
    {
        inputAttribute[6][0]='no-readonly';
        inputAttribute[7][0]='no-disabled'; 
    }
    else
    {
        inputAttribute[6][0]='readonly';
        inputAttribute[7][0]='disabled';
    };
    var labelAttribute=new Array(
	Array('for','inputEmployee'),
	Array('class','col-sm-4 control-label text-right font-weight-bold')
	);
    var div1=new Array(
	Array('class','col-sm-8')
	);
    var divErrAtr=new Array(
            Array('class','col-sm-auto alert alert-danger'),
            Array('id','')
            );
    var divErrStyle=new Array(
            Array('display','none')
            );
    for(var i=0;i<employeeFields.length;i++)
    {
        inputAttribute[0][1]='text';
        inputAttribute[2][1]=employeeFields[i][2];
        inputAttribute[3][1]=employeeFields[i][2];
        inputAttribute[4][1]='';
        labelAttribute[0][1]='inputProject'+i;
        labelElement=createHtmlElement('label',labelAttribute,null);
        div1Element=createHtmlElement('div',div1,null);
        labelElement.innerText=employeeFields[i][1];
        switch(employeeFields[i][0])
        {
            case 'hidden':
                console.log('HIDDEN');
                inputAttribute[0][1]='hidden'; 
                inputAttribute[4][1]=currentEmployeeData[0].ID;
                inputElement=createHtmlElement('input',inputAttribute,inputStyle);
                div1Element.appendChild(inputElement);
                break;
            case 't':
                inputAttribute[4][1]=assignProjectDataToField(employeeFields[i][2]);
                inputElement=createHtmlElement('input',inputAttribute,inputStyle);
                divErrAtr[1][1]='errDiv-'+employeeFields[i][2];
                divErr=createHtmlElement('div',divErrAtr,divErrStyle);
                inputElement.onblur=function()
                {
                    parseFieldValue(this,null,null);
                };
                div1Element.appendChild(inputElement);
                div1Element.appendChild(divErr);
                break;
            case 'c-przydzial':
                div1Element.appendChild(createCheckBoxList(employeeSloSpecTab,status));
                break;
            default:
                break;
        };
        whereAppend.appendChild(labelElement);
        whereAppend.appendChild(div1Element);
    };
}
function createNewEmployeeRowContent(whereAppend)
{
    console.log('---createNewEmployeeRowContent()---');
    console.log(whereAppend);
    
     // HTML TAGS
    var labelAttribute=new Array(
	Array('for','inputEmployee'),
	Array('class','col-sm-4 control-label text-right font-weight-bold')
	);
    var div1=new Array(
	Array('class','col-sm-8')
	);
    var divErrAtr=new Array(
            Array('class','col-sm-auto alert alert-danger'),
            Array('id','')
            );
    var divErrStyle=new Array(
            Array('display','none')
            );
    inputAttribute[6][0]='no-readonly';
    inputAttribute[7][0]='no-disabled';
    
    for(var i=0;i<employeeFields.length;i++)
    {
        inputAttribute[0][1]='text';
        inputAttribute[2][1]=employeeFields[i][2];
        inputAttribute[3][1]=employeeFields[i][2];
        inputAttribute[4][1]='';
        labelAttribute[0][1]='inputProject'+i;
        labelElement=createHtmlElement('label',labelAttribute,null);
        div1Element=createHtmlElement('div',div1,null);
        labelElement.innerText=employeeFields[i][1];
        switch(employeeFields[i][0])
        {
            case 'hidden':
                console.log('HIDDEN');
                inputAttribute[0][1]='hidden'; 
                break;
            case 't':
                inputElement=createHtmlElement('input',inputAttribute,inputStyle);
                divErrAtr[1][1]='errDiv-'+employeeFields[i][2];
                divErr=createHtmlElement('div',divErrAtr,divErrStyle);
                inputElement.onblur=function()
                {
                    parseFieldValue(this,null,null);
                };
                div1Element.appendChild(inputElement);
                div1Element.appendChild(divErr);
                break;
            case 'c-przydzial':
                div1Element.appendChild(createCheckBoxList(employeeSloSpecTab,1));
                break;
            default:
                break;
        };
        whereAppend.appendChild(labelElement);
        whereAppend.appendChild(div1Element);
    };
}
function assignProjectDataToField(fieldId)
{
    console.log('---assignProjectDataToField---');
    var valueToReturn='';
    switch(fieldId)
    {
        case 'imie':
            valueToReturn=currentEmployeeData[0].Imie;
            break;
        case 'nazwisko':
            valueToReturn=currentEmployeeData[0].Nazwisko;
            break;
        case 'stanowisko':
            valueToReturn=currentEmployeeData[0].Stanowisko;
            break;
        default:
            break;
    };
                
    return (valueToReturn);            
}
function getEmplDefModal()
{
    console.log('---getEmplDefModal()---');
    var mainTemplate=document.getElementById('employeeModalDetail').cloneNode(true);
    mainTemplate.classList.remove("modal");
    mainTemplate.classList.remove("fade");
    return(mainTemplate);
}
function parseFieldValue(data,fieldType,errDivAlt)
{
    console.log('---parseFieldValue()---');
    console.log('FIELD TYPE: '+fieldType+'\nERR DIV ALT: '+errDivAlt);
    console.log("DATA TYPE: "+typeof(data));
    var errDiv='';
    var plChars='ąĄćĆęĘłŁńŃóÓśŚżŻźŹ';
    var valueToParse='';
    var typeOfValueToParse='';
    if(typeof(data)==='object')
    {
        valueToParse=data.value;
        typeOfValueToParse=data.name;
        errDiv=data.parentNode.childNodes[1];   
        console.log(data.parentNode.childNodes[1]);
        console.log(data.name);
        typeOfValueToParse=data.name;
    }
    else
    {
        valueToParse=data;
        typeOfValueToParse=fieldType;
        errDiv=document.getElementById(errDivAlt);
    };
    valueToParse=valueToParse.trim();
    switch(typeOfValueToParse)
    {
        case 'imie':
                if(valueToParse.length>2)
                {
                    regExp(valueToParse,typeOfValueToParse,"^[a-zA-Z'"+plChars+"][\\sa-zA-Z"+plChars+"]*[a-zA-Z"+plChars+"]{1}$",errDiv);
                }
                else
                {
                    console.log('ERROR LENGTH');
                    setErrTab(typeOfValueToParse);
                    showDivErr(errDiv,'Błąd składni');
                }
                break;
        case 'nazwisko':
                if(valueToParse.length>2)
                {
                    regExp(valueToParse,typeOfValueToParse,"^[a-zA-Z'"+plChars+"][\\-\\sa-zA-Z"+plChars+"]*[a-zA-Z"+plChars+"]{1}$",errDiv);
                }
                else
                {
                    console.log('ERROR LENGTH');
                    setErrTab(typeOfValueToParse);
                    showDivErr(errDiv,'Błąd składni');
                }
            break;
        case 'stanowisko':
                if(valueToParse.length>0)
                {
                    regExp(valueToParse,typeOfValueToParse,"^[\\da-zA-Z'"+plChars+"][\\/\\-\\_\\.\\s\\da-zA-Z"+plChars+"]*[\\.\\da-zA-Z"+plChars+"]{1}$",errDiv);
                }
            break;
        default:
            break;
    }
  
}
function regExp(value,valueType,testCondition,errDiv)
{
    console.log('---regExp()---');
    var thisRegex = new RegExp(testCondition);
    if(!thisRegex.test(value))
    {
        console.log('ERROR');
        console.log('[err]['+valueType+'] '+value);
        setErrTab(valueType);
        showDivErr(errDiv,'Błąd składni');
    }
    else
    {
        console.log('[ok]['+valueType+'] '+value);
        removeErrTab(valueType);
        hideDivErr(errDiv);
    }
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
function removeHtmlChilds(htmlElement)
{
    console.log('---removeHtmlChilds()---');
    while (htmlElement.firstChild)
    {
        //console.log(htmlElement.firstChild);
        htmlElement.firstChild.remove(); 
    };
}
function createCheckBoxList(data,status)
{
    console.log('---createCheckBoxList()---');
    console.log(data);
    console.log("LENGTH: "+data.length);
    /*
     * data - array of objects
     */
    var cboxAtr= new Array(
            Array('class','custom-control-input'),
            Array('type','checkbox'),
            Array('name',''),
            Array('id',''),
            Array('value',''),
            Array('checked',''),
            Array('disabled',''),
            Array('autocomplete','off')
        );
    var cbox='';
    var labelAtr=new Array(
            Array('class','custom-control-label'),
            Array('for',''),
            );
    var label='';
    var divOverAllAtr=new Array(
            Array('class','row')
            );
    var divRAtr=new Array(
            Array('class','ml-3 col-sm-12 custom-control custom-checkbox')
            );
    var divR='';;
    var divOverAll=createHtmlElement('div',divOverAllAtr,null);
    for(var i = 0; i < data.length; i++)
    {    
        
        //console.log(data[i].ID+' '+data[i].NAZWA+' '+data[i].DEFAULT);
        divR=createHtmlElement('div',divRAtr,null);
        labelAtr[1][1]='cbox-'+data[i].ID;
        label=createHtmlElement('label',labelAtr,null);
        label.innerText=data[i].NAZWA;
        cboxAtr[2][1]='cbox-ID:'+data[i].ID+'-NAME:'+data[i].NAZWA;
        cboxAtr[3][1]='cbox-'+data[i].ID;
        // VALUE = 0 not send
        // VALUE = 1 ok
        if(data[i].DEFAULT==='t')
        {
            cboxAtr[4][1]=1;
            cboxAtr[5][0]='checked';
        }
        else
        {
            cboxAtr[4][1]=0;
            cboxAtr[5][0]='no-checked';
        };
        if(status)
        {
           cboxAtr[6][0]='no-disabled'; 
        };
        cbox=createHtmlElement('input',cboxAtr,null);
        cbox.onclick=function(){ changeBoxValue(this); };
        divR.appendChild(cbox);
        divR.appendChild(label);
        divOverAll.appendChild(divR);
    };
    console.log(divOverAll);
    return(divOverAll);
}
function changeBoxValue(input)
{
    console.log('---changeBoxValue()---');
    //console.log(input);
    //console.log(input.value);
    //console.log(typeof(input.value));
    if(input.value==='0')
    {
        console.log('CHANGE TO 1');
        input.value='1';
    }
    else
    {
        console.log('CHANGE TO 0');
        input.value='0';
    };
}
function createBodyButtonContent(task)
{
    console.log('---createBodyButtonContent()---');
    // GROUP DIV BUTTON
    var divButtonAttribute=new Array(
                Array('class','btn-group pull-right')
                );
    var divButtonElement=createHtmlElement('div',divButtonAttribute,null);
    // END GROUP DIV BUTTON
    // CANCEL BUTTON
    var cancelButtonAtr=new Array(
                Array('class','btn btn-dark pull-right')
                );
    var cancelButton=createHtmlElement('button',cancelButtonAtr,null);
    cancelButton.innerText = "Anuluj";
    cancelButton.onclick = function() { closeModal('ProjectAdaptedModal'); };
    // ADD BUTTON
    var confirmButtonAtr = new Array(
             Array('class','btn btn-info btn-add')
            );
    var confirmButton='';

    switch(task)
    {
        case 'cEmployee':
            confirmButton=createHtmlElement('button',confirmButtonAtr,null);
            confirmButton.innerText = "Dodaj";
            confirmButton.onclick = function() { postDataToUrl(task); };
            divButtonElement.appendChild(cancelButton);
            divButtonElement.appendChild(confirmButton);
            break;
        case 'deleteEmployee':
            confirmButtonAtr[0][1]='btn btn-danger';
            confirmButton=createHtmlElement('button',confirmButtonAtr,null);
            confirmButton.innerText = 'Usuń';
            confirmButton.onclick = function() { postDataToUrl(task); };
            divButtonElement.appendChild(cancelButton);
            divButtonElement.appendChild(confirmButton);
            break;
        case 'projects':
            cancelButton.innerText = "Zamknij";
            divButtonElement.appendChild(cancelButton);
            break;
        case 'allocation':
            confirmButtonAtr[0][1]='btn btn-info';
            confirmButton=createHtmlElement('button',confirmButtonAtr,null);
            confirmButton.innerText = 'Edytuj';
            confirmButton.onclick = function()
            {
                removeHtmlChilds(document.getElementById('ProjectAdaptedDynamicData'));
                removeHtmlChilds(document.getElementById('ProjectAdaptedButtonsBottom'));
                setAlloacationEmployeeBodyContent('employeeAllocation',1); 
            };
            divButtonElement.appendChild(cancelButton);
            divButtonElement.appendChild(confirmButton);
            break;
        case 'details':
            confirmButtonAtr[0][1]='btn btn-info';
            confirmButton=createHtmlElement('button',confirmButtonAtr,null);
            confirmButton.innerText = 'Edytuj';
            confirmButton.onclick = function()
            {
                removeHtmlChilds(document.getElementById('ProjectAdaptedDynamicData'));
                removeHtmlChilds(document.getElementById('ProjectAdaptedButtonsBottom'));
                setEmployeeBodyContent('editEmployee',2); 
            };
            divButtonElement.appendChild(cancelButton);
            divButtonElement.appendChild(confirmButton);
            break;
        case 'editEmployee':
        case 'employeeAllocation':
            confirmButtonAtr[0][1]='btn btn-info';
            confirmButton=createHtmlElement('button',confirmButtonAtr,null);
            confirmButton.innerText = 'Zatwierdź';
            confirmButton.onclick = function() { postDataToUrl(task); };
            divButtonElement.appendChild(cancelButton);
            divButtonElement.appendChild(confirmButton);
            break;
        default:
            alert('[createBodyButtonContent()]ERROR - wrong task');
            break;
    };
    
    return(divButtonElement);
}
function closeModal(modalId)
{
    $('#'+modalId).modal('hide');
}
function postDataToUrl(nameOfForm)
{
    console.log('---postDataToUrl()---');
    console.log(nameOfForm);
    var taskUrl='modul/manageEmployee.php?task='+nameOfForm;
    var confirmTask=false;

    switch(nameOfForm)
    {
        case 'cEmployee':
        case 'editEmployee':    
            parseFieldValue( document.getElementById('imie').value,"imie","errDiv-imie");
            parseFieldValue( document.getElementById('nazwisko').value,"nazwisko","errDiv-nazwisko");
            parseFieldValue( document.getElementById('stanowisko').value,"stanowisko","errDiv-stanowisko");
            if(checkIsErr())
            {
                console.log("err is true");
                return(0);
            };
            confirmTask=true;
            break;
        case 'deleteEmployee':
            confirmTask = confirm("Potwierdź usunięcie pracownika");
            break;
        case 'employeeAllocation':
            confirmTask=true;
            break;
        default:
            break;
    }; 
    if (confirmTask)
    {
        sendData(nameOfForm,taskUrl);
    };
}
function sendData(nameOfForm,taskUrl)
{
    console.log('---sendData()---');
    var xmlhttp = new XMLHttpRequest();
    var host =  getUrl();
    var url =  host+taskUrl;
    xmlhttp.onreadystatechange = function()
        {
          if (this.readyState === 4 && this.status === 200)
          {
                runTaskAfterAjax(nameOfForm,this.responseText);
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
function runTaskAfterAjax(nameOfForm,response)
{
    console.log('---runTaskAfterAjax()---');
    console.log(response);
    var responseData = JSON.parse(response);
    if(responseData[0]==='1')
    {
        setOverAllErrDiv(responseData[1],true);
    }
    else
    {
        setOverAllErrDiv(responseData[1],false);
        switch(nameOfForm)
        {
            case 'cEmployee':
                setNewDataState('Employee added');
                break;
            case 'deleteEmployee':
                setNewDataState('Employee removed');
                break;
            case 'editEmployee':
            case 'employeeAllocation':
                setNewDataState('Employee updated');
                break;
            default:
                alert('[runTaskAfterAjax()]WRONG TASK - '+nameOfForm);
                break;
        } 
    } 
}
function setNewDataState(infoAlert)
{
    alert(infoAlert);
    getAjaxData('getemployees','','sEmployees',null);
    $('#ProjectAdaptedModal').modal('hide'); 
}
function setOverAllErrDiv(data,action)
{
    console.log('---setOverAllErrDiv()---');
    var errDiv=document.getElementById('errDiv-Adapted-overall');
    if(action)
    {
        errDiv.innerHTML=data;
        errDiv.style.display = "block";  
    }
    else
    {
        errDiv.innerHTML='';
        errDiv.style.display = "none";  
    };
}
function createDataToSend(nameOfForm)
{
    console.log('---createDataToSend---\nName of form - '+nameOfForm);
    var formToCheck=document.getElementsByName(nameOfForm);
    console.log(document.getElementById(nameOfForm));
    console.log(formToCheck);
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
            console.log(fieldName+" - "+fieldValue);
            params += fieldName + '=' + fieldValue + '&'; 
        } 
    }
    //console.log(params);
    return params;
}
function setButtonDisplay(element,perm,userPerm)
{
    //console.log('---setButtonDisplay()---');
    if(userPerm.indexOf(perm)===-1)
    {
        element.classList.add('disabled');
        element.setAttribute("disabled", "");
    }
    else
    {
        element.classList.remove("disabled");
        element.removeAttribute("disabled");
    }
}
getAjaxData('getemployees','','sEmployees',null);