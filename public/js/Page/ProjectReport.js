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
    defaultFilePostion='top';
    ErrorStack=new Object();
    Xhr=new Object();
    StageDataUtilities = new Object();
    router='';
    appUrl='';
    perm=new Array();
    Helplink={
        'stage':{}
    };
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
        console.log('TO DO');
        return true;
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
        var length = (Object.keys(this.ChosenReport[0].stage).length).toString();
        this.ChosenReport[0].data.change='y';
        this.ChosenReport[0].stage[length]=this.jsonResponse.data;
        this.ChosenReport[0].stage[length].data['ordinal_number']=1;
        //throw 'asaaaa';
        /* ADD NET ITEM */
        let variable={
                    list:{},
                    found:false,
                    all:null
                };
        this.createChosenStageVariable(this.ChosenReport[0],length,variable);
            
        if(variable.found){
            this.Html.removeClass(this.Modal.link['variables'],'d-none');
               variable.all=super.getVariableEle(this.ChosenReport[0].stage[length],variable.list);
            this.Modal.link['variables'].append(variable.all);
        }

        var rowAll=this.createChosenStageRow(this.ChosenReport[0],length);//variable.all
        this.Modal.link['dynamic'].append(rowAll);
        /* SET Helplink */
        this.Helplink.stage[length]={
            stage:rowAll,
            variable:variable.all,
            image:{}
         };
    }
    createChosenStageRow(Report,id){//,variable
        //console.log('ProjectReport::createChosenStageRow()');
        //console.log(Report);
        //console.log(id);
        
        try{
            var self=this;
            var row=super.getChosenStageRow();
                row.tx.append(document.createTextNode(Report.stage[id].data.title));
                
                
           function swap(ReportData,id,last,self){
               //console.log('ProjectReport::createChosenStageRow().swap()');
               //console.log(ReportData);
                if(last===''){
                    //console.log('NO STAGE BEFORE');
                    return true;
                }
                //console.log('STAGE BEFORE PROPERTY - '+last);
                ReportData.data.change='y';
                /* SWAP REPORT OBJECT */
                var tmpStage=ReportData.stage[last];
                    ReportData.stage[last]=ReportData.stage[id];
                    ReportData.stage[id]=tmpStage;
                    //console.log('Report stage new:');
                    //console.log(ReportData.stage[last]);
                    //console.log('Report stage old:');
                    //console.log(ReportData.stage[id]);
                    //console.log('Helplink:');
                    //console.log(self.Helplink.stage);
                    /* CLEAR STAGE ELE */

                    self.Html.removeChilds(self.Helplink.stage[id].stage);
                    self.Html.removeChilds(self.Helplink.stage[last].stage);

                    /* assignVariable function */
                    var assignVariable = function(selfRef,ReportDataIn,idChange){
                        //console.log('ProjectReport::createChosenStageRow().swap().assignVariable()');
                        //console.log(ReportDataIn.stage[idChange]);
                        let variable={
                            list:{},
                            found:false,
                            all:null
                         };
                         selfRef.createChosenStageVariable(ReportDataIn,idChange,variable);
                         if(variable.found){
                                variable.all=selfRef.getVariableEle(ReportDataIn.stage[idChange],variable.list);
                                selfRef.Helplink.stage[idChange].variable.append(variable.all.childNodes[0],variable.all.childNodes[1]);
                         }
                         //return variable;
                    };
                    
                    /* checkVariable function */
                    function checkVariable(selfRef,ReportDataIn,idAct,lastId,assignVariable){
                        //console.log('ProjectReport::createChosenStageRow().swap().checkVariable()');
                       // let variableNew={
                        //    id:{},
                        //    last:{}
                       // };
                        let tmpVariableEle={};
                        //console.log('ID:');
                       // console.log(id);
                       // console.log('SWAP WITH (LAST) ID:');
                        //console.log(last);
                       // console.log('ID STAGE:');
                        //console.log(ReportDataIn.stage[id]);
                       // console.log(self.Helplink.stage[id]);
                       // console.log(self.Helplink.stage[id].variable);
                        //console.log('SWAP WITH (LAST) ID STAGE:');
                        //console.log(ReportDataIn.stage[last]);
                        //console.log(self.Helplink.stage[last]);
                        //console.log(self.Helplink.stage[last].variable);
                        if(selfRef.Helplink.stage[idAct].variable && selfRef.Helplink.stage[lastId].variable){
                            //console.log('STAGE ID AND LAST HAVE VARIABLE - SWAP');
                            selfRef.Html.removeChilds(selfRef.Helplink.stage[idAct].variable);
                            selfRef.Html.removeChilds(selfRef.Helplink.stage[lastId].variable);
                            assignVariable(selfRef,ReportDataIn,idAct);
                            assignVariable(selfRef,ReportDataIn,lastId);
                            //variableNew.id=
                           // variableNew.last=
                        }
                        else if(!selfRef.Helplink.stage[idAct].variable && selfRef.Helplink.stage[lastId].variable){
                             //console.log('STAGE ID DONT HAVE VARIABLE');
                             //console.log(self.Helplink.stage);
                             
                             tmpVariableEle=selfRef.Helplink.stage[lastId].variable;
                             selfRef.Helplink.stage[lastId].variable=selfRef.Helplink.stage[idAct].variable;
                             selfRef.Helplink.stage[idAct].variable=tmpVariableEle;
                             
                             //console.log('NEW HELPLINK');
                            // console.log(self.Helplink.stage);
                             selfRef.Html.removeChilds(selfRef.Helplink.stage[idAct].variable);
                             assignVariable(selfRef,ReportDataIn,idAct);
                             assignVariable(selfRef,ReportDataIn,lastId);   
                             //variableNew.id=
                             //variableNew.last=                          
                             //console.log('NEW HELPLINK 2');
                             //console.log(self.Helplink.stage);   
                        }
                        else if(selfRef.Helplink.stage[idAct].variable && !selfRef.Helplink.stage[lastId].variable){
                           // console.log('STAGE LAST DONT HAVE VARIABLE');
                           // console.log('ID');
                           // console.log(self.Helplink.stage[id].variable);
                           // console.log('LAST');
                            //console.log(self.Helplink.stage[last].variable);
                            tmpVariableEle=selfRef.Helplink.stage[lastId].variable;
                            selfRef.Helplink.stage[lastId].variable=selfRef.Helplink.stage[idAct].variable;
                            selfRef.Helplink.stage[idAct].variable=tmpVariableEle;
                            //console.log('NEW HELPLINK (AFTER SWAP)');
                           // console.log(self.Helplink.stage);
                            //console.log('ID');
                            //console.log(self.Helplink.stage[id].variable);
                            //console.log('LAST');
                           // console.log(self.Helplink.stage[last].variable);
                            selfRef.Html.removeChilds(selfRef.Helplink.stage[lastId].variable);
                            assignVariable(selfRef,ReportDataIn,idAct);
                            assignVariable(selfRef,ReportDataIn,lastId);
                            //variableNew.id=
                            //variableNew.last=  
                            //console.log('NEW HELPLINK 2 (AFTER SWAP)');
                           // console.log(self.Helplink.stage);
                            //console.log('ID');
                            //console.log(self.Helplink.stage[id].variable);
                            //console.log('LAST');
                            //console.log(self.Helplink.stage[last].variable);
                        }
                        else{
                             //console.log('STAGE ID AND LAST DONT HAVE VARIABLE - NOTHING TO DO');
                        };
                        //console.log(variableNew);
                       
                        //return variableNew;
                    }
                    /* END checkVariable function */
                    checkVariable(self,ReportData,id,last,assignVariable);
                    //let variableAll=
                  
                    /* SETUP STAGE VARIABLE ELE */ 
                       
                        self.Helplink.stage[id].stage.append(self.createChosenStageRow(ReportData,id).childNodes[0]);//,variableAll.id.all
                        self.Helplink.stage[last].stage.append(self.createChosenStageRow(ReportData,last).childNodes[0]);//,variableAll.last.all
                        
                         /* UPDATE ROW ELE */
                        //console.log(row.parentNode);
                        //console.log(row);
                        //console.log(row.nextSibling);
                        
                        //console.log(self.Helplink);
                        //console.log(self.Modal.link['dynamic']);
                       // console.log(self.Modal.link['variables']);   
           };
                
                row.tx.onclick = function(){
                    //console.log(Report);
                    //console.log(id);
                    //console.log(Report.stage[id]);
                    //self.createChosenStageRow(self,prop);
                };
                row.rm.onclick=function(){
                    //console.log('ProjectReport::createChosenStageRow().rm()');
                    //console.log(id);
                    Report.data.change='y';
                    //console.log(Report);
                    //console.log(Report.data);
                    //console.log(Report.stage[id]);
                    //console.log(variable);
                    //console.log(row);
                    //console.log(this.parentNode);
                    //console.log(self.Helplink.stage[id]);
                    self.Helplink.stage[id].stage.remove();
                    if(self.Helplink.stage[id].variable){
                        self.Helplink.stage[id].variable.remove();
                    };
                    delete Report.stage[id];
                };
                row.mvUp.onclick=function(){
                    //console.log(id);
                    //console.log(Report.stage);
                    //console.log(Report.stage[id]);
                    var last='';
                    for(const i in Report.stage){
                        //console.log('Report stage - '+i);
                        //console.log(typeof(i));
                        //console.log(typeof(id));
                        if(i===id){
                        //if(parseInt(i,10)===parseInt(id,10)){
                            //console.log('found break - get one before');
                            break;
                        }
                        last=i;
                    }
                    //console.log(last);
                    //console.log(self.Helplink);
                    swap(Report,id,last,self);
                };
                row.mvDown.onclick=function(){
                    //console.log('Actual Report id:');
                    //console.log(id);
                    //console.log('Actual Report id stage data:');
                    //console.log(Report.stage[id]);
                    var last='';
                    var found=false;
                    for(const i in Report.stage){
                        //console.log('Report stage - '+i);
                        //last=i;
                        if(found){
                            last=i;
                            break;
                        }
                        if(i===id){
                            //console.log('found - check for next');
                            found=true;
                        }
                    }
                    //console.log(self.Helplink);
                    swap(Report,id,last,self);
                    //console.log('Report:');
                    //console.log(Report);
                };
                return row.all;
        }
        catch(e){
            console.log(e);
            throw 'Application error occurred! Contact with Administrator!';
        }
    }
    createChosenStageVariable(Report,stageId,variable){     
        try{
            variable.list=document.createElement('ul');
                this.Html.addClass(variable.list,['mt-0','mb-0','text-dark']);
                variable.list.style.listStyleType='disc'; 
            
            var self=this;   
            for(const s in Report.stage[stageId].section){     
                for(const su in Report.stage[stageId].section[s].subsection){  
                    for(const r in Report.stage[stageId].section[s].subsection[su].subsectionrow){
                        //f(Stage.section[s].subsection[su].subsectionrow[r],o);
                        for(const v in Report.stage[stageId].section[s].subsection[su].subsectionrow[r].paragraph.variable){
                            let rowLi = document.createElement('li'); 
                            let spanLi = document.createElement('span');
                                this.Html.addClass(spanLi,['text-dark']);
                                spanLi.append(document.createTextNode(Report.stage[stageId].section[s].subsection[su].subsectionrow[r].paragraph.variable[v].name));
                                spanLi.style.cursor='pointer';
                                spanLi.onclick = function(){
                                    console.log('ProjectReport::createChosenStageVariable()\nSTAGE ID:');
                                    console.log(stageId);
                                    console.log(variable);
                                    //console.log(Report.stage[stageId].section[s].subsection[su].subsectionrow[r].paragraph.variable[v]);
                                    //console.log(this);
                                    //console.log(self.Modal.link['variablesEle']);
                                    /* SET VARIABLE NAME */
                                    self.Html.removeChilds(self.Modal.link['variablesLabel']);
                                    self.Modal.link['variablesLabel'].append(document.createTextNode(Report.stage[stageId].section[s].subsection[su].subsectionrow[r].paragraph.variable[v].name));
                                    /* SET VARIABLE VALUE */
                                    self.Modal.link['variablesInput'].value=Report.stage[stageId].section[s].subsection[su].subsectionrow[r].paragraph.variable[v].value;
                                    /* SHOW DIV */
                                    self.Html.removeClass(self.Modal.link['variablesEle'],'d-none');
                                    //self.t.Modal.link['variablesInput'];
                                    self.Modal.link['variablesSaveButton'].onclick=function(){
                                        if(self.Modal.link['variablesInput'].value!==Report.stage[stageId].section[s].subsection[su].subsectionrow[r].paragraph.variable[v].value){
                                             /* SET CHANGE */
                                            Report.data.change='y';
                                            Report.stage[stageId].section[s].subsection[su].subsectionrow[r].paragraph.variable[v].value=self.Modal.link['variablesInput'].value;
                                        }
                                        //console.log(self.ChosenReport[0].data.change='y');
                                        self.Html.addClass(self.Modal.link['variablesEle'],'d-none');  
                                        self.Html.removeChilds(self.Modal.link['variablesLabel']);
                                        //console.log(self.Modal.link['variablesInput'].value);
                                        Report.stage[stageId].section[s].subsection[su].subsectionrow[r].paragraph.variable[v].value=self.Modal.link['variablesInput'].value;
                                        //console.log('Actual Report change proeprty value:');
                                        //console.log(Report.data.change);
                                    };
                                };
                                spanLi.onmouseover = function (){
                                    self.Html.removeClass(this,"text-dark");
                                    self.Html.addClass(this,"text-purple");
                                };
                                spanLi.onmouseleave = function (){
                                    self.Html.removeClass(this,"text-purple");
                                    self.Html.addClass(this,"text-dark");
                                };
                                rowLi.append(spanLi);
                                variable.list.append(rowLi);  
                                variable.found=true;
                        }
                    }
                }
            }
           
        }
        catch(e){
            console.log(e);
            throw 'Application error occurred! Contact with Administrator!';
        }
       //return document.createTextNode('');
    }
    setChosenReport(){
        console.log('ProjectReport::setChosenReport()');
        //console.log(this.Modal.link['dynamic']);
        //console.log(this.ChosenReport);
        for(const report in this.ChosenReport){
             //console.log(this.ChosenReport[report]);
            for(const id in this.ChosenReport[report].stage){
                /* SET DATA */
                let variable={
                    list:{},
                    found:false,
                    all:null
                };
                this.createChosenStageVariable(this.ChosenReport[report],id,variable);
                if(variable.found){
                    this.Html.removeClass(this.Modal.link['variables'],'d-none');
                    variable.all=super.getVariableEle(this.ChosenReport[0].stage[id],variable.list);
                    this.Modal.link['variables'].append(variable.all);
                }
                let rowAll=this.createChosenStageRow(this.ChosenReport[report],id);//,variable.all
                this.Modal.link['dynamic'].append(rowAll);
                /* SET Helplink */
                this.Helplink.stage[id]={
                    stage:rowAll,
                    variable:variable.all,
                    image:{}
                 };
            }
        }
       //throw 'aaaaa';
    }
    btnShowProjectReport(){
        console.log('ProjectReport::btnShowProjectReport()');  
        var button=document.createElement('button');
            button.classList.add('btn','btn-info');
            button.appendChild(document.createTextNode('Podgląd')); 
        var self=this;    
            button.onclick= function() {
                //this.innerText='Edytuj';
                //this.innerText='Podgląd'; 
                self.showProjectReportPreview();
        };     
        return button;
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
    btnCancelProjectReport(){
        /* REMOVE TMP FILES */
        return functionBtn('cancel',createBtn('Wyjdź','btn btn-dark','cancelBtn'),'');
    }
}