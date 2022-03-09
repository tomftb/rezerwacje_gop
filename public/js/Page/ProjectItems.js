console.log('ProjectItems');
/*
 * CLASS Modal -> js/Main/Modal.js
 * CLASS TableNew -> js/Main/TableNew.js
 * CLASS Xhr -> js/Main/Xhr.js
 */
console.log(window.appUrl);
class ProjectItems{
    static Modal;
    static Html;
    static url='';
    static appurl='';
    static Xhr={};
    static Stage;
    static const;
    static loadModal;
    static ManageGlossary;
    static XhrAction={
        classToRun:{},
        methodToRun:'',
        taskToRun:''
    };
    static setError(ele,error){
        console.log('ProjectStage::setError()');
        console.log(ele);
        ProjectItems.Modal.showField(ele,error);
        
    }
    static unsetError(ele){
        ProjectItems.Modal.hideAndClearField(ele);
    }
    static getJsonResponse(errLink,response){
        console.log('ProjectItems::getJsonResponse()');
        console.log(response);
        try {
            return JSON.parse(response);    
        }
        catch (error) {
            ProjectItems.setError(errLink,error);
            return false;
        } 
        return false;
    }
    static checkResponseError(ele,jsonResponse){
        console.log('ProjectItems::checkResponseError()');
        /*
         * ele -> link to html element
         * jsonResponse -> response data from backend
         * errorStatus -> overall error status
         */
        if(parseInt(jsonResponse['status'],10)===1){
            ProjectItems.setError(ele,jsonResponse['info']);
            return true;
        }
        else{
            ProjectItems.unsetError(ele); 
            return false;
        }
    }
    static setError(ele,info){
        console.log('ProjectItems::setError()');
        ProjectItems.Html.showField(ele,info);
        $(ProjectItems.Modal.link['main']).modal('show');
    }
    static unsetError(ele){
        ProjectItems.Html.hideAndClearField(ele);
    }
    static setModalInfo(value){
        console.log('ProjectItems::setModalInfo()');
        var textInfo=document.createElement('small');
            textInfo.setAttribute('class','text-left text-secondary ml-1');
            textInfo.innerHTML=value;
        ProjectItems.Modal.link['info'].appendChild(textInfo);
    }
    static setChangeStateFields(ele,sloData)
    { 
        console.log('ProjectItems::setChangeStateFields()');
       
        
        var p=document.createElement('P');
            p.setAttribute('class','text-left');
            p.innerText='Podaj Powód:';
            
        var extraSelect=document.createElement('INPUT');
            extraSelect.setAttribute('type','text');
            extraSelect.setAttribute('id','extra');
            extraSelect.setAttribute('name','extra');
            extraSelect.setAttribute('class','form-control mb-1');
            extraSelect.setAttribute('PLACEHOLDER','Wprowadź powód');
            extraSelect.style.display = "none";
            
            sloData.push({
                            'ID' : "0",
                            'Nazwa' : 'Inny:'
                        });
        var select=ProjectItems.Html.createSelectFromObject(sloData,'Nazwa','reason','form-control mb-1');
            select.onchange = function() { 
                ProjectItems.checkReason(this,'extra'); 
            };
        ele.appendChild(p); 
        ele.appendChild(select); 
        ele.appendChild(extraSelect); 
        return '';
    }
    static  checkReason(t,id){
        console.log('ProjectItems::checkReason()');
        var splitValue=t.value.split("|");
        if(splitValue[0]==='0'){
            document.getElementById(id).style.display = "block";
        }
        else{
             document.getElementById(id).style.display = "none";
        };
    }
    static setDefaultModal(){
        console.log('ProjectItems::setDefaultModal()');
        try{
            ProjectItems.Modal.setLink();
            ProjectItems.Modal.clearData();
            ProjectItems.Modal.loadNotify='<img src="'+ProjectItems.appurl+'/img/loading_60_60.gif" alt="load_gif">';
            ProjectItems.Modal.showLoad();
        }
        catch (error){
            console.log(error);
            alert('ProjectItems::setDefaultModal() Error occured!');
        }
    }
    static prepareModal(title,titleClass){
        console.log('ProjectItems::prepareModal()');
        ProjectItems.Modal.setLink();
        ProjectItems.Modal.clearData();
        ProjectItems.Modal.setHead(title,titleClass);
        //$(ProjectItems.Modal.link['main']).modal('show');
        $(ProjectItems.Modal.link['main']).modal({
            show:true,
            backdrop: 'static',
            keyboard: false  // to prevent closing with Esc button (if you want this too)
        });
    }
    static setCloseModal(classToRun,methodToRun,taskToRun){
        console.log('ProjectItems::setCloseModal()');
        /* SET CLOSE ACTION BUTTON */
        ProjectItems.Modal.link['close'].onclick = function (){
            ProjectItems.Modal.closeModal();
            ProjectItems.reloadData(classToRun,methodToRun,taskToRun);
        };
         /* SET CLOSE VIA MOUSE */
        ProjectItems.Modal.link['main'].onclick = function (e){
            
            if(e.target.id === 'AdaptedModal'){
                console.log('outside');
                if (confirm('Wyjść?') === true) {
                    /* TO DO -> TURN OFF CLOSE MODAL */
                    ProjectItems.Modal.closeModal();
                    ProjectItems.reloadData(classToRun,methodToRun,taskToRun);
                }
                else{
                    
                }
               
            }
            else {}
        };
       
        //
    }
    static reloadData(classToRun,methodToRun,taskToRun){
        console.log('ProjectItems::reloadData()');
        console.log(classToRun);
        console.log(methodToRun);
        console.log(taskToRun);
        ProjectItems.Xhr.setRun(classToRun,methodToRun);
        ProjectItems.Xhr.run('GET',null,ProjectItems.router+taskToRun);
    }
    static setProperties(){
        console.log('ProjectItems::setProperties()');
        try{
            //ProjectItems.loadModal='<div class="modal" tabindex="-1" role="dialog"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"></div><div class="modal-body"></div><div class="modal-footer"></div></div></div></div>';
            /* LOAD NOTIFY FRO HEAD*/
            //console.log(document.getElementById('appLoadNotify'));
            ProjectItems.Xhr.load=document.getElementById('appLoadNotify');
            //ProjectItems.Xhr.load=ProjectItems.loadModal;
        }
        catch (error){
            console.log(error);
            alert('ProjectItems::setProperties() Error occured!');
        }
    }
    static getCancelButton(classToRun,methodToRun,taskToRun){
        console.log('ProjectItems::getCancelButton()');
        console.log(classToRun);
        console.log(methodToRun);
        console.log(taskToRun);
        var cancel=ProjectItems.Html.cancelButton('Anuluj');
            cancel.onclick=function(){
                ProjectItems.Modal.closeModal();
                ProjectItems.reloadData(classToRun,methodToRun,taskToRun);
            };
        return cancel;
    }
    static filterData(value){
        console.log('ProjectItems::filterData()');
        console.log(value);
    }
    static filterHiddenData(ele){
        console.log('ProjectItems::filterData()');
        console.log(ele);
        //console.log('===showHidden()===\n'+ele.value);
        //changeBoxValue(ele);
        //defaultTask='getprojectsstagelike&v='+ele.value;
        //findData(document.getElementById('findData').value);
    }
}

/*
 * SET CLASS
 */

Modal.Html=new Html();
ProjectItems.Html=new Html();
ProjectItems.Modal=Modal;
ProjectItems.Xhr=Xhr;
ProjectItems.router=window.appUrl+'/router.php?task=';
ProjectItems.appurl=window.appUrl;
ProjectItems.Stage=ProjectStage;
ProjectItems.ManageGlossary=new ManageGlossary;



ProjectStage.Xhr=Xhr;
ProjectStage.ProjectStageTable=new ProjectStageTable(ProjectStage,new Xhr2(),new Html());
ProjectStage.Modal=Modal;
ProjectStage.Html=new Html();
ProjectStage.Items=ProjectItems;
ProjectStage.CreateText=new ProjectStageCreateText();
ProjectStage.CreateImage=ProjectStageCreateImage;
ProjectStage.CreateTable=ProjectStageCreateTable;
ProjectStage.CreateList=ProjectStageCreateList;

ProjectConst.Xhr=Xhr;
//ProjectConst.Table=TableNew;
ProjectConst.Modal=Modal;
ProjectConst.Html=new Html();
ProjectConst.Items=ProjectItems;
//ProjectConst.ProjectConstTable=ProjectConstTable;
ProjectConst.ProjectConstTable=new ProjectConstTable(ProjectConst,new Xhr2(),new Html());

/*
 * SET DEFAULT TASK TO RUN
 */

ProjectItems.Stage.show();
/* MUST BE SECOND */

window.addEventListener('load', (event) => {
  console.log('page is fully loaded');
  //alert('page is fully loaded');
  ProjectItems.setProperties();
});