var ajax = new Ajax();
var error = new Error();
    Error.setDiv('errDiv-Adapted-overall');
    Error.setModal('AdaptedModal');
var defaultTask='getAllParm';
var fieldDisabled='n';
var actParmData=new Object();
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
    Wartość:{
        style:'width:400px;',
        scope:'col'
    }
};
var defaultTableExceptionCol=new Array('i','md','mu','t','v');
function runFunction(d)
{
    /* d => array response */
    console.log('===runFunction()===');
    console.log(d);
    // RUN FUNCTION
    if(Error.checkStatusExist(d['status'])) { return ''; };
    console.log('FUNCTION TO RUN:\n'+d['data']['function']);


    switch(d['data']['function'])
    {
        case 'pUpdate':     
            /* update user and date */
            var ele=document.getElementById('info_'+d['data']['value']['i']);
                ele.innerText='Update: '+d['data']['value']['u']+', '+d['data']['value']['d'];  
               
            break;
        default:
                //console.log('DEFAULT TASK');
                actParmData=d;
            displayAll();
            break;
    }
    //displayAll(d);
}
function displayAll()
{
    //console.log('===displayAll()===');
    if(Error.checkStatusResponse(actParmData)) { 
        prepareModal('ERROR','bg-danger');
         $('#AdaptedModal').modal('show'); return ''; 
        return ''; 
    };
    
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
    for(var i = 0; i < actParmData['data']['value'].length; i++)
    {    
        var tr=createTag('','tr','');
            assignDefaultTableData(tr,actParmData['data']['value'][i]);
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
    tr.appendChild(createTableEditField(d['t'],d['v'],d['i'],d['md'],d['mu']));
}
function createTableEditField(type,value,id,date,user)
{
    //console.log("Type: "+type+" Value: "+value);
    type=setEditedFieldType(type);
    //console.log(type);
    //console.log(value);
    var inp = createInput(type,id,value,'form-control mb-1','',fieldDisabled);
        inp=setEditedFieldFunction(inp,type);
    var td=createTag('','td','');
        td.appendChild(inp);
    var info=createTag("Update: "+user+", "+date,'small','text-sm-left text-secondary');
        info.setAttribute('id','info_'+id);
        td.appendChild(info);     
    return td;
}
function setEditedFieldType(type)
{
    switch(type)
    {
        case 'c': /* checkbox */
                return 'checkbox';
            break 
        case 'n': /* input number */
                return 'number';
            break
       
            break;
        case 'p': /* input password */
                return 'password';
            break  
        case 't': /* input text */
        default:
                return  'text';
            break;
    }
}
function setEditedFieldFunction(inp,type)
{
    inp.onchange=function ()
    {
        var form=createForm('POST','updateParm','form-horizontal','OFF');
            form.appendChild(createInput('hidden','id',this.name,'',''));
            form.appendChild(createInput('hidden','value',this.value,'',''));
            ajax.sendData(form,'POST');
    };
    inp.onclick=function()
    {         
        if(type==='checkbox')
        {
            changeBoxValue(this);
        }
    };
    return inp;
}
function findData(value)
{
    ajax.getData(defaultTask+value);
}
ajax.getData(defaultTask);