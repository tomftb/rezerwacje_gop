class ProjectConstTable{
    Xhr;
    Html;
    Stage;
    stageData;
    /* FROM ProjectConst 'getprojectsconstslike&u=0&v=1&b=' */
    defaultTask='';
    appUrl='';
    router='';
    link={};
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
    tableColException=new Array('bl');
    tableBody;
    constructor(Stage,Xhr,Html){
        console.log('ProjectConstTable::construct()');  
        this.Stage=Stage;
        this.Xhr=Xhr;
        this.Html=Html;
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
    runTable(response){
        console.log('ProjectConst::runTable()');
        try {
            this.setLink();        
            this.clearTable();   
        }
        catch (error) {
            alert('ProjectConstTable::runTable() Error occured!');
            console.log(error);
        } 
        /* SET TO JSON RESPONSE */
        this.stageData=this.setData(response);
        if(!this.stageData){ 
            this.setError('ProjectConstTable::runTable() Error occured!');
            return false;
        };
        try {
            if (!('status' in this.stageData) || !('info' in this.stageData)){
                this.setError('ProjectConstTable::runTable() Application error occurred! Contact with Administrator!');
            }
            else if(this.stageData.status===1){
                this.setError(this.stageData.info);
            }
            else{
                /* SET PAGE TITLE */
                document.getElementById('headTitle').innerHTML=this.stageData.data.value.headTitle;
                /* SET TABLE  */
                this.setTable();
            } 
        }
        catch (error) {
            this.setError(error);
        } 
    }
    setTable(){
        console.log('ProjectConstTable::setTable()');
        this.setHead();
        this.setBody();
        
    }
    setHead(){
        console.log('ProjectConstTable::setHead()');
        for (const c in this.head){
            var th=document.createElement('TH');
            this.setHeadStyle(th,this.head[c]);
            this.setHeadProperty(th,this.head[c]);
            th.innerHTML=this.head[c].title;
            this.link.head.appendChild(th);
        }
        console.log(this.link.head);
        console.log(this.link.body);
    }
    setHeadProperty(th,headRow){
        if(!headRow.hasOwnProperty('attribute')){
            return false;
        }
        for(const attr in headRow.attribute){
            th.setAttribute(attr,headRow.attribute[attr]);
        }
    }
    setHeadStyle(th,headRow){
        if(!headRow.hasOwnProperty('style')){
            return false;
        }
        for(const attr in headRow.style){
            th.style[attr]=headRow.style[attr];
        } 
    }
    setBody(){
        console.log('ProjectConstTable::setBody()');
        for(const prop in this.stageData.data.value.data){
            //console.log(this.stageData.data.value.data[prop]);
            this.setBodyRow(this.stageData.data.value.data[prop]);
        } 
    }
    setBodyRow(bodyRow){
        /*
        console.log('ProjectConstTable::setBodyRow()');
        console.log(bodyRow);
        */       
        var tr=document.createElement('TR');
            tr.appendChild(this.setBodyRowColData(bodyRow['0']));
            tr.appendChild(this.setBodyRowColData(bodyRow['1']));
            tr.appendChild(this.setBodyRowColData(bodyRow['2']));
            tr.appendChild(this.setBodyRowColButton(bodyRow));

        this.link['body'].appendChild(tr);
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
        var Ajax = this.Xhr;
        var btnGroup=document.createElement('DIV');
            btnGroup.setAttribute('class','btn-group pull-left');
            btnGroup.appendChild(this.getShowButton(Ajax,value[0]));
            btnGroup.appendChild(this.getHideButton(Ajax,value[0]));
            btnGroup.appendChild(this.getDeleteButton(Ajax,value[0]));
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
            o:this.Stage,
            m:'runModal'
        };
        return run;
    }
    setLink(){
        console.log('ProjectConstTable::setLink()');
        //console.log(document.getElementById('mainTableDiv'));
        var tableEle = document.getElementById('mainTableDiv');
        console.log(tableEle);
        this.link={
            main:tableEle,
            error:tableEle.childNodes[0].childNodes[0],
            head:tableEle.childNodes[1].childNodes[0].childNodes[0].childNodes[0].childNodes[0],
            body:tableEle.childNodes[1].childNodes[0].childNodes[0].childNodes[1],
            extra:tableEle.childNodes[2]
        };
        console.log(this.link);
    }
    clearTable(){
        console.log('ProjectConstTable::clearTable()');
        this.clearEle(this.link['error']);
        this.clearEle(this.link['head']);
        this.clearEle(this.link['body']);
    }
    clearEle(ele){
        console.log('ProjectConstTable::clearEle()');
        while (ele.firstChild){
            ele.firstChild.remove(); 
        };
    }
    setData(response){
        console.log('ProjectConstTable::setData()');
        console.log(response);
        try {
            return JSON.parse(response);    
        }
        catch (error) {
            this.setError(error);
            return false;
        } 
        return false;
    }
    setError(info){
        console.log('ProjectConstTable::setError()');
        console.log(info);
        console.log(this.link['error']);
        this.link['error'].classList.remove("d-none");
        this.link['error'].innerHTML=info;
    }
    unsetError(){
        this.link['error'].classList.add("d-none");
        this.link['error'].innerHTML='';
    }
}