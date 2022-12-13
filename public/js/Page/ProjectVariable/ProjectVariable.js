class ProjectVariable{
    VariableTable = new Object();
    VariableCreate = new Object ();
    Items= new Object ();
    //defaultTask='getProjectVariablesLike&u=0&v=0&b=';
    url={
        primary:'getProjectVariables',
        active:'getProjectVariables',
        hidden:'getProjectHiddenVariables',
        deleted:'getProjectDeletedVariables',
        hiddenAndDeleted:'getProjectHiddenAndDeletedVariables',
        all:'getProjectAllVariables'
    };    
    title={
        label:'Zmienne',
        'text-color':'text-purple'
    };
    constructor(Items) {
        //console.log('ProjectVariable::constructor()');
        this.Items = Items;
        this.VariableTable = new ProjectVariableTable(this);  
        this.VariableTable.setProperties(Items.appurl,Items.router,this.url.active);
        this.VariableCreate = new ProjectVariableCreate(this);
    }
    clearShow(){
        console.log('ProjectStage::clearShow()');
        this.Items.setClearDefault(this,'show',this.title);
        this.Items.setTitle();
        this.show();
    }
    show(){
        console.log('ProjectConstant::show()');
        console.log(this.Items.default);
        var action={
            'u':this.Items.default.url.active,
            'd':this.getFilterData(0)
        };
        this.VariableTable.runPOST(action);
    }
    create(){
        try{
            this.Items.setDefaultActionUrl(this,'show',this.title);
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
            this.Items.setDefaultAction(this,'show');
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
        var fd = this.getFilterData(data['data']['value']['variable'].i) 
            this.Items.Modal.clearData();
            this.Items.setCloseModal(this.setUndoTask(this,this.defaultTask+data['data']['value']['variable'].i));
            this.Items.setChangeDataState(data['data']['value']['variable'].i,data['data']['value']['variable'].n,data['data']['function'],data['data']['value']['slo'],btnLabel,btnClass,fd,'setResponse');
            this.Items.Modal.setInfo("Project Variable ID: "+data['data']['value']['variable'].i+", Create user: "+data['data']['value']['variable'].cu+" ("+data['data']['value']['variable'].cul+"), Create date: "+data['data']['value']['variable'].cd);
    }
    setUndoTask(self,id){
        console.log('ProjectConstant::setUndoTask()');
        var run = function(){
                self.Items.Modal.closeModal();
            var fd = self.Items.getFilterData(id);
                self.Items.filterOutReloadData(fd,'setResponse');
       };
       return run;          
    }
    hide(response){
        //console.log('ProjectVariable::hide()');
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
        console.log('ProjectVariable::setResponse()');
        var data = this.Items.setModalResponse(response)
        if(data.status===1 || data.status==='1'){
            return false;
        }
        this.Items.setTitle();
        this.VariableTable.updateBody(data); 
    }
    getFilterData(id){
        var fd = new FormData();
            fd.append('f',this.Items.filter.search.value);
            fd.append('b',id);
        return fd;
    }
}