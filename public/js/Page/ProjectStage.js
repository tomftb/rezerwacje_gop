
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
    //ProjectStageTable;
    Table = new Object;
    CreateText = new Object;
    CreateImage = new Object;
    CreateTable = new Object;
    CreateList = new Object;
    constructor(Items){
        console.log('ProjectStage::construct()');
        this.Items = Items;
        console.log(Items);
        console.log(this.Items.router);
        this.Table = new ProjectStageTable(this);  
        this.Table.setProperties(this.Items.appurl,this.Items.router);
        this.CreateText = new ProjectStageCreateText();
        this.CreateImage = new ProjectStageCreateImage();
        this.CreateTable = new ProjectStageCreateTable();
        this.CreateTable = new ProjectStageCreateTable();
    }
    show(){
        console.log('ProjectStage::show()');  
        /* SET PAGE TITLE */
        document.getElementById('headTitle').innerHTML='Etapy';
        console.log(this.Table);
        this.Table.unsetError();
        this.Items.default={
            task:this.defaultTask,
            object:this,
            method:'show'
        };
        this.Table.run(this.defaultTask);
    }

    hide(response){
        console.log('ProjectStage::hide()');
        console.log(response);
        try{
            /* SET UP STAGE DATA */
            var data=this.Items.parseResponse(response);
            /* SET UP GLOSSARY */
            //this.Items.Glossary
            /* RUN MODAL */
            this.Items.prepareModal('Ukrywanie Etapu Projektu','bg-secondary');
            this.Items.setCloseModal(this,'show',this.defaultTask+data['data']['value']['stage'].i);
            this.Items.setChangeDataState(data,'Ukryj','secondary',);
        }
        catch(error){
            console.log(error);
            this.Table.setError(error);
            return false;
        };
    }
    remove(response){
        console.log('ProjectStage::remove()');
        console.log(response);
        try{
            /* SET UP STAGE DATA */
            var data=this.Items.parseResponse(response);
            /* SET UP GLOSSARY */
            //this.Items.Glossary
            /* RUN MODAL */
            this.Items.prepareModal('Usuwanie Etapu Projektu','bg-danger');
            this.Items.setCloseModal(this,'show',this.defaultTask+data['data']['value']['stage'].i);
            this.Items.setChangeDataState(data,'Usuń','danger',);
        }
        catch(error){
            console.log(error);
            this.Table.setError(error);
            return false;
        };
    }
    edit(response){
        console.log('ProjectStage::edit()');
        console.log(response);
    }
    createText(){
        try{
            console.log('ProjectStage::createText()');
            console.log(this.CreateText);
            this.CreateText.create(this);
        }
        catch(error){
            console.log(error);
            this.Table.setError(error);
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
        console.log('ProjectStage::createList()');
    }
}
