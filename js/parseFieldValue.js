var errInputValue=new Array();
// PARSE FIELD VALUE
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
    typeOfValueToParse=typeOfValueToParse.split('-');
    switch(typeOfValueToParse[0])
    {
        case 'extra':
        case 'numer_umowy':
        case 'temat_umowy':
            regExp(valueToParse,typeOfValueToParse[0],"^[\\da-zA-Z'"+plChars+"][\\/\\-\\_\\s\\da-zA-Z"+plChars+"]*[\\.\\s\\da-zA-Z"+plChars+"]{1}$",errDiv);
            break;
        case 'imie':
                if(valueToParse.length>2)
                {
                    regExp(valueToParse,typeOfValueToParse[0],"^[a-zA-Z'"+plChars+"][\\sa-zA-Z"+plChars+"]*[a-zA-Z"+plChars+"]{1}$",errDiv);
                }
                else
                {
                    console.log('ERROR LENGTH');
                    setErrTab(typeOfValueToParse[0]);
                    showDivErr(errDiv,'Błąd składni');
                }
                break;
        case 'nazwisko':
                if(valueToParse.length>2)
                {
                    regExp(valueToParse,typeOfValueToParse[0],"^[a-zA-Z'"+plChars+"][\\-\\sa-zA-Z"+plChars+"]*[a-zA-Z"+plChars+"]{1}$",errDiv);
                }
                else
                {
                    console.log('ERROR LENGTH');
                    setErrTab(typeOfValueToParse[0]);
                    showDivErr(errDiv,'Błąd składni');
                }
            break;
        case 'stanowisko':
                if(valueToParse.length>0)
                {
                    regExp(valueToParse,typeOfValueToParse[0],"^[\\da-zA-Z'"+plChars+"][\\/\\-\\_\\.\\s\\da-zA-Z"+plChars+"]*[\\.\\da-zA-Z"+plChars+"]{1}$",errDiv);
                }
            break;
        case 'email':
                if(valueToParse.length>0)
                {
                    regExp(valueToParse,typeOfValueToParse[0],"^[a-zA-Z][\\d\\-\\_\\.\\s\\da-zA-Z]*@[\\da-zA-Z]{2,}.[a-zA-Z]{2,}$",errDiv);
                }
                else
                {
                    removeErrTab(typeOfValueToParse[0]);
                    hideDivErr(errDiv);
                }
            break;
        case 'emailAccount':
                regExp(valueToParse,typeOfValueToParse[0]+'-'+typeOfValueToParse[1],"^[a-zA-Z][\\d\\-\\_\\.\\s\\da-zA-Z]*@[\\da-zA-Z]{2,}.[a-zA-Z]{2,}$",errDiv);
            break;   
        default:
            break;
    }
}
// REG EXP
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
function checkIsErr()
{
    console.log('---checkIsErr()---');
    var errExists=false;
    for(i=0;i<errInputValue.length;i++)
    {
        errExists=true;
        console.log(i+" - "+errInputValue[i]);
        setConfirmButton(false);
    }
    if(!errExists)
    {
        setConfirmButton(true);
    };
    return (errExists);
}
function removeErrFromTab(indexToRemove)
{
    console.log('---removeErrFromTab()---');
    errInputValue.splice( errInputValue.indexOf(indexToRemove), 1 );
}