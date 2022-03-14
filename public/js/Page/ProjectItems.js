/*
 * CLASS Modal -> js/Main/Modal.js
 * CLASS TableNew -> js/Main/TableNew.js
 * CLASS Xhr -> js/Main/Xhr.js
 */
console.log(window.appUrl);
class ProjectItems{
    Modal = new Object();
    Html = new Object();
    router='';
    appurl='';
    Xhr = new Object();
    Stage = new Object();
    Const = new Object();
    loadModal;
    //defaultTask='getprojectsstagelike&d=0&v=0&b=';
    default={
            object:{},
            method:'',
            task:'getprojectsstagelike&d=0&v=0&b='
    };
    Glossary=new Object();


    constructor(appurl,url){
        console.log('ProjectItems::constructor()'); 
        this.setUrl(appurl,url);
       
        this.Html=new Html();
        this.Modal=new Modal();
        this.Xhr=new Xhr2();

        //Items.setLoadInfo();
        this.Glossary={
            text:new Glossary()
        };
        this.Stage=new ProjectStage(this);
        this.Const=new ProjectConst(this);
    }
    setUrl(appurl,url){
        console.log('ProjectItems::setUrl()'); 
        this.router=url;
        this.appurl=appurl; 
    }
    showStage(){
        console.log('ProjectItems::showStage()');
        this.Stage.Table.setLink();
        this.Stage.show();
    }
    setError(ele,error){
        console.log('ProjectItems::setError()');
        console.log(ele);
        ProjectItems.Modal.showField(ele,error);
        
    }
    unsetError(ele){
        ProjectItems.Modal.hideAndClearField(ele);
    }
    getJsonResponse(errLink,response){
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
    checkResponseError(ele,jsonResponse){
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
    setModalError(response){
        console.log('ProjectItems::setModalError()');
        console.log(response);
        this.Html.showField(this.Modal.link['error'],response);
    }
    unsetError(ele){
        ProjectItems.Html.hideAndClearField(ele);
    }
    setModalInfo(value){
        console.log('ProjectItems::setModalInfo()');
        var textInfo=document.createElement('small');
            textInfo.setAttribute('class','text-left text-secondary ml-1');
            textInfo.innerHTML=value;
        this.Modal.link['info'].appendChild(textInfo);
    }
    setChangeStateFields(ele,sloData)
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
        var select=this.Html.createSelectFromObject(sloData,'Nazwa','reason','form-control mb-1');
        var Items=this;
            select.onchange = function() { 
                Items.checkReason(this,'extra'); 
            };
        ele.appendChild(p); 
        ele.appendChild(select); 
        ele.appendChild(extraSelect); 
        return '';
    }
    checkReason(t,id){
        console.log('ProjectItems::checkReason()');
        var splitValue=t.value.split("|");
        if(splitValue[0]==='0'){
            document.getElementById(id).style.display = "block";
        }
        else{
             document.getElementById(id).style.display = "none";
        };
    }
    setDefaultModal(){
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
    prepareModal(title,titleClass){
        console.log('ProjectItems::prepareModal()');
        this.Modal.setLink();
        this.Modal.clearData();
        this.Modal.setHead(title,titleClass);
        //$(ProjectItems.Modal.link['main']).modal('show');
        $(this.Modal.link['main']).modal({
            show:true,
            backdrop: 'static',
            keyboard: false  // to prevent closing with Esc button (if you want this too)
        });
    }
    setCloseModal(classToRun,methodToRun,taskToRun){
        console.log('ProjectItems::setCloseModal()');
        /* SET CLOSE ACTION BUTTON */
        var Items=this;
        /* CLOSURE */
        this.Modal.link['close'].onclick = function (){
            Items.Modal.closeModal();
            Items.reloadData(classToRun,methodToRun,taskToRun);
        };
         /* SET CLOSE VIA MOUSE */
        this.Modal.link['main'].onclick = function (e){
            
            if(e.target.id === 'AdaptedModal'){
                console.log('outside');
                if (confirm('Wyjść?') === true) {
                    /* TO DO -> TURN OFF CLOSE MODAL */
                    Items.Modal.closeModal();
                    Items.reloadData(classToRun,methodToRun,taskToRun);
                }
                else{ 
                }
            }
            else {}
        };
    }
    reloadData(classToRun,methodToRun,taskToRun){
        console.log('ProjectItems::reloadData()');
        console.log(classToRun);
        console.log(methodToRun);
        console.log(taskToRun);
        /*
         * property:
         * t = type GET/POST 
         * u = url
         * c = capture
         * d = data
         * o = object
         * m = method
         */
        var xhrRun={
            t:'GET',
            u:this.router+taskToRun,
            //u:'asdasd',
            c:true,
            d:null,
            o:classToRun,
            m:methodToRun
        };
        this.Xhr.run(xhrRun);
        //ProjectItems.Xhr.setRun(classToRun,methodToRun);
        //ProjectItems.Xhr.run('GET',null,ProjectItems.router+taskToRun);
    }
    setProperties(){
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
   //loadOff(){
     //   console.log('ProjectItems::loadOff()');
        /* TO DO */
        //ProjectItems.Xhr.load=document.getElementById('appLoadNotify');
       // this.Html.hideField();
   // }
    getCancelButton(classToRun,methodToRun,taskToRun){
        console.log('ProjectItems::getCancelButton()');
        console.log('Oboject:');
        console.log(classToRun);
        console.log('Method:');
        console.log(methodToRun);
        console.log('Task:');
        console.log(taskToRun);
        var cancel=this.Html.cancelButton('Anuluj');
        var Items = this;
            cancel.onclick=function(){
                Items.Modal.closeModal();
                Items.reloadData(classToRun,methodToRun,taskToRun);
            };
        return cancel;
    }
    filterData(value){
        console.log('ProjectItems::filterData()');
        console.log(value);
    }
    filterHiddenData(ele){
        console.log('ProjectItems::filterData()');
        console.log(ele);
        //console.log('===showHidden()===\n'+ele.value);
        //changeBoxValue(ele);
        //defaultTask='getprojectsstagelike&v='+ele.value;
        //findData(document.getElementById('findData').value);
    }
    setLoadInfo(){
        console.log('ProjectItems::setLoadInfo()');
        var start = function(){
                    var g = document.getElementById('appLoadNotify');
                    g.classList.remove("d-none");
                    g.classList.add("d-block");
            };
        var end = function(){
                    var g = document.getElementById('appLoadNotify');
                    g.classList.remove("d-block");
                    g.classList.add("d-none");
            };
        this.Xhr.setOnLoadStart(start);
        this.Xhr.setOnLoadEnd(end);
    }
    parseResponse(response){
        console.log('ProjectItems::parseResponse()');
        var data = JSON.parse(response);  
        if (!('status' in data) || !('info' in data)){
            console.log(data);
            throw 'Application error occurred! Contact with Administrator!';
        }
        else if(data.status===1){
            throw data.info;
        }
        else{
            return data;       
        }   
        return data;
    }

    setChangeDataState(data,btnLabel,titleClass){
        console.log('ProjectItems::setChangeDataState()');
        console.log(data['data']);
        var form=this.Html.getForm();
        var h=document.createElement('H5');
            h.setAttribute('class','text-'+titleClass+' mb-3 text-center font-weight-bold');
            h.innerHTML=data['data']['value']['stage'].t;
        
        form.appendChild(this.Html.getInput('id',data['data']['value']['stage'].i,'hidden'));
        this.setChangeStateFields(form,data['data']['value']['slo']);
        this.Modal.link['form']=form; 
        this.Modal.link['adapted'].appendChild(h);
        this.Modal.link['adapted'].appendChild(form);
        var Items=this;
        var confirmButton=this.Html.confirmButton(btnLabel,'btn btn-'+titleClass,data['data']['function']);   
            /* CLOSURE */
            confirmButton.onclick = function () {  
                console.log('ProjectItems::setChangeDataState() onclick()');
                const fd = new FormData(form);
                var xhrRun={
                    t:'POST',
                    u:Items.router+data['data']['function'],
                    //u:'asdasd',
                    c:true,
                    d:fd,
                    o:Items,
                    m:'closeModal'
                };
                var xhrError={
                    o:Items,
                    m:'setModalError'
                };
                /* SET XHR ON ERROR */
                
                if(confirm('Potwierdź wykonanie akcji')){   
                    Items.Modal.link['extra'].innerHTML='<center><img src="/img/loading_60_60.gif"/></center>';
                    //Items.Xhr.run('POST',fd,Items.router+data['data']['value']['stage'].i);
                    Items.Xhr.setOnError(xhrError);
                    Items.Xhr.run(xhrRun);
                };
            };
        this.Modal.link['button'].appendChild(this.getCancelButton(this.default.object,this.default.method,this.default.task+data['data']['value']['stage'].i));
        this.Modal.link['button'].appendChild(confirmButton);
        /*
         * INFO
         */
        this.setModalInfo("Project Stage ID: "+data['data']['value']['stage'].i+", Create user: "+data['data']['value']['stage'].cu+" ("+data['data']['value']['stage'].cul+"), Create date: "+data['data']['value']['stage'].cd);
        
    }
    closeModal(){
        console.log('ProjectItems::closeModal()');
        $(this.Modal.link['main']).modal('hide');
        /* TO DO SET CLASS, OBJECT */
        this.reloadData(Items.Stage,'show',this.default.task);
    }
}

var Items = new ProjectItems(window.appUrl,window.appUrl+'/router.php?task=');

window.addEventListener('load', function(){
    console.log('page is fully loaded');
    try{
        Items.setLoadInfo();
        //Items.loadGif=;
        //Items.Xhr.setOnLoadStart(Items,'loadGif');
        //Items.Xhr.setOnLoadEnd(Items,'unloadGif');
        Items.showStage();
        Items.Modal.setLink();
    }
    catch (error){
        console.log(error);
        alert('ProjectItems::load() Error occured!');
    }
}
,false);
