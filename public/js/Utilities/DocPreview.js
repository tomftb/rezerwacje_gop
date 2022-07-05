/* 
 * WORD DOC PREVIEW
 * Author: Tomasz Borczynski
 */
class DocPreview{
    Html = new Object();
    Style = new Object();
    RomanList = new Object();
    AlphabeticalList = new Object();
    Utilities = new Object();
    helplink = new Object();
    data = new Object();
    constructor(){
        console.log('DocPreview::constructor()');
        this.Html=new Html();
        this.Style = new Style();
        this.RomanList = new RomanList();
        this.AlphabeticalList = new AlphabeticalList();
        this.Utilities = new Utilities();
    }
    run(helplink,data){
        console.log('DocPreview::setData()');
        this.helplink=helplink;
        this.data=data;
        this.setPage();
        this.setPageValue();
    }
    setPage(){
        //console.log('DocPreview::setPage()');   
        this.helplink.preview.whole.style.backgroundColor='rgb(251,251,251)';
        var wholePage=document.createElement('div');
            wholePage.style.width='813px';
            wholePage.style.height='1142px';
            wholePage.style.backgroundColor='rgb(251,251,251)';
            wholePage.style.paddingTop='10px';
            wholePage.style.marginLeft='162px'; /* ALL 324, MAIN 10 */
            wholePage.style.paddingLeft='10px'; /* ALL 324, MAIN 10 */
        var blankPage=document.createElement('div');
            blankPage.style.width='791px';
            blankPage.style.height='1120px';   
            blankPage.style.border='1px solid rgb(198,198,198)'; 
            blankPage.style.backgroundColor=this.data.style.backgroundColor;
        var writePage=document.createElement('div');
            writePage.style.width='699px';
            writePage.style.height='1028px';
            /* IT IS DEPED OF FONT SIZE */
            writePage.style.paddingTop='92px';
            /* DEFAULT LEFT MARGIN 2,5 cm */ 
            writePage.style.paddingLeft='92px'; /* ALL 314, MAIN 10 */
            /* TO DO */
            //writePage.style.textAlign=this.helplink.preview.pageTextAlign
        blankPage.appendChild(writePage);
        wholePage.appendChild(blankPage);
        this.helplink.preview.whole.appendChild(wholePage);     
        this.helplink.preview['write'] =  writePage;
    }
    setPageValue(){
        /*
        console.log('DocPreview::setPageValue()');
        console.log('data');
        console.log(this.data);
        console.log('helplink');
        console.log(this.helplink);
        */
        //throw 'test--stop';;
        var writePageSectionWidth=607;
        var subsectionCount=0;
        /* LOOP OVER  SECTION */   
        for(const property in this.data.section){
            subsectionCount=Object.keys(this.data.section[property].subsection).length;
            /* SECTION 
                console.log('SECTION');
                console.log(property);
                console.log('SECTION '+property+' DATA');
                console.log(this.data.section[property]);
                console.log('SECTION '+property+' DATA SUBSECTION LENGTH');
                console.log('SUBSECTION COUNT:');
                console.log(subsectionCount);
            */
            /* CHECK AND SETUP COLUMNS NUMBER */
            writePageSectionWidth=Math.floor(607/subsectionCount); /* minus padding left 92px */
            /*
                console.log('SECTION '+property+' DATA subsectionvisible');
                console.log(this.data.section[property].subsectionvisible);
            */
            //console.log('SECTION '+property+' ALL DATA subsection');
            //console.log(this.data.section[property].subsection);
            
             /* LOOP OVER SUBSECTION - VISIBLE */   
            for(var i=0;i<subsectionCount;i++){
            //for(var i=0;i<this.data.section[property].subsectionvisible;i++){
                /* SUBSECTION  
                    console.log('SECTION '+property+' DATA subsection '+i);
                    console.log(this.data.section[property].subsection[i]);
                */  
                var writePageSection=document.createElement('div');
                    writePageSection.style.width=writePageSectionWidth+'px';
                    //writePageSection.style.display='inline-block';
                    writePageSection.style.border='0px solid blue';
                    writePageSection.style.margin='0px';
                    //writePageSection.style.paddingBottom='0px';
                    writePageSection.style.padding='0px 0px 0px 0px';
                    //writePageSection.style.margin='0px';
                    //writePageSection.style.cssFloat='LEFT';
                    /* IN FUTURE SETUP SUBSECTION DATA */
                    /* IN FUTURE SETUP SUBSECTION PROPERTY */
                    /* IN FUTURE SETUP SUBSECTION STYLE */
               
                    /* NEW PARAGRAPH -> TO DO SET PARAGRAPH STYLE -> MARGIN -> PADDING ...*/
                    
                   // var p=document.createElement('p');
                        /* top margin, right margin, bottom margin, left margin */
                      //  p.style.margin = "0px 0px 0px 0px";
                      //  p.style.padding = "0px 0px 0px 0px";
                        
                    /* NEW LIST */   
                    //var ul=document.createElement('ul');
                   // var mainUl = this.createUl();
                    //var li=document.createElement('li');
                    var actListLevel=1;
                    //var listEleCounter=1;
                    
                    
                    var lastLevelCounter = new Object();
                    var actParagraphType='';
                    var firstLine = true;
                    /* VIRTUAL - MUST BY SETUP BY RETURN */
                    //var actEle = document.createElement('li');
                    //var actEle = writePageSection;
                    /* LOOP OVER SUBSECTION ROW */
                    for(const propSubsection in this.data.section[property].subsection[i].subsectionrow){
                        //console.log('actListLevel - '+actListLevel);
                        //console.log('newListLevel - '+this.data.section[property].subsection[i].subsectionrow[propSubsection].list.property.listLevel);
                        
                        //throw 'test-stop-414';
                        
                        /* SET LIST UL */
                        /* VIRTUAL - MUST BY SETUP BY RETURN */
                        /* CHANGE TO P -> NO POSSIBIITY TO SET CONTINUE LIST ATTRIBUTE !!  VIRTUAL COUNTER */
                        
                        /* FOR TESTS */
                        //listEleCounter=parseInt(this.data.section[property].subsection[i].subsectionrow[propSubsection].paragraph.property.value,10);
                        this.setPageValueEle(writePageSection,this.data.section[property].subsection[i].subsectionrow[propSubsection],actListLevel,lastLevelCounter,actParagraphType,firstLine);
                        firstLine=false;
                        //actEle = this.setList(writePageSection,actEle,this.data.section[property].subsection[i].subsectionrow[propSubsection].list,actListLevel);
                        //p = this.setPreviewValue(writePageSection,p,this.data.section[property].subsection[i].subsectionrow[propSubsection]);
                        //li = this.setPreviewValue(li,this.data.section[property].subsection[i].subsectionrow[propSubsection]);
                        
                        //li.appendChild(p);
                        //ul.appendChild(li);
                         /* CHECK IS NEW LI OR CONTINUE */
                        //li = this.setListElement(p,li,ul);
                        //listEleCounter++;
                        actListLevel=this.data.section[property].subsection[i].subsectionrow[propSubsection].list.property.listLevel;
                        actParagraphType=this.data.section[property].subsection[i].subsectionrow[propSubsection].paragraph.property.paragraph;
                        /* END LOOP OVER SUBSECTION ROW */
                       
                    }
                    //ul.appendChild(li);
                    //writePageSection.appendChild(p);
                    //writePageSection.appendChild(ul);
                    //writePageSection.appendChild(ulTest);
                    console.log(writePageSection);
                    
                    this.helplink.preview['write'].appendChild(writePageSection);
            /* END LOOP OVER SUBSECTION - VISIBLE */   
            }
        /* END LOOP OVER SECTION */     
        };
    }
    setPageValueEle(mainDiv,row,actLvl,lastLevelCounter,lastParagraphType,firstLine){
        console.log('DocPreview::setPageValueEle()');
        /*
            console.log(row);
            console.log('Paragraph type:');
            console.log(row.paragraph.property.paragraph);
            throw 'aaaa';
         */
        switch(row.paragraph.property.paragraph){
            case 'l':
                console.log('LIST');
                this.setList(mainDiv,row,actLvl,lastLevelCounter);
                break;
            case 'p':
                console.log('PARAGRAPH');
                this.setParagraph(mainDiv,row,lastParagraphType,firstLine);
                break;
            default:
                break;
        }
    }
    setList(mainDiv,row,actLvl,lastLevelCounter){
        console.log('DocPreview::setList()'); 
        console.log(lastLevelCounter);
        console.log('ROW');
        console.log(row);
        console.log('NEW LINE');
        console.log(row.paragraph.property.valuenewline);
        console.log('MAIN DIV');
        console.log(mainDiv);
        /*
         * EXCEPTION -> IF n => append to last child
         */
        if(row.paragraph.property.valuenewline==='n' && mainDiv.hasChildNodes()){
            console.log('hasChildNodes');
            console.log(mainDiv.hasChildNodes());
            mainDiv.lastChild.appendChild(this.setParagraphEle(row.paragraph));
            return false;
        }
        /*
         * SET LIST LEVEL TO INT
         */
        var listLvl=parseInt(row.list.property.listLevel,10);
            actLvl = parseInt(actLvl,10);
            
            /*
             * FOR THE FIRST LIST LEVEL CHECK PARAMETER NEW ELE - CONTINUE
             */
        this.setListCounter(row.list.property,listLvl,lastLevelCounter);  
  
        if(listLvl===actLvl){
            console.log('THE SAME LEVEL');
            this.setListEle(mainDiv,row,lastLevelCounter[listLvl]);
            
        }  
        else if(listLvl>actLvl){
            console.log('HIGHER LEVEL:');
            this.setListEle(mainDiv,row,lastLevelCounter[listLvl]);
        }
        else{
            console.log('LOWER LEVEL');
            this.setListEle(mainDiv,row,lastLevelCounter[listLvl]);
        }
    }
    setListCounter(newList,listLvl,lastLevelCounter){
        if(newList.newList==='y'){
            console.log('reset level counter');
            /* reset level counter */
            lastLevelCounter[listLvl]=1;
         }
         else{
             /* CHECK IF EXISTS, NO EXIST ADD - LIST LEVEL */
            if(lastLevelCounter[listLvl]===undefined){
                console.log('UNDEFINED - NEW COUNTER');
                lastLevelCounter[listLvl]=1;
            }
            else{
                console.log('level counter ++');
                lastLevelCounter[listLvl]= lastLevelCounter[listLvl]+1;
            }
        }  
    }
    setListEle(div,row,listEleCounter){
        console.log('DocPreview::setListEle()');
        /*
         * HEAD AS SPAN
         */
        console.log('ROW - LIST:');
        console.log(row.list);
        console.log('ROW - PARAGRAPH:');
        console.log(row.paragraph);
        console.log('ROW - PARAGRAPH - TABSTOP:');
        console.log(row.paragraph.tabstop);
        //var p = document.createElement('p');
        var divWidth=document.createElement('div');
        //var ele = document.createElement('div');
            divWidth.style.width='100%';
            divWidth.style.display='flex';
            divWidth.style.justifyContent=row.paragraph.style.textAlign;
            //divWidth.style.border='1px solid red';
            divWidth.style.padding='0px';
            divWidth.style.margin='0px';

        /* SET LEFT EJECTION */
        this.setTabStopEjection(divWidth,row.paragraph.style.leftEjection);
        /* SET LIST HEAD -> SET indentation,leftEjection AS VALUE NOT REFERENCE*/
        divWidth.appendChild(this.setListEleHead(row,listEleCounter));//
        
        
        /* SET EJECTION TO 0 */
        //row.paragraph.style.leftEjection = 0;
        /* SET LIST BODY */
        //;
        //ele.appendChild(ele);
        divWidth.appendChild(this.setParagraphEle(row.paragraph));
        //divWidth.appendChild(divFloat);
        div.appendChild(divWidth);
        
    }
    setListEleHead(row,listEleCounter){//
        console.log('DocPreview::setListEleHead()');  
        var ele = document.createElement('div');
            ele.style.display='inline-block';
            ele.style.border='0px solid orange';
            ele.style.padding='0px 0px 0px 0px';
            ele.style.margin='0px';
            //ele.style.marginLeft=this.Utilities.setCmToPx(row.paragraph.style.leftEjection).toString()+'px';
            //ele.style.paddingLeft=leftEjection.toString()+'px';
            ele.style.width=this.Utilities.setCmToPx(row.paragraph.style.indentation).toString()+'px';


        //this.setTabStop(ele,row.paragraph);
        this.setEleStyle(ele,row.list.style);
        this.setListEleHeadType(ele,row.list.style.listType,listEleCounter);
        //ele.style.listStyleType=attributes.style.listType;
        
        return ele;
    }
    setTabStopEjection(ele,leftEjection){
        /*console.log('DocPreview::setTabStopEjection()');  
        console.log('ELEMENT'); 
        console.log(ele); 
        console.log('LEFT EJECTION'); 
        console.log(leftEjection); 
                    */
        if(parseFloat(leftEjection)>0){
            ele.appendChild(this.getTabStopEle(leftEjection));
        }
        /*
        console.log('ELEMENT'); 
        console.log(ele); 
        throw 'test-stop';
                    */
    }
    setTabStop(ele,paragraph){
        console.log('DocPreview::setTabStop()');  
        //var tabstop = this.Utilities.setCmToPx();
        //var leftEjectionPx = this.Utilities.setCmToPx(paragraph.style.leftEjection).toString()+'px';
        var actTabStopPosition = 0;
        var end = paragraph.style.leftEjection;
        
        console.log('TABSTOP IDX'); 
        console.log(paragraph.property.tabstop);
        console.log('TABSTOP'); 
        console.log(paragraph.tabstop);
        
        /* COMPARE LEFT EJECTION VALUE WITH TABSTOP VALUE */
        if(paragraph.property.tabstop<0){
            console.log('PARAGRAPH TABSTOP IDX < 0 => EXIT - `NO TABSTOP`');
            return false;
        }
        console.log(paragraph.tabstop.hasOwnProperty(paragraph.property.tabstop));
        if(!paragraph.tabstop.hasOwnProperty(paragraph.property.tabstop)){
            console.log('TABSTOP IDX NOT EXIST IN TABSTOP LIST -> RETURN FALSE');
            return false;
        }
        
        actTabStopPosition = paragraph.tabstop[paragraph.property.tabstop].position;
        
        if(paragraph.tabstop[paragraph.property.tabstop].position <= paragraph.style.leftEjection){
            console.log('TABSTOP PROPERTY POSITION EQUAL OR IS LOWER THAN LEFT EJECTION -> RETURN TRUE');
            return true;
        }
        console.log('TABSTOP PROPERTY POSITION HIGHER THAN LEFT EJECTION -> SET ALL TABSTOP AND RETURN TRUE');
            for (const prop in paragraph.tabstop){
                /* COMPARE POSITIONS, IF GRETER THEN LEAVE LOOP */
                if(paragraph.tabstop[prop].position>actTabStopPosition){
                    break;
                }
                console.log('append');
                    
                var span = this.getTabStopEle((paragraph.tabstop[prop].position)-end);
                //var tmpText = document.createTextNode('aaaa');
                    console.log(paragraph.tabstop[prop].leadingSign);
                    
                this.setTabStopDecoration(span,paragraph.tabstop[prop].leadingSign,paragraph.style.fontSize);
                    
                    ele.appendChild(span);

                    
                end=paragraph.tabstop[prop].position;
            }
        return true;
    }
    setTabStopDecoration(ele,sign,size){
        ele.style.borderRight='0px';
        ele.style.borderLeft='0px';
        ele.style.borderTop='0px';
        /* SIZE div 10 ? */
        //size = size/10;
        ele.style.borderBottom=(this.Utilities.setPtToPx(size)/10).toString()+'px';
        switch(sign){           
            case 'dot':
                /* 
                 * ONLY HTML P 
                ele.style.textDecorationStyle='dotted';  
                */
                ele.style.borderStyle='dotted';
                break;
            case 'dash':
                /* 
                 * ONLY HTML P 
                ele.style.textDecorationStyle='dashed'; 
                */
                ele.style.borderStyle='dashed';
                break;
            case 'underline':
                /* 
                 * ONLY HTML SPAN 
                ele.style.textDecoration='underline';  
                */
                ele.style.borderStyle='solid';
                break;
            case 'none':
            default:    
                break;                
        }
    }
    getTabStopEle(w){
        /*
         * w - width (default in cm)
         */
        var ele = document.createElement('div');
            ele.style.width=this.Utilities.setCmToPx(w).toString()+'px';
            ele.style.display='inline-block';
            ele.style.margin='0px';
            ele.style.padding='0px';
        return ele;
    }
    setListEleHeadType(ele,listType,counter){
        /*
         *   console.log('DocPreview::setListEleHeadType()');  
         * PARSE LIST TYPE
         */
        console.log(listType);
        this.setListSimpleEleHeadType(ele,listType,counter);
        this.setListAdvancedEleHeadType(ele,listType,counter);   
    }
    setListSimpleEleHeadType(ele,listType,counter){
        var span = document.createElement('span');
        switch(listType){
            case 'bullet':
                span.innerHTML='&#8226;';
                break;
            case 'square':
                span.innerHTML='&#9632;';
                break;
            case 'minus':
                span.innerHTML='&#8722;';
                break;
            case 'circle':
                 span.innerHTML='o';            
                break;
            case 'check':
                span.innerHTML='&#10003;';
                break;
            case 'decimal':
                span.innerHTML=counter;
                break;
            case 'decimal-dot':
                span.innerHTML=counter+'.';
                break;
            case 'decimal-round-right-bracket':
                span.innerHTML=counter+')';
                break;
            default:
                //var value = document.createTextNode(counter);
                //ele.appendChild(value);
            break;
        };
        ele.appendChild(span);
    }
    setListAdvancedEleHeadType(ele,listType,counter){
        switch(listType){
            case 'upper-roman':
                ele.appendChild(this.RomanList.upper(counter));
                break;
            case 'lower-roman':
                ele.appendChild(this.RomanList.lower(counter));
                break;
            case 'lower-alpha':
                ele.appendChild(this.AlphabeticalList.lower(counter));
                break;
            case 'upper-alpha':
                ele.appendChild(this.AlphabeticalList.upper(counter));
                break;
            default:
                //var value = document.createTextNode(counter);
                //ele.appendChild(value);
            break;
        };
    }
    setParagraph(mainDiv,row,lastParagraphType,firstLine){
        console.log('DocPreview::setParagraph()');
        console.log(row);
        /*
         * var divWidth=document.createElement('div');
        //var ele = document.createElement('div');
            divWidth.style.width='100%';
            divWidth.style.display='flex';
            divWidth.style.justifyContent=row.paragraph.style.textAlign;
            //divWidth.style.border='1px solid red';
            divWidth.style.padding='0px';
            divWidth.style.margin='0px';
         */
        
        
        /* SET TEMPORARY VALUE */
        //var indentation=row.paragraph.style.indentation;

        switch(row.paragraph.property.valuenewline){
            case 'n':
                /* EXCEPTION - last paragraph type is empty so this is a first element on a list or last element is list*/
                if(lastParagraphType==='' || lastParagraphType==='l'){
                    //row.paragraph.style.indentation=indentation;
                }
                else if(mainDiv.hasChildNodes()){
                    
                    /* TO DO -> NEW TAB STOP */
                    
                    /* CLEAR MARING LEFT */
                    //row.paragraph.style.indentation=0;
                    row.paragraph.style.leftEjection=0;  
                    console.log('hasChildNodes');
                    console.log(mainDiv.hasChildNodes());
                    mainDiv.lastChild.appendChild(this.setParagraphEle(row.paragraph));
                    return true;
                    
                }
                else{
                    
                }
               
                break;
            case 'y':
                /* EXCEPTION */
                
                if(lastParagraphType==='l'){

                }
                else if(firstLine){
                    /* EXCEPTION 2 */
                }
                else{
                    /* ADD EXCEPTION FOR FIRST LINE */
                    //throw 'first line 447';
                    var divBr = document.createElement('div');
                        divBr.style.width='100%';
                    mainDiv.appendChild(divBr);
                }
                
                break;
            default:
                console.log('wrong valuenewline:');
                console.log(row.paragraph.property.valuenewline);
                break;
        }
        
        var divWidth=document.createElement('div');
        //var ele = document.createElement('div');
            divWidth.style.width='100%';
            divWidth.style.display='flex';
            divWidth.style.justifyContent=row.paragraph.style.textAlign;
            //divWidth.style.border='1px solid red';
            divWidth.style.padding='0px';
            divWidth.style.margin='0px';
        
        /* LEFT EJECTION - WYSUNIECIE */
        this.setTabStopEjection(divWidth,row.paragraph.style.leftEjection);
        divWidth.appendChild(this.setParagraphEle(row.paragraph));
        mainDiv.appendChild(divWidth);
    }
    setParagraphEle(paragraph){
        console.log('DocPreview::setParagraphEle()'); 
        var ele = document.createElement('div');//'span','p'
            ele.style.display='inline-block';
            ele.style.border='0px solid purple';
            ele.style.padding='0px 0px 0px 0px';
            ele.style.margin='0px';
            
        //var span = document.createElement('span');//'span','p'
            this.setEleStyle(ele,paragraph.style);
            /* SET TAB STOP */
            this.setTabStop(ele,paragraph);
            //span.style.marginLeft=this.Utilities.setCmToPx(paragraph.style[marginLeft]);//
        var value = document.createTextNode(paragraph.property.value);
            ele.appendChild(value);
            
            console.log(ele);
            
        return ele;
    }
    setEleStyle(ele,style){
        console.log('DocPreview::setEleStyle()');  
        ele.style.fontSize=style.fontSize+style.fontSizeMeasurement;
        ele.style.fontFamily=style.fontFamily;
        ele.style.color=style.color;
        ele.style.backgroundColor=style.backgroundColor;
        ele.style.fontWeight='normal';
        ele.style.marginBottom="0px";
        
        /* SET TEXT-DECORATION */ 
        this.Style.setTextDecoration(ele,style);
        /* SET FONT-WEIGHT */ 
        if(style.fontWeight==='1'){
            ele.style.fontWeight='bold';
        }
        /* SET ITALIC */ 
        if(style.fontStyle==='1'){
            ele.style.fontStyle='italic';
        }
    }
}