var loggedUserPerm=new Array();
var currentIdData=0;
var permUsers=new Array();
var permUsersTmp=new Array();
var allUsers=new Array();
var allUsersCount=new Array();
var allUsersActUsedCount=new Array();
var permActUsedUsers=new Array();
var permissionsTab=new Array();
var lastPermUserId=0;
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

function getAjaxData(task,taskAddon,functionStart,idRecord)
{
    console.log('---getAjaxData()---');
    console.log("TASK : "+task+"\nTASK ADDON : "+taskAddon+"\nidRecord : "+idRecord);

    var url =  getUrl()+'modul/managePermission.php?task='+task+taskAddon;
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
    console.log(data);
    //console.log('TASK TO RUN - '+taskToRun+'\nDATA - '+data+'\nID - '+fieldId+'\nNAME - '+name+');
    //SET DATA TO TABLE
    switch(taskToRun)
    {
        case 'getAllPerm':
            /* 
             * [].Skrót
             * [].Nazwa
             * [].Opis
             * [].Opcje
             */
            permissionsTab=data[0];
            loggedUserPerm=data[1];
            
            break;
        case 'getUsersWithPerm':
            permUsers=data[0];
            allUsers=data[1];
            allUsersCount=allUsers.length;
            allUsersActUsedCount=0;
            permActUsedUsers=[];
            //console.log(idRecord);
            currentIdData=idRecord;
            //console.log(permUsers);
            //console.log(allUsers);
            break;
        default:
            alert('[manageTaskAfterAjaxGet()]ERROR - wrong task '+taskToRun);
            break;
    }
    // RUN FUNCTION
    switch(functionStart)
    {
        case 'sPermissions':
                setAllPermissions();
            break;
        case 'getUsersWithPerm':
                createPermView(document.getElementById('AdaptedDynamicData'),functionStart,0);
            break;
        default:
            break;
    }
}
function setAllPermissions()
{
    console.log('---setAllPermissions()---');
    // PERMISSIONS TABLE
    // permissionsTab
    var dataL=permissionsTab.length;
    var rowL=Object.keys(permissionsTab).length;
    var allUsersData=document.getElementById("allDataBody");
    removeHtmlChilds(allUsersData);
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
            new Array('btn-info','getUsersWithPerm','Użytkownicy','SHOW_PERM_USER'),
         );
    var btn='';
    var tr='';
    var td='';
    var th='';
    var disabled='no-disabled';
    // GET AND SET HEADER 
    
    var tr=createHtmlElement('tr',null,null);
    for(var prop in permissionsTab[0])
        {
            if(permissionsTab[0].hasOwnProperty(prop))
            {
                th=createHtmlElement('th',null,null);
                prop=prop.replace("_", " ");
                th.innerText=prop;
                tr.appendChild(th);
            }
        }
    document.getElementById('allDataHeader').appendChild(tr);  
    for(var i = 0; i < dataL; i++)
    {    
        tr=createHtmlElement('tr',null,null);
        for(var prop in permissionsTab[i])
        {
            if(permissionsTab[i].hasOwnProperty(prop))
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
                        btnAtr[0][1]='btn '+btnConfig[z][0]+' '+disabled;
                        btnAtr[1][1]=btnConfig[z][1];
                        btnAtr[2][1]='idData:'+permissionsTab[i].ID;
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
                    td.innerText=permissionsTab[i][prop]; 
                }
                tr.appendChild(td);  
            }
        }      
        allUsersData.appendChild(tr);
    };
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
}
function createAdaptedModal(modalType,idData)
{
    console.log('---createAdaptedModal()---');
    console.log("TASK - "+modalType+"\nID - "+idData);
    console.log(idData);
    clearAdaptedComponent();
    var title=document.getElementById('AdaptedTextTitle');
    var bgTitle=document.getElementById("AdaptedBgTitle");
    bgTitle.classList.value="";
    bgTitle.classList.add("modal-header");
    var idData=splitValue(idData,':');
    console.log(idData);
    switch(modalType)
    {
        case 'getUsersWithPerm':
            title.innerText='UPRAWNIENI UŻYTKOWNICY:';
            bgTitle.classList.add("bg-info");
            document.getElementById('AdaptedModalInfo').innerText='Perm Id : '+idData[1];
            currentId=idData[1];
            // GET USERS WITH PERM
            getAjaxData(modalType,'&id='+idData[1],modalType,idData[1]);
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
function createHiddenInpRowEmployeeRowContent(whereAppend,userId)
{
    // ADD HIDDEN INPUT WITH ID
    var inpAtr=new Array(
                Array('type','hidden'),
                Array('name','idUser'),
                Array('value',userId)
                );
    var inp=createHtmlElement('input',inpAtr,null);
    whereAppend.appendChild(inp); 
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
        case 'getUsersWithPerm':
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
             Array('class','btn btn-info btn-add')
            );
    var confirmButton='';

    switch(task)
    {
        case 'getUsersWithPerm':
            confirmButtonAtr[0][1]='btn btn-info';
            confirmButton=createHtmlElement('button',confirmButtonAtr,null);
            confirmButton.innerText = 'Edytuj';
            confirmButton.onclick = function()
            {
                allUsersActUsedCount=0;
                permActUsedUsers=[];
                removeHtmlChilds(document.getElementById('AdaptedDynamicData'));
                removeHtmlChilds(document.getElementById('AdaptedButtonsBottom'));
                //setUserBodyContent('editUser',2); 
                createPermView(document.getElementById('AdaptedDynamicData'),'editPermUsers',1);
            };
            
            break;
        case 'editPermUsers':
            confirmButtonAtr[0][1]='btn btn-info';
            confirmButton=createHtmlElement('button',confirmButtonAtr,null);
            confirmButton.innerText = 'Zapisz';
            confirmButton.onclick = function()
            {
                //SENDA DATA
                postDataToUrl(task);
            };
            break;
        default:
            alert('[createBodyButtonContent()]ERROR - wrong task');
            break;
    };
    divButtonElement.appendChild(cancelButton);
    divButtonElement.appendChild(confirmButton);
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
    var taskUrl='modul/managePermission.php?task='+task;
    var confirmTask=false;

    switch(task)
    {
        case 'editPermUsers':
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
    if(responseData[0]==='1')
    {
        setOverAllErrDiv(responseData[1],true);
    }
    else
    {
        setOverAllErrDiv(responseData[1],false);
        switch(task)
        {
            case 'editPermUsers':
                setNewDataState('Permission updated');
                break;
            default:
                alert('[runTaskAfterAjax()]WRONG TASK - '+task);
                break;
        } 
    } 
}
function setNewDataState(infoAlert)
{
    alert(infoAlert);
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
// GET DEFAULT VALUES
getAjaxData('getAllPerm','','sPermissions',null);