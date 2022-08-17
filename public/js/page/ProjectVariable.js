class ProjectVariable{
    VariableTable = new Object();
    VariableCreate = new Object ();
    Items= new Object ();
    defaultTask='getProjectVariablesLike&u=0&v=0&b=';
    
    constructor(Items) {
        console.log('ProjectVariable::constructor()');
        this.Items = Items;
        this.VariableTable = new ProjectVariableTable(this);  
        this.VariableTable.setProperties(Items.appurl,Items.router,this.defaultTask);
        this.VariableCreate = new ProjectVariableCreate(this);
    }
    show(task){
        console.log('ProjectVariable::show()');
        if(task){
            this.runShow(task);
        }
        else{
            this.runShow(this.defaultTask);
        }
    }
    runShow(t){
        console.log('ProjectVariable::runShow()');
        console.log(t);
        /* SET PAGE TITLE */
        document.getElementById('headTitle').innerHTML='Zmienne';   
        this.Items.default={
            task:t,
            object:this,
            method:'show'
        };
        //console.log(this.defaultTask); 
        this.VariableTable.run(this.Items.router+t);
    }
    create(){
        try{
            console.log('ProjectVariable::create()');
            this.Items.default={
                task:this.defaultTask,
                object:this,
                method:'show'
            };
            this.VariableCreate.create();
        }
        catch(error){
            console.log(error);
            this.VariableTable.Table.setError('An Application Error Has Occurred!');
            return false;
        };
    }
    details(response){
        try{
            console.log('ProjectVariable::create()');
            this.Items.default={
                task:this.defaultTask,
                object:this,
                method:'show'
            };
            this.VariableCreate.details(response);
        }
        catch(error){
            console.log(error);
            this.VariableTable.Table.setError('An Application Error Has Occurred!');
            return false;
        };
    }
    prepare(response,btnLabel,btnClass){
        console.log('ProjectVariable::prepare()');
        /* SET UP STAGE DATA */
        var data=this.Items.parseResponse(response);
            this.Items.Modal.clearData();
            this.Items.setCloseModal(this.setUndoTask(this,this.defaultTask+data['data']['value']['variable'].i));
            this.Items.setChangeDataState(data['data']['value']['variable'].i,data['data']['value']['variable'].n,data['data']['function'],data['data']['value']['slo'],btnLabel,btnClass,this,'setResponse',window.router+this.defaultTask+data['data']['value']['variable'].i);
            this.Items.Modal.setInfo("Project Stage ID: "+data['data']['value']['variable'].i+", Create user: "+data['data']['value']['variable'].cu+" ("+data['data']['value']['variable'].cul+"), Create date: "+data['data']['value']['variable'].cd);
        
    }
    setUndoTask(self,task){
        var run = function(){
            self.Items.Modal.closeModal();
            self.Items.reloadData(self.Items.Variable,'setResponse',task);    
       };
       return run;          
    }
    hide(response){
        console.log('ProjectVariable::hide()');
        try{
            this.prepare(response,'Ukryj','secondary');
        }
        catch(error){
            console.log(error);
            this.VariableTable.Table.setError('An Application Error Has Occurred!');
            return false;
        };
        //console.log(response);
        /* RUN MODAL IN second try to prevent hide error */
        try{
            this.Items.prepareModal('Ukrywanie zmiennej','bg-secondary');
        }
        catch(error){
            console.log(error);
            this.VariableTable.Table.setError(error);
        }
    }
    remove(response){ 
        try{
             this.prepare(response,'Usuń','danger');
        }
        catch(error){
            console.log(error);
            this.VariableTable.Table.setError(error);
            return false;
        };
        /* RUN MODAL IN second try to prevent hide error */
        try{
            this.Items.prepareModal('Usuwanie Zmiennej','bg-danger');
        }
        catch(error){
            console.log(error);
            this.VariableTable.Table.setError('An Application Error Has Occurred!');
        }
    }
    setResponse(response){
        if(this.Items.setModalResponse(response)){
            this.VariableTable.setBody(response);
        }
    }
}