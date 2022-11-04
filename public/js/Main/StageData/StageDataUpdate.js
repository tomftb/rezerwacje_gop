class StageDataUpdate{
    update(Stage,NewStageData){
    /* UPDATE STAGE ID */
       this.updateStageId(Stage,NewStageData);
       for(const s in Stage.section){       
           /* 
            * UPDATE STAGE DATA SECTION 
            * */
            this.updateSection(Stage.section[s],s,NewStageData);
            for(const su in Stage.section[s].subsection){  
                    /* 
                    * UPDATE STAGE DATA SUBSECTION 
                    * */
                this.updateSubsection(Stage.section[s].subsection[su],su,NewStageData,s);
                for(const r in Stage.section[s].subsection[su].subsectionrow){
                    /* 
                    * UPDATE STAGE DATA SUBSECTION ROW
                    * */
                    console.log('Act Row - '+r);
                    this.updateRow(Stage.section[s].subsection[su].subsectionrow[r],r,NewStageData,s,su);
                }
            }
        } 
    }
    updateStageId(Stage,NewStageData){
       //console.log(this.Stage.data.id);
       //console.log(typeof(this.Stage.data.id));
       //console.log(NewStageData.data.id);
       //console.log(typeof(NewStageData.data.id));
       this.checkId(NewStageData,1);
       this.checkId(Stage,0);
       
       if(Stage.data.id===0){
           Stage.data.id=NewStageData.data.id;
       }
    }
    updateSection(Data,idSection,NewStageData){
        //console.log('StageDataUpdate::updateSection()');
            //console.log('Actual Stage');
            //console.log(Data);
            //console.log('Key');
            //console.log(key);
            //console.log(typeof(key));
            if(!NewStageData.hasOwnProperty('section')){
               throw 'NewStageData hasn\'t `section` property';
            }
            if(!NewStageData.section.hasOwnProperty(idSection)){
               throw 'NewStageData section hasn\'t `property` - '+idSection;
            }
            //console.log('Actual Stage section:');
            //console.log(Data);
            //console.log('Actual Stage section key:');
            //console.log(key);
            //console.log(typeof(key));
            //console.log('NewStageData section');
            //console.log(NewStageData.section);   
            this.checkId(NewStageData.section[idSection],1);
            /* CHECK ID */
            if(Data.data.id===NewStageData.section[idSection].data.id){
                /* THE SAME - RETURN TRUE */
            }
            else{
                /* NEW DB ID */
                Data.data.id=NewStageData.section[idSection].data.id;
            }
    }
    updateSubsection(Data,idSubsection,NewStageData,idSection){
        console.log('StageDataUpdate::updateSubsection()');
        //console.log(Data);
        //console.log(idSubsection);
            if(!NewStageData.section[idSection].hasOwnProperty('subsection')){
               throw 'NewStageData hasn\'t `subsection` property';
            }
            if(!NewStageData.section[idSection].subsection.hasOwnProperty(idSubsection)){
               throw 'NewStageData section '+idSection+' subsection hasn\'t `property` - '+idSubsection;
            }
            this.checkId(NewStageData.section[idSection].subsection[idSubsection],1);
            if(Data.data.id===NewStageData.section[idSection].subsection[idSubsection].data.id){
                /* THE SAME - RETURN TRUE */
            }
            else{
                /* NEW DB ID */
                Data.data.id=NewStageData.section[idSection].subsection[idSubsection].data.id;
            }
    }
    updateRow(Data,idRow,NewStageData,idSection,idSubsection){
        console.log('StageDataUpdate::updateRow()');
        //console.log(Data);
        //console.log(key);
            if(!NewStageData.section[idSection].subsection[idSubsection].hasOwnProperty('subsectionrow')){
                throw 'NewStageData section '+idSection+' subsection - `'+idSubsection+'` hasn\'t `subsectionrow` property';
            }
            if(!NewStageData.section[idSection].subsection[idSubsection].subsectionrow.hasOwnProperty(idRow)){
               throw 'NewStageData section '+idSection+' subsection -'+idSubsection+' subsectionrow hasn\'t `property` - '+idRow;
            }
            
            if(Data.data.id===NewStageData.section[idSection].subsection[idSubsection].subsectionrow[idRow].data.id){
                    /* THE SAME - RETURN TRUE */
            }
            else{
               Data.data.id=NewStageData.section[idSection].subsection[idSubsection].subsectionrow[idRow].data.id;
            }
            /* UPDATE STAGE DATA ROW */
            //this.updateStageDataRow(Data,NewStageData.section[idSection].subsection[idSubsection].subsectionrow[idRow]);
            if(!Data.hasOwnProperty('image')){
                throw 'ActualStage data row hasn\'t `image` property';
            } 
            if(!NewStageData.section[idSection].subsection[idSubsection].subsectionrow[idRow].hasOwnProperty('image')){
                throw 'New stage data row hasn\'t `image` property';
            } 
            this.updateImage(Data.image,NewStageData.section[idSection].subsection[idSubsection].subsectionrow[idRow]);
    }

    updateImage(Image,NewStageDataRow){
        //console.log('StageDataUpdate::updateImage()');
        //console.log('ActualStage ROW Image:');
        //console.log(Image);
        var ImageLength=Object.keys(Image).length;
        //console.log(ImageLength);
        //console.log('NewStageDataRow Image:');
        //console.log(NewStageDataRow.image);
        var NewImageLength=Object.keys(NewStageDataRow.image).length;
        //console.log(NewImageLength);

        var ImageToRemove=new Array();
        
        //if(ImageLength!==NewImageLength){
           // throw 'Row image property length != New Row property image length';
        //}
        if(ImageLength===0){
            //console.log('No Row Images');
            return true;
        }
        for(const key in Image){
            //console.log('Image:');
            //console.log(key);
            //console.log(typeof(key));
            //console.log(Image[key]);
            let idDb=0;
            this.checkId(Image[key],0);
            if(Image[key].data.id>0 && Image[key].data.tmp==='n'){
                /* SKIP - NO CHANGE*/
                continue;
            }
            for(const i in NewStageDataRow.image){
                //console.log('NewImage:');
                //console.log(i);
                //console.log(typeof(i));
                //console.log(NewStageDataRow.image[i]);
                this.checkId(NewStageDataRow.image[i],1);
                if(NewStageDataRow.image[i].property.tmpid===key){
                    idDb=NewStageDataRow.image[i].data.id;
                    break;
                }
            }
            /* NOT FOUND IN RESPONSE NEW IMAGE AND NO DATA TMP===y*/
            if(Image[key].data.tmp==='d' && idDb===0){
                 ImageToRemove.push(key);
                 continue;
            }
            if(idDb===0){
                throw 'NewStageData `row` `image` `data` `id` property - wrong database `id` - '+idDb+' or `tmpid` not found';
            }
            switch (Image[key].data.tmp) {
            case 'y':
                //console.log('(y) SET TMP = n, update id');
                Image[key].data.tmp='n';
                Image[key].data.id=idDb;
                break;
            case 'n':
                console.log('(n) nothing to do ');
                Image[key].data.id=idDb;
                break
            default:
                throw 'tmp type not in (y,n) - '+Image[key].data.tmp;
           };         
        }
         /* SAFE REMOVE */
        //console.log('SAFE REMOVE');
        //delete NewStageDataRow.image;
        //console.log('Image with keys to remove');
        //console.log(ImageToRemove);
        //console.log('image');
        //console.log(Image);
        for(var i=0;i<ImageToRemove.length;i++){
            //console.log('Remove image - '+i);
            //console.log(Image[ImageToRemove[i]]);
            delete Image[ImageToRemove[i]];
        }
    }
    checkId(Data,maxId){
       //console.log('StageData.checkId()');
       //console.log(Data);
       if(!Data.hasOwnProperty('data')){
            console.log(Data);
            throw 'StageDataUpdate::checkId()\nno `data` property';
       }
       if(!Data.data.hasOwnProperty('id')){
            console.log(Data.data);
            throw 'StageDataUpdate::checkId()\nno `id` `property`';
       }
       //console.log(Data.data.id);
       var type=typeof(Data.data.id);
       if(type!=='number'){
            throw 'StageDataUpdate::checkId()\nwrong data id `type` - `'+type+'` expected `number`';
       }
       if(Data.data.id<maxId){
           throw 'StageDataUpdate::checkId()\ndata `id` lower than '+maxId+' - '+Data.data.id;
       }
    }
}