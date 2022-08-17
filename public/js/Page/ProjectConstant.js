class ProjectConstant{
   
    ConstantTable = new Object();
    ConstantCreate = new Object ();
    Items= new Object ();
    defaultTask='getprojectsconstantslike&u=0&v=0&b=';
    Utilities = new Object();
    constructor(Items) {
        console.log('ProjectConstant::constructor()');
        this.Items = Items;
        this.Utilities = Items.Utilites;
        this.ConstantTable = new ProjectConstantTable(this);  
        this.ConstantTable.setProperties(Items.appurl,Items.router,this.defaultTask);
        this.ConstantCreate = new ProjectConstantCreate(this);
    }
    show(){
        console.log('ProjectConstant::show()');  
        /* SET PAGE TITLE */
        document.getElementById('headTitle').innerHTML='Stałe';
        //console.log(this.ConstantTable);     
        this.Items.default={
            task:this.defaultTask,
            object:this,
            method:'show'
        };
        console.log(this.defaultTask); 
        this.ConstantTable.run(this.Items.router+this.defaultTask);
    }
    create(){
        try{
            console.log('ProjectConstant::create()');
            this.Items.default={
                task:this.defaultTask,
                object:this,
                method:'show'
            };
            this.ConstantCreate.create();
        }
        catch(error){
            console.log(error);
            this.ConstantTable.Table.setError('An AnApplication Error Has Occurred!');
            
            return false;
        };
    }
    details(response){
        try{
            console.log('ProjectConstant::create()');
            this.Items.default={
                task:this.defaultTask,
                object:this,
                method:'show'
            };
            this.ConstantCreate.details(response);
        }
        catch(error){
            console.log(error);
            this.ConstantTable.Table.setError('An Application Error Has Occurred!');
            return false;
        };
    }
    prepare(response,btnLabel,btnClass){
        console.log('ProjectConstant::prepare()');
        /* SET UP STAGE DATA */
        var data=this.Items.parseResponse(response);
            this.Items.Modal.clearData();
            this.Items.setCloseModal(this.setUndoTask(this,this.defaultTask+data['data']['value']['const'].i));
            this.Items.setChangeDataState(data['data']['value']['const'].i,data['data']['value']['const'].n,data['data']['function'],data['data']['value']['slo'],btnLabel,btnClass,this,'setResponse',window.router+this.defaultTask+data['data']['value']['const'].i);
            this.Items.Modal.setInfo("Project Stage ID: "+data['data']['value']['const'].i+", Create user: "+data['data']['value']['const'].cu+" ("+data['data']['value']['const'].cul+"), Create date: "+data['data']['value']['const'].cd);
        
    }
    setUndoTask(self,task){
        var run = function(){
            self.Items.Modal.closeModal();
            //self.Items.reloadData(self,'show',task);      
            self.Items.reloadData(self.Items.Constant,'setResponse',task);    
       };
       return run;          
    }
    hide(response){
        console.log('ProjectConstant::hide()');
        try{
            this.prepare(response,'Ukryj','secondary');
        }
        catch(error){
            console.log(error);
            this.ConstantTable.Table.setError('An Application Error Has Occurred!');
            return false;
        };
        //console.log(response);
        /* RUN MODAL IN second try to prevent hide error */
        try{
            this.Items.prepareModal('Ukrywanie Stałej','bg-secondary');
        }
        catch(error){
            console.log(error);
            this.ConstantTable.Table.setError(error);
        }
    }
    remove(response){ 
        try{
             this.prepare(response,'Usuń','danger');
        }
        catch(error){
            console.log(error);
            this.ConstantTable.Table.setError(error);
            return false;
        };
        /* RUN MODAL IN second try to prevent hide error */
        try{
            this.Items.prepareModal('Usuwanie Stałej','bg-danger');
        }
        catch(error){
            console.log(error);
            this.ConstantTable.Table.setError('An Application Error Has Occurred!');
        }
    }
    setResponse(response){
        console.log('ProjectConstant::setResponse()');
        if(this.Items.setModalResponse(response)){
            this.ConstantTable.setBody(response);
        }
    }
}