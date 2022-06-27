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
    create(data,idx){
        console.log('TabStop::create()');
        console.log(data);
        console.log(idx);
        console.log('paragraph');
        console.log(this.paragraph);
        this.data = data;
        console.log('this data');
        console.log(data);
        /* PUNKT TABULACJI */
        /* mainDiv - blok calosci */
        var main = document.createElement('DIV');
            main.classList.add('row');
        /* mainDiv - dynamiczny blok */
        this.paragraph[idx].list = document.createElement('DIV');
        this.paragraph[idx].list.classList.add('col-12');
            /* SET DATA */
            this.setData(idx);
            main.appendChild(this.createLabel('Tabulacje','h5'));
            main.appendChild(this.createInput(idx));
            main.appendChild(this.createLabel('Aktualna lista:','h6'));
            main.appendChild(this.paragraph[idx].list);
            
        console.log(main);
        return main;
    }
    setData(idx){
        console.log('TabStop::setData');
        var lp=0;
        for(var index in this.data){
            this.paragraph[idx].list.appendChild(this.createListRow(index,this.data,lp,idx));
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
    createInputRow(idx){
        console.log('TabStop::createInputRow()');          
        var divTool = document.createElement('DIV');
            divTool.classList.add('input-group');
            /* VALUE INPUT */
            divTool.appendChild(this.createInputValue(idx));
            /* MEASUREMENT SELECT */
            divTool.appendChild(this.createInputRowProperty('measurementName','measurement',this.property.listMeasurement,idx));
            /* ALIGN SELECT */
            divTool.appendChild(this.createInputRowProperty('alignmentName','alignment',this.property.tabstopAlign,idx));
            /* LEADING SIGN SELECT */
            divTool.appendChild(this.createInputRowProperty('leadingSignName','leadingSign',this.property.leadingSign,idx));
            /* ADD BUTTON */
            divTool.appendChild(this.addButton(idx));
       return divTool;
    }
    createListRow(idx,data,lp,mainIdx){
        //console.log('TabStop::createListRow()');
        var divMain = document.createElement('DIV');
            divMain.classList.add('row','ml-0');
            divMain.appendChild(this.createListRowEle(data[idx].position+' '+data[idx].measurement,'col-3'));
            divMain.appendChild(this.createListRowEle(data[idx].alignmentName,'col-3'));
            divMain.appendChild(this.createListRowEle(data[idx].leadingSignName,'col-3'));
            /* REMOVE BUTTON */
            divMain.appendChild(this.rmButton(divMain,idx,data,lp,mainIdx));
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
    createInputValue(idx){
        /* INPUT - Pozycja tabulatora */
        this.actData[idx]={
            position:0,
            measurement:'',
            measurementName:'',
            alignment:'',
            alignmentName:'',
            leadingSign:'',
            leadingSignName:''
        }
        var self = this;
        var input=document.createElement('INPUT');
            input.classList.add('form-control-sm','form-control');
            input.setAttribute('type','number');
            input.setAttribute('value',this.default.position);
            input.onchange = function (){
                self.actData[idx].position = parseFloat(this.value);
            };
        return input;
    }
    createInputRowProperty(nameKey,valueKey,glossary,idx){
        var select=document.createElement('SELECT');
            select.classList.add('form-control-sm','form-control');
        var defaultOption={
                0:this.Utilities.getDefaultOptionProperties(this.default[valueKey],this.default[nameKey])
            };     
        var self = this;
            select.appendChild(this.Html.createOptionGroup('Domyślny:',defaultOption)); 
            select.appendChild(this.Html.createOptionGroup('Dostępne',this.Utilities.getDefaultList(glossary,this.default[valueKey])));   
            /* SET DEEFAULT */
            this.actData[idx][valueKey] = this.default[valueKey];
            this.actData[idx][nameKey] = this.default[nameKey];
            select.onchange=function(){
                // UPDATE OPTION SELECT VALUE IN DATA TABSTOP OBJECT
                self.actData[idx][valueKey]=this.value;
                // UPDATE OPTION SELECT LABEL IN DATA TABSTOP OBJECT
                self.actData[idx][nameKey]=self.getValueNameFromGlossary(glossary,this.value);;
            };
        return select;   
    }
    rmButton(divRow,idx,data,lp,mainIdx){
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
                    console.log('MAIN IDX');
                    console.log(mainIdx);
                    /* REMOVE DIV ROW WITH INPUT AND BUTTON */
                    divRow.remove();
                    /* REMOVE DATA IDX FROM DATA (LIST) TABSTOP OBJECT */
                    delete data[idx];
                    
                    /* REMOVE VALUE OPTION FROM LIST IN SELECT TABSTOP */
                    self.paragraph[mainIdx].option.childNodes[lp].remove();
                    /* SET paragraph.property.tabstop */
                    console.log(self.paragraph[mainIdx].data.property.tabstop);
                    if(idx===self.paragraph[mainIdx].data.property.tabstop){
                        self.paragraph[mainIdx].data.property.tabstop='-1';
                    }
                    /* REMOVE FROM paragraph.tabstop */
                    delete self.paragraph[mainIdx].data.tabstop[idx];
                    console.log(self.paragraph[mainIdx].data.property.tabstop);
                } else {
                    // NOTHING TO DO
                }
            };
            divAll.appendChild(div);
        return divAll;
    }
    addButton(idx){
        console.log('TabStop:addButton()');
        console.log('idx:');
        console.log(idx);
        console.log('paragraph');
        console.log(this.paragraph);
        var self = this;
        var btnDiv = this.Html.addButton();
            btnDiv.classList.add('btn-sm','rounded-0');
            btnDiv.classList.remove('btn-success');
            btnDiv.classList.add('btn-warning');
            btnDiv.onclick = function(){
                console.clear();
                console.log('idx:');
                console.log(idx);
                var found = false;
                var lp = 0;
                /* REFERENCJA */
                //var actData = self.actData;
                /* WARTOSCI */
                var tmpData={
                    alignment: self.actData[idx].alignment,
                    alignmentName: self.actData[idx].alignmentName,
                    leadingSign: self.actData[idx].leadingSign,
                    leadingSignName: self.actData[idx].leadingSignName,
                    measurement: self.actData[idx].measurement,
                    measurementName: self.actData[idx].measurementName,
                    position: self.actData[idx].position,
                    positionInMM:self.actData[idx].position
                };
                
                if(tmpData.measurement==='cm'){
                    tmpData.positionInMM=tmpData.position*10;
                }
                
                console.log('INPUT positionInMM');
                console.log(typeof(tmpData.positionInMM));
                console.log(tmpData.positionInMM);
                /* DEFAULT */
                var selectedData = {
                    position: -1,
                    measurement: ''
                };
                /* EXCEPTION IF self.paragraph.property.tabstop = '-1' = NONE */
                //throw 'stop-193';
                console.log(self.paragraph[idx]);
                console.log(self.paragraph[idx].data.property);
                console.log(self.paragraph[idx].data.property.tabstop);
                if(self.paragraph[idx].data.property.tabstop!=='-1'){
                    selectedData={
                        position: self.data[self.paragraph[idx].data.property.tabstop].position,
                        measurement: self.data[self.paragraph[idx].data.property.tabstop].measurement
                    }; 
                };
                var newData = new Object();
                newData.data = {};
                newData.i = 0;
                newData.add = function(d){
                    this.data[this.i]=d;
                    this.i++;
                };
                for(var prop in self.data){
                    
                    
                    /*
                     * CREATE NEW PROPERTY positionInMM -> cm to mm
                     */
                    if(self.data[prop].measurement==='cm'){
                        self.data[prop]['positionInMM']=self.data[prop].position*10;
                    }
                    else{
                        self.data[prop]['positionInMM']=self.data[prop].position;
                    }
                    
                    console.log('ACT positionInMM');
                    console.log(typeof(self.data[prop]['positionInMM']));
                    console.log(self.data[prop]['positionInMM']);
                    if(self.data[prop]['positionInMM']<tmpData.positionInMM){
                        //console.log('LOWER');
                       newData.add(self.data[prop]);
                    }
                     /* CHECK FOR EXIST, IF EXIST -> UPDATE */
                    else if(self.data[prop].positionInMM===tmpData.positionInMM){
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
                        newData.add(self.data[prop]);            
                    }
                    lp++;
                    delete self.data[prop].positionInMM;
                };
                
                if(!found){
                    //console.log('ELEMENT NOT FOUND -> ADD AT END OF THE LIST'); 
                    newData.add(tmpData);
                }
                // REMOVE LIST WITH OLD DATA VALUE
                self.Html.removeChilds(self.paragraph[idx].list);
                //REMOVE OPTION SELECT WITH OLD DATA VALUE
                self.Html.removeChilds(self.paragraph[idx].option);
                /* 
                 * CREATE NEW LIST AND SELECT OPTION
                 */
                for(var i in newData.data){
                    self.paragraph[idx].list.appendChild(self.createListRow(i,newData.data,i,idx));   
                    self.paragraph[idx].option.appendChild(self.setOptionEle(i,newData.data[i])); 
                    
                    /* STRING = STRING */
                    if(newData.data[i].position===selectedData.position && newData.data[i].measurement===selectedData.measurement){
                        /* 
                         * SET SELECTED OPTION 
                         */
                        self.paragraph[idx].option.lastChild.selected=true;
                        /* 
                         * UPDATE ROW PROPERTY TAB STOP IDX 
                         */
                        self.paragraph[idx].data.property.tabstop=i;
                    }
                    /* 0 EXCEPTION */
                    if(newData.data[i].position===selectedData.position && selectedData.position===0){
                        /* 
                         * SET SELECTED OPTION 
                         */
                        self.paragraph[idx].option.lastChild.selected=true;
                        /* 
                         * UPDATE ROW PROPERTY TAB STOP IDX 
                         */
                        self.paragraph[idx].data.property.tabstop=i;
                    }
                };
                
                /* 
                 * UPDATE OBJECT TabStop data PROPERTY AND paragraph.tabsStop PROPERTY WITH NEW TAB STOP
                 */
                self.data = newData.data;
                self.paragraph[idx].data.tabstop = newData.data;
                console.log(newData.data);
            };
        return btnDiv;
    }
    //setOptionRef(option){
      //  this.option=option;
    //}
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
    createInput(idx){      
        var inputDiv = document.createElement('DIV');
            inputDiv.classList.add('col-12');
            inputDiv.appendChild(this.createInputRow(idx));
        return inputDiv;
    }
    
}