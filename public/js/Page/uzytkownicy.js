var ajax = new Ajax();
var error = new Error();
    //Error.set('errDiv-Adapted-overall');
    
var defaultTask='getUsersLike&u=0';
var currentIdUser=0;
var currentUserData={
        'ID':'',
        'Imie':'',
        'Nazwisko':'',
        'Login':'',
        'Email':'',
        'IdRola':'',
        'TypKontaValue':'',
        'wskU':''
     };
var errInputValue= new Array();
var userPermSlo=new Array();
var userRoleSlo= new Array();
var typKonta=new Array();
var loggedUserPerm=new Array();
var userFields=new Array(
        new Array('hidden','','ID'),
        new Array('t','Imię:','Imie'),
        new Array('t','Nazwisko:','Nazwisko'),
        new Array('t','Login:','Login'),
        new Array('p','Haslo:','Haslo'),
        new Array('t','Email:','Email'),
        new Array('s-typkonta','Typ konta:','TypKonta'),
        new Array('s-rola','Rola:','Rola'),
        new Array('c-uprawnienia','Uprawnienia:','uprawnienia')
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
function runFunction(d){
    console.log('===runFunction()===');
    try{
        d=JSON.parse(d);
        console.log(d);
        console.log(error);
        if(error.checkStatusExist(d['status'])) { return ''; };
        console.log('FUNCTION TO RUN:');
        console.log(d['data']['function']);
        switch(d['data']['function'])
        {
            case 'cUser':
                    cUser(d);
                    break;
            case 'cModal':
                    cModal('AdaptedModal');
                    reloadData();
                    break;
            case 'eUser':
                    eUser(d);
                    break;
                break;
            case 'dUser':
                    dUser(d);
                    break;
            case 'uPermOff':
                    uPermOff(d);
                    break;
            case 'runMain':
                    /* SET PERM */
                    loggedUserPerm=d['data']['value']['perm'];
            default:
                    setAllUsers(d);
                break;
        }
    }
    catch(e){
        //this.setErr(e);
        console.log(e);
    }
   
}
function cUser(d)
{
    clearAdaptedModalData();
    console.log('---cUser()---');
    prepareModal('DODAJ UŻYTKOWNIKA:','bg-info');
    error.set('errDiv-Adapted-overall');
    setEmptyObject(currentUserData);
    userPermSlo=d['data']['value']['perm'];
    userRoleSlo=d['data']['value']['role'];
    typKonta=d['data']['value']['accounttype'];
    setUserBodyContent(d['data']['function'],1,'Dodaj');
    setPassFieldState(document.getElementById('accounttype').value);
    addLegendDiv();
    error.checkStatusResponse(d);
}
function eUser(d)
{
    clearAdaptedModalData();
    console.log('---eUser()---');
    prepareModal('EDYCJA UŻYTKOWNIKA:','bg-info');;
    currentUserData=d['data']['value']['user'];
    userPermSlo=d['data']['value']['perm'];
    userRoleSlo=d['data']['value']['role'];
    typKonta=d['data']['value']['accounttype'];
    setUserBodyContent(d['data']['function'],0,'Edytuj');
    addLegendDiv();
    error.checkStatusResponse(d);
}
function dUser(d)
{ 
    clearAdaptedModalData();
    console.log('---dUser()---');
    prepareModal('USUŃ UŻYTKOWNIKA:','bg-danger');
    setUserDeleteBodyContent('dUser',d['data']['value'],'Usuń');
    error.checkStatusResponse(d);
}
function uPermOff(d)
{
    clearAdaptedModalData();
    prepareModal('UPRAWNIENIA UŻYTKOWNIKA:','bg-warning');
    currentIdUser=d['data']['value'][0];
    userPermSlo=d['data']['value'][1];
    setUserPermBodyContent(d['data']['function'],0,'Edytuj','btn-warning');
}
function setAllUsers(d)
{
    console.log('---setAllUsers()---');
    if(error.checkStatusResponse(d)) { return ''; };
    var usersTab=d['data']['value']['users'];
    // USER TABLE
    // usersTab
    var allUsersData=document.getElementById("allUsersData");
    removeHtmlChilds(allUsersData);
    var divBtnGroupAtr=new Array(
                Array('class','btn-group pull-left')
                );
    var divBtnGroup='';
    var btnAtr=new Array(
                Array('class',''),
                Array('name',''),
                Array('id',''),
                Array('data-toggle',"modal"),
                Array('data-target','#AdaptedModal'),
                Array('no-disabled','') 
                );
    var btnConfig=new Array(
            new Array('btn-info','getUserDetails&id=','Dane','SHOW_USER'),
            new Array('btn-warning','getUserPerm&id=','Uprawnienia','SHOW_PERM_USER'),
            new Array('btn-danger','getUserDel&id=','Usuń','DEL_USER')
         );
    var btn='';
    var tr='';
    var td='';
    var tdOption='';
    var disabled='no-disabled';
    for(const i in usersTab)
    {    
        tr=createHtmlElement('tr',null,null,null);
        for(var prop in usersTab[i])
        {
            if(usersTab[i].hasOwnProperty(prop))
            {
                td=createHtmlElement('td',null,null,null);
                td.innerText=usersTab[i][prop];
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
            btnAtr[0][1]='btn position-relative '+btnConfig[z][0]+' '+disabled;
            btnAtr[1][1]=btnConfig[z][1]+usersTab[i].ID;
            btnAtr[2][1]=usersTab[i].ID;
            btnAtr[5][0]=disabled;
            btn=createHtmlElement('button',btnAtr,null,null);
            btn.innerText=btnConfig[z][2];
            btn.onclick=function()
            {
                clearAdaptedModalData();
                ajax.getData(this.name);
            };
            divBtnGroup.appendChild(btn);
            disabled='no-disabled';
        }
        tdOption=createHtmlElement('td',null,null,null);
        
        tdOption.appendChild(divBtnGroup);
        tr.appendChild(tdOption);
        allUsersData.appendChild(tr);
    };
    console.log(allUsersData);
}
function clearAdaptedComponent()
{
    removeHtmlChilds(document.getElementById('AdaptedDynamicData'));
    removeHtmlChilds(document.getElementById('AdaptedButtonsBottom'));
    removeHtmlChilds(document.getElementById('AdaptedBodyExtra'));
    removeHtmlChilds(document.getElementById('AdaptedModalInfo'));
    document.getElementById('errDiv-Adapted-overall').innerText='';
    document.getElementById('errDiv-Adapted-overall').style.display='none';
    
}
function setUserDeleteBodyContent(task,d,label)
{
    console.log('---setUserDeleteBodyContent()---\nID:');
    var form=createForm('POST',task,'form-horizontal','OFF');
    form.appendChild(addHiddenInput('ID',d)); 
    //document.getElementById('AdaptedButtonsBottom').appendChild(createBodyButtonContent(task));
    document.getElementById('AdaptedButtonsBottom').appendChild(functionBtn('cancel',createBtn('Anuluj','btn btn-dark','cancelBtn'),''));
    document.getElementById('AdaptedButtonsBottom').appendChild(functionBtn(label,createBtn(label,'btn btn-danger','sendDataBtn'),task));
    //document.getElementById('AdaptedDynamicData').appendChild(form);
    console.log(document.getElementById('AdaptedDynamicData'));
}
function setUserPermBodyContent(task,status,label,btnCol)
{
    console.log('---setUserPermBodyContent()---\ntask : '+task);
    var form=createForm('POST',task,'form-horizontal','OFF');
    form.appendChild(addHiddenInput('ID',currentIdUser)); 
    setUserPermContent(form,status);
    //setUserPermContent(form.childNodes[1],status);
    document.getElementById('AdaptedButtonsBottom').appendChild(functionBtn('cancel',createBtn('Anuluj','btn btn-dark','cancelBtn'),''));
    document.getElementById('AdaptedButtonsBottom').appendChild(functionBtn(task,createBtn(label,'btn '+btnCol,'sendDataBtn'),task));
    document.getElementById('AdaptedDynamicData').appendChild(form); 
    //document.getElementById('AdaptedButtonsBottom').appendChild(createBodyButtonContent(task));
}
function setUserPermContent(whereAppend,status)
{
    console.log('---setUserPermContent()---');
    //userSloPerm,
    //currentIdUser
    var divSm2Atr=new Array(
	Array('class','col-sm-2')
	);
    var div1Sm2=createHtmlElement('div',divSm2Atr,null,null);
    var divSm8Atr=new Array(
	Array('class','col-sm-8')
	);
    var div1Sm8=createHtmlElement('div',divSm8Atr,null,null);
    div1Sm8.appendChild(createCheckBoxList(userPermSlo,status));
    whereAppend.appendChild(div1Sm2);
    whereAppend.appendChild(div1Sm8);
}
function setUserBodyContent(task,status,label)
{
    console.log('---setUserBodyContent()---');
    var form=createForm('POST',task,'form-horizontal','OFF');
    /*
     * status:
     * 0 - BLOCKED WITH DATA
     * 1 - UNBLOCK
     */
    createUserRowContent(form,status);
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
function createUserRowContent(whereAppend,status)
{
    console.log('---createEditedUserRowContent()---');
    //console.log(whereAppend);
    console.log(currentUserData);
    // currentUserData -> USER DATA
    // userPermSlo -> USER SLO 
    // HTML TAGS
    console.log('STATUS -> '+status);
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
    for(var i=0;i<userFields.length;i++)
    {
        inputAttribute[0][1]='text';
        inputAttribute[2][1]=userFields[i][2];
        inputAttribute[3][1]=userFields[i][2];
        inputAttribute[4][1]='';
        labelAttribute[0][1]='input'+i;
        labelElement=createHtmlElement('label',labelAttribute,null,null);
        div1Element=createHtmlElement('div',div1,null,null);
        labelElement.innerText=userFields[i][1];
        switch(userFields[i][0])
        {
            case 'hidden':
                console.log('HIDDEN');
                inputAttribute[0][1]='hidden'; 
                inputAttribute[4][1]=assignDataToField(currentUserData,userFields[i][2]);
                inputElement=createHtmlElement('input',inputAttribute,null,inputStyle);
                div1Element.appendChild(inputElement);
                break;
            case 't':
                inputAttribute[4][1]=assignDataToField(currentUserData,userFields[i][2]);
                inputElement=createHtmlElement('input',inputAttribute,null,inputStyle);
                divErrAtr[1][1]='errDiv-'+userFields[i][2];
                divErr=createHtmlElement('div',divErrAtr,null,divErrStyle);
                inputElement.onblur=function()
                {
                    parseFieldValue(this,null,null);
                    checkIsErr(document.getElementById('sendDataBtn'));
                };
                div1Element.appendChild(inputElement);
                div1Element.appendChild(divErr);
                break;
            case 'p':
                inputAttribute[0][1]='password';
                
                //setInputMode(0);
                inputElement=createHtmlElement('input',inputAttribute,null,inputStyle);
                divErrAtr[1][1]='errDiv-'+userFields[i][2];
                divErr=createHtmlElement('div',divErrAtr,null,divErrStyle);
                inputElement.onblur=function()
                {
                    parseFieldValue(this,null,null);
                    checkIsErr(document.getElementById('sendDataBtn'));
                };
                div1Element.appendChild(inputElement);
                div1Element.appendChild(divErr);
                //setInputMode(status);
                break;
            case 's-typkonta':
                div1Element.appendChild(createAccountTypeField(status));
                
                break;
            case 's-rola':
                setSelectMode(status);
                var field=new Array('ID',"NAZWA","DEFAULT");
                newSelect=createSelect(getDataFromJson(userRoleSlo,field),userFields[i][2],userFields[i][2]);
                div1Element.appendChild(newSelect);
                break;
            case 'c-uprawnienia':
                div1Element.appendChild(createCheckBoxList(userPermSlo,status));
                break;
            default:
                break;
        };
        var divRow=createHtmlElement('div',null,divRowClass,null);
        divRow.appendChild(labelElement);
        divRow.appendChild(div1Element);
        whereAppend.appendChild(divRow);
        //console.log(whereAppend);
    };
}
function createAccountTypeField(status){
    console.log(typKonta);
    var select=createSelectFromObject(typKonta,'name','accounttype','form-control mb-1');
    console.log(status);
    if(status===0){
        select.setAttribute('disabled','');
    }
    else{
        select.onchange=function(){
            setPassFieldState(this.value);
        };
    };
    return select;
}
function setPassFieldState(fieldValue)
{
    console.log('---setPassFieldState()---');
    var passField=document.getElementById('Haslo');
    console.log(passField);
    console.log(fieldValue);
    console.log(passField.attributes);
    console.log(passField.hasAttribute('no-readonly'));
    console.log(passField.hasAttribute('disabled'));
    if(fieldValue==='2|Local')
    //if(passField.hasAttribute('readonly') && passField.hasAttribute('disabled'))
    {
        passField.removeAttribute("readonly");
        passField.removeAttribute("disabled");
    }
    else
    {
        passField.setAttribute("readonly", "TRUE");
        passField.setAttribute("disabled", "");
    }
}
function newUserRole()
{
    console.log('---newUserRole()---');
    var tmp=new Array();
    tmp.push({ID:'0',NAZWA:""});
    for(var z=0;z<userRoleSlo.length;z++)
    {
        //console.log('ROLA:');
        //console.log(userRoleSlo[z]);
        tmp.push(userRoleSlo[z]);
    }
    userRoleSlo=tmp;
}
function getForm()
{
    console.log('---getForm()---');
    var mainTemplate=document.getElementById('formModalDetail').cloneNode(true);
    mainTemplate.classList.remove("modal");
    mainTemplate.classList.remove("fade");
    return(mainTemplate);
}
function createCheckBoxList(data,status)
{
    console.log('---createCheckBoxList()---');
    console.log(data);
    console.log("LENGTH: "+data.length);
    /*
     * data - array of objects
     *///hiddend checkbox
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
    if(loggedUserPerm.indexOf('SHOW_PERM_USER')===-1)
        {
            var divErrAtr=new Array(
                Array('class','alert alert-danger ml-3 col-sm-auto')    
                );
                var divErr=createHtmlElement('div',divErrAtr,null,null);
                divErr.innerText="[SHOW_PERM_USER]Brak uprawnienia";
            
            
            
            divOverAll.appendChild(divErr);
        }
    for(var i = 0; i < data.length; i++)
    {    
        if(loggedUserPerm.indexOf('SHOW_PERM_USER')===-1)
        {
            divOverAll.appendChild(addHiddenInput(data[i].NAZWA,data[i].ID));
	}
        else
        {
           //console.log(data[i].ID+' '+data[i].NAZWA+' '+data[i].DEFAULT);
            divR=createHtmlElement('div',divRAtr,null,null);
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
        }
        
    };
    console.log(divOverAll);
    return(divOverAll);
}
function functionBtn(f,btn,task)
{
    console.log(f);
    switch(f)
    {
        case 'uPermOff':
                
                btn.onclick = function() { 
                    removeHtmlChilds(document.getElementById('AdaptedDynamicData'));
                    removeHtmlChilds(document.getElementById('AdaptedButtonsBottom'));
                    setUserPermBodyContent('uPerm',1,'Zatwierdź','btn-warning'); 
                };
            break;
        case 'eUser':
                
                btn.onclick = function() { 
                    removeHtmlChilds(document.getElementById('AdaptedDynamicData'));
                    removeHtmlChilds(document.getElementById('AdaptedButtonsBottom'));
                    setUserBodyContent('eUserOn',2,'Zatwierdź','btn-info'); 
                };
            break
        case 'cancel':
                btn.setAttribute('data-dismiss','modal');
                btn.onclick = function() { 
                    $('#AdaptedModal').modal('hide');
                    reloadData();
                };
            break;
        default:
                
                btn.onclick = function() { postData(this,task); };
            break;
    }
    return btn;
}
function postData(btn,nameOfForm)
{
    console.log('---postData()---');
    console.log(nameOfForm);
    var confirmTask=false;

    switch(nameOfForm)
    {
        case 'cUser':
        case 'eUserOn':    
            parseFieldValue( document.getElementById('Imie').value,"Imie","errDiv-Imie");
            parseFieldValue( document.getElementById('Nazwisko').value,"Nazwisko","errDiv-Nazwisko");
            parseFieldValue( document.getElementById('Login').value,"Login","errDiv-Login");
            parseFieldValue( document.getElementById('Email').value,"Email","errDiv-Email");
            if(checkIsErr(btn))
            {
                console.log("err is true");
                return(0);
            };
            confirmTask=true;
            break;
        case 'dUser':
            confirmTask = confirm("Potwierdź usunięcie użytkownika");
            break;
        case 'uPerm':
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
function create(){
    ajax.getData('getNewUserSlo');
}
function findData(value)
{
    ajax.getData(defaultTask+'&filter='+value);
}
function reloadData()
{
    console.log('---reloadData()---');
    ajax.getData(defaultTask);
}
function loadData(){
    console.log('---loadData()---');
    //ajax.getData(defaultTask);
    console.log(error);
    error.set('overAllErr');
    ajax.getData('getModulUsersDefaults');
}
loadData();