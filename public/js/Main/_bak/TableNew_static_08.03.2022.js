class TableNew{
    static Html;
    static link={
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
    static btnInfo={
        'col':'',
        'text':'',
        'tag':'',
        'class':'',
        'ele':new Object()
    };
    static buttonsType;
    static buttons;
    static idField=0; 
    static columnsExceptions=new Array();
    static data;
    static perm;
    static Xhr;
    static appurl;
    static router;
    static Modal;
    
    constructor() {}
    static setLink(){
        console.log('TableNew::setLink()');
        //console.log(document.getElementById('mainTableDiv'));
        TableNew.link['main'] = document.getElementById('mainTableDiv');
        TableNew.link['error']=TableNew.link['main'].childNodes[0].childNodes[0];
        TableNew.link['head']=TableNew.link['main'].childNodes[1].childNodes[0].childNodes[0].childNodes[0].childNodes[0]; 
        TableNew.link['body']=TableNew.link['main'].childNodes[1].childNodes[0].childNodes[0].childNodes[1];  
        TableNew.link['extra']=TableNew.link['main'].childNodes[2];  
        /* 
        console.log(TableNew.link['main']);
        console.log(TableNew.link['error']);
        console.log(TableNew.link['head']);
        console.log(TableNew.link['body']);
        console.log(TableNew.link['extra']);
        */
        //console.log(Modal.link['button']);
        
    }
    static setBtnInfoEle(ele){
        TableNew.btnInfo.ele=ele;
    }
    static setBtnInfo(text,tag,c){
        TableNew.btnInfo.text=text;
        TableNew.btnInfo.tag=tag;
        TableNew.btnInfo.class=c;
    }
    static setbtnInfoCol(column){
        TableNew.btnInfo.col=column;
    }
    static setButtons(type,buttons){
        //console.log('TABLE::setButtons()');
        TableNew.setButtonsType(type);
        TableNew.buttons=buttons;
        TableNew.setButtonsPerm();
    }
    static setButtonsPerm(){
        //console.log('TABLE::setButtonsPerm()');
        //console.log(TableNew.perm);
        for (const property in TableNew.buttons){        
            //console.log(property);
            //console.log(TableNew.buttons[property].perm);
            if(!TableNew.perm.includes(property)){
                TableNew.buttons[property].perm=false;
                //console.log('NOT INCLUDE SET FALSE');
            }
        }
    }
    static setButtonsType(type){
        console.log('TABLE::setButtonsType()');
        /* btn-group, dropdown */
        if(type==='btn-group'){
            TableNew.buttonsType=function(i)
            {
                return TableNew.setGroupBtn(i);
            };
        }
        else if(type==='dropdown'){
            TableNew.buttonsType=function(i)
            {
                return TableNew.setDropDown(i);
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
        for (const property in TableNew.buttons){        
            //console.log(property);
            var btn=document.createElement('BUTTON');
                btn.setAttribute('class','btn '+TableNew.buttons[property].class);
                btn.setAttribute('id',TableNew.buttons[property].task);
                btn.setAttribute('name',TableNew.buttons[property].task);
                btn.innerHTML=TableNew.buttons[property].label;
                /* -- TURN OFF  */
                TableNew.setBtnAtr(btn,property);
                
                TableNew.setAction(btn,TableNew.buttons[property].perm);
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
        
        TableNew.setDropDownLink(divDropDownMenu);
        
        btnGroup.appendChild(button);
        btnGroup.appendChild(divDropDownMenu);
        return btnGroup;
    }
    static setDropDownLink(dd){
        console.log('TableNew::setDropDownLink()');
        for (const property in TableNew.buttons){        
            var link=createTag(TableNew.buttons[property].label,'a','dropdown-item '+TableNew.buttons[property].class);
                link.setAttribute('href','#');
                link.setAttribute('name',TableNew.buttons[property].task);
                /* NO TURN OFF*/
                TableNew.setBtnAtr(link,property);
                
                TableNew.setAction(link,TableNew.buttons[property].perm);
            dd.appendChild(link); 
        }
    }
    static setBtnAtr(btn,property){
        //console.log('TableNew::setBtnAtr('+property+')');
        if(!TableNew.buttons[property].perm) { return false; }
        if(TableNew.buttons[property].hasOwnProperty('attributes')){   
            for (const atr in TableNew.buttons[property].attributes){
                btn.setAttribute(atr,TableNew.buttons[property].attributes[atr]);
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
                TableNew.Xhr.run('GET',null,TableNew.router+this.name+'&id='+this.parentNode.id);
            }
            catch (error) {
                console.error('ERROR: '+error);
                alert('Something get wrong! Contact with administrator!');
            }
        };
    }
    static clearData(){
        TableNew.Html.removeChilds(TableNew.link['error']);
        TableNew.Html.removeChilds(TableNew.link['head']);
        TableNew.Html.removeChilds(TableNew.link['body']);
    }
    static setHead(h){
        console.log('ProjectItems::setTableHead()');
        for (const c in h){
            var th=document.createElement('TH');
            for(const atr in h[c]){
                th.setAttribute(atr,h[c][atr]);
            }
            th.innerHTML=c;
            TableNew.link['head'].appendChild(th);
        }
    }
    static setBody(){
        console.log('TableNew::setBody()');
        for (const i in TableNew.data){ 
            var tr=document.createElement('tr');
                TableNew.assignData(tr,TableNew.data[i]);
                TableNew.link['body'].appendChild(tr);
        }
    }
    static assignData(t,d){
        //console.log('TableNew::assignData()');
         /*
         * t -> table row element
         * d -> data row [i]
         */
        for (const property in d){        
            if(!TableNew.columnsExceptions.includes(property)){
                //console.log(d[property]);
                var td=document.createElement('td');
                    td.appendChild(document.createTextNode(d[property]));//createTag(d[property],'td','');
                    t.appendChild(td);
            } 
        }
         /* ASSIGN BUTTONS */
        var td=document.createElement('td');
            td.appendChild(TableNew.buttonsType(d[TableNew.idField]));
            TableNew.assignBtnInfo(td,d);
            //this.setBtnColType(td,d['i']);
        t.appendChild(td);
    }
    static assignBtnInfo(ele,d){
        //console.log('TableNew::assignBtnInfo()');
        //console.log(d.hasOwnProperty(this.btnInfo.col));
        //console.log(d[this.btnInfo.col]);
        if(!d.hasOwnProperty(TableNew.btnInfo.col)){
            //alert('assignBtnInfo::Something get wrong! Contact with administrator!');
            return false;
        }
        else{
            //console.log(this.btnInfo.ele);
            if(d[TableNew.btnInfo.col]!==null && TableNew.btnInfo.tag){
                var btn=document.createElement(TableNew.btnInfo.tag);
                    btn.setAttribute('class',TableNew.btnInfo.class);
                    btn.innerHTML=TableNew.btnInfo.text+d[TableNew.btnInfo.col];
                    //var button=createTag('Opcje','button','btn btn-secondary dropdown-toggle bg-info');
                //ele.appendChild(createTag(TableNew.btnInfo.text+d[TableNew.btnInfo.col],TableNew.btnInfo.tag,TableNew.btnInfo.class));
                ele.appendChild(btn);
            }
            else{
                /* NOT A HTML TAG */
            }
            /* TO DO CHECK AND ASSIGN HTML ELEMENT */
        }
        
    }

}