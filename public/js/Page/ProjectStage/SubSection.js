
/* TO DO */

class SubSection{
    Html=new Object();
    Utilities=new Object();
    /* SubSection DATA */
    iSection=0;
    iSub=0;
    iRow=0;
    SubSectionData=new Object();
    HelplinkSubSection=new Object();
    Link={
        main:{},
        row:{},
        button:{}
    };
    constructor(Html,Utilities){
        this.Html=Html;
        this.Utilities=Utilities;
    }
    setData(iSection,iSub,iRow,SubSectionData,HelplinkSubSection){
        this.iSection=iSection;
        this.iSub=iSub;
        this.iRow=iRow;
        this.SubSectionData=SubSectionData;
        this.HelplinkSubSection=HelplinkSubSection;
    }
    set(){
        // console.log('ProjectStageCreate::createSubsection()');
        /* CREATE HELPLINK SUBSECTION */
        this.HelplinkSubSection[this.iSub]=this.getHelpLink();
        
        var mainDiv=this.Html.getRow();
        var mainDivSubsection=this.Html.getCol(12);
        var mainDivBtn=this.Html.getCol(12);   
        this.HelplinkSubSection[this.iSub].dynamic=mainDivSubsection;
            mainDivBtn.appendChild(this.createButtonRow(this.addSubsectionRow(iSection,iSub,iRow,subsection.subsectionrow,helplinkSubsection[iSub])));            
            mainDiv.append(mainDivSubsection,mainDivBtn);
        /* SET SUBSECTION HELPLINK ELEMENT */
        this.HelplinkSubSection[iSub].all=mainDiv;
        this.Link={
            main:mainDiv,
            row:mainDivSubsection,
            button:mainDivBtn
        };
        //return mainDiv;
        //return Link;
    }
    getHelpLink(){
        console.log('SubSection::getHelpLink()');
        return {
            /* FOR SHOW/HIDE */
            all:{},
            /* FOR ADD */
            dynamic:{},
            /* FOR REMOVE */
            row:{}
        };
    }
    createButtonRow(button){
        /*
         * ADD BUTTON ROW
         */
        var mainDiv=this.Html.getRow();
            mainDiv.classList.add('mt-2');
        var col=this.Html.getCol(2);
            /* ADD BUTTON */
            col.appendChild(button);
        var col1=this.Html.getCol(10);
            mainDiv.appendChild(col);
            mainDiv.appendChild(col1);
        return mainDiv;
    }
    addSubsectionRow(isection,isubsection,iRow,subsectionrow,helplink){
        /* console.log('ProjectStageCreate::addSubsectionRow()'); */
        var i=document.createElement('i');
            i.setAttribute('class','fa fa-plus');
            i.setAttribute("aria-hidden","true");
        var div=document.createElement('div');
            div.setAttribute('class','btn btn-success btn-add float-left');
            div.appendChild(i);
        /* SET CLASS OBJECT */
        var self=this;
            div.onclick=function(){       
                console.log('ProjectStageCreate::addSubsectionRow() onclick()');
                /* ADD NEW stageData subsectionrow object */
                subsectionrow[iRow]=self.StageData.createSubsectionRow(iRow);
                subsectionrow[iRow].paragraph.property.valuenewline=self.Property.subsectionRowNewLine;
                let StageRow=new Row(self.Html,self.Utilities,self.ProjectStageTool,self.TabStop,self.VariableList);
                    StageRow.setData(isection,isubsection,iRow,subsectionrow,helplink.row);
                    helplink.dynamic.appendChild(StageRow.getExtended());  
                /* INCREMENT SUBSECTION ROW */
                iRow++;
            };
        return (div);
    }
}

