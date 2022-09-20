class ProjectReport extends ProjectReportView
{

    stageData=new Array();
    stageActData=new Array();
    projectId='';
    fieldCounter=0;
    perm=new Array();
    defaultFilePostion='top';
    imgUrl='http://rezerwacje-gop.local:8080/router.php?task=downloadProjectReportImage&file=';

    fileProp={
        max:20971520, /* 20 MB 1024 * 1024 * 20 */
        type:[
            'image/jpeg','image/bmp','image/png','image/gif','image/jpg'
        ]
    };
    actStage=new Object();
    confirmBtn;
    ErrorStack=new Object();
    Ajax=new Object();
    
    constructor() {
        console.log('ProjectReport::constructor()');
        super();
    }
    setErrorStack(obj){
        console.log('ProjectReport::setErrorStack(obj)');
        this.ErrorStack=obj;
        console.log(this.ErrorStack);
    }
    setAjax(obj){
        console.log('ProjectReport::setAjax(obj)');
        this.Ajax=obj;
        console.log(this.Ajax);
    }
    getFormName(){
        /* SIMILAR TO CONST */
        return 'setProjectReport';
    }
    setData(projectStageData,perm){
        /* TO DO => PARSE RESPONSE STATUS */
        //console.log(projectStageData);
        this.stageActData=projectStageData['data']['value']['act'];
        this.stageData=projectStageData['data']['value']['data'];
        this.projectId=projectStageData['data']['value']['id'];
        this.perm=perm;
        //console.log(this.perm);
        /* TO DO +. DYNAMIC CHANGE */
        //this.formName=projectStageData['data']['function'];
    }
    showProjectReportPreview(){
        console.log('ProjectReport::showProjectReportPreview()');
        /*
         * PREVIEW DIV
         * f => files
         */
        console.log(this.Modal.link['dynamic']);
        console.log(this.actStage);
        /* SET DATA */
        this.setProjectReportPreviewData();
        
        
        /* CREATE AVAILABLE STAGE DATA */
        for(const prop in this.actStage){
                this.Modal.link['selectedStages'].appendChild(this.createDiv(this.actStage[prop].t,'col-12'));
                for(const prop2 in this.actStage[prop].v){
                    /*
                     * CHECK FILE POSITION
                     */
                    switch (this.actStage[prop].v[prop2].fp) {
                        case 'top':
                            console.log('top');
                            this.setupPreviewImage(this.actStage[prop].v[prop2],this.Modal.link['selectedStages'],'col-12 text-center');
                            this.Modal.link['selectedStages'].appendChild(this.createDiv(this.actStage[prop].v[prop2].v,'col-12'));
                            break;
                        case 'bottom':
                            console.log('bottom');
                            this.Modal.link['selectedStages'].appendChild(this.createDiv(this.actStage[prop].v[prop2].v,'col-12'));
                            this.setupPreviewImage(this.actStage[prop].v[prop2],this.Modal.link['selectedStages'],'col-12 text-center');
                            break;
                        case 'left':
                            console.log('left');
                            this.setupPreviewImage(this.actStage[prop].v[prop2],this.Modal.link['selectedStages'],'col-6 text-center');
                            this.Modal.link['selectedStages'].appendChild(this.createDiv(this.actStage[prop].v[prop2].v,'col-6'));
                            break;
                        case 'right':
                            console.log('right');
                            this.Modal.link['selectedStages'].appendChild(this.createDiv(this.actStage[prop].v[prop2].v,'col-6'));
                            this.setupPreviewImage(this.actStage[prop].v[prop2],this.Modal.link['selectedStages'],'col-6 text-center');              
                            break;
                        default:
                            console.log(`WRONG POSITION ${this.actStage[prop].v[prop2].fp}`);
                      }
                }
        } 
    }
    setupPreviewImage(v,ele,colClass){
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
            ele.appendChild(this.addImg(src,eleImg.name,colClass));
            return true;
        }
        if(v.fa){
            console.log('FILE ACTUALL');
            ele.appendChild(this.addImg(this.imgUrl+v.fa,v.fo,colClass));  
            return true;
        }
    }
    addImg(imgSrc,imgKey,colClass){
        let img=document.createElement('img');
            img.setAttribute('class','img-fluid');
            img.setAttribute('src',imgSrc);
            img.setAttribute('alt',imgKey);
        let div=this.createDiv('',colClass);
            div.appendChild(img);
            return div;
    }
    setDefaultData(){
        console.log('ProjectReport::setDefaultData()');
        console.log(this.actStage);
        for(const prop in this.actStage){
            delete this.actStage[prop];
        };
        this.fieldCounter=0;
    }
    create(){
        try{
            console.log('ProjectReport::create()');
            this.setDefaultData();            
            this.Modal.setLink();
            this.Modal.clearData();
            /* createHtmlElement ?? */
            this.Modal.setHead('Raport:','bg-primary');
            this.createButtons();   
      
        var rowDivResult=document.createElement('div');/* ALL */
            rowDivResult.setAttribute('class','row d-none');
            rowDivResult.setAttribute('style','border:1px solid #b3b3b3; width:800px;margin-left:150px;margin-bottom:10px;');
            rowDivResult.setAttribute('id','previewProjectReportData');

            this.Modal.link['adapted'].appendChild(super.getReportHead());
            this.Modal.link['adapted'].appendChild(this.getReportDataBody());
            this.Modal.link['adapted'].appendChild(rowDivResult); 
            this.addCurrentStageData();
            this.ErrorStack.setBlock(this.confirmBtn);
             console.log(this.Modal.link['adapted']);

        }
        catch(e){
            console.log(e);
            this.Html.removeClass(this.Modal.link['error'],'d-none');
            this.Modal.link.error.innerHTML=e;
        }
    }

    getReportDataBody(){
        console.log('ProjectReport::getReportDataBody()');
        /* */
        var rowDiv=document.createElement('div');/* ALL */
            rowDiv.setAttribute('class','row block');
            rowDiv.setAttribute('id','allProjectReportData');
        /* */
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
        /* */
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
            /* APPEND LINK DYNAMIC DATA TO FORM */
            this.Modal.link['form'].appendChild(dataDivRow);

            /* APPEND */
            rowDiv.appendChild(optionDiv);
            rowDiv.appendChild(dataDiv); 
            console.log(rowDiv);
             /* APPEND AVAILABLE STAGE DATA */
            this.Modal.addLink('availableStages',optionDiv);
             /* APPEND CURRENT STAGE DATA */
            this.Modal.addLink('selectedStages',dataDiv);
             /* ADD DYNAMIC STAGE SHORTCUT */
            this.Modal.addLink('dynamic',dataDivRow);
            return rowDiv;
    }
    createButtons(){
        this.Modal.link['button'].appendChild(this.btnCancelProjectReport());
        this.Modal.link['button'].appendChild(this.btnShowProjectReport());
        this.Modal.link['button'].appendChild(this.btnExportToDoc());
        this.Modal.link['button'].appendChild(this.btnConfirmProjectReport());
    }
    setForm(){
        console.log('ProjectReport::setForm()');
        var form = createForm('POST',this.getFormName(),'form-horizontal','OFF');  
            form.appendChild(createInput('hidden','id',this.projectId,'form-control','','n'));
        /* SET FORM LINK */
        this.Modal.addLink('form',form);
        return form;
    }
    createAvaliableStage(ele){
        for(const prop in this.stageData){
            var divRowStage=createTag('','div','col-12 border border-info mt-1 mb-1 rounded');
            this.createStageHead(divRowStage,prop);
            for(const propBody in this.stageData[prop]['v']){
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
        var number=createTag(this.stageData[prop]['n'],'span',''); 
        //var pMain=createTag('','p','');    
            divRowHeadN.appendChild(number);
            divRowHeadT.innerHTML=this.stageData[prop]['t'];
            divRowHeadA.appendChild(this.addBtn(this.stageData[prop]['i']));
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
            divRowBody.innerHTML=this.stageData[prop]['v'][propBody]['v'];
            //divRowBody.appendChild(pMain);
            ele.appendChild(divRowBody);
    }
    createStageFooter(ele,prop){
        //console.log('ProjectReport::createStageFooter()');
        var div=createTag('','div','row border-top border-info text-secondary');     
            div.innerHTML='<small>Stage ID: '+this.stageData[prop]['i']+', Create user: '+this.stageData[prop]['cu']+'</small>';
        ele.appendChild(div);
    }

    addCurrentStageData(){
        console.log('ProjectReport::addCurrentStageData()');
        console.log( this.Modal.link['dynamic']);
        //console.log(this.stageActData);
        /* ADD FORM */
        
        for(const prop in this.stageActData ){
            /* SET DATA */
            this.setActStageData(this.fieldCounter,this.stageActData[prop]['n'],this.stageActData[prop]['t'],this.stageActData[prop]['data']);
            this.Modal.link['dynamic'].appendChild(this.editedStageField());
        }
    }
    addStageData(idp){
        this.getStageData(idp);
        //console.log(ele);
        this.Modal.link['dynamic'].appendChild(this.editedStageField());
    }
    getStageData(idp){
        console.log('ProjectReport::getStageData('+idp+')');
        //console.log(this.stageData);
         /* GET NUMBER, TITLE, VALUE */
        for(const prop in this.stageData){
            if(parseInt(this.stageData[prop]['i'],10)===parseInt(idp,10)){
                console.log(this.stageData[prop]['v']);
                this.setActStageData(idp,this.stageData[prop]['n'],this.stageData[prop]['t'],this.stageData[prop]['v']);
                return true;
            }
        }
        /* SET DEFAULT */
        
        var emptyArr=new Array();
        //this.setActStageData(0,0,'ERROR - ELEMENT NOT FOUND',emptyArr);
        return true;
    }
    setActStageData(i,n,t,v){
        console.log('ProjectReport::setActStageData()');
        this.actStage[this.fieldCounter]={
            'i':i,
            'n':n,
            't':t,
            'v':v
        };
        //console.log(this.actStage);
    }
    editedStageField(){
        //console.log('ProjectReport::editedStageField()');
        //console.log(this.actStage[this.fieldCounter]);
        var counter=0;
        
        var divInput=createTag('','div','col-12');
            divInput.setAttribute('id','div-'+this.fieldCounter);
            /* ADD DIV ROW FOR REMOVE BUTTON */
        var divInputRow=createTag('','div','row border border-primary rounded mt-1 mb-1 pt-2 pb-2');  
            divInputRow.setAttribute('id','divAll-'+this.fieldCounter);
        var div0=createTag('','div','col-1 pr-0 pl-2');  
            div0.setAttribute('id','divMV-'+this.fieldCounter);
        var div1=createTag('','div','col-2  pl-1 pr-1');    
            div1.setAttribute('id','divNumber-'+this.fieldCounter);
        var div2=createTag('','div','col-8  pl-0 pr-1');
            div2.setAttribute('id','divTitle-'+this.fieldCounter);
        var div3=createTag('','div','col-1 pl-0');
            div3.setAttribute('id','divRM-'+this.fieldCounter);
            div0.appendChild(this.mvBtn());
            div1.appendChild(createInput('number',this.fieldCounter+'-n',this.actStage[this.fieldCounter].n,'form-control ','','n'));
            div2.appendChild(createInput('text',this.fieldCounter+'-t',this.actStage[this.fieldCounter].t,'form-control ','','n'));
            div3.appendChild(this.rmBtn(divInput));
            
        divInputRow.appendChild(div0);
        divInputRow.appendChild(div1);
        divInputRow.appendChild(div2);
        divInputRow.appendChild(div3);
        divInput.appendChild(divInputRow);
        for(const prop in this.actStage[this.fieldCounter].v){
            var textarea=document.createElement('textarea');
                textarea.setAttribute('class','form-control w-100 mt-2 ml-2 mr-2');
                textarea.setAttribute('name',this.fieldCounter+'-'+counter+'-value');
                textarea.setAttribute('id',this.fieldCounter+'-'+counter+'-data-stage-value');
                textarea.setAttribute('style','height:200px; ');//
                textarea.setAttribute('contenteditable','true');
                textarea.appendChild(document.createTextNode(this.actStage[this.fieldCounter].v[prop]['v']));
                divInputRow.appendChild(textarea);
                divInputRow.appendChild(this.createFileInputDiv(prop,counter));
                counter++;
        }
        this.fieldCounter++;
        
        //console.log(divInput);
        return divInput;
    }
    createFileInputDiv(prop,counter){
        var divFile=document.createElement('div');
            divFile.setAttribute('class','col-12 pl-1 ');//border border-success
            divFile.setAttribute('id','divFile-'+this.fieldCounter);
            this.createNewFileDiv(divFile,prop,counter);
            
            this.createActuallFileDiv(divFile,prop,counter);
        var defaultFilePosition=this.actStage[this.fieldCounter].v[prop]['fp'];
            /* IF NO FILE, THEN SETUP FILEPOSTION TO DEFAULT TOP */
            if(defaultFilePosition===null){
                defaultFilePosition='top';
            }
            divFile.appendChild(this.createFilePositionElement(this.fieldCounter,counter,defaultFilePosition));
        return divFile;
    }
    createNewFileDiv(ele,prop,counter){
        var divRow=document.createElement('div');
            divRow.setAttribute('class','row ml-0 mr-0 mt-1 mb-1 ');//border border-info rounded
            divRow.setAttribute('id',this.fieldCounter+'-'+counter+'-newFileDiv');
        var divRowErr=document.createElement('div');
            divRowErr.setAttribute('class','row ml-0 mr-0 mt-1 mb-1 alert alert-danger d-none');  
            divRowErr.setAttribute('id',this.fieldCounter+'-'+counter+'-fileDataErr');  
        var divCol1=document.createElement('div');
            divCol1.setAttribute('class','col-sm-11 pl-0 pt-1  '); //border border-danger
        var divCol2=document.createElement('div');
            divCol2.setAttribute('class','col-sm-1 pl-0 pr-0 form-check '); //border border-primary
        var input=createInput('file',this.fieldCounter+'-'+counter+'-fileData','','form-control-file','','n');
            input.onchange = function (e){
                console.log(e);
                console.log(this);
                this.parseFile(this,e,divRowErr);
               
            };
            divCol1.appendChild(input);
        var i=createTag('','i','fa fa-minus');
            i.setAttribute('aria-hidden','true');
            i.setAttribute('style','color:#ffffff;');
        var button=document.createElement('button');
            button.setAttribute('class','btn btn-warning');
            var self=this;
            button.onclick=function(){
                console.log(this.parentNode.parentNode.childNodes[1].childNodes[0]);
                 /*
                 * CLEAR input value
                 */
                this.parentNode.parentNode.childNodes[1].childNodes[0].value='';
                /*
                 * UPDATE this.actStage
                 */
                self.updActStageValue(this.parentNode.parentNode.childNodes[1].childNodes[0].id,'f',null);
                //console.log();
                /*
                 * HIDDE error
                 */
                //console.log(this.parentNode.parentNode.parentNode.childNodes[1]);
                self.hiddeEle(this.parentNode.parentNode.parentNode.childNodes[1]);
            };
            button.appendChild(i);
            divCol2.appendChild(button);
            
            divRow.appendChild(divCol2);
            divRow.appendChild(divCol1);
            ele.appendChild(divRow);
            ele.appendChild(divRowErr);
    }
    parseFile(t,e,divRowErr){
        var divErr=t.parentNode.parentNode.parentNode.childNodes[1];
        var errSize=document.createTextNode('');
        var errType=document.createTextNode('');
            
                console.log('INPUT FILE');
                console.log('MAX: '+this.fileProp.max);
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
                
                if(e.srcElement.files[0].size>this.fileProp.max){
                    errSize.nodeValue='File larger than 20MB! ';
                    this.ErrorStack.add(t.id+'-size','File larger than 20MB! ');
                    //ErrorStack.add(this.stackName,t.id+'-size','File larger than 20MB! ');
                }
                else{
                    errSize.nodeValue='';
                    this.ErrorStack.remove(t.id+'-size');
                }
                console.log('ProjectReport',this.fileProp.type);
                
                if(this.fileProp.type.indexOf(e.srcElement.files[0].type)===-1){
                    errType.nodeValue='Wrong file extension ('+e.srcElement.files[0].type+') ! ';
                    this.ErrorStack.add(t.id+"-ext",'Wrong file extension ('+e.srcElement.files[0].type+') ! ');
                }
                else{
                    errType.nodeValue='';
                    this.ErrorStack.remove(t.id+'-ext');
                }
                if(errSize.nodeValue!=='' || errType.nodeValue!==''){
                    divErr.appendChild(errSize);
                    divErr.appendChild(errType);
                    this.showEle(divErr);
                }
                else{
                    this.updActStageValue(t.id,'f',t.id);//this.value
                    this.hiddeEle(divErr);
                }
                console.log(this.actStage);
                console.log(this.confirmBtn);
    }
    hiddeEle(ele){
        ele.classList.remove("d-block");
        ele.classList.add("d-none");
    }
    showEle(ele){
        ele.classList.remove("d-none");
        ele.classList.add("d-block");
    }
    createActuallFileDiv(ele,prop,counter){
        console.log('ProjectReport::createActuallFileDiv() FILE:');
        //console.log(this.actStage[this.fieldCounter].v[prop]['fa']);
        if(this.actStage[this.fieldCounter].v[prop]['fa']){
            var divRow=document.createElement('div');
                divRow.setAttribute('class','row ml-0 mt-1 mb-1 mr-0 border border-info rounded');//border border-danger
                divRow.setAttribute('id',this.fieldCounter+'-'+prop+'-actFileDiv');
            var divCol1=document.createElement('div');
                divCol1.setAttribute('class','col-sm-10 '); //border border-info
            var divCol2=document.createElement('div');
                divCol2.setAttribute('class','col-sm-2 form-check '); //border border-primary
                    
                var box=document.createElement('input');
                    box.setAttribute('class','form-check-input');
                    box.setAttribute('type','checkbox');
                    /* box.setAttribute('checked','checked'); */
                    box.setAttribute('name',this.fieldCounter+'-'+counter+'-actFileRemove');
                    box.setAttribute('id',this.fieldCounter+'-'+counter+'-actFileRemove');
                var label=document.createElement('label');
                    label.setAttribute('class','form-check-label');
                    label.setAttribute('for',this.fieldCounter+'-'+counter+'-actFile');
                    label.appendChild(document.createTextNode('Usunąć?'));
               
                    /* ADD DATA ABOUT INSERTED FILE */   
                var actFile=document.createElement('a');
                    actFile.setAttribute('href','router.php?task=downloadProjectReportImage&file='+this.actStage[this.fieldCounter].v[prop]['fa']);
                    actFile.setAttribute('target','_blank');
                    actFile.appendChild(document.createTextNode(this.actStage[this.fieldCounter].v[prop]['fo']));
                var actFileInput=document.createElement('input');
                    actFileInput.setAttribute('name',this.fieldCounter+'-'+counter+'-actFile');
                    actFileInput.setAttribute('type','hidden');
                    actFileInput.setAttribute('value',this.actStage[this.fieldCounter].v[prop]['fa']);
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
            this.actStage[this.fieldCounter].v[prop]['fp']=this.defaultFilePostion;
        }
    }
    createFilePositionElement(counter,fileCounter,defFilePosition){
        //console.log('ProjectReport::createFilePositionElement('+fileCounter+')');
        //var fpCounter=0;
        var div=document.createElement('div');
            div.setAttribute('class','row ml-0 ');//border border-warning
            div.setAttribute('id',this.fieldCounter+'-'+fileCounter+'-filepositionDiv');
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
            
            divFormFile1.appendChild(this.createFilePosition(property,filePositionData[property],defFilePosition,fileCounter));
            //fpCounter++;
        }
        div.appendChild(divFormFile1);
        return (div);
       
    }
    rmBtn(ele){
    var i=createTag('','i','fa fa-minus');
        i.setAttribute('aria-hidden','true');
        i.setAttribute('style','color:#ffffff;');
    var div=createTag('','div','btn btn-danger');
    var self = this;
        div.onclick=function(){
            console.log(this.parentNode.id);
            let tmp=this.parentNode.id.split('-');
                tmp[1]=parseInt(tmp[1],10);
                ele.remove();
                console.log(tmp);
                console.log(self.actStage);
            if(self.actStage[tmp[1]]){
                console.log('OBJECT PROP EXIST');
                delete self.actStage[tmp[1]];
            }
            /* remove data from actStage */
        };
        div.appendChild(i);
        return(div); 
    }
    mvBtn(){
    var i=createTag('','i','fa fa-long-arrow-up text-dark text-center ml-2 ml-1 ');
        i.setAttribute('aria-hidden','true');
        this.changeArrow(i);
        this.mvUp(i);
    var i1=createTag('','i','fa fa-long-arrow-down text-dark text-center ml-1 mr-1 ');
        i1.setAttribute('aria-hidden','true');
        this.changeArrow(i1);
        this.mvDown(i1);
    var div=createTag('','div',' mt-2');
        
        div.appendChild(i);
        div.appendChild(i1);
        return(div); 
    }
    addBtn(idp){
        var btn=createTag('','button','btn  btn-success mt-2 mb-2');
            btn.setAttribute('type','button');
            btn.setAttribute('id',idp);
        var self = this;
            btn.onclick = function(){    
                self.addStageData(this.id);
            }; 
        var text=document.createTextNode(' ');
        var arrow=createTag('','i','fa fa-caret-right');
            btn.appendChild(text);
           btn.appendChild(arrow);
            return (btn);
    }
    changeArrow(ele){
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
    mvUp(ele){
        var self = this;
        ele.onclick=function(){
            console.log(self.actStage);
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
    mvDown(ele){
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
    createFilePosition(property,value,checked,fileCounter)
    {
        //console.log('ProjectReport::createFilePosition()');   
        //console.log(checked);
        //console.log(fpCounter);
        
        var div=document.createElement('div');
            div.setAttribute('class','form-check form-check-inline mt-1 mb-1');
            
        var inputRadioFileTop=createInput('radio',this.fieldCounter+'-'+fileCounter+'-fileposition',property,'form-check-input','','n');
            inputRadioFileTop.setAttribute('id',this.fieldCounter+'-'+fileCounter+'-fileposition-'+property);
            var self = this;
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
                self.updActStageValue(this.id,'fp',id[3]);
            };
        if(checked===property){
            inputRadioFileTop.setAttribute('checked','checked');
        }
        
        var inputRadioFileTopLabel=createTag(value,'label','form-check-label');
        inputRadioFileTopLabel.setAttribute('for',this.fieldCounter+'-'+fileCounter+'-fileposition-'+property);
        div.appendChild(inputRadioFileTop);
        div.appendChild(inputRadioFileTopLabel);
        /* SETUP DEFAULT */
        
        return div;
    }
    btnShowProjectReport(){
        console.log('ProjectReport::btnShowProjectReport()');   
        
        var btn=createBtn('Podgląd','btn btn-info','psShowStage');
            btn.onclick= function() {
                console.log(this.Modal.link['availableStages']);
                console.log(this.Modal.link['selectedStages']);
                if(this.Modal.link['selectedStages'].classList.contains("d-none")){
                    this.Modal.link['selectedStages'].classList.remove("d-none");
                    this.Modal.link['selectedStages'].classList.add("block");
                    this.Modal.link['availableStages'].classList.remove("block");
                    this.Modal.link['availableStages'].classList.add("d-none");
                    this.innerText='Edytuj';
                    this.showProjectReportPreview();
                }
                else{
                    this.Modal.link['selectedStages'].classList.remove("block");
                    this.Modal.link['selectedStages'].classList.add("d-none");
                    this.Modal.link['availableStages'].classList.remove("d-none");
                    this.Modal.link['availableStages'].classList.add("block");
                    this.innerText='Podgląd'; 
                } 
        };     
        return btn;
    }
    btnConfirmProjectReport(){
        console.log('ProjectReport::btnConfirmProjectReport()');   
        var btn=createBtn('Zatwierdź','btn btn-success','confirmData');
        /* CHECK PERMISSIONS */
        if(this.perm.includes('GEN_PROJECT_REPORT')){
            /* POST DATA */
            btn.onclick= function() {
                /* CHECK IS ERROR */
                //if(ErrorStack.check(this.stackName)){
                if(this.ErrorStack.check()){
                    alert('ErrorStack exist errors');
                    return false;
                }
                this.Modal.link['form'].name=this.getFormName();
                console.log(this.Modal.link['form'].name);
                console.log(this.Modal.link['form']);
                this.Ajax.sendData(this.Modal.link['form'],'POST'); 
            };
        }
        else{
            btn.classList.add("disabled");
        }
        this.confirmBtn=btn;
        console.log(this.confirmBtn);
        return btn;
    }
    /* TO DO -> WYSKAKUJACE OKIENKA W PRZEGLADARCE */
    
    btnExportToDoc(){
        console.log('ProjectReport::btnExportToDoc()');   
        var btn=createBtn('DOC','btn btn-primary','btnExportToDoc');
        /* CHECK PERMISSIONS */
        if(this.perm.includes('GEN_PROJ_REP_DOC')){
            /* POST DATA */
            btn.onclick= function() {
                console.log(this);
                console.log(this.getFormName());
                this.Modal.link['form'].name=this.getFormName()+'Doc';
                this.Ajax.sendData(this.Modal.link['form'],'POST');
                //var win = window.open('test', '_blank');
                //    win.focus();
            };
        }
        else{
            btn.classList.add("disabled");
        }
        return btn;
    }
    xhr(PersonId){
        console.log('---show()---\r\nID:'+PersonId);
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
    setLoadGif(){
        
    }
    btnCancelProjectReport(){
        /* REMOVE TMP FILES */
        return functionBtn('cancel',createBtn('Anuluj','btn btn-dark','cancelBtn'),'');
    }
    setProjectReportPreviewData(){
        console.log('ProjectReport::setProjectReportPreviewData()');  
        //console.log(this.Modal.link['dynamic']);  

        var subLink=new Object();
        var fieldName=new Array();
        //var fileInputid=null;
        var textAreaInputid=null;
        removeHtmlChilds(this.Modal.link['selectedStages']);
        for (var i=0;i<this.Modal.link['dynamic'].childElementCount;i++){
            //console.log(this.Modal.link['dynamic'].childNodes[i]);
            subLink=this.Modal.link['dynamic'].childNodes[i].childNodes[0];
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
                            this.updActStageData(subLink.childNodes[j].childNodes[0].id,subLink.childNodes[j].childNodes[0].value);
                            break;
                        case 'divTitle':
                            console.log('divTitle');
                            //console.log();
                            //console.log();
                            this.updActStageData(subLink.childNodes[j].childNodes[0].id,subLink.childNodes[j].childNodes[0].value);
                            break;
                        case 'divFile':
                            console.log('divFile');
                            //this.setPreviewImageData(subLink.childNodes[j]);
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
                    this.updActStageValue(subLink.childNodes[j].id,'v',subLink.childNodes[j].value);
                }
                else{
                    console.log('WRONG FIELD');
                }
                //this.setNewDataFromInput();
                //this.setImageTextPosition(subLink,i,j,textAreaInputid,fileInputid);
                textAreaInputid=null;
                //fileInputid=null;
            }
        }
    }
    updActStageValue(id,key,value){
        //console.log('ProjectReport::setNewDataFromInput(id,value)');
        //console.log(id);
        //console.log(value);
        var inputId=id.split('-');
            //console.log(inputId);
            //console.log(this.actStage[inputId[0]].v[inputId[1]].v);
            this.actStage[inputId[0]].v[inputId[1]][key]=value;
            console.log(this.actStage[inputId[0]]['v']);
    }
    updActStageData(id,value){
        console.log('ProjectReport::setActStageTitle(id,value)');
        /*
         * TITLE/NUMBER
         */
        //console.log(id);
        var inputId=id.split('-');
        this.actStage[inputId[0]][inputId[1]]=value;
        //console.log(this.actStage);
    }

    setImageTextPosition(subLink,i,j,textAreaId,fileExist){
        console.log(subLink);
        console.log(this.actStage);
        /* ELEMENT ID */
        var id=subLink.id.split('-');
        var inputId=new Array();
            console.log(id);
            console.log(textAreaId);
            //console.log(fileInputid);
        if(textAreaId){
            console.log('textAreaId: '+textAreaId);
            inputId=textAreaId.split('-');
            console.log(this.actStage[inputId[0]].v[inputId[1]]);
        }
        if(fileExist){
        }
        
    }
    createDiv(value,c){
        var div=document.createElement('div');
            div.setAttribute('class',c);
            div.innerHTML=value;
        return div;
    }
}