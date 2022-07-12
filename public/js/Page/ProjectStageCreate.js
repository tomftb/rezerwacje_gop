/*
 * 
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
    //Tool = new Object();
    ProjectStageTool = new Object();
    /* FIELD COUNTER */
    i=0;
    sectionCount=1;
    /* FLOAT */
    //ejectionMultiplier=0.0;
    
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
        console.log('ProjectStageCreate::constructor()');
        /*
         * Stage - object
         */
        this.Modal=Stage.Items.Modal;
        this.Items=Stage.Items;
        this.Stage=Stage;
        this.Html=Stage.Items.Html;
        this.Xhr=Stage.Items.Xhr2;
        this.XhrTable=Stage.Items.Xhr;
        //this.Tool=Stage.Tool;
        this.Glossary={
            'text':Stage.Items.Glossary['text'],
            'list':Stage.Items.Glossary['list']
        };
        this.DocPreview = new DocPreview();
        this.Utilities = new Utilities();
        this.ProjectStageTool = new ProjectStageTool(this);
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
    create(type){
        console.clear();
        console.log('ProjectStageCreate::create(type)');
        try{
            /* SETUP EJECTION MULTIPLIER */
            //this.ejectionMultiplier=parseFloat(this.Glossary.list.item.parameter.STAGE_LIST_MULTIPLIER.v);
            this.TabStop = new TabStop();
             /* SET STAGE CREATE TEXT DEFAULT PROPERTY */
            this.Property=this.Stage.Property.text;
            /* SET STAGE CREATE TEXT DEFAULT DEPARTMENT LIST */
            this.Department=this.Stage.Property.department;
            this.StageData = new StageData(this.Glossary,this.Stage.Property,type,null);
             /* SETUP CLEAR STAGE DATA */
            this.StageData.createDefault();
        } 
        catch(err){
            console.log('ProjectStageCreate::create()\r\nERROR:');
            console.log(err);
            throw 'An Application Error Has Occurred!';
        };
        /* SETUP MODAL */
        this.setUpModal();
    }
    setUpModal(){
        console.log('ProjectStageCreate::setUpModal()');
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
            console.log('ProjectStageCreate::setUpModal()\r\nERROR:');
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
            console.log('ProjectStageCreate::setUpModal()\r\nERROR:');
            console.log(err);
            this.Items.Table.setError('An Application Error Has Occurred!');
        }
    }    
    details(response){  
        try{
            /* SETUP STAGE DATA */
            this.StageData = new StageData(this.Glossary,this.Stage.Property);
            this.StageData.setStage(this.Items.parseResponse(response).data);
        }catch(error){
            console.log('ProjectStageCreate::details()');
            console.log(error);
            throw error;
            return false;
        }
        try{
            //console.clear();
            console.log('ProjectStageCreate::details()');   
            /* SETUP EJECTION MULTIPLIER */
            //this.ejectionMultiplier=parseFloat(this.Glossary.list.item.parameter.STAGE_LIST_MULTIPLIER.v);
            this.TabStop = new TabStop();
            /* SET STAGE CREATE TEXT DEFAULT PROPERTY */
            this.Property=this.Stage.Property.text;
            /* SET STAGE CREATE TEXT DEFAULT DEPARTMENT LIST */
            this.Department=this.Stage.Property.department;
            /* SET DEFAULT (EMPTY) LINK TO MODAL ELEMENT*/
            this.helplink=this.getEmptyHelpLink();
            /* TO DO IN FUTURE -> ADD setCloseModal multi id's */
            this.Modal.clearData();
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
            console.log('ProjectStageCreate::details()');
            console.log(error);
            throw 'An Application Error Has Occurred!';
            return false;
        }
        /* IN ANOTHER BLOCK TRY CATCH TO PREVENT OPEN MODAL IF ERROR EXISTS TO HIDE ERROR SHOWED IN TABLE  */
        try{
            this.Items.prepareModal('Podgląd Etapu projektu','bg-info');   
        }
        catch(error){
            console.log('ProjectStageCreate::details()');
            console.log(error);
            throw 'An Application Error Has Occurred!';
        }
    }
    block(){
        try{
            console.log('ProjectStageCreate::block()');
            this.Xhr.run(this.getXhrParm('GET','blockConst&id='+this.data['data']['value']['const'].i,'edit'));
        }
        catch(error){
            console.log('ProjectConstCreate::block()');
            console.log(error);
            this.Html.showField(this.Modal.link['error'],'An Application Error Has Occurred!');
        }
    }
    edit(response){
        console.log('ProjectStageCreate::edit()');
        console.log(response);
    }
    getEmptyHelpLink(){
        //console.log('ProjectStageCreate::getEmptyHelpLink()');
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
        //console.log('ProjectStageCreate::createPreview()');
        var mainDiv=this.Html.getRow();
            mainDiv.classList.add('d-none');
            this.helplink['preview'].whole=mainDiv;
        return mainDiv;
    }
    createHead(ele,department){
        /* console.log('ProjectStageCreate::createHead()'); */
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
        console.log('ProjectStageCreate::createHeadDepartment()');        
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
        console.log('ProjectStageCreate::createDynamicView()');
        var mainDiv=this.Html.getRow();
            mainDiv.classList.add('d-block');  
        var mainDivSection=this.Html.getCol(12);
            mainDivSection.classList.add('border');
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
            this.helplink['dynamic']=mainDiv;
            this.helplink['dynamicSection']=mainDivSection;
            console.log(mainDivSection);
        return mainDiv;
    }
    createSection(iSection,section,helplink){
        console.log('ProjectStageCreate::createSection()');
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
            console.log(mainDiv);
            mainDiv.appendChild(this.createSectionPageTool(section[iSection],helplink.section[iSection]));
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
        // console.log('ProjectStageCreate::createSubsection()');
        /* CREATE HELPLINK SUBSECTION */
        helplinkSubsection[iSub]=this.getHelpLinkSubsection();
        
        var mainDiv=this.Html.getRow();
        var mainDivSubsection=this.Html.getCol(12);
        var mainDivBtn=this.Html.getCol(12);
        var iRow = 0;        
        var runFunction='createSubsectionRowGroup';
        var runExtendedFunction='createExtendedSubsectionRow';
        for(const iR in subsection.subsectionrow){   
            /* SET NEW HELPLINK SUBSECTION ROW */
            helplinkSubsection[iSub].row[iR]=this.getHelpLinkSubsectionRow();
            /* DYNAMIC RUN FUNCTION CREATE SUBSECTION ROW */
            mainDivSubsection.appendChild(this[runFunction](iSection,iSub,iR,subsection.subsectionrow,helplinkSubsection[iSub].row));
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
        console.log('ProjectStageCreate::createSubsectionRowGroup()');
        var mainDiv=this.Html.getRow();
        /* SET SUBSECTION ROW */
        mainDiv.appendChild(this.createSubsectionRow(isection,isub,iSubRow,subsectionrow,helplink));
        /* CREATE ERROR DIV */
        mainDiv.appendChild(this.createTextError(helplink[iSubRow]));  
        this.ProjectStageTool.getControlTool(isection,isub,iSubRow,subsectionrow[iSubRow],helplink[iSubRow],mainDiv,this.TabStop);
        /* SETUP HELPLINK */
        helplink[iSubRow]['all']=mainDiv;
        return mainDiv;
    }
    createExtendedSubsectionRow(isection,isub,isubrow,subsectionrow,helplink){
        console.log('ProjectStageCreate::createExtendedSubsectionRow()');
        var mainDiv=this.createSubsectionRowGroup(isection,isub,isubrow,subsectionrow,helplink);
            mainDiv.childNodes[3].appendChild(this.createExtendedTextTool(isection,isub,isubrow,subsectionrow[isubrow],helplink[isubrow]));  
        return mainDiv;
    }
    createSubsectionRow(isection,isub,isubrow,subsectionrow,helplink){
        /* console.log('ProjectStageCreate::createSubsectionRow()'); */
        /*
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
        console.log('ProjectStageCreate::createSectionTool()');
        console.log('section');
        console.log(section);
        var mainDivSection=this.Html.getRow();
        var tool1=this.Html.getCol(3);
        var tool2=this.Html.getCol(3);    
        var tool3=this.Html.getCol(3);
        var tool4=this.Html.getCol(3);  
        
            tool1.appendChild(this.ProjectStageTool.setSectionSubSection(iSection,section[iSection].subsection,helplink.section[iSection].subsection,this));
            tool4.appendChild(this.createRemoveSectionButton(iSection,section,helplink.section));

        mainDivSection.appendChild(tool1);
        mainDivSection.appendChild(tool2);
        mainDivSection.appendChild(tool3);
        mainDivSection.appendChild(tool4);
        return mainDivSection;
    }

    createTextError(helplink){
        /* console.log('ProjectStageCreate::createTextError()'); */
        var mainDiv=this.Html.getCol(12); 
        var errorDiv=this.Html.getRow();
            errorDiv.classList.add('alert','alert-danger','d-none','mt-1','mb-0');//d-block
            errorDiv.innerText='Test ERROR';
            helplink.error=errorDiv;
            mainDiv.appendChild(errorDiv);  
        return mainDiv;
    }
    setToolList(value,run){
        console.log('ProjectStageCreate::setToolList()');
        console.log(run);
        if(value==='p'){
            this.hideControl(run);
            /* FIX tabstopList SELECT */
        }
        else{
            this.showControl(run);
        }
    }
    createExtendedTextTool(isection,isub,isubrow,subsectionrow,helplink){
        // console.log('ProjectStageCreate::createExtendedTextTool()');
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
        mainDiv.appendChild(tool1);
        mainDiv.appendChild(tool2);
        mainDiv.appendChild(tool3);
        return mainDiv;
    }
    setRadioButton(radio,subsectionrowParagraph){//link
        this.setRadioButtonExtend(radio,subsectionrowParagraph,null);
    }
    setRadioButtonExtend(radio,subsectionrowParagraph,run){
        /**/
        console.log('ProjectStageCreate::setRadioButtonExtend()');
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
    createTextToolDoubleSelect(id,title,actdata,alldata,id2,actdata2,alldata2){
        console.log('ProjectStageCreate::createTextToolDoubleSelect()');
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
    setFontStyle(value,trueValue,falseValue){
        if(value==='1'){
            return trueValue;
        }
        return falseValue;
    }
    createTextToolRadioButton(id,title,value){
        //console.log('ProjectStageCreate::createTextToolRadioButton()');
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
    createSectionPageTool(section,helplink){
        console.log('ProjectStageCreate::createSectionPageTool()');
        console.log(section);
        console.log(helplink);
        
        var mainDivCol=this.Html.getCol(12);
            mainDivCol.classList.add('bg-light','mt-1');
            mainDivCol.style.backgroundColor='#e6e6e6';
        var mainDiv=this.Html.getRow();
        var mainDiv3=this.Html.getRow();
        var h5=document.createElement('h5');
            h5.setAttribute('class','w-100 text-center text-bold pt-0 pb-1 mt-0 bg-secondary');//  text-center
            //h5.style.backgroundColor='#e6e6e6';
            h5.innerHTML='<small class="text-white">Opcje odnoszące się do całej sekcji:</small>';//text-info
        var toolMain1=this.Html.getCol(3);
        var toolMain2=this.Html.getCol(3);    
        var toolMain3=this.Html.getCol(3);
        var toolMain4=this.Html.getCol(3);    

        toolMain1.appendChild(this.ProjectStageTool.getSimpleBackgroundColor(section.style));
        var newPage = this.createTextToolRadioButton('newpage','Sekcja od nowej strony?',this.getYesNowRadio());
        /* SET BUTTON RADIO TO PROPER VALUE */

        toolMain1.appendChild(newPage);    
        
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
        /* console.log('ProjectStageCreate::getRemoveButton()'); */
        var div=this.Html.removeButton();
            /* CLOSURE */
            div.onclick=function(){
                /* console.log('ProjectStageCreate::getRemoveButton() onclick()'); */
                /* TO DO */
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
        /* console.log('ProjectStageCreate::createRemoveSectionButton()'); */
        var div=document.createElement('div');
            div.setAttribute('class','btn btn-danger float-right');
            div.innerText='Usuń sekcję';

            /* CLOSURE */
            div.onclick=function(){
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
                subsectionrow[iRow]=self.StageData.createSubsectionRow();
                subsectionrow[iRow].paragraph.property.valuenewline=self.Property.subsectionRowNewLine;                
                helplink.row[iRow]=self.getHelpLinkSubsectionRow();
                
                helplink.dynamic.appendChild(self.createExtendedSubsectionRow(isection,isubsection,iRow,subsectionrow,helplink.row));

                /* INCREMENT SUBSECTION ROW */
                iRow++;
            };
        return (div);
    }
    createAddSectionButton(){
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
                var xhrRun=self.getXhrParm('POST','genProjectReportTestDoc','uploadFile');
                    xhrRun.o=self.Items;
                    xhrRun.d=fd;
                    self.Xhr.run(xhrRun);  
            };
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
        console.clear();
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
                self.DocPreview.run(self.helplink,self.StageData.Stage);
                self.Html.showField(self.helplink.preview.whole);
            }
            catch(error){
                console.log('ProjectStageCreate::setPreviewButtonAction()');
                console.log(error);
                self.Html.showField(self.Modal.link['error'],'An Application Error Has Occurred!');
            }
        };
    }
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
        console.log('ProjectStageCreate::sendInputData()');
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
        console.log('ProjectStageCreate::checkInputData()');
        console.log(data); 
    }

    setToolVisibility(value,run){
        console.log('ProjectStageCreate::setToolVisibility()');
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

}