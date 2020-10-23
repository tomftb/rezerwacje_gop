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
    console.log('---removeHtmlChilds()---');
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
        console.log("button disabled");
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
        console.log("button enabled");
        btn.classList.add("disabled");
        btn.setAttribute("disabled", "TRUE");
        //element.classList.add("disabled");
        //element.setAttribute("disabled", "TRUE");
    };
    console.log(btn);
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
function closeModal(modalId)
{
    $('#'+modalId).modal('hide');
}