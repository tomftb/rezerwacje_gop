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
    constructor(Glossary,Property,type,tabstop){
        this.Glossary = Glossary;
        this.Property=Property;

        this.setSubsectionRowDefault(type);
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
            style:this.defaultSection.style,
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
        return {
                data:{
                    id:0
                },
                paragraph:{
                    style:this.defaultRow.paragraph.style,
                    property:{
                        /* ADD TO SQL - 0 -> n, 1 -> y */ 
                        /* LIST */
                        /*
                         * l - list
                         * p - paragraph
                         * 
                         */
                        value:'',
                        valuenewline:'y',/* default */
                        paragraph:this.defaultRow.paragraph.property.paragraph,
                        paragraphName:this.defaultRow.paragraph.property.paragraphName, //Nowy akapit
                        /* CHECK FOR EXIST tabstop with number */
                        //tabstop:'0'
                        tabstop:'-1'
                    },
                    /* OBJECT */
                    tabstop:this.tabStop
                    /*
                    tabstop:{
                        '0':{
                            position:0,
                            measurement:'cm',
                            measurementName:'cm',
                            alignment:'left',
                            alignmentName:'Do lewej',
                            leadingSign:'none',
                            leadingSignName:'Brak'
                        }
                    }    
                    */
                },
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
                    style:{},
                    property:{} 
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
    setSubsectionRowDefault(type){
        /*
         * type:
         * p - paragraph
         * l - list
         * t - table
         * i - image
        */
        var sectionText={
            style:{
                backgroundColor:this.Glossary.text.getKeyPropertyAttribute('parameter','STAGE_TEXT_SECTION_BACKGROUND_COLOR','v'),
                backgroundColorName:this.Glossary.text.getKeyPropertyAttribute('parameter','STAGE_TEXT_SECTION_BACKGROUND_COLOR','n'),
                backgroundImage:''
            }
        };
        var sectionList={
            style:{
                backgroundColor:this.Glossary.list.getKeyPropertyAttribute('parameter','STAGE_LIST_SECTION_BACKGROUND_COLOR','v'),
                backgroundColorName:this.Glossary.list.getKeyPropertyAttribute('parameter','STAGE_LIST_SECTION_BACKGROUND_COLOR','n'),
                backgroundImage:''
            }
        };
        var rowParagraph={
                paragraph:{
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
                        paragraph:'p',
                        paragraphName:'Nowy akapit'
                    }    
                }
                
        };
        var rowList={ 
                paragraph:{
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
                        paragraph:'l',
                        paragraphName:'Element listy'
                    }
                }
                
            };
        switch(type){
            case 'l':
                this.defaultRow=rowList;
                this.defaultSection=sectionText;
                break;
            default:
            case 'p':
                this.defaultRow=rowParagraph;
                this.defaultSection=sectionList;
                break;
        };
        
    }
    setSubsectionRowTabStop(tabstop){
        if(tabstop===null){
            //console.log('nulllll');
            return false;
        }
        this.tabStop = tabstop;
    }
}