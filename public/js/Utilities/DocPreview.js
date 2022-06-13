/* 
 * WORD DOC PREVIEW
 * Author: Tomasz Borczynski
 */
class DocPreview{
    Html = new Object();
    Style = new Object();
    RomanList = new Object();
    Utilities = new Object();
    helplink = new Object();
    data = new Object();
    constructor(){
        console.log('DocPreview::constructor()');
        this.Html=new Html();
        this.Style = new Style();
        this.RomanList = new RomanList();
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
                    writePageSection.style.border='0px';
                    writePageSection.style.margin='0px';
                    writePageSection.style.cssFloat='LEFT';
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
                        this.setPageValueEle(writePageSection,this.data.section[property].subsection[i].subsectionrow[propSubsection],actListLevel,lastLevelCounter,actParagraphType);
                        
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
    setPageValueEle(mainDiv,row,actLvl,lastLevelCounter,lastParagraphType){
        /*
            console.log(row);
            console.log('Paragraph type:');
            console.log(row.paragraph.property.paragraph);
            throw 'aaaa';
         */
        switch(row.paragraph.property.paragraph){
            case 'l':
                this.setList(mainDiv,row,actLvl,lastLevelCounter);
                break;
            case 'p':
                this.setParagraph(mainDiv,row,lastParagraphType);
                break;
            default:
                break;
        }
    }
    setList(mainDiv,row,actLvl,lastLevelCounter){
        console.log('DocPreview::setList()'); 
       
        console.log(lastLevelCounter);
        
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
        console.log(row.paragraph.tabStop);
        var p = document.createElement('p');
        /* REMOVE MARGIN - LATER SEt AS ... */
            p.style.marginBottom="0px";
        
        /* SET LIST HEAD */
        p.appendChild(this.setListEleHead(row,listEleCounter));
        /* SET LIST BODY */
        //p.appendChild(this.setParagraph(div,row));
        p.appendChild(this.setParagraphEle(row.paragraph,'indentation'));
        div.appendChild(p);
    }
    setListEleHead(row,listEleCounter){
        console.log('DocPreview::setListEleHead()');  
        var span = document.createElement('span');
        //console.log('STYLE:');
        //console.log(list.style);
        //console.log('PROPERTY:');
        //console.log(list.property);
        
        //span.style.marginLeft=this.Utilities.setCmToPx(row.paragraph.style.leftEjection);
        this.setTabStop(span,row.paragraph);
        this.setEleStyle(span,row.list.style);
        this.setListEleHeadType(span,row.list.style.listType,listEleCounter);
        //ele.style.listStyleType=attributes.style.listType;
        
        return span;
    }
    setTabStop(ele,paragraph){
        console.log('DocPreview::setTabStop()');  
        //var tabStop = this.Utilities.setCmToPx();
        ele=this.Utilities.setCmToPx(paragraph.style.leftEjection);
        console.log('LEFT EJECTION');  
        console.log(paragraph.style.leftEjection);
        console.log('TABSTOP IDX'); 
        console.log(paragraph.property.tabStop);
        console.log('TABSTOP'); 
        console.log(paragraph.tabStop);
    }
    setListEleHeadType(ele,listType,counter){
        /*
         *   console.log('DocPreview::setListEleHeadType()');  
         * PARSE LIST TYPE
         */
        console.log(listType);
        //throw 'aaaaa';
        switch(listType){
            case 'upper-roman':
                ele.appendChild(this.RomanList.setUpperRoman(counter));
                break;
            case 'lower-roman':
                ele.appendChild(this.RomanList.setLowerRoman(counter));
                break;
            default:
                var value = document.createTextNode(counter);
                ele.appendChild(value);
            break;
        };
    }

    setParagraph(mainDiv,row,lastParagraphType){
        console.log('DocPreview::setParagraph()');
        console.log(row);
        /* SET TEMPORARY VALUE */
        //var indentation=row.paragraph.style.indentation;

        switch(row.paragraph.property.valuenewline){
            case 'n':
                /* EXCEPTION - last paragraph type is empty so this is a first element on a list or last element is list*/
                if(lastParagraphType==='' || lastParagraphType==='l'){
                    //row.paragraph.style.indentation=indentation;
                }
                else{
                    /* CLEAR MARING LEFT */
                    //row.paragraph.style.indentation=0;
                    row.paragraph.style.leftEjection=0;
                }
               
                break;
            case 'y':
                /* EXCEPTION */
                if(lastParagraphType==='l'){

                }
                else{
                    mainDiv.appendChild(document.createElement('br'));
                }
                
                break;
            default:
                console.log('wrong valuenewline:');
                console.log(row.paragraph.property.valuenewline);
                break;
        }
       
        
        
        
        
        mainDiv.appendChild(this.setParagraphEle(row.paragraph,'leftEjection'));
        
        /* CHECK FOR BREAKLINE AND SET TEXT ALIGN => FOR VALUE SET VALUE NOT A REFERENCE ! */                 
        //p = this.setPreviewPageBreakLine(writePageSection,p,this.stageData.section[property].subsection[i].subsectionrow[propSubsection].data.valuenewline,this.stageData.section[property].subsection[i].subsectionrow[propSubsection].style.textAlign);//
        /* SETUP SUBSECTION ROW */
        //this.setPreviewValue(p,this.stageData.section[property].subsection[i].subsectionrow[propSubsection]);
        //writePageSection.appendChild(p);
    }
    setParagraphEle(paragraph,marginLeft){
        console.log('DocPreview::setParagraphEle()');  
        var span = document.createElement('span');//'span','p'
            this.setEleStyle(span,paragraph.style);
            /* INDENTATION - WYSUNIECIE */
            span.style.marginLeft=this.Utilities.setCmToPx(paragraph.style[marginLeft]);//
        var value = document.createTextNode(paragraph.property.value);
            span.appendChild(value);
        return span;
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