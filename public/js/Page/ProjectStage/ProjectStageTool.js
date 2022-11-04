class ProjectStageTool{
    
    Tool = new Object();
    Utilities = new Object()
    Glossary = new Object();
    Html = new Object();
    Modal=new Object();
    Stage = new Object();   
    ErrorStack = new Object();
    router='';
    appUrl='';
    constructor(){

    }
    setReportParent(Parent){
        try{
            //console.log('ProjectStageTool.setReportParent()');
            this.Utilities=Parent.Utilities;
            this.Glossary=Parent.Glossary;
            this.Tool=Parent.Tool;
            this.Modal=Parent.Modal;
            this.router=Parent.router;
            this.appUrl=Parent.appUrl;
            //console.log(this);  
        }
        catch(e){
            console.log(e);
            throw 'An Application Error Has Occurred!';
        };
    }
    setParent(Parent){
        try{
            this.router=Parent.router;
            this.appUrl=Parent.appUrl;
            this.Utilities = Parent.Utilities;
            this.Glossary = Parent.Glossary;
            this.Html = Parent.Html;
            this.Modal=Parent.Modal;
            this.Tool = new Tool(Parent.Html);
            this.Stage = Parent;
            this.ErrorStack = Parent.ErrorStack;  
        }
        catch(e){
            console.log(e);
            throw 'An Application Error Has Occurred!';
        }; 
    }
    getAllOptions(Glossary,property,key,run){
        //console.log('ProjectStageTool::getAllOptions()');
        var all = {}; 
        for(var i=0;i<Glossary.getKeyCount(key);i++){
            if(Glossary.getKeyPropertyAttribute(key,i,'v')===property){//property[key]
                continue;
            }
            all[i]=run(this,Glossary,key,i);
        };
        return all;
    }
    getIndentation(property,ele){
        //console.log('ProjectStageTool::getIndentation()');
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
                onchange:function(t){
                    /* t - this */
                    this.property['indentationSpecial'] = t.value;
                    this.property['indentationSpecialName'] = this.glossary.getItemName('indentationSpecial',t.value);
                },
                type:'select',
                attributes:{
                    class:'w-50'
                }
            },
            1:{
                property:property,
                value:property.indentation,
                onchange:function(t){
                    /* t - this */
                    this.property['indentation'] = t.value;
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
                onchange:function(t){
                    /* t - this */
                    this.property['indentationMeasurement'] = t.value;
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
                onchange:function(t){
                    /* t - this */
                    this.property[this.key] = t.value;
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
                onchange:function(t){
                    /* t - this */
                    this.property[this.key] = t.value;
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
        var Tool = this.Tool.create(title,data);
        var run=function(value){
            Tool.childNodes[1].childNodes[0].value=value;
            property[keys[0]] = value;
        };
        this.setDropDown(Tool,run);     
        return Tool;
    }
    getRightEjection(property,ele){
        //console.log('ProjectStageTool::getRightEjection()');
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
        //console.log('ProjectStageTool::getLeftEjection()');
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
        //console.log('ProjectStageTool::getParagraph()');
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
                onchange:function(t){
                    /* t - this */
                    var toggle = ['listControl','list','indentation'];
                    /* TO DO -> indetation -> SET TO INPUT BLOCK ? */
                    this.property['paragraph'] = t.value;
                    for(const prop in this.glossary){
                            if(this.glossary[prop].v===t.value){
                                this.property['paragraphName'] = this.glossary[prop].n;
                                break;
                            }
                    }
                    if(t.value==='l'){
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
            tool[0]['onchange']=function(t){
                /* t - this */
                /* SET PROPERTY KEY VALUE */
                this.property[this.key]=t.value;
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
            tool[0]['onchange']=function(t){
                /* t -this */
                /* SET PROPERTY KEY VALUE */
                this.property[this.key]=t.value;
                /* SET INPUT STYLE PROPERTY */
                this.ele.style[this.key]=t.value;
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
            tool[0]['onchange']=function(t){
                /* t - this */
                //console.log('ProjectStageTool::getExtendedTool()');
               // console.log('BEFORE:');
                //console.log(property);
                //console.log(key);
                /* SET PROPERTY KEY VALUE */
                this.property[this.key[0]]=t.value;
                /* SET SECOND PROPERTY KEY VALUE */
                this.property[this.key[1]] = this.glossary.getItemName(item,t.value);
                //console.log('AFTER:');
                //console.log(this.property[this.key[0]]);
                //console.log(this.property[this.key[1]]);
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
            tool[0]['onchange']=function(t){
                /* t - this */
                //console.log('ProjectStageTool::getCompleteTool()');
                //console.log(property);
                //console.log(key);
                //console.log(ele);
                /* SET PROPERTY KEY VALUE */
                this.property[this.key[0]]=t.value;
                /* SET INPUT STYLE PROPERTY */
                this.ele.style[this.key[0]]=t.value;
                /* SET SECOND PROPERTY KEY VALUE */
                this.property[this.key[1]] = this.glossary.getItemName(item,t.value);
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
    setColorProperty(data,property,key,run){
        //console.log('ProjectStageTool::setColorProperty()');
        data[0]['default']=this.getDefaultOption(property,key[0],key[1]);
        data[0]['all']=this.getAllOptions(this.Glossary.text,property.color,'color',run); 
    }
    getBackgroundColor(property,key,data){
        var run = function(self,Glossary,key,i){
            let v = Glossary.getKeyPropertyAttribute(key,i,'v'); 
            return self.getExtendedOption(v,self.Glossary.text.getKeyPropertyAttribute(key,i,'n'),'#FFFFFF',v,'');
        };
        this.setColorProperty(data,property,key,run);   
        return this.Tool.create('Kolor tła:',data);
    }
    getSimpleBackgroundColor(property){
        /* console.log('ProjectStageTool::getSimpleBackgroundColor()'); */
        var key = ['backgroundColor','backgroundColorName'];
        return  this.getBackgroundColor(property,key,this.getExtendedTool(property,key,this.Glossary.text,'color'));
    }
    getExtendedBackgroundColor(property,ele){
        /* console.log('ProjectStageTool::getExtendedBackgroundColor()'); */
        /*
         * property - reference to property
         * ele - reference to element
         */
        var key = ['backgroundColor','backgroundColorName'];
        return this.getBackgroundColor(property,key,this.getCompleteTool(property,key,ele,this.Glossary.text,'color'));
    }
    getSimpleColor(property){
        //console.log('ProjectStageTool::getSimpleColor()');
        /*
         * property - reference to property
         */
        var key = ['color','colorName'];
        var data=this.getExtendedTool(property,key,this.Glossary.text,'color');     
        var run = function(self,Glossary,key,i){
            let v = Glossary.getKeyPropertyAttribute(key,i,'v');
            return self.getExtendedOption(v,self.Glossary.text.getKeyPropertyAttribute(key,i,'n'),v,'#FFFFFF','');
        };
        this.setColorProperty(data,property,key,run);
        return  this.Tool.create('Kolor tekstu:',data);
    }
    getExtendedColor(property,ele){
        //console.log('ProjectStageTool::getExtendedColor()');
        /*
         * property - reference to property
         */
        var key = ['color','colorName'];
        var data=this.getCompleteTool(property,key,ele,this.Glossary.text,'color');     
        var run = function(self,Glossary,key,i){
            let v = Glossary.getKeyPropertyAttribute(key,i,'v');
            return self.getExtendedOption(v,self.Glossary.text.getKeyPropertyAttribute(key,i,'n'),v,'#FFFFFF','');
        };
        this.setColorProperty(data,property,key,run);
        return  this.Tool.create('Kolor tekstu:',data);
    }
    getSimpleAlign(property,propertyKey){
        //console.log('ProjectStageTool::getSimpleAlign()');
        //console.log(this.Glossary.text);
        var run = this.getAlign();
        var data=this.getExtendedTool(property,propertyKey,this.Glossary.text,'textAlign');
            data[0]['default']=this.getDefaultOption(property,propertyKey[0],propertyKey[1]);
            data[0]['all']=this.getAllOptions(this.Glossary.text,property[propertyKey[0]],'textAlign',run);  
        return  this.Tool.create('Wyrównanie:',data);
    }
    getSimpleOrder(property,propertyKey){
        //console.log('ProjectStageTool::getSimpleOrder()');
        //console.log(this.Glossary.text);
        var run = this.getOrder();
        var data=this.getExtendedTool(property,propertyKey,this.Glossary.image,'order');
            data[0]['default']=this.getDefaultOption(property,propertyKey[0],propertyKey[1]);
            data[0]['all']=this.getAllOptions(this.Glossary.image,property[propertyKey[0]],'order',run);  
        return  this.Tool.create('Kolejność:',data);
    }
    getExtendedAlign(property,propertyKey,ele){
        //console.log('ProjectStageTool::getExtendedAlign()');
        var run = this.getAlign();
        //var data=this.getAdvancedTool(property,key[0],ele);
        var data=this.getCompleteTool(property,propertyKey,ele,this.Glossary.text,'textAlign');
            data[0]['default']=this.getDefaultOption(property,propertyKey[0],propertyKey[1]);
            data[0]['all']=this.getAllOptions(this.Glossary.text,property[propertyKey[0]],propertyKey[0],run);  
        return  this.Tool.create('Wyrównanie:',data);
    }
    getAlign(){
        //console.log('ProjectStageTool::getAlign()');
        var run = function(self,Glossary,key,i){
            return self.getExtendedOption(Glossary.getKeyPropertyAttribute(key,i,'v'),Glossary.getKeyPropertyAttribute(key,i,'n'),'#000000','#FFFFFF','');  
        };
        return run;
    }
    getOrder(){
        //console.log('ProjectStageTool::getOrder()');
        var run = function(self,Glossary,key,i){
            return self.getExtendedOption(Glossary.getKeyPropertyAttribute(key,i,'v'),Glossary.getKeyPropertyAttribute(key,i,'n'),'#000000','#FFFFFF','');  
        };
        return run;
    }
    getListType(property){     
        var run = function(self,Glossary,key,i){
            return self.Utilities.getDefaultOptionProperties(Glossary.getKeyPropertyAttribute(key,i,'v'),Glossary.getKeyPropertyAttribute(key,i,'n'));
        };
        var key=['listType','listTypeName'];
        var data=this.getExtendedTool(property,key,this.Glossary.list,key[0]);
            data[0]['default']=this.getDefaultOption(property,key[0],key[1]);
            data[0]['all']=this.getAllOptions(this.Glossary.list,property[key[0]],key[0],run);  
            
        return  this.Tool.create('Typ listy:',data); 
    }
    getListLevel(property,ele){
        //console.log('ProjectStageTool::getListLevel()');
        var multiplier = parseFloat(this.Glossary.list.item.parameter.STAGE_LIST_MULTIPLIER.v);
        var key = ['listLevel','listLevelName'];
        var data=this.getTool(property,key);
            data[0]['default']=this.getDefaultOption(property.list.property,key[0],key[1]);
            data[0]['property']=property;
            data[0]['ele']=ele;
            data[0]['multiplier']=multiplier;
            data[0]['onchange']= function(t){
                /* t - this */
                 /* SET NEW VALUE */
                var newValue = parseInt(t.value)*this.multiplier;
                    property.list.property['listLevel']=t.value;
                    property.paragraph.style['leftEjection']=newValue;
                    /* HELPLINK */
                    ele.text.leftEjection.value=newValue;
            };
            data[0]['all']=this.getListLevelList(property.list.property.listLevel,property.list.property.listLevelMax); 
        return  this.Tool.create('Poziom listy (mnożnik - '+multiplier.toString()+'):',data); 
    }
    getListLevelList(exception,max){
        exception=parseInt(exception,10);
        max=parseInt(max,10);
        var value={};
        for(var i=1;i<max+1;i++){
            if(i!==exception){
                value[i]=this.Utilities.getDefaultOptionProperties(i,i);  
            }
        }
        return value;
    }
    getNewList(property){
        //console.log('ProjectStageTool::getNewList()');
        var all={
            0:{
                v:'y',
                n:'Nowa lista'
            },
            1:{
                v:'n',
                n:'Kontynuacja'
            }
        };
        var key = ['newList','newListName'];
        var data=this.getTool(property,key);
            data[0]['default']=this.getDefaultOption(property,key[0],key[1]);
            data[0]['property']=property;
            data[0]['glossary']=all;
            data[0]['onchange']= function(t){
                /* t - this */
                    this.property[this.key[0]]=t.value;
                    for(const prop in this.Glossary){
                        if(this.glossary[prop].v===t.value){
                            this.property[this.key[1]]=this.Glossary[prop].n;
                            break;
                        };
                    };    
                    //console.log(this.property);
            };
            data[0]['all']=this.getNewElementList(all,property.newList); 
        return  this.Tool.create('Nowa Lista:',data); 
    }
    getNewElementList(data,exception){
        var list={};        
        for(var i=0;i<Object.keys(data).length;i++){
            if(data[i].v!==exception){
                list[i]=this.Utilities.getDefaultOptionProperties(data[i].v,data[i].n);
            }
        }
        return list;
    }
    getFontFamily(property){
        //console.log('ProjectStageTool::getFontFamily()');
        var run = function(self,Glossary,key,i){
            let v = Glossary.getKeyPropertyAttribute(key,i,'v');
            return self.getExtendedOption(v,v,'#000000','#FFFFFF',v);  
        };
        var data=this.getTool(property,'fontFamily');
            data[0]['default']=this.getDefaultOption(property,'fontFamily','fontFamily');
            data[0]['all']=this.getAllOptions(this.Glossary.text,property.fontFamily,'fontFamily',run);  
        return  data;
    }
    getSimpleFontFamily(property){
        var data = this.getFontFamily(property);
            data[0]['onchange']=function(t){
                /* t - this */
                this.property[this.key] = t.value; 
            };
        return this.Tool.create('Czcionka:',data);
    }
    getExtendedFontFamily(property,ele){
        var data = this.getFontFamily(property);
            data[0]['ele']=ele;
            data[0]['onchange']=function(t){
                /* t - this */
                this.property[this.key] = t.value; 
                this.ele.style[this.key] = t.value;
            };
        return this.Tool.create('Czcionka:',data);
    }
    getSizeMeasurement(property,k){
        return {
                key:k,
                default:{
                    0:this.Utilities.getDefaultOptionProperties(property[k[1]],property[k[1]])
                },
                all:this.Utilities.getDefaultList(this.Glossary.text.item.measurement,property[k[1]]),
                property:property,
                onchange:function(t){
                    /* t - short this */
                    this.property[this.key[1]] = t.value;
                    this.ele.style[this.key[0]]=this.property[this.key[0]]+t.value;
                },
                type:'select',
                attributes:{
                    class:'w-25'
                }
            };
    }
    getInputSize(property,k){
       /* console.log('ProjectStageTool::getSelectSize()'); */
        /*
         * property - reference for example subsectionrow.paragraph.style
         * k (key) - example ['fontSize','fontSizeMeasurement']
         */ 
        var data={
            /* FIRST ELE PROPERTY */
            0:{
                key:k,   
                value:property[k[0]],
                property:property,
                type:'input',
                attributes:{
                    class:'w-75',
                    type:'number'
                }
            },
            /* SECOND ELE PROPERTY */
            1:this.getSizeMeasurement(property,k)
        };
        /* TO DO 
        size max
        size min               
        */
        return data;  
    }
    getInputSizeWithSelect(property,k){
        //console.log('ProjectStageTool.getInputSizeWithSelect()'); 
        var data={
            /* FIRST ELE PROPERTY */
            0:{
                key:k,     
                value:property[k[0]],
                property:property,
                type:'input',
                attributes:{
                    class:'w-75',
                    type:'number'
                }
            },
            /* SECOND ELE PROPERTY */
            1:this.getSizeMeasurement(property,k)
        };
        /* TO DO 
        size max
        size min               
        */
        return data; 
    }
    getSelectSize(property,k){
        /* console.log('ProjectStageTool::getSelectSize()'); */
        /*
         * property - reference for example subsectionrow.paragraph.style
         * ele - references for example helplink.text
         * k (key) - example ['fontSize','fontSizeMeasurement']
         */
        //var k=['fontSize','fontSizeMeasurement'];
        var data={
            /* FIRST ELE PROPERTY */
            0:{
                key:k,
                default:{
                    0:this.Utilities.getDefaultOptionProperties(property[k[0]],property[k[0]])
                },
                all:this.getSizeList(property[k[0]],75),
                property:property,
                type:'select',
                attributes:{
                    class:'w-75'
                }
            },
            /* SECOND ELE PROPERTY */
            1:this.getSizeMeasurement(property,k)
        };
        /* TO DO 
        size max
        size min               
        */
        return data;     
    }
    getSimpleInputSize(property,propertyKey,title){
        var data = this.getInputSize(property,propertyKey);//['fontSize','fontSizeMeasurement']
            data[0]['value']=property[propertyKey[0]];
            data[0]['onchange']=function(t){
                /* t - this */
                this.property[this.key[0]] = t.value; 
            };
            data[1]['onchange']=function(t){
                /* t - this */
                this.property[this.key[1]] = t.value;
            }; 
        return this.Tool.create(title,data);
    }
    getSimpleSize(property){
        var data = this.getInputSizeWithSelect(property,['fontSize','fontSizeMeasurement']);
        //var data = this.getSelectSize(property,['fontSize','fontSizeMeasurement']);
            data[0]['onclick']=function(t){
                //console.log('ProjectStageTool.getSimpleSize().onclick()');
                //console.log(t);
                //console.log(t.value);
            };
            data[0]['onchange']=function(t){
                /* t - this */
                this.property[this.key[0]] = t.value; 
            };
            data[1]['onchange']=function(t){
                /* t - this */
                this.property[this.key[1]] = t.value;
            }; 
        var run=function(value){
            Tool.childNodes[1].childNodes[0].value=value;
            property['fontSize'] = value;
        };
        var Tool = this.Tool.create('Rozmiar tekstu:',data);
            this.setDropDown(Tool,run);     
        return Tool;
    }
    getParagraphSize(property,ele){
        var prop={
            key:['fontSize','fontSizeMeasurement'],
            title:'Rozmiar tekstu:'
        };
        return this.getExtendedSize(property,ele,prop);
    }
    getParagraphSpaceBefore(property,ele){
        //console.log(property);
        //console.log(ele);
        var prop={
            key:['spaceBefore','spaceBeforeMeasurement'],
            title:'Odstęp przed:'
        };
        return this.getExtendedSize(property,ele,prop);
    }
    getParagraphSpaceAfter(property,ele){
        var prop={
            key:['spaceAfter','spaceAfterMeasurement'],
            title:'Odstęp po:'
        };
        return this.getExtendedSize(property,ele,prop);
    }
    getExtendedSize(property,ele,prop){
        var data = this.getInputSizeWithSelect(property,prop.key);
            data[0]['ele']=ele;
            data[0]['onclick']=function(t){                
                this.property[this.key[0]] = t.value;
                this.ele.style[this.key[0]]=t.value+this.property[this.key[1]];
            };
            data[0]['onchange']=function(t){
                /* t - this */
                this.property[this.key[0]] = t.value;
                this.ele.style[this.key[0]]=t.value+this.property[this.key[1]];
            };
            data[1]['ele']=ele;
            data[1]['onchange']=function(t){
                /* t - this */
                this.property[this.key[1]] = t.value;
                this.ele.style[this.key[0]]=this.property[this.key[0]]+t.value;
            }; 
            
            var Tool=this.Tool.create(prop.title,data);
            
        var run=function(value){
            Tool.childNodes[1].childNodes[0].value=value;
            property[prop.key[0]] = value;
            ele.style.fontSize=value+property[prop.key[1]];
        };
            this.setDropDown(Tool,run);     
        return Tool;
    }
    getDefaultOption(property,value,name){
        var d={
                0:this.Utilities.getDefaultOptionProperties(property[value],property[name])
            };
            /* SET OPTION STYLE PROPERTY */
        d[0][value]=property[value];
        return d;
    }
    getSizeList(exception,max){
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
    getClearSizeList(min,max){
        var sizeList=new Array();
        for(var i=min;i<max+1;){
            sizeList.push(i);
            i=i+2;
        };
        return sizeList;
    }
    getTabStop(TabStopRef,isection,isub,isubrow,subsectionrow,helplink){
        //console.log('ProjectStageTool::getTabStop()');
        //console.log('TABSTOP ASSIGN TO PARAGRAPH');
        //console.log(subsectionrow.paragraph.property.tabstop);
       
        var all=new Object();
        for(const prop in subsectionrow.paragraph.tabstop){
            //console.log(prop);
            //console.log(subsectionrow.paragraph.tabstop);
            all[prop]=this.Utilities.getDefaultOptionProperties(prop,subsectionrow.paragraph.tabstop[prop].position+' '+subsectionrow.paragraph.tabstop[prop].measurementName+' | '+subsectionrow.paragraph.tabstop[prop].alignmentName+' | '+subsectionrow.paragraph.tabstop[prop].leadingSignName);
        }
        /*
         * SET NEW TabStop Object
         */
        TabStopRef[isubrow]= new TabStop();
        this.setTabStopParameters(TabStopRef[isubrow]);

        var data={
            0:{
                default:{
                    0:this.Utilities.getDefaultOptionProperties(-1,'Brak') 
                },
                all:all,
                property:subsectionrow,
                glossary:this.Glossary.text,
                /* Anonymous Function */
                onchange:function(t){
                    /* t - this */
                    //console.log(this);
                    //console.log(t);
                    //console.log(t.value);
                    //console.log(this.property);
                    this.property.paragraph.property.tabstop = t.value;
                },
                type:'select',
                attributes:{
                    class:'w-100'
                }
            }
        };
        var tool = this.Tool.create('Tabulacja:',data);
        /* SET REFERENCES TO SELECT OPTION */
        /* SET REFERENCES TO SUBSECTION ROW PARAGRAPH */
        TabStopRef[isubrow].paragraph={
            data:subsectionrow.paragraph,
            option:tool.childNodes[1].childNodes[0].childNodes[1]
        };
        

        /* SET DEFAULT OPTION */
        this.setDefaultOption(subsectionrow.paragraph.property.tabstop,tool.childNodes[1].childNodes[0].childNodes[1],subsectionrow.paragraph.tabstop);
        //console.log(TabStopRef);
        //throw 'aaaa';
        return  tool;
    }
    setTabStopParameters(TabStop){
        /* SETUP TABSTOP PARAMETERS */
        TabStop.setParameter(this.Glossary.text.like('parameter','^STAGE_TEXT_TABSTOP'));
        TabStop.setProperty('listMeasurement',this.Glossary.text.item.listMeasurement);
        TabStop.setProperty('tabstopAlign',this.Glossary.text.item.tabstopAlign);
        TabStop.setProperty('leadingSign',this.Glossary.text.item.leadingSign); 
    }
    setDefaultOption(paragraphTabStop,option,tabstop){
        //console.log('ProjectStageTool::setDefaultOption()\r\nPARAGRAPH TABSTOP:');
        //console.log(paragraphTabStop);
        if(paragraphTabStop==='-1'){
            //console.log('PARAGRAM TABSTOP < 0 -> RETURN FALSE');
            //console.log(paragraphTabStop);
            return false;
        }
        if(this.Utilities.countObjectProp(tabstop)===0){
            //console.log('TABSTOP DATA LIST IS EMPTY -> RETURN FALSE');
            return false;
        }
        /* SET PROPER DEFAULT OPTION ON SELECT */
        //console.log('SET PROPER OPTION');
        for (let i = 0; i < option.children.length; i++) {
                if(option.children[i].value===paragraphTabStop){
                    option.children[i].selected = true;
                    return paragraphTabStop;
            }
        }
        //console.log('OPTION NOT FOUND -> RETURN FALSE');
        return false;
    }
    createTextToolCheckBox(id,isection,isub,isubrow,title,defaultvalue,subsectionRowAttr,helplinkValue){
        
        //if(defaultvalue)
          
        var classObject=this;
        
        var div=document.createElement('div');
            div.setAttribute('class','form-check mt-1');
        var input=document.createElement('input');
            input.setAttribute('name',id+'-'+isection+'-'+isub+'-'+isubrow);
            //input.setAttribute('id',id+'-'+isection+'-'+isub+'-'+isubrow);
            input.setAttribute('type','checkbox');
            input.classList.add('form-check-input');
            input.onclick = function (){
                //console.log('ProjectStageTool::createTextToolCheckBox()');
                //console.log('ID - '+id);
                //console.log(this);
                if(this.value==='0'){
                    this.value='1';
                }
                else{
                    this.value='0';
                }
                //console.log(subsectionRowAttr);
                //console.log(subsectionRowAttr[id]);
                subsectionRowAttr[id]=this.value;
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
    setTextDecorationToolEntryProperties(decorationProp,subsectionRowAttr){
        // console.log('ProjectStageTool::setTextDecorationToolEntryProperties()');
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
                fullProp.check=subsectionRowAttr.fontWeight;
                fullProp.inputName='fontWeight';
                fullProp.label='<b>'+decorationProp.n+'</b>';
                break;
            case 'UNDERLINE':
                fullProp.check=subsectionRowAttr.underline;
                fullProp.inputName='underline';
                fullProp.label='<u>'+decorationProp.n+'</u>';
                break;
            case 'ITALIC':
                fullProp.check=subsectionRowAttr.fontStyle;
                fullProp.inputName='fontStyle';
                fullProp.label='<i>'+decorationProp.n+'</i>';
                break;
            case 'line-through':
                fullProp.check=subsectionRowAttr['line-through'];
                fullProp.inputName='line-through';
                fullProp.label='<span style="text-decoration:line-through;">'+decorationProp.n+'</span>';
                break;
            default:
                console.log('UNAVAILABLE - '+decorationProp.v);
                break;
        }
        
        return fullProp;
    }
    setTextDecorationToolEntry(decorationProp,tool4,isection,isub,isubrow,subsectionRowAttr,helplinkValue){
        /*
            decorationProp.n. - name
            decorationProp.v - value
         */
        var prop = this.setTextDecorationToolEntryProperties(decorationProp,subsectionRowAttr);
        
        var input = this.createTextToolCheckBox(prop.inputName,isection,isub,isubrow,prop.label,prop.check,subsectionRowAttr,helplinkValue);
        
        tool4.appendChild(input);
    }
    setTextDecorationToolEntryCheck(input,check){
        /*
         * console.log('ProjectStageTool::setTextDecorationToolEntryCheck()');
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
    setValueCheckBoxStyle(id,value,helplinkValue){
        // console.log('ProjectStageTool::setValueCheckBoxStyle()');
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
    getTextDecoration(tool4,isection,isub,isubrow,subsectionRowAttr,helplinkValue){
        //console.log('ProjectStageTool::createTextDecorationTool()');
        tool4.classList.add('pt-4');
        for(const prop of this.Glossary.text.getKey('decoration').entries()) {
            this.setTextDecorationToolEntry(prop[1],tool4,isection,isub,isubrow,subsectionRowAttr,helplinkValue);  
        } 
    }
    getTextTool(isection,isub,isubrow,subsectionrow,helplink,TabStop){
        // console.log('ProjectStageTool::getTextTool()');
        var mainDivCol=this.Html.getCol(12);
            mainDivCol.classList.add('d-none','pt-1','pb-1');//,'bg-light'
            mainDivCol.style.backgroundColor='#e6e6e6';
        var Tool = new ToolFields([3,3,3,3]);

        /* FONT SIZE */
        Tool.set(0,this.getParagraphSize(subsectionrow.paragraph.style,helplink.text.value));
        /* TEXT COLOR */
        Tool.set(0,this.getExtendedColor(subsectionrow.paragraph.style,helplink.text.value));
        /* BACKGROUND COLOR */
        Tool.set(0,this.getExtendedBackgroundColor(subsectionrow.paragraph.style,helplink.text.value));
        /* odstep przed */
        Tool.set(0,this.getParagraphSpaceBefore(subsectionrow.paragraph.style,helplink.text.value));
         /* odstep po */
        Tool.set(0,this.getParagraphSpaceAfter(subsectionrow.paragraph.style,helplink.text.value));
        /* FONT FAMILY */
        Tool.set(1,this.getExtendedFontFamily(subsectionrow.paragraph.style,helplink.text.value));
        /* TEXT ALIGN */
        Tool.set(1,this.getExtendedAlign(subsectionrow.paragraph.style,['textAlign','textAlignName'],helplink.text.value));
        /* TAB STOP */
        Tool.set(1,this.getTabStop(TabStop,isection,isub,isubrow,subsectionrow,helplink));    
        /* LEFT EJECTION */
        Tool.set(2,this.getLeftEjection(subsectionrow.paragraph.style,helplink.text));
         /* RIGHT EJECTION */
        Tool.set(2,this.getRightEjection(subsectionrow.paragraph.style,helplink));
         /* INDENTATION */
        Tool.set(2,this.getIndentation(subsectionrow.paragraph.style,helplink));
        /* PARAGRAPH TYPE */
        Tool.set(2,this.getParagraph(subsectionrow.paragraph.property,helplink.tool));
       
        /* SET CSS BOLD, ITALIC ... */
        //Tool.Field[3].classList.add('pt-4');
        this.getTextDecoration(Tool.get(3),isection,isub,isubrow,subsectionrow.paragraph.style,helplink.text.value); 

        mainDivCol.appendChild(Tool.getMain());

        return mainDivCol;
    }
     getSectionHeadMinTool(iSection,section,helplink,ProjectStageCreate){// isection
        /* */
        //console.log('ProjectStageCreate::getSectionHeadTool()');
        //console.log('section');
        //console.log(section);
        var Tool = new ToolFields([3,3,3,3]);
        
            Tool.set(0,this.setNoSectionSubSection(iSection));
            Tool.set(3,this.createRemoveSectionButton(iSection,section,helplink.section));

        return Tool.getMain();
    }
    getSectionHeadAllTool(iSection,section,helplink,ProjectStageCreate){// isection
        /* */
        //console.log('ProjectStageCreate::getSectionHeadTool()');
        //console.log('section');
        //console.log(section);
        var Tool = new ToolFields([3,3,3,3]);
        
            Tool.set(0,this.setSectionSubSection(iSection,section[iSection].subsection,helplink.section[iSection].subsection,ProjectStageCreate));
            Tool.set(3,this.createRemoveSectionButton(iSection,section,helplink.section));

        return Tool.getMain();
    }
    getListTool(isection,isub,isubrow,subsectionrow,helplink){
        // console.log('ProjectStageCreate::createListToolSection()');
        var mainDivCol=this.Html.getCol(12);
            mainDivCol.classList.add('d-none','pt-1','pb-1');
            mainDivCol.style.backgroundColor='#e6e6e6';
        var Tool = new ToolFields([3,3,3,3]);

        Tool.set(0,this.getSimpleSize(subsectionrow.list.style));
        Tool.set(0,this.getSimpleColor(subsectionrow.list.style));
        /* GET BackgroundColor */
        Tool.set(0,this.getSimpleBackgroundColor(subsectionrow.list.style));
        /* GET FONT FAMILY SELECT */
        Tool.set(0,this.getSimpleFontFamily(subsectionrow.list.style));
        /* SET CSS BOLD, ITALIC ... */
        this.getTextDecoration(Tool.get(3),isection,isub,isubrow,subsectionrow.list.style,helplink.list.value); 
        /* LIST LEVEL  */
        Tool.set(1,this.getListLevel(subsectionrow,helplink));
        /* LIST TYPE  */
        Tool.set(1,this.getListType(subsectionrow.list.style));
        /* CONTINUE/NEW ELEMENT */
        Tool.set(2,this.getNewList(subsectionrow.list.property));
        
      
        mainDivCol.appendChild(Tool.getMain());
        return mainDivCol;
    }
    getTabStopTool(isection,isub,isubrow,subsectionrow,helplink,TabStop){
        var mainDivCol=this.Html.getCol(12);
            mainDivCol.classList.add('d-none','bg-light','pt-1','pb-1');    //'bg-light',
            //mainDivCol.style.backgroundColor='#e6e6e6';
       var Tool = new ToolFields([7,1,2,2]);
        //tool4.classList.add('pt-4'); 
        //console.log(this.ProjectStageTool.getTabStopList(isubrow));
        //console.log(TabStop[isubrow]);
        Tool.set(0,TabStop[isubrow].create());//subsectionrow.paragraph.tabstop,isubrow

        mainDivCol.appendChild(Tool.getMain());
        //console.log(mainDivCol);
        return mainDivCol;
    }
    createControl(label,ele,color,color2){
        /* CONTROL */
        var control = document.createElement('button');
            control.setAttribute('type','button');
            control.classList.add('btn',color,'btn-sm');
            control.onclick = function (){
                //console.log(this);
                //console.log(ele);
                if(ele.classList.contains('d-none')){
                    ele.classList.remove('d-none');
                }
                else{
                    ele.classList.add('d-none');
                };
                if(this.classList.contains(color)){
                    this.classList.remove(color);
                    this.classList.add(color2);
                }
                else{
                    this.classList.add(color);
                    this.classList.remove(color2);
                };
                
            };
            control.innerText = label;
            return control; 
    }
    getControlTool(isection,isub,iSubRow,subsectionrowISubRow,helplinkISubRow,mainDiv,TabStop,VariableList){
        //console.log('ProjectStageCreate::getControlTool()');
        try{
             helplinkISubRow['tool']={};
            /* CREATE TEXT TOOL */
            var textTool = this.getTextTool(isection,isub,iSubRow,subsectionrowISubRow,helplinkISubRow,TabStop);
            /* CREATE TEXT TOOL */
            var textTabStopTool = this.getTabStopTool(isection,isub,iSubRow,subsectionrowISubRow,helplinkISubRow.text,TabStop);
            /* CREATE TAB STOP TOOL */
            var textTabStopToolControl = this.createControl('Tabulatory',textTabStopTool,'btn-outline-dark','btn-dark');
            /* SET LINK TO tabstopTool */
                helplinkISubRow.tool['tabstopControl']=textTabStopToolControl;
                helplinkISubRow.tool['tabstop']=textTabStopTool;
            /* CREATE LIST TOOL */
            var listTool = this.getListTool(isection,isub,iSubRow,subsectionrowISubRow,helplinkISubRow);
            var listToolControl = this.createControl('Opcje listy',listTool,'btn-outline-dark','btn-dark');
            /* SET LINK TO listTool */
                helplinkISubRow.tool['listControl']=listToolControl;
                helplinkISubRow.tool['list']=listTool;
             /* CREATE IMAGE TOOL */
            var ImageTool = new ProjectStageToolFile(this.Utilities,this.Html,this.Modal,this.router,this.appUrl);
                ImageTool.setParent(this);
                //console.log(ImageTool);
                ImageTool.setImage(subsectionrowISubRow.image);
                ImageTool.setToolEle('img_'+isection.toString()+isub.toString()+iSubRow.toString());
            var VariableTool = new ProjectStageToolVariable(this,isection,isub,iSubRow,subsectionrowISubRow,helplinkISubRow,VariableList);
            var mainCol = this.Html.getCol(12);
                mainCol.classList.add('mt-1','mb-1');
            var Tool = new ToolFields([5,1,6]);
                Tool.Field[0].classList.add('btn-group','btn-group-toggle');
                Tool.set(0,this.createControl('Formatowanie',textTool,'btn-outline-dark','btn-dark'));
                Tool.set(0,textTabStopToolControl);
                Tool.set(0,listToolControl);
                Tool.set(0,this.createControl('Obraz',ImageTool.getToolEle(),'btn-outline-dark','btn-dark'));
                Tool.set(0,this.createControl('Zmienne',VariableTool.getTool(),'btn-outline-dark','btn-dark'));

                mainCol.appendChild(Tool.getMain());
                mainDiv.appendChild(mainCol);    
                mainDiv.appendChild(textTool);  
                mainDiv.appendChild(textTabStopTool);  
                mainDiv.appendChild(listTool);
                mainDiv.appendChild(ImageTool.getToolEle());
                mainDiv.appendChild(VariableTool.getTool());
        }
        catch(error){
            console.log('ProjectStageTool::getControlTool() ERROR');
            console.log(error);
            throw error;
            //this.Html.showField(this.Modal.link['error'],'An Application Error Has Occurred!');
        }
       
    }
    setNoSectionSubSection(iSection){
        var formGroup=document.createElement('div');
            formGroup.classList.add('form-group');
        var label = document.createElement('label');
            label.setAttribute('for','columnList'+iSection);
            label.classList.add('text-brown');
        var labelTitle=document.createTextNode('Wskaż ilość podsekcji ');
        var labelTitle2=document.createTextNode('[KOLUMN]');
        
        var p=document.createElement('p');
            p.classList.add('text-muted');
        var small2=document.createElement('small');
            small2.append(document.createTextNode('*Footer/Heading supports only one column.'));
            p.append(small2);
        var small=document.createElement('small');
            small.classList.add('text-muted');
            small.append(labelTitle2);
            label.append(labelTitle,small,document.createTextNode(':'));
            
        var select=document.createElement('select');
            select.classList.add('form-control','form-control-sm','font-weight-normal','border','text-secondary','border-secondary');
        var option=document.createElement('option');
            option.append(document.createTextNode('1'));
            select.append(option);
            formGroup.append(label,select,p);
            //ele.append(formGroup);
        //return  this.Tool.create('Wskaż ilość podsekcji <small class="text-muted">[KOLUMN]</small>:',data);
        return formGroup;
    }
    setSectionSubSection(iSection,subsection,helplinkSubsection,self){
        //console.log('ProjectStageCreate.setSectionSubSection()');
        var subSectionCount = Object.keys(subsection).length;
        var data={
            0:{
                default:{
                    0:this.Utilities.getDefaultOptionProperties(subSectionCount-1,subSectionCount)
                },
                all:this.getSectionCount(subSectionCount,self.Property.subsectionMax),
                self:self,
                subsection:subsection,
                iSection:iSection,
                helplinkSubsection:helplinkSubsection,
                oldValue:0,
                oldIndex:0,
                glossary:this.Glossary.text,
                /* Anonymous Function */
                onchange:function(t){
                    //console.log('ProjectStageCreate.setSectionSubSection().onchange()');
                    /* t - this */
                    this.oldValue=parseInt(this.oldValue,10);
                    var newValue=parseInt(t.value,10);
                        if(this.oldValue<newValue){
                            for(var i = this.oldValue+1; i<newValue+1 ;i++ ){
                                this.subsection[i]=this.self.StageData.createSubsection(i);
                                /* FIRST ALWAYS NEW LINE */
                                //subsection[i].subsectionrow[0].data.valuenewline='n';
                                this.subsection[i].subsectionrow[0].paragraph.property.valuenewline='y';
                                /* CREATE NEW DOM ELEMENT */
                                this.self.helplink.section[this.iSection].main.body.appendChild(this.self.createSubsection(this.iSection,i,this.subsection[i],this.helplinkSubsection));
                            }             
                            return true;
                        }
                        if (confirm('Potwierdź zmianę ilości kolumn. Zostaną bezpowrotnie usunięte kolumny!') === true) {                   
                            for(var i = Object.keys(this.subsection).length-1; i>newValue ;i-- ){
                                delete this.subsection[i];
                                this.helplinkSubsection[i].all.remove();
                                delete this.helplinkSubsection[i];
                            }
                            return true;
                        }
                        else{
                            this.selectedIndex = oldIndex;
                            this.value = oldValue;
                        }
                },
                onfocus:function(t){
                    /* t - this */
                    this.oldIndex = t.selectedIndex;
                    this.oldValue = t.value;
                },
                type:'select',
                attributes:{
                    class:'w-50'
                }
            }
        };
        return  this.Tool.create('Wskaż ilość podsekcji <small class="text-muted">[KOLUMN]</small>:',data);
    }
    getSectionCount(exception,max){
        exception=parseInt(exception,10);
        var value={};
        var j=1;
        for(var i=0;i<max;i++){
            if(exception!==j){
                value[i]=this.Utilities.getDefaultOptionProperties(i,j);
            }
            j++;
        }
        return value;
    }
    createRemoveSectionButton(iSection,section,helplink){
        /* console.log('ProjectStageTool::createRemoveSectionButton()'); */
        var div=document.createElement('div');
            div.setAttribute('class','btn btn-danger float-right');
            div.innerText='Usuń sekcję';
            /* CLOSURE */
            div.onclick=function(){
                if (confirm('Potwierdź usunięcie sekcji') === true) {
                    //console.log(helplink);
                    //console.log(section);
                    helplink[iSection].main.all.remove();
                    delete helplink[iSection];
                    delete section[iSection];
                    
                } else {
                    // NOTHING TO DO
                }
                //this.updateErrorStack(id);      
            };
        return(div); 
    }
    getSectionFooterTool(iSection,section){
        //console.log('ProjectStageCreate::getSectionFooterTool()');
        //console.log('iSection');
        //console.log(iSection);
        //console.log('section');
        //console.log(section);
        //console.log('section');
        //throw 'stop';
        var mainDivCol=this.Html.getCol(12);
            mainDivCol.classList.add('bg-light','mt-1');
            mainDivCol.style.backgroundColor='#e6e6e6';
        var mainDiv=this.Html.getRow();

        var Tool3 = new ToolFields([3,3,3,3]);
        var h5=document.createElement('h5');
            h5.setAttribute('class','w-100 text-center text-bold pt-0 pb-1 mt-0 bg-secondary');//  text-center
            //h5.style.backgroundColor='#e6e6e6';
            h5.innerHTML='<small class="text-white">Opcje odnoszące się do całej sekcji:</small>';//text-info
 
            Tool3.set(0,this.getSimpleBackgroundColor(section.style));
        var newPage = this.createTextToolRadioButton('valunewline-'+iSection,'Sekcja od nowej strony?',this.Tool.getYesNowRadio());
        var run=false;
                                        
        /* SET BUTTON RADIO TO PROPER VALUE */
        this.setRadioButtonExtend(newPage.childNodes[1],section,run);
 
        Tool3.set(0,newPage);    
        
        mainDiv.appendChild(h5);
        
        mainDivCol.appendChild(mainDiv);
        mainDivCol.appendChild(Tool3.getMain());
        return mainDivCol;
    }
    createTextToolRadioButton(id,title,value){
        //console.log('ProjectStageCreate::createTextToolRadioButton()');
        //console.log(id);
        var maindiv=this.Html.getRow();
        var collabel=this.Html.getCol(12);
        var colvalue=this.Html.getCol(12);
        var mainlabel=document.createElement('p');
            mainlabel.setAttribute('class','text-info mt-1 mb-0 pb-0 w-100');
            mainlabel.innerHTML=title;  
        for (const property in value) {
            /**/
            //console.log(value[property]);    
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
    setRadioButtonExtend(radio,subsectionrowParagraph,run){
        /**/
        //console.log('ProjectStageCreate::setRadioButtonExtend()');
        //console.log(radio);
        //console.log('SUBSECTIONROW');
        //console.log(subsectionrowParagraph);
        
        /* FIRST RUN TO SET PROPER VALUE AND onClick FUNCTION */
        var self = this;
        radio.childNodes.forEach(
            function(currentValue) {//, currentIndex, listObj
                if(currentValue.childNodes[0].value === subsectionrowParagraph.property.valuenewline){
                    /* REMOVE ATTRIBUTE no-checked */
                    currentValue.childNodes[0].removeAttribute('no-checked');
                    /* ADD ATTRIBUTE checked */
                    currentValue.childNodes[0].setAttribute('checked','');
                }
                /* CLOSURE */
                currentValue.childNodes[0].onclick = function (){
                    subsectionrowParagraph.property.valuenewline = this.value; 
                    //console.log(this.value);
                    //console.log(subsectionrowParagraph);
                    if(run){
                        self[run.method](this.value,run);
                    };
                };
            }
        );
    }
    createExtendedTextTool(isection,isub,isubrow,subsectionrow,helplink){
        // console.log('ProjectStageCreate::createExtendedTextTool()');
        var Tool = new ToolFields([5,5,2]);
        var radio = this.createTextToolRadioButton('valuenewline-'+isection+'-'+isub+'-'+isubrow,'Tekst od nowej lini?',this.Tool.getYesNowRadio());//'valuenewline-'+isection+'-'+isub+'-'+isubrow
        var run={
            method:'setToolVisibility',
            helplink:helplink,
            tool:['tabstopControl','tabstop','listControl','list']
        };
        this.setRadioButtonExtend(radio.childNodes[1],subsectionrow.paragraph,run);
        Tool.set(0,radio);
        return Tool.getMain();
    }
    setToolVisibility(value,run){
        //console.log('ProjectStageCreate::setToolVisibility()');
        //console.log(run);
        //console.log('value');
        //console.log(value);
        switch(value){
            case 'l':   
            case 'y':
                this.showControl(run);
                break;
            case 'n':
            case 'p':
                this.hideControl(run);
                break;
            default:
                break;
        }
    }
    setToolList(value,run){
        //console.log('ProjectStageCreate::setToolList()');
        //console.log(run);
        if(value==='p'){
            this.hideControl(run);
            /* FIX tabstopList SELECT */
        }
        else{
            this.showControl(run);
        }
    }
    showControl(run){
        for(const prop in run.tool){
            //console.log(run.tool[prop]);
            if (run.helplink.tool[run.tool[prop]].style.display) {
                run.helplink.tool[run.tool[prop]].style.removeProperty('display');
            }
            else{
            }
        }
    }
    hideControl(run){
        for(const prop in run.tool){
            //console.log(run.tool[prop]);
            run.helplink.tool[run.tool[prop]].style.setProperty('display', 'none');
        }
    }
    setDropDown(Tool,run){
        Tool.classList.add('dropdown');
        Tool.childNodes[1].append(this.Html.getDropDown(this.getClearSizeList(6,32),run));
        Tool.childNodes[1].childNodes[0].classList.add('dropdown-toggle');
        Tool.childNodes[1].childNodes[0].setAttribute('data-toggle','dropdown');
        Tool.childNodes[1].childNodes[0].setAttribute('aria-haspopup',"true");
        Tool.childNodes[1].childNodes[0].setAttribute('aria-expanded',"false");
    }
}