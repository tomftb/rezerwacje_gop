/* 
 * TabStop
 * Author: Tomasz Borczynski
 */
class TabStop{
    parameter=new Object();
    property=new Object();
    Html = new Object();
    Utilities = new Object();
    data = new Array();
    option = {};
    
    constructor(){
        this.Html = new Html();
        this.Utilities = new Utilities();
    }
    setProperty(key,value){
        this.property[key]=value;
    }
    setParameter(p){
        this.parameter = p;
    }
    create(data){
        console.log('TabStop::create');
        console.log(data);
        this.data = data;
        /* PUNKT TABULACJI */
        /* mainDiv - blok calosci */
        var mainDiv = document.createElement('DIV');
        /* mainDiv - dynamiczny blok */
        var dynamicDiv = document.createElement('DIV');
        /* dynamiDiv - statyczny blok */
        var staticDiv = document.createElement('DIV');
            staticDiv.classList.add('pt-1');
            staticDiv.appendChild(this.createAddButton(dynamicDiv));
            
            /* SET DATA */
            this.setData(dynamicDiv);
            
            mainDiv.appendChild(dynamicDiv);
            mainDiv.appendChild(staticDiv);
        
        return mainDiv;
    }
    setData(dynamicDiv){
        console.log('TabStop::setData');
        var self=this;
        
        //this.data.forEach(function(item, index, arr){
            /*console.log(item);
            console.log(index);
            console.log(arr);*/
           
        //});
        var lp=0;
        for(var index in this.data){
            
            dynamicDiv.appendChild(self.createInputRow(index,this.data,lp));
            lp++;
        }
    }
    getData(){
        return this.data;
    }
    getDefault(){
        return  {
                position:this.parameter.STAGE_TEXT_TABSTOP_POSITION.v,
                measurement:this.parameter.STAGE_TEXT_TABSTOP_MEASUREMENT.v,
                measurementName:this.parameter.STAGE_TEXT_TABSTOP_MEASUREMENT.n,
                alignment:this.parameter.STAGE_TEXT_TABSTOP_ALIGN.v,
                alignmentName:this.parameter.STAGE_TEXT_TABSTOP_ALIGN.n,
                leadingSign:this.parameter.STAGE_TEXT_TABSTOP_LEADING_SIGN.v,
                leadingSignName:this.parameter.STAGE_TEXT_TABSTOP_LEADING_SIGN.n
        };                  
    }
    createAddButton(dynamicDiv){
        var self=this;
        /* buttonAdd - dodanie tabulacji */
        var text = document.createTextNode('Dodaj tabulację');
        var div=document.createElement('div');
            div.setAttribute('class','btn btn-sm btn-warning btn-add float-left text-white');
            div.appendChild(text);
            /* CLOSURE */
            div.onclick = function(){
                console.log('TabStop::createAddButton');
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
                    dynamicDiv.appendChild(self.createInputRow(newIdx,self.data,lp));
                /* ADD ROW tabstop PROPERTY */
              
                
            };
        return div;
    }
    createInputRow(idx,data,lp){
        console.log('TabStop::createInputRow()');
        console.log(idx);
        console.log(data);
        
        /* DIV - blok input */
        var divTool = document.createElement('DIV');
            divTool.classList.add('input-group');
            /* VALUE INPUT */
            divTool.appendChild(this.createValue(data[idx],'position',lp));
            /* MEASUREMENT SELECT */
            divTool.appendChild(this.createInputRowProperty(data[idx],'measurementName','measurement',this.property.listMeasurement,lp));
            /* ALIGN SELECT */
            divTool.appendChild(this.createInputRowProperty(data[idx],'alignmentName','alignment',this.property.tabStopAlign,lp));
            /* LEADING SIGN SELECT */
            divTool.appendChild(this.createInputRowProperty(data[idx],'leadingSignName','leadingSign',this.property.leadingSign,lp));
            /* REMOVE BUTTON */
            divTool.appendChild(this.createRemoveButton(divTool,idx,data,lp));
       return divTool;
    }
    createValue(data,key,lp){
        /* INPUT - Pozycja tabulatora */
        var self = this;
        var input=document.createElement('INPUT');
            input.classList.add('form-control-sm','form-control');
            input.setAttribute('type','number');
            /* TO FIX */
            input.setAttribute('value',data[key]);
            input.onchange = function(){
                data[key]=parseFloat(this.value);
                self.option.childNodes[lp].childNodes[0].remove();
                self.option.childNodes[lp].appendChild(document.createTextNode(self.setOptionLabal(data)));
                console.log(data);
            };
            return input;
    }
    createInputRowProperty(data,nameKey,valueKey,glossary,lp){
        var select=document.createElement('SELECT');
            select.classList.add('form-control-sm','form-control');
        var defaultOption={
                0:this.Utilities.getDefaultOptionProperties(data[valueKey],data[nameKey])
            };
        var self = this;
            select.appendChild(this.Html.createOptionGroup('Domyślny:',defaultOption)); 
            select.appendChild(this.Html.createOptionGroup('Dostępne',this.Utilities.getDefaultList(glossary,data[valueKey])));
            select.onchange=function(){
                /* UPDATE OPTION SELECT VALUE IN DATA TABSTOP OBJECT*/
                data[valueKey]=this.value;
                 /* UPDATE OPTION SELECT LABEL IN DATA TABSTOP OBJECT*/
                data[nameKey]=self.getValueNameFromGlossary(glossary,this.value);;
                /* REMOVE OPTION SELECT WITH OLD DATA VALUE*/
                self.option.childNodes[lp].childNodes[0].remove();
                /* APPEND NEW OPTION SELECT WITH NEW DATA VALUE*/
                self.option.childNodes[lp].appendChild(document.createTextNode(self.setOptionLabal(data)));

            };
            
            
        return select;   
    }
    createRemoveButton(divRow,idx,data,lp){
        var div = this.Html.removeButton();
            console.log(div);
            div.classList.add('input-group-text');
        var divAll = document.createElement('div');    
            divAll.classList.add('input-group-append');
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
    setOption(option){
        this.option=option;
    }
    setOptionLabal(d){
        return d.position+' '+d.measurementName+' | '+d.alignmentName+' | '+d.leadingSignName; 
    }
    getValueNameFromGlossary(glossary,key){
        for(const prop in glossary){
            if(glossary[prop].v===key){
                return glossary[prop].n;
            }
        }
        return 'NOT FOUND';
    }
}