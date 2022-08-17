class ProjectVariableTable{
    Xhr= new Object();
    //XhrModal= new Object();
    Html= new Object();
    Parent = new Object();
    Table = new Object ();
    /* FROM ProjectConst 'getprojectsconstslike&u=0&v=1&b=' */
    defaultTask='';
    appUrl='';
    router='';
    
    head={
        0:{
            title:'ID',
            style:{
                width:'70px' /* NO SEMICOLON */
            },
            attribute:{
                scope:'col'
            }
        },
        1:{
            title:'Nazwa',
            style:{
                    width:'200px'
            },
            attribute:{
                scope:'col'
            }
        },
        2:{
            title:'Wartość',
            
            attribute:{
                scope:'col'
            }
        },
        3:{
            title:'',
            style:{
                width:'200px'
            },
            attribute:{
                scope:'col'
            }
        }};
    body={
        0:'0',
        1:'1',
        2:'2'
    };
    tableColException=new Array('bl');
    tableBody;
    constructor(Parent){
        console.log('ProjectVariableTable::construct()');  
        console.log(Parent);
        this.Parent=Parent;
        this.Table=Parent.Items.Table;
        this.Xhr=Parent.Items.Xhr;
        this.Html=Parent.Items.Html;
    }
    setProperties(appUrl,url,defaultTask){
        console.log('ProjectVariableTable::setProperties()');
        this.defaultTask=defaultTask;
        this.appUrl=appUrl;
        this.router=url;
        console.log(appUrl);
        console.log(defaultTask);
        console.log(url);
    }
    run (task){
        try{
            this.Table.unsetError();
            this.defaultTask=task;

            /* GET DATA => SET BODY */
            this.Table.getData(this,'setBody',task);
        }
        catch(error){
            console.log('ProjectConstCreate::prepare()');
            console.log(error);
            //throw 'An Application Error Has Occurred!';
            this.Parent.Table.setError('An Application Error Has Occurred!');
        }
        
    }
    setBody(response){
        console.log('ProjectVariableTable::setBody()');
        /* CLEAR TABLE */
        this.Table.clearTable();   
        /* SET HEAD */
        this.Table.setHead(this.head);
        /* PARSE RESPONSE */
        var data = this.Parent.Items.setTableResponse(response);
        if(this.Table.error){return false;};
        /* SET BODY DATA */
        for(const prop in data.data.value.data){
            this.setBodyRow(data.data.value.data[prop]);
        } 
    }
    setBodyRow(bodyRow){
        /*
        console.log('ProjectVariableTable::setBodyRow()');
        console.log(bodyRow);
        */       
        var tr=document.createElement('TR');

            for(const prop in this.body){           
                tr.appendChild(this.setBodyRowColData(bodyRow[this.body[prop]]));
            };
            tr.appendChild(this.setBodyRowColButton(bodyRow));
            
        this.Table.link['body'].appendChild(tr);
    }
    setBodyRowCol(){
        //console.log('ProjectVariableTable::setBodyRowCol()');
        var col=document.createElement('TD');
        /* TO DO SOME ATTRBIUTES */
        return col;
    }
    setBodyRowColData(value){
        var col = this.setBodyRowCol();
            col.innerHTML=value;
            return col;
    }
    setBlockUserInfo(ele,value){
        if(value==='' || value===null){ return true; };
        var small=document.createElement('small');
            small.classList.add('text-danger');
        var label = document.createTextNode(" Actual blocked by user: "+value);
        var i = document.createElement('i');
            i.classList.add('fa','fa-info');
            small.appendChild(i);
            small.appendChild(label);
            ele.appendChild(small);
    }
    setBodyRowColButton(value){
        //console.log('ProjectVariableTable::setBodyRowColButton()');
        var col = this.setBodyRowCol();
        var buttonGroup=this.setButtonGroup(value);
            col.appendChild(buttonGroup);
            this.setBlockUserInfo(col,value.bl);
            //console.log(col);
        return col;
    }
    setButtonGroup(value){
        //console.log('TableNew::setGroupBtn()');
        //console.log(value);
        var btnGroup=document.createElement('DIV');
            btnGroup.setAttribute('class','btn-group pull-left');
            btnGroup.appendChild(this.getShowButton(this.Xhr,value[0]));
            btnGroup.appendChild(this.getHideButton(this.Xhr,value));
            btnGroup.appendChild(this.getDeleteButton(this.Xhr,value));
        /* ADD ROW WITH BLOCK USER INGO */
        
        return btnGroup;
    }
    getButton(title,c){
        var btn = document.createElement('BUTTON'); 
            btn.innerHTML=title;
            btn.setAttribute('class','btn '+c);
        return btn;
    }
    getShowButton(Ajax,id){
        var btn  = this.getButton('Wyświetl','btn-info');    
        
            var AjaxRun = this.getXhrRunProperty('getProjectVariableDetails&id='+id);
                AjaxRun.m='details';
                AjaxRun.o=this.Parent;
                btn.onclick = function (){
                    Ajax.run(AjaxRun);
                };
        
        
        return btn;
    }
    getHideButton(Ajax,v){
        var btn  = this.getButton('Ukryj','btn-secondary');
        if(v['bl']){
              this.Html.setDisabled(btn);
        }
        else{
        var AjaxRun = this.getXhrRunProperty('getProjectVariableHideSlo&id='+v[0]);
            btn.onclick = function (){
                Ajax.run(AjaxRun);
            };
        }
        return btn;
    }
    getDeleteButton(Ajax,v){
        var btn  = this.getButton('Usuń','btn-danger');
        if(v['bl']){
              this.Html.setDisabled(btn);
        }
        else{
            var AjaxRun = this.getXhrRunProperty('getProjectVariableDelSlo&id='+v[0]);
                /* CLOSURE */
                AjaxRun.m='remove';
                btn.onclick = function (){

                        Ajax.run(AjaxRun);

                };
        }
        return btn;
    }
    getXhrRunProperty(task){
        var run={
            t:"GET",
            u:this.router+task,
            c:true,
            d:null,
            o:this.Parent,
            m:'hide'
        };
        return run;
    }
}