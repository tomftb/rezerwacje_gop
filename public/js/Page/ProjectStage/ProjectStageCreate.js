/*
 * Author: Tomasz Borczynski
 */
class ProjectStageCreate{
    Modal=new Object();
    Items=new Object();
    Stage=new Object();
    Html=new Object();
    Xhr=new Object();
    XhrTable=new Object();
    TabStop = new Object();
    StageData = new Object();
    /*
     * DOC PART:
     * b - body
     * h - head
     * f - footer
     */
    part='b';
    type='l';
    CreateProperty={
        modal:{
            title:'Dodaj etap projektu - tekst',
            bg:'bg-info'
        },
        preview:{
            f:'run'
        }
    };
    ProjectStageTool = new Object();
    /* FIELD COUNTER */
    i=0;
    sectionCount=1;    
    link={};
    helplink={};
    resonse; 
    Glossary={};
    /* rename data to stageData */
    data={};
    stageData={};
    fieldDisabled=false;
    /* CREATE TEXT DEFAULT DATABASE PROPERTY */
    Property={};
    ErrorStack=new Object();
    Utilites = new Object();
    Variable=new Object();
    VariableList=new Object();
    StageTable=new Object();
    constructor(Parent){
        //console.log('ProjectStageCreate::constructor()');
       
        /*
         * Stage - object
         */
        this.router=Parent.Items.router;
        this.appUrl=Parent.Items.appUrl;
        this.Modal=Parent.Items.Modal;
        this.Items=Parent.Items;
        this.Stage=Parent;
        this.Html=Parent.Items.Html;
        this.Xhr=Parent.Items.Xhr2;
        this.XhrTable=Parent.Items.Xhr;
        this.ErrorStack = Parent.Items.ErrorStack;
        //this.Tool=Stage.Tool;
        this.Glossary=Parent.Items.Glossary;
        this.DocPreview = new DocPreview();
        this.Utilities = Parent.Items.Utilities;
        this.ProjectStageTool = new ProjectStageTool();
        this.ProjectStageTool.setParent(this);
        this.Variable=Parent.Items.Variable;
        this.StageTable=Parent.StageTable;
        /* SECTION CLASS */
        this.Section=new Section(Parent.Items.Html,this.Utilities);
        /* ROW CLASS */
        this.SubSection=new SubSection(Parent.Items.Html,this.Utilities);
        /* Page/Head.js */
        this.ProjectStageCreateHead=new ProjectStageCreateHead(this,Parent.Items.Department);
    }
    runPrepare(response){
        try{
           this.prepare(response);
            /* SETUP MODAL */
            this[this.CreateProperty.modal.action](); 
        }
        catch(e){
            console.log(e);
            this.StageTable.Table.setError(e);
        };
    }
    prepareText(response){
        this.CreateProperty={
            modal:{
                title:'Dodaj etap projektu - tekst',
                bg:'bg-info',
                action:'setUpTextModal'
            },
            preview:{
                f:'run'
            },
            doc:{
                f:'genProjectReportTestDoc'
            },
            tool:{
                head:'getSectionHeadAllTool'
            }
        };
        this.runPrepare(response);        
    }
    prepareList(response){      
         this.CreateProperty={
            modal:{
                title:'Dodaj etap projektu - tekst',
                bg:'bg-info',
                action:'setUpListModal'
            },
            preview:{
                f:'run'
            },
            doc:{
                f:'genProjectReportTestDoc'
            },
            tool:{
                head:'getSectionHeadAllTool'
            }
        };
        this.runPrepare(response,);
    }
    prepareHeading(response){
         this.CreateProperty={
            modal:{
                title:'Dodaj nagłówek',
                bg:'bg-brown',
                action:'setUpHeadingModal'
            },
            preview:{
                f:'runHeading'
            },
            doc:{
                f:'genProjectReportTestDocHeading'
            },
            tool:{
                head:'getSectionHeadMinTool'
            }
        };
        this.runPrepare(response);
    }
    prepareFooter(response){
        this.CreateProperty={
            modal:{
                title:'Dodaj stopke',
                bg:'bg-brown',
                action:'setUpFooterModal'
            },
            preview:{
                f:'runFooter'
            },
            doc:{
                f:'genProjectReportTestDocFooter'
            },
            tool:{
                head:'getSectionHeadMinTool'
            }
        };
        this.runPrepare(response);
    }
    prepare(response){
        try{
            this.VariableList=this.Items.parseResponse(response).data.value;
                //console.log(this.VariableList);
            this.TabStop = new TabStop();
             /* SET STAGE CREATE TEXT DEFAULT PROPERTY */
            this.Property=this.Stage.Property.text;
            this.StageData = new StageData();
            this.StageData.setProperty(this.Glossary,this.Stage.Property,this.type,null,this.part);
             /* SETUP CLEAR STAGE DATA */
            this.StageData.setDefault();
            //console.log(this.ErrorStack);
            this.ErrorStack.clearStack();
        } 
        catch(err){
            console.log('ProjectStageCreate.prepare()\rERROR:');
            console.log(err);
            throw 'An Application Error Has Occurred!'; 
        };
        
    }
    setUpTextModal(){
        this.setUpModal();
        //console.log(this.Modal.link);
        /* ASSING PREVIEW FIELD, ASSING WORKING FIELD */
        this.Modal.link.form.append(this.createPreview(),this.createDynamicView(this.helplink,'createExtendedSection'));
    }
    setUpListModal(){
        this.setUpModal();
         /* ASSING PREVIEW FIELD, ASSING WORKING FIELD */
        this.Modal.link.form.append(this.createPreview(),this.createDynamicView(this.helplink,'createExtendedSection'));
    }
    setUpHeadingModal(){
        this.setUpModal();
        this.Modal.link.form.append(this.createPreview(),this.createDynamicView(this.helplink,'createSection'));
    }
    setUpFooterModal(){
        this.setUpModal();
        this.Modal.link.form.append(this.createPreview(),this.createDynamicView(this.helplink,'createSection'));
    }
    setUpModal(){
        console.log('ProjectStageCreate::setUpModal()');
        console.log(this.StageData);
        console.log(this.Modal.link);
        try{
             /* SET DEFAULT (EMPTY) LINK TO MODAL ELEMENT*/
            this.helplink=this.getEmptyHelpLink();
            /* CLEAR DATA MODAL */
            this.Modal.clearData();
            /* SET CLOSE BUTTON */
            //console.log(this.StageData.Stage); 
            this.Items.setCloseModal(this.setUndoTask(this));
            /* SET FORM */
            var form=this.Html.getForm();
            /* ASSIGN TITLE DEPARTMENT FIELD */
            this.ProjectStageCreateHead.setData(this.StageData,this.Stage.Property.department,this.Stage.Property.department.defaultDepartment,this.helplink);
            this.ProjectStageCreateHead.set(form);
            this.Modal.link.form=form;
            /* ASSIGN FORM TO ADAPTED */
            this.Modal.link['adapted'].append(form);
            /* ASSING ACTION BUTTONS */
            this.createManageButton('Dodaj');
            /* SET INFO */
            this.Modal.setInfo('Stage ID: N/A, Create user: N/A, Create date: N/A, Version: N/A');
        }
        catch(err){
            console.log('ProjectStageCreate::setUpModal()\r\nERROR:');
            console.log(err);
            this.Items.Table.setError('An Application Error Has Occurred!');
            return false;
        }
        /* IN ANOTHER BLOCK TRY CATCH TO PREVENT OPEN MODAL IF ERROR EXISTS TO HIDE ERROR SHOWED IN TABLE  */
        this.runModal();
    }

    setUndoTask(self){
        var run = function(){
            let files = self.StageData.getFiles();
            //console.log('ProjectStageCreate.setUndoTask()');
            //console.log('This object data:');
            //console.log(self);
            //console.log('Stage object data:');
            //console.log(self.Stage);
            //console.log('Items defaultTask:');
            //console.log(self.Items.default);
            //console.log(files);
            if(files.length<1){
                console.log(self);
                self.Items.closeModal();
                self.Items.reloadData(self.Items.default.object,'setResponse',self.Items.default.task+self.StageData.Stage.data.id);
            }
            else{
                let ImageTool = new ProjectStageToolFile();
                    ImageTool.setParent(self);
                    ImageTool.deleteFiles(files,self.Stage.Items,'setModalResponse');  
            }                
       };
       return run;          
    }
    detailsText(response){
        this.CreateProperty={
            modal:{
                title:'Edycja etapu',
                bg:'bg-info'
            },
            preview:{
                f:'run'
            },
            doc:{
                f:'genProjectReportTestDoc'
            },
            tool:{
                head:'getSectionHeadAllTool'
            }
        };
        this.details(response,'createExtendedSection');
    }
    detailsHeading(response){
        this.CreateProperty={
            modal:{
                title:'Edycja nagłówka',
                bg:'bg-brown'
            },
            preview:{
                f:'runHeading'
            }
            ,
            doc:{
                f:'genProjectReportTestDocHeading'
            },
            tool:{
                head:'getSectionHeadMinTool'
            }
        };
        this.details(response,'createSection');
    }
    detailsFooter(response){
        this.CreateProperty={
            modal:{
                title:'Edycja stopki',
                bg:'bg-brown'
            },
            preview:{
                f:'runFooter'
            },
            doc:{
                f:'genProjectReportTestDocFooter'
            },
            tool:{
                head:'getSectionHeadMinTool'
            }
        };
        this.details(response,'createSection');
    }
    details(response,sectionType){  
        try{
            console.log('ProjectStageCreate.details()');
            console.log(response);
            console.log(sectionType);
            //throw 'aaaaaaaaaaa';
            /* SETUP STAGE DATA */
            this.StageData = new StageData();
            this.StageData.setProperty(this.Glossary,this.Stage.Property,null,this.part);
            this.VariableList=response['variable'];
             /* IF TRUE => SEND UPDATE */
            if(this.StageData.setStage(response['stage'])){ 
                this.sendInputData(this);
            }
            
        }catch(error){
            console.log('ProjectStageCreate::details()');
            console.log(error);
            throw error;
            return false;
        }
        try{
            //console.clear();
            //console.log('ProjectStageCreate::details()');   
            /* SETUP EJECTION MULTIPLIER */
            //this.ejectionMultiplier=parseFloat(this.Glossary.list.item.parameter.STAGE_LIST_MULTIPLIER.v);
            this.TabStop = new TabStop();
            /* SET STAGE CREATE TEXT DEFAULT PROPERTY */
            this.Property=this.Stage.Property.text;
            /* SET DEFAULT (EMPTY) LINK TO MODAL ELEMENT*/
            this.helplink=this.getEmptyHelpLink();
            /* TO DO IN FUTURE -> ADD setCloseModal multi id's */
            this.Modal.clearData();
            /* CLEAR ERROR STACK */
            this.ErrorStack.clearStack();
            /* SET CONSTS */
            //this.allConsts=this.data['data']['value']['all'];
            this.fieldDisabled=true;
            //this.Stage,'show',this.Stage.defaultTask+this.StageData.Stage.data.id
            this.Items.setCloseModal(this.setUndoTask(this));              
            /* CREATE FORM */
            var form=this.Html.getForm();
            /* ASSIGN TITLE DEPARTMENT FIELD */
            //console.log(this.StageData.Stage);
            var stageDepartment = {
                0:{
                    n:this.StageData.Stage.data.departmentName,
                    v:this.StageData.Stage.data.departmentId
                }
            };
            this.ProjectStageCreateHead.setData(this.StageData,this.Stage.Property.department,stageDepartment,this.helplink);
            this.ProjectStageCreateHead.set(form);   //  form 
             /* ASSING PREVIEW FIELD, ASSING WORKING FIELD */   
            form.append(this.createPreview(),this.createDynamicView(this.helplink,sectionType));
            /* APPEND FORM */
            this.Modal.link['adapted'].append(form);
             /* ASSING ACTION BUTTONS */
            this.createManageButton('Zapisz');          
             /* SET INFO */
            this.Modal.setInfo('Stage ID: '+this.StageData.Stage.data.id+', Create user: '+this.Utilities.cutName(this.StageData.Stage.data.create_user_login,11)+' ('+this.Utilities.cutName(this.StageData.Stage.data.create_user_email,30)+'), Create date: '+this.StageData.Stage.data.create_date+', Modification user: '+this.Utilities.cutName(this.StageData.Stage.data.mod_user_login,11)+' ('+this.Utilities.cutName(this.StageData.Stage.data.mod_user_email,30)+'), Version: '+this.StageData.Stage.data.mod_date);
        }
        catch(error){
            console.log('ProjectStageCreate::details()');
            console.log(error);
            throw 'An Application Error Has Occurred!';
            return false;
        }
        /* IN ANOTHER BLOCK TRY CATCH TO PREVENT OPEN MODAL IF ERROR EXISTS TO HIDE ERROR SHOWED IN TABLE  */
        this.runModal();
        
    }
    runModal(){
        try{
            this.Items.prepareModal(this.CreateProperty.modal.title,this.CreateProperty.modal.bg);   
        }
        catch(error){
            console.log('ProjectStageCreate::details()');
            console.log(error);
            throw 'An Application Error Has Occurred!';
        }
    }
    getEmptyHelpLink(){
        //console.log('ProjectStageCreate::getEmptyHelpLink()');
        return {
            preview:{
                whole:{}
            },
            dynamic:{},
            section:{},
            input:{}
        };
    }
    createPreview(){
        //console.log('ProjectStageCreate::createPreview()');
        var mainDiv=this.Html.getRow();
            mainDiv.classList.add('d-none');
            this.helplink['preview'].whole=mainDiv;
        return mainDiv;
    }
    createDynamicView(helplink,sectionType){
        //console.log('ProjectStageCreate::createDynamicView()');
        var mainDiv=this.Html.getRow();
            mainDiv.classList.add('d-block');  
        var mainDivSection=this.Html.getCol(12);
            mainDivSection.classList.add('border');
            /* CREATE TEXT STAGE SECTION */
            //console.log(this.StageData.Stage);
            for(const prop in this.StageData.Stage.section){
                /* CREATE SECTION */
                mainDivSection.append(this[sectionType](prop,this.StageData.Stage.section,helplink));
            };
            /* APPEND SECTION */
            mainDiv.appendChild(mainDivSection);
             /* CREATE ADD BUTTON */
            mainDiv.appendChild(this.createButtonCol(this.createAddSectionButton(sectionType)));//iSection      
            this.helplink['dynamic']=mainDiv;
            this.helplink['dynamicSection']=mainDivSection;
            //console.log(mainDivSection);
        return mainDiv;
    }
    createExtendedSection(iSection,section,helplink){
        //console.log('ProjectStageCreate.createSection()');
        var mainDiv=this.createSection(iSection,section,helplink);
            //console.log(section);
            mainDiv.append(this.ProjectStageTool.getSectionFooterTool(iSection,section[iSection]));
            return mainDiv;
    }
    createSection(iSection,section,helplink){
        //console.log('ProjectStageCreate.createSection()');
        //console.log('iSection');
        //console.log(iSection);
        //console.log('helplink:');
        //console.log(helplink);
        //console.log('iSection (iSectionField):');
        //console.log(iSection);
        //console.log('stageData:');
        //console.log(section);
        
        var mainDiv=this.Html.getRow(); 
        var mainDivHeader=this.Section.getHead(iSection,this.CreateProperty.modal.bg); 
        var mainDivBody=this.Html.getCol(12); 
        
            helplink.section[iSection]={
                main:this.Section.getHelpLink(),
                subsection:{}
            };
            for(const iSub in section[iSection].subsection){     
                /* CREATE SUBSECTION */
                mainDivBody.appendChild(this.createSubsection(iSection,iSub,section[iSection].subsection[iSub],helplink.section[iSection].subsection));
            }
            mainDivHeader.appendChild(this.ProjectStageTool[this.CreateProperty.tool.head](iSection,section,helplink,this)); 
            //mainDivHeader.appendChild(this.ProjectStageTool.getSectionHeadAllTool(iSection,section,helplink,this)); 
            this.helplink.section[iSection].main.head=mainDivHeader;
            this.helplink.section[iSection].main.body=mainDivBody;
            mainDiv.appendChild(mainDivHeader);  
            mainDiv.appendChild(mainDivBody);   
            this.helplink.section[iSection].main.all=mainDiv;
            return mainDiv;
    }
    createSubsection(iSection,iSub,subsection,helplinkSubsection){
        // console.log('ProjectStageCreate::createSubsection()');
        /* CREATE HELPLINK SUBSECTION */
        helplinkSubsection[iSub]=this.SubSection.getHelpLink();
        
        var mainDiv=this.Html.getRow();
        var mainDivSubsection=this.Html.getCol(12);
        var mainDivBtn=this.Html.getCol(12);
        var iRow = 0;        
        var runFunction='getSimple';
        var runExtendedFunction='getExtended';
        for(const iR in subsection.subsectionrow){   
            /* DYNAMIC RUN FUNCTION CREATE SUBSECTION ROW */
            let StageRow=new Row(this.Html,this.Utilities,this.ProjectStageTool,this.TabStop,this.VariableList);
                StageRow.setData(iSection,iSub,iR,subsection.subsectionrow,helplinkSubsection[iSub].row);
                mainDivSubsection.append(StageRow[runFunction]());
                /* SWAP TO EXTENDED FUNCTION */
                runFunction=runExtendedFunction;
                /* INCREMENT iROW */
                iRow++;
        }         
        helplinkSubsection[iSub].dynamic=mainDivSubsection;
        mainDivBtn.appendChild(this.createButtonRow(this.addSubsectionRow(iSection,iSub,iRow,subsection.subsectionrow,helplinkSubsection[iSub])));            
        mainDiv.appendChild(mainDivSubsection);
        mainDiv.appendChild(mainDivBtn);
        /* SET SUBSECTION HELPLINK ELEMENT */
        helplinkSubsection[iSub].all=mainDiv;
        return mainDiv;
    }
    createTextToolDoubleSelect(id,title,actdata,alldata,id2,actdata2,alldata2){
        //console.log('ProjectStageCreate::createTextToolDoubleSelect()');
        var divMain = this.createInputHead(title);
        var div=document.createElement('div');
            div.setAttribute('class','input-group');//w-100 input-group  
        var select=this.createSelect(id,id,'form-control-sm form-control w-75');
            select.appendChild(this.Html.createOptionGroup('Domyślny:',actdata));  
            select.appendChild(this.Html.createOptionGroup('Dostępne:',alldata)); 
        var select2=this.createSelect(id2,id2,'form-control-sm form-control w-25');
            select2.appendChild(this.Html.createOptionGroup('Domyślny:',actdata2));  
            select2.appendChild(this.Html.createOptionGroup('Dostępne:',alldata2)); 
        div.appendChild(select);
        div.appendChild(select2);
        divMain.appendChild(div);
        return divMain;
    }

    createInputHead(title){
        var div=document.createElement('div');
            div.setAttribute('class','w-100 mt-2');
            div.classList.add('w-100','mt-2');
        var label=document.createElement('span');
            label.setAttribute('class','text-info');
            label.innerHTML=title;
        div.appendChild(label);   
        return div;
    }
    createSelect(id,name,c){
        /*
         * c - class
         */
        var select=document.createElement('select');
            select.setAttribute('class',c);
            select.setAttribute('id',id);
            select.setAttribute('name',name);
            return select;
    }
    createSelectOption(title,data){
        var optionGroup=document.createElement('optgroup');
            optionGroup.setAttribute('label',title);
            optionGroup.setAttribute('class','bg-info text-white');
            for (const property in data) {
                var option=document.createElement('option');
                    option.setAttribute('value',data[property].v);
                    option.style.color = '#000000';
                    option.style.backgroundColor = '#FFFFFF';
                    option.innerText=data[property].n;
                    optionGroup.appendChild(option);
            };
        return optionGroup;
    }
    setInputStyle(title,subsectionrow,def,measurement,min,max,all){
        /*console.log('ProjectStageCreate::setInputStyle()');
        console.log(subsectionrow);
        console.log(all);*/
        var defaultMeasurement={
            0:this.Utilities.getDefaultOptionProperties(subsectionrow.style[measurement],subsectionrow.style[measurement])
        };
        //throw 'line-stop';
        var mainDiv = this.createInputHead(title);  
        var groupDiv=document.createElement('div');
            groupDiv.setAttribute('class','input-group');
        var input = document.createElement('INPUT');
            input.setAttribute('value',subsectionrow.style[def]);
            input.setAttribute('class','form-control form-control-sm w-75');
            input.setAttribute('type','number');
            input.onchange = function(){
                //console.log(def);
                //console.log(this.value);
                subsectionrow.style[def]=this.value;
                //console.log(subsectionrow.style[def]);
            };
        var select=document.createElement('select');
            select.classList.add('form-control','form-control-sm','w-25');
            select.appendChild(this.Html.createOptionGroup('Domyślny:',defaultMeasurement));  
            select.appendChild(this.Html.createOptionGroup('Dostępne:',all)); 
        groupDiv.appendChild(input);
        groupDiv.appendChild(select);
        mainDiv.appendChild(groupDiv);
        return mainDiv;
    }
    createButtonCol(button){
        //console.log('ProjectStageCreate::createButtonCol()');
        /*
         * ADD BUTTON ROW
         */
        var mainDiv=this.Html.getCol(12);
            mainDiv.classList.add('mt-2','pb-2');
        var row=this.Html.getRow();
        var col=this.Html.getCol(2);
            /* ADD BUTTON */
            col.appendChild(button);
        var col1=this.Html.getCol(10);
            row.appendChild(col);
            row.appendChild(col1);
            mainDiv.appendChild(row);
        return mainDiv;
    }
    createButtonRow(button){
        /*
         * ADD BUTTON ROW
         */
        var mainDiv=this.Html.getRow();
            mainDiv.classList.add('mt-2');
        var col=this.Html.getCol(2);
            /* ADD BUTTON */
            col.appendChild(button);
        var col1=this.Html.getCol(10);
            mainDiv.appendChild(col);
            mainDiv.appendChild(col1);
        return mainDiv;
    }
    addSubsectionRow(isection,isubsection,iRow,subsectionrow,helplink){
        /* console.log('ProjectStageCreate::addSubsectionRow()'); */
        var i=document.createElement('i');
            i.setAttribute('class','fa fa-plus');
            i.setAttribute("aria-hidden","true");
        var div=document.createElement('div');
            div.setAttribute('class','btn btn-success btn-add float-left');
            div.appendChild(i);
        /* SET CLASS OBJECT */
        var self=this;
            div.onclick=function(){       
                console.log('ProjectStageCreate::addSubsectionRow() onclick()');
                /* ADD NEW stageData subsectionrow object */
                subsectionrow[iRow]=self.StageData.createSubsectionRow(iRow);
                subsectionrow[iRow].paragraph.property.valuenewline=self.Property.subsectionRowNewLine;
                let StageRow=new Row(self.Html,self.Utilities,self.ProjectStageTool,self.TabStop,self.VariableList);
                    StageRow.setData(isection,isubsection,iRow,subsectionrow,helplink.row);
                    helplink.dynamic.appendChild(StageRow.getExtended());  
                /* INCREMENT SUBSECTION ROW */
                iRow++;
            };
        return (div);
    }
    createAddSectionButton(sectionType){
        //console.log('ProjectStageCreate::createAddSectionButton()');
        var div=document.createElement('div');
            div.setAttribute('class','btn btn-success btn-add');
        var self=this;
            div.innerText='Dodaj sekcję';
            div.onclick=function(){
                /* TO DO
                 * CHECK IS THERE ANY ROW -> IF NO -> SWAP TO createSimleRow()
                 */
                /* SETUP NEW SECTION in stageData */                
                self.helplink['dynamicSection'].appendChild(self[sectionType](self.StageData.iSection,self.StageData.createSection(),self.helplink));
            };     
        return (div);
    }
    createManageButton(btnLabel){
        var preview=document.createElement('button');
            preview.setAttribute('class','btn btn-warning');
        var previewLabel = document.createTextNode('Podgląd');
            preview.appendChild(previewLabel);
            this.setPreviewButtonAction(preview); 

        //this.Items.getCancelButton(this.Stage,'show',this.Stage.defaultTask+this.StageData.Stage.data.id);
        this.Modal.link['button'].appendChild(this.getCancelButton());
        //this.Modal.link['button'].appendChild(this.Items.getCancelButton(this.Stage,'show',this.Stage.defaultTask+this.data.data['value']['stage'].id));
        this.Modal.link['button'].appendChild(preview);
        this.Modal.link['button'].appendChild(this.getDocButton());
        this.Modal.link['button'].appendChild(this.getConfirmButton(btnLabel));
    }
    getCancelButton(){
        var cancel=this.Html.cancelButton('Wyjdź');
        var self = this;
        var run = this.setUndoTask(this);
            cancel.onclick = 
            cancel.onclick=function(){
               //console.clear();
               //console.log('ProjectStageCreate::getCancelButton() onclick()');
               //onsole.log(self.ErrorStack);
               if(self.ErrorStack.check()){
                    if (confirm('Opuścić okno bez zapisu?') === true) {
                        //run();
                        self.Items.closeModal();
                        return false;
                    }
                    else{ 
                        return false;
                    }
               }
               if (confirm('Wyjść?') === true) {
                    run();
               }
               else{ 
               }
            };
    return cancel;
    }
    getDocButton(){
        var doc=document.createElement('button');
            doc.setAttribute('class','btn btn-primary');
        var docLabel = document.createTextNode('DOC');
            doc.appendChild(docLabel);
        var self = this;
            doc.onclick = function(){
                //console.clear();
                if(self.ErrorStack.check()){return false;};
                self.Html.hideField(self.Modal.link['error']);
                //console.log(self.StageData.Stage);
                var fd = new FormData();
                    fd.append('stage',JSON.stringify(self.StageData.Stage));
                    self.Xhr.run({
                        t:'POST',
                        u:self.router+self.CreateProperty.doc.f,
                        c:true,
                        d:fd,
                        o:self.Items,
                        m:'uploadFile'
                    }); 
            };
            this.ErrorStack.setBlockEle(doc);
        return doc;
    }
    swapPreviewButton(ele){
        /*
        console.log('ProjectStageCreate::swapPreviewButton()');
        console.log(ele.childNodes[0].textContent);
        console.log(ele.childNodes[0]);
        */
        /* CHANGE BUTTON LABEL/FUNCTION */
        if(ele.childNodes[0].textContent==='Podgląd'){
            //ele.childNodes[0].textContent='Edytuj';
            ele.innerText='Edytuj';
            this.setEditButtonAction(ele);
        }
        else{
            ele.innerText='Podgląd';
            this.setPreviewButtonAction(ele);
        }
        //console.clear();
    }
    setEditButtonAction(ele){
        /* console.log('ProjectStageCreate::setEditButtonAction()'); */
        var self=this; 
        ele.onclick = function (){
            self.swapPreviewButton(this);
            self.Html.showField(self.helplink.dynamic);
            self.Html.removeChilds(self.helplink.preview.whole);
            self.Html.hideField(self.helplink.preview.whole);  
        };
    }
    setPreviewButtonAction(ele){
        /* CHANGE LABEL */
        /* console.log('ProjectStageCreate::setPreviewButtonAction()'); */
        var self=this; 
        ele.onclick = function (){
            try{
                self.swapPreviewButton(this);
                self.Html.hideField(self.helplink.dynamic);
                self.DocPreview[self.CreateProperty.preview.f](self.helplink,self.StageData.Stage);
                self.Html.showField(self.helplink.preview.whole);
            }
            catch(error){
                console.log('ProjectStageCreate::setPreviewButtonAction()');
                console.log(error);
                self.Html.showField(self.Modal.link['error'],'An Application Error Has Occurred!');
            }
        };
    }
    getConfirmButton(btnLabel){
        var confirm = document.createElement('button');
            confirm.setAttribute('class','btn btn-info');
            confirm.innerText=btnLabel;  
        var self=this; 
            confirm.onclick = function (){
                this.innerText='Zapisz';
                //console.clear();
                if(self.ErrorStack.check()){ return false;}
                self.Html.hideField(self.Modal.link['error']);
                self.checkInputData(self.StageData.Stage);
                self.sendInputData(self);
            };
            //this.helplink['confirm']=confirm;
            this.ErrorStack.setBlockEle(confirm);
        return confirm;
    }
    /* 
     * SEND INPUT DATA TO SEND 
     */
    sendInputData(self){
        //console.log('ProjectStageCreate.sendInputData()');
        if(self.ErrorStack.check()){ return false;}
        var fd = new FormData();
            fd.append('stage',JSON.stringify(self.StageData.Stage));
        this.Xhr.run({
                t:'POST',
                u:this.router+'confirmProjectStageText',
                c:true,
                d:fd,
                o:self,
                m:'Save'
        });      
    }
    checkInputData(data){
        //console.log('ProjectStageCreate.checkInputData()');
        //console.log(data); 
        //console.log(this.ErrorStack);
        //console.log(this.helplink);
        this.checkInput('title');
    }
    checkInput(key){
        //console.log('ProjectStageCreate.checkInput()');
        //console.log(key);
        //console.log(this.helplink.input[key]);
        try{
            var length=(this.helplink.input[key].input.value.trim()).length;
                //console.log(length);
            if(length<1){
                throw 'Wprowadź minimalną ilość znaków!'; 
            }
            if(length>1024){
                throw 'Przekroczono maksymalną ilość znaków - '+length+'!';
                //this.ErrorStack.add(key,'Przekroczono maksymalną ilość znaków!'); 
            }
            /* check ket exist, if exist remove */
            this.ErrorStack.remove(key);     
            this.Html.addClass(this.helplink.input[key].error,'d-none');
            this.Html.removeChilds(this.helplink.input[key].error);
        }
        catch(e){
            this.ErrorStack.add(key,e);
            this.Html.removeClass(this.helplink.input[key].error,'d-none');
            this.helplink.input[key].error.appendChild(document.createTextNode(e));
        }
        //console.log(this.ErrorStack);
        //console.log(this.ErrorStack.check());
    }
    Save(response){
        console.log('ProjectStageCreate::Save');
        //console.log(response);
        var jsonResponse=this.Items.setFieldResponse(response);
            console.log(jsonResponse);
         
        if(!jsonResponse){
            return false;
        }        
        try{
             /* UPDATE STAGE DATA */
            this.StageData.updateStageData(jsonResponse.data.value);
            /* CLEAR INPUT FILE */
            this.Modal.setSuccess(jsonResponse.data.function);
        }
        catch(e){
            this.ErrorStack.add('updatestage',e);
            this.Modal.setError('An Application Error Has Occurred!');
        }
    }
}