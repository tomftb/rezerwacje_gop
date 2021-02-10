var avaTeam=new Object();
var actTeamMember=0;
function pTeam(input)
{
    prepareModal('ZESPÓŁ PROJEKTOWY:','bg-warning');
    var form=createForm('POST',projectData['data']['function'],'form-horizontal','OFF');
    var add=document.getElementById('AdaptedDynamicData');
    var divForm=createTag('','div','col-12');
    var divBtn=createTag('','div','col-12');     
    form.appendChild(createInput('hidden','id',projectData['data']['value']['id'],'',''));
    form.appendChild(createTag(actProject.t,'h5','text-warning mb-3 text-center font-weight-bold'));
    if(input)
    {        
        showDynamicTeam(form,divBtn);   
    }
    else
    {
        showStaticTeam(form);
    } 
    divForm.appendChild(form);
    add.appendChild(divForm);    
    add.appendChild(divBtn);    
    console.log(add);
    /* BUTTONS */
    document.getElementById('AdaptedButtonsBottom').appendChild(functionBtn('cancel',createBtn('Anuluj','btn btn-dark','cancelBtn'),''));
    document.getElementById('AdaptedButtonsBottom').appendChild(functionBtn(projectData['data']['function'],createBtn('Edytuj Team','btn btn-warning',projectData['data']['function']),projectData['data']['function']));
    /* INFO */
    document.getElementById('AdaptedModalInfo').appendChild(createTag("Project ID: "+actProject.i+", Create user: "+actProject.cu+" ("+actProject.cum+"), Create date: "+actProject.du,'small','text-left text-secondary ml-1'));
}
function showStaticTeam(ele)
{  
    console.log('---showStaticTeam()---');
    
    if(projectData['data']['value']['team'].length===0)
    {
        ele.appendChild(createTitle('Brak przypisanych pracowników'));
        return false;
    }
    
    ele.appendChild(createTitle('Wykaz przypisanych pracowników:'));
    var colTitle=new Array('ID','Imię i Nazwisko','Procent udziału','Data od','Data do');
    var tBody=document.createElement("tbody");
    
    for (const property in projectData['data']['value']['team'])
    {
        //console.log(projectData['data']['value']['team'][property]);
        var tr=document.createElement("tr");  
        for(const atr in projectData['data']['value']['team'][property])
        {
            var td=createTag(projectData['data']['value']['team'][property][atr],'td','');
                tr.appendChild(td);
        } 
        tBody.appendChild(tr);
    }

    ele.appendChild(createTable(colTitle,tBody));
}
function showDynamicTeam(ele,divBtn)
{
    console.log('---showDynamicTeam()---');
    ele.appendChild(createTitle('Wskaż pracowników:'));
    var i=0;
    /* set used team */
    for (var i=0;i<projectData['data']['value']['team'].length;i++)
    {
        /* add avaliable value to team member */
        var tmp_member=correctAvaTeam(projectData['data']['value']['team'][i].idPracownik,true);
        projectData['data']['value']['team'][i].ava=tmp_member.ava;
    }
    /* create team row */
    for (var i=0;i<projectData['data']['value']['team'].length;i++)
    {
        console.log(projectData['data']['value']['team'][i].idPracownik);
        
        createTeamRow(ele,
                        i,
                        projectData['data']['value']['team'][i].idPracownik,
                        projectData['data']['value']['team'][i].ImieNazwisko,
                        projectData['data']['value']['team'][i].procentUdzial,
                        projectData['data']['value']['team'][i].ava,
                        projectData['data']['value']['team'][i].datOd,
                        projectData['data']['value']['team'][i].datDo                    
        );
    }
    var addBtn=createAddButton('','');
        addBtn.onclick = function()
        {
            /* GET FIRST AVA TEAM MEMBER */
            var ava=getAvaTeamMember();
            if(ava.exist)
            {
                createTeamRow(ele,i++,ava.member.id,ava.member.ImieNazwisko,1,ava.member.ava,actDay,actDay);
            }
            
        };
        divBtn.appendChild(addBtn);
}
function createTeamRow(ele,i,id,worker,usedPercent,avaPercent,dataod,datado)
{
    console.log('---createTeamRow()---\ni => '+i+' \nId => '+id+'\nImieNazwisko => '+worker+'\nProcentUdzial => '+usedPercent+'\nData OD => '+dataod+'\nData DO => '+datado);

    var divRow=createTag('','div','row');
    var divCol1=createTag('','div','col-3 pr-0');
    var divCol2=createTag('','div','col-2 pr-0 pl-0');
    var divCol3=createTag('','div','col-3 pr-0 pl-0');
    var divCol4=createTag('','div','col-3 pr-0 pl-0');
    var divCol5=createTag('','div','col-1 pr-0 pl-0');
    var selectTeamWorker=createWorkerArray(id,'pers_'+i,worker);
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
            var tmp_member=correctAvaTeam(this.value,true);
            var tmpNode=this.parentNode;
            correctAvaTeam(actTeamMember,false);
            /* REMOVE SET PERCENT SELECT */
            removeHtmlChilds(this.parentNode.parentNode.childNodes[1]);
            this.parentNode.parentNode.childNodes[1].appendChild(createSelectObject(createPercentArray(1,tmp_member.ava),'l','v','percent_'+tmp_name[1],'form-control ml-0 mr-0'));
            /* REMOVE SET WORKER SELECT */
            removeHtmlChilds(this.parentNode);
            tmpNode.appendChild(createWorkerArray(this.value,'pers_'+tmp_name[1],tmp_member.ImieNazwisko));
        };
    var selectTeamWorkerPercent=createSelectObject(createPercentArray(usedPercent,avaPercent),'l','v','percent_'+i,'form-control ml-0 mr-0');
    var dataOd=createDatePicker('ds_'+i,dataod,'n');
    var dataDo=createDatePicker('de_'+i,datado,'n');
    var rmBtn=createRemoveButton(i,'n');
        rmBtn.onclick=function()
        {
            correctAvaTeam(this.parentNode.parentNode.childNodes[0].childNodes[0].value,false);
            removeHtmlChilds(this.parentNode.parentNode);
        };
        
        divCol1.appendChild(selectTeamWorker);
        divCol2.appendChild(selectTeamWorkerPercent);
           
        divCol3.appendChild(dataOd);
        divCol4.appendChild(dataDo);
        divCol5.appendChild(rmBtn);
        
        divRow.appendChild(divCol1);
        divRow.appendChild(divCol2);
        divRow.appendChild(divCol3);
        divRow.appendChild(divCol4);
        divRow.appendChild(divCol5);
    ele.appendChild(divRow);
}
function createPercentArray(usedPercent,avaPercent)
{
    //console.log('USED PERCENT: '+usedPercent);
    console.log('AVALIABLE PERCENT: '+avaPercent);
    var max=parseInt(avaPercent,10)+1;
    //avaPercent++;
    var intPercent=parseInt(usedPercent,10);
    var percentObject= new Object();
    percentObject[0]={
        'v':intPercent,
        'l':usedPercent+'%'
    };
    for (var i=1;i<max;i++)
    {
        if(i!==intPercent)
        {
            percentObject[i]=
            {
                'v':i,
                'l':i+'%'
            };
        };
    };
    return percentObject;
}
function createWorkerArray(id,name,worker)
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
    for (const property in avaTeam)
    {
        setAvaliableWorker(s,avaTeam[property]);
    }
    //console.log(avaTeam);
    return s;      
}
function setAvaliableWorker(ele,worker)
{
    if(!worker.used)
    {
        var o2=createTag(worker.ImieNazwisko,'option','');
        o2.setAttribute('value',worker.id);
        ele.appendChild(o2);
    }
}
function correctAvaTeam(id,u)
{
    for (const property in avaTeam)
    {   
        if(parseInt(id,10)===parseInt(avaTeam[property].id,10))
        {
            avaTeam[property].used=u;
            console.log(avaTeam[property]);
            return avaTeam[property];
        } 
    }
    /* IF NOT FOUND => RETURN 0 !!!!! */
    return 0;
}
function getAvaTeamMember()
{
    var avaMember=new Object();
        avaMember.exist=false;

    for (const property in avaTeam)
    {   
        if(avaTeam[property].used!==true)
        {
            avaMember.exist=true;
            avaTeam[property].used=true;
            avaMember.member=avaTeam[property];
            break;
        } 
    }
    return avaMember;
}
function setAvaTeam()
{
    avaTeam=projectData['data']['value']['ava'];
    for (const property in avaTeam)
    {   
        avaTeam[property].used=false;
    }
}
