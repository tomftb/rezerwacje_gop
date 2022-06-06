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
        for(var index in this.data){
            dynamicDiv.appendChild(self.createInputRow(index,this.data));
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
                var data = self.getDefault();
                //var idx =  self.Utilities.countObjectProp(self.data);  
                var idx =  parseInt(self.Utilities.getLastProp(self.data),10)+1; 
                    //self.data.push(data);
                    console.log(self.data);
                    console.log(idx);
                    console.log(self.option);
                var option=self.Html.createOption();
                    option.setAttribute('value',idx);
                    //option.setAttribute('class',data[property].fontcolor+' '+data[property].backgroundcolor);
                    //option.style.fontFamily = data.fontFamily;
                    //option.style.color = data.color;
                    //option.style.backgroundColor = data.backgroundcolor;
                    option.innerText=idx; 
                    //throw 'llll';
                    self.data[idx] = self.getDefault();
                    //throw 'aaaaaaaaa';
                    self.option.appendChild(option);
                    dynamicDiv.appendChild(self.createInputRow(idx,self.data));
                /* ADD ROW tabstop PROPERTY */
              
                
            };
        return div;
    }
    createInputRow(idx,data){
        console.log('TabStop::createInputRow()');
        console.log(idx);
        console.log(data);
        
        /* DIV - blok input */
        var divTool = document.createElement('DIV');
            divTool.classList.add('input-group');
            /* VALUE INPUT */
            divTool.appendChild(this.createValue(data[idx],'position'));
            /* MEASUREMENT SELECT */
            divTool.appendChild(this.createInputRowProperty(data[idx],'measurementName','measurement',this.property.listMeasurement));
            /* ALIGN SELECT */
            divTool.appendChild(this.createInputRowProperty(data[idx],'alignmentName','alignment',this.property.tabStopAlign));
            /* LEADING SIGN SELECT */
            divTool.appendChild(this.createInputRowProperty(data[idx],'leadingSignName','leadingSign',this.property.leadingSign));
            /* REMOVE BUTTON */
            divTool.appendChild(this.createRemoveButton(divTool,idx,data));
       return divTool;
    }
    createValue(data,key){
        /* INPUT - Pozycja tabulatora */
        var input=document.createElement('INPUT');
            input.classList.add('form-control-sm','form-control');
            input.setAttribute('type','number');
            /* TO FIX */
            input.setAttribute('value',data[key]);
            input.onchange = function(){
                data[key]=this.value;
                console.log(data);
            };
            return input;
    }
    createInputRowProperty(data,name,value,all){
        var select=document.createElement('SELECT');
            select.classList.add('form-control-sm','form-control');
        var defaultOption={
                0:this.Utilities.getDefaultOptionProperties(data[value],data[name])
            };
            select.appendChild(this.Html.createOptionGroup('Domyślny:',defaultOption)); 
            select.appendChild(this.Html.createOptionGroup('Dostępne',this.Utilities.getDefaultList(all,data[value])));
            select.onchange=function(){
            //console.log(this.value); 
            //console.log(this.selectedIndex); 
            //console.log(this.name);  
            data[value]=this.value;
            console.log(data);
            //console.log(data);  
            //stageData.departmentName = data[this.selectedIndex]; 
            };
            
            
        return select;   
    }
    createRemoveButton(divRow,idx,data){
        var div = this.Html.removeButton();
            console.log(div);
            div.classList.add('input-group-text');
        var divAll = document.createElement('div');    
            divAll.classList.add('input-group-append');
            /* CLOSURE */
            div.onclick=function(){
                if (confirm('Potwierdź usunięcie tabulacji') === true) {
                    divRow.remove();
                    delete data[idx];
                    //delete
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
}