class ProjectReportVariable{
    Html = new Object();
    ErrorStack=new Object();
    Xhr=new Object();
    StageDataUtilities=new Object();
    router='';
    appUrl='';
    perm=new Array();
    //Modal=new Object();
    Utilities=new Object();
    ImageAction=new Object();
    VariableAction=new Object();
    Glossary=new Object();
    constructor(Parent){
        console.log('ProjectReportVariable::constructor()');
        try{
            this.ErrorStack = Parent.ErrorStack;
            this.Xhr=Parent.Xhr;
            this.StageDataUtilities=Parent.StageDataUtilities;
            this.router=Parent.router;
            this.appUrl=Parent.appUrl;
            this.perm=Parent.perm;
            this.Html=Parent.Html;
            this.Utilities=Parent.Utilities;
            this.Glossary=Parent.Glossary;
            this.ImageAction=new ProjectReportVariableImageAction(Parent.Modal.link['imageShiftField'],this);
            this.VariableAction=new ProjectReportVariableAction(Parent.Modal.link['variableShiftField']);
            console.log(this);
        }
        catch(e){
            throw e;
        };
    }
    createEntry(Report,stageId,variable){
        //console.log('ProjectReportVariable.createChosenStageVariable()');
        try{
            variable.list=document.createElement('ul');
                this.Html.addClass(variable.list,['mt-0','mb-0','text-dark']);
                variable.list.style.listStyleType='disc'; 
            for(const s in Report.stage[stageId].section){     
                for(const su in Report.stage[stageId].section[s].subsection){  
                    for(const r in Report.stage[stageId].section[s].subsection[su].subsectionrow){
                        /* VARIABLE */
                        this.getVariableEntry(Report,Report.stage[stageId].section[s].subsection[su].subsectionrow[r].paragraph,variable);
                        /* IMAGE */
                        this.getImageEntry(Report,Report.stage[stageId].section[s].subsection[su].subsectionrow[r],variable);
                    }
                }
            }
        }
        catch(e){
            console.log(e);
            throw 'Application error occurred! Contact with Administrator!';
        }
    }
    getVariableEntry(Report,Paragraph,variable){
        //console.log(Paragraph);
        if(!Paragraph.hasOwnProperty('variable')){
            throw 'No variable property';
        }
        var self=this;
        for(const v in Paragraph.variable){
            let entry=this.getEntryEle(Paragraph.variable[v].name,'v',"text-purple");
                entry.onclick = function(){
                    self.VariableAction.change(Report,Paragraph.variable,v);
                };
                variable.list.append(entry);  
                variable.found=true;
        }
    }
    getImageEntry(Report,Paragraph,variable){
        //console.log('ProjectReportVariable.getImageEntry()');
        //console.log(Paragraph);
        if(!Paragraph.hasOwnProperty('image')){
            throw 'No image property';
        }
        var self=this;
        for(const i in Paragraph.image){
            let entry=this.getEntryEle(Paragraph.image[i].property.name,'i',"text-warning");
                entry.onclick = function(){
                    self.ImageAction.change(Report,Paragraph.image,i);
                };
                variable.list.append(entry);  
                variable.found=true;
        }
    }
    getEntryEle(name,type,color){
        //var self=this;
        var li=document.createElement('li'); 
        var span=document.createElement('span');
            span.classList.add(color);    
            span.append(document.createTextNode('['+type+'] '));
        var span2=document.createElement('span');
            span2.classList.add('text-dark');
            span2.append(document.createTextNode(this.Utilities.cutName(name,55)));
            span2.title=name;
            span2.style.cursor='pointer';
            span2.onmouseover = function (){
                this.classList.remove("text-dark");
                this.classList.add(color);
            };
            span2.onmouseleave = function (){
                this.classList.remove(color);
                this.classList.add("text-dark");
            };
            li.append(span,span2);
        return li;
    }
}