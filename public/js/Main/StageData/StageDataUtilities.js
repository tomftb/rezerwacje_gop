class StageDataUtilities{
    data=new Object();
    constructor(){
        console.log('StageDataUtilities::constructor()');
    }
    getVariables(stage){
        var self=this;
        var f = function(d){
            //console.log('StageDataUtilities::getVariables()');
            //console.log(d);
            for(const prop in d.paragraph.variable){
                //console.log(d.paragraph.variable[prop]);
                self.data[prop]=d.paragraph.variable[prop];
            }
        };
        return this.get(stage,f);
    }
    getFiles(stage){
        var self=this;
        var f = function(){
             //for(const prop3 in this.Stage.section[prop].subsection[prop1].subsectionrow[prop2].image){
                       // if(this.Stage.section[prop].subsection[prop1].subsectionrow[prop2].image[prop3].data.tmp==='y'){
                        //    data.push(this.Stage.section[prop].subsection[prop1].subsectionrow[prop2].image[prop3].property.uri);
                      //  }            
                   // }
        };
        return this.get(stage,f);
    }
    get(StageSection,f){
        //console.log('StageDataUtilities::get()');
        //console.log(StageSection);
        this.data={};
        for(const s in StageSection){       
            console.log(StageSection[s]);
            for(const su in StageSection[s].subsection){  
                console.log(StageSection[s].subsection[su]);
                for(const r in StageSection[s].subsection[su].subsectionrow){
                    f(StageSection[s].subsection[su].subsectionrow[r]);
                }
            }
        }
        //console.log(this.data);
        return this.data;
    }
    loopOverRow(Stage,f,o){
        //console.log('StageDataUtilities::loop()');
        /*
         * Stage - data
         * f - function to execute
         * o - object/array/string - extra data
         */
         for(const s in Stage.section){     
            for(const su in Stage.section[s].subsection){  
                for(const r in Stage.section[s].subsection[su].subsectionrow){
                    f(Stage.section[s].subsection[su].subsectionrow[r],o);
                }
            }
        }
    }
}

