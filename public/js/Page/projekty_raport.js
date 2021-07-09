/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

class Report
{
    static modal=new Object();
    static stageData=new Array();
    static projectId='';
    static fieldCounter=0;
    static perm=new Array();
    static link={
        stage:new Object(),
        dynamicData:new Object(),
        buttons:new Object(),
        final:new Object(),
        form:new Object()
    }
    static actStage=new Object();
    /*
    static actStage={
        i:0,
        n:0,
        t:'',
        v:new Array()
    };
    */
    
    constructor() {
        console.log('Report::constructor()');
    }
    static getFormName(){
        /* SIMILAR TO CONST */
        return 'setProjectReport';
    }
    setData(projectStageData,perm){
        /* TO DO => PARSE RESPONSE STATUS */
        //console.log(projectStageData);
        Report.stageData=projectStageData['data']['value']['data'];
        Report.projectId=projectStageData['data']['value']['id'];
        Report.perm=perm;
        //console.log(Report.perm);
        /* TO DO +. DYNAMIC CHANGE */
        //Report.formName=projectStageData['data']['function'];
    }
    showPreview(f){
        console.log('Report::createPreview(f)');
        /*
         * PREVIEW DIV
         * f => files
         */
        console.log(Report.link.stage.childNodes[1]);
        console.log(Report.actStage);
        for(const prop in Report.actStage){
                Report.link.stage.childNodes[1].appendChild(Report.createDiv(Report.actStage[prop].t,'col-12'));
                for(const prop2 in Report.actStage[prop].v){
                    /*
                     * CHECK FILE POSITION
                     */
                    switch (Report.actStage[prop].v[prop2].fp) {
                        case 'top':
                            console.log('top');
                            Report.setupPreviewImage(f,Report.actStage[prop].v[prop2].ins,Report.link.stage.childNodes[1],'col-12 text-center');
                            Report.link.stage.childNodes[1].appendChild(Report.createDiv(Report.actStage[prop].v[prop2].v,'col-12'));
                            break;
                        case 'bottom':
                            console.log('bottom');
                            Report.link.stage.childNodes[1].appendChild(Report.createDiv(Report.actStage[prop].v[prop2].v,'col-12'));
                            Report.setupPreviewImage(f,Report.actStage[prop].v[prop2].ins,Report.link.stage.childNodes[1],'col-12 text-center');
                            break;
                        case 'left':
                            console.log('left');
                            Report.setupPreviewImage(f,Report.actStage[prop].v[prop2].ins,Report.link.stage.childNodes[1],'col-6 text-center');
                           
                            Report.link.stage.childNodes[1].appendChild(Report.createDiv(Report.actStage[prop].v[prop2].v,'col-6'));
                            
                            break;
                        case 'right':
                            console.log('right');
                            Report.link.stage.childNodes[1].appendChild(Report.createDiv(Report.actStage[prop].v[prop2].v,'col-6'));
                            Report.setupPreviewImage(f,Report.actStage[prop].v[prop2].ins,Report.link.stage.childNodes[1],'col-6 text-center');
                           
                            break;
                        default:
                            console.log(`WRONG POSITION ${Report.actStage[prop].v[prop2].fp}`);
                      }
                }
        }
        console.log(Report.link.stage.childNodes[1]);     
    }
    static setupPreviewImage(f,ins,ele,colClass){
        console.log('Report::setupPreviewImage()');
        console.log(f);
        console.log(ins);
        if(!ins){
            console.log('FILE NOT INSERTED -> EXIT');
            return false;
        }
        console.log(f[ins]);
        if(f.hasOwnProperty(ins)){
            ele.appendChild(Report.addImg(f[ins],ins,colClass));
        }
        else{
            alert('[ERROR]');
        }
    }
    static addImg(imgSrc,imgKey,colClass){
        let img=document.createElement('img');
            img.setAttribute('class','img-fluid');
            img.setAttribute('src',imgSrc);
            img.setAttribute('alt',imgKey);
        let div=Report.createDiv('',colClass);
            div.appendChild(img);
            return div;
    }
    setDefaultData(){
        console.log('Report::setDefaultData()');
        console.log(Report.actStage);
        for(const prop in Report.actStage){
            delete Report.actStage[prop];
        };
        Report.fieldCounter=0;
    }
    create(){
        console.log('Report::create()');
        this.setDefaultData();
        prepareModal('Raport:','bg-primary');
        this.setModal(document.getElementById('AdaptedModal'));
        this.createLinks();
        this.setForm();
        this.createButtons();
        console.log(Report.modal.childNodes[1].childNodes[1].childNodes[3].childNodes[5].childNodes[1].childNodes[1]);

    var rowDiv=createTag('','div','row');/* ALL */
        rowDiv.setAttribute('id','staticData');
    var rowDivResult=createTag('','div','row');/* ALL */
        rowDivResult.setAttribute('id','dynamicData');
    var optionDiv=createTag('','div','col-md-6');
    var rowLabel=createTag('','div','row pl-1 pr-1');
    var rowData=createTag('','div','row pl-1 pr-1');
    var optionLabel=createTag('Dostępne etapy projektu:','h5','text-info');
        rowLabel.appendChild(optionLabel);

        optionDiv.appendChild(rowLabel);
     
        this.createAvaliableStage(rowData);
        optionDiv.appendChild(rowData);
        
    var dataDiv=createTag('','div','col-md-6');
    var dataDivRowLabel=createTag('','div','row pl-1 pr-1');//align-content-right
    var dataDivRow=createTag('','div','row pl-1 pr-1');
    var dataLabel=createTag('Aktualny raport:','h5','text-center text-info'); 
        dataDivRowLabel.appendChild(dataLabel);
        dataDiv.appendChild(dataDivRowLabel);
        dataDiv.appendChild(dataDivRow);
        
        rowDiv.appendChild(optionDiv);
        
        rowDiv.appendChild(dataDiv);
        
        Report.link.form.childNodes[1].appendChild(rowDiv);
        Report.link.form.childNodes[1].appendChild(rowDivResult);
        /* ADD STAGE SHORTCUT */
        Report.link.stage=Report.modal.childNodes[1].childNodes[1].childNodes[3].childNodes[3].childNodes[1].childNodes[0];
        console.log(rowDiv);
    }
    createLinks(){
        Report.link.dynamicData=Report.modal.childNodes[1].childNodes[1].childNodes[3].childNodes[3].childNodes[1];
        Report.link.buttons=Report.modal.childNodes[1].childNodes[1].childNodes[3].childNodes[5].childNodes[1].childNodes[1];
       
    }
    createButtons(){
        Report.link.buttons.appendChild(Report.btnCancelReport());
        Report.link.buttons.appendChild(Report.btnShowReport());
        Report.link.buttons.appendChild(Report.btnExportToDoc());
        Report.link.buttons.appendChild(Report.btnConfirmReport());
    }
    setModal(modal){
        console.log('Report::setModal()');
        Report.modal=modal;
        //console.log(this.modal);
    }
    setForm(){
        console.log('Report::setForm()');
        //console.log(Report.modal.childNodes[1].childNodes[1].childNodes[3].childNodes[3]);
        Report.link.dynamicData.appendChild(createForm('POST',Report.getFormName(),'form-horizontal','OFF'));
        Report.link.dynamicData.childNodes[0].appendChild(createInput('hidden','id',Report.projectId,'form-control','','n'));
        Report.link.dynamicData.childNodes[0].appendChild(createTag('','div','')); 
        Report.link.form=Report.modal.childNodes[1].childNodes[1].childNodes[3].childNodes[3].childNodes[1].childNodes[0];
        console.log(  Report.link.form);
        //console.log(Report.modal.childNodes[1].childNodes[1].childNodes[3].childNodes[3].childNodes[1].childNodes[0]);
        
    }
    createAvaliableStage(ele){
        for(const prop in Report.stageData){
            var divRowStage=createTag('','div','col-12 border border-info mt-1 mb-1 rounded');
            this.createStageHead(divRowStage,prop);
            for(const propBody in Report.stageData[prop]['v']){
                this.createStageBody(divRowStage,prop,propBody);
            }
            this.createStageFooter(divRowStage,prop);
            ele.appendChild(divRowStage);
        }
    }
    createStageHead(ele,prop){
        //console.log('Report::createStageHead()');
        var divRow=createTag('','div','row'); 
        var divRowHeadN=createTag('','div','col-1 bg-info text-white border-bottom border-info text-center pt-3');  
        var divRowHeadT=createTag('','div','col-10 border-bottom border-info pt-3'); 
        var divRowHeadA=createTag('','div','col-1 border-bottom border-info pl-1'); 
        var number=createTag(Report.stageData[prop]['n'],'span',''); 
        //var pMain=createTag('','p','');    
            divRowHeadN.appendChild(number);
            divRowHeadT.innerHTML=Report.stageData[prop]['t'];
            divRowHeadA.appendChild(this.addBtn(Report.stageData[prop]['i']));
            //divRowHead.appendChild(pMain);
        divRow.appendChild(divRowHeadN);
        divRow.appendChild(divRowHeadT);
        divRow.appendChild(divRowHeadA);
        ele.appendChild(divRow);
    }
    createStageBody(ele,prop,propBody){
        //console.log('Report::createStageBody()');
        var divRowBody=createTag('','div','row');
        //var pMain=createTag('','p','');    
            divRowBody.innerHTML=Report.stageData[prop]['v'][propBody]['v'];
            //divRowBody.appendChild(pMain);
            ele.appendChild(divRowBody);
    }
    createStageFooter(ele,prop){
        //console.log('Report::createStageFooter()');
        var div=createTag('','div','row border-top border-info text-secondary');     
            div.innerHTML='<small>Stage ID: '+Report.stageData[prop]['i']+', Create user: '+Report.stageData[prop]['cu']+'</small>';
        ele.appendChild(div);
    }

    addStage(){
        
    }
    static addStageData(ele,idp){
        Report.getStageData(idp);
        //console.log(ele);
       
        ele.appendChild(Report.editedStageField());
    }
    static getStageData(idp){
        console.log('Report::getStageData('+idp+')');
        //console.log(Report.stageData);
         /* GET NUMBER, TITLE, VALUE */
        for(const prop in Report.stageData){
            if(parseInt(Report.stageData[prop]['i'],10)===parseInt(idp,10)){
                //console.log('FOUND');
                Report.setActStageData(idp,Report.stageData[prop]['n'],Report.stageData[prop]['t'],Report.stageData[prop]['v']);
                return true;
            }
        }
        /* SET DEFAULT */
        
        var emptyArr=new Array();
        //Report.setActStageData(0,0,'ERROR - ELEMENT NOT FOUND',emptyArr);
        return true;
    }
    static setActStageData(i,n,t,v){
        Report.actStage[Report.fieldCounter]={
            'i':i,
            'n':n,
            't':t,
            'v':v
        };
        console.log(Report.actStage);
        /*Report.actStage={
            'i':i,
            'n':n,
            't':t,
            'v':v
        };
        */
    }
    static editedStageField(){

        var counter=0;
        
        var divInput=createTag('','div','col-12');
            divInput.setAttribute('id','div-'+Report.fieldCounter);
        var divInputRow=createTag('','div','row border border-primary rounded mt-1 mb-1 pt-2 pb-2');  
            divInputRow.setAttribute('id','divAll-'+Report.fieldCounter);
        var div0=createTag('','div','col-1 pr-0 pl-2');  
            div0.setAttribute('id','divMV-'+Report.fieldCounter);
        var div1=createTag('','div','col-2  pl-1 pr-1');    
            div1.setAttribute('id','divNumber-'+Report.fieldCounter);
        var div2=createTag('','div','col-8  pl-0 pr-1');
            div2.setAttribute('id','divTitle-'+Report.fieldCounter);
        var div3=createTag('','div','col-1 pl-0');
            div3.setAttribute('id','divRM-'+Report.fieldCounter);
            div0.appendChild(Report.mvBtn());
            div1.appendChild(createInput('number',Report.fieldCounter+'-n',Report.actStage[Report.fieldCounter].n,'form-control ','','n'));
            div2.appendChild(createInput('text',Report.fieldCounter+'-t',Report.actStage[Report.fieldCounter].t,'form-control ','','n'));
            div3.appendChild(Report.rmBtn(divInput));
            
        divInputRow.appendChild(div0);
        divInputRow.appendChild(div1);
        divInputRow.appendChild(div2);
        divInputRow.appendChild(div3);
        divInput.appendChild(divInputRow);
        for(const prop in Report.actStage[Report.fieldCounter].v){
            var textarea=createTag(Report.actStage[Report.fieldCounter].v[prop]['v'],'textarea','form-control w-100 mt-2 ml-2 mr-2'); //form-control    
            //var textarea=createTag('','div',' w-100'); //form-control
            textarea.setAttribute('name',Report.fieldCounter+'-'+counter+'-value');
            textarea.setAttribute('id',Report.fieldCounter+'-'+counter+'-data-stage-value');
            textarea.setAttribute('style','height:200px; ');//
            textarea.setAttribute('contenteditable','true');
            divInputRow.appendChild(textarea);
            var divFile=createTag('','div','col-12');
                divFile.setAttribute('id','divFile-'+Report.fieldCounter);
            var divFormFile0=createTag('','div','form-check form-check-inline mt-1 mb-1');
            var inputFile=createInput('file',Report.fieldCounter+'-'+counter+'-fileData','','form-control-file','','n');
            
        
            divFormFile0.appendChild(inputFile);
                    
            //divFile.appendChild(divFormFile);
            divFile.appendChild(divFormFile0);
            divFile.appendChild(Report.createFilePositionElement(Report.fieldCounter,counter,Report.actStage[Report.fieldCounter].v[prop]['fp']));
            divInputRow.appendChild(divFile);
            counter++;
        }
        Report.fieldCounter++;
        
        //console.log(divInput);
        return divInput;
    }
    static createFilePositionElement(counter,fileCounter,defFilePosition){
        //console.log('Report::createFilePositionElement('+fileCounter+')');
        //var fpCounter=0;
        
        var divFormFile1=createTag('','div','form-check form-check-inline mt-1 mb-1');
        var inputFileLabel=createTag('Wskazana pozycja obrazu:','label','form-check-label mr-3');
            inputFileLabel.setAttribute('for',counter+'-'+fileCounter+'-file');
            divFormFile1.appendChild(inputFileLabel);
        var filePositionData={
            top:'Góra',
            bottom:'Dół',
            left:'Lewo',
            right:'Prawo'
            };
        for (const property in filePositionData){   
            
            divFormFile1.appendChild(Report.createFilePosition(property,filePositionData[property],defFilePosition,fileCounter));
            //fpCounter++;
        }
        return (divFormFile1);
       
    }
    static rmBtn(ele){
    var i=createTag('','i','fa fa-minus');
        i.setAttribute('aria-hidden','true');
        i.setAttribute('style','color:#ffffff;');
    var div=createTag('','div','btn btn-danger');
        div.onclick=function(){
            console.log(this.parentNode.id);
            let tmp=this.parentNode.id.split('-');
                tmp[1]=parseInt(tmp[1],10);
                ele.remove();
                console.log(tmp);
                console.log(Report.actStage);
            if(Report.actStage[tmp[1]]){
                console.log('OBJECT PROP EXIST');
                delete Report.actStage[tmp[1]];
            }
            /* remove data from actStage */
        };
        div.appendChild(i);
        return(div); 
    }
    static mvBtn(){
    var i=createTag('','i','fa fa-long-arrow-up text-dark text-center ml-2 ml-1 ');
        i.setAttribute('aria-hidden','true');
        Report.changeArrow(i);
        Report.mvUp(i);
    var i1=createTag('','i','fa fa-long-arrow-down text-dark text-center ml-1 mr-1 ');
        i1.setAttribute('aria-hidden','true');
        Report.changeArrow(i1);
        Report.mvDown(i1);
    var div=createTag('','div',' mt-2');
        
        div.appendChild(i);
        div.appendChild(i1);
        return(div); 
    }
    addBtn(idp){
        var btn=createTag('','button','btn  btn-success mt-2 mb-2');
            btn.setAttribute('type','button');
            btn.setAttribute('id',idp);
            btn.onclick = function(){    
                //console.log(this);
                //console.log(this.parentNode.parentNode.parentNode.parentNode.children[1]);
                Report.addStageData(this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.childNodes[0].childNodes[1].childNodes[1],this.id);
            }; 
        var text=document.createTextNode(' ');
        var arrow=createTag('','i','fa fa-caret-right');
            btn.appendChild(text);
           btn.appendChild(arrow);
            return (btn);
    }
    static changeArrow(ele){
        ele.onmouseover = function (){
            this.classList.remove("text-dark");
            this.classList.add("text-info");
            this.style.cursor='pointer';
            //console.log(this);
        };
        ele.onmouseleave = function (){
            this.classList.remove("text-info");
            this.classList.add("text-dark");
            this.style.cursor='auto';
        };
    }
    static mvUp(ele){
        
        ele.onclick=function()
        {
            //console.log(this.parentNode.parentNode.parentNode.parentNode);
            if(this.parentNode.parentNode.parentNode.parentNode.previousSibling!==null)
            {
                console.log('previousSibling exist');
                console.log(this.parentNode.parentNode.parentNode.parentNode.previousSibling);
                this.parentNode.parentNode.parentNode.parentNode.parentNode.insertBefore(this.parentNode.parentNode.parentNode.parentNode,this.parentNode.parentNode.parentNode.parentNode.previousSibling);
            }
            else{
                console.log('previousSibling NOT exist');
            }
           
        };
    }
    static mvDown(ele){
        ele.onclick=function()
        {
            if(this.parentNode.parentNode.parentNode.parentNode.nextSibling!==null)
            {
                console.log('nextSibling exist');
                this.parentNode.parentNode.parentNode.parentNode.parentNode.insertBefore(this.parentNode.parentNode.parentNode.parentNode.nextSibling,this.parentNode.parentNode.parentNode.parentNode);
            }
            else{
                console.log('nextSibling NOT exist');
            }
           
        };
    }
    static createFilePosition(property,value,checked,fileCounter)
    {
        //console.log(property);
        //console.log(fpCounter);
        
        var divFormFile=createTag('','div','form-check form-check-inline mt-1 mb-1');
        var inputRadioFileTop=createInput('radio',Report.fieldCounter+'-'+fileCounter+'-fileposition',property,'form-check-input','','n');
            inputRadioFileTop.setAttribute('id',Report.fieldCounter+'-'+fileCounter+'-fileposition-'+property);
            inputRadioFileTop.onclick=function(){ 
                let id=this.id.split('-');
                console.log(id);
                /*
                 * 0 -> overall id
                 * 1 -> value id
                 * 2 -> field name
                 * 3 -> position value
                 * 
                 */
                //this.setAttribute('checked','checked');
                console.log(this.parentNode);
                console.log(this);
                console.log(Report.actStage);
                console.log(Report.actStage[id[0]].v[id[1]].fp);
                /*
                 * UPDATE
                 */
                Report.actStage[id[0]].v[id[1]].fp=id[3];
            };
        if(checked===property)
        {
            inputRadioFileTop.setAttribute('checked','checked');
        }
        
        var inputRadioFileTopLabel=createTag(value,'label','form-check-label');
        inputRadioFileTopLabel.setAttribute('for',Report.fieldCounter+'-'+fileCounter+'-fileposition-'+property);
        divFormFile.appendChild(inputRadioFileTop);
        divFormFile.appendChild(inputRadioFileTopLabel);
        
        return divFormFile;
    }
    static btnShowReport(){
        console.log('Report::showRaport()');   
        var btn=createBtn('Podgląd','btn btn-info','psShowStage');
            btn.onclick= function() {
                if(Report.link.stage.childNodes[0].classList.contains("d-none")){
                    Report.link.stage.childNodes[0].classList.remove("d-none");
                    Report.link.stage.childNodes[0].classList.add("block");
                    Report.link.stage.childNodes[1].classList.remove("block");
                    Report.link.stage.childNodes[1].classList.add("d-none");
                    this.innerText='Podgląd';
                }
                else{
                    //Report.formName=Report.formName+'Image';
                    Report.link.form.name=Report.getFormName()+'Image'
                    console.log(Report.link.form.name);
                    postData(this,Report.link.form);
                    
                    Report.showReportDetails();
                    Report.link.stage.childNodes[0].classList.add("d-none");
                    Report.link.stage.childNodes[0].classList.remove("block");
                    Report.link.stage.childNodes[1].classList.add("block");
                    Report.link.stage.childNodes[1].classList.remove("d-none");
                    this.innerText='Edytuj';
                }
                //console.log(Report.link.stage);     
        };     
        return btn;
    }
    static btnConfirmReport(){
        console.log('Report::showRaport()');   
        var btn=createBtn('Zatwierdź','btn btn-success','confirmData');
        /* CHECK PERMISSIONS */
        if(Report.perm.includes('GEN_PROJECT_REPORT')){
            /* POST DATA */
            btn.onclick= function() {
                //postData(this,Report.formName);
                Report.link.form.name=Report.getFormName();
                console.log(Report.link.form.name);
                postData(this,Report.link.form);
            };
        }
        else{
            btn.classList.add("disabled");
        }
        return btn;
    }
     static btnExportToDoc(){
        console.log('Report::showRaport()');   
        var btn=createBtn('DOC','btn btn-primary','btnExportToDoc');
        /* CHECK PERMISSIONS */
        if(Report.perm.includes('GEN_PROJ_REP_DOC')){
            /* POST DATA */
            btn.onclick= function() {
                console.log(this);
                console.log(Report.getFormName());
                Report.link.form.name=Report.getFormName()+'Doc';
                postData(this,Report.link.form);
                //var win = window.open('test', '_blank');
                //    win.focus();
            };
        }
        else{
            btn.classList.add("disabled");
        }
        return btn;
    }
    static btnCancelReport(){
        /* REMOVE TMP FILES */
        return functionBtn('cancel',createBtn('Anuluj','btn btn-dark','cancelBtn'),'');
    }
    static showReportDetails(){
        console.log('Report::showReportDetails()');  
        
        var mainLink=Report.link.stage.childNodes[0].childNodes[1].childNodes[1];
        var subLink=new Object();
        var fieldName=new Array();
        //var fileInputid=null;
        var textAreaInputid=null;
        removeHtmlChilds(Report.link.stage.childNodes[1]);
        //console.log(Report.link.stage.childNodes[0].childNodes[1].childNodes[1]);
        //console.log(Report.link.stage.childNodes[0].childNodes[1].childNodes[1].childElementCount);
        for (var i=0;i<mainLink.childElementCount;i++){
            //console.log(mainLink.childNodes[i]);
            subLink=mainLink.childNodes[i].childNodes[0];
            for(var j=0;j<subLink.childElementCount;j++){
                //console.log(subLink.childNodes[j]);
                //console.log(subLink.childNodes[j].nodeName);
                //console.log(subLink.childNodes[j].id);
                //console.log(subLink.childNodes[j].hasOwnProperty('id'));
                
                if(subLink.childNodes[j].nodeName==='DIV'){
                    //console.log('DIV EXIST');
                    /* PARSE ID */
                    fieldName=subLink.childNodes[j].id.split("-");
                    switch (fieldName[0]) {
                        case 'divNumber':
                            //console.log('divNumber');
                            //console.log(subLink.childNodes[j].childNodes[0].id);
                            //console.log(subLink.childNodes[j].childNodes[0].value);
                            Report.updActStageData(subLink.childNodes[j].childNodes[0].id,subLink.childNodes[j].childNodes[0].value);
                            break;
                        case 'divTitle':
                            //console.log('divTitle');
                            //console.log();
                            //console.log();
                            //Report.link.stage.childNodes[1].appendChild(Report.createDiv(subLink.childNodes[j].childNodes[0].value));
                            Report.updActStageData(subLink.childNodes[j].childNodes[0].id,subLink.childNodes[j].childNodes[0].value);
                            break;
                        case 'divFile':
                          //console.log('divFile');
                          //fileInputid=subLink.childNodes[j].childNodes[0].childNodes[0].id;
                          Report.updActStageFile(subLink.childNodes[j].childNodes[0].childNodes[0]);
                          //console.log(subLink.childNodes[j].childNodes[0].childNodes[0].id);
                         
                          /* console.log(subLink.childNodes[j].childNodes[2]); file position*/
                          break;
                        default:
                            //console.log('REST:');
                            //console.log(fieldName);
                    }
                }
                else if(subLink.childNodes[j].nodeName==='TEXTAREA'){
                    textAreaInputid=subLink.childNodes[j].id;
                    Report.updActStageTextArea(subLink.childNodes[j].id,subLink.childNodes[j].value);
                }
                else{
                    //console.log('WRONG FIELD');
                }
                //Report.setNewDataFromInput();
                //Report.setImageTextPosition(subLink,i,j,textAreaInputid,fileInputid);
                textAreaInputid=null;
                //fileInputid=null;
            }
        }
    }
    static checkFile(file,id){
        //console.log('Report::checkFile(file,id)');
         /*
            * CHECK SIZE
            * CHECK TYPE
        */
        //console.log(id);
        if(!file){
            //console.log('FILE NOT PRESENT');
            Report.actStage[id[0]].v[id[1]]['ins']=false;
        }
        else{
            //console.log(file);
            Report.actStage[id[0]].v[id[1]]['ins']=id[0]+'-'+id[1]+'-'+id[2];
        }
        //console.log(Report.actStage[id[0]].v[id[1]]);
    }
    static updActStageTextArea(id,value){
        //console.log('Report::setNewDataFromInput(id,value)');
        //console.log(id);
        //console.log(value);
        var inputId=id.split('-');
            //console.log(inputId);
            //console.log(Report.actStage[inputId[0]].v[inputId[1]].v);
            Report.actStage[inputId[0]].v[inputId[1]].v=value;
        //Report.actStage[inputId[0]].v[inputId[1]]
    }
    static updActStageData(id,value){
        console.log('Report::setActStageTitle(id,value)');
        /*
         * TITLE/NUMBER
         */
        //console.log(id);
        var inputId=id.split('-');
        Report.actStage[inputId[0]][inputId[1]]=value;
        //console.log(Report.actStage);
    }
    static updActStageFile(ele){
        //console.log('Report::setActStageFile(id,value)');
        //console.log(ele);
        //console.log(ele.id);
        var inputId=ele.id.split('-');
            //console.log(inputId);
        Report.checkFile(ele.files[0],inputId);
         
        //
        //console.log(value);
       // 
           // console.log(inputId);
           // console.log(Report.actStage[inputId[0]].v[inputId[1]].v);
            //Report.actStage[inputId[0]].v[inputId[1]].v=value;
        //Report.actStage[inputId[0]].v[inputId[1]]
    }
    static setImageTextPosition(subLink,i,j,textAreaId,fileExist){
        console.log(subLink);
        console.log(Report.actStage);
        /* ELEMENT ID */
        var id=subLink.id.split('-');
        var inputId=new Array();
            console.log(id);
            console.log(textAreaId);
            //console.log(fileInputid);
        if(textAreaId){
            console.log('textAreaId: '+textAreaId);
            inputId=textAreaId.split('-');
            console.log(Report.actStage[inputId[0]].v[inputId[1]]);
            //Report.link.stage.childNodes[1].appendChild(Report.createDiv(subLink.childNodes[j].childNodes[0].wholeText));
        }
        if(fileExist){
            //console.log('file:'+fileExist);
            //inputId=textAreaId.split('-')
            //console.log(Report.actStage[inputId[0]].v[inputId[1]]);
           
            //console.log(subLink.childNodes[j].childNodes);
        }
        
    }
    static createDiv(value,c){
        var div=document.createElement('div');
            div.setAttribute('class',c);
            div.innerHTML=value;
        return div;
    }
}