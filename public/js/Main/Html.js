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
    button(){
        var i=document.createElement('i');
            i.setAttribute('class','fa');//fa-minus
            i.setAttribute('aria-hidden','true');
            i.setAttribute('style','color:#ffffff;');         
        var div=document.createElement('div');
            div.setAttribute('class','btn');//btn-danger
            div.appendChild(i);
        return div;
    }
    removeButton(){
        var button = this.button();
            button.childNodes[0].classList.add('fa-minus');
            button.classList.add('btn-danger');
        return button;
    }
    addButton(){
        var button = this.button();
            button.childNodes[0].classList.add('fa-plus');
            button.classList.add('btn-success');
        return button;
    }
    createOptionGroup(title,data){
        var optionGroup2=document.createElement('optgroup');
            optionGroup2.setAttribute('label',title);
            optionGroup2.setAttribute('class','bg-info text-white');
            for (const property in data) {
                //console.log(`${property}: ${data[property]}`);
                //console.log(data[property]);
                optionGroup2.appendChild(this.createAdvancedOption(data[property]));
            };
        return optionGroup2;
    }
    createAdvancedOption(data){
        var option=document.createElement('option');
            option.setAttribute('value',data.v);
            //option.setAttribute('class',data[property].fontcolor+' '+data[property].backgroundcolor);
            option.style.fontFamily = data.fontFamily;
            option.style.color = data.color;
            option.style.backgroundColor = data.backgroundColor;
            option.innerHTML=data.n; 
        return option;
    }
    createOption(){
        var option=document.createElement('option');
            option.style.color = '#000000';
            option.style.backgroundColor = '#FFFFFF';
        return option;
    }
    removeClass(ele,className){
        var action = function(){
            if(ele.classList.contains(className)){
                ele.classList.remove(className);
            }
        };
        this.setClass(ele,className,action);
    }
    addClass(ele,className){
        var action = function(){
            if(!ele.classList.contains(className)){
                ele.classList.add(className);
            }
        };
        this.setClass(ele,className,action);
    }
    setClass(ele,className,action){
       var type = typeof(ele);
        var type2 = typeof(className);
        if(type!=='object'){
            console.log(type);
            throw 'ELE IS NOT A OBJECT!';
            return false;
        }
        if(type2==='string'){
            //ele.classList[action](className);
            action(ele,className);
            return true;
        }
        if(type2==='object'){
            for(const prop in className){
                //ele.classList[action](className[prop]);
                action(ele,className[prop]);
            }
            return true;
        }
        console.log(type2);
        throw 'className IS NOT A STRING AND OBJECT!';   
    }
}

