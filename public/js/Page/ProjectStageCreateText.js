class ProjectStageCreateText{
    Modal=new Object();
    Items=new Object();
    Stage=new Object();
    Html=new Object();
    Xhr=new Object();
    XhrTable=new Object();
    /* FIELD COUNTER */
    i=0;
    /* FIELD COUNTER */
    iSectionField=1;
    sectionCount=1;
    link={};
    helplink={};
    resonse; 
    Glossary={};
    /* rename data to stageData */
    data={};
    stageData={};
    fieldDisabled=false;
    ErrorStack={};
    
    constructor(Stage){
        console.log('ProjectStageCreateText::constructor()');
        /*
         * Stage - object
         */
        this.Modal=Stage.Items.Modal;
        this.Items=Stage.Items;
        this.Stage=Stage;
        this.Html=Stage.Items.Html;
        this.Xhr=Stage.Items.Xhr2;
        this.XhrTable=Stage.Items.Xhr;
        this.Glossary=Stage.Items.Glossary['text'];
    }
    getData(u,m){
        console.log('ProjectStageCreateText::prepare()');
        var xhrParm={
            t:"GET",
            u:this.Items.router+u,
            c:true,
            d:null,
            o:this,
            m:m
        };
        this.XhrTable.run(xhrParm);
    }
    create(){
        console.log('ProjectStageCreateText::create()');
        /*
        console.log(this.Glossary.item);
        console.log(Object.keys(this.Glossary.item).length);
        console.log(this.Glossary.filled);
        */
        if(this.Glossary.filled){
            /* CREATE FAKE RESPONSE OBJECT */
            this.iSectionField=1;
            this.setUpNewStageObject(); 
            /* SETUP MODAL */
            this.setUpModal();
        }
        else{
            this.getData('getNewStageDefaults&type=tx','setUpCreateData');    
        }
    }
    setUpModal(){
        console.log('ProjectStageCreateText::setUpModal()');
        try{
             /* SET DEFAULT (EMPTY) LINK TO MODAL ELEMENT*/
            this.helplink=this.getEmptyHelpLink();
            /* CLEAR DATA MODAL */
            this.Modal.clearData();
            /* SET CLOSE BUTTON */
            this.Items.setCloseModal(this.Stage,'show',this.Stage.defaultTask+this.stageData.data.id);
            /* SET FORM */
            var form=this.Html.getForm();
            /* ASSIGN TITLE DEPARTMENT FIELD */
            this.createHead(form);
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
            console.log('ProjectStageCreateText::setUpModal()');
            console.log(err);
            this.Items.Table.setError('An Application Error Has Occurred!');
            return false;
        }
        /* IN ANOTHER BLOCK TRY CATCH TO PREVENT OPEN MODAL IF ERROR EXISTS TO HIDE ERROR SHOWED IN TABLE  */
        try{
            /* RUN MODAL */ 
            this.Items.prepareModal('Dodaj etap projektu - tekst','bg-info');
        }
        catch(err){
            console.log('ProjectStageCreateText::setUpModal()');
            console.log(err);
            this.Items.Table.setError('An Application Error Has Occurred!');
        }
    }
    details (response){   
        try{
            console.log('ProjectStageCreateText::details()\r\nRESPONSE:');
            var data =this.Items.parseResponse(response);     
            this.helplink={
                dynamic:{},
                dynamicSection:{}
            };
            console.log(data);
            //console.log(data.data.value);
            //console.log(this.data['data']['value']['const']);
            /* TO DO IN FUTURE -> ADD setCloseModal multi id's */
            this.Modal.clearData();
            //this.Items.setCloseModal(this.Const,'show',this.Const.defaultTask+this.data['data']['value']['const'].i);
            /* CLEAR ERROR STACK */
            this.ErrorStack={};
            /* SET CONSTS */
            //this.allConsts=this.data['data']['value']['all'];
            this.fieldDisabled=true;
            
            this.setUpStage(data.data.value);
            
            this.Items.setCloseModal(this.Stage,'show',this.Stage.defaultTask+this.stageData.data.id);
                   
            /* CREATE FORM */
            var form=this.Html.getForm();
            /* ASSIGN TITLE DEPARTMENT FIELD */
            this.createHead(form);
            
             /* ASSING PREVIEW FIELD */
             
            form.appendChild(this.createPreview());
            
             /* ASSING WORKING FIELD */
             
            form.appendChild(this.createDynamicView(this.helplink));
            
            
            /* APPEND FORM */
            this.Modal.link['adapted'].appendChild(form);
            
            /* form,constName,constValue,constId,rmButton */
            /* TO DO -> Multi -> loop over data.value.const */
            //this.setInputConst(this.Modal.link['adapted'],this.data['data']['value']['const'].n,this.data['data']['value']['const'].v,'0',null);
            //this.Modal.link['adapted'].appendChild(this.createLegendRow()); 
            /* CHECK IS BLOCKED  IF this.data['data']['value']['const'].bl NOT NULL => DISABLED */
            
            //this.setEditButtons(this.data['data']['value']['const'].i,this.data['data']['value']['const'].bl);
            /*
             * INFO
             */
            //this.Items.Modal.setInfo("Project Const ID: "+this.data['data']['value']['const'].i+", Create user: "+this.data['data']['value']['const'].cu+" ("+this.data['data']['value']['const'].cul+"), Create date: "+this.data['data']['value']['const'].cd+", Modification made at date: "+this.data['data']['value']['const'].md+" by user: "+this.data['data']['value']['const'].mu);
            
        }
        catch(error){
            console.log('ProjectStageCreateText::details()');
            console.log(error);
            throw 'An Application Error Has Occurred!';
            //this.Stage.Table.setError('An Application Error Has Occurred!');
            return false;
        }
        /* IN ANOTHER BLOCK TRY CATCH TO PREVENT OPEN MODAL IF ERROR EXISTS TO HIDE ERROR SHOWED IN TABLE  */
        try{
            this.Items.prepareModal('Podgląd Etapu projektu','bg-info');
            
        }
        catch(error){
            console.log('ProjectStageCreateText::details()');
            console.log(error);
            //this.Items.Table.setError('An Application Error Has Occurred!');
            throw 'An Application Error Has Occurred!';
        }
    }
    block(){
        try{
            console.log('ProjectStageCreateText::block()');
            /* SEND BLOCK */
            var xhrParm={
                t:"GET",
                u:this.Items.router+'blockConst&id='+this.data['data']['value']['const'].i,
                /* FOR POST SET TRUE */
                c:true,
                d:null,
                o:this,
                m:'edit'
            };
            this.Xhr.run(xhrParm);
        }
        catch(error){
            console.log('ProjectConstCreate::block()');
            console.log(error);
            this.Html.showField(this.Modal.link['error'],'An Application Error Has Occurred!');
        }
    }
    edit(response){
        console.log('ProjectStageCreateText::edit()');
        console.log(response);
    }
    getEmptyHelpLink(){
        //console.log('ProjectStageCreateText::getEmptyHelpLink()');
        var link={
            preview:{
                whole:{}
            },
            dynamic:{},
            titleDiv:{},
            section:{},
            title:{}
        };
        return link;
    }
    createPreview(){
        //console.log('ProjectStageCreateText::createPreview()');
        var mainDiv=this.Html.getRow();
            mainDiv.classList.add('d-none');
            this.helplink['preview'].whole=mainDiv;
            /* this.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_BACKGROUND_COLOR','v'); */
            //this.helplink.preview.pageBackgroundColor=this.stageData.style.backgroundcolor;
        return mainDiv;
    }
    createHead(ele){
        //console.log('ProjectStageCreateText::createHead()');
        //console.log(this.data.data.value);
        //console.log(reponse.data.value.stage.title);
        //console.log(reponse.data.value.stage.department);

        var titleDiv=this.Html.getRow();

            this.helplink['titleDiv']=titleDiv;
        
        var titleLabelDiv=this.Html.getCol(1);
        var titleInputDiv=this.Html.getCol(11);
        
            titleLabelDiv.appendChild(this.createLabel('h3','Tytuł'));
        var input=this.Html.getInput('title',this.stageData.data.title,'text');   
        //var input=this.Html.getInput('title',this.data.data.value.stage.title,'text');
            input.classList.add('form-control');
            input.setAttribute('placeholder','Enter title');
            input.setAttribute('aria-describedby',"titleHelp" );
            titleInputDiv.appendChild(input);
        
        this.helplink['title']=input;
        var helpValue=document.createTextNode('Staraj sie wprowadzić jednoznaczy tytuł.Należy wprowadzić minimalnie 1 znak, a maksymalnie 1024 znaki.');     
         
        var help=document.createElement('small');
            help.setAttribute('id','titleHelp');
            help.classList.add('form-text','text-muted');
            help.appendChild(helpValue);
            
            titleInputDiv.appendChild(help);
        
        titleDiv.appendChild(titleLabelDiv);
        titleDiv.appendChild(titleInputDiv);

        ele.appendChild(titleDiv);
        ele.appendChild(this.createHeadDepartment(this.stageData.data));
        //ele.appendChild(this.createHeadDepartment(this.data.data.value.stage.department));
    }
    createHeadDepartment(data){
        //console.log('ProjectStageCreateText::createHeadDepartment()');
        //console.log(data);
        var departmentData={
            0:{
                n:data.name,
                v:data.id_department
            }
        };
        var departmentDiv=this.Html.getRow();
        var departmentLabelDiv=this.Html.getCol(1);
        var departmentInputDiv=this.Html.getCol(11);
            departmentLabelDiv.appendChild(this.createLabel('h3','Dział:'));
        var department=this.createSelect('department','department');
            department.setAttribute('aria-describedby',"departmentHelp" );
            
            /* TO DO => DEFAULT OD EDIT*/
            if(departmentData[0].n!==''){
                department.appendChild(this.createSelectOption('Aktualny:',departmentData));  
            }
            
            //console.log(this.Glossary);
            department.appendChild(this.createSelectOption('Dostępne:',this.Glossary.item.department)); 
            this.helplink['department']=department;
        /* TO DO -> DEFAULT / EDIT */  
       
        //this.link['department']=this.Glossary.item.department[0].v;
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
        //console.log('ProjectStageCreateText::createDynamicView()');
        var mainDiv=this.Html.getRow();
            mainDiv.classList.add('d-block');  
        var mainDivSection=this.Html.getCol(12);
        var iSection = 0;    
            /* CREATE TEXT STAGE SECTION */
            for(const prop in this.stageData.section){
                /*
                console.log('STAGE SECTION:');
                console.log(prop);
                console.log('STAGE SECTION PROPERTY:');
                console.log(this.stageData.section[prop]);
                */
                /* CREATE SECTION */
                mainDivSection.appendChild(this.createSection(prop,this.stageData.section,helplink));
                iSection++;
            };
            /* APPEND SECTION */
            mainDiv.appendChild(mainDivSection);
             /* CREATE ADD BUTTON */
            mainDiv.appendChild(this.createButtonCol(this.createAddSectionButton(iSection)));
            //mainDiv.appendChild(this.createButtonCol(this.createAddSectionButton('section-0')));
            /* CREATE TEXT SECTION PAGE TOOL*/
            mainDiv.appendChild(this.createTextPageTool(this.stageData));
            
            this.helplink['dynamic']=mainDiv;
            this.helplink['dynamicSection']=mainDivSection;
            console.log(mainDivSection);
        return mainDiv;
    }
    setPreviewData(){
        //console.log('ProjectStageCreateText::setPreviewData()');
        this.setPreviewPage();
        this.setPreviewPageValue();
    }
    setPreviewPage(){
        //console.log('ProjectStageCreateText::setPreviewPage()');   
        this.helplink.preview.whole.style.backgroundColor='rgb(251,251,251)';
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
            blankPage.style.backgroundColor=this.stageData.style.backgroundColor;
        var writePage=document.createElement('div');
            writePage.style.width='699px';
            writePage.style.height='1028px';
            /* IT IS DEPED OF FONT SIZE */
            writePage.style.paddingTop='92px';
            /* DEFAULT LEFT MARGIN 2,5 cm */ 
            writePage.style.paddingLeft='92px'; /* ALL 314, MAIN 10 */
            /* TO DO */
            //writePage.style.textAlign=this.helplink.preview.pageTextAlign
        blankPage.appendChild(writePage);
        wholePage.appendChild(blankPage);
        this.helplink.preview.whole.appendChild(wholePage);     
        this.helplink.preview['write'] =  writePage;
    }
    setPreviewPageValue(){
        /*
        console.log('ProjectStageCreateText::setPreviewPageValue()');
        console.log('stageData');
        console.log(this.stageData);
        console.log('helplink');
        console.log(this.helplink);
        */
        var writePageSectionWidth=607;
        
        /* LOOP OVER  SECTION */   
        for(const property in this.stageData.section){
            /* SECTION */
            console.log('SECTION');
            console.log(property);
            console.log('SECTION '+property+' DATA');
            console.log(this.stageData.section[property]);
            /* CHECK AND SETUP COLUMNS NUMBER */
            writePageSectionWidth=Math.floor(607/this.stageData.section[property].subsectionvisible); /* minus padding left 92px */
           
            console.log('SECTION '+property+' DATA subsectionvisible');
            console.log(this.stageData.section[property].subsectionvisible);
            //console.log('SECTION '+property+' ALL DATA subsection');
            //console.log(this.stageData.section[property].subsection);
            
             /* LOOP OVER SUBSECTION - VISIBLE */   
            for(var i=0;i<this.stageData.section[property].subsectionvisible;i++){
                /* SUBSECTION */   
                console.log('SECTION '+property+' DATA subsection '+i);
                console.log(this.stageData.section[property].subsection[i]);
                var writePageSection=document.createElement('div');
                    writePageSection.style.width=writePageSectionWidth+'px';
                    writePageSection.style.border='0px';
                    writePageSection.style.margin='0px';
                    writePageSection.style.cssFloat='LEFT';
                    /* IN FUTURE SETUP SUBSECTION DATA */
                    /* IN FUTURE SETUP SUBSECTION PROPERTY */
                    /* IN FUTURE SETUP SUBSECTION STYLE */
                    /* LOOP OVER SUBSECTION ROW */
                    for(const propSubsection in this.stageData.section[property].subsection[i].subsectionrow){
                        console.log(propSubsection);
                        console.log(this.stageData.section[property].subsection[i].subsectionrow[propSubsection]);
                        /* SUBSECTION ROW DATA */
                        console.log('SUBSECTION ROW DATA');
                        console.log(this.stageData.section[property].subsection[i].subsectionrow[propSubsection].data);
                        /* CHECK FOR BREAKLINE */
                        this.setPreviewPageBreakLine(writePageSection,this.stageData.section[property].subsection[i].subsectionrow[propSubsection].data.valuenewline);
                        /* SUBSECTION ROW PROPERTY */
                        console.log('SUBSECTION ROW PROPERTY');
                        console.log(this.stageData.section[property].subsection[i].subsectionrow[propSubsection].property);
                        /* SUBSECTION ROW STYLE */
                        console.log('SUBSECTION ROW STYLE');
                        console.log(this.stageData.section[property].subsection[i].subsectionrow[propSubsection].style);
                        /* SETUP SUBSECTION ROW */
                        writePageSection.appendChild(this.setPreviewValue(this.stageData.section[property].subsection[i].subsectionrow[propSubsection]));
                    /* END LOOP OVER SUBSECTION ROW */
                    }
                    this.helplink.preview['write'].appendChild(writePageSection);
            /* END LOOP OVER SUBSECTION - VISIBLE */   
            }
        /* END LOOP OVER SECTION */     
        };
    }
    setPreviewPageBreakLine(writePageSection,valueNewLine){
        //console.log('ProjectStageCreateText::setPreviewPageBreakLine()');
        var br=document.createElement('br');
            if(valueNewLine==='y'){
               //console.log('VALUE NEW LINE === y ADD BREAK LINE');
                writePageSection.appendChild(br);
            }
    }
    setPreviewValue(subsectionRow){
        console.log('ProjectStageCreateText::setPreviewValue()');
        console.log(subsectionRow);
        var html=document.createElement('span');
            html.style.fontSize=subsectionRow.style.fontSize+subsectionRow.style.fontSizeMeasurement;
            html.style.fontFamily=subsectionRow.style.fontFamily;
            html.style.color=subsectionRow.style.color;
            html.style.backgroundColor=subsectionRow.style.backgroundColor;
            html.style.fontWeight='normal';

            /* TEXT ALIGN */
            console.log(subsectionRow.style.textAlign);
            if(subsectionRow.style.textAlign==='LEFT' || subsectionRow.style.textAlign==='RIGHT'){
                html.style.cssFloat=subsectionRow.style.textAlign;
            }
            else if(subsectionRow.style.textAlign==='CENTER' || subsectionRow.style.textAlign==='JUSTIFY'){
                html.style.textAlign=subsectionRow.style.textalign;
                html.style.display='BLOCK';
            }
            else{
                console.log('UNAVAILABLE');
                console.log( subsectionRow.style.textAlign);                
            }
        var text=document.createTextNode(subsectionRow.data.value);
        if(subsectionRow.style.fontWeight==='1'){
            html.style.fontWeight='bold';
        }
        if(subsectionRow.style.underline==='1' && subsectionRow.style['line-through']==='1'){
            html.style.textDecoration='underline line-through';
        }
        else if(subsectionRow.style.underline==='1' && subsectionRow.style['line-through']==='0'){
            html.style.textDecoration='underline';
        }
        else if(subsectionRow.style.underline==='0' && subsectionRow.style['line-through']==='1'){
            html.style.textDecoration='line-through';
        }
        else {};
        if(subsectionRow.style.fontStyle==='1'){
            html.style.fontStyle='italic';
        }
        html.appendChild(text);
        return html;
    }
    //createSection(isection,idDb){
    createSection(iSection,section,helplink){
        console.log('ProjectStageCreateText::createSection()');
        console.log('helplink:');
        console.log(helplink);
        console.log('iSection (iSectionField):');
        console.log(iSection);
        console.log('stageData:');
        console.log(section);
        //console.log('LINK:');
        //console.log(this.link);
        
        var mainDiv=this.Html.getRow(); 
        var mainDivHeader=this.creteSectionHead(iSection); 
        var mainDivBody=this.Html.getCol(12); 
        
            //this.link.section['section-'+iSection]={
              //  subsectionvisible:0,
                //ele:mainDivBody,
               // subsection:{},
                //db:section[iSection].data.id
            //};
            helplink.section[iSection]={
                main:{},
                subsection:{}
            };
            
            
            for(const iSub in section[iSection].subsection){
                /*
                console.log('ProjectStageCreateText::createSection => subsection\r\ni:');
                console.log(iSub);
                console.log(section[iSection].subsection[iSub]);
                */
                /* SET SUBSECTION HELPLINK */
                helplink.section[iSection]['subsection'][iSub]={
                    /* FOR SHOW/HIDE */
                    all:{},
                    /* FOR ADD */
                    dynamic:{},
                    /* FOR REMOVE */
                    row:{}
                };
                /* SET SUBSECTION LINK */
                
                //this.link.section['section-'+iSection].subsection[iSub]={};
                /* CREATE SUBSECTION */
                mainDivBody.appendChild(this.createSubsection(iSection,iSub,section[iSection].subsection[iSub],helplink.section[iSection]['subsection'][iSub]));
                //console.log(mainDivBody);
            }
             
            mainDivHeader.appendChild(this.createSectionTool(iSection,section,helplink)); 
            
            mainDiv.appendChild(mainDivHeader);  
            mainDiv.appendChild(mainDivBody);   
            this.helplink.section[iSection].main=mainDiv;
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
    createSubsection(iSection,iSub,subsection,helplink){
        /*
        console.log('ProjectStageCreateText::createSubsection()');
        console.log(subsection);
        console.log('helplink');
        console.log(helplink);
        */
        var mainDiv=this.Html.getRow();
        var mainDivSubsection=this.Html.getCol(12);
        var mainDivBtn=this.Html.getCol(12);
        var iRow = 0;        
        var runFunction='createSubsectionRowGroup';
        var runExtendedFunction='createExtendedSubsectionRow';
        for(const iR in subsection.subsectionrow){   
            console.log(subsection.subsectionrow[iR].data.valuenewline);
            
            helplink.row[iR]={
                all:{},
                value:{},
                error:{}
            };
            
            /* DYNAMIC RUN FUNCTION CREATE SUBSECTION ROW */
            mainDivSubsection.appendChild(this[runFunction](iSection,iSub,iR,subsection.subsectionrow,helplink.row));
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
        
        helplink.dynamic=mainDivSubsection;
        
        mainDivBtn.appendChild(this.createButtonRow(this.addSubsectionRow(iSection,iSub,iRow,subsection.subsectionrow,helplink)));
                        
        mainDiv.appendChild(mainDivSubsection);
                    
        mainDiv.appendChild(mainDivBtn);

        /* SET SUBSECTION HELPLINK ELEMENT */
        
        helplink.all=mainDiv;
        return mainDiv;
    }
    createSubsectionRowGroup(isection,isub,iSubRow,subsectionrow,helplink){
        console.log('ProjectStageCreateText::createSubsectionRowGroup()');
        var mainDiv=this.Html.getRow();
        /* SET SUBSECTION ROW */
        mainDiv.appendChild(this.createSubsectionRow(isection,isub,iSubRow,subsectionrow,helplink));
        /* CREATE ERROR DIV */
        mainDiv.appendChild(this.createTextError(helplink[iSubRow]));  
        /* CREATE TEXT TOOL */
        mainDiv.appendChild(this.createTextTool(isection,isub,iSubRow,subsectionrow[iSubRow],helplink[iSubRow]));  
        /* SETUP HELPLINK */
        helplink[iSubRow]['all']=mainDiv;
        return mainDiv;
    }
    createExtendedSubsectionRow(isection,isub,isubrow,subsectionrow,helplink){
        console.log('ProjectStageCreateText::createExtendedSubsectionRow()');
        var mainDiv=this.createSubsectionRowGroup(isection,isub,isubrow,subsectionrow,helplink);
            mainDiv.appendChild(this.createExtendedTextTool(isection,isub,isubrow,subsectionrow[isubrow],helplink[isubrow]));  
        return mainDiv;
    }
    createSubsectionRow(isection,isub,isubrow,subsectionrow,helplink){
        /*
        console.log('ProjectStageCreateText::createSubsectionRow()\r\SUBSECTIONROW:');
        console.log(subsectionrow[isubrow]);
          console.log('ProjectStageCreateText::createSubsectionRow()\r\nSECTION:');
          console.log(isection);
          console.log('SUBSECTION:');
          console.log(isub);
          console.log('ROW:');
          console.log(isubrow);
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
        /* LABEL */
        var label=document.createElement('LABEL');
            label.setAttribute('class','col-form-label');
            label.setAttribute('for','value-'+isection+'-'+isub+'-'+isubrow);
            label.innerHTML='<b>Wartość:</b><br/><small class=" text-muted ">['+'value-'+isection+'-'+isub+'-'+isubrow+']</small>';
        var input=document.createElement('textarea');
            input.setAttribute('class','form-control border-1 border-info');
            input.setAttribute('placeholder','Write...');
            input.setAttribute('name','value-'+isection+'-'+isub+'-'+isubrow);
            //input.setAttribute('id','value-'+isection+'-'+isub+'-'+isubrow);
            input.setAttribute('rows','3');
            //input.setAttribute('value','');
            input.oninput = function(){
                subsectionrow[isubrow].data.value=this.value;
            };

            /* SET INPUT TEXT STYLE FROM PARAMETER */
            
            input.style.fontSize=subsectionrow[isubrow].style.fontSize+subsectionrow[isubrow].style.fontSizeMeasurement;  
            input.style.color=subsectionrow[isubrow].style.color;
            input.style.backgroundColor=subsectionrow[isubrow].style.backgroundColor;
            input.style.fontFamily=subsectionrow[isubrow].style.fontFamily;
            input.style.fontWeight=this.setFontStyle(subsectionrow[isubrow].style.fontWeight,'BOLD','NORMAL');
            input.style.fontStyle=this.setFontStyle(subsectionrow[isubrow].style.fontStyle,'ITALIC','');
            input.style.textDecoration=this.setFontStyle(subsectionrow[isubrow].style.underline,'UNDERLINE','')+" "+this.setFontStyle(subsectionrow[isubrow].style['line-through'],'line-through','');
            input.style.textAlign=subsectionrow[isubrow].style.textAlign;
            
            /* SETUP HELPLINK TO FIELD INPUT */

            helplink[isubrow].value=input;
            
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
        /*
        console.log('ProjectStageCreateText::createSectionTool()');
        console.log('section');
        console.log(section);
        console.log('sub section min');
        console.log(this.stageData.subsectionmin);
        console.log('sub section max');
        console.log(this.stageData.subsectionmax);
        */
        //var mainDiv=this.Html.getCol(12);
        var mainDivSection=this.Html.getRow();
        var tool1=this.Html.getCol(3);
        var tool2=this.Html.getCol(3);    
        var tool3=this.Html.getCol(3);
        var tool4=this.Html.getCol(3);  
        var sectioncount=this.createTextToolSelect('section','Wskaż ilość podsekcji <small class="text-muted">[KOLUMN]</small>:',this.getSelectKey(section[iSection].subsectionvisible-1,section[iSection].subsectionvisible),this.getSectionCount(this.stageData.subsectionmin));
        //console.log(sectioncount);
       
        //var sectioncount=this.createTextToolSelect('section'+isection,'Wskaż ilość podsekcji <small class="text-muted">[KOLUMN]</small>:',this.getSelectKey(this.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_SUBSECTION_DEFAULT','v'),this.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_SUBSECTION_DEFAULT','v')),this.getSectionCount(this.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_SUBSECTION_DEFAULT','v')));
        var ProjectStageCreateText=this;    
            sectioncount.childNodes[1].onchange = function () { 
                var max=parseInt(this.value,10)+1;
                ProjectStageCreateText.manageSubsectionVisible(max,section[iSection],helplink.section[iSection]['subsection']);
            };
            /* FIRST RUN TO SETUP SECTION DEFAULT COUNT */
            this.manageSubsectionVisible(section[iSection].subsectionvisible,section[iSection],helplink.section[iSection]['subsection']);
            
            tool1.appendChild(sectioncount);
            tool4.appendChild(this.createRemoveSectionButton(iSection,section,helplink.section));
           
            //console.log( tool4);
        mainDivSection.appendChild(tool1);
        mainDivSection.appendChild(tool2);
        mainDivSection.appendChild(tool3);
        mainDivSection.appendChild(tool4);
        return mainDivSection;
    }
    createTextError(helplink){
        //console.log('ProjectStageCreateText::createTextError()');
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
    createTextTool(isection,isub,isubrow,subsectionrow,helplink){
        /*
        console.log('ProjectStageCreateText::createTextTool()');
        console.log(subsectionrow);
        console.log(subsectionrow.style);
        console.log('helplink');
        console.log(helplink);
        */
        var mainDivCol=this.Html.getCol(12);
        var mainDiv=this.Html.getRow();
        var tool1=this.Html.getCol(3);
        var tool2=this.Html.getCol(3);
        var tool3=this.Html.getCol(3);
        var tool4=this.Html.getCol(3);
            tool4.classList.add('pt-4');
        
        //var fontSize=this.valueFontSizeModification('Rozmiar tekstu:',this.getDefaultFontSize(subsectionrow.style.fontSize,subsectionrow.style.fontSize),this.getFontSizeList(subsectionrow.style.fontSize),subsectionrow.style,helplink.value);
        var fontSize=this.valueFontSizeModification('Rozmiar tekstu:',subsectionrow.style,helplink.value);
        
        var color=this.valueStyleModification('color','Kolor tekstu:',this.getDefaultColor(subsectionrow.style.color,subsectionrow.style.colorName),this.getColorList(subsectionrow.style.color),subsectionrow.style,helplink.value);
        var fontFamily=this.valueStyleModification('fontFamily','Czcionka:',this.getDefaultFont(subsectionrow.style.fontFamily,subsectionrow.style.fontFamily),this.getFontList(subsectionrow.style.fontFamily),subsectionrow.style,helplink.value);
        var textAlign=this.valueStyleModification('textAlign','Wskaż kierunek tekstu:',this.getSelectKey(subsectionrow.style.textAlign,subsectionrow.style.textAlignName),this.getFontAlignList(subsectionrow.style.textAlign),subsectionrow.style,helplink.value);
        var backgroundColor=this.valueStyleModification('backgroundColor','Kolor tła:',this.getDefaultBackgroundColor(subsectionrow.style.backgroundColor,subsectionrow.style.backgroundColorName),this.getBackgroundColorList(subsectionrow.style.backgroundColor),subsectionrow.style,helplink.value);
        
        tool1.appendChild(fontSize);
        tool1.appendChild(color);
        tool2.appendChild(fontFamily);
        tool2.appendChild(textAlign);
        tool3.appendChild(backgroundColor);
        
        /* SET CSS BOLD, ITALIC ... */
        
        this.createTextDecorationTool(tool4,isection,isub,isubrow,subsectionrow['style'],helplink.value); 
        
        //console.log(this.link);
        mainDiv.appendChild(tool1);
        mainDiv.appendChild(tool2);
        mainDiv.appendChild(tool3);
        mainDiv.appendChild(tool4);
        mainDivCol.appendChild(mainDiv);
        return mainDivCol;
        //return mainDiv;
    }
      createTextDecorationTool(tool4,isection,isub,isubrow,subsectionRowStyle,helplinkValue){
        console.log('ProjectStageCreateText::createTextDecorationTool()');
        for(const prop of this.Glossary.getKey('decoration').entries()) {
            this.setTextDecorationToolEntry(prop[1],tool4,isection,isub,isubrow,subsectionRowStyle,helplinkValue);  
        } 
    }
    setTextDecorationToolEntry(decorationProp,tool4,isection,isub,isubrow,subsectionRowStyle,helplinkValue){
        /*
            decorationProp.n. - name
            decorationProp.v - value
         */
        var prop = this.setTextDecorationToolEntryProperties(decorationProp,subsectionRowStyle);
        
        var input = this.createTextToolCheckBox(prop.inputName,isection,isub,isubrow,prop.label,prop.check,subsectionRowStyle,helplinkValue);
        
        tool4.appendChild(input);
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
    setTextDecorationToolEntryProperties(decorationProp,subsectionRowStyle){
        /*
          console.log('ProjectStageCreateText::setTextDecorationToolEntryProperties()');
          console.log('decorationProp');
          console.log(decorationProp);
          console.log('subsectionRowStyle');
          console.log(subsectionRowStyle);
        */ 
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
                fullProp.check=subsectionRowStyle.fontWeight;
                fullProp.inputName='fontWeight';
                fullProp.label='<b>'+decorationProp.n+'</b>';
                break;
            case 'UNDERLINE':
                fullProp.check=subsectionRowStyle.underline;
                fullProp.inputName='underline';
                fullProp.label='<u>'+decorationProp.n+'</u>';
                break;
            case 'ITALIC':
                fullProp.check=subsectionRowStyle.fontStyle;
                fullProp.inputName='fontStyle';
                fullProp.label='<i>'+decorationProp.n+'</i>';
                break;
            case 'line-through':
                fullProp.check=subsectionRowStyle['line-through'];
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
        console.log('ProjectStageCreateText::createExtendedTextTool()');
        console.log('subsectionrow:');
        console.log(subsectionrow);
        console.log('helplink:');
        console.log(helplink);
        console.log('SUBSECTIONROW DATA VALUENEWLINE:');
        console.log(subsectionrow.data.valuenewline);
        */
        var mainDivCol=this.Html.getCol(12);
        var mainDiv=this.Html.getRow();
        var tool1=this.Html.getCol(5);
        var tool2=this.Html.getCol(5);
        var tool3=this.Html.getCol(2);
        var radio = this.createTextToolRadioButton('valuenewline-'+isection+'-'+isub+'-'+isubrow,'Tekst od nowej lini?',this.getYesNowRadio());//'valuenewline-'+isection+'-'+isub+'-'+isubrow
       
        //this.changeRadioButtonValue(radio.childNodes[1],subsectionrow,this.link.section['section-'+isection]['subsection'][isub][isubrow]);
        this.changeRadioButtonValue(radio.childNodes[1],subsectionrow);
        tool1.appendChild(radio);
        
        //console.log(tool1.childNodes[0].childNodes[1]); 
        mainDiv.appendChild(tool1);
        mainDiv.appendChild(tool2);
        mainDiv.appendChild(tool3);
        mainDivCol.appendChild(mainDiv);
         
        return mainDivCol;
    }
    changeRadioButtonValue(radio,stageDataLink){//link
        /*
        console.log('ProjectStageCreateText::changeRadioButtonValue()');
        console.log(radio);
        console.log('SUBSECTIONROW');
        console.log(stageDataLink);
        */
        /* FIRST RUN TO SET PROPER VALUE AND onClick FUNCTION */
        radio.childNodes.forEach(
            function(currentValue) {//, currentIndex, listObj
                if(currentValue.childNodes[0].value === stageDataLink.data.valuenewline){
                    /* REMOVE ATTRIBUTE no-checked */
                    currentValue.childNodes[0].removeAttribute('no-checked');
                    /* ADD ATTRIBUTE checked */
                    currentValue.childNodes[0].setAttribute('checked','');
                }
                /* CLOSURE */
                currentValue.childNodes[0].onclick = function (){
                    stageDataLink.data.valuenewline = this.value;  
                    //link['valuenewline']=this.value;
                   // console.log(stageDataLink);
                };
            }
            //,this
        );
       // link['valuenewline']=stageDataLink.data.valuenewline;
    }

    createTextToolCheckBox(id,isection,isub,isubrow,title,defaultvalue,subsectionRowStyle,helplinkValue){
        
        //if(defaultvalue)
          
        var classObject=this;
        
        var div=document.createElement('div');
            div.setAttribute('class','form-check mt-1');
        var input=document.createElement('input');
            input.setAttribute('name',id+'-'+isection+'-'+isub+'-'+isubrow);
            input.setAttribute('id',id+'-'+isection+'-'+isub+'-'+isubrow);
            input.setAttribute('type','checkbox');
            input.classList.add('form-check-input');
            input.onclick = function (){
                console.log('ProjectStageCreateText::createTextToolCheckBox()');
                console.log('ID - '+id);
                console.log(this);
                if(this.value==='0'){
                    this.value='1';
                }
                else{
                    this.value='0';
                }
                subsectionRowStyle[id]=this.value;
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
        console.log('ProjectStageCreateText::createTextToolDoubleSelect()');
        var divMain = document.createElement('div');
            divMain.classList.add('w-100','mt-2');
        var div=document.createElement('div');
            div.setAttribute('class','input-group');//w-100 input-group
        var label=document.createElement('span');
            label.setAttribute('class','text-info');
            label.innerHTML=title;
        var select=this.createSelect(id,id,'w-75');
            select.appendChild(this.createTextToolSelectOption('Domyślny:',actdata));  
            select.appendChild(this.createTextToolSelectOption('Dostępne:',alldata)); 
        var select2=this.createSelect(id2,id2,'w-25');
            select2.appendChild(this.createTextToolSelectOption('Domyślny:',actdata2));  
            select2.appendChild(this.createTextToolSelectOption('Dostępne:',alldata2)); 
            
            div.appendChild(select);
            div.appendChild(select2);
            divMain.appendChild(label);
            divMain.appendChild(div);
            console.log(div);
            //throw  'test-stop';
        return divMain;
    }
      createTextToolSelect(id,title,actdata,alldata){
        //console.log('ProjectStageCreateText::createTextToolSelect()');
        var div=document.createElement('div');
            div.setAttribute('class','w-100 mt-2');
        var label=document.createElement('span');
            label.setAttribute('class','text-info');
            label.innerHTML=title;
        var select=this.createSelect(id,id,'w-100');
            select.appendChild(this.createTextToolSelectOption('Domyślny:',actdata));  
            select.appendChild(this.createTextToolSelectOption('Dostępne:',alldata)); 
            div.appendChild(label);
            div.appendChild(select);
        return div;
    }
      createSelect(id,name,width){
        var select=document.createElement('select');
            select.setAttribute('class','form-control '+width);
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
    valueStyleModification(id,title,actdata,alldata,subsectionRowStyle,helplinkValue){
        //console.log('ProjectStageCreateText::createTextToolSelectExtend()');
        var select = this.createTextToolSelect(id,title,actdata,alldata);
        /* CLOSURE - DOMKNIĘCIE*/
        select.childNodes[1].onchange = function(){
             /* SET NEW VALUE */
            subsectionRowStyle[id]=this.value;
             /* SET NEW VALUE ELEMENT STYLE */
            helplinkValue.style[id]=this.value;
        };
        return select;
    }
    valueFontSizeModification(title,subsectionRowStyle,helplinkValue){
        console.log('ProjectStageCreateText::valueFontSizeModification()');
        console.log(subsectionRowStyle);
        console.log(this.Glossary);
        var idFont = 'fontSize';
        var idMeasurement = 'fontSizeMeasurement';
        
        var actFont = this.getDefaultFontSize(subsectionRowStyle.fontSize,subsectionRowStyle.fontSize);
        var allFont = this.getFontSizeList(subsectionRowStyle.fontSize);
        
        var actMeasurement = this.getDefaultFontSize(subsectionRowStyle.fontSizeMeasurement,subsectionRowStyle.fontSizeMeasurement);
        var allMeasurement = this.getFontSizeMeasurementList(subsectionRowStyle.fontSizeMeasurement);
        
        var doubleSelect = this.createTextToolDoubleSelect(idFont,title,actFont,allFont,idMeasurement,actMeasurement,allMeasurement);
        //var classObject=this; 
        console.log(doubleSelect);
        doubleSelect.childNodes[1].childNodes[0].onchange = function(){
            console.log(this);
            console.log('select 1');
             console.log(this.value);
            /* SET NEW VALUE */
            subsectionRowStyle[idFont]=this.value;
            /* SET NEW VALUE ELEMENT STYLE */
            helplinkValue.style[idFont]=this.value+subsectionRowStyle[idMeasurement];
        };
        doubleSelect.childNodes[1].childNodes[1].onchange = function(){
            console.log(this);
            console.log('select 2');
            console.log(this.value);
            /* SET NEW VALUE */
            subsectionRowStyle[idMeasurement]=this.value;
            /* SET NEW VALUE ELEMENT STYLE */
            helplinkValue.style[idFont]=subsectionRowStyle[idFont]+this.value;
        };
        return doubleSelect;
    }
    setValueCheckBoxStyle(id,value,helplinkValue){
        /*
        console.log('ProjectStageCreateText::setValueCheckBoxStyle()');
        console.log('ID:');
        console.log(id);
        console.log('VALUE:');
        console.log(value);
        console.log('HELPLINK VALUE:');
        console.log(helplinkValue);
        */
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
    createTextToolSelectOption(title,data){
        var optionGroup2=document.createElement('optgroup');
            optionGroup2.setAttribute('label',title);
            optionGroup2.setAttribute('class','bg-info text-white');
            for (const property in data) {
                //console.log(`${property}: ${data[property]}`);
                //console.log(data[property]);
                var option=document.createElement('option');
                    option.setAttribute('value',data[property].v);
                    //option.setAttribute('class',data[property].fontcolor+' '+data[property].backgroundcolor);
                    option.style.fontFamily = data[property].fontFamily;
                    option.style.color = data[property].color;
                    option.style.backgroundColor = data[property].backgroundcolor;
                    option.innerText=data[property].n;
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
    getYesNowRadio(){
    //getYesNowRadio(id){
        const value={
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
                v:value,
                n:title,
                color:'#000000',
                backgroundcolor:'#FFFFFF',
                fontFamily:''
            };
        return selectKeyProp;
    }
      getExtendedSelectKeyProperties(value,title,color,backgroundcolor,fontFamily){
        var selectKeyProp=this.getSelectKeyProperties(value,title);
            selectKeyProp.color=color;
            selectKeyProp.backgroundcolor=backgroundcolor;
            selectKeyProp.fontFamily=fontFamily;
        return selectKeyProp;
    }
      getDefaultFont(value,title){
        //console.log('ProjectStageCreateText::getDefaultFont()');
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
        for(var i=0;i<this.stageData.subsectionmax;i++){
            if(exception!==j){
                value[i]=this.getSelectKeyProperties(i,j);
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
    getFontSizeMeasurementList(exception){
        var value={};        
        for(var i=0;i<this.Glossary.getKeyCount('measurement');i++){
            if(this.Glossary.getKeyPropertyAttribute('measurement',i,'v')!==exception){
                value[i]=this.getSelectKeyProperties(this.Glossary.getKeyPropertyAttribute('measurement',i,'v'),this.Glossary.getKeyPropertyAttribute('measurement',i,'n'));
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
        for(var i=0;i<this.Glossary.getKeyCount('textAlign');i++){
            if(this.Glossary.getKeyPropertyAttribute('textAlign',i,'v')!==exception){
                value[i]=this.getSelectKeyProperties(this.Glossary.getKeyPropertyAttribute('textAlign',i,'v'),this.Glossary.getKeyPropertyAttribute('textAlign',i,'n'));
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
        for(var i=0;i<this.Glossary.getKeyCount('fontFamily');i++){
            if(this.Glossary.getKeyPropertyAttribute('fontFamily',i,'v')!==exception){
                value[i]=this.getExtendedSelectKeyProperties(this.Glossary.getKeyPropertyAttribute('fontFamily',i,'v'),this.Glossary.getKeyPropertyAttribute('fontFamily',i,'v'),'#000000','#FFFFFF',this.Glossary.getKeyPropertyAttribute('fontFamily',i,'v'));
            }
        }
        return value;
    }
    createTextPageTool(stageDataLink){
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
 
            /* CLOSURE */
            pageBackgroundcolor.onchange = function (){   
                stageDataLink.style.backgroundColor = this.childNodes[1].value;          
            };
        toolMain1.appendChild(pageBackgroundcolor);
        var newPage = this.createTextToolRadioButton('newpage','Etap od nowej strony?',this.getYesNowRadio());
        /* SET BUTTON RADIO TO PROPER VALUE */
        this.changeRadioButtonValue(newPage.childNodes[1],stageDataLink);//helplink
        
        toolMain1.appendChild(newPage);    
        
        toolMain2.appendChild(this.valueStyleModification('backgroundimage','Wskaż obraz tła strony:'));

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
        console.log('ProjectStageCreateText::getRemoveButton()');
        console.log('helplink');
        console.log(helplink);
        console.log('subsectionrow');
        console.log(subsectionrow);
        */
        var i=document.createElement('i');
            i.setAttribute('class','fa fa-minus');
            i.setAttribute('aria-hidden','true');
            i.setAttribute('style','color:#ffffff;');         
        var div=document.createElement('div');
            div.setAttribute('class','btn btn-danger ');//float-right
        //var ProjectStageCreateText=this;    
            /* CLOSURE */
            div.onclick=function(){
                /*
                console.log('ProjectStageCreateText::getRemoveButton() onclick()');
                console.log('helplink');
                console.log(helplink);
                console.log('subsectionrow');
                console.log(subsectionrow);
                */
                /* TO DO */
                //console.log(ProjectStageCreateText.stageData);
                //console.log(ProjectStageCreateText.stageData.section[isection].subsection[isub].subsectionrow[isubrow]);
                if (confirm('Potwierdź usunięcie podsekcji') === true) {
                    helplink[isubrow].all.remove();
                    /* NEED FOR STRICT MODE - NOT ALLOWED delete helplink */
                    delete helplink[isubrow];
                    delete subsectionrow[isubrow];
                } else {
                    // NOTHING TO DO
                }
            };
        div.appendChild(i);
        return(div); 
    }
    createRemoveSectionButton(iSection,section,helplink){
        /*
        console.log('ProjectStageCreateText::createRemoveSectionButton()');
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
                if (confirm('Potwierdź usunięcie sekcji') === true) {
                    //console.log(helplink);
                    helplink[iSection].main.remove();
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
        //console.log('ProjectStageCreateText::createButtonCol()');
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
        console.log('ProjectStageCreateText::addSubsectionRow()');
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
        var ProjectStageCreateText=this;
            div.onclick=function(){       
                console.log('ProjectStageCreateText::addSubsectionRow() click');
                console.log('iRow');
                console.log(iRow);
                /* ADD NEW stageData subsectionrow object */
                subsectionrow[iRow]=ProjectStageCreateText.setUpNewStageSubsectionRow();
                console.log('subsectionrow');
                console.log(subsectionrow);
                console.log('helplink');
                console.log(ProjectStageCreateText.helplink);
                
                helplink.row[iRow]={
                    all:{},
                    value:{},
                    error:{}
                };
                
                //ProjectStageCreateText.helplink.section['section-'+isection]['subsection'][isubsection].dynamic.appendChild(ProjectStageCreateText.createExtendedSubsectionRow(isection,isubsection,iRow,subsectionrow[iRow]));
                //helplink.dynamic.appendChild(ProjectStageCreateText.createExtendedSubsectionRow(isection,isubsection,iRow,subsectionrow[iRow],helplink.row[iRow]));
                helplink.dynamic.appendChild(ProjectStageCreateText.createExtendedSubsectionRow(isection,isubsection,iRow,subsectionrow,helplink.row));
                //helplink.dynamic.appendChild(ProjectStageCreateText.createExtendedSubsectionRow(iRow,subsectionrow,helplink.row));
                /* INCREMENT SUBSECTION ROW */
                iRow++;
            };
        return (div);
    }
    createAddSectionButton(iSection){
        //console.log('ProjectStageCreateText::createAddSectionButton()');
        var div=document.createElement('div');
            div.setAttribute('class','btn btn-success btn-add');
        var classObject=this;
            div.innerText='Dodaj sekcję';
            div.onclick=function(){
                /* TO DO
                 * CHECK IS THERE ANY ROW -> IF NO -> SWAP TO createSimleRow()
                 */
                /* SETUP NEW SECTION in stageData */
                classObject.stageData.section[iSection]=classObject.setUpNewStageSection();
                
                classObject.helplink['dynamicSection'].appendChild(classObject.createSection(iSection,classObject.stageData.section,classObject.helplink));
                
                iSection++;
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
        this.Modal.link['button'].appendChild(this.Items.getCancelButton(this.Stage,'show',this.Stage.defaultTask+this.stageData.data.id));
        //this.Modal.link['button'].appendChild(this.Items.getCancelButton(this.Stage,'show',this.Stage.defaultTask+this.data.data['value']['stage'].id));
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
        /* console.log('ProjectStageCreateText::setPreviewButtonAction()'); */
        var classObject=this; 
        ele.onclick = function (){
            classObject.swapPreviewButton(this);
            classObject.Html.hideField(classObject.helplink.dynamic);
            classObject.setPreviewData();
            classObject.Html.showField(classObject.helplink.preview.whole);
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
        return true;
        
        /*
         * CHANGE TO stageData !!
         */
        
            console.log('ProjectStageCreateText::setInputData()');
            //console.log('LINK:');
            //console.log(this.link);
            console.log('HELPLINK:');
            console.log(this.helplink);
        var data={
            db:'0',
            sec:{},
            title:this.helplink['title'].value,
            department:this.helplink['department'].value
            //department:this.link['department']
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
                        value:'',
                        db:'0'
                    };
                    data.sec[property].sub[i].row[propSubsectionRow]['property']=this.setInputDataParseProperty(this.link.section[property].subsection[i][propSubsectionRow].property);              
                    
                    data.sec[property].sub[i].row[propSubsectionRow]['style']=this.link.section[property].subsection[i][propSubsectionRow].style;
                    
                    data.sec[property].sub[i].row[propSubsectionRow].value=this.link.section[property].subsection[i][propSubsectionRow].valueEle.value;
                    
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
            //if(p==='valueEle'){
                /* FIX AND SET VALUE => ELE VALUE */
               //data.section[property].subsection[i].subsectionrow[propSubsectionRow]['property']['value']=this.link.section[property].subsection[i][propSubsectionRow].property.valueEle.value; 
               newProp['value']=property[p].value;
            //}
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
        this.Modal.showLoad();
        var xhrRun={
                    t:'POST',
                    u:this.Items.router+'confirmProjectStageText',
                    //u:'asdasd',
                    /* FOR POST SET TRUE */
                    c:true,
                    d:fd,
                    o:this.Items,
                    m:'setModalResponse'
                };
        var xhrError={
            o:this.Items,
            m:'setModalError'
        };
        /* SET XHR ON ERROR */
        this.Xhr.setOnError(xhrError);
        this.Xhr.run(xhrRun);      
    }
    manageSubsectionVisible(act,section,helplink){    
        /*
        console.log('ProjectStageCreateText::manageSubsectionVisible()');
        console.log('act');
        console.log(act);
        console.log('section');
        console.log(section);
        console.log('helplink');
        console.log(helplink);
        */
        /* PARSE TO INT */
        var max=parseInt(act,10);
        
        for(var i=0;i<this.stageData.subsectionmax;i++){
            /* REMOVE NAME => JS FORM DATA APPEND INPUT ONLY WITH NAME */
            helplink[i].all.classList.remove('d-line');
            helplink[i].all.classList.add('d-none');
        } 
        for(var i=0;i<max;i++){
             /* ADD NAME => JS FORM DATA APPEND INPUT ONLY WITH NAME */
            helplink[i].all.classList.remove('d-none');
            helplink[i].all.classList.add('d-line');
        }      
        /* UPDATE SUBSECTION VISIBLE + ADD ONE FOR LOOP */
        section.subsectionvisible=max;
    }
    setUpCreateData(response){
        //console.log('ProjectStageCreateText::setUpCreateData()');
        var data = this.Items.parseResponse(response);
        //console.log('RESPONSE:');
        //console.log(data);
        /* SET GLOSARY ITEMS */
        this.Glossary.fill(data.data.value.glossary);
        this.iSectionField=1;
        this.setUpNewStageObject(); 
        /* SET UP MODAL */
        this.setUpModal();
    }
    setUpNewStageObject(){
        //console.log('ProjectStageCreateText::setUpNewStageObject()');
        /* CREATE EMPTY STAGE OBJECT */
        this.stageData={
               data:{
                    title:'',
                    id:0,
                    id_department:0,
                    /* name -> department name */
                    name:'',
                    /* SET SQL new_page to valuenewline */
                    valuenewline:this.getValueChar(this.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_PAGE_FROM_NEW','v'))
               },
               property:{
                   
               },
               style:{
                   backgroundColor:this.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_BACKGROUND_COLOR','v'),
                   backgroundColorName:this.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_BACKGROUND_COLOR','n'),
                   backgroundImage:''
                   //,newPage:1
                },
                section:{},
                sectionmax:this.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_SECTION_MAX','v'),
                subsectionmin:this.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_SUBSECTION_MIN','v'),
                subsectionmax:this.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_SUBSECTION_MAX','v'),
                subsectionrowmax:this.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_SUBSECTION_ROW_MAX','v')
        };
        for(var i=0;i<this.iSectionField;i++){
             /* CREATE EMPTY STAGE SECTION - ROW */
            this.stageData.section[i]=this.setUpNewStageSection();  
        }
        /*
         * console.log('stageData:');
         * console.log(this.stageData);
         */
    }
    setUpNewStageSection(){
        var section = {
                data:{
                    id:0
                },
                style:{},
                property:{},
                subsection:{},
                /* AFTER UPLOAD DATA FORM DB -> RECALCULATE DEPENDS OF DATA COUNT */
                subsectionvisible:this.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_SUBSECTION_MIN','v')
                
            };
            /* CREATE EMPTY STAGE SUBSECTION - COLUMN  */
            section.subsection = this.setUpNewStageSubsection();
        return section;
    }
    setUpNewStageSubsection(){
        //console.log('ProjectStageCreateText::setUpNewStageSubsection()');
        var subsection = {};
        for(var i=0;i<this.stageData.subsectionmax;i++){
            
            subsection[i]={
                data:{
                    id:0
                },
                style:{},
                property:{},
                subsectionrow:{
                    0:{}
                }
               
            };
            subsection[i].subsectionrow[0]=this.setUpNewStageSubsectionRow();
            /* FIRST ALWAYS NOT NEW LINE */
            subsection[i].subsectionrow[0].data.valuenewline='n';
            //subsection[i].subsectionrow[1]=this.setUpNewStageSubsectionRow();
            //subsection[i].subsectionrow[2]=this.setUpNewStageSubsectionRow();
        };
        return subsection;
    }
    setUpNewStageSubsectionRow(){
        var row = {
                data:{
                    id:0,
                    value:'',
                    valuenewline:this.getValueChar(this.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_SUBSECTION_ROW_NEW_LINE','v'))
                },
                style:{
                    fontSize:this.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_FONT_SIZE','v'),
                    /* ADD TO SQL - fontSizeMeasurement */
                    fontSizeMeasurement:this.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_FONT_SIZE_MEASUREMENT','v'),
                    color:this.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_COLOR','v'),
                    /* ADD TO SQL - colorName */
                    colorName:this.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_COLOR','n'),
                    backgroundColor:this.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_BACKGROUND_COLOR','v'),
                    /* ADD TO SQL - backgroundColorName */
                    backgroundColorName:this.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_BACKGROUND_COLOR','n'),
                    fontFamily:this.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_FONT_FAMILY','v'),
                    fontWeight:this.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_FONT_BOLD','v'),
                    fontStyle:this.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_FONT_ITALIC','v'),
                    underline:this.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_FONT_LINETHROUGH','v'),
                    'line-through':this.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_FONT_LINETHROUGH','v'),
                    textAlign:this.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_ALIGN','v'),
                    /* ADD TO SQL - backgroundColorName */
                    textAlignName:this.Glossary.getKeyPropertyAttribute('parameter','STAGE_TEXT_ALIGN','n')
                },
                property:{
                    /* ADD TO SQL - 0 -> n, 1 -> y */ 
                }
        };
        return row;
    }
    setUpStage(data){
        //console.log('ProjectStageCreateText::setUpStage()');
        //console.log(data.stage[0]);
        /* ADD EMPTY KEY title department*/
        this.stageData = data.stage[0]; 
    }
    getValueChar(value){
        switch(value){
            case 0:
            case '0':
                return 'n';
            case 1:
            case '1':
                return 'y';
            default:
                return 'n';
        }
    }
}
            