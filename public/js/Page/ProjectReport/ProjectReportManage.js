class ProjectReportManage{
    Html=new Object();
    Utilities=new Object();
    Heading=new Object();
    Footer=new Object();
    
    constructor(Html,Xhr,Utilities,router,Parse){
        console.log('ProjectReportManage.constructor()');
        this.Html = Html;
        this.Utilities=Utilities;
        this.Heading=new ProjectReportManageHeading(Html,Xhr,Utilities,router,Parse);
        this.Footer=new ProjectReportManageFooter(Html,Xhr,Utilities,router,Parse);
    }
    getHead(){
        //console.log('ProjectReportView::getReportHead()');
        var row=this.Html.getRow();
            row.classList.add('mt-1');
        var col=this.Html.getCol(12);
            /* ASSING BUTTON GROUP */  
            this.getMainButton();
             /* SET FOOTER HEDAING FIELD */
            col.append(this.getMainButton(),this.Heading.getField(),this.Footer.getField());//this.Link.heading,this.Link.footer
            row.append(col);
            console.log(row);
        return row;
    }
    getMainButton(){
        //console.log('ProjectReportManage.setGroup()');
        var main=this.Html.getRow();
            main.classList.add('m-1');
        /* ALL BUTTONS GROUP */
        var group=this.getButtonGroup('Heading Fotter');
        /* APPEND */
        group.append(this.Heading.getMainButton(),this.Footer.getMainButton());
        main.append(group);
        return main;
    }
    getButtonGroup(ariaLabel){
        var group=document.createElement('div');
            group.classList.add('btn-group');
            group.setAttribute('role','group');
            group.setAttribute('aria-label',ariaLabel);
        return group;
    }
    setData(ChosenReport,AvailableFooter,AvailableHeading){
        console.log('ProjectReportManage::setData()');
        console.log(ChosenReport);
        /* Heading */
        this.Heading.setDefaultData(ChosenReport,AvailableHeading);
        /* Footer */
        this.Footer.setDefaultData(ChosenReport,AvailableFooter);
    }
    updateData(){
        console.log('ProjectReportManage::updateData()');
        /* Heading */
        this.Heading.updateDefaultData();
        /* Footer */
        this.Footer.updateDefaultData();
    }
}