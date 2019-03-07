var loggedUserPerm=new Array();
var errInputValue= new Array();
var currentIdData=0;
var permUsers=new Array();
var permUsersTmp=new Array();
var allUsers=new Array();
var allUsersCount=new Array();
var allUsersActUsedCount=new Array();
var permActUsedUsers=new Array();
var parmTab=new Array();
var permTab=new Array();
var lastPermUserId=0;
var roleData=0;
// FORM
var htmlForm="";
// GLOBAL INPUT PROPERTIES
var inputAttribute= new Array(
        Array('type','text'),
        Array('class','form-control mb-1'),
        Array('name','inputProject'),
        Array('id',''),
        Array('value',''),
        Array('placeholder',''),
        Array('no-readOnly','true'),
        Array('no-disabled',''),
        Array('no-checked','')
        );
var inputStyle=new Array();
var textAreaAtr=new Array(
            Array('class','form-control'),
            Array('no-readOnly','true'),
            Array('no-disabled','')
            );
    
function getAjaxData(task,taskAddon,functionStart,idRecord)
{
    console.log('---getAjaxData()---');
    console.log("TASK : "+task+"\nTASK ADDON : "+taskAddon+"\nidRecord : "+idRecord);

    var url =  getUrl()+'modul/manageParameters.php?task='+task+taskAddon;
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
    switch(taskToRun)
    {

        case 'getAllParm':
            /* 
             * [].ID
             * [].Skrót
             * [].Nazwa
             * [].Opis
             * [].Wartość
             * [].Typ
             */
            parmTab=data[0];
            /*
             * [] = ALL USER PARM SKRT
             */
            loggedUserPerm=data[1];
            break;
        default:
            alert('[manageTaskAfterAjaxGet()]ERROR - wrong task '+taskToRun);
            break;
    }
    // RUN FUNCTION
    switch(functionStart)
    {
        case 'sParm':
                console.log('sParm');
                if(loggedUserPerm.indexOf('LOG_INTO_PARM')!==-1)
                {
                    setAll(data[0]);
                }
                else
                {
                    setOverAllErrDiv('[SHOW_PARM] Brak uprawnienia',true);
                }
            break;
        default:
            break;
    }
}
function setAll(dataToSetup)
{
    console.log('---setAll()---');
    // data
    var dataL=dataToSetup.length;
    var rowL=Object.keys(dataToSetup).length;
    var body=document.getElementById("allDataBody");
    var header=document.getElementById('allDataHeader');
    removeHtmlChilds(body);
    removeHtmlChilds(header);
    console.log('DATA LENGTH: '+dataL);
    console.log('DATA ROW LENGTH: '+rowL);
    // GET AND SETUP HEADER
    var exceptions=new Array('Typ');
    header.appendChild(setupTabHeader(dataToSetup[0],exceptions));  
    // GET AND SETUP BODY
    for(var i = 0; i < dataL; i++)
    {    
        body.appendChild(setupTabBody(dataToSetup[i],exceptions));
    };
}
function setupTabHeader(dataToSetup,exceptions)
{
    console.log('---setupTabHeader()---');
    console.log(dataToSetup);
    console.log(exceptions);
    var tr=createHtmlElement('tr',null,null);
    var th="";
    for(var prop in dataToSetup)
    {
        if(dataToSetup.hasOwnProperty(prop) && exceptions.indexOf(prop)===-1)
        {       
            th=createHtmlElement('th',null,null);
            prop=prop.replace("_", " ");
            th.innerText=prop;
            tr.appendChild(th);  
        }
    } 
    return(tr);
}
function setupTabBody(dataToSetup)
{
    var td='';
    var idData='';
    var typData='';
    var  tr=createHtmlElement('tr',null,null);
    for(var prop in dataToSetup)
    {
        //console.log(dataToSetup[i]);
        idData=dataToSetup.ID;
        typData=dataToSetup.Typ;
        //typeData=dataToSetup[i].ID;
        if(dataToSetup.hasOwnProperty(prop))
        {
            td=createHtmlElement('td',null,null);
                
            if(prop==='Wartość')
            {
                td.appendChild(setupTypBodyField(dataToSetup[prop],idData,typData));
                tr.appendChild(td);
            }
            else if(prop==='Typ')
            {
                   //
            }
            else
            {
                td.innerText=dataToSetup[prop]; 
                tr.appendChild(td);
            }
        }
    } 
    console.log(tr);
    return(tr);
    
}
function setFieldsEnable()
{
    inputAttribute[6][0]='no-readOnly';
    inputAttribute[7][0]='no-disabled';
    textAreaAtr[1][0]='no-readOnly';
    textAreaAtr[2][0]='no-disabled'; 
}
function setFieldsDisable()
{
    inputAttribute[6][0]='readOnly';
    inputAttribute[7][0]='disabled';
    textAreaAtr[1][0]='readOnly';
    textAreaAtr[2][0]='disabled';
}
function setupTypBodyField(dataToSetup,idData,typData)
{
    
    //PARSE TYP OF FIELD
    setFieldsEnable();
    if(loggedUserPerm.indexOf('EDIT_PARM')===-1)
    {
        setFieldsDisable();
    }
    inputAttribute[0][1]='text';
    inputAttribute[1][1]='form-control mb-1';
    inputAttribute[2][1]=idData;
    inputAttribute[3][1]='data_'+idData;
    inputAttribute[4][1]=dataToSetup;
    inputAttribute[8][0]='no-checked';
    var labelInfo='NIE';
    
    var elem=createHtmlElement('input',inputAttribute,null);
    switch(typData)
    {
        default:
        case 'c':
            var labelAtr=new Array(
                Array('class','custom-control-label'),
                Array('for',''),
            );
            var divAtr=new Array(
            Array('class','col-sm-12 custom-control custom-checkbox')
            );
            var div=createHtmlElement('div',divAtr,null);
            inputAttribute[1][1]='custom-control-input';
            inputAttribute[0][1]='checkbox';
            if(dataToSetup>0)
            {
                console.log('ckbox: '+dataToSetup);
                inputAttribute[8][0]='checked';
                labelInfo='TAK';
            };
            
            var chbox=createHtmlElement('input',inputAttribute,null);
            chbox.onclick=function()
            {
                changeBoxValue(this);
                changeLabelInfo(this);
                changValue(this.value,idData);
            };
            div.appendChild(chbox);
            labelAtr[1][1]='data_'+idData;
            var label=createHtmlElement('label',labelAtr,null);
            label.innerText=labelInfo;
            div.appendChild(label);
            elem=div;
            labelInfo='NIE';
            break;
        case 's':
        case 't':
            elem.onchange=function(){ changValue(this.value,idData);};
            break;
        case 'n':
            inputAttribute[0][1]='number';
            elem=createHtmlElement('input',inputAttribute,null);
            elem.onchange=function(){ changValue(this.value,idData);};
            break;
        case 'p':
            inputAttribute[4][1]='';
            inputAttribute[0][1]='password';
            elem=createHtmlElement('input',inputAttribute,null);
            elem.onchange=function(){ changValue(this.value,idData);};
            break;     
        case 'a':
            elem=createHtmlElement('textarea',textAreaAtr,null);
            elem.innerText=dataToSetup;
            elem.onchange=function(){ changValue(this.value,idData);};
            break;
    }
    
    return (elem);
}
function changeLabelInfo(elem)
{
    console.log('---changeLabelInfo()---\nELEM: '+elem);
    console.log(elem.value);
    if(elem.value>0)
    {
        elem.parentNode.childNodes[1].innerText='TAK';
    }
    else
    {
        elem.parentNode.childNodes[1].innerText='NIE';
    }
    //AJAX
    console.log(elem.parentNode.childNodes[1]);
}
function changValue(value,idparm)
{
    console.log('---changeValue()---\nID PARM: '+idparm+"\nVALUE: "+value);
    var taskUrl='modul/manageParameters.php?task=setParm';
    var mainTemplate=getModalForm();
    htmlForm=mainTemplate.childNodes[1].childNodes[1];
    // ADD HIDDEN ID, VALUE
    htmlForm.append(addHiddenInput('id',idparm));
    htmlForm.append(addHiddenInput('value',value));
    
    sendData('setParm',taskUrl);
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
function addHiddenInput(name,value)
{
    console.log('---addHiddenInput---');
    var input=document.createElement("input");
        input.setAttribute("type", "hidden");
        input.setAttribute("value",value);
        input.setAttribute("name",name);
    return (input);
}
function getModalForm()
{
    console.log('---getModalForm()---');
    var mainTemplate=document.getElementById('formModalDetail').cloneNode(true);
    mainTemplate.classList.remove("modal");
    mainTemplate.classList.remove("fade");
    return(mainTemplate);
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
function postDataToUrl(task)
{
    console.log('---postDataToUrl()---');
    console.log(task);
    var taskUrl='modul/manageParameters.php?task='+task;
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
            case 'setParm':
                info='Parm updated';
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
    getAjaxData('getAllParm','','sParm',null);
    $('#AdaptedModal').modal('hide'); 
}
function setOverAllErrDiv(data,action)
{
    console.log('---setOverAllErrDiv()---\n'+data);
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
function changeBoxValue(input)
{
    console.log('---changeBoxValue()---');
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
// GET DEFAULT VALUES
getAjaxData('getAllParm','','sParm',null);