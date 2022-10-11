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
        allfile:new Object(),
        inputfile:new Object(),
        inputfilelabel:new Object(),
        inputfileinfo:new Object(),
        inputfilemain:new Object(),
        file:new Object()
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
                this.Helplink['allfile']=Tool1.getMain().childNodes[0];
                this.ToolEle=mainDivCol;
    }
    assignImage(ele){
        console.log('ProjectStageToolFile::assignImage()');
        console.log(ele);
        var label = '';
        var defaultlabel='Wskaż plik...';
            for(const prop in this.Image){       
                this.setTool(ele,this.Image,prop,this.Helplink.file);
                label+=this.Image[prop].property.name;
         }
         label=this.Utilities.cutName(label,127);
         return (label==='')? defaultlabel : label;
    }
    getToolEle(){
        console.log('ProjectStageToolFile::getToolEle()');
        return this.ToolEle;
    }
    setTool(ele,image,prop,HelplinkFile){
        console.log('ProjectStageToolFile::setTool()');
        
        HelplinkFile[prop]={
                name:new Object(),
                size:new Object(),
                input:new Object(),
                //inputlabel:new Object(),
                //progress:new Object(),
                info:new Object(),
                height:this.Parent.getSimpleInputSize(image[prop].style,['height','heightMeasurement'],'Wysokość zdjęcia:'),
                width:this.Parent.getSimpleInputSize(image[prop].style,['width','widthMeasurement'],'Szerokość zdjęcia:'),
                leftmargin:this.Parent.getSimpleInputSize(image[prop].style,['marginLeft','marginLeftMeasurement'],'Lewy margines:'),
                rightmargin:this.Parent.getSimpleInputSize(image[prop].style,['marginTop','marginTopMeasurement'],'Prawy margines:')
            };
        var ToolAll = new ToolFields([12]);
        var ToolLabel = new ToolFields([7,4,1]);
            this.setToolLabel(ToolLabel.get(0),image,prop,HelplinkFile);
            this.setToolChange(ToolLabel.get(1),image,prop,ToolAll.getMain(),HelplinkFile);
            this.setToolRemove(ToolLabel.get(2),image,prop,ToolAll.getMain(),HelplinkFile);
        var Tool = new ToolFields([3,3,3,3]);
            //Tool.set(0,this.Parent.getSimpleAlign(image.style,['alignment','alignmentName']));
            //Tool.set(0,this.Parent.getSimpleOrder(image.property,['order','orderName']));
            //Tool.set(0,this.Parent.getSimpleAlign(image.style,['alignment','alignmentName']));
            //this.Helplink.file[prop]={};
            
            Tool.set(0,HelplinkFile[prop].height);
            Tool.set(1,HelplinkFile[prop].width);
            Tool.set(2,HelplinkFile[prop].leftmargin);
            Tool.set(3,HelplinkFile[prop].rightmargin);
       //ToolLabel.Main.classList.add('border','border-primary','border-bottom-0');
       //Tool.Main.classList.add('border','border-primary','border-top-0');
        ToolAll.set(0,ToolLabel.getMain());
        ToolAll.set(0,Tool.getMain());  
        ToolAll.set(0,document.createElement('hr'));
        ele.appendChild(ToolAll.getMain());
        
        console.log(ele);
    }
    setToolLabel(ele,image,prop,HelplinkFile){
       console.log('ProjectStageToolFile.setToolLabel()');
       console.log(ele);
        var self=this;  
        var h = document.createElement('h6');
            h.classList.add('text-primary','mt-1','mb-0','font-weight-bold');
            h.append(this.getImageHref(self,image[prop]));     
        var p = document.createElement('p');
            this.Html.addClass(p,['mt-0','mb-0']);
        var small = document.createElement('small');
            this.Html.addClass(small,'text-muted');
            small.appendChild(this.getImagePropertyInfo(image[prop]));
            p.appendChild(small);
            ele.append(h,p);
            HelplinkFile[prop].name=h;
            HelplinkFile[prop].size=small;
    }
    getImagePropertyInfo(ImageProp){
         var sizeInMb = Math.round((ImageProp.property.size/1048576)*100)/100;//1024 * 1024   
         return document.createTextNode('size: '+sizeInMb+' MB type: '+ImageProp.property.type+' mime: '+ImageProp.property.mime+' width: '+ImageProp.property.width+'px height:'+ImageProp.property.height+'px');
    }
    getImageHref(self,imageProp){
        var label = this.Utilities.cutName(imageProp.property.name,140);
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
                console.log(imageProp);
                console.log(self.Parent.Stage.Items.router);
                
                let task = ((imageProp.data.tmp==='n')? 'getStageImage' : 'getTmpStageImage');
                window.open(self.Parent.Stage.Items.router+task+'&file='+imageProp.property.uri,'_blank','','');
            };
            return s;
    }
    setToolRemove(ele,Image,prop,eleMain,HelplinkFile){
        //console.log('ProjectStageToolFile.setToolRemove()');
        //console.log(ele);
        //console.log(eleMain);
        //console.log(image);
        //console.log(prop);
        this.Html.addClass(ele,['pt-1','bg-primary']);
        var button=this.Html.removeButton();
        var self=this;
        button.onclick=function(){
            //console.log('ProjectStageToolFile.setToolRemove()');
            //console.log(Image);
            //console.log(prop);
            //console.log(ele);
            //console.log(eleMain);
            if (confirm('Usunąć plik?') !== true) {
                return true;
            };
            var remove=function(Image,prop,self){
                //console.log('remove');
                //console.log(Image);
                //console.log(prop);
                var fileList={
                    prop:Image[prop].property.uri
                };
                delete Image[prop];
                
                self.deleteFiles(fileList,self.Parent.Stage.Items,'successfully');
            };
            var setToRemove=function(image){
                 //console.log('setToRemove');
                 image.data.tmp='d';
                 
            };
            Image[prop].data.tmp==='n' ? setToRemove(Image[prop],HelplinkFile) : remove(Image,prop,self,HelplinkFile);
            delete HelplinkFile[prop];
            eleMain.remove();   
        };
        ele.append(button);
        //eleMain.remove();
    }
    setToolChange(ele,Image,prop,eleMain,HelplinkFile){
        //var mainLabel = this.Parent.Tool.createLabel('Wskaż plik:');  
        this.Html.addClass(ele,['pt-1','bg-primary','rounded-left']);
        var inputDiv = document.createElement('div');
            inputDiv.classList.add('row','pl-2');//'custom-file','row''custom-file',
        var inputDivFile = document.createElement('div');
            inputDivFile.classList.add('custom-file');//'custom-file','row''custom-file',   
        var input = document.createElement('input');
            input.classList.add('custom-file-input');//,'form-control-file','form-control-sm'
            input.setAttribute('type','file');
            input.setAttribute('name',this.getUid('new'));
        var label = document.createElement('label');
            label.classList.add('custom-file-label','text-primary');//,'border','border-danger','border-1'
            input.setAttribute('for','validatedCustomFile');
            label.appendChild(document.createTextNode('Zamień...'));
        var divInfoRow=this.Html.getRow();
            divInfoRow.classList.add('pl-2');//'custom-file','row''custom-file',
        var divInfo = document.createElement('div');
            divInfo.classList.add('col-12','alert','alert-danger','d-none');//'text-danger','d-none'
            //divInfo.append(document.createTextNode('aaaa'));
        var divProgress = document.createElement('div');
            divProgress.classList.add('pl-2','row');//'text-danger','d-none'
            //divProgress.append(document.createTextNode('bbb'));
            //divInfo.style.display='none';
        var self=this;
            input.onchange = function(){
                //console.log(ele);
                //console.log(eleMain);
                //console.log(Image[prop]);
                //console.log(prop);
                //console.log(HelplinkFile[prop]);
                let t=this;



                let checkImage=function(self,files){
                     console.log('setToolChange.onchange().checkImage()');
                     console.log(files);
                     /* CLEAR NAMES */
                     self.Html.removeChilds(label);
                    
                     let error='';
                     let space='';
                     let size=0;
                     let type='';
                     let name='';
                     /* ONLY ONE */
                     for (let i = 0; i <files.length;i++) {
                            size=files.item(i).size;
                            type=files.item(i).type;
                            //console.log(files.item(i).name);
                            if(size>self.getMaxImageSize()){
                                error+='size limit exceeded → '+size;
                                space="<br/>";
                            }
                            if(!self.getAcceptedImageExtensions().includes(type,0)){
                                error+=space+'not allowed type → '+type;
                            }
                            name=self.Utilities.cutName(t.files.item(i).name,34);
                            label.append(document.createTextNode(name));
                         };
                         if(error!==''){
                             throw error;
                         }
                         
                };
                
                let removeError=function(){
                     self.Html.addClass(divInfo,['d-none']);
                     self.Html.removeChilds(divInfo);
                };
                if (confirm('Zastąpić pliki?') !== true) {
                            return true;
                        }
                 if(this.files.length===0){
                     return true;
                 }
                 try{
                    removeError();
                    checkImage(self,this.files);
                    //HelplinkFile[prop]['inputlabel'].append(document.createTextNode(this.files));
                    //self.Html.removeClass(self.Helplink['inputlabel'],['border-success','border-danger']);
                    Image[prop].data.tmp==='n' ? self.replaceDbFile(self,prop,t.files[0]) : self.replaceTmpFile(self,Image[prop].property.uri,prop,t.files[0]);//Image,prop,self,HelplinkFile
                    //HelplinkFile[prop]['inputlabel'].appendChild(document.createTextNode('Nie wskazano pliku...'));
                 }
                 catch(e){
                    console.log(e);
                    self.setImageFieldError(self,prop,e);
                    return false;
                 };
            };
            divInfoRow.append(divInfo);
            inputDivFile.append(input,label);
            inputDiv.append(inputDivFile);
            ele.append(inputDiv,divInfoRow,divProgress);
            HelplinkFile[prop].input=input;
            HelplinkFile[prop].inputlabel=label;
            HelplinkFile[prop].info=divInfo;
            //HelplinkFile[prop].progress=divProgress;
            console.log(ele.parentNode);
            
    }
    getFile(name){//inputLabel
        console.log('ProjectStageToolFile.getFile()');
        /*
         * property - reference for example subsectionrow.paragraph.style
         * ele - reference for example helplink
         */  
        

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
                        let maxSize =self.getMaxImageSize();
                        let type=self.getAcceptedImageExtensions();
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
                            
                            let uid = self.getUid('new');
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
                    self.deleteAllTmpFiles(self);
                    /* CLEAR INFO */
                    self.Html.removeChilds(self.Helplink['inputfilelabel']);
                    self.Html.removeChilds(self.Helplink['inputfileinfo']);
                    self.Html.removeChilds(self.Helplink['allfile']);
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
                    this.Helplink.file={};
                    this.setTool(this.Helplink['allfile'],this.Image,prop,this.Helplink.file);
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
    createTmpImageProperty(response){
        console.log('ProjectStageToolFile.createTmpImageProperty()');
        console.log(response);
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
        /*
         * t - task to run
         * m - method to execute
         */
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
        }
        catch (e){
            //console.log('ERROR:');     
            throw e;
          };
    }
    deleteAllTmpFiles(self){
        try{
            console.log('ProjectStageToolFile.deleteAllTmpFiles()');       
            console.log('file list:');
            console.log(self.Image);        
            var fileList={};
            for(const prop in self.Image){
                //console.log(self.Image[prop].property.uri);
                if(self.Image[prop].data.tmp==='y'){
                    fileList[prop]=self.Image[prop].property.uri;
                    delete self.Image[prop];
                }
            }
            this.deleteFiles(fileList,self.Parent.Stage.Items,'successfully');
        }
        catch (e){
            console.log('ERROR:');     
            throw e;
        };
    }
    deleteFiles(fileList,StageItems,methodToRun){
        try{
            var fd = new FormData(); 
            for(const prop in fileList){
                fd.append(prop,fileList[prop]); 
            }
            var Xhr= new Xhr2();
            //console.log(fileList);
            //console.log(self);
            console.log(StageItems);
            
            //console.log(self.Parent.Stage);
               //     console.log(self.Parent.Stage.Items);
                    StageItems.setLoadModalInfo(Xhr); 
                    Xhr.setOnError(StageItems.modalXhrError()); 
                    Xhr.run({
                        t:'POST',
                        u:StageItems.router+'deleteTmpStageImage',
                        c:true,
                        d:fd,
                        o:StageItems,
                        m:methodToRun
                    });
        }
        catch (e){
            //console.log('ERROR:');     
            throw e;
        };
    }
    replaceTmpFile(self,ImageUri,prop,newFile){
        console.log('ProjectStageTool.replaceTmpFile()');
        try{
            var fd = new FormData();
                fd.append('old',ImageUri);
                fd.append(prop,newFile,newFile.name);      
                this.replaceFile(self,fd,'replaceTmpStageImage','updateReplacedFile');
        }
        catch(e){
            console.log(e);
        }
    }
    replaceDbFile(self,ImageProp,newFile){ 
        try{
            var fd = new FormData();
                fd.append('old',ImageProp);
                fd.append('new',newFile,newFile.name);      
                this.replaceFile(self,fd,'replaceTmpStageDbImage','updateReplacedDbFile');
        }
        catch(e){
            console.log(e);
        }
    }
    replaceFile(self,fd,t,m){
        console.log('ProjectStageTool.replaceFile()');
        /*
         * t - task to run
         * m - method to execute
         */
        try{    
            var Xhr= new Xhr2();
                    self.Parent.Stage.Items.setLoadModalInfo(Xhr); 
                    Xhr.setOnError(self.Parent.Stage.Items.modalXhrError()); 
                    Xhr.run({
                        t:'POST',
                        u:self.Parent.Stage.Items.router+t,
                        c:true,
                        d:fd,
                        o:self,
                        m:m
                    });
        }
        catch (e){
            //console.log('ERROR:');     
            throw e;
        };
    }

    getNewImageProperty(){
        //console.log('ProjectStageToolFile.getNewImageProperty()');
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
        //console.log('ProjectStageToolFile.setNewImageProperty()');
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
    successfully(){
        console.log('ProjectStageToolFile.successfully()');
    }
    getUid(prefix){
        //image.property.uid=(new Date()).getTime(); 
        //let uid=(new Date()).getTime();
        //+(new Date()).getMilliseconds();//(new Date()).getTime()+
        //let uid = Math.random();
        //'new'+(Math.floor(Math.random() * 10000000)).toString()
        return prefix+(Math.floor(Math.random() * 10000000)).toString();
    }
    getMaxImageSize(){
        /* IN bytes */
        //let size=0;
        //return 1;
        return 20971520;/* MAX DEFAULT 20 Mb - SIZE, not size on hard drive */
    }
    getAcceptedImageExtensions(){
        return new Array(
                            'image/bmp',
                            'image/jpeg',
                            'image/png'
                        );
    }
    updateReplacedFile(response){
        //console.log('ProjectStageToolFile.updateReplacedFile()');
        //console.log(response);
        var errField=false;
        var actprop='';
        var errInfo='Update image file failed! Contact with Administrator!';
        try{
            if(!this.Helplink.hasOwnProperty('file')){
                
                throw 'No Helplink file property';
            };
        }
        catch(e){
            console.log(e);
            alert(errInfo);
            return false;
        }
          try{
            var json = this.Parent.Stage.Items.parseResponse(response);
            //console.log(json.data.value);
            //console.log(this.Helplink.file);
            //console.log(this.Image);
            
            for(const prop in json.data.value){
                console.log(prop);
                actprop=prop;
                if(!this.Helplink.file.hasOwnProperty(prop)){
                    errField=true;
                    throw 'No Helplink file property - '+prop;
                }
                this.checkReplaceImage(prop);
                this.updateChosenImageProperty(prop,json.data.value[prop]);
                this.updateImageHelplink(prop); 
            };  
        }
        catch(e){
            console.log('ProjectStageToolFile::updateReplacedFile() ERROR:');
            console.log(e);
            if(errField){
                console.log(e);
                alert(errInfo);
            }
            else{
                this.setImageFieldError(this,actprop,errInfo);
            }
            
        }
    }
    updateReplacedDbFile(response){
        console.log('ProjectStageToolFile.updateReplacedDbFile()');
        //console.log(response);
        var errInfo='Update image file failed! Contact with Administrator!';
        try{
            var json = this.Parent.Stage.Items.parseResponse(response);
                //console.log(json.data.value);
                this.checkReplaceResponse(json.data.value);
                this.checkReplaceResponseImageProperty(json.data.value.new);
                this.checkReplaceHelplink(json.data.value);  
        }
        catch(e){
            console.log(response);
            console.log(e);  
            alert(errInfo);
        }
        try{
            //console.log(this.Helplink.file);
            //console.log(this.Image);
            this.checkReplaceImage(json.data.value.old);     
            this.updateDbImageProperty(json.data.value); 
            this.updateImageHelplink(json.data.value.old); 
        }
        catch(e){
            console.log('ProjectStageToolFile::updateReplacedDbFile() ERROR:');
            console.log(response);
            console.log(e);
            this.setImageFieldError(this,json.data.value.old,errInfo);
        }
    }
    setImageFieldError(self,prop,e){
        //console.log('setImageError()');
        //console.log(self);
        //console.log(self.Helplink.file[prop].info);
        let span=document.createElement('span');
            span.innerHTML=e;
            self.Html.removeClass(self.Helplink.file[prop].info,'d-none');
            self.Html.removeChilds(self.Helplink.file[prop].info);
            self.Helplink.file[prop].info.append(span);
            //console.log(self.Helplink.file[prop].info);
    };
    checkReplaceResponse(jsonValue){
        if(!jsonValue.hasOwnProperty('old')){
            throw 'No `old` property in response';
        }
        if(jsonValue.old.trim()===''){
            throw 'Empty `old` property in response';
        }
        if(!jsonValue.hasOwnProperty('new')){             
            throw 'No `new` property in response';
        }
    }
    checkReplaceResponseImageProperty(jsonImage){
        //console.log(jsonImage);
        var newImageProp=new Array('h','w','n','m');
        var propertyImageExists=false;
        for(const prop in jsonImage){
            for(var i=0;i<newImageProp.length;i++){
                if(!jsonImage[prop].hasOwnProperty(newImageProp[i])){             
                    throw 'No '+newImageProp+' property in response new image';
                };
            };
            propertyImageExists=true;
        };
        if(!propertyImageExists){
             throw 'No property in response new image';
        }
    }
    checkReplaceHelplink(jsonValue){
        if(!this.Helplink.hasOwnProperty('file')){
            throw 'No Helplink file property';
        };
        if(!this.Helplink.file.hasOwnProperty(jsonValue.old)){
            throw 'No Helplink file property - '+jsonValue.old;
        };
    }
    checkReplaceImage(prop){
        if(!this.Image.hasOwnProperty(prop)){
            throw 'No Image property - '+prop;
        };
    }
    updateDbImageProperty(jsonValue){
        //console.log('ProjectStageToolFile::updateImageProperty()');
        //console.log(jsonValue);
        /* MOVE OLD TO NEW IMAGE PROEPRTY
         * db and tmp property
         */
        this.Image[this.getUid('old')]={
                data:{
                    id:this.Image[jsonValue.old].data.id,
                    tmp:'d'
                }
            };
        //console.log(this.Image);
        /* UPDATE CURRENT */
        this.updateChosenImageProperty(jsonValue.old,jsonValue.new.new);
    }
    updateImageHelplink(prop){
        //console.log('ProjectStageToolFile::updateImageHelplink()');
        /* UPDATE DOM */
        this.Html.removeChilds(this.Helplink.file[prop].name);
        this.Helplink.file[prop].name.append(this.getImageHref(this,this.Image[prop]));   
        this.Html.removeChilds(this.Helplink.file[prop].size);
        this.Helplink.file[prop].size.append(this.getImagePropertyInfo(this.Image[prop]));
    }
    updateChosenImageProperty(prop,jsonValue){
        /* SET IMAGE PROEPRTY FROM BACK-END */
        this.Image[prop].data.id=0;
        this.Image[prop].data.tmp='y';
        this.Image[prop].property.height=jsonValue.h;
        this.Image[prop].property.width=jsonValue.w;
        this.Image[prop].property.mime=jsonValue.m;
        this.Image[prop].property.uri=jsonValue.n;
        this.Image[prop].property.tmpid=prop;
        /* GET AND SET IMAGE PROPERTY FROM INPUT */
        this.Image[prop].property.lastModified=this.Helplink.file[prop].input.files[0].lastModified;
        this.Image[prop].property.lastModifiedDate=this.Helplink.file[prop].input.files[0].lastModifiedDate;
        this.Image[prop].property.name=this.Helplink.file[prop].input.files[0].name;
        this.Image[prop].property.type=this.Helplink.file[prop].input.files[0].type;
        this.Image[prop].property.size=this.Helplink.file[prop].input.files[0].size;
    }
}