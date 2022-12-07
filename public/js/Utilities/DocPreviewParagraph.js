class DocPreviewParagraph{
    Utilities=new Object();
    Style = new Object();
    //maxFontSize=0;
    constructor(){
        console.log('DocPreviewParagraph::constructor()');
        this.Utilities = new Utilities();
        this.Style = new Style();
    }
    setSpace(ele,row,direction){
        /* 
            SET PARAGRAPH MARIGN TOP - BOTTOM
        */
        console.log('DocPreviewParagraph::setSpace()'); 
        //console.log(row.paragraph.style[direction],direction,ele);
        /* SET DEFAULT VALUE AND Measurement */
        var value='0';
        /* CHECK VALUE PROPERTY */
        if(row.paragraph.style.hasOwnProperty(direction)){
            value=row.paragraph.style[direction];
        }
        /* CHECK MEASUREMENT PROPERTY */
        if(row.paragraph.style.hasOwnProperty(direction+'Measurement')){
            //value=this.Utilities.getValueInPx(value,row.paragraph.style[direction+'Measurement']);    
            value=this.Utilities.getValueInPx(value,row.paragraph.style[direction+'Measurement']);    
        }
        //console.log(value);
        ele.style[direction]=value.toString()+'px';
    }
    setLineSpacing(ele,row){
       // console.log("DocPreviewParagraph::setLineSpacing()\rele\r:",ele,"\rrow:\r",row,'line spacing - ',row.paragraph.style.lineSpacing);
        this[row.paragraph.style.lineSpacing+'LineSpacing'](ele,row);
    }
    exactlyLineSpacing(ele,row){
        console.log("DocPreviewParagraph::exactlyLineSpacing()\rele\r:",ele,"\rrow:\r",row);
        //var h = this.Utilities.getValueInPx(row.paragraph.style.lineSpacingValue,row.paragraph.style.lineSpacingMeasurement);
        ele.style.height=(row.paragraph.tmp.lineSpacingHeightBox).toString()+'px';
        //ele.style.height=h.toString()+'px';
    }
    singleLineSpacing(ele,row){
        console.log("DocPreviewParagraph::singleLineSpacing()\rele\r:",ele,"\rrow:\r",row);
        /* NOTHING TO DO */
    }
    oneAndHalfLineSpacing(ele,row){
        console.log("DocPreviewParagraph::oneAndHalfLineSpacing()\rele\r:",ele,"\rrow:\r",row);
        this.multiplyLineSpacing(ele,row.paragraph.tmp.maxFontBoxSize,0.5);
    }
    doubleLineSpacing(ele,row){
        console.log("DocPreviewParagraph::doubleLineSpacing()\rele\r:",ele,"\nrow:\r",row);
        this.multiplyLineSpacing(ele,row.paragraph.tmp.maxFontBoxSize,1);
    }
    multipleLineSpacing(ele,row){
        console.log("DocPreviewParagraph::multipleLineSpacing()\rele\r:",ele,"\rrow:\r",row);
        var mb=this.getMarginValue(ele.style.marginBottom);
        var mfsb=row.paragraph.tmp.maxFontBoxSize;
        var na=row.paragraph.tmp.multiple;
        //var na = this.countMultiple(row.paragraph.style.lineSpacingValue,row.paragraph.style.lineSpacingMeasurement);
            //var na = measurement[row.paragraph.style.lineSpacingMeasurement](lsv);
            console.log('na value:',na);
            console.log('margin bottom:',mb);
            console.log('max font size box:',mfsb);
        //if(row.paragraph.tmp.multiple<1){
        if(na<1){
            ele.style.height=(mfsb*na).toString()+'px';
        }
        else{
            ele.style.marginBottom=(mfsb*(na-1)).toString()+'px';
        }
    }
    atLeastLineSpacing(ele,row){
        console.log("DocPreviewParagraph::atLeastLineSpacing()\nele\r:",ele,"\nrow:\r",row,"\nexactl:",row.paragraph.tmp.lineSpacingHeight,"\maxFontBoxSize:",row.paragraph.tmp.maxFontBoxSize);
        /* NOTHING TO DO */
    }

    getMarginValue(margin){
        var currentMarginBottom=margin.toString().split('px');
        return parseFloat(currentMarginBottom[0]);
    }
    getParagraphFontSize(style){
        return this.Utilities.getValueInPx(style.fontSize,style.fontSizeMeasurement);
    }
    multiplyLineSpacing(ele,mfsb,multiplier){
        console.log("DocPreviewParagraph::multiplyLineSpacing()\nele\r:",ele,"\nmfsb:\r",mfsb,"\nmultiplier:",multiplier);
        /*
            mfsb - max font size box
        */
        /* actual margin bottom (odstep po) */
        var marginBottom=this.getMarginValue(ele.style.marginBottom);

        var paragraphFontSize=mfsb*multiplier;   
            console.log('NEW margin bottom in px- ',marginBottom+paragraphFontSize,'px');
        ele.style.height=(mfsb).toString()+'px';
        ele.style.marginBottom=(marginBottom+paragraphFontSize).toString()+'px';
    }
    getParagraph(ele,row){
        console.log('DocPreviewParagraph::getParagraph()');
        var fs=this.getParagraphFontSize(row.paragraph.style);
            //console.log(fs);
       
        var p=document.createElement('p');
            p.style.padding='0px 0px 0px 0px';
            /* top, right,bottom,left */
            p.style.margin='0px 0px 0px 0px';
            //p.style.height='10px';
            //p.style.fontSize=fs.toString()+'px';
            //p.style.fontSize=this.getParagraphFontSize(row.paragraph.style).toString()+'px';
            this.setParagraphStyle(p,row,fs,ele);
        return p;
    }
    setParagraphBoxStyle(ele,style){
        console.log('DocPreviewParagraph::setStyle()'); 
        ele.style.fontSize=this.getParagraphFontSize(style).toString()+'px';
        ele.style.fontFamily=style.fontFamily;
        ele.style.color=style.color;
        ele.style.backgroundColor=style.backgroundColor;
        ele.style.fontWeight='normal';
        ele.style.marginBottom="0px";
        /* HIDDEN ELEMENT IF OUT */
        ele.style.overflow='hidden';
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
    setUpMaxFontSize(allRow){
        /* 
            TO DO
            CAN BE CHANGET TO ANOTHER NAME WITH MORE FUNCTIONS    
        */
        //console.log("DocPreviewParagraph::setUpMaxFontSize()");//\rallRow:,allRow
        /* CLEAR => SET maxFontSize = 0 */
        var tmp= new Object();
        var i=-1;
        for(const prop in allRow){
            console.log(allRow[prop]);
            if(allRow[prop].paragraph.property.valuenewline==='1'){
                i++;
                let mfs=this.getMax(0,allRow[prop].paragraph.style);
                let mfsb=mfs*1.5;
                let lsh=this.Utilities.getValueInPx(allRow[prop].paragraph.style.lineSpacingValue,allRow[prop].paragraph.style.lineSpacingMeasurement);
                let lshb=lsh*1.5;
                let m = this.countMultiple(allRow[prop].paragraph.style.lineSpacingValue,allRow[prop].paragraph.style.lineSpacingMeasurement);
                tmp[i]={
                    key:new Array(prop),
                    maxFontSize:mfs,
                    maxFontBoxSize:mfsb,
                    lineSpacing:allRow[prop].paragraph.style.lineSpacing,
                    lineSpacingHeight:lsh,
                    lineSpacingHeightBox:lshb,
                    atLeastMarginTopBox:this.countAtLeast(lshb,mfsb),
                    multipleMarginTopBox:this.getMaxMultipleBox(m,mfsb,mfsb),
                    multiple:m
                };
                continue;
            }
            tmp[i].key.push(prop);
            tmp[i].maxFontSize=this.getMax(tmp[i].maxFontSize,allRow[prop].paragraph.style);
            tmp[i].maxFontBoxSize=tmp[i].maxFontSize*1.5;
            tmp[i].multipleMarginTopBox=this.getMaxMultipleBox(tmp[i].multiple,tmp[i].multipleMarginTopBox,tmp[i].maxFontBoxSize);
            tmp[i].atLeastMarginTopBox=this.countAtLeast(tmp[i].lineSpacingHeightBox,tmp[i].maxFontBoxSize);
        }
        //console.log(tmp);
        //console.log(allRow);
        /* SET TMP MAX SIZE */
        for(const prop in allRow){
            let fs=this.Utilities.getValueInPx(allRow[prop].paragraph.style.fontSize,allRow[prop].paragraph.style.fontSizeMeasurement);
            for(const t in tmp){
                if(tmp[t].key.includes(prop)){
                    //console.log('includes');
                    allRow[prop].paragraph['tmp']={
                        //maxFontSize:tmp[t].maxFontSize,
                        lineSpacing:tmp[t].lineSpacing,
                        maxFontBoxSize:tmp[t].maxFontBoxSize,
                        lineSpacingHeight:tmp[t].lineSpacingHeight,
                        lineSpacingHeightBox:tmp[t].lineSpacingHeightBox,
                        atLeastMarginTopBox:tmp[t].atLeastMarginTopBox+tmp[t].maxFontBoxSize-(fs*1.5),
                        exactlyMarginTop:tmp[t].lineSpacingHeight-fs,
                        exactlyMarginTopBox:(tmp[t].lineSpacingHeight*1.5)-(fs*1.5),
                        marginTopBox:tmp[t].maxFontBoxSize-(fs*1.5),
                        multiple:tmp[t].multiple,
                        multipleMarginTopBox:tmp[t].multipleMarginTopBox
                    };
                }
            }
        }  
    }
    getMax(actMax,rowParagraphStyle){
        var fs=this.getParagraphFontSize(rowParagraphStyle);
            if(fs>actMax){
                /* RETURN NEW MAX */
                return fs;
            }
            return actMax;
    }
    getMaxMultipleBox(m,mfsbo,mfsbn){
        /*
            m - multiple in n/a
            mfsbo - max font size box old
            mfsbn - max font size bon new
        */
        if(m>1){
            return 0;
        }
        if(mfsbo<mfsbn){
            return mfsbn-(mfsbn*m);
        }
        return mfsbo;
    }
    /* NOT USED */
    getMin(actMin,rowParagraphStyle){
        var fs=this.getParagraphFontSize(rowParagraphStyle);
        if(fs<actMin){
            /* RETURN NEW MIN */
            return fs;
        }
        return actMin;
    }
    countAtLeast(height,fontBox){
        var diff=height-fontBox;
        //console.log("countAtLeast:",diff);
        if(diff>0){
            return diff;
        }
        return 0;
    }
    countMultiple(lsv,lsm){
        /*
            v - line space value
            m - line sapce measurement
        */
        /* COUNT MULTIPLY
            12 pkt = 1 n/a
            1 pkt ~ 0.0834 n/a
            1 cm = 2.36 n/a
            0,5cm = 1.18 n/a
            1 mm = 0,236 n/a
        */
            lsv=parseFloat(lsv);
        var measurement={
            'mm':function(v){
                return v*0.236;
            },
            'cm':function(v){
                /* 1 cm = 2.36 n/a */
                return v*2.36;
            },
            'pt':function(v){
                /* 1 point = 0,035 277 777 777 778 cm */
                return v*0.035277777777778*2.36;
            },
            'pkt':function(v){
                /* 12 pkt = 1 n/a */
                return v/12;
            },
            'px':function(v){
                /* 1px = 0.026 458 333 333 333 cm */
                return v*0.026458333333333*2.36;
            },
            'n/a':function(v){
                /*
                    lsv - lineSpacingValue
                */
               //return b*lsv;
               return v;
            }            
        }; 
        return measurement[lsm](lsv);
    }
    removeTmpProperty(allRow){
        for(const prop in allRow){
            delete allRow[prop].paragraph.tmp;
        }
    }
    setParagraphStyle(p,row,fs,ele){
        console.log('DocPreviewParagraph::setParagraphStyle()');
        var lineSpacing={
            'atLeast':function(){
                console.log('atLeast');
                return row.paragraph.tmp.atLeastMarginTopBox;
            },
            'single':function(){
                /* NOTHING TO DO */
                return row.paragraph.tmp.marginTopBox;
            },
            'oneAndHalf':function(){
               /* NOTHING TO DO */
               return row.paragraph.tmp.marginTopBox;
            },
            'double':function(){
                /* NOTHING TO DO */
                return row.paragraph.tmp.marginTopBox;
            },
            'exactly':function(){
                return row.paragraph.tmp.exactlyMarginTopBox;
            },
            'multiple':function(){
                /* NOTHING TO DO */
                return row.paragraph.tmp.marginTopBox-row.paragraph.tmp.multipleMarginTopBox;
            }            
        }; 
        p.style.marginTop=(lineSpacing[row.paragraph.tmp.lineSpacing]()).toString()+'px';
    }
}