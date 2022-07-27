/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


class ProjectStageToolFile{
    infoRef=new Object();
    ProjectStageTool = new Object();
    
    constructor(ProjectStageTool){
        this.ProjectStageTool = ProjectStageTool;
    }
    
    getFile(property){
        console.log('ProjectStageToolFile::getFile()');
        /*
         * property - reference for example subsectionrow.paragraph.style
         * ele - reference for example helplink
         */  
        
        property.uid=(new Date()).getTime();
        
        var mainDiv =  document.createElement('div');
        var mainLabel = this.ProjectStageTool.Tool.createLabel('Wskaż plik:');  
        var inputDiv = document.createElement('div');
            inputDiv.classList.add('custom-file');//'custom-file',
        var input = document.createElement('input');
            input.classList.add('custom-file-input');//,'form-control-file','form-control-sm'
            input.setAttribute('type','file');
            input.setAttribute('id','validatedCustomFile');
            input.setAttribute('name',property.uid);
            input.setAttribute('multiple','');
        var label = document.createElement('label');
            label.classList.add('custom-file-label');//,'border','border-danger','border-1'
            input.setAttribute('for','validatedCustomFile');
        var labelText=document.createTextNode('Wskaż plik...');
            label.appendChild(labelText);
        var divInfo = document.createElement('div');
            divInfo.classList.add('pl-2','d-none');//'text-danger'
            //divInfo.style.display='none';

            inputDiv.appendChild(input);
            inputDiv.appendChild(label);
            inputDiv.appendChild(divInfo);
            /* SetUp DIV ERROR REFERENCE */
            this.infoRef = divInfo;
        var self = this;
            /* CLOSURE */
            input.onchange = function(){
                
                let fd = new FormData();
                
                let File = {};
                let error=false;
                let info=document.createElement('div');
                let fileName='';
                let errorValue='';
                let infoClass='';
                let namesList='';
                let space='';
                /* IN bytes */
                let size=0;
                
                let maxSize =20971520;/* MAX DEFAULT 20 Mb - SIZE, not size on hard drive */
                let type=new Array(
                        'image/bmp',
                        'image/jpeg',
                        'image/png'
                        );
                let cut = function(value,max){
                    console.log(value);
                    console.log(max);
                    if(value.length>max){
                        return value.slice(0,max-3)+'...';
                    }
                    return value;
                };
                console.log('this:');
                console.log(this);
                console.log(this.parentNode);
                console.log(label);
                self.ProjectStageTool.Html.removeChilds(label);
                self.ProjectStageTool.Html.removeChilds(divInfo);
                
                    if(this.files.length===0){
                        console.log('no files');
                        label.appendChild(document.createTextNode('Nie wskazano pliku...'));
                        if(label.classList.contains('border-success')){
                            label.classList.remove('border-success');
                        }
                        if(label.classList.contains('border-danger')){
                            label.classList.remove('border-danger');
                        }
                        return true;
                    }
                    console.log('this files:');
                    console.log(this.files);
                
                    for (let i = 0; i < this.files.length; i++) {
                        /* SET DEFAULT */
                        infoClass='text-success';
                        errorValue='';
                        console.log(this.files.item(i));
                        console.log(this.files.item(i).name);
                        namesList+=space+this.files.item(i).name.trim();
                        console.log(typeof(this.files.item(i).size));
                        size=size + this.files.item(i).size;
                        space=' ';
                       
                        if(size>maxSize){
                            error=true;
                            infoClass='text-danger';
                            errorValue=' - size limit exceeded';
                            
                        }
                        if(!type.includes(this.files.item(i).type,0)){
                            error=true;
                            infoClass='text-danger';
                            errorValue=' - not allowed type → '+this.files.item(i).type+'';
                        }
                        var counterValue=  document.createTextNode('['+i+'] ');
                        
                        fileName=cut(this.files.item(i).name,138-counterValue.length-errorValue.length); 
                        fileName+=errorValue;
                        var text=document.createTextNode(fileName);
                        var p = document.createElement('p');
                            p.classList.add(infoClass,'mt-0','mb-0');
                            p.setAttribute('title',this.files.item(i).name);
                        //var counterValue = document.createTextNode('['+i+'] ');
                        var counterLabel=  document.createElement('span');
                            counterLabel.classList.add('text-secondary');
                            counterLabel.appendChild(counterValue);
                            
                            p.appendChild(counterLabel);
                            p.appendChild(text);       
                            info.appendChild(p);
                            File={
                                lastModified:this.files.item(i).lastModified,
                                lastModifiedDate:this.files.item(i).lastModifiedDate,
                                name:this.files.item(i).name,
                                size:this.files.item(i).size,
                                type:this.files.item(i).type,
                                data:this.files.item(i)
                            };
                            fd.append(property.uid+'-'+i,this.files.item(i),this.files.item(i).name);
                    }
                    
                    /* 
                     * cut names
                     * max - 127 char without dot and extension
                     * 
                     */
                    label.appendChild(document.createTextNode(cut(namesList,127)));
                    
                    console.log('NAMES Length:');
                    console.log(namesList.length);
                    console.log('OVERALL Files size:');
                    console.log(typeof(size));
                    console.log(size);
                    if(error){
                        if(label.classList.contains('border-success')){
                            label.classList.remove('border-success');
                        }
                        label.classList.add('border-danger');
                        if(divInfo.classList.contains('d-none')){
                            divInfo.classList.remove('d-none');
                        }
                        divInfo.appendChild(info);
                        property.lastModified='';
                        property.lastModifiedDate='';
                        property.name='';
                        property.size=0;
                        property.type='';
                    }
                    else{
                        if(label.classList.contains('border-danger')){
                            label.classList.remove('border-danger');
                        }
                        label.classList.add('border-success');
                        if(!divInfo.classList.contains('d-none')){
                            divInfo.classList.add('d-none');
                        }
                        property.lastModified=File.lastModified;
                        property.lastModifiedDate=File.lastModifiedDate;
                        property.name=File.name;
                        property.size=File.size;
                        property.type=File.type;
                        
                        var xhrRun=self.ProjectStageTool.Stage.getXhrParm('POST','uploadStageImage','setModalResponse');
                            xhrRun.o=self;
                            xhrRun.d=fd;
                            xhrRun.m='setFile';
                            self.ProjectStageTool.Stage.Xhr.run(xhrRun);  
                    }   
                    console.log(divInfo);
                    console.log(property);
                        
             };
           
            mainDiv.appendChild(mainLabel);
            mainDiv.appendChild(inputDiv);
            
        return  mainDiv;
    }
    setFile(response){
        console.log('ProjectStageToolFile::setFile()');
        //console.log(response);
        //console.log(this);
        //console.log(this.FileDivErrRef);
        try{
            var data = this.ProjectStageTool.Stage.Items.parseResponse(response);
                console.log(data.data.value);
                
                for(const prop in data.data.value){
                    this.ProjectStageTool.Files[prop]=data.data.value[prop];
                }
                console.log(this.ProjectStageTool.Files);
        }
        catch (error){
            //console.log('ERROR:');
            //console.log(error);
            if(this.infoRef.classList.contains('border-success')){
                this.infoRef.classList.remove('border-success');
            }
            this.infoRef.classList.add('border-danger');
            if(this.infoRef.classList.contains('d-none')){
                this.infoRef.classList.remove('d-none');
            }
            var p = document.createElement('p');
                p.classList.add('text-danger','mt-0','mb-0');
                p.appendChild(document.createTextNode(error));       
            this.infoRef.appendChild(p);
            //alert('ProjectStageTool::setFile() Error occured!');
        }
    }
}