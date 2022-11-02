class Department{
    DepartmentData;
    Act;
    Html = new Object();
    Link=new Object();
    
    constructor(){
        //console.log('Department::constructor()');
        this.Html = new Html();
    }
    get(){
        var mainRow=this.Html.getRow();
        var labelCol=this.Html.getCol(1);
        var selectCol=this.Html.getCol(11);
            labelCol.appendChild(this.getLabel('h3','Dział:'));
        var select=this.getSelect('department','department','form-control w-100');
            select.setAttribute('aria-describedby',"departmentHelp" );
            select.appendChild(this.getSelectOption('Aktualny:',this.Act));  
            select.appendChild(this.getSelectOption('Dostępne:',this.DepartmentData.avaDepartmentList)); 
            /* SET LINK */
            this.Link=select;
        var helpText=document.createTextNode('Wskaż dział.');     
        var help=document.createElement('small');
            help.setAttribute('id','departmentHelp');
            help.classList.add('form-text','text-muted');
            help.appendChild(helpText);
        selectCol.appendChild(select);
        selectCol.appendChild(help);
        mainRow.appendChild(labelCol);
        mainRow.appendChild(selectCol);
        return mainRow;
    }
    getLink(){
        return this.Link;
    }

    setData(DepartmentData,Default){
        /* CHECK */
        this.DepartmentData=DepartmentData;
        this.Act=Default;
        /* CHECK */
    }
    getLabel(h,v){
        var text=document.createTextNode(v);
        var ele=document.createElement(h);
            ele.classList.add('text-center','font-weight-bold');
            ele.appendChild(text);
            return ele;
    }
    getSelect(id,name,c){
        /*
         * c - class
         */
        var select=document.createElement('select');
            select.setAttribute('class',c);
            select.setAttribute('id',id);
            select.setAttribute('name',name);
            return select;
    }
    getSelectOption(title,data){
        var optionGroup=document.createElement('optgroup');
            optionGroup.setAttribute('label',title);
            optionGroup.setAttribute('class','bg-info text-white');
            for (const property in data) {
                var option=document.createElement('option');
                    option.setAttribute('value',data[property].v);
                    option.style.color = '#000000';
                    option.style.backgroundColor = '#FFFFFF';
                    option.innerText=data[property].n;
                    optionGroup.appendChild(option);
            };
        return optionGroup;
    }
}

