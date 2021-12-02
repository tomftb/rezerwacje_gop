/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
class ProjectReport
{
    static modal=new Object();
    static stageData=new Array();
    stageActData=new Array();
    static projectId='';
    static fieldCounter=0;
    static perm=new Array();
    static defaultFilePostion='top';
    static imgUrl='http://rezerwacje-gop.local:8080/router.php?task=downloadProjectReportImage&file=';
    static link={
        dynamicData:new Object(),
        adaptedDynamicData:new Object(),
        buttons:new Object(),
        final:new Object(),
        overAllErr:new Object(),
        info:new Object(),
        extra:new Object(),
        allProjectReportData:new Object(),
        previewProjectReportData:new Object(),
        form:new Object()
    }
    static fileProp={
        max:20971520, /* 20 MB 1024 * 1024 * 20 */
        type:[
            'image/jpeg','image/bmp','image/png','image/gif','image/jpg'
        ]
    };
    static actStage=new Object();
    static confirmBtn;
    static ErrorStack=new Object();
    static Ajax=new Object();
    
    constructor() {
        console.log('ProjectReport::constructor()');
       
    }
    setErrorStack(obj){
        console.log('ProjectReport::setErrorStack(obj)');
        ProjectReport.ErrorStack=obj;
        console.log(ProjectReport.ErrorStack);
    }
    setAjax(obj){
        console.log('ProjectReport::setAjax(obj)');
        ProjectReport.Ajax=obj;
        console.log(ProjectReport.Ajax);
    }
    static getFormName(){
        /* SIMILAR TO CONST */
        return 'setProjectReport';
    }
    setData(projectStageData,perm){
        /* TO DO => PARSE RESPONSE STATUS */
        //console.log(projectStageData);
        this.stageActData=projectStageData['data']['value']['act'];
        ProjectReport.stageData=projectStageData['data']['value']['data'];
        ProjectReport.projectId=projectStageData['data']['value']['id'];
        ProjectReport.perm=perm;
        //console.log(ProjectReport.perm);
        /* TO DO +. DYNAMIC CHANGE */
        //ProjectReport.formName=projectStageData['data']['function'];
    }
    static showProjectReportPreview(){
        console.log('ProjectReport::showProjectReportPreview()');
        /*
         * PREVIEW DIV
         * f => files
         */
        console.log(ProjectReport.link.dynamicData);
        console.log(ProjectReport.actStage);
        /* SET DATA */
        ProjectReport.setProjectReportPreviewData();
        
        
        /* CREATE AVAILABLE STAGE DATA */
        for(const prop in ProjectReport.actStage){
                ProjectReport.link.previewProjectReportData.appendChild(ProjectReport.createDiv(ProjectReport.actStage[prop].t,'col-12'));
                for(const prop2 in ProjectReport.actStage[prop].v){
                    /*
                     * CHECK FILE POSITION
                     */
                    switch (ProjectReport.actStage[prop].v[prop2].fp) {
                        case 'top':
                            console.log('top');
                            ProjectReport.setupPreviewImage(ProjectReport.actStage[prop].v[prop2],ProjectReport.link.previewProjectReportData,'col-12 text-center');
                            ProjectReport.link.previewProjectReportData.appendChild(ProjectReport.createDiv(ProjectReport.actStage[prop].v[prop2].v,'col-12'));
                            break;
                        case 'bottom':
                            console.log('bottom');
                            ProjectReport.link.previewProjectReportData.appendChild(ProjectReport.createDiv(ProjectReport.actStage[prop].v[prop2].v,'col-12'));
                            ProjectReport.setupPreviewImage(ProjectReport.actStage[prop].v[prop2],ProjectReport.link.previewProjectReportData,'col-12 text-center');
                            break;
                        case 'left':
                            console.log('left');
                            ProjectReport.setupPreviewImage(ProjectReport.actStage[prop].v[prop2],ProjectReport.link.previewProjectReportData,'col-6 text-center');
                            ProjectReport.link.previewProjectReportData.appendChild(ProjectReport.createDiv(ProjectReport.actStage[prop].v[prop2].v,'col-6'));
                            break;
                        case 'right':
                            console.log('right');
                            ProjectReport.link.previewProjectReportData.appendChild(ProjectReport.createDiv(ProjectReport.actStage[prop].v[prop2].v,'col-6'));
                            ProjectReport.setupPreviewImage(ProjectReport.actStage[prop].v[prop2],ProjectReport.link.previewProjectReportData,'col-6 text-center');              
                            break;
                        default:
                            console.log(`WRONG POSITION ${ProjectReport.actStage[prop].v[prop2].fp}`);
                      }
                }
        } 
    }
    static setupPreviewImage(v,ele,colClass){
        console.log('ProjectReport::setupPreviewImage()');
        console.log(v);
         /*
         * FIRST CHECK NEW INSERTED FILE
         * SECOND CHECK ACTUALL FILE
         */
        if(v.f){
            console.log('FILE INSERTED');
            var eleImg=document.getElementById(v['f']).files[0];
            var src=URL.createObjectURL(eleImg);
            ele.appendChild(ProjectReport.addImg(src,eleImg.name,colClass));
            return true;
        }
        if(v.fa){
            console.log('FILE ACTUALL');
            ele.appendChild(ProjectReport.addImg(ProjectReport.imgUrl+v.fa,v.fo,colClass));  
            return true;
        }
    }
    static addImg(imgSrc,imgKey,colClass){
        let img=document.createElement('img');
            img.setAttribute('class','img-fluid');
            img.setAttribute('src',imgSrc);
            img.setAttribute('alt',imgKey);
        let div=ProjectReport.createDiv('',colClass);
            div.appendChild(img);
            return div;
    }
    setDefaultData(){
        console.log('ProjectReport::setDefaultData()');
        console.log(ProjectReport.actStage);
        for(const prop in ProjectReport.actStage){
            delete ProjectReport.actStage[prop];
        };
        ProjectReport.fieldCounter=0;
    }
    create(){
        console.log('ProjectReport::create()');
        this.setDefaultData();
        prepareModal('Raport:','bg-primary');
        this.setModal(document.getElementById('AdaptedModal'));
        this.createLinks();
        this.createButtons();   

    var rowDiv=document.createElement('div');/* ALL */
        rowDiv.setAttribute('class','row block');
        rowDiv.setAttribute('id','allProjectReportData');
    var rowDivResult=document.createElement('div');/* ALL */
        rowDivResult.setAttribute('class','row d-none');
        rowDivResult.setAttribute('id','previewProjectReportData');
    var optionDiv=document.createElement('div');
        optionDiv.setAttribute('class','col-md-6');
        optionDiv.setAttribute('id','staticData');
    var rowLabel=document.createElement('div');
        rowLabel.setAttribute('class','row pl-1 pr-1');
    var rowData=document.createElement('div');
        rowLabel.setAttribute('class','row pl-1 pr-1');
    var optionLabel=createTag('Dostępne etapy projektu:','h5','text-info');
        rowLabel.appendChild(optionLabel);
        optionDiv.appendChild(rowLabel);
        this.createAvaliableStage(rowData);
        optionDiv.appendChild(rowData);
        
    var dataDiv=document.createElement('div');
        dataDiv.setAttribute('class','col-md-6');
        dataDiv.setAttribute('id','dynamicData');
    var dataDivRowLabel=document.createElement('div');
        dataDivRowLabel.setAttribute('class','row pl-1 pr-1');
    var dataDivRow=document.createElement('div');
        dataDivRow.setAttribute('class','row pl-1 pr-1');
    var dataLabel=createTag('Aktualny raport:','h5','text-center text-info'); 
        dataDivRowLabel.appendChild(dataLabel);
        dataDiv.appendChild(dataDivRowLabel);
        dataDiv.appendChild(this.setForm());
        
        dataDiv.childNodes[1].appendChild(dataDivRow);
        
        rowDiv.appendChild(optionDiv);
        rowDiv.appendChild(dataDiv); 
        ProjectReport.link.adaptedDynamicData.appendChild(rowDiv);
        ProjectReport.link.adaptedDynamicData.appendChild(rowDivResult);
        ProjectReport.link.allProjectReportData=ProjectReport.link.adaptedDynamicData.childNodes[0];
        ProjectReport.link.previewProjectReportData=ProjectReport.link.adaptedDynamicData.childNodes[1];
        console.log(ProjectReport.link.adaptedDynamicData);
        /* ADD FORM TO DIV RESULT */
        /* APPEND CURRENT STAGE DATA */
        ProjectReport.link.form=ProjectReport.link.adaptedDynamicData.childNodes[0].childNodes[1].childNodes[1];
         /* ADD DYNAMIC STAGE SHORTCUT */
        ProjectReport.link.dynamicData=ProjectReport.link.adaptedDynamicData.childNodes[0].childNodes[1].childNodes[1].childNodes[1];
        this.addCurrentStageData();
       
        
        console.log(rowDiv);
        ProjectReport.ErrorStack.setBlock(ProjectReport.confirmBtn);
        //ErrorStack.setBlock(ProjectReport.stackName,ProjectReport.confirmBtn);
    }
    createLinks(){
        console.log('ProjectReport::createLinks()');
        console.log(ProjectReport.modal);
        console.log(ProjectReport.modal.childNodes[0].childNodes[0].childNodes[1].childNodes[1].childNodes[0]); 
        ProjectReport.link.adaptedDynamicData=ProjectReport.modal.childNodes[0].childNodes[0].childNodes[1].childNodes[1].childNodes[0];
        ProjectReport.link.buttons=ProjectReport.modal.childNodes[0].childNodes[0].childNodes[1].childNodes[2].childNodes[0].childNodes[0];
        ProjectReport.link.extra=ProjectReport.modal.childNodes[0].childNodes[0].childNodes[1].childNodes[4];
        ProjectReport.link.overAllErr=ProjectReport.modal.childNodes[0].childNodes[0].childNodes[1].childNodes[3];
        ProjectReport.link.info=ProjectReport.modal.childNodes[0].childNodes[0].childNodes[2].childNodes[0];
    }
    createButtons(){
        ProjectReport.link.buttons.appendChild(ProjectReport.btnCancelProjectReport());
        ProjectReport.link.buttons.appendChild(ProjectReport.btnShowProjectReport());
        ProjectReport.link.buttons.appendChild(ProjectReport.btnExportToDoc());
        ProjectReport.link.buttons.appendChild(ProjectReport.btnConfirmProjectReport());
    }
    setModal(modal){
        console.log('ProjectReport::setModal()');
        ProjectReport.modal=modal;
    }
    setForm(){
        console.log('ProjectReport::setForm()');
        var form = createForm('POST',ProjectReport.getFormName(),'form-horizontal','OFF');  
        form.appendChild(createInput('hidden','id',ProjectReport.projectId,'form-control','','n'));
        return form;
    }
    createAvaliableStage(ele){
        for(const prop in ProjectReport.stageData){
            var divRowStage=createTag('','div','col-12 border border-info mt-1 mb-1 rounded');
            this.createStageHead(divRowStage,prop);
            for(const propBody in ProjectReport.stageData[prop]['v']){
                this.createStageBody(divRowStage,prop,propBody);
            }
            this.createStageFooter(divRowStage,prop);
            ele.appendChild(divRowStage);
        }
    }
    createStageHead(ele,prop){
        //console.log('ProjectReport::createStageHead()');
        var divRow=createTag('','div','row'); 
        var divRowHeadN=createTag('','div','col-1 bg-info text-white border-bottom border-info text-center pt-3');  
        var divRowHeadT=createTag('','div','col-10 border-bottom border-info pt-3'); 
        var divRowHeadA=createTag('','div','col-1 border-bottom border-info pl-1'); 
        var number=createTag(ProjectReport.stageData[prop]['n'],'span',''); 
        //var pMain=createTag('','p','');    
            divRowHeadN.appendChild(number);
            divRowHeadT.innerHTML=ProjectReport.stageData[prop]['t'];
            divRowHeadA.appendChild(this.addBtn(ProjectReport.stageData[prop]['i']));
            //divRowHead.appendChild(pMain);
        divRow.appendChild(divRowHeadN);
        divRow.appendChild(divRowHeadT);
        divRow.appendChild(divRowHeadA);
        ele.appendChild(divRow);
    }
    createStageBody(ele,prop,propBody){
        //console.log('ProjectReport::createStageBody()');
        var divRowBody=createTag('','div','row');
        //var pMain=createTag('','p','');    
            divRowBody.innerHTML=ProjectReport.stageData[prop]['v'][propBody]['v'];
            //divRowBody.appendChild(pMain);
            ele.appendChild(divRowBody);
    }
    createStageFooter(ele,prop){
        //console.log('ProjectReport::createStageFooter()');
        var div=createTag('','div','row border-top border-info text-secondary');     
            div.innerHTML='<small>Stage ID: '+ProjectReport.stageData[prop]['i']+', Create user: '+ProjectReport.stageData[prop]['cu']+'</small>';
        ele.appendChild(div);
    }

    addCurrentStageData(){
        console.log('ProjectReport::addCurrentStageData()');
        console.log( ProjectReport.link.dynamicData);
        //console.log(this.stageActData);
        /* ADD FORM */
        
        for(const prop in this.stageActData ){
            /* SET DATA */
            ProjectReport.setActStageData(ProjectReport.fieldCounter,this.stageActData[prop]['n'],this.stageActData[prop]['t'],this.stageActData[prop]['data']);
            ProjectReport.link.dynamicData.appendChild(ProjectReport.editedStageField());
        }
    }
    static addStageData(idp){
        ProjectReport.getStageData(idp);
        //console.log(ele);
        ProjectReport.link.dynamicData.appendChild(ProjectReport.editedStageField());
    }
    static getStageData(idp){
        console.log('ProjectReport::getStageData('+idp+')');
        //console.log(ProjectReport.stageData);
         /* GET NUMBER, TITLE, VALUE */
        for(const prop in ProjectReport.stageData){
            if(parseInt(ProjectReport.stageData[prop]['i'],10)===parseInt(idp,10)){
                console.log(ProjectReport.stageData[prop]['v']);
                ProjectReport.setActStageData(idp,ProjectReport.stageData[prop]['n'],ProjectReport.stageData[prop]['t'],ProjectReport.stageData[prop]['v']);
                return true;
            }
        }
        /* SET DEFAULT */
        
        var emptyArr=new Array();
        //ProjectReport.setActStageData(0,0,'ERROR - ELEMENT NOT FOUND',emptyArr);
        return true;
    }
    static setActStageData(i,n,t,v){
        console.log('ProjectReport::setActStageData()');
        ProjectReport.actStage[ProjectReport.fieldCounter]={
            'i':i,
            'n':n,
            't':t,
            'v':v
        };
        //console.log(ProjectReport.actStage);
    }
    static editedStageField(){
        //console.log('ProjectReport::editedStageField()');
        //console.log(ProjectReport.actStage[ProjectReport.fieldCounter]);
        var counter=0;
        
        var divInput=createTag('','div','col-12');
            divInput.setAttribute('id','div-'+ProjectReport.fieldCounter);
            /* ADD DIV ROW FOR REMOVE BUTTON */
        var divInputRow=createTag('','div','row border border-primary rounded mt-1 mb-1 pt-2 pb-2');  
            divInputRow.setAttribute('id','divAll-'+ProjectReport.fieldCounter);
        var div0=createTag('','div','col-1 pr-0 pl-2');  
            div0.setAttribute('id','divMV-'+ProjectReport.fieldCounter);
        var div1=createTag('','div','col-2  pl-1 pr-1');    
            div1.setAttribute('id','divNumber-'+ProjectReport.fieldCounter);
        var div2=createTag('','div','col-8  pl-0 pr-1');
            div2.setAttribute('id','divTitle-'+ProjectReport.fieldCounter);
        var div3=createTag('','div','col-1 pl-0');
            div3.setAttribute('id','divRM-'+ProjectReport.fieldCounter);
            div0.appendChild(ProjectReport.mvBtn());
            div1.appendChild(createInput('number',ProjectReport.fieldCounter+'-n',ProjectReport.actStage[ProjectReport.fieldCounter].n,'form-control ','','n'));
            div2.appendChild(createInput('text',ProjectReport.fieldCounter+'-t',ProjectReport.actStage[ProjectReport.fieldCounter].t,'form-control ','','n'));
            div3.appendChild(ProjectReport.rmBtn(divInput));
            
        divInputRow.appendChild(div0);
        divInputRow.appendChild(div1);
        divInputRow.appendChild(div2);
        divInputRow.appendChild(div3);
        divInput.appendChild(divInputRow);
        for(const prop in ProjectReport.actStage[ProjectReport.fieldCounter].v){
            var textarea=document.createElement('textarea');
                textarea.setAttribute('class','form-control w-100 mt-2 ml-2 mr-2');
                textarea.setAttribute('name',ProjectReport.fieldCounter+'-'+counter+'-value');
                textarea.setAttribute('id',ProjectReport.fieldCounter+'-'+counter+'-data-stage-value');
                textarea.setAttribute('style','height:200px; ');//
                textarea.setAttribute('contenteditable','true');
                textarea.appendChild(document.createTextNode(ProjectReport.actStage[ProjectReport.fieldCounter].v[prop]['v']));
                divInputRow.appendChild(textarea);
                divInputRow.appendChild(ProjectReport.createFileInputDiv(prop,counter));
                counter++;
        }
        ProjectReport.fieldCounter++;
        
        //console.log(divInput);
        return divInput;
    }
    static createFileInputDiv(prop,counter){
        var divFile=document.createElement('div');
            divFile.setAttribute('class','col-12 pl-1 ');//border border-success
            divFile.setAttribute('id','divFile-'+ProjectReport.fieldCounter);
            ProjectReport.createNewFileDiv(divFile,prop,counter);
            
            ProjectReport.createActuallFileDiv(divFile,prop,counter);
        var defaultFilePosition=ProjectReport.actStage[ProjectReport.fieldCounter].v[prop]['fp'];
            /* IF NO FILE, THEN SETUP FILEPOSTION TO DEFAULT TOP */
            if(defaultFilePosition===null){
                defaultFilePosition='top';
            }
            divFile.appendChild(ProjectReport.createFilePositionElement(ProjectReport.fieldCounter,counter,defaultFilePosition));
        return divFile;
    }
    static createNewFileDiv(ele,prop,counter){
        var divRow=document.createElement('div');
            divRow.setAttribute('class','row ml-0 mr-0 mt-1 mb-1 ');//border border-info rounded
            divRow.setAttribute('id',ProjectReport.fieldCounter+'-'+counter+'-newFileDiv');
        var divRowErr=document.createElement('div');
            divRowErr.setAttribute('class','row ml-0 mr-0 mt-1 mb-1 alert alert-danger d-none');  
            divRowErr.setAttribute('id',ProjectReport.fieldCounter+'-'+counter+'-fileDataErr');  
        var divCol1=document.createElement('div');
            divCol1.setAttribute('class','col-sm-11 pl-0 pt-1  '); //border border-danger
        var divCol2=document.createElement('div');
            divCol2.setAttribute('class','col-sm-1 pl-0 pr-0 form-check '); //border border-primary
        var input=createInput('file',ProjectReport.fieldCounter+'-'+counter+'-fileData','','form-control-file','','n');
            input.onchange = function (e){
                console.log(e);
                console.log(this);
                ProjectReport.parseFile(this,e,divRowErr);
               
            };
            divCol1.appendChild(input);
        var i=createTag('','i','fa fa-minus');
            i.setAttribute('aria-hidden','true');
            i.setAttribute('style','color:#ffffff;');
        var button=document.createElement('button');
            button.setAttribute('class','btn btn-warning');
            button.onclick=function(){
                console.log(this.parentNode.parentNode.childNodes[1].childNodes[0]);
                 /*
                 * CLEAR input value
                 */
                this.parentNode.parentNode.childNodes[1].childNodes[0].value='';
                /*
                 * UPDATE ProjectReport.actStage
                 */
                ProjectReport.updActStageValue(this.parentNode.parentNode.childNodes[1].childNodes[0].id,'f',null);
                //console.log();
                /*
                 * HIDDE error
                 */
                //console.log(this.parentNode.parentNode.parentNode.childNodes[1]);
                ProjectReport.hiddeEle(this.parentNode.parentNode.parentNode.childNodes[1]);
            };
            button.appendChild(i);
            divCol2.appendChild(button);
            
            divRow.appendChild(divCol2);
            divRow.appendChild(divCol1);
            ele.appendChild(divRow);
            ele.appendChild(divRowErr);
    }
    static parseFile(t,e,divRowErr){
        var divErr=t.parentNode.parentNode.parentNode.childNodes[1];
        var errSize=document.createTextNode('');
        var errType=document.createTextNode('');
            
                console.log('INPUT FILE');
                console.log('MAX: '+ProjectReport.fileProp.max);
                console.log(e);
                console.log(e.srcElement.files[0].size);
                console.log(e.srcElement.files[0].type);
                console.log(e.srcElement.value);
                console.log(e.srcElement.size);
                //console.log(e.size);
                console.log(t);
                console.log(t.parentNode.parentNode.parentNode);
                console.log(t.parentNode.parentNode.parentNode.childNodes[1]);
                
                /* CLEAR DIV */
                removeHtmlChilds(divRowErr);
                
                if(e.srcElement.files[0].size>ProjectReport.fileProp.max){
                    errSize.nodeValue='File larger than 20MB! ';
                    ProjectReport.ErrorStack.add(t.id+'-size','File larger than 20MB! ');
                    //ErrorStack.add(ProjectReport.stackName,t.id+'-size','File larger than 20MB! ');
                }
                else{
                    errSize.nodeValue='';
                    ProjectReport.ErrorStack.remove(t.id+'-size');
                }
                console.log('ProjectReport',ProjectReport.fileProp.type);
                
                if(ProjectReport.fileProp.type.indexOf(e.srcElement.files[0].type)===-1){
                    errType.nodeValue='Wrong file extension ('+e.srcElement.files[0].type+') ! ';
                    ProjectReport.ErrorStack.add(t.id+"-ext",'Wrong file extension ('+e.srcElement.files[0].type+') ! ');
                }
                else{
                    errType.nodeValue='';
                    ProjectReport.ErrorStack.remove(t.id+'-ext');
                }
                if(errSize.nodeValue!=='' || errType.nodeValue!==''){
                    divErr.appendChild(errSize);
                    divErr.appendChild(errType);
                    ProjectReport.showEle(divErr);
                }
                else{
                    ProjectReport.updActStageValue(t.id,'f',t.id);//this.value
                    ProjectReport.hiddeEle(divErr);
                }
                console.log(ProjectReport.actStage);
                console.log(ProjectReport.confirmBtn);
    }
    static hiddeEle(ele){
        ele.classList.remove("d-block");
        ele.classList.add("d-none");
    }
    static showEle(ele){
        ele.classList.remove("d-none");
        ele.classList.add("d-block");
    }
    static createActuallFileDiv(ele,prop,counter){
        console.log('ProjectReport::createActuallFileDiv() FILE:');
        //console.log(ProjectReport.actStage[ProjectReport.fieldCounter].v[prop]['fa']);
        if(ProjectReport.actStage[ProjectReport.fieldCounter].v[prop]['fa']){
            var divRow=document.createElement('div');
                divRow.setAttribute('class','row ml-0 mt-1 mb-1 mr-0 border border-info rounded');//border border-danger
                divRow.setAttribute('id',ProjectReport.fieldCounter+'-'+prop+'-actFileDiv');
            var divCol1=document.createElement('div');
                divCol1.setAttribute('class','col-sm-10 '); //border border-info
            var divCol2=document.createElement('div');
                divCol2.setAttribute('class','col-sm-2 form-check '); //border border-primary
                    
                var box=document.createElement('input');
                    box.setAttribute('class','form-check-input');
                    box.setAttribute('type','checkbox');
                    /* box.setAttribute('checked','checked'); */
                    box.setAttribute('name',ProjectReport.fieldCounter+'-'+counter+'-actFileRemove');
                    box.setAttribute('id',ProjectReport.fieldCounter+'-'+counter+'-actFileRemove');
                var label=document.createElement('label');
                    label.setAttribute('class','form-check-label');
                    label.setAttribute('for',ProjectReport.fieldCounter+'-'+counter+'-actFile');
                    label.appendChild(document.createTextNode('Usunąć?'));
               
                    /* ADD DATA ABOUT INSERTED FILE */   
                var actFile=document.createElement('a');
                    actFile.setAttribute('href','router.php?task=downloadProjectReportImage&file='+ProjectReport.actStage[ProjectReport.fieldCounter].v[prop]['fa']);
                    actFile.setAttribute('target','_blank');
                    actFile.appendChild(document.createTextNode(ProjectReport.actStage[ProjectReport.fieldCounter].v[prop]['fo']));
                var actFileInput=document.createElement('input');
                    actFileInput.setAttribute('name',ProjectReport.fieldCounter+'-'+counter+'-actFile');
                    actFileInput.setAttribute('type','hidden');
                    actFileInput.setAttribute('value',ProjectReport.actStage[ProjectReport.fieldCounter].v[prop]['fa']);
                    divCol2.appendChild(box);
                    divCol2.appendChild(label);
                    divCol1.appendChild(actFile);
                    divCol1.appendChild(actFileInput);
                    divRow.appendChild(divCol1);
                    divRow.appendChild(divCol2);
                /* ADD REMOVE FILE BUTTON CHECKBOX */
                //console.log(divRow);
                ele.appendChild(divRow);
        }  
        else{
            /* SETUP DEFAULT */
            ProjectReport.actStage[ProjectReport.fieldCounter].v[prop]['fp']=ProjectReport.defaultFilePostion;
        }
    }
    static createFilePositionElement(counter,fileCounter,defFilePosition){
        //console.log('ProjectReport::createFilePositionElement('+fileCounter+')');
        //var fpCounter=0;
        var div=document.createElement('div');
            div.setAttribute('class','row ml-0 ');//border border-warning
            div.setAttribute('id',ProjectReport.fieldCounter+'-'+fileCounter+'-filepositionDiv');
        var divFormFile1=document.createElement('div');
            divFormFile1.setAttribute('div','form-check form-check-inline mt-1 mb-1');
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
            
            divFormFile1.appendChild(ProjectReport.createFilePosition(property,filePositionData[property],defFilePosition,fileCounter));
            //fpCounter++;
        }
        div.appendChild(divFormFile1);
        return (div);
       
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
                console.log(ProjectReport.actStage);
            if(ProjectReport.actStage[tmp[1]]){
                console.log('OBJECT PROP EXIST');
                delete ProjectReport.actStage[tmp[1]];
            }
            /* remove data from actStage */
        };
        div.appendChild(i);
        return(div); 
    }
    static mvBtn(){
    var i=createTag('','i','fa fa-long-arrow-up text-dark text-center ml-2 ml-1 ');
        i.setAttribute('aria-hidden','true');
        ProjectReport.changeArrow(i);
        ProjectReport.mvUp(i);
    var i1=createTag('','i','fa fa-long-arrow-down text-dark text-center ml-1 mr-1 ');
        i1.setAttribute('aria-hidden','true');
        ProjectReport.changeArrow(i1);
        ProjectReport.mvDown(i1);
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
                ProjectReport.addStageData(this.id);
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
        ele.onclick=function(){
            console.log(ProjectReport.actStage);
            console.log(this.parentNode.parentNode.parentNode.parentNode);
            console.log(this.parentNode.parentNode.parentNode.parentNode.id);
            //console.log(this.parentNode.parentNode.parentNode.parentNode);
            if(this.parentNode.parentNode.parentNode.parentNode.previousSibling!==null){
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
        ele.onclick=function(){
            if(this.parentNode.parentNode.parentNode.parentNode.nextSibling!==null){
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
        //console.log('ProjectReport::createFilePosition()');   
        //console.log(checked);
        //console.log(fpCounter);
        
        var div=document.createElement('div');
            div.setAttribute('class','form-check form-check-inline mt-1 mb-1');
            
        var inputRadioFileTop=createInput('radio',ProjectReport.fieldCounter+'-'+fileCounter+'-fileposition',property,'form-check-input','','n');
            inputRadioFileTop.setAttribute('id',ProjectReport.fieldCounter+'-'+fileCounter+'-fileposition-'+property);
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
                /*
                 * UPDATE
                 */
                ProjectReport.updActStageValue(this.id,'fp',id[3]);
            };
        if(checked===property){
            inputRadioFileTop.setAttribute('checked','checked');
        }
        
        var inputRadioFileTopLabel=createTag(value,'label','form-check-label');
        inputRadioFileTopLabel.setAttribute('for',ProjectReport.fieldCounter+'-'+fileCounter+'-fileposition-'+property);
        div.appendChild(inputRadioFileTop);
        div.appendChild(inputRadioFileTopLabel);
        /* SETUP DEFAULT */
        
        return div;
    }
    static btnShowProjectReport(){
        console.log('ProjectReport::btnShowProjectReport()');   
        
        var btn=createBtn('Podgląd','btn btn-info','psShowStage');
            btn.onclick= function() {
                console.log(ProjectReport.link.allProjectReportData);
                console.log(ProjectReport.link.previewProjectReportData);
                if(ProjectReport.link.previewProjectReportData.classList.contains("d-none")){
                    ProjectReport.link.previewProjectReportData.classList.remove("d-none");
                    ProjectReport.link.previewProjectReportData.classList.add("block");
                    ProjectReport.link.allProjectReportData.classList.remove("block");
                    ProjectReport.link.allProjectReportData.classList.add("d-none");
                    this.innerText='Edytuj';
                    ProjectReport.showProjectReportPreview();
                }
                else{
                    ProjectReport.link.previewProjectReportData.classList.remove("block");
                    ProjectReport.link.previewProjectReportData.classList.add("d-none");
                    ProjectReport.link.allProjectReportData.classList.remove("d-none");
                    ProjectReport.link.allProjectReportData.classList.add("block");
                    this.innerText='Podgląd'; 
                } 
        };     
        return btn;
    }
    static btnConfirmProjectReport(){
        console.log('ProjectReport::btnConfirmProjectReport()');   
        var btn=createBtn('Zatwierdź','btn btn-success','confirmData');
        /* CHECK PERMISSIONS */
        if(ProjectReport.perm.includes('GEN_PROJECT_REPORT')){
            /* POST DATA */
            btn.onclick= function() {
                /* CHECK IS ERROR */
                //if(ErrorStack.check(ProjectReport.stackName)){
                if(ProjectReport.ErrorStack.check()){
                    alert('ErrorStack exist errors');
                    return false;
                }
                ProjectReport.link.form.name=ProjectReport.getFormName();
                console.log(ProjectReport.link.form.name);
                console.log(ProjectReport.link.form);
                ProjectReport.Ajax.sendData(ProjectReport.link.form,'POST'); 
            };
        }
        else{
            btn.classList.add("disabled");
        }
        ProjectReport.confirmBtn=btn;
        console.log(ProjectReport.confirmBtn);
        return btn;
    }
    /* TO DO -> WYSKAKUJACE OKIENKA W PRZEGLADARCE */
    
    static btnExportToDoc(){
        console.log('ProjectReport::btnExportToDoc()');   
        var btn=createBtn('DOC','btn btn-primary','btnExportToDoc');
        /* CHECK PERMISSIONS */
        if(ProjectReport.perm.includes('GEN_PROJ_REP_DOC')){
            /* POST DATA */
            btn.onclick= function() {
                console.log(this);
                console.log(ProjectReport.getFormName());
                ProjectReport.link.form.name=ProjectReport.getFormName()+'Doc';
                ProjectReport.Ajax.sendData(ProjectReport.link.form,'POST');
                //var win = window.open('test', '_blank');
                //    win.focus();
            };
        }
        else{
            btn.classList.add("disabled");
        }
        return btn;
    }
    static xhr(PersonId){
        console.log('---static show()---\r\nID:'+PersonId);
        /* AJAX GET */
       var xhr=new XMLHttpRequest();
            //xhr.addEventListener("error",PersonShow.runErrorView,false);
            //xhr.addEventListener("load", PersonShow.runView, false);
            //xhr.addEventListener("progress",this.xhrProgress,false);
            //xhr.addEventListener("timeout", this.xhrTimeout, false);
            //xhr.addEventListener("loadstart",this.xhrLoadStart,false);
            //xhr.addEventListener("loadend", PersonShow.runView, false);
            //xhr.open('POST', APP_URL+LANG+'/showperson', true);
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhr.send('id='+PersonId);
    }
    static setLoadGif(){
        
    }
    static btnCancelProjectReport(){
        /* REMOVE TMP FILES */
        return functionBtn('cancel',createBtn('Anuluj','btn btn-dark','cancelBtn'),'');
    }
    static setProjectReportPreviewData(){
        console.log('ProjectReport::setProjectReportPreviewData()');  
        //console.log(ProjectReport.link.dynamicData);  

        var subLink=new Object();
        var fieldName=new Array();
        //var fileInputid=null;
        var textAreaInputid=null;
        removeHtmlChilds(ProjectReport.link.previewProjectReportData);
        for (var i=0;i<ProjectReport.link.dynamicData.childElementCount;i++){
            //console.log(ProjectReport.link.dynamicData.childNodes[i]);
            subLink=ProjectReport.link.dynamicData.childNodes[i].childNodes[0];
            //console.log(subLink);
            for(var j=0;j<subLink.childElementCount;j++){
                //console.log(subLink.childNodes[j]);
                console.log(subLink.childNodes[j].nodeName);
                //console.log(subLink.childNodes[j].id);
                //console.log(subLink.childNodes[j].hasOwnProperty('id'));
                
                if(subLink.childNodes[j].nodeName==='DIV'){
                    //console.log('DIV EXIST');
                    /* PARSE ID */
                    fieldName=subLink.childNodes[j].id.split("-");
                    switch (fieldName[0]) {
                        case 'divNumber':
                            console.log('divNumber');
                            //console.log(subLink.childNodes[j].childNodes[0].id);
                            //console.log(subLink.childNodes[j].childNodes[0].value);
                            ProjectReport.updActStageData(subLink.childNodes[j].childNodes[0].id,subLink.childNodes[j].childNodes[0].value);
                            break;
                        case 'divTitle':
                            console.log('divTitle');
                            //console.log();
                            //console.log();
                            ProjectReport.updActStageData(subLink.childNodes[j].childNodes[0].id,subLink.childNodes[j].childNodes[0].value);
                            break;
                        case 'divFile':
                            console.log('divFile');
                            //ProjectReport.setPreviewImageData(subLink.childNodes[j]);
                          break;
                        default:
                            console.log('REST:');
                            console.log(fieldName);
                    }
                }
                
                else if(subLink.childNodes[j].nodeName==='TEXTAREA'){
                     console.log('TEXTAREA');
                    //console.log(subLink.childNodes[j].id,subLink.childNodes[j].value);
                    textAreaInputid=subLink.childNodes[j].id;
                    ProjectReport.updActStageValue(subLink.childNodes[j].id,'v',subLink.childNodes[j].value);
                }
                else{
                    console.log('WRONG FIELD');
                }
                //ProjectReport.setNewDataFromInput();
                //ProjectReport.setImageTextPosition(subLink,i,j,textAreaInputid,fileInputid);
                textAreaInputid=null;
                //fileInputid=null;
            }
        }
    }
    static updActStageValue(id,key,value){
        //console.log('ProjectReport::setNewDataFromInput(id,value)');
        //console.log(id);
        //console.log(value);
        var inputId=id.split('-');
            //console.log(inputId);
            //console.log(ProjectReport.actStage[inputId[0]].v[inputId[1]].v);
            ProjectReport.actStage[inputId[0]].v[inputId[1]][key]=value;
            console.log(ProjectReport.actStage[inputId[0]]['v']);
    }
    static updActStageData(id,value){
        console.log('ProjectReport::setActStageTitle(id,value)');
        /*
         * TITLE/NUMBER
         */
        //console.log(id);
        var inputId=id.split('-');
        ProjectReport.actStage[inputId[0]][inputId[1]]=value;
        //console.log(ProjectReport.actStage);
    }

    static setImageTextPosition(subLink,i,j,textAreaId,fileExist){
        console.log(subLink);
        console.log(ProjectReport.actStage);
        /* ELEMENT ID */
        var id=subLink.id.split('-');
        var inputId=new Array();
            console.log(id);
            console.log(textAreaId);
            //console.log(fileInputid);
        if(textAreaId){
            console.log('textAreaId: '+textAreaId);
            inputId=textAreaId.split('-');
            console.log(ProjectReport.actStage[inputId[0]].v[inputId[1]]);
        }
        if(fileExist){
        }
        
    }
    static createDiv(value,c){
        var div=document.createElement('div');
            div.setAttribute('class',c);
            div.innerHTML=value;
        return div;
    }
}