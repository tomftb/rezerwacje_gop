class ProjectStageTool{
    
    Tool = new Object();
    Utilities = new Object()
    Glossary = new Object();
    
    constructor(Stage){
        this.Utilities = Stage.Utilities;
        this.Glossary = Stage.Glossary;
        this.Tool = new Tool();
    }
    getIndentation(property,ele){
        console.log('ProjectStageTool::getIndentation()');
        /*
         * property - reference for example subsectionrow.paragraph.style
         * ele - reference for example helplink
         */  
        var data={
            0:{
                default:{
                    0:this.Utilities.getDefaultOptionProperties(property['indentationSpecial'],property['indentationSpecialName'])
                },
                all:this.Utilities.getDefaultList(this.Glossary.text.item.indentationSpecial,property['indentationSpecial']),
                property:property,
                glossary:this.Glossary.text,
                /* Anonymous Function */
                onchange:function(value){
                        this.property['indentationSpecial'] = value;
                        this.property['indentationSpecialName'] = this.glossary.getItemName('indentationSpecial',value);
                },
                type:'select',
                attributes:{
                    class:'w-50'
                }
            },
            1:{
                property:property,
                value:property.indentation,
                onchange:function(value){
                    this.property['indentation'] = value;
                },
                type:'input',
                attributes:{
                    class:'w-25',
                    type:'number'
                }
            },   
            2:{
                default:{
                    0:this.Utilities.getDefaultOptionProperties(property['indentationMeasurement'],property['indentationMeasurement'])
                },
                all:this.Utilities.getDefaultList(this.Glossary.text.item.listMeasurement,property['indentationMeasurement']),
                property:property,
                /* Anonymous Function */
                onchange:function(value){
                    this.property['indentationMeasurement'] = value;
                },
                type:'select',
                attributes:{
                    class:'w-25'
                }
            }
        };
        var tool = this.Tool.create('Specjalne:',data);
            ele.tool['indentation'] = tool;
        return  tool;
    }
    getEjection(property,keys,title){
        //console.log('ProjectStageTool::getEjection()');
        /*
         * property - reference for example subsectionrow.paragraph.style
         */
        var data={
            0:{
                property:property,
                value:property[keys[0]],
                /* VALUE */
                key:keys[0],
                onchange:function(value){
                    this.property[this.key] = value;
                },
                type:'input',
                attributes:{
                    class:'w-75',
                    type:'number'
                }
            },
            1:{
                default:{
                    0:this.Utilities.getDefaultOptionProperties(property[keys[1]],property[keys[1]])
                },
                all:this.Utilities.getDefaultList(this.Glossary.text.item.listMeasurement,property[keys[1]]),
                key:keys[1],
                property:property,
                onchange:function(value){
                        this.property[this.key] = value;
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
    getRightEjection(property,ele){
        console.log('ProjectStageTool::getRightEjection()');
        /*
         * property - reference for example subsectionrow.paragraph.style
         * ele - references for example helplink.text
         */
        var tool = this.getEjection(property,['rightEjection','rightEjectionMeasurement'],'Wcięcie z prawej strony:');
        /* SET HELPLINK */
            ele.rightEjection=tool.childNodes[1].childNodes[0];
        return tool;
    }
    getLeftEjection(property,ele){
        console.log('ProjectStageTool::getLeftEjection()');
        /*
         * property - reference for example subsectionrow.paragraph.style
         * ele - references for example helplink.text
         */
        var tool = this.getEjection(property,['leftEjection','leftEjectionMeasurement'],'Wcięcie z lewej strony:');
        /* SET HELPLINK */
            ele.leftEjection=tool.childNodes[1].childNodes[0];
        return tool;
    }
    getParagraph(property,ele){
        console.log('ProjectStageTool::getParagraph()');
        /*
         * property - reference for example subsectionrow.paragraph.property
         * ele - references for example helplink.tool
         */
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
                    0:this.Utilities.getDefaultOptionProperties(property['paragraph'],property['paragraphName'])
                },
                all:this.Utilities.getDefaultList(Glossary,property['paragraph']),
                ele:ele,
                property:property,
                glossary:Glossary,
                onchange:function(value){
                    var toggle = ['listControl','list','indentation'];
                    /* TO DO -> indetation -> SET TO INPUT BLOCK ? */
                    this.property['paragraph'] = value;
                    for(const prop in this.glossary){
                            if(this.glossary[prop].v===value){
                                this.property['paragraphName'] = this.glossary[prop].n;
                                break;
                            }
                    }
                    if(value==='l'){
                        /* l - list - show list tool */
                        for(const prop in toggle){
                            //console.log(run.tool[prop]);
                            if (this.ele[toggle[prop]].style.display){
                                this.ele[toggle[prop]].style.removeProperty('display');
                            }
                        }
                    }
                    else{
                        /* p  - paragraph - hide list tool */
                        for(const prop in toggle){
                            //console.log(run.tool[prop]);
                            this.ele[toggle[prop]].style.setProperty('display', 'none');
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
    getTool(property,key){
        return {
            0:{
                property:property,
                key:key,
                type:'select',
                attributes:{
                    class:'w-100'
                }
            }    
        };
    }
    getBasicTool(property,key){
        /*
         * property - reference to property
         */
        var tool = this.getTool(property,key);
            /* Anonymous Function */
            tool[0]['onchange']=function(value){
                /* SET PROPERTY KEY VALUE */
                this.property[this.key]=value;
            };
        return tool;
    }
    getAdvancedTool(property,key,ele){
        /*
         * property - reference to property
         * ele - reference to element
         */
        var tool = this.getTool(property,key);
            /* SET ELEMENT */
            tool[0]['ele']=ele;
            /* Anonymous Function */
            tool[0]['onchange']=function(value){
                /* SET PROPERTY KEY VALUE */
                this.property[this.key]=value;
                /* SET INPUT STYLE PROPERTY */
                this.ele.style[this.key]=value;
            };
        return tool;
    }
    getExtendedTool(property,key,glossary,item){
        /*
         * property - reference to property
         */
        var tool = this.getTool(property,key);
            /* SET GLOSSARY */
            tool[0]['glossary']=glossary;
            /* Anonymous Function */
            tool[0]['onchange']=function(value){
                console.log('ProjectStageTool::getExtendedTool()');
                /* SET PROPERTY KEY VALUE */
                this.property[this.key[0]]=value;
                /* SET SECOND PROPERTY KEY VALUE */
                this.property[this.key[1]] = this.glossary.getItemName(item,value);
            };
        return tool;
    }/* COMPLEX */
    getCompleteTool(property,key,ele,glossary,item){
         /*
         * property - reference to property
         * ele - reference to element
         */
        var tool = this.getTool(property,key);
            /* SET ELE */
            tool[0]['ele']=ele;
            /* SET GLOSSARY */
            tool[0]['glossary']=glossary;
            tool[0]['item']=item;
            /* Anonymous Function */
            tool[0]['onchange']=function(value){
                console.log('ProjectStageTool::getCompleteTool()');
                /* SET PROPERTY KEY VALUE */
                this.property[this.key[0]]=value;
                /* SET INPUT STYLE PROPERTY */
                this.ele.style[this.key[0]]=value;
                /* SET SECOND PROPERTY KEY VALUE */
                this.property[this.key[1]] = this.glossary.getItemName(item,value);
            };
        return tool;
    }
    getColorExtendedOption(value,title,color,backgroundColor,fontFamily){
        return this.getExtendedOption(value,title,backgroundColor,color,fontFamily);
    }
    getExtendedOption(value,title,color,backgroundColor,fontFamily){
        var option=this.Utilities.getDefaultOptionProperties(value,title);
            option.color=color;
            option.backgroundColor=backgroundColor;
            option.fontFamily=fontFamily;
        return option;
    }
    getFontFamily(property,ele){
        console.log('ProjectStageTool::getFontFamily()');
        var all = {};
            for(var i=0;i<this.Glossary.text.getKeyCount('fontFamily');i++){
                if(this.Glossary.text.getKeyPropertyAttribute('fontFamily',i,'v')===property['fontFamily']){
                    continue;
                }
                let v = this.Glossary.text.getKeyPropertyAttribute('fontFamily',i,'v');
                /* OPTION: value,title,color,backgroundColor,fontFamily */
                all[i]=this.getExtendedOption(v,v,'#000000','#FFFFFF',v);
            }
        var data=this.getAdvancedTool(property,'fontFamily',ele);
            data[0]['default']=this.getDefaultOption(property,'fontFamily','fontFamily');
            data[0]['all']=all;  
        return  this.Tool.create('Czcionka:',data);
    }
    setColorProperty(data,property,key,run){
        console.log('ProjectStageTool::setColorProperty()');
        var self = this;
        var all = {};
            for(var i=0;i<this.Glossary.text.getKeyCount('color');i++){
                if(this.Glossary.text.getKeyPropertyAttribute('color',i,'v')===property[key[0]]){
                    continue;/* SKIP */
                }
                let color = this.Glossary.text.getKeyPropertyAttribute('color',i,'v');
                let backgroundColor = '#FFFFFF';
                all[i]=run(self,color,this.Glossary.text.getKeyPropertyAttribute('color',i,'n'),color,backgroundColor,'');
            }; 
        data[0]['default']=this.getDefaultOption(property,key[0],key[1]);
        data[0]['all']=all;  
    }
    getSimpleBackgroundColor(title,property){
        console.log('ProjectStageTool::getSimpleBackgroundColor()');
        var key = ['backgroundColor','backgroundColorName'];
        var data=this.getExtendedTool(property,key,this.Glossary.text,'color');
        var run = function(self,value,title,color,backgroundColor,fontFamily){
            return self.getExtendedOption(value,title,backgroundColor,color,fontFamily);
        };
        this.setColorProperty(data,property,key,run);   
        return  this.Tool.create(title,data);
    }
    getExtendedBackgroundColor(title,property,ele){
        console.log('ProjectStageTool::getExtendedBackgroundColor()');
        /*
         * property - reference to property
         * ele - reference to element
         */
        var key = ['backgroundColor','backgroundColorName'];
        var data=this.getCompleteTool(property,key,ele,this.Glossary.text,'color');    
        var run = function(self,value,title,color,backgroundColor,fontFamily){
            return self.getExtendedOption(value,title,backgroundColor,color,fontFamily);
        };
        this.setColorProperty(data,property,key,run);   
        return  this.Tool.create(title,data);
    }
    getColor(title,property,ele){
        console.log('ProjectStageTool::getColor()');
        /*
         * property - reference to property
         * ele - reference to element
         */
        var key = ['color','colorName'];
        var data=this.getCompleteTool(property,key,ele,this.Glossary.text,'color');     
        var run = function(self,value,title,color,backgroundColor,fontFamily){
            return self.getExtendedOption(value,title,color,backgroundColor,fontFamily);
        };
        this.setColorProperty(data,property,key,run);
        return  this.Tool.create(title,data);
    }
    getTextAlign(property,ele){
        console.log('ProjectStageTool::getTextAlign()');
        var all = {};
            for(var i=0;i<this.Glossary.text.getKeyCount('textAlign');i++){
                
                if(this.Glossary.text.getKeyPropertyAttribute('textAlign',i,'v')===property['textAlign']){
                    continue;
                }
                /* OPTION: value,title,color,backgroundColor,fontFamily */
                all[i]=this.getExtendedOption(this.Glossary.text.getKeyPropertyAttribute('textAlign',i,'v'),this.Glossary.text.getKeyPropertyAttribute('textAlign',i,'n'),'#000000','#FFFFFF','');
            }
        var data=this.getAdvancedTool(property,'textAlign',ele);
            data[0]['default']=this.getDefaultOption(property,'textAlign','textAlignName');
            data[0]['all']=all;  
        return  this.Tool.create('Wyrównanie:',data);
    }
    getFontSize(property){
        /* console.log('ProjectStageTool::getFontSize()'); */
        /*
         * property - reference for example subsectionrow.paragraph.style
         * ele - references for example helplink.text
         */
        var key=['fontSize','fontSizeMeasurement'];
        var data={
            0:{
                default:{
                    0:this.Utilities.getDefaultOptionProperties(property['fontSize'],property['fontSize'])
                },
                all:this.getFontSizeList(property['fontSize'],75),
                key:key,
                property:property,
                type:'select',
                attributes:{
                    class:'w-75'
                }
            },
            1:{
                default:{
                    0:this.Utilities.getDefaultOptionProperties(property['fontSizeMeasurement'],property['fontSizeMeasurement'])
                },
                all:this.Utilities.getDefaultList(this.Glossary.text.item.measurement,property['fontSizeMeasurement']),
                key:key,
                property:property,
                onchange:function(value){
                    this.property[this.key[1]] = value;
                    this.ele.style[key[0]]=this.property[key[0]]+value;
                },
                type:'select',
                attributes:{
                    class:'w-25'
                }
            }
        };
        /* TO DO 
        size max
        size min               
        */
        return data;     
    }
    getSimpleFontSize(property){
        var data = this.getFontSize(property);
            data[0]['onchange']=function(value){
                this.property[this.key[0]] = value; 
            };
            data[1]['onchange']=function(value){
                this.property[this.key[1]] = value;
            }; 
        return this.Tool.create('Rozmiar tekstu:',data);
    }
    getExtendedFontSize(property,ele){
        var data = this.getFontSize(property);
            data[0]['ele']=ele;
            data[0]['onchange']=function(value){
                this.property[this.key[0]] = value;
                this.ele.style[this.key[0]]=value+this.property[this.key[1]];
            };
            data[1]['ele']=ele;
            data[1]['onchange']=function(value){
                this.property[this.key[1]] = value;
                this.ele.style[this.key[0]]=this.property[this.key[0]]+value;
            }; 
        return this.Tool.create('Rozmiar tekstu:',data);
    }
    getDefaultOption(property,value,name){
        var d={
                0:this.Utilities.getDefaultOptionProperties(property[value],property[name])
            };
            /* SET OPTION STYLE PROPERTY */
        d[0][value]=property[value];
        return d;
    }
    getFontSizeList(exception,max){
        exception=parseInt(exception,10);
        max=parseInt(max,10);
        var value={};
        for(var i=2;i<max+1;){
            if(i!==exception){
                value[i]=this.Utilities.getDefaultOptionProperties(i,i);  
            }
            i=i+2;
        }
        return value;
    }
}