/* 
 * TabStop
 * Author: Tomasz Borczynski
 */
class TabStop{
    property=new Object();
    Html = new Object();
    Utilities = new Object();
    data = new Array();
    default = new Object();
    //option = {};
    paragraph = {};
    /*
     * data
     * option - link
     * list - link
     */
    actData ={};
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
    create(){//data
        //console.log('TabStop::create()');
        /* PUNKT TABULACJI */
        /* mainDiv - blok calosci */
        var main = document.createElement('DIV');
            main.classList.add('row');
        /* mainDiv - dynamiczny blok */
        this.paragraph.list = document.createElement('DIV');
        this.paragraph.list.classList.add('col-12');
            /* SET DATA */
            this.createList();
            main.appendChild(this.createLabel('Tabulacje','h5'));
            main.appendChild(this.createInput());
            main.appendChild(this.createLabel('Aktualna lista:','h6'));
            main.appendChild(this.paragraph.list);
        return main;
    }
    createList(){
        //console.log('TabStop::setData');
        for(var index in this.paragraph.data.tabstop){
            this.paragraph.list.appendChild(this.createListRow(index,this.paragraph.data.tabstop[index]));
        }
    }
    getData(){
        return this.paragraph.data.tabstop;
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
    createInputRow(){
        //console.log('TabStop::createInputRow()');          
        var divTool = document.createElement('DIV');
            divTool.classList.add('input-group');
            /* VALUE INPUT */
            divTool.appendChild(this.createInputValue());
            /* MEASUREMENT SELECT */
            divTool.appendChild(this.createInputRowProperty('measurementName','measurement',this.property.listMeasurement));
            /* ALIGN SELECT */
            divTool.appendChild(this.createInputRowProperty('alignmentName','alignment',this.property.tabstopAlign));
            /* LEADING SIGN SELECT */
            divTool.appendChild(this.createInputRowProperty('leadingSignName','leadingSign',this.property.leadingSign));
            /* ADD BUTTON */
            divTool.appendChild(this.addButton());
       return divTool;
    }
    createListRow(idx,data){
        //console.log('TabStop::createListRow()');
        var divMain = document.createElement('DIV');
            divMain.classList.add('row','ml-0');
            divMain.appendChild(this.createListRowEle(data.position+' '+data.measurement,'col-3'));
            divMain.appendChild(this.createListRowEle(data.alignmentName,'col-3'));
            divMain.appendChild(this.createListRowEle(data.leadingSignName,'col-3'));
            /* REMOVE BUTTON */
            divMain.appendChild(this.rmButton(divMain,idx));
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
        this.actData={
            position:0,
            measurement:'',
            measurementName:'',
            alignment:'',
            alignmentName:'',
            leadingSign:'',
            leadingSignName:''
        };
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
    rmButton(divRow,idx){
        var div = this.Html.removeButton();
            div.classList.add('btn-sm','rounded-0');
        var divAll = document.createElement('div');    
            divAll.classList.add('col-3','p-0');
            /* CLOSURE */
        var self = this;
            div.onclick=function(){
                if (confirm('Potwierdź usunięcie tabulacji') === true) { 
                    console.log('TabStop:rmButton().onclick()');
                    //console.log('IDX:');
                    //console.log(idx);
                    //console.log('IDX typeof:');
                    //console.log(typeof (idx));
                    //console.log('DIV TO REMOVE:');
                    //console.log(divRow);
                    /* REMOVE DIV ROW WITH INPUT AND BUTTON */
                    divRow.remove();
                    /* REMOVE DATA IDX FROM DATA (LIST) TABSTOP OBJECT */
                    //throw 'sssss';
                    delete self.paragraph.data.tabstop[idx];
                    /* REMOVE VALUE OPTION FROM LIST IN SELECT TABSTOP */
                    let optionIdxToRemove = -1;
                   // console.log('TabStop select oprion children:');
                    //console.log(self.paragraph.option.children);
                    //console.log('length:');
                    //console.log(self.paragraph.option.children.length);
                    
                    for (let i = 0; i < self.paragraph.option.children.length; i++) {
                        //console.log(self.paragraph.option.children[i].value);
                        //console.log(typeof (self.paragraph.option.children[i].value));
                        if(self.paragraph.option.children[i].value===idx){
                            //console.log('found');
                            //console.log(i);
                            optionIdxToRemove = i;
                            break;
                        }
                    }
                    /* CAN be idx = 0 */
                    if(optionIdxToRemove>-1){
                        //console.log('paragraph option to remove');
                        self.paragraph.option.childNodes[optionIdxToRemove].remove(); 
                    }
                    /* SET paragraph.property.tabstop */
                    //console.log('Property tabStop:');
                    //console.log(self.paragraph.data.property.tabstop);
                    //console.log(typeof(self.paragraph.data.property.tabstop));
                    if(idx===self.paragraph.data.property.tabstop){
                        self.paragraph.data.property.tabstop='-1';
                    }
                    /* REMOVE FROM paragraph.tabstop */
                    delete self.paragraph.data.tabstop[idx];
                    //console.log('TabStop list:');
                    //console.log(self.paragraph.data.tabstop);
                } else {
                    // NOTHING TO DO
                }
            };
            divAll.appendChild(div);
        return divAll;
    }
    addButton(){
        //console.log('TabStop:addButton()');
        var self = this;
        var btnDiv = this.Html.addButton();
            btnDiv.classList.add('btn-sm','rounded-0');
            btnDiv.classList.remove('btn-success');
            btnDiv.classList.add('btn-warning');
            btnDiv.onclick = function(){
                //console.clear();
                var found = false;
                var lp = 0;
                /* REFERENCJA */
                //var actData = self.actData;
                /* WARTOSCI */
                var tmpData={
                    alignment: self.actData.alignment,
                    alignmentName: self.actData.alignmentName,
                    leadingSign: self.actData.leadingSign,
                    leadingSignName: self.actData.leadingSignName,
                    measurement: self.actData.measurement,
                    measurementName: self.actData.measurementName,
                    position: self.actData.position,
                    positionInMM:self.actData.position
                };
                if(tmpData.measurement==='cm'){
                    tmpData.positionInMM=tmpData.position*10;
                }
                /* DEFAULT */
                var selectedData = {
                    position: -1,
                    measurement: ''
                };
                /* EXCEPTION IF self.paragraph.property.tabstop = '-1' = NONE */
                //throw 'stop-193';
                //console.log('Paragraph:');
                //console.log(self.paragraph);
                //console.log('Paragraph data property:');
                //console.log(self.paragraph.data.property);
                //console.log('Paragraph data property - tabstop:');
                //console.log(self.paragraph.data.property.tabstop);
                if(self.paragraph.data.property.tabstop!=='-1'){
                    selectedData={
                        position: self.paragraph.data.tabstop[self.paragraph.data.property.tabstop].position,
                        measurement: self.paragraph.data.tabstop[self.paragraph.data.property.tabstop].measurement
                    }; 
                };
                var newData = new Object();
                newData.data = {};
                newData.i = 0;
                newData.add = function(d){
                    this.data[this.i]=d;
                    this.i++;
                };
                for(var prop in self.paragraph.data.tabstop){
                    
                    
                    /*
                     * CREATE NEW PROPERTY positionInMM -> cm to mm
                     */
                    if(self.paragraph.data.tabstop[prop].measurement==='cm'){
                        self.paragraph.data.tabstop[prop]['positionInMM']=self.paragraph.data.tabstop[prop].position*10;
                    }
                    else{
                        self.paragraph.data.tabstop[prop]['positionInMM']=self.paragraph.data.tabstop[prop].position;
                    }
                    
                    //console.log('ACT positionInMM');
                    //console.log(typeof(self.paragraph.data.tabstop[prop]['positionInMM']));
                    //console.log(self.paragraph.data.tabstop[prop]['positionInMM']);
                    if(self.paragraph.data.tabstop[prop]['positionInMM']<tmpData.positionInMM){
                        //console.log('LOWER');
                       newData.add(self.paragraph.data.tabstop[prop]);
                    }
                     /* CHECK FOR EXIST, IF EXIST -> UPDATE */
                    else if(self.paragraph.data.tabstop[prop].positionInMM===tmpData.positionInMM){
                        //console.log('THE SAME - UPDATE');
                        found = true;
                        delete tmpData.positionInMM;
                        newData.add(tmpData);
                        
                    }
                    else{
                        //console.log('HIGHER');
                        if(!found){
                            delete tmpData.positionInMM;
                            newData.add(tmpData);
                            found = true;
                            /* INCREMENT */
                            lp++;
                        }
                        /* REST */
                        newData.add(self.paragraph.data.tabstop[prop]);            
                    }
                    lp++;
                    delete self.paragraph.data.tabstop[prop].positionInMM;
                };
                
                if(!found){
                    //console.log('ELEMENT NOT FOUND -> ADD AT END OF THE LIST'); 
                    newData.add(tmpData);
                }
                // REMOVE LIST WITH OLD DATA VALUE
                self.Html.removeChilds(self.paragraph.list);
                //REMOVE OPTION SELECT WITH OLD DATA VALUE
                self.Html.removeChilds(self.paragraph.option);
                /* 
                 * CREATE NEW LIST AND SELECT OPTION
                 */
                for(var i in newData.data){
                    self.paragraph.list.appendChild(self.createListRow(i,newData.data[i]));   
                    self.paragraph.option.appendChild(self.setOptionEle(i,newData.data[i])); 
                    
                    /* STRING = STRING */
                    if(newData.data[i].position===selectedData.position && newData.data[i].measurement===selectedData.measurement){
                        /* 
                         * SET SELECTED OPTION 
                         */
                        self.paragraph.option.lastChild.selected=true;
                        /* 
                         * UPDATE ROW PROPERTY TAB STOP IDX 
                         */
                        self.paragraph.data.property.tabstop=i;
                    }
                    /* 0 EXCEPTION */
                    if(newData.data[i].position===selectedData.position && selectedData.position===0){
                        /* 
                         * SET SELECTED OPTION 
                         */
                        self.paragraph.option.lastChild.selected=true;
                        /* 
                         * UPDATE ROW PROPERTY TAB STOP IDX 
                         */
                        self.paragraph.data.property.tabstop=i;
                    }
                };
                /* 
                 * UPDATE OBJECT TabStop data PROPERTY AND paragraph.tabsStop PROPERTY WITH NEW TAB STOP
                 */
                self.paragraph.data.tabstop = newData.data;
                //console.log('Paragraph data tabstop list:');
                //console.log(self.paragraph.data.tabstop);
                //console.log('Paragraph data tabstop list (newData):');
                //console.log(newData.data);
            };
        return btnDiv;
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
            inputDiv.appendChild(this.createInputRow());
        return inputDiv;
    }
    
}