class ProjectConstCreate{
    ErrorStack={};
    iField=0;
    Modal = new Object();
    Html = new Object();
    Xhr = new Object();
    Const = new Object();
    Items = new Object();
    fieldDisabled=false;
    errorStatus=false;
    allConsts=new Array();
    data={};
    
    constructor(Main){
        console.log('ProjectConstCreate::constructor');
        this.Modal=Main.Items.Modal;
        this.Items=Main.Items;
        this.Const=Main;
        this.Html=Main.Items.Html;
        this.Xhr=Main.Items.Xhr2;
    }
    create(){
        try{
            this.getData('getProjectConstList','prepare');   
        }
        catch(error){
            console.log('ProjectConstCreate::prepare()');
            console.log(error);
            throw 'An Application Error Has Occurred!';
        }
        //this.Glossary=this.Items.Glossary['const'];
    }
    /* pcDetails */
    details(response){
        try{
            console.log('ProjectConstCreate::details()');
            this.data =this.Items.parseResponse(response);
            console.log(this.data);
            console.log(this.data['data']['value']['const']);
            /* TO DO IN FUTURE -> ADD setCloseModal multi id's */
            this.Modal.clearData();
            this.Items.setCloseModal(this.Const,'show',this.Const.defaultTask+this.data['data']['value']['const'].i);
            /* CLEAR ERROR STACK */
            this.ErrorStack={};
            /* SET CONSTS */
            this.allConsts=this.data['data']['value']['all'];
            this.fieldDisabled=true;
            /* form,constName,constValue,constId,rmButton */
            /* TO DO -> Multi -> loop over data.value.const */
            this.setInputConst(this.Modal.link['adapted'],this.data['data']['value']['const'].n,this.data['data']['value']['const'].v,'0',null);
            this.Modal.link['adapted'].appendChild(this.createLegendRow()); 
            /* CHECK IS BLOCKED  IF this.data['data']['value']['const'].bl NOT NULL => DISABLED */
            
            this.setEditButtons(this.data['data']['value']['const'].i,this.data['data']['value']['const'].bl);
            /*
             * INFO
             */
            this.Items.Modal.setInfo("Project Const ID: "+this.data['data']['value']['const'].i+", Create user: "+this.data['data']['value']['const'].cu+" ("+this.data['data']['value']['const'].cul+"), Create date: "+this.data['data']['value']['const'].cd+", Modification made at date: "+this.data['data']['value']['const'].md+" by user: "+this.data['data']['value']['const'].mu);
            
        }
        catch(error){
            console.log('ProjectConstCreate::details()');
            console.log(error);
            this.Items.Table.setError('An Application Error Has Occurred!');
            return false;
        }
        /* IN ANOTHER BLOCK TRY CATCH TO PREVENT OPEN MODAL IF ERROR EXISTS TO HIDE ERROR SHOWED IN TABLE  */
        try{
            this.Items.prepareModal('Podgl??d Sta??ej','bg-warning');
        }
        catch(error){
            console.log('ProjectConstCreate::prepare()');
            console.log(error);
            this.Items.Table.setError('An Application Error Has Occurred!');
        }
    }
    /* pcEdit */
    block(){
        try{
            console.log('ProjectConstCreate::block()');
            /* SEND BLOCK */
            var xhrParm={
                t:"GET",
                u:this.Items.router+'blockConst&id='+this.data['data']['value']['const'].i,
                /* FOR POST SET TRUE */
                c:true,
                d:null,
                o:this,
                m:'edit'
            };
            this.Xhr.run(xhrParm);
        }
        catch(error){
            console.log('ProjectConstCreate::block()');
            console.log(error);
            this.Html.showField(this.Modal.link['error'],'An Application Error Has Occurred!');
        }
    }
    edit(response){
        try{
            console.log('ProjectConstCreate::edit()');
            var blockData =this.Items.parseResponse(response);
            console.log(blockData);
        }
        catch(error){
            this.Html.showField(this.Modal.link['error'],error);
            return false;
        }
        try{            
            this.Modal.clearData();
            this.Modal.setHead('Edycja Sta??ej','bg-warning');   
            this.fieldDisabled=false;
            
            /* SET FORM */
            var form=document.createElement('FORM');
                this.setInputConst(form,this.data['data']['value']['const'].n,this.data['data']['value']['const'].v,this.data['data']['value']['const'].i,null);
                this.Modal.link['adapted'].appendChild(form);
                this.Modal.link['adapted'].appendChild(this.createLegendRow()); 
                this.Modal.link['form']=this.Modal.link['adapted'].childNodes[0];
                this.setConfirmButtons(this.data['data']['value']['const'].i);
            /*
             * INFO
             */
            this.Items.Modal.setInfo("Project Const ID: "+this.data['data']['value']['const'].i+", Create user: "+this.data['data']['value']['const'].cu+" ("+this.data['data']['value']['const'].cul+"), Create date: "+this.data['data']['value']['const'].cd+", Modification made at date: "+this.data['data']['value']['const'].md+" by user: "+this.data['data']['value']['const'].mu);
        }
        catch(error){
            console.log('ProjectConstCreate::edit() ERROR');
            console.log(error);
            //this.Items.Table.setError('An Application Error Has Occurred!');
            this.Html.showField(this.Modal.link['error'],'An Application Error Has Occurred!');
        }
    }
    getData(u,m){
        console.log('ProjectConstCreate::getData()');
        var xhrParm={
            t:"GET",
            u:this.Items.router+u,
            c:false,
            d:null,
            o:this,
            m:m
        };
        this.Xhr.run(xhrParm);
    }
    prepareData(){
        console.log('ProjectConstCreate::prepareData()');
        this.iField=0;
        this.ErrorStack={};
    }
    prepare(response){
        console.log('ProjectConstCreate::prepareConst()');  
        try{
            this.data =this.Items.parseResponse(response);
            this.allConsts=this.data['data']['value']['all'];
            this.ErrorStack={};
            console.log(this.allConsts);
            /* RUN FROM XHR */
            //console.log(ProjectConst.data);
            this.prepareData();
            this.Modal.clearData();
            this.Items.setCloseModal(this.Const,'show',this.Const.defaultTask+'0');            
            var form=document.createElement('FORM');
            this.setInputConst(form,'','','0',this.getRemoveButtonCol(this.iField));
            this.Modal.link['adapted'].appendChild(form);
            this.Modal.link['adapted'].appendChild(this.createAddButtonRow()); 
            this.Modal.link['adapted'].appendChild(this.createLegendRow()); 
            this.Modal.link['form']=this.Modal.link['adapted'].childNodes[0];
            this.setConfirmButtons('0');
        }
        catch(error){
            console.log('ProjectConstCreate::prepare()');
            console.log(error);
            /* AFTER XHR -> RUN TABLE ERROR */
            this.Items.Table.setError('An Application Error Has Occurred!');
            return false;
            //this.Html.showField(ele,error);
            //throw 'An Application Error Has Occurred!';
        }
        /* IN ANOTHER BLOCK TRY CATCH TO PREVENT OPEN MODAL IF ERROR EXISTS TO HIDE ERROR SHOWED IN TABLE  */
        try{
            this.Items.prepareModal('Nowa sta??a','bg-warning');
        }
        catch(error){
            console.log('ProjectConstCreate::prepare()');
            console.log(error);
            //throw 'An Application Error Has Occurred!';
            this.Items.Table.setError('An Application Error Has Occurred!');
        }
        
        
    }
    setInputConst(form,constName,constValue,constId,rmButton){
        console.log('ProjectConstCreate::setInputConst()\r\nCONST ID:'+constId+'\r\niField:'+this.iField);
        console.log(this.Modal.link['adapted']);
        var hr=document.createElement('HR');
        var rowAll=this.Html.getRow();
        var colAll=document.createElement('DIV');
            colAll.setAttribute('class','col-12');
            colAll.appendChild(hr);
            /*
             * CONST ID
             */
            form.appendChild(this.Html.getInput('id-'+this.iField,constId,'hidden'));
            /*
             * CONST NAME
             */  
            var nameDiv = this.newConstRow("Nazwa:","Write name","nazwa-"+this.iField,constName); 
            if(rmButton!==null){
                nameDiv.appendChild(rmButton);
            }
            colAll.appendChild(nameDiv);
            /*
             * CONST NAME ERROR
             */
            colAll.appendChild(this.createErrorDivRow('nazwaErr'+this.iField));
            /*
             * CONST VALUE
             */  
            colAll.appendChild(this.newConstRow("Warto????:","Write value","wartosc-"+this.iField,constValue));
            /*
             * CONST VALUE ERROR
             */
            colAll.appendChild(this.createErrorDivRow('wartoscErr'+this.iField));
            rowAll.appendChild(colAll);
            form.appendChild(rowAll);
    }
    getRemoveButtonCol(id){
        var colrm=document.createElement('DIV');
            colrm.setAttribute('class','col-sm-1');
            colrm.appendChild(this.createRemoveButton(id));
            //colrm.appendChild(this.createRemoveButton("rm-"+id));
            return colrm;
    }
    createRemoveButton(id){
        // i PARAMETERS
        var i=document.createElement('i');
            i.setAttribute('class','fa fa-minus');
            i.setAttribute('aria-hidden','true');
            i.setAttribute('style','color:#ffffff;');         
        var div=document.createElement('div');
            div.setAttribute('class','btn btn-danger');
            //div.setAttribute('id',id);
        var Main = this;
            /* CLOSURE */
            div.onclick=function(){
                Main.updateErrorStack(id);
                console.log(this.parentNode.parentNode.parentNode.parentNode);
                
                this.parentNode.parentNode.parentNode.parentNode.remove();
            };
        div.appendChild(i);
        return(div); 
    }
    updateErrorStack(id){
        console.log('ProjectConstCreate::updateErrorStack()\r\nid');
        console.log(id);
        
        //return true;
        //const tmpId=id.split('-');
        /* DELETE KEY FROM ERROR STACK */
        //delete this.ErrorStack['nazwaErr'+tmpId[1]];
        //delete this.ErrorStack['wartoscErr'+tmpId[1]];
        delete this.ErrorStack['nazwaErr'+id];
        delete this.ErrorStack['wartoscErr'+id];
        
        this.setEnabled(this.Modal.link['buttonConfirm']);
        
        /* CHECK FOR THE REMAINING ELEMENTS OF ERROR STACK */ 
        /* CHECK FOR ERROR STACK EXIST - IF NO THERE NO INPUT */
        if(this.checkInputIsEmpty()){
            this.Html.setDisabled(this.Modal.link['buttonConfirm']);
        }
        
    }
    setEnabled(ele){
        /* CHECK IS THERE NO MORE ERRORS BEFORE ENABLE */
        for(const [key, value] of Object.entries(this.ErrorStack)){
            console.log(value.err);
            if(value.err==='y'){
                /* ERROR INPUT STILL EXIST */
                return false;
            }
        }
        /* CHECK IS THE INPUT FIELDS */
        this.errorStatus=false;
        ele.classList.remove("disabled");
        ele.removeAttribute('disabled');
    }
    checkInputIsEmpty(){
        console.log('ProjectConstCreate::checkInputIsEmpty()');
        console.log(this.ErrorStack);
        console.log(this.isObjectEmpty(this.ErrorStack));
        if(this.isObjectEmpty(this.ErrorStack)){
            //this.Items.setError(this.Modal.link['error'],'Wprowad?? co najmniej jedn?? sta????.');
            this.Html.showField(this.Modal.link['error'],'Wprowad?? co najmniej jedn?? sta????.');
            this.errorStatus=true;
            console.log('ERROR STACK IS EMPTY');
            return true;
        }
        console.log('ERROR STACK NOT EMPTY');
        return false;
    }
    isObjectEmpty(object) {
        var isEmpty = true;
        for (var keys in object) {
            isEmpty = false;
            break; // exiting since we found that the object is not empty
        }
        return isEmpty;
    }
    createAddButtonRow(){
        /*
         * ADD BUTTON ROW
         */
        var row=this.Html.getRow();
        var col=document.createElement('DIV');
            col.setAttribute('class','col-sm-1');
            col.appendChild(this.createAddButton());
        var col1=document.createElement('DIV');
            col1.setAttribute('class','col-sm-11');   
            row.appendChild(col);
            row.appendChild(col1);
        return row;
    }
    createAddButton(){
        console.log('ProjectConstCreate::createAddButton()');
        var i=document.createElement('i');
            i.setAttribute('class','fa fa-plus');
            i.setAttribute("aria-hidden","true");
        var div=document.createElement('div');
            div.setAttribute('class','btn btn-success btn-add');
            div.appendChild(i);
        var Main = this;
            div.onclick=function(){
                Main.iField++;
                Main.setInputConst(Main.Modal.link['form'],'','','0',Main.getRemoveButtonCol(Main.iField));
                /* UNSET MAIN ERROR */
                Main.Html.hideAndClearField(Main.Modal.link['error']);
                //this.Items.unsetError(this.Modal.link['error']);
                Main.setEnabled(Main.Modal.link['buttonConfirm']);
            };
           
        return (div);
    }
    createLegendRow(){
        /*
         * ADD BUTTON ROW
         */
        var row=this.Html.getRow();
        var col=document.createElement('DIV');
            col.setAttribute('class','col-sm-1');
        var col1=document.createElement('DIV');
            col1.setAttribute('class','col-sm-11');   
            col1.innerHTML="<ul><li>Nazwa sta??ej musi spe??nia?? nast??puj??ce warunki:<ul><li>musi si?? rozpoczyna?? znakiem alfabetu;</li><li>nie mo??e zawiera?? polskich znak??w;</li><li>mo??e zawiera?? tylko i wy????cznie litery alfabetu i liczby;</li><li>musi zawiera?? minimum 3 znaki;</li><li>nie mo??e by?? d??u??sza ni?? 30 znak??w.</li></ul></li><li>Warto???? sta??ej musi spe??nia?? nast??puj??ce warunki:<ul><li>musi zawiera?? minimum 1 znak;</li><li>nie mo??e by?? d??u??sza ni?? 1024 znaki.</li></ul></li></ul>";
            row.appendChild(col);
            row.appendChild(col1);
        return row;
    }
    setConfirmButtons(){
        console.log('ProjectConstCreate::setConfirmButtons()');
        var group=this.Html.getGroupButton();
            group.appendChild(this.Items.getCancelButton(this.Const,'show',this.Const.defaultTask+'0'));
        var confirm=document.createElement('button');
            confirm.setAttribute('class','btn btn-primary');
            confirm.innerText='Zatwierd??';
        var Main = this;
            confirm.onclick=function(){
                const fd = new FormData(Main.Modal.link['form']);
                Main.checkConst(fd);
                Main.sendConst(fd);
            };
            
            
            group.appendChild(confirm);
        this.Modal.link['button'].appendChild(group);
        this.Modal.link['buttonConfirm']=confirm;
    }
    setEditButtons(idRecord,blockUser){
        console.log('ProjectConstCreate::setEditButtons()');
        console.log(blockUser);
        var group=this.Items.Html.getGroupButton();
            group.appendChild(this.Items.getCancelButton(this.Const,'show',this.Const.defaultTask+idRecord));
        var confirm=document.createElement('button');
            confirm.setAttribute('class','btn btn-warning');
            confirm.innerText='Edytuj';
        if(blockUser){
            //confirm.setAttribute('disabled','');
            this.Html.setDisabled(confirm);
            this.Html.showField(this.Modal.link['error'],'Actual blocked by user: '+blockUser);
        }
        else{
            
            var ProjectConstCreate = this;
                confirm.onclick=function(){
                    /* RUN EDIT MODE */
                    ProjectConstCreate.block();
                };
        }
        
            group.appendChild(confirm);
        this.Items.Modal.link['button'].appendChild(group);
        this.Items.Modal.link['buttonConfirm']=confirm;
    }
    checkConst(fd){
        console.log('ProjectConstCreate::checkConst()');
        console.log(this.ErrorStack);
        console.log(fd);
        for(var pair of fd.entries()) {
            this.checkInputConst(pair[0],pair[1]);
        }
        /* CHECK FOR ERROR STACK EXIST - IF NO THERE NO INPUT */
        if(this.checkInputIsEmpty()){
            this.Html.setDisabled(this.Modal.link['buttonConfirm']);
        }
    }
    checkInputConst(id,value){
        console.log('ProjectConstCreate::checkInputConst()\r\n'+id);
        const input = id.split('-');
        switch (input[0]) {
            case 'nazwa':
                value=value.toUpperCase();
                this.checkInputConstValue(input[0],input[1],value,/^[a-zA-Z]([a-zA-Z]|\d){2,29}$/);
                this.checkInputConstExist(input[0],input[1],value);
              break;
            case 'wartosc':
                this.checkInputConstValue(input[0],input[1],value,/^.{1,1024}$/);
                this.checkInputConstExist(input[0],input[1],value);
                break;
            case 'id':
                break;
            default:
                alert('ProjectConstCreate::checkInputConst() Error occurred!');
                console.log('ProjectConstCreate::checkInputConst() WRONG INPUT - '+input);
          }
    }
    checkInputConstValue(inputName,inputNumber,value,regex){
        console.log('ProjectConstCreate::checkInputConstValue()');
        if(!value.match(regex)){
            console.log('SET ERROR');
            this.ErrorStack[inputName+'Err'+inputNumber].err='y';
            this.Html.showField(this.ErrorStack[inputName+'Err'+inputNumber].ele,'Wprowadzona warto???? zawiera niedozwolone znaki, nie spe??nia wymaga?? co do ilo??ci znak??w lub konstrukcji!');
            //this.Items.setError();//ProjectConst.ErrorStack['nameErr0'].value
            this.errorStatus=true;
            this.Html.setDisabled(this.Modal.link['buttonConfirm']);
        }
        else{
            this.ErrorStack[inputName+'Err'+inputNumber].err='n';
            //this.Items.unsetError(this.ErrorStack[inputName+'Err'+inputNumber].ele);
            this.Html.hideAndClearField(this.ErrorStack[inputName+'Err'+inputNumber].ele);
            this.setEnabled(this.Modal.link['buttonConfirm']);
        }   
    }
    checkInputConstExist(inputName,inputNumber,inputValue){
        console.log('ProjectConstCreate::checkInputConstExist()\r\n'+inputValue);
        /* CHECK IS NOT ALREADY ERROR SETUP */
        if(this.ErrorStack[inputName+'Err'+inputNumber].err==='y'){
            console.log('ALREADY ERROR');
            return false;
        }
        inputValue=inputValue.trim();
        console.log('CONSTS FROM DATABASE');
        //console.log(ProjectConst.allConsts);
        for(var i=0; i<this.allConsts.length;i++){
            //console.log(ProjectConst.allConsts[i]);
            if(this.allConsts[i][inputName]===inputValue){
                this.ErrorStack[inputName+'Err'+inputNumber].err='y';
                //this.Items.setError(this.ErrorStack[inputName+'Err'+inputNumber].ele,'Wprowadzona warto???? ju?? istnieje! Warto???? modyfikowana <b>'+this.allConsts[i]['mod_date']+'</b> przez <b>'+this.allConsts[i]['mod_user_full_name']+'</b>.');
                this.Html.showField(this.ErrorStack[inputName+'Err'+inputNumber].ele,'Wprowadzona warto???? ju?? istnieje! Warto???? modyfikowana <b>'+this.allConsts[i]['mod_date']+'</b> przez <b>'+this.allConsts[i]['mod_user_full_name']+'</b>.');
                this.errorStatus=true;
                this.Html.setDisabled(this.Modal.link['buttonConfirm']);
                break;
            }
        }
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
            if(this.fieldDisabled){
                /* SET READONLY */
                input.setAttribute('readonly','');
            }
            else{
                /* APPEND FUNCTION */
                var Parent = this;
                input.onblur=function(){
                    Parent.checkInputConst(this.id,this.value);
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
    createErrorDivRow(id){
        /*
         * DIV ERROR
         */
        var row=this.Html.getRow();
            row.setAttribute('id',id);
        var col=document.createElement('DIV');
            col.setAttribute('class','col-sm-1');
        var col1=document.createElement('DIV');
            col1.setAttribute('class','col-sm-10 alert alert-danger d-none');//d-none
            row.appendChild(col);
            row.appendChild(col1);
        this.ErrorStack[id]={
            err:'n',
            ele:col1
        };
        
        return row;
    }
    sendConst(fd){
        console.log('ProjectConstCreate::sendConst()');
        try{
             console.log(this.Modal.link['form']);
            if(this.errorStatus){
                console.log(this.errorStatus);
                console.log('ERROR EXIST NO SEND DATA');
                return false;
            }
            //Xhr.loadNotify=Modal.link['extra'];
            console.log(this.Items.appurl);

            var xhrParm={
                t:"POST",
                u:this.Items.router+'confirmProjectConst',
                /* FOR POST SET TRUE */
                c:true,
                d:fd,
                o:this.Items,
                m:'setModalResponse'
            };

            //console.log(this.Xhr.LoadStart);

            this.Xhr.run(xhrParm);
        }
        catch(error){
            console.log('ProjectConstCreate::prepare()');
            console.log(error);
            //throw 'An Application Error Has Occurred!';
            //this.Items.Table.setError('An Application Error Has Occurred!');
            this.Html.showField(this.Modal.link['error'],'An Application Error Has Occurred!');
        }
       
        
        //this.Modal.loadNotify='<img src="'+this.Items.appurl+'/img/loading_60_60.gif" alt="load_gif">';
        //this.Modal.showLoad();
        //ProjectConst.Xhr.setRun(ProjectConst,'runModal');
        //ProjectConst.Xhr.run('POST',fd,ProjectConst.Items.router+'confirmProjectConst');
        /* SEND DATA - XHR */
        
    }
}

