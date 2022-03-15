//console.log('ProjectConst');
/*
 * 
 * CLASS Modal -> js/Main/Modal.js
 * CLASS Xhr -> js/Main/Xhr.js
 */

class ProjectConst{
    ErrorStack={};
    Field=0;
    errorStatus=false;
    ConstTable = new Object();
    Xhr;
    Modal;
    Html;
    Items;
    data={};
    allConsts=new Array();
    defaultTask='getprojectsconstslike&u=0&v=0&b=';
    fieldDisabled=false;

    constructor(Items) {
        console.log('ProjectConst::constructor()');
        this.Items = Items;
        this.ConstTable = new ProjectConstTable(this);  
        this.ConstTable.setProperties(this.Items.appurl,this.Items.router);
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
    new(){
        console.log('ProjectConst::new()');  
        /* IT CAN BU RUn WITHOUT RUN TABLE VIA show() */
        ProjectConst.Items.setDefaultModal();
        ProjectConst.Xhr.setRun(ProjectConst,'runModal');
        ProjectConst.Xhr.run('GET',null,ProjectConst.Items.router+'getProjectConstList');
    }
    prepareData(){
        console.log('ProjectConst::prepareData()');
        ProjectConst.iField=0;
        ProjectConst.ErrorStack={};
    }
    runModal(response){//can be var response
        console.log('ProjectStage::runModal()');
        //console.log(response);
        ProjectConst.Modal.setLink();
        try{
            ProjectConst.Modal.hideLoad();
            ProjectConst.Xhr.runObject=ProjectConst;
        }
        catch(error){
            console.log(error);
            alert('ProjectConst::runModal() Error occured!');
            return false;
        };
        ProjectConst.data=ProjectConst.Items.getJsonResponse(ProjectConst.Modal.link['error'],response);
        if(ProjectConst.data){
            console.log(typeof ProjectConst.data);
            try {
                if (!('status' in ProjectConst.data) || !('info' in ProjectConst.data)){
                    ProjectConst.Items.setCloseModal(ProjectConst.ProjectConstTable,'runTable',ProjectConst.defaultTask+'0');
                    ProjectConst.Items.setError(ProjectConst.Modal.link['error'],'Application error occurred! Contact with Administrator!');
                }
                else if(ProjectConst.data.status===1){
                    ProjectConst.Items.setCloseModal(ProjectConst.ProjectConstTable,'runTable',ProjectConst.defaultTask+'0');
                    ProjectConst.Items.setError(ProjectConst.Modal.link['error'],ProjectConst.data.info);
                }
                else{
                    /* SET MODAL ACTION */
                    ProjectConst[ProjectConst.data['data']['function']]();
                }  
            }
            catch (error) {
                ProjectConst.Xhr.runObject=ProjectConst;
                ProjectConst.Items.setError(ProjectConst.Modal.link['error'],error);
                
            } 
        }
    }
    getRemoveButtonCol(id){
        var colrm=document.createElement('DIV');
            colrm.setAttribute('class','col-sm-1');
            colrm.appendChild(ProjectConst.createRemoveButton("rm-"+id));
            return colrm;
    }
    prepareConst(){
        console.log('ProjectConst::prepareConst()');
        ProjectConst.ErrorStack={};
        ProjectConst.fieldDisabled=false;
        /* RUN FROM XHR */
        console.log(ProjectConst.data);
        ProjectConst.prepareData();
        ProjectConst.Items.prepareModal('Nowa stała','bg-warning');
        ProjectConst.Items.setCloseModal(ProjectConst.ProjectConstTable,'runTable',ProjectConst.defaultTask+'0');
        ProjectConst.allConsts=ProjectConst.data['data']['value']['all'];
        var form=document.createElement('FORM');
        ProjectConst.setInputConst(form,'','','0',ProjectConst.getRemoveButtonCol(ProjectConst.iField));
        ProjectConst.Modal.link['adapted'].appendChild(form);
        ProjectConst.Modal.link['adapted'].appendChild(ProjectConst.createAddButtonRow()); 
        ProjectConst.Modal.link['adapted'].appendChild(ProjectConst.createLegendRow()); 
        ProjectConst.Modal.link['form']=ProjectConst.Modal.link['adapted'].childNodes[0];
        ProjectConst.setConfirmButtons('0');
        
    }
    setEnabled(ele){
        /* CHECK IS THERE NO MORE ERRORS BEFORE ENABLE */
        for(const [key, value] of Object.entries(ProjectConst.ErrorStack)){
            console.log(value.err);
            if(value.err==='y'){
                /* ERROR INPUT STILL EXIST */
                return false;
            }
        }
        /* CHECK IS THE INPUT FIELDS */
        ProjectConst.errorStatus=false;
        ele.classList.remove("disabled");
        ele.removeAttribute('disabled');
    }
    setInputConst(form,constName,constValue,constId,rmButton){
        console.log('ProjectConst::setInputConst()\r\nCONST ID:'+constId+'\r\niField:'+ProjectConst.iField);
        console.log(ProjectConst.Modal.link['adapted']);
        var hr=document.createElement('HR');
        var rowAll=ProjectConst.Html.getRow();
        var colAll=document.createElement('DIV');
            colAll.setAttribute('class','col-12');
            colAll.appendChild(hr);
            /*
             * CONST ID
             */
            form.appendChild(ProjectConst.Html.getInput('id-'+ProjectConst.iField,constId,'hidden'));
            /*
             * CONST NAME
             */  
            var nameDiv = ProjectConst.newConstRow("Nazwa:","Write name","nazwa-"+ProjectConst.iField,constName); 
            if(rmButton!==null){
                nameDiv.appendChild(rmButton);
            }
            colAll.appendChild(nameDiv);
            /*
             * CONST NAME ERROR
             */
            colAll.appendChild(ProjectConst.createErrorDivRow('nazwaErr'+ProjectConst.iField));
            /*
             * CONST VALUE
             */  
            colAll.appendChild(ProjectConst.newConstRow("Wartość:","Write value","wartosc-"+ProjectConst.iField,constValue));
            /*
             * CONST VALUE ERROR
             */
            colAll.appendChild(ProjectConst.createErrorDivRow('wartoscErr'+ProjectConst.iField));
            rowAll.appendChild(colAll);
            form.appendChild(rowAll);
    }
    newConstRow(title,placeholder,id,value){
        var row=document.createElement('DIV');
            row.setAttribute('class','form-group row');
        var label=document.createElement('LABEL');
            label.setAttribute('class','col-sm-1 col-form-label ');
            label.setAttribute('for',id);
            label.innerHTML=title+'<br/><small class=" text-muted ">['+id+']</small>';
        var input=document.createElement('INPUT');
            input.setAttribute('type','text');
            input.setAttribute('class','form-control');
            input.setAttribute('id',id);
            input.setAttribute('name',id);
            input.setAttribute('placeholder',placeholder);
            input.setAttribute('VALUE',value);
            if(ProjectConst.fieldDisabled){
                /* SET READONLY */
                input.setAttribute('readonly','');
            }
            else{
                /* APPEND FUNCTION */
                input.onblur=function(){
                    ProjectConst.checkInputConst(this.id,this.value);
                };
            }
            
        var col=document.createElement('DIV');
            col.setAttribute('class','col-sm-10');
            col.appendChild(input);
            //col.innerHTML='<input type="text" class="form-control" id="'+id+'" name="'+id+'" placeholder="'+placeholder+'" VALUE="">';
            row.appendChild(label);
            row.appendChild(col);
        return row;
    }
     createRemoveButton(id){
        // i PARAMETERS
        var i=document.createElement('i');
            i.setAttribute('class','fa fa-minus');
            i.setAttribute('aria-hidden','true');
            i.setAttribute('style','color:#ffffff;');         
        var div=document.createElement('div');
            div.setAttribute('class','btn btn-danger');
            div.setAttribute('id',id);
            div.onclick=function(){
                ProjectConst.updateErrorStack(id);
                
                console.log(this.parentNode.parentNode.parentNode.parentNode);
                this.parentNode.parentNode.parentNode.parentNode.remove();
            };
        div.appendChild(i);
        return(div); 
    }
    updateErrorStack(id){
        console.log('ProjectConst::updateErrorStack()\r\nid');
        console.log(id);
        const tmpId=id.split('-');
        /* DELETE KEY FROM ERROR STACK */
        delete ProjectConst.ErrorStack['nazwaErr'+tmpId[1]];
        delete ProjectConst.ErrorStack['wartoscErr'+tmpId[1]];
        
        ProjectConst.setEnabled(ProjectConst.Modal.link['buttonConfirm']);
        
        /* CHECK FOR THE REMAINING ELEMENTS OF ERROR STACK */ 
        /* CHECK FOR ERROR STACK EXIST - IF NO THERE NO INPUT */
        if(ProjectConst.checkInputIsEmpty()){
            ProjectConst.Html.setDisabled(ProjectConst.Modal.link['buttonConfirm']);
        }
        
    }
    createLegendRow(){
        /*
         * ADD BUTTON ROW
         */
        var row=ProjectConst.Html.getRow();
        var col=document.createElement('DIV');
            col.setAttribute('class','col-sm-1');
        var col1=document.createElement('DIV');
            col1.setAttribute('class','col-sm-11');   
            col1.innerHTML="<ul><li>Nazwa stałej musi spełniać następujące warunki:<ul><li>musi się rozpoczynać znakiem alfabetu;</li><li>nie może zawierać polskich znaków;</li><li>może zawierać tylko i wyłącznie litery alfabetu i liczby;</li><li>musi zawierać minimum 3 znaki;</li><li>nie może być dłuższa niż 30 znaków.</li></ul></li><li>Wartość stałej musi spełniać następujące warunki:<ul><li>musi zawierać minimum 1 znak;</li><li>nie może być dłuższa niż 1024 znaki.</li></ul></li></ul>";
            row.appendChild(col);
            row.appendChild(col1);
        return row;
    }
    createAddButtonRow(){
        /*
         * ADD BUTTON ROW
         */
        var row=ProjectConst.Html.getRow();
        var col=document.createElement('DIV');
            col.setAttribute('class','col-sm-1');
            col.appendChild(ProjectConst.createAddButton());
        var col1=document.createElement('DIV');
            col1.setAttribute('class','col-sm-11');   
            row.appendChild(col);
            row.appendChild(col1);
        return row;
    }
    createErrorDivRow(id){
        /*
         * DIV ERROR
         */
        var row=ProjectConst.Html.getRow();
            row.setAttribute('id',id);
        var col=document.createElement('DIV');
            col.setAttribute('class','col-sm-1');
        var col1=document.createElement('DIV');
            col1.setAttribute('class','col-sm-10 alert alert-danger d-none');//d-none
            row.appendChild(col);
            row.appendChild(col1);
        ProjectConst.ErrorStack[id]={
            err:'n',
            ele:col1
        };
        
        return row;
    }
    createAddButton()
    {
        console.log('ProjectConst::createAddButton()');
        var i=document.createElement('i');
            i.setAttribute('class','fa fa-plus');
            i.setAttribute("aria-hidden","true");
        var div=document.createElement('div');
            div.setAttribute('class','btn btn-success btn-add');
            div.appendChild(i);
            div.onclick=function(){
                ProjectConst.iField++;
                ProjectConst.setInputConst(ProjectConst.Modal.link['form'],'','','0',ProjectConst.getRemoveButtonCol(ProjectConst.iField));
                /* UNSET MAIN ERROR */
                ProjectConst.Items.unsetError(ProjectConst.Modal.link['error']);
                ProjectConst.setEnabled(ProjectConst.Modal.link['buttonConfirm']);
            };
           
        return (div);
    }
    setConfirmButtons(){
        console.log('ProjectConst::setConfirmButtons()');
        var group=ProjectConst.Html.getGroupButton();
            group.appendChild(ProjectConst.Items.getCancelButton(ProjectConstTable,'runTable',ProjectConst.defaultTask+'0'));
        var confirm=document.createElement('button');
            confirm.setAttribute('class','btn btn-primary');
            confirm.innerText='Zatwierdź';
            confirm.onclick=function(){
                const fd = new FormData(ProjectConst.Modal.link['form']);
                ProjectConst.checkConst(fd);
                ProjectConst.sendConst(fd);
            };
            
            
            group.appendChild(confirm);
        ProjectConst.Modal.link['button'].appendChild(group);
        ProjectConst.Modal.link['buttonConfirm']=confirm;
    }
    
    setEditButtons(idRecord){
        console.log('ProjectConst::setEditButtons()');
        var group=ProjectConst.Html.getGroupButton();
            group.appendChild(ProjectConst.Items.getCancelButton(ProjectConstTable,'runTable',ProjectConst.defaultTask+idRecord));
        var confirm=document.createElement('button');
            confirm.setAttribute('class','btn btn-warning');
            confirm.innerText='Edytuj';
            confirm.onclick=function(){
                /* RUN EDIT MODE */
                ProjectConst.pcEdit();
            };
            

            group.appendChild(confirm);
        ProjectConst.Modal.link['button'].appendChild(group);
        ProjectConst.Modal.link['buttonConfirm']=confirm;
    }
    sendConst(fd){
        console.log('ProjectConst::sendConst()');
        console.log(ProjectConst.Modal.link['form']);
        if(ProjectConst.errorStatus){
            console.log(ProjectConst.errorStatus);
            console.log('ERROR EXIST NO SEND DATA');
            return false;
        }
        //Xhr.loadNotify=Modal.link['extra'];
        console.log(ProjectConst.Items.appurl);
        ProjectConst.Modal.loadNotify='<img src="'+ProjectConst.Items.appurl+'/img/loading_60_60.gif" alt="load_gif">';
        ProjectConst.Modal.showLoad();
        ProjectConst.Xhr.setRun(ProjectConst,'runModal');
        ProjectConst.Xhr.run('POST',fd,ProjectConst.Items.router+'confirmProjectConst');
    }
    checkInputConst(id,value){
        console.log('ProjectConst::checkInputConst()\r\n'+id);
        const input = id.split('-');
        switch (input[0]) {
            case 'nazwa':
                value=value.toUpperCase();
                ProjectConst.checkInputConstValue(input[0],input[1],value,/^[a-zA-Z]([a-zA-Z]|\d){2,29}$/);
                ProjectConst.checkInputConstExist(input[0],input[1],value);
              break;
            case 'wartosc':
                ProjectConst.checkInputConstValue(input[0],input[1],value,/^.{1,1024}$/);
                ProjectConst.checkInputConstExist(input[0],input[1],value);
                break;
            case 'id':
                break;
            default:
                alert('ProjectConst::checkInputConst() Error occurred!');
                console.log('ProjectConst::checkInputConst() WRONG INPUT - '+input);
          }
    }
    checkInputConstValue(inputName,inputNumber,value,regex){
        console.log('ProjectConst::checkInputConstValue()');
        if(!value.match(regex)){
            console.log('SET ERROR');
            ProjectConst.ErrorStack[inputName+'Err'+inputNumber].err='y';
            ProjectConst.Items.setError(ProjectConst.ErrorStack[inputName+'Err'+inputNumber].ele,'Wprowadzona wartość zawiera niedozwolone znaki, nie spełnia wymagań co do ilości znaków lub konstrukcji!');//ProjectConst.ErrorStack['nameErr0'].value
            ProjectConst.errorStatus=true;
            ProjectConst.Html.setDisabled(ProjectConst.Modal.link['buttonConfirm']);
        }
        else{
            ProjectConst.ErrorStack[inputName+'Err'+inputNumber].err='n';
            ProjectConst.Items.unsetError(ProjectConst.ErrorStack[inputName+'Err'+inputNumber].ele);
            ProjectConst.setEnabled(ProjectConst.Modal.link['buttonConfirm']);
        }   
    }
    checkInputConstExist(inputName,inputNumber,inputValue){
        console.log('ProjectConst::checkInputConstExist()\r\n'+inputValue);
        /* CHECK IS NOT ALREADY ERROR SETUP */
        if(ProjectConst.ErrorStack[inputName+'Err'+inputNumber].err==='y'){
            console.log('ALREADY ERROR');
            return false;
        }
        inputValue=inputValue.trim();
        console.log('CONSTS FROM DATABASE');
        //console.log(ProjectConst.allConsts);
        for(var i=0; i<ProjectConst.allConsts.length;i++){
            //console.log(ProjectConst.allConsts[i]);
            if(ProjectConst.allConsts[i][inputName]===inputValue){
                ProjectConst.ErrorStack[inputName+'Err'+inputNumber].err='y';
                ProjectConst.Items.setError(ProjectConst.ErrorStack[inputName+'Err'+inputNumber].ele,'Wprowadzona wartość już istnieje! Wartość modyfikowana <b>'+ProjectConst.allConsts[i]['mod_date']+'</b> przez <b>'+ProjectConst.allConsts[i]['mod_user_full_name']+'</b>.');
                ProjectConst.errorStatus=true;
                break;
            }
        }
    }
    checkConst(fd){
        console.log('ProjectConst::checkConst()');
        console.log(ProjectConst.ErrorStack);
        console.log(fd);
        for(var pair of fd.entries()) {
            ProjectConst.checkInputConst(pair[0],pair[1]);
        }
        /* CHECK FOR ERROR STACK EXIST - IF NO THERE NO INPUT */
        if(ProjectConst.checkInputIsEmpty()){
            ProjectConst.Html.setDisabled(ProjectConst.Modal.link['buttonConfirm']);
        }
    }
    
     isObjectEmpty(object) {
        var isEmpty = true;
        for (var keys in object) {
            isEmpty = false;
            break; // exiting since we found that the object is not empty
        }
        return isEmpty;
    }
    checkInputIsEmpty(){
        console.log('ProjectConst::checkInputIsEmpty()');
        console.log(ProjectConst.ErrorStack);
        console.log(ProjectConst.isObjectEmpty(ProjectConst.ErrorStack));
        if(ProjectConst.isObjectEmpty(ProjectConst.ErrorStack)){
            ProjectConst.Items.setError(ProjectConst.Modal.link['error'],'Wprowadź co najmniej jedną stałą.');
            ProjectConst.errorStatus=true;
            console.log('ERROR STACK IS EMPTY');
            return true;
        }
        console.log('ERROR STACK NOT EMPTY');
        return false;
    }
    pcDetails(){
        console.log('ProjectConst::pcDetails()');
        ProjectConst.Items.prepareModal('Podgląd Stałej','bg-warning');
        ProjectConst.Items.setCloseModal(ProjectConstTable,'runTable',ProjectConst.defaultTask+ProjectConst.data['data']['value']['const'].i);
        /* CLEAR ERROR STACK */
        ProjectConst.ErrorStack={};
        ProjectConst.allConsts=ProjectConst.data['data']['value']['all'];
        ProjectConst.fieldDisabled=true;
        ProjectConst.setInputConst(ProjectConst.Modal.link['adapted'],ProjectConst.data['data']['value']['const'].n,ProjectConst.data['data']['value']['const'].v,'0',null);
        ProjectConst.Modal.link['adapted'].appendChild(ProjectConst.createLegendRow()); 
        ProjectConst.setEditButtons(ProjectConst.data['data']['value']['const'].i);
        /*
         * INFO
         */
        ProjectConst.Items.setModalInfo("Project Const ID: "+ProjectConst.data['data']['value']['const'].i+", Create user: "+ProjectConst.data['data']['value']['const'].cu+" ("+ProjectConst.data['data']['value']['const'].cul+"), Create date: "+ProjectConst.data['data']['value']['const'].cd+", Modification made at date: "+ProjectConst.data['data']['value']['const'].md+" by user: "+ProjectConst.data['data']['value']['const'].mu);
    }
    pcEdit(){
        console.log('ProjectConst::pcEdit()');
        ProjectConst.Modal.clearData();
        ProjectConst.Modal.setHead('Edycja Stałej','bg-warning');
        
        ProjectConst.fieldDisabled=false;
        /* SET FORM */
        var form=document.createElement('FORM');
        ProjectConst.setInputConst(form,ProjectConst.data['data']['value']['const'].n,ProjectConst.data['data']['value']['const'].v,ProjectConst.data['data']['value']['const'].i,null);
        ProjectConst.Modal.link['adapted'].appendChild(form);
        ProjectConst.Modal.link['adapted'].appendChild(ProjectConst.createLegendRow()); 
        ProjectConst.Modal.link['form']=ProjectConst.Modal.link['adapted'].childNodes[0];
        ProjectConst.setConfirmButtons(ProjectConst.data['data']['value']['const'].i);
         /*
         * INFO
         */
        ProjectConst.Items.setModalInfo("Project Const ID: "+ProjectConst.data['data']['value']['const'].i+", Create user: "+ProjectConst.data['data']['value']['const'].cu+" ("+ProjectConst.data['data']['value']['const'].cul+"), Create date: "+ProjectConst.data['data']['value']['const'].cd+", Modification made at date: "+ProjectConst.data['data']['value']['const'].md+" by user: "+ProjectConst.data['data']['value']['const'].mu);
   
    }
    pcHide(){
        console.log('ProjectConst::pcHide()');
        ProjectConst.Items.prepareModal('Ukrywanie Stałej','bg-secondary');
        ProjectConst.Items.setCloseModal(ProjectConstTable,'runTable',ProjectConst.defaultTask+ProjectConst.data['data']['value']['const'].i);
        ProjectConst.setChangeDataState('Ukryj','secondary');
    }
    pcDelete(){
        console.log('ProjectConst::pcDelete()');
        ProjectConst.Items.prepareModal('Usuwanie Stałej','bg-danger');
        ProjectConst.Items.setCloseModal(ProjectConstTable,'runTable',ProjectConst.defaultTask+ProjectConst.data['data']['value']['const'].i);
        ProjectConst.setChangeDataState('Usuń','danger');       
    }
    setChangeDataState(btnLabel,titleClass){
        console.log('ProjectConst::setChangeDataState()');
        console.log(ProjectConst.data['data']);
        
        var form=ProjectConst.Html.getForm();
        var h=document.createElement('H5');
            h.setAttribute('class','text-'+titleClass+' mb-3 text-center font-weight-bold');
            h.innerHTML=ProjectConst.data['data']['value']['const'].n;
            
        form.appendChild(ProjectConst.Html.getInput('id',ProjectConst.data['data']['value']['const'].i,'hidden'));
        
        ProjectConst.Items.setChangeStateFields(form,ProjectConst.data['data']['value']['slo']);
        ProjectConst.Modal.link['form']=form; 
        ProjectConst.Modal.link['adapted'].appendChild(h);
        ProjectConst.Modal.link['adapted'].appendChild(form);

        var confirmButton=ProjectConst.Html.confirmButton(btnLabel,'btn btn-'+titleClass,ProjectConst.data['data']['function']);   
            confirmButton.onclick = function () {
                console.log(this.id);
                console.log(ProjectConst.Modal.link['form']);
                const fd = new FormData(ProjectConst.Modal.link['form']);
                
                if(confirm('Potwierdź wykonanie akcji')){   
                    //ProjectStage.Xhr.setRun(ProjectStage.Items,'cModal');
                    ProjectConst.Modal.loadNotify='<img src="'+ProjectConst.Items.appurl+'/img/loading_60_60.gif"/>';
                    ProjectConst.Modal.showLoad();
                    //Modal.link['extra']
                    ProjectConst.Xhr.run('POST',fd,ProjectConst.Items.router+this.id);
                };
            };
        ProjectConst.Modal.link['button'].appendChild(ProjectConst.Items.getCancelButton(ProjectConst.ProjectConstTable,'runTable',ProjectConst.defaultTask+ProjectConst.data['data']['value']['const'].i));   
        ProjectConst.Modal.link['button'].appendChild(confirmButton);
        /*
         * INFO
         */
        ProjectConst.Items.setModalInfo("Project Const ID: "+ProjectConst.data['data']['value']['const'].i+", Create user: "+ProjectConst.data['data']['value']['const'].cu+" ("+ProjectConst.data['data']['value']['const'].cul+"), Create date: "+ProjectConst.data['data']['value']['const'].cd);
        }
}