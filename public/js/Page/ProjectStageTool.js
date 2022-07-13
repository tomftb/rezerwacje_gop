class ProjectStageTool{
    
    Tool = new Object();
    Utilities = new Object()
    Glossary = new Object();
    Html = new Object();
    //TabStop = new Object();
    
    constructor(Stage){
        this.Utilities = Stage.Utilities;
        this.Glossary = Stage.Glossary;
        this.Html = Stage.Html;
        this.Tool = new Tool();
        //this.TabStop = Stage.TabStop;
    }
    getAllOptions(Glossary,property,key,run){
        console.log('ProjectStageTool::getAllOptions()');
        var all = {}; 
        for(var i=0;i<Glossary.getKeyCount(key);i++){
            if(Glossary.getKeyPropertyAttribute(key,i,'v')===property[key]){
                continue;
            }
            all[i]=run(this,Glossary,key,i);
        };
        return all;
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
                console.log('ProjectStageTool::getExtendedTool()');
                console.log(property);
                console.log(key);
                /* SET PROPERTY KEY VALUE */
                this.property[this.key[0]]=t.value;
                /* SET SECOND PROPERTY KEY VALUE */
                this.property[this.key[1]] = this.glossary.getItemName(item,t.value);
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
                console.log('ProjectStageTool::getCompleteTool()');
                console.log(property);
                console.log(key);
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
        console.log('ProjectStageTool::setColorProperty()');
        data[0]['default']=this.getDefaultOption(property,key[0],key[1]);
        data[0]['all']=this.getAllOptions(this.Glossary.text,property,'color',run); 
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
        console.log('ProjectStageTool::getSimpleColor()');
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
        console.log('ProjectStageTool::getExtendedColor()');
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
    getTextAlign(property,ele){
        console.log('ProjectStageTool::getTextAlign()');
        var run = function(self,Glossary,key,i){
            return self.getExtendedOption(Glossary.getKeyPropertyAttribute(key,i,'v'),Glossary.getKeyPropertyAttribute(key,i,'n'),'#000000','#FFFFFF','');  
        };
        var data=this.getAdvancedTool(property,'textAlign',ele);
            data[0]['default']=this.getDefaultOption(property,'textAlign','textAlignName');
            data[0]['all']=this.getAllOptions(this.Glossary.text,property,'textAlign',run);  
        return  this.Tool.create('Wyrównanie:',data);
    }
    getListType(property){     
        var run = function(self,Glossary,key,i){
            return self.Utilities.getDefaultOptionProperties(Glossary.getKeyPropertyAttribute(key,i,'v'),Glossary.getKeyPropertyAttribute(key,i,'n'));
        };
        var key=['listType','listTypeName'];
        var data=this.getExtendedTool(property,key,this.Glossary.list,key[0])
            data[0]['default']=this.getDefaultOption(property,key[0],key[1]);
            data[0]['all']=this.getAllOptions(this.Glossary.list,property,key[0],run);  
            
        return  this.Tool.create('Typ listy:',data); 
    }
    getListLevel(property,ele){
        console.log('ProjectStageTool::getListLevel()');
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
        console.log('ProjectStageTool::getNewList()');
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
        console.log('ProjectStageTool::getFontFamily()');
        var run = function(self,Glossary,key,i){
            let v = Glossary.getKeyPropertyAttribute(key,i,'v');
            return self.getExtendedOption(v,v,'#000000','#FFFFFF',v);  
        };
        var data=this.getTool(property,'fontFamily');
            data[0]['default']=this.getDefaultOption(property,'fontFamily','fontFamily');
            data[0]['all']=this.getAllOptions(this.Glossary.text,property,'fontFamily',run);  
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
                onchange:function(t){
                    /* t - this */
                    this.property[this.key[1]] = t.value;
                    this.ele.style[key[0]]=this.property[key[0]]+t.value;
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
            data[0]['onchange']=function(t){
                /* t - this */
                this.property[this.key[0]] = t.value; 
            };
            data[1]['onchange']=function(t){
                /* t - this */
                this.property[this.key[1]] = t.value;
            }; 
        return this.Tool.create('Rozmiar tekstu:',data);
    }
    getExtendedFontSize(property,ele){
        var data = this.getFontSize(property);
            data[0]['ele']=ele;
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
    getTabStop(TabStopRef,isection,isub,isubrow,subsectionrow,helplink){
        console.log('ProjectStageTool::getTabStop()');
        console.log('TABSTOP ASSIGN TO PARAGRAPH');
        console.log(subsectionrow.paragraph.property.tabstop);
       
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
                    this.property['tabstop'] = t.value;
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
        console.log(TabStopRef);
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
        console.log('ProjectStageTool::setDefaultOption()\r\nPARAGRAPH TABSTOP:');
        console.log(paragraphTabStop);
        if(paragraphTabStop==='-1'){
            console.log('PARAGRAM TABSTOP < 0 -> RETURN FALSE');
            //console.log(paragraphTabStop);
            return false;
        }
        if(this.Utilities.countObjectProp(tabstop)===0){
            console.log('TABSTOP DATA LIST IS EMPTY -> RETURN FALSE');
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
        console.log('OPTION NOT FOUND -> RETURN FALSE');
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
                console.log('ProjectStageTool::createTextToolCheckBox()');
                console.log('ID - '+id);
                console.log(this);
                if(this.value==='0'){
                    this.value='1';
                }
                else{
                    this.value='0';
                }
                console.log(subsectionRowAttr);
                console.log(subsectionRowAttr[id]);
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
        for(const prop of this.Glossary.text.getKey('decoration').entries()) {
            this.setTextDecorationToolEntry(prop[1],tool4,isection,isub,isubrow,subsectionRowAttr,helplinkValue);  
        } 
    }
    getTextTool(isection,isub,isubrow,subsectionrow,helplink,TabStop){
        // console.log('ProjectStageTool::getTextTool()');
        var mainDivCol=this.Html.getCol(12);
            mainDivCol.classList.add('d-none','pt-1','pb-1');//,'bg-light'
            mainDivCol.style.backgroundColor='#e6e6e6';
        var mainDiv=this.Html.getRow();
            
        var tool1=this.Html.getCol(3);
        var tool2=this.Html.getCol(3);
        var tool3=this.Html.getCol(3);
        var tool4=this.Html.getCol(3);
            tool4.classList.add('pt-4');

        /* FONT SIZE */
        tool1.appendChild(this.getExtendedFontSize(subsectionrow.paragraph.style,helplink.text.value));
        /* TEXT COLOR */
        tool1.appendChild(this.getExtendedColor(subsectionrow.paragraph.style,helplink.text.value));
        /* BACKGROUND COLOR */
        tool1.appendChild(this.getExtendedBackgroundColor(subsectionrow.paragraph.style,helplink.text.value));
        /* FONT FAMILY */
        tool2.appendChild(this.getExtendedFontFamily(subsectionrow.paragraph.style,helplink.text.value));
        /* TEXT ALIGN */
        tool2.appendChild(this.getTextAlign(subsectionrow.paragraph.style,helplink.text.value));
        /* TAB STOP */
        tool2.appendChild(this.getTabStop(TabStop,isection,isub,isubrow,subsectionrow,helplink));    
        /* LEFT EJECTION */
        tool3.appendChild(this.getLeftEjection(subsectionrow.paragraph.style,helplink.text));
         /* RIGHT EJECTION */
        tool3.appendChild(this.getRightEjection(subsectionrow.paragraph.style,helplink));
         /* INDENTATION */
        tool3.appendChild(this.getIndentation(subsectionrow.paragraph.style,helplink));
        /* PARAGRAPH TYPE */
        tool3.appendChild(this.getParagraph(subsectionrow.paragraph.property,helplink.tool));
       
        /* SET CSS BOLD, ITALIC ... */
        this.getTextDecoration(tool4,isection,isub,isubrow,subsectionrow.paragraph.style,helplink.text.value); 

        mainDiv.appendChild(tool1);
        mainDiv.appendChild(tool2);
        mainDiv.appendChild(tool3);
        mainDiv.appendChild(tool4);
      
        mainDivCol.appendChild(mainDiv);

        return mainDivCol;
    }
    getSectionHeadTool(iSection,section,helplink,ProjectStageCreate){// isection
        /* */
        console.log('ProjectStageCreate::getSectionHeadTool()');
        console.log('section');
        console.log(section);

        var mainDivSection=this.Html.getRow();
        var tool1=this.Html.getCol(3);
        var tool2=this.Html.getCol(3);    
        var tool3=this.Html.getCol(3);
        var tool4=this.Html.getCol(3);  
        
            tool1.appendChild(this.setSectionSubSection(iSection,section[iSection].subsection,helplink.section[iSection].subsection,ProjectStageCreate));
            tool4.appendChild(this.createRemoveSectionButton(iSection,section,helplink.section));

        mainDivSection.appendChild(tool1);
        mainDivSection.appendChild(tool2);
        mainDivSection.appendChild(tool3);
        mainDivSection.appendChild(tool4);
        return mainDivSection;
    }
    getListTool(isection,isub,isubrow,subsectionrow,helplink){
        // console.log('ProjectStageCreate::createListToolSection()');
        var mainDivCol=this.Html.getCol(12);
            mainDivCol.classList.add('d-none','pt-1','pb-1');
            mainDivCol.style.backgroundColor='#e6e6e6';
        var mainDiv=this.Html.getRow();
        var tool1=this.Html.getCol(3);
        var tool2=this.Html.getCol(3);
        var tool3=this.Html.getCol(3);
        var tool4=this.Html.getCol(3);
    
        tool1.appendChild(this.getSimpleFontSize(subsectionrow.list.style));
        tool1.appendChild(this.getSimpleColor(subsectionrow.list.style));
        /* GET BackgroundColor */
        tool1.appendChild(this.getSimpleBackgroundColor(subsectionrow.list.style));
        /* GET FONT FAMILY SELECT */
        tool1.appendChild(this.getSimpleFontFamily(subsectionrow.list.style));
        /* SET CSS BOLD, ITALIC ... */
        this.getTextDecoration(tool4,isection,isub,isubrow,subsectionrow.list.style,helplink.list.value); 
        /* LIST LEVEL  */
        tool2.appendChild(this.getListLevel(subsectionrow,helplink));
        /* LIST TYPE  */
        tool2.appendChild(this.getListType(subsectionrow.list.style));
        /* CONTINUE/NEW ELEMENT */
        tool2.appendChild(this.getNewList(subsectionrow.list.property));
        
        mainDiv.appendChild(tool1);
        mainDiv.appendChild(tool2);
        mainDiv.appendChild(tool3);
        mainDiv.appendChild(tool4);
        mainDivCol.appendChild(mainDiv);
        return mainDivCol;
    }
    getTabStopTool(isection,isub,isubrow,subsectionrow,helplink,TabStop){
        var mainDivCol=this.Html.getCol(12);
            mainDivCol.classList.add('d-none','bg-light','pt-1','pb-1');    //'bg-light',
            //mainDivCol.style.backgroundColor='#e6e6e6';
        var mainDiv=this.Html.getRow();
            
        var tool1=this.Html.getCol(7);
        var tool2=this.Html.getCol(1);
        var tool3=this.Html.getCol(2);
        var tool4=this.Html.getCol(2);
        //tool4.classList.add('pt-4'); 
        //console.log(this.ProjectStageTool.getTabStopList(isubrow));
        console.log(TabStop[isubrow]);
        tool1.appendChild(TabStop[isubrow].create());//subsectionrow.paragraph.tabstop,isubrow
        
        mainDiv.appendChild(tool1);
        mainDiv.appendChild(tool2);
        mainDiv.appendChild(tool3);
        mainDiv.appendChild(tool4);
            
        mainDivCol.appendChild(mainDiv);
        console.log(mainDivCol);
        return mainDivCol;
    }
    createControl(label,ele){
        /* CONTROL */
        var control = document.createElement('button');
            control.setAttribute('type','button');
            control.classList.add('btn','btn-outline-dark','btn-sm');
            control.onclick = function (){
                if(ele.classList.contains('d-none')){
                    ele.classList.remove('d-none');
                }
                else{
                    ele.classList.add('d-none');
                };
                if(this.classList.contains('btn-outline-dark')){
                    this.classList.remove('btn-outline-dark');
                    this.classList.add('btn-dark');
                }
                else{
                    this.classList.add('btn-outline-dark');
                    this.classList.remove('btn-dark');
                };
                
            };
            control.innerText = label;
            return control; 
    }
    getControlTool(isection,isub,iSubRow,subsectionrowISubRow,helplinkISubRow,mainDiv,TabStop){
        helplinkISubRow['tool']={};
        /* CREATE TEXT TOOL */
        var textTool = this.getTextTool(isection,isub,iSubRow,subsectionrowISubRow,helplinkISubRow,TabStop);
        /* CREATE TEXT TOOL */
        var textTabStopTool = this.getTabStopTool(isection,isub,iSubRow,subsectionrowISubRow,helplinkISubRow.text,TabStop);
        var textTabStopToolControl = this.createControl('Tabulatory',textTabStopTool);
        /* SET LINK TO tabstopTool */
            helplinkISubRow.tool['tabstopControl']=textTabStopToolControl;
            helplinkISubRow.tool['tabstop']=textTabStopTool;
        /* CREATE LIST TOOL */
        var listTool = this.getListTool(isection,isub,iSubRow,subsectionrowISubRow,helplinkISubRow);
        var listToolControl = this.createControl('Opcje listy',listTool);
        /* SET LINK TO listTool */
            helplinkISubRow.tool['listControl']=listToolControl;
            helplinkISubRow.tool['list']=listTool;
        var mainCol = this.Html.getCol(12);
            mainCol.classList.add('mt-1','mb-1');
        var mainDivControl=this.Html.getRow();   
        var mainDivControlCol = this.Html.getCol(4);
        
        var mainDivControlCol1 = this.Html.getCol(1);   
        var mainDivControlCol2 = this.Html.getCol(7);

            mainDivControlCol.classList.add('btn-group','btn-group-toggle');
            mainDivControlCol.appendChild(this.createControl('Formatowanie',textTool));
            mainDivControlCol.appendChild(textTabStopToolControl);
            mainDivControlCol.appendChild(listToolControl);
    
            mainDivControl.appendChild(mainDivControlCol1);
            mainDivControl.appendChild(mainDivControlCol);
            mainDivControl.appendChild(mainDivControlCol2);
            mainCol.appendChild(mainDivControl);
            mainDiv.appendChild(mainCol);    
            mainDiv.appendChild(textTool);  
            mainDiv.appendChild(textTabStopTool);  
            mainDiv.appendChild(listTool);
    }
    setSectionSubSection(iSection,subsection,helplinkSubsection,self){
        /* console.log('ProjectStageCreate::setSectionSubSection()'); */
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
                    /* t - this */
                    this.oldValue=parseInt(this.oldValue,10);
                    var newValue=parseInt(t.value,10);
                        if(this.oldValue<newValue){
                            for(var i = this.oldValue+1; i<newValue+1 ;i++ ){
                                this.subsection[i]=this.self.StageData.createSubsection();
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
        console.log('ProjectStageCreate::getSectionFooterTool()');
        console.log('iSection');
        console.log(iSection);
        console.log('section');
        console.log(section);
        console.log('section');
        //throw 'stop';
        var mainDivCol=this.Html.getCol(12);
            mainDivCol.classList.add('bg-light','mt-1');
            mainDivCol.style.backgroundColor='#e6e6e6';
        var mainDiv=this.Html.getRow();
        var mainDiv3=this.Html.getRow();
        var h5=document.createElement('h5');
            h5.setAttribute('class','w-100 text-center text-bold pt-0 pb-1 mt-0 bg-secondary');//  text-center
            //h5.style.backgroundColor='#e6e6e6';
            h5.innerHTML='<small class="text-white">Opcje odnoszące się do całej sekcji:</small>';//text-info
        var toolMain1=this.Html.getCol(3);
        var toolMain2=this.Html.getCol(3);    
        var toolMain3=this.Html.getCol(3);
        var toolMain4=this.Html.getCol(3);    

            toolMain1.appendChild(this.getSimpleBackgroundColor(section[iSection].style));
        var newPage = this.createTextToolRadioButton('newpage','Sekcja od nowej strony?',this.Tool.getYesNowRadio());
        /* SET BUTTON RADIO TO PROPER VALUE */

        toolMain1.appendChild(newPage);    
        
        mainDiv.appendChild(h5);
        
        mainDiv3.appendChild(toolMain1);
        mainDiv3.appendChild(toolMain2);
        mainDiv3.appendChild(toolMain3);
        mainDiv3.appendChild(toolMain4);
        
        mainDivCol.appendChild(mainDiv);
        mainDivCol.appendChild(mainDiv3);
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
}