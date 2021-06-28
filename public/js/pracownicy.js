console.log(loggedUserPerm);
var ajax = new Ajax();
var error = new Error();
    Error.setDiv('errDiv-Adapted-overall');
    Error.setModal('AdaptedModal');
var overallErr = false;
var currentIdEmployee=0;
var defaultTask='getEmployees';
var currentEmployeeData={
        'ID':'',
        'Imie':'',
        'Nazwisko':'',
        'Stanowisko':'',
        'Email':'',
        'wskU':''
     };
//var loggedUserPerm=new Array();
var errInputValue= new Array();
var employeeTab=new Array();
var employeeSloSPecTab=new Array();
var employeeFields=new Array(
        new Array('hidden','','ID'),
        new Array('t','Imię:','Imie'),
        new Array('t','Nazwisko:','Nazwisko'),
        new Array('t','Stanowisko:','Stanowisko'),
        new Array('t','Email:','Email'),
        new Array('c-przydzial','Przydział:','Przydzial')
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
function runFunction(d)
{
    console.log('===runFunction()===\n'+d['data']['function']);
    overallErr=Error.checkStatusExist(d['status']);
    if(overallErr) { return ''; };
    switch(d['data']['function'])
    {
        case 'sEmployees':
                setButtonDisplay(document.getElementById('addNewEmployeeButton'),'ADD_EMPL');
                setAllEmployees(d['data']['value']);
                Error.checkStatusResponse(d);
            break;
        case 'cEmployee':            
                cEmployee(d);
            break;
        case 'cModal':
                cModal('getEmployees',d);
                break;
        case 'eEmployee':
                clearAdaptedModalData();
                eEmployee(d);
            break;
        case 'dEmployee':
                dEmployee(d);
                break;
        case 'eEmployeeSpec':
                eEmployeeSpec(d);
                break;
        case 'projects':
                eEmployeeProject(d);  
                break;
        default:
                alert('runFunction() ERROR - wrong function');
            break;
    }
}
function cEmployee(d)
{
    console.log('cEmployee');
    clearAdaptedModalData();
     /* 
      * [].ID
      * [].NAZWA
      * [].DEFAULT
    */
    employeeSloSpecTab=d['data']['value'];
    prepareModal('DODAJ PRACOWNIKA:','bg-info');
    setEmployeeBodyContent(d['data']['function'],1,'Dodaj');
    addLegendDiv();
    /*
     * PARSE RESPONSE
     */ 
    Error.checkStatusResponse(d);
}
function eEmployee(d)
{
    console.log('eEmployee');
    clearAdaptedModalData();
     /* 
      * [].ID
      * [].NAZWA
      * [].DEFAULT
    */
    currentEmployeeData=d['data']['value'][0];
    employeeSloSpecTab=d['data']['value'][1];
    prepareModal('DANE PRACOWNIKA:','bg-info');
    setEmployeeBodyContent(d['data']['function'],0,'Edytuj');
    addLegendDiv();
    /*
     * PARSE RESPONSE
     */ 
    Error.checkStatusResponse(d);
}
function eEmployeeSpec(d)
{
    console.log('eEmployeeSpec');
    clearAdaptedModalData();
    currentEmployeeData=d['data']['value'][0];
    employeeSloSpecTab=d['data']['value'][1];
    // ALL SLO SPEC
    prepareModal('PRZYDZIAŁ PRACOWNIKA:','bg-info');
    setAlloacationEmployeeBodyContent(d['data']['function'],0,'Edytuj');
}
function eEmployeeProject(d)
{
    clearAdaptedModalData();
    prepareModal('PROJEKTY:','bg-warning');
    setEmployeeProjectBodyContent(d['data']['function'],d['data']['value'][1],d['data']['value'][0]);
}
function dEmployee(d)
{
    console.log('dEmployee\nRESPONSE:');
    clearAdaptedModalData();
    console.log(d);
    console.log(document.getElementById('AdaptedModal'));
    prepareModal('USUŃ PRACOWNIKA:','bg-danger','Usuń');
    setDeleteEmployeeBodyContent(d);
    Error.checkStatusResponse(d);
    
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

    var btnConfig=new Array(
            new Array('btn-info','getEmployeeDetails&id=','Dane','SHOW_EMPL'),
            new Array('btn-info','getEmployeeSpec&id=','Przydział','SHOW_ALLOC_EMPL'),
            new Array('btn-warning','getEmployeeProjects&id=','Projekty','SHOW_PROJ_EMPL'),
            new Array('btn-danger','getDeletedEmployeeProjects&id=','Usuń','DEL_EMPL')
         );

    var tr='';
    var td='';
    var tdOption='';
    var disabled='no-disabled';
    for(var i = 0; i < dataL; i++)
    {    
        tr=createTag('','tr','');
        for(var prop in data[i])
        {
            if(data[i].hasOwnProperty(prop))
            {
                td=createTag('','td','');
                td.innerText=data[i][prop];
                tr.appendChild(td);
            }
        }
        var divBtnGroup=createTag('','div','btn-group pull-left'); 
        for(var z=0;z<btnConfig.length;z++)
        {
            var btn=createTag('','button','btn '+btnConfig[z][0]+' '+disabled); 
                       
            if(loggedUserPerm.indexOf(btnConfig[z][3])===-1)
            {
                btn.setAttribute('disabled','disabled');
            }
            else
            {
                btn.setAttribute('name',btnConfig[z][1]+data[i].ID);
                btn.setAttribute('id',data[i].ID);
                btn.setAttribute('data-toggle',"modal");
                btn.setAttribute('data-target','#AdaptedModal');
            }
            

            btn.innerText=btnConfig[z][2];
            btn.onclick=function(){
                ajax.getData(this.name);
            }; 
            divBtnGroup.appendChild(btn);
        }
        tdOption=createTag('','td','');
        tdOption.appendChild(divBtnGroup);
        tr.appendChild(tdOption);
        docElement.appendChild(tr);
    };
}
function setEmployeeProjectBodyContent(task,employeeProj)
{
    console.log('---setEmployeeProjectBodyContent()---');
    var mainDiv=document.getElementById('AdaptedDynamicData');
    if(employeeProj.length>0)
    {
        createEmployeeProjectsRowContent(mainDiv,employeeProj,genTextNode(task));
    }
    else
    {
        // NO PROJECT
        mainDiv.appendChild(genTextNode('noprojects'));
    }
    document.getElementById('AdaptedButtonsBottom').appendChild(functionBtn('cancel',createBtn('Zamknij','btn btn-dark','cancelBtn'),''));
    console.log(mainDiv);
}
function setDeleteEmployeeBodyContent(d)
{
    /*
     * d => data 
     */
    console.log('---setDeleteEmployeeBodyContent()---');
    console.log(d);
    var form=createForm('POST',d['data']['function'],'form-horizontal','OFF');
    document.getElementById('AdaptedButtonsBottom').appendChild(functionBtn('cancel',createBtn('Anuluj','btn btn-dark','cancelBtn'),''));
    if(d['data']['value'][1].length>0 && d['info']==='')
    {
        console.log('D1');
        createEmployeeProjectsRowContent(form,d['data']['value'][1],genTextNode(d['data']['function']));
    }
    else if(d['data']['value'][1].length>0 && d['info']!=='')
    {
        console.log('D2');
        // SET WARNING
        var divAlert=createTag('','div','w-100');
            divAlert.appendChild(genTextNode('NO'+d['data']['function']));
            form.appendChild(divAlert);
            
    }
    else
    {
        console.log('D3');
        form.appendChild(addHiddenInput('ID',d['data']['value'][0])); 
        document.getElementById('AdaptedButtonsBottom').appendChild(functionBtn(d['data']['function'],createBtn("Usuń",'btn btn-danger','sendDataBtn'),d['data']['function']));
    } 
    document.getElementById('AdaptedDynamicData').appendChild(form);
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
    
    var h=createHtmlElement(tag,hAtr,null,null);createTag('','h4','text-danger mb-3 text-center font-weight-bold');
    h.innerText=info;
    return(h);
}
function createEmployeeProjectsRowContent(whereAppend,employeeProj,titleElement)
{
    console.log('---createDeleteEmployeeRowContent()---');
    console.log(whereAppend);
    var dataL=employeeProj.length;
    
    console.log('DATA LENGTH: '+dataL);
   
    // SET WARNING
    var divAlert=createTag('','div','w-100');
    
        divAlert.appendChild(titleElement);
        whereAppend.appendChild(divAlert);
    var table=createTag('','table','table table-striped table-condensed');
    var tr=createTag('','tr','');

    // GET HEADER 
    for(var prop in employeeProj[0])
        {
            if(employeeProj[0].hasOwnProperty(prop))
            {
                var td=createTag('','td','');
                prop=prop.replace("_", " ");
                td.innerText=prop;
                tr.appendChild(td);
            }
        }
    table.appendChild(tr);   
    // GET DATA
    for(var i=0;i<employeeProj.length;i++)
    {
        var tr=createTag('','tr','');
        for(var prop in employeeProj[i])
        {
            if(employeeProj[i].hasOwnProperty(prop))
            {
                var td=createTag('','td','');
                td.innerText=employeeProj[i][prop];
                tr.appendChild(td);
            }
        }
        table.appendChild(tr);
    };
    whereAppend.appendChild(table);
}
function setAlloacationEmployeeBodyContent(task,status,label)
{
    console.log('---setAlloacationEmployeeBodyContent()---');
    console.log('CURRENT EMPL DATA: ');
    console.log(currentEmployeeData);
    var form=createForm('POST',task,'form-horizontal','OFF');
    /*
     * status:
     * 0 - BLOCKED WITH DATA
     * 1 - UNBLOCK
     */
    form.appendChild(addHiddenInput('ID',currentEmployeeData['ID'])); 
    setAlloacationEmployeeContent(form,status);
    document.getElementById('AdaptedButtonsBottom').appendChild(functionBtn('cancel',createBtn('Anuluj','btn btn-dark','cancelBtn'),''));
    document.getElementById('AdaptedButtonsBottom').appendChild(functionBtn(task,createBtn(label,'btn btn-info','sendDataBtn'),task));
    console.log(form);
    document.getElementById('AdaptedDynamicData').appendChild(form);
    
}
function setAlloacationEmployeeContent(whereAppend,status)
{
    console.log('---setAlloacationEmployeeContent()---');
    var div1Sm2=createTag('','div','col-sm-2');
    var div1Sm8=createTag('','div','col-sm-8');
    div1Sm8.appendChild(createCheckBoxList(employeeSloSpecTab,status));
    whereAppend.appendChild(div1Sm2);
    whereAppend.appendChild(div1Sm8);
}
function setEmployeeBodyContent(task,status,label)
{
    console.log('---setEmployeeBodyContent()---');
    var form=createForm('POST',task,'form-horizontal','OFF');
    /*
     * status:
     * 0 - BLOCKED WITH DATA
     * 1 - UNBLOCK
     */
    createEmployeeRowContent(form,status);
    document.getElementById('AdaptedButtonsBottom').appendChild(functionBtn('cancel',createBtn('Anuluj','btn btn-dark','cancelBtn'),''));
    document.getElementById('AdaptedButtonsBottom').appendChild(functionBtn(task,createBtn(label,'btn btn-info','sendDataBtn'),task));
    console.log(form);
    document.getElementById('AdaptedDynamicData').appendChild(form);

}
function addLegendDiv()
{
    var legendDiv=document.getElementById('legendDiv').cloneNode(true);
    legendDiv.classList.remove("modal");
    legendDiv.classList.remove("fade");
    document.getElementById('AdaptedBodyExtra').appendChild(legendDiv);
}
function createEmployeeRowContent(whereAppend,status)
{
    console.log('---createEmployeeRowContent()---\nSTATUS : '+status);
    console.log(whereAppend);
    console.log(currentEmployeeData);
    // currentEmployeeData -> EMPLOYEE DATA
    // employeeSloSpecTab -> EMPLOYEE SLO
    setInputMode(status);
    var divRowClass=new Array('row');
    var labelAttribute=new Array(
	Array('for','inputEmployee'),
	Array('class','col-sm-2 control-label text-right font-weight-bold')
	);
    var div1=new Array(
	Array('class','col-sm-10')
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
                inputAttribute[4][1]=assignDataToField(currentEmployeeData,employeeFields[i][2]);
                inputElement=createHtmlElement('input',inputAttribute,null,inputStyle);
                div1Element.appendChild(inputElement);
                break;
            case 't':
                inputAttribute[4][1]=assignDataToField(currentEmployeeData,employeeFields[i][2]);
                inputElement=createHtmlElement('input',inputAttribute,null,inputStyle);
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
                div1Element.appendChild(createCheckBoxList(employeeSloSpecTab,status));
                break;
            default:
                break;
        };
        var divRow=createHtmlElement('div',null,divRowClass,null);
        divRow.appendChild(labelElement);
        divRow.appendChild(div1Element);
        whereAppend.appendChild(divRow);
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
function postData(btn,nameOfForm)
{
    console.log('---postData()---');
    console.log(btn);
    console.log(nameOfForm);
    var confirmTask=false;

    switch(nameOfForm)
    {
        case 'cEmployee':
        case 'eEmployeeOn':    
            parseFieldValue( document.getElementById('Imie').value,"Imie","errDiv-Imie");
            parseFieldValue( document.getElementById('Nazwisko').value,"Nazwisko","errDiv-Nazwisko");
            parseFieldValue( document.getElementById('Stanowisko').value,"Stanowisko","errDiv-Stanowisko");
            parseFieldValue( document.getElementById('Email').value,"Email","errDiv-Email");
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
        case 'eEmployeeSpecOn':
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
function functionBtn(f,btn,task)
{
    console.log(f);
    switch(f)
    {
        case 'eEmployeeSpec':
                btn.onclick = function() { 
                    removeHtmlChilds(document.getElementById('AdaptedDynamicData'));
                    removeHtmlChilds(document.getElementById('AdaptedButtonsBottom'));
                    setAlloacationEmployeeBodyContent('eEmployeeSpecOn',1,'Zatwierdź');
                }
            break;
        case 'eEmployee':
                btn.onclick = function() { 
                    removeHtmlChilds(document.getElementById('AdaptedDynamicData'));
                    removeHtmlChilds(document.getElementById('AdaptedButtonsBottom'));
                    setEmployeeBodyContent('eEmployeeOn',2,'Zatwierdź','btn-info'); 
                }
            break
        case 'cancel':
                btn.onclick = function() { closeModal('AdaptedModal'); };
            break;
        default:
                btn.onclick = function() { postData(this,task); };
            break;
    }
    return btn;
}
ajax.getData(defaultTask);