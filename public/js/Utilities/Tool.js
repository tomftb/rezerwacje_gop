class Tool{
    Html = new Object();
    
    constructor(){
        this.Html = new Html();
    }
    create(label,data){
        console.log('Tool::create()');
        console.log(label);
        console.log(data);
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
        var input = document.createElement('INPUT');
            input.setAttribute('value',data.value);
            input.setAttribute('class','form-control form-control-sm '+data.attributes.class);
            input.setAttribute('type','number');
            input.onchange = function(){
                console.log(this.value);
                data.property.link[data.property.value] = this.value;
            };
            return input;
    }
    getSelect(data){
        console.log(data.attributes);
        var select = document.createElement('select');
            //select.classList.add('form-control','form-control-sm',data.attributes.class);
            select.setAttribute('class','form-control form-control-sm '+data.attributes.class);
            /* DEFAULT */
            select.appendChild(this.Html.createOptionGroup('Domyślny:',data.default));  
            /* REST */         
            select.appendChild(this.Html.createOptionGroup('Dostępne',data.all));
            select.onchange = function(){
                console.log(this.value);
                data.property.link[data.property.value] = this.value;
                for(const prop in data.property.glossary){
                    console.log(data.property.glossary[prop].n);
                    console.log(data.property.glossary[prop].v);
                    if(data.property.glossary[prop].v===this.value){
                        console.log('found');
                        data.property.link[data.property.name] = data.property.glossary[prop].n;
                        break;
                    }
                }
            };
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
}