class ProjectStageCreateText{
    Modal;
    Items;
    Stage;
     Html;
    /* FIELD COUNTER */
    i=0;
    /* FIELD COUNTER */
    iField=1;
    sectionCount=1;
    link={};
    helplink={};
    resonse; 
    Glossary={};
    
    create(response){
        console.log('ProjectStageCreateText::create()');
        console.log(response);
        this.setUpGlossary(response);
        /* 
         * TEST GET 
        console.log(this.Glossary.getKey('parameter'));
        console.log(this.Glossary.getKeyProperty('parameter','STAGE_TEXT_BACKGROUND_COLOR'));
        console.log(this.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_BACKGROUND_COLOR','n'));
        return true;
        */
        this.Items.prepareModal('Dodaj etap projektu - tekst','bg-info');
        this.Items.setCloseModal(this.Stage.ProjectStageTable,'runTable',this.Stage.defaultTask+'0');
        
        /* SET DEFAULT (EMPTY) LINK TO DATA*/
        this.link=this.getEmptyLink();
        /* SET DEFAULT (EMPTY) LINK TO MODAL ELEMENT*/
        this.helplink=this.getEmptyHelpLink();
       
        var form=this.Html.getForm();
        /* ASSIGN TITLE FIELD */
        this.createHead(form,'','GOP');
        /* ASSING PREVIEW FIELD */
        form.appendChild(this.createPreview());
         /* ASSING WORKING FIELD */
        form.appendChild(this.createDynamicView());
   
        this.Modal.link['adapted'].appendChild(form);
         /* ASSING ACTION BUTTONS */
        this.createButtons();
        console.log(this.Modal.link['adapted']);
        console.log(this.Modal.link['button']); 
        console.log(this.Modal.link['error']); 
        this.createManageButton('Dodaj');
    }
      setUpGlossary(response){
        console.log('ProjectStageCreateText::setUpGlossary()');
        if(this.Stage.Items.ManageGlossary.exist('text')) {
            console.log('Gloassary text exist');
            console.log(this.Glossary);
            return true;
        }
        console.log('Gloassary text not exist');
        this.Glossary=this.Stage.Items.ManageGlossary.create('text');
        this.Glossary.add('color',response.data.value.glossary.color);
        this.Glossary.add('align',response.data.value.glossary.align);
        this.Glossary.add('decoration',response.data.value.glossary.decoration);
        this.Glossary.add('fontfamily',response.data.value.glossary.fontfamily);
        this.Glossary.add('measurement',response.data.value.glossary.measurement);
        this.Glossary.add('parameter',response.data.value.glossary.parameter);
        console.log(this.Glossary);
    }
      getEmptyLink(){
        console.log('ProjectStageCreateText::getEmptyLink()');
        var link={
            department:'',
            section:{},
            page:{}
        };
        return link;
    }
      getEmptyHelpLink(){
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
      createPreview(){
        console.log('ProjectStageCreateText::createPreview()');
        var mainDiv=this.Html.getRow();
            mainDiv.classList.add('d-none');
            this.helplink['previewDiv'].all=mainDiv;
            this.helplink.previewDiv.pageBackgroundColor=this.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_BACKGROUND_COLOR','v');
        return mainDiv;
    }
      createHead(ele,title,department){
        var titleDiv=this.Html.getRow();
        var departmentDiv=this.Html.getRow();
            //mainDiv.classList.add('bg-info');
            this.helplink['titleDiv']=titleDiv;
        
        var titleLabelDiv=this.Html.getCol(1);
        var titleInputDiv=this.Html.getCol(11);
        
      
            titleLabelDiv.appendChild(this.createLabel('h3','Tytuł'));
            
        var input=this.Html.getInput('title',title,'text');
            input.classList.add('form-control');
            input.setAttribute('placeholder','Enter title');
            input.setAttribute('aria-describedby',"titleHelp" );
            titleInputDiv.appendChild(input);
        
        this.helplink['title']=input;
        
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
       
        var departmentLabelDiv=this.Html.getCol(1);
        var departmentInputDiv=this.Html.getCol(11);
            departmentLabelDiv.appendChild(this.createLabel('h3','Dział:'));
        var department=this.createSelect('department','department');
            department.setAttribute('aria-describedby',"departmentHelp" );
            department.appendChild(this.createSelectOption('Domyślny:',departmentData));  
            department.appendChild(this.createSelectOption('Dostępne:',departmentData)); 
            department.onchange = function () {
                //console.log(this);
                //console.log(this.value);
                this.link['department']=this.value;
            };
            this.link['department']=departmentData[0].value;
        
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
      createLabel(h,value){
        var titleLabelValue=document.createTextNode(value);
        var titleLabel=document.createElement(h);
            titleLabel.classList.add('text-center','font-weight-bold');
            titleLabel.appendChild(titleLabelValue);
            return titleLabel;
    }
      createDynamicView(){
        console.log('ProjectStageCreateText::createDynamicView()');
       
        var mainDiv=this.Html.getRow();
            mainDiv.classList.add('d-block');
            
        var mainDivSection=this.Html.getCol(12);
            
            /* CREATE TEXT SECTION */
            mainDivSection.appendChild(this.createSection(0,0,0));
            mainDiv.appendChild(mainDivSection);
             /* CREATE ADD BUTTON */
            mainDiv.appendChild(this.createButtonCol(this.createAddSectionButton()));
            //mainDiv.appendChild(this.createButtonCol(this.createAddSectionButton('section-0')));
            /* CREATE TEXT SECTION PAGE TOOL*/
            mainDiv.appendChild(this.createTextPageTool());
            
            this.helplink['dynamicDiv']=mainDiv;
            this.helplink['dynamicSection']=mainDivSection;
            
        return mainDiv;
    }
      setPreviewData(mainDiv){
        console.log('ProjectStageCreateText::setPreviewData()');
        this.setPreviewPage(mainDiv);
        //this.setPreviewPageText(mainDiv.childNodes[0].childNodes[0].childNodes[0]);
    }
      setPreviewPage(mainDiv){
        console.log('ProjectStageCreateText::setPreviewPage()');
        console.log('ALL SECTION');
        console.log(this.link.section);
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
            blankPage.style.backgroundColor=this.helplink.previewDiv.pageBackgroundColor;
        var writePageSectionWidth=607;
        var writePage=document.createElement('div');
            writePage.style.width='699px';
            writePage.style.height='1028px';
            /* IT IS DEPED OF FONT SIZE */
            writePage.style.paddingTop='92px';
            /* DEFAULT LEFT MARGIN 2,5 cm */ 
            writePage.style.paddingLeft='92px'; /* ALL 314, MAIN 10 */
            /* TO DO */
            //writePage.style.textAlign=this.helplink.previewDiv.pageTextAlign
            
        /* LOOP OVER  SECTION */    

        for(const property in this.link.section){
            console.log(this.link.section[property]);
            
            /* CHECK AND SETUP COLUMNS NUMBER */
            writePageSectionWidth=Math.floor(607/this.link.section[property].subsectionvisible); /* minus padding left 92px */
            /* LOOP OVER SUBSECTION */   
            for(var i=0;i<this.link.section[property].subsectionvisible;i++){
                console.log(this.link.section[property].subsection[i]);
                
                var writePageSection=document.createElement('div');
                    writePageSection.style.width=writePageSectionWidth+'px';
                    writePageSection.style.border='0px';
                    writePageSection.style.margin='0px';
                    writePageSection.style.cssFloat='LEFT';
                
                 /* LOOP OVER SUBSECTION ROW */
                for(const propSubsectionRow in this.link.section[property].subsection[i]){
                    
                    /* CHECK BREAKLINE */
                    this.setPreviewPageBreakLine(writePageSection,this.link.section[property].subsection[i][propSubsectionRow]);
                    /* SIMPLE TEXT */
                    //writePageSection.innerText=this.link.section[property].subsection[i][propSubsectionRow].value.value;
                    /* SIMPLE HTML */
                    //writePageSection.innerHTML=this.link.section[property].subsection[i][propSubsectionRow].value.value;                   
                    /* ADVANCED WITH STYLE */
                    writePageSection.appendChild(this.setPreviewTextHtml(this.link.section[property].subsection[i][propSubsectionRow]));
                }
                writePage.appendChild(writePageSection);
            }
        }
        console.log(writePage);  
        blankPage.appendChild(writePage);
        wholePage.appendChild(blankPage);
        mainDiv.appendChild(wholePage);       
    }
      setPreviewPageBreakLine(ele,textProperty){
        var br=document.createElement('br');
            if(textProperty.valuenewline==='1'){
                console.log('VALUE NEW LINE === 1 ADD BREAK LINE');
                ele.appendChild(br);
            }
    }
      setPreviewPageValue(ele,subsectionrow){
        console.log('ProjectStageCreateText::setPreviewPageValue()');
        console.log(ele);
        console.log(subsectionrow);
    }
      getEmptyText(){
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
      setPreviewTextObject(key,value,all){
        console.log('ProjectStageCreateText::setPreviewTextObject()');
        const field = key.split('-');
        //console.log(field[0]);
        //console.log(field[1]);
        //console.log(value);
        if(!all.hasOwnProperty(field[1])){
            //console.log('create new object - '+field[1]);
            all[field[1]]=this.getEmptyText();//new Object();
            all[field[1]][field[0]]=value;
        }
        else{
            all[field[1]][field[0]]=value;          
        }
    }
      setPreviewTextHtml(textProperty){
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
      createSection(isection,id,idSection){
        console.log('ProjectStageCreateText::createSection()');
        console.log(this.link);
        var mainDiv=this.Html.getRow(); 
        var mainDivHeader=this.Html.getCol(12); 
        var mainDivBody=this.Html.getCol(12); 
        var hr=document.createElement('hr');
            hr.setAttribute('class','w-100 border-1 border-secondary mt-2');//
        var h=document.createElement('h3');    
            h.setAttribute('class','w-100 text-center bg-info text-white');//
            h.innerHTML='<span class="text-muted">[WIERSZ]</span> Sekcja  nr '+isection;
            mainDivHeader.appendChild(hr);
            mainDivHeader.appendChild(h);
            this.link.section['section-'+isection]={
                subsectionvisible:0,
                //ele:mainDivBody,
                subsection:{},
                db:idSection
            };
            this.helplink.section['section-'+isection]={
                main:{},
                subsection:{}
            };

            for(var i=0;i<this.getMaxSubSectionCount();i++){
                
                this.helplink.section['section-'+isection]['subsection'][i]={
                    /* FOR SHOW/HIDE */
                    all:{},
                    /* FOR ADD */
                    dynamic:{},
                    /* FOR REMOVE */
                    row:{}
                };
                this.link.section['section-'+isection].subsection[i]={};
                /* ADD SUBSECTION */
                var mainDivSubsection=this.Html.getRow();
                var mainDivSubsectionBtn=this.Html.getCol(12);
                var mainDivSubsectionBody=this.Html.getCol(12);
                    
                    mainDivSubsectionBody.appendChild(this.createSubsection(isection,i,0,0,0));
                    this.helplink.section['section-'+isection]['subsection'][i].dynamic=mainDivSubsectionBody;
                    mainDivSubsectionBtn.appendChild(this.createButtonRow(this.createAddSubsectionButton(isection,i,0)));
                    mainDivSubsection.appendChild(mainDivSubsectionBody);
                    mainDivSubsection.appendChild(mainDivSubsectionBtn);
                    
                    this.helplink.section['section-'+isection]['subsection'][i].all=mainDivSubsection;
                    mainDivBody.appendChild(mainDivSubsection);
            }
            mainDivHeader.appendChild(this.createSectionTool(isection)); 

            mainDiv.appendChild(mainDivHeader);  
            mainDiv.appendChild(mainDivBody);   
            this.helplink.section['section-'+isection].main=mainDiv;
            console.log(mainDiv);
            return mainDiv;
    }
    createSubsection(isection,isub,isubrow,newLine,idSubsectionRow){
        console.log('ProjectStageCreateText::createSubsection()');
        var mainDiv=this.Html.getRow();
            /* APPEND SUBSECTION ROW + ELE */
            this.link.section['section-'+isection].subsection[isub][isubrow]={
                        //ele:mainDiv, 
                        style:{},
                        property:{
                            id:'0',
                            valueEle:{}
                        },
                        valuenewline:newLine,
                        db:idSubsectionRow
                };
              
            this.helplink.section['section-'+isection]['subsection'][isub]['row'][isubrow]=mainDiv;
            this.createSubsectionRow(mainDiv,isection,isub,isubrow);
            mainDiv.appendChild(this.createTextError('error-'+isection+'-'+isub+'-'+isubrow));  
            mainDiv.appendChild(this.createTextTool(isection,isub,isubrow));  
           
            
           
        return mainDiv;
    }
    createExtendedSubsection(isection,isub,isubrow){
        var mainDiv=this.createSubsection(isection,isub,isubrow);
            mainDiv.appendChild(this.createExtendedTextTool(isection,isub,isubrow));
        return mainDiv;
    }
      createSubsectionRow(mainDivText,isection,isub,isubrow){
        console.log('ProjectStageCreateText::createSubsectionRow()\r\nSECTION - '+isection+'\r\nSUBSECTION - '+isub+'\r\nROW - '+isubrow);
        /*
         * 
         * isection = section number
         */
        //var mainDivCol=this.Html.getCol(12);
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
            removeDiv.appendChild(this.getRemoveButton(isection,isub,isubrow));
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
            //console.log(this.glossary.parameter['STAGE_TEXT_FONT_SIZE_MEASUREMENT'].v);
            //input.style.fontSize='12pt';
            input.style.fontSize=this.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_FONT_SIZE','v')+this.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_FONT_SIZE_MEASUREMENT','v');
            input.style.color=this.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_COLOR','v');
            input.style.backgroundColor=this.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_BACKGROUND_COLOR','v');
            input.style.fontFamily=this.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_FONT_FAMILY','v');
            input.style.fontWeight=this.setValueStyleFontWeight(this.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_FONT_BOLD','v'));
            input.style.fontStyle=this.setValueStyleFontStyle(this.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_FONT_ITALIC','v'));
            input.style.textDecoration=this.setValueStyleTextDecoration(input.style.textDecoration,this.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_FONT_UNDERLINE','v'),'underline');
            input.style.textDecoration=this.setValueStyleTextDecoration(input.style.textDecoration,this.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_FONT_LINETHROUGH','v'),'line-through');
            /* CREATE LINK TO FIELD INPUT VALUE */
            //this.link.value[isection+'-'+isub+'-'+isubrow]=input;
            
            this.link.section['section-'+isection]['subsection'][isub][isubrow]['property']['valueEle']=input;
            this.helplink.section['section-'+isection]['subsection'][isub]['row'][isubrow]=input;
            
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
            this.helplink.section['section-'+isection]['subsection'][isub]['row'][isubrow]=mainDivText;
        //return mainDiv;
    }
      createSectionTool(isection){
        console.log('ProjectStageCreateText::createSectionTool()');
        //var mainDiv=this.Html.getCol(12);
        var mainDivSection=this.Html.getRow();
        var tool1=this.Html.getCol(3);
        var tool2=this.Html.getCol(3);    
        var tool3=this.Html.getCol(3);
        var tool4=this.Html.getCol(3);  
        var sectioncount=this.createTextToolSelect('section-'+isection,'Wskaż ilość podsekcji <small class="text-muted">[KOLUMN]</small>:',this.getSelectKey(this.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_SUBSECTION_DEFAULT','v'),this.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_SUBSECTION_DEFAULT','v')),this.getSectionCount(this.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_SUBSECTION_DEFAULT','v')));
        var classObject=this;    
            sectioncount.childNodes[1].onchange = function () { classObject.manageSubsection(this); };
            /* FIRST RUN TO SETUP SECTION DEFAULT COUNT */
            this.manageSubsection(sectioncount.childNodes[1]);
            tool1.appendChild(sectioncount);
            tool4.appendChild(this.createRemoveSectionButton(isection));
            //console.log( tool4);
        mainDivSection.appendChild(tool1);
        mainDivSection.appendChild(tool2);
        mainDivSection.appendChild(tool3);
        mainDivSection.appendChild(tool4);
        return mainDivSection;
    }
      createTextError(id){
        //console.log('ProjectStageCreateText::createTextError()');
        var mainDiv=this.Html.getCol(12); 
        //var mainDiv=this.Html.getRow(); 
            mainDiv.classList.add('alert','alert-danger','d-none','mt-1','mb-0');//d-block
            mainDiv.setAttribute('id',id);
        var errorDiv=this.Html.getCol(12);
        //var errorDiv=this.Html.getRow();
            errorDiv.innerText='Test ERROR';
            mainDiv.appendChild(errorDiv);  
           //mainDivCol.appendChild(mainDiv);
        return mainDiv;
    }
      createTextTool(isection,isub,isubrow){
        /*
        console.log('ProjectStageCreateText::createTextTool()');
        console.log(isection);
        console.log(isub);
        console.log(isubrow);
        */
        var mainDivCol=this.Html.getCol(12);
        var mainDiv=this.Html.getRow();
        var tool1=this.Html.getCol(2);
        var tool2=this.Html.getCol(3);
        var tool3=this.Html.getCol(3);
        //var tool2=this.Html.getCol(5);
        var tool4=this.Html.getCol(4);
            tool4.classList.add('pt-4');
        var fontsize=this.createTextToolSelectExtend('fontsize-'+isection+'-'+isub+'-'+isubrow,'Rozmiar tekstu:',this.getDefaultFontSize(this.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_FONT_SIZE','v'),this.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_FONT_SIZE','v')),this.getFontSizeList(this.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_FONT_SIZE','v')));
        var fontcolor=this.createTextToolSelectExtend('fontcolor-'+isection+'-'+isub+'-'+isubrow,'Kolor tekstu:',this.getDefaultColor(this.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_COLOR','v'),this.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_COLOR','n')),this.getColorList(this.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_COLOR','v')));
        var fontfamily=this.createTextToolSelectExtend('fontfamily-'+isection+'-'+isub+'-'+isubrow,'Czcionka:',this.getDefaultFont(this.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_FONT_FAMILY','v'),this.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_FONT_FAMILY','v')),this.getFontList(this.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_FONT_FAMILY','v')));
        var textalign=this.createTextToolSelectExtend('textalign-'+isection+'-'+isub+'-'+isubrow,'Wskaż kierunek tekstu:',this.getSelectKey(this.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_ALIGN','v'),this.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_ALIGN','n')),this.getFontAlignList(this.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_ALIGN','v')));
        var fontbackgroundcolor=this.createTextToolSelectExtend('fontbackgroundcolor-'+isection+'-'+isub+'-'+isubrow,'Kolor tła:',this.getDefaultBackgroundColor(this.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_BACKGROUND_COLOR','v'),this.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_BACKGROUND_COLOR','n')),this.getBackgroundColorList(this.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_BACKGROUND_COLOR','v'))); 
            
        tool1.appendChild(fontsize);
        tool1.appendChild(fontcolor);
        tool2.appendChild(fontfamily);
        tool2.appendChild(textalign);
        tool3.appendChild(fontbackgroundcolor);
        
        this.link.section['section-'+isection]['subsection'][isub][isubrow]['style']={
            fontsize:this.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_FONT_SIZE','v')+this.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_FONT_SIZE_MEASUREMENT','v'),
            fontcolor:this.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_COLOR','v'),
            fontfamily:this.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_FONT_FAMILY','v'),
            textalign:this.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_ALIGN','v'),
            fontbackgroundcolor:this.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_BACKGROUND_COLOR','v')
        };
        
        this.createTextDecorationTool(tool4,isection,isub,isubrow); 
        //console.log(this.link);
        mainDiv.appendChild(tool1);
        mainDiv.appendChild(tool2);
        mainDiv.appendChild(tool3);
        mainDiv.appendChild(tool4);
        mainDivCol.appendChild(mainDiv);
        return mainDivCol;
        //return mainDiv;
    }
      createTextDecorationTool(tool4,isection,isub,isubrow){
        //console.log('ProjectStageCreateText::createTextDecorationTool()');
        for(const prop of this.Glossary.getKey('decoration').entries()) { 
            //console.log(prop[0],prop[1]);
            //pageProperties[pair[0]]=pair[1];
            this.setTextDecorationToolEntry(prop[1],tool4,isection,isub,isubrow);  
            /* SET DEFAULT */
            //this.link.section['section-'+isection]['subsection'][isub][isubrow]['style'][prop.inputName]=input.childNodes[0];
        }
    }
      setTextDecorationToolEntry(decorationProp,tool4,isection,isub,isubrow){
        /*
         * decorationProp.n. - name
         * decorationProp.v - value
         */
        var prop=this.setTextDecorationToolEntryProperties(decorationProp,isection,isub,isubrow);
        var input = this.createTextToolCheckBox(prop.inputName+'-'+isection+'-'+isub+'-'+isubrow,prop.label,prop.check);
        tool4.appendChild(input);
        //this.link.section['section-'+isection]['subsection'][isub][isubrow]['style'][prop.inputName]=input.childNodes[0];
        this.link.section['section-'+isection]['subsection'][isub][isubrow]['style'][prop.inputName]=prop.check;
    }
      setTextDecorationToolEntryCheck(input,check){
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
       setTextDecorationToolEntryProperties(decorationProp){
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
                fullProp.check=this.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_FONT_BOLD','v');
                fullProp.inputName='fontbold';
                fullProp.label='<b>'+decorationProp.n+'</b>';
                break;
            case 'UNDERLINE':
                fullProp.check=this.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_FONT_UNDERLINE','v');
                fullProp.inputName='fontunderline';
                fullProp.label='<u>'+decorationProp.n+'</u>';
                break;
            case 'ITALIC':
                fullProp.check=this.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_FONT_ITALIC','v');
                fullProp.inputName='fontitalic';
                fullProp.label='<i>'+decorationProp.n+'</i>';
                break;
            case 'line-through':
                fullProp.check=this.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_FONT_LINETHROUGH','v');
                fullProp.inputName='fontlinethrough';
                fullProp.label='<span style="text-decoration:line-through;">'+decorationProp.n+'</span>';
                break;
            default:
                console.log('UNAVAILABLE - '+decorationProp.v);
                break;
        }
        
        return fullProp;
    }
    createExtendedTextTool(isection,isub,isubrow){
        console.log('ProjectStageCreateText::createExtendedTextTool()');
        var mainDivCol=this.Html.getCol(12);
        var mainDiv=this.Html.getRow();
        var tool1=this.Html.getCol(5);
        var tool2=this.Html.getCol(5);
        var tool3=this.Html.getCol(2);
        var radio = this.createTextToolRadioButton('valuenewline-'+isection+'-'+isub+'-'+isubrow,'Tekst od nowej lini?',this.getYesNowRadio('valuenewline-'+isection+'-'+isub+'-'+isubrow));
        var classObject=this;    
            /* SET DEFAULT VALUE FOR BREAK LINE */
            this.link.section['section-'+isection]['subsection'][isub][isubrow]['valuenewline']='1';
            /* ADD ACTION */
            console.log(radio.childNodes[1]);
            /* YES */
            console.log(radio.childNodes[1].childNodes[0].childNodes[0]);
            radio.childNodes[1].childNodes[0].childNodes[0].onclick = function (){   
                classObject.changeNewLineValue(this);
            };
             /* NO */
            console.log(radio.childNodes[1].childNodes[1].childNodes[0]);
            radio.childNodes[1].childNodes[1].childNodes[0].onclick = function (){
                classObject.changeNewLineValue(this);
            };
            
            
        tool1.appendChild(radio);
        
        console.log(tool1.childNodes[0].childNodes[1]); 
        mainDiv.appendChild(tool1);
        mainDiv.appendChild(tool2);
        mainDiv.appendChild(tool3);
        mainDivCol.appendChild(mainDiv);
        return mainDivCol;
    }
      changeNewLineValue(ele){
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
        this.link.section['section-'+tmpid[1]]['subsection'][tmpid[2]][tmpid[3]]['valuenewline']=tmpid[4];
    }
      createTextToolCheckBox(id,title,defaultvalue){
        
        //if(defaultvalue)
          
        var classObject=this;
        
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
                classObject.setValueStyle(this.id,this.value);
            };
            this.setTextDecorationToolEntryCheck(input,defaultvalue);
            
        var label=document.createElement('label');
            label.setAttribute('class','form-check-label');
            label.setAttribute('for',id);
            label.innerHTML=title;
       div.appendChild(input);
       div.appendChild(label);
       return div;
    }
      createTextToolSelect(id,title,actdata,alldata){
        //console.log('ProjectStageCreateText::createTextToolSelect()');
        var div=document.createElement('div');
            div.setAttribute('class','w-100 mt-2');
        var label=document.createElement('span');
            label.setAttribute('class','text-info');
            label.innerHTML=title;
        var select=this.createSelect(id,id);
            select.appendChild(this.createTextToolSelectOption('Domyślny:',actdata));  
            select.appendChild(this.createTextToolSelectOption('Dostępne:',alldata)); 
            div.appendChild(label);
            div.appendChild(select);
        return div;
    }
      createSelect(id,name){
        var select=document.createElement('select');
            select.setAttribute('class','form-control');
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
                    option.setAttribute('value',data[property].value);
                    option.style.color = '#000000';
                    option.style.backgroundColor = '#FFFFFF';
                    option.innerText=data[property].title;
                    optionGroup.appendChild(option);
            };
        return optionGroup;
    }
      createTextToolSelectExtend(id,title,actdata,alldata){
        //console.log('ProjectStageCreateText::createTextToolSelectExtend()');
        var select = this.createTextToolSelect(id,title,actdata,alldata);
        //console.log(select.childNodes[1]);
        

        /* CLOSURE - DOMKNIĘCIE*/
        var classObject=this; 
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
            classObject.setValueStyle(this.id,this.value);  
            /* RECALCULATE SELECT */
            /* 
             * REMOVE EXIST ACT AND AVA 
             this.childNodes[1].remove();
             this.childNodes[0].remove();
             */
        };
        return select;
    }
   
      setValueStyle(id,value){
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
        console.log(this.link);
                switch(tmpid[0]){
                    case 'fontsize':
                        this.link.section['section-'+tmpid[1]]['subsection'][tmpid[2]][tmpid[3]]['style'][tmpid[0]]=value+'pt'; 
                        this.link.section['section-'+tmpid[1]]['subsection'][tmpid[2]][tmpid[3]]['property']['valueEle'].style.fontSize=value+'pt';
                        break;
                    case 'fontcolor':
                        this.link.section['section-'+tmpid[1]]['subsection'][tmpid[2]][tmpid[3]]['style'][tmpid[0]]=value;
                        this.link.section['section-'+tmpid[1]]['subsection'][tmpid[2]][tmpid[3]]['property']['valueEle'].style.color=value;
                        break;   
                    case 'fontbackgroundcolor':
                        this.link.section['section-'+tmpid[1]]['subsection'][tmpid[2]][tmpid[3]]['style'][tmpid[0]]=value;
                        this.link.section['section-'+tmpid[1]]['subsection'][tmpid[2]][tmpid[3]]['property']['valueEle'].style.backgroundColor=value;
                        break;
                    case 'fontfamily':
                        this.link.section['section-'+tmpid[1]]['subsection'][tmpid[2]][tmpid[3]]['style'][tmpid[0]]=value;
                        this.link.section['section-'+tmpid[1]]['subsection'][tmpid[2]][tmpid[3]]['property']['valueEle'].style.fontFamily=value;
                        break;
                    case 'textalign':
                        this.link.section['section-'+tmpid[1]]['subsection'][tmpid[2]][tmpid[3]]['style'][tmpid[0]]=value;
                        this.link.section['section-'+tmpid[1]]['subsection'][tmpid[2]][tmpid[3]]['property']['valueEle'].style.textAlign=value;
                        break;
                    case 'fontbold':
                        this.link.section['section-'+tmpid[1]]['subsection'][tmpid[2]][tmpid[3]]['property']['valueEle'].style.fontWeight =this.setValueStyleFontWeight(value);
                        this.link.section['section-'+tmpid[1]]['subsection'][tmpid[2]][tmpid[3]]['style'][tmpid[0]]=value;
                        break;
                    case 'fontunderline':
                        this.link.section['section-'+tmpid[1]]['subsection'][tmpid[2]][tmpid[3]]['property']['valueEle'].style.textDecoration=this.setValueStyleTextDecoration(this.link.section['section-'+tmpid[1]]['subsection'][tmpid[2]][tmpid[3]]['property']['valueEle'].style.textDecoration,value,'underline');
                        console.log(this.link.section['section-'+tmpid[1]]['subsection'][tmpid[2]][tmpid[3]]['property']['valueEle'].style.textDecoration);
                        this.link.section['section-'+tmpid[1]]['subsection'][tmpid[2]][tmpid[3]]['style'][tmpid[0]]=value;
                        break;
                    case 'fontitalic':
                        this.link.section['section-'+tmpid[1]]['subsection'][tmpid[2]][tmpid[3]]['property']['valueEle'].style.fontStyle =this.setValueStyleFontStyle(value);           
                        this.link.section['section-'+tmpid[1]]['subsection'][tmpid[2]][tmpid[3]]['style'][tmpid[0]]=value;
                        break;
                    case 'fontlinethrough':
                        this.link.section['section-'+tmpid[1]]['subsection'][tmpid[2]][tmpid[3]]['property']['valueEle'].style.textDecoration=this.setValueStyleTextDecoration(this.link.section['section-'+tmpid[1]]['subsection'][tmpid[2]][tmpid[3]]['property']['valueEle'].style.textDecoration,value,'line-through');
                        console.log(this.link.section['section-'+tmpid[1]]['subsection'][tmpid[2]][tmpid[3]]['property']['valueEle'].style.textDecoration);
                        this.link.section['section-'+tmpid[1]]['subsection'][tmpid[2]][tmpid[3]]['style'][tmpid[0]]=value;
                        break;
                    default:
                        console.log('unavailable');
                        break;
                }
    }
      setValueStyleFontStyle(value){
        if(value==='1'){
            return 'italic';
        }
        else{
            return 'normal';
        }
    }
      setValueStyleFontWeight(value){
        if(value==='1'){
            return 'bold';
        }
        else{
            return 'normal';
        }
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
       createTextToolSelectOption(title,data){
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
      createTextToolRadioButton(id,title,value){
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
      getYesNowRadio(id){
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

   
      getSelectKey(value,title){
        var selectKey={};
            selectKey[0]=this.getSelectKeyProperties(value,title);
        return selectKey;
    }
      getExtendedSelectKey(value,title,key){
        var selectKey={};
            selectKey[key]=this.getSelectKeyProperties(value,title);
        return selectKey;
    }
      getSelectKeyProperties(value,title){
        var selectKeyProp={
                value:value,
                title:title,
                fontcolor:'#000000',
                backgroundcolor:'#FFFFFF',
                fontfamily:''
            };
        return selectKeyProp;
    }
      getExtendedSelectKeyProperties(value,title,fontcolor,backgroundcolor,fontfamily){
        var selectKeyProp=this.getSelectKeyProperties(value,title);
            selectKeyProp.fontcolor=fontcolor;
            selectKeyProp.backgroundcolor=backgroundcolor;
            selectKeyProp.fontfamily=fontfamily;
        return selectKeyProp;
    }
      getDefaultFont(value,title){
        //console.log('ProjectStageCreateText::getDefaultFont()');
        var defaultValue=this.getSelectKey(value,title);
            defaultValue[0].fontfamily=value;
        return defaultValue;
    }
       getDefaultColor(value,title){
        var defaultValue=this.getSelectKey(value,title);
            defaultValue[0].fontcolor=value;
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
        for(var i=0;i<this.getMaxSubSectionCount();i++){
            if(exception!==j){
                value[i]=this.getSelectKeyProperties(j,j);
            }
            j++;
        }
        return value;
    }
      getColorList(exception){
        var value={};
        for(var i=0;i<this.Glossary.getKeyCount('color');i++){
            if(this.Glossary.getKeyPropertyAttribute('color',i,'v')!==exception){
                value[i]=this.getExtendedSelectKeyProperties(this.Glossary.getKeyPropertyAttribute('color',i,'v'),this.Glossary.getKeyPropertyAttribute('color',i,'n'),this.Glossary.getKeyPropertyAttribute('color',i,'v'),'#FFFFFF','');
            }
        }
        return value;
    }
      getBackgroundColorList(exception){
        var value={};
        for(var i=0;i<this.Glossary.getKeyCount('color');i++){
              /* TO DO -> CALCULATE FONT COLOR */
            if(this.Glossary.getKeyPropertyAttribute('color',i,'v')!==exception){
                value[i]=this.getExtendedSelectKeyProperties(this.Glossary.getKeyPropertyAttribute('color',i,'v'),this.Glossary.getKeyPropertyAttribute('color',i,'n'),'#FFFFFF',this.Glossary.getKeyPropertyAttribute('color',i,'v'),'');
            }
        }
        return value;
    }
       getFontAlignList(exception){
        var value={};        
        for(var i=0;i<this.Glossary.getKeyCount('align');i++){
            if(this.Glossary.getKeyPropertyAttribute('align',i,'v')!==exception){
                value[i]=this.getSelectKeyProperties(this.Glossary.getKeyPropertyAttribute('align',i,'v'),this.Glossary.getKeyPropertyAttribute('align',i,'n'));
            }
        }
        return value;
    }
      getFontSizeList(exception){
        exception=parseInt(exception,10);
        var value={};
        for(var i=2;i<57;){
            if(i!==exception){
                value[i]=this.getSelectKeyProperties(i,i);  
            }
            i=i+2;
        }
        return value;
    }
      getFontList(exception){
        //console.log('ProjectStageCreateText::getFontList()');
        var value={};
        for(var i=0;i<this.Glossary.getKeyCount('fontfamily');i++){
            if(this.Glossary.getKeyPropertyAttribute('fontfamily',i,'v')!==exception){
                value[i]=this.getExtendedSelectKeyProperties(this.Glossary.getKeyPropertyAttribute('fontfamily',i,'v'),this.Glossary.getKeyPropertyAttribute('fontfamily',i,'v'),'#000000','#FFFFFF',this.Glossary.getKeyPropertyAttribute('fontfamily',i,'v'));
            }
        }
        return value;
    }
    createTextPageTool(){
        console.log('ProjectStageCreateText::createTextPageTool()');
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

        var pageBackgroundcolor=this.createTextToolSelect('backgroundcolor','Wskaż kolor tła strony:',this.getDefaultBackgroundColor(this.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_BACKGROUND_COLOR','v'),this.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_BACKGROUND_COLOR','n')),this.getBackgroundColorList());
            pageBackgroundcolor.onchange = function (){
                console.log(this.childNodes[1].value);
                console.log(this.helplink);
                this.helplink.previewDiv.pageBackgroundColor=this.childNodes[1].value;
            };
        toolMain1.appendChild(pageBackgroundcolor);
        toolMain1.appendChild(this.createTextToolRadioButton('newpage','Etap od nowej strony?',this.getYesNowRadio('newpage')));    
        
        toolMain2.appendChild(this.createTextToolSelectExtend('backgroundimage','Wskaż obraz tła strony:'));

        mainDiv.appendChild(h5);
        
        mainDiv3.appendChild(toolMain1);
        mainDiv3.appendChild(toolMain2);
        mainDiv3.appendChild(toolMain3);
        mainDiv3.appendChild(toolMain4);
        
        mainDivCol.appendChild(mainDiv);
        mainDivCol.appendChild(mainDiv3);
        return mainDivCol;
    }
      createButtons(){
        /* CANCEL */
        //this.Modal.link['button'].appendChild();
        //var mainDiv=this.Html.getRow();
        //return mainDiv;
    }
    getRemoveButton(isection,isub,isubrow){
        console.log('ProjectStageCreateText::getRemoveButton()');
        var i=document.createElement('i');
            i.setAttribute('class','fa fa-minus');
            i.setAttribute('aria-hidden','true');
            i.setAttribute('style','color:#ffffff;');         
        var div=document.createElement('div');
            div.setAttribute('class','btn btn-danger ');//float-right
        var classObject=this;    
            /* CLOSURE */
            div.onclick=function(){
                /* TO DO */
                if (confirm('Potwierdź usunięcie podsekcji') === true) {
                    classObject.helplink.section['section-'+isection]['subsection'][isub]['row'][isubrow].remove();
                    delete classObject.helplink.section['section-'+isection]['subsection'][isub]['row'][isubrow];
                    delete classObject.link.section['section-'+isection]['subsection'][isub][isubrow];
                } else {
                    // NOTHING TO DO
                }
            };
        div.appendChild(i);
        return(div); 
    }
      createRemoveSectionButton(isection){
        // i PARAMETERS      
        var div=document.createElement('div');
            div.setAttribute('class','btn btn-danger float-right');
            div.innerText='Usuń sekcję';
        var classObject=this;
            /* CLOSURE */
            div.onclick=function(){
                if (confirm('Potwierdź usunięcie sekcji') === true) {
                    classObject.helplink.section['section-'+isection].main.remove();
                    delete classObject.helplink.section['section-'+isection];
                    delete classObject.link.section['section-'+isection];   
                } else {
                    // NOTHING TO DO
                }
                //this.updateErrorStack(id);      
            };
        return(div); 
    }
      createButtonCol(button){
        console.log('ProjectStageCreateText::createButtonCol()');
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
    createAddSubsectionButton(isection,isubsection,irow){
        //console.log('ProjectStageCreateText::createAddSubsectionButton()');
        var i=document.createElement('i');
            i.setAttribute('class','fa fa-plus');
            i.setAttribute("aria-hidden","true");
        var div=document.createElement('div');
            div.setAttribute('class','btn btn-success btn-add float-left');
            div.appendChild(i);
        /* SET CLASS OBJECT */
        var classObject=this;
            div.onclick=function(){       
                console.log('ProjectStageCreateText::createAddSubsectionButton() click');
                /* INCREMENT SUBSECTION ROW */
                irow++;
                classObject.helplink.section['section-'+isection]['subsection'][isubsection].dynamic.appendChild(classObject.createExtendedSubsection(isection,isubsection,irow));
            };
        return (div);
    }
      createAddSectionButton(){
        //console.log('ProjectStageCreateText::createAddSectionButton()');
        var div=document.createElement('div');
            div.setAttribute('class','btn btn-success btn-add');

        var classObject=this;
            div.innerText='Dodaj sekcję';
            div.onclick=function(){
                classObject.i++;
                classObject.iField++;
                
                /* TO DO
                 * CHECK IS THERE ANY ROW -> IF NO -> SWAP TO createSimleRow()
                 * */
                classObject.helplink['dynamicSection'].appendChild(classObject.createSection(classObject.iField,0,0));
                //ProjectConst.setInputConst(ProjectConst.Modal.link['form'],'','','0',ProjectConst.getRemoveButtonCol(ProjectConst.iField));
                /* UNSET MAIN ERROR */
                //ProjectConst.Items.unsetError(ProjectConst.Modal.link['error']);
                //ProjectConst.setEnabled(ProjectConst.Modal.link['buttonConfirm']);
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
            this.setSendDataAction(confirm);
            /* SET SEND DATA */
            
        /*
         * BUTTONS
         */
        
        this.Modal.link['button'].appendChild(this.Items.getCancelButton(this.Stage.ProjectStageTable,'runTable',this.Stage.defaultTask+'0'));
        this.Modal.link['button'].appendChild(preview);
        this.Modal.link['button'].appendChild(confirm);
    }
      swapPreviewButton(ele)
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
            this.setEditButtonAction(ele);
        }
        else{
            ele.innerText='Podgląd';
            this.setPreviewButtonAction(ele);
        }
    }
      setEditButtonAction(ele){
        /* console.log('ProjectStageCreateText::setEditButtonAction()'); */
        var classObject=this; 
        ele.onclick = function (){
            console.log(classObject.helplink.dynamicDiv);
            console.log(classObject.helplink.previewDiv);
            classObject.swapPreviewButton(this);
            classObject.Html.showField(classObject.helplink.dynamicDiv);
            classObject.Html.removeChilds(classObject.helplink.previewDiv.all);
            classObject.Html.hideField(classObject.helplink.previewDiv.all);  
        };
    }
    setPreviewButtonAction(ele){
        /* CHANGE LABEL */
        /* console.log('ProjectStageCreateText::setPreviewButtonAction()'); */
        var classObject=this; 
        ele.onclick = function (){
            console.log(classObject.helplink);
            classObject.swapPreviewButton(this);
            classObject.Html.hideField(classObject.helplink.dynamicDiv);
            classObject.setPreviewData(classObject.helplink.previewDiv.all);
            classObject.Html.showField(classObject.helplink.previewDiv.all);
        };
    }
    setSendDataAction(ele){
        var classObject=this; 
        ele.onclick = function (){
            var fd = new FormData();
            fd.append('stage',classObject.setInputData());
            classObject.checkInputData(fd);
            classObject.sendInputData(fd);
        };
    }
      checkInputData(fd){
        
    }
      setInputData(){
        var data={
            db:'0',
            sec:{},
            title:this.helplink['title'].value,
            department:this.link['department']
        };
        for(const property in this.link.section){
            console.log('SECTION - '+property);
            console.log(this.link.section[property]);
            console.log(this.helplink.section[property]);
            data.sec[property]={
                //count:this.link.section[property].subsectionvisible,
                db:this.link.section[property].db,
                sub:{}        
                //subsectionvisible:this.link.section[property].subsectionvisible
            };
            
            /* LOOP OVER SUBSECTION */   
            for(var i=0;i<this.link.section[property].subsectionvisible;i++){
                console.log('SUBSECTION - '+i);
                console.log(this.link.section[property].subsection[i]);    
                data.sec[property].sub[i]={
                    db:'0',
                    row:{}
                };
                 /* LOOP OVER SUBSECTION ROW */
                for(const propSubsectionRow in this.link.section[property].subsection[i]){
                    console.log('SUBSECTION ROW - '+propSubsectionRow);
                    console.log(this.link.section[property].subsection[i][propSubsectionRow]);
                    data.sec[property].sub[i].row[propSubsectionRow]={
                        style:{},
                        property:{},
                        newline:'',
                        db:'0'
                    };
                    data.sec[property].sub[i].row[propSubsectionRow]['property']=this.setInputDataParseProperty(this.link.section[property].subsection[i][propSubsectionRow].property);              
                    data.sec[property].sub[i].row[propSubsectionRow]['style']=this.link.section[property].subsection[i][propSubsectionRow].style;
                    data.sec[property].sub[i].row[propSubsectionRow].newline=this.link.section[property].subsection[i][propSubsectionRow].valuenewline;
                    data.sec[property].sub[i].row[propSubsectionRow].db=this.link.section[property].subsection[i][propSubsectionRow].db;
                }
            }
        }
        console.log(data);
        return JSON.stringify(data);
    }
      setInputDataParseProperty(property){
        var newProp={};
        for(const p in property){
            if(p!=='valueEle'){
                newProp[p]=property[p]; 
            }
            if(p==='valueEle'){
                /* FIX AND SET VALUE => ELE VALUE */
               //data.section[property].subsection[i].subsectionrow[propSubsectionRow]['property']['value']=this.link.section[property].subsection[i][propSubsectionRow].property.valueEle.value; 
               newProp['value']=property[p].value;
            }
        }
        return newProp;
    }
      sendInputData(fd){
        console.log('ProjectStageCreateText::sendInputData()');
        console.log(fd);
        if(this.errorStatus){
            console.log(this.errorStatus);
            console.log('ERROR EXIST NO SEND DATA');
            return false;
        }
        //Xhr.loadNotify=Modal.link['extra'];
        console.log(this.Items.appurl);
        this.Modal.loadNotify='<img src="'+this.Items.appurl+'/img/loading_60_60.gif" alt="load_gif">';
        this.Modal.showLoad();
        this.Items.Xhr.setRun(this.Stage,'runModal');
        this.Items.Xhr.run('POST',fd,this.Items.router+'confirmProjectStageText');
    }
      manageSubsection(ele){
        
        console.log('ProjectStageCreateText::manageSubsection()');
        console.log(ele);
        /**/
        var sectionSetUp=parseInt(ele.value,10);
        //console.log(this.link.section[ele.id]);
        
        /* CHANGE TO REMOVE => PROBLEM IN SEND POST*/
        
        for(var i=0;i<this.getMaxSubSectionCount();i++){
            /* REMOVE NAME => JS FORM DATA APPEND INPUT ONLY WITH NAME */
            
            //console.log(this.helplink.section[ele.id]['subsection'][i]['all']);
            this.helplink.section[ele.id]['subsection'][i]['all'].classList.remove('d-line');
            this.helplink.section[ele.id]['subsection'][i]['all'].classList.add('d-none');
          
           
            //this.link.section[ele.id]['ele'].childNodes[i].classList.remove('d-line');
           // this.link.section[ele.id]['ele'].childNodes[i].classList.add('d-none');
        } 
        for(var i=0;i<sectionSetUp;i++){
             /* ADD NAME => JS FORM DATA APPEND INPUT ONLY WITH NAME */
            this.helplink.section[ele.id]['subsection'][i]['all'].classList.remove('d-none');
            this.helplink.section[ele.id]['subsection'][i]['all'].classList.add('d-line');
           // this.link.section[ele.id]['ele'].childNodes[i].classList.remove('d-none');
           // this.link.section[ele.id]['ele'].childNodes[i].classList.add('d-line');
        }   
        
        /* UPDATE SUBSECTION VISIBLE */
        
        this.link.section[ele.id].subsectionvisible=sectionSetUp;
        /*
        console.log(this.link.section[ele.id]);
        console.log('ALL');
        console.log(this.link.section);
        */
    }
      getMaxSubSectionCount(){
        //console.log('ProjectStageCreateText::getMaxSubSectionCount()');
        return parseInt(this.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_SUBSECTION_MAX','v'),10);
    }
}