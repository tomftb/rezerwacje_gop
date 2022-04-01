class Html{
    construct(){
        console.log('Html::construct()');
    }
    showField(ele,info){
        /*
        console.log('Html::showField()');
        console.log(ele);
        console.log(info);
        */
        
        ele.classList.remove("d-none");
        ele.classList.add("d-block");
        if(info!==undefined && info!==null){
            ele.innerHTML=info;
        }
       
    }
    hideField(ele){
        ele.classList.remove("d-block");
        ele.classList.add("d-none");
        //ele.innerHTML="";
    }
    hideAndClearField(ele){
        this.hideField(ele);
        ele.innerHTML="";
    }
    removeChilds(htmlElement)
    {
        //console.log('---removeHtmlChilds()---');
        while (htmlElement.firstChild)
        {
            //console.log(htmlElement.firstChild);
            htmlElement.firstChild.remove(); 
        };
    }
     setDisabled(ele){
        ele.classList.add("disabled");
        ele.setAttribute('disabled','');
        console.log(ele);
    }
     confirmButton(label,c,id){    
        var button=document.createElement('button');
            button.setAttribute('class',c);
            button.setAttribute('id',id);
            button.setAttribute('name',id);
            button.innerHTML=label;
        return button;
    }
     getForm(){
        var form=document.createElement('FORM');
            form.setAttribute("ENCETYPE","multipart/form-data");
            form.setAttribute("autocomplete",'OFF');
        return form;
    }
     cancelButton(label){
        var cancel=document.createElement('button');
            cancel.setAttribute('class','btn btn-secondary');
            cancel.setAttribute('type','button');
            //cancel.setAttribute('data-dismiss',"modal");
            cancel.innerText=label;
        return cancel;
    }
     createSelectFromObject(d,n,sId,sC)
    {
        /*
         *  d => data
         *  n => data property with option name to setup
         *  sId / sN => select ID / NAME
         *  sC => select CLASS
         */
        //console.log('Html::createSelectFromObject---\n'+sId);
        //console.log(d);
        var s=this.select(sC,sId);

        for (const property in d)
        {      
            var o=document.createElement('option');  
            o.innerText=assignDataToField(d[property],n);
            o.setAttribute("VALUE",Object.values(d[property]).join('|'));
            s.appendChild(o);
        }
        //console.log(s);
        return s;
    }
     select(c,n)
    {
        var s=document.createElement("select");
            s.setAttribute("CLASS",c);  
            s.setAttribute("NAME",n);
            s.setAttribute("ID",n);  
            return s;
    }
     getGroupButton(){
        var group=document.createElement('div');
            group.setAttribute('class','btn-group');
            group.setAttribute('role','group');
            group.setAttribute('aria-label','Action buttons');
        return group;
    }
     getRow(){
        var div=document.createElement('div');
            div.setAttribute('class','row');
        return div;
    }
     getCol(columnNumber){
        var div=document.createElement('div');
            div.setAttribute('class','col-'+columnNumber);
        return div;
    }
     getInput(name,value,type){
        
        var input=document.createElement('INPUT');
            input.setAttribute('value',value);
            input.setAttribute('name',name);
            input.setAttribute('id',name);
            input.setAttribute('type',type);
        return input;
    }
     getEmpty(value){
        if(value===null || value===undefined){
            return '';
        }
    }
}
