console.log('ProjectStage');
class ProjectStage{
    static fieldDisabled='y';
    static projectData=new Object();
    static actDay = getActDate();
    static actStageData=new Object();
    static loggedUserPerm=new Array();
    static errorStatus=false;
    static data={};
    static Xhr;
    static Modal;
    static Html;
    static Items;
    static defaultTask='getprojectsstagelike&d=0&v=0&b=';
    static inputFieldCounter=0;
    static fieldDisabled='n';
    static ProjectStageTable;
    static CreateText;
    static CreateImage;
    static CreateTable;
    static CreateList;

    static show(){
        console.log('ProjectStage::show()');  
         /* FIRST RUN -> PREVENT IF ELE NOT EXIST */
        if(ProjectStage.Modal.exist){
            /* CLEAR AND SET MODAL DATA */
            ProjectStage.Items.setDefaultModal();
        };
        console.log(ProjectStage.ProjectStageTable);
        
        ProjectStage.ProjectStageTable.setProperties(ProjectStage.Items.appurl,ProjectStage.Items.router,ProjectStage.defaultTask);
        ProjectStage.Xhr.setRun(ProjectStage.ProjectStageTable,'runTable');
        ProjectStage.Xhr.run('GET',null,ProjectStage.Items.router+ProjectStage.defaultTask);
    }
    static runModal(response){//can be var response
        console.log('ProjectStage::runModal()');
        console.log(response);
        ProjectStage.Modal.setLink();
        try{
            ProjectStage.Modal.hideLoad();
            ProjectStage.Xhr.runObject=ProjectStage;
            ProjectStage.Xhr.runMethod='runModal';
        }
        catch(error){
            console.log(error);
            alert('ProjectStage::runModal() Error occured!');
            return false;
        };
        ProjectStage.data=ProjectStage.Items.getJsonResponse(ProjectStage.Modal.link['error'],response);
        if(ProjectStage.data){
            try {
                if (!('status' in ProjectStage.data) || !('info' in ProjectStage.data)){
                    ProjectStage.Items.setCloseModal(ProjectStage.ProjectStageTable,'runTable',ProjectStage.defaultTask+'0');
                    ProjectStage.Items.setError(ProjectStage.Modal.link['error'],'Application error occurred! Contact with Administrator!');
                }
                else if(ProjectStage.data.status===1){
                    ProjectStage.Items.setCloseModal(ProjectStage.ProjectStageTable,'runTable',ProjectStage.defaultTask+'0');
                    ProjectStage.Items.setError(ProjectStage.Modal.link['error'],ProjectStage.data.info);
                }
                else{
                    /* SET MODAL ACTION */
                    ProjectStage[ProjectStage.data['data']['function']]();
                }  
            }
            catch (error) {
                console.log(error);
                ProjectStage.Xhr.runObject=ProjectStage;
                ProjectStage.Items.setError(ProjectStage.Modal.link['error'],error);
            } 
        }
    }
    static psHide(){
        console.log('ProjectStage::psHide()');
        ProjectStage.Items.prepareModal('Ukrywanie Etapu Projektu','bg-secondary');
        ProjectStage.Items.setCloseModal(ProjectStage.ProjectStageTable,'runTable',ProjectStage.defaultTask+ProjectStage.data['data']['value']['stage'].i);
        ProjectStage.setChangeDataState('Ukryj','secondary');
    }
    static psDelete(){
        console.log('ProjectStage::psDelete()');
        ProjectStage.Items.prepareModal('Usuwanie Etapu Projektu','bg-danger');
        ProjectStage.Items.setCloseModal(ProjectStage.ProjectStageTable,'runTable',ProjectStage.defaultTask+ProjectStage.data['data']['value']['stage'].i);
        ProjectStage.setChangeDataState('Usuń','danger');       
    }
    static setChangeDataState(btnLabel,titleClass){
        console.log('ProjectStage::setChangeDataState()');
        console.log(ProjectStage.data['data']);
        var form=ProjectStage.Html.getForm();
        var h=document.createElement('H5');
            h.setAttribute('class','text-'+titleClass+' mb-3 text-center font-weight-bold');
            h.innerHTML=ProjectStage.data['data']['value']['stage'].t;
        
        form.appendChild(ProjectStage.Html.getInput('id',ProjectStage.data['data']['value']['stage'].i,'hidden'));
        ProjectStage.Items.setChangeStateFields(form,ProjectStage.data['data']['value']['slo']);
        ProjectStage.Modal.link['form']=form; 
        ProjectStage.Modal.link['adapted'].appendChild(h);
        ProjectStage.Modal.link['adapted'].appendChild(form);
        var confirmButton=ProjectStage.Html.confirmButton(btnLabel,'btn btn-'+titleClass,ProjectStage.data['data']['function']);   
            /* CLOSURE */
            confirmButton.onclick = function () {  
                console.log('ProjectStage::setChangeDataState() onclick()');
                console.log(ProjectStage.ProjectStageTable);
                const fd = new FormData(form);
                if(confirm('Potwierdź wykonanie akcji')){   
                    ProjectStage.Modal.link['extra'].innerHTML='<center><img src="/img/loading_60_60.gif"/></center>';
                    ProjectStage.Xhr.run('POST',fd,ProjectStage.Items.router+this.id);
                };
            };
        ProjectStage.Modal.link['button'].appendChild(ProjectStage.Items.getCancelButton(ProjectStage.ProjectStageTable,'runTable',ProjectStage.defaultTask+ProjectStage.data['data']['value']['stage'].i));
        ProjectStage.Modal.link['button'].appendChild(confirmButton);
        /*
         * INFO
         */
        ProjectStage.Items.setModalInfo("Project Stage ID: "+ProjectStage.data['data']['value']['stage'].i+", Create user: "+ProjectStage.data['data']['value']['stage'].cu+" ("+ProjectStage.data['data']['value']['stage'].cul+"), Create date: "+ProjectStage.data['data']['value']['stage'].cd);
        
        }
    static cModal(){
        console.log('ProjectStage::cModal()');
        ProjectStage.Items.reloadData(ProjectStage.ProjectStageTable,'runTable',ProjectStage.defaultTask+'0');
        $(ProjectStage.Items.Modal.link['main']).modal('hide');
    }
    static createData(){
        console.log('ProjectStage::createData()');
        ProjectStage.Items.setDefaultModal();
        ProjectStage.Xhr.setRun(ProjectStage,'runModal');
        ProjectStage.Xhr.run('GET',null,ProjectStage.Items.router+'getNewStageDefaults');
    }
    static createText(){
        console.log('ProjectStage::createText()');
        /* SET DEFAULT XHR */
        /* BUILD TEXT */
        ProjectStage.CreateText.Modal=ProjectStage.Modal;
        ProjectStage.CreateText.Items=ProjectStage.Items;
        ProjectStage.CreateText.Stage=ProjectStage;
        ProjectStage.CreateText.Html=ProjectStage.Html;
        ProjectStage.CreateText.create(ProjectStage.data);
    }
    static createImage(){
        console.log('ProjectStage::createImage()');
    }
    static createTable(){
        console.log('ProjectStage::createTable()');
    }
    static createList(){
        console.log('ProjectStage::createList()');
    }
    static prepareData(type){
        console.log('ProjectStage::prepareData()');
        /* CHECK IS DATA NOT ALREADY SETUP */ 
        /*
            console.log(ProjectStage.CreateText.glossary);
            console.log(Object.keys(ProjectStage.CreateText.glossary).length);
            console.log(Object.getPrototypeOf(ProjectStage.CreateText.glossary));
            console.log(Object.prototype);
            console.log(Object.getPrototypeOf(ProjectStage.CreateText.glossary) === Object.prototype);
            && Object.keys(ProjectStage.CreateText.glossary).length === 0
            && Object.getPrototypeOf(obj) === Object.prototype
         */      
        switch(type)
        {
            case 'tx':
                    console.log(ProjectStage.Items.ManageGlossary);
                    console.log(ProjectStage.Items.ManageGlossary.exist('text'));
                    //if(Object.keys(ProjectStage.CreateText.glossary).length === 0){
                    if(!ProjectStage.Items.ManageGlossary.exist('text')){
                        ProjectStage.Xhr.setRun( ProjectStage,'runModal');
                        ProjectStage.Xhr.run('GET',null,ProjectStage.Items.router+'getNewStageDefaults&type='+type);
                        break;
                    }
                    //ProjectStage.createText(ProjectStage.CreateText.Glossary);
                    ProjectStage.createText();
                break;
            case 'i':   
                break;
            case 't':
                break;
            case 'l':   
                break;
            default:
                    console.log('UNAVAILABLE TYPE');
                    console.log(type);
                break;
        }
    }
}
