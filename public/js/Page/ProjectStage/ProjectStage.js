
class ProjectStage{
    fieldDisabled='y';
    projectData=new Object();
    actDay = getActDate();
    actStageData=new Object();
    loggedUserPerm=new Array();
    errorStatus=false;
    router='';
    //defaultTask='getprojectsstagelike&p=b&d=0&v=0&b=';
    data={};
    Items = new Object();
    inputFieldCounter=0;
    fieldDisabled='n';
    StageTable = new Object();
    //CreateText = new Object;
    CreateImage = new Object();
    CreateTable = new Object();
    Create = new Object();
    Tool = new Object();
    //CreateList = new Object;
    Property = new Object();
    Xhr=new Object();
    constructor(Items){
        //console.log('ProjectStage::construct()');
        this.Xhr=Items.Xhr2;
        this.router=Items.router;
        this.Items = Items;
        //console.log(Items);
        //console.log(this.Items.router);
        this.Tool = new Tool();
        this.Property = new ProjectStageProperty();
        this.StageTable = new ProjectStageTable(this);  
        this.StageTable.setProperties(this.Items.appurl,this.Items.router);
        this.CreateImage = new ProjectStageCreateImage();
        this.CreateTable = new ProjectStageCreateTable();
        this.Create = new ProjectStageCreate(this);
    }
    show(){
        //console.log('ProjectStage::show()');  
        /* SET PAGE TITLE */
        document.getElementById('headTitle').innerHTML='Etapy';
        //console.log(this.StageTable);     
        this.setDefault('show','getprojectsstagelike&p=b&d=0&v=0&b=');
        this.StageTable.detailsTask='detailsText';
        this.runShow('show');
    }
    showFooter(){
        document.getElementById('headTitle').innerHTML='Stopka';
        this.setDefault('showFooter','getprojectsstagelike&p=f&d=0&v=0&b=');
        this.StageTable.detailsTask='detailsFooter';
        this.runShow('showFooter');
    }
    showHeading(){
        document.getElementById('headTitle').innerHTML='Nagłówek';
        this.setDefault('showHeading','getprojectsstagelike&p=h&d=0&v=0&b=');
        this.StageTable.detailsTask='detailsHeading';
        this.runShow('showHeading');
    }
    runShow(){
        this.StageTable.run(this.Items.default.task);
    }
    prepare(response,btnLabel,btnClass){
        //console.log('ProjectStage::prepare()');
        //console.log(response);
        
            /* SET UP STAGE DATA */
            var data=this.Items.parseResponse(response);
            /* SET UP GLOSSARY */
            //this.Items.Glossary
            /* RUN MODAL */
            this.Items.Modal.clearData();
            var self=this;
            var run = function(){
                self.Items.closeModal();
                self.Items.reloadData(self,'setResponse','getprojectsstagelike&d=0&v=0&b='+data['data']['value']['stage'].i);
            };
            //this.Items.setCloseModal(this,'show',this.defaultTask+data['data']['value']['stage'].i);
            this.Items.setCloseModal(run);
            this.Items.setChangeDataState(data['data']['value']['stage'].i,data['data']['value']['stage'].t,data['data']['function'],data['data']['value']['slo'],btnLabel,btnClass,this,'setResponse',this.Items.router+this.defaultTask+data['data']['value']['stage'].i);
            this.Items.Modal.setInfo("Project Stage ID: "+data['data']['value']['stage'].i+", Create user: "+data['data']['value']['stage'].cu+" ("+data['data']['value']['stage'].cul+"), Create date: "+data['data']['value']['stage'].cd);
    }
    hide(response){
        //console.log('ProjectStage::hide()');
        try{
            this.prepare(response,'Ukryj','secondary');
        }
        catch(error){
            console.log(error);
            this.StageTable.Table.setError('An Application Error Has Occurred!');
            return false;
        };
        /* RUN MODAL IN second try to prevent hide error */
        try{
           this.Items.prepareModal('Ukrywanie Etapu Projektu','bg-secondary');
        }
        catch(error){
            console.log(error);
            this.ConstTable.Table.setError(error);
        }
    }
    remove(response){
        //console.log('ProjectStage::remove()');
        try{
            this.prepare(response,'Usuń','danger');
        }
        catch(error){
            console.log(error);
            this.StageTable.Table.setError('An Application Error Has Occurred!');
            return false;
        };
        /* RUN MODAL IN second try to prevent hide error */
        try{
            this.Items.prepareModal('Usuwanie Etapu Projektu','bg-danger');
        }
        catch(error){
            console.log(error);
            this.ConstTable.Table.setError(error);
        }
    }
    createText(){
        //console.log('ProjectStage::createText()');
        this.setDefault('show','getprojectsstagelike&p=b&d=0&v=0&b=');
        this.runCreate('prepareText','t','b');//getprojectsstagelike&p=b&d=0&v=0&b=
    }
    createImage(){
        //console.log('ProjectStage::createImage()');
    }
    createTable(){
        //console.log('ProjectStage::createTable()');
    }
    createList(){
        //console.log('ProjectStage::createList()');
        this.setDefault('show','getprojectsstagelike&p=b&d=0&v=0&b=');
        this.runCreate('prepareList','l','b');//getprojectsstagelike&p=b&d=0&v=0&b=
    }
    createFooter(){
        //console.log('ProjectStage::createFooter()');
        this.setDefault('showFooter','getprojectsstagelike&p=f&d=0&v=0&b=');
        this.runCreate('prepareFooter','t','f');//getprojectsstagelike&p=f&d=0&v=0&b=
    }
    createHeading(){
        //console.log('ProjectStage::createHeading()');
        this.setDefault('showHeading','getprojectsstagelike&p=h&d=0&v=0&b=');
        this.runCreate('prepareHeading','t','h');//getprojectsstagelike&p=h&d=0&v=0&b=
    }
    runCreate(r,t,p){
        /*
         * r - method name to run
         * t - type (t - text, l - list)
         * p - document part (h - head, b - body, f - footer)
         */
        try{
            this.Create.type=t;
            this.Create.part=p;
            this.Xhr.run({
                t:'GET',
                u:this.router+'getProjectVariablesSimpleList&u=0&v=0&b=0',
                c:true,
                d:null,
                o:this.Create,
                m:r
            });
        }
        catch(error){
            console.log(error);
            this.StageTable.Table.setError(error);
            return false;
        };
    }
    detailsText(response){
         //console.log('ProjectStage::detailsText/list()');
         this.setDefault('show','getprojectsstagelike&p=b&d=0&v=0&b=');
         this.runDetails(response,'detailsText');
    }
    detailsHeading(response){
         //console.log('ProjectStage::detailsHeading()');
         this.setDefault('showHeading','getprojectsstagelike&p=h&d=0&v=0&b=');
         this.runDetails(response,'detailsHeading');
    }
    detailsFooter(response){
         //console.log(response,'ProjectStage::detailsFooter()');
         this.setDefault('showFooter','getprojectsstagelike&p=f&d=0&v=0&b=');
         this.runDetails(response,'detailsFooter');
    }
    runDetails(response,run){
         /*
          * response - response
         * run - method name to run
         */
        try{
            /* PARSE RESPONSE */
            var r=this.Items.parseResponse(response);
            /* RUN */
            this.Create[run](r.data);
        }
        catch(error){
            console.log(error);
            this.StageTable.Table.setError(error);
            return false;
        }; 
    }

    setResponse(response){
        //console.log('ProjectStage.setResponse()');
        if(this.Items.setModalResponse(response)){
            this.StageTable.setBody(response);
        }
    }
    setDefault(m,t){
        this.Items.default={
            task:t,
            object:this,
            method:m
        };
    }
}
