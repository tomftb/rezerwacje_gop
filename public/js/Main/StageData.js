/*
 * TO DO -> move stageData here
 */
class StageData{
    Stage={};
    Glossary={};
    Property={};
    iSection=0;
    defaultRow={};
    defaultSection={};
    tabStop={};
    type='';
    title='lista';
    change=false;
    constructor(Glossary,Property,type,tabstop){
        this.Glossary = Glossary;
        this.Property=Property;
        this.type=type;
        //this.setSubsectionRowDefault();
        this.setSubsectionRowTabStop(tabstop);
        console.log(this.Property); 
    }
    createDefault(){
        console.log('StageData::createDefault()');
        /* CREATE EMPTY STAGE OBJECT */
        this.Stage={
               data:{
                    title:'',
                    id:0,
                    /* SET PROPER AS IN SQL */
                    departmentId:this.Property.department.defaultDepartment[0].v,
                    /* name -> department name */
                    /* SET PROPER AS IN SQL */
                    departmentName:this.Property.department.defaultDepartment[0].n,
                    /* SET SQL new_page to valuenewline */
                    valuenewline:this.getValueChar(this.Glossary.text.getKeyPropertyAttribute('parameter','STAGE_TEXT_PAGE_FROM_NEW','v'))
               },
               property:{
                   tmpid:'0'
               },
               style:{
                    /* MOVE TO SECTION */
                    //backgroundColor:this.Glossary.text.getKeyPropertyAttribute('parameter','STAGE_TEXT_BACKGROUND_COLOR','v'),
                    //backgroundColorName:this.Glossary.text.getKeyPropertyAttribute('parameter','STAGE_TEXT_BACKGROUND_COLOR','n'),
                    //backgroundImage:''
                    //,newPage:1
               },
               section:{}
        };
        this.createDefaultSection();
    }
    createDefaultSection(){
        for(var i=0;i<this.Property.text.sectionMin;i++){
            this.createSection();
        };
    }
    createSection(){    
        this.Stage.section[this.iSection]={
            data:{
                id:0
            },
            style:this.getDefaultSectionStyle(),
            property:{
                valuenewline:'y',
                tmpid:this.iSection
            },
            /* CREATE EMPTY STAGE SUBSECTION - COLUMN  */
            subsection:this.createDefaultSubsection()
        };
        this.iSection++;
        return this.Stage.section;
    }
    createDefaultSubsection(){
        //console.log('StageData.createDefaultSubsection()');
        var subsection = {};
        for(var i=0;i<this.Property.text.subsectionMin;i++){  
            subsection[i]=this.createSubsection(i);
        }
        return subsection;
    }
    createSubsection(tmpid){
        console.log('StageData.createSubsection()');
        return {
                data:{
                    id:0
                },
                style:{},
                property:{
                    tmpid:tmpid
                },
                subsectionrow:this.createDefaultSubsectionRow()
            };
    }
    createDefaultSubsectionRow(){
        console.log('StageData.createDefaultSubsectionRow()');
        var subsectionRow = {};
            /* FIRST ALWAYS NEW LINE */
            //var newLine = 'y';
            for(var i=0;i<this.Property.text.subsectionRowMin;i++){  
                subsectionRow[i]=this.createSubsectionRow(i);
               // subsectionRow[i].paragraph.property.valuenewline=newLine;
               // newLine = this.Property.subsectionRowNewLine;
            };
            return subsectionRow;
    }
    createSubsectionRow(tmpid){
        /* RUN SET DEFAULT -> TO PREVENT REFERENCES */
        //this.setSubsectionRowDefault(this.type);
        return {
                data:{
                    id:0
                },
                /* TO DO -> CHECK to clone or new */
                paragraph:this.getDefaultRowParagraph(),
                list:{
                    style:{
                        fontSize:this.Glossary.list.getKeyPropertyAttribute('parameter','STAGE_LIST_FONT_SIZE','v'),
                        fontSizeMax:this.Glossary.list.getKeyPropertyAttribute('parameter','STAGE_LIST_FONT_SIZE_MAX','v'),
                        fontSizeMeasurement:this.Glossary.list.getKeyPropertyAttribute('parameter','STAGE_LIST_FONT_SIZE_MEASUREMENT','v'),
                        fontFamily:this.Glossary.list.getKeyPropertyAttribute('parameter','STAGE_LIST_FONT_FAMILY','v'),
                        listType:this.Glossary.list.getKeyPropertyAttribute('parameter','STAGE_LIST_DEFAULT_TYPE','v'),
                        listTypeName:this.Glossary.list.getKeyPropertyAttribute('parameter','STAGE_LIST_DEFAULT_TYPE','n'),
                        fontWeight:this.Glossary.list.getKeyPropertyAttribute('parameter','STAGE_LIST_FONT_BOLD','v'),
                        fontStyle:this.Glossary.list.getKeyPropertyAttribute('parameter','STAGE_LIST_FONT_ITALIC','v'),
                        underline:this.Glossary.list.getKeyPropertyAttribute('parameter','STAGE_LIST_FONT_UNDERLINE','v'),
                        'line-through':this.Glossary.list.getKeyPropertyAttribute('parameter','STAGE_LIST_FONT_LINETHROUGH','v'),
                        color:this.Glossary.list.getKeyPropertyAttribute('parameter','STAGE_LIST_COLOR','v'),
                        colorName:this.Glossary.list.getKeyPropertyAttribute('parameter','STAGE_LIST_COLOR','n'),
                        backgroundColor:this.Glossary.list.getKeyPropertyAttribute('parameter','STAGE_LIST_BACKGROUND_COLOR','v'),
                        backgroundColorName:this.Glossary.list.getKeyPropertyAttribute('parameter','STAGE_LIST_BACKGROUND_COLOR','n')
                    },
                    property:{
                        listLevel:this.Glossary.list.getKeyPropertyAttribute('parameter','STAGE_LIST_DEFAULT_LVL','v'),
                        listLevelName:this.Glossary.list.getKeyPropertyAttribute('parameter','STAGE_LIST_DEFAULT_LVL','n'),
                        listLevelMax:this.Glossary.list.getKeyPropertyAttribute('parameter','STAGE_LIST_MAX_LVL','v'),
                        listLevelMaxName:this.Glossary.list.getKeyPropertyAttribute('parameter','STAGE_LIST_MAX_LVL','n'),
                        //listNewElement:'y',
                        //listNewElementName:'Nowy element',
                        newList:'n',
                        newListName:'Kontynuacja'
                    }  
                },
                table:{
                    style:{ },
                    property:{}
                },
                image:{
                    
                },
                property:{
                    tmpid:tmpid 
                },
                style:{}
        };
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
    setStage(data){
        this.Stage = data;
        this.iSection = Object.keys(this.Stage.section).length;
    }
    getDefaultSectionStyle(){
        var sectionTextStyle={
            
                backgroundColor:this.Glossary.text.getKeyPropertyAttribute('parameter','STAGE_TEXT_SECTION_BACKGROUND_COLOR','v'),
                backgroundColorName:this.Glossary.text.getKeyPropertyAttribute('parameter','STAGE_TEXT_SECTION_BACKGROUND_COLOR','n'),
                backgroundImage:''
            
        };
        var sectionListStyle={
            
                backgroundColor:this.Glossary.list.getKeyPropertyAttribute('parameter','STAGE_LIST_SECTION_BACKGROUND_COLOR','v'),
                backgroundColorName:this.Glossary.list.getKeyPropertyAttribute('parameter','STAGE_LIST_SECTION_BACKGROUND_COLOR','n'),
                backgroundImage:''
            
        };
        switch(this.type){
            case 'l':
                this.title='lista';
                return sectionTextStyle;
                break;
            default:
            case 'p':
                this.title='tekst';
                return sectionListStyle;
                break;
        };
    }
    getDefaultRowParagraph(){
        var rowParagraph={ 
                    style:{
                        fontSize:this.Glossary.text.getKeyPropertyAttribute('parameter','STAGE_TEXT_FONT_SIZE','v'),
                        fontSizeMax:this.Glossary.text.getKeyPropertyAttribute('parameter','STAGE_TEXT_FONT_SIZE_MAX','v'),
                        fontSizeMeasurement:this.Glossary.text.getKeyPropertyAttribute('parameter','STAGE_TEXT_FONT_SIZE_MEASUREMENT','v'),
                        color:this.Glossary.text.getKeyPropertyAttribute('parameter','STAGE_TEXT_COLOR','v'),
                        colorName:this.Glossary.text.getKeyPropertyAttribute('parameter','STAGE_TEXT_COLOR','n'),
                        backgroundColor:this.Glossary.text.getKeyPropertyAttribute('parameter','STAGE_TEXT_BACKGROUND_COLOR','v'),
                        backgroundColorName:this.Glossary.text.getKeyPropertyAttribute('parameter','STAGE_TEXT_BACKGROUND_COLOR','n'),
                        fontFamily:this.Glossary.text.getKeyPropertyAttribute('parameter','STAGE_TEXT_FONT_FAMILY','v'),
                        fontWeight:this.Glossary.text.getKeyPropertyAttribute('parameter','STAGE_TEXT_FONT_BOLD','v'),
                        fontStyle:this.Glossary.text.getKeyPropertyAttribute('parameter','STAGE_TEXT_FONT_ITALIC','v'),
                        underline:this.Glossary.text.getKeyPropertyAttribute('parameter','STAGE_TEXT_FONT_UNDERLINE','v'),
                        'line-through':this.Glossary.text.getKeyPropertyAttribute('parameter','STAGE_TEXT_FONT_LINETHROUGH','v'),
                        textAlign:this.Glossary.text.getKeyPropertyAttribute('parameter','STAGE_TEXT_ALIGN','v'),
                        textAlignName:this.Glossary.text.getKeyPropertyAttribute('parameter','STAGE_TEXT_ALIGN','n'),
                        leftEjection:this.Glossary.text.getKeyPropertyAttribute('parameter','STAGE_TEXT_LEFT_EJECTION','n'),
                        leftEjectionMin:this.Glossary.text.getKeyPropertyAttribute('parameter','STAGE_TEXT_LEFT_EJECTION_MIN','n'),
                        leftEjectionMax:this.Glossary.text.getKeyPropertyAttribute('parameter','STAGE_TEXT_LEFT_EJECTION_MAX','n'),
                        leftEjectionMeasurement:this.Glossary.text.getKeyPropertyAttribute('parameter','STAGE_TEXT_LEFT_EJECTION_MEASUREMENT','n'),
                        rightEjection:this.Glossary.text.getKeyPropertyAttribute('parameter','STAGE_TEXT_RIGHT_EJECTION','n'),
                        rightEjectionMin:this.Glossary.text.getKeyPropertyAttribute('parameter','STAGE_TEXT_RIGHT_EJECTION_MIN','n'),
                        rightEjectionMax:this.Glossary.text.getKeyPropertyAttribute('parameter','STAGE_TEXT_RIGHT_EJECTION_MAX','n'),
                        rightEjectionMeasurement:this.Glossary.text.getKeyPropertyAttribute('parameter','STAGE_TEXT_RIGHT_EJECTION_MEASUREMENT','n'),
                        indentation:this.Glossary.text.getKeyPropertyAttribute('parameter','STAGE_TEXT_INDENTATION','n'),
                        indentationMin:this.Glossary.text.getKeyPropertyAttribute('parameter','STAGE_TEXT_INDENTATION_MIN','n'),
                        indentationMax:this.Glossary.text.getKeyPropertyAttribute('parameter','STAGE_TEXT_INDENTATION_MAX','n'),
                        indentationMeasurement:this.Glossary.text.getKeyPropertyAttribute('parameter','STAGE_TEXT_INDENTATION_MEASUREMENT','n'),
                        indentationSpecial:this.Glossary.text.getKeyPropertyAttribute('parameter','STAGE_TEXT_INDENTATION_SPECIAL','v'),
                        indentationSpecialName:this.Glossary.text.getKeyPropertyAttribute('parameter','STAGE_TEXT_INDENTATION_SPECIAL','n')
                    },
                    property: {
                        value:'',
                        valuenewline:'y',/* default */
                        paragraph:'p',
                        paragraphName:'Nowy akapit',
                        tabstop:'-1'
                    },
                    tabstop:this.tabStop      
        };
        var rowList={ 
                
                    style:{
                        fontSize:this.Glossary.list.getKeyPropertyAttribute('parameter','STAGE_LIST_TEXT_FONT_SIZE','v'),
                        fontSizeMax:this.Glossary.list.getKeyPropertyAttribute('parameter','STAGE_LIST_TEXT_FONT_SIZE_MAX','v'),
                        /* ADD TO SQL - fontSizeMeasurement */
                        fontSizeMeasurement:this.Glossary.list.getKeyPropertyAttribute('parameter','STAGE_LIST_TEXT_FONT_SIZE_MEASUREMENT','v'),
                        color:this.Glossary.list.getKeyPropertyAttribute('parameter','STAGE_LIST_TEXT_COLOR','v'),
                        /* ADD TO SQL - colorName */
                        colorName:this.Glossary.list.getKeyPropertyAttribute('parameter','STAGE_LIST_TEXT_COLOR','n'),
                        backgroundColor:this.Glossary.list.getKeyPropertyAttribute('parameter','STAGE_LIST_TEXT_BACKGROUND_COLOR','v'),
                        /* ADD TO SQL - backgroundColorName */
                        backgroundColorName:this.Glossary.list.getKeyPropertyAttribute('parameter','STAGE_LIST_TEXT_BACKGROUND_COLOR','n'),
                        fontFamily:this.Glossary.list.getKeyPropertyAttribute('parameter','STAGE_LIST_TEXT_FONT_FAMILY','v'),
                        fontWeight:this.Glossary.list.getKeyPropertyAttribute('parameter','STAGE_LIST_TEXT_FONT_BOLD','v'),
                        fontStyle:this.Glossary.list.getKeyPropertyAttribute('parameter','STAGE_LIST_TEXT_FONT_ITALIC','v'),
                        underline:this.Glossary.list.getKeyPropertyAttribute('parameter','STAGE_LIST_TEXT_FONT_UNDERLINE','v'),
                        'line-through':this.Glossary.list.getKeyPropertyAttribute('parameter','STAGE_LIST_TEXT_FONT_LINETHROUGH','v'),
                        textAlign:this.Glossary.list.getKeyPropertyAttribute('parameter','STAGE_LIST_TEXT_ALIGN','v'),
                        /* ADD TO SQL - backgroundColorName */
                        textAlignName:this.Glossary.list.getKeyPropertyAttribute('parameter','STAGE_LIST_TEXT_ALIGN','n'),
                        /* TEXT - this.Glossary.text STAGE_TEXT_LEFT_EJECTION */
                        leftEjection:this.Glossary.list.getKeyPropertyAttribute('parameter','STAGE_LIST_LEFT_EJECTION','n'),
                        leftEjectionMin:this.Glossary.list.getKeyPropertyAttribute('parameter','STAGE_LIST_LEFT_EJECTION_MIN','n'),
                        leftEjectionMax:this.Glossary.list.getKeyPropertyAttribute('parameter','STAGE_LIST_LEFT_EJECTION_MAX','n'),
                        leftEjectionMeasurement:this.Glossary.list.getKeyPropertyAttribute('parameter','STAGE_LIST_LEFT_EJECTION_MEASUREMENT','n'),
                        /* TEXT - this.Glossary.text STAGE_TEXT_RIGHT_EJECTION */
                        rightEjection:this.Glossary.list.getKeyPropertyAttribute('parameter','STAGE_LIST_RIGHT_EJECTION','n'),
                        rightEjectionMin:this.Glossary.list.getKeyPropertyAttribute('parameter','STAGE_LIST_RIGHT_EJECTION_MIN','n'),
                        rightEjectionMax:this.Glossary.list.getKeyPropertyAttribute('parameter','STAGE_LIST_RIGHT_EJECTION_MAX','n'),
                        rightEjectionMeasurement:this.Glossary.list.getKeyPropertyAttribute('parameter','STAGE_LIST_RIGHT_EJECTION_MEASUREMENT','n'),
                        /* TEXT - this.Glossary.text STAGE_TEXT_INDENTATION */
                        indentation:this.Glossary.list.getKeyPropertyAttribute('parameter','STAGE_LIST_INDENTATION','n'),
                        indentationMin:this.Glossary.list.getKeyPropertyAttribute('parameter','STAGE_LIST_INDENTATION_MIN','n'),
                        indentationMax:this.Glossary.list.getKeyPropertyAttribute('parameter','STAGE_LIST_INDENTATION_MAX','n'),
                        /* TEXT - this.Glossary.text STAGE_TEXT_INDENTATION_MEASUREMENT */
                        indentationMeasurement:this.Glossary.list.getKeyPropertyAttribute('parameter','STAGE_LIST_INDENTATION_MEASUREMENT','n'),
                        /* TEXT - this.Glossary.text STAGE_TEXT_INDENTATION_SPECIAL */
                        indentationSpecial:this.Glossary.list.getKeyPropertyAttribute('parameter','STAGE_LIST_INDENTATION_SPECIAL','v'),
                         /* TEXT - this.Glossary.text STAGE_TEXT_INDENTATION_SPECIAL */
                        indentationSpecialName:this.Glossary.list.getKeyPropertyAttribute('parameter','STAGE_LIST_INDENTATION_SPECIAL','n')
                    },
                    property:{
                        value:'',
                        valuenewline:'y',/* default */
                        paragraph:'l',
                        paragraphName:'Element listy',
                        tabstop:'-1'
                    },
                    tabstop:this.tabStop
                    
            };
        switch(this.type){
            case 'l':
                return rowList;
                break;
            default:
            case 'p':
                return rowParagraph;
                break;
        };
    }
    setSubsectionRowTabStop(tabstop){
        console.log('StageData::setSubsectionRowTabStop()');
        console.log(tabstop);
        if(tabstop===null || tabstop===undefined){
            //console.log('nulllll');
            this.tabStop={};
            return false;
        }
        this.tabStop = tabstop;
    }
    getTitle(){
        return this.title;
    }
    getFiles(){
        let files = new Array();
        for(const prop in this.Stage.section){           
            for(const prop1 in this.Stage.section[prop].subsection){             
                for(const prop2 in this.Stage.section[prop].subsection[prop1].subsectionrow){
                    for(const prop3 in this.Stage.section[prop].subsection[prop1].subsectionrow[prop2].image){
                        if(this.Stage.section[prop].subsection[prop1].subsectionrow[prop2].image[prop3].data.tmp==='y'){
            files.push(this.Stage.section[prop].subsection[prop1].subsectionrow[prop2].image[prop3].property.uri);
                        }            
                    }
                }
            }
        }
        return files;
    }
    updateStageData(NewStageData){
       console.log('StageData.updateStageData()');
       console.log('Actual Stage Data:');
       console.log(this.Stage);
       console.log('New Stage Data:');
       console.log(NewStageData);


       /* UPDATE STAGE ID */
       this.updateStageId(NewStageData);
       for(const s in this.Stage.section){       
           /* 
            * UPDATE STAGE DATA SECTION 
            * */
            this.updateStageDataSection(this.Stage.section[s],s,NewStageData);
            for(const su in this.Stage.section[s].subsection){  
                    /* 
                    * UPDATE STAGE DATA SUBSECTION 
                    * */
                this.updateStageDataSubsection(this.Stage.section[s].subsection[su],su,NewStageData,s);
                for(const r in this.Stage.section[s].subsection[su].subsectionrow){
                    /* 
                    * UPDATE STAGE DATA SUBSECTION ROW
                    * */
                    console.log('Act Row - '+r);
                    this.updateStageDataSubsectionRow(this.Stage.section[s].subsection[su].subsectionrow[r],r,NewStageData,s,su);
                }
            }
        } 
    }
    updateStageId(NewStageData){
       //console.log(this.Stage.data.id);
       //console.log(typeof(this.Stage.data.id));
       //console.log(NewStageData.data.id);
       //console.log(typeof(NewStageData.data.id));
       this.checkStageDataId(NewStageData,1);
       this.checkStageDataId(this.Stage,0);
       
       if(this.Stage.data.id===0){
           this.Stage.data.id=NewStageData.data.id;
       }
    }
    checkStageDataId(Data,maxId){
        //console.log('StageData.checkStageDataId()');
       if(!Data.hasOwnProperty('data')){
            console.log(Data);
            throw 'StageData.checkStageDataId()\nno `data` property';
       }
       if(!Data.data.hasOwnProperty('id')){
            console.log(Data.data);
            throw 'StageData.checkStageDataId()\nno id `property`';
       }
       if(typeof(Data.data.id)!=='number'){
            console.log(typeof(Data.data.id));
            throw 'StageData.checkStageDataId()\nwrong data id `type`';
       }
       if(Data.data.id<maxId){
           console.log(Data.data.id);
           throw 'StageData.checkStageDataId()\ndata `id` lower than '+maxId;
       }
    }
    updateStageDataSection(Data,idSection,NewStageData){
        //console.log('StageData.updateStageDataSection()');
            //console.log('Actual Stage');
            //console.log(Data);
            //console.log('Key');
            //console.log(key);
            //console.log(typeof(key));
            if(!NewStageData.hasOwnProperty('section')){
               throw 'NewStageData hasn\'t `section` property';
            }
            if(!NewStageData.section.hasOwnProperty(idSection)){
               throw 'NewStageData section hasn\'t `property` - '+idSection;
            }
            //console.log('Actual Stage section:');
            //console.log(Data);
            //console.log('Actual Stage section key:');
            //console.log(key);
            //console.log(typeof(key));
            //console.log('NewStageData section');
            //console.log(NewStageData.section);   
            this.checkStageDataId(NewStageData.section[idSection],1);
            /* CHECK ID */
            if(Data.data.id===NewStageData.section[idSection].data.id){
                /* THE SAME - RETURN TRUE */
            }
            else{
                /* NEW DB ID */
                Data.data.id=NewStageData.section[idSection].data.id;
            }
    }
    updateStageDataSubsection(Data,idSubsection,NewStageData,idSection){
        console.log('StageData.updateStageDataSubsection()');
        console.log(Data);
        console.log(idSubsection);
            if(!NewStageData.section[idSection].hasOwnProperty('subsection')){
               throw 'NewStageData hasn\'t `subsection` property';
            }
            if(!NewStageData.section[idSection].subsection.hasOwnProperty(idSubsection)){
               throw 'NewStageData section '+idSection+' subsection hasn\'t `property` - '+idSubsection;
            }
            this.checkStageDataId(NewStageData.section[idSection].subsection[idSubsection],1);
            if(Data.data.id===NewStageData.section[idSection].subsection[idSubsection].data.id){
                /* THE SAME - RETURN TRUE */
            }
            else{
                /* NEW DB ID */
                Data.data.id=NewStageData.section[idSection].subsection[idSubsection].data.id;
            }
    }
    updateStageDataSubsectionRow(Data,key,NewStageData,idSection,idSubsection){
        console.log('StageData.updateStageDataSubsectionRow()');
        //console.log(Data);
        //console.log(key);
        let idDb=0;
        let idRow='';
            if(!NewStageData.section[idSection].subsection[idSubsection].hasOwnProperty('subsectionrow')){
                throw 'New stage data subsection prop `'+idSubsection+'` hasn\'t `subsectionrow` property';
            }  
            console.log(NewStageData.section[idSection].subsection[idSubsection].subsectionrow);
            for(const r in NewStageData.section[idSection].subsection[idSubsection].subsectionrow){
                //console.log(r);
                //console.log(NewStageData.section[idSection].subsection[idSubsection].subsectionrow[r]);
                //console.log(NewStageData.section[idSection].subsection[idSubsection].subsectionrow[r]);
                /* CHECK ID */
                
                if(Data.data.id===NewStageData.section[idSection].subsection[idSubsection].subsectionrow[r].data.id){
                    /* ALREADY SETUP */
                    idDb=Data.data.id;
                    idRow=r;
                    break;
                }
                if(!NewStageData.section[idSection].subsection[idSubsection].subsectionrow[r].property.hasOwnProperty('tmpid')){
                    throw 'New stage data section prop `'+r+'` hasn\'t `tmpid` property';
                }
                if(NewStageData.section[idSection].subsection[idSubsection].subsectionrow[r].property.tmpid===key){
                    idDb=NewStageData.section[idSection].subsection[idSubsection].subsectionrow[r].data.id;
                    idRow=r;
                    break;
                }
            }
            if(idDb===0){
                console.log('Actual subsection row data:');
                console.log(Data);
                console.log('NewStageData idSection:');
                console.log(idSection);
                console.log('NewStageData idSubsection:');
                console.log(idSubsection);
                console.log('NewStageData section'+idSection+':');
                console.log(NewStageData.section[idSection]);
                console.log('NewStageData subsection'+idSubsection+':');
                console.log(NewStageData.section[idSection].subsection[idSubsection]);
                console.log('NewStageData subsection row data:');
                console.log(NewStageData.section[idSection].subsection[idSubsection].subsectionrow);
                throw 'NewStageData subsectionrow data id property - wrong database id - '+idDb;
            }
            Data.data.id=idDb;
            if(idRow===''){
                //console.log('NO SUBSECTION ROW');
                return true;
            }
        /* UPDATE STAGE DATA IMAGE */
        this.updateStageDataRow(Data,NewStageData.section[idSection].subsection[idSubsection].subsectionrow[idRow]);
    }
    updateStageDataRow(Row,NewStageDataRow){
        //console.log('StageData.updateStageDataSubsectionRow()');
        //console.log('ActualStage ROW:');
        //console.log(Row);
        //console.log(Object.keys(Row).length);
        //console.log('NewStageDataRow');
        //console.log(NewStageDataRow);
        //console.log(Object.keys(Image).length);
        
        if(!Row.hasOwnProperty('image')){
            throw 'ActualStage data row hasn\'t `image` property';
        } 
        if(!NewStageDataRow.hasOwnProperty('image')){
            throw 'New stage data row hasn\'t `image` property';
        } 
        this.updateStageDataRowImage(Row.image,NewStageDataRow);
        
        
    }
    updateStageDataRowImage(Image,NewStageDataRow){
        //console.log('StageData.updateStageDataSubsectionRow()');
        //console.log('ActualStage ROW Image:');
        //console.log(Image);
        var ImageLength=Object.keys(Image).length;
        //console.log(ImageLength);
        //console.log('NewStageDataRow Image:');
        //console.log(NewStageDataRow.image);
        var NewImageLength=Object.keys(NewStageDataRow.image).length;
        //console.log(NewImageLength);

        var ImageToRemove=new Array();
        
        //if(ImageLength!==NewImageLength){
           // throw 'Row image property length != New Row property image length';
        //}
        if(ImageLength===0){
            //console.log('No Row Images');
            return true;
        }
        for(const key in Image){
            //console.log('Image:');
            //console.log(key);
            //console.log(typeof(key));
            //console.log(Image[key]);
            let idDb=0;
            this.checkStageDataId(Image[key],0);
            if(Image[key].data.id>0 && Image[key].data.tmp==='n'){
                /* SKIP - NO CHANGE*/
                continue;
            }
            for(const i in NewStageDataRow.image){
                //console.log('NewImage:');
                //console.log(i);
                //console.log(typeof(i));
                //console.log(NewStageDataRow.image[i]);
                this.checkStageDataId(NewStageDataRow.image[i],1);
                if(NewStageDataRow.image[i].property.tmpid===key){
                    idDb=NewStageDataRow.image[i].data.id;
                    break;
                }
            }
            /* NOT FOUND IN RESPONSE NEW IMAGE AND NO DATA TMP===y*/
            if(Image[key].data.tmp==='d' && idDb===0){
                 ImageToRemove.push(key);
                 continue;
            }
            if(idDb===0){
                throw 'NewStageData row image data id property - wrong database id - '+idDb;
            }
            switch (Image[key].data.tmp) {
            case 'y':
                //console.log('(y) SET TMP = n, update id');
                Image[key].data.tmp='n';
                Image[key].data.id=idDb;
                break;
            case 'n':
                console.log('(n) nothing to do ');
                Image[key].data.id=idDb;
                break
            default:
                throw 'tmp type not in (y,n) - '+Image[key].data.tmp;
           };         
        }
         /* SAFE REMOVE */
        //console.log('SAFE REMOVE');
        delete NewStageDataRow.image;
        //console.log('Image with keys to remove');
        //console.log(ImageToRemove);
        //console.log('image');
        //console.log(Image);
        for(var i=0;i<ImageToRemove.length;i++){
            //console.log('Remove image - '+i);
            //console.log(Image[ImageToRemove[i]]);
            delete Image[ImageToRemove[i]];
        }
    }
}