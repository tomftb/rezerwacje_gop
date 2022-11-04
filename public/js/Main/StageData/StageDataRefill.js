class StageDataRefill{
    change=false;
    constructor(){}
    refill(Stage,DefaultParagraphProperty,DefaultListProperty){
       //console.log('StageDataRefill::refill()');
       //console.log(Stage);
        for(const s in Stage.section){           
            for(const su in Stage.section[s].subsection){
                for(const r in Stage.section[s].subsection[su].subsectionrow){
                    //this.refillStageProperty(this.Stage.section[s].subsection[su].subsectionrow[r].paragraph);
                    this.refillData(Stage.section[s].subsection[su].subsectionrow[r].paragraph,DefaultParagraphProperty);
                    this.refillData(Stage.section[s].subsection[su].subsectionrow[r].list,DefaultListProperty);                 
                    //for(const prop3 in this.Stage.section[prop].subsection[prop1].subsectionrow[prop2].image){
                      //  if(this.Stage.section[prop].subsection[prop1].subsectionrow[prop2].image[prop3].data.tmp==='y'){
                            //files.push(this.Stage.section[prop].subsection[prop1].subsectionrow[prop2].image[prop3].property.uri);
                        //}            
                    //}
                }
            }
        }
        return this.change;
    }
    refillData(StageData,defaultProperty){
        //console.log('StageDataRefill::refillData()');
        //console.log(StageData);
        //var defaultProperty=this.getDefaultParagraphProperty();
        this.refillProperty('style',StageData,defaultProperty);
        this.refillProperty('property',StageData,defaultProperty);
    }
    refillProperty(key,StageData,defaultData){
        //console.log('StageDataRefill::refillProperty()');
        //console.log('key - '+key);
        var refillData=new Object();
         /* CHECK AND UPDATE STYLE */
         for(const def in defaultData[key]){
             let found=false;
             //console.log(def);
             for(const prop in StageData[key]){
                //console.log(prop);
                if(def===prop){
                    //console.log('found - break');
                    found=true;
                    break;
                }
            }
            if(found===false){
                refillData[def]=defaultData[key][def];
                this.change=true;
            }
         }
         /* ASSIGN NEW DEFAULT PROPERTY WITH VALUE */
         for(const prop in refillData){
            //console.log(prop);
            //console.log(refillData[prop]);
            StageData[key][prop]=refillData[prop];
         } 
    }
    
}