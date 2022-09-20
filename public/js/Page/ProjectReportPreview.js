class ProjectReportPreview{
    Html = new Object();
    Modal=new Object();
    constructor(){
        console.log('ProjectReportPreview::constructor()');
        this.Html = new Html();
        this.Modal = new Modal();
        console.log(this);
    }
    test(){
        console.log('ProjectReportPreview::test()');
    }
}
