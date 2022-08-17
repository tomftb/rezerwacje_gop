class ProjectConst{
   
    ConstTable = new Object();
    ConstCreate = new Object ();
    Items= new Object ();
    defaultTask='getprojectsconstslike&u=0&v=0&b=';
    
    constructor(Items) {
        console.log('ProjectConst::constructor()');
        this.Items = Items;
        this.ConstTable = new ProjectConstTable(this);  
        this.ConstTable.setProperties(Items.appurl,Items.router,this.defaultTask);
        this.ConstCreate = new ProjectConstCreate(this);
    }
    show(){
        console.log('ProjectConst::show()');  
        /* SET PAGE TITLE */
        document.getElementById('headTitle').innerHTML='Stałe';
        console.log(this.ConstTable);     
        this.Items.default={
            task:this.defaultTask,
            object:this,
            method:'show'
        };
        this.ConstTable.run(this.Items.router+this.defaultTask);
    }
    create(){
        try{
            console.log('ProjectConst::create()');
            this.Items.default={
                task:this.defaultTask,
                object:this,
                method:'show'
            };
            this.ConstCreate.create();
        }
        catch(error){
            console.log(error);
            this.ConstTable.Table.setError('An AnApplication Error Has Occurred!');
            
            return false;
        };
    }
    details(response){
        try{
            console.log('ProjectConst::create()');
            this.Items.default={
                task:this.defaultTask,
                object:this,
                method:'show'
            };
            this.ConstCreate.details(response);
        }
        catch(error){
            console.log(error);
            this.ConstTable.Table.setError('An Application Error Has Occurred!');
            return false;
        };
    }
    prepare(response,btnLabel,btnClass){
        console.log('ProjectStage::prepare()');
        //console.log(response);
        /* SET UP STAGE DATA */
        var data=this.Items.parseResponse(response);
            this.Items.Modal.clearData();
            this.Items.setCloseModal(this,'show',this.defaultTask+data['data']['value']['const'].i);
            this.Items.setChangeDataState(data['data']['value']['const'].i,data['data']['value']['const'].n,data['data']['function'],data['data']['value']['slo'],btnLabel,btnClass);
            this.Items.Modal.setInfo("Project Stage ID: "+data['data']['value']['const'].i+", Create user: "+data['data']['value']['const'].cu+" ("+data['data']['value']['const'].cul+"), Create date: "+data['data']['value']['const'].cd);
        
    }
    hide(response){
        console.log('ProjectConst::hide()');
        try{
            this.prepare(response,'Ukryj','secondary');
        }
        catch(error){
            console.log(error);
            this.ConstTable.Table.setError('An Application Error Has Occurred!');
            return false;
        };
        //console.log(response);
        /* RUN MODAL IN second try to prevent hide error */
        try{
            this.Items.prepareModal('Ukrywanie Stałej','bg-secondary');
        }
        catch(error){
            console.log(error);
            this.ConstTable.Table.setError(error);
        }
    }
    remove(response){ 
        try{
             this.prepare(response,'Usuń','danger');
        }
        catch(error){
            console.log(error);
            this.ConstTable.Table.setError(error);
            return false;
        };
        /* RUN MODAL IN second try to prevent hide error */
        try{
            this.Items.prepareModal('Usuwanie Stałej','bg-danger');
        }
        catch(error){
            console.log(error);
            this.ConstTable.Table.setError('An Application Error Has Occurred!');
        }
    }
}