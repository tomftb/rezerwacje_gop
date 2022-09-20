class ProjectReportView{
    Html = new Object();
    Modal=new Object();
    constructor(){
        console.log('ProjectReportView::constructor()');
        this.Html = new Html();
        this.Modal = new Modal();
        console.log(this);
    }
    test(){
        console.log('ProjectReportView::test()');
    }
    getReportHead(){
        console.log('ProjectReportView::getReportHead()');
        var mainRow=this.Html.getRow();
        /* DOCUMENT TYPE */
        var docType=this.Html.getCol('6');
        /* Variables */
        var variables=this.Html.getCol(6);
            mainRow.appendChild(docType);
            mainRow.appendChild(variables);
        return mainRow;
    }
}
