class ProjectStageToolFile{
    Parent = new Object();
    Html = new Object();
    Glossary = new Object();
    ToolFile = new Object();
    ToolEle = new Object();
    Utilities = new Object();
    /* Image - references to property Image */
    Image= new Object();
    //TmpImage = new Object();
    //NewImage= new Object();
    Helplink = {
        info:new Object(),
        progress:new Object(),
        progressbar:new Object(),
        progresscomplete:new Object(),
        inputfile:new Object(),
        inputfilelabel:new Object(),
        inputfileinfo:new Object(),
        inputfilemain:new Object()
    };
    fileUpload=0;
    fileSelected=0;
    ErrorStack = new Object();
    
    constructor(ProjectStageTool){     
        this.setParent(ProjectStageTool);
        this.progressbar = document.createElement('span');
        this.Helplink['progresscomplete'] = document.createElement('p');
        this.Utilities = ProjectStageTool.Utilities;
        return this;
    }
    setImage(subsectionrow){
         console.log('ProjectStageToolFile::setImage()');
         console.log(subsectionrow);
         this.Image = subsectionrow.image;
    }
    setParent(ProjectStageTool){
        this.Parent = ProjectStageTool;
        this.Html = ProjectStageTool.Html;
        this.Glossary = ProjectStageTool.Glossary;
        this.ErrorStack = ProjectStageTool.ErrorStack;
    }
    //isection,isub,isubrow,subsectionrow
    setToolEle(name){
        console.log('ProjectStageToolFile::setToolEle()');
      
            var mainDivCol=this.Html.getCol(12);
                mainDivCol.classList.add('d-none','pt-1','pb-1');//,'bg-light'
                mainDivCol.style.backgroundColor='#e6e6e6';
            var Tool = new ToolFields([12]);
            var Tool1 = new ToolFields([12]);
            var label = this.assignImage(Tool1.getMain().childNodes[0]);
                Tool.set(0,this.getFile(name));//label turn off - because in load there is no file
                console.log( this.Image);
                //throw 'asdasd';
          
                mainDivCol.appendChild(Tool.getMain());
                mainDivCol.appendChild(Tool1.getMain());
                this.Helplink['file']=Tool1.getMain().childNodes[0];
                this.ToolEle=mainDivCol;
    }
    assignImage(ele){
        console.log('ProjectStageToolFile::assignImage()');
        console.log(ele);
        var label = '';
        var defaultlabel='Wskaż plik...';
         for(const prop in this.Image){       
            this.setTool(ele,this.Image[prop]);
            label+=this.Image[prop].property.name;
         }
         label=this.Utilities.cutName(label,127);
         return (label==='')? defaultlabel : label;
    }
    getToolEle(){
        console.log('ProjectStageToolFile::getToolEle()');
        return this.ToolEle;
    }
    setTool(ele,image){
        console.log('ProjectStageToolFile::setTool()');
        var ToolAll = new ToolFields([12]);
        var ToolLabel = new ToolFields([12]);
            this.setToolLabel(ToolLabel.get(0),image);
        var Tool = new ToolFields([3,3,3,3]);
            //Tool.set(0,this.Parent.getSimpleAlign(image.style,['alignment','alignmentName']));
            //Tool.set(0,this.Parent.getSimpleOrder(image.property,['order','orderName']));
            //Tool.set(0,this.Parent.getSimpleAlign(image.style,['alignment','alignmentName']));
            Tool.set(0,this.Parent.getSimpleInputSize(image.style,['height','heightMeasurement'],'Wysokość zdjęcia:'));
            Tool.set(1,this.Parent.getSimpleInputSize(image.style,['width','widthMeasurement'],'Szerokość zdjęcia:'));
            Tool.set(2,this.Parent.getSimpleInputSize(image.style,['marginLeft','marginLeftMeasurement'],'Lewy margines:'));
            Tool.set(3,this.Parent.getSimpleInputSize(image.style,['marginTop','marginTopMeasurement'],'Prawy margines:'));
       //ToolLabel.Main.classList.add('border','border-primary','border-bottom-0');
       //Tool.Main.classList.add('border','border-primary','border-top-0');
        ToolAll.set(0,ToolLabel.getMain());
        ToolAll.set(0,Tool.getMain());  
        ToolAll.set(0,document.createElement('hr'));
        ele.appendChild(ToolAll.getMain());
       console.log(ele);
    }
    setToolLabel(ele,image){
       
        var label = this.Utilities.cutName(image.property.name,140);
        var sizeInMb = Math.round((image.property.size/1048576)*100)/100;//1024 * 1024      
        var self=this;  
        var s=document.createElement('span');
            s.style.cursor='pointer';
            s.append(document.createTextNode(label));
            s.onmouseover=function(){
                this.style.textDecoration='underline';
            };
            s.onmouseleave=function(){
                this.style.textDecoration='';
            };
            s.onclick=function(){
                console.log('ProjectStageToolFile.setToolLabel().onclick()');
                console.log(image);
                console.log(self.Parent.Stage.Items.router);
                
                let task = ((image.data.tmp==='n')? 'getStageImage' : 'getTmpStageImage');
                window.open(self.Parent.Stage.Items.router+task+'&file='+image.property.uri,'_blank','','');
            };
        var h = document.createElement('h6');
            h.classList.add('text-primary','mt-1','mb-0','font-weight-bold');
            h.append(s);            
        var p = document.createElement('p');
            
            this.Html.addClass(p,['mt-0','mb-0']);
        var small = document.createElement('small');
            this.Html.addClass(small,'text-muted');
            small.appendChild(document.createTextNode('size: '+sizeInMb+' MB type: '+image.property.type+' mime: '+image.property.mime+' width: '+image.style.width+'px height:'+image.style.height+'px'));
            p.appendChild(small);
            ele.appendChild(h);
            ele.appendChild(p);
    }
    getFile(name){//inputLabel
        console.log('ProjectStageToolFile.getFile()');
        /*
         * property - reference for example subsectionrow.paragraph.style
         * ele - reference for example helplink
         */  
        
        //image.property.uid=(new Date()).getTime(); 
            this.setFileEle(); 
            var self = this;
            /* CLOSURE */
            this.Helplink['inputfile'].onchange = function(){
                console.log('INPUT FILE NAME:');
                console.log(name);
                console.log('ERROR STACK:');
                console.log(self.ErrorStack);
                self.fileUpload=0;
                //let ImageToRemove={};
                let setFilesToDelete=function(Image){//Image

                    for(const prop in Image){   
                        console.log('SETUP OLD IMAGE:'); 
                        console.log(Image[prop]);
                        switch (Image[prop].data.tmp) {
                            case 'n':
                                console.log('(n) SET TMP = d');
                                Image[prop].data.tmp='d';
                                break;
                            case 'y':
                                console.log('(y) Image to delete');
                                //ImageToRemove[prop]=self.Image[prop];
                                //self.Image[prop].data.tmp='d';
                                break
                            case 'd':
                                console.log('(d) already d');
                                break;
                            default:
                                throw 'tmp type not in (y,n,d) - '+Image[prop].data.tmp;
                         };   
                    };
                };
                let uploadFiles=function(self,t){
                    /*
                     * t - this input object
                     */
                    try{
                        let error=false;
                        let info=document.createElement('div');
                        let fileName='';
                        let errorValue='';
                        let infoClass='';
                        let namesList='';
                        let space='';
                        self.fileSelected=t.files.length;
                        /* IN bytes */
                        //let size=0;
                        let maxSize =20971520;/* MAX DEFAULT 20 Mb - SIZE, not size on hard drive */
                        let type=new Array(
                            'image/bmp',
                            'image/jpeg',
                            'image/png'
                        );
                        if(self.fileSelected===0){
                            console.log('no files');
                            self.Helplink['inputfilelabel'].appendChild(document.createTextNode('Nie wskazano pliku...'));
                            self.Html.removeClass(self.Helplink['inputfilelabel'],['border-success','border-danger']);              
                            return true;
                        }
                    
                        console.log('this files:');
                        console.log(t.files);
                        console.log(self.fileSelected);
                       
                        for (let i = 0; i < self.fileSelected; i++) {
                            //let uid=(new Date()).getTime();
                            //+(new Date()).getMilliseconds();//(new Date()).getTime()+
                            //let uid = Math.random();
                            let uid = 'new'+(Math.floor(Math.random() * 10000000)).toString();
                            /* SET DEFAULT */
                            infoClass='text-success';
                            errorValue='';
                            //console.log(this.files.item(i));
                            console.log(t.files.item(i).name);
                            namesList+=space+t.files.item(i).name.trim();
                            space=' ';
                            if(t.files.item(i).size>maxSize){
                                error=true;
                                infoClass='text-danger';
                                errorValue+=' - size limit exceeded'; 
                            }
                            if(!type.includes(t.files.item(i).type,0)){
                                error=true;
                                infoClass='text-danger';
                                errorValue+=' - not allowed type → '+t.files.item(i).type+'';
                            }
                            let counterValue=  document.createTextNode('['+i+'] ');
                                fileName=self.Utilities.cutName(t.files.item(i).name,138-counterValue.length-errorValue.length); 
                                fileName+=errorValue;
                           
                            let text=document.createTextNode(fileName);
                            let p = document.createElement('p');
                                p.classList.add(infoClass,'mt-0','mb-0');
                                p.setAttribute('title',t.files.item(i).name);
                            //var counterValue = document.createTextNode('['+i+'] ');
                            let counterLabel=  document.createElement('span');
                                counterLabel.classList.add('text-secondary');
                                counterLabel.appendChild(counterValue);
                                p.append(counterLabel,text);      
                                info.appendChild(p);
                                if(error){ continue; }
                                self.Image[uid]=self.getNewImageProperty();
                                self.setNewImageProperty(self.Image[uid],uid,t.files.item(i));
                         }
                        /* 
                        * cut names
                        * max - 127 char without dot and extension
                        * 
                        */
                       self.Helplink['inputfilelabel'].appendChild(document.createTextNode(self.Utilities.cutName(namesList,127)));

                       console.log(self.Image);
                       //throw 'test-stop-155';    
                       if(error){
                           self.ErrorStack.add(name,errorValue);
                           self.Html.removeClass(self.Helplink['inputfilelabel'],['border-success']);
                           self.Html.addClass(self.Helplink['inputfilelabel'],['border-danger']);
                           self.Html.removeClass(self.Helplink['inputfileinfo'],['d-none']);
                           self.Helplink['inputfileinfo'].appendChild(info);
                           /* delete proeprty not set emty image */
                           //self.Image={};
                       }
                       else{
                           self.setProgress();
                           self.Html.removeClass(self.Helplink['inputfilelabel'],['border-danger']);
                           self.Html.addClass(self.Helplink['inputfilelabel'],['border-success']);
                           self.Html.addClass(self.Helplink['inputfileinfo'],['d-none']); 
                           console.log(self.Image);
                           /* DELETE OLD FILES */
                           //self.checkBeforeDelete(self);
                           self.sendFiles(self);             
                       }   
                       //console.log(divInfo);  
                    }
                    catch(e){
                        throw e;
                    }
                    
                };
               
                try{
                    console.log('Image:');
                    console.log();
                    if(Object.keys(self.Image).length>0){
                        if (confirm('Zastąpić pliki?') !== true) {
                            return true;
                        }
                    }
                    
                    /* CLEAR FIELD progrss */
                    self.Html.removeClass(self.Helplink['progress'],'d-none');//
                    /* SET IMAGE FILES To DELETE */
                    setFilesToDelete(self.Image);//ImageToRemove
                    console.log('Image:');
                    console.log(self.Image);
                    /* DELETE TMP IMAGE FILE() */
                    self.deleteFiles(self);
                    /* CLEAR INFO */
                    self.Html.removeChilds(self.Helplink['inputfilelabel']);
                    self.Html.removeChilds(self.Helplink['inputfileinfo']);
                    self.Html.removeChilds(self.Helplink['file']);
                    self.Html.removeChilds(self.Helplink['progress']);
                    self.Html.removeChilds(self.Helplink['progresscomplete']);
                    /* DELETE from ErrorStack */
                    self.ErrorStack.remove(name);
                    /* UPLOAD SELECTED IMAGES */
                    uploadFiles(self,this);     
                }
                catch(e){
                    console.log('ProjectStageToolFile.getFile()');
                    console.log('Error:');
                    console.log(e);
                    self.errorProgress('Application error occurred! Contact with Administrator!');
                    return false;
                }      
             };
            //console.log(self.Image);
            return this.Helplink['inputfilemain'];
    }
    setFileEle(){
        var mainDiv=document.createElement('div');
        var mainLabel = this.Parent.Tool.createLabel('Wskaż plik:');  
        var inputDiv = document.createElement('div');
            inputDiv.classList.add('custom-file');//'custom-file',
        var input = document.createElement('input');
            input.classList.add('custom-file-input');//,'form-control-file','form-control-sm'
            input.setAttribute('type','file');
            input.setAttribute('id',name);
            input.setAttribute('name',name);
            input.setAttribute('multiple','');
        var label = document.createElement('label');
            label.classList.add('custom-file-label');//,'border','border-danger','border-1'
            input.setAttribute('for','validatedCustomFile');
        var labelText=document.createTextNode('Wskaż plik...');//inputLabel
            label.appendChild(labelText);
        var divInfo = document.createElement('div');
            divInfo.classList.add('pl-2','d-none');//'text-danger'
        var divProgress = document.createElement('div');
            divProgress.classList.add('pl-2','d-none');//'text-danger'
            //divInfo.style.display='none';

            inputDiv.appendChild(input);
            inputDiv.appendChild(label);
            inputDiv.appendChild(divInfo);
            inputDiv.appendChild(divProgress);
            
            mainDiv.appendChild(mainLabel);
            mainDiv.appendChild(inputDiv);
            
            /* SetUp HELPLINK REFERENCE */
            this.Helplink['info'] = divInfo;
            this.Helplink['progress'] = divProgress;
            this.Helplink['inputfile']=input;
            this.Helplink['inputfilelabel']=label;
            this.Helplink['inputfileinfo']=divInfo;
            this.Helplink['inputfilemain']=mainDiv;

    }


    updateTmpImageProperty(response){
        console.log('ProjectStageToolFile.updateTmpImageProperty()');
        console.log(response);
        try{
            var data = this.Parent.Stage.Items.parseResponse(response);
                
                console.log(data.data.value);
                //console.log(this.Image);
                for(const prop in data.data.value){
                    //this.Property.files[prop]=data.data.value[prop];
                    //this.ProjectStageTool.Files[prop]=data.data.value[prop];
                    this.Image[prop].property['uri']=data.data.value[prop].n;
                    this.Image[prop].style['width']=data.data.value[prop].w;
                    this.Image[prop].style['height']=data.data.value[prop].h;
                    this.Image[prop].property['width']=data.data.value[prop].w;
                    this.Image[prop].property['height']=data.data.value[prop].h;
                    this.Image[prop].property['mime']=data.data.value[prop].m;
                    /* MOVE TO ACTION "DODAJ" */
                    delete this.Image[prop].dataFile;
                    this.setTool(this.Helplink['file'],this.Image[prop]);
                    //this.setProgress();
                    this.updateProgress();
                }
                this.completeProgress();
                //console.log(this.ProjectStageTool.Files);
                //console.log(this.Image);
        }
        catch (error){
            console.log('ProjectStageToolFile::setUploadImage() ERROR:');
            this.Html.removeClass(this.Helplink['info'],['border-success','d-none']);
            this.Helplink['info'].classList.add('border-danger');
            var p = document.createElement('p');
                p.classList.add('text-danger','mt-0','mb-0');
                p.appendChild(document.createTextNode(error));       
            this.Helplink['info'].appendChild(p);
          }
    }
    setProgress(){
        //console.log('ProjectStageToolFile::setProgress()');  
        //console.log(this.Helplink['progress']);
         this.Html.removeClass(this.Helplink['progress'],['d-none']);
            this.Helplink['progresscomplete'].classList.add('text-danger','mt-0','mb-0');
            this.Helplink['progresscomplete'].appendChild(document.createTextNode('Upload in progress '));  
            this.Helplink['progresscomplete'].appendChild(this.progressbar); 
            this.Helplink['progresscomplete'].appendChild(document.createTextNode('/'+this.fileSelected)); 
       this.Helplink['progress'].appendChild(this.Helplink['progresscomplete']);    
    }
    updateProgress(){
            this.fileUpload++;
        var progress = this.fileUpload.toString(); // number to string
            this.Html.removeChilds(this.progressbar);
            this.progressbar.appendChild(document.createTextNode(progress)); 
            
    }
    completeProgress(){
        this.Html.removeChilds(this.Helplink['progresscomplete']);
        if(this.fileUpload===this.fileSelected){
           this.Html.removeClass(this.Helplink['progresscomplete'],'text-danger');
           this.Html.addClass(this.Helplink['progresscomplete'],'text-success');
           this.Helplink['progresscomplete'].appendChild(document.createTextNode('Upload complete '+this.fileUpload+'/'+this.fileSelected+'!')); 
       }
       else{
           this.errorProgress('Something went wrong! Upload process not complete '+this.fileUpload+'/'+this.fileSelected+'!');
       }
    }
    errorProgress(e){
        console.log('ProjectStageToolFile.errorProgress()');
        console.log(this.Helplink['progress']);
        console.log(this.Helplink['progresscomplete']);
        this.Html.removeClass(this.Helplink['progress'],['d-none']);
        this.Html.removeChilds(this.Helplink['progresscomplete']);
        this.Helplink['progresscomplete'].classList.add('text-danger','mt-0','mb-0');
        this.Helplink['progresscomplete'].append(document.createTextNode(e));
        this.Helplink['progress'].appendChild(this.Helplink['progresscomplete']);    
    }
    sendFiles(self){
         console.log('ProjectStageToolFile.sendFiles()');
         console.log(self.Parent.Stage.Items);
         //throw 'aaaa';
         try{
            for(const prop in self.Image){
                if(self.Image[prop].data.tmp==='y'){
                    console.log(self.Image[prop]);
                    let fd = new FormData();
                        fd.append(prop,self.Image[prop].dataFile,self.Image[prop].property.name);  
                    let Xhr= new Xhr2();
                        self.Parent.Stage.Items.setLoadModalInfo(Xhr); 
                        Xhr.setOnError(self.Parent.Stage.Items.modalXhrError()); 
                        Xhr.run({
                            t:'POST',
                            u:self.Parent.Stage.Items.router+'uploadTmpStageImage',
                            c:true,
                            d:fd,
                            o:self,
                            m:'updateTmpImageProperty'
                        });
                }  
            }
            console.log('Finish');
            console.log(self.Image);
        }
        catch (e){
            //console.log('ERROR:');     
            throw e;
          };
    }
    deleteFiles(self){
        try{
            console.log('ProjectStageToolFile.deleteFiles()');       
            console.log('file list:');
            console.log(self.Image);
            //throw 'aaaaaa';
         
            var fd = new FormData();
            var found=false;
            for(const prop in self.Image){
                //console.log(self.Image[prop].property.uri);
                if(self.Image[prop].data.tmp==='y'){
                    fd.append(prop,self.Image[prop].property.uri); 
                    delete self.Image[prop];
                    found=true;
                }
            }
            if(found){
                var Xhr= new Xhr2();
                    self.Parent.Stage.Items.setLoadModalInfo(Xhr); 
                    Xhr.setOnError(self.Parent.Stage.Items.modalXhrError()); 
                    Xhr.run({
                        t:'POST',
                        u:self.Parent.Stage.Items.router+'deleteTmpStageImage',
                        c:true,
                        d:fd,
                        o:self,
                        m:'successfullyDeleted'
                    });
            }
            
        }
        catch (e){
            //console.log('ERROR:');     
            throw e;
        };
    }
    getNewImageProperty(){
        console.log('ProjectStageToolFile.getNewImageProperty()');
        return {
            data:{
                id:0,
                tmp:'y'
            },
            style:{
                alignment:'LEFT', 
                alignmentName:'Lewo',
                height:'0',
                heightMeasurement:'px',
                marginLeft:0,
                marginLeftMeasurement:'px',
                marginTop:0,
                marginTopMeasurement:'px',
                width:'0',
                widthMeasurement:'px',
                wrappingStyle:'infront',
                wrapDistanceTop:'',
                wrapDistanceBottom:'',
                wrapDistanceLeft:'',
                wrapDistanceRight:''
            },
                property:{},
                dataFile:{} 
            };
    }
    setNewImageProperty(image,uid,file){
        console.log('ProjectStageToolFile.setNewImageProperty()');
        image.property={
            lastModified:file.lastModified,
                 lastModifiedDate:file.lastModifiedDate,
                 name:file.name,
                 size:file.size,
                 type:file.type,
                 uri:'',
                 order:'beforetext',//after
                 orderName:'Przed tekstem',//Za
                 tmpid:uid
        };
        image.dataFile=file;
    }
    successfullyDeleted(){
        console.log('ProjectStageToolFile.successfullyDeleted()');
    }
}