class Table
{
    columns=new Object();
    buttons=new Object();
    columnsExceptions=new Array();
    idField=0; 
    static ajaxLink;
    static errorLink;
    static errorDivId;
    btnInfo={
        'col':'',
        'text':'',
        'tag':'',
        'class':'',
        'ele':new Object()
    };
    
    //buttonsType='btnGroup';
    buttonsType;
    
    constructor() { 
        //console.log('Table::constructor()');
        
    }
    setAjaxLink(alink){
        console.log('TABLE::setAjaxLink()');
        Table.ajaxLink=alink;
        console.log(Table.ajaxLink);
    }
    setErrorLink(eLink,eDiv){
        console.log('TABLE::setErrorLink()');
        Table.errorLink=eLink;
        Table.errorDivId=eDiv;
        console.log(Table.errorLink);
        console.log(Table.errorDivId);
        //Table.errorDiv=eDiv;
    }
    setIdFiled(id){
        this.idField=id;
    }
    setColumns(col){
        this.columns=col;
    }
    setButtons(btn){
        this.buttons=btn;
    }
    setColExceptions(ex){
        this.columnsExceptions=ex;
    }
    setBtnInfoEle(ele){
        this.btnInfo.ele=ele;
    }
    setBtnInfo(text,tag,c){
        this.btnInfo.text=text;
        this.btnInfo.tag=tag;
        this.btnInfo.class=c;
    }
    setbtnInfoCol(column){
        this.btnInfo.col=column;
    }
    setButtonsType(type){
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
    showTable(d){
        console.log('Table::showTable(data)');
        // console.log(d);
        var defaultTableCol=document.getElementById("colDefaultTable");
            removeHtmlChilds(defaultTableCol);
        for (const c in this.columns){
            var th=createTag(c,'th','');
            for(const atr in this.columns[c]){
                th.setAttribute(atr,this.columns[c][atr]);
            }
            defaultTableCol.appendChild(th);
        }
        /* CREATE ROW */
        var pd=document.getElementById("defaultTableRows");
        /* remove old data */
        removeHtmlChilds(pd);
       
       /* ASSIGN DATA TO ROW */
        for (const i in d){
        //for(var i = 0; i < d.length; i++){    
            var tr=document.createElement('tr');//createTag('','tr','');
                this.assignData(tr,d[i]);
            pd.appendChild(tr);
        }
        //console.log(pd);
    }
    assignData(tr,d){
        /* d => object with data */
        //console.log(d);
        //console.log(this.columnsExceptions);
        /* ASSING DATA */
        for (const property in d){        
            if(!this.columnsExceptions.includes(property)){
                //console.log(d[property]);
                var td=document.createElement('td');
                    td.appendChild(document.createTextNode(d[property]));//createTag(d[property],'td','');
                tr.appendChild(td);
            } 
        }
         /* ASSIGN BUTTONS */
        var td=document.createElement('td');
            td.appendChild(this.buttonsType(d[this.idField]));
            this.assignBtnInfo(td,d);
            //this.setBtnColType(td,d['i']);
        tr.appendChild(td);
    }
    assignBtnInfo(ele,d){
        //console.log(d.hasOwnProperty(this.btnInfo.col));
        //console.log(d[this.btnInfo.col]);
        if(!d.hasOwnProperty(this.btnInfo.col)){
            //alert('assignBtnInfo::Something get wrong! Contact with administrator!');
            return false;
        }
        else{
            //console.log(this.btnInfo.ele);
            if(d[this.btnInfo.col]!==null && this.btnInfo.tag){
                ele.appendChild(createTag(this.btnInfo.text+d[this.btnInfo.col],this.btnInfo.tag,this.btnInfo.class));
            }
            else{
                /* NOT A HTML TAG */
            }
            /* TO DO CHECK AND ASSIFN HTML ELEMENT */
        }
        
    }
    setDropDown(i){
        //console.log('TABLE::setDropDown()');
        var btnGroup=createTag('','div','btn-group pull-left');
            btnGroup.setAttribute('role','group');
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
    setDropDownLink(dd){
        //console.log(dd.id);
        for (const property in this.buttons){        
            var link=createTag(this.buttons[property].label,'a','dropdown-item '+this.buttons[property].class);
                link.setAttribute('href','#');
                link.setAttribute('name',this.buttons[property].task);
                this.setBtnAtr(link,property,this.buttons);
                this.setLinkAction(link,this.buttons[property].perm);
            dd.appendChild(link); 
        }
    }
    setGroupBtn(i){
        //console.log('TABLE::setGroupBtn('+i+')');
        var btnGroup=createTag('','div','btn-group pull-left');
            btnGroup.setAttribute('id',i);
        for (const property in this.buttons){        
            var btn=createBtn(this.buttons[property].label,'btn '+this.buttons[property].class,this.buttons[property].task);  
            this.setBtnAtr(btn,property,this.buttons);
            this.setBtnAction(btn,this.buttons[property].perm);
            btnGroup.appendChild(btn);
        }
        
        return btnGroup;
    }
    setBtnAtr(btn,property,btnConfig){
        if(!btnConfig[property].perm) { return false; }
        if(btnConfig[property].hasOwnProperty('attributes')){   
            for (const atr in btnConfig[property].attributes){
                btn.setAttribute(atr,btnConfig[property].attributes[atr]);
            }
        }
    }
    setBtnAction(btn,perm){
        //console.log('TABLE::setBtnAction()'); 
        if(!perm){
            //btn.onclick=function () {};
            return false;
        }
        btn.onclick=function (){
            try {
                console.log('Table::onclick()');
                clearAdaptedModalData();
                /* FROM EXTERNAL AJAX CLASS */
                Table.errorLink.set([Table.errorDivId]);
                console.log(Table.errorLink);
                Table.ajaxLink.getData(this.name+'&id='+this.parentNode.id);
            }
            catch (error) {
                console.error('ERROR: '+error);
                alert('Something get wrong! Contact with administrator!');
            }
        };
    }
    setLinkAction(link,perm){
        if(!perm){
            //link.onclick=function (){};
            return false;
        }
        //link.onclick=runAjax();
        link.onclick=function (){
            try {
                clearAdaptedModalData();
                /* FROM EXTERNAL AJAX CLASS */
                Table.errorLink.set([Table.errorDivId]);
                Table.ajaxLink.getData(this.name+'&id='+this.parentNode.id);
            }
            catch (error) {
                console.error('ERROR: '+error);
                alert('Something get wrong! Contact with administrator!');
            }
        };
    }
}