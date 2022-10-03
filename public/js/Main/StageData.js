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
               property:{},
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
                valuenewline:'y'
            },
            /* CREATE EMPTY STAGE SUBSECTION - COLUMN  */
            subsection:this.createDefaultSubsection()
        };
        this.iSection++;
        return this.Stage.section;
    }
    createDefaultSubsection(){
        //console.log('ProjectStageCreateList::setUpNewStageSubsection()');
        var subsection = {};
        for(var i=0;i<this.Property.text.subsectionMin;i++){  
            subsection[i]=this.createSubsection();
        }
        return subsection;
    }
    createSubsection(){
        return {
                data:{
                    id:0
                },
                style:{},
                property:{},
                subsectionrow:this.createDefaultSubsectionRow()
            };
    }
    createDefaultSubsectionRow(){
        var subsectionRow = {};
            /* FIRST ALWAYS NEW LINE */
            //var newLine = 'y';
            for(var i=0;i<this.Property.text.subsectionRowMin;i++){  
                subsectionRow[i]=this.createSubsectionRow();
               // subsectionRow[i].paragraph.property.valuenewline=newLine;
               // newLine = this.Property.subsectionRowNewLine;
            };
            return subsectionRow;
    }
    createSubsectionRow(){
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
                    
                }
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
    updateTmpImages(){
       console.log('StageData->updateTmpImages()');
       for(const prop in this.Stage.section){           
            for(const prop1 in this.Stage.section[prop].subsection){             
                for(const prop2 in this.Stage.section[prop].subsection[prop1].subsectionrow){
                    for(const prop3 in this.Stage.section[prop].subsection[prop1].subsectionrow[prop2].image){
                        this.Stage.section[prop].subsection[prop1].subsectionrow[prop2].image[prop3].data.tmp='n';
                        console.log(this.Stage.section[prop].subsection[prop1].subsectionrow[prop2].image[prop3].data);
                        //if(this.Stage.section[prop].subsection[prop1].subsectionrow[prop2].image[prop3].data.tmp==='y'){
                           // files.push(this.Stage.section[prop].subsection[prop1].subsectionrow[prop2].image[prop3].property.uri);
                       // }            
                    }
                }
            }
        } 
    }
}