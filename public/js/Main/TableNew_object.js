class TableNew{
    Html;
    link={
        'head':'',
        'body':'',
        'error':'',
        'footer':'',
        'adapted':'',
        'form':'',
        'main':'',
        'button':'',
        'buttonConfirm':'',
        'extra':''
    }
    btnInfo={
        'col':'',
        'text':'',
        'tag':'',
        'class':'',
        'ele':new Object()
    };
    buttonsType;
    buttons;
    idField=0; 
    columnsExceptions=new Array();
    data;
    perm;
    Xhr;
    appurl;
    router;
    Modal;
    
    constructor() {}
    setLink(){
        console.log('TableNew::setLink()');
        //console.log(document.getElementById('mainTableDiv'));
        this.link['main'] = document.getElementById('mainTableDiv');
        this.link['error']=this.link['main'].childNodes[0].childNodes[0];
        this.link['head']=this.link['main'].childNodes[1].childNodes[0].childNodes[0].childNodes[0].childNodes[0]; 
        this.link['body']=this.link['main'].childNodes[1].childNodes[0].childNodes[0].childNodes[1];  
        this.link['extra']=this.link['main'].childNodes[2];  
        /* 
        console.log(this.link['main']);
        console.log(this.link['error']);
        console.log(this.link['head']);
        console.log(this.link['body']);
        console.log(this.link['extra']);
        */
        //console.log(Modal.link['button']);
        
    }
    static setBtnInfoEle(ele){
        this.btnInfo.ele=ele;
    }
    static setBtnInfo(text,tag,c){
        this.btnInfo.text=text;
        this.btnInfo.tag=tag;
        this.btnInfo.class=c;
    }
    static setbtnInfoCol(column){
        this.btnInfo.col=column;
    }
    static setButtons(type,buttons){
        //console.log('TABLE::setButtons()');
        this.setButtonsType(type);
        this.buttons=buttons;
        this.setButtonsPerm();
    }
    static setButtonsPerm(){
        //console.log('TABLE::setButtonsPerm()');
        //console.log(this.perm);
        for (const property in this.buttons){        
            //console.log(property);
            //console.log(this.buttons[property].perm);
            if(!this.perm.includes(property)){
                this.buttons[property].perm=false;
                //console.log('NOT INCLUDE SET FALSE');
            }
        }
    }
    static setButtonsType(type){
        console.log('TABLE::setButtonsType()');
        /* btn-group, dropdown */
        if(type==='btn-group'){
            this.buttonsType=function(i)
            {
                return this.setGroupBtn(i);
            };
        }
        else if(type==='dropdown'){
            this.buttonsType=function(i)
            {
                return this.setDropDown(i);
            };
        }
        else{
            /* wrong type */
        }
    }
    static  setGroupBtn(i){
        //console.log('TableNew::setGroupBtn('+i+')');
        var btnGroup=document.createElement('DIV');
            btnGroup.setAttribute('class','btn-group pull-left');
            btnGroup.setAttribute('id',i);
        for (const property in this.buttons){        
            //console.log(property);
            var btn=document.createElement('BUTTON');
                btn.setAttribute('class','btn '+this.buttons[property].class);
                btn.setAttribute('id',this.buttons[property].task);
                btn.setAttribute('name',this.buttons[property].task);
                btn.innerHTML=this.buttons[property].label;
                /* -- TURN OFF  */
                this.setBtnAtr(btn,property);
                
                this.setAction(btn,this.buttons[property].perm);
            btnGroup.appendChild(btn);
        }
        
        return btnGroup;
    }
    static setDropDown(i){
        console.log('TableNew::setDropDown()');
        var btnGroup=document.createElement('DIV');
            btnGroup.setAttrbute('class','btn-group pull-left');
            btnGroup.setAttrbute('role','group');

        var button=createTag('Opcje','button','btn btn-secondary dropdown-toggle bg-info');
            button.setAttribute('id','btnGroupDrop'+i);
            button.setAttribute('type','button');
            button.setAttribute('data-toggle','dropdown');
            button.setAttribute('aria-haspopup','true');
            button.setAttribute('aria-expanded','false');
            button.setAttribute('aria-labelledby','btnGroupDrop'+i);
        var divDropDownMenu=createTag('','div','dropdown-menu');
            divDropDownMenu.setAttribute('id',i);
        
        this.setDropDownLink(divDropDownMenu);
        
        btnGroup.appendChild(button);
        btnGroup.appendChild(divDropDownMenu);
        return btnGroup;
    }
    static setDropDownLink(dd){
        console.log('TableNew::setDropDownLink()');
        for (const property in this.buttons){        
            var link=createTag(this.buttons[property].label,'a','dropdown-item '+this.buttons[property].class);
                link.setAttribute('href','#');
                link.setAttribute('name',this.buttons[property].task);
                /* NO TURN OFF*/
                this.setBtnAtr(link,property);
                
                this.setAction(link,this.buttons[property].perm);
            dd.appendChild(link); 
        }
    }
    static setBtnAtr(btn,property){
        //console.log('TableNew::setBtnAtr('+property+')');
        if(!this.buttons[property].perm) { return false; }
        if(this.buttons[property].hasOwnProperty('attributes')){   
            for (const atr in this.buttons[property].attributes){
                btn.setAttribute(atr,this.buttons[property].attributes[atr]);
            }
        }
    }
    static  setAction(ele,perm){
        //console.log('TableNew::setAction()');
        /*
         * CHECK PERMISSION
         */
        if(!perm){return false;}
        /*
         * SETUP ONCLICK ACTION XHR
         */
        ele.onclick=function (){
            try {
                console.log('TableNew::onclick()');
                /*
                 *  static run(type,fd,task)
                 *  type - POST/GET
                 *  fd - form document/null
                 *  task - url
                 */               
                this.Xhr.run('GET',null,this.router+this.name+'&id='+this.parentNode.id);
            }
            catch (error) {
                console.error('ERROR: '+error);
                alert('Something get wrong! Contact with administrator!');
            }
        };
    }
    static clearData(){
        this.Html.removeChilds(this.link['error']);
        this.Html.removeChilds(this.link['head']);
        this.Html.removeChilds(this.link['body']);
    }
    static setHead(h){
        console.log('ProjectItems::setTableHead()');
        for (const c in h){
            var th=document.createElement('TH');
            for(const atr in h[c]){
                th.setAttribute(atr,h[c][atr]);
            }
            th.innerHTML=c;
            this.link['head'].appendChild(th);
        }
    }
    static setBody(){
        console.log('TableNew::setBody()');
        for (const i in this.data){ 
            var tr=document.createElement('tr');
                this.assignData(tr,this.data[i]);
                this.link['body'].appendChild(tr);
        }
    }
    static assignData(t,d){
        //console.log('TableNew::assignData()');
         /*
         * t -> table row element
         * d -> data row [i]
         */
        for (const property in d){        
            if(!this.columnsExceptions.includes(property)){
                //console.log(d[property]);
                var td=document.createElement('td');
                    td.appendChild(document.createTextNode(d[property]));//createTag(d[property],'td','');
                    t.appendChild(td);
            } 
        }
         /* ASSIGN BUTTONS */
        var td=document.createElement('td');
            td.appendChild(this.buttonsType(d[this.idField]));
            this.assignBtnInfo(td,d);
            //this.setBtnColType(td,d['i']);
        t.appendChild(td);
    }
    static assignBtnInfo(ele,d){
        //console.log('TableNew::assignBtnInfo()');
        //console.log(d.hasOwnProperty(this.btnInfo.col));
        //console.log(d[this.btnInfo.col]);
        if(!d.hasOwnProperty(this.btnInfo.col)){
            //alert('assignBtnInfo::Something get wrong! Contact with administrator!');
            return false;
        }
        else{
            //console.log(this.btnInfo.ele);
            if(d[this.btnInfo.col]!==null && this.btnInfo.tag){
                var btn=document.createElement(this.btnInfo.tag);
                    btn.setAttribute('class',this.btnInfo.class);
                    btn.innerHTML=this.btnInfo.text+d[this.btnInfo.col];
                    //var button=createTag('Opcje','button','btn btn-secondary dropdown-toggle bg-info');
                //ele.appendChild(createTag(this.btnInfo.text+d[this.btnInfo.col],this.btnInfo.tag,this.btnInfo.class));
                ele.appendChild(btn);
            }
            else{
                /* NOT A HTML TAG */
            }
            /* TO DO CHECK AND ASSIGN HTML ELEMENT */
        }
        
    }

}