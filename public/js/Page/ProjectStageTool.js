class ProjectStageTool{
    
    Tool = new Object();
    Utilities = new Object()
    Glossary = new Object();
    
    constructor(Stage){
        this.Utilities = Stage.Utilities;
        this.Glossary = Stage.Glossary;
        this.Tool = new Tool();
    }
    setIndentation(subsectionrow,helplink){
        console.log('ProjectStageTool::setIndentation()');
        console.log(helplink);
        var data={
            0:{
                default:{
                    0:this.Utilities.getDefaultOptionProperties(subsectionrow.style['indentationSpecial'],subsectionrow.style['indentationSpecialName'])
                },
                all:this.Utilities.getDefaultList(this.Glossary.text.item.indentationSpecial,subsectionrow.style['indentationSpecial']),
                property:{
                    value:'indentationSpecial',
                    name:'indentationSpecialName',
                    link:subsectionrow.style,
                    glossary:this.Glossary.text.item.indentationSpecial
                },
                type:'select',
                attributes:{
                    class:'w-50'
                }
            },
            1:{
                value:subsectionrow.style['indentation'],
                property:{
                    value:'indentation',
                    link:subsectionrow.style
                },
                type:'input',
                attributes:{
                    class:'w-25'
                }
            },   
            2:{
                default:{
                    0:this.Utilities.getDefaultOptionProperties(subsectionrow.style['indentationMeasurement'],subsectionrow.style['indentationMeasurement'])
                },
                all:this.Utilities.getDefaultList(this.Glossary.text.item.listMeasurement,subsectionrow.style['indentationMeasurement']),
                property:{
                    value:'indentationMeasurement',
                    name:'indentationMeasurement',
                    glossary:this.Glossary.text.item.listMeasurement,
                    link:subsectionrow.style
                },
                type:'select',
                attributes:{
                    class:'w-25'
                }
            }    
        };
        var tool = this.Tool.create('Specjalne:',data);
            helplink.tool['indentation'] = tool;
        return  tool;
    }
    setEjection(subsectionrow,keys,title){
        console.log('ProjectStageTool::setRightEjection()');
         var data={
            0:{
                value:subsectionrow.style[keys[0]],
                property:{
                    value:keys[0],
                    link:subsectionrow.style
                },
                type:'input',
                attributes:{
                    class:'w-75'
                }
            },
            1:{
                default:{
                    0:this.Utilities.getDefaultOptionProperties(subsectionrow.style[keys[1]],subsectionrow.style[keys[1]])
                },
                all:this.Utilities.getDefaultList(this.Glossary.text.item.listMeasurement,subsectionrow.style[keys[1]]),
                property:{
                    value:keys[1],
                    name:keys[1],
                    link:subsectionrow.style,
                    glossary:this.Glossary.text.item.listMeasurement
                },
                type:'select',
                attributes:{
                    class:'w-25'
                }
            }
        };
        /* TO DO 
        rightEjectionMin
        rightEjectionMax               
         */           
        return  this.Tool.create(title,data);
    }
    setRightEjection(subsectionrow,helplink){
        var keys=['rightEjection','rightEjectionMeasurement'];
        var tool = this.setEjection(subsectionrow,keys,'Wcięcie z prawej strony:');
        /* SET HELPLINK */
            helplink.text['rightEjection']=tool.childNodes[1].childNodes[0];
        return tool;
    }
    setLeftEjection(subsectionrow,helplink){
        var keys=['leftEjection','leftEjectionMeasurement'];
        var tool = this.setEjection(subsectionrow,keys,'Wcięcie z lewej strony:');
        /* SET HELPLINK */
            helplink.text['leftEjection']=tool.childNodes[1].childNodes[0];
        return tool;
    }
}

