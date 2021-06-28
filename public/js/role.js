var ajax = new Ajax();
var error = new Error();
    Error.setDiv('errDiv-Adapted-overall');
    Error.setModal('AdaptedModal');
var defaultTask='getAllRole';
var fieldDisabled='y';
/* ACTUAL DATA FROM RESPOSNE */
var responseData=new Object();
var actDay = getActDate();
var actUsedData={
    role:{
        i:'',
        n:''
    },
    perm:{
        
    }
};
// new Array('ID','Nazwa','Opcje');
var defaultTableColumns={
    ID : {
        style:'width:100px',
        scope:'col'
    },
    Nazwa:{
        style:'',
        scope:'col'
    },
    Opcje:
    {
        style:'width:150px',
        scope:'col'
    }
};
var defaultTableBtnConfig={
        EDIT_ROLE : {
            label : 'Edytuj',
            task : 'getRoleDetails',
            class : 'btn-info',
            attributes : { 'data-toggle' : 'modal', 'data-target': '#AdaptedModal' }
        },
        DEL_ROLE : {
            label : 'Usuń',
            task : 'getRoleUsers',
            class : 'btn-danger',
            attributes : { 'data-toggle' : 'modal', 'data-target': '#AdaptedModal' }
        }
    };

//console.log(loggedUserPerm);
setButtonDisplay(document.getElementById('createData'),'ADD_PROJ');

function runFunction(d)
{
    /* d => array response */
    console.log('===runFunction()===');
    console.log(d);
    // RUN FUNCTION
    if(Error.checkStatusExist(d['status'])) { return ''; };
    responseData=d; 
    console.log('FUNCTION TO RUN:\n'+d['data']['function']);
    switch(d['data']['function'])
    {
        case 'cRole':
                actUsedData['role'].i='';
                actUsedData['role'].n='';
                actUsedData['perm']=d['data']['value']['perm'];
                fieldDisabled='n';
                roleManage('Dodaj','DODAJ ROLE:','info');
            break;
        case 'sRole':
                //pDetails(d,'Edytuj');
                actUsedData=d['data']['value'];
                console.log(actUsedData);
                fieldDisabled='y';
                    /* INFO */
                document.getElementById('AdaptedModalInfo').appendChild(createTag("Role ID: "+actUsedData['role'].i+", Create user: "+actUsedData['role'].cu+" ("+actUsedData['role'].cue+"), Create date: "+actUsedData['role'].cd,'small','text-left text-secondary ml-1'));
                roleManage('Edytuj','SZCZEGÓŁY ROLI:','info');
            break;
        case 'rEdit':
                fieldDisabled='n';
                clearAdaptedModalData();
                roleManage('Zatwierdź','EDYCJA ROLI:','warning');
                document.getElementById('AdaptedModalInfo').appendChild(createTag("Role ID: "+actUsedData['role'].i+", Create user: "+actUsedData['role'].cu+" ("+actUsedData['role'].cue+"), Create date: "+actUsedData['role'].cd,'small','text-left text-secondary ml-1'));
            break;
        case 'cModal':
                /* RUN CLOSE MODAL FROM createHtmlElement.js */
                cModal(defaultTask,d);
            break;
        case 'rDelete':
                deleteRole('Usuń','USUŃ ROLE:','danger');
            break;
        default:
                console.log('DEFAULT TASK');
                displayAll();
            break;
    }
}
function createTable(colTitle,tBody)
{
    console.log('---createTable()---');
    var table=createTag('','table','table');
    var tHead=document.createElement("thead");
    var tr=document.createElement("tr");
    for(var i=0;i<colTitle.length;i++)
    {
        var th=createTag(colTitle[i],'th','');
            th.setAttribute('scope','col');
            tr.appendChild(th);
    }
    tHead.appendChild(tr);
    table.appendChild(tHead);
    table.appendChild(tBody);
    return table;
}

function deleteRole(btnLabel,title,titleClass)
{
    prepareModal(title,'bg-'+titleClass);
    var form=createForm('POST',responseData['data']['function'],'form-horizontal','OFF');
    var add=document.getElementById('AdaptedDynamicData'); 
    var usersExist=deleteRoleFields(form);
    
    add.appendChild(createTag(responseData['data']['value']['role'].n,'h5','text-'+titleClass+' mb-3 text-center font-weight-bold'));
    add.appendChild(form);
    document.getElementById('AdaptedButtonsBottom').appendChild(functionBtn('cancel',createBtn('Anuluj','btn btn-dark','cancelBtn'),''));
    if(!usersExist)
    {
       document.getElementById('AdaptedButtonsBottom').appendChild(functionBtn(responseData['data']['function'],createBtn(btnLabel,'btn btn-'+titleClass,'sendDataBtn'),responseData['data']['function']));
    }
    /* INFO */
    document.getElementById('AdaptedModalInfo').appendChild(createTag("Role ID: "+responseData['data']['value']['role'].i+", Create user: "+responseData['data']['value']['role'].cu+" ("+responseData['data']['value']['role'].cue+"), Create date: "+responseData['data']['value']['role'].cd,'small','text-left text-secondary ml-1'));
}
function deleteRoleFields(ele)
{ 
    console.log('---deleteRoleFields()---');
    if(responseData['data']['value']['user'].length>0)
    {
        ele.appendChild(createTag('Rola nie możne zostać usunięta!','h5','text-danger mb-3 text-center font-weight-bold'));
        ele.appendChild(createTag('Aktualnie do roli przypisani są użytkownicy:','h6','text-secondary mb-3 text-center font-weight-bold'));
        var colTitle=new Array('Imię','Nazwisko','Login','Email');
        var tBody=document.createElement("tbody");

        for (const property in responseData['data']['value']['user'])
        {
            var tr=document.createElement("tr");  
            for(const atr in responseData['data']['value']['user'][property])
            {
                var td=createTag(responseData['data']['value']['user'][property][atr],'td','');
                    tr.appendChild(td);
            } 
            tBody.appendChild(tr);
        }
        ele.appendChild(createTable(colTitle,tBody)); 
        return true;
    }
    ele.appendChild(createInput('hidden','id',responseData['data']['value']['role'].i,'','','n'));
    return false;
}

function roleManage(btnLabel,title,titleClass)
{
    console.log('===roleManage()===');
    Error.checkStatusResponse(responseData);
    /*
        * SLOWNIKI:
        * data[] = ROLE
        * data[] = PERMISSIONS
    */
    prepareModal(title,'bg-'+titleClass);
    var form=createForm('POST',responseData['data']['function'],'form-horizontal','OFF');
    var add=document.getElementById('AdaptedDynamicData'); 
    rCreateFields(form);
    add.appendChild(form);
    document.getElementById('AdaptedButtonsBottom').appendChild(functionBtn('cancel',createBtn('Anuluj','btn btn-dark','cancelBtn'),''));
    document.getElementById('AdaptedButtonsBottom').appendChild(functionBtn(responseData['data']['function'],createBtn(btnLabel,'btn btn-'+titleClass,'sendDataBtn'),responseData['data']['function']));
    console.log(document.getElementById('AdaptedButtonsBottom'));
}

function rCreateFields(ele)
{
    console.log('---rCreateFields()---');  
    var pFields={
        'ID' : {
            'label' : '',
            'input' : createProjectInput('hidden',actUsedData['role'].i,'id')
        },
        'nazwa' : {
            'label' : 'Nazwa:',
            'input' : createProjectInput('text',actUsedData['role'].n,'nazwa')
        },
        'uprawnienia' : {
            'label' : 'Uprawnienia:',
            'input' : cUprList()
        }
    };
    createRoleRow(ele,pFields);

    return '';
}
function cUprList()
{
    console.log('---cUprList()---'); 
    //console.log(responseData['data']['value'].upr);
    var div=createTag('','div','');
    var checked=0;
    console.log(actUsedData.perm);
    for(const prop in actUsedData.perm )
    {
        //console.log(responseData['data']['value']['upr'][prop]);
        //console.log(prop);
        if(actUsedData['perm'][prop].hasOwnProperty('c'))
        {
            checked=1;
            //console.log('checked');
        }
        div.appendChild(createCheckBox(actUsedData['perm'][prop].n,'perm_'+actUsedData['perm'][prop].i,fieldDisabled,checked));
        checked=false;
    }
    return div;
}
function createRoleRow(ele,pFields)
{
    for (const property in pFields)
    {        
        var l=createTag(pFields[property].label,'label','text-right font-weight-bold col-2 pt-2'); 
        var dCol2=createTag('','div','col-10');
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
function displayAll()
{
    console.log('===displayAll()===');
    if(Error.checkStatusResponse(responseData)) { return ''; };
    /* SETUP DEFAULT TABLE COLUMN */
    var defaultTableCol=document.getElementById("colDefaultTable");
        removeHtmlChilds(defaultTableCol);
    for (const c in defaultTableColumns)
    {
        var th=createTag(c,'th','');
        for(const atr in defaultTableColumns[c])
        {
            th.setAttribute(atr,defaultTableColumns[c][atr]);
        }
        defaultTableCol.appendChild(th);
    }
    /* CREATE ROW */
    var pd=document.getElementById("defaultTableRows");
    /* remove old data */
    removeHtmlChilds(pd);
    for(var i = 0; i < responseData['data']['value'].length; i++)
    {    
        var tr=createTag('','tr','');
            assignDefaultTableData(tr,responseData['data']['value'][i]);
            /* i => ID DATA */
        var td=document.createElement('td');
            td.appendChild(setBtn(defaultTableBtnConfig,responseData['data']['value'][i].i));
        tr.appendChild(td);
        pd.appendChild(tr);       
    }
    console.log(pd);
}
function assignDefaultTableData(tr,d)
{
    /* d => object with data */
    for (const property in d)
    {        
        var td=createTag(d[property],'td','');
        tr.appendChild(td);
    }
}
function createProjectInput(type,value,label)
{
    console.log('===createProjectInput()===');
    var divAll=document.createElement('div');
    var divErr=createTag('','div','col-auto alert alert-danger mb-1');
        divErr.setAttribute('id','errDiv-'+label);
        divErr.setAttribute('style','display:none;');
    var inp=createInput(type,label,value,'form-control mb-1','',fieldDisabled);
        inp.onblur=function ()
        {
            parseFieldValue(this,null,null);
            checkIsErr(document.getElementById('sendDataBtn'));
        };
    divAll.appendChild(inp);
    divAll.appendChild(divErr);
    return divAll;
}
function setBtn(btnConfig,i)
{
    var btnGroup=createTag('','div','btn-group pull-left');
        btnGroup.setAttribute('id',i);
    for (const property in btnConfig)
    {    
        var btn=createBtn(btnConfig[property].label,'btn '+btnConfig[property].class,btnConfig[property].task);
        setBtnAtr(btn,property,btnConfig);
        setBtnAction(btn,property);
        btnGroup.appendChild(btn);
    }
    return btnGroup;
}
function setBtnAtr(btn,property,btnConfig)
{
    if(btnConfig[property].hasOwnProperty('attributes'))
    {
        for (const atr in btnConfig[property].attributes)
        {
            btn.setAttribute(atr,btnConfig[property].attributes[atr]);
        }
    }
}
function setBtnAction(btn,property)
{
    if(setButtonDisplay(btn,property))
    {
        btn.onclick=function()
        {
            clearAdaptedModalData();
            ajax.getData(this.name+'&id='+this.parentNode.id); 
        };
    }
}
function functionBtn(f,btn,task)
{
    console.log('---functionBtn()---');
    console.log(f);
    switch(f)
    {
        case 'sRole' :
                btn.onclick = function()
                { 
                    responseData['data']['function']='rEdit';
                    responseData['data']['task']='rEdit';
                    responseData['status']=0;
                    responseData['type']='GET';
                    runFunction(responseData);
                };
                break;
        case 'cancel':
                btn.onclick = function()
                {
                    closeModal('AdaptedModal'); 
                    reloadData(defaultTask);
                };
            break;
        case 'rEdit':
        case 'rDelete':
        case 'cRole':
            btn.onclick = function() { postData(this,task); };
            break;
        default:
            break;
    }
    return btn;
}
function postData(btn,nameOfForm)
{
    console.log('---postData()---');
    console.log(nameOfForm);
    var err=false;
    switch(nameOfForm)
    {
        case 'eRole':
        case 'cRole':
            parseFieldValue( document.getElementById('nazwa').value,"nazwa","errDiv-nazwa");
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
function createData()
{
    clearAdaptedModalData();
    ajax.getData('getNewRoleSlo');
}
function findData(value)
{
    ajax.getData('getAllRole&filter='+value);
}
ajax.getData(defaultTask);