/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
class ProjectStageToolVariable{
    Parent = new Object();
    Html = new Object();
    Glossary = new Object();
    ErrorStack = new Object();
    Ele=new Object();
    Helplink = new Object();
    iSection=0;
    iSub=0;
    iRow=0;
    Row = new Object();
    ChosenListEle = new Object();
    selectInputStart=-1;
    selectInputEnd=-1;
    //ChosenList = new Array();
    
    constructor(ProjectStageTool,isection,isub,iSubRow,subsectionrowISubRow,helplinkISubRow,VariableList){
        this.setParent(ProjectStageTool);
        this.setProperty(isection,isub,iSubRow,subsectionrowISubRow,helplinkISubRow,VariableList);
        this.setTool();
        return this;
    }
    setParent(ProjectStageTool){
        console.log(ProjectStageTool);
        this.Parent = ProjectStageTool;
        this.Html = ProjectStageTool.Html;
        this.Glossary = ProjectStageTool.Glossary;
        this.ErrorStack = ProjectStageTool.ErrorStack;
    }
    setProperty(isection,isub,iSubRow,subsectionrowISubRow,helplinkISubRow,VariableList){
        console.log(isection);
        console.log(isub);
        console.log(iSubRow);
        console.log(subsectionrowISubRow);
        console.log(helplinkISubRow);
        console.log(helplinkISubRow.text.value);
        this.iSection =isection;
        this.iSub = isub;
        this.iRow = iSubRow;
        this.Row = subsectionrowISubRow;
        this.Helplink = helplinkISubRow;
        this.VariableList = VariableList;
        this.setVariables();
        this.assignVariable();
    }
    setTool(){
        console.log('ProjectStageToolVariable::getTool()');
        var mainDivCol=this.Html.getCol(12);
            mainDivCol.classList.add('d-none','pt-1','pb-1','border','border-purple');//,'bg-light'
            mainDivCol.style.backgroundColor='#FFFFFF';
        
        var Tool2 = new ToolFields([12]);
            this.setAvailableList(Tool2);
            console.log(Tool2);
        var Tool3 = new ToolFields([12]);
            this.setChosenList(Tool3);
            console.log(Tool3);
        
        var Tool = new ToolFields([12]);
            this.setTitle(Tool,'Zmienne:','h5');
        var Tool1 = new ToolFields([4,4,4]);
            this.setMainButtons(Tool1,Tool2,Tool3);
            console.log(Tool);
        
        //var label = this.assignImage(Tool1.getMain().childNodes[0]);
          //  Tool.set(0,this.getFile(name));//label turn off - because in load there is no file
           // console.log( this.Image);
            //throw 'asdasd';
          
        mainDivCol.appendChild(Tool.getMain());
        mainDivCol.appendChild(Tool1.getMain());
        mainDivCol.appendChild(Tool2.getMain());
        mainDivCol.appendChild(Tool3.getMain());
        //this.Helplink['file']=Tool1.getMain().childNodes[0];
        
        this.Ele=mainDivCol;
        return mainDivCol;
    }
    setMainButtons(Tool,Tool2,Tool3){
        console.log(Tool);
         Tool.Field[0].classList.add('btn-group','btn-group-toggle');
         
         var available = this.Parent.createControl('Dostępne',Tool2.get(0),'btn-outline-purple','btn-purple');//this.getAvailableList()
         var chosen = this.Parent.createControl('Wprowadzone',Tool3.get(0),'btn-outline-purple','btn-purple');//this.getAvailableList()
         Tool.set(0,available);
         Tool.set(0,chosen);
         //Tool.set(1,this.Parent.getSimpleInputSize(image.style,['width','widthMeasurement'],'Szerokość zdjęcia:'));
         //Tool.set(2,this.Parent.getSimpleInputSize(image.style,['marginLeft','marginLeftMeasurement'],'Lewy margines:'));
         //Tool.set(3,this.Parent.getSimpleInputSize(image.style,['marginTop','marginTopMeasurement'],'Prawy margines:'));
    }
    setTitle(Tool,l,h){
        var p = document.createElement('P');
            p.classList.add(h,'pt-1','pb-1','m-0','text-purple');
        var text = document.createTextNode(l);
            p.appendChild(text);
        Tool.set(0,p);
    }
    setAvailableList(Tool){

        var table = this.getListTable(['#','Nazwa:','Wartość:','Opcje:']);
            for(const prop in this.VariableList){
                let tr = document.createElement('tr');
                //let ele='th';
                /* FIRST COLUMN */
                let td = document.createElement('th');
                    td.setAttribute('scope','row');
                for(const propCol in this.VariableList[prop]){
                    let tdl = document.createTextNode(this.VariableList[prop][propCol]);
                        td.appendChild(tdl);
                        tr.appendChild(td);
                        //ele='td';
                        td = document.createElement('td');
                }
                /* OPTION COLUMN */
                let tdOption=document.createElement('td');
                this.getAvailableListAction(tdOption,this.VariableList[prop]);
                tr.appendChild(tdOption);
                //ele='th'; 
                table.childNodes[1].appendChild(tr);
            }
             console.log(table);
            this.setTitle(Tool,'Dostępne:','h6');
            Tool.set(0,table);
            this.Html.addClass(Tool.Field[0],'d-none');
    }
    setChosenList(Tool){
       this.setTitle(Tool,'Wskazane:','h6');
       var table = this.getListTable(['#','Nazwa:','Wartość:','Typ:','Opcje:']);
            console.log(table);
            console.log(table.childNodes[1]);
            this.ChosenListEle = table.childNodes[1];   
            this.setChosenVariables();
       Tool.set(0,table);
       this.Html.addClass(Tool.Field[0],'d-none');
    }
    getListTable(head){
        var table = document.createElement('table');
            this.Html.addClass(table,['table','table-striped']);
        var tHead = document.createElement('thead');
        var tBody = document.createElement('tbody');
        var trHead = document.createElement('tr');
            for(var i=0;i<head.length;i++){
                let th = document.createElement('th');
                    th.setAttribute('scope','col');
                let thValue = document.createTextNode(head[i]);
                    th.appendChild(thValue);
                    trHead.append(th);
            };
            tHead.appendChild(trHead);
            table.appendChild(tHead);
            table.appendChild(tBody);
            return table;
    }
    getAvailableListAction(ele,prop){
        var btn = this.Html.addButton();
            this.Html.removeClass(btn,'btn-success');
            this.Html.addClass(btn,'btn-purple');
        var self = this;
            btn.onclick = function(){
                console.log('getAvailableListAction() onclick()');
                console.log(self.selectInputStart);
                console.log(self.selectInputEnd);
                console.log(self.Helplink.text.value.value);
                console.log(self.Helplink.text.value.value.length);
                //console.log(this);
                //console.log(prop);
                //console.log(self);
                //console.log(self.Helplink.text.value);
                
                /* ON REMOVE BLOCK INPUT */
                
                //let lastIdx=self.Row.paragraph.variable.length - 1;
               
                let tmpValue=self.Helplink.text.value.value;
                let valueLength=self.Helplink.text.value.value.length;
                //self.Helplink.text.value.innerHTML=tmpValue+'['+prop[1]+']';
                /* ON END OF INPUT */
                if((self.selectInputStart===-1 && self.selectInputEnd===-1) || (self.selectInputStart===self.selectInputEnd && self.selectInputEnd===valueLength)){
                    console.log('END');
                    self.Row.paragraph.variable.push(prop);
                    self.Row.paragraph.property.value+='['+prop[1]+']';
                    self.Helplink.text.value.value=tmpValue+'['+prop[1]+']';
                    self.appendListRow(self.ChosenListEle,prop,self.Row.paragraph.variable.length - 1);
                }
                /* ON START OF INPUT */
                else if(self.selectInputStart===0 && self.selectInputEnd===0){
                    console.log('BEGINNING');
                    /* APPEND PROP TO INPUT START */
                    self.Helplink.text.value.value='['+prop[1]+']'+tmpValue;
                    /* APPEND PROPER TO Row paragraph object value */
                    self.Row.paragraph.property.value='['+prop[1]+']'+tmpValue;
                    /* SET VARIABLE PROPERTY AT BEGINING OF ARRAY */
                    self.Row.paragraph.variable.unshift(prop);
                    /* REWRITE ALL CHOSEN LIST - IMPORTANT INDEXES! */               
                    self.Html.removeChilds(self.ChosenListEle);
                    self.setChosenVariables();
                    
                    //self.prependListRow(self.ChosenListEle,prop,0);
                  
                   
                }
                else if(self.selectInputStart===self.selectInputEnd){
                    console.log('INSIDE - PARSE ALL INPUT');
                    /* SET NEW LIST FROM THE BEGINNIG LIKE ON onkeyup */
                    let head = self.Helplink.text.value.value.substr(0, self.selectInputStart);
                    let tail = self.Helplink.text.value.value.substr(self.selectInputStart,valueLength);
                    console.log(self.Helplink.text.value.value);
                    console.log(head);
                    console.log(tail);
                    self.Helplink.text.value.value=head+'['+prop[1]+']'+tail;
                    
                    /* FIX SELECTED AT END OF PROPERTY */
                    self.parseInputValue(self,self.Helplink.text.value.value);
                }
                else if(self.selectInputStart!==self.selectInputEnd){
                    console.log('INSIDE RANGE - PARSE ALL INPUT');
                    let head = self.Helplink.text.value.value.substr(0, self.selectInputStart);
                    let tail = self.Helplink.text.value.value.substr(self.selectInputEnd,valueLength);
                    console.log(self.Helplink.text.value.value);
                    console.log(head);
                    console.log(tail);
                    self.Helplink.text.value.value=head+'['+prop[1]+']'+tail;
                    /* FIX SELECTED AT END OF PROPERTY */
                    self.parseInputValue(self,self.Helplink.text.value.value);
                }
                else{
                    /* unavailable  */
                }
                
                console.log(self.Helplink.text.value.value);
                console.log(self.Row.paragraph.variable);
            };
            ele.appendChild(btn);
    }
    getTool(){
        return this.Ele;
    }
    setChosenVariables(){
        for(const prop in this.Row.paragraph['variable']){
            this.appendListRow(this.ChosenListEle,this.Row.paragraph['variable'][prop],prop);
        }
    }
    listRow(variableProperty,idx){
        var tr = document.createElement('tr');
        var ele='th';
            for(const prop in variableProperty){
                let td = document.createElement(ele);
                let tdl = document.createTextNode(variableProperty[prop]);
                    td.appendChild(tdl);
                    tr.appendChild(td);
                    ele='td';  
            }
            ele='th'; 
            /* OPTION COLUMN */
            this.getChosenVariablesAction(tr,variableProperty,idx);
            return tr;
    }
    prependListRow(ele,variableProperty,idx){
         /* ele -> tBody */
         ele.prepend(this.listRow(variableProperty,idx));
    }
    appendListRow(ele,variableProperty,idx){
        /* ele -> tBody */
         ele.append(this.listRow(variableProperty,idx));
    }
    getChosenVariablesAction(tr,prop,idx){
        var td = document.createElement('td');
        var btn = this.Html.removeButton();
            //this.Html.removeClass(btn,'btn-d');
            //this.Html.addClass(btn,'btn-purple');
        var self = this;
            btn.onclick = function(){
                console.log('getChosenVariablesAction()');
                console.log(this);
                console.log(prop);
                console.log('IDX:');
                console.log(idx);
                /* COUNT VALUE VARIABLE IN ARRAY */
                console.log('ROW VARIABLE LIST:');
                //let variableIdx=new Array();
                let variableOrdinalNumber =-1;
                for(var i = 0;self.Row.paragraph.variable.length>i;i++){
                    //console.log(self.Row.paragraph.variable[i][1]);
                    if(self.Row.paragraph.variable[i][1]===prop[1]){
                        //variableIdx.push(i);
                        //console.log('FOUND VARIABLE PROPERTY');
                        variableOrdinalNumber++;
                    }
                    /* SKIP LOOP */
                    if(i===idx){
                        break;
                    }
                }
                console.log('VARIABLE ordinal number to remove:');
                console.log(variableOrdinalNumber);
                console.log('ACTUALL PARAGRAPH VARIABLE LIST:');
                console.log(self.Row.paragraph.variable);
                /* 
                 * SPLIT VALUE VIA VARIABLE KEY WITH CHARS [] 
                 * SPACES BETWEEN KEYS IN ARRAY ARE FOUND VARIABLE KEY
                 * */
                console.log('SPLIT:');
                var valueSplit=self.Helplink.text.value.value.split('['+prop[1]+']');
                console.log(valueSplit);

                var newValue='';
                var tmpValue='';
                /* FOUND AND REMOVE VALUE FROM INPUT */
                for(var j=0;valueSplit.length>j;j++){
                    console.log('j- '+j);
                    newValue+=tmpValue+valueSplit[j];       
                    if(j!==variableOrdinalNumber){
                        console.log('IDX NOT MATCH - ADD');
                        tmpValue='['+prop[1]+']';
                    }
                    else{
                        console.log('IDX MATCH - NOT ADD');
                        tmpValue='';
                    }
                     
                }
                console.log('newValue');
                console.log(newValue);
                self.Helplink.text.value.value=newValue;
                /* REMOVE TABLE ROW */
                tr.remove();
                /* REMOVE VALUE FOR ARRAY VIA IDX */
                self.Row.paragraph.variable.splice(idx,1);
               
            };
            td.appendChild(btn);
            tr.appendChild(td);
    }
    setVariables(){
        if(!this.Row.paragraph.hasOwnProperty('variable')){
            this.Row.paragraph['variable']=new Array();
        }    
    }
    assignVariable(){
        /*
         * The keypress event is sent to an element when the browser registers keyboard input. This is similar to the keydown event, except that modifier and non-printing keys such as Shift, Esc, and delete trigger keydown events but not keypress events. Other differences between the two events may arise depending on platform and browser.

         * The keyup event is sent to an element when the user releases a key on the keyboard.

         * The oninput event it's an event that triggers whenever the input changes.
         */
        var self =this; 
        this.Helplink.text.value.onclick = function(){
            console.log('onclick');
           // console.log(self.Row.paragraph);
          //  console.log('chosen list:');
           // console.log(self.ChosenList);
            console.log('SELECT START:');
            console.log(this.selectionStart);
            console.log('SELECT END:');
            console.log(this.selectionEnd);
            self.selectInputStart=this.selectionStart;
            self.selectInputEnd=this.selectionEnd;
          //  console.log('ALL VALUE LENGTH:');
          //  console.log(this.value.length);
          //  console.log('SELECTED SUBSTRING:');
         //   console.log(this.value.substring(this.selectionStart,this.selectionEnd));
        };
        //this.Helplink.text.value.onchange = function(){
          //  console.log('onchange');
           // console.log(self.Row.paragraph);
        //};
        //this.Helplink.text.value.onkeypress = function(){
          //  console.log('onkeypress');
           // console.log(self.Row.paragraph);
        //};
        this.Helplink.text.value.onkeyup = function(){
            var KeyID = event.keyCode;
                console.log('onkeyup - key:');
                console.log(KeyID);
            switch(KeyID){
                case 8://console.log("backspace");
                case 46://console.log("delete");
                    break;
                case 16://console.log('Left or Right Shift');
                case 17://console.log('Left Ctrl');
                case 18://console.log('Left Alt');
                case 19://console.log('Pause Break');
                case 20://console.log('Caps Lock');
                case 33://console.log('Page Up');
                case 34://console.log('Page Down');
                case 35://console.log('End');
                case 36://console.log('Home');
                case 37://console.log('left,rigth,up or down');
                case 38:
                case 39:
                case 40:
                case 44://console.log('Print Screen Sys Rq');
                case 45://console.log('Insert');
                case 91:
                case 92://console.log('Left or Right Window Key');  
                case 144://console.log("Num Lock");
                case 145://console.log("Scroll Lock");
                case 113: //console.log("F Key");
                case 115:
                case 119:
                case 120:
                case 121:
                case 122:
                case 123:
                    console.log('RETURN TRUE');
                    return true;
                default:
                    break;
            }            
            console.log('START PARSE INPUT VALUE');
            self.parseInputValue(self,this.value);
        };
        this.Helplink.text.value.onblur = function(){
             var KeyID = event.keyCode;
                console.log('onblur - key:');
                /* F1, F3, F5, F6, F7, Tab, Left Alt */
                console.log(KeyID);
                /* reset selected - TURN OFF - MOVE TO ADD BUTTON NOT WORKS PROEPRTY BECAUSE IDX === -1 */
                //console.log('RESET SELECTED IDX');
                //self.selectInputStart=-1;
                //self.selectInputEnd=-1;
                //console.log(self.selectInputStart);
                //console.log(self.selectInputEnd);
        };
    }
    parseInputValue(self,value){
        /*
         * value
         */
        self.Html.removeChilds(self.ChosenListEle);
            var open = false;
            //var close = false;
            var variable='';
            var list = new Array();
            var char='';
            for(var i = 0; i<value.length;i++){
                char = value.substr(i, 1);
                //console.log(char);
                if(value.substr(i, 1)==='['){
                    /* [[[ is available */
                    //console.log('found open char');
                    open=true;
                    //close=false;
                    /*SKIP ASSIGN OPEN CHAR*/
                    continue;
                }
                /*IN FUTER SKIP WHITE SPACES */
                if(open===true && char!==']'){
                    variable+=char;
                    /*SKIP NEXT CHECK*/
                    continue;
                }
                if(char===']' && open===true && variable!==''){
                    //console.log('found close char, open = true, and variable not empty');
                    open=false;
                    list.push(variable);
                    variable='';
                }
                //console.log('variable');
                //console.log(variable);
            }
            /* SET PROPER VARIABLE COUT TO 0 */
            var vCount=0;
            /* CLEAR PARAGRAPH VARIABLE LIST */
            self.Row.paragraph.variable=new Array();
            /* 
             * LOOP OVER ALL FOUNDED STRING in CHARS []
             * CHECK ARE EXISTS IN VARIABLE LIST
             * IF AEXIST ADD
             */
            for(var i=0;i<list.length;i++){
                /*CHECK IN ChosenList*/
                console.log('i - '+i);
                console.log('variable - '+list[i]);
                /* LOOP OVER AVAILABLE VARIABLE LIST */
                for(const prop in self.VariableList){
                    if(list[i]===self.VariableList[prop][1]){
                        //console.log(self.VariableList[prop][1]); 
                        console.log('found variable in VariableList');
                        self.Row.paragraph.variable.push(self.VariableList[prop]);
                        self.appendListRow(self.ChosenListEle,self.VariableList[prop],vCount);
                        //found=self.VariableList[prop];
                        vCount++;
                        break;
                    };                
                };

            };
            console.log(self.Row.paragraph.variable);
    }
}