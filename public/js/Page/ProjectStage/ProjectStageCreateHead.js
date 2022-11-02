class ProjectStageCreateHead{
    Department=new Object();
    StageData=new Object();
    Parent=new Object();
    Tool=new Object();
    Html=new Object();
    Helplink=new Object();
    constructor(Parent,Department){
       this.Parent=Parent;
       this.Html=Parent.Html;
       this.Tool=new Tool(Parent.Html);
       this.Department=Department;
    };
    setData(StageData,AvailableDepartment,DefaultDepartment,Helplink){
    //setData(StageData,Department,Helplink){
        this.Department.setData(AvailableDepartment,DefaultDepartment);
        //this.Department=Department;
        this.StageData=StageData;
        this.Helplink=Helplink;
        
    }
    set(ele){//ele
        //console.log('ProjectStageCreateHead.set()');
        var self = this;
        var titleError=this.Tool.getDivError();
        var titleDiv=this.Html.getRow();
            //this.helplink['titleDiv']=titleDiv;
        var titleLabelDiv=this.Html.getCol(1);
        var titleInputDiv=this.Html.getCol(11);
            titleLabelDiv.appendChild(this.createLabel('h3','Tytuł:'));
        var input=this.Html.getInput('title',this.StageData.Stage.data.title,'text');   
            input.oninput = function(){
                self.StageData.Stage.data.title=this.value;
            };
            input.onblur = function(){
                //console.log('check data title');
                //self.checkInput(input,'title');
                self.Parent.checkInput('title');
            };
            input.classList.add('form-control');
            input.setAttribute('placeholder','Enter title');
            input.setAttribute('aria-describedby',"titleHelp" );
            titleInputDiv.appendChild(input);
            self.Helplink.input['title']={
                input:input,
                error:titleError.div
            };
        var helpValue=document.createTextNode('Staraj sie wprowadzić jednoznaczy tytuł.Należy wprowadzić minimalnie 1 znak, a maksymalnie 1024 znaki.');     
         
        var help=document.createElement('small');
            help.setAttribute('id','titleHelp');
            help.classList.add('form-text','text-muted');
            help.appendChild(helpValue);
            titleInputDiv.appendChild(help);
        titleDiv.append(titleLabelDiv,titleInputDiv);
        ele.append(titleDiv,titleError.ele,this.setDepartment());
    }
    createLabel(h,value){
        var titleLabelValue=document.createTextNode(value);
        var titleLabel=document.createElement(h);
            titleLabel.classList.add('text-center','font-weight-bold');
            titleLabel.appendChild(titleLabelValue);
            return titleLabel;
    }
    setDefaultDepartment(){
        
    }
    setDepartment(){
        //console.log('ProjectStageCreateHead.setDepartment()');
        //console.log(this);
        var self=this;
        //throw 'sssssssssssss';
        //this.Department.setData(this.DepartmentData,this.DefaultDepartment);
        var departmentDiv=this.Department.get();
        this.Helplink['department']=this.Department.getLink();
        var departmentListNames = this.Department.DepartmentData.departmentListNames; 
        /* CLOUSURE */
        this.Helplink['department'].onchange = function () {              
                self.StageData.Stage.data.departmentId = this.value;
                self.StageData.Stage.data.departmentName = departmentListNames[this.selectedIndex];  
            };
        return departmentDiv;
    }
}
