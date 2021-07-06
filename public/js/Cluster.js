var ajax = new Ajax();
var error = new Error();
    Error.setDiv('errDiv-Adapted-overall');
    Error.setModal('AdaptedModal');
var defaultTask='getActClustrsUsage';
//console.log(loggedUserPerm);
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
        case 'update':
            break;
        default:
            createTable(d);
            break;
    }
}
function display(){
    ajax.getData(defaultTask);
}
function createTable(d){
    console.log('createTable');
    var labs=d['data']['value'];
    var table=document.getElementById('clusterTable');
    var tBody=document.createElement('tbody');
    var tr=document.createElement('tr');
    var td1=document.createElement('td');
    var td2=document.createElement('td');
    table.appendChild(tBody);
    console.log(table);
    for (const property in d['data']['value'])
    {        
        console.log(property);
        console.log(d['data']['value'][property]);
        var td1=document.createElement('td');
            td1.setAttribute('class','td_main');
            td1.appendChild(document.createTextNode(d['data']['value'][property]['n']));
        var td2=document.createElement('td');
            td2.setAttribute('class','td_main');
            td2.appendChild(document.createTextNode(d['data']['value'][property]['c']));
        var tr=document.createElement('tr');
            tr.appendChild(td1);
            tr.appendChild(td2);
            tBody.appendChild(tr);
    }
    table.appendChild(tBody);
}
display();