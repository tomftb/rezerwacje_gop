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
    title='lista';
    part='b';
    type={
        t:'t',
        paragraph:'p',
        paragraphName:'Nowy akapit',
        g:'text',
        gk:'STAGE_TEXT'
    };
    change=false;
    StageDataUpdate=new Object();
    StageDataRefill=new Object();
    constructor(){
        this.StageDataUpdate=new StageDataUpdate();
        this.StageDataRefill=new StageDataRefill();
    }
    setProperty(Glossary,Property,type,tabstop,part){
        //console.log('StageData::setProperty()');
        this.Glossary = Glossary;
        this.Property=Property;
        //console.log(this.Property);
        //this.type=type;
        this.part=part;
        this.setType(type);
        //this.setSubsectionRowDefault();
        this.setSubsectionRowTabStop(tabstop);
        //console.log(this.Property); 
    }
    setGlossary(Glossary){
        console.log('StageData::setGlossary()');
        console.log(Glossary);
        this.Glossary=Glossary;
    }
    setType(type){
        var typeProperty={
                t:{
                    t:'t',
                    paragraph:'p',
                    paragraphName:'Nowy akapit',
                    g:'text',
                    gk:'STAGE_TEXT'
                },
                l:{
                    t:'l',
                    paragraph:'l',
                    paragraphName:'Element listy',
                    g:'list',
                    gk:'STAGE_LIST'
                },
                f:{
                    t:'f',
                    paragraph:'p',
                    paragraphName:'Nowy akapit',
                    g:'text',/* TO DO => footer */
                    gk:'STAGE_TEXT'/* TO DO => STAGE_FOOTER */
                },
                h:{
                    t:'h',
                    paragraph:'p',
                    paragraphName:'Nowy akapit',
                    g:'text', /* TO DO => heading */
                    gk:'STAGE_TEXT'/* TO DO => STAGE_HEADING */
                }
        };
        /* IF EXISTS => SETUP */
        if(typeProperty.hasOwnProperty(type)){
            this.type=typeProperty[type];
        }
    }
    setDefault(){
        console.log('StageData::setDefault()');
        console.log(this.Glossary);
        /* CREATE EMPTY STAGE OBJECT */
        this.Stage={
               data:{
                    title:'',
                    id:0,
                    part:this.part,
                    /* SET PROPER AS IN SQL */
                    departmentId:this.Property.department.defaultDepartment[0].v,
                    /* name -> department name */
                    /* SET PROPER AS IN SQL */
                    departmentName:this.Property.department.defaultDepartment[0].n,
                    /* SET SQL new_page to valuenewline */
                    //valuenewline:this.getValueChar(this.Glossary[this.type.g].getKeyPropertyAttribute('parameter',this.type.gk+'_PAGE_FROM_NEW','v'))//STAGE_TEXT_PAGE_FROM_NEW
                    valuenewline:this.Glossary[this.type.g].getKeyPropertyAttribute('parameter',this.type.gk+'_PAGE_FROM_NEW','v')//STAGE_TEXT_PAGE_FROM_NEW
                },
               property:{
                   tmpid:'0'
               },
               style:{
                    /* MOVE TO SECTION */
                    backgroundColor:'#FFFFFF',
                    backgroundColorName:'WHITE'
               },
               section:{}
        };
        this.setDefaultSection();
    }
    setDefaultSection(){
        console.log('StageData::setDefaultSection()');
        //this.Glossary[this.type.g].getKeyPropertyAttribute('parameter',this.type.gk+'_PAGE_FROM_NEW','v')
        for(var i=0;i<this.Glossary[this.type.g].getKeyPropertyAttribute('parameter',this.type.gk+'_SECTION_MIN','v');i++){
        //for(var i=0;i<this.Property[this.type.g].sectionMin;i++){
            this.createSection();
        };
    }
    createSection(){    
        console.log('StageData::createSection()');
        this.Stage.section[this.iSection]={
            data:{
                id:0
            },
            style:this.getDefaultSectionStyle(),
            property:{
                valuenewline:this.Glossary[this.type.g].getKeyPropertyAttribute('parameter',this.type.gk+'_SECTION_NEW_LINE','v'),
                tmpid:this.iSection
            },
            /* CREATE EMPTY STAGE SUBSECTION - COLUMN  */
            subsection:this.getDefaultSubsection()
        };
        this.iSection++;
        return this.Stage.section;
    }
    getDefaultSubsection(){
        //console.log('StageData.createDefaultSubsection()');
        var subsection = {};
        for(var i=0;i<this.Glossary[this.type.g].getKeyPropertyAttribute('parameter',this.type.gk+'_SUBSECTION_MIN','v');i++){
        //for(var i=0;i<this.Property[this.type.g].subsectionMin;i++){  
            subsection[i]=this.createSubsection(i);
        }
        return subsection;
    }
    createSubsection(tmpid){
        console.log('StageData::createSubsection()');
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
        console.log('StageData::createDefaultSubsectionRow()');
        var subsectionRow = {};
            /* FIRST ALWAYS NEW LINE */
            for(var i=0;i<this.Glossary[this.type.g].getKeyPropertyAttribute('parameter',this.type.gk+'_SUBSECTION_ROW_MIN','v');i++){
                subsectionRow[i]=this.createSubsectionRow(i);
                console.log(subsectionRow[i]);
            };
            return subsectionRow;
    }
    createSubsectionRow(tmpid){
        console.log('StageData::createSubsectionRow()');
        /* RUN SET DEFAULT -> TO PREVENT REFERENCES */
        return {
                data:{
                    id:0
                },
                /* TO DO -> CHECK to clone or new */
                paragraph:this.getDefaultParagraphProperty(),
                list:this.getDefaultListProperty(),
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
                return '0';
            case 1:
            case '1':
                return '1';
            default:
                return '0';
        }
    }
    setBasicStage(data){
        //console.log('StageData::setBasicStage()');
        this.Stage = data;
    }
    setStage(data){
        console.log('StageData::setStage()');
        //console.log(data);
        this.Stage = data;
        this.iSection = Object.keys(this.Stage.section).length;
        /* FIX FOR NEW ELEMENTS => Return true or false to update data in background*/
        return this.StageDataRefill.refill(this.Stage,this.getDefaultParagraphProperty(),this.getDefaultListProperty());  
    }
    getDefaultSectionStyle(){
        return {
                backgroundColor:this.Glossary[this.type.g].getKeyPropertyAttribute('parameter',this.type.gk+'_SECTION_BACKGROUND_COLOR','v'),
                backgroundColorName:this.Glossary[this.type.g].getKeyPropertyAttribute('parameter',this.type.gk+'_SECTION_BACKGROUND_COLOR','n'),
                backgroundImage:'' 
            };
    }
    getDefaultParagraphProperty(){
        console.log('StageData::getDefaultParagraphProperty()');
        console.log(this.type.gk,this.type.g,this.Glossary);
        return { 
                    style:{
                        fontSize:this.Glossary[this.type.g].getKeyPropertyAttribute('parameter',this.type.gk+'_FONT_SIZE','v'),
                        fontSizeMax:this.Glossary[this.type.g].getKeyPropertyAttribute('parameter',this.type.gk+'_FONT_SIZE_MAX','v'),
                        fontSizeMeasurement:this.Glossary[this.type.g].getKeyPropertyAttribute('parameter',this.type.gk+'_FONT_SIZE_MEASUREMENT','v'),
                        color:this.Glossary[this.type.g].getKeyPropertyAttribute('parameter',this.type.gk+'_COLOR','v'),
                        colorName:this.Glossary[this.type.g].getKeyPropertyAttribute('parameter',this.type.gk+'_COLOR','n'),
                        backgroundColor:this.Glossary[this.type.g].getKeyPropertyAttribute('parameter',this.type.gk+'_BACKGROUND_COLOR','v'),
                        backgroundColorName:this.Glossary[this.type.g].getKeyPropertyAttribute('parameter',this.type.gk+'_BACKGROUND_COLOR','n'),
                        fontFamily:this.Glossary[this.type.g].getKeyPropertyAttribute('parameter',this.type.gk+'_FONT_FAMILY','v'),
                        fontWeight:this.Glossary[this.type.g].getKeyPropertyAttribute('parameter',this.type.gk+'_FONT_BOLD','v'),
                        fontStyle:this.Glossary[this.type.g].getKeyPropertyAttribute('parameter',this.type.gk+'_FONT_ITALIC','v'),
                        underline:this.Glossary[this.type.g].getKeyPropertyAttribute('parameter',this.type.gk+'_FONT_UNDERLINE','v'),
                        'line-through':this.Glossary[this.type.g].getKeyPropertyAttribute('parameter',this.type.gk+'_FONT_LINETHROUGH','v'),
                        textAlign:this.Glossary[this.type.g].getKeyPropertyAttribute('parameter',this.type.gk+'_ALIGN','v'),
                        textAlignName:this.Glossary[this.type.g].getKeyPropertyAttribute('parameter',this.type.gk+'_ALIGN','n'),
                        leftEjection:this.Glossary[this.type.g].getKeyPropertyAttribute('parameter',this.type.gk+'_LEFT_EJECTION','n'),
                        leftEjectionMin:this.Glossary[this.type.g].getKeyPropertyAttribute('parameter',this.type.gk+'_LEFT_EJECTION_MIN','n'),
                        leftEjectionMax:this.Glossary[this.type.g].getKeyPropertyAttribute('parameter',this.type.gk+'_LEFT_EJECTION_MAX','n'),
                        leftEjectionMeasurement:this.Glossary[this.type.g].getKeyPropertyAttribute('parameter',this.type.gk+'_LEFT_EJECTION_MEASUREMENT','n'),
                        rightEjection:this.Glossary[this.type.g].getKeyPropertyAttribute('parameter',this.type.gk+'_RIGHT_EJECTION','n'),
                        rightEjectionMin:this.Glossary[this.type.g].getKeyPropertyAttribute('parameter',this.type.gk+'_RIGHT_EJECTION_MIN','n'),
                        rightEjectionMax:this.Glossary[this.type.g].getKeyPropertyAttribute('parameter',this.type.gk+'_RIGHT_EJECTION_MAX','n'),
                        rightEjectionMeasurement:this.Glossary[this.type.g].getKeyPropertyAttribute('parameter',this.type.gk+'_RIGHT_EJECTION_MEASUREMENT','n'),
                        indentation:this.Glossary[this.type.g].getKeyPropertyAttribute('parameter',this.type.gk+'_INDENTATION','n'),
                        indentationMin:this.Glossary[this.type.g].getKeyPropertyAttribute('parameter',this.type.gk+'_INDENTATION_MIN','n'),
                        indentationMax:this.Glossary[this.type.g].getKeyPropertyAttribute('parameter',this.type.gk+'_INDENTATION_MAX','n'),
                        indentationMeasurement:this.Glossary[this.type.g].getKeyPropertyAttribute('parameter',this.type.gk+'_INDENTATION_MEASUREMENT','n'),
                        indentationSpecial:this.Glossary[this.type.g].getKeyPropertyAttribute('parameter',this.type.gk+'_INDENTATION_SPECIAL','v'),
                        indentationSpecialName:this.Glossary[this.type.g].getKeyPropertyAttribute('parameter',this.type.gk+'_INDENTATION_SPECIAL','n'),
                        marginBottom:this.Glossary[this.type.g].getKeyPropertyAttribute('parameter',this.type.gk+'_SPACE_AFTER','v'),
                        marginBottomMeasurement:this.Glossary[this.type.g].getKeyPropertyAttribute('parameter',this.type.gk+'_SPACE_AFTER_MEASUREMENT','v'),
                        marginTop:this.Glossary[this.type.g].getKeyPropertyAttribute('parameter',this.type.gk+'_SPACE_BEFORE','v'),
                        marginTopMeasurement:this.Glossary[this.type.g].getKeyPropertyAttribute('parameter',this.type.gk+'_SPACE_BEFORE_MEASUREMENT','v'),
                        lineSpacing:this.Glossary[this.type.g].getKeyPropertyAttribute('parameter',this.type.gk+'_LINE_SPACING','v'),
                        lineSpacingName:this.Glossary[this.type.g].getKeyPropertyAttribute('parameter',this.type.gk+'_LINE_SPACING','n'),
                        lineSpacingMin:this.Glossary[this.type.g].getKeyPropertyAttribute('parameter',this.type.gk+'_LINE_SPACING_MIN','n'),
                        lineSpacingMax:this.Glossary[this.type.g].getKeyPropertyAttribute('parameter',this.type.gk+'_LINE_SPACING_MAX','n'),
                        lineSpacingMeasurement:this.Glossary[this.type.g].getKeyPropertyAttribute('parameter',this.type.gk+'_LINE_SPACING_MEASUREMENT','n'),
                        lineSpacingValue:this.Glossary[this.type.g].getKeyPropertyAttribute('parameter',this.type.gk+'_LINE_SPACING_VALUE','v')
                    },
                    property: {
                        value:'',
                        valuenewline:this.Glossary[this.type.g].getKeyPropertyAttribute('parameter',this.type.gk+'_SUBSECTION_ROW_NEW_LINE','v'),
                        paragraph:this.type.paragraph,
                        paragraphName:this.type.paragraphName,
                        tabstop:'-1'
                    },
                    tabstop:this.tabStop      
        };
    }
    getDefaultListProperty(){
        return {
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
                        backgroundColorName:this.Glossary.list.getKeyPropertyAttribute('parameter','STAGE_LIST_BACKGROUND_COLOR','n'),
                        spaceAfter:this.Glossary.list.getKeyPropertyAttribute('parameter','STAGE_LIST_SPACE_AFTER','n'),
                        spaceAfterMeasurement:this.Glossary.list.getKeyPropertyAttribute('parameter','STAGE_LIST_SPACE_AFTER_MEASUREMENT','n'),
                        spaceBefore:this.Glossary.list.getKeyPropertyAttribute('parameter','STAGE_LIST_SPACE_BEFORE','n'),
                        spaceBeforeMeasurement:this.Glossary.list.getKeyPropertyAttribute('parameter','STAGE_LIST_SPACE_BEFORE_MEASUREMENT','n')
                    },
                    property:{
                        listLevel:this.Glossary.list.getKeyPropertyAttribute('parameter','STAGE_LIST_DEFAULT_LVL','v'),
                        listLevelName:this.Glossary.list.getKeyPropertyAttribute('parameter','STAGE_LIST_DEFAULT_LVL','n'),
                        listLevelMax:this.Glossary.list.getKeyPropertyAttribute('parameter','STAGE_LIST_MAX_LVL','v'),
                        listLevelMaxName:this.Glossary.list.getKeyPropertyAttribute('parameter','STAGE_LIST_MAX_LVL','n'),
                        //listNewElement:'y',
                        //listNewElementName:'Nowy element',
                        newList:'n',
                        newListName:'Kontynuacja',
                        chapter:this.Glossary.list.getKeyPropertyAttribute('parameter','STAGE_LIST_CHAPTER_DEFAULT','v'),/* 0 - no, 1 - yes */
                        chapterMultiplier:this.Glossary.list.getKeyPropertyAttribute('parameter','STAGE_LIST_CHAPTER_MULTIPLIER','v'),/* 0 - no, 1 - yes */
                        chapterLevel:this.Glossary.list.getKeyPropertyAttribute('parameter','STAGE_LIST_CHAPTER_DEFAULT_LVL','v'), /* default range from 1 to 7 */
                        chapterLevelMax:this.Glossary.list.getKeyPropertyAttribute('parameter','STAGE_LIST_CHAPTER_MAX_LVL','v') /* default range from 1 to 7 */
                    }  
        };
    }
    setSubsectionRowTabStop(tabstop){
        //console.log('StageData::setSubsectionRowTabStop()');
        //console.log(tabstop);
        if(tabstop===null || tabstop===undefined){
            //console.log('nulllll');
            this.tabStop={};
            return false;
        }
        this.tabStop = tabstop;
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
       console.log('Actual `PART` Data:');
       console.log(this.Stage);
       console.log('New `PART` Data:');
       console.log(NewStageData);
       this.StageDataUpdate.update(this.Stage,NewStageData);
    }
}