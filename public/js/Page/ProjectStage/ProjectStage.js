
class ProjectStage{
    fieldDisabled='y';
    projectData=new Object();
    actDay = getActDate();
    actStageData=new Object();
    loggedUserPerm=new Array();
    errorStatus=false;
    router='';
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
    /*
        Default Stage part:
        b - body
        h - head
        f - footer
    */
    url={
        primary:'getProjectStages',
        active:'getProjectStages',
        hidden:'getProjectHiddenStages',
        deleted:'getProjectDeletedStages',
        hiddenAndDeleted:'getProjectHiddenAndDeletedStages',
        all:'getProjectAllStages'
    };
    title={
        stage:{
            label:'Etapy',
            'text-color':'text-info'
        },
        footer:{
            label:'Stopka',
            'text-color':'text-brown'
        },
        heading:{
            label:'Nagłówek',
            'text-color':'text-brown'
        }
    };
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
    clearShow(){
        console.log('ProjectStage::clearShow()');
        this.Items.default['part']='b';
        this.Items.setClearDefault(this,'show',this.title.stage);
        this.StageTable.detailsTask='detailsText';
        this.Items.setTitle();
        this.show();
    }
    show(){
        console.log('ProjectStage::show()');
        console.log(this.Items.default);
        var action={
            'u':this.Items.default.url.active,
            'd':this.getFilterData(0)
        };
        this.StageTable.runPOST(action);
    }
    showFooter(){
        console.log('ProjectStage::showFooter()');
        this.Items.default['part']='f';
        this.Items.setClearDefault(this,'showFooter',this.title.footer);
        this.StageTable.detailsTask='detailsFooter';
        var action={
            'u':this.Items.default.url.active,
            'd':this.getFilterData(0)
        };
        this.Items.setTitle();
        this.StageTable.runPOST(action);
    }
    showHeading(){
        console.log('ProjectStage::showHeading()');
        this.Items.default['part']='h';
        this.Items.setClearDefault(this,'showHeading',this.title.heading);
        this.StageTable.detailsTask='detailsHeading';
        var action={
            'u':this.Items.default.url.active,
            'd':this.getFilterData(0)
        };
        this.Items.setTitle();
        this.StageTable.runPOST(action);
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
            var fd = this.getFilterData(data['data']['value']['stage'].i) 
            var run = function(){
                self.Items.closeModal();  
                self.Items.filterOutReloadData(fd,'setResponse');
            };
            this.Items.setCloseModal(run);
            this.Items.setChangeDataState(data['data']['value']['stage'].i,data['data']['value']['stage'].t,data['data']['function'],data['data']['value']['slo'],btnLabel,btnClass,fd,'setResponse');
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
            this.StageTable.Table.setError(error);
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
            this.StageTable.Table.setError(error);
        }
    }
    createText(){
        console.log('ProjectStage::createText()');
        this.Items.default['part']='b';
        this.Items.setDefaultActionUrl(this,'show',this.title.stage);
        this.runCreate('prepareText','t','b');
    }
    createImage(){
        //console.log('ProjectStage::createImage()');
    }
    createTable(){
        //console.log('ProjectStage::createTable()');
    }
    createList(){
        //console.log('ProjectStage::createList()');
        this.Items.default['part']='b';
        this.Items.setDefaultActionUrl(this,'show',this.title.stage);
        this.runCreate('prepareList','l');
    }
    createFooter(){
        //console.log('ProjectStage::createFooter()');
        this.Items.default['part']='f';
        this.Items.setDefaultActionUrl(this,'showFooter',this.title.footer);
        this.runCreate('prepareFooter','t');
    }
    createHeading(){
        //console.log('ProjectStage::createHeading()');
        this.Items.default['part']='h';
        this.Items.setDefaultActionUrl(this,'showHeading',this.title.heading);
        this.runCreate('prepareHeading','t');
    }
    runCreate(r,t){
        console.log('ProjectStage::runCreate()');
        console.log(r);
        /*
         * r - method name to run
         * t - type (t - text, l - list)
         */
        try{
            this.Create.type=t;
            this.Create.part=this.Items.default['part'];
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
        console.log('ProjectStage::detailsText/list()');
        this.Items.default['part']='b';
        this.Items.setDefaultAction(this,'show');
        console.log(this.Items.default);
        this.runDetails(response,'detailsText');
    }
    detailsHeading(response){
        console.log('ProjectStage::detailsHeading()');
        this.Items.default['part']='h';
        this.Items.setDefaultAction(this,'showHeading');
        this.runDetails(response,'detailsHeading');
    }
    detailsFooter(response){
        console.log(response,'ProjectStage::detailsFooter()');
        this.Items.default['part']='f';
        this.Items.setDefaultAction(this,'showFooter');
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
        console.log('ProjectStage.setResponse()');
        var data = this.Items.setModalResponse(response)
        if(data.status===1 || data.status==='1'){
            return false;
        }
        this.Items.setTitle();
        this.StageTable.updateBody(data); 
    }
    getFilterData(id){
        var fd = this.Items.getFilterData(id);
            fd.append('p',this.Items.default['part']);
        return fd;
    }
}