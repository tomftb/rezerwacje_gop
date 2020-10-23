console.log(loggedUserPerm);
var ajax = new Ajax();
var error = new Error();
var overallErr = false;
var currentIdEmployee=0;
var currentEmployeeData=new Array();
//var loggedUserPerm=new Array();
var errInputValue= new Array();
var employeeTab=new Array();
var employeeSloSPecTab=new Array();
var employeeFields=new Array(
        new Array('hidden','','idEmployee'),
        new Array('t','Imię:','imie'),
        new Array('t','Nazwisko:','nazwisko'),
        new Array('t','Stanowisko:','stanowisko'),
        new Array('t','Email:','email'),
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
function manageTaskAfterAjax(d)
{
    /*
     * d => array response
     */
    console.log('===manageTaskAfterAjaxGet()===');
    console.log(d);
    // CHECK STATUS
    console.log(error);
    overallErr=Error.checkStatusExist(d['status']);
    console.log(overallErr);
    // SET SLO
    setSlo(d);
    // RUN FUNCTION
    runFunction(d);
}
function setSlo(d)
{
    console.log('===setSlo()===');
    if(overallErr) { return ''; };
    switch(d['data']['task'])
    {
        case 'getEmployeesLike':
        case 'getEmployees':
            setButtonDisplay(document.getElementById('addNewEmployeeButton'),'ADD_EMPL');
            setAllEmployees(d['data']['value']);
            break;
        case 'getEmployeeAllocation':
            currentEmployeeData=d['data']['value'][0];
            employeeSloSpecTab=d['data']['value'][1];
            break;
        case 'getEmployeesSpecSlo':
            /* 
             * [].ID
             * [].NAZWA
             * [].DEFAULT
             */
            employeeSloSpecTab=d['data']['value'];
            break;
        case 'getEmployeeDetails':
            currentEmployeeData=d['data']['value'][0];
            console.log(currentEmployeeData);
            employeeSloSpecTab=d['data']['value'][1];
            console.log(employeeSloSpecTab);
            break;
        default:
            console.log('TASK => '+d['data']['task']);  
            //alert('setSlo() ERROR - wrong task');
            break;
    }
}
function runFunction(d)
{
    console.log('===runFunction()===\n'+d['data']['function']);
    if(overallErr) { return ''; };
    switch(d['data']['function'])
    {
        case 'sEmployees':
                Error.checkStatusResponse(d);
            break;
        case 'cEmployee':
                cEmployee(d);
            break;
        case 'cModal':
                cModal(d);
                break;
        case 'details':
                prepareModal('DANE PRACOWNIKA:','bg-info');
                setEmployeeBodyContent(d['data']['function'],0);
            break;
        case 'dEmployee':
                dEmployee(d);
                break;
        case 'allocation':
                // ALL SLO SPEC
                prepareModal('PRZYDZIAŁ PRACOWNIKA:','bg-info');
                setAlloacationEmployeeBodyContent(d['data']['function'],0);
                // ALL EMPLOYEE SLO SPEC
                console.log('allocation');
                break;
        case 'projects':
                prepareModal('PROJEKTY:','bg-warning');
                setEmployeeProjectBodyContent(d['data']['function'],d['data']['value'][1],d['data']['value'][0]);
                break;
        default:
                
                alert('runFunction() ERROR - wrong function');
            break;
    }
}
function prepareModal(title,titleBg)
{
    removeHtmlChilds(document.getElementById('ProjectAdaptedDynamicData'));
    removeHtmlChilds(document.getElementById('ProjectAdaptedButtonsBottom'));
    removeHtmlChilds(document.getElementById('ProjectAdaptedBodyExtra'));
    removeHtmlChilds(document.getElementById('AdaptedModalInfo'));
    document.getElementById('errDiv-Adapted-overall').innerText='';
    document.getElementById('errDiv-Adapted-overall').style.display='none';
    document.getElementById('ProjectAdaptedTextTitle').innerText=title;
    document.getElementById("ProjectAdaptedBgTitle").classList.add(titleBg);
}
function cModal(d)
{
    console.log('cModal\nRESPONSE:');
    console.log(d);
    console.log(document.getElementById('ProjectAdaptedModal'));
    /*
     * PARSE RESPONSE
     * SET DIV ERROR
    */ 
    Error.setDiv('errDiv-Adapted-overall');
    Error.setModal('ProjectAdaptedModal');
    Error.checkStatusResponse(d);
    if(Error.error===false)
    {
        ajax.getData('getEmployees');
    }
}
function cEmployee(d)
{
    console.log('cEmployee\nRESPONSE:');
    console.log(d);
    console.log(document.getElementById('ProjectAdaptedModal'));
    /*
     * check task
     */
    if(d['data']['task']==='getEmployeesSpecSlo')
    {
        prepareModal('DODAJ PRACOWNIKA:','bg-info');
        setEmployeeBodyContent(d['data']['function'],1);
        /*
        * PARSE RESPONSE
        */ 
        Error.checkStatusResponse(d);
    }
    else if(d['data']['task']==='cEmployee')
    {
        cModal(d);
    }
    else
    {
        console.log('cEmployee => wrong task => '+d['data']['task']);
        alert('ERROR OCCURED!');
        return '';
    }
}
function dEmployee(d)
{
    console.log('dEmployee\nRESPONSE:');
    console.log(d);
    console.log(document.getElementById('ProjectAdaptedModal'));
    /*
     * check task
     */
    if(d['data']['task']==='getDeletedEmployeeProjects')
    {
        prepareModal('USUŃ PRACOWNIKA:','bg-danger');
        setDeleteEmployeeBodyContent(d);
        /*
        * PARSE RESPONSE
        */ 
        Error.checkStatusResponse(d);
    }
    else if(d['data']['task']==='dEmployee')
    {
        cModal(d);
    }
    else
    {
        console.log('dEmployee => wrong task => '+d['data']['task']);
        alert('ERROR OCCURED!');
        return '';
    }
}
function setAllEmployees(data)
{
    console.log('---setAllEmployees()---');
    //console.log(data);
                /* 
             * [].ID
             * [].ImieNazwisko
             * [].Stanowisko
             * [].Procent
             * [].Email
             */
    employeeTab=data;
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
                Array('no-disabled',''),
                );
    var btnConfig=new Array(
            new Array('btn-info','getEmployeeDetails&id=','Dane','SHOW_EMPL'),
            new Array('btn-info','getEmployeeAllocation&id=','Przydział','SHOW_ALLOC_EMPL'),
            new Array('btn-warning','getEmployeeProjects&id=','Projekty','SHOW_PROJ_EMPL'),
            new Array('btn-danger','getDeletedEmployeeProjects&id=','Usuń','DEL_EMPL')
         );
    var btn='';
    var tr='';
    var td='';
    var tdOption='';
    var disabled='no-disabled';
    for(var i = 0; i < dataL; i++)
    {    
        tr=createHtmlElement('tr',null,null,null);
        for(var prop in data[i])
        {
            if(data[i].hasOwnProperty(prop))
            {
                td=createHtmlElement('td',null,null,null);
                td.innerText=data[i][prop];
                tr.appendChild(td);
            }
        }
        divBtnGroup=createHtmlElement('div',divBtnGroupAtr,null,null);
        for(var z=0;z<btnConfig.length;z++)
        {
            if(loggedUserPerm.indexOf(btnConfig[z][3])===-1)
            {
                disabled='disabled';
            }
            btnAtr[0][1]='btn '+btnConfig[z][0]+' '+disabled;
            btnAtr[1][1]=btnConfig[z][1]+data[i].ID;
            btnAtr[2][1]=data[i].ID;
            btnAtr[5][0]=disabled;
            //btnAtr[6][1]='&id='+data[i].ID+'&function='.btnConfig[z][4];
            btn=createHtmlElement('button',btnAtr,null,null);
            btn.innerText=btnConfig[z][2];
            btn.onclick=function(){
                //console.log(this);
                //console.log(this.name);
                ajax.getData(this.name);
            }; 
            //btn.onclick=function(){ createAdaptedModal(this.name,this.id);};
            divBtnGroup.appendChild(btn);
            disabled='no-disabled';
        }
        tdOption=createHtmlElement('td',null,null,null);
        tdOption.appendChild(divBtnGroup);
        tr.appendChild(tdOption);
        docElement.appendChild(tr);
    };
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
function setDeleteEmployeeBodyContent(d)
{
    /*
     * d => data 
     */
    console.log('---setDeleteEmployeeBodyContent()---');
    console.log(d);
    var dataDiv=getEmplDefModal();
    var form=dataDiv.childNodes[1].childNodes[1];
    console.log(form.childNodes[1]);
    form.name='dEmployee';
    form.id='dEmployee';
    console.log(form.childNodes[1]);
    console.log('PROJECT COUNT: '+d['data']['value'][1].length);
    console.log(d['info']);
    console.log(d['info']===''); 
    if(d['data']['value'][1].length>0 && d['info']==='')
    {
        console.log('D1');
        createEmployeeProjectsRowContent(form.childNodes[1],d['data']['value'][1],genTextNode(d['data']['function']));
        document.getElementById('ProjectAdaptedButtonsBottom').appendChild(createBodyButtonContent('projects'));
    }
    else if(d['data']['value'][1].length>0 && d['info']!=='')
    {
        console.log('D2');
        // SET WARNING
        var divAlertAtr=new Array(
                Array('class','w-100')
                );
        var divAlert=createHtmlElement('div',divAlertAtr,null,null);

            divAlert.appendChild(genTextNode('NO'+d['data']['function']));
            //divAlert.appendChild(p);
            form.childNodes[1].appendChild(divAlert);
            document.getElementById('ProjectAdaptedButtonsBottom').appendChild(createBodyButtonContent('projects'));
    }
    else
    {
        console.log('D3');
        createHiddenInpRowEmployeeRowContent(form,d['data']['value'][0]);
        //createHiddenInpRowEmployeeRowContent(form.childNodes[1],d['data']['value'][0]);
        document.getElementById('ProjectAdaptedButtonsBottom').appendChild(createBodyButtonContent('dEmployee'));
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
            tag='h4';
            hAtr[0][1]='text-dark mb-3 text-center font-weight-bold';
            info='Aktualny wykaz projektów powiązanych z pracownikiem:';
            break;
        case 'noprojects':
            tag='h4';
            hAtr[0][1]='text-dark mb-3 text-center font-weight-bold';
            info='Aktualnie pracownik nie bierze udziału w żadnym projekcie.';
            break;
        case 'dEmployee':
            info='Pracownik nie może zostać usunięty ponieważ bierze udział w poniższych projektach:';
            break;
        case 'NOdEmployee':
            info='Pracownik nie może zostać usunięty ponieważ bierze udział w projektach!';
            break;
        default:
            break;
    }
    
    var h=createHtmlElement(tag,hAtr,null,null);
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
    var inp=createHtmlElement('input',inpAtr,null,null);
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
    var divAlert=createHtmlElement('div',divAlertAtr,null,null);
    
        divAlert.appendChild(titleElement);
        //divAlert.appendChild(p);
        whereAppend.appendChild(divAlert);
        
    var tableAtr=new Array(
            Array('class','table table-striped table-condensed')
            );
    var table=createHtmlElement('table',tableAtr,null,null);
    var tr=createHtmlElement('tr',null,null);

    // GET HEADER 
    for(var prop in employeeProj[0])
        {
            if(employeeProj[0].hasOwnProperty(prop))
            {
                td=createHtmlElement('td',null,null,null);
                prop=prop.replace("_", " ");
                td.innerText=prop;
                tr.appendChild(td);
            }
        }
    table.appendChild(tr);   
    // GET DATA
    for(var i=0;i<employeeProj.length;i++)
    {
        tr=createHtmlElement('tr',null,null,null);
        for(var prop in employeeProj[i])
        {
            if(employeeProj[i].hasOwnProperty(prop))
            {
                td=createHtmlElement('td',null,null,null);
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
    console.log('CURRENT EMPL DATA: ');
    console.log(currentEmployeeData);
    
    var dataDiv=getEmplDefModal();
    var form=dataDiv.childNodes[1].childNodes[1];
    form.name='uEmployeeSpec';
    form.id='uEmployeeSpec';
    createHiddenInpRowEmployeeRowContent(form.childNodes[1],currentEmployeeData['ID'])
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
    var div1Sm2=createHtmlElement('div',divSm2Atr,null,null);
    var divSm8Atr=new Array(
	Array('class','col-sm-8')
	);
    var div1Sm8=createHtmlElement('div',divSm8Atr,null,null);
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
    form.id=task;
   
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
        labelElement=createHtmlElement('label',labelAttribute,null,null);
        div1Element=createHtmlElement('div',div1,null,null);
        labelElement.innerText=employeeFields[i][1];
        switch(employeeFields[i][0])
        {
            case 'hidden':
                console.log('HIDDEN');
                inputAttribute[0][1]='hidden'; 
                inputAttribute[4][1]=currentEmployeeData[0].ID;
                inputElement=createHtmlElement('input',inputAttribute,null,inputStyle);
                div1Element.appendChild(inputElement);
                break;
            case 't':
                inputAttribute[4][1]=assignProjectDataToField(employeeFields[i][2]);
                inputElement=createHtmlElement('input',inputAttribute,null,inputStyle);
                divErrAtr[1][1]='errDiv-'+employeeFields[i][2];
                divErr=createHtmlElement('div',divErrAtr,null,divErrStyle);
                inputElement.onblur=function()
                {
                    
                    parseFieldValue(this,null,null);
                    checkIsErr(this);
                    
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
        labelElement=createHtmlElement('label',labelAttribute,null,null);
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
                divErr=createHtmlElement('div',divErrAtr,null,divErrStyle);
                inputElement.onblur=function()
                {
                    parseFieldValue(this,null,null);
                    checkIsErr(document.getElementById('sendDataBtn'));
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
        case 'email':
            valueToReturn=currentEmployeeData[0].Email;
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
    console.log(mainTemplate);
    return(mainTemplate);
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
    var divOverAll=createHtmlElement('div',divOverAllAtr,null,null);
    for(var i = 0; i < data.length; i++)
    {    
        
        //console.log(data[i].ID+' '+data[i].NAZWA+' '+data[i].DEFAULT);
        divR=createHtmlElement('div',divRAtr,null);
        labelAtr[1][1]='cbox-'+data[i].ID;
        label=createHtmlElement('label',labelAtr,null,null);
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
        cbox=createHtmlElement('input',cboxAtr,null,null);
        cbox.onclick=function(){ changeBoxValue(this); };
        divR.appendChild(cbox);
        divR.appendChild(label);
        divOverAll.appendChild(divR);
    };
    console.log(divOverAll);
    return(divOverAll);
}
function createBodyButtonContent(task)
{
    console.log('---createBodyButtonContent()---');
    // GROUP DIV BUTTON
    var divButtonAttribute=new Array(
                Array('class','btn-group pull-right')
                );
    var divButtonElement=createHtmlElement('div',divButtonAttribute,null,null);
    // END GROUP DIV BUTTON
    // CANCEL BUTTON
    var cancelButtonAtr=new Array(
                Array('class','btn btn-dark pull-right')
                );
    var cancelButton=createHtmlElement('button',cancelButtonAtr,null,null);
    cancelButton.innerText = "Anuluj";
    cancelButton.onclick = function() { closeModal('ProjectAdaptedModal'); };
    // ADD BUTTON
    var confirmButtonAtr = new Array(
            Array('class','btn btn-info btn-add'),
            Array('id','sendDataBtn') 
            );
    var confirmButton='';
    //console.log(document.getElementById(task));
    switch(task)
    {
        case 'cEmployee':
            confirmButton=createHtmlElement('button',confirmButtonAtr,null,null);
            confirmButton.innerText = "Dodaj";
            confirmButton.onclick = function() { postDataToUrl(this,task); };
            divButtonElement.appendChild(cancelButton);
            divButtonElement.appendChild(confirmButton);
            break;
        case 'dEmployee':
            confirmButtonAtr[0][1]='btn btn-danger';
            confirmButton=createHtmlElement('button',confirmButtonAtr,null,null);
            confirmButton.innerText = 'Usuń';
            confirmButton.onclick = function() { postDataToUrl(this,task); };
            divButtonElement.appendChild(cancelButton);
            divButtonElement.appendChild(confirmButton);
            break;
        case 'projects':
            cancelButton.innerText = "Zamknij";
            divButtonElement.appendChild(cancelButton);
            break;
        case 'allocation':
            confirmButtonAtr[0][1]='btn btn-info';
            confirmButton=createHtmlElement('button',confirmButtonAtr,null,null);
            confirmButton.innerText = 'Edytuj';
            confirmButton.onclick = function()
            {
                removeHtmlChilds(document.getElementById('ProjectAdaptedDynamicData'));
                removeHtmlChilds(document.getElementById('ProjectAdaptedButtonsBottom'));
                setAlloacationEmployeeBodyContent('uEmployeeSpec',1); 
            };
            divButtonElement.appendChild(cancelButton);
            divButtonElement.appendChild(confirmButton);
            break;
        case 'details':
            confirmButtonAtr[0][1]='btn btn-info';
            confirmButton=createHtmlElement('button',confirmButtonAtr,null,null);
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
        case 'uEmployeeSpec':
            confirmButtonAtr[0][1]='btn btn-info';
            confirmButton=createHtmlElement('button',confirmButtonAtr,null,null);
            confirmButton.innerText = 'Zatwierdź';
            confirmButton.onclick = function() { postDataToUrl(this,task); };
            divButtonElement.appendChild(cancelButton);
            divButtonElement.appendChild(confirmButton);
            break;
        default:
            alert('[createBodyButtonContent()]ERROR - wrong task');
            break;
    };
    
    return(divButtonElement);
}
function postDataToUrl(btn,nameOfForm)
{
    console.log('---postDataToUrl()---');
    console.log(btn);
    console.log(nameOfForm);
    var confirmTask=false;

    switch(nameOfForm)
    {
        case 'cEmployee':
        case 'editEmployee':    
            parseFieldValue( document.getElementById('imie').value,"imie","errDiv-imie");
            parseFieldValue( document.getElementById('nazwisko').value,"nazwisko","errDiv-nazwisko");
            parseFieldValue( document.getElementById('stanowisko').value,"stanowisko","errDiv-stanowisko");
            parseFieldValue( document.getElementById('email').value,"email","errDiv-email");
            if(checkIsErr(btn))
            {
                console.log("err is true");
                return(0);
            };
            confirmTask=true;
            break;
        case 'dEmployee':
            confirmTask = confirm("Potwierdź usunięcie pracownika");
            break;
        case 'uEmployeeSpec':
            confirmTask=true;
            break;
        default:
            break;
    }; 
    if (confirmTask)
    {
        ajax.sendData(nameOfForm,'POST');
    };
}
function setButtonDisplay(element,perm)
{
    //console.log('---setButtonDisplay()---');
    if(loggedUserPerm.indexOf(perm)===-1)
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
ajax.getData('getEmployees');