class Tool{
    Html = new Object();
    
    constructor(){
        this.Html = new Html();
    }
    create(label,data){
        /*
            console.log('Tool::create()');
            console.log(label);
            console.log(data);
        */
        var mainDiv = this.createLabel(label);  
        var groupDiv=document.createElement('div');
            groupDiv.setAttribute('class','input-group');

        for(const prop in data){
            switch(data[prop].type){
                case 'input':
                    groupDiv.appendChild(this.getInput(data[prop]));
                    break;
                case 'select':
                    groupDiv.appendChild(this.getSelect(data[prop]));
                    break;
                default:
                    break;
            }
        };
        mainDiv.appendChild(groupDiv);
        return mainDiv;
    }
    getInput(data){
        //console.log('Tool::getInput()');
        //console.log(data);
        var input = document.createElement('INPUT');
            input.setAttribute('value',data.value);
            input.setAttribute('class','form-control form-control-sm '+data.attributes.class);
            input.type=data.attributes['type'];
            //input.setAttribute('type','number');
            this.setOnChange(input,data);
            return input;
    }
    getSelect(data){
        //console.log(data.attributes);
        var select = document.createElement('select');
            //select.classList.add('form-control','form-control-sm',data.attributes.class);
            select.setAttribute('class','form-control form-control-sm '+data.attributes.class);
            /* DEFAULT */
            select.appendChild(this.Html.createOptionGroup('Domyślny:',data.default));  
            /* REST */         
            select.appendChild(this.Html.createOptionGroup('Dostępne',data.all));
            this.setOnChange(select,data);
            this.setOnFocus(select,data);
            
        return select;
    }
    createLabel(title){
        var div=document.createElement('div');
            div.setAttribute('class','w-100 mt-2');
            div.classList.add('w-100','mt-2');
        var label=document.createElement('span');
            label.setAttribute('class','text-info');
            label.innerHTML=title;
        div.appendChild(label);   
        return div;
    }
    setOnChange(ele,data){
        if(!data.hasOwnProperty('onchange')){
            return null;
        };
        ele.onchange = function(){
            data.onchange(this);
        };
    }
    setOnFocus(ele,data){
        if(!data.hasOwnProperty('onfocus')){
            return null;
        };
        ele.onfocus = function(){
            data.onfocus(this);
        };
    }
    getYesNowRadio(){
        return {
            'y':{
                check:'no-checked',
                //id:id+'-y',
                value:'y',
                title:'Tak',
                fontcolor:'text-primary'
            },
            'n':{
                check:'no-checked',
                //id:id+'-n',
                value:'n',
                title:'Nie',
                fontcolor:'text-danger'
            }
        };
    }

   getDivError(){
       /* TITLE ERROR DIV */
        var row=this.Html.getRow();
            //this.helplink['titleDiv']=titleDiv;
        var col1=this.Html.getCol(1);
        var col2=this.Html.getCol(11);
        var div=document.createElement('div');
            this.Html.addClass(div,['alert','alert-danger','d-none']);
            col2.appendChild(div);       
            row.appendChild(col1);
            row.appendChild(col2);
        return {
            ele:row,
            div:div
        };
        //return row;
   }
}