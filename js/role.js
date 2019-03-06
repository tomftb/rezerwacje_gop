var loggedUserPerm=new Array();
var errInputValue= new Array();
var currentIdData=0;
var permUsers=new Array();
var permUsersTmp=new Array();
var allUsers=new Array();
var allUsersCount=new Array();
var allUsersActUsedCount=new Array();
var permActUsedUsers=new Array();
var roleTab=new Array();
var permTab=new Array();
var lastPermUserId=0;
var roleData=0;
// FORM
var htmlForm="";
    // ADD BUTTON
var addButtonAttribute=new Array(
            Array('class','btn btn-success btn-add disabled'),
            );
var buttonAdd='';
    // REMOVE BUTTON
var removeButtonDivButtonAttribute=new Array(
	Array('class','btn btn-danger gt-no-rounded-left disabled')
	);
var removeButtonDivButtonStyle=new Array(
	Array('borderTopLeftRadius','0px'),
        Array('borderBottomLeftRadius','0px')
    );
    // i PARAMETERS
var removeButtonIattribute=new Array(
	Array('class','fa fa-minus disabled'),
        Array('readOnly',''),
        Array('disabled','true'),
	Array('aria-hidden','true')
	);
var removeButtonIstyle=new Array(
	Array('color','#ffffff')
    );
// GLOBAL SELECT
var selectTagAtr=new Array(
            Array('class','form-control mb-0 gt-border-light-blue gt-no-rounded-right disabled'),
            Array('id',''),
            Array('name',''),
            Array('readOnly','true'),
            Array('disabled','true')
            );
var selectTagStyle=new Array(
        Array('borderColor','#80bfff'),
        Array('borderTopRightRadius','0px'),
        Array('borderBottomRightRadius','0px')
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
// FIELDS
var inputFields=new Array(
        new Array('hidden','','id'),
        new Array('t','Nazwa:','nazwa'),
        new Array('c-uprawnienia','Uprawnienia:','uprawnienia')
    );
// GLOBAL SELECT
var selectAttribute=new Array(
            Array('class','form-control mb-1'),
            Array('id',''),
            Array('name',''),
            Array('no-readOnly','true'),
            Array('no-disabled','true')
            );
function getAjaxData(task,taskAddon,functionStart,idRecord)
{
    console.log('---getAjaxData()---');
    console.log("TASK : "+task+"\nTASK ADDON : "+taskAddon+"\nidRecord : "+idRecord);

    var url =  getUrl()+'modul/manageRole.php?task='+task+taskAddon;
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
    console.log('---parseAjaxResponse()---\n'+idRecord);
    var ajaxData = new Array();
    
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
    try
    {
    }
    catch(err)
    {
        //document.getElementById("demo").innerHTML = err.message;
        console.log('NOT A JSON FILE:\nERROR: '+err);
        console.log(response);
    }
}
function manageTaskAfterAjaxGet(taskToRun,data,functionStart,idRecord)
{
    console.log('---manageTaskAfterAjaxGet()---');
    //console.log(data);
    //console.log('TASK TO RUN - '+taskToRun+'\nDATA - '+data+'\nID - '+fieldId+'\nNAME - '+name+');
    //SET DATA TO TABLE
    switch(taskToRun)
    {
        case 'getNewRoleSlo':
            roleTab=data[0];
            permTab=data[1];
            break;
        case 'getAllRole':
            /* 
             * [].ID
             * [].Nazwa
             */
            roleTab=data[0];
            loggedUserPerm=data[1];
            
            break;
        case 'getRoleDetails':
            // ADD ROLE NAME
            //roleTab=data[0];
            roleData=data[0];
            roleTab=data[1];
            break;
        case 'getRoleUsers':
            roleData=data;
            break;
        default:
            alert('[manageTaskAfterAjaxGet()]ERROR - wrong task '+taskToRun);
            break;
    }
    // RUN FUNCTION
    switch(functionStart)
    {
        case 'cRole':
                setUserBodyContent(functionStart,1);
            break;
        case 'sRole':
                setButtonDisplay(document.getElementById('addNewButton'),'ADD_ROLE',loggedUserPerm);
                setAllRole();
            break;
        case 'details':
                setUserBodyContent(functionStart,0);
            break;
        case 'dRole':
                setDeleteEmployeeBodyContent(functionStart,roleData,idRecord);
            break;
        default:
            break;
    }
}
function setAllRole()
{
    console.log('---setAllRole()---');
    // roleTab
    var dataL=roleTab.length;
    var rowL=Object.keys(roleTab).length;
    var data=document.getElementById("allDataBody");
    var header=document.getElementById('allDataHeader');
    removeHtmlChilds(data);
    removeHtmlChilds(header);
    console.log('DATA LENGTH: '+dataL);
    console.log('DATA ROW LENGTH: '+rowL);
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
            new Array('btn-warning','details','Uprawnienia','SHOW_ROLE'),
            new Array('btn-danger','dRole','Usuń','DEL_ROLE')
         );
    var btn='';
    var tr='';
    var td='';
    var th='';
    var disabled='no-disabled';
    // GET AND SET HEADER 
    
    var tr=createHtmlElement('tr',null,null);
    for(var prop in roleTab[0])
        {
            if(roleTab[0].hasOwnProperty(prop))
            {
               
                th=createHtmlElement('th',null,null);
                prop=prop.replace("_", " ");
                th.innerText=prop;
                tr.appendChild(th);
            }
        }
        
    header.appendChild(tr);  
    for(var i = 0; i < dataL; i++)
    {    
        tr=createHtmlElement('tr',null,null);
        for(var prop in roleTab[i])
        {
            if(roleTab[i].hasOwnProperty(prop))
            {
                td=createHtmlElement('td',null,null);
                if(prop==='Opcje')
                {
                    divBtnGroup=createHtmlElement('div',divBtnGroupAtr,null);
                    for(var z=0;z<btnConfig.length;z++)
                    {
                        if(loggedUserPerm.indexOf(btnConfig[z][3])===-1)
                        {
                            disabled='disabled';
                        }
                        //console.log(roleTab[i]);
                        btnAtr[0][1]='btn '+btnConfig[z][0]+' '+disabled;
                        btnAtr[1][1]=btnConfig[z][1];
                        btnAtr[2][1]='idData:'+roleTab[i].ID+':'+roleTab[i].Nazwa;
                        btnAtr[5][0]=disabled;
                        btn=createHtmlElement('button',btnAtr,null);
                        btn.innerText=btnConfig[z][2];
                        btn.onclick=function(){ createAdaptedModal(this.name,this.id);};
                        divBtnGroup.appendChild(btn);
                        disabled='no-disabled';
                        td.appendChild(divBtnGroup);
                    }
                }
                else
                {
                    td.innerText=roleTab[i][prop]; 
                }
                tr.appendChild(td);  
            }
        }      
        data.appendChild(tr);
    };
    //console.log(document.getElementById('allDataHeader'));
    //console.log(allUsersData);
    //console.log(document.getElementById('allDataTable'));
}
function createHtmlElement(htmlTag,elementAttribute,elementStyle)
{
    //console.log('---createElement()---');
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
function clearAdaptedComponent()
{
    removeHtmlChilds(document.getElementById('AdaptedDynamicData'));
    removeHtmlChilds(document.getElementById('AdaptedButtonsBottom'));
    removeHtmlChilds(document.getElementById('AdaptedBodyExtra'));
    removeHtmlChilds(document.getElementById('AdaptedModalInfo'));
    
    document.getElementById('errDiv-Adapted-overall').innerText='';
    document.getElementById('errDiv-Adapted-overall').style.display='none';
    document.getElementById("AdaptedBodyContentTitle").innerText='';
}
function createAdaptedModal(modalType,idData)
{
    console.log('---createAdaptedModal()---');
    console.log("TASK - "+modalType+"\nID - "+idData);
    console.log(idData);
    clearAdaptedComponent();
    if(idData!=null)
    {
        var idData=splitValue(idData,':');
        document.getElementById("AdaptedBodyContentTitle").innerText=idData[2];
    }
    
    var title=document.getElementById('AdaptedTextTitle');
    var bgTitle=document.getElementById("AdaptedBgTitle");
    
    bgTitle.classList.value="";
    bgTitle.classList.add("modal-header");
    
    console.log(idData);
    switch(modalType)
    {
        case 'cRole':
            title.innerText='DODAWANIE ROLI:';
            bgTitle.classList.add("bg-info");
            document.getElementById('AdaptedModalInfo').innerText='Role Id : NEW';
            // GET ALL UPR
            //getAjaxData(modalType,'&id='+idData[1],modalType,idData[1]);
            getAjaxData('getNewRoleSlo','',modalType,null);
            break;
        case 'details':
                title.innerText='UPRAWNIENIA ROLI:';
                bgTitle.classList.add("bg-warning");
                // GET USERS WITH PERM
                getAjaxData('getRoleDetails','&id='+idData[1],modalType,idData[1]);
            break;
        case 'dRole':
            title.innerText='USUWANIE ROLI:';
            bgTitle.classList.add("bg-danger");
            document.getElementById('AdaptedModalInfo').innerText='Role Id : '+idData[1];
            currentId=idData[1];
            // GET USERS WITH ROLE
            getAjaxData('getRoleUsers','&id='+idData[1],modalType,idData[1]);
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
        default:
            break;
    }
    
    var h=createHtmlElement(tag,hAtr,null);
    h.innerText=info;
    return(h);
}
function addHiddenInput(name,value)
{
    console.log('---addHiddenInput---');
    var input=document.createElement("input");
        input.setAttribute("type", "hidden");
        input.setAttribute("value",value);
        input.setAttribute("name",name);
    return (input);
}
function createPermView(elementWhereAdd,taskToRun,state)
{
    console.log('---createPermView()---\n'+taskToRun);
    console.log(elementWhereAdd);
    setFieldsAtr(taskToRun);
    var mainTemplate=getModalForm();
    htmlForm=mainTemplate.childNodes[1].childNodes[1];
    // ADD HIDDEN IDPERM
    htmlForm.append(addHiddenInput('idPerm',currentIdData));
    
    var divAdd=document.createElement("div");
        divAdd.setAttribute("class","entry");
        divAdd.classList.add("input-group");
    buttonAdd=createAddButton();
    if(state)
    {   
        buttonAdd.onclick=function(){createPermUserRow(mainTemplate.childNodes[1].childNodes[1].childNodes[1],state,null,null);}; 
    }
    for(var tt=0;tt<permUsers.length;tt++)
    {
        createPermUserRow(mainTemplate.childNodes[1].childNodes[1].childNodes[1],state,permUsers[tt].id,permUsers[tt].ImieNazwisko);
    }
    
    divAdd.appendChild(buttonAdd);
    mainTemplate.childNodes[1].childNodes[1].appendChild(divAdd);
    elementWhereAdd.appendChild(mainTemplate);
    document.getElementById('AdaptedButtonsBottom').appendChild(createBodyButtonContent(taskToRun));
    controlAddUserPermButton();
}
function createPermUserRow(whereAppend,state,id,ImieNazwisko)
{
    console.log('---createPermUserRow()---\nSTATE: '+state);
    console.log(whereAppend);
    //console.log(rowName);
    var i=0;
    var z;
    var divRowAttribute=new Array(
	Array('class','row pr-0')
	);
    var divRowElement=createHtmlElement('div',divRowAttribute,null);
    // div-col-md-4 PARAMETERS
    var divColMd4Attribute=new Array(
	Array('class','col-sm-11 pr-0')
	);
    var divColMd4Element=createHtmlElement('div',divColMd4Attribute,null);

    // div-col-md-auto PARAMETERS
    var divColMdAutoAttribute=new Array(
	Array('class','col-sm-auto pl-0 mr-0 pr-0')
	);
    var divColMdAutoElement=createHtmlElement('div',divColMdAutoAttribute,null);
    // select-team-worker PARAMETERS
    selectTagAtr[1][1]='pers_'+allUsersActUsedCount;
    selectTagAtr[2][1]='pers_'+allUsersActUsedCount;

    var selectTeamWorkerElement=createHtmlElement('select',selectTagAtr,selectTagStyle);
    selectTeamWorkerElement.onfocus=function(){ manageActUsedPermUsers(this.value,this);}; //onclick onfocus
    selectTeamWorkerElement.onchange=function(){ updateActUsedPermUser(this.value,this);};
    var optionTeamWorkerAttribute=new Array(
            Array('value','dynamicChange')
            );
    var optionTeamWorkerElement;

    var tmpPers=new Array();

    if(id!==null)
    {
        tmpPers.push(id,ImieNazwisko);
        permActUsedUsers.push(id);
    }
    else
    {
        for(z=i;z<allUsers.length;z++)
        {
            console.log(allUsers[z]);
            /*
             * [].id
             * [].ImieNazwisko
             */
            if(permActUsedUsers.indexOf(allUsers[z].id)===-1)
            {
                console.log('FOUND');
                permActUsedUsers.push(allUsers[z].id);
                tmpPers.push(allUsers[z].id,allUsers[z].ImieNazwisko);
                break;
            }
        };
    }
  
    optionTeamWorkerAttribute[0][1]=tmpPers[0];
    optionTeamWorkerElement=createHtmlElement('option',optionTeamWorkerAttribute,null,null);
    optionTeamWorkerElement.textContent= tmpPers[1];
    selectTeamWorkerElement.appendChild(optionTeamWorkerElement);
    
    var removeButtonElement=createRemoveButton();
    if(state)
    {
        removeButtonElement.onclick=function(){retrivePermUser(this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode),this.parentNode.parentNode);};
    }
    divColMdAutoElement.append(removeButtonElement);
    divColMd4Element.appendChild(selectTeamWorkerElement);

    divRowElement.appendChild(divColMd4Element);
    divRowElement.appendChild(divColMdAutoElement);
    
    allUsersActUsedCount++;
    controlAddUserPermButton();
    console.log(divRowElement);
    whereAppend.append(divRowElement);
}
function manageActUsedPermUsers(idToSetup,elementWhereAppend)
{
    console.log('---manageActUsedPermUsers()---\nValue: '+idToSetup);
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

    var idNameToSetup=returnRowIdInArray(allUsers,'id',idToSetup);

    nameToSetup=allUsers[idNameToSetup].ImieNazwisko;
    console.log('true name to setup - '+nameToSetup);
    optionTeamWorkerElement.textContent=nameToSetup;
    elementWhereAppend.appendChild(optionTeamWorkerElement);
    for(var z=0;z<allUsers.length;z++)
    {
        
        if(permActUsedUsers.indexOf(allUsers[z].id)===-1 && allUsers[z].id!==idToSetup)
        {
            optionTeamWorkerAttribute[0][1]=allUsers[z].id;
            optionTeamWorkerElement=createHtmlElement('option',optionTeamWorkerAttribute,null,null);
            optionTeamWorkerElement.textContent=allUsers[z].ImieNazwisko;
            elementWhereAppend.appendChild(optionTeamWorkerElement);
        }
    }
     setLastPermUserId(idToSetup);
}			
function updateActUsedPermUser(idToAdd,elementToUpdate)
{
    console.log('---updateActUsedPermUser()---\n');
    console.log('act value of element - '+elementToUpdate.value);
    // RETRIVE LAST ID
    // ADD NEW ID
    console.log('removed id - '+permActUsedUsers.indexOf(lastPermUserId));
    console.log('value to to add - '+idToAdd);
    // update value of current element
    elementToUpdate.value=idToAdd;
    permActUsedUsers.splice( permActUsedUsers.indexOf(lastPermUserId),1,idToAdd);
    //actUsedMemberProjTab.push(idToAdd);
    setLastPermUserId(idToAdd);
}
function setLastPermUserId(idToSetup)
{
    console.log('---setLastPermUserId()---\n'+idToSetup);
    lastPermUserId=idToSetup;
    
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
function controlAddUserPermButton()
{
    console.log('---controlAddUserPermButton()---');
    console.log('allUsersCount : '+allUsersCount);
    //console.log(allUsers);
    console.log('allUsersActUsedCount : '+allUsersActUsedCount);
    //console.log(permActUsedUsers);
    // WARUNEK ABY NIE DODWAC W NIESKONCZONOSC
    if(allUsersCount===allUsersActUsedCount)
    {
        console.log('FINISH');
        setButtonAdd(1);
    }
}
function retrivePermUser(nodeToClose)
{
    //changeNumberOfMembers(-1);
    console.log("---retrivePermUser()---\n");
    var idToRemove=nodeToClose.childNodes[0].childNodes[0].firstChild.value;

    console.log("Retrive id - "+idToRemove);
    console.log("Retrive id indexOf to remove - "+permActUsedUsers.indexOf(idToRemove));
    permActUsedUsers.splice( permActUsedUsers.indexOf(idToRemove),1);
    allUsersActUsedCount--; 
    setButtonAdd(0);
}
function setButtonAdd(disabled)
{
    if(disabled)
    {
        buttonAdd.setAttribute("disabled", "true"); 
    }
    else
    {
        buttonAdd.removeAttribute("disabled"); 
    }
}
function changeNumberOfMembers(value)
{
    numberOfMemebersInProject=numberOfMemebersInProject+value;
    document.getElementById("projectId2").innerHTML = legendExtraLabels+numberOfMemebersInProject;
}
function createRemoveButton()
{

    var iElement=createHtmlElement('i',removeButtonIattribute,removeButtonIstyle,null);
    // div-button PARAMETERS
 
    var divRemoveButtonElement=createHtmlElement('div',removeButtonDivButtonAttribute,removeButtonDivButtonStyle);
    
    divRemoveButtonElement.appendChild(iElement);
    return(divRemoveButtonElement); 
}
function createAddButton()
{
    
    //var addBtn=createHtmlElement('button',);
    var iIco=document.createElement("i");
        iIco.setAttribute('class','fa');
        iIco.classList.add("fa-plus");
        iIco.setAttribute("aria-hidden","true");
    var addBtn=createHtmlElement('button',addButtonAttribute,null);
    addBtn.appendChild(iIco);
    return (addBtn);
}
function setFieldsAtr(task)
{
    console.log('---setFieldsAtr---\n'+task);
    switch (task)
    {
        case 'dRole':
            addButtonAttribute[0][1]='btn btn-success btn-add disabled';
            removeButtonDivButtonAttribute[0][1]='btn btn-danger gt-no-rounded-left disabled';
            selectTagAtr[3][0]='readOnly';
            selectTagAtr[4][0]='disabled';
            selectTagStyle[0][1]='#f2f2f2';
            break;
        case 'editPermUsers':
            addButtonAttribute[0][1]='btn btn-success btn-add';
            removeButtonDivButtonAttribute[0][1]='btn btn-danger gt-no-rounded-left';
            selectTagAtr[3][0]='no-readOnly';
            selectTagAtr[4][0]='no-disabled';
            selectTagStyle[0][1]='#80bfff';
            break;
        default:
            break;
    };  
}
function getModalForm()
{
    console.log('---getModalForm()---');
    var mainTemplate=document.getElementById('formModalDetail').cloneNode(true);
    mainTemplate.classList.remove("modal");
    mainTemplate.classList.remove("fade");
    return(mainTemplate);
}
function removeNodeChilds(elementWhereRemove)
{
    console.log('---removeNodeChilds---');
    while (elementWhereRemove.firstChild) 
    {
        elementWhereRemove.removeChild(elementWhereRemove.firstChild);
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
function removeHtmlChilds(htmlElement)
{
    console.log('---removeHtmlChilds()---');
    while (htmlElement.firstChild)
    {
        //console.log(htmlElement.firstChild);
        htmlElement.firstChild.remove(); 
    };
}

function createBodyButtonContent(task)
{
    console.log('---createBodyButtonContent()---\n'+task);
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
    cancelButton.onclick = function() { closeModal('AdaptedModal'); };
    // ADD BUTTON
    var confirmButtonAtr = new Array(
            Array('class','btn btn-info btn-add'),
            Array('no-disabled','')
            );
    var confirmButton='';
    divButtonElement.appendChild(cancelButton);
    switch(task)
    {
        case 'cRole':
            confirmButton=createHtmlElement('button',confirmButtonAtr,null);
            confirmButton.innerText = "Dodaj";
            confirmButton.onclick = function() { postDataToUrl(task); };
            divButtonElement.appendChild(confirmButton);
            break;
        case 'details':
            if(loggedUserPerm.indexOf('EDIT_ROLE')===-1)
            {
                confirmButtonAtr[0][1]='btn btn-info disabled';
                confirmButtonAtr[1][0]='disabled';
                document.getElementById("AdaptedModalInfo").innerText='[EDIT_ROLE] Brak uprawnienia';
            }
            confirmButton=createHtmlElement('button',confirmButtonAtr,null);
            confirmButton.innerText = 'Edytuj';
            if(loggedUserPerm.indexOf('EDIT_ROLE')!==-1)
            {
                confirmButton.onclick = function()
                {
                    removeHtmlChilds(document.getElementById('AdaptedDynamicData'));
                    removeHtmlChilds(document.getElementById('AdaptedButtonsBottom'));
                    setUserBodyContent('editRole',2); 
                };
            }
            divButtonElement.appendChild(confirmButton);
            break;
        case 'editRole':
            confirmButtonAtr[0][1]='btn btn-info';
            confirmButton=createHtmlElement('button',confirmButtonAtr,null);
            confirmButton.innerText = 'Zapisz';
            confirmButton.onclick = function()
            {
                //SENDA DATA
                postDataToUrl(task);
            };
            divButtonElement.appendChild(confirmButton);
            break;
        case 'dRole':
            confirmButtonAtr[0][1]='btn btn-danger';
            confirmButton=createHtmlElement('button',confirmButtonAtr,null);
            confirmButton.innerText = 'Usuń';
            confirmButton.onclick = function()
            {
                //SENDA DATA
                postDataToUrl(task);
            };
            divButtonElement.appendChild(confirmButton);
            break;
        case 'roleUsers':
            
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
function postDataToUrl(task)
{
    console.log('---postDataToUrl()---');
    console.log(task);
    var taskUrl='modul/manageRole.php?task='+task;
    var confirmTask=false;

    switch(task)
    {
        
        case 'editRole':
        case 'cRole':
            parseFieldValue( document.getElementById('nazwa').value,"nazwa","errDiv-nazwa");
            if(checkIsErr())
            {
                console.log("err is true");
                return(0);
            };
         case 'dRole':
            confirmTask=true;
            break;
        default:
            break;
    }; 
    if (confirmTask)
    {
        sendData(task,taskUrl);
    };
}
function sendData(task,taskUrl)
{
    console.log('---sendData()---');
    var xmlhttp = new XMLHttpRequest();
    var host =  getUrl();
    var url =  host+taskUrl;
    xmlhttp.onreadystatechange = function()
        {
          if (this.readyState === 4 && this.status === 200)
          {
                runTaskAfterAjax(task,this.responseText);
          }
          else
          {
              //console.log("error ajax"+this.status+" state - "+this.readyState);
          }
        };
        xmlhttp.open("POST", url, true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send(createDataToSend());
}
function runTaskAfterAjax(task,response)
{
    console.log('---runTaskAfterAjax()---');
    console.log(response);
    var responseData = JSON.parse(response);
    var info='';
    if(responseData[0]==='1')
    {
        setOverAllErrDiv(responseData[1],true);
    }
    else
    {
        setOverAllErrDiv(responseData[1],false);
        switch(task)
        {
            case 'dRole':
                info='Role deleted';
                break;
            case 'editRole':
                info='Role updated';
                break;
            case 'cRole':
                info='Role created';
                break;
            default:
                alert('[runTaskAfterAjax()]WRONG TASK - '+task);
                break;
        }
        setNewDataState(info);
    } 
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
function setNewDataState(infoAlert)
{
    alert(infoAlert);
    getAjaxData('getAllRole','','sRole',null);
    $('#AdaptedModal').modal('hide'); 
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
function createDataToSend()
{
    console.log('---createDataToSend---');
    console.log(htmlForm);
    var fieldName;
    var fieldValue;
    var params = '';
    
    for( var i=0; i<htmlForm.elements.length; i++ )
    {
        fieldName =htmlForm.elements[i].name;
        fieldValue =htmlForm.elements[i].value;
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
function createSelect(dataArray,fieldId,fieldName)
{
    console.log('---createSelect---\n'+fieldId);
    console.log(dataArray);
    selectAttribute[1][1]=fieldId; // id 
    selectAttribute[2][1]=fieldName; // name

    var option=document.createElement("OPTION");
    var optionText = document.createTextNode("");
    
    var select=createHtmlElement('select',selectAttribute,selectStyle);    
    for(var i=0;i<dataArray.length;i++)
    {
        option=document.createElement("OPTION");
        option.setAttribute("value",dataArray[i][0]);
        optionText = document.createTextNode(dataArray[i][1]);
        option.appendChild(optionText);
        select.appendChild(option);
    };
    return select;
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
function setUserBodyContent(task,status)
{
    console.log('---setUserBodyContent()---');
    
    var dataDiv=getEmplDefModal();
    htmlForm=dataDiv.childNodes[1].childNodes[1];

    switch(status)
    {
        case 0:
                //BLOCKED WITH DATA
                createEditedUserRowContent(htmlForm.childNodes[1],status);
            break;
        case 1:
                //NEW
                createNewUserRowContent(htmlForm.childNodes[1]);
                addLegendDiv();
            break;
        case 2:
                //EDIT
                createEditedUserRowContent(htmlForm.childNodes[1],1);
                addLegendDiv();
            break;
        default:
            break;
    }
   
    console.log(dataDiv);
    document.getElementById('AdaptedButtonsBottom').appendChild(createBodyButtonContent(task));
    document.getElementById('AdaptedDynamicData').appendChild(dataDiv);
}
function addLegendDiv()
{
    var legendDiv=document.getElementById('legendDiv').cloneNode(true);
    legendDiv.classList.remove("modal");
    legendDiv.classList.remove("fade");
    document.getElementById('AdaptedBodyExtra').appendChild(legendDiv);
}
function getEmplDefModal()
{
    console.log('---getEmplDefModal()---');
    var mainTemplate=document.getElementById('formModalDetail').cloneNode(true);
    mainTemplate.classList.remove("modal");
    mainTemplate.classList.remove("fade");
    return(mainTemplate);
}
function createNewUserRowContent(whereAppend)
{
    console.log('---createNewUserRowContent()---');
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
    setInputMode(1);
    
    for(var i=0;i<inputFields.length;i++)
    {
        inputAttribute[0][1]='text';
        inputAttribute[2][1]=inputFields[i][2];
        inputAttribute[3][1]=inputFields[i][2];
        inputAttribute[4][1]='';
        labelAttribute[0][1]='inputProject'+i;
        labelElement=createHtmlElement('label',labelAttribute,null);
        div1Element=createHtmlElement('div',div1,null);
        labelElement.innerText=inputFields[i][1];
        switch(inputFields[i][0])
        {
            case 'hidden':
                console.log('HIDDEN');
                inputAttribute[0][1]='hidden'; 
                break;
            case 't':
                inputElement=createHtmlElement('input',inputAttribute,inputStyle);
                divErrAtr[1][1]='errDiv-'+inputFields[i][2];
                divErr=createHtmlElement('div',divErrAtr,divErrStyle);
                inputElement.onblur=function()
                {
                    parseFieldValue(this,null,null);
                };
                div1Element.appendChild(inputElement);
                div1Element.appendChild(divErr);
                break;
            case 'c-uprawnienia':
                div1Element.appendChild(createCheckBoxList(permTab,1));
                break;
            default:
                break;
        };
        whereAppend.appendChild(labelElement);
        whereAppend.appendChild(div1Element);
    };
}
function createEditedUserRowContent(whereAppend,status)
{
    console.log('---createEditedUserRowContent()---');
    //console.log(whereAppend);
    console.log(roleTab);
    // currentUserData -> USER DATA
    // userPermSlo -> USER SLO
    
    // HTML TAGS
    console.log('STATUS -> '+status);
    setInputMode(status);
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
    for(var i=0;i<inputFields.length;i++)
    {
        inputAttribute[0][1]='text';
        inputAttribute[2][1]=inputFields[i][2];
        inputAttribute[3][1]=inputFields[i][2];
        inputAttribute[4][1]='';
        labelAttribute[0][1]='input'+i;
        labelElement=createHtmlElement('label',labelAttribute,null);
        div1Element=createHtmlElement('div',div1,null);
        labelElement.innerText=inputFields[i][1];
        switch(inputFields[i][0])
        {
            case 'hidden':
                console.log('HIDDEN');
                inputAttribute[0][1]='hidden'; 
                inputAttribute[4][1]=roleData[0].ID;
                inputElement=createHtmlElement('input',inputAttribute,inputStyle);
                div1Element.appendChild(inputElement);
                break;
            case 't':
                inputAttribute[4][1]=assignProjectDataToField(inputFields[i][2]);
                inputElement=createHtmlElement('input',inputAttribute,inputStyle);
                divErrAtr[1][1]='errDiv-nazwa';
                divErr=createHtmlElement('div',divErrAtr,divErrStyle);
                inputElement.onblur=function()
                {
                    parseFieldValue(this,null,null);
                };
                div1Element.appendChild(inputElement);
                div1Element.appendChild(divErr);
                break;
            case 'c-uprawnienia':
                div1Element.appendChild(createCheckBoxList(roleTab,status));
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
        case 'nazwa':
            valueToReturn=roleData[0].Nazwa;
            break;
   
        default:
            break;
    };
                
    return (valueToReturn);            
}
function setInputMode(mode)
{
    console.log('---setInputMode()---\n'+mode);
    if(mode)
    {
        inputAttribute[6][0]='no-readonly';
        inputAttribute[7][0]='no-disabled';
    }
    else
    {
        inputAttribute[6][0]='readonly';
        inputAttribute[7][0]='disabled';
    }
}
function setSelectMode(mode)
{
    console.log('---setSelectMode()---\n'+mode);
    if(mode)
    {
        selectAttribute[3][0]='no-readonly';
        selectAttribute[4][0]='no-disabled'; 
    }
    else
    {
        selectAttribute[3][0]='readonly';
        selectAttribute[4][0]='disabled';
    }
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
    var divOverAll=createHtmlElement('div',divOverAllAtr,null);
    if(loggedUserPerm.indexOf('SHOW_PERM_USER')===-1)
        {
            var divErrAtr=new Array(
                Array('class','alert alert-danger ml-3 col-sm-auto')    
                )
                var divErr=createHtmlElement('div',divErrAtr,null);
                divErr.innerText="[SHOW_PERM_USER]Brak uprawnienia";
            
            
            
            divOverAll.appendChild(divErr);
        }
    for(var i = 0; i < data.length; i++)
    {    
        if(loggedUserPerm.indexOf('SHOW_ROLE')===-1)
        {
            divOverAll.appendChild(addHiddenInput(data[i].NAZWA,data[i].ID));
	}
        else
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
        }
        
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
        case 'nazwa': // MIN 3 MAX 30 CHARACTERS
                regExp(valueToParse,typeOfValueToParse,"^[a-zA-Z"+plChars+"][a-zA-Z"+plChars+"\\d]{2,29}$",errDiv);
                break;
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
function setDeleteEmployeeBodyContent(task,data,idRecord)
{
    console.log('---setDeleteEmployeeBodyContent()---');
    var dataDiv=getEmplDefModal();
    htmlForm=dataDiv.childNodes[1].childNodes[1];
    console.log(htmlForm.childNodes[1]);
   
    console.log(htmlForm.childNodes[1]);
    console.log(data);
    console.log('DATA COUNT: '+data.length);
    
    if(data.length>0)
    {
        createEmployeeProjectsRowContent(htmlForm.childNodes[1],data,genTextNode(task));
        document.getElementById('AdaptedButtonsBottom').appendChild(createBodyButtonContent('roleUsers'));
    }
    else
    {
        htmlForm.append(addHiddenInput('id',idRecord));
        document.getElementById('AdaptedButtonsBottom').appendChild(createBodyButtonContent('dRole'));
    }
    document.getElementById('AdaptedDynamicData').appendChild(dataDiv);
    console.log(dataDiv);
}
function createEmployeeProjectsRowContent(whereAppend,data,titleElement)
{
    console.log('---createDeleteEmployeeRowContent()---');
    console.log(whereAppend);
    var dataL=data.length;
    var rowL=Object.keys(data[0]).length;
    console.log('DATA LENGTH: '+dataL);
    console.log('ROW LENGTH: '+rowL);
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
    for(var prop in data[0])
        {
            if(data[0].hasOwnProperty(prop))
            {
                td=createHtmlElement('td',null,null);
                prop=prop.replace("_", " ");
                td.innerText=prop;
                tr.appendChild(td);
            }
        }
    table.appendChild(tr);   
    // GET DATA
    for(var i=0;i<data.length;i++)
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
        table.appendChild(tr);
    };
    whereAppend.appendChild(table);
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
        case 'dRole':
            info='Rola nie może zostać usunięta ponieważ jest powiązana z poniżej wymienionymi użytkownikami:';
            break;
        default:
            break;
    }
    
    var h=createHtmlElement(tag,hAtr,null);
    h.innerText=info;
    return(h);
}
// GET DEFAULT VALUES
getAjaxData('getAllRole','','sRole',null);