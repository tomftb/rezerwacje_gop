class ProjectReportVariableImageAction{
    Helplink={
       main:new Object(),
       label:new Object(),
       input:new Object(),
       confirm:new Object(),
       cancel:new Object(),
       file:new Object()
    }
    Utilities=new Object();
    Xhr=new Object();
    Glossary=new Object();
    ProjectStageToolFile=new Object();
    Html=new Object();
    Modal=new Object();
    router='';
    appUrl='';
    Parse=new Object();
    ImageDb=new Object();
    constructor(field,Parent){
        //console.log('ProjectReportVariableImageAction.constructor()');
        this.Helplink.main=field;
        this.setField(this);
        this.Utilities=Parent.Utilities;
        this.Xhr=Parent.Xhr;
        this.Glossary=Parent.Glossary;
        this.Html=Parent.Html;
        this.Modal=Parent.Modal;
        //this.ToolFields=new ToolFields();
        this.Tool=new Tool(Parent.Html);
        this.Parse=new Parse();
        this.router=Parent.router;
        this.appUrl=Parent.appUrl;
        this.ProjectStageTool=new ProjectStageTool();
        this.ProjectStageTool.setReportParent(this);
        this.ProjectStageToolFile=new ProjectStageToolFile(Parent.Utilities,Parent.Html,Parent.Modal,Parent.router,Parent.appUrl);
        this.ProjectStageToolFile.setReportParent(this);
    }
    setField(self){
        var col=document.createElement('DIV');
            col.classList.add('col-12','border','border-warning');
        var rowHead=document.createElement('DIV');
            rowHead.classList.add('row','bg-warning');
        var rowBody=document.createElement('DIV');
            rowBody.classList.add('row');
        var colBody=document.createElement('DIV');
            colBody.classList.add('col-12');
            rowBody.append(colBody);
        var rowFooter=document.createElement('DIV');
            rowFooter.classList.add('row','ml-1','mt-1','mb-1','mr-0');
            /* LABEL VARIABLE NAME */
        var span=document.createElement('span');
            span.classList.add('text-dark','font-weight-normal');
            /* LABEL */
        var p=document.createElement('p');
            p.classList.add('h4','m-0','p-1','text-white');
            p.append(document.createTextNode('Obraz/y: '));       
            rowHead.append(p);
            /* BUTTONS */
        var divColButton=document.createElement('DIV');
            divColButton.classList.add('col-12','text-right','pr-0');
        var divButton=document.createElement('div');
            divButton.classList.add('btn-group');
            divButton.setAttribute('role','group');
            divButton.setAttribute('aria-label','BTN-VARIABLE-GROUP');
        var buttonCancel=document.createElement('button');
            buttonCancel.setAttribute('type','button');
            buttonCancel.classList.add('btn','btn-dark'); 
            buttonCancel.append(document.createTextNode('Zamknij'));
            buttonCancel.onclick = function(){
                self.Helplink.main.classList.add('d-none');
                self.clearEle(span);
            };
        var buttonRestore=document.createElement('button');
            buttonRestore.setAttribute('type','button');
            buttonRestore.classList.add('btn','btn-warning');
            divButton.append(buttonCancel,buttonRestore);//
            buttonRestore.append(document.createTextNode('Przywróć'));
            divColButton.append(divButton);
            rowFooter.append(divColButton);
            col.append(rowHead,rowBody,rowFooter);
            /* SET LINKS */
            self.Helplink.main.append(col);
            this.Helplink.label=span;
            this.Helplink.input=colBody;
            this.Helplink.restore=buttonRestore;
            this.Helplink.cancel=buttonCancel;
    };
    change(ImageStructure,Report,ParagraphImage,i){
        console.log('ProjectReportVariableImageAction.change()');
        console.log(ImageStructure);
        var self=this;
        console.log(self);
        /* SET CANCEL BUTTON */
        //ImageStructure.Helplink.exit.onclick=function(){
          //  self.cancel(ImageStructure,self,ParagraphImage,i);
       // };
        /* SET CONFIRM BUTTON */
        ImageStructure.Helplink.restore.onclick=function(){
            self.restore(ImageStructure,self,ParagraphImage,i);
        };
        /* SET IMAGE NAME */
        //this.clearEle(this.Helplink['label']);
        //this.Helplink['label'].append(document.createTextNode(this.Utilities.cutName(ParagraphImage[i].property.name,85)));         
        /* SHOW DIV */
        this.Helplink['main'].classList.remove('d-none');
        this.clearEle(this.Helplink['input']);
        this.ProjectStageToolFile.setImage(ParagraphImage);
        this.ProjectStageToolFile.setReportTool(this.Helplink['input'],ParagraphImage,i,this.ProjectStageToolFile.Helplink['file'],ImageStructure);
        Report.data.change='y';
    }
    clearEle(ele){
        while (ele.firstChild) {
            ele.removeChild(ele.firstChild);
        };
    }
    //cancel(ImageStructure,self,ParagraphImage,i){
       // console.log('ProjectReportVariableImageAction.cancel()');
       // console.log(ImageStructure.ImageDb);
        //console.log(self);
        //console.log(ParagraphImage);
        //console.log(i);
       //console.log(ImageStructure.Image);
   // }
    restore(ImageStructure,self,ParagraphImage,i){
        console.log('ProjectReportVariableImageAction.confirm()');
        console.log(ImageStructure);
        console.log(ImageStructure.ImageDb);
        console.log(self);
        console.log(ParagraphImage);
        console.log(i);
    }
}

