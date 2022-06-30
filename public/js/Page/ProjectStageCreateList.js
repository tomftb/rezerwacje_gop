/*
 * 
 * Author: Tomasz Borczynski
 */
class ProjectStageCreateList{
    Modal=new Object();
    Items=new Object();
    Stage=new Object();
    Html=new Object();
    Xhr=new Object();
    XhrTable=new Object();
    TabStop = new Object();
    StageData = new Object();
    /* FIELD COUNTER */
    i=0;
    sectionCount=1;
    /* FLOAT */
    ejectionMultiplier=0.0;
    
    link={};
    helplink={};
    resonse; 
    Glossary={
        'text':{},
        'list':{}
    };
    /* rename data to stageData */
    data={};
    stageData={};
    fieldDisabled=false;
    ErrorStack={};
    /* CREATE TEXT DEFAULT DATABASE PROPERTY */
    Property={};
    /* CREATE TEXT DEFAULT DATABASE DEPARTMENT LIST */
    Department={};
       // subsectionRowNewLine:'n'
    //};
    constructor(Stage){
        console.log('ProjectStageCreateList::constructor()');
        /*
         * Stage - object
         */
        this.Modal=Stage.Items.Modal;
        this.Items=Stage.Items;
        this.Stage=Stage;
        this.Html=Stage.Items.Html;
        this.Xhr=Stage.Items.Xhr2;
        this.XhrTable=Stage.Items.Xhr;
        this.Glossary={
            'text':Stage.Items.Glossary['text'],
            'list':Stage.Items.Glossary['list']
        };
        this.DocPreview = new DocPreview();
        this.Utilities = new Utilities();

    }
    getXhrParm(type,task,method){
        return {
                t:type,
                u:this.Items.router+task,
                c:true,
                d:null,
                o:this,
                m:method
            };
    }
    create(){
        console.clear();
        console.log('ProjectStageCreateList::create()');
        try{
            /* SETUP EJECTION MULTIPLIER */
            this.ejectionMultiplier=parseFloat(this.Glossary.list.item.parameter.STAGE_LIST_MULTIPLIER.v);
            this.TabStop = new TabStop();
            
             /* SET STAGE CREATE TEXT DEFAULT PROPERTY */
            this.Property=this.Stage.Property.text;
            /* SET STAGE CREATE TEXT DEFAULT DEPARTMENT LIST */
            this.Department=this.Stage.Property.department;
            
            this.StageData = new StageData(this.Glossary,this.Stage.Property);
            
            
             /* SETUP CLEAR STAGE DATA */
            this.StageData.createDefault();
        } 
        catch(err){
            console.log('ProjectStageCreateList::create()\r\nERROR:');
            console.log(err);
            throw 'An Application Error Has Occurred!';
        };
        /* SETUP MODAL */
        this.setUpModal();
    }
    setUpModal(){
        console.log('ProjectStageCreateList::setUpModal()');
        try{
             /* SET DEFAULT (EMPTY) LINK TO MODAL ELEMENT*/
            this.helplink=this.getEmptyHelpLink();
            /* CLEAR DATA MODAL */
            this.Modal.clearData();
            /* SET CLOSE BUTTON */
            //console.log(this.StageData.Stage);
            this.Items.setCloseModal(this.Stage,'show',this.Stage.defaultTask+this.StageData.Stage.data.id);
            /* SET FORM */
            var form=this.Html.getForm();
            /* ASSIGN TITLE DEPARTMENT FIELD */
            this.createHead(form,this.Department.defaultDepartment);
            /* ASSING PREVIEW FIELD */
            form.appendChild(this.createPreview());
            /* ASSING WORKING FIELD */
            form.appendChild(this.createDynamicView(this.helplink));
            /* ASSIGN FORM TO ADAPTED */
            this.Modal.link['adapted'].appendChild(form);
            /* ASSING ACTION BUTTONS */
            this.createManageButton('Dodaj');
        }
        catch(err){
            console.log('ProjectStageCreateList::setUpModal()\r\nERROR:');
            console.log(err);
            this.Items.Table.setError('An Application Error Has Occurred!');
            return false;
        }
        /* IN ANOTHER BLOCK TRY CATCH TO PREVENT OPEN MODAL IF ERROR EXISTS TO HIDE ERROR SHOWED IN TABLE  */
        try{
            /* RUN MODAL */ 
            this.Items.prepareModal('Dodaj etap projektu - lista','bg-info');
        }
        catch(err){
            console.log('ProjectStageCreateList::setUpModal()\r\nERROR:');
            console.log(err);
            this.Items.Table.setError('An Application Error Has Occurred!');
        }
    }    
    details(response){   
        try{
            //console.clear();
            console.log('ProjectStageCreateList::details()');   
            /* SETUP EJECTION MULTIPLIER */
            this.ejectionMultiplier=parseFloat(this.Glossary.list.item.parameter.STAGE_LIST_MULTIPLIER.v);
            this.TabStop = new TabStop();
            /* SET STAGE CREATE TEXT DEFAULT PROPERTY */
            this.Property=this.Stage.Property.text;
            /* SET STAGE CREATE TEXT DEFAULT DEPARTMENT LIST */
            this.Department=this.Stage.Property.department;
             /* SETUP STAGE DATA */
            this.StageData = new StageData(this.Glossary,this.Stage.Property);
            this.StageData.setStage(this.Items.parseResponse(response).data);
            //this.StageData.Stage = this.Items.parseResponse(response).data;  
            //this.StageData.iSection = this.Utilities
            /* SET DEFAULT (EMPTY) LINK TO MODAL ELEMENT*/
            this.helplink=this.getEmptyHelpLink();
            /* TO DO IN FUTURE -> ADD setCloseModal multi id's */
            this.Modal.clearData();
            //this.Items.setCloseModal(this.Const,'show',this.Const.defaultTask+this.data['data']['value']['const'].i);
            /* CLEAR ERROR STACK */
            this.ErrorStack={};
            /* SET CONSTS */
            //this.allConsts=this.data['data']['value']['all'];
            this.fieldDisabled=true;

            this.Items.setCloseModal(this.Stage,'show',this.Stage.defaultTask+this.StageData.Stage.data.id);              
            /* CREATE FORM */
            var form=this.Html.getForm();
            /* ASSIGN TITLE DEPARTMENT FIELD */
            console.log(this.StageData.Stage);
            var stageDepartment = {
                0:{
                    n:this.StageData.Stage.data.departmentName,
                    v:this.StageData.Stage.data.departmentId
                }
            };
            //throw 'test-stop-1234';
            this.createHead(form,stageDepartment);      
             /* ASSING PREVIEW FIELD */           
            form.appendChild(this.createPreview());  
             /* ASSING WORKING FIELD */   
            form.appendChild(this.createDynamicView(this.helplink));
            /* APPEND FORM */
            this.Modal.link['adapted'].appendChild(form);
             /* ASSING ACTION BUTTONS */
            this.createManageButton('Edytuj');          
        }
        catch(error){
            console.log('ProjectStageCreateList::details()');
            console.log(error);
            throw 'An Application Error Has Occurred!';
            return false;
        }
        /* IN ANOTHER BLOCK TRY CATCH TO PREVENT OPEN MODAL IF ERROR EXISTS TO HIDE ERROR SHOWED IN TABLE  */
        try{
            this.Items.prepareModal('Podgląd Etapu projektu','bg-info');   
        }
        catch(error){
            console.log('ProjectStageCreateList::details()');
            console.log(error);
            throw 'An Application Error Has Occurred!';
        }
    }
    setTabStopParameters(TabStop){
        /* SETUP TABSTOP PARAMETERS */
        TabStop.setParameter(this.Glossary.text.like('parameter','^STAGE_TEXT_TABSTOP'));
        TabStop.setProperty('listMeasurement',this.Glossary.text.item.listMeasurement);
        TabStop.setProperty('tabstopAlign',this.Glossary.text.item.tabstopAlign);
        TabStop.setProperty('leadingSign',this.Glossary.text.item.leadingSign); 
    }
    block(){
        try{
            console.log('ProjectStageCreateList::block()');
            this.Xhr.run(this.getXhrParm('GET','blockConst&id='+this.data['data']['value']['const'].i,'edit'));
        }
        catch(error){
            console.log('ProjectConstCreate::block()');
            console.log(error);
            this.Html.showField(this.Modal.link['error'],'An Application Error Has Occurred!');
        }
    }
    edit(response){
        console.log('ProjectStageCreateList::edit()');
        console.log(response);
    }
    getEmptyHelpLink(){
        //console.log('ProjectStageCreateList::getEmptyHelpLink()');
        return {
            preview:{
                whole:{}
            },
            dynamic:{},
            titleDiv:{},
            section:{},
            title:{}
        };
    }
    createPreview(){
        //console.log('ProjectStageCreateList::createPreview()');
        var mainDiv=this.Html.getRow();
            mainDiv.classList.add('d-none');
            this.helplink['preview'].whole=mainDiv;
            /* this.Glossary.text.getKeyPropertyAttribute('parameter','STAGE_TEXT_BACKGROUND_COLOR','v'); */
            //this.helplink.preview.pageBackgroundColor=this.stageData.style.backgroundcolor;
        return mainDiv;
    }
    createHead(ele,department){
        //console.log('ProjectStageCreateList::createHead()');
        //console.log(this.data.data.value);
        //console.log(reponse.data.value.stage.title);
        //console.log(reponse.data.value.stage.department);
        var stageData = this.StageData.Stage;
        var titleDiv=this.Html.getRow();
            //this.helplink['titleDiv']=titleDiv;
        var titleLabelDiv=this.Html.getCol(1);
        var titleInputDiv=this.Html.getCol(11);
            titleLabelDiv.appendChild(this.createLabel('h3','Tytuł:'));
        var input=this.Html.getInput('title',this.StageData.Stage.data.title,'text');   
            input.oninput = function(){
                stageData.data.title=this.value;
            };
            input.onblur = function(){
                console.log('check data title');
            };
            input.classList.add('form-control');
            input.setAttribute('placeholder','Enter title');
            input.setAttribute('aria-describedby',"titleHelp" );
            titleInputDiv.appendChild(input);
        
            //this.helplink['title']=input;
        var helpValue=document.createTextNode('Staraj sie wprowadzić jednoznaczy tytuł.Należy wprowadzić minimalnie 1 znak, a maksymalnie 1024 znaki.');     
         
        var help=document.createElement('small');
            help.setAttribute('id','titleHelp');
            help.classList.add('form-text','text-muted');
            help.appendChild(helpValue);
            titleInputDiv.appendChild(help);
        
        titleDiv.appendChild(titleLabelDiv);
        titleDiv.appendChild(titleInputDiv);

        ele.appendChild(titleDiv);
        ele.appendChild(this.createHeadDepartment(stageData.data,department));
    }
    createHeadDepartment(stageData,defaultDepartment){
        console.log('ProjectStageCreateList::createHeadDepartment()');        
        var departmentDiv=this.Html.getRow();
        var departmentLabelDiv=this.Html.getCol(1);
        var departmentInputDiv=this.Html.getCol(11);
            departmentLabelDiv.appendChild(this.createLabel('h3','Dział:'));
        var department=this.createSelect('department','department','form-control w-100');
            department.setAttribute('aria-describedby',"departmentHelp" );
            department.appendChild(this.createSelectOption('Aktualny:',defaultDepartment));  
            department.appendChild(this.createSelectOption('Dostępne:',this.Department.avaDepartmentList)); 
        var departmentListNames = this.Department.departmentListNames; 
            department.onchange = function () {              
                stageData.departmentId = this.value;
                stageData.departmentName = departmentListNames[this.selectedIndex];  
                console.log(stageData);
            };
        this.helplink['department']=department;
        var departmentHelpValue=document.createTextNode('Wskaż dział.');     
        var departmentHelp=document.createElement('small');
            departmentHelp.setAttribute('id','departmentHelp');
            departmentHelp.classList.add('form-text','text-muted');
            departmentHelp.appendChild(departmentHelpValue);
        
        departmentInputDiv.appendChild(department);
        departmentInputDiv.appendChild(departmentHelp);
        
        departmentDiv.appendChild(departmentLabelDiv);
        departmentDiv.appendChild(departmentInputDiv);
        return departmentDiv;
    }
    createLabel(h,value){
        var titleLabelValue=document.createTextNode(value);
        var titleLabel=document.createElement(h);
            titleLabel.classList.add('text-center','font-weight-bold');
            titleLabel.appendChild(titleLabelValue);
            return titleLabel;
    }
    createDynamicView(helplink){
        console.log('ProjectStageCreateList::createDynamicView()');
        var mainDiv=this.Html.getRow();
            mainDiv.classList.add('d-block');  
        var mainDivSection=this.Html.getCol(12);
            /* CREATE TEXT STAGE SECTION */
            console.log(this.StageData.Stage);
            for(const prop in this.StageData.Stage.section){
                /* CREATE SECTION */
                mainDivSection.appendChild(this.createSection(prop,this.StageData.Stage.section,helplink));
            };
            /* APPEND SECTION */
            mainDiv.appendChild(mainDivSection);
             /* CREATE ADD BUTTON */
            mainDiv.appendChild(this.createButtonCol(this.createAddSectionButton()));//iSection
            /* CREATE TEXT SECTION PAGE TOOL*/
            mainDiv.appendChild(this.createTextPageTool(this.StageData.Stage));
            
            this.helplink['dynamic']=mainDiv;
            this.helplink['dynamicSection']=mainDivSection;
            console.log(mainDivSection);
        return mainDiv;
    }
    createSection(iSection,section,helplink){
        console.log('ProjectStageCreateList::createSection()');
        console.log('helplink:');
        console.log(helplink);
        console.log('iSection (iSectionField):');
        console.log(iSection);
        console.log('stageData:');
        console.log(section);
        
        var mainDiv=this.Html.getRow(); 
        var mainDivHeader=this.creteSectionHead(iSection); 
        var mainDivBody=this.Html.getCol(12); 
        
            helplink.section[iSection]={
                main:this.getHelpLinkSectionMain(),
                subsection:{}
            };
            for(const iSub in section[iSection].subsection){     
                /* CREATE SUBSECTION */
                mainDivBody.appendChild(this.createSubsection(iSection,iSub,section[iSection].subsection[iSub],helplink.section[iSection].subsection));
            }
            mainDivHeader.appendChild(this.createSectionTool(iSection,section,helplink)); 
            this.helplink.section[iSection].main.head=mainDivHeader;
            this.helplink.section[iSection].main.body=mainDivBody;
            mainDiv.appendChild(mainDivHeader);  
            mainDiv.appendChild(mainDivBody);   
            this.helplink.section[iSection].main.all=mainDiv;
            //console.log(mainDiv);
            return mainDiv;
    }
    creteSectionHead(isection){
        var mainDivHeader=this.Html.getCol(12); 
        var hr=document.createElement('hr');
            hr.setAttribute('class','w-100 border-1 border-secondary mt-2');//
        var h=document.createElement('h3');    
            h.setAttribute('class','w-100 text-center bg-info text-white');//
            h.innerHTML='<span class="text-muted">[WIERSZ]</span> Sekcja  nr '+isection;
            mainDivHeader.appendChild(hr);
            mainDivHeader.appendChild(h);
        return mainDivHeader;
    }
    createSubsection(iSection,iSub,subsection,helplinkSubsection){
        /*
        console.log('ProjectStageCreateList::createSubsection()');
        console.log(subsection);
        console.log('helplink');
        console.log(helplink);
        */
        /* CREATE HELPLINK SUBSECTION */
        helplinkSubsection[iSub]=this.getHelpLinkSubsection();
        
        var mainDiv=this.Html.getRow();
        var mainDivSubsection=this.Html.getCol(12);
        var mainDivBtn=this.Html.getCol(12);
        var iRow = 0;        
        var runFunction='createSubsectionRowGroup';
        var runExtendedFunction='createExtendedSubsectionRow';
        for(const iR in subsection.subsectionrow){   
            /* VALUE NEW LINE */
            //console.log(subsection.subsectionrow[iR].data.valuenewline);
            /* SET NEW HELPLINK SUBSECTION ROW */
            helplinkSubsection[iSub].row[iR]=this.getHelpLinkSubsectionRow();
            /* DYNAMIC RUN FUNCTION CREATE SUBSECTION ROW */
            mainDivSubsection.appendChild(this[runFunction](iSection,iSub,iR,subsection.subsectionrow,helplinkSubsection[iSub].row));
            //mainDivSubsection.appendChild(this[runFunction](iSection,iSub,iR,subsection.subsectionrow[iR],helplink.row[iR]));
            /* SWAP TO EXTENDED FUNCTION */
            runFunction=runExtendedFunction;
            /* INCREMENT iROW */
            iRow++;
        } 
        /*
        console.log('iRow:');
        console.log(iRow);
        */
        
        helplinkSubsection[iSub].dynamic=mainDivSubsection;
        
        mainDivBtn.appendChild(this.createButtonRow(this.addSubsectionRow(iSection,iSub,iRow,subsection.subsectionrow,helplinkSubsection[iSub])));
                        
        mainDiv.appendChild(mainDivSubsection);
                    
        mainDiv.appendChild(mainDivBtn);

        /* SET SUBSECTION HELPLINK ELEMENT */
        
        helplinkSubsection[iSub].all=mainDiv;
        return mainDiv;
    }
    getHelpLinkSubsectionRow(){
        return {
            all:{},
            value:{},
            error:{}
        };
    }
    getHelpLinkSubsection(){
       return {
            /* FOR SHOW/HIDE */
            all:{},
            /* FOR ADD */
            dynamic:{},
            /* FOR REMOVE */
            row:{}
        };
    }
    getHelpLinkSectionMain(){
        return {
                all:{},
                head:{},
                body:{}
        };
    }
    createSubsectionRowGroup(isection,isub,iSubRow,subsectionrow,helplink){
        console.log('ProjectStageCreateList::createSubsectionRowGroup()');
        var mainDiv=this.Html.getRow();
        /* SET SUBSECTION ROW */
        mainDiv.appendChild(this.createSubsectionRow(isection,isub,iSubRow,subsectionrow,helplink));
        /* CREATE ERROR DIV */
        mainDiv.appendChild(this.createTextError(helplink[iSubRow]));  
       
        
        
        //var mainDivControl = this.createControlTool(isection,isub,iSubRow,subsectionrow[iSubRow],helplink[iSubRow]);
        //var mainDivControl = this.createControlTool('Formatowanie',textTool,'Opcje listy',listTool);
        
        this.createControlTool(isection,isub,iSubRow,subsectionrow[iSubRow],helplink[iSubRow],mainDiv);
        //mainDiv.appendChild(mainDivControl);
        
        //mainDiv.appendChild(textTool);  
       //mainDiv.appendChild(listTool);  
        /* SETUP HELPLINK */
        helplink[iSubRow]['all']=mainDiv;
        return mainDiv;
    }
    createExtendedSubsectionRow(isection,isub,isubrow,subsectionrow,helplink){
        console.log('ProjectStageCreateList::createExtendedSubsectionRow()');
        var mainDiv=this.createSubsectionRowGroup(isection,isub,isubrow,subsectionrow,helplink);
            mainDiv.childNodes[3].appendChild(this.createExtendedTextTool(isection,isub,isubrow,subsectionrow[isubrow],helplink[isubrow]));  
        return mainDiv;
    }
    createSubsectionRow(isection,isub,isubrow,subsectionrow,helplink){
        /*
            console.log('ProjectStageCreateList::createSubsectionRow()\r\SUBSECTIONROW:');
            console.log('subsectionrow data');
            console.log(subsectionrow[isubrow]);
            console.log('ProjectStageCreateList::createSubsectionRow()\r\nSECTION:');
            console.log(isection);
            console.log('SUBSECTION:');
            console.log(isub);
            console.log('ROW:');
            console.log(isubrow);
            throw 'test-stop-12345';
        */
        /*
         * 
         * SET DEFAULT ATTRIBUTE d-none
         */
        var mainDivCol=this.Html.getCol(12);
        var mainDiv=this.Html.getRow();
        
        var mainDivSectionLabel=this.Html.getRow();
        var sectionLabel=document.createElement('h4');
            sectionLabel.setAttribute('class','text-center w-100');
            sectionLabel.innerHTML='<span class="text-muted">[KOLUMNA]</span> Podsekcja - '+isub+' wiersz - '+isubrow;
        var labelDiv=this.Html.getCol(1);
            labelDiv.classList.add('mr-0','pr-0');
        var valueDiv=this.Html.getCol(10);
        var removeDiv=this.Html.getCol(1);
            //removeDiv.classList.add('float-right');
            //removeDiv.appendChild(this.getRemoveButton("rmsubsection-"+isection+'-'+isub+'-'+isubrow));
            removeDiv.appendChild(this.getRemoveButton(isubrow,subsectionrow,helplink));
        var v = document.createTextNode(subsectionrow[isubrow].paragraph.property.value.toString());
        /* LABEL */
        var label=document.createElement('LABEL');
            label.setAttribute('class','col-form-label');
            label.setAttribute('for','value-'+isection+'-'+isub+'-'+isubrow);
            label.innerHTML='<b>Wartość:</b><br/><small class=" text-muted ">['+'value-'+isection+'-'+isub+'-'+isubrow+']</small>';
        //var input=document.createElement('input');
        var input=document.createElement('textarea');
            input.setAttribute('class','form-control border-1 border-info');
            input.setAttribute('placeholder','Write...');
            input.setAttribute('name','value-'+isection+'-'+isub+'-'+isubrow);
            input.appendChild(v);
           
            input.setAttribute('rows','1');
            
            input.oninput = function(){
                subsectionrow[isubrow].paragraph.property.value=this.value;
            };

            /* SET INPUT TEXT STYLE FROM PARAMETER */
            
            input.style.fontSize=subsectionrow[isubrow].paragraph.style.fontSize+subsectionrow[isubrow].paragraph.style.fontSizeMeasurement;  
            input.style.color=subsectionrow[isubrow].paragraph.style.color;
            input.style.backgroundColor=subsectionrow[isubrow].paragraph.style.backgroundColor;
            input.style.fontFamily=subsectionrow[isubrow].paragraph.style.fontFamily;
            input.style.fontWeight=this.setFontStyle(subsectionrow[isubrow].paragraph.style.fontWeight,'BOLD','NORMAL');
            input.style.fontStyle=this.setFontStyle(subsectionrow[isubrow].paragraph.style.fontStyle,'ITALIC','');
            input.style.textDecoration=this.setFontStyle(subsectionrow[isubrow].paragraph.style.underline,'UNDERLINE','')+" "+this.setFontStyle(subsectionrow[isubrow].paragraph.style['line-through'],'line-through','');
            input.style.textAlign=subsectionrow[isubrow].paragraph.style.textAlign;
            
            /* SETUP HELPLINK TO FIELD INPUT */
            helplink[isubrow]={
                text:{
                    value:input
                },
                list:{
                    /* FAKE */
                    value:document.createElement('span')
                }
            };
            //helplink[isubrow].value=input;
            
            labelDiv.appendChild(label);
            valueDiv.appendChild(input);
            
            mainDivSectionLabel.appendChild(sectionLabel);
            mainDiv.appendChild(labelDiv);
            mainDiv.appendChild(valueDiv);
            mainDiv.appendChild(removeDiv);
            
            mainDivCol.appendChild(mainDivSectionLabel);
            mainDivCol.appendChild(mainDiv);
            return mainDivCol;
    }
    createSectionTool(iSection,section,helplink){// isection
        /* */
        console.log('ProjectStageCreateList::createSectionTool()');
        console.log('section');
        console.log(section);

        var mainDivSection=this.Html.getRow();
        var tool1=this.Html.getCol(3);
        var tool2=this.Html.getCol(3);    
        var tool3=this.Html.getCol(3);
        var tool4=this.Html.getCol(3);  
        
            tool1.appendChild(this.setSectionSubSection(iSection,section[iSection].subsection,helplink.section[iSection].subsection));
            tool4.appendChild(this.createRemoveSectionButton(iSection,section,helplink.section));
            
            //throw 'test-stop';
            //console.log( tool4);
        mainDivSection.appendChild(tool1);
        mainDivSection.appendChild(tool2);
        mainDivSection.appendChild(tool3);
        mainDivSection.appendChild(tool4);
        return mainDivSection;
    }
    setSectionSubSection(iSection,subsection,helplinkSubsection){
        /*
        console.log('ProjectStageCreateList::setSectionSubSection()');
        console.log('subSection');
        console.log(section[iSection].subsection);
        console.log(subsection);
        console.log('subSection count');
        */
        var subSectionCount = Object.keys(subsection).length;
        /*
        console.log('sub section min');
        console.log(this.stageData.subsectionmin);
        console.log('sub section max');
        console.log(this.stageData.subsectionmax);
        */
        var subSectionEle=this.createTextToolSelect('section','Wskaż ilość podsekcji <small class="text-muted">[KOLUMN]</small>:',this.getSelectKey(subSectionCount-1,subSectionCount),this.getSectionCount(subSectionCount));//this.Property.subsectionMin
        var self=this;    
        var oldValue = 0;
        var oldIndex = 0;
            subSectionEle.childNodes[1].onfocus = function () { 
                /*
                console.log('ACT VALUE');
                console.log(this.value);
                console.log('ACT INDEX');
                console.log(this.selectedIndex);
                */
                oldIndex = this.selectedIndex;
                oldValue = this.value;
            };
            subSectionEle.childNodes[1].onchange = function () { 
                    oldValue=parseInt(oldValue,10);
                var newValue=parseInt(this.value,10);

                if(oldValue<newValue){
                    /* CREATE NEW STAGE OBJECT
                    console.log('CREATE STAGE');
                    console.log('iSection');
                    console.log(iSection);
                    console.log('subsection');
                    console.log(subsection);
                    console.log('helplinkSubsection');
                    console.log(helplinkSubsection);
                    console.log('OLD VALUE');
                    console.log(oldValue);
                    console.log('NEW VALUE');
                    console.log(newValue);
                    */
                    for(var i = oldValue+1; i<newValue+1 ;i++ ){
                        /* CREATE NEW STAGE OBJECT  
                        console.log('i');
                        console.log(i);
                        */
                        subsection[i]=self.StageData.createSubsection();
                        /* FIRST ALWAYS NEW LINE */
                        //subsection[i].subsectionrow[0].data.valuenewline='n';
                        subsection[i].subsectionrow[0].paragraph.property.valuenewline='y';
                        /* CREATE NEW DOM ELEMENT */
                        self.helplink.section[iSection].main.body.appendChild(self.createSubsection(iSection,i,subsection[i],helplinkSubsection));
                    }             
                    /*
                    console.log('ADD STAGE DATA');
                    console.log('IDX');
                    console.log(this.selectedIndex);
                    console.log('NEW VALUE');
                    console.log(newValue);
                    console.log('OLD VALUE');
                    console.log(oldValue);
                    console.log('OLD IDX');
                    console.log(oldIndex);
                    console.log('subsection new');
                    console.log(subsection);
                    console.log('subsection help new');
                    console.log(helplinkSubsection);
                    */
                  return true;
                }

                if (confirm('Potwierdź zmianę ilości kolumn. Zostaną bezpowrotnie usunięte kolumny!') === true) {                   
                    /*
                    console.log('confirm - DELETE STAGE DATA AND HELPLINK');
                    console.log('NEW VALUE'); 
                    console.log(newValue);    
                    console.log('IDX');
                    console.log(this.selectedIndex);
                    console.log('NEW VALUE'); 
                    console.log(newValue);    
                    console.log('OLD VALUE');
                    console.log(oldValue);
                    console.log('OLD IDX');
                    console.log(oldIndex);
                    */
                    for(var i = Object.keys(subsection).length-1; i>newValue ;i-- ){
                        /*
                        console.log('i');
                        console.log(i);
                        console.log('proeprty');
                        console.log(subsection[i]);
                        console.log(helplinkSubsection[i].all);
                        */
                        delete subsection[i];
                        helplinkSubsection[i].all.remove();
                        delete helplinkSubsection[i];
                        //classObject.helplink.section[iSection].main.body.appendChild(classObject.createSubsection(iSection,i,subsection[i],helplinkSubsection));
                       // classObject.helplink.section[iSection].main.body.appendChild(classObject.createSubsection(iSection,i,subsection[i],helplinkSubsection));
                    }
                    /*
                    console.log('subsection new');
                    console.log(subsection);
                    console.log('subsection help new');
                    console.log(helplinkSubsection);
                     */
                    return true;
                    /* DELETE STAGE AND HELPLINK */

                }
                else{
                    /*
                    console.log('NO confirm - NO DELETE STAGE DATA AND NO DELETE HELPLINK');
                    console.log('IDX');
                    console.log(this.selectedIndex);
                    console.log('NEW VALUE'); 
                    console.log(newValue);    
                    console.log('OLD VALUE');
                    console.log(oldValue);
                    console.log('OLD IDX');
                    console.log(oldIndex);
                    */
                    this.selectedIndex = oldIndex;
                    this.value = oldValue;
                }                
            };
        return subSectionEle;
    }
    createTextError(helplink){
        //console.log('ProjectStageCreateList::createTextError()');
        var mainDiv=this.Html.getCol(12); 
        //var mainDiv=this.Html.getRow(); 
            //mainDiv.classList.add('alert','alert-danger','d-none','mt-1','mb-0');//d-block
            //mainDiv.setAttribute('id',id);
        //var errorDiv=this.Html.getCol(12);
        var errorDiv=this.Html.getRow();
            errorDiv.classList.add('alert','alert-danger','d-none','mt-1','mb-0');//d-block
            errorDiv.innerText='Test ERROR';
            helplink.error=errorDiv;
            mainDiv.appendChild(errorDiv);  
           //mainDivCol.appendChild(mainDiv);
        return mainDiv;
    }
    //createControlTool(labelText,eleText,labelList,eleList){
    createControlTool(isection,isub,iSubRow,subsectionrowISubRow,helplinkISubRow,mainDiv){
        helplinkISubRow['tool']={};
        /* CREATE TEXT TOOL */
        var textTool = this.createTextToolSection(isection,isub,iSubRow,subsectionrowISubRow,helplinkISubRow);
        /* CREATE TEXT TOOL */
        var textTabStopTool = this.createTabStopSectionTool(isection,isub,iSubRow,subsectionrowISubRow,helplinkISubRow.text);
        var textTabStopToolControl = this.createControl('Tabulatory',textTabStopTool);
        /* SET LINK TO tabstopTool */
            helplinkISubRow.tool['tabstopControl']=textTabStopToolControl;
            helplinkISubRow.tool['tabstop']=textTabStopTool;
        /* CREATE LIST TOOL */
        var listTool = this.createListToolSection(isection,isub,iSubRow,subsectionrowISubRow,helplinkISubRow);
        var listToolControl = this.createControl('Opcje listy',listTool);
        /* SET LINK TO listTool */
            helplinkISubRow.tool['listControl']=listToolControl;
            helplinkISubRow.tool['list']=listTool;
        var mainCol = this.Html.getCol(12);
            mainCol.classList.add('mt-1','mb-1');
        var mainDivControl=this.Html.getRow();   
        var mainDivControlCol = this.Html.getCol(4);
        
        var mainDivControlCol1 = this.Html.getCol(1);   
        var mainDivControlCol2 = this.Html.getCol(7);
            
            
            mainDivControlCol.classList.add('btn-group','btn-group-toggle');
            mainDivControlCol.appendChild(this.createControl('Formatowanie',textTool));
            mainDivControlCol.appendChild(textTabStopToolControl);
            mainDivControlCol.appendChild(listToolControl);
            
            
            mainDivControl.appendChild(mainDivControlCol1);
            mainDivControl.appendChild(mainDivControlCol);
            mainDivControl.appendChild(mainDivControlCol2);
            mainCol.appendChild(mainDivControl);
            mainDiv.appendChild(mainCol);    
            mainDiv.appendChild(textTool);  
            mainDiv.appendChild(textTabStopTool);  
            mainDiv.appendChild(listTool);
    }
    createControl(label,ele){
        /* CONTROL */
        var control = document.createElement('button');
            control.setAttribute('type','button');
            control.classList.add('btn','btn-outline-dark','btn-sm');
            control.onclick = function (){
                //console.log(this.classList);
                //console.log(ele);
                //console.log(ele.classList);
                //console.log(ele.classList.contains('d-none'));
                if(ele.classList.contains('d-none')){
                    ele.classList.remove('d-none');
                }
                else{
                    ele.classList.add('d-none');
                };
                if(this.classList.contains('btn-outline-dark')){
                    this.classList.remove('btn-outline-dark');
                    this.classList.add('btn-dark');
                }
                else{
                    this.classList.add('btn-outline-dark');
                    this.classList.remove('btn-dark');
                };
                
            };
            control.innerText = label;
            return control; 
    }
    createTextToolSection(isection,isub,isubrow,subsectionrow,helplink){
        /*
        console.log('ProjectStageCreateList::createTextToolSection()');
        console.log(subsectionrow);
        console.log(subsectionrow.style);
        console.log('helplink');
        console.log(helplink);
        */
        var mainDivCol=this.Html.getCol(12);
            mainDivCol.classList.add('d-none','pt-1','pb-1');//,'bg-light'
            mainDivCol.style.backgroundColor='#e6e6e6';
        var mainDiv=this.Html.getRow();
            
        var tool1=this.Html.getCol(3);
        var tool2=this.Html.getCol(3);
        var tool3=this.Html.getCol(3);
        var tool4=this.Html.getCol(3);
            tool4.classList.add('pt-4');
       
            
        //var fontSize=this.valueFontSizeModification('Rozmiar tekstu:',this.getDefaultFontSize(subsectionrow.style.fontSize,subsectionrow.style.fontSize),this.getFontSizeList(subsectionrow.style.fontSize),subsectionrow.style,helplink.value);
        var fontSize=this.valueFontSizeModification('Rozmiar tekstu:',subsectionrow.paragraph.style,helplink.text.value);
       
        
        var color=this.setValueStyle('color','Kolor tekstu:',this.getDefaultColor(subsectionrow.paragraph.style.color,subsectionrow.paragraph.style.colorName),this.getColorList(subsectionrow.paragraph.style.color),subsectionrow.paragraph.style,helplink.text.value);
        var fontFamily=this.setValueStyle('fontFamily','Czcionka:',this.getDefaultFont(subsectionrow.paragraph.style.fontFamily,subsectionrow.paragraph.style.fontFamily),this.getFontList(subsectionrow.paragraph.style.fontFamily),subsectionrow.paragraph.style,helplink.text.value);
        var textAlign=this.setValueStyle('textAlign','Wyrównanie:',this.getSelectKey(subsectionrow.paragraph.style.textAlign,subsectionrow.paragraph.style.textAlignName),this.getFontAlignList(subsectionrow.paragraph.style.textAlign),subsectionrow.paragraph.style,helplink.text.value);
        var backgroundColor=this.setValueStyle('backgroundColor','Kolor tła:',this.getDefaultBackgroundColor(subsectionrow.paragraph.style.backgroundColor,subsectionrow.paragraph.style.backgroundColorName),this.getBackgroundColorList(subsectionrow.paragraph.style.backgroundColor),subsectionrow.paragraph.style,helplink.text.value);
        
        
        var tabstop=this.createTextToolTabStop(isection,isub,isubrow,subsectionrow,helplink);
        
        tool1.appendChild(fontSize);
        tool1.appendChild(color);
        tool1.appendChild(backgroundColor);
        tool2.appendChild(fontFamily);
        tool2.appendChild(textAlign);
        tool2.appendChild(tabstop);
        
         /* LEFT EJECTION */
        var leftEjection=this.createLeftEjectionInput(isection,isub,isubrow,subsectionrow,helplink);
        //var leftEjection=this.setInputStyle('Wcięcie z lewej strony:',subsectionrow.paragraph,'leftEjection','leftEjectionMeasurement','leftEjectionMin','leftEjectionMax',this.getDefaultList(this.Glossary.text.item.listMeasurement,subsectionrow.paragraph.style['leftEjectionMeasurement']));
        /* RIGHT EJECTION */
        var rightEjection=this.setInputStyle('Wcięcie z prawej strony:',subsectionrow.paragraph,'rightEjection','rightEjectionMeasurement','rightEjectionMin','rightEjectionMax',this.getMeasurementList(subsectionrow.paragraph.style['rightEjectionMeasurement']));
        /* INDENTATION */
        var indentation=this.setIndentation(subsectionrow.paragraph);
        /* PARAGRAPH TYPE */
        var paragraph=this.createParagraphType(subsectionrow.paragraph,helplink);
        tool3.appendChild(leftEjection);
        tool3.appendChild(rightEjection);
        tool3.appendChild(indentation);
        tool3.appendChild(paragraph);
       
        /* SET CSS BOLD, ITALIC ... */
        this.createTextDecorationTool(tool4,isection,isub,isubrow,subsectionrow.paragraph.style,helplink.text.value); 

        mainDiv.appendChild(tool1);
        mainDiv.appendChild(tool2);
        mainDiv.appendChild(tool3);
        mainDiv.appendChild(tool4);
      
        mainDivCol.appendChild(mainDiv);
        
        return mainDivCol;
        //return mainDiv;
    }
    createLeftEjectionInput(isection,isub,isubrow,row,helplink){
        var input = this.setInputStyle('Wcięcie z lewej strony:',row.paragraph,'leftEjection','leftEjectionMeasurement','leftEjectionMin','leftEjectionMax',this.getMeasurementList(row.paragraph.style['leftEjectionMeasurement']));
        //console.log(helplink);
        //console.log(input.childNodes[1].childNodes[0]);
        helplink.text['leftEjection']=input.childNodes[1].childNodes[0];
        //throw 'aaa';
        return input;
    }
    createTabStopSectionTool(isection,isub,isubrow,subsectionrow,helplink){
        var mainDivCol=this.Html.getCol(12);
            mainDivCol.classList.add('d-none','bg-light','pt-1','pb-1');    //'bg-light',
            //mainDivCol.style.backgroundColor='#e6e6e6';
        var mainDiv=this.Html.getRow();
            
        var tool1=this.Html.getCol(7);
        var tool2=this.Html.getCol(1);
        var tool3=this.Html.getCol(2);
        var tool4=this.Html.getCol(2);
            //tool4.classList.add('pt-4'); 
        
        tool1.appendChild(this.TabStop[isubrow].create());//subsectionrow.paragraph.tabstop,isubrow
        
        mainDiv.appendChild(tool1);
        mainDiv.appendChild(tool2);
        mainDiv.appendChild(tool3);
        mainDiv.appendChild(tool4);
            
        mainDivCol.appendChild(mainDiv);
        console.log(mainDivCol);
        return mainDivCol;
    }

   
    
    
    createListToolSection(isection,isub,isubrow,subsectionrow,helplink){
        //console.log('ProjectStageCreateList::createListToolSection()');
        var mainDivCol=this.Html.getCol(12);
            mainDivCol.classList.add('d-none','pt-1','pb-1');
            mainDivCol.style.backgroundColor='#e6e6e6';
        var mainDiv=this.Html.getRow();
        var tool1=this.Html.getCol(3);
        var tool2=this.Html.getCol(3);
        var tool3=this.Html.getCol(3);
        var tool4=this.Html.getCol(3);
            
        //console.log(this.Glossary.list);
        /* MARGIN 
        var marginLeft=this.valueFontSizeModification('Lewy margines:',subsectionrow.style,helplink.value);
        var marginRight=this.valueFontSizeModification('Prawy margines:',subsectionrow.style,helplink.value);
        var marginTop=this.valueFontSizeModification('Górny margines:',subsectionrow.style,helplink.value);
        var marginBottom=this.valueFontSizeModification('Dolny margines:',subsectionrow.style,helplink.value);
        */
        /* LIST TYPE  */
        var listType=this.setValueProperty('listType','Typ listy:',this.getSelectKey(subsectionrow.list.style.listType,subsectionrow.list.style.listTypeName),this.getListTypeList(subsectionrow.list.style.listType),subsectionrow.list.style);   
        /* LIST LEVEL  */
        var listLevel=this.createListLevelSelect(subsectionrow,helplink);
        //var listLevel=this.setValueProperty('listLevel','Poziom listy:',this.getSelectKey(subsectionrow.list.property.listLevel,subsectionrow.list.property.listLevelName),this.getListLevelList(subsectionrow.list.property.listLevel,subsectionrow.list.property.listLevelMax),subsectionrow.list.property);
        /* CONTINUE/NEW ELEMENT */
        //var newListElement=this.createNewListElement(subsectionrow);
        var newList=this.createNewListSelect(subsectionrow);
        var fontSize=this.valueFontSizeModification('Rozmiar:',subsectionrow.list.style,helplink.list.value);
        var color=this.setValueStyle('color','Kolor:',this.getDefaultColor(subsectionrow.list.style.color,subsectionrow.list.style.colorName),this.getColorList(subsectionrow.list.style.color),subsectionrow.list.style,helplink.list.value);
        var fontFamily=this.setValueStyle('fontFamily','Czcionka:',this.getDefaultFont(subsectionrow.list.style.fontFamily,subsectionrow.list.style.fontFamily),this.getFontList(subsectionrow.list.style.fontFamily),subsectionrow.list.style,helplink.list.value);
        var backgroundColor=this.setValueStyle('backgroundColor','Kolor tła:',this.getDefaultBackgroundColor(subsectionrow.list.style.backgroundColor,subsectionrow.list.style.backgroundColorName),this.getBackgroundColorList(subsectionrow.list.style.backgroundColor),subsectionrow.list.style,helplink.list.value);
        
        tool1.appendChild(fontSize);
        tool1.appendChild(color);
        tool1.appendChild(backgroundColor);
        tool1.appendChild(fontFamily);

       
        /* SET CSS BOLD, ITALIC ... */
        this.createTextDecorationTool(tool4,isection,isub,isubrow,subsectionrow.list.style,helplink.list.value); 

       
        /* */

        tool2.appendChild(listLevel);
        tool2.appendChild(listType);
        tool2.appendChild(newList);
        
        /*
        tool3.appendChild(marginLeft);
        tool3.appendChild(marginRight);
        tool3.appendChild(marginTop);
        tool3.appendChild(marginBottom);
        */
        mainDiv.appendChild(tool1);
        mainDiv.appendChild(tool2);
        mainDiv.appendChild(tool3);
        mainDiv.appendChild(tool4);
        mainDivCol.appendChild(mainDiv);
        return mainDivCol;
    }
    createListLevelSelect(row,helplink){
        //console.log('ProjectStageCreateList::createListLevelSelect()');
        var multiplier = this.ejectionMultiplier;
        var select = this.createTextToolSelect('listLevel','Poziom listy (mnożnik - '+multiplier.toString()+'):',this.getSelectKey(row.list.property.listLevel,row.list.property.listLevelName),this.getListLevelList(row.list.property.listLevel,row.list.property.listLevelMax));
        /* CLOSURE - DOMKNIĘCIE*/
        select.childNodes[1].onchange = function(){
            /* SET NEW VALUE */
            var newValue = parseInt(this.value)*multiplier;
                row.list.property['listLevel']=this.value;
                row.paragraph.style['leftEjection']=newValue;
                /* HELPLINK */
                console.log(row);
                console.log(helplink);
                helplink.text.leftEjection.value=newValue;
                //console.log(actdata);
                //console.log(alldata);
        };
        return select;
        //var select = this.setValueProperty('listLevel','Poziom listy:',this.getSelectKey(row.list.property.listLevel,row.list.property.listLevelName),this.getListLevelList(row.list.property.listLevel,row.list.property.listLevelMax),row.list.property);
            
        //return select;
    }
    createParagraphType(subsectionrow,helplink){
        var all={
            0:{
                v:'l',
                n:'Element listy'
            },
            1:{
                v:'p',
                n:'Nowy akapit'
            }
        };
        
        var run={
            method:'setToolVisibility',
            helplink:helplink,
            tool:['listControl','list']
        };
        return this.setValuePropertyExtended('paragraph','Typ:',this.getSelectKey(subsectionrow.property.paragraph,subsectionrow.property.paragraphName),this.getNewElementList(all,subsectionrow.property.paragraph),subsectionrow.property,run);
      
    }
    createNewListSelect(subsectionrow){
        var all={
            0:{
                v:'y',
                n:'Nowa lista'
            },
            1:{
                v:'n',
                n:'Kontynuacja'
            }
        };
        return this.setValueProperty('newList','Nowa Lista:',this.getSelectKey(subsectionrow.list.property.newList,subsectionrow.list.property.newListName),this.getNewElementList(all,subsectionrow.list.property.newList),subsectionrow.list.property);
    }
    createNewListElement(subsectionrow){
        var all={
            0:{
                v:'y',
                n:'Nowy element'
            },
            1:{
                v:'n',
                n:'Nowa lista'
            }
        };
        
        return this.setValueProperty('listNewElement','Nowy element:',this.getSelectKey(subsectionrow.list.property.listNewElement,subsectionrow.list.property.listNewElementName),this.getNewElementList(all,subsectionrow.list.property.listNewElement),subsectionrow.list.property);
      
    }
    createTextDecorationTool(tool4,isection,isub,isubrow,subsectionRowAttr,helplinkValue){
        //console.log('ProjectStageCreateList::createTextDecorationTool()');
        for(const prop of this.Glossary.text.getKey('decoration').entries()) {
            this.setTextDecorationToolEntry(prop[1],tool4,isection,isub,isubrow,subsectionRowAttr,helplinkValue);  
        } 
    }
    setTextDecorationToolEntry(decorationProp,tool4,isection,isub,isubrow,subsectionRowAttr,helplinkValue){
        /*
            decorationProp.n. - name
            decorationProp.v - value
         */
        var prop = this.setTextDecorationToolEntryProperties(decorationProp,subsectionRowAttr);
        
        var input = this.createTextToolCheckBox(prop.inputName,isection,isub,isubrow,prop.label,prop.check,subsectionRowAttr,helplinkValue);
        
        tool4.appendChild(input);
    }
    setToolList(value,run){
        console.log('ProjectStageCreateList::setToolList()');
        console.log(run);
        if(value==='p'){
            this.hideControl(run);
            /* FIX tabstopList SELECT */
        }
        else{
            this.showControl(run);
        }
    }
    setTextDecorationToolEntryCheck(input,check){
        /*
         * console.log('ProjectStageCreateList::setTextDecorationToolEntryCheck()');
         * console.log(check);
         */
       
        /* NO PARAMETER */
        if(check===''){
            input.setAttribute('value','1');            
        }
        if(parseInt(check,10)===1){
            input.setAttribute('value','1');
            input.setAttribute('checked',''); 
        }
        else{
           input.setAttribute('value','0');
        }     
    }
    setTextDecorationToolEntryProperties(decorationProp,subsectionRowAttr){
        /*
          console.log('ProjectStageCreateList::setTextDecorationToolEntryProperties()');
          console.log('decorationProp');
          console.log(decorationProp);
          console.log('subsectionRowStyle');
          console.log(subsectionRowAttr);
        */ 
        //throw 'stop-1273';
        if (!('v' in decorationProp) || !('n' in decorationProp)){
            //console.log('Decoration Property don\'t have key v or n');
            return false;
        };
        var fullProp={
            label:decorationProp.n,
            inputName:decorationProp.v,
            check:'',
            id:''
        };
        switch(decorationProp.v){
            case 'BOLD':
                fullProp.check=subsectionRowAttr.fontWeight;
                fullProp.inputName='fontWeight';
                fullProp.label='<b>'+decorationProp.n+'</b>';
                break;
            case 'UNDERLINE':
                fullProp.check=subsectionRowAttr.underline;
                fullProp.inputName='underline';
                fullProp.label='<u>'+decorationProp.n+'</u>';
                break;
            case 'ITALIC':
                fullProp.check=subsectionRowAttr.fontStyle;
                fullProp.inputName='fontStyle';
                fullProp.label='<i>'+decorationProp.n+'</i>';
                break;
            case 'line-through':
                fullProp.check=subsectionRowAttr['line-through'];
                fullProp.inputName='line-through';
                fullProp.label='<span style="text-decoration:line-through;">'+decorationProp.n+'</span>';
                break;
            default:
                console.log('UNAVAILABLE - '+decorationProp.v);
                break;
        }
        
        return fullProp;
    }
    createExtendedTextTool(isection,isub,isubrow,subsectionrow,helplink){
        /*
        console.log('ProjectStageCreateList::createExtendedTextTool()');
        console.log('subsectionrow:');
        console.log(subsectionrow);
        console.log('helplink:');
        console.log(helplink);
        console.log('SUBSECTIONROW DATA valuenewline:');
        console.log(subsectionrow.data.valuenewline);
        */
        //var mainDivCol=this.Html.getCol(12);
        var mainDiv=this.Html.getRow();
        var tool1=this.Html.getCol(5);
        var tool2=this.Html.getCol(5);
        var tool3=this.Html.getCol(2);
        var radio = this.createTextToolRadioButton('valuenewline-'+isection+'-'+isub+'-'+isubrow,'Tekst od nowej lini?',this.getYesNowRadio());//'valuenewline-'+isection+'-'+isub+'-'+isubrow
        var run={
            method:'setToolVisibility',
            helplink:helplink,
            tool:['tabstopControl','tabstop','listControl','list']
        };
        this.setRadioButtonExtend(radio.childNodes[1],subsectionrow.paragraph,run);
        tool1.appendChild(radio);
        
        //console.log(tool1.childNodes[0].childNodes[1]); 
        mainDiv.appendChild(tool1);
        mainDiv.appendChild(tool2);
        mainDiv.appendChild(tool3);
        return mainDiv;
        //mainDivCol.appendChild(mainDiv);
         
        //return mainDivCol;
    }
    setRadioButton(radio,subsectionrowParagraph){//link
        this.setRadioButtonExtend(radio,subsectionrowParagraph,null);
    }
    setRadioButtonExtend(radio,subsectionrowParagraph,run){
        /**/
        console.log('ProjectStageCreateList::setRadioButtonExtend()');
        console.log(radio);
        console.log('SUBSECTIONROW');
        console.log(subsectionrowParagraph);
        
        /* FIRST RUN TO SET PROPER VALUE AND onClick FUNCTION */
        var self = this;
        radio.childNodes.forEach(
            function(currentValue) {//, currentIndex, listObj
                if(currentValue.childNodes[0].value === subsectionrowParagraph.property.valuenewline){
                    /* REMOVE ATTRIBUTE no-checked */
                    currentValue.childNodes[0].removeAttribute('no-checked');
                    /* ADD ATTRIBUTE checked */
                    currentValue.childNodes[0].setAttribute('checked','');
                }
                /* CLOSURE */
                currentValue.childNodes[0].onclick = function (){
                    subsectionrowParagraph.property.valuenewline = this.value; 
                    //console.log(this.value);
                    if(run){
                        self[run.method](this.value,run);
                    };
                };
            }
        );
    }
    setToolVisibility(value,run){
        console.log('ProjectStageCreateList::setToolVisibility()');
        console.log(run);
        console.log('value');
        console.log(value);
        switch(value){
            case 'l':   
            case 'y':
                this.showControl(run);
                break;
            case 'n':
            case 'p':
                this.hideControl(run);
                break;
            default:
                break;
        }
    }
    showControl(run){
        for(const prop in run.tool){
            console.log(run.tool[prop]);
            if (run.helplink.tool[run.tool[prop]].style.display) {
                run.helplink.tool[run.tool[prop]].style.removeProperty('display');
            }
            else{
            }
        }
        
    }
    hideControl(run){
        for(const prop in run.tool){
            console.log(run.tool[prop]);
            run.helplink.tool[run.tool[prop]].style.setProperty('display', 'none');
        }
    }
    createTextToolCheckBox(id,isection,isub,isubrow,title,defaultvalue,subsectionRowAttr,helplinkValue){
        
        //if(defaultvalue)
          
        var classObject=this;
        
        var div=document.createElement('div');
            div.setAttribute('class','form-check mt-1');
        var input=document.createElement('input');
            input.setAttribute('name',id+'-'+isection+'-'+isub+'-'+isubrow);
            //input.setAttribute('id',id+'-'+isection+'-'+isub+'-'+isubrow);
            input.setAttribute('type','checkbox');
            input.classList.add('form-check-input');
            input.onclick = function (){
                console.log('ProjectStageCreateList::createTextToolCheckBox()');
                console.log('ID - '+id);
                console.log(this);
                if(this.value==='0'){
                    this.value='1';
                }
                else{
                    this.value='0';
                }
                console.log(subsectionRowAttr);
                console.log(subsectionRowAttr[id]);
                subsectionRowAttr[id]=this.value;
                classObject.setValueCheckBoxStyle(id,this.value,helplinkValue);
            };
            this.setTextDecorationToolEntryCheck(input,defaultvalue);
            
        var label=document.createElement('label');
            label.setAttribute('class','form-check-label');
            label.setAttribute('for',id+'-'+isection+'-'+isub+'-'+isubrow);
            label.innerHTML=title;
       div.appendChild(input);
       div.appendChild(label);
       return div;
    }
    createTextToolDoubleSelect(id,title,actdata,alldata,id2,actdata2,alldata2){
        console.log('ProjectStageCreateList::createTextToolDoubleSelect()');
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
    createTextToolSelect(id,title,actdata,alldata){
        //console.log('ProjectStageCreateList::createTextToolSelect()');
        //console.log(id);
        var div = this.createInputHead(title);    
        var select=this.createSelect(id,id,'form-control-sm form-control w-100');
            select.appendChild(this.Html.createOptionGroup('Domyślny:',actdata));  
            select.appendChild(this.Html.createOptionGroup('Dostępne:',alldata));  
            div.appendChild(select);
            //console.log(select);
        return div;
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
    createTextToolTabStop(isection,isub,isubrow,subsectionrow,helplink){
        console.log('ProjectStageCreateList::createTextToolTabStop()');
        console.log('TABSTOP ASSIGN TO PARAGRAPH');
        console.log(subsectionrow.paragraph.property.tabstop);
        //console.log('I SUB ROW');
        //console.log(isubrow);
        //throw 'test-stop';
        
        var deafultNone={
                0:this.Utilities.getDefaultOptionProperties(-1,'Brak')  
            };
        var all=new Object();
        
        for(const prop in subsectionrow.paragraph.tabstop){
            console.log(prop);
            console.log(subsectionrow.paragraph.tabstop);
            all[prop]=this.Utilities.getDefaultOptionProperties(prop,subsectionrow.paragraph.tabstop[prop].position+' '+subsectionrow.paragraph.tabstop[prop].measurementName+' | '+subsectionrow.paragraph.tabstop[prop].alignmentName+' | '+subsectionrow.paragraph.tabstop[prop].leadingSignName);
        }
        /*
         * 
         * SET NEW TabStop Object
         */
        this.TabStop[isubrow]= new TabStop();
        this.setTabStopParameters(this.TabStop[isubrow]);
        
        var select = this.createTextToolSelect('tabstop','Tabulacja:',deafultNone,all); 
        /* SET REFERENCES TO SELECT OPTION */
        /* SET REFERENCES TO SUBSECTION ROW PARAGRAPH */
        this.TabStop[isubrow].paragraph={
            data:subsectionrow.paragraph,
            option:select.childNodes[1].childNodes[1]
        };
        
        console.log(select);
        console.log(select.childNodes[1].childNodes[1]);
        //throw 'test-stop-1265';
        /* CLOSURE - DOMKNIĘCIE*/
        //var self = this;
        
        select.childNodes[1].onchange = function(){
            /* this.value - INDEX */
            console.log(this.value);
            //console.log(TabStop.data[this.value]);
            console.log(subsectionrow);
            subsectionrow.paragraph.property.tabstop = this.value; //parseInt(this.value,10);
        };
        /* SET DEFAULT OPTION */
        this.setDefaultOption(subsectionrow.paragraph.property.tabstop,select.childNodes[1].childNodes[1],subsectionrow.paragraph.tabstop);
        return select;
    }
    setDefaultOption(paragraphTabStop,option,tabstop){
        console.log('ProjectStageCreateList::setDefaultOption()\r\nPARAGRAPH TABSTOP:');
        console.log(paragraphTabStop);
        if(paragraphTabStop==='-1'){
            console.log('PARAGRAM TABSTOP < 0 -> RETURN FALSE');
            //console.log(paragraphTabStop);
            return false;
        }
        if(this.Utilities.countObjectProp(tabstop)===0){
            console.log('TABSTOP DATA LIST IS EMPTY -> RETURN FALSE');
            return false;
        }
        /* SET PROPER DEFAULT OPTION ON SELECT */
        //console.log('SET PROPER OPTION');
        for (let i = 0; i < option.children.length; i++) {
                if(option.children[i].value===paragraphTabStop){
                    option.children[i].selected = true;
                    return paragraphTabStop;
            }
        }
        console.log('OPTION NOT FOUND -> RETURN FALSE');
        return -1;
    }
    setValueStyle(id,title,actdata,alldata,subsectionRowStyle,helplinkValue){
        //console.log('ProjectStageCreateList::createTextToolSelectExtend()');
        var select = this.createTextToolSelect(id,title,actdata,alldata);
        /* CLOSURE - DOMKNIĘCIE*/
        select.childNodes[1].onchange = function(){
             /* SET NEW VALUE */
            subsectionRowStyle[id]=this.value;
             /* SET NEW VALUE ELEMENT STYLE/PROPERTY */
            helplinkValue.style[id]=this.value;
        };
        return select;
    }
    setValueProperty(id,title,actdata,alldata,subsectionRowProperty){
        return this.setValuePropertyExtended(id,title,actdata,alldata,subsectionRowProperty,null);
    }
    setValuePropertyExtended(id,title,actdata,alldata,subsectionRowProperty,run){
        //console.log('ProjectStageCreateList::setValueProperty()');
        
        var select = this.createTextToolSelect(id,title,actdata,alldata);
        var self = this;
        /* CLOSURE - DOMKNIĘCIE*/
        select.childNodes[1].onchange = function(){
            /* SET NEW VALUE */
            console.log('ProjectStageCreateList::setValueProperty()');
            console.log('ID:');
            console.log(id);
            console.log('VALUE:');
            console.log(this.value);
            console.log('PROPERTY:');
            console.log(subsectionRowProperty);
            console.log('RUN:');
            console.log(run);
            subsectionRowProperty[id]=this.value;
            if(run){
                self[run.method](this.value,run);
            }
            //console.log(actdata);
            //console.log(alldata);
        };
        return select;
    }
    valueFontSizeModification(title,subsectionRowStyle,helplinkValue){
        //console.log('ProjectStageCreateList::valueFontSizeModification()');
        /*
        
        console.log(subsectionRowStyle);
        console.log(this.Glossary);
        */
        var idFont = 'fontSize';
        var idMeasurement = 'fontSizeMeasurement';
        
        var actFont = this.getDefaultFontSize(subsectionRowStyle.fontSize,subsectionRowStyle.fontSize);
        var allFont = this.getFontSizeList(subsectionRowStyle.fontSize,subsectionRowStyle.fontSizeMax);
        
        var actMeasurement = this.getDefaultFontSize(subsectionRowStyle.fontSizeMeasurement,subsectionRowStyle.fontSizeMeasurement);
        var allMeasurement = this.getFontSizeMeasurementList(subsectionRowStyle.fontSizeMeasurement);
        
        var doubleSelect = this.createTextToolDoubleSelect(idFont,title,actFont,allFont,idMeasurement,actMeasurement,allMeasurement);
        //var classObject=this; 
        //console.log(doubleSelect);
        doubleSelect.childNodes[1].childNodes[0].onchange = function(){
            /*
            console.log(this);
            console.log('select 1');
            console.log(this.value);
             */
            /* SET NEW VALUE */
            subsectionRowStyle[idFont]=this.value;
            /* SET NEW VALUE ELEMENT STYLE */
            helplinkValue.style[idFont]=this.value+subsectionRowStyle[idMeasurement];
        };
        doubleSelect.childNodes[1].childNodes[1].onchange = function(){
            /*
            console.log(this);
            console.log('select 2');
            console.log(this.value);
            */
            /* SET NEW VALUE */
            subsectionRowStyle[idMeasurement]=this.value;
            /* SET NEW VALUE ELEMENT STYLE */
            helplinkValue.style[idFont]=subsectionRowStyle[idFont]+this.value;
        };
        return doubleSelect;
    }
    setInputStyle(title,subsectionrow,def,measurement,min,max,all){
        /*console.log('ProjectStageCreateList::setInputStyle()');
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
                console.log(def);
                console.log(this.value);
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
    setIndentation(subsectionrow){
        console.log('ProjectStageCreateList::setIndentation()');
        console.log('subsectionrow:');
        console.log(subsectionrow);
        console.log('measurement list:');
        //console.log(all);
        console.log('indentationSpecial list:');
        //console.log(all2);
        
        var mainDiv = this.createInputHead('Specjalne:');  
        var groupDiv=document.createElement('div');
            groupDiv.setAttribute('class','input-group');
        var selectIndentationType =  document.createElement('select');
            selectIndentationType.classList.add('form-control','form-control-sm','w-50');  
            /* DEFAULT */
            var defaultIndentationType={
                0:this.Utilities.getDefaultOptionProperties(subsectionrow.style['indentationSpecial'],subsectionrow.style['indentationSpecialName'])
            };
            selectIndentationType.appendChild(this.Html.createOptionGroup('Domyślny:',defaultIndentationType));  
            /* REST */
            selectIndentationType.appendChild(this.Html.createOptionGroup('Dostępne:',this.Utilities.getDefaultList(this.Glossary.text.item.indentationSpecial,subsectionrow.style['indentationSpecial'])));     
        var inputIndentationValue = document.createElement('INPUT');
            inputIndentationValue.setAttribute('value',subsectionrow.style['indentation']);
            inputIndentationValue.setAttribute('class','form-control form-control-sm w-25');
            inputIndentationValue.setAttribute('type','number');
            inputIndentationValue.onchange = function(){
                //console.log(subsectionrow);
                console.log(this.value);
                subsectionrow.style['indentation'] = this.value;
            };
        var selectIndentationMeasurement =  document.createElement('select');
            selectIndentationMeasurement.classList.add('form-control','form-control-sm','w-25');
            /* DEFAULT */
            var defaultIndentationMeasurement={
                0:this.Utilities.getDefaultOptionProperties(subsectionrow.style['indentationMeasurement'],subsectionrow.style['indentationMeasurement'])
            };
            selectIndentationMeasurement.appendChild(this.Html.createOptionGroup('Domyślny:',defaultIndentationMeasurement));  
            /* REST */         
            selectIndentationMeasurement.appendChild( this.Html.createOptionGroup('Dostępne',this.Utilities.getDefaultList(this.Glossary.text.item.listMeasurement,subsectionrow.style['indentationMeasurement'])));
        
        groupDiv.appendChild(selectIndentationType);
        groupDiv.appendChild(inputIndentationValue);
        groupDiv.appendChild(selectIndentationMeasurement);
        mainDiv.appendChild(groupDiv);
        return mainDiv;
    }
    setValueCheckBoxStyle(id,value,helplinkValue){
        /**/
        console.log('ProjectStageCreateList::setValueCheckBoxStyle()');
        console.log('ID:');
        console.log(id);
        console.log('VALUE:');
        console.log(value);
        console.log('HELPLINK VALUE:');
        console.log(helplinkValue);
        
        switch(id){
            case 'fontWeight':
                helplinkValue.style[id]=this.setFontStyle(value,'BOLD','NORMAL');
                break;
            case 'fontStyle':
                helplinkValue.style[id]=this.setFontStyle(value,'ITALIC','');
                break;      
            case 'underline':      
                helplinkValue.style.textDecoration=this.setValueStyleTextDecoration(helplinkValue.style.textDecoration,value,'underline');           
                break;
            case 'line-through':
                helplinkValue.style.textDecoration=this.setValueStyleTextDecoration(helplinkValue.style.textDecoration,value,'line-through');                 
                break;
            default:
                console.log('unavailable');
                break;
        }
    }
    setFontStyle(value,trueValue,falseValue){
        if(value==='1'){
            return trueValue;
        }
        return falseValue;
    }
    setValueStyleTextDecoration(actEleTextDecoration,value,styleToSetUp){
        var tmpvalue=actEleTextDecoration;
        var tmpvaluearray=tmpvalue.split(' ');
            if(value==='1'){
                return styleToSetUp+' '+tmpvalue;
            }
            else{
                tmpvalue='';
                for(var s=0;s<tmpvaluearray.length;s++){
                    tmpvaluearray[s]=tmpvaluearray[s].trim();
                    if(tmpvaluearray[s]!==styleToSetUp){
                        tmpvalue+=tmpvaluearray[s]+' ';
                    }
                }
                return tmpvalue;
            }
    }
    createTextToolRadioButton(id,title,value){
        //console.log('ProjectStageCreateList::createTextToolRadioButton()');
        //console.log(id);
        var maindiv=this.Html.getRow();
        var collabel=this.Html.getCol(12);
        var colvalue=this.Html.getCol(12);
        var mainlabel=document.createElement('p');
            mainlabel.setAttribute('class','text-info mt-1 mb-0 pb-0 w-100');
            mainlabel.innerHTML=title;  
        for (const property in value) {
            /*console.log(`${property}: ${value[property]}`);
            console.log(`${property}: ${value[property].check}`);
            console.log(`${property}: ${value[property].id}`);*/
            var div=this.Html.getRow();
                div.setAttribute('class','form-check form-check-inline');
            var input=document.createElement('input');
                input.setAttribute('class','form-check-input');
                input.setAttribute('type','radio');
                input.setAttribute('id',value[property].id);
                input.setAttribute('value',value[property].value);
                input.setAttribute(value[property].check,'');
                input.setAttribute('name',id);
            var label=document.createElement('label');
                label.setAttribute('class','form-check-label '+value[property].fontcolor);
                label.setAttribute('for',value[property].id);
                label.innerHTML=value[property].title;
            div.appendChild(input);  
            div.appendChild(label);
            colvalue.appendChild(div);
        }
        collabel.appendChild(mainlabel);
        maindiv.appendChild(collabel);  
        maindiv.appendChild(colvalue);  
        return maindiv;
    }
    getYesNowRadio(){
    //getYesNowRadio(id){
        return {
            'y':{
                check:'no-checked',
                //id:id+'-y',
                value:'y',
                title:'Tak',
                fontcolor:'text-primary'
            },
            'n':{
                check:'no-checked',
                //id:id+'-n',
                value:'n',
                title:'Nie',
                fontcolor:'text-danger'
            }
        };
    }
    getSelectKey(value,title){
        var selectKey={};
            selectKey[0]=this.Utilities.getDefaultOptionProperties(value,title);
        return selectKey;
    }
    getExtendedSelectKey(value,title,key){
        var selectKey={};
            selectKey[key]=this.Utilities.getDefaultOptionProperties(value,title);
        return selectKey;
    }
    getExtendedSelectKeyProperties(value,title,color,backgroundcolor,fontFamily){
        var selectKeyProp=this.Utilities.getDefaultOptionProperties(value,title);
            selectKeyProp.color=color;
            selectKeyProp.backgroundcolor=backgroundcolor;
            selectKeyProp.fontFamily=fontFamily;
        return selectKeyProp;
    }
    getDefaultFont(value,title){
        //console.log('ProjectStageCreateList::getDefaultFont()');
        var defaultValue=this.getSelectKey(value,title);
            defaultValue[0].fontFamily=value;
        return defaultValue;
    }
    getDefaultColor(value,title){
        var defaultValue=this.getSelectKey(value,title);
            defaultValue[0].color=value;
            //defaultValue.backgroundcolor=value; TO DO => DYNAMIC CHANGE
        return defaultValue;
    }
    getDefaultBackgroundColor(value,title){
        var defaultValue=this.getSelectKey(value,title);
            defaultValue[0].backgroundcolor=value;
            //defaultValue.fontcolor=value; TO DO => DYNAMIC CHANGE
        return defaultValue;
    }
    getDefaultFontSize(value,title){
        var defaultValue=this.getExtendedSelectKey(value,title,value);
        return defaultValue;
    }
    getSectionCount(exception){
        exception=parseInt(exception,10);
        var value={};
        var j=1;
        for(var i=0;i<this.Property.subsectionMax;i++){
            if(exception!==j){
                value[i]=this.Utilities.getDefaultOptionProperties(i,j);
            }
            j++;
        }
        return value;
    }
    getColorList(exception){
        var value={};
        for(var i=0;i<this.Glossary.text.getKeyCount('color');i++){
            if(this.Glossary.text.getKeyPropertyAttribute('color',i,'v')!==exception){
                value[i]=this.getExtendedSelectKeyProperties(this.Glossary.text.getKeyPropertyAttribute('color',i,'v'),this.Glossary.text.getKeyPropertyAttribute('color',i,'n'),this.Glossary.text.getKeyPropertyAttribute('color',i,'v'),'#FFFFFF','');
            }
        }
        return value;
    }
    getFontSizeMeasurementList(exception){
        var value={};        
        for(var i=0;i<this.Glossary.text.getKeyCount('measurement');i++){
            if(this.Glossary.text.getKeyPropertyAttribute('measurement',i,'v')!==exception){
                value[i]=this.Utilities.getDefaultOptionProperties(this.Glossary.text.getKeyPropertyAttribute('measurement',i,'v'),this.Glossary.text.getKeyPropertyAttribute('measurement',i,'n'));
            }
        }
        return value;
    }
    getMeasurementList(exception){
        return this.Utilities.getDefaultList(this.Glossary.text.item.listMeasurement,exception);
    }

    getBackgroundColorList(exception){
        var value={};
        for(var i=0;i<this.Glossary.text.getKeyCount('color');i++){
              /* TO DO -> CALCULATE FONT COLOR */
            if(this.Glossary.text.getKeyPropertyAttribute('color',i,'v')!==exception){
                value[i]=this.getExtendedSelectKeyProperties(this.Glossary.text.getKeyPropertyAttribute('color',i,'v'),this.Glossary.text.getKeyPropertyAttribute('color',i,'n'),'#FFFFFF',this.Glossary.text.getKeyPropertyAttribute('color',i,'v'),'');
            }
        }
        return value;
    }
    getFontAlignList(exception){
        var value={};        
        for(var i=0;i<this.Glossary.text.getKeyCount('textAlign');i++){
            if(this.Glossary.text.getKeyPropertyAttribute('textAlign',i,'v')!==exception){
                value[i]=this.Utilities.getDefaultOptionProperties(this.Glossary.text.getKeyPropertyAttribute('textAlign',i,'v'),this.Glossary.text.getKeyPropertyAttribute('textAlign',i,'n'));
            }
        }
        return value;
    }
    getListTypeList(exception){
        var value={};        
        for(var i=0;i<this.Glossary.list.getKeyCount('listType');i++){
            if(this.Glossary.list.getKeyPropertyAttribute('listType',i,'v')!==exception){
                value[i]=this.Utilities.getDefaultOptionProperties(this.Glossary.list.getKeyPropertyAttribute('listType',i,'v'),this.Glossary.list.getKeyPropertyAttribute('listType',i,'n'));
            }
        }
        return value;
    }
    getNewElementList(data,exception){
        var list={};        
        for(var i=0;i<Object.keys(data).length;i++){
            if(data[i].v!==exception){
                list[i]=this.Utilities.getDefaultOptionProperties(data[i].v,data[i].n);
            }
        }
        return list;
    }
    getListLevelList(exception,max){
        exception=parseInt(exception,10);
        max=parseInt(max,10);
        var value={};
        for(var i=1;i<max+1;i++){
            if(i!==exception){
                value[i]=this.Utilities.getDefaultOptionProperties(i,i);  
            }
        }
        return value;
    }
    getFontSizeList(exception,max){
        exception=parseInt(exception,10);
         max=parseInt(max,10);
        var value={};
        for(var i=2;i<max+1;){
            if(i!==exception){
                value[i]=this.Utilities.getDefaultOptionProperties(i,i);  
            }
            i=i+2;
        }
        return value;
    }
    getFontList(exception){
        //console.log('ProjectStageCreateList::getFontList()');
        var value={};
        for(var i=0;i<this.Glossary.text.getKeyCount('fontFamily');i++){
            if(this.Glossary.text.getKeyPropertyAttribute('fontFamily',i,'v')!==exception){
                value[i]=this.getExtendedSelectKeyProperties(this.Glossary.text.getKeyPropertyAttribute('fontFamily',i,'v'),this.Glossary.text.getKeyPropertyAttribute('fontFamily',i,'v'),'#000000','#FFFFFF',this.Glossary.text.getKeyPropertyAttribute('fontFamily',i,'v'));
            }
        }
        return value;
    }
    createTextPageTool(stageDataLink){
        console.log('ProjectStageCreateList::createTextPageTool()');
        var mainDivCol=this.Html.getCol(12);
            mainDivCol.classList.add('bg-light');
        var mainDiv=this.Html.getRow();
        var mainDiv3=this.Html.getRow();
        var h5=document.createElement('h5');
            h5.setAttribute('class','w-100 text-center pt-0 pb-1 mt-0 bg-secondary');// 
            h5.innerHTML='<small class="text-white">Opcje odnoszące się do całej strony:</small>';
        var toolMain1=this.Html.getCol(3);
        var toolMain2=this.Html.getCol(3);    
        var toolMain3=this.Html.getCol(3);
        var toolMain4=this.Html.getCol(3);    

        var pageBackgroundcolor=this.createTextToolSelect('backgroundcolor','Wskaż kolor tła strony:',this.getDefaultBackgroundColor(this.Glossary.text.getKeyPropertyAttribute('parameter','STAGE_TEXT_BACKGROUND_COLOR','v'),this.Glossary.text.getKeyPropertyAttribute('parameter','STAGE_TEXT_BACKGROUND_COLOR','n')),this.getBackgroundColorList());
 
            /* CLOSURE */
            pageBackgroundcolor.onchange = function (){   
                stageDataLink.style.backgroundColor = this.childNodes[1].value;          
            };
            toolMain1.appendChild(pageBackgroundcolor);
        var newPage = this.createTextToolRadioButton('newpage','Etap od nowej strony?',this.getYesNowRadio());
        /* SET BUTTON RADIO TO PROPER VALUE */
        this.setRadioButton(newPage.childNodes[1],stageDataLink);//helplink
        
        toolMain1.appendChild(newPage);    
        
        toolMain2.appendChild(this.setValueStyle('backgroundimage','Wskaż obraz tła strony:'));

        mainDiv.appendChild(h5);
        
        mainDiv3.appendChild(toolMain1);
        mainDiv3.appendChild(toolMain2);
        mainDiv3.appendChild(toolMain3);
        mainDiv3.appendChild(toolMain4);
        
        mainDivCol.appendChild(mainDiv);
        mainDivCol.appendChild(mainDiv3);
        return mainDivCol;
    }
    getRemoveButton(isubrow,subsectionrow,helplink){
        /*
        console.log('ProjectStageCreateList::getRemoveButton()');
        console.log('helplink');
        console.log(helplink);
        console.log('subsectionrow');
        console.log(subsectionrow);
        */
        var div=this.Html.removeButton();
           
          
            /* CLOSURE */
            div.onclick=function(){
                /*
                console.log('ProjectStageCreateList::getRemoveButton() onclick()');
                console.log('helplink');
                console.log(helplink);
                console.log('subsectionrow');
                console.log(subsectionrow);
                */
                /* TO DO */
                //console.log(ProjectStageCreateList.stageData);
                //console.log(ProjectStageCreateList.stageData.section[isection].subsection[isub].subsectionrow[isubrow]);
                if (confirm('Potwierdź usunięcie podsekcji') === true) {
                    helplink[isubrow].all.remove();
                    /* NEED FOR STRICT MODE - NOT ALLOWED delete helplink */
                    delete helplink[isubrow];
                    delete subsectionrow[isubrow];
                } else {
                    // NOTHING TO DO
                }
            };
        
        return(div); 
    }
    createRemoveSectionButton(iSection,section,helplink){
        /*
        console.log('ProjectStageCreateList::createRemoveSectionButton()');
        console.log('iSection');
        console.log(iSection);
        console.log('helplink');
        console.log(helplink);
        console.log('section');
        console.log(section);
        */
        var div=document.createElement('div');
            div.setAttribute('class','btn btn-danger float-right');
            div.innerText='Usuń sekcję';

            /* CLOSURE */
            div.onclick=function(){
                //console.log('HELPLINK');
                //console.log(helplink);
                //console.log('SECTION');
                //console.log(section);
                if (confirm('Potwierdź usunięcie sekcji') === true) {
                    //console.log(helplink);
                    //console.log(section);
                    helplink[iSection].main.all.remove();
                    delete helplink[iSection];
                    delete section[iSection];
                    
                } else {
                    // NOTHING TO DO
                }
                //this.updateErrorStack(id);      
            };
           
        return(div); 
    }
    createButtonCol(button){
        //console.log('ProjectStageCreateList::createButtonCol()');
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
        //var mainDivCol=this.Html.getCol(12);
        var mainDiv=this.Html.getRow();
            mainDiv.classList.add('mt-2');
        var col=this.Html.getCol(2);
            /* ADD BUTTON */
            col.appendChild(button);
        var col1=this.Html.getCol(10);
            mainDiv.appendChild(col);
            mainDiv.appendChild(col1);
            //mainDivCol.appendChild(mainDiv);
            
        //return mainDivCol;
        return mainDiv;
    }
    addSubsectionRow(isection,isubsection,iRow,subsectionrow,helplink){
        /*
        console.log('ProjectStageCreateList::addSubsectionRow()');
        console.log('helplink');
        console.log(helplink);
        */
        var i=document.createElement('i');
            i.setAttribute('class','fa fa-plus');
            i.setAttribute("aria-hidden","true");
        var div=document.createElement('div');
            div.setAttribute('class','btn btn-success btn-add float-left');
            div.appendChild(i);
        /* SET CLASS OBJECT */
        var self=this;
            div.onclick=function(){       
                console.log('ProjectStageCreateList::addSubsectionRow() click');
                console.log('iRow');
                console.log(iRow);
                /* ADD NEW stageData subsectionrow object */
                subsectionrow[iRow]=self.StageData.createSubsectionRow();
                subsectionrow[iRow].paragraph.property.valuenewline=self.Property.subsectionRowNewLine;
                //subsectionrow[iRow].list.property.newList='n';
                // listNewElement:'y',
                // listNewElementName:'Nowy element'
                console.log('subsectionrow');
                console.log(subsectionrow);
                console.log('helplink');
                console.log(self.helplink);
                
                helplink.row[iRow]=self.getHelpLinkSubsectionRow();
                
                helplink.dynamic.appendChild(self.createExtendedSubsectionRow(isection,isubsection,iRow,subsectionrow,helplink.row));

                /* INCREMENT SUBSECTION ROW */
                iRow++;
            };
        return (div);
    }
    createAddSectionButton(){
        //console.log('ProjectStageCreateList::createAddSectionButton()');
        var div=document.createElement('div');
            div.setAttribute('class','btn btn-success btn-add');
        var self=this;
            div.innerText='Dodaj sekcję';
            div.onclick=function(){
                /* TO DO
                 * CHECK IS THERE ANY ROW -> IF NO -> SWAP TO createSimleRow()
                 */
                /* SETUP NEW SECTION in stageData */                
                self.helplink['dynamicSection'].appendChild(self.createSection(self.StageData.iSection,self.StageData.createSection(),self.helplink));
            };     
        return (div);
    }
    createManageButton(btnLabel){
        var preview=document.createElement('button');
            preview.setAttribute('class','btn btn-warning');
        var previewLabel = document.createTextNode('Podgląd');
            preview.appendChild(previewLabel);
            this.setPreviewButtonAction(preview);
       
        var confirm=document.createElement('button');
            confirm.setAttribute('class','btn btn-info');
            confirm.innerText=btnLabel;
            /* SET AND SEND DATA */
            this.setSendDataAction(confirm);    
        /*
         * BUTTONS
         */
        this.Modal.link['button'].appendChild(this.Items.getCancelButton(this.Stage,'show',this.Stage.defaultTask+this.StageData.Stage.data.id));
        //this.Modal.link['button'].appendChild(this.Items.getCancelButton(this.Stage,'show',this.Stage.defaultTask+this.data.data['value']['stage'].id));
        this.Modal.link['button'].appendChild(preview);
        this.Modal.link['button'].appendChild(this.docButton());
        this.Modal.link['button'].appendChild(confirm);
    }
    docButton(){
        var doc=document.createElement('button');
            doc.setAttribute('class','btn btn-primary');
        var docLabel = document.createTextNode('DOC');
            doc.appendChild(docLabel);
        var self = this;
            doc.onclick = function(){
                console.clear();
                'generate doc file';
                console.log(self.StageData.Stage);
                var fd = new FormData();
                    fd.append('stage',JSON.stringify(self.StageData.Stage));
                var xhrRun=self.getXhrParm('POST','genProjectReportTestDoc','setFieldResponse');
                    xhrRun.o=self.Items;
                    xhrRun.d=fd;
                    self.Xhr.run(xhrRun);  
            };
        return doc;
    }
    swapPreviewButton(ele){
        /*
        console.log('ProjectStageCreateList::swapPreviewButton()');
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
        console.clear();
    }
    setEditButtonAction(ele){
        /* console.log('ProjectStageCreateList::setEditButtonAction()'); */
        var classObject=this; 
        ele.onclick = function (){
            console.log(classObject.helplink.dynamic);
            console.log(classObject.helplink.preview);
            classObject.swapPreviewButton(this);
            classObject.Html.showField(classObject.helplink.dynamic);
            classObject.Html.removeChilds(classObject.helplink.preview.whole);
            classObject.Html.hideField(classObject.helplink.preview.whole);  
        };
    }
    setPreviewButtonAction(ele){
        /* CHANGE LABEL */
        /* console.log('ProjectStageCreateList::setPreviewButtonAction()'); */
        var self=this; 
        ele.onclick = function (){
            try{
                self.swapPreviewButton(this);
                self.Html.hideField(self.helplink.dynamic);
                //classObject.setPreviewData();
                self.DocPreview.run(self.helplink,self.StageData.Stage);
                self.Html.showField(self.helplink.preview.whole);
            }
            catch(error){
                console.log('ProjectStageCreateList::setPreviewButtonAction()');
                console.log(error);
                self.Html.showField(self.Modal.link['error'],'An Application Error Has Occurred!');
            }
        };
    }
    //setUpStage(data){
        //console.log('ProjectStageCreateList::setUpStage()');
        //console.log(data.stage[0]);
        /* ADD EMPTY KEY title department*/
       // this.stageData = data.stage[0]; 
   // }

    setSendDataAction(ele){
        var self=this; 
        ele.onclick = function (){
            var fd = new FormData();
                fd.append('stage',JSON.stringify(self.StageData.Stage));
            self.checkInputData(self.StageData.Stage);
            self.sendInputData(fd);
        };
    }
    /* 
     * SEND INPUT DATA TO SEND 
     */
    sendInputData(fd){
        console.log('ProjectStageCreateList::sendInputData()');
        console.log(fd);
        if(this.errorStatus){
            console.log(this.errorStatus);
            console.log('ERROR EXIST NO SEND DATA');
            return false;
        }
        var xhrRun=this.getXhrParm('POST','confirmProjectStageText','setModalResponse');
            xhrRun.o=this.Items;
            xhrRun.d=fd;
        this.Xhr.run(xhrRun);      
    }
    checkInputData(data){
        console.log('ProjectStageCreateList::checkInputData()');
        console.log(data); 
    }
}