/*
 * CLASS Modal -> js/Main/Modal.js
 * CLASS TableNew -> js/Main/TableNew.js
 * CLASS Xhr -> js/Main/Xhr.js
 */
console.log(window.appUrl);
var error = false;
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
    Constant = new Object();
    Variable = new Object();
    Table = new Object();
    ErrorStack = new Object();
    Department = new Object();

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
        this.ErrorStack = new ErrorStack();
        this.Xhr=new Xhr2();
        this.Xhr2=new Xhr2();
        this.Department=new Department();
        this.Table = new Table(this.Xhr);
        //Items.setLoadInfo();
        this.Glossary={
            text:new Glossary(),
            list:new Glossary(),
            image:new Glossary()
        };
        this.Utilities = new Utilities();
        this.setLoadInfo();
        this.setLoadModalInfo(this.Xhr2); 
        this.Xhr2.setOnError(this.modalXhrError()); 
        this.Constant=new ProjectConstant(this);  
        this.Variable=new ProjectVariable(this); 
        this.Stage=new ProjectStage(this);
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
        this.Glossary['image'].fill(data.data.value['image']);
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
        var self= this;
        var f5 = function (e){
            //console.log('f5');
            e = e || window.event;
           if( self.wasPressed ) return; 

            if (e.keyCode === 116) {
                 //alert("f5 pressed");
                
            }else {
                //alert("Window closed");
            }
        };
        window.onbeforeunload = function() {
            return "Opuścić okno bez zapisu?";
        };
        document.onkeydown = function(){
            //console.log('onkeydown');
            f5();
        };
        document.onkeypress = function(){
            //console.log('onkeypress');
            f5();
        };
        document.onkeyup = function(){
            //console.log('onkeyup');
            f5();
        };

        this.Modal.setHead(title,titleClass);
        //$(ProjectItems.Modal.link['main']).modal('show');
        $(this.Modal.link['main']).modal({
            show:true,
            backdrop: 'static',
            keyboard: false  // to prevent closing with Esc button
        });
        // REMOVE data-dismiss="modal" 
        console.log(this.Modal.link['close'].parentNode);
        this.Modal.link['close'].parentNode.removeAttribute('data-dismiss');
    }
    setCloseModal(run){//classToRun,methodToRun,taskToRun,
        console.log('ProjectItems::setCloseModal()');
        /* SET CLOSE ACTION BUTTON */
        //var Items=this;
        /* CLOSURE */
        var self = this;
        var checkError = function (){
             if(self.ErrorStack.check()){
                    if (confirm('Opuścić okno bez zapisu?') === true) {
                        self.closeModal();
                        return false;
                    }
                    else{ 
                        return false;
                    }
               }
               console.log('run');
               console.log(run);
               if (confirm('Wyjść?') === true) {
                    run();
                }
            else{}
        };
        this.Modal.link['close'].onclick = function (){
            /* TO DO */
            checkError();
        };
         /* SET CLOSE VIA MOUSE */
        this.Modal.link['main'].onclick = function (e){
            
            if(e.target.id === 'AdaptedModal'){
                console.log('outside');
                checkError();
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
        /**/
        console.log('ProjectItems::getCancelButton()');
        console.log('Oboject:');
        console.log(classToRun);
        console.log('Method:');
        console.log(methodToRun);
        console.log('Task:');
        console.log(taskToRun);
        
        var cancel=this.Html.cancelButton('Anuluj');
        var self = this;
            cancel.onclick=function(){
                if (confirm('Anulować?') === true) {
                    self.Modal.closeModal();
                    window.onbeforeunload = null;
                    classToRun[methodToRun](taskToRun);
                }
                else{ 
                }
               
            };
        return cancel;
    }
    filter(value){
        console.log('ProjectItems::filter()');
        console.log(value);
    }
    hidden(ele){
        console.log('ProjectItems::hidden()');
        console.log(ele);
        if(ele.value==='n'){
            ele.value='y';
        }
        else{
            ele.value='n';
        }
    }
    deleted(ele){
        console.log('ProjectItems::deleted()');
        console.log(ele);
        if(ele.value==='n'){
            ele.value='y';
        }
        else{
            ele.value='n';
        }
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
    setLoadModalInfo(Xhr){
        console.log('ProjectItems::setLoadModalInfo()');
        var M = this.Modal;
            M.loadNotify='<img src="'+window.appUrl+'/img/loading_60_60.gif" alt="load_gif">';
        var start = function(){
                M.showLoad(); 
            };
        var end = function(){
                M.hideLoad();
            };
        Xhr.setOnLoadStart(start);
        Xhr.setOnLoadEnd(end);
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
            this.ErrorStack.add('main','Application error occurred! Contact with Administrator!');
            throw 'Application error occurred! Contact with Administrator!';
            return false;
        }
       
        if (!('status' in data) || !('info' in data)){
            console.log(data);
            this.ErrorStack.add('main','Application error occurred! Contact with Administrator!');
            throw 'Application error occurred! Contact with Administrator!';
        }
        else if(data.status===1){
            //this.ErrorStack.add('main',data.info);
            throw data.info;
        }
        else{
            
            return data;       
        }   
        return data;
    }
    setChangeDataState(i,t,f,g,btnLabel,titleClass,o,m,ta){
        console.log('ProjectItems::setChangeDataState()');
        console.log(i);
        /*
            i - id
            t - tile
            f - function to run
            g - glossary
            o - object
            m - method
            ta - task
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
        var self=this;
        var confirmButton=this.Html.confirmButton(btnLabel,'btn btn-'+titleClass,f);   
            /* CLOSURE */
            confirmButton.onclick = function () {  
                console.log('ProjectItems::setChangeDataState() onclick()');
                console.log('id:');
                console.log(i);
                console.log('title');
                console.log(t);
                console.log('function:');
                console.log(f);
                console.log('glossary:');
                console.log(g);
                console.log('object to run:');
                console.log(o);
                console.log('method to run:');
                console.log(m);
                console.log('method task:');
                console.log(ta);

                const fd = new FormData(form);
                var xhrRun={
                    t:'POST',
                    u:self.router+f,
                    c:true,
                    d:fd,
                    o:o,//Items,
                    m:m//'setModalResponse'
                };
                //var xhrError={
                //    o:Items,
                //    m:'setModalResponse'
                //};
                if(confirm('Potwierdź wykonanie akcji')){   
                    console.log(xhrRun);
                    //Items.Xhr2.setOnError(xhrError);
                    self.Xhr2.run(xhrRun);
                };
            };
             //self.Constant.ConstantTable.run(window.router+'getprojectsconstantslike&u=0&v=0&b='+idRecord);
        this.Modal.link['button'].appendChild(this.getCancelButton(o,m,ta));//this.default.object,this.default.method,this.default.task+i
        this.Modal.link['button'].appendChild(confirmButton);
    }
    closeModal(){
        console.log('ProjectItems::closeModal()');
        window.onbeforeunload = null;
        $(this.Modal.link['main']).modal('hide');
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
            return true;
        }
        catch (error) {
            console.log(error);
            /* SHOW ERROR MODAL */ 
           this.Modal.setError(error);
           //this.Html.showField(this.Modal.link['error'],error);
           return false;
        }
        return false;
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
try{
    var Items = new ProjectItems(window.appUrl,window.appUrl+'/router.php?task=');
}
catch (e){
    console.log(e);
    error=true;
    alert('Something went wrong! Contact with administrator!');    
}
if(error===false){
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
}

