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
        
        //var text = document.createTextNode('Dodaj tabulację');
        
        //var div=document.createElement('div');
         //   div.setAttribute('class','btn btn-sm btn-warning btn-add float-left text-white');
         //   div.appendChild(text);
        
            /* CLOSURE */
            div.onclick = function(){
                console.log('TabStop::createInputAdd');
                //var data = self.getDefault();
                //var idx =  self.Utilities.countObjectProp(self.data);  
                var newIdx =  parseInt(self.Utilities.getLastProp(self.data),10)+1; 
                var lp = self.Utilities.countObjectProp(self.data);
                    //self.data.push(data);
                    console.log('Data:');
                    console.log(self.data);
                    console.log('IDX:');
                    console.log(newIdx);
                    console.log('Option:');
                    console.log(self.option);
                    console.log('Lp:');
                    console.log(lp);
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
    /*
    createInputAdd(listDiv){
        var self=this;
        var text = document.createTextNode('Dodaj tabulację');   
        var div=document.createElement('div');
            div.setAttribute('class','btn btn-sm btn-warning btn-add float-left text-white');
            div.appendChild(text);
        
            // CLOSURE
            div.onclick = function(){
                console.log('TabStop::createInputAdd');
                var newIdx =  parseInt(self.Utilities.getLastProp(self.data),10)+1; 
                var lp = self.Utilities.countObjectProp(self.data);
                    console.log('Data:');
                    console.log(self.data);
                    console.log('IDX:');
                    console.log(newIdx);
                    console.log('Option:');
                    console.log(self.option);
                    console.log('Lp:');
                    console.log(lp);
                    self.data[newIdx] = self.getDefault();
                var newOption=self.Html.createOption();
                    newOption.setAttribute('value',newIdx);
                    newOption.innerText = self.setOptionLabal(self.data[newIdx]);
                    self.option.appendChild(newOption);
                    listDiv.appendChild(self.createInputRow(newIdx,self.data,lp));
            };
        return div;
    }
    */
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
    /*
    createInputRow(idx,data,lp){
        console.log('TabStop::createInputRow()');
        console.log(idx);
        console.log(data);
        // DIV - blok input
        var divTool = document.createElement('DIV');
            divTool.classList.add('input-group');
            // VALUE INPUT 
            divTool.appendChild(this.createValue(data[idx],'position',lp));
            // MEASUREMENT SELECT 
            divTool.appendChild(this.createInputRowProperty(data[idx],'measurementName','measurement',this.property.listMeasurement,lp));
            // ALIGN SELECT
            divTool.appendChild(this.createInputRowProperty(data[idx],'alignmentName','alignment',this.property.tabStopAlign,lp));
            // LEADING SIGN SELECT
            divTool.appendChild(this.createInputRowProperty(data[idx],'leadingSignName','leadingSign',this.property.leadingSign,lp));
            // REMOVE BUTTON
            divTool.appendChild(this.createRemoveButton(divTool,idx,data,lp));
        return divTool;
    }*/
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
                    position: self.actData.position
                };
                var selectedData={
                    position: self.data[self.paragraph.property.tabStop].position,
                    measurement: self.data[self.paragraph.property.tabStop].measurement
                };
                var newData = new Object();
                newData.data = {};
                newData.i = 0;
                newData.add = function(d){
                    //console.log(this);
                    this.data[this.i]=d;
                    this.i++;
                };
                console.clear();
                console.log('NEW DATA:');
                console.log(newData);
                console.log('INPUT DATA:');
                console.log(self.actData);
                console.log('ALL DATA:');
                console.log(self.data);
                console.log('SELECTED OPTION IDX:');
                console.log(self.paragraph);
                console.log(self.paragraph.property.tabStop);
                console.log(typeof(self.paragraph.property.tabStop));
                console.log('SELECTED OPTION DATA:');
                console.log(selectedData.position);
                console.log(typeof(selectedData.position));
                console.log(selectedData.measurement);
                console.log(typeof(selectedData.measurement));
                //console.log('LIST DIV:');
                //console.log(self.listDiv);
                
                // console.log('LIST OPTION:');
                //console.log(self.option);
               
               
                var found = false;
                var lp = 0;
                for(var idx in self.data){
                    console.log('INPUT POSITION');
                    console.log(self.actData.position);
                    console.log('DATA POSITION');
                    console.log(self.data[idx].position);
                    if(self.data[idx].position<actData.position){
                        console.log('LOWER');
                        //self.listDiv.appendChild(self.createListRow(idx,self.data,idx));
                        //
                       // newData[lp]=self.data[idx];
                       newData.add(self.data[idx]);
                    }
                     /* CHECK FOR EXIST, IF EXIST -> UPDATE */
                    else if(self.data[idx].position===actData.position){
                        //&& self.data[idx].measurement===self.actData.measurement
                        console.log('THE SAME - UPDATE');
                        found = true;
                        //newData.add('test-'+Date.now());
                        //newData.add({a:''});
                        newData.add(actData);
                       // newData[lp]=self.actData;
                    }
                    else{
                        console.log('HIGHER');
                        if(!found){
                          //  newData[lp]=self.actData;
                            //newData.add('test2-'+Date.now());
                            newData.add(actData);
                            found = true;
                            /* INCREMENT */
                            lp++;
                        }
                        /* REST */
                        newData.add(self.data[idx]);
                       // newData[lp]=self.data[idx];
                        /* UPDATE CURRENT TO ACTUALL */
                        
                        /* MOVE ACTUAL TO NEXT */
                    }
                   
                    
                    
                    // console.log(newData[lp]);
                    lp++;
                };
                
                if(!found){
                    console.log('ELEMENT NOT FOUND -> ADD AT END OF THE LIST'); 
                    console.log(newData); 
                    console.log(lp); 
                   // newData[lp] = self.actData;
                    console.log(newData); 
                    //newData.add('test-end-'+Date.now());
                    newData.add(actData);
                }
                // REMOVE LIST WITH OLD DATA VALUE
                self.Html.removeChilds(self.listDiv);
                //REMOVE OPTION SELECT WITH OLD DATA VALUE
                self.Html.removeChilds(self.option);
                /* 
                 * CREATE NEW LIST AND SELECT OPTION
                 */
                console.log('SET NEW LIST');
                for(var i in newData.data){
                    console.log(newData.data[i].position);
                    console.log(typeof(newData.data[i].position));
                    console.log(newData.data[i].measurement);
                    console.log(typeof(newData.data[i].measurement));
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
                };
                
                /* 
                 * UPDATE OBJECT DATA PROPERTY WITH NEW TAB STOP
                 */
                self.data = newData.data;
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