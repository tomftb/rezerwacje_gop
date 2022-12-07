class DocPreviewTabStop{
    Utilities=new Object();
    constructor(){
        console.log('DocPreviewTabStop::constructor()');
        this.Utilities = new Utilities();
    }
    setDecoration(ele,sign,size){
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
    getEle(w){
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
    setEjection(ele,leftEjection){
        /*console.log('DocPreview::setEjection()');  
        console.log('ELEMENT'); 
        console.log(ele); 
        console.log('LEFT EJECTION'); 
        console.log(leftEjection); 
                    */
        if(parseFloat(leftEjection)>0){
            ele.appendChild(this.getEle(leftEjection));
        }
        /*
        console.log('ELEMENT'); 
        console.log(ele); 
        throw 'test-stop';
                    */
    }
    set(ele,paragraph){
        //console.log('DocPreviewTabStop::set()');  
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
            //console.log('PARAGRAPH TABSTOP IDX < 0 => EXIT - `NO TABSTOP`');
            return false;
        }
        console.log(paragraph.tabstop.hasOwnProperty(paragraph.property.tabstop));
        if(!paragraph.tabstop.hasOwnProperty(paragraph.property.tabstop)){
            //console.log('TABSTOP IDX NOT EXIST IN TABSTOP LIST -> RETURN FALSE');
            return false;
        }
        
        actTabStopPosition = paragraph.tabstop[paragraph.property.tabstop].position;
        
        if(paragraph.tabstop[paragraph.property.tabstop].position <= paragraph.style.leftEjection){
            //console.log('TABSTOP PROPERTY POSITION EQUAL OR IS LOWER THAN LEFT EJECTION -> RETURN TRUE');
            return true;
        }
        console.log('TABSTOP PROPERTY POSITION HIGHER THAN LEFT EJECTION -> SET ALL TABSTOP AND RETURN TRUE');
            for (const prop in paragraph.tabstop){
                /* COMPARE POSITIONS, IF GRETER THEN LEAVE LOOP */
                if(paragraph.tabstop[prop].position>actTabStopPosition){
                    break;
                }
                //console.log('append');
                    
                var span = this.getEle((paragraph.tabstop[prop].position)-end);
                //var tmpText = document.createTextNode('aaaa');
                    //console.log(paragraph.tabstop[prop].leadingSign);
                    
                this.setDecoration(span,paragraph.tabstop[prop].leadingSign,paragraph.style.fontSize);
                    
                    ele.appendChild(span);
                end=paragraph.tabstop[prop].position;
            }
        return true;
    }
}