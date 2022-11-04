class ProjectVariableCreate{
    ErrorStack=new Object();
    iField=0;
    Modal = new Object();
    Html = new Object();
    Xhr = new Object();
    Variable = new Object();
    Items = new Object();
    fieldDisabled=false;
    /* TURN OFF */
    //defined=new Array();
    data={};
    Helplink=new Object();
    Utilities = new Object();
    
    constructor(Parent){
        //console.log('ProjectVariableCreate::constructor');
        this.Modal=Parent.Items.Modal;
        this.Items=Parent.Items;
        this.Variable=Parent;
        this.Html=Parent.Items.Html;
        this.Xhr=Parent.Items.Xhr2;
        this.Utilities=Parent.Items.Utilities;
        this.ErrorStack = Parent.Items.ErrorStack;
    }
    getHelplink(){
        return {
                input:{},
                error:this.Modal.link.error
            };
    }

    /* pcDetails */
    details(response){
        try{
            console.log('ProjectVariableCreate::details()');
            this.Helplink=this.getHelplink();
            this.data =this.Items.parseResponse(response);
            console.log(this.data);
            console.log(this.data['data']['value']['variable'].i);
            //console.log(this.data['data']['value']['const']);
            /* TO DO IN FUTURE -> ADD setCloseModal multi id's */
            this.Modal.clearData();
            //this.Items.setCloseModal(this.Variable,'show',this.Variable.defaultTask+this.data['data']['value']['const'].i);
            this.Items.setCloseModal(this.Variable.setUndoTask(this.Variable,this.Variable.defaultTask+this.data['data']['value']['variable'].i));
            /* CLEAR ERROR STACK */
            this.ErrorStack.clearStack();
            /* TURN OFF */
            //this.defined=this.data['data']['value']['all'];
            this.fieldDisabled=true;
            this.iField=0;
            /* form,constName,constValue,constId,rmButton */
            /* TO DO -> Multi -> loop over data.value.const */
            this.setInput(this.Modal.link['adapted'],this.data['data']['value']['variable']);
            //this.setInput(this.Modal.link['adapted'],this.data['data']['value']['const'].n,this.data['data']['value']['const'].v,'0',null);
            this.Modal.link['adapted'].appendChild(this.getLegend()); 
            /* CHECK IS BLOCKED  IF this.data['data']['value']['const'].bl NOT NULL => DISABLED */
            
            this.setEditButtons(this.data['data']['value']['variable'].i,this.data['data']['value']['variable'].bl);
            /*
             * INFO
             */
            this.Items.Modal.setInfo("Project Variable ID: "+this.data['data']['value']['variable'].i+", Create user: "+this.data['data']['value']['variable'].cu+" ("+this.data['data']['value']['variable'].cul+"), Create date: "+this.data['data']['value']['variable'].cd+", Modification made at date: "+this.data['data']['value']['variable'].md+" by user: "+this.data['data']['value']['variable'].mu);
            
        }
        catch(error){
            console.log('ProjectVariableCreate::details()');
            console.log(error);
            this.Items.Table.setError('An Application Error Has Occurred!');
            return false;
        }
        /* IN ANOTHER BLOCK TRY CATCH TO PREVENT OPEN MODAL IF ERROR EXISTS TO HIDE ERROR SHOWED IN TABLE  */
        try{
            this.Items.prepareModal('Podgląd Zmiennej','bg-purple');
        }
        catch(error){
            console.log('ProjectVariableCreate::prepare()');
            console.log(error);
            this.Items.Table.setError('An Application Error Has Occurred!');
        }
    }
    /* pcEdit */
    block(){
        try{
            console.log('ProjectVariableCreate::block()');
            /* SEND BLOCK */
            var xhrParm={
                t:"GET",
                u:this.Items.router+'blockVariable&id='+this.data['data']['value']['variable'].i,
                /* FOR POST SET TRUE */
                c:true,
                d:null,
                o:this,
                m:'edit'
            };
            this.Xhr.run(xhrParm);
        }
        catch(error){
            console.log('ProjectVariableCreate::block()');
            console.log(error);
            this.Html.showField(this.Modal.link['error'],'An Application Error Has Occurred!');
        }
    }
    edit(response){
        try{
            console.log('ProjectVariableCreate::edit()');
            this.Helplink=this.getHelplink();
            var blockData =this.Items.parseResponse(response);
            console.log(blockData);
        }
        catch(error){
            this.Html.showField(this.Modal.link['error'],error);
            return false;
        }
        try{            
            this.Modal.clearData();
            this.Modal.setHead('Edycja Zmiennej','bg-purple');   
            this.fieldDisabled=false;
            this.iField=0;
            /* SET FORM */
            var form=document.createElement('FORM');
                this.setInput(form,this.data['data']['value']['variable']);
                //this.setInput(form,this.data['data']['value']['variable'].n,this.data['data']['value']['variable'].v,this.data['data']['value']['variable'].i,this.iField);
                this.Modal.link['adapted'].appendChild(form);
                this.Modal.link['adapted'].appendChild(this.getLegend()); 
                this.Modal.link['form']=this.Modal.link['adapted'].childNodes[0];
                this.setConfirmButton(this.data['data']['value']['variable'].i);
            /*
             * INFO
             */
            this.Items.Modal.setInfo("Project Variable ID: "+this.data['data']['value']['variable'].i+", Create user: "+this.data['data']['value']['variable'].cu+" ("+this.data['data']['value']['variable'].cul+"), Create date: "+this.data['data']['value']['variable'].cd+", Modification made at date: "+this.data['data']['value']['variable'].md+" by user: "+this.data['data']['value']['variable'].mu);
        }
        catch(error){
            console.log('ProjectVariableCreate::edit() ERROR');
            console.log(error);
            //this.Items.Table.setError('An Application Error Has Occurred!');
            this.Html.showField(this.Modal.link['error'],'An Application Error Has Occurred!');
        }
    }
    getData(u,m){
        console.log('ProjectVariableCreate::getData()');
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
    create(){
        console.log('ProjectVariableCreate::create()');         
        try{
            this.Helplink=this.getHelplink();
            this.fieldDisabled=false;
            /* TURN OFF */
            //this.data =this.Items.parseResponse(response);
            //this.defined=this.data['data']['value']['all'];
            //console.log(this.defined);
            this.ErrorStack.clearStack();
            /* RUN FROM XHR */
            //console.log(ProjectConst.data);
            this.iField=0;
            this.Modal.clearData();
            //this.Items.setCloseModal(this.Variable,'show',this.Variable.defaultTask+'0');    
            this.Items.setCloseModal(this.Variable.setUndoTask(this.Variable,this.Variable.defaultTask+'0')); 
            var form=document.createElement('FORM');
            this.setInput(form,{n:'',v:'',i:0});
            this.Modal.link['adapted'].appendChild(form);
            this.Modal.link['adapted'].appendChild(this.getAddButton()); 
            this.Modal.link['adapted'].appendChild(this.getLegend()); 
            this.Modal.link['form']=this.Modal.link['adapted'].childNodes[0];
            this.setConfirmButton(0);
        }
        catch(error){
            console.log('ProjectVariableCreate::create()');
            console.log(error);
            /* AFTER XHR -> RUN TABLE ERROR */
            this.Items.Table.setError('An Application Error Has Occurred!');
            return false;
            //this.Html.showField(ele,error);
            //throw 'An Application Error Has Occurred!';
        }
        /* IN ANOTHER BLOCK TRY CATCH TO PREVENT OPEN MODAL IF ERROR EXISTS TO HIDE ERROR SHOWED IN TABLE  */
        try{
            this.Items.prepareModal('Nowa zmienna','bg-purple');
        }
        catch(error){
            console.log('ProjectVariableCreate::create()');
            console.log(error);
            //throw 'An Application Error Has Occurred!';
            this.Items.Table.setError('An Application Error Has Occurred!');
        }   
    }
    setInput(form,data){
        /* data:
         * n - name value
         * v - value value
         * i - id database
         */
        console.log('ProjectVariableCreate::setInput()\r\nID:'+data+'\r\niField:'+this.iField);
        console.log(this.Modal.link['adapted']);
        //this.Helplink
        this.Helplink.input[this.iField]={
            field:{
                name:{
                    input:{},
                    error:{}
                },
                value:{
                    input:{},
                    error:{}
                }
            },
            id:data.i,
            all:{}
        };
        var row=this.Html.getRow();
            row.classList.add('form-group');
            row.appendChild(this.getHr());
            row.appendChild(this.Html.getInput('id-'+this.iField,data.i,'hidden'));
            row.appendChild(this.getInput("Nazwa:","Write name","name-"+this.iField,data.n,this.Helplink.input[this.iField].field.name,this.getRemoveButton(this.iField)));
            row.appendChild(this.getInput("Wartość:","Write value","value-"+this.iField,data.v,this.Helplink.input[this.iField].field.value,document.createElement('span')));
            this.Helplink.input[this.iField]['all']=row;
            console.log(this.Helplink);
            form.appendChild(row);
            this.iField++;
    }
    getInput(title,placeholder,id,value,Helplink,removeButton){
        var row1=this.Html.getRow();
            row1.classList.add('mt-0','mb-0');
        var row2=this.Html.getRow();
        var col1=this.Html.getCol(12);
            col1.classList.add('mt-1');
        var small=document.createElement('SMALL');
            small.setAttribute('id',id+'Help');
            small.classList.add('form-text','text-muted','m-0','p-0');
            small.appendChild(document.createTextNode('['+id+']'));
        var label=document.createElement('LABEL');
            label.classList.add('col-1','col-form-label','pt-0','pb-0');
            label.setAttribute('for',id);
            label.appendChild(document.createTextNode(title));
            label.appendChild(small);
        var divInput=this.Html.getCol(10);
        var divRemove=this.Html.getCol(1);
        var input=document.createElement('INPUT');
            input.classList.add('form-control','mt-1');
            input.setAttribute('type','text');
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
                var self = this;
                /* CLOSURE */
                input.onblur=function(){
                    try{
                        self.checkInput(self,id,this.value);
                        self.unsetError(self,Helplink.error,id);
                    }
                    catch(e){
                        self.setError(self,Helplink.error,id,e);
                    }
                };
            }
            Helplink.input=input;
            divInput.appendChild(input);
            divRemove.appendChild(removeButton);
            row1.appendChild(label);
            row1.appendChild(divInput);
            row1.appendChild(divRemove);
            
            this.getErrorDiv(row2,Helplink);
            col1.appendChild(row1);
            col1.appendChild(row2);
            
        return col1;
    }
    getHr(){
        var col=this.Html.getCol(12);
        var hr = document.createElement('HR');
            hr.classList.add('bg-purple');
            col.appendChild(hr);
            return col;
    }
    //setError(self,id,e){
    setError(self,HelplinkEle,id,e){
        self.ErrorStack.add(id,e);
        self.Html.removeChilds(HelplinkEle);
        HelplinkEle.appendChild(document.createTextNode(e));
        self.Html.removeClass(HelplinkEle,'d-none');
    }
    unsetError(self,HelplinkEle,id){
       self.ErrorStack.remove(id);
       self.Html.removeChilds(HelplinkEle);
       self.Html.addClass(HelplinkEle,'d-none'); 
    }
    getRemoveButton(i){
        var col = this.Html.getCol(1);
        var button = this.Html.removeButton();
        var self = this;
            /* CLOSURE */
            button.onclick=function(){
                self.ErrorStack.remove('name-'+i);
                self.ErrorStack.remove('value-'+i);
                self.Helplink.input[i]['all'].remove();
                delete self.Helplink.input[i];
                /* check is some input fields exists */
                console.log(self.Helplink.input);
                console.log(self);
                console.log(self.Utilities.countObjectProp(self.Helplink.input));
                if(self.Utilities.countObjectProp(self.Helplink.input)===0){
                    self.setError(self,self.Helplink.error,'empty','Wprowadź co najmniej jedną zmienną.');
                }
            };
        col.appendChild(button);
        return(col); 
    }
    getAddButton(){
        var row=this.Html.getRow();
        var col=this.Html.getCol(1);
        var col1=this.Html.getCol(11); 
        var button = this.Html.addButton();
        var self = this;
            button.onclick=function(){
                //self.iField++;
                self.unsetError(self,self.Helplink.error,'empty');
                self.setInput(self.Modal.link['form'],{n:'',v:'',i:0});
                /* UNSET MAIN ERROR */
                self.Html.hideAndClearField(self.Modal.link['error']);
            };
            col.appendChild(button);
            row.appendChild(col);
            row.appendChild(col1);
        return row;
    }
    getLegend(){
        var row=this.Html.getRow();
        var col=this.Html.getCol(12);
            col.classList.add('pl-5','t-1');
            col.innerHTML="<ul><li>Nazwa zmiennej musi spełniać następujące warunki:<ul><li>musi rozpoczynać się znakiem alfabetu;</li><li>nie może zawierać polskich znaków;</li><li>może zawierać tylko i wyłącznie litery alfabetu i liczby;</li><li>musi zawierać minimum 3 znaki;</li><li>nie może zawierać więcej niż 30 znaków.</li></ul></li><li>Wartość zmiennej musi spełniać następujące warunki:<ul><li>musi zawierać minimum 1 znak;</li><li>nie może zawierać więcej niż 4096 znaki.</li></ul></li></ul>";
        return row.appendChild(col);
    }
    setConfirmButton(id){
        console.log('ProjectVariableCreate::setConfirmButton()');
        var group=this.Html.getGroupButton();
            group.appendChild(this.Items.getCancelButton(this.Variable,'show',this.Variable.defaultTask+id));
        var confirm=document.createElement('button');
            confirm.classList.add('btn','btn-primary');
            confirm.appendChild(document.createTextNode('Zatwierdź'));   
        var self = this;
            confirm.onclick=function(){
                const fd = new FormData();//self.Modal.link['form']
                var data = self.check(self);
                console.log(data);
                if(data){
                    fd.append('data',JSON.stringify(data));
                    self.send(self,fd);
                }
            };
            group.appendChild(confirm);
            this.ErrorStack.setBlockEle(confirm);
        this.Modal.link['button'].appendChild(group);
        this.Modal.link['buttonConfirm']=confirm;
    }
    setEditButtons(idRecord,blockUser){
        console.log('ProjectVariableCreate::setEditButtons()');
        console.log(blockUser);
        console.log(this.Variable.defaultTask+idRecord);
        var group=this.Items.Html.getGroupButton();                
            group.appendChild(this.Items.getCancelButton(this.Variable,'show',this.Variable.defaultTask+idRecord));
        var confirm=document.createElement('button');
            confirm.setAttribute('class','btn btn-warning');
            confirm.innerText='Edytuj';
        if(blockUser){
            //confirm.setAttribute('disabled','');
            this.Html.setDisabled(confirm);
            this.Html.showField(this.Modal.link['error'],'Actual blocked by user: '+blockUser);
        }
        else{
            var self = this;
                confirm.onclick=function(){
                    /* RUN EDIT MODE */
                    self.block();
                };
        }
            group.appendChild(confirm);
        this.Items.Modal.link['button'].appendChild(group);
        this.Items.Modal.link['buttonConfirm']=confirm;
    }
    check(self){
        console.log('ProjectVariableCreate::check()');
        var check =true;
        var exist=false;
        var data={};
        for(const prop in self.Helplink.input){
           data[prop]={
                value:'',
                name:'',
                id:self.Helplink.input[prop].id  
            };
            //console.log(self.Helplink.input[prop]);
            for(const fieldProp in self.Helplink.input[prop].field){
                /* check name/value field */
                try{
                    self.checkInput(self,self.Helplink.input[prop].field[fieldProp].input.name,self.Helplink.input[prop].field[fieldProp].input.value);
                    data[prop][fieldProp]=self.Helplink.input[prop].field[fieldProp].input.value;
                }
                catch(e){
                    self.setError(self,self.Helplink.input[prop].field[fieldProp].error,self.Helplink.input[prop].field[fieldProp].input.name,e);
                    check=false;
                }
            }
            exist=true;
        }
        if(!exist){
            self.setError(self,self.Helplink.error,'empty','Wprowadź co najmniej jedną zmienną.');
            check=false;
        }
        if(check){
            return data;
        }
        return check;
    }
    checkInput(self,id,value){
        console.log('ProjectVariableCreate::checkInput()\r\n'+id);
        const input = id.split('-');
        switch (input[0]) {
            case 'name':
                value=value.toUpperCase();
                this.checkInputValue(value,/^[a-zA-Z]([a-zA-Z]|\d){2,29}$/);
                /* TURN OFF */
                //this.checkInputExist(self,'name',value);//input[0],input[1],
              break;
            case 'value':
                this.checkInputValue(value,/^.{1,1024}$/);
                /* TURN OFF */
                //this.checkInputExist(self,'value',value);
                break;
            case 'id':
                break;
            default:
                alert('ProjectVariableCreate::checkInput() Error occurred!');
                console.log('ProjectVariableCreate::checkInput() WRONG INPUT - '+input);
          }
    }
    checkInputValue(value,regex){
        console.log('ProjectVariableCreate::checkInputValue()');
        if(!value.match(regex)){
            throw 'Wprowadzona wartość zawiera niedozwolone znaki, nie spełnia wymagań co do ilości znaków lub konstrukcji!';
        } 
    }
    /* TURN OFF 
    checkInputExist(self,key,value){
        console.log('ProjectVariableCreate::checkInputExist()');
        value=value.trim();
        for(var i=0; i<self.defined.length;i++){
            console.log(self.defined[i][key]);
            if(self.defined[i][key]===value){
                throw 'Wprowadzona wartość już istnieje! Wartość modyfikowana '+self.defined[i]['mod_date']+' przez '+self.defined[i]['mod_user_full_name']+'.';
                break;
            }
        }
    }
    */
    getErrorDiv(ele,helplink){
        var col=this.Html.getCol(1);
            //col.classList.add('mb-0','pb-0');
        var col1=this.Html.getCol(10);
            //col1.classList.add('mb-0','pb-0');
        var alert=document.createElement('div');
            alert.classList.add('alert','alert-danger','mt-1','d-none','mb-0');
            //alert.appendChild(document.createTextNode('test'));
            col1.appendChild(alert);
            //d-none//alert alert-danger
        var col2=this.Html.getCol(1);
            //col2.classList.add('mb-0','pb-0');
        ele.appendChild(col);
        ele.appendChild(col1);
        ele.appendChild(col2);
        helplink['error']=alert;
    }
    send(self,fd){
        console.log('ProjectVariableCreate::send()');
        try{
            console.log(self.Modal.link['form']);
            //Xhr.loadNotify=Modal.link['extra'];
            console.log(self.Items.appurl);
            var xhrParm={
                t:"POST",
                u:self.Items.router+'confirmProjectVariable',
                /* FOR POST SET TRUE */
                c:true,
                d:fd,
                o:self.Variable,
                m:'setResponse'
            };
            this.Xhr.run(xhrParm);
        }
        catch(error){
            console.log('ProjectVariableCreate::prepare()');
            console.log(error);
            this.Html.showField(this.Modal.link['error'],'An Application Error Has Occurred!');
        }
    }

}