/* 
 * WORD DOC PREVIEW
 * Author: Tomasz Borczynski
 */
class DocPreview extends DocPreviewPage{
   
    Style = new Object();
    RomanList = new Object();
    AlphabeticalList = new Object();
    
    helplink = new Object();
    data = new Object();
    constructor(){
        super();
        console.log('DocPreview::constructor()');
        
        this.Style = new Style();
        this.RomanList = new RomanList();
        this.AlphabeticalList = new AlphabeticalList();

    }
    run(helplink,data){
        console.log('DocPreview::setData()');
        this.helplink=helplink;
        this.data=data;
        this.setPageValue();
    }

    setPageValue(){
        // console.log('DocPreview::setPageValue()');
        var writePageSectionWidth=607;
        var subsectionCount=0;
        var firstSection = true;
        var blankPage = super.getPage();

        /* LOOP OVER  SECTION */   
        console.log(this.data.section);
        //throw 'aaa';
        for(const property in this.data.section){
            
            blankPage = this.checkNewPage(firstSection,this.data.section[property],blankPage);
            //var writePage = 
            subsectionCount=Object.keys(this.data.section[property].subsection).length;
            /* CHECK AND SETUP COLUMNS NUMBER */
            writePageSectionWidth=Math.floor(607/subsectionCount); /* minus padding left 92px */ 
            /* LOOP OVER SUBSECTION - VISIBLE */
            console.log('subsectionCount');
            console.log(subsectionCount);
            console.log(this.data.section[property]);
            var divSection=document.createElement('div');
                divSection.style.width='699px';
                divSection.style.border='0px solid green';
                divSection.style.margin='0px';
                divSection.style.padding='0px 0px 0px 0px';
                //divSection.style.display='block';
            //throw 'aaaa';
            for(var i=0;i<subsectionCount;i++){
                var writePageSection=document.createElement('div');
                    writePageSection.style.width=writePageSectionWidth+'px';
                    writePageSection.style.border='0px solid blue';
                    writePageSection.style.margin='0px';
                    writePageSection.style.padding='0px 0px 0px 0px';
                    writePageSection.style.float='left';
                //writePageSection.style.display='inline-block';
                /* IN FUTURE SETUP SUBSECTION DATA */
                /* IN FUTURE SETUP SUBSECTION PROPERTY */
                /* IN FUTURE SETUP SUBSECTION STYLE */
                    /* NEW PARAGRAPH -> TO DO SET PARAGRAPH STYLE -> MARGIN -> PADDING ...*/
                    /* NEW LIST */   
                    var actListLevel=1;         
                    var lastLevelCounter = new Object();
                    var actParagraphType='';
                    var firstLine = true;
                    /* VIRTUAL - MUST BY SETUP BY RETURN */

                    /* LOOP OVER SUBSECTION ROW */
                    for(const propSubsection in this.data.section[property].subsection[i].subsectionrow){               
                        /* SET LIST UL */
                        /* VIRTUAL - MUST BY SETUP BY RETURN */
                        /* CHANGE TO P -> NO POSSIBIITY TO SET CONTINUE LIST ATTRIBUTE !!  VIRTUAL COUNTER */
                        
                        /* FOR TESTS */
                        //listEleCounter=parseInt(this.data.section[property].subsection[i].subsectionrow[propSubsection].paragraph.property.value,10);
                        this.setPageValueEle(writePageSection,this.data.section[property].subsection[i].subsectionrow[propSubsection],actListLevel,lastLevelCounter,actParagraphType,firstLine);
                        firstLine=false;            
                         /* CHECK IS NEW LI OR CONTINUE */

                        actListLevel=this.data.section[property].subsection[i].subsectionrow[propSubsection].list.property.listLevel;
                        actParagraphType=this.data.section[property].subsection[i].subsectionrow[propSubsection].paragraph.property.paragraph;
                        /* END LOOP OVER SUBSECTION ROW */
                    }                     
                /* END LOOP OVER SUBSECTION -  */   
                console.log(writePageSection);   
                console.log('HEIGH:');
                /* Display the height and width of "myDIV", including padding and border: in px offsetHeight clientHeight */
                /* IMPORTANT Why I am getting Element offsetHeight "0"? even element original height is not showing */

                divSection.appendChild(writePageSection);
                blankPage.childNodes[0].appendChild(divSection);
            }
        firstSection = false;
        /* END LOOP OVER SECTION */     
        };
    }
    checkNewPage(firstSection,property,blankPage){
        console.log('DocPreview::checkNewPage()');
        
        if(firstSection){
            /* UPDATE PAGE ATTRIBUTES */
            blankPage.style.backgroundColor=property.style.backgroundColor;
            return blankPage;
        }
        if(property.property.valuenewline==='y'){
            console.log('SET NEW BLANK PAGE');
            var newBlankPage = super.getPage();
             /* UPDATE PAGE ATTRIBUTES */
            newBlankPage.style.backgroundColor=property.style.backgroundColor;
            console.log(newBlankPage);
            return newBlankPage;
        }
        return blankPage;
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
        divWidth.appendChild(this.setParagraphEle(row));
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
            ele.style.width=this.Utilities.setCmToPx(row.paragraph.style.indentation).toString()+'px';
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
        
        //console.log('TABSTOP IDX'); 
        //console.log(paragraph.property.tabstop);
        //console.log('TABSTOP'); 
        //console.log(paragraph.tabstop);
        
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
            case 'lower-alpha-round-right-bracket':
                ele.appendChild(this.AlphabeticalList.lowerExtend(counter,')'));
                break;
            case 'lower-alpha-dot':
                ele.appendChild(this.AlphabeticalList.lowerExtend(counter,'.'));
                break;
            case 'upper-alpha-round-right-bracket':
                ele.appendChild(this.AlphabeticalList.upperExtend(counter,')'));
                break;
            case 'upper-alpha-dot':
                ele.appendChild(this.AlphabeticalList.upperExtend(counter,'.'));
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
                    mainDiv.lastChild.appendChild(this.setParagraphEle(row));
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
        divWidth.appendChild(this.setParagraphEle(row));
        mainDiv.appendChild(divWidth);
    }
    setParagraphEle(row){
        console.log('DocPreview::setParagraphEle()'); 
        var ele = document.createElement('div');//'span','p'
            ele.style.display='inline-block';
            ele.style.border='0px solid purple';
            ele.style.padding='0px 0px 0px 0px';
            ele.style.margin='0px';
            
        //var span = document.createElement('span');//'span','p'
            this.setEleStyle(ele,row.paragraph.style);
            /* SET TAB STOP */
            this.setTabStop(ele,row.paragraph);
            //span.style.marginLeft=this.Utilities.setCmToPx(paragraph.style[marginLeft]);//
        console.log(row);
        var value = document.createTextNode(row.paragraph.property.value);
            ele.appendChild(value);
            for(const prop in row.image){
                var getImage = (row.image[prop].data.tmp==='n')? 'getStageImage' : 'getTmpStageImage';
                var img = document.createElement('img');
                    img.setAttribute('src',window.router+getImage+'&file='+row.image[prop].property.uri);
                    img.setAttribute('alt',row.image[prop].property.name);
                    img.setAttribute('width',row.image[prop].style.width);
                    img.setAttribute('height',row.image[prop].style.height);
                    ele.appendChild(img);
            }     
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