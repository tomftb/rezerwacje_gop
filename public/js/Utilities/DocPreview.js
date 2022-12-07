/* 
 * WORD DOC PREVIEW
 * Author: Tomasz Borczynski
 */
class DocPreview extends DocPreviewPage{
   
    Style = new Object();
    RomanList = new Object();
    AlphabeticalList = new Object();
    Paragraph = new Object();
    TabStop = new Object();

    constructor(){
        super();
        console.log('DocPreview::constructor()');
       
        this.RomanList = new RomanList();
        this.AlphabeticalList = new AlphabeticalList();
        this.Paragraph = new DocPreviewParagraph();
        this.TabStop = new DocPreviewTabStop();
    }
    run(helplink,data){
        console.log('DocPreview.run()');
        this.helplink=helplink;
        this.data=data;
        this.setPageValue('body','checkNewPage');
    }
    runFooter(helplink,data){
        console.log('DocPreview.runFooter()');
        this.helplink=helplink;
        this.data=data;
        this.setPageValue('footer','noNewPage');
    }
    runHeading(helplink,data){
        console.log('DocPreview.runHeading()');
        this.helplink=helplink;
        this.data=data;
        this.setPageValue('heading','noNewPage');
    }
    setPageValue(part,checkNewPage){
        // console.log('DocPreview::setPageValue()');
        var writePageSectionWidth=607;
        var subsectionCount=0;
        var firstSection = true;
        var blankPage = super.getPage();
        /* LOOP OVER  SECTION */   
        //console.log(this.data.section);
        //throw 'aaa';
        for(const property in this.data.section){
            
            blankPage = this[checkNewPage](firstSection,this.data.section[property],blankPage,part);
            //console.log(blankPage);
            //var writePage = 
            subsectionCount=Object.keys(this.data.section[property].subsection).length;
            /* CHECK AND SETUP COLUMNS NUMBER */
            writePageSectionWidth=Math.floor(607/subsectionCount); /* minus padding left 92px */ 
            /* LOOP OVER SUBSECTION - VISIBLE */
            //console.log('subsectionCount');
            //console.log(subsectionCount);
            //console.log(this.data.section[property]);
            var divSection=document.createElement('div');
                //divSection.style.backgroundColor=this.data.style.backgroundColor;
                divSection.style.width='699px';
                divSection.style.border='0px solid green';
                divSection.style.margin='0px';
                divSection.style.padding='0px 0px 0px 0px';
                console.log(divSection);
                //divSection.style.display='block';
            //throw 'aaaa';
            for(var i=0;i<subsectionCount;i++){
                var writePageSection=document.createElement('div');
                    //writePageSection.style.backgroundColor=this.data.style.backgroundColor;
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
                    /* FIRST LOOP TO SETUP MAX FONT SIZE -> IN FUTER MORE OPTIONS ??*/
                   
                    this.Paragraph.setUpMaxFontSize(this.data.section[property].subsection[i].subsectionrow);
                   
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
                    /* CLEAR TMP PROPERTY */
                    //this.Paragraph.removeTmpProperty(this.data.section[property].subsection[i].subsectionrow);
                console.log(writePageSection);   
                //console.log('HEIGH:');
                /* Display the height and width of "myDIV", including padding and border: in px offsetHeight clientHeight */
                /* IMPORTANT Why I am getting Element offsetHeight "0"? even element original height is not showing */

                divSection.appendChild(writePageSection);
                blankPage[part].appendChild(divSection);
            }
        firstSection = false;
        /* END LOOP OVER SECTION */     
        };
    }
    checkNewPage(firstSection,property,blankPage,part){
        console.log('DocPreview::checkNewPage()');
        if(firstSection){
            /* UPDATE PAGE ATTRIBUTES */
            //blankPage[part].style.backgroundColor=property.style.backgroundColor;
            return blankPage;
        }
        if(property.property.valuenewline==='1'){
            console.log('SET NEW BLANK PAGE');
            var newBlankPage = super.getPage();
             /* UPDATE PAGE ATTRIBUTES */
            //newBlankPage.style.backgroundColor=property.style.backgroundColor;
            console.log(newBlankPage);
            return newBlankPage;
        }
        return blankPage;
    }
    noNewPage(firstSection,property,blankPage,part){
        /* SET OPACITY - MS WORD SET 0.5 */
        //blankPage[part].style.backgroundColor=property.style.backgroundColor;
        
        blankPage[part].style.opacity='0.5';
        //console.log(blankPage[part].style);
        //throw 'aaaaaaa';
        //blankPage[part].style.opacity='0,6';
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
        if(row.paragraph.property.valuenewline==='0' && mainDiv.hasChildNodes()){
            console.log('hasChildNodes');
            console.log(mainDiv.hasChildNodes());
            mainDiv.lastChild.appendChild(this.getParagraphEle(row));
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
        this.TabStop.setEjection(divWidth,row.paragraph.style.leftEjection);
        /* SET LIST HEAD -> SET indentation,leftEjection AS VALUE NOT REFERENCE*/
        divWidth.appendChild(this.setListEleHead(row,listEleCounter));//
        
        
         /* 
                SET MARGIN:
                - SpaceBefore
                - SpaceAfter
                - LineSpacing
            */

                this.Paragraph.setSpace(divWidth,row,'marginTop');//ele.style.marginTop=
                this.Paragraph.setSpace(divWidth,row,'marginBottom');//ele.style.marginBottom=
                this.Paragraph.setLineSpacing(divWidth,row);
        //ele.appendChild(ele);
        divWidth.appendChild(this.getParagraphEle(row));
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
        this.Paragraph.setParagraphBoxStyle(ele,row.list.style);
        this.setListEleHeadType(ele,row.list.style.listType,listEleCounter);
        //ele.style.listStyleType=attributes.style.listType;
        
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
        console.log("DocPreview::setParagraph()\nrow:",row,"\nvaluenewline:",row.paragraph.property.valuenewline);

        switch(row.paragraph.property.valuenewline){
            case '0':
                console.log("lastParagraphType===\r",lastParagraphType);
                /* EXCEPTION - last paragraph type is empty so this is a first element on a list or last element is list*/
                if(lastParagraphType==='' || lastParagraphType==='l'){

                }
                else if(mainDiv.hasChildNodes()){
                    /* TO DO -> NEW TAB STOP */
                    /* CLEAR MARING LEFT */
                    row.paragraph.style.leftEjection=0;  
                    mainDiv.lastChild.appendChild(this.getParagraphEle(row));
                    return true;
                }
                else{

                }
                break;
            case '1':        
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
            //divWidth.style.height='100px';
            divWidth.style.display='flex';
            divWidth.style.justifyContent=row.paragraph.style.textAlign;
            //divWidth.style.border='1px solid red';
            divWidth.style.padding='0px';
            //divWidth.style.margin='0px';

            /* 
                SET MARGIN:
                - SpaceBefore
                - SpaceAfter
                - LineSpacing
            */

            this.Paragraph.setSpace(divWidth,row,'marginTop');//ele.style.marginTop=
            this.Paragraph.setSpace(divWidth,row,'marginBottom');//ele.style.marginBottom=
            this.Paragraph.setLineSpacing(divWidth,row);

        /* LEFT EJECTION - WYSUNIECIE */
            this.TabStop.setEjection(divWidth,row.paragraph.style.leftEjection);
            divWidth.appendChild(this.getParagraphEle(row));
            mainDiv.appendChild(divWidth);
    }
    getParagraphEle(row){
        console.log('DocPreview::getParagraphEle()',row); 
        var ele = document.createElement('div');
            ele.style.display='inline-block';
            ele.style.border='0px solid purple';
            ele.style.padding='0px 0px 0px 0px';
            ele.style.margin='0px 0px 0px 0px';
            /* SET PARAGRAPH STYLE */
            this.Paragraph.setParagraphBoxStyle(ele,row.paragraph.style);
            /* SET TAB STOP */
            this.TabStop.set(ele,row.paragraph);
        /* PARSE VALUE - VARIABLE */
        this.swapVariablePropertyWithValue(row.paragraph);
        /* CLEAR EXTRA 3 margin top and bottom */
        var p=this.Paragraph.getParagraph(ele,row);
        /*
            ADD WHITESPACE UNICODE
        */
        var value=row.paragraph.property.value.replace(/\s/g,'\u00A0');
            p.append(document.createTextNode(value));
            ele.appendChild(p);
            //ele.appendChild(document.createTextNode(value));
            for(const prop in row.image){
                var getImage = (row.image[prop].data.tmp==='n')? 'getStageImage' : 'getTmpStageImage';
                var img = document.createElement('img');
                    img.setAttribute('src',window.router+getImage+'&file='+row.image[prop].property.uri);
                    img.setAttribute('alt',row.image[prop].property.name);
                    img.setAttribute('width',row.image[prop].style.width);
                    img.setAttribute('height',row.image[prop].style.height);
                    ele.appendChild(img);
            }     
        //console.log(ele);     
        return ele;
    }
    swapVariablePropertyWithValue(paragraph){
        
        //&$value='',$variable=[]
        //console.log('DocPreview::swapVariablePropertyWithValue()');
        //console.log(paragraph.property.value);
        //console.log(paragraph.variable);
        if(paragraph.variable.length===0){
            return false;
        }
        var newValue='';
        var open=false;
        var tmpVariable='';
        for(var i = 0; i<paragraph.property.value.length;i++){
            let char = paragraph.property.value.substr(i,1);
                //console.log(char);
                if(char==='['){
                    open=true;     
                    newValue+=char;
                    /*SKIP NEXT CHECK*/
                    continue;
                }
                /*IN FUTER SKIP WHITE SPACES */
                if(open===true && char!==']'){
                    tmpVariable+=char;
                    /*SKIP NEXT CHECK*/
                    continue;
                }
                if(char===']' && open===true && tmpVariable!==''){
                    newValue=this.swapProperty(newValue,tmpVariable,paragraph.variable);
                    tmpVariable='';
                    open=false; 
                    /* skip */
                    continue;
                }
                newValue+=char;
            }
            paragraph.property.value=newValue;
        return true;
    }
    swapProperty(newValue,tmpVariable,variable){
        console.log("DocPreview::swapProperty()");
        console.log("tmp value:");
        console.log(newValue);
        console.log("tmp variable:");
        console.log(tmpVariable);
        var tmpVariableList=new Array();
        var found=false;

        for(var i=0; i<variable.length;i++){
            console.log("act variable:");
            console.log(variable[i]);
            console.log(variable[i].name);
            console.log(typeof(variable[i].name));
            if(variable[i].name===tmpVariable){
                console.log("found variable name");
                //echo $tmpVariable."\r\n";
                if(variable[i].type==='zmienna'){
                    console.log(" -- zmienna -- ");
                    /* cut last [ char ];*/
                    newValue=newValue.substr(0,newValue.length -1);
                    newValue+=variable[i].value;
                    found=true;
                }
                /* SKIP */
                continue;
            }
            //echo "set new variable list array\r\n";
            
            tmpVariableList.push(variable[i]);
        }
        /* IF NOT FOUND OR IS A VARIABLE TEXT */
        if(!found){
            newValue+=tmpVariable+']';
        }
        //echo "ACT TMP VARIABLE LIST:\r\n";
       // print_r($tmpVariableList);
        variable=tmpVariableList;
        return newValue;
    }
}