class ProjectConstant{
   
    ConstantTable = new Object();
    ConstantCreate = new Object ();
    Items= new Object ();
    Utilities = new Object();
    url={
        primary:'getProjectConstants',
        active:'getProjectConstants',
        hidden:'getProjectHiddenConstants',
        deleted:'getProjectDeletedConstants',
        hiddenAndDeleted:'getProjectHiddenAndDeletedConstants',
        all:'getProjectAllConstants'
    };
    title={
        label:'Stałe',
        'text-color':'text-warning'
    };
    constructor(Items) {
        //console.log('ProjectConstant::constructor()');
        this.Items = Items;
        this.Utilities = Items.Utilites;
        this.ConstantTable = new ProjectConstantTable(this);  
        this.ConstantTable.setProperties(Items.appurl,Items.router,this.url.active);
        this.ConstantCreate = new ProjectConstantCreate(this);
    }
    clearShow(){
        console.log('ProjectConstant::clearShow()');
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
        this.ConstantTable.runPOST(action);
    }
    create(){
        try{
            console.log('ProjectConstant::create()');
            console.log(this.url);
            this.Items.setDefaultActionUrl(this,'show',this.title);
            console.log(this.Items.default);
            this.ConstantCreate.create();
        }
        catch(error){
            console.log(error);
            this.ConstantTable.Table.setError('An AnApplication Error Has Occurred!');
            return false;
        };
    }
    prepare(response,btnLabel,btnClass){
        console.log('ProjectConstant::prepare()');
        /* SET UP STAGE DATA */
        var data=this.Items.parseResponse(response);
        var fd = this.getFilterData(data['data']['value']['const'].i) 
            this.Items.Modal.clearData();
            this.Items.setCloseModal(this.setUndoTask(this,this.defaultTask+data['data']['value']['const'].i));
            this.Items.setChangeDataState(data['data']['value']['const'].i,data['data']['value']['const'].n,data['data']['function'],data['data']['value']['slo'],btnLabel,btnClass,fd,'setResponse');
            this.Items.Modal.setInfo("Project Const ID: "+data['data']['value']['const'].i+", Create user: "+data['data']['value']['const'].cu+" ("+data['data']['value']['const'].cul+"), Create date: "+data['data']['value']['const'].cd);
    }
    details(response){
        try{
            console.log('ProjectConstant::create()');
            this.Items.setDefaultAction(this,'show');
            this.ConstantCreate.details(response);
        }
        catch(error){
            console.log(error);
            this.ConstantTable.Table.setError('An Application Error Has Occurred!');
            return false;
        };
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
        var data = this.Items.setModalResponse(response)
        if(data.status===1 || data.status==='1'){
            return false;
        }
        this.Items.setTitle();
        this.ConstantTable.updateBody(data); 
    }
    getFilterData(id){
        var fd = new FormData();
            fd.append('f',this.Items.filter.search.value);
            fd.append('b',id);
        return fd;
    }
}