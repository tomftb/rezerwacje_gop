class ProjectReportVariable{
    Html = new Object();
    ErrorStack=new Object();
    Xhr=new Object();
    StageDataUtilities=new Object();
    router='';
    appUrl='';
    perm=new Array();
    Modal=new Object();
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
            this.Modal=Parent.Modal;
            //this.Department = new Department();
            //this.ProjectReportVariable=new ProjectReportVariable();
            //console.log(this.router);
            //console.log(this.appUrl);
            //console.log(this.perm);
            console.log(this);
        }
        catch(e){
            throw e;
        };
    }
    createChosenStageVariable(Report,stageId,variable){
        console.log('ProjectReportVariable.createChosenStageVariable()');
        try{
            variable.list=document.createElement('ul');
                this.Html.addClass(variable.list,['mt-0','mb-0','text-dark']);
                variable.list.style.listStyleType='disc'; 
            
            var self=this;   
            for(const s in Report.stage[stageId].section){     
                for(const su in Report.stage[stageId].section[s].subsection){  
                    for(const r in Report.stage[stageId].section[s].subsection[su].subsectionrow){
                        //f(Stage.section[s].subsection[su].subsectionrow[r],o);
                        /* VARIABLE */
                        //console.log(Report.stage[stageId].section[s].subsection[su].subsectionrow[r]);
                        for(const v in Report.stage[stageId].section[s].subsection[su].subsectionrow[r].paragraph.variable){
                            let rowLi = document.createElement('li'); 
                            let spanLi = document.createElement('span');
                                this.Html.addClass(spanLi,['text-dark']);
                                spanLi.append(document.createTextNode('[v] '+Report.stage[stageId].section[s].subsection[su].subsectionrow[r].paragraph.variable[v].name));
                                spanLi.style.cursor='pointer';
                                spanLi.onclick = function(){
                                    console.log('ProjectReportVariable.createChosenStageVariable().onclick()\nSTAGE ID:');
                                    console.log(stageId);
                                    console.log(variable);
                                    //console.log(Report.stage[stageId].section[s].subsection[su].subsectionrow[r].paragraph.variable[v]);
                                    //console.log(this);
                                    //console.log(self.Modal.link['variablesEle']);
                                    /* SET VARIABLE NAME */
                                    self.Html.removeChilds(self.Modal.link['variablesLabel']);
                                    self.Modal.link['variablesLabel'].append(document.createTextNode(Report.stage[stageId].section[s].subsection[su].subsectionrow[r].paragraph.variable[v].name));
                                    /* SET VARIABLE VALUE */
                                    self.Modal.link['variablesInput'].value=Report.stage[stageId].section[s].subsection[su].subsectionrow[r].paragraph.variable[v].value;
                                    /* SHOW DIV */
                                    self.Html.removeClass(self.Modal.link['variablesEle'],'d-none');
                                    //self.t.Modal.link['variablesInput'];
                                    self.Modal.link['variablesSaveButton'].onclick=function(){
                                        if(self.Modal.link['variablesInput'].value!==Report.stage[stageId].section[s].subsection[su].subsectionrow[r].paragraph.variable[v].value){
                                             /* SET CHANGE */
                                            Report.data.change='y';
                                            Report.stage[stageId].section[s].subsection[su].subsectionrow[r].paragraph.variable[v].value=self.Modal.link['variablesInput'].value;
                                        }
                                        //console.log(self.ChosenReport[0].data.change='y');
                                        self.Html.addClass(self.Modal.link['variablesEle'],'d-none');  
                                        self.Html.removeChilds(self.Modal.link['variablesLabel']);
                                        //console.log(self.Modal.link['variablesInput'].value);
                                        Report.stage[stageId].section[s].subsection[su].subsectionrow[r].paragraph.variable[v].value=self.Modal.link['variablesInput'].value;
                                        //console.log('Actual Report change proeprty value:');
                                        //console.log(Report.data.change);
                                    };
                                };
                                spanLi.onmouseover = function (){
                                    self.Html.removeClass(this,"text-dark");
                                    self.Html.addClass(this,"text-purple");
                                };
                                spanLi.onmouseleave = function (){
                                    self.Html.removeClass(this,"text-purple");
                                    self.Html.addClass(this,"text-dark");
                                };
                                rowLi.append(spanLi);
                                variable.list.append(rowLi);  
                                variable.found=true;
                        }
                        /* IMAGE */
                        for(const i in Report.stage[stageId].section[s].subsection[su].subsectionrow[r].image){
                            //console.log(Report.stage[stageId].section[s].subsection[su].subsectionrow[r].image[i]);
                            //return true;
                            let rowLi = document.createElement('li'); 
                            let spanLi = document.createElement('span');
                                this.Html.addClass(spanLi,['text-dark']);
                                spanLi.append(document.createTextNode('[i] '+Report.stage[stageId].section[s].subsection[su].subsectionrow[r].image[i].property.name));
                                spanLi.style.cursor='pointer';
                                spanLi.onmouseover = function (){
                                    self.Html.removeClass(this,"text-dark");
                                    self.Html.addClass(this,"text-warning");
                                };
                                spanLi.onmouseleave = function (){
                                    self.Html.removeClass(this,"text-warning");
                                    self.Html.addClass(this,"text-dark");
                                };
                                rowLi.append(spanLi);
                                variable.list.append(rowLi);  
                                variable.found=true;
                        }
                    }
                }
            }
           
        }
        catch(e){
            console.log(e);
            throw 'Application error occurred! Contact with Administrator!';
        }
       //return document.createTextNode('');
    }
}
