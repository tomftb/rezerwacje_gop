class ProjectReportVariable{
    Html = new Object();
    ErrorStack=new Object();
    Xhr=new Object();
    StageDataUtilities=new Object();
    router='';
    appUrl='';
    perm=new Array();
     constructor(Parent){
        console.log('ProjectReportVariable::constructor()');
        try{
            this.ErrorStack = Parent.ErrorStack;
            this.Xhr=Parent.Xhr2;
            this.StageDataUtilities=Parent.StageDataUtilities;
            this.router=Parent.router;
            this.appUrl=Parent.appUrl;
            this.perm=Parent.perm;
            //this.Department = new Department();
            //this.ProjectReportVariable=new ProjectReportVariable();
        //console.log(this.router);
        //console.log(this.appUrl);
        //console.log(this.perm);
        }
        catch(e){
            throw e;
        };
    }
}
