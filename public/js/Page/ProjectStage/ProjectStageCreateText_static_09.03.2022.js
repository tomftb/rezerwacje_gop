class ProjectStageCreateText{
    static Modal;
    static Items;
    static Stage;
    static Html;
    /* FIELD COUNTER */
    static i=0;
    /* FIELD COUNTER */
    static iField=1;
    static sectionCount=1;
    static link={};
    static helplink={};
    static resonse; 
    static Glossary={};
    
    static create(response){
        console.log('ProjectStageCreateText::create()');
        console.log(response);
        ProjectStageCreateText.setUpGlossary(response);
        /* 
         * TEST GET 
        console.log(ProjectStageCreateText.Glossary.getKey('parameter'));
        console.log(ProjectStageCreateText.Glossary.getKeyProperty('parameter','STAGE_TEXT_BACKGROUND_COLOR'));
        console.log(ProjectStageCreateText.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_BACKGROUND_COLOR','n'));
        return true;
        */
        ProjectStageCreateText.Items.prepareModal('Dodaj etap projektu - tekst','bg-info');
        ProjectStageCreateText.Items.setCloseModal(ProjectStageCreateText.Stage.ProjectStageTable,'runTable',ProjectStageCreateText.Stage.defaultTask+'0');
        
        /* SET DEFAULT (EMPTY) LINK TO DATA*/
        ProjectStageCreateText.link=ProjectStageCreateText.getEmptyLink();
        /* SET DEFAULT (EMPTY) LINK TO MODAL ELEMENT*/
        ProjectStageCreateText.helplink=ProjectStageCreateText.getEmptyHelpLink();
       
        var form=ProjectStageCreateText.Html.getForm();
        /* ASSIGN TITLE FIELD */
        ProjectStageCreateText.createHead(form,'','GOP');
        /* ASSING PREVIEW FIELD */
        form.appendChild(ProjectStageCreateText.createPreview());
         /* ASSING WORKING FIELD */
        form.appendChild(ProjectStageCreateText.createDynamicView());
   
        ProjectStageCreateText.Modal.link['adapted'].appendChild(form);
         /* ASSING ACTION BUTTONS */
        ProjectStageCreateText.createButtons();
        console.log(ProjectStageCreateText.Modal.link['adapted']);
        console.log(ProjectStageCreateText.Modal.link['button']); 
        console.log(ProjectStageCreateText.Modal.link['error']); 
        ProjectStageCreateText.createManageButton('Dodaj');
    }
    static setUpGlossary(response){
        console.log('ProjectStageCreateText::setUpGlossary()');
        if(ProjectStageCreateText.Stage.Items.ManageGlossary.exist('text')) {
            console.log('Gloassary text exist');
            console.log(ProjectStageCreateText.Glossary);
            return true;
        }
        console.log('Gloassary text not exist');
        ProjectStageCreateText.Glossary=ProjectStageCreateText.Stage.Items.ManageGlossary.create('text');
        ProjectStageCreateText.Glossary.add('color',response.data.value.glossary.color);
        ProjectStageCreateText.Glossary.add('align',response.data.value.glossary.align);
        ProjectStageCreateText.Glossary.add('decoration',response.data.value.glossary.decoration);
        ProjectStageCreateText.Glossary.add('fontfamily',response.data.value.glossary.fontfamily);
        ProjectStageCreateText.Glossary.add('measurement',response.data.value.glossary.measurement);
        ProjectStageCreateText.Glossary.add('parameter',response.data.value.glossary.parameter);
        console.log(ProjectStageCreateText.Glossary);
    }
    static getEmptyLink(){
        console.log('ProjectStageCreateText::getEmptyLink()');
        var link={
            department:'',
            section:{},
            page:{}
        };
        return link;
    }
    static getEmptyHelpLink(){
        console.log('ProjectStageCreateText::getEmptyHelpLink()');
        var link={
            previewDiv:{
                all:{},
                pageBackgroundColor:''
            },
            dynamicDiv:{},
            titleDiv:{},
            section:{},
            title:{}
        };
        return link;
    }
    static createPreview(){
        console.log('ProjectStageCreateText::createPreview()');
        var mainDiv=ProjectStageCreateText.Html.getRow();
            mainDiv.classList.add('d-none');
            ProjectStageCreateText.helplink['previewDiv'].all=mainDiv;
            ProjectStageCreateText.helplink.previewDiv.pageBackgroundColor=ProjectStageCreateText.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_BACKGROUND_COLOR','v');
        return mainDiv;
    }
    static createHead(ele,title,department){
        var titleDiv=ProjectStageCreateText.Html.getRow();
        var departmentDiv=ProjectStageCreateText.Html.getRow();
            //mainDiv.classList.add('bg-info');
            ProjectStageCreateText.helplink['titleDiv']=titleDiv;
        
        var titleLabelDiv=ProjectStageCreateText.Html.getCol(1);
        var titleInputDiv=ProjectStageCreateText.Html.getCol(11);
        
      
            titleLabelDiv.appendChild(ProjectStageCreateText.createLabel('h3','Tytuł'));
            
        var input=ProjectStageCreateText.Html.getInput('title',title,'text');
            input.classList.add('form-control');
            input.setAttribute('placeholder','Enter title');
            input.setAttribute('aria-describedby',"titleHelp" );
            titleInputDiv.appendChild(input);
        
        ProjectStageCreateText.helplink['title']=input;
        
        var helpValue=document.createTextNode('Staraj sie wprowadzić jednoznaczy tytuł.');     
         
        var help=document.createElement('small');
            help.setAttribute('id','titleHelp');
            help.classList.add('form-text','text-muted');
            help.appendChild(helpValue);
            
            titleInputDiv.appendChild(help);
        /* DEPARTMENT */
       
        var departmentData={
            0:{
                value:1,
                title:'GOP'
            }
        };
       
        var departmentLabelDiv=ProjectStageCreateText.Html.getCol(1);
        var departmentInputDiv=ProjectStageCreateText.Html.getCol(11);
            departmentLabelDiv.appendChild(ProjectStageCreateText.createLabel('h3','Dział:'));
        var department=ProjectStageCreateText.createSelect('department','department');
            department.setAttribute('aria-describedby',"departmentHelp" );
            department.appendChild(ProjectStageCreateText.createSelectOption('Domyślny:',departmentData));  
            department.appendChild(ProjectStageCreateText.createSelectOption('Dostępne:',departmentData)); 
            department.onchange = function () {
                //console.log(this);
                //console.log(this.value);
                ProjectStageCreateText.link['department']=this.value;
            };
            ProjectStageCreateText.link['department']=departmentData[0].value;
        
        var departmentHelpValue=document.createTextNode('Wskaż dział.');     
         
        var departmentHelp=document.createElement('small');
            departmentHelp.setAttribute('id','departmentHelp');
            departmentHelp.classList.add('form-text','text-muted');
            departmentHelp.appendChild(departmentHelpValue);
        
        departmentInputDiv.appendChild(department);
        departmentInputDiv.appendChild(departmentHelp);
        
        titleDiv.appendChild(titleLabelDiv);
        titleDiv.appendChild(titleInputDiv);
        
        departmentDiv.appendChild(departmentLabelDiv);
        departmentDiv.appendChild(departmentInputDiv);
        
        ele.appendChild(titleDiv);
        ele.appendChild(departmentDiv);
    }
    static createLabel(h,value){
        var titleLabelValue=document.createTextNode(value);
        var titleLabel=document.createElement(h);
            titleLabel.classList.add('text-center','font-weight-bold');
            titleLabel.appendChild(titleLabelValue);
            return titleLabel;
    }
    static createDynamicView(){
        console.log('ProjectStageCreateText::createDynamicView()');
       
        var mainDiv=ProjectStageCreateText.Html.getRow();
            mainDiv.classList.add('d-block');
            
        var mainDivSection=ProjectStageCreateText.Html.getCol(12);
            
            /* CREATE TEXT SECTION */
            mainDivSection.appendChild(ProjectStageCreateText.createSection(0,0,0));
            mainDiv.appendChild(mainDivSection);
             /* CREATE ADD BUTTON */
            mainDiv.appendChild(ProjectStageCreateText.createButtonCol(ProjectStageCreateText.createAddSectionButton('section-0')));
            /* CREATE TEXT SECTION PAGE TOOL*/
            mainDiv.appendChild(ProjectStageCreateText.createTextPageTool());
            
            ProjectStageCreateText.helplink['dynamicDiv']=mainDiv;
            ProjectStageCreateText.helplink['dynamicSection']=mainDivSection;
            
        return mainDiv;
    }
    static setPreviewData(mainDiv){
        console.log('ProjectStageCreateText::setPreviewData()');
        ProjectStageCreateText.setPreviewPage(mainDiv);
        //ProjectStageCreateText.setPreviewPageText(mainDiv.childNodes[0].childNodes[0].childNodes[0]);
    }
    static setPreviewPage(mainDiv){
        console.log('ProjectStageCreateText::setPreviewPage()');
        console.log('ALL SECTION');
        console.log(ProjectStageCreateText.link.section);
        /*
         * ADD GREY TO MAIN DIV
         */
        mainDiv.style.backgroundColor='rgb(251,251,251)';
        var wholePage=document.createElement('div');
            wholePage.style.width='813px';
            wholePage.style.height='1142px';
            wholePage.style.backgroundColor='rgb(251,251,251)';
            wholePage.style.paddingTop='10px';
            wholePage.style.marginLeft='162px'; /* ALL 324, MAIN 10 */
            wholePage.style.paddingLeft='10px'; /* ALL 324, MAIN 10 */
        var blankPage=document.createElement('div');
            blankPage.style.width='791px';
            blankPage.style.height='1120px';   
            blankPage.style.border='1px solid rgb(198,198,198)'; 
            blankPage.style.backgroundColor=ProjectStageCreateText.helplink.previewDiv.pageBackgroundColor;
        var writePageSectionWidth=607;
        var writePage=document.createElement('div');
            writePage.style.width='699px';
            writePage.style.height='1028px';
            /* IT IS DEPED OF FONT SIZE */
            writePage.style.paddingTop='92px';
            /* DEFAULT LEFT MARGIN 2,5 cm */ 
            writePage.style.paddingLeft='92px'; /* ALL 314, MAIN 10 */
            /* TO DO */
            //writePage.style.textAlign=ProjectStageCreateText.helplink.previewDiv.pageTextAlign
            
        /* LOOP OVER  SECTION */    

        for(const property in ProjectStageCreateText.link.section){
            console.log(ProjectStageCreateText.link.section[property]);
            
            /* CHECK AND SETUP COLUMNS NUMBER */
            writePageSectionWidth=Math.floor(607/ProjectStageCreateText.link.section[property].subsectionvisible); /* minus padding left 92px */
            /* LOOP OVER SUBSECTION */   
            for(var i=0;i<ProjectStageCreateText.link.section[property].subsectionvisible;i++){
                console.log(ProjectStageCreateText.link.section[property].subsection[i]);
                
                var writePageSection=document.createElement('div');
                    writePageSection.style.width=writePageSectionWidth+'px';
                    writePageSection.style.border='0px';
                    writePageSection.style.margin='0px';
                    writePageSection.style.cssFloat='LEFT';
                
                 /* LOOP OVER SUBSECTION ROW */
                for(const propSubsectionRow in ProjectStageCreateText.link.section[property].subsection[i]){
                    
                    /* CHECK BREAKLINE */
                    ProjectStageCreateText.setPreviewPageBreakLine(writePageSection,ProjectStageCreateText.link.section[property].subsection[i][propSubsectionRow]);
                    /* SIMPLE TEXT */
                    //writePageSection.innerText=ProjectStageCreateText.link.section[property].subsection[i][propSubsectionRow].value.value;
                    /* SIMPLE HTML */
                    //writePageSection.innerHTML=ProjectStageCreateText.link.section[property].subsection[i][propSubsectionRow].value.value;                   
                    /* ADVANCED WITH STYLE */
                    writePageSection.appendChild(ProjectStageCreateText.setPreviewTextHtml(ProjectStageCreateText.link.section[property].subsection[i][propSubsectionRow]));
                }
                writePage.appendChild(writePageSection);
            }
        }
        console.log(writePage);  
        blankPage.appendChild(writePage);
        wholePage.appendChild(blankPage);
        mainDiv.appendChild(wholePage);       
    }
    static setPreviewPageBreakLine(ele,textProperty){
        var br=document.createElement('br');
            if(textProperty.valuenewline==='1'){
                console.log('VALUE NEW LINE === 1 ADD BREAK LINE');
                ele.appendChild(br);
            }
    }
    static setPreviewPageValue(ele,subsectionrow){
        console.log('ProjectStageCreateText::setPreviewPageValue()');
        console.log(ele);
        console.log(subsectionrow);
    }
    static getEmptyText(){
        var textObject={
                value:'',
                fontsize:'',
                fontcolor:'',
                fontbackgroundcolor:'',
                fontfamily:'',
                fontbold:'',
                fontunderline:'',
                fontitalic:'',
                fontlinethrough:'',
                valuenewline:''
        };
        return textObject;
    }
    static setPreviewTextObject(key,value,all){
        console.log('ProjectStageCreateText::setPreviewTextObject()');
        const field = key.split('-');
        //console.log(field[0]);
        //console.log(field[1]);
        //console.log(value);
        if(!all.hasOwnProperty(field[1])){
            //console.log('create new object - '+field[1]);
            all[field[1]]=ProjectStageCreateText.getEmptyText();//new Object();
            all[field[1]][field[0]]=value;
        }
        else{
            all[field[1]][field[0]]=value;          
        }
    }
    static setPreviewTextHtml(textProperty){
        console.log('ProjectStageCreateText::setPreviewTextHtml()');
        console.log(textProperty);
        var html=document.createElement('span');
            html.style.fontSize=textProperty.style.fontsize;
            html.style.fontFamily=textProperty.style.fontfamily;
            html.style.color=textProperty.style.fontcolor;
            html.style.backgroundColor=textProperty.style.fontbackgroundcolor;
            html.style.fontWeight='normal';

            /* TEXT ALIGN */
            console.log(textProperty.style.textalign);
            if(textProperty.style.textalign==='LEFT' || textProperty.style.textalign==='RIGHT'){
                html.style.cssFloat=textProperty.style.textalign;
            }
            else if(textProperty.style.textalign==='CENTER' || textProperty.style.textalign==='JUSTIFY'){
                html.style.textAlign=textProperty.style.textalign;
                html.style.display='BLOCK';
            }
            else{
                console.log('UNAVAILABLE');
                console.log( textProperty.style.textalign);                
            }
        var text=document.createTextNode(textProperty.property.valueEle.value);
        if(textProperty.style.fontbold==='1'){
            html.style.fontWeight='bold';
        }
        if(textProperty.style.fontunderline==='1' && textProperty.style.fontlinethrough==='1'){
            html.style.textDecoration='underline line-through';
        }
        else if(textProperty.style.fontunderline==='1' && textProperty.style.fontlinethrough==='0'){
            html.style.textDecoration='underline';
        }
        else if(textProperty.style.fontunderline==='0' && textProperty.style.fontlinethrough==='1'){
            html.style.textDecoration='line-through';
        }
        else {};
        if(textProperty.style.fontitalic==='1'){
            html.style.fontStyle='italic';
        }
        html.appendChild(text);
        return html;
    }
    static createSection(isection,id,idSection){
        console.log('ProjectStageCreateText::createSection()');
        console.log(ProjectStageCreateText.link);
        var mainDiv=ProjectStageCreateText.Html.getRow(); 
        var mainDivHeader=ProjectStageCreateText.Html.getCol(12); 
        var mainDivBody=ProjectStageCreateText.Html.getCol(12); 
        var hr=document.createElement('hr');
            hr.setAttribute('class','w-100 border-1 border-secondary mt-2');//
        var h=document.createElement('h3');    
            h.setAttribute('class','w-100 text-center bg-info text-white');//
            h.innerHTML='<span class="text-muted">[WIERSZ]</span> Sekcja  nr '+isection;
            mainDivHeader.appendChild(hr);
            mainDivHeader.appendChild(h);
            ProjectStageCreateText.link.section['section-'+isection]={
                subsectionvisible:0,
                //ele:mainDivBody,
                subsection:{},
                db:idSection
            };
            ProjectStageCreateText.helplink.section['section-'+isection]={
                main:{},
                subsection:{}
            };

            for(var i=0;i<ProjectStageCreateText.getMaxSubSectionCount();i++){
                
                ProjectStageCreateText.helplink.section['section-'+isection]['subsection'][i]={
                    /* FOR SHOW/HIDE */
                    all:{},
                    /* FOR ADD */
                    dynamic:{},
                    /* FOR REMOVE */
                    row:{}
                };
                ProjectStageCreateText.link.section['section-'+isection].subsection[i]={};
                /* ADD SUBSECTION */
                var mainDivSubsection=ProjectStageCreateText.Html.getRow();
                var mainDivSubsectionBtn=ProjectStageCreateText.Html.getCol(12);
                var mainDivSubsectionBody=ProjectStageCreateText.Html.getCol(12);
                    
                    mainDivSubsectionBody.appendChild(ProjectStageCreateText.createSubsection(isection,i,0,0,0));
                    ProjectStageCreateText.helplink.section['section-'+isection]['subsection'][i].dynamic=mainDivSubsectionBody;
                    mainDivSubsectionBtn.appendChild(ProjectStageCreateText.createButtonRow(ProjectStageCreateText.createAddSubsectionButton('subsection-'+isection+'-'+i+'-'+0)));
                    mainDivSubsection.appendChild(mainDivSubsectionBody);
                    mainDivSubsection.appendChild(mainDivSubsectionBtn);
                    
                    ProjectStageCreateText.helplink.section['section-'+isection]['subsection'][i].all=mainDivSubsection;
                    mainDivBody.appendChild(mainDivSubsection);
            }
            mainDivHeader.appendChild(ProjectStageCreateText.createSectionTool(isection)); 

            mainDiv.appendChild(mainDivHeader);  
            mainDiv.appendChild(mainDivBody);   
            ProjectStageCreateText.helplink.section['section-'+isection].main=mainDiv;
            console.log(mainDiv);
            return mainDiv;
    }
    static createSubsection(isection,isub,isubrow,newLine,idSubsectionRow){
        console.log('ProjectStageCreateText::createSubsection()');
        var mainDiv=ProjectStageCreateText.Html.getRow();
            /* APPEND SUBSECTION ROW + ELE */
            ProjectStageCreateText.link.section['section-'+isection].subsection[isub][isubrow]={
                        //ele:mainDiv, 
                        style:{},
                        property:{
                            id:'0',
                            valueEle:{}
                        },
                        valuenewline:newLine,
                        db:idSubsectionRow
                };
              
            
            ProjectStageCreateText.createSubsectionRow(mainDiv,isection,isub,isubrow);
            mainDiv.appendChild(ProjectStageCreateText.createTextError('error-'+isection+'-'+isub+'-'+isubrow));  
            mainDiv.appendChild(ProjectStageCreateText.createTextTool(isection,isub,isubrow));  
            ProjectStageCreateText.helplink.section['section-'+isection]['subsection'][isub]['row'][isubrow]=mainDiv;
            
           
        return mainDiv;
    }
    static createExtendedSubsection(isection,isub,isubrow){
        var mainDiv=ProjectStageCreateText.createSubsection(isection,isub,isubrow);
            mainDiv.appendChild(ProjectStageCreateText.createExtendedTextTool(isection,isub,isubrow));
        return mainDiv;
    }
    static createSubsectionRow(mainDivText,isection,isub,isubrow){
        console.log('ProjectStageCreateText::createSubsectionRow()\r\nSECTION - '+isection+'\r\nSUBSECTION - '+isub+'\r\nROW - '+isubrow);
        /*
         * 
         * isection = section number
         */
        //var mainDivCol=ProjectStageCreateText.Html.getCol(12);
        /*
         * 
         * SET DEFAULT ATTRIBUTE d-none
         */
        var mainDivCol=ProjectStageCreateText.Html.getCol(12);
        var mainDiv=ProjectStageCreateText.Html.getRow();
        
        var mainDivSectionLabel=ProjectStageCreateText.Html.getRow();
        var sectionLabel=document.createElement('h4');
            sectionLabel.setAttribute('class','text-center w-100');
            sectionLabel.innerHTML='<span class="text-muted">[KOLUMNA]</span> Podsekcja - '+isub+' wiersz - '+isubrow;
        var labelDiv=ProjectStageCreateText.Html.getCol(1);
            labelDiv.classList.add('mr-0','pr-0');
        var valueDiv=ProjectStageCreateText.Html.getCol(10);
        var removeDiv=ProjectStageCreateText.Html.getCol(1);
            //removeDiv.classList.add('float-right');
            //removeDiv.appendChild(ProjectStageCreateText.getRemoveButton("rmsubsection-"+isection+'-'+isub+'-'+isubrow));
            removeDiv.appendChild(ProjectStageCreateText.getRemoveButton(isection,isub,isubrow));
        /* LABEL */
        var label=document.createElement('LABEL');
            label.setAttribute('class','col-form-label');
            label.setAttribute('for','value-'+isection+'-'+isub+'-'+isubrow);
            label.innerHTML='<b>Wartość:</b><br/><small class=" text-muted ">['+'value-'+isection+'-'+isub+'-'+isubrow+']</small>';
        var input=document.createElement('textarea');
            input.setAttribute('class','form-control border-1 border-info');
            input.setAttribute('placeholder','Write...');
            input.setAttribute('name','value-'+isection+'-'+isub+'-'+isubrow);
            input.setAttribute('id','value-'+isection+'-'+isub+'-'+isubrow);
            input.setAttribute('rows','3');
            input.setAttribute('value','');
            
            /* SET TEXT STYLE FROM PARAMETER */
            //console.log(ProjectStageCreateText.glossary.parameter['STAGE_TEXT_FONT_SIZE_MEASUREMENT'].v);
            //input.style.fontSize='12pt';
            input.style.fontSize=ProjectStageCreateText.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_FONT_SIZE','v')+ProjectStageCreateText.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_FONT_SIZE_MEASUREMENT','v');
            input.style.color=ProjectStageCreateText.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_COLOR','v');
            input.style.backgroundColor=ProjectStageCreateText.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_BACKGROUND_COLOR','v');
            input.style.fontFamily=ProjectStageCreateText.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_FONT_FAMILY','v');
            input.style.fontWeight=ProjectStageCreateText.setValueStyleFontWeight(ProjectStageCreateText.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_FONT_BOLD','v'));
            input.style.fontStyle=ProjectStageCreateText.setValueStyleFontStyle(ProjectStageCreateText.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_FONT_ITALIC','v'));
            input.style.textDecoration=ProjectStageCreateText.setValueStyleTextDecoration(input.style.textDecoration,ProjectStageCreateText.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_FONT_UNDERLINE','v'),'underline');
            input.style.textDecoration=ProjectStageCreateText.setValueStyleTextDecoration(input.style.textDecoration,ProjectStageCreateText.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_FONT_LINETHROUGH','v'),'line-through');
            /* CREATE LINK TO FIELD INPUT VALUE */
            //ProjectStageCreateText.link.value[isection+'-'+isub+'-'+isubrow]=input;
            
            ProjectStageCreateText.link.section['section-'+isection]['subsection'][isub][isubrow]['property']['valueEle']=input;
            ProjectStageCreateText.helplink.section['section-'+isection]['subsection'][isub]['row'][isubrow]=input;
            
            labelDiv.appendChild(label);
            valueDiv.appendChild(input);
            
            mainDivSectionLabel.appendChild(sectionLabel);
            
            mainDiv.appendChild(labelDiv);
            mainDiv.appendChild(valueDiv);
            mainDiv.appendChild(removeDiv);
            
            //mainDiv.appendChild(mainDivSectionLabel);
            //mainDiv.appendChild(mainDiv);
            
            mainDivCol.appendChild(mainDivSectionLabel);
            mainDivCol.appendChild(mainDiv);
            mainDivText.appendChild(mainDivCol);
            mainDivText.appendChild(mainDivCol);
            ProjectStageCreateText.helplink.section['section-'+isection]['subsection'][isub]['row'][isubrow]=mainDivText;
        //return mainDiv;
    }
    static createSectionTool(isection){
        console.log('ProjectStageCreateText::createSectionTool()');
        //var mainDiv=ProjectStageCreateText.Html.getCol(12);
        var mainDivSection=ProjectStageCreateText.Html.getRow();
        var tool1=ProjectStageCreateText.Html.getCol(3);
        var tool2=ProjectStageCreateText.Html.getCol(3);    
        var tool3=ProjectStageCreateText.Html.getCol(3);
        var tool4=ProjectStageCreateText.Html.getCol(3);  
        var sectioncount=ProjectStageCreateText.createTextToolSelect('section-'+isection,'Wskaż ilość podsekcji <small class="text-muted">[KOLUMN]</small>:',ProjectStageCreateText.getSelectKey(ProjectStageCreateText.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_SUBSECTION_DEFAULT','v'),ProjectStageCreateText.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_SUBSECTION_DEFAULT','v')),ProjectStageCreateText.getSectionCount(ProjectStageCreateText.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_SUBSECTION_DEFAULT','v')));
            
            sectioncount.childNodes[1].onchange = function () { ProjectStageCreateText.manageSubsection(this); };
            /* FIRST RUN TO SETUP SECTION DEFAULT COUNT */
            ProjectStageCreateText.manageSubsection(sectioncount.childNodes[1]);
            tool1.appendChild(sectioncount);
            tool4.appendChild(ProjectStageCreateText.createRemoveSectionButton(isection));
            //console.log( tool4);
        mainDivSection.appendChild(tool1);
        mainDivSection.appendChild(tool2);
        mainDivSection.appendChild(tool3);
        mainDivSection.appendChild(tool4);
        return mainDivSection;
    }
    static createTextError(id){
        //console.log('ProjectStageCreateText::createTextError()');
        var mainDiv=ProjectStageCreateText.Html.getCol(12); 
        //var mainDiv=ProjectStageCreateText.Html.getRow(); 
            mainDiv.classList.add('alert','alert-danger','d-none','mt-1','mb-0');//d-block
            mainDiv.setAttribute('id',id);
        var errorDiv=ProjectStageCreateText.Html.getCol(12);
        //var errorDiv=ProjectStageCreateText.Html.getRow();
            errorDiv.innerText='Test ERROR';
            mainDiv.appendChild(errorDiv);  
           //mainDivCol.appendChild(mainDiv);
        return mainDiv;
    }
    static createTextTool(isection,isub,isubrow){
        /*
        console.log('ProjectStageCreateText::createTextTool()');
        console.log(isection);
        console.log(isub);
        console.log(isubrow);
        */
        var mainDivCol=ProjectStageCreateText.Html.getCol(12);
        var mainDiv=ProjectStageCreateText.Html.getRow();
        var tool1=ProjectStageCreateText.Html.getCol(2);
        var tool2=ProjectStageCreateText.Html.getCol(3);
        var tool3=ProjectStageCreateText.Html.getCol(3);
        //var tool2=ProjectStageCreateText.Html.getCol(5);
        var tool4=ProjectStageCreateText.Html.getCol(4);
            tool4.classList.add('pt-4');
        var fontsize=ProjectStageCreateText.createTextToolSelectExtend('fontsize-'+isection+'-'+isub+'-'+isubrow,'Rozmiar tekstu:',ProjectStageCreateText.getDefaultFontSize(ProjectStageCreateText.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_FONT_SIZE','v'),ProjectStageCreateText.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_FONT_SIZE','v')),ProjectStageCreateText.getFontSizeList(ProjectStageCreateText.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_FONT_SIZE','v')));
        var fontcolor=ProjectStageCreateText.createTextToolSelectExtend('fontcolor-'+isection+'-'+isub+'-'+isubrow,'Kolor tekstu:',ProjectStageCreateText.getDefaultColor(ProjectStageCreateText.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_COLOR','v'),ProjectStageCreateText.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_COLOR','n')),ProjectStageCreateText.getColorList(ProjectStageCreateText.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_COLOR','v')));
        var fontfamily=ProjectStageCreateText.createTextToolSelectExtend('fontfamily-'+isection+'-'+isub+'-'+isubrow,'Czcionka:',ProjectStageCreateText.getDefaultFont(ProjectStageCreateText.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_FONT_FAMILY','v'),ProjectStageCreateText.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_FONT_FAMILY','v')),ProjectStageCreateText.getFontList(ProjectStageCreateText.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_FONT_FAMILY','v')));
        var textalign=ProjectStageCreateText.createTextToolSelectExtend('textalign-'+isection+'-'+isub+'-'+isubrow,'Wskaż kierunek tekstu:',ProjectStageCreateText.getSelectKey(ProjectStageCreateText.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_ALIGN','v'),ProjectStageCreateText.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_ALIGN','n')),ProjectStageCreateText.getFontAlignList(ProjectStageCreateText.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_ALIGN','v')));
        var fontbackgroundcolor=ProjectStageCreateText.createTextToolSelectExtend('fontbackgroundcolor-'+isection+'-'+isub+'-'+isubrow,'Kolor tła:',ProjectStageCreateText.getDefaultBackgroundColor(ProjectStageCreateText.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_BACKGROUND_COLOR','v'),ProjectStageCreateText.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_BACKGROUND_COLOR','n')),ProjectStageCreateText.getBackgroundColorList(ProjectStageCreateText.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_BACKGROUND_COLOR','v'))); 
            
        tool1.appendChild(fontsize);
        tool1.appendChild(fontcolor);
        tool2.appendChild(fontfamily);
        tool2.appendChild(textalign);
        tool3.appendChild(fontbackgroundcolor);
        
        ProjectStageCreateText.link.section['section-'+isection]['subsection'][isub][isubrow]['style']={
            fontsize:ProjectStageCreateText.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_FONT_SIZE','v')+ProjectStageCreateText.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_FONT_SIZE_MEASUREMENT','v'),
            fontcolor:ProjectStageCreateText.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_COLOR','v'),
            fontfamily:ProjectStageCreateText.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_FONT_FAMILY','v'),
            textalign:ProjectStageCreateText.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_ALIGN','v'),
            fontbackgroundcolor:ProjectStageCreateText.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_BACKGROUND_COLOR','v')
        };
        
        ProjectStageCreateText.createTextDecorationTool(tool4,isection,isub,isubrow); 
        //console.log(ProjectStageCreateText.link);
        mainDiv.appendChild(tool1);
        mainDiv.appendChild(tool2);
        mainDiv.appendChild(tool3);
        mainDiv.appendChild(tool4);
        mainDivCol.appendChild(mainDiv);
        return mainDivCol;
        //return mainDiv;
    }
    static createTextDecorationTool(tool4,isection,isub,isubrow){
        //console.log('ProjectStageCreateText::createTextDecorationTool()');
        for(const prop of ProjectStageCreateText.Glossary.getKey('decoration').entries()) { 
            //console.log(prop[0],prop[1]);
            //pageProperties[pair[0]]=pair[1];
            ProjectStageCreateText.setTextDecorationToolEntry(prop[1],tool4,isection,isub,isubrow);  
            /* SET DEFAULT */
            //ProjectStageCreateText.link.section['section-'+isection]['subsection'][isub][isubrow]['style'][prop.inputName]=input.childNodes[0];
        }
    }
    static setTextDecorationToolEntry(decorationProp,tool4,isection,isub,isubrow){
        /*
         * decorationProp.n. - name
         * decorationProp.v - value
         */
        var prop=ProjectStageCreateText.setTextDecorationToolEntryProperties(decorationProp,isection,isub,isubrow);
        var input = ProjectStageCreateText.createTextToolCheckBox(prop.inputName+'-'+isection+'-'+isub+'-'+isubrow,prop.label,prop.check);
        tool4.appendChild(input);
        //ProjectStageCreateText.link.section['section-'+isection]['subsection'][isub][isubrow]['style'][prop.inputName]=input.childNodes[0];
        ProjectStageCreateText.link.section['section-'+isection]['subsection'][isub][isubrow]['style'][prop.inputName]=prop.check;
    }
    static setTextDecorationToolEntryCheck(input,check){
        /*
         * console.log('ProjectStageCreateText::setTextDecorationToolEntryCheck()');
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
     static setTextDecorationToolEntryProperties(decorationProp){
        /*
         * console.log('ProjectStageCreateText::setTextDecorationToolEntryProperties()');
         * console.log(decorationProp);
         */
        if (!('v' in decorationProp) || !('n' in decorationProp)){
            console.log('Decoration Property don\'t have key v or n');
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
                fullProp.check=ProjectStageCreateText.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_FONT_BOLD','v');
                fullProp.inputName='fontbold';
                fullProp.label='<b>'+decorationProp.n+'</b>';
                break;
            case 'UNDERLINE':
                fullProp.check=ProjectStageCreateText.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_FONT_UNDERLINE','v');
                fullProp.inputName='fontunderline';
                fullProp.label='<u>'+decorationProp.n+'</u>';
                break;
            case 'ITALIC':
                fullProp.check=ProjectStageCreateText.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_FONT_ITALIC','v');
                fullProp.inputName='fontitalic';
                fullProp.label='<i>'+decorationProp.n+'</i>';
                break;
            case 'line-through':
                fullProp.check=ProjectStageCreateText.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_FONT_LINETHROUGH','v');
                fullProp.inputName='fontlinethrough';
                fullProp.label='<span style="text-decoration:line-through;">'+decorationProp.n+'</span>';
                break;
            default:
                console.log('UNAVAILABLE - '+decorationProp.v);
                break;
        }
        
        return fullProp;
    }
    static createExtendedTextTool(isection,isub,isubrow){
        console.log('ProjectStageCreateText::createExtendedTextTool()');
        var mainDivCol=ProjectStageCreateText.Html.getCol(12);
        var mainDiv=ProjectStageCreateText.Html.getRow();
        var tool1=ProjectStageCreateText.Html.getCol(5);
        var tool2=ProjectStageCreateText.Html.getCol(5);
        var tool3=ProjectStageCreateText.Html.getCol(2);
        var radio = ProjectStageCreateText.createTextToolRadioButton('valuenewline-'+isection+'-'+isub+'-'+isubrow,'Tekst od nowej lini?',ProjectStageCreateText.getYesNowRadio('valuenewline-'+isection+'-'+isub+'-'+isubrow));
            /* SET DEFAULT VALUE FOR BREAK LINE */
            ProjectStageCreateText.link.section['section-'+isection]['subsection'][isub][isubrow]['valuenewline']='1';
            /* ADD ACTION */
            console.log(radio.childNodes[1]);
            /* YES */
            console.log(radio.childNodes[1].childNodes[0].childNodes[0]);
            radio.childNodes[1].childNodes[0].childNodes[0].onclick = function (){   
                ProjectStageCreateText.changeNewLineValue(this);
            };
             /* NO */
            console.log(radio.childNodes[1].childNodes[1].childNodes[0]);
            radio.childNodes[1].childNodes[1].childNodes[0].onclick = function (){
                ProjectStageCreateText.changeNewLineValue(this);
            };
            
            
        tool1.appendChild(radio);
        
        console.log(tool1.childNodes[0].childNodes[1]); 
        mainDiv.appendChild(tool1);
        mainDiv.appendChild(tool2);
        mainDiv.appendChild(tool3);
        mainDivCol.appendChild(mainDiv);
        return mainDivCol;
    }
    static changeNewLineValue(ele){
        console.log(ele);
        console.log(ele.id);
        console.log(ele.value);
        var tmpid=ele.id.split('-');
        /*
         * tmpid[0] - name
         * tmpid[1] - section
         * tmpid[2] - subsection
         * tmpid[3] - subsection row
         * tmpid[4] - value
         */
        ProjectStageCreateText.link.section['section-'+tmpid[1]]['subsection'][tmpid[2]][tmpid[3]]['valuenewline']=tmpid[4];
    }
    static createTextToolCheckBox(id,title,defaultvalue){
        
        if(defaultvalue)
            
        var div=document.createElement('div');
            div.setAttribute('class','form-check mt-1');
        var input=document.createElement('input');
            input.setAttribute('name',id);
            input.setAttribute('id',id);
            
            input.setAttribute('type','checkbox');
            input.classList.add('form-check-input');
            input.onclick = function (){
                console.log(this);
                if(this.value==='0'){
                    this.value='1';
                }
                else{
                    this.value='0';
                }
                ProjectStageCreateText.setValueStyle(this.id,this.value);
            };
            ProjectStageCreateText.setTextDecorationToolEntryCheck(input,defaultvalue);
            
        var label=document.createElement('label');
            label.setAttribute('class','form-check-label');
            label.setAttribute('for',id);
            label.innerHTML=title;
       div.appendChild(input);
       div.appendChild(label);
       return div;
    }
    static createTextToolSelect(id,title,actdata,alldata){
        //console.log('ProjectStageCreateText::createTextToolSelect()');
        var div=document.createElement('div');
            div.setAttribute('class','w-100 mt-2');
        var label=document.createElement('span');
            label.setAttribute('class','text-info');
            label.innerHTML=title;
        var select=ProjectStageCreateText.createSelect(id,id);
            select.appendChild(ProjectStageCreateText.createTextToolSelectOption('Domyślny:',actdata));  
            select.appendChild(ProjectStageCreateText.createTextToolSelectOption('Dostępne:',alldata)); 
            div.appendChild(label);
            div.appendChild(select);
        return div;
    }
    static createSelect(id,name){
        var select=document.createElement('select');
            select.setAttribute('class','form-control');
            select.setAttribute('id',id);
            select.setAttribute('name',name);
            return select;
    }
    static createSelectOption(title,data){
        var optionGroup=document.createElement('optgroup');
            optionGroup.setAttribute('label',title);
            optionGroup.setAttribute('class','bg-info text-white');
            for (const property in data) {
                var option=document.createElement('option');
                    option.setAttribute('value',data[property].value);
                    option.style.color = '#000000';
                    option.style.backgroundColor = '#FFFFFF';
                    option.innerText=data[property].title;
                    optionGroup.appendChild(option);
            };
        return optionGroup;
    }
    static createTextToolSelectExtend(id,title,actdata,alldata){
        //console.log('ProjectStageCreateText::createTextToolSelectExtend()');
        var select = ProjectStageCreateText.createTextToolSelect(id,title,actdata,alldata);
        //console.log(select.childNodes[1]);
        

        /* CLOSURE - DOMKNIĘCIE*/
        
        select.childNodes[1].onchange = function(a){
            console.log('ProjectStageCreateText::createTextToolSelectExtend()');
            //console.log(a);
            //console.log(actdata);
            //console.log(alldata);
            //console.log(this);
            //console.log(this.id);
            //console.log(this.value);
            //console.log(this.childNodes[0]);
            //console.log(this.childNodes[1]);
            /* SET NEW VALUE STYLE ATR */
            ProjectStageCreateText.setValueStyle(this.id,this.value);  
            /* RECALCULATE SELECT */
            /* 
             * REMOVE EXIST ACT AND AVA 
             this.childNodes[1].remove();
             this.childNodes[0].remove();
             */
        };
        return select;
    }
   
    static setValueStyle(id,value){
        /*
        console.log('ProjectStageCreateText::setValueStyle()');
        console.log(id);
        console.log(value);
        */
        if(id===''){
            console.log('ProjectStageCreateText::setValueStyle() ERROR => EMPTY ID');
            console.log(id);
            throw 'An Application Error Has Occurred!';
            return false;
        }
        var tmpid=id.split('-');
        /*
         * tmpid[0] - name
         * tmpid[1] - section
         * tmpid[2] - subsection
         * tmpid[3] - subsection row
         */
        if(tmpid.length!==4){
            console.log('ProjectStageCreateText::setValueStyle() ERROR => WRONG ID');
            console.log(id);
            throw 'An Application Error Has Occurred!';
            return false;
        }
        console.log(ProjectStageCreateText.link);
                switch(tmpid[0]){
                    case 'fontsize':
                        ProjectStageCreateText.link.section['section-'+tmpid[1]]['subsection'][tmpid[2]][tmpid[3]]['style'][tmpid[0]]=value+'pt'; 
                        ProjectStageCreateText.link.section['section-'+tmpid[1]]['subsection'][tmpid[2]][tmpid[3]]['property']['valueEle'].style.fontSize=value+'pt';
                        break;
                    case 'fontcolor':
                        ProjectStageCreateText.link.section['section-'+tmpid[1]]['subsection'][tmpid[2]][tmpid[3]]['style'][tmpid[0]]=value;
                        ProjectStageCreateText.link.section['section-'+tmpid[1]]['subsection'][tmpid[2]][tmpid[3]]['property']['valueEle'].style.color=value;
                        break;   
                    case 'fontbackgroundcolor':
                        ProjectStageCreateText.link.section['section-'+tmpid[1]]['subsection'][tmpid[2]][tmpid[3]]['style'][tmpid[0]]=value;
                        ProjectStageCreateText.link.section['section-'+tmpid[1]]['subsection'][tmpid[2]][tmpid[3]]['property']['valueEle'].style.backgroundColor=value;
                        break;
                    case 'fontfamily':
                        ProjectStageCreateText.link.section['section-'+tmpid[1]]['subsection'][tmpid[2]][tmpid[3]]['style'][tmpid[0]]=value;
                        ProjectStageCreateText.link.section['section-'+tmpid[1]]['subsection'][tmpid[2]][tmpid[3]]['property']['valueEle'].style.fontFamily=value;
                        break;
                    case 'textalign':
                        ProjectStageCreateText.link.section['section-'+tmpid[1]]['subsection'][tmpid[2]][tmpid[3]]['style'][tmpid[0]]=value;
                        ProjectStageCreateText.link.section['section-'+tmpid[1]]['subsection'][tmpid[2]][tmpid[3]]['property']['valueEle'].style.textAlign=value;
                        break;
                    case 'fontbold':
                        ProjectStageCreateText.link.section['section-'+tmpid[1]]['subsection'][tmpid[2]][tmpid[3]]['property']['valueEle'].style.fontWeight =ProjectStageCreateText.setValueStyleFontWeight(value);
                        ProjectStageCreateText.link.section['section-'+tmpid[1]]['subsection'][tmpid[2]][tmpid[3]]['style'][tmpid[0]]=value;
                        break;
                    case 'fontunderline':
                        ProjectStageCreateText.link.section['section-'+tmpid[1]]['subsection'][tmpid[2]][tmpid[3]]['property']['valueEle'].style.textDecoration=ProjectStageCreateText.setValueStyleTextDecoration(ProjectStageCreateText.link.section['section-'+tmpid[1]]['subsection'][tmpid[2]][tmpid[3]]['property']['valueEle'].style.textDecoration,value,'underline');
                        console.log(ProjectStageCreateText.link.section['section-'+tmpid[1]]['subsection'][tmpid[2]][tmpid[3]]['property']['valueEle'].style.textDecoration);
                        ProjectStageCreateText.link.section['section-'+tmpid[1]]['subsection'][tmpid[2]][tmpid[3]]['style'][tmpid[0]]=value;
                        break;
                    case 'fontitalic':
                        ProjectStageCreateText.link.section['section-'+tmpid[1]]['subsection'][tmpid[2]][tmpid[3]]['property']['valueEle'].style.fontStyle =ProjectStageCreateText.setValueStyleFontStyle(value);           
                        ProjectStageCreateText.link.section['section-'+tmpid[1]]['subsection'][tmpid[2]][tmpid[3]]['style'][tmpid[0]]=value;
                        break;
                    case 'fontlinethrough':
                        ProjectStageCreateText.link.section['section-'+tmpid[1]]['subsection'][tmpid[2]][tmpid[3]]['property']['valueEle'].style.textDecoration=ProjectStageCreateText.setValueStyleTextDecoration(ProjectStageCreateText.link.section['section-'+tmpid[1]]['subsection'][tmpid[2]][tmpid[3]]['property']['valueEle'].style.textDecoration,value,'line-through');
                        console.log(ProjectStageCreateText.link.section['section-'+tmpid[1]]['subsection'][tmpid[2]][tmpid[3]]['property']['valueEle'].style.textDecoration);
                        ProjectStageCreateText.link.section['section-'+tmpid[1]]['subsection'][tmpid[2]][tmpid[3]]['style'][tmpid[0]]=value;
                        break;
                    default:
                        console.log('unavailable');
                        break;
                }
    }
    static setValueStyleFontStyle(value){
        if(value==='1'){
            return 'italic';
        }
        else{
            return 'normal';
        }
    }
    static setValueStyleFontWeight(value){
        if(value==='1'){
            return 'bold';
        }
        else{
            return 'normal';
        }
    }
    static setValueStyleTextDecoration(actEleTextDecoration,value,styleToSetUp){
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
     static createTextToolSelectOption(title,data){
        var optionGroup2=document.createElement('optgroup');
            optionGroup2.setAttribute('label',title);
            optionGroup2.setAttribute('class','bg-info text-white');
            for (const property in data) {
                //console.log(`${property}: ${data[property]}`);
                //console.log(data[property]);
                var option=document.createElement('option');
                    option.setAttribute('value',data[property].value);
                    //option.setAttribute('class',data[property].fontcolor+' '+data[property].backgroundcolor);
                    option.style.fontFamily = data[property].fontfamily;
                    option.style.color = data[property].fontcolor;
                    option.style.backgroundColor = data[property].backgroundcolor;
                    option.innerText=data[property].title;
                    optionGroup2.appendChild(option);
            };
        return optionGroup2;
     }
    static createTextToolRadioButton(id,title,value){
        var maindiv=ProjectStageCreateText.Html.getRow();
        var collabel=ProjectStageCreateText.Html.getCol(12);
        var colvalue=ProjectStageCreateText.Html.getCol(12);
        var mainlabel=document.createElement('p');
            mainlabel.setAttribute('class','text-info mt-1 mb-0 pb-0 w-100');
            mainlabel.innerHTML=title;  
        for (const property in value) {
            /*console.log(`${property}: ${value[property]}`);
            console.log(`${property}: ${value[property].check}`);
            console.log(`${property}: ${value[property].id}`);*/
            var div=ProjectStageCreateText.Html.getRow();
                div.setAttribute('class','form-check form-check-inline');
            var input=document.createElement('input');
                input.setAttribute('class','form-check-input');
                input.setAttribute('type','radio');
                input.setAttribute('id',value[property].id);
                input.setAttribute('value',value[property].value);
                input.setAttribute(value[property].check,'');
                input.setAttribute('name',id);
                //input.onclick = function(){
                //    console.log(this);
                //};
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
    static getYesNowRadio(id){
        const value={
            'y':{
                check:'checked',
                id:id+'-y',
                value:'y',
                title:'Tak',
                fontcolor:'text-primary'
            },
            'n':{
                check:'no-checked',
                id:id+'-n',
                value:'n',
                title:'Nie',
                fontcolor:'text-danger'
            }
        };
        return value;
    }

   
    static getSelectKey(value,title){
        var selectKey={};
            selectKey[0]=ProjectStageCreateText.getSelectKeyProperties(value,title);
        return selectKey;
    }
    static getExtendedSelectKey(value,title,key){
        var selectKey={};
            selectKey[key]=ProjectStageCreateText.getSelectKeyProperties(value,title);
        return selectKey;
    }
    static getSelectKeyProperties(value,title){
        var selectKeyProp={
                value:value,
                title:title,
                fontcolor:'#000000',
                backgroundcolor:'#FFFFFF',
                fontfamily:''
            };
        return selectKeyProp;
    }
    static getExtendedSelectKeyProperties(value,title,fontcolor,backgroundcolor,fontfamily){
        var selectKeyProp=ProjectStageCreateText.getSelectKeyProperties(value,title);
            selectKeyProp.fontcolor=fontcolor;
            selectKeyProp.backgroundcolor=backgroundcolor;
            selectKeyProp.fontfamily=fontfamily;
        return selectKeyProp;
    }
    static getDefaultFont(value,title){
        //console.log('ProjectStageCreateText::getDefaultFont()');
        var defaultValue=ProjectStageCreateText.getSelectKey(value,title);
            defaultValue[0].fontfamily=value;
        return defaultValue;
    }
     static getDefaultColor(value,title){
        var defaultValue=ProjectStageCreateText.getSelectKey(value,title);
            defaultValue[0].fontcolor=value;
            //defaultValue.backgroundcolor=value; TO DO => DYNAMIC CHANGE
        return defaultValue;
    }
    static getDefaultBackgroundColor(value,title){
        var defaultValue=ProjectStageCreateText.getSelectKey(value,title);
            defaultValue[0].backgroundcolor=value;
            //defaultValue.fontcolor=value; TO DO => DYNAMIC CHANGE
        return defaultValue;
    }
    static getDefaultFontSize(value,title){
        var defaultValue=ProjectStageCreateText.getExtendedSelectKey(value,title,value);
        return defaultValue;
    }
    static getSectionCount(exception){
        exception=parseInt(exception,10);
        var value={};
        var j=1;
        for(var i=0;i<ProjectStageCreateText.getMaxSubSectionCount();i++){
            if(exception!==j){
                value[i]=ProjectStageCreateText.getSelectKeyProperties(j,j);
            }
            j++;
        }
        return value;
    }
    static getColorList(exception){
        var value={};
        for(var i=0;i<ProjectStageCreateText.Glossary.getKeyCount('color');i++){
            if(ProjectStageCreateText.Glossary.getKeyPropertyAttribute('color',i,'v')!==exception){
                value[i]=ProjectStageCreateText.getExtendedSelectKeyProperties(ProjectStageCreateText.Glossary.getKeyPropertyAttribute('color',i,'v'),ProjectStageCreateText.Glossary.getKeyPropertyAttribute('color',i,'n'),ProjectStageCreateText.Glossary.getKeyPropertyAttribute('color',i,'v'),'#FFFFFF','');
            }
        }
        return value;
    }
    static getBackgroundColorList(exception){
        var value={};
        for(var i=0;i<ProjectStageCreateText.Glossary.getKeyCount('color');i++){
              /* TO DO -> CALCULATE FONT COLOR */
            if(ProjectStageCreateText.Glossary.getKeyPropertyAttribute('color',i,'v')!==exception){
                value[i]=ProjectStageCreateText.getExtendedSelectKeyProperties(ProjectStageCreateText.Glossary.getKeyPropertyAttribute('color',i,'v'),ProjectStageCreateText.Glossary.getKeyPropertyAttribute('color',i,'n'),'#FFFFFF',ProjectStageCreateText.Glossary.getKeyPropertyAttribute('color',i,'v'),'');
            }
        }
        return value;
    }
     static getFontAlignList(exception){
        var value={};        
        for(var i=0;i<ProjectStageCreateText.Glossary.getKeyCount('align');i++){
            if(ProjectStageCreateText.Glossary.getKeyPropertyAttribute('align',i,'v')!==exception){
                value[i]=ProjectStageCreateText.getSelectKeyProperties(ProjectStageCreateText.Glossary.getKeyPropertyAttribute('align',i,'v'),ProjectStageCreateText.Glossary.getKeyPropertyAttribute('align',i,'n'));
            }
        }
        return value;
    }
    static getFontSizeList(exception){
        exception=parseInt(exception,10);
        var value={};
        for(var i=2;i<57;){
            if(i!==exception){
                value[i]=ProjectStageCreateText.getSelectKeyProperties(i,i);  
            }
            i=i+2;
        }
        return value;
    }
    static getFontList(exception){
        //console.log('ProjectStageCreateText::getFontList()');
        var value={};
        for(var i=0;i<ProjectStageCreateText.Glossary.getKeyCount('fontfamily');i++){
            if(ProjectStageCreateText.Glossary.getKeyPropertyAttribute('fontfamily',i,'v')!==exception){
                value[i]=ProjectStageCreateText.getExtendedSelectKeyProperties(ProjectStageCreateText.Glossary.getKeyPropertyAttribute('fontfamily',i,'v'),ProjectStageCreateText.Glossary.getKeyPropertyAttribute('fontfamily',i,'v'),'#000000','#FFFFFF',ProjectStageCreateText.Glossary.getKeyPropertyAttribute('fontfamily',i,'v'));
            }
        }
        return value;
    }
    static createTextPageTool(){
        console.log('ProjectStageCreateText::createTextPageTool()');
        var mainDivCol=ProjectStageCreateText.Html.getCol(12);
            mainDivCol.classList.add('bg-light');
        var mainDiv=ProjectStageCreateText.Html.getRow();
        var mainDiv3=ProjectStageCreateText.Html.getRow();
        var h5=document.createElement('h5');
            h5.setAttribute('class','w-100 text-center pt-0 pb-1 mt-0 bg-secondary');// 
            h5.innerHTML='<small class="text-white">Opcje odnoszące się do całej strony:</small>';
        var toolMain1=ProjectStageCreateText.Html.getCol(3);
        var toolMain2=ProjectStageCreateText.Html.getCol(3);    
        var toolMain3=ProjectStageCreateText.Html.getCol(3);
        var toolMain4=ProjectStageCreateText.Html.getCol(3);    

        var pageBackgroundcolor=ProjectStageCreateText.createTextToolSelect('backgroundcolor','Wskaż kolor tła strony:',ProjectStageCreateText.getDefaultBackgroundColor(ProjectStageCreateText.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_BACKGROUND_COLOR','v'),ProjectStageCreateText.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_BACKGROUND_COLOR','n')),ProjectStageCreateText.getBackgroundColorList());
            pageBackgroundcolor.onchange = function (){
                console.log(this.childNodes[1].value);
                console.log(ProjectStageCreateText.helplink);
                ProjectStageCreateText.helplink.previewDiv.pageBackgroundColor=this.childNodes[1].value;
            };
        toolMain1.appendChild(pageBackgroundcolor);
        toolMain1.appendChild(ProjectStageCreateText.createTextToolRadioButton('newpage','Etap od nowej strony?',ProjectStageCreateText.getYesNowRadio('newpage')));    
        
        toolMain2.appendChild(ProjectStageCreateText.createTextToolSelectExtend('backgroundimage','Wskaż obraz tła strony:'));

        mainDiv.appendChild(h5);
        
        mainDiv3.appendChild(toolMain1);
        mainDiv3.appendChild(toolMain2);
        mainDiv3.appendChild(toolMain3);
        mainDiv3.appendChild(toolMain4);
        
        mainDivCol.appendChild(mainDiv);
        mainDivCol.appendChild(mainDiv3);
        return mainDivCol;
    }
    static createButtons(){
        /* CANCEL */
        //ProjectStageCreateText.Modal.link['button'].appendChild();
        //var mainDiv=ProjectStageCreateText.Html.getRow();
        //return mainDiv;
    }
    static  getRemoveButton(isection,isub,isubrow){
        var i=document.createElement('i');
            i.setAttribute('class','fa fa-minus');
            i.setAttribute('aria-hidden','true');
            i.setAttribute('style','color:#ffffff;');         
        var div=document.createElement('div');
            div.setAttribute('class','btn btn-danger ');//float-right
            /* CLOSURE */
            div.onclick=function(){
                /* TO DO */
                if (confirm('Potwierdź usunięcie podsekcji') === true) {
                    ProjectStageCreateText.helplink.section['section-'+isection]['subsection'][isub]['row'][isubrow].remove();
                    delete ProjectStageCreateText.helplink.section['section-'+isection]['subsection'][isub]['row'][isubrow];
                    delete ProjectStageCreateText.link.section['section-'+isection]['subsection'][isub][isubrow];
                } else {
                    // NOTHING TO DO
                }
            };
        div.appendChild(i);
        return(div); 
    }
    static createRemoveSectionButton(isection){
        // i PARAMETERS      
        var div=document.createElement('div');
            div.setAttribute('class','btn btn-danger float-right');
            div.innerText='Usuń sekcję';
            /* CLOSURE */
            div.onclick=function(){
                if (confirm('Potwierdź usunięcie sekcji') === true) {
                    ProjectStageCreateText.helplink.section['section-'+isection].main.remove();
                    delete ProjectStageCreateText.helplink.section['section-'+isection];
                    delete ProjectStageCreateText.link.section['section-'+isection];   
                } else {
                    // NOTHING TO DO
                }
                //ProjectStageCreateText.updateErrorStack(id);      
            };
        return(div); 
    }
    static createButtonCol(button){
        console.log('ProjectStageCreateText::createButtonCol()');
        /*
         * ADD BUTTON ROW
         */
        var mainDiv=ProjectStageCreateText.Html.getCol(12);
            mainDiv.classList.add('mt-2','pb-2');
        var row=ProjectStageCreateText.Html.getRow();
        var col=ProjectStageCreateText.Html.getCol(2);
            /* ADD BUTTON */
            col.appendChild(button);
        var col1=ProjectStageCreateText.Html.getCol(10);
            row.appendChild(col);
            row.appendChild(col1);
            mainDiv.appendChild(row);
        return mainDiv;
    }
    static createButtonRow(button){
        /*
         * ADD BUTTON ROW
         */
        //var mainDivCol=ProjectStageCreateText.Html.getCol(12);
        var mainDiv=ProjectStageCreateText.Html.getRow();
            mainDiv.classList.add('mt-2');
        var col=ProjectStageCreateText.Html.getCol(2);
            /* ADD BUTTON */
            col.appendChild(button);
        var col1=ProjectStageCreateText.Html.getCol(10);
            mainDiv.appendChild(col);
            mainDiv.appendChild(col1);
            //mainDivCol.appendChild(mainDiv);
            
        //return mainDivCol;
        return mainDiv;
    }
    static createAddSubsectionButton(id){
        //console.log('ProjectStageCreateText::createAddSubsectionButton()');
        var i=document.createElement('i');
            i.setAttribute('class','fa fa-plus');
            i.setAttribute("aria-hidden","true");
        var div=document.createElement('div');
            div.setAttribute('class','btn btn-success btn-add float-left');
            div.setAttribute('id',id);
            div.appendChild(i);
            div.onclick=function(){
               
                console.log('ProjectStageCreateText::createAddSubsectionButton() click');
                console.log('ACT ID:');
                console.log(this.id);
                
                console.log(ProjectStageCreateText.link.section);
                console.log(ProjectStageCreateText.helplink);
                var tmpid=this.id.split('-');
                /* 
                 * tmpid[0] - ID NAME
                 * tmpid[1] - SECTION
                 * tmpid[2] - SUBSECTION
                 * tmpid[3] - SUBSECTION ROW
                 */

                /* INCREMENT SUBSECTION ROW + 1 AND CHANGE ID */
                tmpid[3]=parseInt(tmpid[3],10)+1;
                this.id=tmpid[0]+'-'+tmpid[1]+'-'+tmpid[2]+'-'+tmpid[3];

                //console.log(this.parentNode.parentNode.parentNode.childNodes[0]);
                console.log(ProjectStageCreateText.helplink.section['section-'+tmpid[1]]['subsection'][tmpid[2]].dynamic);
                console.log(ProjectStageCreateText.helplink.section['section-'+tmpid[1]]['subsection'][tmpid[2]].all.parentNode);
                ProjectStageCreateText.helplink.section['section-'+tmpid[1]]['subsection'][tmpid[2]].dynamic.appendChild(ProjectStageCreateText.createExtendedSubsection(tmpid[1],tmpid[2],tmpid[3]));
            };
           
        return (div);
    }
    static createAddSectionButton(id){
        //console.log('ProjectStageCreateText::createAddSectionButton()');
        var div=document.createElement('div');
            div.setAttribute('class','btn btn-success btn-add');
            div.setAttribute('id',id);
            div.innerText='Dodaj sekcję';
            div.onclick=function(){
                ProjectStageCreateText.i++;
                ProjectStageCreateText.iField++;
                
                console.log('ACT ID:');
                console.log(this.id);
                var tmpid=this.id.split('-');
                /* 
                 * tmpid[0] - ID NAME
                 * tmpid[1] - SECTION
                 */
                
                 /* INCREMENT SUBSECTION ROW + 1 AND CHANGE ID */
                tmpid[1]=parseInt(tmpid[1],10)+1;
                this.id=tmpid[0]+'-'+tmpid[1];
                
                /* TO DO
                 * CHECK IS THERE ANY ROW -> IF NO -> SWAP TO createSimleRow()
                 * */
                ProjectStageCreateText.helplink['dynamicSection'].appendChild(ProjectStageCreateText.createSection(tmpid[1],0,0));
                //ProjectConst.setInputConst(ProjectConst.Modal.link['form'],'','','0',ProjectConst.getRemoveButtonCol(ProjectConst.iField));
                /* UNSET MAIN ERROR */
                //ProjectConst.Items.unsetError(ProjectConst.Modal.link['error']);
                //ProjectConst.setEnabled(ProjectConst.Modal.link['buttonConfirm']);
            };
           
        return (div);
    }
    static createManageButton(btnLabel){
        var preview=document.createElement('button');
            preview.setAttribute('class','btn btn-warning');
        var previewLabel = document.createTextNode('Podgląd');
            preview.appendChild(previewLabel);
            ProjectStageCreateText.setPreviewButtonAction(preview);
        var confirm=document.createElement('button');
            confirm.setAttribute('class','btn btn-info');
            confirm.innerText=btnLabel;
            ProjectStageCreateText.setSendDataAction(confirm);
            /* SET SEND DATA */
            
        /*
         * BUTTONS
         */
        
        ProjectStageCreateText.Modal.link['button'].appendChild(ProjectStageCreateText.Items.getCancelButton(ProjectStageCreateText.Stage.ProjectStageTable,'runTable',ProjectStageCreateText.Stage.defaultTask+'0'));
        ProjectStageCreateText.Modal.link['button'].appendChild(preview);
        ProjectStageCreateText.Modal.link['button'].appendChild(confirm);
    }
    static swapPreviewButton(ele)
    {
        /*
        console.log('ProjectStageCreateText::swapPreviewButton()');
        console.log(ele.childNodes[0].textContent);
        console.log(ele.childNodes[0]);
        */
        /*
         * data,nodeValue.textContent,wholeText
         */
        /* CHANGE BUTTON LABEL/FUNCTION */
        if(ele.childNodes[0].textContent==='Podgląd'){
            //ele.childNodes[0].textContent='Edytuj';
            ele.innerText='Edytuj';
            ProjectStageCreateText.setEditButtonAction(ele);
        }
        else{
            ele.innerText='Podgląd';
            ProjectStageCreateText.setPreviewButtonAction(ele);
        }
    }
    static setEditButtonAction(ele){
        /* console.log('ProjectStageCreateText::setEditButtonAction()'); */
        ele.onclick = function (){
            console.log(ProjectStageCreateText.helplink.dynamicDiv);
            console.log(ProjectStageCreateText.helplink.previewDiv);
            ProjectStageCreateText.swapPreviewButton(this);
            ProjectStageCreateText.Html.showField(ProjectStageCreateText.helplink.dynamicDiv);
            ProjectStageCreateText.Html.removeChilds(ProjectStageCreateText.helplink.previewDiv.all);
            ProjectStageCreateText.Html.hideField(ProjectStageCreateText.helplink.previewDiv.all);  
        };
    }
    static setPreviewButtonAction(ele){
        /* CHANGE LABEL */
        /* console.log('ProjectStageCreateText::setPreviewButtonAction()'); */
        ele.onclick = function (){
            console.log(ProjectStageCreateText.helplink);
            ProjectStageCreateText.swapPreviewButton(this);
            ProjectStageCreateText.Html.hideField(ProjectStageCreateText.helplink.dynamicDiv);
            ProjectStageCreateText.setPreviewData(ProjectStageCreateText.helplink.previewDiv.all);
            ProjectStageCreateText.Html.showField(ProjectStageCreateText.helplink.previewDiv.all);
        };
    }
    static setSendDataAction(ele){
        ele.onclick = function (){
            var fd = new FormData();
            fd.append('stage',ProjectStageCreateText.setInputData());
            ProjectStageCreateText.checkInputData(fd);
            ProjectStageCreateText.sendInputData(fd);
        };
    }
    static checkInputData(fd){
        
    }
    static setInputData(){
        var data={
            db:'0',
            sec:{},
            title:ProjectStageCreateText.helplink['title'].value,
            department:ProjectStageCreateText.link['department']
        };
        for(const property in ProjectStageCreateText.link.section){
            console.log('SECTION - '+property);
            console.log(ProjectStageCreateText.link.section[property]);
            console.log(ProjectStageCreateText.helplink.section[property]);
            data.sec[property]={
                //count:ProjectStageCreateText.link.section[property].subsectionvisible,
                db:ProjectStageCreateText.link.section[property].db,
                sub:{}        
                //subsectionvisible:ProjectStageCreateText.link.section[property].subsectionvisible
            };
            
            /* LOOP OVER SUBSECTION */   
            for(var i=0;i<ProjectStageCreateText.link.section[property].subsectionvisible;i++){
                console.log('SUBSECTION - '+i);
                console.log(ProjectStageCreateText.link.section[property].subsection[i]);    
                data.sec[property].sub[i]={
                    db:'0',
                    row:{}
                };
                 /* LOOP OVER SUBSECTION ROW */
                for(const propSubsectionRow in ProjectStageCreateText.link.section[property].subsection[i]){
                    console.log('SUBSECTION ROW - '+propSubsectionRow);
                    console.log(ProjectStageCreateText.link.section[property].subsection[i][propSubsectionRow]);
                    data.sec[property].sub[i].row[propSubsectionRow]={
                        style:{},
                        property:{},
                        newline:'',
                        db:'0'
                    };
                    data.sec[property].sub[i].row[propSubsectionRow]['property']=ProjectStageCreateText.setInputDataParseProperty(ProjectStageCreateText.link.section[property].subsection[i][propSubsectionRow].property);              
                    data.sec[property].sub[i].row[propSubsectionRow]['style']=ProjectStageCreateText.link.section[property].subsection[i][propSubsectionRow].style;
                    data.sec[property].sub[i].row[propSubsectionRow].newline=ProjectStageCreateText.link.section[property].subsection[i][propSubsectionRow].valuenewline;
                    data.sec[property].sub[i].row[propSubsectionRow].db=ProjectStageCreateText.link.section[property].subsection[i][propSubsectionRow].db;
                }
            }
        }
        console.log(data);
        return JSON.stringify(data);
    }
    static setInputDataParseProperty(property){
        var newProp={};
        for(const p in property){
            if(p!=='valueEle'){
                newProp[p]=property[p]; 
            }
            if(p==='valueEle'){
                /* FIX AND SET VALUE => ELE VALUE */
               //data.section[property].subsection[i].subsectionrow[propSubsectionRow]['property']['value']=ProjectStageCreateText.link.section[property].subsection[i][propSubsectionRow].property.valueEle.value; 
               newProp['value']=property[p].value;
            }
        }
        return newProp;
    }
    static sendInputData(fd){
        console.log('ProjectStageCreateText::sendInputData()');
        console.log(fd);
        if(ProjectStageCreateText.errorStatus){
            console.log(ProjectStageCreateText.errorStatus);
            console.log('ERROR EXIST NO SEND DATA');
            return false;
        }
        //Xhr.loadNotify=Modal.link['extra'];
        console.log(ProjectStageCreateText.Items.appurl);
        ProjectStageCreateText.Modal.loadNotify='<img src="'+ProjectStageCreateText.Items.appurl+'/img/loading_60_60.gif" alt="load_gif">';
        ProjectStageCreateText.Modal.showLoad();
        ProjectStageCreateText.Items.Xhr.setRun(ProjectStageCreateText.Stage,'runModal');
        ProjectStageCreateText.Items.Xhr.run('POST',fd,ProjectStageCreateText.Items.router+'confirmProjectStageText');
    }
    static manageSubsection(ele){
        
        console.log('ProjectStageCreateText::manageSubsection()');
        console.log(ele);
        /**/
        var sectionSetUp=parseInt(ele.value,10);
        //console.log(ProjectStageCreateText.link.section[ele.id]);
        
        /* CHANGE TO REMOVE => PROBLEM IN SEND POST*/
        
        for(var i=0;i<ProjectStageCreateText.getMaxSubSectionCount();i++){
            /* REMOVE NAME => JS FORM DATA APPEND INPUT ONLY WITH NAME */
            
            //console.log(ProjectStageCreateText.helplink.section[ele.id]['subsection'][i]['all']);
            ProjectStageCreateText.helplink.section[ele.id]['subsection'][i]['all'].classList.remove('d-line');
            ProjectStageCreateText.helplink.section[ele.id]['subsection'][i]['all'].classList.add('d-none');
          
           
            //ProjectStageCreateText.link.section[ele.id]['ele'].childNodes[i].classList.remove('d-line');
           // ProjectStageCreateText.link.section[ele.id]['ele'].childNodes[i].classList.add('d-none');
        } 
        for(var i=0;i<sectionSetUp;i++){
             /* ADD NAME => JS FORM DATA APPEND INPUT ONLY WITH NAME */
            ProjectStageCreateText.helplink.section[ele.id]['subsection'][i]['all'].classList.remove('d-none');
            ProjectStageCreateText.helplink.section[ele.id]['subsection'][i]['all'].classList.add('d-line');
           // ProjectStageCreateText.link.section[ele.id]['ele'].childNodes[i].classList.remove('d-none');
           // ProjectStageCreateText.link.section[ele.id]['ele'].childNodes[i].classList.add('d-line');
        }   
        
        /* UPDATE SUBSECTION VISIBLE */
        
        ProjectStageCreateText.link.section[ele.id].subsectionvisible=sectionSetUp;
        /*
        console.log(ProjectStageCreateText.link.section[ele.id]);
        console.log('ALL');
        console.log(ProjectStageCreateText.link.section);
        */
    }
    static getMaxSubSectionCount(){
        //console.log('ProjectStageCreateText::getMaxSubSectionCount()');
        return parseInt(ProjectStageCreateText.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_SUBSECTION_MAX','v'),10);
    }
}