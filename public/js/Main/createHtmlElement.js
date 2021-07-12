$.fn.datepicker.defaults.format = "dd.mm.yyyy";
$.fn.datepicker.defaults.todayHighlight = true;
$.fn.datepicker.defaults.language = 'pl';
$.fn.datepicker.defaults.autoclose = true;

// GLOBAL SELECT
var selectAttribute=new Array(
            Array('class','form-control mb-1'),
            Array('id',''),
            Array('name',''),
            Array('no-readOnly','true'),
            Array('no-disabled','true'),
            );
var selectStyle=new Array();
// FUNCTION CREATE ANY HTML ELEMENT
// a. html tag to setup
// b. array of array to setup tag attribute
// c. array of classes
// d. array of css
function createHtmlElement(htmlTag,elementAttribute,elementClassList,elementStyle)
{
    //console.log('---createHtmlElement()---\n'+htmlTag);
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
    // ASSIGN ADDITIONAL CLASS
    if(elementClassList!==null && elementClassList!==undefined)
    {
        for(j=i;j<elementClassList.length;j++)
        {
            htmlElement.classList.add(elementClassList[j]);
        };
    };
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
function removeHtmlChilds(htmlElement)
{
    //console.log('---removeHtmlChilds()---');
    while (htmlElement.firstChild)
    {
        //console.log(htmlElement.firstChild);
        htmlElement.firstChild.remove(); 
    };
}
function setButton(stat,btn)
{
    /*
     * 
     * STAT => Status true/false
     */
    /*
     * GET BY ID
     */
    //var element = document.getElementById(idButton);
    //var element = document.getElementById("sendDataBtn");
    if(stat)
    {
        /*
         * ENABLED
         */
        console.log("button enabled");
        btn.classList.remove("disabled");
        btn.removeAttribute('disabled');
        //element.classList.remove("disabled");
        //element.removeAttribute('disabled');
    }
    else
    {
        /*
         * DISABLED
         */
        console.log("button disbaled");
        btn.classList.add("disabled");
        btn.setAttribute("disabled", "TRUE");
        //element.classList.add("disabled");
        //element.setAttribute("disabled", "TRUE");
    };
    //console.log(btn);
}
function showDiv(div,value)
{
    console.log('---showDivErr()---');
    div.innerHTML=value;
    div.style.display = "block";
}
function hideDiv(div)
{
    console.log('---hideDivErr()---');
    div.innerText='';
    div.style.display = "none";
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
function createCheckBox(label,id,disabled,checked)
{
    //console.log('---createCheckBox()---');
    var box=createTag('','input','custom-control-input');
        box.setAttribute('type','checkbox');
        box.setAttribute('name',id);
        box.setAttribute('id',id);
       
        if(disabled==='y')
        {
            box.setAttribute('disabled','');
            
        }
        else
        {
            box.onclick=function(){ changeBoxValue(this); };
        }
        setCheckBoxValue(box,checked);
        
        
    var labelTag=createTag(label,'label','custom-control-label');
        labelTag.setAttribute('for',id);
    var divBox=createTag('','div','custom-control custom-checkbox');
        divBox.appendChild(box);
        divBox.appendChild(labelTag);
    
    //console.log(divBox);
    return(divBox);
}
function setCheckBoxValue(ele,v)
{
    /* v => 1, 0 */
    /*
     * ACCEPT STRING OR INTEGER
     */
    if(v==='1' || v===1)
    {
        ele.setAttribute('checked','');
        ele.setAttribute('value','1');
    }
    else
    {
        ele.setAttribute('value','0');
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
function assignDataToField(obj,fieldId)
{
    //console.log('---assignDataToField---\nfieldId => '+fieldId);
    if(obj.hasOwnProperty(fieldId)!==false)
    {
        //console.log('EXIST');
        return obj[fieldId];
    }
    else
    {
        //console.log('NOT EXIST');
        return '';
    }  
}
function setEmptyObject(obj)
{
    console.log('---setEmptyObject()---');
    for (const property in obj)
    {
        //console.log(`${property}: ${obj[property]}`);
        obj[property]='';
    }
}
function createSelect(dataArray,fieldId,fieldName)
{
    console.log('---createSelect---\n'+fieldId);
    console.log(dataArray);
    selectAttribute[1][1]=fieldId; // id 
    selectAttribute[2][1]=fieldName; // name

    var option=document.createElement("OPTION");
    var optionText = document.createTextNode("");
    
    var select=createHtmlElement('select',selectAttribute,null,selectStyle);    
    for(var i=0;i<dataArray.length;i++)
    {
        option=document.createElement("OPTION");
        if(dataArray[i][2]==='t')
        {
            option.setAttribute("selected",'selected');             
        }
        option.setAttribute("value",dataArray[i][0]);
        optionText = document.createTextNode(dataArray[i][1]);
        option.appendChild(optionText);
        select.appendChild(option);
    };
    //console.log(select);
    return select;
}
function createSelectFromObject(d,n,sId,sC)
{
    /*
     *  d => data
     *  n => data property with option name to setup
     *  sId / sN => select ID / NAME
     *  sC => select CLASS
     */
    //console.log('---createSelect2---\n'+sId);
    //console.log(d);
    var s=getSelectTag(sC,sId);
        
    for (const property in d)
    {      
        var o=document.createElement('option');  
        o.innerText=assignDataToField(d[property],n);
        o.setAttribute("VALUE",Object.values(d[property]).join('|'));
        s.appendChild(o);
    }
    //console.log(s);
    return s;
}
function createSelectObject(o,n,v,id,c)
{
    /*
     *  o => data
     *  n => option label
     *  v => option value
     *  id => element ID (NAME)
     *  c => select CLASS
     */
    var select=getSelectTag(c,id);
    for (const property in o)
    {      
        var option=document.createElement('option');  
        option.innerText=o[property][n];
        option.setAttribute("VALUE",o[property][v]);
        select.appendChild(option);
    }
    //console.log(s);
    return select;
}
function createSelectFromArray(d,sId,sC)
{
    /*
     *  d => data array
     *  sId / sN => select ID / NAME
     *  sC => select CLASS
     */
    //console.log('---createSelect3---\n'+sId);
    //console.log(d);
    var s=getSelectTag(sC,sId);
        
    for(var i=0;i<d.length;i++)
    {        
        var o=document.createElement('option');
        o.innerText=d[i];
        o.setAttribute("VALUE",d[i]);   
        s.appendChild(o);
    }
    //console.log(s);
    return s;
}
function getSelectTag(c,n)
{
    var s=document.createElement("select");
        s.setAttribute("CLASS",c);  
        s.setAttribute("NAME",n);
        s.setAttribute("ID",n);  
        return s;
}
function setSelectMode(mode)
{
    console.log('---setSelectMode()---\n'+mode);
    if(mode>0)
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

function getDataFromJson(dataJson,fieldsToSetup)
{
    console.log('---dataJson()---');
    console.log(dataJson);
    var dataArray=new Array();
    var tmpArray= new Array();
    for(var i=0;i<dataJson.length;i++)
    {
        for(j=0;j<fieldsToSetup.length;j++)
        {
            
            tmpArray.push(assignDataToField(dataJson[i],fieldsToSetup[j]));
            //tmpArray.push(dataJson[i][fieldsToSetup[j]]);
        }
        dataArray[i]=tmpArray;
        tmpArray=[];
    };
    console.log();
    return dataArray;
}
function addHiddenInput(name,value)
{
    console.log('---addHiddenInput()---');
    var input=document.createElement("input");
        input.setAttribute("type", "hidden");
        input.setAttribute("value",value);
        input.setAttribute("name",name);
    return (input);
}
function createInput(type,name,value,c,p,disabled)
{
    //console.log('---createInput()---');
    var input=createTag('','input',c);
        input.setAttribute("type", type);
        input.setAttribute("id", name);
        
        input.setAttribute("name",name);
        input.setAttribute("placeholder",p);
    if(type==='checkbox')
    {
        setCheckBoxValue(input,value);
    }
    else
    {
        input.setAttribute("value",value);
    }
     setFieldDisabled(disabled,input);
    return (input);
}
function createForm(m,n,c,ac)
{
    var f=createTag('','form',c);
        f.setAttribute("NAME",n);
        f.setAttribute("ID",n);
        f.setAttribute("autocomplete",ac);
        f.setAttribute("METHOD",m);
        f.setAttribute("ENCETYPE","multipart/form-data");
        f.setAttribute("ACTION","javascript:void(0);");
        //console.log(f);
    return f;
}
function createBtn(label,c,id)
{    
    var confirmButton=createTag(label,'button',c);
        confirmButton.setAttribute("NAME",id);
        confirmButton.setAttribute("ID",id);
    return confirmButton;
}
function setInputMode(status)
{
    console.log('---setInputMode()---\n'+status);
    if(status>0)
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
function clearAdaptedModalData()
{
    removeHtmlChilds(document.getElementById('AdaptedDynamicData'));
    removeHtmlChilds(document.getElementById('AdaptedButtonsBottom'));
    removeHtmlChilds(document.getElementById('AdaptedBodyExtra'));
    removeHtmlChilds(document.getElementById('AdaptedModalInfo'));
    document.getElementById('errDiv-Adapted-overall').innerText='';
    document.getElementById('errDiv-Adapted-overall').style.display='none';
    document.getElementById("AdaptedBgTitle").removeAttribute('class');
    document.getElementById("AdaptedBgTitle").classList.add('modal-header');
}
function prepareModal(title,titleBg)
{
    document.getElementById('AdaptedTextTitle').innerText=title;
    document.getElementById("AdaptedBgTitle").classList.add(titleBg);
    //console.log(document.getElementById("AdaptedBgTitle"));
}
function cModal(id)
{
    console.log('cModal()');
   
    $('body').removeClass('modal-open');
    $('body').css('padding-right', '17px');
    $('.modal-backdrop').remove();
    $('#'+id).modal('hide'); //or $('#modalId').modal('toggle');
}
function setButtonDisplay(element,perm)
{
    console.log('---setButtonDisplay()---');
    if(loggedUserPerm.indexOf(perm)===-1)
    {
        element.classList.add('disabled');
        element.setAttribute("disabled", "");
        return false;
    }
    element.classList.remove("disabled");
    element.removeAttribute("disabled");
    return true;
}
function createDatePicker(name,value,disabled)
{
    console.log('---createDatePicker()---');
    var divG=createTag('','div','input-group date');
        divG.setAttribute('data-provide','datepicker');        
    var input=createTag('','input','form-control');
        input.setAttribute('type','text');
        input.setAttribute('name',name);
        input.setAttribute('id',name);
        input.setAttribute('value',value);
        input.setAttribute('placeholder','DD.MM.RRRR');
        input.setAttribute('no-readOnly','');
    var span=createTag('','span','input-group-text');
        span.setAttribute('no-readOnly','true');
        span.setAttribute('aria-hidden','true');
        span.setAttribute('style','cursor: pointer;');
    var i=createTag('','i','fa fa-calendar ');
        i.setAttribute('aria-hidden','true');        

    var divA=createTag('','div','input-group-addon input-group-append');
        
    setFieldDisabled(disabled,divG);
    setFieldDisabled(disabled,input);
    setFieldDisabled(disabled,span);
    setFieldDisabled(disabled,i);
    
    span.appendChild(i);
    divA.appendChild(span);
    divG.appendChild(input);
    divG.appendChild(divA);

    return (divG);
}
function createRemoveButton(id,disabled)
{
    // i PARAMETERS
    var i=createTag('','i','fa fa-minus');
        i.setAttribute('aria-hidden','true');
        i.setAttribute('style','color:#ffffff;');
    var div=createTag('','div','btn btn-danger');
        div.setAttribute('style',' border-bottom-left-radius:0%; border-top-left-radius:0%;');
        div.setAttribute('id',id);
    setFieldDisabled(disabled,i);
    setFieldDisabled(disabled,div);
    div.appendChild(i);
    return(div); 
}

function createRmBtn(disabled,fieldToDelete)
{
    // i PARAMETERS
    
    //console.log(fieldToDelete);
    var i=createTag('','i','fa fa-minus');
        i.setAttribute('aria-hidden','true');
        i.setAttribute('style','color:#ffffff;');
    var div=createTag('','div','btn btn-danger');
    
    
       if(disabled!=='y')
        {
            div.onclick=function()
            {
                console.log(fieldToDelete);
                removeHtmlChilds(fieldToDelete);
                //fieldToDelete.firstChild.remove(); 
            };
        };
    
    setFieldDisabled(disabled,i);
    setFieldDisabled(disabled,div);
    div.appendChild(i);
    return(div); 
}

function createAddButton(id,disabled)
{
    //var addBtn=createHtmlElement('button',);
    var iIco=createTag('','i','fa fa-plus');
        iIco.setAttribute("aria-hidden","true");
    var addBtn=createTag('','button','btn btn-success btn-add');
        addBtn.setAttribute('id',id);
    setFieldDisabled(disabled,addBtn);
    setFieldDisabled(disabled,iIco);
    addBtn.appendChild(iIco);
    return (addBtn);
}



function checkNumber(elem)
{
    console.log('---checkNumber()---');
    //console.log(elem);
    var number=parseInt(elem.value);
    //console.log(number);
    if(number<1 || isNaN(number))
    {
        //console.log('value < 1 || isNaN');
        elem.value=1;
    }
   // console.log(elem);
    //console.log(elem.value);
}
function setFieldDisabled(disabled,field)
{
    //console.log(field);
    if(disabled==='y')
    {
        field.setAttribute('disabled','disabled');
        field.classList.add("disabled");
    }
    else
    {
        if(field.classList.contains("disabled"))
        {
            //console.log(field.classList);
            field.classList.remove("disabled");
        }
        if(field.hasAttribute("disabled"))
        {
            
            //console.log(field[0]);
            field.removeAttribute("disabled");
        }
    }
}
function getActDate()
{
    var date = new Date();
    var month=String(date.getMonth()+1);
    var day=String(date.getDate());
    if(month.length<2)
    {
        month='0'+month;
    }
    return (day+'.'+month+'.'+date.getFullYear());
}
function createTag(text,tag,c)
{
    var e=document.createElement(tag);
        e.setAttribute('class',c);
        //e.innerText=text;
        e.innerHTML=text;
    return e;
}