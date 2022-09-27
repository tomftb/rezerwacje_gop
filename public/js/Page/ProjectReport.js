class ProjectReport extends ProjectReportView
{
    ChosenReport=new Object();
    DepartmentData={
            avaDepartmentList:new Array(),
            defaultDepartment:new Array()
    };
    AvailableStages=new Object();
    actVariables=new Array();
    jsonResponse=new Object();
    stageData=new Array();
    stageActData=new Array();
    projectId='';
    fieldCounter=0;
    //perm=new Array();
    defaultFilePostion='top';
    ErrorStack=new Object();
    Xhr=new Object();
    StageDataUtilities = new Object();
    router='';
    appUrl='';
    /* Ordinal number */
    //ordinalNumber=0;
    perm=new Array();
    imgUrl='http://rezerwacje-gop.local:8080/router.php?task=downloadProjectReportImage&file=';
    fileProp={
        max:20971520, /* 20 MB 1024 * 1024 * 20 */
        type:[
            'image/jpeg','image/bmp','image/png','image/gif','image/jpg'
        ]
    };
    Department = new Object();
    
    constructor(router,appUrl,perm){
        console.log('ProjectReport::constructor()');
        super();
        this.ErrorStack = new ErrorStack();
        this.Xhr=new Xhr2();
        this.StageDataUtilities = new StageDataUtilities();
        this.router=router;
        this.appUrl=appUrl;
        this.perm=perm;
        this.Department = new Department();
        //console.log(this.router);
        //console.log(this.appUrl);
        //console.log(this.perm);
    }
    parseResponse(response){
        console.log('ProjectReport::parseResponse()');
        //console.log(response);
        try{
            //console.log(response);
            this.jsonResponse = JSON.parse(response);
                console.log(this.jsonResponse);
            return true;
        }
        catch(e){
            console.log(response);
            console.log(e);
            //this.Modal.setError(e);
            //this.Modal.setError(e);
            this.ErrorStack.add('overall','An Application Error Has Occurred!');
            this.Modal.setError(this.ErrorStack.info['overall']);
            return false;
        }
    }
    parseJsonResponse(){
         console.log('ProjectReport::parseJsonResponse()');
        //var notify='Application error occurred! Contact with Administrator!';
        var err=false;
        var defaultErr='Application error occurred! Contact with Administrator!';
        try{
            console.log('ProjectReport::parseJsonResponse()');
            if(!this.jsonResponse.hasOwnProperty('status')){
                console.log('no status property');
                throw defaultErr;
            }
            if(!this.jsonResponse.hasOwnProperty('info')){
                console.log('no info property');
                throw defaultErr;
            }
            if(!this.jsonResponse.hasOwnProperty('data')){
                console.log('no data property');
                throw defaultErr;
            }
            if(this.jsonResponse.status===1){
                
                throw this.jsonResponse.info;
            }
            return true;
        }
        catch(e){
            console.log(e);
            this.ErrorStack.add('overall',e);
            this.Modal.setError(this.ErrorStack.info['overall']);
            //this.Modal.setError(e);
            
            return false;
        }
        return true;
    }
    setDefaultChosenReport(){
        return {
            0:{
                data:{
                    id:'',
                    id_project:0,
                    departmentId:0,
                    departmentName:'NULL',
                    buffer_user_id:null,
                    change:'y' // FOR OPTIMALISATION
                },
                stage:{}
            }
        };
    }
    setData(projectStageData){
        console.log('ProjectReport::setData()');
        //console.log(projectStageData);
        //console.log(projectStageData.data.value.act.hasOwnProperty('data'));
        this.ChosenReport=this.setDefaultChosenReport();
         /* SET DEFAULT DEPARTMENT */
        if(projectStageData.data.value.department.length!==0){  
            //console.log('set default department');
            this.DepartmentData.avaDepartmentList=projectStageData.data.value.department;
            this.DepartmentData.defaultDepartment[0]=projectStageData.data.value.department[0];
            this.ChosenReport[0].data.departmentId=projectStageData.data.value.department[0].v;
            this.ChosenReport[0].data.departmentName=projectStageData.data.value.department[0].n;
        }
        if(Object.keys(projectStageData.data.value.act).length>0){
        //if(projectStageData.data.value.act.hasOwnProperty('data')){
            //console.log('set chosen report ');
            this.ChosenReport=projectStageData.data.value.act;
            this.ChosenReport[0].data.departmentId=projectStageData.data.value.act[0].data.departmentId;
            this.ChosenReport[0].data.departmentName=projectStageData.data.value.act[0].data.departmentName;
            this.DepartmentData.defaultDepartment[0]={
                'v':projectStageData.data.value.act[0].data.departmentId,
                'n':projectStageData.data.value.act[0].data.departmentName
            };
            //this.DepartmentData.defaultDepartment=projectStageData.data.value.act.data;    
            /* FIX DEPARTMENT DATA */
        }
        else{
            //console.log('set default chosen report id project');
            this.ChosenReport[0].data.id_project=projectStageData.data.value.id;
        }
        //console.log(this.ChosenReport);
        //throw 'aa';
        this.AvailableStages=projectStageData.data.value.all;
    }
    getReportDepartment(){
        console.log('ProjectReport::getReportDepartment()');
        //console.log(this.DepartmentData);
        this.Department.setData(this.DepartmentData,this.DepartmentData.defaultDepartment);
        var departmentDiv=this.Department.get();
        this.Modal.link['department']=this.Department.getLink();
       // var departmentListNames = this.DepartmentData.departmentListNames; 
        /* CLOUSURE */
        var self=this;
        this.Modal.link['department'].onchange = function () {   
            self.ChosenReport[0].data.departmentId=this.value;
            //console.log(this);
            //console.log(this.value);
            //console.log(typeof(this.value));
            //console.log(self.DepartmentData.avaDepartmentList);
            for(const prop in self.DepartmentData.avaDepartmentList){
                if(this.value===self.DepartmentData.avaDepartmentList[prop].v){
                    self.ChosenReport[0].data.departmentName=self.DepartmentData.avaDepartmentList[prop].n;
                    break;
                };  
            };
            self.ChosenReport[0].data.change='y';
            //console.log(self.ChosenReport);
            };
        return departmentDiv;
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

    setModalLoad(){
        console.log('ProjectReport::setModalLoad()');
        //this.Modal.loadNotify='<img src="'+window.appurl+'/img/loading_60_60.gif" alt="load_gif">';
        var M = this.Modal;
            M.loadNotify='<img src="'+this.appUrl+'/img/loading_60_60.gif" alt="load_gif">';
        var start = function(){
                M.showLoad(); 
            };
        var end = function(){
                M.hideLoad();
            };
            this.Xhr.setLoad(start,end);
    }
    create(projectStageData){
        try{
            console.log('ProjectReport::create()');
            this.setData(projectStageData);
            this.Modal.setLink();
            this.Modal.clearData();
            this.setModalLoad();
            /* createHtmlElement ?? */
            this.Modal.setHead('Raport:','bg-primary');
            this.createButtons();   
      
        var rowDivResult=document.createElement('div');/* ALL */
            rowDivResult.setAttribute('class','row d-none');
            rowDivResult.setAttribute('style','border:1px solid #b3b3b3; width:800px;margin-left:150px;margin-bottom:10px;');
            rowDivResult.setAttribute('id','previewProjectReportData');
            this.Modal.link['adapted'].appendChild(this.getReportDepartment());
            this.Modal.link['adapted'].appendChild(super.getHead());
            this.Modal.link['adapted'].appendChild(super.getHeadDynamicVariable());
            this.Modal.link['adapted'].appendChild(super.getHeadDynamicImage());
            this.Modal.link['adapted'].appendChild(super.getHeadData());

            this.Modal.link['adapted'].appendChild(super.getDataBody());
            //this.Modal.link['adapted'].appendChild(super.getReportLoad()); TO DO
            this.Modal.link['adapted'].appendChild(rowDivResult); 
            /* SET PROEJCT REPORT ID */
            //this.projectId

            /* SET AVAILABLE DATA */
            this.createAvaliableStage();
            /* SET CHOSEN DATA */
            this.setChosenReport();
            console.log(this.Modal.link['adapted']);
            //console.log(this.Modal.link);
        }
        catch(e){
            this.Modal.setError(e);
        }
    }

    createButtons(){
        this.Modal.link['button'].appendChild(this.btnCancelProjectReport());
        this.Modal.link['button'].appendChild(this.btnShowProjectReport());
        this.Modal.link['button'].appendChild(this.btnExportToDoc());
        this.Modal.link['button'].appendChild(this.btnSaveReport());
    }
    createAvaliableStage(){      
        for(const prop in this.AvailableStages){
            let row=this.Html.getRow();
                this.Html.addClass(row,['mt-0','mb-0']);//'border','border-info',,'rounded','border-bottom','border-info',
            /* SET ROW */
            this.createAvaliableStageRow(row,this.AvailableStages[prop]);
            this.Modal.link['availableData'].appendChild(row);
        }
    }
    createAvaliableStageRow(ele,prop){
        //console.log('ProjectReport::createAvaliableStageRow()');
        var self=this;
        var col=this.Html.getCol(12);
        var spanBull=document.createElement('span');
            this.Html.addClass(spanBull,'text-info');
            spanBull.innerHTML='&bull;&nbsp;';
        var spanText=document.createElement('span');     
            spanText.append(document.createTextNode(prop.t));
        var self = this;
            spanText.onclick = function(){
                console.log('ProjectReport::createAvaliableStageRow().onclick()');
                console.log(self.router);
                console.log(prop);     
                self.Xhr.run({
                    t:'GET',
                    u:self.router+'psShortDetails&id='+prop.i,
                    c:true,
                    d:null,
                    o:self,
                    m:'setUpChosenStageRow'
                });
            };
            /* SET POINTER */
            spanText.onmouseover = function(){
                this.style.cursor='pointer';
            };
        col.appendChild(spanBull);
        col.appendChild(spanText);
        ele.appendChild(col);        
    }
    setUpChosenStageRow(response){
        console.log('ProjectReport::parseChosenStageRow()');
        if(!this.parseResponse(response)){
            return false;
        };
        if(!this.parseJsonResponse()){
            return false;
        };
        /* ADD TO CURRENT REPORT STAGE OBJECT -> ADD TO REPORT WITH INDEX = 0 */
        console.log('ChosenReport:');
        console.log(this.ChosenReport);
        console.log(Object.keys(this.ChosenReport[0].stage).length);
        console.log('New:');
        console.log(this.jsonResponse.data);
        var length = Object.keys(this.ChosenReport[0].stage).length;
        this.ChosenReport[0].data.change='y';
        this.ChosenReport[0].stage[length]=this.jsonResponse.data;
        this.ChosenReport[0].stage[length].data['ordinal_number']=1;
        //throw 'asaaaa';
        /* ADD NET ITEM */
        this.createChosenStageRow(this.ChosenReport[0],length);
    }
    createChosenStageRow(Report,id){
        //console.log('ProjectReport::createChosenStageRow()');
        //console.log(Stage);
        try{
            var self=this;
            var row=super.getChosenStageRow();
                /* UPDATE LIST */
                self.Modal.link['dynamic'].append(row.all);
                /* CHECK AND UPDATE VARIABLE LIST */
            var variable=self.createChosenStageVariable(Report.stage[id]);
                //console.log(row);
                row.tx.append(document.createTextNode(Report.stage[id].data.title));
                row.tx.onclick = function(){
                    console.log(Report);
                    console.log(Report.stage[id]);
                    //self.createChosenStageRow(self,prop);
                };
                row.rm.onclick=function(){
                    //Report.data.change='y';
                    console.log(Report.data);
                    console.log(Report.stage[id]);
                    console.log(variable);
                    row.all.remove();
                    variable.remove();
                    delete Report.stage[id];
                };
                row.mvUp.onclick=function(){
                    console.log(Report.stage[id]);
                };
                row.mvDown.onclick=function(){
                    console.log(Report.stage[id]);
                };
           
        }
        catch(e){
            console.log(e);
            throw 'Application error occurred! Contact with Administrator!';
        }
        
    }
    createChosenStageVariable(Stage){     
        var ul=document.createElement('ul');
            this.Html.addClass(ul,['mt-0','mb-0','text-dark']);
            ul.style.listStyleType='disc'; 
        var self={
            t:this,
            found:false,
            u:ul
        };
        var f = function (row,o){
            /* 
              * s - self{
              *     t:this - object
              *     f:found - boolean
              *     u:ul - ele
              * }
              * row - Stage row data
              */
            //console.log(row);
            //console.log(o);
            for(const v in row.paragraph.variable){
                var rowLi = document.createElement('li');
                var spanLi = document.createElement('span');
                    self.t.Html.addClass(spanLi,['text-dark']);
                    spanLi.append(document.createTextNode(row.paragraph.variable[v].name));
                    spanLi.style.cursor='pointer';
                    spanLi.onclick = function(){
                        console.log(row.paragraph.variable[v]);
                        console.log(this);
                        //console.log(self.t.ChosenReport[0].data);
                        //o.t.Html.removeChilds(this);
                        //this.append(document.createTextNode('aaaaa'));
                        //row.paragraph.variable[v].value='aaaaa';
                        console.log(row);
                        console.log(self.t.Modal.link['variablesEle']);
                        /* SET VARIABLE NAME */
                        self.t.Html.removeChilds(self.t.Modal.link['variablesLabel']);
                        self.t.Modal.link['variablesLabel'].append(document.createTextNode(row.paragraph.variable[v].name));
                        /* SET VARIABLE VALUE */
                        self.t.Modal.link['variablesInput'].value=row.paragraph.variable[v].value;
                        /* SHOW DIV */
                        self.t.Html.removeClass(self.t.Modal.link['variablesEle'],'d-none');
                        //self.t.Modal.link['variablesInput'];
                        
                        self.t.Modal.link['variablesSaveButton'].onclick=function(){
                            /* SET CHANGE */
                            console.log(self.t.ChosenReport[0].data.change='y');
                            self.t.Html.addClass(self.t.Modal.link['variablesEle'],'d-none');  
                            self.t.Html.removeChilds(self.t.Modal.link['variablesLabel']);
                            console.log(self.t.Modal.link['variablesInput'].value);
                            row.paragraph.variable[v].value=self.t.Modal.link['variablesInput'].value;

                        };
                    };
                    spanLi.onmouseover = function (){
                        self.t.Html.removeClass(this,"text-dark");
                        self.t.Html.addClass(this,"text-purple");
                    };
                    spanLi.onmouseleave = function (){
                        self.t.Html.removeClass(this,"text-purple");
                        self.t.Html.addClass(this,"text-dark");
                    };
                    rowLi.append(spanLi);
                    o.u.append(rowLi);  
                    o.found=true;
            } 
        };

       this.StageDataUtilities.loopOverRow(Stage,f,self);
       if(self.found){
           return super.appendVariable(Stage,self.u);
       }
       return document.createTextNode('');
    }
    setChosenReport(){
        console.log('ProjectReport::setChosenReport()');
        //console.log(this.Modal.link['dynamic']);
        //console.log(this.ChosenReport);
        for(const report in this.ChosenReport){
             //console.log(this.ChosenReport[report]);
            for(const id in this.ChosenReport[report].stage){
                /* SET DATA */
                //console.log(this.ChosenReport[report].stage[stage]);
                this.createChosenStageRow(this.ChosenReport[report],id);
            }
        }
       //throw 'aaaaa';
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
    btnShowProjectReport(){
        console.log('ProjectReport::btnShowProjectReport()');   
        
        var btn=createBtn('Podgląd','btn btn-info','psShowStage');
        var self=this;    
            btn.onclick= function() {
                console.log(self.Modal.link['availableStages']);
                console.log(self.Modal.link['selectedStages']);
                if(self.Modal.link['selectedStages'].classList.contains("d-none")){
                    self.Modal.link['selectedStages'].classList.remove("d-none");
                    self.Modal.link['selectedStages'].classList.add("block");
                    self.Modal.link['availableStages'].classList.remove("block");
                    self.Modal.link['availableStages'].classList.add("d-none");
                    this.innerText='Edytuj';
                    self.showProjectReportPreview();
                }
                else{
                    self.Modal.link['selectedStages'].classList.remove("block");
                    self.Modal.link['selectedStages'].classList.add("d-none");
                    self.Modal.link['availableStages'].classList.remove("d-none");
                    self.Modal.link['availableStages'].classList.add("block");
                    this.innerText='Podgląd'; 
                } 
        };     
        return btn;
    }
    btnSaveReport(){
        console.log('ProjectReport::btnSaveReport()');   
        //var btn=createBtn('Zapisz','btn btn-success','confirmData');
        var save=document.createElement('button');
            save.classList.add('btn','btn-success');
            save.appendChild(document.createTextNode('Zapisz'));   
            /* SET ERROR STACK BLOCK BUTTON */
            this.ErrorStack.setBlockEle(save);
            /* CHECK PERMISSION */
            if(!this.perm.includes('SAVE_PROJ_REPORT')){
                 //this.Html.addClass(save,'disabled');
                 //save.classList.add("disabled");
                 this.ErrorStack.add('perm','NO SAVE_PROJ_REPORT PERMISSION');
                 this.Modal.setError(this.ErrorStack.info['perm']);
            }
        var self = this;
            save.onclick=function(){
                console.log('ProjectReport::btnSaveReport().onclick()');   
                const fd = new FormData();
                console.log(self.ChosenReport);
                
                fd.append('data',JSON.stringify(self.ChosenReport));
                try{               
                    var xhrParm={
                        t:"POST",
                        u:self.router+'saveProjectReport',
                        /* FOR POST SET propertry c to TRUE */
                        c:true,
                        d:fd,
                        o:self,
                        m:'Save'
                    };
                    self.Xhr.run(xhrParm);
                }
                catch(e){
                    console.log('btnSaveReport.onclick()');
                    console.log(e);
                    self.Modal.setError(e);
                };
            };
        return save;
    }
    /* TO DO -> WYSKAKUJACE OKIENKA W PRZEGLADARCE */
    Save(response){
        console.log('ProjectReport::Save');
        
        if(!this.parseResponse(response)){
            return false;
        }
        if(!this.parseJsonResponse()){
            //this.ErrorStack.add('overall','OVERALL ERROR');
            //this.Modal.setError(this.ErrorStack.info['perm']);
            return false;
        };
        //console.log(this.Modal.link.error);
        //console.log(this.jsonResponse.data.value);
        /* CHANGE ChosenReport status */
        this.ChosenReport[0].data.change='n';
        this.ChosenReport[0].data.id=this.jsonResponse.data.value[1];
        this.Modal.setSuccess(this.jsonResponse.data.value[0]);
    }
    Doc(response){
        console.log('ProjectReport::Doc');
        console.log(response);
        if(!this.parseResponse(response)){
            return false;
        }
        if(!this.parseJsonResponse()){
            //this.ErrorStack.add('overall','OVERALL ERROR');
            //this.Modal.setError(this.ErrorStack.info['perm']);
            return false;
        };
        if(this.jsonResponse.data.value===''){
            console.log('NO STAGE SELECTED');
            this.Modal.setSuccess(this.jsonResponse.data.function);
            return true;
        }
        //console.log(this.jsonResponse.data.value);
        var win = window.open('router.php?task=downloadProjectReportDoc&file='+this.jsonResponse.data.value, '_blank');
            win.focus();
    }
    btnExportToDoc(){
        console.log('ProjectReport::btnExportToDoc()');
        //var btn=createBtn('Zapisz','btn btn-success','confirmData');
        var button=document.createElement('button');
            button.classList.add('btn','btn-primary');
            button.appendChild(document.createTextNode('DOC'));   
            /* SET ERROR STACK BLOCK BUTTON */
            this.ErrorStack.setBlockEle(button);
            /* CHECK PERMISSION */
            if(!this.perm.includes('GEN_PROJ_REP_DOC')){
                 //this.Html.addClass(save,'disabled');
                 //save.classList.add("disabled");
                 this.ErrorStack.add('perm','NO GEN_PROJ_REP_DOC PERMISSION');
                 this.Modal.setError(this.ErrorStack.info['perm']);
            }
        var self = this;
            button.onclick=function(){
                console.log('ProjectReport::btnExportToDoc().onclick()');   
                const fd = new FormData();
                //console.log(self.ChosenReport);
                console.log('ChosenReport 0 IDX');
                console.log(self.ChosenReport[0]);
                /* ONLY FIRST - MAYBE IN FUTURE SEVERAL */
                fd.append('data',JSON.stringify(self.ChosenReport[0]));
                try{               
                    var xhrParm={
                        t:"POST",
                        u:self.router+'getProjectReportDoc',
                        /* FOR POST SET propertry c to TRUE */
                        c:true,
                        d:fd,
                        o:self,
                        m:'Doc'
                    };
                    self.Xhr.run(xhrParm);
                }
                catch(e){
                    console.log('btnExportToDoc.onclick()');
                    console.log(e);
                    self.Modal.setError(e);
                };
            };
        return button;
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

    btnCancelProjectReport(){
        /* REMOVE TMP FILES */
        return functionBtn('cancel',createBtn('Wyjdź','btn btn-dark','cancelBtn'),'');
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
    createDiv(value,c){
        var div=document.createElement('div');
            div.setAttribute('class',c);
            div.innerHTML=value;
        return div;
    }
}