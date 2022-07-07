class ProjectStageTool{
    
    Tool = new Object();
    Utilities = new Object()
    Glossary = new Object();
    
    constructor(Stage){
        this.Utilities = Stage.Utilities;
        this.Glossary = Stage.Glossary;
        this.Tool = new Tool();
    }
    getIndentation(subsectionrow,helplink){
        console.log('ProjectStageTool::getIndentation()');
        console.log(helplink);
        var data={
            0:{
                default:{
                    0:this.Utilities.getDefaultOptionProperties(subsectionrow.style['indentationSpecial'],subsectionrow.style['indentationSpecialName'])
                },
                all:this.Utilities.getDefaultList(this.Glossary.text.item.indentationSpecial,subsectionrow.style['indentationSpecial']),
                link:subsectionrow.style,
                glossary:this.Glossary.text.item.indentationSpecial,
                /*Anonymous Functions*/
                onchange:function(value){
                        console.log('ProjectStageTool::getIndentation');
                        console.log(this.link);
                        console.log(this.glossary);
                        this.link['indentationSpecial'] = value;
                        console.log(value);
                        for(const prop in this.glossary){
                            console.log(this.glossary[prop]);
                            if(this.glossary[prop].v===value){
                                console.log('FOUND');
                                this.link['indentationSpecialName'] = this.glossary[prop].n;
                                break;
                            }
                        }
                },
                type:'select',
                attributes:{
                    class:'w-50'
                }
            },
            1:{
                link:subsectionrow.style,
                value:subsectionrow.style.indentation,
                onchange:function(value){
                    this.link['indentation'] = value;
                },
                type:'input',
                attributes:{
                    class:'w-25',
                    type:'number'
                }
            },   
            2:{
                default:{
                    0:this.Utilities.getDefaultOptionProperties(subsectionrow.style['indentationMeasurement'],subsectionrow.style['indentationMeasurement'])
                },
                all:this.Utilities.getDefaultList(this.Glossary.text.item.listMeasurement,subsectionrow.style['indentationMeasurement']),
                link:subsectionrow.style,
                glossary:this.Glossary.text.item.listMeasurement,
                /*Anonymous Functions*/
                onchange:function(value){
                        console.log('ProjectStageTool::getIndentation');
                        console.log(this.link);
                        console.log(this.glossary);
                        this.link['indentationMeasurement'] = value;
                        console.log(value);
                        for(const prop in this.glossary){
                            console.log(this.glossary[prop]);
                            if(this.glossary[prop].v===value){
                                console.log('FOUND');
                                this.link['indentationMeasurement'] = this.glossary[prop].n;
                                break;
                            }
                        }
                },
                type:'select',
                attributes:{
                    class:'w-25',
                }
            }    
        };
        var tool = this.Tool.create('Specjalne:',data);
            helplink.tool['indentation'] = tool;
        return  tool;
    }
    getEjection(subsectionrow,keys,title){
        console.log('ProjectStageTool::getEjection()');
       // console.log(subsectionrow);
        //throw 'aaaaaaaaa';
        var data={
            0:{
                link:subsectionrow.style,
                value:subsectionrow.style[keys[0]],
                /* VALUE */
                key:keys[0],
                onchange:function(value){
                    this.link[this.key] = value;
                },
                type:'input',
                attributes:{
                    class:'w-75',
                    type:'number'
                }
            },
            1:{
                default:{
                    0:this.Utilities.getDefaultOptionProperties(subsectionrow.style[keys[1]],subsectionrow.style[keys[1]])
                },
                all:this.Utilities.getDefaultList(this.Glossary.text.item.listMeasurement,subsectionrow.style[keys[1]]),
                key:keys[1],
                link:subsectionrow.style,
                onchange:function(value){
                        //console.log('ProjectStageTool::getEjection');
                        this.link[this.key] = value;
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
    getRightEjection(subsectionrow,helplink){
        var keys=['rightEjection','rightEjectionMeasurement'];
        var tool = this.getEjection(subsectionrow,keys,'Wcięcie z prawej strony:');
        /* SET HELPLINK */
            helplink.text['rightEjection']=tool.childNodes[1].childNodes[0];
        return tool;
    }
    getLeftEjection(subsectionrow,helplink){
        var keys=['leftEjection','leftEjectionMeasurement'];
        var tool = this.getEjection(subsectionrow,keys,'Wcięcie z lewej strony:');
        /* SET HELPLINK */
            helplink.text['leftEjection']=tool.childNodes[1].childNodes[0];
        return tool;
    }
    getParagraph(subsectionrow,helplink){
        console.log('ProjectStageTool::getParagraph()');
        //throw 'aaaaaaaaa';
        var Glossary={
            0:{
                v:'l',
                n:'Element listy'
            },
            1:{
                v:'p',
                n:'Nowy akapit'
            }
        };
        var data={
            0:{
                default:{
                    0:this.Utilities.getDefaultOptionProperties(subsectionrow.property.paragraph,subsectionrow.property.paragraphName)
                },
                all:this.Utilities.getDefaultList(Glossary,subsectionrow.property.paragraph),
                helplink:helplink,
                link:subsectionrow.property,
                glossary:Glossary,
                onchange:function(value){
                    console.log('ProjectStageTool::getParagraph()');
                    var toggle = ['listControl','list','indentation'];
                    /* TO DO -> indetation -> SET TO INPUT BLOCK ? */
                    console.log(this.link);
                    console.log(this.helplink);
                    console.log(value);
                    this.link['paragraph'] = value;
                    for(const prop in this.glossary){
                            console.log(this.glossary[prop]);
                            if(this.glossary[prop].v===value){
                                console.log('FOUND');
                                this.link['paragraphName'] = this.glossary[prop].n;
                                break;
                            }
                    }
                    if(value==='l'){
                        /* l - list - show list tool */
                        for(const prop in toggle){
                            //console.log(run.tool[prop]);
                            if (this.helplink.tool[toggle[prop]].style.display){
                                this.helplink.tool[toggle[prop]].style.removeProperty('display');
                            }
                        }
                    }
                    else{
                        /* p  - paragraph - hide list tool */
                        for(const prop in toggle){
                            //console.log(run.tool[prop]);
                            this.helplink.tool[toggle[prop]].style.setProperty('display', 'none');
                        }
                    }
                },                   
                type:'select',
                attributes:{
                    class:'w-100'
                }
            }
        };
        return  this.Tool.create('Typ:',data);
    }
    getTool(row,helplink,key){
        return {
            0:{
                link:row,
                helplink:helplink,
                key:key,
                type:'select',
                attributes:{
                    class:'w-100'
                }
            }    
        };
    }
    getSimpleTool(row,helplink,key){
        var tool = this.getTool(row,helplink,key);
            /*Anonymous Functions*/
            tool[0]['onchange']=function(value){
                console.log('ProjectStageTool::getSimpleTool');
                console.log(value);
                console.log(this.link);
                console.log(this.helplink);
                console.log(this.key);
                /* SET PROPERTY KEY */
                this.link[this.key]=value;
                /* SET INPUT STYLE PROPERTY */
                this.helplink.style[this.key]=value;
            };
        return tool;
    }
    getExtendedTool(row,helplink,key,glossary){
        var tool = this.getTool(row,helplink,key);
            /*Anonymous Functions*/
            tool[0]['glossary']=glossary;
            tool[0]['onchange']=function(value){
                console.log('ProjectStageTool::getSimpleTool');
                console.log(value);
                console.log(this.link);
                console.log(this.helplink);
                console.log(this.key);
                /* SET PROPERTY KEY */
                this.link[this.key[0]]=value;
                /* SET INPUT STYLE PROPERTY */
                this.helplink.style[this.key[0]]=value;
                console.log(this.glossary);
                for(const prop in this.glossary){
                    console.log(this.glossary[prop]);
                    if(this.glossary[prop].v===value){
                        console.log('FOUND');
                        this.link[this.key[1]] = this.glossary[prop].n;
                        break;
                    }
                }
            };
        return tool;
    }
    getExtendedOption(value,title,color,backgroundcolor,fontFamily){
        var option=this.Utilities.getDefaultOptionProperties(value,title);
            option.color=color;
            option.backgroundcolor=backgroundcolor;
            option.fontFamily=fontFamily;
        return option;
    }
    getFontFamily(rowStyle,inputEle){
        console.log('ProjectStageTool::getFontFamily()');
        console.log(rowStyle);
        console.log(inputEle);
        var defaultFont={
                0:this.Utilities.getDefaultOptionProperties(rowStyle.fontFamily,rowStyle.fontFamily)
            };
            defaultFont[0].fontFamily=rowStyle.fontFamily;
        var all = {};
            for(var i=0;i<this.Glossary.text.getKeyCount('fontFamily');i++){
                if(this.Glossary.text.getKeyPropertyAttribute('fontFamily',i,'v')!==rowStyle.fontFamily){
                    all[i]=this.getExtendedOption(this.Glossary.text.getKeyPropertyAttribute('fontFamily',i,'v'),this.Glossary.text.getKeyPropertyAttribute('fontFamily',i,'v'),'#000000','#FFFFFF',this.Glossary.text.getKeyPropertyAttribute('fontFamily',i,'v'));
                }
            }
        var data=this.getSimpleTool(rowStyle,inputEle,'fontFamily');
            data[0]['default']=defaultFont;
            data[0]['all']=all;  
        return  this.Tool.create('Czcionka:',data);
    }
    getBackgroundColor(title,rowStyle,inputEle){
        console.log('ProjectStageTool::getBackgroundColor()');
        var defaultBackgroundColor={
                0:this.Utilities.getDefaultOptionProperties(rowStyle.backgroundColor,rowStyle.backgroundColorName)
            };
            defaultBackgroundColor[0].backgroundcolor=rowStyle.backgroundColor;
        var all = {};
            for(var i=0;i<this.Glossary.text.getKeyCount('color');i++){
                if(this.Glossary.text.getKeyPropertyAttribute('color',i,'v')!==rowStyle.backgroundColor){
                    all[i]=this.getExtendedOption(this.Glossary.text.getKeyPropertyAttribute('color',i,'v'),this.Glossary.text.getKeyPropertyAttribute('color',i,'n'),'#FFFFFF',this.Glossary.text.getKeyPropertyAttribute('color',i,'v'),'');
                }
            }   
        var data=this.getExtendedTool(rowStyle,inputEle,['backgroundColor','backgroundColorName'],this.Glossary.text.item.color);
            data[0]['default']=defaultBackgroundColor;
            data[0]['all']=all;  
        return  this.Tool.create(title,data);
    }
}

