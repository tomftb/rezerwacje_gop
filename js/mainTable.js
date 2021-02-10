class Table
{
    columns=new Object();
    buttons=new Object();
    columnsExceptions=new Array();
    buttonsType='btnGroup';
    
    constructor() 
    { 
        //console.log('Table::constructor()');
        
    }
    setColumns(col)
    {
        this.columns=col;
    }
    setButtons(btn)
    {
        this.buttons=btn;
    }
    setColExceptions(ex)
    {
        this.columnsExceptions=ex;
    }
    setButtonsType(type)
    {
        /* btn-group, dropdown */
        this.buttonsType=type;
    }
    showTable(d)
    {
        var defaultTableCol=document.getElementById("colDefaultTable");
            removeHtmlChilds(defaultTableCol);
        for (const c in this.columns)
        {
            var th=createTag(c,'th','');
            for(const atr in this.columns[c])
            {
                th.setAttribute(atr,this.columns[c][atr]);
            }
            defaultTableCol.appendChild(th);
        }
        /* CREATE ROW */
        var pd=document.getElementById("defaultTableRows");
        /* remove old data */
        removeHtmlChilds(pd);
        /* SET BUTTONS */

        for(var i = 0; i < d['data']['value'].length; i++)
        {    
            var tr=createTag('','tr','');
                this.assignData(tr,d['data']['value'][i]);
            pd.appendChild(tr);
        }
        //console.log(pd);
    }
    assignData(tr,d)
    {
        /* d => object with data */
        for (const property in d)
        {        
            if(!this.columnsExceptions.includes(property))
            {
                var td=createTag(d[property],'td','');
                tr.appendChild(td);
            } 
        }
        var td=document.createElement('td');
            //td.appendChild(this.setGroupBtn(d['i']));
            this.setBtnColType(td,d['i'])
        tr.appendChild(td);
    }
    setBtnColType(td,i)
    {
        if(this.buttonsType==='btn-group')
        {
           td.appendChild(setGroupBtn(i));
        }
        else if(this.buttonsType==='dropdown')
        {
            td.appendChild(this.setDropDown(i));
        }
        else
        {
            /* wrong type */
        }
    }
    setDropDown(i)
    {
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
    setDropDownLink(dd)
    {
        //console.log(dd.id);
        for (const property in this.buttons)
        {        
            var link=createTag(this.buttons[property].label,'a','dropdown-item '+this.buttons[property].class);
                link.setAttribute('href','#');
                link.setAttribute('name',this.buttons[property].task);
                this.setBtnAtr(link,property,this.buttons);
                this.setLinkAction(link,this.buttons[property].perm);
            dd.appendChild(link); 
        }
    }
    setGroupBtn(i)
    {

        var btnGroup=createTag('','div','btn-group pull-left');
            btnGroup.setAttribute('id',i);
        for (const property in this.buttons)
        {        
            var btn=createBtn(this.buttons[property].label,'btn '+this.buttons[property].class,this.buttons[property].task);  
            this.setBtnAtr(btn,property,this.buttons);
            this.setBtnAction(btn,this.buttons[property].perm);
            btnGroup.appendChild(btn);
        }
        return btnGroup;
    }

    setBtnAtr(btn,property,btnConfig)
    {
        if(!btnConfig[property].perm) { return false; }
        if(btnConfig[property].hasOwnProperty('attributes'))
        {   
            for (const atr in btnConfig[property].attributes)
            {
                btn.setAttribute(atr,btnConfig[property].attributes[atr]);
            }
        }
    }
    setBtnAction(btn,perm)
    {
        if(!perm)
        {
            btn.onclick=function () {};
            return false;
        }
        btn.onclick=function ()
        {
            clearAdaptedModalData();
            ajax.getData(this.name+'&id='+this.parentNode.id);
        };
    }
    setLinkAction(link,perm)
    {
        if(!perm)
        {
            link.onclick=function (){};
            return false;
        }
        link.onclick=function ()
        {
            clearAdaptedModalData();
            ajax.getData(this.name+'&id='+this.parentNode.id);
        };  
    }
}