var ajax = new Ajax();
var error = new Error();
    //MyError.setDiv('errDiv-Adapted-overall');
var Report = new ProjectReport();
    Report.setAjax(ajax);
var table=new Table();
    table.setAjaxLink(ajax);
    table.setErrorLink(error,'errDiv-Adapted-overall');
var defaultTask='getprojectslike';
var fieldDisabled='y';
var projectData=new Object();
var actDay = getActDate();
var actProject=new Object();
var loggedUserPerm=new Array();
/* 
 * TURN OFF 
 * setButtonDisplay(document.getElementById('pCreate'),'ADD_PROJ');
 * */

console.log(loggedUserPerm);

const mainTableColumns={
    ID:{
        style:'width:70px;',
        scope:'col'
    },
    Numer:{
        style:'',
        scope:'col'
    },
    Klient:{
        style:'',
        scope:'col'
    },
    Temat:{
        style:'',
        scope:'col'
    },
    Typ:{
        style:'',
        scope:'col'
    },
    "Data utworzenia":{
        style:'',
        scope:'col'
    },
    Lider:{
        style:'',
        scope:'col'
    },
    Manager:{
        style:'',
        scope:'col'
    },
    "Start Projektu":{
        style:'',
        scope:'col'
    },
    "Koniec Projektu":{
        style:'',
        scope:'col'
    },
    "Status":{
        style:'',
        scope:'col'
    },
    "":{
        style:'width:200px;',
        scope:'col'
    }
};
/* OBJECT ELEMENT IS A NAME OF PERMISSION */
var defaultTableBtnConfig=
        {
        SHOW_PROJ : {
            label : 'Szczegóły',
            task : 'pDetails',
            class : 'text-info',
            perm :true,
            attributes : { 'data-toggle' : 'modal', 'data-target': '#AdaptedModal' }
        },
        SHOW_DOK_PROJ : {
            label : 'Dokumenty',
            task : 'pDoc',
            class : 'text-info',
            perm :true,
            attributes : { 'data-toggle' : 'modal', 'data-target': '#AdaptedModal' }
        },
        SHOW_TEAM_PROJ : {
            label : 'Zespół',
            task : 'getProjectTeam',
            class : 'text-warning',
            perm :true,
            attributes : { 'data-toggle' : 'modal', 'data-target': '#AdaptedModal' }
        },
        EMAIL_PROJ : {
            label : 'Email',
            task : 'getProjectEmailData',
            class : 'text-info',
            perm :true,
            attributes : { 'data-toggle' : 'modal', 'data-target': '#AdaptedModal' }
        },
        /* TURN OFF - WAIT FOR NEW VERSION */
        GEN_RAPORT_PROJ : {
            label : 'Raport',
            task : 'getProjectReportData',
            class : 'text-primary',
            perm :true,
            attributes : { 'data-toggle' : 'modal', 'data-target': '#AdaptedModal' }
        },
    
        GEN_PDF_PROJ : {
            label : 'PDF',
            task : 'pPDF',
            class : 'text-danger',
            perm :true,
            attributes : { }
        },
        GEN_DOC_PROJ : {
            label : 'DOC',
            task : 'pGenDoc',
            class : 'text-primary',
            perm :true,
            attributes : { }
        },
        CLOSE_PROJ : {
            label : 'Zamknij',
            task : 'getProjectCloseSlo',
            class : 'text-secondary',
            perm :true,
            attributes : { 'data-toggle' : 'modal', 'data-target': '#AdaptedModal' }
        },
        DEL_PROJ : {
            label : 'Usuń',
            task : 'getProjectDeleteSlo',
            class : 'text-danger',
            perm :true,
            attributes : { 'data-toggle' : 'modal', 'data-target': '#AdaptedModal' }
        }
    };
var defaultTableExceptionCol=new Array();

setButtonAvaliable();  
table.setIdFiled('i');
table.setButtons(defaultTableBtnConfig);
table.setColumns(mainTableColumns);
table.setColExceptions(defaultTableExceptionCol);
table.setButtonsType('dropdown');

function runFunction(response)
{
    console.log('runFunction()');
    try{
        var dJson=JSON.parse(response);
            error.checkStatusExist(dJson);
            projectData=dJson; 
    }
    catch(e){
        console.log(e);
        return false;
    }
    try{
        console.log('FUNCTION TO RUN:\n'+dJson['data']['function']);
        switch(dJson['data']['function'])
        {
            case 'pCreate':
                    fieldDisabled='n';
                    projectManage('Dodaj','DODAJ PROJEKT:','info');
                break;
            case 'pDetails':
                    //pDetails(d,'Edytuj');
                    actProject=dJson['data']['value']['project'];
                    fieldDisabled='y';
                    /* INFO */
                    document.getElementById('AdaptedModalInfo').appendChild(createTag("Project ID: "+actProject.i+", Create user: "+actProject.cu+" ("+actProject.cum+"), Create date: "+actProject.du,'small','text-left text-secondary ml-1'));
                    projectManage('Edytuj','SZCZEGÓŁY PROJEKTU:','info');
                break;
            case 'pDoc':
                    actProject=dJson['data']['value']['project'];
                    fieldDisabled='y';
                    projectDocManage('Edytuj','DOKUMENTY PROJEKTU:','info');
                    break;
            case 'cModal':
                    reloadData();
                break;
            case 'pEmail':
                    pEmail();
                break;
            case 'pClose':
                    projectRemove('Zamknij','ZAMKNIJ PROJEKT:','secondary');
                break;
            case 'pDelete':
                    projectRemove('Usuń','USUŃ PROJEKT:','danger');
                break;
            case 'downloadProjectPdf':
            case 'downloadProjectDoc':
            case 'downloadProjectReportDoc':
                    console.log(dJson['data']['value']);
                    var win = window.open('router.php?task='+dJson['data']['function']+'&file='+dJson['data']['value'], '_blank');
                    win.focus();
                break;
            case 'pTeamOff':
                    actProject=dJson['data']['value']['project'];
                    pTeam(false);
                    break;
            case 'pTeam':
                    clearAdaptedModalData();
                    setAvaTeam();
                    pTeam(true);
                    break;
            case 'showReportPreview':
                    console.log(dJson);
                    Report.showReportPreview(dJson['data']['value']);
                    break;
            case 'pReportOff':
                    Report.setData(dJson,loggedUserPerm);
                    Report.setErrorStack(new ErrorStack());
                    Report.create();
                    break;
            case 'runMain':
                    loggedUserPerm=dJson['data']['value']['perm'];
                    setButtonDisplay(document.getElementById('createData'),'ADD_PROJ');
            case 'sAll':
                    displayAll(dJson);
                break;
            default:
                    console.log('DEFAULT');
                    console.log(response);
                    dJson['status']=1;
                    if(dJson['info']===''){
                        dJson['info']='Wrong function to run '+dJson['data']['function'];
                    };
                    error.checkStatusResponse(dJson);
                break;
        }
    }
    catch(e){
        console.log(dJson);
        console.log(e);
        dJson['status']=1;
        dJson['info']=e;
        error.checkStatusResponse(dJson);
    }
}
function pEmail()
{
    prepareModal('RĘCZNE WYSŁANIE POWIADOMIENIA EMAIL:','bg-info');
    //console.log(projectData['data']['value']['email'][0].Pracownik);
    var form=createForm('POST',projectData['data']['function'],'form-horizontal','OFF');
    var add=document.getElementById('AdaptedDynamicData');
    /* TITLE */
    add.appendChild(createTag(projectData['data']['value']['project'].t,'h5','text-info mb-3 text-center font-weight-bold'));
    add.appendChild(createTitle('Wykaz pracowników powiązanych z projektem:'));
    /* SET DATA */
    var colTitle=new Array('Pracownik','Email');
    var tBody=document.createElement("tbody");
   
    for(var i=0;i<projectData['data']['value']['email'].length;i++)
    {
        var divInp=createTag('','div','input-group');
        var tr=document.createElement("tr");
        var td=document.createElement("td");
            td.appendChild(document.createTextNode(projectData['data']['value']['email'][i].Pracownik));
         
        var td2=document.createElement("td");
            divInp.appendChild(createInput('text','e'+i,projectData['data']['value']['email'][i].Email,'form-control',''));  
            divInp.appendChild(functionBtn('rmEmail',createRemoveButton('r'+i,'n')),'');
            td2.appendChild(divInp);
         
            tr.appendChild(td);
            tr.appendChild(td2);
        
            tBody.appendChild(tr);
    };
   
    form.appendChild(createInput('hidden','id',projectData['data']['value']['id'],'',''));
    form.appendChild(createTable(colTitle,tBody));

    add.appendChild(form);
    console.log(add);
    /* BUTTONS */
    document.getElementById('AdaptedButtonsBottom').appendChild(functionBtn('cancel',createBtn('Anuluj','btn btn-dark','cancelBtn'),''));
    document.getElementById('AdaptedButtonsBottom').appendChild(functionBtn(projectData['data']['function'],createBtn('Wyślij','btn btn-info','confirmData'),projectData['data']['function']));//projectData['data']['function']
    /* INFO */
    document.getElementById('AdaptedModalInfo').appendChild(createTag("Project ID: "+projectData['data']['value']['project'].i+", Create user: "+projectData['data']['value']['project'].cu+" ("+projectData['data']['value']['project'].cum+"), Create date: "+projectData['data']['value']['project'].du,'small','text-left text-secondary ml-1'));
    console.log(document.getElementById('AdaptedButtonsBottom'));
}

function createTitle(text)
{
    /* TITLE */
    return createTag(text,'h5','text-dark mb-3 text-center font-weight-bold');
}
function createTable(colTitle,tBody)
{
    console.log('---createTable()---');
    var table=createTag('','table','table');
    var tHead=document.createElement("thead");
    var tr=document.createElement("tr");
    for(var i=0;i<colTitle.length;i++)
    {
        var th=document.createElement('th');
            th.setAttribute('scope','col');
            th.appendChild(document.createTextNode(colTitle[i]));
            tr.appendChild(th);
    }
    tHead.appendChild(tr);
    table.appendChild(tHead);
    table.appendChild(tBody);
    return table;
}
function projectDocManage(btnLabel,title,titleClass)
{
    prepareModal(title,'bg-'+titleClass);
    var form=createForm('POST',projectData['data']['function'],'form-horizontal','OFF');
    var add=document.getElementById('AdaptedDynamicData');
    add.appendChild(createTag(actProject.t,'h5','text-info mb-3 text-center font-weight-bold'));
    pDocCreateFields(form);
    add.appendChild(form);
    document.getElementById('AdaptedButtonsBottom').appendChild(functionBtn('cancel',createBtn('Anuluj','btn btn-dark','cancelBtn'),''));
    document.getElementById('AdaptedButtonsBottom').appendChild(functionBtn(projectData['data']['function'],createBtn(btnLabel,'btn btn-'+titleClass,projectData['data']['function']),projectData['data']['function']));
    /* INFO */
    document.getElementById('AdaptedModalInfo').appendChild(createTag("Project ID: "+actProject.i+", Create user: "+actProject.cu+" ("+actProject.cum+"), Create date: "+actProject.du,'small','text-left text-secondary ml-1'));
}
function projectRemove(btnLabel,title,titleClass)
{
     /*
        * SLOWNIKI:
        * data[0] = ID
        * data[1] = SLO
    */
    prepareModal(title,'bg-'+titleClass);
    var form=createForm('POST',projectData['data']['function'],'form-horizontal','OFF');
    var add=document.getElementById('AdaptedDynamicData'); 
    projectRemoveFields(form);
    add.appendChild(createTag(projectData['data']['value']['project'].t,'h5','text-'+titleClass+' mb-3 text-center font-weight-bold'));
    add.appendChild(form);
    document.getElementById('AdaptedButtonsBottom').appendChild(functionBtn('cancel',createBtn('Anuluj','btn btn-dark','cancelBtn'),''));
    document.getElementById('AdaptedButtonsBottom').appendChild(functionBtn(projectData['data']['function'],createBtn(btnLabel,'btn btn-'+titleClass,projectData['data']['function']),projectData['data']['function']));
    /* INFO */
    document.getElementById('AdaptedModalInfo').appendChild(createTag("Project ID: "+projectData['data']['value']['project'].i+", Create user: "+projectData['data']['value']['project'].cu+" ("+projectData['data']['value']['project'].cum+"), Create date: "+projectData['data']['value']['project'].du,'small','text-left text-secondary ml-1'));
}
function projectRemoveFields(ele)
{ 
    console.log('---projectRemoveFields()---');
    ele.appendChild(createInput('hidden','id',projectData['data']['value']['id'],'','','n'));
    var p=createTag('Podaj Powód: ','p','text-left');
    var inp=createInput('text','extra','','form-control mb-1','Wprowadź powód','n');
        inp.style.display = "none";
    projectData['data']['value']['slo'].push({
                                                'ID' : "0",
                                                'Nazwa' : 'Inny:'
                                            });
    var select=createSelectFromObject(projectData['data']['value']['slo'],'Nazwa','reason','form-control mb-1');
        select.onchange = function() { checkReason(this,'extra'); };
    ele.appendChild(p); 
    ele.appendChild(select); 
    ele.appendChild(inp); 
    return '';
}
function checkReason(t,id)
{
    console.log('---checkReason()---');
    var splitValue=t.value.split("|");
    if(splitValue[0]==='0')
    {
        document.getElementById(id).style.display = "block";
    }
    else
    {
         document.getElementById(id).style.display = "none";
    };
}
function projectManage(btnLabel,title,titleClass)
{
    console.log('===projectManage()===');
    //MyError.checkStatusResponse(projectData);
    //console.log(projectData);
    /*
        * SLOWNIKI:
        * data[rodzaj_umowy] = UMOWY
        * data[] = LIDER
        * data[] = KIEROWNIK
        * data[] = DODATKOWE DOKUMENTY 
        * data[] = GLOWNY TECHNOLOG
        * data[] = KIEROWNIK OSRODKA
        * data[] = SLOWNIK TYP UMOWY
        * data[] = SLOWNIK TYP SYSTEMU
        * data[] = SLOWNIK JEDNOSTKA MIARY PLIKU BAZOWEGO
        * data[] = PARAMETRY
    */
    prepareModal(title,'bg-'+titleClass);
    error.set('errDiv-Adapted-overall');
    checkResponseFunction(projectData);
    var form=createForm('POST',projectData['data']['function'],'form-horizontal','OFF');
    var add=document.getElementById('AdaptedDynamicData'); 
    pCreateFields(form);
    add.appendChild(form);
    console.log(add);
    document.getElementById('AdaptedButtonsBottom').appendChild(functionBtn('cancel',createBtn('Anuluj','btn btn-dark','cancelBtn'),''));
    document.getElementById('AdaptedButtonsBottom').appendChild(functionBtn(projectData['data']['function'],createBtn(btnLabel,'btn btn-'+titleClass,'confirmData'),projectData['data']['function']));//projectData['data']['function']
}
function pDocCreateFields(ele)
{
    console.log('---pDocCreateFields()---\n');
    var pFields={
        'ID' : {
            'label' : '',
            'input' : createProjectInput('hidden',projectData['data']['value']['id'],'id')
        },
        'dokPowiazane' : {
            'label' : 'Wykaz powiązanych dokumentów:',
            'input' : createDocList(projectData['data']['value']['dokPowiazane'])
        }
    };
    createProjectRow(ele,pFields);
}
function pCreateFields(ele)
{
    console.log('---pCreateFields()---\n');  
    var pFields={
        'ID' : {
            'label' : '',
            'input' : createProjectInput('hidden',projectData['data']['value']['id'],'id')
        },
        'rodzaj_umowy' : { 
            'label': "Do realizacji :",
            'input' : createSelectFromObject(projectData['data']['value']['rodzaj_umowy'],'Nazwa','rodzaj_umowy','form-control mb-1')
        },
        'numer_umowy' : {
            'label' : 'Numer :',
            'input' : createProjectInput('text',projectData['data']['value']['numer_umowy'],'numer_umowy')
        },
        'klient' : {
            'label' : 'Klient :',
            'input' : createProjectInput('text',projectData['data']['value']['klient'],'klient')
        },
        'temat_umowy' : {
            'label' : 'Temat :',
            'input' :  createProjectInput('text',projectData['data']['value']['temat_umowy'],'temat_umowy')
        },
        'typ_umowy' : {
            'label' : 'Typ :',
            'input' : createSelectFromObject(projectData['data']['value']['typ_umowy'],'Nazwa','typ_umowy','form-control mb-1')
        },
        'system_umowy' : {
            'label':'System :',
            'input' : createSelectFromObject(projectData['data']['value']['system_umowy'],'Nazwa','system_umowy','form-control mb-1')
        },
        'nadzor' : {
            'label' : 'Do kierowania grupą (Lider) powołuje :',
            'input' : createSelectFromObject(projectData['data']['value']['nadzor'],'ImieNazwisko','nadzor','form-control mb-1')
        },
        'term_realizacji' : {
            'label' : 'Start projektu :', 
            'input' : createDatePicker('d-term_realizacji',projectData['data']['value']['term_realizacji'],fieldDisabled)
        },
        'harm_data' : {
            'label' : 'Kierującego zobowiązuję do przedstawienia harmonogramu prac do dnia:',
            'input' : createDatePicker('d-harm_data',projectData['data']['value']['harm_data'],fieldDisabled)
        },
        'koniec_proj' : {
            'label' : 'Kierującego zobowiązuję do zakończenia prac i napisania raportu z realizacji zadania do dnia:',
            'input' : createDatePicker('d-koniec_proj',projectData['data']['value']['harm_data'],fieldDisabled)
        },
        'kier_grupy' : {
                'label' : "Nadzór nad realizacją (Manager) powierzam:",
                'input' : createSelectFromObject(projectData['data']['value']['kier_grupy'],'ImieNazwisko','kier_grupy','form-control mb-1')
        },
        'gl_tech' : {
            'label' : 'Główny technolog:',
            'input' : createSelectFromObject(projectData['data']['value']['gl_tech'],'ImieNazwisko','gl_tech','form-control mb-1')
        },
        'gl_kier' : {
            'label' : 'Kierownik Ośrodka:',
            'input' : createSelectFromObject(projectData['data']['value']['gl_kier'],'ImieNazwisko','gl_kier','form-control mb-1')
        },
        'r_dane' : {
            'label' : 'Rozmiar pliku bazowego:',
            'input' : createBaseFileInput(projectData['data']['value']['unitSlo'],projectData['data']['value']['r_dane'])
        },
        'quota' : {
            'label' : 'Współczynnik quota:',
            'input' : createQuota(projectData['data']['value']['quota'])
        },
        'dokPowiazane' : {
            'label' : 'Wykaz powiązanych dokumentów:',
            'input' : createDocList(projectData['data']['value']['dokPowiazane'])
        }
    };
    createProjectRow(ele,pFields);

    return '';
}
function createProjectRow(ele,pFields)
{
    for (const property in pFields)
    {        
        var l=createTag(pFields[property].label,'label','text-right font-weight-bold col-8 pt-2'); 
        var dCol2=createTag('','div','col-4');
        if(pFields[property].hasOwnProperty('input'))
        {
            setFieldDisabled(fieldDisabled,pFields[property].input);
            dCol2.appendChild(pFields[property].input);
        }     
        var dRow=document.createElement('div');
        dRow.setAttribute('class','row');
        dRow.appendChild(l);
        dRow.appendChild(dCol2);
        ele.appendChild(dRow);  
    }
}
function displayAll(d)
{
    console.log('===displayAll()===');
    console.log(d);
    error.checkStatusResponse(d);
    /* SETUP DEFAULT TABLE COLUMN */
    table.showTable(d['data']['value']['data']);  
}

function createProjectInput(type,value,label)
{
    //console.log('===createProjectInput()===');
    var divAll=document.createElement('div');
    var divErr=createTag('','div','col-auto alert alert-danger mb-1');
        divErr.setAttribute('id','errDiv-'+label);
        divErr.setAttribute('style','display:none;');
    var inp=createInput(type,label,value,'form-control mb-1','',fieldDisabled);
        inp.onblur=function ()
        {
            parseFieldValue(this,null,null);
            checkIsErr(document.getElementById('confirmData'));
        };
    divAll.appendChild(inp);
    divAll.appendChild(divErr);
    //console.log(divAll);
    return divAll;
}
function createQuota(q)
{
    var input=createInput('number','quota',q,'form-control mb-1','',fieldDisabled);
        input.setAttribute('min','1');
        input.onblur=function(){checkNumber(this);};
        return input;
}
function createBaseFileInput(j_dane,r_dane)
{
    console.log('---createBaseFileInput()---');    
    var divG=createTag('','div','input-group');
        divG.setAttribute('no-disabled','');
    /*
     * 
     * SIZE
     */
    var input=createInput('number','r_dane',r_dane,'form-control mb-1 border-right-0','',fieldDisabled);
        input.setAttribute('min','1');
        input.onblur=function(){checkNumber(this);};
    /*
     * UNIT
     */
    var select=createSelectFromArray(j_dane,'j_dane','form-control mb-1');  
        select.setAttribute('style','border-top-left-radius:0%; border-bottom-left-radius:0%; cursor: pointer;');
        setFieldDisabled(fieldDisabled,select);
    var divA=createTag('','div','input-group-addon');
            divA.setAttribute('no-disabled','');
    divA.appendChild(select);
    divG.appendChild(input);
    divG.appendChild(divA);
    //console.log(divG);
    return (divG);
}
function createDocList(data)
{
    /*
     * data => doc list
     */
    //console.log(data);
    var divAll=createTag('','div','col-auto');
    var divBtn=createTag('','div','row');
    var divInput=document.createElement('div'); 
    for(var i = 0; i < data.length; i++)
    //for (const property in data)
    {        
        createDokListField(data[i].Nazwa,i,divInput);
    }
    // ADD BUTTON
    var addBtn=createAddButton('addBtn',fieldDisabled);
        if(fieldDisabled!=='y')
        {
            addBtn.onclick=function()
            {
                i++;
                createDokListField('',i,divInput);
            };
        }
    divBtn.appendChild(addBtn);
    divAll.appendChild(divInput);
    divAll.appendChild(divBtn);
    console.log(divAll);
    return (divAll);
}
function createDokListField(value,i,divAll)
{
    var input=createInput('text','dok-'+i,value,'form-control border-right-0','',fieldDisabled);
    var rmBtn=createRemoveButton('rmBtn-'+i,fieldDisabled);
        if(fieldDisabled!=='y')
        {
            rmBtn.onclick=function()
            {
                removeHtmlChilds(this.parentNode.parentNode);
            };
        };
    var divR=createTag('','div','row');
    var divErr=createTag('','div','row');
    var divG=createTag('','div','input-group ');
        divG.setAttribute('no-disabled','');
        divG.appendChild(input);
        divG.appendChild(rmBtn);
        divR.appendChild(divG);
        divAll.appendChild(divR);
        divAll.appendChild(divErr);
}
function functionBtn(f,btn,task)
{
    console.log('---functionBtn()---');
    console.log(f);
    switch(f)
    {
        case 'rmEmail':
                btn.onclick = function(){ 
                    console.log(this);
                    removeHtmlChilds(this.parentNode.parentNode.parentNode);
                };
                break;
        case 'pDetails' :
                btn.onclick = function()
                { 
                    projectData['data']['function']='pEdit';
                    projectData['data']['task']='pEdit';
                    projectData['status']=0;
                    fieldDisabled='n';
                    clearAdaptedModalData();
                    projectManage('Zatwierdź','EDYCJA PROJEKTU:','warning');   
                };
                break;
        case 'cancel':
                btn.onclick = function()
                {
                   reloadData();
                };
            break;
        case 'pDoc':
                btn.onclick = function()
                { 
                    projectData['data']['function']='pDocEdit';
                    fieldDisabled='n';
                    clearAdaptedModalData();
                    error.set('errDiv-Adapted-overall');
                    projectDocManage('Edytuj','EDYCJA DOKUMENTÓW PROJEKTU:','info');
                };
            break;
             
        case 'pTeam':
        case 'pTeamOff':
        case 'pDelete':
        case 'pClose':
        case 'pEmail':
        case 'pDocEdit':
        case 'pEdit':
        case 'pCreate':
            btn.onclick = function() { 
                console.log('onClick');
                console.log(this); 
                console.log(task); 
                postData(this,task);
            };
            break;
        default:
                
            break;
    }
    return btn;
}
function postData(btn,nameOfForm)
{
    console.log('---postData()---');
    //console.log(nameOfForm);
    var err=false;
    switch(nameOfForm)
    {
        case 'pCreate':
            parseFieldValue( document.getElementById('temat_umowy').value,"temat_umowy","errDiv-temat_umowy");
            parseFieldValue( document.getElementById('numer_umowy').value,"numer_umowy","errDiv-numer_umowy");
            parseFieldValue( document.getElementById('klient').value,"klient","errDiv-klient");
            err=checkIsErr(btn);
            break;
        default:
            break;
    }; 
    if (!err)
    {
        ajax.sendData(nameOfForm,'POST');
    };   
}
function newProject()
{
    actProject.i='n/a';
    actProject.du='n/a';
    actProject.cu='n/a';
    actProject.cum='n/a';
    clearAdaptedModalData();
    ajax.getData('getProjectDefaultValues');
}
function setButtonAvaliable()
{
    console.log('setButtonAvaliable()');
    for (const property in defaultTableBtnConfig)
    {     
        
        //console.log(property);
        //console.log(loggedUserPerm.includes(property));
        if(loggedUserPerm.includes(property))
        {
            /* NOTHNG TO DO */
            //console.log(defaultTableBtnConfig[property]);
        }
        else
        {
            //defaultTableBtnConfig[property].perm=false;
            //defaultTableBtnConfig[property].class=defaultTableBtnConfig[property]['class']+" disabled";
            //defaultTableBtnConfig[property]['attributes'].disabled="disabled";
        }
    }
}
function search(value){
    ajax.getData(defaultTask+'&filter='+value);
}
function loadData(){
    console.log('---loadData()---');
    console.log(error);
    error.set('overAllErr');
    ajax.getData('getModulProjectDefaults');
}
function reloadData(){
    cModal('AdaptedModal');
    ajax.getData(defaultTask);
}
function findData(value)
{
    ajax.getData(defaultTask+'&filter='+value);
}
function checkResponseFunction(d){
    console.log(d);
    if (!d.hasOwnProperty("data")) {
        console.log('data NOT Exists');
        throw 'Key `data` not exist';
    }
    if (!d['data'].hasOwnProperty("function")) {
        console.log('data NOT Exists');
        throw 'Key `data`.`function` not exist';
    }
    //console.log('KEY `data`.`function` exist');
}
loadData();