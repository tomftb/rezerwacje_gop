class DocPreviewPage{
    Html = new Object();
    Utilities = new Object();
    helplink = new Object();
    data = new Object();
    Link={
        heading:new Object(),
        body:new Object(),
        footer:new Object(),
        all:new Object()
    }
    constructor(){
        console.log('DocPreviewPage::constructor()');
        this.Html=new Html();
        this.Utilities = new Utilities();
    }
    getPage(){
        //console.log('DocPreview::getPage()');   
        //console.log(this.helplink);
        //console.log(this.data);
        //throw 'aaa';
        this.helplink.preview.whole.style.backgroundColor='rgb(251,251,251)';
        var wholePage=document.createElement('div');
            wholePage.style.backgroundColor=this.data.style.backgroundColor;
            wholePage.style.width='813px';
            wholePage.style.height='1142px';
            wholePage.style.backgroundColor='rgb(251,251,251)';
            wholePage.style.paddingTop='10px';
            wholePage.style.marginLeft='162px'; /* ALL 324, MAIN 10 */
            wholePage.style.paddingLeft='10px'; /* ALL 324, MAIN 10 */
        var blankPage=document.createElement('div');
            blankPage.style.width='791px';
            blankPage.style.height='1120px';   
            blankPage.style.border='1px solid rgb(198,198,198)'; 
            /* TO FIX -> DEFAULT WHITE #FFFFFF*/
            blankPage.style.backgroundColor=this.data.style.backgroundColor;
            //blankPage.style.backgroundColor='#FFFFFF';
            //console.log(blankPage);
            blankPage.append(this.getHeading(),this.getBody(),this.getFooter());
            this.Link.all=blankPage;
            wholePage.appendChild(blankPage);
            this.helplink.preview.whole.appendChild(wholePage);
        return this.Link;
    }
    getHeading(){
        var ele=document.createElement('div');
            //ele.style.backgroundColor=this.data.style.backgroundColor;
            ele.style.width='699px';
            ele.style.height='93px';
            /* IT IS DEPED OF FONT SIZE */
            ele.style.paddingTop='46px';
            /* DEFAULT LEFT MARGIN 2,5 cm */ 
            ele.style.paddingLeft='92px'; /* ALL 314, MAIN 10 */
            //console.log(ele);
            this.Link.heading=ele;
            return ele;
    }
    getFooter(){
        var ele=document.createElement('div');
            ele.style.width='699px';
            ele.style.height='93px';
            /* IT IS DEPED OF FONT SIZE */
            ele.style.paddingBottom='46px';
            /* DEFAULT LEFT MARGIN 2,5 cm */ 
            ele.style.paddingLeft='92px'; /* ALL 314, MAIN 10 */
            //console.log(ele);
            this.Link.footer=ele;
            return ele;
    }
    getBody(){
        var ele=document.createElement('div');
            ele.style.width='699px';
            ele.style.height='932px';// 933px
            /* IT IS DEPED OF FONT SIZE */
            ele.style.paddingTop='0px';
            /* DEFAULT LEFT MARGIN 2,5 cm */ 
            ele.style.paddingLeft='92px'; /* ALL 314, MAIN 10 */
            //console.log(ele);
            this.Link.body=ele;
            return ele;
    }
}
