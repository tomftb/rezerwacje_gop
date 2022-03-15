class ProjectConstTable{
    Xhr= new Object();
    XhrModal= new Object();
    Html= new Object();
    Main = new Object();
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
    constructor(Main){
        console.log('ProjectConst::construct()');  
        this.Main=Main;
        this.Table=Main.Items.Table;
        this.Xhr=Main.Items.Xhr;
        this.XhrModal=Main.Items.Xhr2;
        var xhrError={
                    o:this.Table,
                    m:'setError'
            };
        this.XhrModal = Main.Items.Xhr.setOnError(xhrError);
        this.Html=Main.Items.Html;
    }
    setProperties(appUrl,url,defaultTask){
        console.log('ProjectConst::setProperties()');
        this.defaultTask=defaultTask;
        this.appUrl=appUrl;
        this.router=url;
        console.log(appUrl);
        console.log(defaultTask);
        console.log(url);
    }
    run (task){
        this.Table.unsetError();
        this.defaultTask=task;
         /* CLEAR TABLE */
        this.Table.clearTable();   
         /* SET HEAD */
        this.Table.setHead(this.head);
        /* GET DATA => SET BODY */
        this.Table.getData(this,'setBody',task);
    }
    setBody(response){
        console.log('ProjectConstTable::setBody()');
        /* PARSE RESPONSE */
        var data = this.Main.Items.setTableResponse(response);
        /* SET BODY DATA */
        for(const prop in data.data.value.data){
            this.setBodyRow(data.data.value.data[prop]);
        } 
    }
    setBodyRow(bodyRow){
        /*
        console.log('ProjectConstTable::setBodyRow()');
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
        //console.log('ProjectConstTable::setBodyRowCol()');
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
        //console.log('ProjectConstTable::setBodyRowColButton()');
        var col = this.setBodyRowCol();
        var buttonGroup=this.setButtonGroup(value);
            col.appendChild(buttonGroup);
            this.setBlockUserInfo(col,value.bl);
            //console.log(col);
        return col;
    }
    setButtonGroup(value){
        //console.log('TableNew::setGroupBtn('+i+')');

        var btnGroup=document.createElement('DIV');
            btnGroup.setAttribute('class','btn-group pull-left');
            btnGroup.appendChild(this.getShowButton(this.XhrModal,value[0]));
            btnGroup.appendChild(this.getHideButton(this.XhrModal,value[0]));
            btnGroup.appendChild(this.getDeleteButton(this.XhrModal,value[0]));
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
        var AjaxRun = this.getXhrRunProperty('getProjectConstDetails&id='+id);
            btn.onclick = function (){
                Ajax.run(AjaxRun);
            };
        return btn;
    }
    getHideButton(Ajax,id){
        var btn  = this.getButton('Ukryj','btn-secondary');
        var AjaxRun = this.getXhrRunProperty('getProjectConstHideSlo&id='+id);
            btn.onclick = function (){
                Ajax.run(AjaxRun);
            };
        return btn;
    }
    getDeleteButton(Ajax,id){
        var btn  = this.getButton('Usuń','btn-danger');
        var AjaxRun = this.getXhrRunProperty('getProjectConstDelSlo&id='+id);
            /* CLOSURE */
            AjaxRun.m='remove';
            btn.onclick = function (){
                Ajax.run(AjaxRun);
            };
        return btn;
    }
    getXhrRunProperty(task){
        var run={
            t:"GET",
            u:this.router+task,
            c:false,
            d:null,
            o:this.Main,
            m:'hide'
        };
        return run;
    }
}