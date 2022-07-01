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
    /* FOR TABLE */
    Xhr = new Object();
    /* FOR MODAL */
    Xhr2 = new Object();
    Stage = new Object();
    Const = new Object();
    Table = new Object();
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
        this.Xhr2=new Xhr2();
        this.Table = new Table(this.Xhr);
        //Items.setLoadInfo();
        this.Glossary={
            text:new Glossary(),
            list:new Glossary()
        };
        this.setLoadInfo();
        this.setLoadModalInfo(); 
        this.Xhr2.setOnError(this.modalXhrError()); 
        this.Stage=new ProjectStage(this);
        this.Const=new ProjectConst(this);
        
    }
    getXhrParm(type,task,method){
        return {
                t:type,
                u:this.router+task,
                c:true,
                d:null,
                o:this,
                m:method
            };
    }
    setUpParameters(){
        console.log('ProjectItems::setUpParameters()'); 
        /* TO DO -> EXTEND FOR ALL GLOSSARY */
        this.Xhr.run(this.getXhrParm('GET','getNewStageDefaults&type=tx','setUpGlossary'));
    }
    setUpGlossary(response){
        var data = this.setTableResponse(response);
        //console.log(data);
        this.Glossary['text'].fill(data.data.value['text']);
        this.Glossary['list'].fill(data.data.value['list']);
        //console.log(this.Glossary);
        /* SETUP STAGE PROPERTY */
        this.Stage.Property.setData(this.Glossary);
        /* run default table table */
        this.Stage.show();
    }
    setUrl(appurl,url){
        console.log('ProjectItems::setUrl()'); 
        this.router=url;
        this.appurl=appurl; 
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
        //this.Modal.setLink();
        
        this.Modal.setHead(title,titleClass);
        //$(ProjectItems.Modal.link['main']).modal('show');
        $(this.Modal.link['main']).modal({
            show:true,
            backdrop: 'static',
            keyboard: false  // to prevent closing with Esc button (if you want this too)
        });
        // REMOVE data-dismiss="modal" 
        console.log(this.Modal.link['close'].parentNode);
        this.Modal.link['close'].parentNode.removeAttribute('data-dismiss');
    }
    setCloseModal(classToRun,methodToRun,taskToRun){
        console.log('ProjectItems::setCloseModal()');
        /* SET CLOSE ACTION BUTTON */
        var Items=this;
        /* CLOSURE */
        this.Modal.link['close'].onclick = function (){
            /* TO DO */
            if (confirm('Wyjść?') === true) {
                Items.Modal.closeModal();
                Items.reloadData(classToRun,methodToRun,taskToRun);
            }
            else{}
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
        /* CLEAR TABLE */
        this.Table.clearTable();   
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
    }
    setProperties(){
        console.log('ProjectItems::setProperties()');
        try{
            ProjectItems.Xhr.load=document.getElementById('appLoadNotify');
        }
        catch (error){
            console.log(error);
            alert('ProjectItems::setProperties() Error occured!');
        }
    }
    getCancelButton(classToRun,methodToRun,taskToRun){
        /*
        console.log('ProjectItems::getCancelButton()');
        console.log('Oboject:');
        console.log(classToRun);
        console.log('Method:');
        console.log(methodToRun);
        console.log('Task:');
        console.log(taskToRun);
        */
        var cancel=this.Html.cancelButton('Anuluj');
        var Items = this;
            cancel.onclick=function(){
                if (confirm('Anulować?') === true) {
                    /* TO DO -> TURN OFF CLOSE MODAL */
                    Items.Modal.closeModal();
                    Items.reloadData(classToRun,methodToRun,taskToRun);
                }
                else{ 
                }
               
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
    setLoadModalInfo(){
        console.log('ProjectItems::setLoadModalInfo()');
        var M = this.Modal;
            M.loadNotify='<img src="'+window.appUrl+'/img/loading_60_60.gif" alt="load_gif">';
        var start = function(){
                M.showLoad(); 
            };
        var end = function(){
                M.hideLoad();
            };
        this.Xhr2.setOnLoadStart(start);
        this.Xhr2.setOnLoadEnd(end);
    }
    parseResponse(response){
        console.log('ProjectItems::parseResponse()');
        try {
            var data = JSON.parse(response);  
        }
        catch (error){
            console.log('RESPONSE:');
            console.log(response);
            console.log('ERROR:');
            console.log(error);
            throw 'Application error occurred! Contact with Administrator!';
            return false;
        }
       
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

    setChangeDataState(i,t,f,g,btnLabel,titleClass){
        console.log('ProjectItems::setChangeDataState()');
        /*
            i - id
            t - tile
            f - function to run
            g - glossary
        */
        
        var form=this.Html.getForm();
        var h=document.createElement('H5');
            h.setAttribute('class','text-'+titleClass+' mb-3 text-center font-weight-bold');
            h.innerHTML=t;
        
        form.appendChild(this.Html.getInput('id',i,'hidden'));
        this.setChangeStateFields(form,g);
        this.Modal.link['form']=form; 
        this.Modal.link['adapted'].appendChild(h);
        this.Modal.link['adapted'].appendChild(form);
        var Items=this;
        var confirmButton=this.Html.confirmButton(btnLabel,'btn btn-'+titleClass,f);   
            /* CLOSURE */
            confirmButton.onclick = function () {  
                console.log('ProjectItems::setChangeDataState() onclick()');
                const fd = new FormData(form);
                var xhrRun={
                    t:'POST',
                    u:Items.router+f,
                    c:true,
                    d:fd,
                    o:Items,
                    m:'setModalResponse'
                };
                //var xhrError={
                //    o:Items,
                //    m:'setModalResponse'
                //};
                if(confirm('Potwierdź wykonanie akcji')){   
                    //Items.Xhr2.setOnError(xhrError);
                    Items.Xhr2.run(xhrRun);
                };
            };
        this.Modal.link['button'].appendChild(this.getCancelButton(this.default.object,this.default.method,this.default.task+i));
        this.Modal.link['button'].appendChild(confirmButton);
    }
    closeModal(){
        console.log('ProjectItems::closeModal()');
        $(this.Modal.link['main']).modal('hide');
        /* TO DO SET CLASS, OBJECT */
        this.reloadData(this.default.object,this.default.method,this.default.task);
    }
    setTableResponse(response){
        console.log('ProjectItems::setTableResponse()');
        //console.log(response);
        try {
            return this.parseResponse(response);
        }
        catch (error) {
            console.log(error);
            /* SHOW ERROR MODAL */ 
            this.Table.setError(error);
            return {};
        }
        return {};
    }
    setModalResponse(response){
        console.log('ProjectItems::setModalResponse()');
        console.log(response);
        try {
            this.parseResponse(response);
            /* CLOSE MODAL IF OK */
            this.closeModal(); 
        }
        catch (error) {
            console.log(error);
            /* SHOW ERROR MODAL */ 
           this.Html.showField(this.Modal.link['error'],error);
        }
    }
    setFieldResponse(response){
        console.log('ProjectItems::setFieldResponse()');
        try {
            return this.parseResponse(response);
            /* TO DO -> set value to field if ok */
        }
        catch (error) {
            console.log(error);
            /* SHOW ERROR MODAL */ 
            this.Html.showField(this.Modal.link['error'],error);
            return false;
        }
        return false;
    }
    uploadFile(response){
        
        var data = this.setFieldResponse(response);
        if(data===false){
            return false;
        }
            console.log(data);
            console.log(data.data);
        var win = window.open('router.php?task='+data['data']['function']+'&file='+data['data']['value'], '_blank');
            win.focus();
    }
    setUpModalData(response){
        console.log('ProjectItems::setUpModalData()');
        var data={};
        try {
            data=this.parseResponse(response);
        }
        catch (error) {
            console.log(error);
            this.Html.showField(this.Modal.link['error'],error);
        } 
        return data;
    }
    modalXhrError(){
        console.log('ProjectItems::modalXhrError()');
         var xhrError={
            o:this,
            m:'setModalError'
        };
        return xhrError;
    }
    count(o){
    /* 
     * 0 - object to count
     */
        var i=0;
        for (const prop in o){
            i++;
        }
        return i;
    }
}

var Items = new ProjectItems(window.appUrl,window.appUrl+'/router.php?task=');

window.addEventListener('load', function(){
    //console.log('page is fully loaded');
    try{
        Items.Modal.setLink();
        Items.Table.setLink();
        /* SETUP PARAMETERS => Glossary */
        Items.setUpParameters();
    }
    catch (error){
        console.log(error);
        alert('ProjectItems::load() Error occured!');
    }
}
,false);
