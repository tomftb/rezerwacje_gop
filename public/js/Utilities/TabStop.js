/* 
 * TabStop
 * Author: Tomasz Borczynski
 */
class TabStop{
    //parameter=new Object();
    property=new Object();
    Html = new Object();
    Utilities = new Object();
    data = new Array();
    default = new Object();
    option = {};
    paragraph = {};
    actData ={
            position:0,
            measurement:'',
            measurementName:'',
            alignment:'',
            alignmentName:'',
            leadingSign:'',
            leadingSignName:''
    };
    listDiv=new Object();
    
    constructor(){
        this.Html = new Html();
        this.Utilities = new Utilities();
    }
    setProperty(key,value){
        this.property[key]=value;
    }
    setParameter(p){
        //this.parameter = p;
        this.default = this.getDefault(p);
    }
    create(data){
        console.log('TabStop::create');
        console.log(data);
        this.data = data;
        /* PUNKT TABULACJI */
        /* mainDiv - blok calosci */
        var main = document.createElement('DIV');
            main.classList.add('row');
        /* mainDiv - dynamiczny blok */
        this.listDiv = document.createElement('DIV');
        this.listDiv.classList.add('col-12');
            /* SET DATA */
            this.setData();
            main.appendChild(this.createLabel('Tabulacje','h5'));
            main.appendChild(this.createInput());
            main.appendChild(this.createLabel('Aktualna lista:','h6'));
            main.appendChild(this.listDiv);
            
        console.log(main);
        return main;
    }
    setData(){
        console.log('TabStop::setData');
        var lp=0;
        for(var index in this.data){
            this.listDiv.appendChild(this.createListRow(index,this.data,lp));
            lp++;
        }
    }
    getData(){
        return this.data;
    }
    getDefault(parameter){
        return  {
                position:parameter.STAGE_TEXT_TABSTOP_POSITION.v,
                measurement:parameter.STAGE_TEXT_TABSTOP_MEASUREMENT.v,
                measurementName:parameter.STAGE_TEXT_TABSTOP_MEASUREMENT.n,
                alignment:parameter.STAGE_TEXT_TABSTOP_ALIGN.v,
                alignmentName:parameter.STAGE_TEXT_TABSTOP_ALIGN.n,
                leadingSign:parameter.STAGE_TEXT_TABSTOP_LEADING_SIGN.v,
                leadingSignName:parameter.STAGE_TEXT_TABSTOP_LEADING_SIGN.n
        };                  
    }
    createInputAdd(listDiv){
        var self=this;
        
        var div = this.createInputRow();
            /* CLOSURE */
            div.onclick = function(){
                console.log('TabStop::createInputAdd');
                //var data = self.getDefault();
                //var idx =  self.Utilities.countObjectProp(self.data);  
                var newIdx =  parseInt(self.Utilities.getLastProp(self.data),10)+1; 
                var lp = self.Utilities.countObjectProp(self.data);
                    self.data[newIdx] = self.getDefault();
                var newOption=self.Html.createOption();
                    newOption.setAttribute('value',newIdx);
                     
                    //throw 'llll';
                    
                    //all[prop]=this.Utilities.getDefaultOptionProperties(prop,subsectionrow.paragraph.tabStop[prop].position+' '+subsectionrow.paragraph.tabStop[prop].measurementName+' | '+subsectionrow.paragraph.tabStop[prop].alignmentName+' | '+subsectionrow.paragraph.tabStop[prop].leadingSignName);
                    newOption.innerText = self.setOptionLabal(self.data[newIdx]);
                    //newOption.innerText=self.data[newIdx].position+' '+self.data[newIdx].measurementName+' | '+self.data[newIdx].alignmentName+' | '+self.data[newIdx].leadingSignName; 
                    //throw 'aaaaaaaaa';
                    self.option.appendChild(newOption);
                    //listDiv.appendChild(self.createInputRow(newIdx,self.data,lp));
                /* ADD ROW tabstop PROPERTY */
            };
        //console.clear();
        console.log(div);
        return div;
    }
    createInputRow(){
        console.log('TabStop::createInputRow()');          
        var divTool = document.createElement('DIV');
            divTool.classList.add('input-group');
            /* VALUE INPUT */
            divTool.appendChild(this.createInputValue());
            /* MEASUREMENT SELECT */
            divTool.appendChild(this.createInputRowProperty('measurementName','measurement',this.property.listMeasurement));
            /* ALIGN SELECT */
            divTool.appendChild(this.createInputRowProperty('alignmentName','alignment',this.property.tabStopAlign));
            /* LEADING SIGN SELECT */
            divTool.appendChild(this.createInputRowProperty('leadingSignName','leadingSign',this.property.leadingSign));
            /* ADD BUTTON */
            divTool.appendChild(this.addButton());
       return divTool;
    }
    createListRow(idx,data,lp){
        //console.log('TabStop::createListRow()');
        var divMain = document.createElement('DIV');
            divMain.classList.add('row','ml-0');
            divMain.appendChild(this.createListRowEle(data[idx].position+' '+data[idx].measurement,'col-3'));
            divMain.appendChild(this.createListRowEle(data[idx].alignmentName,'col-3'));
            divMain.appendChild(this.createListRowEle(data[idx].leadingSignName,'col-3'));
            /* REMOVE BUTTON */
            divMain.appendChild(this.rmButton(divMain,idx,data,lp));
        return divMain; 
    }
    createListRowEle(value,col){
        var div = document.createElement('DIV');
            div.classList.add(col,'border','pl-2','pt-1');//
        var span = document.createElement('span');
        var text = document.createTextNode(value);
            span.appendChild(text);
            div.appendChild(span);
        return div;
    }
    createInputValue(){
        /* INPUT - Pozycja tabulatora */
        var self = this;
        var input=document.createElement('INPUT');
            input.classList.add('form-control-sm','form-control');
            input.setAttribute('type','number');
            input.setAttribute('value',this.default.position);
            input.onchange = function (){
                self.actData.position = parseFloat(this.value);
            };
        return input;
    }
    createInputRowProperty(nameKey,valueKey,glossary){
        var select=document.createElement('SELECT');
            select.classList.add('form-control-sm','form-control');
        var defaultOption={
                0:this.Utilities.getDefaultOptionProperties(this.default[valueKey],this.default[nameKey])
            };     
        var self = this;
            select.appendChild(this.Html.createOptionGroup('Domyślny:',defaultOption)); 
            select.appendChild(this.Html.createOptionGroup('Dostępne',this.Utilities.getDefaultList(glossary,this.default[valueKey])));   
            /* SET DEEFAULT */
            this.actData[valueKey] = this.default[valueKey];
            this.actData[nameKey] = this.default[nameKey];
            select.onchange=function(){
                // UPDATE OPTION SELECT VALUE IN DATA TABSTOP OBJECT
                self.actData[valueKey]=this.value;
                // UPDATE OPTION SELECT LABEL IN DATA TABSTOP OBJECT
                self.actData[nameKey]=self.getValueNameFromGlossary(glossary,this.value);;
            };
        return select;   
    }
    rmButton(divRow,idx,data,lp){
        var div = this.Html.removeButton();
            //console.log(div);
            //div.classList.add('input-group-text');
            div.classList.add('btn-sm','rounded-0');
        var divAll = document.createElement('div');    
            //divAll.classList.add('input-group-append');
            divAll.classList.add('col-3','p-0');
            /* CLOSURE */
        var self = this;
            div.onclick=function(){
                if (confirm('Potwierdź usunięcie tabulacji') === true) {   
                    /* REMOVE DIV ROW WITH INPUT AND BUTTON */
                    divRow.remove();
                    /* REMOVE DATA IDX FROM DATA (LIST) TABSTOP OBJECT */
                    delete data[idx];
                    /* REMOVE VALUE OPTION FROM LIST IN SELECT TABSTOP */
                    self.option.childNodes[lp].remove();
                    /* SET paragraph.property.tabStop */
                    console.log(self.paragraph.property.tabStop);
                    if(idx===self.paragraph.property.tabStop){
                        self.paragraph.property.tabStop='-1';
                    }
                    /* REMOVE FROM paragraph.tabStop */
                    delete self.paragraph.tabStop[idx];
                    console.log(self.paragraph.property.tabStop);
                } else {
                    // NOTHING TO DO
                }
            };
            divAll.appendChild(div);
        return divAll;
    }
    addButton(){
        var self = this;
        var btnDiv = this.Html.addButton();
            btnDiv.classList.add('btn-sm','rounded-0');
            btnDiv.classList.remove('btn-success');
            btnDiv.classList.add('btn-warning');
            btnDiv.onclick = function(){
                var found = false;
                var lp = 0;
                /* REFERENCJA */
                //var actData = self.actData;
                /* WARTOSCI */
                var actData={
                    alignment: self.actData.alignment,
                    alignmentName: self.actData.alignmentName,
                    leadingSign: self.actData.leadingSign,
                    leadingSignName: self.actData.leadingSignName,
                    measurement: self.actData.measurement,
                    measurementName: self.actData.measurementName,
                    position: self.actData.position,
                    positionInMM:self.actData.position
                };
                
                if(actData.measurement==='cm'){
                    actData.positionInMM=actData.position*10;
                }
                console.clear();
                console.log('INPUT positionInMM');
                console.log(typeof(actData.positionInMM));
                console.log(actData.positionInMM);
                /* DEFAULT */
                var selectedData = {
                    position: -1,
                    measurement: ''
                };
                /* EXCEPTION IF self.paragraph.property.tabStop = '-1' = NONE */
                //throw 'stop-193';
                console.log(self.paragraph);
                console.log(self.paragraph.property);
                console.log(self.paragraph.property.tabStop);
                if(self.paragraph.property.tabStop!=='-1'){
                    selectedData={
                        position: self.data[self.paragraph.property.tabStop].position,
                        measurement: self.data[self.paragraph.property.tabStop].measurement
                    }; 
                };
                var newData = new Object();
                newData.data = {};
                newData.i = 0;
                newData.add = function(d){
                    this.data[this.i]=d;
                    this.i++;
                };
                for(var idx in self.data){
                    
                    
                    /*
                     * CREATE NEW PROPERTY positionInMM -> cm to mm
                     */
                    if(self.data[idx].measurement==='cm'){
                        self.data[idx]['positionInMM']=self.data[idx].position*10;
                    }
                    else{
                        self.data[idx]['positionInMM']=self.data[idx].position;
                    }
                    
                    console.log('ACT positionInMM');
                    console.log(typeof(self.data[idx]['positionInMM']));
                    console.log(self.data[idx]['positionInMM']);
                    if(self.data[idx]['positionInMM']<actData.positionInMM){
                        //console.log('LOWER');
                       newData.add(self.data[idx]);
                    }
                     /* CHECK FOR EXIST, IF EXIST -> UPDATE */
                    else if(self.data[idx].positionInMM===actData.positionInMM){
                        //console.log('THE SAME - UPDATE');
                        found = true;
                        delete actData.positionInMM;
                        newData.add(actData);
                        
                    }
                    else{
                        //console.log('HIGHER');
                        if(!found){
                            delete actData.positionInMM;
                            newData.add(actData);
                            found = true;
                            /* INCREMENT */
                            lp++;
                        }
                        /* REST */
                        newData.add(self.data[idx]);            
                    }
                    lp++;
                    delete self.data[idx].positionInMM;
                };
                
                if(!found){
                    //console.log('ELEMENT NOT FOUND -> ADD AT END OF THE LIST'); 
                    newData.add(actData);
                }
                // REMOVE LIST WITH OLD DATA VALUE
                self.Html.removeChilds(self.listDiv);
                //REMOVE OPTION SELECT WITH OLD DATA VALUE
                self.Html.removeChilds(self.option);
                /* 
                 * CREATE NEW LIST AND SELECT OPTION
                 */
                for(var i in newData.data){
                    self.listDiv.appendChild(self.createListRow(i,newData.data,i));   
                    self.option.appendChild(self.setOptionEle(i,newData.data[i])); 
                    
                    /* STRING = STRING */
                    if(newData.data[i].position===selectedData.position && newData.data[i].measurement===selectedData.measurement){
                        /* 
                         * SET SELECTED OPTION 
                         */
                        self.option.lastChild.selected=true;
                        /* 
                         * UPDATE ROW PROPERTY TAB STOP IDX 
                         */
                        self.paragraph.property.tabStop=i;
                    }
                    /* 0 EXCEPTION */
                    if(newData.data[i].position===selectedData.position && selectedData.position===0){
                        /* 
                         * SET SELECTED OPTION 
                         */
                        self.option.lastChild.selected=true;
                        /* 
                         * UPDATE ROW PROPERTY TAB STOP IDX 
                         */
                        self.paragraph.property.tabStop=i;
                    }
                };
                
                /* 
                 * UPDATE OBJECT TabStop data PROPERTY AND paragraph.tabsStop PROPERTY WITH NEW TAB STOP
                 */
                self.data = newData.data;
                self.paragraph.tabStop = newData.data;
                console.log(newData.data);
            };
        return btnDiv;
    }
    setOptionRef(option){
        this.option=option;
    }
    setOptionEle(i,d){
        var option = this.Html.createOption();
            option.innerText = d.position+' '+d.measurementName+' | '+d.alignmentName+' | '+d.leadingSignName;
            option.setAttribute('value',i);
        return option; 
    }
    getValueNameFromGlossary(glossary,key){
        for(const prop in glossary){
            if(glossary[prop].v===key){
                return glossary[prop].n;
            }
        }
        return 'NOT FOUND';
    }
    createLabel(label,size){
        /* labelDiv - dynamiczny blok */
        var div = document.createElement('DIV');
            div.classList.add('col-12');
        var p = document.createElement('P');
            p.classList.add(size,'pt-1','pb-1','m-0');
        var text = document.createTextNode(label);
            p.appendChild(text);
            div.appendChild(p);
            return div;
    }
    createInput(){      
        var inputDiv = document.createElement('DIV');
            inputDiv.classList.add('col-12');
            //inputDiv.appendChild(this.createInputAdd(listDiv));
            inputDiv.appendChild(this.createInputRow());
        return inputDiv;
    }
    
}