
class ProjectStage{
    fieldDisabled='y';
    projectData=new Object();
    actDay = getActDate();
    actStageData=new Object();
    loggedUserPerm=new Array();
    errorStatus=false;
    defaultTask='getprojectsstagelike&d=0&v=0&b=';
    data={};
    Items = new Object;
    inputFieldCounter=0;
    fieldDisabled='n';
    StageTable = new Object;
    //CreateText = new Object;
    CreateImage = new Object;
    CreateTable = new Object;
    Create = new Object;
    Tool = new Object();
    //CreateList = new Object;
    Property = new Object;
    constructor(Items){
        console.log('ProjectStage::construct()');
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
        console.log('ProjectStage::show()');  
        /* SET PAGE TITLE */
        document.getElementById('headTitle').innerHTML='Etapy';
        console.log(this.StageTable);     
        this.Items.default={
            task:this.defaultTask,
            object:this,
            method:'show'
        };
        this.StageTable.run(this.Items.router+this.defaultTask);
    }
    prepare(response,btnLabel,btnClass){
        console.log('ProjectStage::prepare()');
        console.log(response);
        
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
            this.Items.setChangeDataState(data['data']['value']['stage'].i,data['data']['value']['stage'].t,data['data']['function'],data['data']['value']['slo'],btnLabel,btnClass,this.StageTable,'run',window.router+this.defaultTask+data['data']['value']['stage'].i);
            this.Items.Modal.setInfo("Project Stage ID: "+data['data']['value']['stage'].i+", Create user: "+data['data']['value']['stage'].cu+" ("+data['data']['value']['stage'].cul+"), Create date: "+data['data']['value']['stage'].cd);
       
    }
    hide(response){
        console.log('ProjectStage::hide()');
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
        console.log('ProjectStage::remove()');
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
        try{
            console.log('ProjectStage::createText()');
            
            //console.log(this.Items.Glossary['text']);
            //console.log(this.CreateText);
            //this.Items.setLoadModalInfo();
            /* SET DEFAULT OBJECT */
            this.Items.default={
                task:this.defaultTask,
                object:this,
                method:'show'
            };
            /* TURN OFF  - createList instead*/
            this.Create.create('t');
        }
        catch(error){
            console.log(error);
            this.StageTable.Table.setError(error);
            return false;
        };
    }
    createImage(){
        console.log('ProjectStage::createImage()');

    }
    createTable(){
        console.log('ProjectStage::createTable()');
    }
    createList(){
        
        try{
            console.log('ProjectStage::createList()');    
            //console.log(this.Items.Glossary['text']);
            //console.log(this.CreateText);
            //this.Items.setLoadModalInfo();
            /* SET DEFAULT OBJECT */
            this.Items.default={
                task:this.defaultTask,
                object:this,
                method:'show'
            };
            this.Create.create('l');
        }
        catch(error){
            console.log(error);
            this.StageTable.Table.setError(error);
            return false;
        };
    }
    details(response){
        try{
            //console.clear();
            console.log('ProjectStage::details()');
            //this.CreateText.details(response);
            this.Create.details(response);
        }
        catch(error){
            console.log(error);
            this.StageTable.Table.setError(error);
            return false;
        };
    }
    setResponse(response){
        console.log('ProjectConstant::setResponse()');
        if(this.Items.setModalResponse(response)){
            this.StageTable.setBody(response);
        }
    }
}
