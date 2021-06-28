//console.log(loggedUserPerm);
var ajax = new Ajax();
var error = new Error();
    Error.setDiv('errDiv-Adapted-overall');
    Error.setModal('AdaptedModal');
var utilities=new Utilities();
var defaultTask='getAllPerm';
var fieldDisabled='n';
var responseData=new Object();
var avaUsers=new Array();
var defaultTableColumns={
    Skrót:{
        style:'width:70px;',
        scope:'col'
    },
    Nazwa:{
        style:'',
        scope:'col'
    },
    Opis:{
        style:'',
        scope:'col'
    },
    Opcje:{
        style:'width:100px;',
        scope:'col'
    }
};
var defaultTableBtnConfig={
        EDIT_ROLE : {
            label : 'Edytuj',
            perm: 'EDIT_PERM_USER',
            task : 'getUsersWithPerm',
            class : 'btn-info',
            attributes : { 'data-toggle' : 'modal', 'data-target': '#AdaptedModal' }
        }
    };

setButtonAvaliable();
var defaultTableExceptionCol=new Array('i','md','mu','t','v');
function runFunction(d)
{
    /* d => array response */
    //console.log('===runFunction()===');
    //console.log(d);
    // RUN FUNCTION
    if(Error.checkStatusExist(d['status'])) { return ''; };
    Error.checkStatusResponse(d);
    console.log('FUNCTION TO RUN:\n'+d['data']['function']);
    console.log(d);
    switch(d['data']['function'])
    {
        case 'uPermOff':
                responseData=d;
                uPerm(false);
            break;
        case 'uPermUsers':
                uPerm(true);
                break;
        case 'showAll':
                displayAll(d);
                break;
        default:
                console.log('runFunction::DEFAULT TASK');
            break;
    }
}
function uPerm(input)
{
    clearAdaptedModalData();
    console.log('uPerm');
    prepareModal('PRZYPISANI UŻYTKOWNICY:','bg-info');
    var add=document.getElementById('AdaptedDynamicData');
    var form=createForm('POST',responseData['data']['function'],'form-horizontal','OFF');
    form.append(addHiddenInput('ID',responseData['data']['value']['i']));
    
    var divForm=createTag('','div','col-12');
    var divData=createTag('','div','col-12');  
    if(input)
    {        
        showDynamicUprList(form,divData);   
    }
    else
    {
        showStaticUprList(form);
    } 
    divForm.appendChild(form);
    add.appendChild(divForm);    
    add.appendChild(divData);   
    
    document.getElementById('AdaptedButtonsBottom').appendChild(functionBtn('cancel',createBtn('Anuluj','btn btn-dark','cancelBtn'),''));
    document.getElementById('AdaptedButtonsBottom').appendChild(functionBtn(responseData['data']['function'],createBtn('Edytuj','btn btn-info','sendDataBtn'),responseData['data']['function']));
    console.log(form);
        /* INFO */
    document.getElementById('AdaptedModalInfo').appendChild(createTag("Permission ID: "+responseData['data']['value']['i'],'small','text-left text-secondary ml-1'));
}
function showStaticUprList(ele)
{
    console.log('---showStaticUprList()---');
    
    if(responseData['data']['value']['u'].length===0)
    {
        ele.appendChild(createTag('Brak przypisanych użytkowników','h5','text-dark mb-3 text-center font-weight-bold'));
        return false;
    }
    
    ele.appendChild(createTag('Wykaz przypisanych użytkowników:','h5','text-dark mb-3 text-center font-weight-bold'));
    var colTitle=new Array('ID','Imię i Nazwisko');
    var tBody=document.createElement("tbody");
    
    for (const property in responseData['data']['value']['u'])
    {
        //console.log(projectData['data']['value']['team'][property]);
        var tr=document.createElement("tr");  
        for(const atr in responseData['data']['value']['u'][property])
        {
            var td=createTag(responseData['data']['value']['u'][property][atr],'td','');
                tr.appendChild(td);
        } 
        tBody.appendChild(tr);
    }
    ele.appendChild(createTable(colTitle,tBody));
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
function showDynamicUprList(ele,divBtn)
{
    console.log('---showDynamicUprList()---');
    ele.appendChild(createTag('Wskaż pracowników:','h5','text-dark mb-3 text-center font-weight-bold'));
    var i=0;
    /* set used users */
    for (var i=0;i<responseData['data']['value']['u'].length;i++)
    {
        /* add avaliable value to team member */
        var tmp_member=correctAvaUsers(responseData['data']['value']['u'][i].id,true);
        responseData['data']['value']['u'][i].ava=tmp_member.ava;
    }
    /* create users row */
    for (var i=0;i<responseData['data']['value']['u'].length;i++)
    {
        console.log(responseData['data']['value']['u'][i].id);
        
        createPermRow(ele,
                        i,
                        responseData['data']['value']['u'][i].id,
                        responseData['data']['value']['u'][i].ImieNazwisko                 
        );
    }
    var addBtn=createAddButton('','');
        addBtn.onclick = function()
        {
            /* GET FIRST AVA TEAM MEMBER */
            var ava=getAvaUser();
            if(ava.exist)
            {
                createPermRow(ele,i++,ava.member.id,ava.member.ImieNazwisko,1);
            }
            
        };
        divBtn.appendChild(addBtn);
}
function getAvaUser()
{
    var avaMember=new Object();
        avaMember.exist=false;

    for (const property in avaUsers)
    {   
        if(avaUsers[property].used!==true)
        {
            avaMember.exist=true;
            avaUsers[property].used=true;
            avaMember.member=avaUsers[property];
            break;
        } 
    }
    return avaMember;
}
function createPermRow(ele,i,id,user)
{
    console.log('---createTeamRow()---\ni => '+i+' \nId => '+id+'\nImieNazwisko => '+user);

    var divRow=createTag('','div','row');
    var divCol1=createTag('','div','col-11 pr-0');
    var divCol2=createTag('','div','col-1 pr-0 pl-0');
    var selectTeamWorker=createUsersArray(id,'user_'+i,user);
        selectTeamWorker.onclick=function()
        {
            console.log('actual used team member');
            actTeamMember=parseInt(this.value,10);
        };
        selectTeamWorker.onchange=function()
        {
            console.log('set new used team member');
            /* swap used team member */
            /* GET ROW i VALUE */
            console.log(this.name);
            var tmp_name=this.name.split("_");
            /* GET NEW TEAM MEMBER AVA VALUE */
            var tmp_member=correctAvaUsers(this.value,true);
            var tmpNode=this.parentNode;
            correctAvaUsers(actTeamMember,false);
            /* REMOVE SET PERCENT SELECT */
            removeHtmlChilds(this.parentNode.parentNode.childNodes[1]);
            this.parentNode.parentNode.childNodes[1].appendChild(createSelectObject(createPercentArray(1,tmp_member.ava),'l','v','percent_'+tmp_name[1],'form-control ml-0 mr-0'));
            /* REMOVE SET WORKER SELECT */
            removeHtmlChilds(this.parentNode);
            tmpNode.appendChild(createUsersArray(this.value,'pers_'+tmp_name[1],tmp_member.ImieNazwisko));
        };

    var rmBtn=createRemoveButton(i,'n');
        rmBtn.onclick=function()
        {
            correctAvaUsers(this.parentNode.parentNode.childNodes[0].childNodes[0].value,false);
            removeHtmlChilds(this.parentNode.parentNode);
        };
        
        divCol1.appendChild(selectTeamWorker);
           
        divCol2.appendChild(rmBtn);
        
        divRow.appendChild(divCol1);
        divRow.appendChild(divCol2);

    ele.appendChild(divRow);
}
function correctAvaUsers(id,u)
{
    for (const property in avaUsers)
    {   
        if(parseInt(id,10)===parseInt(avaUsers[property].id,10))
        {
            avaUsers[property].used=u;
            console.log(avaUsers[property]);
            return avaUsers[property];
        } 
    }
    /* IF NOT FOUND => RETURN 0 !!!!! */
    return 0;
}
function createUsersArray(id,name,worker)
{
    var s=createTag('','select','form-control');
        s.setAttribute('id',name);
        s.setAttribute('name',name);
    var oGroup=createTag('','optgroup','bg-warning');
        oGroup.setAttribute('label','Wskazany');
    var o=createTag(worker,'option','col-12');
        o.setAttribute('value',id);
        s.appendChild(oGroup);
        s.appendChild(o);
    var oGroup2=createTag('','optgroup','bg-warning');
        oGroup2.setAttribute('label','Dostępni');
        s.appendChild(oGroup2);
    for (const property in avaUsers)
    {
        setAvaliableUsersList(s,avaUsers[property]);
    }
    //console.log(avaTeam);
    return s;      
}
function setAvaliableUsersList(ele,worker)
{
    if(!worker.used)
    {
        var o2=createTag(worker.ImieNazwisko,'option','');
        o2.setAttribute('value',worker.id);
        ele.appendChild(o2);
    }
}
function displayAll(d)
{
    //console.log('===displayAll()===');
    if(Error.checkStatusResponse(d)) { return ''; };
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
    /* SET BUTTONS */
    
    for(var i = 0; i < d['data']['value'].length; i++)
    {    
        var tr=createTag('','tr','');
            assignDefaultTableData(tr,d['data']['value'][i]);
        pd.appendChild(tr);
    }
    //console.log(pd);
}
function assignDefaultTableData(tr,d)
{
    /* d => object with data */
    for (const property in d)
    {        
        if(!defaultTableExceptionCol.includes(property))
        {
            var td=createTag(d[property],'td','');
            tr.appendChild(td);
        } 
    }
    var td=document.createElement('td');
        td.appendChild(setBtn(d['i']));
    tr.appendChild(td);
}
function setBtn(i)
{
    var btnGroup=createTag('','div','btn-group pull-left');
        btnGroup.setAttribute('id',i);
    for (const property in defaultTableBtnConfig)
    {        
        var btn=createBtn(defaultTableBtnConfig[property].label,'btn '+defaultTableBtnConfig[property].class,defaultTableBtnConfig[property].task);  
        setBtnAtr(btn,property,defaultTableBtnConfig);
        setBtnAction(btn,defaultTableBtnConfig[property].perm);
        btnGroup.appendChild(btn);
    }
    return btnGroup;
}

function setButtonAvaliable()
{
    console.log('setButtonAvaliable()');
    for (const property in defaultTableBtnConfig)
    {     
        console.log(defaultTableBtnConfig[property].perm);
        console.log(loggedUserPerm.includes(defaultTableBtnConfig[property].perm));
        if(loggedUserPerm.includes(defaultTableBtnConfig[property].perm))
        {
            /* ADD FUNCTION */
            console.log(defaultTableBtnConfig[property]);
        }
        else
        {
            defaultTableBtnConfig[property].class=defaultTableBtnConfig[property].class+" disabled";
            defaultTableBtnConfig[property]['attributes'].disabled="disabled";
            console.log(defaultTableBtnConfig[property]);
        }
    }
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
function setBtnAction(btn,perm)
{
    if(loggedUserPerm.includes(perm))
    {
        btn.onclick=function ()
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
        case 'uPermOff' :
                btn.onclick = function()
                { 
                    responseData['data']['function']='uPermUsers';
                    responseData['data']['task']='uPermUsers';
                    responseData['status']=0;
                    responseData['type']='GET';
                    setAvaUsers();
                    runFunction(responseData);
                };
                break;
        case 'cancel':
                btn.onclick = function()
                {
                    closeModal('AdaptedModal');
                };
            break;
        case 'uPermUsers':
            btn.onclick = function()
            { 
                ajax.sendData(task,'POST');
            };
            break;
        default:
            break;
    }
    return btn;
}
function setAvaUsers()
{
    avaUsers=responseData['data']['value']['a'];
    for (const property in avaUsers)
    {   
        avaUsers[property].used=false;
    }
}
function findData(value)
{
    ajax.getData(defaultTask+'&filter='+value);
}
ajax.getData(defaultTask);