class ProjectStageTool{
    
    Tool = new Object();
    Utilities = new Object()
    Glossary = new Object();
    
    constructor(Stage){
        this.Utilities = Stage.Utilities;
        this.Glossary = Stage.Glossary;
        this.Tool = new Tool();
    }
    setIndentation(subsectionrow){
        console.log('ProjectStageTool::setIndentation()');
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
        return  this.Tool.create('Specjalne:',data);
    }
}

