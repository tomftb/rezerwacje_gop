class ProjectStageToolFile{
    Parent = new Object();
    Html = new Object();
    Glossary = new Object();
    ToolFile = new Object();
    ToolEle = new Object();
    Utilities = new Object();
    /* Image - references to property Image */
    Image= new Object();
    OldImage = new Array();
    Helplink = {
        info:new Object(),
        progress:new Object(),
        progressbar:new Object(),
        progresscomplete:new Object()
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
        var task = ((image.data.tmp==='n')? 'getStageImage' : 'getTmpStageImage');
        var label = this.Utilities.cutName(image.property.name,140);
        var sizeInMb = Math.round((image.property.size/1048576)*100)/100;//1024 * 1024
        var a = document.createElement('a');
            a.setAttribute('href',window.router+task+'&file='+image.property.uri);
            a.setAttribute('target','_blank');
            a.setAttribute('title',label);
        var h = document.createElement('h6');
            h.classList.add('text-primary','mt-1','mb-0','font-weight-bold');
            a.appendChild(document.createTextNode(label));
            h.appendChild(a);
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
        console.log('ProjectStageToolFile::getFile()');
        /*
         * property - reference for example subsectionrow.paragraph.style
         * ele - reference for example helplink
         */  
        
        //image.property.uid=(new Date()).getTime();
        
        var mainDiv =  document.createElement('div');
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
            /* SetUp DIV ERROR REFERENCE */
            this.Helplink['info'] = divInfo;
            this.Helplink['progress'] = divProgress;
        var self = this;
            /* CLOSURE */
            input.onchange = function(){
                console.log(name);
                console.log(self.ErrorStack);
                /* CLEAR FIELD progrss */
                self.Html.removeClass(self.Helplink['progress'],'d-none');//
                
                /* SET OLD IMAGE FILE NAME TO DELETE */
                //console.log('SET OLD IMAGE PROPERTY FILE NAMES:');
                self.OldImage=new Array();
                for(const prop in self.Image){   
                    console.log('SETUP OLD IMAGE:');
                    console.log(self.Image[prop]);
                    console.log(self.Image[prop].property.uri);     
                    if(self.Image[prop].data.tmp!=='n'){
                        self.OldImage.push(self.Image[prop].property.uri);
                    }
                    //self.OldImage[prop]=self.Image[prop].property.uri;     
                };
                //throw 'test-stop-155';
                self.deleteImageProperty(self.Image); 
                //console.log(self.OldImage);
                /* CLEAR IMAGE  - delete not set empty object */
                //self.Image={};
                let error=false;
                let info=document.createElement('div');
                let fileName='';
                let errorValue='';
                let infoClass='';
                let namesList='';
                let space='';
                self.fileSelected=this.files.length;
                self.fileUpload=0;
                /* IN bytes */
                //let size=0;
                
                let maxSize =20971520;/* MAX DEFAULT 20 Mb - SIZE, not size on hard drive */
                let type=new Array(
                        'image/bmp',
                        'image/jpeg',
                        'image/png'
                        );
                //console.log('this:');
                //console.log(this);
                //console.log(this.parentNode);
                //console.log(label);
                self.Html.removeChilds(label);
                self.Html.removeChilds(divInfo);
                self.Html.removeChilds(self.Helplink['file']);
                self.Html.removeChilds(self.Helplink['progress']);
                self.Html.removeChilds(self.Helplink['progresscomplete']);
                
                
                /* DELETE from ErrorStack */
                self.ErrorStack.remove(name);
                /* DELETE OLD FILES */
                self.checkBeforeDelete(self);   
                
                    if(self.fileSelected===0){
                        console.log('no files');
                        label.appendChild(document.createTextNode('Nie wskazano pliku...'));
                        self.Html.removeClass(label,['border-success','border-danger']);
                                  
                        return true;
                    }
                    
                console.log('this files:');
                console.log(this.files);
                console.log(self.fileSelected);
                    for (let i = 0; i < self.fileSelected; i++) {
                        //let uid=(new Date()).getTime();
                        //+(new Date()).getMilliseconds();//(new Date()).getTime()+
                        //let uid = Math.random();
                        let uid = Math.floor(Math.random() * 10000000);
                        
                        /* SET DEFAULT */
                        infoClass='text-success';
                        errorValue='';
                        //console.log(this.files.item(i));
                        console.log(this.files.item(i).name);
                        namesList+=space+this.files.item(i).name.trim();
                        //console.log(typeof(this.files.item(i).size));
                        //size=size + this.files.item(i).size;
                        space=' ';
                        if(this.files.item(i).size>maxSize){
                        //if(size>maxSize){
                            error=true;
                            infoClass='text-danger';
                            errorValue+=' - size limit exceeded'; 
                        }
                        if(!type.includes(this.files.item(i).type,0)){
                            error=true;
                            infoClass='text-danger';
                            errorValue+=' - not allowed type → '+this.files.item(i).type+'';
                        }
                        let counterValue=  document.createTextNode('['+i+'] ');
                        
                            fileName=self.Utilities.cutName(this.files.item(i).name,138-counterValue.length-errorValue.length); 
                            fileName+=errorValue;
                           
                        let text=document.createTextNode(fileName);
                        let p = document.createElement('p');
                            p.classList.add(infoClass,'mt-0','mb-0');
                            p.setAttribute('title',this.files.item(i).name);
                        //var counterValue = document.createTextNode('['+i+'] ');
                        let counterLabel=  document.createElement('span');
                            counterLabel.classList.add('text-secondary');
                            counterLabel.appendChild(counterValue);
                            
                            p.appendChild(counterLabel);
                            p.appendChild(text);       
                            info.appendChild(p);
                            if(error){ continue; }
                            self.Image[uid]={
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
                                   property:{
                                        lastModified:this.files.item(i).lastModified,
                                        lastModifiedDate:this.files.item(i).lastModifiedDate,
                                        name:this.files.item(i).name,
                                        size:this.files.item(i).size,
                                        type:this.files.item(i).type,
                                        uri:'',
                                        order:'beforetext',//after
                                        orderName:'Przed tekstem'//Za
                                        
                                    },
                                    dataFile:this.files.item(i)
                                //uid:uid
                            };
                            
                    }
                    
                    /* 
                     * cut names
                     * max - 127 char without dot and extension
                     * 
                     */
                    label.appendChild(document.createTextNode(self.Utilities.cutName(namesList,127)));
                    
                    //console.log('NAMES Length:');
                    //console.log(namesList.length);
                    //console.log('OVERALL Files size:');
                    //console.log(typeof(size));
                    //console.log(size);
                    if(error){
                        self.ErrorStack.add(name,errorValue);
                        self.Html.removeClass(label,['border-success']);
                        self.Html.addClass(label,['border-danger']);
                        self.Html.removeClass(divInfo,['d-none']);
                        divInfo.appendChild(info);
                        /* delete proeprty not set emty image */
                        //self.Image={};
                    }
                    else{
                        self.setProgress();
                        self.Html.removeClass(label,['border-danger']);
                        self.Html.addClass(label,['border-success']);
                        self.Html.addClass(divInfo,['d-none']); 
                        console.log(self.Image);
                        /* DELETE OLD FILES */
                        self.checkBeforeDelete(self);
                                       
                    }   
                    //console.log(divInfo);                        
             };
            //console.log(self.Image);
            mainDiv.appendChild(mainLabel);
            mainDiv.appendChild(inputDiv);
            
        return  mainDiv;
    }
    deleteImageProperty(image){
        for(const prop in image){
            delete image[prop];
                    //self.OldImage[prop]=self.Image[prop].property.uri;     
        };
    }
    setUploadImage(response){
        console.log('ProjectStageToolFile::setUploadImage()');
        //console.log(response);
        //console.log(this);
        //console.log(this.FileDivErrRef);
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
           this.Helplink['progresscomplete'].appendChild(document.createTextNode('Something went wrong! Upload process not complete '+this.fileUpload+'/'+this.fileSelected+'!')); 
       }
    }
    uploadFiles(response){
         console.log('ProjectStageToolFile::uploadFiles()');
         try{
            var data = this.Parent.Stage.Items.parseResponse(response);
            this.upload(this);
        }
        catch (error){
            //console.log('ERROR:');
            //console.log(error);
            this.Html.removeClass(this.Helplink['info'],'border-success');
            this.Html.removeClass(this.Helplink['info'],['d-none']);
            this.Html.addClass(this.Helplink['info'],['border-danger']);
          
            var p = document.createElement('p');
                p.classList.add('text-danger','mt-0','mb-0');
                p.appendChild(document.createTextNode(error));       
            this.Helplink['info'].appendChild(p);
            
                //this.Image={};        
          }
    }
    upload(t){
        /* t - thsis / self */
        console.log('ProjectStageToolFile::upload()');
        
        for(const prop in t.Image){
            //for(let i = 0; i<self.Image.length;i++){
            console.log(t.Image[prop]);
            let fd = new FormData();
                fd.append(prop,t.Image[prop].dataFile,t.Image[prop].property.name);  
            let Xhr= new Xhr2();
                this.Parent.Stage.Items.setLoadModalInfo(Xhr); 
                Xhr.setOnError(this.Parent.Stage.Items.modalXhrError()); 
                Xhr.run({
                    t:'POST',
                    u:window.router+'uploadStageImage',
                    c:true,
                    d:fd,
                    o:t,
                    m:'setUploadImage'
                });
        }
        console.log('Finish');
        console.log(t.Image);
    }
    checkBeforeDelete(self){
        console.log('ProjectStageToolFile::checkBeforeDelete()');
        console.log(self.OldImage);
        //throw 'asdasd';
        if(self.OldImage.length===0){
            self.upload(self);
            return true;
        }
        self.deleteFiles(self.OldImage,self,'uploadFiles');    
    }
    deleteFiles(file,o,m){
        console.log('ProjectStageToolFile::deleteFiles()');       
        console.log('file list:');
        console.log(file);
        //throw 'aaaaaa';
        var Xhr= new Xhr2();
            this.Parent.Stage.Items.setLoadModalInfo(Xhr); 
            Xhr.setOnError(this.Parent.Stage.Items.modalXhrError()); 
        var fd = new FormData();
        for(var prop=0; prop<file.length;prop++){      
            console.log(file[prop]);   
            fd.append(prop,file[prop]);  
        };
        Xhr.run({
                t:'POST',
                u:window.router+'deleteTmpStageImage',
                c:true,
                d:fd,
                o:o,
                m:m
            });
    }
}
